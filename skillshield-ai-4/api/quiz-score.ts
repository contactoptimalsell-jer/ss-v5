import type { VercelRequest, VercelResponse } from '@vercel/node';

// ===== INTERFACES =====
interface BaseQuizAnswers {
  question1: number;
  question2: number;
  question3: number;
  question4: number;
  question5: number;
}

interface PersonalizedQuizAnswers {
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

// ===== LOGIQUE QUIZ DE BASE =====
const QUESTION1_WEIGHTS = { 0: 100, 1: 50, 2: 0 };
const QUESTION2_WEIGHTS = { 0: 100, 1: 50, 2: 0 };
const QUESTION3_WEIGHTS = { 0: 100, 1: 50, 2: 0 };
const QUESTION4_WEIGHTS = { 0: 100, 1: 50, 2: 0 };
const QUESTION5_WEIGHTS = { 0: 100, 1: 50, 2: 0 };

function calculateBaseScore(answers: BaseQuizAnswers): number {
  const q1Score = QUESTION1_WEIGHTS[answers.question1 as keyof typeof QUESTION1_WEIGHTS] || 0;
  const q2Score = QUESTION2_WEIGHTS[answers.question2 as keyof typeof QUESTION2_WEIGHTS] || 0;
  const q3Score = QUESTION3_WEIGHTS[answers.question3 as keyof typeof QUESTION3_WEIGHTS] || 0;
  const q4Score = QUESTION4_WEIGHTS[answers.question4 as keyof typeof QUESTION4_WEIGHTS] || 0;
  const q5Score = QUESTION5_WEIGHTS[answers.question5 as keyof typeof QUESTION5_WEIGHTS] || 0;
  return Math.round((q1Score + q2Score + q3Score + q4Score + q5Score) / 5);
}

function determineBaseColorAndLevel(score: number) {
  if (score >= 70) {
    return {
      color: 'red' as const,
      level: 'Débutant' as const,
      potential: 'Élevé' as const,
      priority: 'Commencer maintenant',
      emoji: '🟥' as const,
      gameMessage: '🚀 Potentiel ÉNORME détecté ! Vous avez un terrain de jeu parfait pour l\'automatisation.',
    };
  } else if (score >= 40) {
    return {
      color: 'orange' as const,
      level: 'Intermédiaire' as const,
      potential: 'Moyen' as const,
      priority: 'Optimiser intelligemment',
      emoji: '🟧' as const,
      gameMessage: '⚡ Vous êtes sur la bonne voie ! Il reste encore de belles opportunités à saisir.',
    };
  } else {
    return {
      color: 'green' as const,
      level: 'Avancé' as const,
      potential: 'Faible' as const,
      priority: 'Aller plus loin',
      emoji: '🟩' as const,
      gameMessage: '🎯 Excellent ! Vous maîtrisez déjà bien l\'automatisation. Passons au niveau supérieur.',
    };
  }
}

function generateBaseInsights(answers: BaseQuizAnswers) {
  return {
    timeSpent: answers.question1 === 0 ? '⏰ Vous passez plus de 15h/semaine sur des tâches répétitives. C\'est énorme !' :
             answers.question1 === 1 ? '⏰ Entre 5 et 15h/semaine sur des tâches répétitives. Il y a du potentiel !' :
             '⏰ Moins de 5h/semaine. Vous gérez bien votre temps.',
    vacationImpact: answers.question2 === 0 ? '🏖️ Le travail s\'accumule en vacances. L\'automatisation peut changer ça.' :
                   answers.question2 === 1 ? '🏖️ Un peu d\'accumulation. On peut améliorer ça.' :
                   '🏖️ Tout est géré sans vous. Excellent niveau d\'autonomie !',
    automationLevel: answers.question3 === 0 ? '🔧 Tout est manuel. C\'est le moment idéal pour commencer.' :
                    answers.question3 === 1 ? '🔧 Quelques outils basiques. On peut aller plus loin.' :
                    '🔧 Plusieurs outils automatisés. Vous êtes déjà bien équipé !',
    repetitiveQuestions: answers.question4 === 0 ? '💬 Questions répétitives très fréquentes. Un chatbot pourrait vous aider.' :
                         answers.question4 === 1 ? '💬 Questions répétitives parfois. On peut optimiser ça.' :
                         '💬 Rarement de questions répétitives. Vos processus sont clairs !',
    growthFocus: answers.question5 === 0 ? '📈 Noyé dans l\'administratif. L\'automatisation va vous libérer.' :
                answers.question5 === 1 ? '📈 Parfois du temps pour la croissance. On peut faire mieux.' :
                '📈 Vous vous concentrez sur l\'essentiel. Parfait pour optimiser encore plus.',
  };
}

// ===== LOGIQUE QUIZ PERSONNALISÉ =====
const AUTOMATION_WEIGHTS: Record<string, number> = {
  'Emails répétitifs': 15, 'Relances clients': 20, 'Gestion des leads': 25,
  'Suivi des candidatures': 20, 'Création de contenu': 15, 'Gestion des stocks': 20,
  'Réponses aux questions fréquentes': 15, 'Planification et rendez-vous': 15,
};

const SOLUTION_WEIGHTS: Record<string, number> = {
  'Chatbot pour répondre aux clients': 30, 'Automatisation de tâches répétitives': 25,
  'Outils SaaS intelligents': 35, 'Génération de contenu automatique': 30,
  'Tri et organisation des emails': 20, 'Suivi et relance automatique': 25,
};

const GOAL_WEIGHTS: Record<string, number> = {
  'Gagner du temps': 30, 'Réduire les erreurs': 25, 'Augmenter les ventes': 35,
  'Améliorer le suivi client': 30, 'Libérer mon équipe pour des tâches importantes': 40,
  'Optimiser mes processus': 35,
};

const TEAM_SIZE_WEIGHTS: Record<string, number> = {
  '1-5 personnes': 20, '6-20 personnes': 40, '21-50 personnes': 60,
  '51-200 personnes': 80, 'Plus de 200 personnes': 100,
};

const HIGH_POTENTIAL_SECTORS = ['Commerce / E-commerce', 'Services', 'Immobilier', 'Finance'];

function calculateAutomationUrgency(answers: PersonalizedQuizAnswers): number {
  let score = 0, maxScore = 0;
  answers.automationNeeds.forEach((need) => {
    const weight = AUTOMATION_WEIGHTS[need] || 15;
    score += weight; maxScore += weight;
  });
  if (answers.otherAutomation?.trim()) { score += 20; maxScore += 20; }
  return maxScore > 0 ? Math.min(100, Math.round((score / maxScore) * 100)) : 0;
}

function calculateSolutionComplexity(answers: PersonalizedQuizAnswers): number {
  let score = 0, maxScore = 0;
  answers.solutionsInterested.forEach((solution) => {
    const weight = SOLUTION_WEIGHTS[solution] || 25;
    score += weight; maxScore += weight;
  });
  if (answers.otherSolution?.trim()) { score += 30; maxScore += 30; }
  return maxScore > 0 ? Math.min(100, Math.round((score / maxScore) * 100)) : 0;
}

function calculateGoalAlignment(answers: PersonalizedQuizAnswers): number {
  let score = 0, maxScore = 0;
  answers.mainGoal.forEach((goal) => {
    const weight = GOAL_WEIGHTS[goal] || 30;
    score += weight; maxScore += weight;
  });
  if (answers.otherGoal?.trim()) { score += 35; maxScore += 35; }
  return maxScore > 0 ? Math.min(100, Math.round((score / maxScore) * 100)) : 0;
}

function calculateTeamReadiness(prospectInfo: ProspectInfo): number {
  let score = TEAM_SIZE_WEIGHTS[prospectInfo.teamSize] || 30;
  if (HIGH_POTENTIAL_SECTORS.includes(prospectInfo.sector)) score += 20;
  if (prospectInfo.mainChallenge?.trim().length > 20) score += 15;
  return Math.min(100, score);
}

function calculatePersonalizedScore(
  automationUrgency: number,
  solutionComplexity: number,
  goalAlignment: number,
  teamReadiness: number
): number {
  return Math.round(
    automationUrgency * 0.35 +
    solutionComplexity * 0.25 +
    goalAlignment * 0.25 +
    teamReadiness * 0.15
  );
}

function determinePersonalizedColorAndLevel(score: number) {
  if (score <= 40) {
    return { color: 'red' as const, level: 'Débutant' as const, potential: 'Élevé' as const, priority: 'Commencer maintenant' };
  } else if (score <= 70) {
    return { color: 'orange' as const, level: 'Intermédiaire' as const, potential: 'Moyen' as const, priority: 'Optimiser intelligemment' };
  } else {
    return { color: 'green' as const, level: 'Avancé' as const, potential: 'Faible' as const, priority: 'Aller plus loin' };
  }
}

function generateRecommendations(answers: PersonalizedQuizAnswers, prospectInfo: ProspectInfo, color: 'red' | 'orange' | 'green'): string[] {
  const recommendations: string[] = [];
  if (answers.automationNeeds.includes('Emails répétitifs')) recommendations.push('Mettre en place un système de tri et réponse automatique des emails');
  if (answers.automationNeeds.includes('Relances clients')) recommendations.push('Automatiser le suivi et la relance des prospects');
  if (answers.automationNeeds.includes('Gestion des leads')) recommendations.push('Créer un système de qualification et suivi des leads');
  if (answers.solutionsInterested.includes('Chatbot pour répondre aux clients')) recommendations.push('Implémenter un chatbot pour répondre aux questions fréquentes');
  if (color === 'red') {
    recommendations.push('Commencer par une automatisation simple pour gagner en confiance');
    recommendations.push('Prioriser les tâches qui prennent le plus de temps');
  } else if (color === 'orange') {
    recommendations.push('Optimiser les automatisations existantes');
  } else {
    recommendations.push('Explorer des solutions d\'IA avancées');
  }
  if (prospectInfo.teamSize === '1-5 personnes') recommendations.push('Focus sur les automatisations qui libèrent du temps individuel');
  return recommendations.slice(0, 5);
}

// ===== HANDLER PRINCIPAL =====
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { type, answers, quizAnswers, prospectInfo } = req.body;

    if (!type || !['base', 'personalized'].includes(type)) {
      return res.status(400).json({ error: 'Type requis (base ou personalized)' });
    }

    if (type === 'base') {
      // Quiz de base
      if (!answers || typeof answers.question1 !== 'number') {
        return res.status(400).json({ error: 'Missing or invalid answers' });
      }

      const score = calculateBaseScore(answers);
      const { color, level, potential, priority, emoji, gameMessage } = determineBaseColorAndLevel(score);
      const insights = generateBaseInsights(answers);

      return res.status(200).json({
        success: true,
        result: { score, color, level, potential, priority, emoji, gameMessage, insights },
      });
    } else {
      // Quiz personnalisé
      if (!quizAnswers || !prospectInfo) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const automationUrgency = calculateAutomationUrgency(quizAnswers);
      const solutionComplexity = calculateSolutionComplexity(quizAnswers);
      const goalAlignment = calculateGoalAlignment(quizAnswers);
      const teamReadiness = calculateTeamReadiness(prospectInfo);
      const finalScore = calculatePersonalizedScore(automationUrgency, solutionComplexity, goalAlignment, teamReadiness);
      const { color, level, potential, priority } = determinePersonalizedColorAndLevel(finalScore);
      const recommendations = generateRecommendations(quizAnswers, prospectInfo, color);

      return res.status(200).json({
        success: true,
        result: {
          score: finalScore,
          color,
          level,
          potential,
          priority,
          analysis: { automationUrgency, solutionComplexity, goalAlignment, teamReadiness },
          recommendations,
        },
      });
    }
  } catch (error: any) {
    console.error('Erreur quiz-score:', error);
    return res.status(500).json({
      error: 'Erreur lors du calcul du score',
      details: error.message,
    });
  }
}
