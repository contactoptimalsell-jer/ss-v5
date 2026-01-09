import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, company, message } = body;

    // Validation basique
    if (!firstName || !lastName || !email || !company || !message) {
      return NextResponse.json(
        { error: 'Tous les champs requis doivent être remplis' },
        { status: 400 }
      );
    }

    // Envoi de l'email via Resend
    // Note: Vous devrez configurer RESEND_API_KEY dans vos variables d'environnement
    if (resend && process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: 'SkillShield Training <onboarding@resend.dev>', // Remplacez par votre domaine vérifié
        to: process.env.CONTACT_EMAIL || 'contact@skillshield.app',
        subject: `Nouvelle demande d'audit - ${firstName} ${lastName}`,
        html: `
          <h2>Nouvelle demande d'audit gratuit</h2>
          <p><strong>Nom:</strong> ${firstName} ${lastName}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${phone ? `<p><strong>Téléphone:</strong> ${phone}</p>` : ''}
          <p><strong>Entreprise:</strong> ${company}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `,
      });
    } else {
      // Mode développement : log dans la console
      console.log('📧 Nouvelle demande d\'audit:', {
        firstName,
        lastName,
        email,
        phone,
        company,
        message,
      });
    }

    return NextResponse.json(
      { message: 'Demande envoyée avec succès' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing audit request:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi de la demande' },
      { status: 500 }
    );
  }
}

