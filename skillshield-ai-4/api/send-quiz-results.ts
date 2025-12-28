import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { 
    email, 
    prospectName, 
    profession, 
    automation, 
    score, 
    potential, 
    priority,
    companyName 
  } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Email invalide' });
  }

  try {
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

    // Email au prospect avec les résultats
    await transporter.sendMail({
      from: `"SkillShield AI" <info@skillshield-ai.com>`,
      to: email,
      subject: `🎯 Vos résultats du Quiz Automatisation - ${prospectName}`,
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
            .result-item { background: white; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #667eea; }
            .result-label { font-weight: bold; color: #667eea; margin-bottom: 5px; }
            .result-value { color: #333; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .cta-button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎯 Résultats de votre Quiz Automatisation</h1>
            </div>
            <div class="content">
              <p>Bonjour ${prospectName},</p>
              <p>Voici un récapitulatif de vos réponses au quiz d'automatisation :</p>
              
              <div class="result-item">
                <div class="result-label">Profession :</div>
                <div class="result-value">${profession}</div>
              </div>
              
              <div class="result-item">
                <div class="result-label">Automatisation :</div>
                <div class="result-value">${automation}</div>
              </div>
              
              <div class="result-item">
                <div class="result-label">Score :</div>
                <div class="result-value">${score}</div>
              </div>
              
              <div class="result-item">
                <div class="result-label">Potentiel :</div>
                <div class="result-value">${potential}</div>
              </div>
              
              <div class="result-item">
                <div class="result-label">Priorité :</div>
                <div class="result-value">${priority}</div>
              </div>
              
              <p style="text-align: center; margin-top: 30px;">
                <a href="https://calendly.com/b00784336-essec?utm_source=quiz&utm_campaign=quiz_results&utm_medium=email" class="cta-button">
                  Réserver un rendez-vous pour en discuter
                </a>
              </p>
            </div>
            <div class="footer">
              <p>SkillShield AI - Implémentation IA avec Gardien Humain</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
🎯 Résultats de votre Quiz Automatisation

Bonjour ${prospectName},

Voici un récapitulatif de vos réponses au quiz d'automatisation :

Profession : ${profession}

Automatisation : ${automation}

Score : ${score}

Potentiel : ${potential}

Priorité : ${priority}

Réservez un rendez-vous : https://calendly.com/b00784336-essec?utm_source=quiz&utm_campaign=quiz_results&utm_medium=email

SkillShield AI - Implémentation IA avec Gardien Humain
      `,
    });

    // Email de notification à info@skillshield-ai.com
    await transporter.sendMail({
      from: `"SkillShield AI" <info@skillshield-ai.com>`,
      to: 'info@skillshield-ai.com',
      subject: `🎯 Nouveau Prospect - Quiz Automatisation`,
      text: `
🎯 Nouveau Prospect - Quiz Automatisation

Profession : ${profession}

Automatisation : ${automation}

Score : ${score}

Potentiel : ${potential}

Priorité : ${priority}

${companyName ? `Entreprise : ${companyName}` : ''}
Email : ${email}
Nom : ${prospectName}
      `,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.8; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .info-line { padding: 10px 0; border-bottom: 1px solid #e0e0e0; }
            .label { font-weight: bold; color: #667eea; display: inline-block; width: 150px; }
            .value { color: #333; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎯 Nouveau Prospect - Quiz Automatisation</h1>
            </div>
            <div class="content">
              <div class="info-line">
                <span class="label">Profession :</span>
                <span class="value">${profession}</span>
              </div>
              <div class="info-line">
                <span class="label">Automatisation :</span>
                <span class="value">${automation}</span>
              </div>
              <div class="info-line">
                <span class="label">Score :</span>
                <span class="value">${score}</span>
              </div>
              <div class="info-line">
                <span class="label">Potentiel :</span>
                <span class="value">${potential}</span>
              </div>
              <div class="info-line">
                <span class="label">Priorité :</span>
                <span class="value">${priority}</span>
              </div>
              ${companyName ? `
              <div class="info-line">
                <span class="label">Entreprise :</span>
                <span class="value">${companyName}</span>
              </div>
              ` : ''}
              <div class="info-line">
                <span class="label">Email :</span>
                <span class="value">${email}</span>
              </div>
              <div class="info-line">
                <span class="label">Nom :</span>
                <span class="value">${prospectName}</span>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log(`✅ Quiz results sent to ${email} and notification to info@skillshield-ai.com`);

    return res.status(200).json({
      success: true,
      message: 'Résultats envoyés avec succès',
    });
  } catch (error: any) {
    console.error('❌ Error sending quiz results:', error);
    return res.status(500).json({
      error: 'Erreur lors de l\'envoi des résultats',
      message: error.message,
    });
  }
}

