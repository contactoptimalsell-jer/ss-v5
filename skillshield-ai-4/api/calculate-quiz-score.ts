import type { VercelRequest, VercelResponse } from '@vercel/node';

interface QuizAnswers {
  automationNeeds: string[];
  solutionsInterested: string[];
  mainGoal: string[];
  otherAutomation?: string;
  otherSolution?: string;
  otherGoal?: string;
}

interface ProspectInfo {
  fullName: string;
  email: string;
  company: string;
  role: string;
  sector: string;
  teamSize: string;
  mainChallenge: string;
}

interface ScoreResult {
  score: number; // 0-100
  color: 'red' | 'orange' | 'green';
  level: 'Débutant' | 'Intermédiaire' | 'Avancé';
  potential: 'Élevé' | 'Moyen' | 'Faible';
  priority: string;
  analysis: {
    automationUrgency: number; // 0-100
    solutionComplexity: number; // 0-100
    goalAlignment: number; // 0-100
    teamReadiness: number; // 0-100
  };
  recommendations: string[];
}

// Pondération des besoins d'automatisation
const AUTOMATION_WEIGHTS: Record<string, number> = {
  'Emails répétitifs': 15,
  'Relances clients': 20,
  'Gestion des leads': 25,
  'Suivi des candidatures': 20,
  'Création de contenu': 15,
  'Gestion des stocks': 20,
  'Réponses aux questions fréquentes': 15,
  'Planification et rendez-vous': 15,
};

// Pondération des solutions (complexité)
const SOLUTION_WEIGHTS: Record<string, number> = {
  'Chatbot pour répondre aux clients': 30,
  'Automatisation de tâches répétitives': 25,
  'Outils SaaS intelligents': 35,
  'Génération de contenu automatique': 30,
  'Tri et organisation des emails': 20,
  'Suivi et relance automatique': 25,
};

// Pondération des objectifs
const GOAL_WEIGHTS: Record<string, number> = {
  'Gagner du temps': 30,
  'Réduire les erreurs': 25,
  'Augmenter les ventes': 35,
  'Améliorer le suivi client': 30,
  'Libérer mon équipe pour des tâches importantes': 40,
  'Optimiser mes processus': 35,
};

// Pondération par taille d'équipe (plus l'équipe est grande, plus le score est élevé)
const TEAM_SIZE_WEIGHTS: Record<string, number> = {
  '1-5 personnes': 20,
  '6-20 personnes': 40,
  '21-50 personnes': 60,
  '51-200 personnes': 80,
  'Plus de 200 personnes': 100,
};

// Secteurs avec potentiel élevé
const HIGH_POTENTIAL_SECTORS = [
  'Commerce / E-commerce',
  'Services',
  'Immobilier',
  'Finance',
];

function calculateAutomationUrgency(answers: QuizAnswers): number {
  let score = 0;
  let maxScore = 0;

  // Calculer le score basé sur les besoins sélectionnés
  answers.automationNeeds.forEach((need) => {
    const weight = AUTOMATION_WEIGHTS[need] || 15;
    score += weight;
    maxScore += weight;
  });

  // Ajouter un bonus si "Autre" est rempli (besoin spécifique)
  if (answers.otherAutomation && answers.otherAutomation.trim()) {
    score += 20;
    maxScore += 20;
  }

  // Normaliser sur 100
  return maxScore > 0 ? Math.min(100, Math.round((score / maxScore) * 100)) : 0;
}

function calculateSolutionComplexity(answers: QuizAnswers): number {
  let score = 0;
  let maxScore = 0;

  // Calculer le score basé sur les solutions choisies
  answers.solutionsInterested.forEach((solution) => {
    const weight = SOLUTION_WEIGHTS[solution] || 25;
    score += weight;
    maxScore += weight;
  });

  // Ajouter un bonus si "Autre" est rempli (solution spécifique)
  if (answers.otherSolution && answers.otherSolution.trim()) {
    score += 30;
    maxScore += 30;
  }

  // Normaliser sur 100
  return maxScore > 0 ? Math.min(100, Math.round((score / maxScore) * 100)) : 0;
}

function calculateGoalAlignment(answers: QuizAnswers): number {
  let score = 0;
  let maxScore = 0;

  // Calculer le score basé sur les objectifs
  answers.mainGoal.forEach((goal) => {
    const weight = GOAL_WEIGHTS[goal] || 30;
    score += weight;
    maxScore += weight;
  });

  // Ajouter un bonus si "Autre" est rempli (objectif spécifique)
  if (answers.otherGoal && answers.otherGoal.trim()) {
    score += 35;
    maxScore += 35;
  }

  // Normaliser sur 100
  return maxScore > 0 ? Math.min(100, Math.round((score / maxScore) * 100)) : 0;
}

function calculateTeamReadiness(prospectInfo: ProspectInfo): number {
  let score = 0;

  // Score basé sur la taille de l'équipe
  score += TEAM_SIZE_WEIGHTS[prospectInfo.teamSize] || 30;

  // Bonus si secteur à haut potentiel
  if (HIGH_POTENTIAL_SECTORS.includes(prospectInfo.sector)) {
    score += 20;
  }

  // Bonus si défi principal est renseigné (indique une réflexion approfondie)
  if (prospectInfo.mainChallenge && prospectInfo.mainChallenge.trim().length > 20) {
    score += 15;
  }

  return Math.min(100, score);
}

function calculateFinalScore(
  automationUrgency: number,
  solutionComplexity: number,
  goalAlignment: number,
  teamReadiness: number
): number {
  // Pondération intelligente :
  // - Urgence d'automatisation : 35% (le plus important)
  // - Complexité des solutions : 25%
  // - Alignement des objectifs : 25%
  // - Préparation de l'équipe : 15%

  const weightedScore =
    automationUrgency * 0.35 +
    solutionComplexity * 0.25 +
    goalAlignment * 0.25 +
    teamReadiness * 0.15;

  return Math.round(weightedScore);
}

function determineColorAndLevel(score: number): {
  color: 'red' | 'orange' | 'green';
  level: 'Débutant' | 'Intermédiaire' | 'Avancé';
  potential: 'Élevé' | 'Moyen' | 'Faible';
  priority: string;
} {
  if (score <= 40) {
    return {
      color: 'red',
      level: 'Débutant',
      potential: 'Élevé',
      priority: 'Commencer maintenant',
    };
  } else if (score <= 70) {
    return {
      color: 'orange',
      level: 'Intermédiaire',
      potential: 'Moyen',
      priority: 'Optimiser intelligemment',
    };
  } else {
    return {
      color: 'green',
      level: 'Avancé',
      potential: 'Faible',
      priority: 'Aller plus loin',
    };
  }
}

function generateRecommendations(
  answers: QuizAnswers,
  prospectInfo: ProspectInfo,
  score: number,
  color: 'red' | 'orange' | 'green'
): string[] {
  const recommendations: string[] = [];

  // Recommandations basées sur les besoins
  if (answers.automationNeeds.includes('Emails répétitifs')) {
    recommendations.push('Mettre en place un système de tri et réponse automatique des emails');
  }
  if (answers.automationNeeds.includes('Relances clients')) {
    recommendations.push('Automatiser le suivi et la relance des prospects');
  }
  if (answers.automationNeeds.includes('Gestion des leads')) {
    recommendations.push('Créer un système de qualification et suivi des leads');
  }

  // Recommandations basées sur les solutions
  if (answers.solutionsInterested.includes('Chatbot pour répondre aux clients')) {
    recommendations.push('Implémenter un chatbot pour répondre aux questions fréquentes');
  }
  if (answers.solutionsInterested.includes('Génération de contenu automatique')) {
    recommendations.push('Automatiser la création de contenu récurrent');
  }

  // Recommandations basées sur le score
  if (color === 'red') {
    recommendations.push('Commencer par une automatisation simple pour gagner en confiance');
    recommendations.push('Prioriser les tâches qui prennent le plus de temps');
  } else if (color === 'orange') {
    recommendations.push('Optimiser les automatisations existantes');
    recommendations.push('Identifier les processus qui peuvent être améliorés');
  } else {
    recommendations.push('Explorer des solutions d\'IA avancées');
    recommendations.push('Optimiser les processus complexes restants');
  }

  // Recommandations basées sur la taille de l'équipe
  if (prospectInfo.teamSize === '1-5 personnes') {
    recommendations.push('Focus sur les automatisations qui libèrent du temps individuel');
  } else if (prospectInfo.teamSize === '6-20 personnes') {
    recommendations.push('Mettre en place des automatisations collaboratives');
  } else {
    recommendations.push('Créer un système d\'automatisation à l\'échelle de l\'entreprise');
  }

  return recommendations.slice(0, 5); // Limiter à 5 recommandations
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { quizAnswers, prospectInfo }: {
      quizAnswers: QuizAnswers;
      prospectInfo: ProspectInfo;
    } = req.body;

    // Validation
    if (!quizAnswers || !prospectInfo) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Calculer les scores individuels
    const automationUrgency = calculateAutomationUrgency(quizAnswers);
    const solutionComplexity = calculateSolutionComplexity(quizAnswers);
    const goalAlignment = calculateGoalAlignment(quizAnswers);
    const teamReadiness = calculateTeamReadiness(prospectInfo);

    // Calculer le score final
    const finalScore = calculateFinalScore(
      automationUrgency,
      solutionComplexity,
      goalAlignment,
      teamReadiness
    );

    // Déterminer la couleur et le niveau
    const { color, level, potential, priority } = determineColorAndLevel(finalScore);

    // Générer les recommandations
    const recommendations = generateRecommendations(
      quizAnswers,
      prospectInfo,
      finalScore,
      color
    );

    const result: ScoreResult = {
      score: finalScore,
      color,
      level,
      potential,
      priority,
      analysis: {
        automationUrgency,
        solutionComplexity,
        goalAlignment,
        teamReadiness,
      },
      recommendations,
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

