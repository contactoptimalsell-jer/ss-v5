import type { VercelRequest, VercelResponse } from '@vercel/node';
import { canSendEmail, recordEmailSend, tryLockEmail } from './emailRateLimit.js';
import { setQuizTokenData } from './quizTokenStorage.js';
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prospects, category, sector } = req.body;

  if (!prospects || !Array.isArray(prospects) || prospects.length === 0) {
    return res.status(400).json({ error: 'Liste de prospects requise' });
  }

  // Limiter à 50 envois par batch pour éviter les timeouts
  const maxBatchSize = 50;
  const prospectsToProcess = prospects.slice(0, maxBatchSize);

  let sent = 0;
  let failed = 0;
  const results: Array<{ email: string; success: boolean; error?: string }> = [];

  // Configuration du transporteur email
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Traiter chaque prospect
  for (const prospect of prospectsToProcess) {
    const { email, companyName, name } = prospect as ProspectEmail;

    if (!email || !email.includes('@') || !companyName) {
      failed++;
      results.push({ email: email || 'unknown', success: false, error: 'Données invalides' });
      continue;
    }

    try {
      // Vérifier le rate limiting
      const rateLimitCheck = await canSendEmail(email);
      if (!rateLimitCheck.canSend) {
        failed++;
        results.push({ email, success: false, error: 'Rate limit' });
        continue;
      }

      // Verrouiller l'email
      const lockResult = await tryLockEmail(email);
      if (!lockResult.success) {
        failed++;
        results.push({ email, success: false, error: 'Email déjà verrouillé' });
        continue;
      }

      // Générer un token unique pour ce quiz
      const token = generateSecureToken();
      const quizUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://skillshield.app'}/quiz/${token}`;

      // Stocker les données du quiz
      await setQuizTokenData(token, {
        email,
        prospectName: name || companyName,
        prospectProblem: `Entreprise dans le secteur ${sector}, catégorie ${category}`,
        companyName,
        category,
        sector,
        createdAt: new Date().toISOString(),
      });

      // Enregistrer l'envoi
      await recordEmailSend(email);

      // Construire le nom d'affichage
      const displayName = name || companyName;

      // Envoyer l'email
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
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
              .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎯 Quiz Personnalisé SkillShield AI</h1>
              </div>
              <div class="content">
                <p>Bonjour ${displayName},</p>
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
              </div>
              <div class="footer">
                <p>SkillShield AI - Implémentation IA avec Gardien Humain</p>
                <p>Si vous n'avez pas demandé ce quiz, vous pouvez ignorer cet email.</p>
              </div>
            </div>
          </body>
          </html>
        `,
        text: `
Bonjour ${displayName},

Nous avons préparé un quiz personnalisé pour vous aider à identifier les opportunités d'automatisation dans votre entreprise ${companyName}.

Commencer le quiz : ${quizUrl}

Ce lien est unique et personnel. Il expire dans 30 jours.

SkillShield AI - Implémentation IA avec Gardien Humain
        `,
      });

      sent++;
      results.push({ email, success: true });
      console.log(`✅ Quiz sent to ${email} (${companyName})`);
    } catch (error: any) {
      failed++;
      results.push({ email, success: false, error: error.message || 'Erreur inconnue' });
      console.error(`❌ Error sending quiz to ${email}:`, error);
    }
  }

  console.log(`📊 Bulk quiz results: ${sent} sent, ${failed} failed`);

  return res.status(200).json({
    success: true,
    sent,
    failed,
    total: prospectsToProcess.length,
    results,
  });
}

