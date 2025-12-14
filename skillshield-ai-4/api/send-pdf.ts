import type { VercelRequest, VercelResponse } from '@vercel/node';
import PDFDocument from 'pdfkit';
import nodemailer from 'nodemailer';
import { AuditResult } from '../types';

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
      
      doc.fontSize(9)
         .fillColor('#000000')
         .text(`Problème identifié : ${userProblem.substring(0, 140)}${userProblem.length > 140 ? '...' : ''}`, 
               margin, currentY, { 
                 width: contentWidth,
                 align: 'left',
                 lineGap: 1
               });
      
      currentY += 10;
      
      doc.fontSize(9)
         .fillColor('#000000')
         .text(auditResult.analysis.substring(0, 260) + (auditResult.analysis.length > 260 ? '...' : ''), 
               margin, currentY, { 
                 width: contentWidth,
                 align: 'justify',
                 lineGap: 2
               });
      
      currentY += 26;

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
      [0, 1].forEach((index) => {
        if (index < solutions.length) {
          const colX = index === 0 ? margin : margin + colWidth + 8;
          const suggestion = solutions[index];
          
          // Fond subtil premium pour chaque solution
          doc.rect(colX, currentY, colWidth, 44)
             .fillColor('#F8FAFC')
             .fill();
          
          // Bordure subtile
          doc.rect(colX, currentY, colWidth, 44)
             .strokeColor('#E5E7EB')
             .lineWidth(0.5)
             .stroke();
          
          doc.fontSize(9)
             .fillColor('#9333EA')
             .text(`${index + 1}. ${suggestion.title}`, colX + 5, currentY + 4, { 
               width: colWidth - 10,
               lineGap: 1
             });
          
          doc.fontSize(7.5)
             .fillColor('#6b7280')
             .text(`${suggestion.difficulty} • ${suggestion.timeSaved}`, 
                   colX + 5, currentY + 14, { 
                     width: colWidth - 10,
                     lineGap: 1
                   });
          
          doc.fontSize(8)
             .fillColor('#4b5563')
             .text(suggestion.description.substring(0, 120) + (suggestion.description.length > 120 ? '...' : ''), 
                   colX + 5, currentY + 23, { 
                     width: colWidth - 10,
                     align: 'justify',
                     lineGap: 1.5
                   });
        }
      });
      
      currentY += 52;
      
      // Solution 3 en pleine largeur premium
      if (solutions.length > 2) {
        const suggestion = solutions[2];
        
        doc.rect(margin, currentY, contentWidth, 40)
           .fillColor('#F8FAFC')
           .fill();
        
        doc.rect(margin, currentY, contentWidth, 40)
           .strokeColor('#E5E7EB')
           .lineWidth(0.5)
           .stroke();
        
        doc.fontSize(9)
           .fillColor('#9333EA')
           .text(`3. ${suggestion.title}`, margin + 5, currentY + 4, { 
             width: contentWidth - 10,
             lineGap: 1
           });
        
        doc.fontSize(7.5)
           .fillColor('#6b7280')
           .text(`${suggestion.difficulty} • ${suggestion.timeSaved}`, 
                 margin + 5, currentY + 14, { 
                   width: contentWidth - 10,
                   lineGap: 1
                 });
        
        doc.fontSize(8)
           .fillColor('#4b5563')
           .text(suggestion.description.substring(0, 200) + (suggestion.description.length > 200 ? '...' : ''), 
                 margin + 5, currentY + 23, { 
                   width: contentWidth - 10,
                   align: 'justify',
                   lineGap: 1.5
                 });
        
        currentY += 48;
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
        
        doc.fontSize(8)
           .fillColor('#374151')
           .text(step, margin + 10, currentY, { 
             width: contentWidth - 10,
             lineGap: 0
           });
        currentY += 9;
      });
      
      currentY += 6;

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
      
      // Fond premium avec accent violet-cyan
      doc.rect(margin, currentY, contentWidth, 22)
         .fillColor('#F8FAFC')
         .fill();
      
      doc.rect(margin, currentY, contentWidth, 22)
         .strokeColor('#E5E7EB')
         .lineWidth(0.5)
         .stroke();
      
      doc.fontSize(8)
         .fillColor('#10B981')
         .text('✓ Appel de 15 min | ✓ Devis gratuit | ✓ Garantie résultat (90%)', 
               margin + 5, currentY + 4, { 
                 width: contentWidth - 10,
                 lineGap: 1
               });
      
      doc.fontSize(7.5)
         .fillColor('#4b5563')
         .text('contact@skillshield-ai.com | Réponse sous 24h', 
               margin + 5, currentY + 14, { 
                 width: contentWidth - 10,
                 align: 'center',
                 lineGap: 1
               });

      // === FOOTER ET DISCLAIMER EN BAS ===
      const footerY = pageHeight - 45;
      
      // Footer copyright sur chaque page
      doc.fontSize(7.5)
         .fillColor('#6b7280')
         .text('© 2025 SkillShield AI. Tous droits réservés.', 
               margin, footerY, { 
                 width: contentWidth,
                 align: 'center',
                 lineGap: 0
               });
      
      // Disclaimer en dessous
      doc.fontSize(7)
         .fillColor('#9ca3af')
         .text('Ce document est la propriété exclusive de SkillShield AI. Toute reproduction, distribution ou utilisation non autorisée est strictement interdite.', 
               margin, footerY + 10, { 
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
