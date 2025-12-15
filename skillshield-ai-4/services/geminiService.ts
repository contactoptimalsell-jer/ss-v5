import { AuditResult, VisualizationData } from '../types';
import { getBenchmarkForProblem } from '../utils/sectorBenchmarks';

// Fonction helper pour générer des données de benchmark adaptées au secteur
function getAdaptiveBenchmark(userProblem: string): AuditResult['benchmark'] {
  const benchmark = getBenchmarkForProblem(userProblem);
  return {
    automatedProcessesPercentage: benchmark.automatedProcessesPercentage,
    averageTimeSavedPerTask: benchmark.averageTimeSavedPerTask,
    averageROI: benchmark.averageROI,
    paybackPeriod: benchmark.paybackPeriod,
    sectorAverage: benchmark.sectorAverage
  };
}

// Fonction helper pour extraire les heures
function extractHoursFromString(timeString: string): number {
  const match = timeString.match(/(\d+(?:\.\d+)?)\s*h/);
  return match ? parseFloat(match[1]) : 0;
}

// Fonction helper pour générer des données de visualisation par défaut avec ROI réaliste
function getDefaultVisualization(suggestions: AuditResult['suggestions']): VisualizationData {
  const timeGainBySolution = suggestions.map((s, index) => {
    const hours = extractHoursFromString(s.timeSaved);
    return {
      name: `Solution ${index + 1}`,
      hoursPerWeek: hours || (index === 0 ? 8 : index === 1 ? 6 : 5),
      difficulty: s.difficulty as 'Facile' | 'Moyen' | 'Complexe'
    };
  });

  // Calcul ROI réaliste
  const totalHoursPerWeek = timeGainBySolution.reduce((sum, s) => sum + s.hoursPerWeek, 0);
  const totalHoursPerYear = totalHoursPerWeek * 52;
  const hourlyRate = 60; // €/h - Valeur conservatrice
  const annualValueSaved = totalHoursPerYear * hourlyRate;
  
  // Coût d'implémentation selon difficulté
  let implementationCost = 0;
  suggestions.forEach(s => {
    if (s.difficulty === 'Facile') {
      implementationCost += 4000;
    } else if (s.difficulty === 'Moyen') {
      implementationCost += 6500;
    } else {
      implementationCost += 11500;
    }
  });
  
  const annualMaintenanceCost = implementationCost * 0.15;
  const annualGains = annualValueSaved - annualMaintenanceCost;
  const realROI = (annualGains / implementationCost) * 100;
  const adjustedROI = Math.max(200, Math.min(realROI, 500)); // Plage réaliste
  
  // Payback period
  const monthlyGains = (totalHoursPerWeek * 4.33 * hourlyRate) - (annualMaintenanceCost / 12);
  const paybackMonths = monthlyGains > 0 
    ? Math.max(2, Math.min(Math.ceil(implementationCost / monthlyGains), 12))
    : 6;
  
  // Projection ROI sur 12 mois
  const roiProjection = [];
  for (let month = 1; month <= 12; month++) {
    if (month <= paybackMonths) {
      const progress = month / paybackMonths;
      const cumulativeROI = adjustedROI * progress * 0.3;
      roiProjection.push({
        month,
        cumulativeROI: Math.round(Math.max(0, cumulativeROI)),
        investment: Math.round(implementationCost)
      });
    } else {
      const monthsAfterPayback = month - paybackMonths;
      const remainingMonths = 12 - paybackMonths;
      const progress = monthsAfterPayback / remainingMonths;
      const cumulativeROI = (adjustedROI * 0.3) + (adjustedROI * 0.7 * progress);
      roiProjection.push({
        month,
        cumulativeROI: Math.round(cumulativeROI),
        investment: Math.round(implementationCost)
      });
    }
  }

  return {
    timeGainBySolution,
    impactByCategory: [
      {
        category: 'Tâches automatisables',
        currentTime: totalHoursPerWeek * 1.5,
        automatedTime: totalHoursPerWeek * 0.2,
        gainPercentage: Math.round((totalHoursPerWeek / (totalHoursPerWeek * 1.5)) * 100)
      }
    ],
    roiProjection,
    automationPotential: suggestions.map(s => ({
      task: s.title.replace(/Agent IA de |Agent IA d'|Automatisation /gi, '').substring(0, 30),
      automationLevel: s.difficulty === 'Facile' ? 85 : s.difficulty === 'Moyen' ? 70 : 60,
      priority: (extractHoursFromString(s.timeSaved) >= 8 ? 'high' : extractHoursFromString(s.timeSaved) >= 5 ? 'medium' : 'low') as 'high' | 'medium' | 'low'
    }))
  };
}

/**
 * Generate audit using serverless API route (secure - API key stays on server)
 */
export const generateAudit = async (userProblem: string): Promise<AuditResult> => {
  try {
    const response = await fetch('/api/generate-audit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userProblem }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      
      // Handle service temporarily unavailable (Gemini overloaded)
      if (response.status === 503 || errorData.retry) {
        const fallbackSuggestions = [
          {
            title: "Agent IA de tri et réponse d'emails",
            description: "Agent IA qui analyse automatiquement tous vos emails entrants, les classe par urgence et sujet, et génère des réponses personnalisées basées sur votre historique. Il apprend vos formulations et peut gérer 80% des demandes courantes sans votre intervention.",
            timeSaved: "8h / semaine",
            difficulty: "Facile"
          },
          {
            title: "Agent IA de gestion documentaire intelligente",
            description: "Agent IA qui extrait automatiquement les données de vos documents (factures, contrats, formulaires), les classe et les archive selon vos règles. Il peut aussi générer des rapports automatiques et alerter en cas d'anomalies.",
            timeSaved: "6h / semaine",
            difficulty: "Moyen"
          },
          {
            title: "Agent IA de planification et gestion d'agenda",
            description: "Agent IA qui gère automatiquement vos rendez-vous, optimise votre planning selon vos priorités, envoie des confirmations aux clients, et s'adapte aux changements en temps réel. Il apprend vos préférences et évite les conflits.",
            timeSaved: "5h / semaine",
            difficulty: "Facile"
          }
        ];
        return {
          analysis: "L'API Gemini est temporairement surchargée. Veuillez réessayer dans quelques instants. En attendant, voici des solutions d'automatisation par agent IA adaptées à votre situation.",
          suggestions: fallbackSuggestions,
          benchmark: getAdaptiveBenchmark(userProblem),
          visualization: getDefaultVisualization(fallbackSuggestions)
        };
      }
      
      // If API key is not configured, return helpful message
      if (response.status === 500 && errorData.message?.includes('API key')) {
        const fallbackSuggestions = [
          {
            title: "Agent IA de tri et réponse d'emails",
            description: "Agent IA qui analyse automatiquement tous vos emails entrants, les classe par urgence et sujet, et génère des réponses personnalisées basées sur votre historique. Il apprend vos formulations et peut gérer 80% des demandes courantes sans votre intervention.",
            timeSaved: "8h / semaine",
            difficulty: "Facile"
          },
          {
            title: "Agent IA de gestion documentaire intelligente",
            description: "Agent IA qui extrait automatiquement les données de vos documents (factures, contrats, formulaires), les classe et les archive selon vos règles. Il peut aussi générer des rapports automatiques et alerter en cas d'anomalies.",
            timeSaved: "6h / semaine",
            difficulty: "Moyen"
          },
          {
            title: "Agent IA de planification et gestion d'agenda",
            description: "Agent IA qui gère automatiquement vos rendez-vous, optimise votre planning selon vos priorités, envoie des confirmations aux clients, et s'adapte aux changements en temps réel. Il apprend vos préférences et évite les conflits.",
            timeSaved: "5h / semaine",
            difficulty: "Facile"
          }
        ];
        return {
          analysis: `⚠️ Configuration requise : La clé API Gemini n'est pas configurée dans Vercel. Pour obtenir des analyses personnalisées adaptées à votre problème spécifique ("${userProblem.substring(0, 50)}..."), veuillez configurer DefaultGeminiAPIKey ou GEMINI_API_KEY dans les paramètres Vercel (Settings → Environment Variables).`,
          suggestions: fallbackSuggestions,
          benchmark: getAdaptiveBenchmark(userProblem),
          visualization: getDefaultVisualization(fallbackSuggestions)
        };
      }

      throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    const result = await response.json();
    return result as AuditResult;

  } catch (error: any) {
    console.error("API Error:", error);
    
    // Fallback data in case of network error
    const fallbackSuggestions = [
      {
        title: "Agent IA de tri et réponse d'emails",
        description: "Agent IA qui analyse automatiquement tous vos emails entrants, les classe par urgence et sujet, et génère des réponses personnalisées basées sur votre historique. Il apprend vos formulations et peut gérer 80% des demandes courantes sans votre intervention.",
        timeSaved: "8h / semaine",
        difficulty: "Facile"
      },
      {
        title: "Agent IA de gestion documentaire intelligente",
        description: "Agent IA qui extrait automatiquement les données de vos documents (factures, contrats, formulaires), les classe et les archive selon vos règles. Il peut aussi générer des rapports automatiques et alerter en cas d'anomalies.",
        timeSaved: "6h / semaine",
        difficulty: "Moyen"
      },
      {
        title: "Agent IA de planification et gestion d'agenda",
        description: "Agent IA qui gère automatiquement vos rendez-vous, optimise votre planning selon vos priorités, envoie des confirmations aux clients, et s'adapte aux changements en temps réel. Il apprend vos préférences et évite les conflits.",
        timeSaved: "5h / semaine",
        difficulty: "Facile"
      }
    ];
    return {
      analysis: "Nous rencontrons une difficulté technique temporaire. Voici des solutions d'automatisation par agent IA adaptées à votre situation.",
      suggestions: fallbackSuggestions,
      benchmark: getAdaptiveBenchmark(userProblem),
      visualization: getDefaultVisualization(fallbackSuggestions)
    };
  }
};
