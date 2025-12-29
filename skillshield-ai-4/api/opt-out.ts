import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getQuizTokenData, setQuizTokenData } from '../utils/quizTokenStorage.js';

/**
 * API RGPD pour gérer les demandes d'opt-out
 * Conforme RGPD Article 21 - Droit d'opposition
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    // Affichage de la page d'opt-out
    const { email, token } = req.query;

    if (!email || !token) {
      return res.status(400).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Désinscription - SkillShield AI</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
            .error { background: #fee; border: 1px solid #fcc; padding: 15px; border-radius: 5px; color: #c33; }
          </style>
        </head>
        <body>
          <h1>Désinscription</h1>
          <div class="error">
            <p>Paramètres manquants. Veuillez utiliser le lien de désinscription fourni dans l'email.</p>
          </div>
        </body>
        </html>
      `);
    }

    try {
      // Vérifier le token
      const tokenData = await getQuizTokenData(token as string);
      
      if (!tokenData || tokenData.prospectEmail !== email) {
        return res.status(400).send(`
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <title>Désinscription - SkillShield AI</title>
            <style>
              body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
              .error { background: #fee; border: 1px solid #fcc; padding: 15px; border-radius: 5px; color: #c33; }
            </style>
          </head>
          <body>
            <h1>Désinscription</h1>
            <div class="error">
              <p>Lien de désinscription invalide ou expiré.</p>
            </div>
          </body>
          </html>
        `);
      }

      // Afficher la page de confirmation
      return res.status(200).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Désinscription - SkillShield AI</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; background: #f5f5f5; }
            .container { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .success { background: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px; color: #155724; margin: 20px 0; }
            .button { background: #dc3545; color: white; padding: 12px 24px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; }
            .button:hover { background: #c82333; }
            .info { background: #e7f3ff; border-left: 4px solid #2196F3; padding: 15px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>🔔 Désinscription</h1>
            <p>Vous êtes sur le point de vous désinscrire de nos communications.</p>
            <div class="info">
              <p><strong>Email concerné :</strong> ${email}</p>
              <p>Conformément au RGPD, vous avez le droit de vous opposer au traitement de vos données personnelles.</p>
            </div>
            <form method="POST" action="/api/opt-out">
              <input type="hidden" name="email" value="${email}">
              <input type="hidden" name="token" value="${token}">
              <p>
                <button type="submit" class="button">Confirmer la désinscription</button>
              </p>
            </form>
            <p style="font-size: 12px; color: #666; margin-top: 20px;">
              Si vous ne souhaitez pas vous désinscrire, vous pouvez simplement fermer cette page.
            </p>
          </div>
        </body>
        </html>
      `);
    } catch (error: any) {
      console.error('Erreur opt-out GET:', error);
      return res.status(500).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Erreur - SkillShield AI</title>
        </head>
        <body>
          <h1>Erreur</h1>
          <p>Une erreur s'est produite. Veuillez réessayer plus tard.</p>
        </body>
        </html>
      `);
    }
  }

  if (req.method === 'POST') {
    // Traitement de la désinscription
    const { email, token } = req.body;

    if (!email || !token) {
      return res.status(400).json({ 
        success: false,
        error: 'Paramètres manquants' 
      });
    }

    try {
      // Vérifier le token
      const tokenData = await getQuizTokenData(token);
      
      if (!tokenData || tokenData.prospectEmail !== email) {
        return res.status(400).json({ 
          success: false,
          error: 'Token invalide ou expiré' 
        });
      }

      // Marquer comme désinscrit dans les métadonnées
      await setQuizTokenData(token, {
        ...tokenData,
        optedOut: true,
        optOutDate: new Date().toISOString(),
      });

      // Log RGPD pour traçabilité
      console.log(`🔔 Opt-out RGPD: ${email} - ${new Date().toISOString()}`);

      // Retourner une page de confirmation
      return res.status(200).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Désinscription confirmée - SkillShield AI</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; background: #f5f5f5; }
            .container { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center; }
            .success { background: #d4edda; border: 1px solid #c3e6cb; padding: 20px; border-radius: 5px; color: #155724; margin: 20px 0; }
            .check { font-size: 48px; color: #28a745; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="check">✅</div>
            <h1>Désinscription confirmée</h1>
            <div class="success">
              <p><strong>Votre désinscription a été enregistrée avec succès.</strong></p>
              <p>Vous ne recevrez plus d'emails de prospection de notre part.</p>
              <p style="font-size: 12px; margin-top: 15px;">
                Conformément au RGPD, vos données seront conservées uniquement pour des raisons légales 
                et supprimées après la période de conservation légale.
              </p>
            </div>
            <p style="margin-top: 30px;">
              <a href="https://skillshield.app" style="color: #667eea; text-decoration: none;">Retour au site</a>
            </p>
          </div>
        </body>
        </html>
      `);
    } catch (error: any) {
      console.error('Erreur opt-out POST:', error);
      return res.status(500).json({ 
        success: false,
        error: 'Erreur lors de la désinscription' 
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

