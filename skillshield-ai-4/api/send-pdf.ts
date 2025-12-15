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
      const SECTION_SPACING = 12; // Espacement entre sections
      const SUBSECTION_SPACING = 8; // Espacement dans les sous-sections

      // === EN-TÊTE STRUCTURÉ ===
      // Barre de couleur violet vive en haut (style SkillShield)
      doc.rect(margin, currentY, contentWidth, 3)
         .fillColor('#9333EA')
         .fill();
      
      currentY += 10;
      
      // Titre principal avec style SkillShield premium
      doc.fontSize(22)
         .fillColor('#9333EA')
         .font('Helvetica-Bold')
         .text('SkillShield AI', margin, currentY, { 
           width: contentWidth,
           align: 'left',
           lineGap: 0
         });
      
      currentY += 16;
      
      doc.fontSize(14)
         .fillColor('#000000')
         .font('Helvetica-Bold')
         .text('Plan d\'Automatisation Personnalisé', margin, currentY, { 
           width: contentWidth,
           align: 'left',
           lineGap: 0
         });
      
      currentY += 20;

      // === SECTION 1: ANALYSE ===
      // Vérification d'espace avant d'ajouter la section
      if (currentY > maxY - 100) {
        doc.end();
        return;
      }
      
      // Titre de section avec accent cyan vif premium
      doc.rect(margin, currentY, 4, 12)
         .fillColor('#06B6D4')
         .fill();
      
      doc.fontSize(11)
         .fillColor('#9333EA')
         .font('Helvetica-Bold')
         .text('1. ANALYSE DE VOTRE SITUATION', margin + 8, currentY + 2, { 
           width: contentWidth - 8,
           lineGap: 0
         });
      
      currentY += 16;
      
      // Sous-titre "Problème identifié"
      doc.fontSize(9)
         .fillColor('#9333EA')
         .font('Helvetica-Bold')
         .text('Problème identifié :', margin, currentY, { 
           width: contentWidth,
           align: 'left',
           lineGap: 0
         });
      
      currentY += 8;
      
      const problemText = userProblem.length > 200 ? userProblem.substring(0, 200) + '...' : userProblem;
      doc.fontSize(9)
         .fillColor('#000000')
         .font('Helvetica')
         .text(problemText, margin, currentY, { 
           width: contentWidth,
           align: 'left',
           lineGap: 1.5
         });
      
      currentY += calculateTextHeight(problemText, contentWidth, 9, 1.5) + 10;
      
      // Sous-titre "Notre analyse"
      doc.fontSize(9)
         .fillColor('#9333EA')
         .font('Helvetica-Bold')
         .text('Notre analyse :', margin, currentY, { 
           width: contentWidth,
           align: 'left',
           lineGap: 0
         });
      
      currentY += 8;
      
      const analysisText = auditResult.analysis.length > 350 ? auditResult.analysis.substring(0, 350) + '...' : auditResult.analysis;
      doc.fontSize(9)
         .fillColor('#000000')
         .font('Helvetica')
         .text(analysisText, margin, currentY, { 
           width: contentWidth,
           align: 'justify',
           lineGap: 2
         });
      
      currentY += calculateTextHeight(analysisText, contentWidth, 9, 2) + SECTION_SPACING;

      // === SECTION 2: SOLUTIONS ===
      // Vérification d'espace
      if (currentY > maxY - 150) {
        doc.end();
        return;
      }
      
      doc.rect(margin, currentY, 4, 12)
         .fillColor('#06B6D4')
         .fill();
      
      doc.fontSize(11)
         .fillColor('#9333EA')
         .font('Helvetica-Bold')
         .text('2. SOLUTIONS D\'AUTOMATISATION IA', margin + 8, currentY + 2, { 
           width: contentWidth - 8,
           lineGap: 0
         });
      
      currentY += 16;
      
      const solutions = auditResult.suggestions;
      const gapBetweenSolutions = 8;
      
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
        
        const titleHeight = calculateTextHeight(titleText, contentWidth - 12, 9.5, 1);
        const metaHeight = calculateTextHeight(metaText, contentWidth - 12, 8.5, 0.5);
        const descHeight = calculateTextHeight(descText, contentWidth - 12, 9, 1.8);
        const boxHeight = Math.ceil(titleHeight + metaHeight + descHeight + 14);
        
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
        
        let textY = currentY + 6;
        doc.fontSize(9.5)
           .fillColor('#9333EA')
           .font('Helvetica-Bold')
           .text(titleText, margin + 6, textY, { 
             width: contentWidth - 12,
             lineGap: 1
           });
        
        textY += titleHeight + 5;
        doc.fontSize(8.5)
           .fillColor('#6B7280')
           .font('Helvetica')
           .text(metaText, margin + 6, textY, { 
             width: contentWidth - 12,
             lineGap: 0.5
           });
        
        textY += metaHeight + 5;
        doc.fontSize(9)
           .fillColor('#000000')
           .font('Helvetica')
           .text(descText, margin + 6, textY, { 
             width: contentWidth - 12,
             align: 'justify',
             lineGap: 1.8
           });
        
        currentY += boxHeight + gapBetweenSolutions;
      });
      
      currentY += SUBSECTION_SPACING;

      // === SECTION 3: BENCHMARK (si disponible) ===
      if (auditResult.benchmark && currentY < maxY - 80) {
        doc.rect(margin, currentY, 4, 12)
           .fillColor('#06B6D4')
           .fill();
        
        doc.fontSize(11)
           .fillColor('#9333EA')
           .font('Helvetica-Bold')
           .text('3. BENCHMARK SECTEUR', margin + 8, currentY + 2, { 
             width: contentWidth - 8,
             lineGap: 0
           });
        
        currentY += 16;
        
        // Fond premium vif pour le benchmark
        const benchHeight = 50;
        
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
        const benchRowHeight = 16;
        
        let benchY = currentY + 6;
        
        // Ligne 1
        doc.fontSize(8.5)
           .fillColor('#9333EA')
           .font('Helvetica-Bold')
           .text('Secteur', benchCol1, benchY, { width: benchColWidth, lineGap: 0 });
        doc.fontSize(9)
           .fillColor('#000000')
           .font('Helvetica')
           .text(auditResult.benchmark.sectorAverage, benchCol1, benchY + 8, { 
             width: benchColWidth,
             lineGap: 1
           });
        
        doc.fontSize(8.5)
           .fillColor('#9333EA')
           .font('Helvetica-Bold')
           .text('Processus automatisés', benchCol2, benchY, { width: benchColWidth, lineGap: 0 });
        doc.fontSize(9)
           .fillColor('#000000')
           .font('Helvetica')
           .text(`${auditResult.benchmark.automatedProcessesPercentage}%`, benchCol2, benchY + 8, { 
             width: benchColWidth,
             lineGap: 1
           });
        
        benchY += benchRowHeight;
        
        // Ligne 2
        doc.fontSize(8.5)
           .fillColor('#9333EA')
           .font('Helvetica-Bold')
           .text('Temps économisé', benchCol1, benchY, { width: benchColWidth, lineGap: 0 });
        doc.fontSize(9)
           .fillColor('#000000')
           .font('Helvetica')
           .text(auditResult.benchmark.averageTimeSavedPerTask, benchCol1, benchY + 8, { 
             width: benchColWidth,
             lineGap: 1
           });
        
        doc.fontSize(8.5)
           .fillColor('#9333EA')
           .font('Helvetica-Bold')
           .text('ROI moyen', benchCol2, benchY, { width: benchColWidth, lineGap: 0 });
        doc.fontSize(9)
           .fillColor('#000000')
           .font('Helvetica')
           .text(auditResult.benchmark.averageROI, benchCol2, benchY + 8, { 
             width: benchColWidth,
             lineGap: 1
           });
        
        benchY += benchRowHeight;
        
        // Ligne 3
        doc.fontSize(8.5)
           .fillColor('#9333EA')
           .font('Helvetica-Bold')
           .text('Retour investissement', benchCol1, benchY, { width: benchColWidth, lineGap: 0 });
        doc.fontSize(9)
           .fillColor('#000000')
           .font('Helvetica')
           .text(auditResult.benchmark.paybackPeriod, benchCol1, benchY + 8, { 
             width: benchColWidth,
             lineGap: 1
           });
        
        currentY += benchHeight + SECTION_SPACING;
      }

      // === SECTION 4: PLAN D'ACTION ===
      if (currentY < maxY - 70) {
        doc.rect(margin, currentY, 4, 12)
           .fillColor('#06B6D4')
           .fill();
        
        doc.fontSize(11)
           .fillColor('#9333EA')
           .font('Helvetica-Bold')
           .text('4. PLAN D\'ACTION EN 5 ÉTAPES', margin + 8, currentY + 2, { 
             width: contentWidth - 8,
             lineGap: 0
           });
        
        currentY += 16;
        
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
            doc.circle(margin + 6, currentY + 3, 5)
               .fillColor('#9333EA')
               .fill();
            
            doc.fontSize(8.5)
               .fillColor('#FFFFFF')
               .font('Helvetica-Bold')
               .text((index + 1).toString(), margin + 3, currentY + 1, { 
                 width: 10,
                 align: 'center'
               });
            
            doc.fontSize(9)
               .fillColor('#000000')
               .font('Helvetica')
               .text(step, margin + 16, currentY, { 
                 width: contentWidth - 16,
                 lineGap: 1.2
               });
            currentY += 10;
          }
        });
        
        currentY += SUBSECTION_SPACING;
      }

      // === SECTION 5: PROCHAINES ÉTAPES ===
      if (currentY < maxY - 60) {
        doc.rect(margin, currentY, 4, 12)
           .fillColor('#06B6D4')
           .fill();
        
        doc.fontSize(11)
           .fillColor('#9333EA')
           .font('Helvetica-Bold')
           .text('5. PROCHAINES ÉTAPES', margin + 8, currentY + 2, { 
             width: contentWidth - 8,
             lineGap: 0
           });
        
        currentY += 16;
        
        const nextStepsText1 = '✓ Appel de 15 min | ✓ Devis gratuit | ✓ Garantie résultat (90%)';
        const nextStepsText2 = 'contact@skillshield-ai.com | Réponse sous 24h | skillshield.app';
        const text1Height = calculateTextHeight(nextStepsText1, contentWidth - 12, 9, 1);
        const text2Height = calculateTextHeight(nextStepsText2, contentWidth - 12, 8.5, 0.5);
        const boxHeight = Math.ceil(text1Height + text2Height + 14);
        
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
        
        doc.fontSize(9)
           .fillColor('#10B981')
           .font('Helvetica-Bold')
           .text(nextStepsText1, margin + 6, currentY + 5, { 
             width: contentWidth - 12,
             lineGap: 1
           });
        
        doc.fontSize(8.5)
           .fillColor('#000000')
           .font('Helvetica')
           .text(nextStepsText2, margin + 6, currentY + text1Height + 6, { 
             width: contentWidth - 12,
             align: 'center',
             lineGap: 0.5
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
      doc.fontSize(7.5)
         .fillColor('#6B7280')
         .font('Helvetica')
         .text(copyrightText, margin, footerY, { 
           width: contentWidth,
           align: 'center',
           lineGap: 0
         });
      
      // Disclaimer en dessous
      doc.fontSize(7)
         .fillColor('#6B7280')
         .font('Helvetica')
         .text(disclaimerText, margin, footerY + 9, { 
           width: contentWidth,
           align: 'center',
           lineGap: 1.5
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
  // Nettoyage ultra-strict de l'email - ASCII uniquement, format simple
  const cleanEmail = (email: string): string => {
    if (!email || typeof email !== 'string') throw new Error('Email vide');
    let cleaned = email.trim().toLowerCase();
    // Extraire email depuis "Name <email@domain.com>"
    const match = cleaned.match(/<([^>]+)>/);
    if (match) cleaned = match[1].trim();
    // Supprimer guillemets, apostrophes et espaces
    cleaned = cleaned.replace(/^["'\s]+|["'\s]+$/g, '').trim();
    // Supprimer tous caractères non-ASCII
    cleaned = cleaned.replace(/[^\x20-\x7E]/g, '');
    // Validation stricte - seulement ASCII, format email simple
    if (!/^[a-z0-9._+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(cleaned)) {
      throw new Error('Format email invalide');
    }
    return cleaned;
  };

  // Nettoyage du texte pour éviter problèmes d'encodage
  const cleanText = (text: string): string => {
    if (!text) return '';
    return String(text)
      .replace(/[^\x20-\x7E\n\r]/g, '') // Garder seulement ASCII imprimable + retours à la ligne
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 500); // Limiter la longueur
  };

  const fromEmail = cleanEmail(process.env.SMTP_USER || 'contact@skillshield-ai.com');
  const toEmailClean = cleanEmail(toEmail);
  const problemClean = cleanText(userProblem);

  // Validation SMTP
  const smtpHost = String(process.env.SMTP_HOST || 'smtp.gmail.com').trim();
  const smtpPort = parseInt(String(process.env.SMTP_PORT || '587').trim(), 10);
  const smtpPass = String(process.env.SMTP_PASS || '').trim();

  if (!smtpPass || smtpPass.length === 0) {
    throw new Error('SMTP_PASS manquant dans les variables d\'environnement');
  }

  if (isNaN(smtpPort) || smtpPort <= 0) {
    throw new Error(`Port SMTP invalide: ${smtpPort}`);
  }

  // Log pour debug
  console.log('SMTP Config:', {
    host: smtpHost,
    port: smtpPort,
    user: fromEmail,
    passLength: smtpPass.length
  });
  console.log('Email from:', fromEmail);
  console.log('Email to:', toEmailClean);

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: false,
    auth: {
      user: fromEmail,
      pass: smtpPass,
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  // Sujet ultra-simple - ASCII uniquement, pas d'apostrophe
  const subject = 'Votre Plan d Automatisation Personnalise - SkillShield AI';

  // HTML minimal et sûr - pas d'apostrophes dans le texte
  const htmlContent = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
<h2 style="color: #8B5CF6;">Bonjour,</h2>
<p>Comme promis, voici votre <strong>Plan d Automatisation Personnalise</strong>, base sur votre situation :</p>
<p style="background: #f3f4f6; padding: 15px; border-radius: 8px; font-style: italic;">${problemClean.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')}</p>
<p>Ce document contient :</p>
<ul>
<li>Notre analyse de votre situation</li>
<li>Vos solutions d automatisation IA personnalisees</li>
<li>Les benchmarks de votre secteur</li>
<li>Un plan d action en 5 etapes pret a mettre en œuvre</li>
</ul>
<p><strong>Prochaine etape :</strong> Planifiez un appel de 15 minutes avec notre equipe pour discuter de la mise en œuvre.</p>
<p style="margin-top: 30px;"><a href="https://calendly.com/b00784336-essec" style="background: #8B5CF6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Planifier un appel (15 min)</a></p>
<p style="margin-top: 20px;"><a href="https://skillshield.app" style="color: #8B5CF6; text-decoration: none; font-weight: 500;">Visitez notre site web : skillshield.app</a></p>
<p style="color: #6b7280; font-size: 12px; margin-top: 30px;">Cordialement,<br/>L equipe SkillShield AI<br/>contact@skillshield-ai.com</p>
</div>`;

  // Version texte simple - pas d'apostrophes
  const textContent = `Bonjour,\n\nComme promis, voici votre Plan d Automatisation Personnalise, base sur votre situation :\n\n${problemClean}\n\nCe document contient :\n- Notre analyse de votre situation\n- Vos solutions d automatisation IA personnalisees\n- Les benchmarks de votre secteur\n- Un plan d action en 5 etapes pret a mettre en œuvre\n\nProchaine etape : Planifiez un appel de 15 minutes avec notre equipe pour discuter de la mise en œuvre.\n\nPlanifier un appel (15 min): https://calendly.com/b00784336-essec\nVisitez notre site web : skillshield.app\n\nCordialement,\nL equipe SkillShield AI\ncontact@skillshield-ai.com`;

  // Format email ultra-simple - pas de guillemets dans "from"
  const mailOptions = {
    from: fromEmail, // Juste l'email, pas de format "Name <email>"
    to: toEmailClean,
    subject: subject,
    text: textContent,
    html: htmlContent,
    attachments: [
      {
        filename: 'plan-automatisation-skillshield-ai.pdf',
        content: pdfBuffer,
      },
    ],
  };

  console.log('Mail options:', {
    from: mailOptions.from,
    to: mailOptions.to,
    subject: mailOptions.subject,
    hasHtml: !!mailOptions.html,
    hasText: !!mailOptions.text,
    attachmentSize: pdfBuffer.length
  });

  await transporter.sendMail(mailOptions);
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
    console.error('ERREUR ENVOI PDF:', error);
    console.error('Code erreur:', error.code);
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    
    // Erreurs SMTP spécifiques
    if (error.code === 'EAUTH') {
      return res.status(500).json({ 
        error: 'Erreur authentification SMTP',
        message: 'Verifiez SMTP_USER et SMTP_PASS dans Vercel'
      });
    }
    
    if (error.code === 'ECONNECTION' || error.code === 'ETIMEDOUT') {
      return res.status(500).json({ 
        error: 'Erreur connexion SMTP',
        message: 'Verifiez SMTP_HOST et SMTP_PORT dans Vercel'
      });
    }

    // Erreur de validation email
    if (error.message && (error.message.includes('Email') || error.message.includes('email'))) {
      return res.status(400).json({ 
        error: 'Email invalide',
        message: error.message
      });
    }

    // Erreur générique
    return res.status(500).json({ 
      error: 'Erreur envoi PDF',
      message: error.message || 'Erreur inconnue'
    });
  }
}
