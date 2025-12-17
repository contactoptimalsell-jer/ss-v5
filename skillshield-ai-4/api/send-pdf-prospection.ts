import type { VercelRequest, VercelResponse } from '@vercel/node';
import PDFDocument from 'pdfkit';
import nodemailer from 'nodemailer';
import { AuditResult } from '../types';
import { canSendEmail, recordEmailSend, tryLockEmail } from './emailRateLimit.js';
import { getBenchmarkForSector } from '../utils/sectorDetection.js';

// Les fonctions detectSector et getBenchmarkForProblem sont maintenant dans utils/sectorDetection.ts
// Importées via getBenchmarkForSector

function getBenchmarkForProblem(userProblem: string) {
  return getBenchmarkForSector(userProblem);
}

// Fonction helper pour calculer la hauteur approximative du texte
function calculateTextHeight(text: string, width: number, fontSize: number, lineGap: number = 0): number {
  const avgCharsPerLine = Math.floor(width / (fontSize * 0.6));
  const lines = Math.ceil(text.length / avgCharsPerLine);
  return lines * fontSize + (lines - 1) * lineGap;
}

// Fonction pour calculer la hauteur d'un cadre avec padding adaptatif
function calculateAdaptiveBoxHeight(
  elements: Array<{ text: string; fontSize: number; lineGap: number }>,
  width: number,
  minPadding: number = 8,
  spacing: number = 3
): number {
  let totalHeight = 0;
  elements.forEach((element, index) => {
    const elementHeight = calculateTextHeight(element.text, width, element.fontSize, element.lineGap);
    totalHeight += elementHeight;
    if (index < elements.length - 1) {
      totalHeight += spacing;
    }
  });
  return Math.ceil(totalHeight + (minPadding * 2));
}

// Fonction pour générer le PDF (même logique que send-pdf.ts)
function generatePDF(auditResult: AuditResult, userProblem: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      let sectorBenchmark;
      try {
        sectorBenchmark = getBenchmarkForProblem(userProblem);
        console.log('✅ Benchmark détecté:', sectorBenchmark.sectorAverage);
      } catch (benchmarkError: any) {
        console.error('❌ Erreur lors de la détection du benchmark:', benchmarkError);
        sectorBenchmark = {
          sectorName: 'Entreprises Françaises',
          automatedProcessesPercentage: 60,
          averageTimeSavedPerTask: '8-12h / semaine',
          averageROI: '250-450%',
          paybackPeriod: '3-10 mois',
          sectorAverage: 'entreprises françaises'
        };
      }
      
      const benchmark = auditResult.benchmark ? {
        ...auditResult.benchmark,
        automatedProcessesPercentage: sectorBenchmark.automatedProcessesPercentage,
        averageTimeSavedPerTask: sectorBenchmark.averageTimeSavedPerTask,
        averageROI: sectorBenchmark.averageROI,
        paybackPeriod: sectorBenchmark.paybackPeriod,
        sectorAverage: sectorBenchmark.sectorAverage
      } : {
        automatedProcessesPercentage: sectorBenchmark.automatedProcessesPercentage,
        averageTimeSavedPerTask: sectorBenchmark.averageTimeSavedPerTask,
        averageROI: sectorBenchmark.averageROI,
        paybackPeriod: sectorBenchmark.paybackPeriod,
        sectorAverage: sectorBenchmark.sectorAverage
      };
      
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
      const margin = 30;
      const contentWidth = pageWidth - 2 * margin;
      const maxY = pageHeight - 35;
      let currentY = 20;
      
      // En-tête
      doc.rect(margin, currentY, contentWidth, 2)
         .fillColor('#9333EA')
         .fill();
      currentY += 6;
      
      doc.fontSize(20)
         .fillColor('#9333EA')
         .font('Helvetica-Bold')
         .text('SkillShield AI', margin, currentY, { width: contentWidth, align: 'left', lineGap: 0 });
      currentY += 22;
      
      doc.fontSize(13)
         .fillColor('#000000')
         .font('Helvetica-Bold')
         .text('Plan d\'Automatisation Personnalisé', margin, currentY, { width: contentWidth, align: 'left', lineGap: 0 });
      currentY += 19;
      
      // Section 1: Analyse
      doc.fontSize(11)
         .fillColor('#9333EA')
         .font('Helvetica-Bold')
         .text('1. ANALYSE DE VOTRE SITUATION', margin, currentY, { width: contentWidth, align: 'left', lineGap: 0 });
      currentY += 15;
      
      doc.fontSize(9.5)
         .fillColor('#000000')
         .font('Helvetica-Bold')
         .text('Problème identifié :', margin, currentY, { width: contentWidth, align: 'left', lineGap: 0 });
      currentY += 9;
      
      doc.fontSize(9)
         .fillColor('#000000')
         .font('Helvetica')
         .text(userProblem.substring(0, 300), margin, currentY, { width: contentWidth, align: 'left', lineGap: 1.1 });
      currentY += calculateTextHeight(userProblem.substring(0, 300), contentWidth, 9, 1.1) + 9;
      
      doc.fontSize(9.5)
         .fillColor('#000000')
         .font('Helvetica-Bold')
         .text('Notre analyse :', margin, currentY, { width: contentWidth, align: 'left', lineGap: 0 });
      currentY += 9;
      
      doc.fontSize(9)
         .fillColor('#000000')
         .font('Helvetica')
         .text(auditResult.analysis.substring(0, 400), margin, currentY, { width: contentWidth, align: 'left', lineGap: 1.1 });
      currentY += calculateTextHeight(auditResult.analysis.substring(0, 400), contentWidth, 9, 1.1) + 17;
      
      // Section 2: Solutions
      doc.fontSize(11)
         .fillColor('#9333EA')
         .font('Helvetica-Bold')
         .text('2. SOLUTIONS D\'AUTOMATISATION IA', margin, currentY, { width: contentWidth, align: 'left', lineGap: 0 });
      currentY += 15;
      
      auditResult.suggestions.forEach((suggestion, index) => {
        if (currentY > maxY - 100) return;
        
        const titleText = suggestion.title;
        const metaText = `Difficulté : ${suggestion.difficulty} | Temps économisé : ${suggestion.timeSaved}`;
        const descText = suggestion.description.substring(0, 200);
        const textWidth = contentWidth - 16;
        const padding = 8;
        
        const titleHeight = calculateTextHeight(titleText, textWidth, 10, 1);
        const metaHeight = calculateTextHeight(metaText, textWidth, 8.5, 0.5);
        const descHeight = calculateTextHeight(descText, textWidth, 9, 1.1);
        const boxHeight = Math.ceil(titleHeight + metaHeight + descHeight + (padding * 2) + 6);
        
        doc.rect(margin, currentY, contentWidth, boxHeight)
           .fillColor('#F8FAFC')
           .fill();
        
        const borderColor = suggestion.difficulty === 'Facile' ? '#10B981' : 
                           suggestion.difficulty === 'Moyen' ? '#F59E0B' : '#EF4444';
        doc.rect(margin, currentY, contentWidth, boxHeight)
           .strokeColor(borderColor)
           .lineWidth(1.2)
           .stroke();
        
        let textY = currentY + padding;
        doc.fontSize(10)
           .fillColor('#9333EA')
           .font('Helvetica-Bold')
           .text(titleText, margin + padding, textY, { width: textWidth, lineGap: 1 });
        textY += titleHeight + 3;
        doc.fontSize(8.5)
           .fillColor('#6B7280')
           .font('Helvetica')
           .text(metaText, margin + padding, textY, { width: textWidth, lineGap: 0.5 });
        textY += metaHeight + 3;
        doc.fontSize(9)
           .fillColor('#000000')
           .font('Helvetica')
           .text(descText, margin + padding, textY, { width: textWidth, lineGap: 1.1 });
        
        currentY += boxHeight + 10;
      });
      
      currentY += 10;
      
      // Section 3: Benchmark
      if (benchmark && currentY < maxY - 80) {
        doc.fontSize(11)
           .fillColor('#9333EA')
           .font('Helvetica-Bold')
           .text('3. BENCHMARK SECTEUR', margin, currentY, { width: contentWidth, align: 'left', lineGap: 0 });
        currentY += 15;
        
        const benchColWidth = (contentWidth - 16) / 2;
        const benchRowHeight = 20;
        const benchPadding = 8;
        const benchHeight = (benchRowHeight * 3) + (benchPadding * 2);
        
        doc.rect(margin, currentY, contentWidth, benchHeight)
           .fillColor('#E0F2FE')
           .fill();
        doc.rect(margin, currentY, contentWidth, benchHeight)
           .strokeColor('#0EA5E9')
           .lineWidth(1.2)
           .stroke();
        
        let benchY = currentY + benchPadding;
        const lineSpacing = 11;
        
        doc.fontSize(9)
           .fillColor('#000000')
           .font('Helvetica-Bold')
           .text('Secteur', margin + benchPadding, benchY, { width: benchColWidth, align: 'left' });
        doc.text('Processus automatisés', margin + benchColWidth + benchPadding, benchY, { width: benchColWidth, align: 'left' });
        benchY += lineSpacing;
        
        doc.fontSize(9.5)
           .fillColor('#000000')
           .font('Helvetica')
           .text(benchmark.sectorAverage, margin + benchPadding, benchY, { width: benchColWidth, align: 'left' });
        doc.text(`${benchmark.automatedProcessesPercentage}%`, margin + benchColWidth + benchPadding, benchY, { width: benchColWidth, align: 'left' });
        benchY += lineSpacing;
        
        doc.fontSize(9)
           .fillColor('#000000')
           .font('Helvetica-Bold')
           .text('Temps économisé', margin + benchPadding, benchY, { width: benchColWidth, align: 'left' });
        doc.text('ROI moyen', margin + benchColWidth + benchPadding, benchY, { width: benchColWidth, align: 'left' });
        benchY += lineSpacing;
        
        doc.fontSize(9.5)
           .fillColor('#000000')
           .font('Helvetica')
           .text(benchmark.averageTimeSavedPerTask, margin + benchPadding, benchY, { width: benchColWidth, align: 'left' });
        doc.text(benchmark.averageROI, margin + benchColWidth + benchPadding, benchY, { width: benchColWidth, align: 'left' });
        benchY += lineSpacing;
        
        doc.fontSize(9)
           .fillColor('#000000')
           .font('Helvetica-Bold')
           .text('Retour investissement', margin + benchPadding, benchY, { width: benchColWidth, align: 'left' });
        benchY += lineSpacing;
        
        doc.fontSize(9.5)
           .fillColor('#000000')
           .font('Helvetica')
           .text(benchmark.paybackPeriod, margin + benchPadding, benchY, { width: benchColWidth, align: 'left' });
        
        currentY += benchHeight + 15;
      }
      
      // Section 4: Plan d'action
      if (currentY < maxY - 100) {
        doc.fontSize(11)
           .fillColor('#9333EA')
           .font('Helvetica-Bold')
           .text('4. PLAN D\'ACTION EN 5 ÉTAPES', margin, currentY, { width: contentWidth, align: 'left', lineGap: 0 });
        currentY += 15;
        
        const steps = [
          '1 Audit Complet : Analyse approfondie de vos processus',
          '2 Développement sur Mesure : Création de vos agents IA',
          '3 Intégration et Tests : Mise en place et validation',
          '4 Formation et Accompagnement : Formation de votre équipe',
          '5 Suivi et Optimisation : Amélioration continue'
        ];
        
        steps.forEach((step) => {
          doc.fontSize(9)
             .fillColor('#000000')
             .font('Helvetica')
             .text(step, margin, currentY, { width: contentWidth, align: 'left', lineGap: 1 });
          currentY += 12;
        });
        currentY += 10;
      }
      
      // Section 5: Prochaines étapes
      if (currentY < maxY - 80) {
        doc.fontSize(11)
           .fillColor('#9333EA')
           .font('Helvetica-Bold')
           .text('5. PROCHAINES ÉTAPES', margin, currentY, { width: contentWidth, align: 'left', lineGap: 0 });
        currentY += 15;
        
        const nextStepsText1 = '✓ Appel de 15 min | ✓ Devis gratuit | ✓ Garantie résultat (90%)';
        const nextStepsText2 = 'contact@skillshield-ai.com | Réponse sous 24h | skillshield.app';
        const copyrightText = '© 2025 SkillShield AI. Tous droits réservés.';
        
        const textWidth = contentWidth - 16;
        const padding = 8;
        const spacing = 4;
        
        const text1Height = calculateTextHeight(nextStepsText1, textWidth, 9.5, 1);
        const text2Height = calculateTextHeight(nextStepsText2, textWidth, 9, 0.5);
        const copyrightHeight = calculateTextHeight(copyrightText, textWidth, 8, 0.5);
        const boxHeight = Math.ceil(text1Height + text2Height + copyrightHeight + (padding * 2) + (spacing * 2));
        
        doc.rect(margin, currentY, contentWidth, boxHeight)
           .fillColor('#F8FAFC')
           .fill();
        doc.rect(margin, currentY, contentWidth, boxHeight)
           .strokeColor('#9333EA')
           .lineWidth(1.2)
           .stroke();
        
        let textY = currentY + padding;
        doc.fontSize(9.5)
           .fillColor('#10B981')
           .font('Helvetica-Bold')
           .text(nextStepsText1, margin + padding, textY, { width: textWidth, lineGap: 1 });
        textY += text1Height + spacing;
        doc.fontSize(9)
           .fillColor('#000000')
           .font('Helvetica')
           .text(nextStepsText2, margin + padding, textY, { width: textWidth, align: 'center', lineGap: 0.5 });
        textY += text2Height + spacing;
        doc.fontSize(8)
           .fillColor('#6B7280')
           .font('Helvetica')
           .text(copyrightText, margin + padding, textY, { width: textWidth, align: 'center', lineGap: 0.5 });
      }
      
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

// Fonction pour envoyer l'email avec le PDF (version prospection - email direct et professionnel)
async function sendEmailWithPDF(
  toEmail: string,
  prospectName: string,
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
    subject: 'Plan d\'Automatisation Personnalisé - SkillShield AI',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #8B5CF6; margin-bottom: 20px;">Bonjour ${prospectName},</h2>
        
        <p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
          Nous avons analysé votre situation concernant : <strong>"${userProblem}"</strong>
        </p>
        
        <p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
          Nous vous proposons un <strong>Plan d'Automatisation Personnalisé</strong> qui détaille :
        </p>
        
        <ul style="color: #374151; line-height: 1.8; margin-bottom: 20px; padding-left: 20px;">
          <li>Une analyse de votre situation actuelle</li>
          <li>Des solutions d'automatisation IA concrètes et adaptées</li>
          <li>Les benchmarks de votre secteur d'activité</li>
          <li>Un plan d'action en 5 étapes pour la mise en œuvre</li>
        </ul>
        
        <p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
          <strong>Pourquoi cette analyse ?</strong><br/>
          Nous avons identifié des opportunités d'automatisation dans votre secteur qui peuvent vous faire gagner du temps et améliorer votre rentabilité.
        </p>
        
        <div style="background: linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%); color: white; padding: 20px; border-radius: 10px; margin: 25px 0;">
          <p style="font-size: 18px; font-weight: 600; margin-bottom: 15px;">Le potentiel de transformation :</p>
          <ul style="line-height: 1.8; margin: 0; padding-left: 20px;">
            <li><strong>Gains de temps :</strong> Récupérez 15-20 heures par semaine automatiquement</li>
            <li><strong>ROI :</strong> Retour sur investissement moyen de 250-450% en moins de 6 mois</li>
            <li><strong>Avantage concurrentiel :</strong> Concentrez-vous sur la croissance pendant que vos concurrents perdent du temps</li>
            <li><strong>Scalabilité :</strong> Vos agents IA travaillent 24/7 sans fatigue ni erreurs</li>
            <li><strong>Transformation durable :</strong> Un avantage concurrentiel permanent</li>
          </ul>
        </div>
        
        <div style="background: #F8FAFC; padding: 15px; border-left: 4px solid #8B5CF6; border-radius: 6px; margin: 20px 0;">
          <p style="color: #8B5CF6; font-weight: 600; margin-bottom: 10px;">Prochaine étape :</p>
          <p style="color: #374151; line-height: 1.6; margin: 0;">
            Planifiez un appel de 15 minutes avec notre équipe pour discuter de la mise en œuvre de ces solutions et des gains concrets que vous pouvez réaliser.
          </p>
        </div>
        
        <p style="margin-top: 30px; margin-bottom: 15px;">
          <a href="https://calendly.com/b00784336-essec" 
             style="background: #8B5CF6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
            Planifier un appel (15 min)
          </a>
        </p>
        
        <p style="margin-top: 20px; margin-bottom: 5px;">
          <a href="https://skillshield.app" 
             style="color: #8B5CF6; text-decoration: none; font-weight: 500;">
            Visitez notre site : skillshield.app
          </a>
        </p>
        
        <p style="color: #6b7280; font-size: 12px; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
          Cordialement,<br/>
          L'équipe SkillShield AI<br/>
          contact@skillshield-ai.com | Réponse sous 24h
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

  const { email, prospectName, auditResult, userProblem } = req.body;

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'Email invalide' });
  }

  if (!prospectName || typeof prospectName !== 'string') {
    return res.status(400).json({ error: 'Le nom du prospect est requis' });
  }

  if (!auditResult || !userProblem) {
    return res.status(400).json({ error: 'auditResult et userProblem sont requis' });
  }

  // Vérifier le rate limiting AVANT de générer le PDF
  console.log(`🔍 [send-pdf-prospection] Checking rate limit for email: ${email}`);
  const rateLimitCheck = await canSendEmail(email);
  console.log(`📊 [send-pdf-prospection] Rate limit check result:`, rateLimitCheck);
  
  if (!rateLimitCheck.canSend) {
    console.log(`❌ [send-pdf-prospection] Rate limit exceeded, blocking silently`);
    // Bloquer silencieusement sans message d'erreur
    return res.status(200).json({ 
      success: true,
      message: 'PDF envoyé avec succès !' 
    });
  }
  
  // ENREGISTRER IMMÉDIATEMENT pour éviter les race conditions
  // Si l'enregistrement échoue (email déjà présent), on bloque
  console.log(`🔒 [send-pdf-prospection] Attempting to lock email: ${email}`);
  const lockResult = await tryLockEmail(email);
  if (!lockResult.success) {
    console.log(`❌ [send-pdf-prospection] Email already locked, blocking silently`);
    // Bloquer silencieusement sans message d'erreur
    return res.status(200).json({ 
      success: true,
      message: 'PDF envoyé avec succès !' 
    });
  }
  
  console.log(`✅ [send-pdf-prospection] Email locked successfully, proceeding with PDF generation`);

  try {
    console.log('Début de la génération du PDF pour prospection...');
    const pdfBuffer = await generatePDF(auditResult as AuditResult, userProblem);
    console.log('PDF généré avec succès, taille:', pdfBuffer.length, 'bytes');

    console.log('Début de l\'envoi de l\'email de prospection...');
    await sendEmailWithPDF(email, prospectName, pdfBuffer, userProblem);
    console.log('Email de prospection envoyé avec succès');

    // L'envoi est déjà enregistré par tryLockEmail, pas besoin de ré-enregistrer

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

