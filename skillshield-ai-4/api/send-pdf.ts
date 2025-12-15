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

// Fonction pour générer le PDF premium personnalisé sur UNE SEULE PAGE
function generatePDF(auditResult: AuditResult, userProblem: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 25, bottom: 50, left: 40, right: 40 }
      });

      const chunks: Buffer[] = [];
      
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const pageWidth = doc.page?.width || 595;
      const pageHeight = doc.page?.height || 842;
      const margin = 40;
      const contentWidth = pageWidth - 2 * margin;
      const maxY = pageHeight - 50; // Zone maximale avant le footer
      let currentY = 25;
      
      // Constantes pour une structure cohérente - OPTIMISÉES POUR UNE PAGE
      const SECTION_SPACING = 6; // Espacement entre sections (très réduit)
      const SUBSECTION_SPACING = 4; // Espacement dans les sous-sections (très réduit)

      // === EN-TÊTE STRUCTURÉ ===
      // Barre de couleur violet vive en haut (style SkillShield)
      doc.rect(margin, currentY, contentWidth, 2)
         .fillColor('#9333EA')
         .fill();
      
      currentY += 6;
      
      // Titre principal avec style SkillShield premium
      doc.fontSize(16)
         .fillColor('#9333EA')
         .font('Helvetica-Bold')
         .text('SkillShield AI', margin, currentY, { 
           width: contentWidth,
           align: 'left',
           lineGap: 0
         });
      
      currentY += 10;
      
      doc.fontSize(10)
         .fillColor('#000000')
         .font('Helvetica-Bold')
         .text('Plan d\'Automatisation Personnalisé', margin, currentY, { 
           width: contentWidth,
           align: 'left',
           lineGap: 0
         });
      
      currentY += 11;

      // === SECTION 1: ANALYSE ===
      // Titre de section avec accent cyan vif premium
      doc.rect(margin, currentY, 3, 8)
         .fillColor('#06B6D4')
         .fill();
      
      doc.fontSize(8)
         .fillColor('#9333EA')
         .font('Helvetica-Bold')
         .text('1. ANALYSE DE VOTRE SITUATION', margin + 6, currentY + 1, { 
           width: contentWidth - 6,
           lineGap: 0
         });
      
      currentY += 10;
      
      // Sous-titre "Problème identifié"
      doc.fontSize(7)
         .fillColor('#9333EA')
         .font('Helvetica-Bold')
         .text('Problème identifié :', margin, currentY, { 
           width: contentWidth,
           align: 'left',
           lineGap: 0
         });
      
      currentY += 5;
      
      const problemText = userProblem.length > 180 ? userProblem.substring(0, 180) + '...' : userProblem;
      doc.fontSize(7)
         .fillColor('#000000')
         .font('Helvetica')
         .text(problemText, margin, currentY, { 
           width: contentWidth,
           align: 'left',
           lineGap: 0.8
         });
      
      currentY += calculateTextHeight(problemText, contentWidth, 7, 0.8) + 5;
      
      // Sous-titre "Notre analyse"
      doc.fontSize(7)
         .fillColor('#9333EA')
         .font('Helvetica-Bold')
         .text('Notre analyse :', margin, currentY, { 
           width: contentWidth,
           align: 'left',
           lineGap: 0
         });
      
      currentY += 5;
      
      const analysisText = auditResult.analysis.length > 280 ? auditResult.analysis.substring(0, 280) + '...' : auditResult.analysis;
      doc.fontSize(7)
         .fillColor('#000000')
         .font('Helvetica')
         .text(analysisText, margin, currentY, { 
           width: contentWidth,
           align: 'justify',
           lineGap: 1
         });
      
      currentY += calculateTextHeight(analysisText, contentWidth, 7, 1) + SECTION_SPACING;

      // === SECTION 2: SOLUTIONS ===
      doc.rect(margin, currentY, 3, 8)
         .fillColor('#06B6D4')
         .fill();
      
      doc.fontSize(8)
         .fillColor('#9333EA')
         .font('Helvetica-Bold')
         .text('2. SOLUTIONS D\'AUTOMATISATION IA', margin + 6, currentY + 1, { 
           width: contentWidth - 6,
           lineGap: 0
         });
      
      currentY += 10;
      
      const solutions = auditResult.suggestions;
      const gapBetweenSolutions = 4;
      
      // Affichage des solutions en pleine largeur pour une meilleure lisibilité
      solutions.slice(0, 3).forEach((suggestion, index) => {
        const titleText = `Solution ${index + 1} : ${suggestion.title}`;
        const metaText = `Difficulté : ${suggestion.difficulty} | Temps économisé : ${suggestion.timeSaved}`;
        const maxDescLength = index < 2 ? 140 : 160; // Longueur réduite pour tenir sur une page
        const descText = suggestion.description.length > maxDescLength 
          ? suggestion.description.substring(0, maxDescLength) + '...' 
          : suggestion.description;
        
        const titleHeight = calculateTextHeight(titleText, contentWidth - 10, 7.5, 0.7);
        const metaHeight = calculateTextHeight(metaText, contentWidth - 10, 6.5, 0.3);
        const descHeight = calculateTextHeight(descText, contentWidth - 10, 7, 1);
        const boxHeight = Math.ceil(titleHeight + metaHeight + descHeight + 8);
        
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
        
        let textY = currentY + 3;
        doc.fontSize(7.5)
           .fillColor('#9333EA')
           .font('Helvetica-Bold')
           .text(titleText, margin + 5, textY, { 
             width: contentWidth - 10,
             lineGap: 0.7
           });
        
        textY += titleHeight + 2;
        doc.fontSize(6.5)
           .fillColor('#6B7280')
           .font('Helvetica')
           .text(metaText, margin + 5, textY, { 
             width: contentWidth - 10,
             lineGap: 0.3
           });
        
        textY += metaHeight + 2;
        doc.fontSize(7)
           .fillColor('#000000')
           .font('Helvetica')
           .text(descText, margin + 5, textY, { 
             width: contentWidth - 10,
             align: 'justify',
             lineGap: 1
           });
        
        currentY += boxHeight + gapBetweenSolutions;
      });
      
      currentY += SUBSECTION_SPACING;

      // === SECTION 3: BENCHMARK (si disponible) ===
      if (auditResult.benchmark) {
        doc.rect(margin, currentY, 3, 8)
           .fillColor('#06B6D4')
           .fill();
        
        doc.fontSize(8)
           .fillColor('#9333EA')
           .font('Helvetica-Bold')
           .text('3. BENCHMARK SECTEUR', margin + 6, currentY + 1, { 
             width: contentWidth - 6,
             lineGap: 0
           });
        
        currentY += 10;
        
        // Fond premium vif pour le benchmark
        const benchHeight = 35;
        
        doc.rect(margin, currentY, contentWidth, benchHeight)
           .fillColor('#ECFEFF')
           .fill();
        
        doc.rect(margin, currentY, contentWidth, benchHeight)
           .strokeColor('#06B6D4')
           .lineWidth(1.5)
           .stroke();
        
        // Benchmark en 2 colonnes avec espacement harmonieux
        const benchCol1 = margin + 6;
        const benchCol2 = margin + contentWidth / 2 + 6;
        const benchColWidth = contentWidth / 2 - 12;
        const benchRowHeight = 11;
        
        let benchY = currentY + 4;
        
        // Ligne 1
        doc.fontSize(6.5)
           .fillColor('#9333EA')
           .font('Helvetica-Bold')
           .text('Secteur', benchCol1, benchY, { width: benchColWidth, lineGap: 0 });
        doc.fontSize(7)
           .fillColor('#000000')
           .font('Helvetica')
           .text(auditResult.benchmark.sectorAverage, benchCol1, benchY + 5, { 
             width: benchColWidth,
             lineGap: 0.6
           });
        
        doc.fontSize(6.5)
           .fillColor('#9333EA')
           .font('Helvetica-Bold')
           .text('Processus automatisés', benchCol2, benchY, { width: benchColWidth, lineGap: 0 });
        doc.fontSize(7)
           .fillColor('#000000')
           .font('Helvetica')
           .text(`${auditResult.benchmark.automatedProcessesPercentage}%`, benchCol2, benchY + 5, { 
             width: benchColWidth,
             lineGap: 0.6
           });
        
        benchY += benchRowHeight;
        
        // Ligne 2
        doc.fontSize(6.5)
           .fillColor('#9333EA')
           .font('Helvetica-Bold')
           .text('Temps économisé', benchCol1, benchY, { width: benchColWidth, lineGap: 0 });
        doc.fontSize(7)
           .fillColor('#000000')
           .font('Helvetica')
           .text(auditResult.benchmark.averageTimeSavedPerTask, benchCol1, benchY + 5, { 
             width: benchColWidth,
             lineGap: 0.6
           });
        
        doc.fontSize(6.5)
           .fillColor('#9333EA')
           .font('Helvetica-Bold')
           .text('ROI moyen', benchCol2, benchY, { width: benchColWidth, lineGap: 0 });
        doc.fontSize(7)
           .fillColor('#000000')
           .font('Helvetica')
           .text(auditResult.benchmark.averageROI, benchCol2, benchY + 5, { 
             width: benchColWidth,
             lineGap: 0.6
           });
        
        benchY += benchRowHeight;
        
        // Ligne 3
        doc.fontSize(6.5)
           .fillColor('#9333EA')
           .font('Helvetica-Bold')
           .text('Retour investissement', benchCol1, benchY, { width: benchColWidth, lineGap: 0 });
        doc.fontSize(7)
           .fillColor('#000000')
           .font('Helvetica')
           .text(auditResult.benchmark.paybackPeriod, benchCol1, benchY + 5, { 
             width: benchColWidth,
             lineGap: 0.6
           });
        
        currentY += benchHeight + SECTION_SPACING;
      }

      // === SECTION 4: PLAN D'ACTION ===
      doc.rect(margin, currentY, 3, 8)
         .fillColor('#06B6D4')
         .fill();
      
      doc.fontSize(8)
         .fillColor('#9333EA')
         .font('Helvetica-Bold')
         .text('4. PLAN D\'ACTION EN 5 ÉTAPES', margin + 6, currentY + 1, { 
           width: contentWidth - 6,
           lineGap: 0
         });
      
      currentY += 10;
      
      const steps = [
        'Audit Complet : Analyse approfondie de vos processus',
        'Développement sur Mesure : Création de vos agents IA',
        'Intégration et Tests : Mise en place et validation',
        'Formation et Accompagnement : Formation de votre équipe',
        'Suivi et Optimisation : Amélioration continue'
      ];
      
      steps.forEach((step, index) => {
        // Numéro dans un cercle
        doc.circle(margin + 5, currentY + 2, 3.5)
           .fillColor('#9333EA')
           .fill();
        
        doc.fontSize(6.5)
           .fillColor('#FFFFFF')
           .font('Helvetica-Bold')
           .text((index + 1).toString(), margin + 2, currentY + 0.5, { 
             width: 7,
             align: 'center'
           });
        
        doc.fontSize(7)
           .fillColor('#000000')
           .font('Helvetica')
           .text(step, margin + 12, currentY, { 
             width: contentWidth - 12,
             lineGap: 0.7
           });
        currentY += 7;
      });
      
      currentY += SUBSECTION_SPACING;

      // === SECTION 5: PROCHAINES ÉTAPES ===
      doc.rect(margin, currentY, 3, 8)
         .fillColor('#06B6D4')
         .fill();
      
      doc.fontSize(8)
         .fillColor('#9333EA')
         .font('Helvetica-Bold')
         .text('5. PROCHAINES ÉTAPES', margin + 6, currentY + 1, { 
           width: contentWidth - 6,
           lineGap: 0
         });
      
      currentY += 10;
      
      const nextStepsText1 = '✓ Appel de 15 min | ✓ Devis gratuit | ✓ Garantie résultat (90%)';
      const nextStepsText2 = 'contact@skillshield-ai.com | Réponse sous 24h | skillshield.app';
      const text1Height = calculateTextHeight(nextStepsText1, contentWidth - 10, 7, 0.7);
      const text2Height = calculateTextHeight(nextStepsText2, contentWidth - 10, 6.5, 0.3);
      const boxHeight = Math.ceil(text1Height + text2Height + 8);
      
      // Fond premium avec accent violet-cyan
      doc.rect(margin, currentY, contentWidth, boxHeight)
         .fillColor('#F8FAFC')
         .fill();
      
      doc.rect(margin, currentY, contentWidth, boxHeight)
         .strokeColor('#9333EA')
         .lineWidth(1)
         .stroke();
      
      doc.fontSize(7)
         .fillColor('#10B981')
         .font('Helvetica-Bold')
         .text(nextStepsText1, margin + 5, currentY + 3, { 
           width: contentWidth - 10,
           lineGap: 0.7
         });
      
      doc.fontSize(6.5)
         .fillColor('#000000')
         .font('Helvetica')
         .text(nextStepsText2, margin + 5, currentY + text1Height + 3, { 
           width: contentWidth - 10,
           align: 'center',
           lineGap: 0.3
         });
      
      currentY += boxHeight;

      // === FOOTER ET DISCLAIMER EN BAS ===
      const footerY = pageHeight - 45;
      const copyrightText = '© 2025 SkillShield AI. Tous droits réservés.';
      const disclaimerText = 'Ce document est la propriété exclusive de SkillShield AI. Toute reproduction, distribution ou utilisation non autorisée est strictement interdite.';
      
      // Ligne de séparation avant le footer
      doc.moveTo(margin, footerY - 6)
         .lineTo(margin + contentWidth, footerY - 6)
         .strokeColor('#E5E7EB')
         .lineWidth(0.5)
         .stroke();
      
      // Footer copyright
      doc.fontSize(6)
         .fillColor('#6B7280')
         .font('Helvetica')
         .text(copyrightText, margin, footerY, { 
           width: contentWidth,
           align: 'center',
           lineGap: 0
         });
      
      // Disclaimer en dessous
      doc.fontSize(5.5)
         .fillColor('#6B7280')
         .font('Helvetica')
         .text(disclaimerText, margin, footerY + 6, { 
           width: contentWidth,
           align: 'center',
           lineGap: 0.8
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
