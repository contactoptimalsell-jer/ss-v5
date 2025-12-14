import { AuditResult } from '../types';

// Fonction helper pour générer des données de benchmark par défaut
function getDefaultBenchmark(): AuditResult['benchmark'] {
  return {
    automatedProcessesPercentage: 60,
    averageTimeSavedPerTask: "8-12h / semaine",
    averageROI: "250-450%",
    paybackPeriod: "3-10 mois",
    sectorAverage: "entreprises françaises"
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
        return {
          analysis: "L'API Gemini est temporairement surchargée. Veuillez réessayer dans quelques instants. En attendant, voici des solutions d'automatisation par agent IA adaptées à votre situation.",
          suggestions: [
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
          ],
          benchmark: getDefaultBenchmark()
        };
      }
      
      // If API key is not configured, return helpful message
      if (response.status === 500 && errorData.message?.includes('API key')) {
        return {
          analysis: `⚠️ Configuration requise : La clé API Gemini n'est pas configurée dans Vercel. Pour obtenir des analyses personnalisées adaptées à votre problème spécifique ("${userProblem.substring(0, 50)}..."), veuillez configurer DefaultGeminiAPIKey ou GEMINI_API_KEY dans les paramètres Vercel (Settings → Environment Variables).`,
          suggestions: [
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
          ],
          benchmark: getDefaultBenchmark()
        };
      }

      throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    const result = await response.json();
    return result as AuditResult;

  } catch (error: any) {
    console.error("API Error:", error);
    
    // Fallback data in case of network error
    return {
      analysis: "Nous rencontrons une difficulté technique temporaire. Voici des solutions d'automatisation par agent IA adaptées à votre situation.",
      suggestions: [
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
      ],
      benchmark: getDefaultBenchmark()
    };
  }
};
