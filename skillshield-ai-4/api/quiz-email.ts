import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';

// Fonction unifiée pour les emails liés aux quiz
// POST /api/quiz-email avec { type: 'complete', quizData, calculatedScore, quizAnswers, prospectInfo } -> Envoi email récap quiz complété
// POST /api/quiz-email avec { type: 'notification', score, level, potential, priority, selectedProfession, selectedAutomation } -> Envoi email notification quiz
// POST /api/quiz-email avec { type: 'results', email, prospectName, profession, automation, score, potential, priority, companyName } -> Envoi résultats quiz au prospect + notification
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { type, ...data } = req.body;

    if (!type || !['complete', 'notification', 'results'].includes(type)) {
      return res.status(400).json({ error: 'Type requis (complete, notification ou results)' });
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
        from: `"SkillShield AI" <info@skillshield-ai.com>`,
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
        from: `"SkillShield AI" <info@skillshield-ai.com>`,
        to: 'info@skillshield-ai.com',
        subject: emailSubject,
        html: emailHtml,
      });

      return res.status(200).json({ success: true, message: 'Email envoyé' });
    } else if (type === 'results') {
      // Logique de send-quiz-results.ts
      const { email, prospectName, profession, automation, score, potential, priority, companyName } = data;

      if (!email || !email.includes('@')) {
        return res.status(400).json({ error: 'Email invalide' });
      }

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
