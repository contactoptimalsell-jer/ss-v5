import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';

interface QuizData {
  score: number;
  level: 'Débutant' | 'Intermédiaire' | 'Avancé';
  potential: 'Élevé' | 'Moyen' | 'Faible';
  priority: string;
  selectedProfession: string;
  selectedAutomation: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { score, level, potential, priority, selectedProfession, selectedAutomation }: QuizData = req.body;

    // Validation
    if (!score && score !== 0 || !level || !potential || !priority || !selectedProfession || !selectedAutomation) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

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
    const emailSubject = `🎯 Nouveau prospect - Quiz Automatisation : ${selectedProfession}`;
    
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
            .section {
              margin: 20px 0;
              padding: 15px;
              background-color: #f9f9f9;
              border-radius: 6px;
              border-left: 4px solid #667eea;
            }
            .section-title {
              font-weight: bold;
              color: #667eea;
              margin-bottom: 10px;
              font-size: 16px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .info-row {
              display: flex;
              justify-content: space-between;
              padding: 8px 0;
              border-bottom: 1px solid #e0e0e0;
            }
            .info-row:last-child {
              border-bottom: none;
            }
            .info-label {
              font-weight: 600;
              color: #666;
            }
            .info-value {
              color: #333;
            }
            .highlight {
              background-color: #fff3cd;
              padding: 15px;
              border-radius: 6px;
              border-left: 4px solid #ffc107;
              margin: 20px 0;
            }
            .cta-button {
              display: inline-block;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 6px;
              font-weight: bold;
              margin-top: 20px;
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
              <h1>🎯 Nouveau Prospect - Quiz Automatisation</h1>
            </div>

            <div class="highlight">
              <strong>Profession choisie :</strong> ${selectedProfession}<br>
              <strong>Automatisation souhaitée :</strong> ${selectedAutomation}
            </div>

            <div class="section">
              <div class="section-title">📊 Résultats du Quiz</div>
              <div class="info-row">
                <span class="info-label">Score :</span>
                <span class="info-value">${score}/10</span>
              </div>
              <div class="info-row">
                <span class="info-label">Niveau :</span>
                <span class="info-value">${level}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Potentiel d'amélioration :</span>
                <span class="info-value">${potential}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Priorité :</span>
                <span class="info-value">${priority}</span>
              </div>
            </div>

            <div class="section">
              <div class="section-title">💼 Choix du Prospect</div>
              <div class="info-row">
                <span class="info-label">Métier :</span>
                <span class="info-value"><strong>${selectedProfession}</strong></span>
              </div>
              <div class="info-row">
                <span class="info-label">Automatisation choisie :</span>
                <span class="info-value"><strong>${selectedAutomation}</strong></span>
              </div>
            </div>

            <div style="text-align: center; margin-top: 30px;">
              <a href="https://calendly.com/b00784336-essec?utm_source=quiz&utm_campaign=automation_quiz&utm_medium=email" class="cta-button">
                Voir le calendrier Calendly
              </a>
            </div>

            <div class="footer">
              <p>Email envoyé automatiquement depuis le quiz SkillShield AI</p>
              <p>Date : ${new Date().toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' })}</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const emailText = `
🎯 Nouveau Prospect - Quiz Automatisation

Profession choisie : ${selectedProfession}
Automatisation souhaitée : ${selectedAutomation}

📊 Résultats du Quiz
- Score : ${score}/10
- Niveau : ${level}
- Potentiel d'amélioration : ${potential}
- Priorité : ${priority}

💼 Choix du Prospect
- Métier : ${selectedProfession}
- Automatisation choisie : ${selectedAutomation}

Date : ${new Date().toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' })}
    `;

    // Envoi de l'email
    await transporter.sendMail({
      from: `"SkillShield AI" <${process.env.SMTP_USER}>`,
      to: 'info@skillshield-ai.com',
      subject: emailSubject,
      text: emailText,
      html: emailHtml,
    });

    return res.status(200).json({ 
      success: true, 
      message: 'Email envoyé avec succès' 
    });

  } catch (error: any) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    return res.status(500).json({ 
      error: 'Erreur lors de l\'envoi de l\'email',
      details: error.message 
    });
  }
}

