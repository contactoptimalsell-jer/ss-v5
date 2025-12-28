import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getQuizTokenData, updateQuizToken } from '../utils/quizTokenStorage.js';

// Fonction unifiée pour gérer les tokens de quiz
// GET /api/quiz-token?token=xxx -> Récupérer les données du token
// POST /api/quiz-token -> Tracker l'ouverture/complétion
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // GET : Récupérer les données du token
    if (req.method === 'GET') {
      const { token } = req.query;

      console.log(`🔍 [quiz-token] GET request - token: ${token}`);

      if (!token || typeof token !== 'string') {
        console.log(`❌ [quiz-token] Token manquant ou invalide`);
        return res.status(400).json({ error: 'Token requis' });
      }

      console.log(`🔍 [quiz-token] Recherche du token: ${token.substring(0, 10)}...`);
      const tokenData = await getQuizTokenData(token);

      if (!tokenData) {
        console.log(`❌ [quiz-token] Token non trouvé: ${token.substring(0, 10)}...`);
        return res.status(404).json({ error: 'Token invalide ou expiré' });
      }

      console.log(`✅ [quiz-token] Token trouvé pour: ${tokenData.prospectEmail}`);

      return res.status(200).json({
        success: true,
        data: {
          prospectName: tokenData.prospectName,
          prospectEmail: tokenData.prospectEmail,
          prospectProblem: tokenData.prospectProblem,
          opened: tokenData.opened,
          completed: tokenData.completed,
        },
      });
    }

    // POST : Tracker l'ouverture/complétion
    if (req.method === 'POST') {
      const { token, action } = req.body; // action: 'opened' | 'completed'

      if (!token || typeof token !== 'string') {
        return res.status(400).json({ error: 'Token requis' });
      }

      if (!action || !['opened', 'completed'].includes(action)) {
        return res.status(400).json({ error: 'Action invalide' });
      }

      const tokenData = await getQuizTokenData(token);

      if (!tokenData) {
        return res.status(404).json({ error: 'Token invalide ou expiré' });
      }

      // Mettre à jour le tracking
      if (action === 'opened' && !tokenData.opened) {
        await updateQuizToken(token, {
          opened: true,
          openedAt: new Date(),
        });
        console.log(`✅ [quiz-token] Quiz opened: ${tokenData.prospectEmail}`);
      } else if (action === 'completed' && !tokenData.completed) {
        await updateQuizToken(token, {
          completed: true,
          completedAt: new Date(),
        });
        console.log(`✅ [quiz-token] Quiz completed: ${tokenData.prospectEmail}`);
      }

      return res.status(200).json({ 
        success: true,
        message: 'Tracking enregistré',
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Erreur quiz-token:', error);
    return res.status(500).json({ 
      error: 'Erreur lors du traitement',
      details: error.message 
    });
  }
}

