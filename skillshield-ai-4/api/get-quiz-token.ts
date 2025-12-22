import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getQuizTokenData } from './quizTokenStorage.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token } = req.query;

  if (!token || typeof token !== 'string') {
    return res.status(400).json({ error: 'Token requis' });
  }

  try {
    const tokenData = getQuizTokenData(token);

    if (!tokenData) {
      return res.status(404).json({ error: 'Token invalide ou expiré' });
    }

    // Retourner uniquement les données nécessaires (sans le token lui-même)
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

  } catch (error: any) {
    console.error('Erreur lors de la récupération du token:', error);
    return res.status(500).json({
      error: 'Erreur lors de la récupération du token',
      details: error.message,
    });
  }
}

