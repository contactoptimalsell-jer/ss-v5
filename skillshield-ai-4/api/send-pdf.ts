import type { VercelRequest, VercelResponse } from '@vercel/node';
import PDFDocument from 'pdfkit';
import nodemailer from 'nodemailer';
import { AuditResult } from '../types';

// Fonction pour dessiner le logo SkillShield professionnel dans le PDF
function drawLogo(doc: PDFKit.PDFDocument, x: number, y: number, size: number) {
  try {
    const centerX = x + size / 2;
    const centerY = y + size / 2;
    const scale = size / 100; // Facteur d'échelle
    
    // Couleurs professionnelles
    const shieldColor = '#3b82f6'; // Bleu professionnel
    const brainColor = '#60a5fa'; // Cyan clair
    const circuitColor = '#1e40af'; // Bleu foncé
    
    // Lignes de circuit (arrière-plan)
    doc.moveTo(centerX - 35 * scale, centerY - 20 * scale)
       .lineTo(centerX - 25 * scale, centerY - 15 * scale)
       .strokeColor(circuitColor)
       .opacity(0.4)
       .lineWidth(1.5 * scale)
       .stroke();
    
    doc.moveTo(centerX + 35 * scale, centerY - 20 * scale)
       .lineTo(centerX + 25 * scale, centerY - 15 * scale)
       .strokeColor(circuitColor)
       .opacity(0.4)
       .lineWidth(1.5 * scale)
       .stroke();
    
    doc.circle(centerX - 35 * scale, centerY - 20 * scale, 2 * scale).fillColor(circuitColor).opacity(0.4).fill();
    doc.circle(centerX + 35 * scale, centerY - 20 * scale, 2 * scale).fillColor(circuitColor).opacity(0.4).fill();
    
    // Bouclier - forme arrondie professionnelle
    // Base du bouclier
    doc.moveTo(centerX, centerY + 20 * scale)
       .lineTo(centerX - 18 * scale, centerY + 15 * scale)
       .lineTo(centerX - 20 * scale, centerY - 5 * scale)
       .lineTo(centerX - 15 * scale, centerY - 20 * scale)
       .lineTo(centerX, centerY - 25 * scale)
       .lineTo(centerX + 15 * scale, centerY - 20 * scale)
       .lineTo(centerX + 20 * scale, centerY - 5 * scale)
       .lineTo(centerX + 18 * scale, centerY + 15 * scale)
       .closePath()
       .fillColor(shieldColor)
       .opacity(0.9)
       .fill()
       .strokeColor('#1e40af')
       .opacity(1)
       .lineWidth(2 * scale)
       .stroke();
    
    // Pointe du bouclier
    doc.moveTo(centerX, centerY - 25 * scale)
       .lineTo(centerX - 12 * scale, centerY - 18 * scale)
       .lineTo(centerX, centerY - 22 * scale)
       .lineTo(centerX + 12 * scale, centerY - 18 * scale)
       .closePath()
       .fillColor(shieldColor)
       .opacity(0.9)
       .fill()
       .strokeColor('#1e40af')
       .opacity(1)
       .lineWidth(2 * scale)
       .stroke();
    
    // Cerveau - hémisphères avec détails
    // Hémisphère gauche
    doc.circle(centerX - 6 * scale, centerY - 2 * scale, 6 * scale)
       .strokeColor(brainColor)
       .lineWidth(2.5 * scale)
       .stroke();
    
    // Hémisphère droit
    doc.circle(centerX + 6 * scale, centerY - 2 * scale, 6 * scale)
       .strokeColor(brainColor)
       .lineWidth(2.5 * scale)
       .stroke();
    
    // Détails du cerveau (gyri)
    doc.circle(centerX - 8 * scale, centerY - 4 * scale, 1.5 * scale).fillColor(brainColor).fill();
    doc.circle(centerX + 8 * scale, centerY - 4 * scale, 1.5 * scale).fillColor(brainColor).fill();
    doc.circle(centerX - 6 * scale, centerY + 2 * scale, 1.2 * scale).fillColor(brainColor).fill();
    doc.circle(centerX + 6 * scale, centerY + 2 * scale, 1.2 * scale).fillColor(brainColor).fill();
    doc.circle(centerX - 4 * scale, centerY - 1 * scale, 1 * scale).fillColor(brainColor).fill();
    doc.circle(centerX + 4 * scale, centerY - 1 * scale, 1 * scale).fillColor(brainColor).fill();
    
  } catch (error) {
    console.error('Erreur lors du dessin du logo:', error);
  }
}

// Fonction pour générer le PDF personnalisé sur une seule page
function generatePDF(auditResult: AuditResult, userProblem: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 40, bottom: 60, left: 40, right: 40 }
      });

      const chunks: Buffer[] = [];
      
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const pageWidth = doc.page?.width || 595;
      const pageHeight = doc.page?.height || 842;
      const margin = 40;
      const contentWidth = pageWidth - 2 * margin;
      let currentY = margin;

      // === EN-TÊTE AVEC LOGO ===
      const logoSize = 45;
      const logoX = (pageWidth - logoSize) / 2;
      
      try {
        drawLogo(doc, logoX, currentY, logoSize);
      } catch (logoError) {
        console.error('Erreur logo:', logoError);
      }
      
      currentY += logoSize + 8;
      
      // Titre principal
      doc.fontSize(20)
         .fillColor('#1e40af')
         .text('SkillShield AI', logoX, currentY, { width: logoSize, align: 'center' });
      
      currentY += 20;
      
      doc.fontSize(14)
         .fillColor('#374151')
         .text('Plan d\'Automatisation Personnalisé', margin, currentY, { 
           width: contentWidth, 
           align: 'center' 
         });
      
      currentY += 25;

      // === SECTION 1: ANALYSE ===
      doc.fontSize(11)
         .fillColor('#1e40af')
         .text('ANALYSE DE VOTRE SITUATION', margin, currentY, { 
           width: contentWidth,
           underline: true 
         });
      
      currentY += 15;
      
      doc.fontSize(9)
         .fillColor('#4b5563')
         .text(`Problème identifié : ${userProblem.substring(0, 120)}${userProblem.length > 120 ? '...' : ''}`, 
               margin, currentY, { 
                 width: contentWidth,
                 align: 'left'
               });
      
      currentY += 12;
      
      doc.fontSize(9)
         .fillColor('#374151')
         .text(auditResult.analysis.substring(0, 200) + (auditResult.analysis.length > 200 ? '...' : ''), 
               margin, currentY, { 
                 width: contentWidth,
                 align: 'justify'
               });
      
      currentY += 35;

      // === SECTION 2: SOLUTIONS (2 colonnes) ===
      doc.fontSize(11)
         .fillColor('#1e40af')
         .text('SOLUTIONS D\'AUTOMATISATION IA', margin, currentY, { 
           width: contentWidth,
           underline: true 
         });
      
      currentY += 15;
      
      const colWidth = (contentWidth - 10) / 2;
      auditResult.suggestions.forEach((suggestion, index) => {
        const colX = index % 2 === 0 ? margin : margin + colWidth + 10;
        if (index % 2 === 0 && index > 0) {
          currentY += 55; // Nouvelle ligne
        }
        
        doc.fontSize(9)
           .fillColor('#2563eb')
           .text(`${index + 1}. ${suggestion.title}`, colX, currentY, { 
             width: colWidth,
             align: 'left'
           });
        
        const nextY = currentY + 10;
        
        doc.fontSize(8)
           .fillColor('#6b7280')
           .text(`Difficulté: ${suggestion.difficulty} | Temps: ${suggestion.timeSaved}`, 
                 colX, nextY, { 
                   width: colWidth
                 });
        
        doc.fontSize(8)
           .fillColor('#4b5563')
           .text(suggestion.description.substring(0, 100) + (suggestion.description.length > 100 ? '...' : ''), 
                 colX, nextY + 8, { 
                   width: colWidth,
                   align: 'justify'
                 });
      });
      
      currentY += 70;

      // === SECTION 3: BENCHMARK (si disponible) ===
      if (auditResult.benchmark) {
        doc.fontSize(11)
           .fillColor('#1e40af')
           .text('BENCHMARK SECTEUR', margin, currentY, { 
             width: contentWidth,
             underline: true 
           });
        
        currentY += 15;
        
        // Benchmark en 2 colonnes
        const benchCol1 = margin;
        const benchCol2 = margin + contentWidth / 2 + 5;
        const benchColWidth = contentWidth / 2 - 5;
        
        doc.fontSize(8)
           .fillColor('#4b5563')
           .text(`Secteur: ${auditResult.benchmark.sectorAverage}`, benchCol1, currentY, { width: benchColWidth });
        
        doc.fontSize(8)
           .fillColor('#4b5563')
           .text(`Processus automatisés: ${auditResult.benchmark.automatedProcessesPercentage}%`, 
                 benchCol2, currentY, { width: benchColWidth });
        
        currentY += 10;
        
        doc.fontSize(8)
           .fillColor('#4b5563')
           .text(`Temps économisé: ${auditResult.benchmark.averageTimeSavedPerTask}`, 
                 benchCol1, currentY, { width: benchColWidth });
        
        doc.fontSize(8)
           .fillColor('#4b5563')
           .text(`ROI moyen: ${auditResult.benchmark.averageROI}`, 
                 benchCol2, currentY, { width: benchColWidth });
        
        currentY += 10;
        
        doc.fontSize(8)
           .fillColor('#4b5563')
           .text(`Retour investissement: ${auditResult.benchmark.paybackPeriod}`, 
                 benchCol1, currentY, { width: benchColWidth });
        
        currentY += 20;
      }

      // === SECTION 4: PLAN D'ACTION (compact) ===
      doc.fontSize(11)
         .fillColor('#1e40af')
         .text('PLAN D\'ACTION EN 5 ÉTAPES', margin, currentY, { 
           width: contentWidth,
           underline: true 
         });
      
      currentY += 15;
      
      const steps = [
        '1. Audit Complet - Analyse approfondie de vos processus',
        '2. Développement sur Mesure - Création d\'agents IA personnalisés',
        '3. Intégration et Tests - Mise en place dans votre environnement',
        '4. Formation et Accompagnement - Transition en douceur',
        '5. Suivi et Optimisation - Maximisation du ROI'
      ];
      
      steps.forEach((step) => {
        doc.fontSize(8)
           .fillColor('#374151')
           .text(step, margin + 5, currentY, { 
             width: contentWidth - 10
           });
        currentY += 10;
      });
      
      currentY += 10;

      // === SECTION 5: PROCHAINES ÉTAPES (compact) ===
      doc.fontSize(11)
         .fillColor('#1e40af')
         .text('PROCHAINES ÉTAPES', margin, currentY, { 
           width: contentWidth,
           underline: true 
         });
      
      currentY += 12;
      
      doc.fontSize(8)
         .fillColor('#059669')
         .text('✓ Appel de 15 min | ✓ Devis gratuit | ✓ Garantie résultat (90%)', 
               margin, currentY, { 
                 width: contentWidth
               });
      
      currentY += 10;
      
      doc.fontSize(8)
         .fillColor('#4b5563')
         .text('Contact: contact@skillshield-ai.com | Réponse sous 24h', 
               margin, currentY, { 
                 width: contentWidth,
                 align: 'center'
               });

      // === DISCLAIMER EN BAS ===
      const disclaimerY = pageHeight - 50;
      doc.fontSize(7)
         .fillColor('#6b7280')
         .text(`© ${new Date().getFullYear()} SkillShield AI. Tous droits réservés.`, 
               margin, disclaimerY, { 
                 width: contentWidth,
                 align: 'center'
               });
      
      doc.fontSize(6.5)
         .fillColor('#9ca3af')
         .text('Ce document est la propriété exclusive de SkillShield AI. Toute reproduction, distribution ou utilisation non autorisée est strictement interdite.', 
               margin, disclaimerY + 8, { 
                 width: contentWidth,
                 align: 'center'
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
        <h2 style="color: #1e40af;">Bonjour,</h2>
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
             style="background: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
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
