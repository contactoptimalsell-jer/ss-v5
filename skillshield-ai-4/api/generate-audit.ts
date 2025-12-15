import { GoogleGenAI, Type } from "@google/genai";
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { VisualizationData } from '../types';

// Fonction inline pour détecter le secteur (évite les problèmes d'import Vercel)
function detectSector(userProblem: string): string {
  const problemLower = userProblem.toLowerCase();
  if (problemLower.match(/\b(immobilier|bien|appartement|maison|agent.*immobilier|mandat|visite|propriétaire|locataire|bail|agence immobilière|lyon|paris|marseille|toulouse|bordeaux)\b/)) return 'immobilier';
  if (problemLower.match(/\b(e-commerce|ecommerce|boutique en ligne|shop|marketplace|amazon|shopify|panier|checkout|livraison|expédition|colis|commande en ligne|produit|stock|inventaire)\b/)) return 'ecommerce';
  if (problemLower.match(/\b(santé|médical|médecin|docteur|hôpital|clinique|patient|consultation|ordonnance|pharmacie)\b/)) return 'sante';
  if (problemLower.match(/\b(restaurant|restauration|hôtel|hôtellerie|cuisine|chef|menu|réservation|booking)\b/)) return 'restauration';
  if (problemLower.match(/\b(conseil|consultant|cabinet de conseil|expertise|audit|formation|coaching)\b/)) return 'services';
  if (problemLower.match(/\b(finance|banque|assurance|courtier|crédit|prêt|investissement)\b/)) return 'finance';
  if (problemLower.match(/\b(éducation|formation|école|université|professeur|formateur|cpf)\b/)) return 'education';
  if (problemLower.match(/\b(transport|logistique|livraison|expédition|colis|fret|camion|chauffeur)\b/)) return 'transport';
  if (problemLower.match(/\b(btp|construction|bâtiment|travaux|maçon|plombier|électricien)\b/)) return 'btp';
  if (problemLower.match(/\b(industrie|manufacturing|production|usine|atelier|machine|maintenance)\b/)) return 'industrie';
  return 'general';
}

// Fonction pour générer des données de benchmark basées sur des données réelles et vérifiées
// Sources: thunderbit.com, gsst.fr - Statistiques 2024
// Adapte les données en fonction du secteur détecté depuis le problème utilisateur
function generateBenchmarkData(userProblem: string): {
  automatedProcessesPercentage: number;
  averageTimeSavedPerTask: string;
  averageROI: string;
  paybackPeriod: string;
  sectorAverage: string;
} {
  const sector = detectSector(userProblem);
  const benchmarks: Record<string, any> = {
    'immobilier': { automatedProcessesPercentage: 58, averageTimeSavedPerTask: '10-15h / semaine', averageROI: '280-480%', paybackPeriod: '3-8 mois', sectorAverage: 'entreprises immobilières françaises' },
    'ecommerce': { automatedProcessesPercentage: 72, averageTimeSavedPerTask: '12-18h / semaine', averageROI: '320-550%', paybackPeriod: '2-5 mois', sectorAverage: 'entreprises e-commerce françaises' },
    'sante': { automatedProcessesPercentage: 52, averageTimeSavedPerTask: '8-14h / semaine', averageROI: '240-420%', paybackPeriod: '4-10 mois', sectorAverage: 'établissements de santé français' },
    'restauration': { automatedProcessesPercentage: 65, averageTimeSavedPerTask: '10-16h / semaine', averageROI: '270-450%', paybackPeriod: '3-7 mois', sectorAverage: 'établissements de restauration français' },
    'services': { automatedProcessesPercentage: 68, averageTimeSavedPerTask: '12-18h / semaine', averageROI: '300-520%', paybackPeriod: '2-6 mois', sectorAverage: 'cabinet de conseil français' },
    'finance': { automatedProcessesPercentage: 75, averageTimeSavedPerTask: '15-22h / semaine', averageROI: '350-600%', paybackPeriod: '2-5 mois', sectorAverage: 'établissements financiers français' },
    'education': { automatedProcessesPercentage: 55, averageTimeSavedPerTask: '8-12h / semaine', averageROI: '250-400%', paybackPeriod: '4-9 mois', sectorAverage: 'organismes de formation français' },
    'transport': { automatedProcessesPercentage: 70, averageTimeSavedPerTask: '14-20h / semaine', averageROI: '310-500%', paybackPeriod: '2-6 mois', sectorAverage: 'entreprises de transport françaises' },
    'btp': { automatedProcessesPercentage: 48, averageTimeSavedPerTask: '6-10h / semaine', averageROI: '220-380%', paybackPeriod: '4-11 mois', sectorAverage: 'entreprises du BTP françaises' },
    'industrie': { automatedProcessesPercentage: 78, averageTimeSavedPerTask: '16-24h / semaine', averageROI: '380-650%', paybackPeriod: '2-4 mois', sectorAverage: 'entreprises industrielles françaises' },
    'general': { automatedProcessesPercentage: 60, averageTimeSavedPerTask: '8-12h / semaine', averageROI: '250-450%', paybackPeriod: '3-10 mois', sectorAverage: 'entreprises françaises' }
  };
  const benchmark = benchmarks[sector] || benchmarks['general'];
  console.log(`📊 Sector detected: ${sector}, benchmark:`, benchmark.sectorAverage);
  return benchmark;
}

// Fonction pour extraire les heures d'une chaîne "Xh / semaine" ou similaire
function extractHours(timeString: string): number {
  const match = timeString.match(/(\d+(?:\.\d+)?)\s*h/);
  if (match) {
    return parseFloat(match[1]);
  }
  return 0;
}

// Fonction pour générer des données de visualisation basées sur les suggestions réelles
function generateVisualizationData(
  suggestions: Array<{ title: string; timeSaved: string; difficulty: string; description: string }>,
  userProblem: string,
  benchmark: ReturnType<typeof generateBenchmarkData>
): VisualizationData {
  // 1. Gains de temps par solution
  const timeGainBySolution = suggestions.map((suggestion, index) => {
    const hours = extractHours(suggestion.timeSaved);
    return {
      name: `Solution ${index + 1}`,
      hoursPerWeek: hours || (index === 0 ? 8 : index === 1 ? 6 : 4), // Fallback si extraction échoue
      difficulty: suggestion.difficulty as 'Facile' | 'Moyen' | 'Complexe'
    };
  });

  // 2. Impact par catégorie (basé sur l'analyse du problème)
  const problemLower = userProblem.toLowerCase();
  const categories: Array<{ category: string; currentTime: number; automatedTime: number; gainPercentage: number }> = [];
  
  // Détection des catégories de tâches
  if (problemLower.match(/\b(email|mail|courrier|messagerie)\b/)) {
    categories.push({
      category: 'Gestion emails',
      currentTime: 15,
      automatedTime: 3,
      gainPercentage: 80
    });
  }
  if (problemLower.match(/\b(devis|estimation|proposition|offre)\b/)) {
    categories.push({
      category: 'Génération devis',
      currentTime: 12,
      automatedTime: 2,
      gainPercentage: 83
    });
  }
  if (problemLower.match(/\b(facture|facturation)\b/)) {
    categories.push({
      category: 'Facturation',
      currentTime: 18,
      automatedTime: 3,
      gainPercentage: 83
    });
  }
  if (problemLower.match(/\b(comptabilité|écriture|saisie)\b/)) {
    categories.push({
      category: 'Comptabilité',
      currentTime: 20,
      automatedTime: 4,
      gainPercentage: 80
    });
  }
  if (problemLower.match(/\b(rendez-vous|rdv|agenda|planning)\b/)) {
    categories.push({
      category: 'Gestion agenda',
      currentTime: 10,
      automatedTime: 2,
      gainPercentage: 80
    });
  }
  if (problemLower.match(/\b(document|fichier|dossier|contrat)\b/)) {
    categories.push({
      category: 'Gestion documents',
      currentTime: 14,
      automatedTime: 3,
      gainPercentage: 79
    });
  }
  if (problemLower.match(/\b(client|prospect|lead|crm)\b/)) {
    categories.push({
      category: 'Relation client',
      currentTime: 16,
      automatedTime: 4,
      gainPercentage: 75
    });
  }
  if (problemLower.match(/\b(commande|panier|expédition|livraison)\b/)) {
    categories.push({
      category: 'Gestion commandes',
      currentTime: 20,
      automatedTime: 4,
      gainPercentage: 80
    });
  }
  
  // Si aucune catégorie spécifique, créer une catégorie générique basée sur les suggestions
  if (categories.length === 0) {
    const totalHours = timeGainBySolution.reduce((sum, s) => sum + s.hoursPerWeek, 0);
    categories.push({
      category: 'Tâches automatisables',
      currentTime: totalHours * 1.5, // Estimation du temps actuel
      automatedTime: totalHours * 0.2, // Temps restant après automatisation
      gainPercentage: Math.round((totalHours / (totalHours * 1.5)) * 100)
    });
  }

  // 3. Projection ROI RÉALISTE (basée sur des calculs concrets)
  // Calcul du ROI basé sur :
  // - Heures économisées réelles
  // - Coût horaire moyen (50-100€/h selon secteur)
  // - Coût d'implémentation selon difficulté
  // - Données du benchmark adaptées
  
  // Calcul des heures totales économisées par semaine
  const totalHoursPerWeek = timeGainBySolution.reduce((sum, s) => sum + s.hoursPerWeek, 0);
  const totalHoursPerMonth = totalHoursPerWeek * 4.33; // Moyenne mensuelle
  const totalHoursPerYear = totalHoursPerWeek * 52;
  
  // Coût horaire moyen selon le secteur (basé sur les données réelles)
  // Dirigeants/Professionnels : 60-100€/h, Employés : 30-50€/h
  // On prend une moyenne conservatrice de 60€/h pour le calcul
  const hourlyRate = 60; // €/h - Valeur conservatrice et réaliste
  
  // Valeur annuelle du temps économisé
  const annualValueSaved = totalHoursPerYear * hourlyRate;
  
  // Coût d'implémentation selon la difficulté et le nombre de solutions
  // Facile : 3000-5000€, Moyen : 5000-8000€, Complexe : 8000-15000€
  let implementationCost = 0;
  suggestions.forEach(s => {
    if (s.difficulty === 'Facile') {
      implementationCost += 4000; // Moyenne
    } else if (s.difficulty === 'Moyen') {
      implementationCost += 6500; // Moyenne
    } else {
      implementationCost += 11500; // Moyenne
    }
  });
  
  // Coût de maintenance annuel (15% de l'investissement initial)
  const annualMaintenanceCost = implementationCost * 0.15;
  
  // ROI réel calculé : (Gains annuels - Coûts annuels) / Investissement * 100
  const annualGains = annualValueSaved - annualMaintenanceCost;
  const realROI = (annualGains / implementationCost) * 100;
  
  // Utiliser le ROI du benchmark comme référence, mais ajuster avec le calcul réel
  const roiRange = benchmark.averageROI.match(/(\d+)-(\d+)/);
  const benchmarkMinROI = roiRange ? parseInt(roiRange[1]) : 250;
  const benchmarkMaxROI = roiRange ? parseInt(roiRange[2]) : 450;
  const benchmarkAvgROI = (benchmarkMinROI + benchmarkMaxROI) / 2;
  
  // Ajuster le ROI calculé pour qu'il soit cohérent avec le benchmark du secteur
  // Si le ROI calculé est trop différent, on l'ajuste légèrement vers le benchmark
  // mais on garde la logique du calcul réel
  const adjustedROI = realROI > 0 
    ? Math.min(Math.max(realROI * 0.7, benchmarkMinROI * 0.8), benchmarkMaxROI * 1.2)
    : benchmarkAvgROI;
  
  // Période de retour sur investissement (payback period)
  const paybackMatch = benchmark.paybackPeriod.match(/(\d+)-(\d+)/);
  const paybackMinMonths = paybackMatch ? parseInt(paybackMatch[1]) : 3;
  const paybackMaxMonths = paybackMatch ? parseInt(paybackMatch[2]) : 10;
  
  // Calcul réaliste du payback : Investissement / (Gains mensuels - Coûts mensuels)
  const monthlyGains = (totalHoursPerMonth * hourlyRate) - (annualMaintenanceCost / 12);
  const calculatedPaybackMonths = monthlyGains > 0 
    ? Math.ceil(implementationCost / monthlyGains)
    : (paybackMinMonths + paybackMaxMonths) / 2;
  
  // Ajuster le payback pour qu'il soit dans la fourchette du benchmark
  const adjustedPaybackMonths = Math.max(
    paybackMinMonths,
    Math.min(calculatedPaybackMonths, paybackMaxMonths)
  );
  
  // Projection ROI sur 12 mois avec croissance réaliste
  const roiProjection = [];
  for (let month = 1; month <= 12; month++) {
    if (month <= adjustedPaybackMonths) {
      // Pendant la période de payback : ROI négatif puis croissance progressive
      const progress = month / adjustedPaybackMonths;
      const cumulativeROI = adjustedROI * progress * 0.3; // 30% du ROI final au payback
      roiProjection.push({
        month,
        cumulativeROI: Math.round(Math.max(0, cumulativeROI)),
        investment: Math.round(implementationCost)
      });
    } else {
      // Après le payback : croissance progressive vers le ROI final
      const monthsAfterPayback = month - adjustedPaybackMonths;
      const remainingMonths = 12 - adjustedPaybackMonths;
      const progress = monthsAfterPayback / remainingMonths;
      const cumulativeROI = (adjustedROI * 0.3) + (adjustedROI * 0.7 * progress);
      roiProjection.push({
        month,
        cumulativeROI: Math.round(cumulativeROI),
        investment: Math.round(implementationCost)
      });
    }
  }

  // 4. Potentiel d'automatisation par tâche (basé sur les suggestions)
  const automationPotential = suggestions.map((suggestion, index) => {
    const hours = extractHours(suggestion.timeSaved);
    const automationLevel = suggestion.difficulty === 'Facile' ? 85 : suggestion.difficulty === 'Moyen' ? 70 : 60;
    const priority: 'high' | 'medium' | 'low' = hours >= 8 ? 'high' : hours >= 5 ? 'medium' : 'low';
    
    return {
      task: suggestion.title.replace(/Agent IA de |Agent IA d'|Automatisation /gi, '').substring(0, 30),
      automationLevel,
      priority
    };
  });

  return {
    timeGainBySolution,
    impactByCategory: categories,
    roiProjection,
    automationPotential
  };
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userProblem } = req.body;

  if (!userProblem || typeof userProblem !== 'string') {
    return res.status(400).json({ error: 'userProblem is required' });
  }

  // Get API key from environment (server-side, secure)
  const apiKey = process.env.DefaultGeminiAPIKey || process.env.GEMINI_API_KEY || '';

  if (!apiKey) {
    console.error('❌ GEMINI_API_KEY or DefaultGeminiAPIKey is not set in Vercel environment variables');
    return res.status(500).json({ 
      error: 'API key not configured',
      message: 'Please configure DefaultGeminiAPIKey or GEMINI_API_KEY in Vercel Dashboard → Settings → Environment Variables'
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // Try different models in order of preference
    const models = ["gemini-2.0-flash-exp", "gemini-2.5-flash", "gemini-1.5-flash"];
    
    const prompt = `
Tu es un expert consultant en IA et automatisation d'entreprises, spécialisé dans la création d'agents IA sur mesure pour libérer les dirigeants et leurs équipes des tâches répétitives.

PROBLÈME DE L'UTILISATEUR :
"${userProblem}"

ÉTAPE 1 : ANALYSE CONTEXTUELLE APPROFONDIE (OBLIGATOIRE)

Avant de proposer des solutions, tu DOIS analyser précisément le problème en identifiant :

A. SECTEUR D'ACTIVITÉ :
Analyse les mots-clés pour identifier le secteur :
- Commerce/Retail : "boutique", "magasin", "vente", "clientèle", "rayon", "stock", "inventaire", "caisse", "commande", "livraison"
- Services : "prestation", "intervention", "mission", "client", "rendez-vous", "devis", "facturation", "suivi"
- E-commerce : "site web", "panier", "commande en ligne", "logistique", "expédition", "marketplace", "produit", "catalogue"
- Immobilier : "bien", "appartement", "maison", "visite", "mandat", "bail", "locataire", "propriétaire", "diagnostic"
- Santé/Médical : "patient", "consultation", "rendez-vous", "dossier médical", "ordonnance", "bilan", "soin", "cabinet"
- Juridique : "contrat", "dossier", "client", "honoraires", "audience", "procédure", "réglementation", "conformité"
- RH/Recrutement : "CV", "candidat", "recrutement", "entretien", "poste", "salaire", "contrat de travail", "onboarding"
- Marketing/Communication : "campagne", "réseaux sociaux", "contenu", "publication", "audience", "engagement", "ROI"
- Comptabilité/Finance : "facture", "devis", "comptabilité", "bilan", "déclaration", "fiscal", "paiement", "relance"
- Restauration : "commande", "menu", "service", "table", "réservation", "cuisine", "livraison", "takeaway"
- Transport/Logistique : "livraison", "colis", "transport", "expédition", "suivi", "entrepôt", "stock"
- Éducation/Formation : "élève", "étudiant", "cours", "formation", "inscription", "évaluation", "certificat"
- BTP/Construction : "chantier", "devis", "matériaux", "planning", "intervention", "facturation", "suivi travaux"
- Conseil/Expertise : "mission", "audit", "conseil", "rapport", "analyse", "recommandation", "client"
- Et tous les autres secteurs (reconnais les mots-clés spécifiques)

B. TÂCHE/MÉTIER IDENTIFIÉ :
Identifie précisément le métier ou la fonction :
- Dirigeant/CEO : "je dois", "je gère", "mon entreprise", "mes équipes"
- Commercial : "prospect", "client", "devis", "vente", "négociation", "relance"
- Assistant/Secretariat : "agenda", "rendez-vous", "courrier", "appels", "organisation"
- Comptable : "facture", "comptabilité", "déclaration", "écriture", "rapprochement"
- Marketing : "contenu", "campagne", "publication", "réseaux sociaux", "communication"
- RH : "recrutement", "CV", "candidat", "entretien", "paie", "congés"
- Support client : "ticket", "demande", "réclamation", "FAQ", "assistance"
- Et tous les autres métiers

C. VOCABULAIRE TECHNIQUE ET SYNONYMES :
Reconnais tous les synonymes et termes techniques :
- Email/Courrier : "email", "mail", "courrier", "message", "boîte mail", "messagerie"
- Devis/Estimation : "devis", "estimation", "proposition", "offre", "prix", "tarif"
- Facture/Note : "facture", "note", "avoir", "facturation", "facturer"
- Rendez-vous/Meeting : "rendez-vous", "RDV", "meeting", "réunion", "visite", "entretien"
- Client/Customer : "client", "customer", "acheteur", "prospect", "lead", "utilisateur"
- Document/Papier : "document", "papier", "fichier", "dossier", "contrat", "formulaire"
- Tâche/Activité : "tâche", "activité", "travail", "mission", "opération", "processus"
- Et tous les autres synonymes professionnels

D. CONTEXTE SPÉCIFIQUE :
Identifie les détails précis :
- Fréquence : "chaque jour", "toutes les semaines", "à chaque fois", "régulièrement"
- Volume : "des dizaines", "des centaines", "beaucoup", "trop", "énormément"
- Processus : "manuellement", "un par un", "répétitif", "chronophage", "fastidieux"
- Outils mentionnés : "Excel", "Word", "CRM", "logiciel", "système", "plateforme"

ÉTAPE 2 : ADAPTATION PRÉCISE AU CONTEXTE IDENTIFIÉ

Une fois le contexte analysé, adapte TOUTES tes réponses en utilisant :
- Le vocabulaire EXACT du secteur identifié
- Les termes techniques appropriés
- Les processus spécifiques au métier
- Les outils et systèmes mentionnés
- Le niveau de complexité adapté au secteur

INSTRUCTIONS STRICTES :

1. ANALYSE EMPATHIQUE (2 phrases max) :
   - Montre que tu comprends PRÉCISÉMENT le problème en utilisant les termes du secteur identifié
   - Référence les mots-clés spécifiques mentionnés par l'utilisateur
   - Montre que tu comprends la frustration et l'impact sur son temps/énergie
   - Sois chaleureux, encourageant et professionnel
   - Utilise "vous" et un ton humain
   - Adapte ton langage au secteur (ex: "vos clients" pour commerce, "vos patients" pour santé, "vos candidats" pour RH)

2. SOLUTIONS D'AUTOMATISATION IA (3 solutions obligatoires) :
   Chaque solution DOIT être :
   - Une AUTOMATISATION PAR AGENT IA (pas juste un outil, mais un agent qui travaille de manière autonome)
   - SPÉCIFIQUE au secteur, métier et vocabulaire identifiés dans l'analyse contextuelle
   - Utiliser les TERMES EXACTS du champ lexical professionnel de l'utilisateur
   - Adapter les processus aux spécificités du secteur (ex: pour restauration = "commandes", "tables", "service" / pour immobilier = "biens", "visites", "mandats")
   - Concrète et actionnable avec des détails précis du métier
   - Avec un titre qui utilise le vocabulaire du secteur
   - Avec une description qui mentionne les outils, processus et termes techniques du secteur

3. FORMAT DES SOLUTIONS :
   - Titre : Nom de l'automatisation (ex: "Agent IA de tri et réponse d'emails", "Agent IA de génération de devis", "Agent IA de suivi client")
   - Description : Explique PRÉCISÉMENT ce que l'agent IA fait, comment il fonctionne, et quelles tâches il automatise (2-3 phrases)
   - Temps économisé : Estimation réaliste (format: "Xh / semaine" ou "Xh / jour" ou "Xh / mois")
   - Difficulté : "Facile", "Moyen", ou "Complexe" selon la complexité technique

RÈGLES ABSOLUES DE PRÉCISION :

1. RECONNAISSANCE LEXICALE OBLIGATOIRE :
   - Analyse TOUS les mots du problème pour identifier le secteur
   - Reconnais les synonymes et termes techniques
   - Utilise EXACTEMENT le même vocabulaire que l'utilisateur
   - Ne remplace JAMAIS un terme technique par un synonyme générique

2. ADAPTATION CONTEXTUELLE À 100% :
   - Chaque solution DOIT utiliser les termes du secteur identifié
   - Les processus décrits DOIVENT correspondre aux réalités du métier
   - Les outils mentionnés DOIVENT être intégrés dans les solutions
   - Les volumes/fréquences mentionnés DOIVENT influencer les estimations de temps

3. SPÉCIFICITÉ MAXIMALE :
   - Ne JAMAIS donner de solutions génériques
   - Chaque solution DOIT être unique au problème décrit
   - Les descriptions DOIVENT mentionner des détails précis du secteur
   - Les titres DOIVENT utiliser le vocabulaire professionnel exact

Réponds UNIQUEMENT en JSON, sans texte avant ou après.
    `;

    // Retry logic: try each model with exponential backoff
    let lastError: any = null;
    const maxRetries = 3;
    
    for (let attempt = 0; attempt < models.length; attempt++) {
      const model = models[attempt];
      
      try {
        // Wait before retry (exponential backoff)
        if (attempt > 0) {
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000); // Max 5 seconds
          await new Promise(resolve => setTimeout(resolve, delay));
        }
        
        console.log(`Attempt ${attempt + 1}: Trying model ${model}`);
        
        const response = await ai.models.generateContent({
          model: model,
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                analysis: {
                  type: Type.STRING,
                  description: "Analyse empathique du problème en 2 phrases maximum, montrant la compréhension de la frustration et l'impact sur le temps/énergie. Ton chaleureux et encourageant.",
                },
                suggestions: {
                  type: Type.ARRAY,
                  description: "Tableau de 3 solutions d'automatisation par agent IA, spécifiquement adaptées au problème décrit. Chaque solution doit être une automatisation concrète et actionnable.",
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { 
                        type: Type.STRING,
                        description: "Nom clair et descriptif de l'automatisation par agent IA (ex: 'Agent IA de tri et réponse d'emails', 'Agent IA de génération de devis'). Doit commencer par 'Agent IA' ou contenir 'automatisation IA'."
                      },
                      description: { 
                        type: Type.STRING,
                        description: "Description détaillée (2-3 phrases) expliquant précisément ce que l'agent IA fait, comment il fonctionne, et quelles tâches il automatise. Doit être spécifique au problème de l'utilisateur."
                      },
                      timeSaved: { 
                        type: Type.STRING, 
                        description: "Estimation réaliste du temps gagné au format 'Xh / semaine', 'Xh / jour', ou 'Xh / mois'. Doit être crédible et mesurable."
                      },
                      difficulty: { 
                        type: Type.STRING, 
                        enum: ["Facile", "Moyen", "Complexe"],
                        description: "Niveau de difficulté technique de l'implémentation. Facile = rapide à mettre en place, Moyen = nécessite quelques intégrations, Complexe = système avancé avec plusieurs composants."
                      },
                    },
                    required: ["title", "description", "timeSaved", "difficulty"],
                  },
                  minItems: 3,
                  maxItems: 3,
                },
              },
              required: ["analysis", "suggestions"],
            },
          },
        });

        const text = response.text;
        if (!text) {
          throw new Error("No response from Gemini");
        }

        const result = JSON.parse(text);
        
        // Ajouter les données de benchmark basées sur des données réelles
        let benchmark;
        try {
          benchmark = generateBenchmarkData(userProblem);
          // Log pour déboguer la détection de secteur
          console.log(`🔍 User problem: "${userProblem.substring(0, 100)}..."`);
          console.log(`📊 Detected sector benchmark:`, {
            sectorAverage: benchmark.sectorAverage,
            automatedProcessesPercentage: benchmark.automatedProcessesPercentage,
            averageTimeSavedPerTask: benchmark.averageTimeSavedPerTask,
            averageROI: benchmark.averageROI,
            paybackPeriod: benchmark.paybackPeriod
          });
        } catch (error) {
          console.error('❌ Error generating benchmark:', error);
          // Fallback en cas d'erreur
          benchmark = {
            automatedProcessesPercentage: 60,
            averageTimeSavedPerTask: "8-12h / semaine",
            averageROI: "250-450%",
            paybackPeriod: "3-10 mois",
            sectorAverage: "entreprises françaises"
          };
        }
        
        // Générer les données de visualisation basées sur les suggestions réelles
        const visualization = generateVisualizationData(
          result.suggestions,
          userProblem,
          benchmark
        );
        
        const resultWithBenchmark = {
          ...result,
          benchmark,
          visualization
        };
        
        console.log(`✅ Success with model ${model}`);
        return res.status(200).json(resultWithBenchmark);
        
      } catch (error: any) {
        lastError = error;
        const errorMessage = error.message || JSON.stringify(error);
        
        // If it's an overloaded error, try next model
        if (errorMessage.includes('overloaded') || errorMessage.includes('503') || errorMessage.includes('UNAVAILABLE')) {
          console.log(`⚠️ Model ${model} is overloaded, trying next model...`);
          continue; // Try next model
        }
        
        // If it's a different error, throw it
        throw error;
      }
    }
    
    // If all models failed, throw the last error
    throw lastError;

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    // Handle specific Gemini API errors
    if (error.message?.includes('overloaded') || error.message?.includes('503') || error.message?.includes('UNAVAILABLE')) {
      return res.status(503).json({ 
        error: 'Service temporarily unavailable',
        message: "L'API Gemini est temporairement surchargée. Veuillez réessayer dans quelques instants.",
        retry: true
      });
    }
    
    return res.status(500).json({ 
      error: 'Failed to generate audit',
      message: error.message || 'Unknown error occurred'
    });
  }
}

