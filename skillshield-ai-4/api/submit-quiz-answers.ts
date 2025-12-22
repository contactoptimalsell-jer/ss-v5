import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';
import { getQuizTokenData, updateQuizToken } from './send-quiz-link';

interface QuizAnswers {
  automationNeeds: string[];
  solutionsInterested: string[];
  mainGoal: string[];
  otherAutomation?: string;
  otherSolution?: string;
  otherGoal?: string;
}

interface ProspectInfo {
  fullName: string;
  email: string;
  company: string;
  role: string;
  sector: string;
  teamSize: string;
  mainChallenge: string;
}

interface CalculatedScore {
  score: number;
  color: 'red' | 'orange' | 'green';
  level: string;
  potential: string;
  priority: string;
  analysis: {
    automationUrgency: number;
    solutionComplexity: number;
    goalAlignment: number;
    teamReadiness: number;
  };
  recommendations: string[];
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { token, quizAnswers, prospectInfo, calculatedScore, baseQuizScore }: {
      token: string;
      quizAnswers: QuizAnswers;
      prospectInfo: ProspectInfo;
      calculatedScore?: CalculatedScore;
      baseQuizScore?: {
        score: number;
        color: string;
        level: string;
        potential: string;
        priority: string;
      };
    } = req.body;

    // Validation
    if (!token || !prospectInfo || !prospectInfo.email || !prospectInfo.fullName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Récupérer les données du token
    const tokenData = getQuizTokenData(token);
    if (!tokenData) {
      return res.status(404).json({ error: 'Token invalide ou expiré' });
    }

    // Marquer comme complété
    updateQuizToken(token, {
      completed: true,
      completedAt: new Date(),
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

    // Formatage des réponses
    const formatArray = (arr: string[]) => arr.length > 0 ? arr.join(', ') : 'Aucune';
    const formatOther = (value?: string) => value && value.trim() ? value.trim() : 'Non renseigné';

    // Contenu de l'email récapitulatif
    const emailSubject = `🎯 Quiz Complété - ${prospectInfo.fullName} (${prospectInfo.company})`;
    
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
              max-width: 700px;
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
              min-width: 150px;
            }
            .info-value {
              color: #333;
              flex: 1;
              text-align: right;
            }
            .highlight {
              background-color: #fff3cd;
              padding: 15px;
              border-radius: 6px;
              border-left: 4px solid #ffc107;
              margin: 20px 0;
            }
            .score-badge {
              display: inline-flex;
              align-items: center;
              gap: 8px;
              padding: 8px 16px;
              border-radius: 20px;
              font-weight: bold;
              margin: 10px 0;
            }
            .score-red { background-color: #fee2e2; color: #991b1b; }
            .score-orange { background-color: #fed7aa; color: #9a3412; }
            .score-green { background-color: #dcfce7; color: #166534; }
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
              <h1>🎯 Quiz Complété - Prospect Qualifié</h1>
            </div>

            <div class="highlight">
              <strong>Prospect :</strong> ${prospectInfo.fullName}<br>
              <strong>Email :</strong> ${prospectInfo.email}<br>
              <strong>Société :</strong> ${prospectInfo.company}<br>
              ${tokenData.prospectProblem ? `<strong>Contexte :</strong> ${tokenData.prospectProblem}<br>` : ''}
              <strong>Quiz ouvert :</strong> ${tokenData.opened ? 'Oui' : 'Non'}${tokenData.openedAt ? ` (${new Date(tokenData.openedAt).toLocaleString('fr-FR')})` : ''}<br>
              <strong>Quiz complété :</strong> ${tokenData.completed ? 'Oui' : 'Non'}${tokenData.completedAt ? ` (${new Date(tokenData.completedAt).toLocaleString('fr-FR')})` : ''}
            </div>

            ${baseQuizScore ? `
            <div class="section">
              <div class="section-title">📊 Score Quiz de Base</div>
              <div class="score-badge score-${baseQuizScore.color}">
                <span>${baseQuizScore.color === 'red' ? '🟥' : baseQuizScore.color === 'orange' ? '🟧' : '🟩'}</span>
                <span>${baseQuizScore.score}/100 - ${baseQuizScore.level}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Potentiel :</span>
                <span class="info-value">${baseQuizScore.potential}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Priorité :</span>
                <span class="info-value">${baseQuizScore.priority}</span>
              </div>
            </div>
            ` : ''}

            ${calculatedScore ? `
            <div class="section" style="border-left-color: ${calculatedScore.color === 'red' ? '#ef4444' : calculatedScore.color === 'orange' ? '#f97316' : '#22c55e'};">
              <div class="section-title">🎯 Score Intelligent Calculé</div>
              <div class="score-badge score-${calculatedScore.color}">
                <span>${calculatedScore.color === 'red' ? '🟥' : calculatedScore.color === 'orange' ? '🟧' : '🟩'}</span>
                <span>${calculatedScore.score}/100 - ${calculatedScore.level}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Potentiel :</span>
                <span class="info-value">${calculatedScore.potential}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Priorité :</span>
                <span class="info-value">${calculatedScore.priority}</span>
              </div>
              <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e0e0e0;">
                <div class="section-title" style="font-size: 14px; margin-bottom: 10px;">Analyse détaillée :</div>
                <div class="info-row">
                  <span class="info-label">Urgence automatisation :</span>
                  <span class="info-value">${calculatedScore.analysis.automationUrgency}/100</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Complexité solutions :</span>
                  <span class="info-value">${calculatedScore.analysis.solutionComplexity}/100</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Alignement objectifs :</span>
                  <span class="info-value">${calculatedScore.analysis.goalAlignment}/100</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Préparation équipe :</span>
                  <span class="info-value">${calculatedScore.analysis.teamReadiness}/100</span>
                </div>
              </div>
              ${calculatedScore.recommendations.length > 0 ? `
              <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e0e0e0;">
                <div class="section-title" style="font-size: 14px; margin-bottom: 10px;">Recommandations :</div>
                <ul style="margin: 0; padding-left: 20px;">
                  ${calculatedScore.recommendations.map(rec => `<li style="margin: 5px 0;">${rec}</li>`).join('')}
                </ul>
              </div>
              ` : ''}
            </div>
            ` : ''}

            <div class="section">
              <div class="section-title">💼 Informations Prospect</div>
              <div class="info-row">
                <span class="info-label">Nom complet :</span>
                <span class="info-value">${prospectInfo.fullName}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Email :</span>
                <span class="info-value">${prospectInfo.email}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Société :</span>
                <span class="info-value">${prospectInfo.company}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Poste / Rôle :</span>
                <span class="info-value">${prospectInfo.role}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Secteur d'activité :</span>
                <span class="info-value">${prospectInfo.sector}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Taille de l'équipe :</span>
                <span class="info-value">${prospectInfo.teamSize}</span>
              </div>
              ${prospectInfo.mainChallenge ? `
              <div class="info-row">
                <span class="info-label">Défi principal :</span>
                <span class="info-value">${prospectInfo.mainChallenge}</span>
              </div>
              ` : ''}
            </div>

            <div class="section">
              <div class="section-title">🎯 Besoins d'Automatisation</div>
              <div class="info-row">
                <span class="info-label">Souhaits :</span>
                <span class="info-value">${formatArray(quizAnswers.automationNeeds)}</span>
              </div>
              ${quizAnswers.otherAutomation ? `
              <div class="info-row">
                <span class="info-label">Autre :</span>
                <span class="info-value">${formatOther(quizAnswers.otherAutomation)}</span>
              </div>
              ` : ''}
            </div>

            <div class="section">
              <div class="section-title">🔧 Solutions Intéressantes</div>
              <div class="info-row">
                <span class="info-label">Solutions :</span>
                <span class="info-value">${formatArray(quizAnswers.solutionsInterested)}</span>
              </div>
              ${quizAnswers.otherSolution ? `
              <div class="info-row">
                <span class="info-label">Autre :</span>
                <span class="info-value">${formatOther(quizAnswers.otherSolution)}</span>
              </div>
              ` : ''}
            </div>

            <div class="section">
              <div class="section-title">🎯 Objectifs Principaux</div>
              <div class="info-row">
                <span class="info-label">Objectifs :</span>
                <span class="info-value">${formatArray(quizAnswers.mainGoal)}</span>
              </div>
              ${quizAnswers.otherGoal ? `
              <div class="info-row">
                <span class="info-label">Autre :</span>
                <span class="info-value">${formatOther(quizAnswers.otherGoal)}</span>
              </div>
              ` : ''}
            </div>

            <div style="text-align: center; margin-top: 30px;">
              <a href="https://calendly.com/b00784336-essec?utm_source=quiz&utm_campaign=quiz_completed&utm_medium=email" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
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
🎯 Quiz Complété - Prospect Qualifié

Prospect : ${prospectInfo.fullName}
Email : ${prospectInfo.email}
Société : ${prospectInfo.company}
${tokenData.prospectProblem ? `Contexte : ${tokenData.prospectProblem}` : ''}

Quiz ouvert : ${tokenData.opened ? 'Oui' : 'Non'}${tokenData.openedAt ? ` (${new Date(tokenData.openedAt).toLocaleString('fr-FR')})` : ''}
Quiz complété : ${tokenData.completed ? 'Oui' : 'Non'}${tokenData.completedAt ? ` (${new Date(tokenData.completedAt).toLocaleString('fr-FR')})` : ''}

${baseQuizScore ? `
📊 Score Quiz de Base
- Score : ${baseQuizScore.score}/100
- Niveau : ${baseQuizScore.level}
- Potentiel : ${baseQuizScore.potential}
- Priorité : ${baseQuizScore.priority}
` : ''}

${calculatedScore ? `
🎯 Score Intelligent Calculé
- Score : ${calculatedScore.score}/100
- Niveau : ${calculatedScore.level}
- Potentiel : ${calculatedScore.potential}
- Priorité : ${calculatedScore.priority}
- Urgence automatisation : ${calculatedScore.analysis.automationUrgency}/100
- Complexité solutions : ${calculatedScore.analysis.solutionComplexity}/100
- Alignement objectifs : ${calculatedScore.analysis.goalAlignment}/100
- Préparation équipe : ${calculatedScore.analysis.teamReadiness}/100
${calculatedScore.recommendations.length > 0 ? `- Recommandations : ${calculatedScore.recommendations.join(', ')}` : ''}
` : ''}

💼 Informations Prospect
- Nom : ${prospectInfo.fullName}
- Email : ${prospectInfo.email}
- Société : ${prospectInfo.company}
- Poste : ${prospectInfo.role}
- Secteur : ${prospectInfo.sector}
- Taille équipe : ${prospectInfo.teamSize}
${prospectInfo.mainChallenge ? `- Défi principal : ${prospectInfo.mainChallenge}` : ''}

🎯 Besoins d'Automatisation
- Souhaits : ${formatArray(quizAnswers.automationNeeds)}
${quizAnswers.otherAutomation ? `- Autre : ${formatOther(quizAnswers.otherAutomation)}` : ''}

🔧 Solutions Intéressantes
- Solutions : ${formatArray(quizAnswers.solutionsInterested)}
${quizAnswers.otherSolution ? `- Autre : ${formatOther(quizAnswers.otherSolution)}` : ''}

🎯 Objectifs Principaux
- Objectifs : ${formatArray(quizAnswers.mainGoal)}
${quizAnswers.otherGoal ? `- Autre : ${formatOther(quizAnswers.otherGoal)}` : ''}

Date : ${new Date().toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' })}
    `;

    // Envoi de l'email récapitulatif
    await transporter.sendMail({
      from: `"SkillShield AI" <${process.env.SMTP_USER}>`,
      to: 'info@skillshield-ai.com',
      subject: emailSubject,
      text: emailText,
      html: emailHtml,
    });

    return res.status(200).json({ 
      success: true, 
      message: 'Quiz soumis avec succès' 
    });

  } catch (error: any) {
    console.error('Erreur lors de la soumission du quiz:', error);
    return res.status(500).json({ 
      error: 'Erreur lors de la soumission du quiz',
      details: error.message 
    });
  }
}

