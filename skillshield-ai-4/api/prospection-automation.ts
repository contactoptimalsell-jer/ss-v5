import type { VercelRequest, VercelResponse } from '@vercel/node';
import { canSendEmail, recordEmailSend, tryLockEmail } from '../utils/emailRateLimit.js';
import { setQuizTokenData, getQuizTokenData } from '../utils/quizTokenStorage.js';
import { randomBytes } from 'crypto';
import nodemailer from 'nodemailer';

function generateSecureToken(): string {
  return randomBytes(32).toString('hex');
}

interface ProspectEmail {
  email: string;
  companyName: string;
  name?: string;
}

// Fonction pour rechercher des emails via Grok
async function searchEmailsViaGrok(category: string, sector: string): Promise<ProspectEmail[]> {
  const grokApiKey = process.env.GROK_API_KEY;
  
  if (!grokApiKey) {
    throw new Error('GROK_API_KEY not configured');
  }

  const prompt = `Tu es un assistant expert en recherche d'entreprises et de contacts professionnels.

Tâche : Trouve des emails d'entreprises françaises dans la catégorie "${category}" et le secteur "${sector}".

Instructions :
1. Recherche des entreprises françaises correspondant à ces critères
2. Pour chaque entreprise, trouve l'email de contact principal (généralement contact@, info@, ou email du dirigeant)
3. Retourne les résultats au format JSON strict avec cette structure :
{
  "emails": [
    {
      "email": "email@entreprise.com",
      "companyName": "Nom de l'entreprise",
      "name": "Nom du contact (optionnel)"
    }
  ]
}

Important :
- Retourne UNIQUEMENT du JSON valide, sans texte avant ou après
- Limite à 10-15 entreprises maximum
- Assure-toi que les emails sont valides et pertinents
- Focus sur des entreprises françaises réelles`;

  const grokResponse = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${grokApiKey}`,
    },
    body: JSON.stringify({
      model: 'grok-beta',
      messages: [
        {
          role: 'system',
          content: 'Tu es un assistant expert en recherche d\'entreprises et de contacts professionnels. Tu retournes toujours du JSON valide.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    }),
  });

  if (!grokResponse.ok) {
    const errorData = await grokResponse.text();
    throw new Error(`Grok API error: ${errorData}`);
  }

  const grokData = await grokResponse.json();
  const content = grokData.choices?.[0]?.message?.content || '';

  let emails: ProspectEmail[] = [];
  
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      emails = parsed.emails || [];
    } else {
      const parsed = JSON.parse(content);
      emails = parsed.emails || [];
    }
  } catch (parseError) {
    const emailRegex = /[\w\.-]+@[\w\.-]+\.\w+/g;
    const foundEmails = content.match(emailRegex) || [];
    
    emails = foundEmails.slice(0, 10).map((email, index) => ({
      email: email.toLowerCase(),
      companyName: `Entreprise ${index + 1} - ${sector}`,
    }));
  }

  return emails
    .filter((p: ProspectEmail) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(p.email) && p.companyName;
    })
    .slice(0, 15);
}

// Fonction pour envoyer les quiz en masse
async function sendBulkQuizzes(
  prospects: ProspectEmail[],
  category: string,
  sector: string
): Promise<{ sent: number; failed: number; results: Array<{ email: string; success: boolean; error?: string }> }> {
  const maxBatchSize = 50;
  const prospectsToProcess = prospects.slice(0, maxBatchSize);

  let sent = 0;
  let failed = 0;
  const results: Array<{ email: string; success: boolean; error?: string }> = [];

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  for (const prospect of prospectsToProcess) {
    const { email, companyName, name } = prospect;

    if (!email || !email.includes('@') || !companyName) {
      failed++;
      results.push({ email: email || 'unknown', success: false, error: 'Données invalides' });
      continue;
    }

    try {
      // Vérifier l'opt-out RGPD avant d'envoyer
      const tokenData = await getQuizTokenData(token);
      if (tokenData?.optOut) {
        console.log(`🔔 Email ${email} a opt-out, skip`);
        failed++;
        results.push({ email, success: false, error: 'Opt-out RGPD' });
        continue;
      }

      const rateLimitCheck = await canSendEmail(email);
      if (!rateLimitCheck.canSend) {
        failed++;
        results.push({ email, success: false, error: 'Rate limit' });
        continue;
      }

      const lockResult = await tryLockEmail(email);
      if (!lockResult.success) {
        failed++;
        results.push({ email, success: false, error: 'Email déjà verrouillé' });
        continue;
      }

      const token = generateSecureToken();
      const quizUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://skillshield.app'}/quiz/${token}`;

      await setQuizTokenData(token, {
        token,
        prospectName: name || companyName,
        prospectEmail: email,
        prospectProblem: `Entreprise dans le secteur ${sector}, catégorie ${category}`,
        createdAt: new Date().toISOString(),
        opened: false,
        completed: false,
      });

      await recordEmailSend(email);

      const displayName = name || companyName;

      // URL d'opt-out (à implémenter selon votre système)
      const optOutUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://skillshield.app'}/opt-out?email=${encodeURIComponent(email)}&token=${token}`;

      await transporter.sendMail({
        from: `"SkillShield AI" <${process.env.SMTP_USER}>`,
        to: email,
        subject: `🎯 Quiz Personnalisé pour ${companyName} - Découvrez votre potentiel d'automatisation`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: 600; }
              .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; border-top: 1px solid #ddd; padding-top: 20px; }
              .opt-out { background: #fff3cd; padding: 15px; border-radius: 5px; margin-top: 20px; border-left: 4px solid #ffc107; }
              .opt-out-link { color: #856404; text-decoration: underline; }
              .associative { background: #e7f3ff; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #2196F3; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎯 Quiz Personnalisé SkillShield AI</h1>
              </div>
              <div class="content">
                <p>Bonjour ${displayName},</p>
                
                <div class="associative">
                  <p><strong>💡 Message associatif</strong></p>
                  <p>Nous sommes une communauté d'entrepreneurs qui partageons des outils et bonnes pratiques pour améliorer l'efficacité de nos entreprises grâce à l'intelligence artificielle.</p>
                  <p>Votre entreprise <strong>${companyName}</strong> a été identifiée comme potentiellement intéressée par nos solutions d'automatisation professionnelle.</p>
                </div>

                <p>Nous avons préparé un <strong>quiz personnalisé</strong> pour vous aider à identifier les opportunités d'automatisation dans votre entreprise.</p>
                <p>Ce quiz vous permettra de :</p>
                <ul>
                  <li>✅ Découvrir votre potentiel d'automatisation</li>
                  <li>✅ Identifier les processus à optimiser</li>
                  <li>✅ Recevoir des recommandations personnalisées</li>
                </ul>
                <p style="text-align: center;">
                  <a href="${quizUrl}" class="button">Commencer le Quiz</a>
                </p>
                </p>

                <div class="opt-out">
                  <p><strong>🔔 Désinscription</strong></p>
                  <p>Si vous ne souhaitez plus recevoir nos communications, vous pouvez vous désinscrire à tout moment en cliquant sur ce lien :</p>
                  <p style="text-align: center;">
                    <a href="${optOutUrl}" class="opt-out-link">Me désinscrire de cette liste</a>
                  </p>
                  <p style="font-size: 11px; margin-top: 10px; color: #666;">
                    Conformément au RGPD, vous avez le droit de vous opposer au traitement de vos données personnelles.
                  </p>
                </div>

                <p><small>Ce lien est unique et personnel. Il expire dans 30 jours.</small></p>
              </div>
              <div class="footer">
                <p><strong>SkillShield AI</strong> - Implémentation IA avec Gardien Humain</p>
                <p>📧 Contact: info@skillshield-ai.com</p>
                <p style="font-size: 11px; color: #999; margin-top: 10px;">
                  Cet email a été envoyé à ${email} car votre entreprise correspond à nos critères de prospection légale.
                  <br>Source: Liste d'entreprises partenaires / Annuaire professionnel
                </p>
              </div>
            </div>
          </body>
          </html>
        `,
        text: `
Bonjour ${displayName},

💡 Message associatif
Nous sommes une communauté d'entrepreneurs qui partageons des outils et bonnes pratiques pour améliorer l'efficacité de nos entreprises grâce à l'intelligence artificielle.

Votre entreprise ${companyName} a été identifiée comme potentiellement intéressée par nos solutions d'automatisation professionnelle.

Nous avons préparé un quiz personnalisé pour vous aider à identifier les opportunités d'automatisation dans votre entreprise.

Commencer le quiz : ${quizUrl}

🔔 Désinscription
Si vous ne souhaitez plus recevoir nos communications, vous pouvez vous désinscrire à tout moment :
${optOutUrl}

Conformément au RGPD, vous avez le droit de vous opposer au traitement de vos données personnelles.

Ce lien est unique et personnel. Il expire dans 30 jours.

SkillShield AI - Implémentation IA avec Gardien Humain
Contact: info@skillshield-ai.com
        `,
      });

      sent++;
      results.push({ email, success: true });
    } catch (error: any) {
      failed++;
      results.push({ email, success: false, error: error.message || 'Erreur inconnue' });
    }
  }

  return { sent, failed, results };
}

// Import des fonctions de prospection unique
import { analyzePage, findContactEmail, generatePersonalizedMessage } from './prospection-single-helpers.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action, category, sector, prospects, mode, site } = req.body;

  // Mode prospection unique (UNE entreprise à la fois)
  if (mode === 'single' && site) {
    return handleSingleProspecting(req, res, site);
  }

  const { action, category, sector, prospects } = req.body;

  try {
    if (action === 'search') {
      // Recherche d'emails via Grok
      if (!category || !sector) {
        return res.status(400).json({ error: 'Catégorie et secteur requis' });
      }

      const emails = await searchEmailsViaGrok(category, sector);
      
      return res.status(200).json({
        success: true,
        emails,
        count: emails.length,
      });
    } else if (action === 'send') {
      // Envoi en masse de quiz
      if (!prospects || !Array.isArray(prospects) || prospects.length === 0) {
        return res.status(400).json({ error: 'Liste de prospects requise' });
      }

      const results = await sendBulkQuizzes(prospects, category || '', sector || '');
      
      return res.status(200).json({
        success: true,
        ...results,
        total: prospects.length,
      });
    } else {
      return res.status(400).json({ error: 'Action invalide. Utilisez "search" ou "send"' });
    }
  } catch (error: any) {
    console.error('❌ Error in prospection-automation:', error);
    return res.status(500).json({
      error: error.message || 'Erreur lors de l\'opération',
    });
  }
}

