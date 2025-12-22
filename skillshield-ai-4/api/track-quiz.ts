import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getQuizTokenData, updateQuizToken } from './send-quiz-link';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token, action } = req.body; // action: 'opened' | 'completed'

  if (!token || typeof token !== 'string') {
    return res.status(400).json({ error: 'Token requis' });
  }

  if (!action || !['opened', 'completed'].includes(action)) {
    return res.status(400).json({ error: 'Action invalide' });
  }

  try {
    const tokenData = getQuizTokenData(token);

    if (!tokenData) {
      return res.status(404).json({ error: 'Token invalide ou expiré' });
    }

    // Mettre à jour le tracking
    if (action === 'opened' && !tokenData.opened) {
      updateQuizToken(token, {
        opened: true,
        openedAt: new Date(),
      });
      console.log(`✅ [track-quiz] Quiz opened: ${tokenData.prospectEmail}`);
    } else if (action === 'completed' && !tokenData.completed) {
      updateQuizToken(token, {
        completed: true,
        completedAt: new Date(),
      });
      console.log(`✅ [track-quiz] Quiz completed: ${tokenData.prospectEmail}`);
    }

    return res.status(200).json({ 
      success: true,
      message: 'Tracking enregistré',
    });

  } catch (error: any) {
    console.error('Erreur lors du tracking:', error);
    return res.status(500).json({ 
      error: 'Erreur lors du tracking',
      details: error.message 
    });
  }
}

