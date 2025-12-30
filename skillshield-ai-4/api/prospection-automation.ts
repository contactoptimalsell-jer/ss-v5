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
      // Vérifier le rate limiting avant d'envoyer
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

// ===== FONCTIONS DE PROSPECTION UNIQUE =====
// Emails autorisés UNIQUEMENT
const ALLOWED_EMAIL_PATTERNS = [
  'contact@',
  'info@',
  'partenariat@',
  'communication@',
  'hello@',
  'support@'
];

// Pages à analyser
const CONTACT_PAGES = [
  '/contact',
  '/contactez-nous',
  '/nous-contacter',
  '/mentions-legales',
  '/mentions-légales',
  '/partenaires',
  '/partenariat'
];

function extractCompanyNameFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.replace('www.', '');
    const domain = hostname.split('.')[0];
    // Capitaliser la première lettre et mettre le reste en minuscule
    return domain.charAt(0).toUpperCase() + domain.slice(1).toLowerCase();
  } catch {
    return 'Entreprise';
  }
}

function extractAllowedEmails(html: string): string[] {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const allEmails = html.match(emailRegex) || [];
  
  return allEmails
    .map(email => email.toLowerCase().trim())
    .filter(email => {
      const isAllowed = ALLOWED_EMAIL_PATTERNS.some(pattern => email.includes(pattern));
      const emailLocalPart = email.split('@')[0];
      const isNominal = emailLocalPart.includes('.') && emailLocalPart.length > 10;
      const excludePatterns = [
        'example@', 'test@', 'noreply@', 'no-reply@', 'donotreply@',
        'webmaster@', 'postmaster@', 'abuse@', 'privacy@', 'legal@'
      ];
      const isExcluded = excludePatterns.some(pattern => email.includes(pattern));
      return isAllowed && !isNominal && !isExcluded;
    })
    .filter((email, index, self) => self.indexOf(email) === index);
}

async function analyzePage(url: string): Promise<{ html: string; emails: string[]; companyName: string; sector?: string }> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();
    const emails = extractAllowedEmails(html);
    
    // Utiliser Gemini AI pour extraire le nom et le secteur précis
    const geminiApiKey = process.env.GEMINI_API_KEY || process.env.DefaultGeminiAPIKey;
    
    if (geminiApiKey) {
      try {
        // Nettoyer le HTML
        const cleanHtml = html
          .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
          .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
        
        const cleanText = cleanHtml.substring(0, 5000);

        const prompt = `Tu es un assistant expert en analyse de pages web professionnelles.

Analyse cette page web et extrais:
1. Le nom officiel et complet de l'entreprise
2. Le secteur d'activité PRÉCIS (ex: "Immobilier - Agence immobilière", "E-commerce - Vente de vêtements", "Restauration - Restaurant gastronomique", "BTP - Maçonnerie", etc.)

URL: ${url}
Contenu: ${cleanText}

Retourne UNIQUEMENT du JSON valide avec cette structure:
{
  "companyName": "Nom officiel complet de l'entreprise",
  "sector": "Secteur d'activité précis et détaillé"
}

Important:
- Le nom doit être le nom officiel complet de l'entreprise
- Le secteur doit être précis et détaillé (ex: "Immobilier - Agence immobilière à Lyon" plutôt que juste "Immobilier")
- Si le secteur n'est pas identifiable, retourne "Non spécifié"`;

        const aiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          }),
        });

        if (aiResponse.ok) {
          const aiData = await aiResponse.json();
          const aiContent = aiData.candidates?.[0]?.content?.parts?.[0]?.text || '';
          
          // Parser la réponse JSON
          const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            try {
              const parsed = JSON.parse(jsonMatch[0]);
              if (parsed && typeof parsed === 'object') {
                let companyName = typeof parsed.companyName === 'string' && parsed.companyName.trim()
                  ? parsed.companyName.trim()
                  : (html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.split('|')[0]?.split('-')[0]?.trim() || extractCompanyNameFromUrl(url));
                
                // Nettoyer le nom : enlever les extensions de domaine si présentes
                companyName = companyName.replace(/\.(fr|com|net|org|eu)$/i, '').trim();
                
                const sector = typeof parsed.sector === 'string' && parsed.sector.trim() && parsed.sector !== 'Non spécifié'
                  ? parsed.sector.trim()
                  : undefined;

                console.log(`✅ Analyse IA: ${companyName} - ${sector || 'Secteur non détecté'}`);
                
                return { html, emails, companyName, sector };
              }
            } catch (parseError) {
              console.warn('⚠️ Erreur parsing réponse IA, utilisation du fallback');
            }
          }
        }
      } catch (aiError: any) {
        console.warn('⚠️ Erreur analyse IA:', aiError.message);
      }
    }

    // Fallback: extraction basique
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const companyName = titleMatch 
      ? titleMatch[1].split('|')[0].split('-')[0].trim()
      : extractCompanyNameFromUrl(url);

    return { html, emails, companyName };
  } catch (error: any) {
    throw new Error(`Erreur lors de l'analyse de ${url}: ${error.message}`);
  }
}

async function findContactEmail(site: string): Promise<{ email: string; companyName: string; sector?: string }> {
  const baseUrl = site.startsWith('http') ? site : `https://${site}`;
  const urlObj = new URL(baseUrl);
  const baseDomain = `${urlObj.protocol}//${urlObj.hostname}`;

  let result = await analyzePage(baseUrl);
  let companyName = result.companyName;
  let sector = result.sector;

  if (result.emails.length > 0) {
    return { email: result.emails[0], companyName, sector };
  }

  for (const page of CONTACT_PAGES) {
    try {
      const contactUrl = `${baseDomain}${page}`;
      result = await analyzePage(contactUrl);
      if (result.emails.length > 0) {
        return { 
          email: result.emails[0], 
          companyName: result.companyName || companyName,
          sector: result.sector || sector
        };
      }
      // Mettre à jour le secteur si trouvé
      if (result.sector && !sector) {
        sector = result.sector;
      }
    } catch {
      continue;
    }
  }

  return { email: '', companyName, sector };
}

async function generatePersonalizedMessage(companyName: string, site: string, sector?: string): Promise<string> {
  const geminiApiKey = process.env.GEMINI_API_KEY || process.env.DefaultGeminiAPIKey;
  
  if (!geminiApiKey) {
    const emotionalPhrases = [
      'Chaque jour, des heures précieuses sont perdues dans des tâches répétitives qui pourraient être automatisées.',
      'La complexité croissante de la gestion quotidienne peut devenir un frein à votre croissance.',
      'Ne pas automatiser aujourd\'hui, c\'est risquer de prendre du retard sur vos concurrents qui ont déjà fait le pas.'
    ];
    const randomEmotional = emotionalPhrases[Math.floor(Math.random() * emotionalPhrases.length)];
    const sectorContext = sector ? ` dans le secteur ${sector}` : '';
    return `Bonjour,

${randomEmotional}

Nous sommes SkillShield AI, spécialisés dans l'implémentation d'IA avec gardien humain pour les entreprises${sectorContext} comme ${companyName}.

Notre solution permet d'automatiser vos processus répétitifs tout en conservant le contrôle humain, vous faisant gagner 10-20h par semaine avec un ROI de 300-520% en 12 mois.

Seriez-vous intéressé par un audit gratuit de votre potentiel d'automatisation ?

Si ce message ne vous concerne pas ou si vous ne souhaitez plus être contacté, faites-le nous savoir et nous supprimerons vos coordonnées.

Cordialement,
L'équipe SkillShield AI`;
  }

  try {
    const sectorInfo = sector ? `\n- Secteur d'activité: ${sector}` : '';
    const prompt = `Tu es un assistant de prospection B2B professionnel.

Génère un message personnalisé pour cette entreprise:
- Nom: ${companyName}
- Site: ${site}${sectorInfo}

CONTRAINTES STRICTES:
1. Ton B2B professionnel, humain, clair, respectueux
2. Inclure UNE phrase émotionnelle adaptée au secteur ${sector ? `(${sector})` : ''} sur: le temps perdu, la complexité, ou la peur de rater une opportunité
3. Personnaliser le message en fonction du secteur d'activité si fourni
4. Mentionner des exemples concrets d'automatisation adaptés au secteur si possible
5. Pas de promesse mensongère
6. Pas de pression commerciale
7. Mention légale OBLIGATOIRE: "Si ce message ne vous concerne pas ou si vous ne souhaitez plus être contacté, faites-le nous savoir et nous supprimerons vos coordonnées."

Retourne UNIQUEMENT le message, sans formatage supplémentaire.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      }),
    });

    if (!response.ok) throw new Error(`Gemini API error: ${response.status}`);

    const responseText = await response.text();
    const data = JSON.parse(responseText);
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    if (content && content.trim().length > 50) {
      if (!content.includes('supprimerons') && !content.includes('ne souhaitez plus')) {
        return content.trim() + '\n\nSi ce message ne vous concerne pas ou si vous ne souhaitez plus être contacté, faites-le nous savoir et nous supprimerons vos coordonnées.';
      }
      return content.trim();
    }
  } catch (error: any) {
    console.error('Erreur génération message IA:', error.message);
  }

  // Retourner le message par défaut en cas d'erreur
  const emotionalPhrases = [
    'Chaque jour, des heures précieuses sont perdues dans des tâches répétitives qui pourraient être automatisées.',
    'La complexité croissante de la gestion quotidienne peut devenir un frein à votre croissance.',
    'Ne pas automatiser aujourd\'hui, c\'est risquer de prendre du retard sur vos concurrents qui ont déjà fait le pas.'
  ];
  const randomEmotional = emotionalPhrases[Math.floor(Math.random() * emotionalPhrases.length)];
  return `Bonjour,

${randomEmotional}

Nous sommes SkillShield AI, spécialisés dans l'implémentation d'IA avec gardien humain pour les entreprises comme ${companyName}.

Notre solution permet d'automatiser vos processus répétitifs tout en conservant le contrôle humain, vous faisant gagner 10-20h par semaine avec un ROI de 300-520% en 12 mois.

Seriez-vous intéressé par un audit gratuit de votre potentiel d'automatisation ?

Si ce message ne vous concerne pas ou si vous ne souhaitez plus être contacté, faites-le nous savoir et nous supprimerons vos coordonnées.

Cordialement,
L'équipe SkillShield AI`;
}

async function handleSingleProspecting(req: VercelRequest, res: VercelResponse, site: string) {
  if (!site || typeof site !== 'string') {
    return res.status(400).json({ 
      error: 'Un seul site web doit être fourni',
      message: 'Veuillez fournir UN site web à analyser. Le traitement en masse n\'est pas autorisé pour des raisons légales.'
    });
  }

  let normalizedSite = site.trim();
  if (!normalizedSite.startsWith('http://') && !normalizedSite.startsWith('https://')) {
    normalizedSite = `https://${normalizedSite}`;
  }

  try {
    new URL(normalizedSite);
  } catch {
    return res.status(400).json({ 
      error: 'URL invalide',
      message: 'Veuillez fournir une URL valide (ex: example.com ou https://example.com)'
    });
  }

  console.log(`🔍 Analyse d'UN site: ${normalizedSite}`);

  try {
    const { email, companyName, sector } = await findContactEmail(normalizedSite);

    if (!email) {
      return res.status(200).json({
        entreprise_nom: companyName || extractCompanyNameFromUrl(normalizedSite),
        site: normalizedSite,
        email: '',
        message_personnalise: 'Email non trouvé – prospection manuelle requise'
      });
    }

    const message = await generatePersonalizedMessage(companyName, normalizedSite, sector);

    return res.status(200).json({
      entreprise_nom: companyName || extractCompanyNameFromUrl(normalizedSite),
      secteur: sector || undefined,
      site: normalizedSite,
      email: email,
      message_personnalise: message
    });
  } catch (error: any) {
    console.error('❌ Erreur prospection:', error);
    return res.status(500).json({ 
      error: 'Erreur lors de l\'analyse',
      message: error.message 
    });
  }
}
// ===== FIN FONCTIONS DE PROSPECTION UNIQUE =====

// ===== FONCTIONS DE PROSPECTION MULTIPLE =====
// Fonction pour extraire les liens de sites depuis une page
async function extractSiteLinksFromPage(url: string): Promise<string[]> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();
    const siteLinks: string[] = [];
    
    // Extraire tous les liens href
    const linkRegex = /<a[^>]+href=["']([^"']+)["'][^>]*>/gi;
    const matches = [...html.matchAll(linkRegex)];
    
    const baseUrl = new URL(url);
    
    for (const match of matches) {
      const href = match[1];
      if (!href) continue;
      
      try {
        // Résoudre l'URL relative ou absolue
        const absoluteUrl = new URL(href, baseUrl);
        const hostname = absoluteUrl.hostname;
        
        // Ignorer les liens internes (même domaine)
        if (hostname === baseUrl.hostname) continue;
        
        // Ignorer les liens non-HTTP(S)
        if (!absoluteUrl.protocol.startsWith('http')) continue;
        
        // Ignorer les liens vers des services externes (mailto, tel, etc.)
        if (hostname.includes('facebook.com') || 
            hostname.includes('twitter.com') || 
            hostname.includes('linkedin.com') ||
            hostname.includes('instagram.com') ||
            hostname.includes('youtube.com') ||
            hostname.includes('google.com') ||
            hostname.includes('maps.google')) continue;
        
        // Normaliser l'URL (enlever www, trailing slash)
        const normalizedUrl = `${absoluteUrl.protocol}//${hostname.replace(/^www\./, '')}`;
        
        // Éviter les doublons
        if (!siteLinks.includes(normalizedUrl)) {
          siteLinks.push(normalizedUrl);
        }
      } catch {
        // Ignorer les URLs invalides
        continue;
      }
    }
    
    // Limiter à 20 sites maximum pour éviter la surcharge
    return siteLinks.slice(0, 20);
  } catch (error: any) {
    throw new Error(`Erreur lors de l'extraction des liens: ${error.message}`);
  }
}

// Fonction pour analyser plusieurs sites
async function handleMultipleProspecting(req: VercelRequest, res: VercelResponse, site: string) {
  if (!site || typeof site !== 'string') {
    return res.status(400).json({ 
      error: 'URL invalide',
      message: 'Veuillez fournir l\'URL d\'une page contenant des liens vers des sites d\'entreprises.'
    });
  }

  let normalizedSite = site.trim();
  if (!normalizedSite.startsWith('http://') && !normalizedSite.startsWith('https://')) {
    normalizedSite = `https://${normalizedSite}`;
  }

  try {
    new URL(normalizedSite);
  } catch {
    return res.status(400).json({ 
      error: 'URL invalide',
      message: 'Veuillez fournir une URL valide (ex: annuaire-exemple.fr/liste ou https://example.com/annuaire)'
    });
  }

  console.log(`🔍 Analyse de plusieurs sites depuis: ${normalizedSite}`);

  try {
    // Étape 1: Extraire tous les liens de sites
    const siteLinks = await extractSiteLinksFromPage(normalizedSite);
    
    if (siteLinks.length === 0) {
      return res.status(200).json([]);
    }

    console.log(`📋 ${siteLinks.length} site(s) trouvé(s), analyse en cours...`);

    // Étape 2: Analyser chaque site individuellement
    const results = [];
    
    for (const siteUrl of siteLinks) {
      try {
        const { email, companyName, sector } = await findContactEmail(siteUrl);
        
        if (email) {
          const message = await generatePersonalizedMessage(companyName, siteUrl, sector);
          
          results.push({
            entreprise_nom: companyName || extractCompanyNameFromUrl(siteUrl),
            secteur: sector || undefined,
            site: siteUrl,
            email: email,
            message_personnalise: message
          });
        } else {
          // Inclure quand même les sites sans email trouvé (pour information)
          results.push({
            entreprise_nom: companyName || extractCompanyNameFromUrl(siteUrl),
            secteur: sector || undefined,
            site: siteUrl,
            email: '',
            message_personnalise: 'Email non trouvé – prospection manuelle requise'
          });
        }
        
        // Pause entre chaque analyse pour éviter la surcharge
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error: any) {
        console.error(`❌ Erreur analyse ${siteUrl}:`, error.message);
        // Continuer avec les autres sites même en cas d'erreur
      }
    }

    console.log(`✅ Analyse terminée: ${results.filter(r => r.email).length} email(s) trouvé(s) sur ${results.length} site(s)`);

    return res.status(200).json(results);
  } catch (error: any) {
    console.error('❌ Erreur prospection multiple:', error);
    return res.status(500).json({ 
      error: 'Erreur lors de l\'analyse',
      message: error.message 
    });
  }
}
// ===== FIN FONCTIONS DE PROSPECTION MULTIPLE =====

// Signature d'email SkillShield
const EMAIL_SIGNATURE = `
---
SkillShield AI
Implémentation IA avec Gardien Humain
📧 contact@skillshield-ai.com
🌐 https://skillshield.app
`;

// Fonction pour envoyer un email de prospection (simple ou quiz)
async function sendProspectionEmail(
  email: string,
  companyName: string,
  site: string,
  emailType: 'simple' | 'quiz',
  message?: string
): Promise<{ success: boolean; quizUrl?: string }> {
  // Vérifier la configuration SMTP
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = parseInt(process.env.SMTP_PORT || '587');

  console.log(`📧 [sendProspectionEmail] Configuration SMTP:`);
  console.log(`   - Host: ${smtpHost}`);
  console.log(`   - Port: ${smtpPort}`);
  console.log(`   - User: ${smtpUser ? smtpUser.substring(0, 5) + '...' : 'NON CONFIGURÉ'}`);
  console.log(`   - Pass: ${smtpPass ? '***' : 'NON CONFIGURÉ'}`);
  console.log(`   - Email type: ${emailType}`);
  console.log(`   - To: ${email}`);
  console.log(`   - From: contact@skillshield-ai.com`);

  if (!smtpUser || !smtpPass) {
    throw new Error('Configuration SMTP manquante. Veuillez configurer SMTP_USER et SMTP_PASS dans Vercel Dashboard → Settings → Environment Variables');
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: false,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  if (emailType === 'simple') {
    const emailMessage = message || `Bonjour,

Chaque jour, des heures précieuses sont perdues dans des tâches répétitives qui pourraient être automatisées.

Nous sommes SkillShield AI, spécialisés dans l'implémentation d'IA avec gardien humain pour les entreprises comme ${companyName}.

Notre solution permet d'automatiser vos processus répétitifs tout en conservant le contrôle humain, vous faisant gagner 10-20h par semaine avec un ROI de 300-520% en 12 mois.

Seriez-vous intéressé par un audit gratuit de votre potentiel d'automatisation ?

Si ce message ne vous concerne pas ou si vous ne souhaitez plus être contacté, faites-le nous savoir et nous supprimerons vos coordonnées.

Cordialement,
L'équipe SkillShield AI`;

    console.log(`📤 [sendProspectionEmail] Envoi email simple à ${email}...`);
    
    try {
      const result = await transporter.sendMail({
        from: '"SkillShield AI" <contact@skillshield-ai.com>',
        to: email,
        subject: `🎯 Automatisation IA pour ${companyName} - Gagnez 10-20h par semaine`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 10px; }
            .opt-out { background: #fff3cd; padding: 15px; border-radius: 5px; margin-top: 20px; border-left: 4px solid #ffc107; font-size: 12px; color: #856404; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 14px; }
            .footer a { color: #667eea; text-decoration: none; font-weight: 600; }
            .footer a:hover { text-decoration: underline; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="content">
              <p style="white-space: pre-line;">${emailMessage.replace(/\n/g, '<br>')}</p>
              <div class="opt-out">
                <p><strong>🔔 Désinscription</strong></p>
                <p>Si vous ne souhaitez plus recevoir nos communications, répondez à cet email avec "DÉSINSCRIPTION" et nous supprimerons vos coordonnées.</p>
              </div>
              <div class="footer">
                <p>Découvrez SkillShield AI : <a href="https://skillshield.app" target="_blank">https://skillshield.app</a></p>
                <p style="font-size: 12px; margin-top: 10px; color: #999;">SkillShield AI - Implémentation IA avec Gardien Humain</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `${emailMessage}${EMAIL_SIGNATURE}`,
      });

      console.log(`✅ [sendProspectionEmail] Email simple envoyé avec succès:`, {
        messageId: result.messageId,
        accepted: result.accepted,
        rejected: result.rejected,
      });

      return { success: true };
    } catch (error: any) {
      console.error(`❌ [sendProspectionEmail] Erreur envoi email simple:`, error);
      throw new Error(`Erreur lors de l'envoi de l'email: ${error.message}`);
    }
  } else {
    // Envoi du quiz complet
    const token = generateSecureToken();
    const quizUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://skillshield.app'}/quiz/${token}`;
    const optOutUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://skillshield.app'}/opt-out?email=${encodeURIComponent(email)}&token=${token}`;

    await setQuizTokenData(token, {
      token,
      prospectName: companyName,
      prospectEmail: email,
      prospectProblem: `Entreprise: ${companyName} - Site: ${site}`,
      createdAt: new Date().toISOString(),
      opened: false,
      completed: false,
    });

    console.log(`📤 [sendProspectionEmail] Envoi email quiz à ${email}...`);
    console.log(`   - Quiz URL: ${quizUrl}`);
    console.log(`   - Token: ${token}`);
    
    try {
      const result = await transporter.sendMail({
        from: '"SkillShield AI" <contact@skillshield-ai.com>',
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
            .opt-out { background: #fff3cd; padding: 15px; border-radius: 5px; margin-top: 20px; border-left: 4px solid #ffc107; font-size: 12px; color: #856404; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 14px; }
            .footer a { color: #667eea; text-decoration: none; font-weight: 600; }
            .footer a:hover { text-decoration: underline; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎯 Quiz Personnalisé SkillShield AI</h1>
            </div>
            <div class="content">
              <p>Bonjour,</p>
              <p>Nous avons préparé un <strong>quiz personnalisé</strong> pour vous aider à identifier les opportunités d'automatisation dans votre entreprise <strong>${companyName}</strong>.</p>
              <p>Ce quiz vous permettra de :</p>
              <ul>
                <li>✅ Découvrir votre potentiel d'automatisation</li>
                <li>✅ Identifier les processus à optimiser</li>
                <li>✅ Recevoir des recommandations personnalisées</li>
              </ul>
              <p style="text-align: center;">
                <a href="${quizUrl}" class="button">Commencer le Quiz</a>
              </p>
              <p><small>Ce lien est unique et personnel. Il expire dans 30 jours.</small></p>
              <div class="opt-out">
                <p><strong>🔔 Désinscription</strong></p>
                <p>Si vous ne souhaitez plus recevoir nos communications, vous pouvez vous désinscrire à tout moment :</p>
                <p style="text-align: center;">
                  <a href="${optOutUrl}" style="color: #856404; text-decoration: underline;">Me désinscrire de cette liste</a>
                </p>
                <p style="font-size: 11px; margin-top: 10px;">
                  Conformément au RGPD, vous avez le droit de vous opposer au traitement de vos données personnelles.
                </p>
              </div>
              <div class="footer">
                <p>Découvrez SkillShield AI : <a href="https://skillshield.app" target="_blank">https://skillshield.app</a></p>
                <p style="font-size: 12px; margin-top: 10px; color: #999;">SkillShield AI - Implémentation IA avec Gardien Humain</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Bonjour,

Nous avons préparé un quiz personnalisé pour vous aider à identifier les opportunités d'automatisation dans votre entreprise ${companyName}.

Commencer le quiz : ${quizUrl}

Ce lien est unique et personnel. Il expire dans 30 jours.

🔔 Désinscription
Si vous ne souhaitez plus recevoir nos communications :
${optOutUrl}

Conformément au RGPD, vous avez le droit de vous opposer au traitement de vos données personnelles.
${EMAIL_SIGNATURE}
      `,
      });

      console.log(`✅ [sendProspectionEmail] Email quiz envoyé avec succès:`, {
        messageId: result.messageId,
        accepted: result.accepted,
        rejected: result.rejected,
        quizUrl,
      });

      return { success: true, quizUrl };
    } catch (error: any) {
      console.error(`❌ [sendProspectionEmail] Erreur envoi email quiz:`, error);
      throw new Error(`Erreur lors de l'envoi de l'email quiz: ${error.message}`);
    }
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action, category, sector, prospects, mode, site, email, companyName, emailType, message } = req.body;

  // Mode prospection unique (UNE entreprise à la fois)
  if (mode === 'single' && site) {
    return handleSingleProspecting(req, res, site);
  }

  // Mode prospection multiple (analyse d'une page contenant plusieurs liens)
  if (mode === 'multiple' && site) {
    return handleMultipleProspecting(req, res, site);
  }

  // Mode génération de message personnalisé (sans analyse de site)
  if (mode === 'generate-message' && email && companyName) {
    const { sector } = req.body;
    console.log(`🚀 [prospection-automation] Mode generate-message activé`);
    console.log(`   - Email: ${email}`);
    console.log(`   - Company: ${companyName}`);
    console.log(`   - Sector: ${sector || 'Non spécifié'}`);
    
    try {
      const message = await generatePersonalizedMessage(companyName, '', sector);
      return res.status(200).json({
        success: true,
        message: message,
      });
    } catch (error: any) {
      console.error('❌ [prospection-automation] Erreur génération message:', error);
      return res.status(500).json({
        success: false,
        error: 'Erreur lors de la génération du message',
        message: error.message,
      });
    }
  }

  // Mode envoi email de prospection
  if (mode === 'send-email' && email && companyName && emailType) {
    console.log(`🚀 [prospection-automation] Mode send-email activé`);
    console.log(`   - Email: ${email}`);
    console.log(`   - Company: ${companyName}`);
    console.log(`   - Type: ${emailType}`);
    
    try {
      const result = await sendProspectionEmail(email, companyName, site || '', emailType, message);
      console.log(`✅ [prospection-automation] Email envoyé avec succès`);
      return res.status(200).json({
        success: true,
        message: 'Email envoyé avec succès',
        type: emailType,
        quizUrl: result.quizUrl,
      });
    } catch (error: any) {
      console.error('❌ [prospection-automation] Erreur envoi email prospection:', error);
      return res.status(500).json({
        success: false,
        error: 'Erreur lors de l\'envoi de l\'email',
        message: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      });
    }
  }

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

