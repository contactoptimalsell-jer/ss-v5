import type { VercelRequest, VercelResponse } from '@vercel/node';
import PDFDocument from 'pdfkit';
import nodemailer from 'nodemailer';
import { AuditResult } from '../types';

// Fonction helper pour calculer la hauteur approximative du texte
function calculateTextHeight(text: string, width: number, fontSize: number, lineGap: number = 0): number {
  const avgCharsPerLine = Math.floor(width / (fontSize * 0.6));
  const lines = Math.ceil(text.length / avgCharsPerLine);
  return lines * fontSize + (lines - 1) * lineGap;
}

// Fonction pour générer le PDF premium personnalisé sur UNE SEULE PAGE
function generatePDF(auditResult: AuditResult, userProblem: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 20, bottom: 40, left: 35, right: 35 }
      });

      const chunks: Buffer[] = [];
      
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const pageWidth = doc.page?.width || 595;
      const pageHeight = doc.page?.height || 842;
      const margin = 35;
      const contentWidth = pageWidth - 2 * margin;
      const maxY = pageHeight - 40; // Zone maximale avant le footer
      let currentY = 20;
      
      // === EN-TÊTE STRUCTURÉ ===
      doc.rect(margin, currentY, contentWidth, 2)
         .fillColor('#9333EA')
         .fill();
      
      currentY += 5;
      
      doc.fontSize(14)
         .fillColor('#9333EA')
         .font('Helvetica-Bold')
         .text('SkillShield AI', margin, currentY, { 
           width: contentWidth,
           align: 'left',
           lineGap: 0
         });
      
      currentY += 8;
      
      doc.fontSize(9)
         .fillColor('#000000')
         .font('Helvetica-Bold')
         .text('Plan d\'Automatisation Personnalisé', margin, currentY, { 
           width: contentWidth,
           align: 'left',
           lineGap: 0
         });
      
      currentY += 9;

      // === SECTION 1: ANALYSE ===
      doc.rect(margin, currentY, 2, 7)
         .fillColor('#06B6D4')
         .fill();
      
      doc.fontSize(7)
         .fillColor('#9333EA')
         .font('Helvetica-Bold')
         .text('1. ANALYSE DE VOTRE SITUATION', margin + 4, currentY + 1, { 
           width: contentWidth - 4,
           lineGap: 0
         });
      
      currentY += 8;
      
      doc.fontSize(6.5)
         .fillColor('#9333EA')
         .font('Helvetica-Bold')
         .text('Problème identifié :', margin, currentY, { 
           width: contentWidth,
           align: 'left',
           lineGap: 0
         });
      
      currentY += 4;
      
      const problemText = userProblem.length > 150 ? userProblem.substring(0, 150) + '...' : userProblem;
      doc.fontSize(6.5)
         .fillColor('#000000')
         .font('Helvetica')
         .text(problemText, margin, currentY, { 
           width: contentWidth,
           align: 'left',
           lineGap: 0.7
         });
      
      currentY += calculateTextHeight(problemText, contentWidth, 6.5, 0.7) + 4;
      
      doc.fontSize(6.5)
         .fillColor('#9333EA')
         .font('Helvetica-Bold')
         .text('Notre analyse :', margin, currentY, { 
           width: contentWidth,
           align: 'left',
           lineGap: 0
         });
      
      currentY += 4;
      
      const analysisText = auditResult.analysis.length > 220 ? auditResult.analysis.substring(0, 220) + '...' : auditResult.analysis;
      doc.fontSize(6.5)
         .fillColor('#000000')
         .font('Helvetica')
         .text(analysisText, margin, currentY, { 
           width: contentWidth,
           align: 'justify',
           lineGap: 0.8
         });
      
      currentY += calculateTextHeight(analysisText, contentWidth, 6.5, 0.8) + 5;

      // === SECTION 2: SOLUTIONS ===
      doc.rect(margin, currentY, 2, 7)
         .fillColor('#06B6D4')
         .fill();
      
      doc.fontSize(7)
         .fillColor('#9333EA')
         .font('Helvetica-Bold')
         .text('2. SOLUTIONS D\'AUTOMATISATION IA', margin + 4, currentY + 1, { 
           width: contentWidth - 4,
           lineGap: 0
         });
      
      currentY += 8;
      
      const solutions = auditResult.suggestions.slice(0, 3);
      const gapBetweenSolutions = 3;
      
      solutions.forEach((suggestion, index) => {
        const titleText = `Solution ${index + 1} : ${suggestion.title}`;
        const metaText = `Difficulté : ${suggestion.difficulty} | Temps économisé : ${suggestion.timeSaved}`;
        const maxDescLength = index < 2 ? 120 : 130;
        const descText = suggestion.description.length > maxDescLength 
          ? suggestion.description.substring(0, maxDescLength) + '...' 
          : suggestion.description;
        
        const titleHeight = calculateTextHeight(titleText, contentWidth - 8, 7, 0.6);
        const metaHeight = calculateTextHeight(metaText, contentWidth - 8, 6, 0.3);
        const descHeight = calculateTextHeight(descText, contentWidth - 8, 6.5, 0.9);
        const boxHeight = Math.ceil(titleHeight + metaHeight + descHeight + 6);
        
        doc.rect(margin, currentY, contentWidth, boxHeight)
           .fillColor('#F8FAFC')
           .fill();
        
        const borderColor = suggestion.difficulty === 'Facile' ? '#10B981' : 
                           suggestion.difficulty === 'Moyen' ? '#F59E0B' : '#EF4444';
        doc.rect(margin, currentY, contentWidth, boxHeight)
           .strokeColor(borderColor)
           .lineWidth(0.8)
           .stroke();
        
        let textY = currentY + 3;
        doc.fontSize(7)
           .fillColor('#9333EA')
           .font('Helvetica-Bold')
           .text(titleText, margin + 4, textY, { 
             width: contentWidth - 8,
             lineGap: 0.6
           });
        
        textY += titleHeight + 2;
        doc.fontSize(6)
           .fillColor('#6B7280')
           .font('Helvetica')
           .text(metaText, margin + 4, textY, { 
             width: contentWidth - 8,
             lineGap: 0.3
           });
        
        textY += metaHeight + 2;
        doc.fontSize(6.5)
           .fillColor('#000000')
           .font('Helvetica')
           .text(descText, margin + 4, textY, { 
             width: contentWidth - 8,
             align: 'justify',
             lineGap: 0.9
           });
        
        currentY += boxHeight + gapBetweenSolutions;
      });
      
      currentY += 4;

      // === SECTION 3: BENCHMARK ===
      if (auditResult.benchmark) {
        doc.rect(margin, currentY, 2, 7)
           .fillColor('#06B6D4')
           .fill();
        
        doc.fontSize(7)
           .fillColor('#9333EA')
           .font('Helvetica-Bold')
           .text('3. BENCHMARK SECTEUR', margin + 4, currentY + 1, { 
             width: contentWidth - 4,
             lineGap: 0
           });
        
        currentY += 8;
        
        const benchHeight = 30;
        
        doc.rect(margin, currentY, contentWidth, benchHeight)
           .fillColor('#ECFEFF')
           .fill();
        
        doc.rect(margin, currentY, contentWidth, benchHeight)
           .strokeColor('#06B6D4')
           .lineWidth(1)
           .stroke();
        
        const benchCol1 = margin + 5;
        const benchCol2 = margin + contentWidth / 2 + 5;
        const benchColWidth = contentWidth / 2 - 10;
        const benchRowHeight = 9.5;
        
        let benchY = currentY + 3;
        
        doc.fontSize(6)
           .fillColor('#9333EA')
           .font('Helvetica-Bold')
           .text('Secteur', benchCol1, benchY, { width: benchColWidth, lineGap: 0 });
        doc.fontSize(6.5)
           .fillColor('#000000')
           .font('Helvetica')
           .text(auditResult.benchmark.sectorAverage, benchCol1, benchY + 4, { 
             width: benchColWidth,
             lineGap: 0.5
           });
        
        doc.fontSize(6)
           .fillColor('#9333EA')
           .font('Helvetica-Bold')
           .text('Processus automatisés', benchCol2, benchY, { width: benchColWidth, lineGap: 0 });
        doc.fontSize(6.5)
           .fillColor('#000000')
           .font('Helvetica')
           .text(`${auditResult.benchmark.automatedProcessesPercentage}%`, benchCol2, benchY + 4, { 
             width: benchColWidth,
             lineGap: 0.5
           });
        
        benchY += benchRowHeight;
        
        doc.fontSize(6)
           .fillColor('#9333EA')
           .font('Helvetica-Bold')
           .text('Temps économisé', benchCol1, benchY, { width: benchColWidth, lineGap: 0 });
        doc.fontSize(6.5)
           .fillColor('#000000')
           .font('Helvetica')
           .text(auditResult.benchmark.averageTimeSavedPerTask, benchCol1, benchY + 4, { 
             width: benchColWidth,
             lineGap: 0.5
           });
        
        doc.fontSize(6)
           .fillColor('#9333EA')
           .font('Helvetica-Bold')
           .text('ROI moyen', benchCol2, benchY, { width: benchColWidth, lineGap: 0 });
        doc.fontSize(6.5)
           .fillColor('#000000')
           .font('Helvetica')
           .text(auditResult.benchmark.averageROI, benchCol2, benchY + 4, { 
             width: benchColWidth,
             lineGap: 0.5
           });
        
        benchY += benchRowHeight;
        
        doc.fontSize(6)
           .fillColor('#9333EA')
           .font('Helvetica-Bold')
           .text('Retour investissement', benchCol1, benchY, { width: benchColWidth, lineGap: 0 });
        doc.fontSize(6.5)
           .fillColor('#000000')
           .font('Helvetica')
           .text(auditResult.benchmark.paybackPeriod, benchCol1, benchY + 4, { 
             width: benchColWidth,
             lineGap: 0.5
           });
        
        currentY += benchHeight + 4;
      }

      // === SECTION 4: PLAN D'ACTION ===
      doc.rect(margin, currentY, 2, 7)
         .fillColor('#06B6D4')
         .fill();
      
      doc.fontSize(7)
         .fillColor('#9333EA')
         .font('Helvetica-Bold')
         .text('4. PLAN D\'ACTION EN 5 ÉTAPES', margin + 4, currentY + 1, { 
           width: contentWidth - 4,
           lineGap: 0
         });
      
      currentY += 8;
      
      const steps = [
        'Audit Complet : Analyse approfondie de vos processus',
        'Développement sur Mesure : Création de vos agents IA',
        'Intégration et Tests : Mise en place et validation',
        'Formation et Accompagnement : Formation de votre équipe',
        'Suivi et Optimisation : Amélioration continue'
      ];
      
      steps.forEach((step, index) => {
        doc.circle(margin + 4, currentY + 1.5, 3)
           .fillColor('#9333EA')
           .fill();
        
        doc.fontSize(6)
           .fillColor('#FFFFFF')
           .font('Helvetica-Bold')
           .text((index + 1).toString(), margin + 1.5, currentY, { 
             width: 6,
             align: 'center'
           });
        
        doc.fontSize(6.5)
           .fillColor('#000000')
           .font('Helvetica')
           .text(step, margin + 10, currentY, { 
             width: contentWidth - 10,
             lineGap: 0.6
           });
        currentY += 6;
      });
      
      currentY += 3;

      // === SECTION 5: PROCHAINES ÉTAPES ===
      doc.rect(margin, currentY, 2, 7)
         .fillColor('#06B6D4')
         .fill();
      
      doc.fontSize(7)
         .fillColor('#9333EA')
         .font('Helvetica-Bold')
         .text('5. PROCHAINES ÉTAPES', margin + 4, currentY + 1, { 
           width: contentWidth - 4,
           lineGap: 0
         });
      
      currentY += 8;
      
      const nextStepsText1 = '✓ Appel de 15 min | ✓ Devis gratuit | ✓ Garantie résultat (90%)';
      const nextStepsText2 = 'contact@skillshield-ai.com | Réponse sous 24h | skillshield.app';
      const text1Height = calculateTextHeight(nextStepsText1, contentWidth - 8, 6.5, 0.6);
      const text2Height = calculateTextHeight(nextStepsText2, contentWidth - 8, 6, 0.3);
      const boxHeight = Math.ceil(text1Height + text2Height + 6);
      
      doc.rect(margin, currentY, contentWidth, boxHeight)
         .fillColor('#F8FAFC')
         .fill();
      
      doc.rect(margin, currentY, contentWidth, boxHeight)
         .strokeColor('#9333EA')
         .lineWidth(0.8)
         .stroke();
      
      doc.fontSize(6.5)
         .fillColor('#10B981')
         .font('Helvetica-Bold')
         .text(nextStepsText1, margin + 4, currentY + 2, { 
           width: contentWidth - 8,
           lineGap: 0.6
         });
      
      doc.fontSize(6)
         .fillColor('#000000')
         .font('Helvetica')
         .text(nextStepsText2, margin + 4, currentY + text1Height + 2, { 
           width: contentWidth - 8,
           align: 'center',
           lineGap: 0.3
         });
      
      currentY += boxHeight;

      // === FOOTER ===
      const footerY = pageHeight - 35;
      const copyrightText = '© 2025 SkillShield AI. Tous droits réservés.';
      
      doc.moveTo(margin, footerY - 5)
         .lineTo(margin + contentWidth, footerY - 5)
         .strokeColor('#E5E7EB')
         .lineWidth(0.5)
         .stroke();
      
      doc.fontSize(5.5)
         .fillColor('#6B7280')
         .font('Helvetica')
         .text(copyrightText, margin, footerY, { 
           width: contentWidth,
           align: 'center',
           lineGap: 0
         });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

// Fonction pour envoyer l'email avec le PDF
async function sendEmailWithPDF(
  toEmail: string,
  pdfBuffer: Buffer,
  userProblem: string
): Promise<void> {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER || 'contact@skillshield-ai.com',
      pass: process.env.SMTP_PASS || '',
    },
  });

  await transporter.sendMail({
    from: `"SkillShield AI" <${process.env.SMTP_USER || 'contact@skillshield-ai.com'}>`,
    to: toEmail,
    subject: '📄 Votre Plan d\'Automatisation Personnalisé - SkillShield AI',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #8B5CF6;">Bonjour,</h2>
        <p>Comme promis, voici votre <strong>Plan d'Automatisation Personnalisé</strong>, basé sur votre situation :</p>
        <p style="background: #f3f4f6; padding: 15px; border-radius: 8px; font-style: italic;">
          "${userProblem}"
        </p>
        <p>Ce document contient :</p>
        <ul>
          <li>Notre analyse de votre situation</li>
          <li>Vos solutions d'automatisation IA personnalisées</li>
          <li>Les benchmarks de votre secteur</li>
          <li>Un plan d'action en 5 étapes prêt à mettre en œuvre</li>
        </ul>
        <p><strong>Prochaine étape :</strong> Planifiez un appel de 15 minutes avec notre équipe pour discuter de la mise en œuvre.</p>
        <p style="background: linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%); color: white; padding: 20px; border-radius: 10px; margin: 25px 0; font-weight: 600; line-height: 1.6;">
          <strong style="font-size: 18px;">Le potentiel de transformation est immense :</strong><br/><br/>
          &gt;&gt; <strong>Gains de temps massifs :</strong> Récupérez 15-20 heures par semaine automatiquement, soit l'équivalent d'un employé à temps plein gratuit<br/><br/>
          &gt;&gt; <strong>ROI explosif :</strong> Nos clients génèrent en moyenne 250-450% de retour sur investissement en moins de 6 mois<br/><br/>
          &gt;&gt; <strong>Avantage concurrentiel :</strong> Pendant que vos concurrents perdent du temps sur des tâches répétitives, vous vous concentrez sur la croissance et l'innovation<br/><br/>
          &gt;&gt; <strong>Scalabilité extrême :</strong> Vos agents IA travaillent 24/7 sans fatigue, erreurs ou congés, multipliant votre productivité par 3 à 5x<br/><br/>
          &gt;&gt; <strong>Transformation durable :</strong> Une fois implémentés, ces systèmes deviennent votre avantage concurrentiel permanent, créant une barrière à l'entrée pour vos concurrents
        </p>
        <p style="background: #F8FAFC; padding: 15px; border-left: 4px solid #8B5CF6; border-radius: 6px; margin: 20px 0;">
          <strong style="color: #8B5CF6;">En 15 minutes, nous vous montrerons :</strong><br/>
          ✓ Comment transformer votre problème actuel en opportunité de croissance<br/>
          ✓ Les gains financiers concrets que vous pouvez réaliser dès le premier mois<br/>
          ✓ La feuille de route précise pour implémenter vos agents IA en moins de 30 jours<br/>
          ✓ Les résultats réels de nos clients dans votre secteur
        </p>
        <p style="margin-top: 30px;">
          <a href="https://calendly.com/b00784336-essec" 
             style="background: #8B5CF6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
            Planifier un appel (15 min)
          </a>
        </p>
        <p style="margin-top: 20px;">
          <a href="https://skillshield.app" 
             style="color: #8B5CF6; text-decoration: none; font-weight: 500;">
            🌐 Visitez notre site web : skillshield.app
          </a>
        </p>
        <p style="color: #6b7280; font-size: 12px; margin-top: 30px;">
          Cordialement,<br/>
          L'équipe SkillShield AI<br/>
          contact@skillshield-ai.com
        </p>
      </div>
    `,
    attachments: [
      {
        filename: 'plan-automatisation-skillshield-ai.pdf',
        content: pdfBuffer,
      },
    ],
  });
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, auditResult, userProblem } = req.body;

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'Email invalide' });
  }

  if (!auditResult || !userProblem) {
    return res.status(400).json({ error: 'auditResult et userProblem sont requis' });
  }

  try {
    console.log('Début de la génération du PDF...');
    const pdfBuffer = await generatePDF(auditResult as AuditResult, userProblem);
    console.log('PDF généré avec succès, taille:', pdfBuffer.length, 'bytes');

    console.log('Début de l\'envoi de l\'email...');
    await sendEmailWithPDF(email, pdfBuffer, userProblem);
    console.log('Email envoyé avec succès');

    return res.status(200).json({ 
      success: true,
      message: 'PDF envoyé avec succès !' 
    });

  } catch (error: any) {
    console.error('❌ Erreur complète lors de l\'envoi du PDF:', error);
    console.error('Stack trace:', error.stack);
    
    if (error.code === 'EAUTH' || error.code === 'ECONNECTION') {
      return res.status(500).json({ 
        error: 'Erreur de configuration email',
        message: 'Veuillez configurer les variables d\'environnement SMTP dans Vercel Dashboard → Settings → Environment Variables : SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS'
      });
    }

    return res.status(500).json({ 
      error: 'Erreur lors de l\'envoi du PDF',
      message: error.message || 'Une erreur inattendue s\'est produite'
    });
  }
}
