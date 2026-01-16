import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, promoCode } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Email invalide' });
    }

    if (!promoCode) {
      return res.status(400).json({ error: 'Code promo manquant' });
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

    // Email au client avec le code promo
    await transporter.sendMail({
      from: `"SkillShield AI" <info@skillshield-ai.com>`,
      to: email,
      subject: `🎁 Votre code promo ${promoCode} - ${promoCode.includes('5') ? '-5%' : ''} sur votre implémentation IA`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
              line-height: 1.6; 
              color: #333; 
              margin: 0; 
              padding: 0;
              background-color: #f5f5f5;
            }
            .container { 
              max-width: 600px; 
              margin: 0 auto; 
              background-color: white;
            }
            .header { 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
              color: white; 
              padding: 40px 30px; 
              text-align: center; 
            }
            .header h1 { 
              margin: 0; 
              font-size: 28px; 
              font-weight: bold;
            }
            .content { 
              padding: 40px 30px; 
            }
            .promo-code-box { 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
              color: white; 
              padding: 30px; 
              border-radius: 12px; 
              text-align: center; 
              margin: 30px 0;
            }
            .promo-code { 
              font-family: 'Courier New', monospace; 
              font-size: 36px; 
              font-weight: bold; 
              letter-spacing: 4px; 
              margin: 15px 0;
            }
            .discount { 
              font-size: 24px; 
              margin-top: 10px;
            }
            .cta-button { 
              display: inline-block; 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
              color: white; 
              padding: 15px 40px; 
              text-decoration: none; 
              border-radius: 8px; 
              margin: 20px 0; 
              font-weight: bold;
            }
            .footer { 
              background-color: #f9f9f9; 
              padding: 20px 30px; 
              text-align: center; 
              color: #666; 
              font-size: 12px; 
            }
            .highlight { 
              background-color: #fff3cd; 
              padding: 15px; 
              border-radius: 8px; 
              border-left: 4px solid #ffc107; 
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎁 Votre code promo SkillShield AI</h1>
            </div>
            <div class="content">
              <p>Bonjour,</p>
              
              <p>Merci pour votre intérêt pour <strong>SkillShield AI</strong> !</p>
              
              <p>Vous arrivez <strong>au bon moment</strong> : bénéficiez de <strong>-5%</strong> sur votre première implémentation IA.</p>
              
              <div class="promo-code-box">
                <div style="font-size: 18px; margin-bottom: 10px;">Votre code promo :</div>
                <div class="promo-code">${promoCode}</div>
                <div class="discount">-5% de réduction</div>
                <div style="font-size: 14px; margin-top: 15px; opacity: 0.9;">
                  Valable sur votre première implémentation IA
                </div>
              </div>
              
              <div class="highlight">
                <strong>💡 Comment utiliser votre code promo ?</strong><br>
                Lors de votre premier rendez-vous avec notre équipe, mentionnez le code <strong>${promoCode}</strong> pour bénéficier de -5% sur votre implémentation IA.
              </div>
              
              <p style="text-align: center; margin-top: 30px;">
                <a href="https://calendly.com/b00784336-essec?utm_source=promo_code&utm_campaign=${promoCode}&utm_medium=email" class="cta-button">
                  Réserver mon audit stratégique gratuit
                </a>
              </p>
              
              <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                <strong>Pourquoi choisir SkillShield AI ?</strong>
              </p>
              <ul style="line-height: 2;">
                <li>✅ <strong>Système de gardien humain</strong> : Qualité garantie</li>
                <li>✅ <strong>ROI moyen de 300-500%</strong> : Résultats mesurables</li>
                <li>✅ <strong>Remboursement 90%</strong> : Si non performant</li>
                <li>✅ <strong>Résultats en 30 jours</strong> : Implémentation rapide</li>
              </ul>
            </div>
            <div class="footer">
              <p><strong>SkillShield AI</strong> - Implémentation IA avec Gardien Humain</p>
              <p>113 Rue Jean Jaurès, 92300 Levallois-Perret, France</p>
              <p>contact@skillshield-ai.com</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
🎁 Votre code promo SkillShield AI

Bonjour,

Merci pour votre intérêt pour SkillShield AI !

Vous arrivez au bon moment : bénéficiez de -5% sur votre première implémentation IA.

Votre code promo : ${promoCode}
-5% de réduction valable sur votre première implémentation IA

Comment utiliser votre code promo ?
Lors de votre premier rendez-vous avec notre équipe, mentionnez le code ${promoCode} pour bénéficier de -5% sur votre implémentation IA.

Réserver mon audit stratégique gratuit :
https://calendly.com/b00784336-essec?utm_source=promo_code&utm_campaign=${promoCode}&utm_medium=email

Pourquoi choisir SkillShield AI ?
✅ Système de gardien humain : Qualité garantie
✅ ROI moyen de 300-500% : Résultats mesurables
✅ Remboursement 90% : Si non performant
✅ Résultats en 30 jours : Implémentation rapide

SkillShield AI - Implémentation IA avec Gardien Humain
113 Rue Jean Jaurès, 92300 Levallois-Perret, France
contact@skillshield-ai.com
      `,
    });

    // Email de notification à contact@skillshield-ai.com
    await transporter.sendMail({
      from: `"SkillShield AI" <info@skillshield-ai.com>`,
      to: 'contact@skillshield-ai.com',
      subject: `🎁 Nouveau code promo demandé - ${promoCode}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
              line-height: 1.6; 
              color: #333; 
            }
            .container { 
              max-width: 600px; 
              margin: 0 auto; 
              padding: 20px;
              background-color: #f9f9f9;
            }
            .header { 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
              color: white; 
              padding: 20px; 
              text-align: center; 
              border-radius: 8px 8px 0 0;
            }
            .content { 
              background: white;
              padding: 30px; 
              border-radius: 0 0 8px 8px;
            }
            .info-line { 
              padding: 10px 0; 
              border-bottom: 1px solid #e0e0e0; 
            }
            .label { 
              font-weight: bold; 
              color: #667eea; 
              display: inline-block; 
              width: 150px; 
            }
            .value { 
              color: #333; 
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎁 Nouveau code promo demandé</h1>
            </div>
            <div class="content">
              <div class="info-line">
                <span class="label">Email :</span>
                <span class="value">${email}</span>
              </div>
              <div class="info-line">
                <span class="label">Code promo :</span>
                <span class="value"><strong>${promoCode}</strong></span>
              </div>
              <div class="info-line">
                <span class="label">Réduction :</span>
                <span class="value">-5%</span>
              </div>
              <div class="info-line">
                <span class="label">Date :</span>
                <span class="value">${new Date().toLocaleString('fr-FR')}</span>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
🎁 Nouveau code promo demandé

Email : ${email}
Code promo : ${promoCode}
Réduction : -5%
Date : ${new Date().toLocaleString('fr-FR')}
      `,
    });

    console.log(`✅ Promo code sent to ${email} and notification to contact@skillshield-ai.com`);

    return res.status(200).json({
      success: true,
      message: 'Code promo envoyé avec succès',
    });
  } catch (error: any) {
    console.error('Erreur promo-code:', error);
    return res.status(500).json({
      error: 'Erreur lors de l\'envoi de l\'email',
      details: error.message,
    });
  }
}
