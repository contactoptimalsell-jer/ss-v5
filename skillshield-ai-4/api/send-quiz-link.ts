import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';
import { randomBytes } from 'crypto';
import { canSendEmail, recordEmailSend, tryLockEmail } from './emailRateLimit.js';
import { setQuizTokenData } from './quizTokenStorage.js';

function generateSecureToken(): string {
  return randomBytes(32).toString('hex');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, prospectName, prospectProblem } = req.body;

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'Email invalide' });
  }

  if (!prospectName || typeof prospectName !== 'string') {
    return res.status(400).json({ error: 'Nom du prospect requis' });
  }

  // Vérifier le rate limiting
  console.log(`🔍 [send-quiz-link] Checking rate limit for email: ${email}`);
  const rateLimitCheck = await canSendEmail(email);
  console.log(`📊 [send-quiz-link] Rate limit check result:`, rateLimitCheck);
  
  if (!rateLimitCheck.canSend) {
    console.log(`❌ [send-quiz-link] Rate limit exceeded, blocking silently`);
    return res.status(200).json({ 
      success: true,
      message: 'Quiz envoyé avec succès !' 
    });
  }
  
  // Verrouiller l'email
  console.log(`🔒 [send-quiz-link] Attempting to lock email: ${email}`);
  const lockResult = await tryLockEmail(email);
  if (!lockResult.success) {
    console.log(`❌ [send-quiz-link] Email already locked, blocking silently`);
    return res.status(200).json({ 
      success: true,
      message: 'Quiz envoyé avec succès !' 
    });
  }
  
  console.log(`✅ [send-quiz-link] Email locked successfully, proceeding with quiz link generation`);

  try {
    // Générer un token unique
    const token = generateSecureToken();
    const quizUrl = `https://skillshield.app/quiz/${token}`;

    // Stocker les informations du prospect
    await setQuizTokenData(token, {
      token,
      prospectName,
      prospectEmail: email,
      prospectProblem: prospectProblem || '',
      createdAt: new Date(),
      opened: false,
      completed: false,
    });

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

    // Contenu de l'email
    const emailSubject = `${prospectName}, découvrez vos solutions d'automatisation personnalisées`;
    
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f5f5f5;
            }
            .container {
              background-color: white;
              border-radius: 8px;
              padding: 30px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 20px;
              border-radius: 8px 8px 0 0;
              margin: -30px -30px 20px -30px;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
            }
            .content {
              margin: 20px 0;
            }
            .cta-button {
              display: inline-block;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 15px 30px;
              text-decoration: none;
              border-radius: 6px;
              font-weight: bold;
              margin: 20px 0;
              text-align: center;
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e0e0e0;
              text-align: center;
              color: #999;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎯 Quiz Personnalisé SkillShield AI</h1>
            </div>

            <div class="content">
              <p>Bonjour ${prospectName},</p>
              
              <p>Nous avons préparé un court quiz pour identifier <strong>exactement</strong> où vous perdez du temps chaque semaine et combien vous pourriez gagner en automatisation.</p>
              
              <p>En moins de 3 minutes, vous découvrirez :</p>
              <ul>
                <li><strong>Votre score d'automatisation</strong> : où vous en êtes aujourd'hui</li>
                <li><strong>Votre potentiel de gain de temps</strong> : combien d'heures vous pourriez libérer chaque semaine</li>
                <li><strong>Les automatisations prioritaires</strong> pour votre activité spécifique</li>
                <li><strong>Un plan personnalisé</strong> prêt pour votre rendez-vous</li>
              </ul>
              
              <p style="background-color: #f0f9ff; padding: 15px; border-radius: 6px; border-left: 4px solid #3b82f6; margin: 20px 0;">
                <strong>💡 Le saviez-vous ?</strong><br>
                Nos clients gagnent en moyenne <strong>10 à 15 heures par semaine</strong> grâce à leurs premières automatisations. Ce quiz vous montrera précisément votre potentiel.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${quizUrl}" class="cta-button">
                  Commencer le quiz (3 minutes)
                </a>
              </div>
              
              <p style="color: #666; font-size: 14px;">
                Ce lien est personnel et sécurisé. Il expire dans 7 jours.
              </p>
            </div>

            <div class="footer">
              <p>Email envoyé automatiquement par SkillShield AI</p>
              <p>Si vous n'avez pas demandé ce quiz, vous pouvez ignorer cet email.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const emailText = `
Bonjour ${prospectName},

Nous avons préparé un court quiz pour identifier EXACTEMENT où vous perdez du temps chaque semaine et combien vous pourriez gagner en automatisation.

En moins de 3 minutes, vous découvrirez :
- Votre score d'automatisation : où vous en êtes aujourd'hui
- Votre potentiel de gain de temps : combien d'heures vous pourriez libérer chaque semaine
- Les automatisations prioritaires pour votre activité spécifique
- Un plan personnalisé prêt pour votre rendez-vous

💡 Le saviez-vous ?
Nos clients gagnent en moyenne 10 à 15 heures par semaine grâce à leurs premières automatisations. Ce quiz vous montrera précisément votre potentiel.

Commencer le quiz : ${quizUrl}

Ce lien est personnel et sécurisé. Il expire dans 7 jours.

Cordialement,
L'équipe SkillShield AI
    `;

    // Envoi de l'email
    await transporter.sendMail({
      from: `"SkillShield AI" <${process.env.SMTP_USER}>`,
      to: email,
      subject: emailSubject,
      text: emailText,
      html: emailHtml,
    });

    // Enregistrer l'envoi
    await recordEmailSend(email);

    console.log(`✅ [send-quiz-link] Quiz link sent successfully to ${email}`);

    return res.status(200).json({ 
      success: true,
      message: 'Quiz envoyé avec succès !',
      token, // Pour le debug (à retirer en production)
    });

  } catch (error: any) {
    console.error('❌ Erreur lors de l\'envoi du quiz:', error);
    
    if (error.code === 'EAUTH' || error.code === 'ECONNECTION') {
      return res.status(500).json({ 
        error: 'Erreur de configuration email',
        message: 'Veuillez configurer les variables d\'environnement SMTP dans Vercel Dashboard → Settings → Environment Variables : SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS'
      });
    }

    return res.status(500).json({ 
      error: 'Erreur lors de l\'envoi du quiz',
      message: error.message || 'Une erreur inattendue s\'est produite'
    });
  }
}


