import type { VercelRequest, VercelResponse } from '@vercel/node';
import PDFDocument from 'pdfkit';
import nodemailer from 'nodemailer';
import { AuditResult } from '../types';

// Fonction pour dessiner le logo SkillShield dans le PDF
function drawLogo(doc: PDFKit.PDFDocument, x: number, y: number, size: number) {
  const centerX = x + size / 2;
  const centerY = y + size / 2;
  
  // Couleurs
  const shieldColor = '#60a5fa'; // cyan-400
  const brainColor = '#34d399'; // green-400
  const circuitColor = '#3b82f6'; // blue-500
  
  doc.save();
  
  // Bouclier - forme simplifiée avec rectangle
  doc.rect(centerX - 20, centerY - 25, 40, 45)
     .fillColor(shieldColor)
     .fill()
     .strokeColor('#1e40af')
     .lineWidth(2)
     .stroke();
  
  // Pointe du bouclier (triangle)
  doc.moveTo(centerX, centerY - 25)
     .lineTo(centerX - 15, centerY - 15)
     .lineTo(centerX, centerY - 20)
     .lineTo(centerX + 15, centerY - 15)
     .closePath()
     .fillColor(shieldColor)
     .fill()
     .strokeColor('#1e40af')
     .lineWidth(2)
     .stroke();
  
  // Cerveau - hémisphères simplifiés avec des cercles
  // Hémisphère gauche
  doc.circle(centerX - 8, centerY, 7)
     .strokeColor(brainColor)
     .lineWidth(2.5)
     .stroke();
  
  // Hémisphère droit
  doc.circle(centerX + 8, centerY, 7)
     .strokeColor(brainColor)
     .lineWidth(2.5)
     .stroke();
  
  // Détails du cerveau (gyri) - petits cercles
  doc.circle(centerX - 10, centerY - 2, 1.5).fillColor(brainColor).fill();
  doc.circle(centerX + 10, centerY - 2, 1.5).fillColor(brainColor).fill();
  doc.circle(centerX - 8, centerY + 4, 1.2).fillColor(brainColor).fill();
  doc.circle(centerX + 8, centerY + 4, 1.2).fillColor(brainColor).fill();
  
  // Lignes de circuit (simplifiées)
  doc.moveTo(centerX - 30, centerY - 15)
     .lineTo(centerX - 25, centerY - 10)
     .strokeColor(circuitColor)
     .lineWidth(1.5)
     .stroke();
  
  doc.moveTo(centerX + 30, centerY - 15)
     .lineTo(centerX + 25, centerY - 10)
     .strokeColor(circuitColor)
     .lineWidth(1.5)
     .stroke();
  
  doc.circle(centerX - 30, centerY - 15, 1.5).fillColor(circuitColor).fill();
  doc.circle(centerX + 30, centerY - 15, 1.5).fillColor(circuitColor).fill();
  
  doc.restore();
}

// Fonction pour ajouter le disclaimer en bas de page
function addDisclaimer(doc: PDFKit.PDFDocument) {
  const pageHeight = doc.page.height;
  const pageWidth = doc.page.width;
  const margin = 50;
  
  doc.fontSize(8)
     .fillColor('#6b7280')
     .text('© ' + new Date().getFullYear() + ' SkillShield AI. Tous droits réservés.', 
           margin, 
           pageHeight - 40, 
           { 
             width: pageWidth - 2 * margin, 
             align: 'center' 
           });
  
  doc.fontSize(7)
     .fillColor('#9ca3af')
     .text('Ce document est la propriété exclusive de SkillShield AI. Toute reproduction, distribution ou utilisation non autorisée est strictement interdite.', 
           margin, 
           pageHeight - 25, 
           { 
             width: pageWidth - 2 * margin, 
             align: 'center' 
           });
}

// Fonction pour générer le PDF personnalisé
function generatePDF(auditResult: AuditResult, userProblem: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 50, bottom: 80, left: 50, right: 50 }
      });

      const chunks: Buffer[] = [];
      
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Ajouter le disclaimer sur chaque page
      doc.on('pageAdded', () => {
        addDisclaimer(doc);
      });

      // En-tête avec logo
      const pageWidth = doc.page.width;
      const margin = 50;
      const logoSize = 50;
      const logoX = (pageWidth - logoSize) / 2;
      
      // Dessiner le logo
      drawLogo(doc, logoX, 20, logoSize);
      
      doc.moveDown(3);
      
      // Titre
      doc.fontSize(24)
         .fillColor('#6366f1')
         .text('SkillShield AI', { align: 'center' });
      
      doc.moveDown(0.5);
      doc.fontSize(18)
         .fillColor('#1f2937')
         .text('Votre Plan d\'Automatisation en 5 Étapes', { align: 'center' });
      
      // Ajouter le disclaimer sur la première page
      addDisclaimer(doc);
      
      doc.moveDown(1);

      // Section 1: Analyse du problème
      doc.fontSize(16)
         .fillColor('#8b5cf6')
         .text('1. Notre Analyse de Votre Situation', { underline: true });
      
      doc.moveDown(0.5);
      doc.fontSize(11)
         .fillColor('#1f2937')
         .text(`Problème identifié : ${userProblem}`, { indent: 20 });
      
      doc.moveDown(0.3);
      doc.fontSize(11)
         .fillColor('#4b5563')
         .text(auditResult.analysis, { indent: 20, align: 'justify' });

      doc.moveDown(1);

      // Section 2: Solutions d'automatisation
      doc.fontSize(16)
         .fillColor('#8b5cf6')
         .text('2. Vos Solutions d\'Automatisation IA', { underline: true });
      
      doc.moveDown(0.5);

      auditResult.suggestions.forEach((suggestion, index) => {
        doc.fontSize(12)
           .fillColor('#2563eb')
           .text(`${index + 1}. ${suggestion.title}`, { indent: 20 });
        
        doc.moveDown(0.2);
        doc.fontSize(10)
           .fillColor('#6b7280')
           .text(`   Difficulté : ${suggestion.difficulty}`, { indent: 30 });
        
        doc.moveDown(0.1);
        doc.fontSize(10)
           .fillColor('#059669')
           .text(`   Temps économisé : ${suggestion.timeSaved}`, { indent: 30 });
        
        doc.moveDown(0.3);
        doc.fontSize(10)
           .fillColor('#4b5563')
           .text(suggestion.description, { indent: 30, align: 'justify' });
        
        doc.moveDown(0.5);
      });

      // Section 3: Benchmark (si disponible)
      if (auditResult.benchmark) {
        doc.addPage();
        doc.fontSize(16)
           .fillColor('#8b5cf6')
           .text('3. Benchmark IA/Automatisation', { underline: true });
        
        doc.moveDown(0.5);
        doc.fontSize(11)
           .fillColor('#4b5563')
           .text(`Secteur : ${auditResult.benchmark.sectorAverage}`, { indent: 20 });
        
        doc.moveDown(0.3);
        doc.fontSize(11)
           .fillColor('#4b5563')
           .text(`% de processus automatisés : ${auditResult.benchmark.automatedProcessesPercentage}%`, { indent: 20 });
        
        doc.moveDown(0.3);
        doc.fontSize(11)
           .fillColor('#4b5563')
           .text(`Temps économisé par tâche : ${auditResult.benchmark.averageTimeSavedPerTask}`, { indent: 20 });
        
        doc.moveDown(0.3);
        doc.fontSize(11)
           .fillColor('#4b5563')
           .text(`ROI moyen : ${auditResult.benchmark.averageROI}`, { indent: 20 });
        
        doc.moveDown(0.3);
        doc.fontSize(11)
           .fillColor('#4b5563')
           .text(`Période de retour sur investissement : ${auditResult.benchmark.paybackPeriod}`, { indent: 20 });
      }

      // Section 4: Plan d'action en 5 étapes
      doc.addPage();
      doc.fontSize(16)
         .fillColor('#8b5cf6')
         .text('4. Votre Plan d\'Action en 5 Étapes', { underline: true });
      
      doc.moveDown(0.5);

      const steps = [
        {
          title: 'Étape 1 : Audit Complet',
          description: 'Nous analysons en profondeur vos processus actuels pour identifier toutes les opportunités d\'automatisation.'
        },
        {
          title: 'Étape 2 : Développement sur Mesure',
          description: 'Nos experts créent vos agents IA personnalisés, adaptés à vos outils et à vos besoins spécifiques.'
        },
        {
          title: 'Étape 3 : Intégration et Tests',
          description: 'Nous intégrons les agents IA dans votre environnement de travail et effectuons des tests complets.'
        },
        {
          title: 'Étape 4 : Formation et Accompagnement',
          description: 'Nous formons votre équipe à l\'utilisation des agents IA et vous accompagnons dans la transition.'
        },
        {
          title: 'Étape 5 : Suivi et Optimisation',
          description: 'Nous suivons les performances et optimisons continuellement vos automatisations pour maximiser votre ROI.'
        }
      ];

      steps.forEach((step, index) => {
        doc.fontSize(12)
           .fillColor('#2563eb')
           .text(`${step.title}`, { indent: 20 });
        
        doc.moveDown(0.2);
        doc.fontSize(10)
           .fillColor('#4b5563')
           .text(step.description, { indent: 30, align: 'justify' });
        
        doc.moveDown(0.5);
      });

      // Section 5: Prochaines étapes
      doc.addPage();
      doc.fontSize(16)
         .fillColor('#8b5cf6')
         .text('5. Prochaines Étapes', { underline: true });
      
      doc.moveDown(0.5);
      doc.fontSize(11)
         .fillColor('#4b5563')
         .text('Vous êtes prêt à transformer votre entreprise ?', { indent: 20 });
      
      doc.moveDown(0.5);
      doc.fontSize(11)
         .fillColor('#059669')
         .text('✓ Planifiez un appel de 15 minutes avec notre équipe', { indent: 20 });
      
      doc.moveDown(0.3);
      doc.fontSize(11)
         .fillColor('#059669')
         .text('✓ Recevez un devis personnalisé gratuit', { indent: 20 });
      
      doc.moveDown(0.3);
      doc.fontSize(11)
         .fillColor('#059669')
         .text('✓ Bénéficiez de notre garantie résultat (remboursé à 90%)', { indent: 20 });

      doc.moveDown(1);
      doc.fontSize(10)
         .fillColor('#6b7280')
         .text('Contact : contact@skillshield-ai.com', { align: 'center' });
      
      doc.moveDown(0.2);
      doc.fontSize(10)
         .fillColor('#6b7280')
         .text('Réponse sous 24h • Garantie Résultat', { align: 'center' });

      // Ajouter le disclaimer final avant la fin
      addDisclaimer(doc);

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
  // Configuration SMTP
  // Pour Gmail, vous devez créer un "App Password" dans votre compte Google
  // Variables d'environnement nécessaires :
  // - SMTP_HOST (ex: smtp.gmail.com)
  // - SMTP_PORT (ex: 587)
  // - SMTP_USER (ex: contact@skillshield-ai.com)
  // - SMTP_PASS (App Password Gmail ou mot de passe SMTP)
  
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true pour 465, false pour autres ports
    auth: {
      user: process.env.SMTP_USER || 'contact@skillshield-ai.com',
      pass: process.env.SMTP_PASS || '',
    },
  });

  await transporter.sendMail({
    from: `"SkillShield AI" <${process.env.SMTP_USER || 'contact@skillshield-ai.com'}>`,
    to: toEmail,
    subject: '📄 Votre Plan d\'Automatisation en 5 Étapes - SkillShield AI',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6366f1;">Bonjour,</h2>
        <p>Comme promis, voici votre <strong>Plan d'Automatisation en 5 Étapes</strong> personnalisé, basé sur votre situation :</p>
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
             style="background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
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
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, auditResult, userProblem } = req.body;

  // Validation
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'Email invalide' });
  }

  if (!auditResult || !userProblem) {
    return res.status(400).json({ error: 'auditResult et userProblem sont requis' });
  }

  try {
    // Générer le PDF
    const pdfBuffer = await generatePDF(auditResult as AuditResult, userProblem);

    // Envoyer l'email avec le PDF
    await sendEmailWithPDF(email, pdfBuffer, userProblem);

    return res.status(200).json({ 
      success: true,
      message: 'PDF envoyé avec succès !' 
    });

  } catch (error: any) {
    console.error('Erreur lors de l\'envoi du PDF:', error);
    
    // Erreur spécifique pour SMTP
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

