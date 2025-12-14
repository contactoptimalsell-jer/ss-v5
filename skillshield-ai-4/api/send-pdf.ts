import type { VercelRequest, VercelResponse } from '@vercel/node';
import PDFDocument from 'pdfkit';
import nodemailer from 'nodemailer';
import { AuditResult } from '../types';

// Fonction helper pour calculer la hauteur approximative du texte
function calculateTextHeight(text: string, width: number, fontSize: number, lineGap: number = 0): number {
  const avgCharsPerLine = Math.floor(width / (fontSize * 0.6)); // Approximation basée sur la taille de police
  const lines = Math.ceil(text.length / avgCharsPerLine);
  return lines * fontSize + (lines - 1) * lineGap;
}

// Fonction pour générer le PDF premium personnalisé sur une seule page
function generatePDF(auditResult: AuditResult, userProblem: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 30, bottom: 55, left: 45, right: 45 }
      });

      const chunks: Buffer[] = [];
      
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const pageWidth = doc.page?.width || 595;
      const pageHeight = doc.page?.height || 842;
      const margin = 45;
      const contentWidth = pageWidth - 2 * margin;
      let currentY = 30;

      // === EN-TÊTE PREMIUM ===
      // Barre de couleur violet vive en haut (style SkillShield)
      doc.rect(margin, currentY, contentWidth, 2)
         .fillColor('#9333EA')
         .fill();
      
      currentY += 10;
      
      // Titre principal avec style SkillShield premium
      doc.fontSize(22)
         .fillColor('#9333EA')
         .text('SkillShield AI', margin, currentY, { 
           width: contentWidth,
           align: 'left',
           lineGap: 0
         });
      
      currentY += 16;
      
      doc.fontSize(13)
         .fillColor('#374151')
         .text('Plan d\'Automatisation Personnalisé', margin, currentY, { 
           width: contentWidth,
           align: 'left',
           lineGap: 0
         });
      
      currentY += 18;

      // === SECTION 1: ANALYSE ===
      // Titre de section avec accent cyan vif premium
      doc.rect(margin, currentY, 3, 12)
         .fillColor('#06B6D4')
         .fill();
      
      doc.fontSize(11)
         .fillColor('#9333EA')
         .text('ANALYSE DE VOTRE SITUATION', margin + 8, currentY + 2, { 
           width: contentWidth - 8,
           lineGap: 0
         });
      
      currentY += 15;
      
      const problemText = `Problème identifié : ${userProblem.substring(0, 140)}${userProblem.length > 140 ? '...' : ''}`;
      doc.fontSize(9)
         .fillColor('#000000')
         .text(problemText, margin, currentY, { 
           width: contentWidth,
           align: 'left',
           lineGap: 1
         });
      
      currentY += calculateTextHeight(problemText, contentWidth, 9, 1) + 8;
      
      const analysisText = auditResult.analysis.substring(0, 260) + (auditResult.analysis.length > 260 ? '...' : '');
      doc.fontSize(9)
         .fillColor('#000000')
         .text(analysisText, margin, currentY, { 
           width: contentWidth,
           align: 'justify',
           lineGap: 2
         });
      
      currentY += calculateTextHeight(analysisText, contentWidth, 9, 2) + 12;

      // === SECTION 2: SOLUTIONS (2 colonnes premium) ===
      doc.rect(margin, currentY, 3, 12)
         .fillColor('#06B6D4')
         .fill();
      
      doc.fontSize(11)
         .fillColor('#9333EA')
         .text('SOLUTIONS D\'AUTOMATISATION IA', margin + 8, currentY + 2, { 
           width: contentWidth - 8,
           lineGap: 0
         });
      
      currentY += 15;
      
      const colWidth = (contentWidth - 8) / 2;
      const solutions = auditResult.suggestions;
      
      // Solution 1 et 2 côte à côte avec design premium
      let maxSolutionHeight = 0;
      [0, 1].forEach((index) => {
        if (index < solutions.length) {
          const colX = index === 0 ? margin : margin + colWidth + 8;
          const suggestion = solutions[index];
          
          const titleText = `${index + 1}. ${suggestion.title}`;
          const metaText = `${suggestion.difficulty} • ${suggestion.timeSaved}`;
          const descText = suggestion.description.substring(0, 120) + (suggestion.description.length > 120 ? '...' : '');
          
          const titleHeight = calculateTextHeight(titleText, colWidth - 10, 9, 1);
          const metaHeight = calculateTextHeight(metaText, colWidth - 10, 7.5, 1);
          const descHeight = calculateTextHeight(descText, colWidth - 10, 8, 1.5);
          const boxHeight = Math.ceil(titleHeight + metaHeight + descHeight + 12);
          
          maxSolutionHeight = Math.max(maxSolutionHeight, boxHeight);
          
          // Fond subtil premium pour chaque solution
          doc.rect(colX, currentY, colWidth, boxHeight)
             .fillColor('#F8FAFC')
             .fill();
          
          // Bordure subtile
          doc.rect(colX, currentY, colWidth, boxHeight)
             .strokeColor('#E5E7EB')
             .lineWidth(0.5)
             .stroke();
          
          let textY = currentY + 4;
          doc.fontSize(9)
             .fillColor('#9333EA')
             .text(titleText, colX + 5, textY, { 
               width: colWidth - 10,
               lineGap: 1
             });
          
          textY += titleHeight + 4;
          doc.fontSize(7.5)
             .fillColor('#6b7280')
             .text(metaText, colX + 5, textY, { 
               width: colWidth - 10,
               lineGap: 1
             });
          
          textY += metaHeight + 4;
          doc.fontSize(8)
             .fillColor('#4b5563')
             .text(descText, colX + 5, textY, { 
               width: colWidth - 10,
               align: 'justify',
               lineGap: 1.5
             });
        }
      });
      
      currentY += maxSolutionHeight + 8;
      
      // Solution 3 en pleine largeur premium
      if (solutions.length > 2) {
        const suggestion = solutions[2];
        const titleText = `3. ${suggestion.title}`;
        const metaText = `${suggestion.difficulty} • ${suggestion.timeSaved}`;
        const descText = suggestion.description.substring(0, 200) + (suggestion.description.length > 200 ? '...' : '');
        
        const titleHeight = calculateTextHeight(titleText, contentWidth - 10, 9, 1);
        const metaHeight = calculateTextHeight(metaText, contentWidth - 10, 7.5, 1);
        const descHeight = calculateTextHeight(descText, contentWidth - 10, 8, 1.5);
        const boxHeight = Math.ceil(titleHeight + metaHeight + descHeight + 12);
        
        doc.rect(margin, currentY, contentWidth, boxHeight)
           .fillColor('#F8FAFC')
           .fill();
        
        doc.rect(margin, currentY, contentWidth, boxHeight)
           .strokeColor('#E5E7EB')
           .lineWidth(0.5)
           .stroke();
        
        let textY = currentY + 4;
        doc.fontSize(9)
           .fillColor('#9333EA')
           .text(titleText, margin + 5, textY, { 
             width: contentWidth - 10,
             lineGap: 1
           });
        
        textY += titleHeight + 4;
        doc.fontSize(7.5)
           .fillColor('#6b7280')
           .text(metaText, margin + 5, textY, { 
             width: contentWidth - 10,
             lineGap: 1
           });
        
        textY += metaHeight + 4;
        doc.fontSize(8)
           .fillColor('#4b5563')
           .text(descText, margin + 5, textY, { 
             width: contentWidth - 10,
             align: 'justify',
             lineGap: 1.5
           });
        
        currentY += boxHeight + 6;
      }

      // === SECTION 3: BENCHMARK (si disponible) ===
      if (auditResult.benchmark) {
        doc.rect(margin, currentY, 3, 12)
           .fillColor('#06B6D4')
           .fill();
        
        doc.fontSize(11)
           .fillColor('#9333EA')
           .text('BENCHMARK SECTEUR', margin + 8, currentY + 2, { 
             width: contentWidth - 8,
             lineGap: 0
           });
        
        currentY += 15;
        
        // Fond premium vif pour le benchmark
        doc.rect(margin, currentY, contentWidth, 44)
           .fillColor('#ECFEFF')
           .fill();
        
        doc.rect(margin, currentY, contentWidth, 44)
           .strokeColor('#06B6D4')
           .lineWidth(1)
           .stroke();
        
        // Benchmark en 2 colonnes avec espacement harmonieux
        const benchCol1 = margin + 6;
        const benchCol2 = margin + contentWidth / 2 + 6;
        const benchColWidth = contentWidth / 2 - 12;
        
        doc.fontSize(8)
           .fillColor('#9333EA')
           .text('Secteur', benchCol1, currentY + 4, { width: benchColWidth, lineGap: 0 });
        doc.fontSize(8)
           .fillColor('#4b5563')
           .text(auditResult.benchmark.sectorAverage, benchCol1, currentY + 13, { 
             width: benchColWidth,
             lineGap: 1
           });
        
        doc.fontSize(8)
           .fillColor('#9333EA')
           .text('Processus automatisés', benchCol2, currentY + 4, { width: benchColWidth, lineGap: 0 });
        doc.fontSize(8)
           .fillColor('#4b5563')
           .text(`${auditResult.benchmark.automatedProcessesPercentage}%`, benchCol2, currentY + 13, { 
             width: benchColWidth,
             lineGap: 1
           });
        
        doc.fontSize(8)
           .fillColor('#9333EA')
           .text('Temps économisé', benchCol1, currentY + 23, { width: benchColWidth, lineGap: 0 });
        doc.fontSize(8)
           .fillColor('#4b5563')
           .text(auditResult.benchmark.averageTimeSavedPerTask, benchCol1, currentY + 32, { 
             width: benchColWidth,
             lineGap: 1
           });
        
        doc.fontSize(8)
           .fillColor('#9333EA')
           .text('ROI moyen', benchCol2, currentY + 23, { width: benchColWidth, lineGap: 0 });
        doc.fontSize(8)
           .fillColor('#4b5563')
           .text(auditResult.benchmark.averageROI, benchCol2, currentY + 32, { 
             width: benchColWidth,
             lineGap: 1
           });
        
        doc.fontSize(8)
           .fillColor('#9333EA')
           .text('Retour investissement', benchCol1, currentY + 37, { width: benchColWidth, lineGap: 0 });
        doc.fontSize(8)
           .fillColor('#4b5563')
           .text(auditResult.benchmark.paybackPeriod, benchCol1, currentY + 46, { 
             width: benchColWidth,
             lineGap: 1
           });
        
        currentY += 52;
      }

      // === SECTION 4: PLAN D'ACTION (premium et élégant) ===
      doc.rect(margin, currentY, 3, 12)
         .fillColor('#06B6D4')
         .fill();
      
      doc.fontSize(11)
         .fillColor('#9333EA')
         .text('PLAN D\'ACTION EN 5 ÉTAPES', margin + 8, currentY + 2, { 
           width: contentWidth - 8,
           lineGap: 0
         });
      
      currentY += 15;
      
      const steps = [
        '1. Audit Complet',
        '2. Développement sur Mesure',
        '3. Intégration et Tests',
        '4. Formation et Accompagnement',
        '5. Suivi et Optimisation'
      ];
      
      steps.forEach((step) => {
        // Point cyan vif premium pour chaque étape
        doc.circle(margin + 3, currentY + 3, 2)
           .fillColor('#06B6D4')
           .fill();
        
        const stepHeight = calculateTextHeight(step, contentWidth - 10, 8, 0);
        doc.fontSize(8)
           .fillColor('#374151')
           .text(step, margin + 10, currentY, { 
             width: contentWidth - 10,
             lineGap: 0
           });
        currentY += Math.max(stepHeight, 8) + 1;
      });
      
      currentY += 4;

      // === SECTION 5: PROCHAINES ÉTAPES (premium) ===
      doc.rect(margin, currentY, 3, 12)
         .fillColor('#06B6D4')
         .fill();
      
      doc.fontSize(11)
         .fillColor('#9333EA')
         .text('PROCHAINES ÉTAPES', margin + 8, currentY + 2, { 
           width: contentWidth - 8,
           lineGap: 0
         });
      
      currentY += 15;
      
      const nextStepsText1 = '✓ Appel de 15 min | ✓ Devis gratuit | ✓ Garantie résultat (90%)';
      const nextStepsText2 = 'contact@skillshield-ai.com | Réponse sous 24h';
      const text1Height = calculateTextHeight(nextStepsText1, contentWidth - 10, 8, 1);
      const text2Height = calculateTextHeight(nextStepsText2, contentWidth - 10, 7.5, 1);
      const boxHeight = Math.ceil(text1Height + text2Height + 10);
      
      // Fond premium avec accent violet-cyan
      doc.rect(margin, currentY, contentWidth, boxHeight)
         .fillColor('#F8FAFC')
         .fill();
      
      doc.rect(margin, currentY, contentWidth, boxHeight)
         .strokeColor('#E5E7EB')
         .lineWidth(0.5)
         .stroke();
      
      doc.fontSize(8)
         .fillColor('#10B981')
         .text(nextStepsText1, margin + 5, currentY + 4, { 
           width: contentWidth - 10,
           lineGap: 1
         });
      
      doc.fontSize(7.5)
         .fillColor('#4b5563')
         .text(nextStepsText2, margin + 5, currentY + text1Height + 6, { 
           width: contentWidth - 10,
           align: 'center',
           lineGap: 1
         });
      
      currentY += boxHeight;

      // === FOOTER ET DISCLAIMER EN BAS ===
      // Vérifier que le contenu ne dépasse pas la zone du footer
      const footerStartY = pageHeight - 55;
      const minSpaceForFooter = 20;
      
      if (currentY > footerStartY - minSpaceForFooter) {
        // Ajuster le contenu pour qu'il tienne
        currentY = footerStartY - minSpaceForFooter;
      }
      
      const footerY = pageHeight - 45;
      const copyrightText = '© 2025 SkillShield AI. Tous droits réservés.';
      const disclaimerText = 'Ce document est la propriété exclusive de SkillShield AI. Toute reproduction, distribution ou utilisation non autorisée est strictement interdite.';
      
      const copyrightHeight = calculateTextHeight(copyrightText, contentWidth, 7.5, 0);
      const disclaimerHeight = calculateTextHeight(disclaimerText, contentWidth, 7, 2);
      
      // Footer copyright sur chaque page
      doc.fontSize(7.5)
         .fillColor('#6b7280')
         .text(copyrightText, margin, footerY, { 
           width: contentWidth,
           align: 'center',
           lineGap: 0
         });
      
      // Disclaimer en dessous
      doc.fontSize(7)
         .fillColor('#9ca3af')
         .text(disclaimerText, margin, footerY + copyrightHeight + 3, { 
           width: contentWidth,
           align: 'center',
           lineGap: 2
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
        <p style="margin-top: 30px;">
          <a href="https://calendly.com/b00784336-essec" 
             style="background: #8B5CF6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Planifier un appel (15 min)
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
