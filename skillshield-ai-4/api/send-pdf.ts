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
        margins: { top: 30, bottom: 60, left: 45, right: 45 }
      });

      const chunks: Buffer[] = [];
      
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const pageWidth = doc.page?.width || 595;
      const pageHeight = doc.page?.height || 842;
      const margin = 45;
      const contentWidth = pageWidth - 2 * margin;
      const maxY = pageHeight - 60; // Zone maximale avant le footer
      let currentY = 30;
      
      // Constantes pour une structure cohérente
      const SECTION_SPACING = 8; // Espacement entre sections (réduit)
      const SUBSECTION_SPACING = 5; // Espacement dans les sous-sections (réduit)

      // === EN-TÊTE STRUCTURÉ ===
      // Barre de couleur violet vive en haut (style SkillShield)
      doc.rect(margin, currentY, contentWidth, 3)
         .fillColor('#9333EA')
         .fill();
      
      currentY += 8;
      
      // Titre principal avec style SkillShield premium
      doc.fontSize(18)
         .fillColor('#9333EA')
         .font('Helvetica-Bold')
         .text('SkillShield AI', margin, currentY, { 
           width: contentWidth,
           align: 'left',
           lineGap: 0
         });
      
      currentY += 12;
      
      doc.fontSize(11)
         .fillColor('#000000')
         .font('Helvetica-Bold')
         .text('Plan d\'Automatisation Personnalisé', margin, currentY, { 
           width: contentWidth,
           align: 'left',
           lineGap: 0
         });
      
      currentY += 14;

      // === SECTION 1: ANALYSE ===
      // Vérification d'espace avant d'ajouter la section
      if (currentY > maxY - 100) {
        doc.end();
        return;
      }
      
      // Titre de section avec accent cyan vif premium
      doc.rect(margin, currentY, 4, 10)
         .fillColor('#06B6D4')
         .fill();
      
      doc.fontSize(9)
         .fillColor('#9333EA')
         .font('Helvetica-Bold')
         .text('1. ANALYSE DE VOTRE SITUATION', margin + 8, currentY + 2, { 
           width: contentWidth - 8,
           lineGap: 0
         });
      
      currentY += 12;
      
      // Sous-titre "Problème identifié"
      doc.fontSize(7.5)
         .fillColor('#9333EA')
         .font('Helvetica-Bold')
         .text('Problème identifié :', margin, currentY, { 
           width: contentWidth,
           align: 'left',
           lineGap: 0
         });
      
      currentY += 6;
      
      const problemText = userProblem.length > 200 ? userProblem.substring(0, 200) + '...' : userProblem;
      doc.fontSize(7.5)
         .fillColor('#000000')
         .font('Helvetica')
         .text(problemText, margin, currentY, { 
           width: contentWidth,
           align: 'left',
           lineGap: 1
         });
      
      currentY += calculateTextHeight(problemText, contentWidth, 7.5, 1) + 6;
      
      // Sous-titre "Notre analyse"
      doc.fontSize(7.5)
         .fillColor('#9333EA')
         .font('Helvetica-Bold')
         .text('Notre analyse :', margin, currentY, { 
           width: contentWidth,
           align: 'left',
           lineGap: 0
         });
      
      currentY += 6;
      
      const analysisText = auditResult.analysis.length > 350 ? auditResult.analysis.substring(0, 350) + '...' : auditResult.analysis;
      doc.fontSize(7.5)
         .fillColor('#000000')
         .font('Helvetica')
         .text(analysisText, margin, currentY, { 
           width: contentWidth,
           align: 'justify',
           lineGap: 1.2
         });
      
      currentY += calculateTextHeight(analysisText, contentWidth, 7.5, 1.2) + SECTION_SPACING;

      // === SECTION 2: SOLUTIONS ===
      // Vérification d'espace
      if (currentY > maxY - 150) {
        doc.end();
        return;
      }
      
      doc.rect(margin, currentY, 4, 10)
         .fillColor('#06B6D4')
         .fill();
      
      doc.fontSize(9)
         .fillColor('#9333EA')
         .font('Helvetica-Bold')
         .text('2. SOLUTIONS D\'AUTOMATISATION IA', margin + 8, currentY + 2, { 
           width: contentWidth - 8,
           lineGap: 0
         });
      
      currentY += 12;
      
      const solutions = auditResult.suggestions;
      const gapBetweenSolutions = 5;
      
      // Affichage des solutions en pleine largeur pour une meilleure lisibilité
      solutions.slice(0, 3).forEach((suggestion, index) => {
        // Vérification d'espace avant chaque solution
        if (currentY > maxY - 80) return;
        
        const titleText = `Solution ${index + 1} : ${suggestion.title}`;
        const metaText = `Difficulté : ${suggestion.difficulty} | Temps économisé : ${suggestion.timeSaved}`;
        const maxDescLength = index < 2 ? 200 : 250; // Plus d'espace pour la dernière
        const descText = suggestion.description.length > maxDescLength 
          ? suggestion.description.substring(0, maxDescLength) + '...' 
          : suggestion.description;
        
        const titleHeight = calculateTextHeight(titleText, contentWidth - 12, 8, 0.8);
        const metaHeight = calculateTextHeight(metaText, contentWidth - 12, 7, 0.4);
        const descHeight = calculateTextHeight(descText, contentWidth - 12, 7.5, 1.2);
        const boxHeight = Math.ceil(titleHeight + metaHeight + descHeight + 10);
        
        // Vérification finale d'espace
        if (currentY + boxHeight > maxY - 60) return;
        
        // Fond subtil premium pour chaque solution
        doc.rect(margin, currentY, contentWidth, boxHeight)
           .fillColor('#F8FAFC')
           .fill();
        
        // Bordure avec couleur selon difficulté
        const borderColor = suggestion.difficulty === 'Facile' ? '#10B981' : 
                           suggestion.difficulty === 'Moyen' ? '#F59E0B' : '#EF4444';
        doc.rect(margin, currentY, contentWidth, boxHeight)
           .strokeColor(borderColor)
           .lineWidth(1)
           .stroke();
        
        let textY = currentY + 4;
        doc.fontSize(8)
           .fillColor('#9333EA')
           .font('Helvetica-Bold')
           .text(titleText, margin + 6, textY, { 
             width: contentWidth - 12,
             lineGap: 0.8
           });
        
        textY += titleHeight + 3;
        doc.fontSize(7)
           .fillColor('#6B7280')
           .font('Helvetica')
           .text(metaText, margin + 6, textY, { 
             width: contentWidth - 12,
             lineGap: 0.4
           });
        
        textY += metaHeight + 3;
        doc.fontSize(7.5)
           .fillColor('#000000')
           .font('Helvetica')
           .text(descText, margin + 6, textY, { 
             width: contentWidth - 12,
             align: 'justify',
             lineGap: 1.2
           });
        
        currentY += boxHeight + gapBetweenSolutions;
      });
      
      currentY += SUBSECTION_SPACING;

      // === SECTION 3: BENCHMARK (si disponible) ===
      if (auditResult.benchmark && currentY < maxY - 80) {
        doc.rect(margin, currentY, 4, 10)
           .fillColor('#06B6D4')
           .fill();
        
        doc.fontSize(9)
           .fillColor('#9333EA')
           .font('Helvetica-Bold')
           .text('3. BENCHMARK SECTEUR', margin + 8, currentY + 2, { 
             width: contentWidth - 8,
             lineGap: 0
           });
        
        currentY += 12;
        
        // Fond premium vif pour le benchmark
        const benchHeight = 42;
        
        // Vérification d'espace
        if (currentY + benchHeight > maxY - 60) {
          doc.end();
          return;
        }
        
        doc.rect(margin, currentY, contentWidth, benchHeight)
           .fillColor('#ECFEFF')
           .fill();
        
        doc.rect(margin, currentY, contentWidth, benchHeight)
           .strokeColor('#06B6D4')
           .lineWidth(1.5)
           .stroke();
        
        // Benchmark en 2 colonnes avec espacement harmonieux
        const benchCol1 = margin + 8;
        const benchCol2 = margin + contentWidth / 2 + 8;
        const benchColWidth = contentWidth / 2 - 16;
        const benchRowHeight = 13;
        
        let benchY = currentY + 5;
        
        // Ligne 1
        doc.fontSize(7)
           .fillColor('#9333EA')
           .font('Helvetica-Bold')
           .text('Secteur', benchCol1, benchY, { width: benchColWidth, lineGap: 0 });
        doc.fontSize(7.5)
           .fillColor('#000000')
           .font('Helvetica')
           .text(auditResult.benchmark.sectorAverage, benchCol1, benchY + 6, { 
             width: benchColWidth,
             lineGap: 0.8
           });
        
        doc.fontSize(7)
           .fillColor('#9333EA')
           .font('Helvetica-Bold')
           .text('Processus automatisés', benchCol2, benchY, { width: benchColWidth, lineGap: 0 });
        doc.fontSize(7.5)
           .fillColor('#000000')
           .font('Helvetica')
           .text(`${auditResult.benchmark.automatedProcessesPercentage}%`, benchCol2, benchY + 6, { 
             width: benchColWidth,
             lineGap: 0.8
           });
        
        benchY += benchRowHeight;
        
        // Ligne 2
        doc.fontSize(7)
           .fillColor('#9333EA')
           .font('Helvetica-Bold')
           .text('Temps économisé', benchCol1, benchY, { width: benchColWidth, lineGap: 0 });
        doc.fontSize(7.5)
           .fillColor('#000000')
           .font('Helvetica')
           .text(auditResult.benchmark.averageTimeSavedPerTask, benchCol1, benchY + 6, { 
             width: benchColWidth,
             lineGap: 0.8
           });
        
        doc.fontSize(7)
           .fillColor('#9333EA')
           .font('Helvetica-Bold')
           .text('ROI moyen', benchCol2, benchY, { width: benchColWidth, lineGap: 0 });
        doc.fontSize(7.5)
           .fillColor('#000000')
           .font('Helvetica')
           .text(auditResult.benchmark.averageROI, benchCol2, benchY + 6, { 
             width: benchColWidth,
             lineGap: 0.8
           });
        
        benchY += benchRowHeight;
        
        // Ligne 3
        doc.fontSize(7)
           .fillColor('#9333EA')
           .font('Helvetica-Bold')
           .text('Retour investissement', benchCol1, benchY, { width: benchColWidth, lineGap: 0 });
        doc.fontSize(7.5)
           .fillColor('#000000')
           .font('Helvetica')
           .text(auditResult.benchmark.paybackPeriod, benchCol1, benchY + 6, { 
             width: benchColWidth,
             lineGap: 0.8
           });
        
        currentY += benchHeight + SECTION_SPACING;
      }

      // === SECTION 4: PLAN D'ACTION ===
      if (currentY < maxY - 70) {
        doc.rect(margin, currentY, 4, 10)
           .fillColor('#06B6D4')
           .fill();
        
        doc.fontSize(9)
           .fillColor('#9333EA')
           .font('Helvetica-Bold')
           .text('4. PLAN D\'ACTION EN 5 ÉTAPES', margin + 8, currentY + 2, { 
             width: contentWidth - 8,
             lineGap: 0
           });
        
        currentY += 12;
        
        const steps = [
          'Audit Complet : Analyse approfondie de vos processus',
          'Développement sur Mesure : Création de vos agents IA',
          'Intégration et Tests : Mise en place et validation',
          'Formation et Accompagnement : Formation de votre équipe',
          'Suivi et Optimisation : Amélioration continue'
        ];
        
        steps.forEach((step, index) => {
          if (currentY < maxY - 40) {
            // Numéro dans un cercle
            doc.circle(margin + 6, currentY + 2.5, 4)
               .fillColor('#9333EA')
               .fill();
            
            doc.fontSize(7)
               .fillColor('#FFFFFF')
               .font('Helvetica-Bold')
               .text((index + 1).toString(), margin + 2.5, currentY + 0.5, { 
                 width: 8,
                 align: 'center'
               });
            
            doc.fontSize(7.5)
               .fillColor('#000000')
               .font('Helvetica')
               .text(step, margin + 14, currentY, { 
                 width: contentWidth - 14,
                 lineGap: 0.8
               });
            currentY += 8;
          }
        });
        
        currentY += SUBSECTION_SPACING;
      }

      // === SECTION 5: PROCHAINES ÉTAPES ===
      if (currentY < maxY - 60) {
        doc.rect(margin, currentY, 4, 10)
           .fillColor('#06B6D4')
           .fill();
        
        doc.fontSize(9)
           .fillColor('#9333EA')
           .font('Helvetica-Bold')
           .text('5. PROCHAINES ÉTAPES', margin + 8, currentY + 2, { 
             width: contentWidth - 8,
             lineGap: 0
           });
        
        currentY += 12;
        
        const nextStepsText1 = '✓ Appel de 15 min | ✓ Devis gratuit | ✓ Garantie résultat (90%)';
        const nextStepsText2 = 'contact@skillshield-ai.com | Réponse sous 24h | skillshield.app';
        const text1Height = calculateTextHeight(nextStepsText1, contentWidth - 12, 7.5, 0.8);
        const text2Height = calculateTextHeight(nextStepsText2, contentWidth - 12, 7, 0.4);
        const boxHeight = Math.ceil(text1Height + text2Height + 10);
        
        // Vérification d'espace
        if (currentY + boxHeight > maxY - 60) {
          doc.end();
          return;
        }
        
        // Fond premium avec accent violet-cyan
        doc.rect(margin, currentY, contentWidth, boxHeight)
           .fillColor('#F8FAFC')
           .fill();
        
        doc.rect(margin, currentY, contentWidth, boxHeight)
           .strokeColor('#9333EA')
           .lineWidth(1)
           .stroke();
        
        doc.fontSize(7.5)
           .fillColor('#10B981')
           .font('Helvetica-Bold')
           .text(nextStepsText1, margin + 6, currentY + 4, { 
             width: contentWidth - 12,
             lineGap: 0.8
           });
        
        doc.fontSize(7)
           .fillColor('#000000')
           .font('Helvetica')
           .text(nextStepsText2, margin + 6, currentY + text1Height + 4, { 
             width: contentWidth - 12,
             align: 'center',
             lineGap: 0.4
           });
        
        currentY += boxHeight;
      }

      // === FOOTER ET DISCLAIMER EN BAS ===
      const footerY = pageHeight - 55;
      const copyrightText = '© 2025 SkillShield AI. Tous droits réservés.';
      const disclaimerText = 'Ce document est la propriété exclusive de SkillShield AI. Toute reproduction, distribution ou utilisation non autorisée est strictement interdite.';
      
      // Ligne de séparation avant le footer
      doc.moveTo(margin, footerY - 8)
         .lineTo(margin + contentWidth, footerY - 8)
         .strokeColor('#E5E7EB')
         .lineWidth(0.5)
         .stroke();
      
      // Footer copyright
      doc.fontSize(6.5)
         .fillColor('#6B7280')
         .font('Helvetica')
         .text(copyrightText, margin, footerY, { 
           width: contentWidth,
           align: 'center',
           lineGap: 0
         });
      
      // Disclaimer en dessous
      doc.fontSize(6)
         .fillColor('#6B7280')
         .font('Helvetica')
         .text(disclaimerText, margin, footerY + 7, { 
           width: contentWidth,
           align: 'center',
           lineGap: 1
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
