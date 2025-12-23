import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';

// Fonction unifiée pour les emails liés aux quiz
// POST /api/quiz-email avec { type: 'complete', quizData, calculatedScore, quizAnswers, prospectInfo } -> Envoi email récap quiz complété
// POST /api/quiz-email avec { type: 'notification', score, level, potential, priority, selectedProfession, selectedAutomation } -> Envoi email notification quiz
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { type, ...data } = req.body;

    if (!type || !['complete', 'notification'].includes(type)) {
      return res.status(400).json({ error: 'Type requis (complete ou notification)' });
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

    if (type === 'complete') {
      // Logique de send-quiz-complete.ts
      const { quizData, calculatedScore, quizAnswers, prospectInfo } = data;

      if (!prospectInfo || !prospectInfo.email || !prospectInfo.fullName) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const formatArray = (arr: string[]) => arr.length > 0 ? arr.join(', ') : 'Aucune';
      const formatOther = (value?: string) => value && value.trim() ? value.trim() : 'Non renseigné';

      const emailSubject = `🎯 Nouveau Prospect - Quiz Personnalisé : ${prospectInfo.fullName} (${prospectInfo.company})`;
      
      const emailHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 700px; margin: 0 auto; padding: 20px; background-color: #f5f5f5; }
              .container { background-color: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; margin: -30px -30px 20px -30px; }
              .header h1 { margin: 0; font-size: 24px; }
              .section { margin: 20px 0; padding: 15px; background-color: #f9f9f9; border-radius: 6px; border-left: 4px solid #667eea; }
              .section-title { font-weight: bold; color: #667eea; margin-bottom: 10px; font-size: 16px; text-transform: uppercase; letter-spacing: 0.5px; }
              .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e0e0e0; }
              .info-row:last-child { border-bottom: none; }
              .info-label { font-weight: 600; color: #666; min-width: 150px; }
              .info-value { color: #333; flex: 1; text-align: right; }
              .highlight { background-color: #fff3cd; padding: 15px; border-radius: 6px; border-left: 4px solid #ffc107; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎯 Nouveau Prospect - Quiz Personnalisé</h1>
              </div>
              <div class="highlight">
                <strong>Prospect :</strong> ${prospectInfo.fullName}<br>
                <strong>Email :</strong> ${prospectInfo.email}<br>
                <strong>Société :</strong> ${prospectInfo.company}
              </div>
              ${calculatedScore ? `
              <div class="section">
                <div class="section-title">🎯 Score Intelligent</div>
                <div class="info-row">
                  <span class="info-label">Score :</span>
                  <span class="info-value">${calculatedScore.score}/100 - ${calculatedScore.level}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Potentiel :</span>
                  <span class="info-value">${calculatedScore.potential}</span>
                </div>
              </div>
              ` : ''}
              <div class="section">
                <div class="section-title">💼 Informations</div>
                <div class="info-row"><span class="info-label">Nom :</span><span class="info-value">${prospectInfo.fullName}</span></div>
                <div class="info-row"><span class="info-label">Email :</span><span class="info-value">${prospectInfo.email}</span></div>
                <div class="info-row"><span class="info-label">Société :</span><span class="info-value">${prospectInfo.company}</span></div>
                <div class="info-row"><span class="info-label">Secteur :</span><span class="info-value">${prospectInfo.sector}</span></div>
              </div>
              <div class="section">
                <div class="section-title">🎯 Besoins</div>
                <div class="info-row"><span class="info-label">Automatisations :</span><span class="info-value">${formatArray(quizAnswers.automationNeeds)}</span></div>
                <div class="info-row"><span class="info-label">Solutions :</span><span class="info-value">${formatArray(quizAnswers.solutionsInterested)}</span></div>
                <div class="info-row"><span class="info-label">Objectifs :</span><span class="info-value">${formatArray(quizAnswers.mainGoal)}</span></div>
              </div>
            </div>
          </body>
        </html>
      `;

      await transporter.sendMail({
        from: `"SkillShield AI" <${process.env.SMTP_USER}>`,
        to: 'info@skillshield-ai.com',
        subject: emailSubject,
        html: emailHtml,
      });

      return res.status(200).json({ success: true, message: 'Email envoyé' });
    } else if (type === 'notification') {
      // Logique de send-quiz-email.ts
      const { score, level, potential, priority, selectedProfession, selectedAutomation } = data;

      if (!score && score !== 0 || !level || !potential || !priority || !selectedProfession || !selectedAutomation) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const emailSubject = `🎯 Nouveau prospect - Quiz Automatisation : ${selectedProfession}`;
      const emailHtml = `
        <!DOCTYPE html>
        <html>
          <head><meta charset="UTF-8"></head>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h1>🎯 Nouveau Prospect - Quiz Automatisation</h1>
            <p><strong>Profession :</strong> ${selectedProfession}</p>
            <p><strong>Automatisation :</strong> ${selectedAutomation}</p>
            <p><strong>Score :</strong> ${score}/10 - ${level}</p>
            <p><strong>Potentiel :</strong> ${potential}</p>
            <p><strong>Priorité :</strong> ${priority}</p>
          </body>
        </html>
      `;

      await transporter.sendMail({
        from: `"SkillShield AI" <${process.env.SMTP_USER}>`,
        to: 'info@skillshield-ai.com',
        subject: emailSubject,
        html: emailHtml,
      });

      return res.status(200).json({ success: true, message: 'Email envoyé' });
    }

    return res.status(400).json({ error: 'Type invalide' });
  } catch (error: any) {
    console.error('Erreur quiz-email:', error);
    return res.status(500).json({ 
      error: 'Erreur lors de l\'envoi de l\'email',
      details: error.message 
    });
  }
}
