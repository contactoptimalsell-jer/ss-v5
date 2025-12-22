import type { VercelRequest, VercelResponse } from '@vercel/node';

interface BaseQuizAnswers {
  question1: number; // Temps sur tâches répétitives (0-2)
  question2: number; // Accumulation travail vacances (0-2)
  question3: number; // Outils automatisés (0-2)
  question4: number; // Questions répétitives (0-2)
  question5: number; // Temps pour croissance (0-2)
}

interface ScoreResult {
  score: number; // 0-100
  color: 'red' | 'orange' | 'green';
  level: 'Débutant' | 'Intermédiaire' | 'Avancé';
  potential: 'Élevé' | 'Moyen' | 'Faible';
  priority: string;
  emoji: '🟥' | '🟧' | '🟩';
  gameMessage: string; // Message ludique mais sérieux
  insights: {
    timeSpent: string;
    vacationImpact: string;
    automationLevel: string;
    repetitiveQuestions: string;
    growthFocus: string;
  };
}

// Pondération des questions (plus le score est bas, plus le besoin est élevé)
// Question 1 : Temps sur tâches répétitives
const QUESTION1_WEIGHTS = {
  0: 100, // Plus de 15 heures = besoin très élevé
  1: 50,  // Entre 5 et 15 heures = besoin moyen
  2: 0,   // Moins de 5 heures = besoin faible
};

// Question 2 : Accumulation travail vacances
const QUESTION2_WEIGHTS = {
  0: 100, // Oui, beaucoup = besoin très élevé
  1: 50,  // Un peu = besoin moyen
  2: 0,   // Non, tout est géré = besoin faible
};

// Question 3 : Outils automatisés
const QUESTION3_WEIGHTS = {
  0: 100, // Non, tout est manuel = besoin très élevé
  1: 50,  // Quelques outils basiques = besoin moyen
  2: 0,   // Oui, plusieurs outils = besoin faible
};

// Question 4 : Questions répétitives
const QUESTION4_WEIGHTS = {
  0: 100, // Oui, très souvent = besoin très élevé
  1: 50,  // Parfois = besoin moyen
  2: 0,   // Rarement ou jamais = besoin faible
};

// Question 5 : Temps pour croissance
const QUESTION5_WEIGHTS = {
  0: 100, // Non, noyé dans l'administratif = besoin très élevé
  1: 50,  // Parfois, mais pas assez = besoin moyen
  2: 0,   // Oui, je me concentre sur l'essentiel = besoin faible
};

function calculateScore(answers: BaseQuizAnswers): number {
  // Calculer le score pour chaque question (inversé : plus le besoin est élevé, plus le score est élevé)
  const q1Score = QUESTION1_WEIGHTS[answers.question1 as keyof typeof QUESTION1_WEIGHTS] || 0;
  const q2Score = QUESTION2_WEIGHTS[answers.question2 as keyof typeof QUESTION2_WEIGHTS] || 0;
  const q3Score = QUESTION3_WEIGHTS[answers.question3 as keyof typeof QUESTION3_WEIGHTS] || 0;
  const q4Score = QUESTION4_WEIGHTS[answers.question4 as keyof typeof QUESTION4_WEIGHTS] || 0;
  const q5Score = QUESTION5_WEIGHTS[answers.question5 as keyof typeof QUESTION5_WEIGHTS] || 0;

  // Score moyen pondéré (chaque question a le même poids : 20%)
  const totalScore = (q1Score + q2Score + q3Score + q4Score + q5Score) / 5;

  return Math.round(totalScore);
}

function determineColorAndLevel(score: number): {
  color: 'red' | 'orange' | 'green';
  level: 'Débutant' | 'Intermédiaire' | 'Avancé';
  potential: 'Élevé' | 'Moyen' | 'Faible';
  priority: string;
  emoji: '🟥' | '🟧' | '🟩';
  gameMessage: string;
} {
  if (score >= 70) {
    return {
      color: 'red',
      level: 'Débutant',
      potential: 'Élevé',
      priority: 'Commencer maintenant',
      emoji: '🟥',
      gameMessage: '🚀 Potentiel ÉNORME détecté ! Vous avez un terrain de jeu parfait pour l\'automatisation.',
    };
  } else if (score >= 40) {
    return {
      color: 'orange',
      level: 'Intermédiaire',
      potential: 'Moyen',
      priority: 'Optimiser intelligemment',
      emoji: '🟧',
      gameMessage: '⚡ Vous êtes sur la bonne voie ! Il reste encore de belles opportunités à saisir.',
    };
  } else {
    return {
      color: 'green',
      level: 'Avancé',
      potential: 'Faible',
      priority: 'Aller plus loin',
      emoji: '🟩',
      gameMessage: '🎯 Excellent ! Vous maîtrisez déjà bien l\'automatisation. Passons au niveau supérieur.',
    };
  }
}

function generateInsights(answers: BaseQuizAnswers): ScoreResult['insights'] {
  const insights: ScoreResult['insights'] = {
    timeSpent: '',
    vacationImpact: '',
    automationLevel: '',
    repetitiveQuestions: '',
    growthFocus: '',
  };

  // Insight Question 1
  if (answers.question1 === 0) {
    insights.timeSpent = '⏰ Vous passez plus de 15h/semaine sur des tâches répétitives. C\'est énorme !';
  } else if (answers.question1 === 1) {
    insights.timeSpent = '⏰ Entre 5 et 15h/semaine sur des tâches répétitives. Il y a du potentiel !';
  } else {
    insights.timeSpent = '⏰ Moins de 5h/semaine. Vous gérez bien votre temps.';
  }

  // Insight Question 2
  if (answers.question2 === 0) {
    insights.vacationImpact = '🏖️ Le travail s\'accumule en vacances. L\'automatisation peut changer ça.';
  } else if (answers.question2 === 1) {
    insights.vacationImpact = '🏖️ Un peu d\'accumulation. On peut améliorer ça.';
  } else {
    insights.vacationImpact = '🏖️ Tout est géré sans vous. Excellent niveau d\'autonomie !';
  }

  // Insight Question 3
  if (answers.question3 === 0) {
    insights.automationLevel = '🔧 Tout est manuel. C\'est le moment idéal pour commencer.';
  } else if (answers.question3 === 1) {
    insights.automationLevel = '🔧 Quelques outils basiques. On peut aller plus loin.';
  } else {
    insights.automationLevel = '🔧 Plusieurs outils automatisés. Vous êtes déjà bien équipé !';
  }

  // Insight Question 4
  if (answers.question4 === 0) {
    insights.repetitiveQuestions = '💬 Questions répétitives très fréquentes. Un chatbot pourrait vous aider.';
  } else if (answers.question4 === 1) {
    insights.repetitiveQuestions = '💬 Questions répétitives parfois. On peut optimiser ça.';
  } else {
    insights.repetitiveQuestions = '💬 Rarement de questions répétitives. Vos processus sont clairs !';
  }

  // Insight Question 5
  if (answers.question5 === 0) {
    insights.growthFocus = '📈 Noyé dans l\'administratif. L\'automatisation va vous libérer.';
  } else if (answers.question5 === 1) {
    insights.growthFocus = '📈 Parfois du temps pour la croissance. On peut faire mieux.';
  } else {
    insights.growthFocus = '📈 Vous vous concentrez sur l\'essentiel. Parfait pour optimiser encore plus.';
  }

  return insights;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { answers }: { answers: BaseQuizAnswers } = req.body;

    // Validation
    if (!answers || typeof answers.question1 !== 'number' || typeof answers.question2 !== 'number' ||
        typeof answers.question3 !== 'number' || typeof answers.question4 !== 'number' ||
        typeof answers.question5 !== 'number') {
      return res.status(400).json({ error: 'Missing or invalid answers' });
    }

    // Calculer le score
    const score = calculateScore(answers);

    // Déterminer la couleur et le niveau
    const { color, level, potential, priority, emoji, gameMessage } = determineColorAndLevel(score);

    // Générer les insights
    const insights = generateInsights(answers);

    const result: ScoreResult = {
      score,
      color,
      level,
      potential,
      priority,
      emoji,
      gameMessage,
      insights,
    };

    return res.status(200).json({
      success: true,
      result,
    });

  } catch (error: any) {
    console.error('Erreur lors du calcul du score:', error);
    return res.status(500).json({
      error: 'Erreur lors du calcul du score',
      details: error.message,
    });
  }
}

