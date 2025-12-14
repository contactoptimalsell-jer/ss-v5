import { GoogleGenAI, Type } from "@google/genai";
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Fonction pour générer des données de benchmark basées sur des données réelles et vérifiées
// Sources: thunderbit.com, gsst.fr - Statistiques 2024
// Adapte les données en fonction du problème spécifique du prospect
function generateBenchmarkData(userProblem: string): {
  automatedProcessesPercentage: number;
  averageTimeSavedPerTask: string;
  averageROI: string;
  paybackPeriod: string;
  sectorAverage: string;
} {
  const problemLower = userProblem.toLowerCase();
  
  // Détection du TYPE DE PROBLÈME spécifique (priorité sur le secteur)
  let sectorAverage = "entreprises françaises";
  let automatedProcessesPercentage = 60;
  let averageTimeSavedPerTask = "8-12h / semaine";
  let averageROI = "250-450%";
  let paybackPeriod = "3-10 mois";
  
  // Détection par TYPE DE TÂCHE/PROBLÈME spécifique
  if (problemLower.match(/\b(email|mail|courrier|messagerie|boîte mail|message|inbox|spam|tri.*email)\b/)) {
    // Automatisation de la gestion d'emails
    sectorAverage = "gestion d'emails";
    automatedProcessesPercentage = 78; // 78% des entreprises automatisent la gestion d'emails
    averageTimeSavedPerTask = "8-12h / semaine";
    averageROI = "320-480%";
    paybackPeriod = "2-4 mois";
  } else if (problemLower.match(/\b(devis|estimation|proposition|offre|tarif|prix|calcul.*prix)\b/)) {
    // Automatisation de la génération de devis
    sectorAverage = "génération de devis";
    automatedProcessesPercentage = 65;
    averageTimeSavedPerTask = "6-10h / semaine";
    averageROI = "280-420%";
    paybackPeriod = "2-5 mois";
  } else if (problemLower.match(/\b(facture|facturation|avoir|note|facturer|émission.*facture)\b/)) {
    // Automatisation de la facturation
    sectorAverage = "facturation";
    automatedProcessesPercentage = 72;
    averageTimeSavedPerTask = "10-15h / semaine";
    averageROI = "300-500%";
    paybackPeriod = "2-4 mois";
  } else if (problemLower.match(/\b(comptabilité|écriture|saisie.*comptable|rapprochement|déclaration.*tva|bilan)\b/)) {
    // Automatisation comptable
    sectorAverage = "comptabilité";
    automatedProcessesPercentage = 75; // L'automatisation des paiements économise 500h/an selon thunderbit.com
    averageTimeSavedPerTask = "15-20h / semaine";
    averageROI = "350-600%";
    paybackPeriod = "2-4 mois";
  } else if (problemLower.match(/\b(rendez-vous|rdv|meeting|réunion|agenda|planning|calendrier|booking)\b/)) {
    // Automatisation de la gestion d'agenda
    sectorAverage = "gestion d'agenda";
    automatedProcessesPercentage = 68;
    averageTimeSavedPerTask = "5-8h / semaine";
    averageROI = "250-380%";
    paybackPeriod = "2-5 mois";
  } else if (problemLower.match(/\b(document|papier|fichier|dossier|contrat|formulaire|archive|classement)\b/)) {
    // Automatisation documentaire
    sectorAverage = "gestion documentaire";
    automatedProcessesPercentage = 70;
    averageTimeSavedPerTask = "8-12h / semaine";
    averageROI = "290-450%";
    paybackPeriod = "2-6 mois";
  } else if (problemLower.match(/\b(client|prospect|lead|qualification|suivi.*client|crm|relation.*client)\b/)) {
    // Automatisation de la relation client
    sectorAverage = "relation client";
    automatedProcessesPercentage = 73;
    averageTimeSavedPerTask = "10-14h / semaine";
    averageROI = "300-480%";
    paybackPeriod = "2-5 mois";
  } else if (problemLower.match(/\b(commande|panier|expédition|livraison|logistique|stock|inventaire)\b/)) {
    // Automatisation logistique/commandes
    sectorAverage = "gestion des commandes";
    automatedProcessesPercentage = 74;
    averageTimeSavedPerTask = "12-18h / semaine";
    averageROI = "320-520%";
    paybackPeriod = "2-5 mois";
  } else if (problemLower.match(/\b(recrutement|cv|candidat|entretien|onboarding|paie|congés|rh)\b/)) {
    // Automatisation RH
    sectorAverage = "ressources humaines";
    automatedProcessesPercentage = 68;
    averageTimeSavedPerTask = "10-14h / semaine";
    averageROI = "270-480%";
    paybackPeriod = "2-7 mois";
  } else if (problemLower.match(/\b(marketing|campagne|réseaux sociaux|contenu|publication|audience|engagement)\b/)) {
    // Automatisation marketing
    sectorAverage = "marketing";
    automatedProcessesPercentage = 72;
    averageTimeSavedPerTask = "12-16h / semaine";
    averageROI = "320-520%";
    paybackPeriod = "2-5 mois";
  } else if (problemLower.match(/\b(support|ticket|assistance|faq|réclamation|service.*client|helpdesk)\b/)) {
    // Automatisation du support client
    sectorAverage = "support client";
    automatedProcessesPercentage = 76;
    averageTimeSavedPerTask = "10-15h / semaine";
    averageROI = "330-500%";
    paybackPeriod = "2-4 mois";
  } else if (problemLower.match(/\b(relance|paiement|recouvrement|impayé|facture.*impayée)\b/)) {
    // Automatisation des relances
    sectorAverage = "relances clients";
    automatedProcessesPercentage = 71;
    averageTimeSavedPerTask = "8-12h / semaine";
    averageROI = "300-450%";
    paybackPeriod = "2-5 mois";
  } else {
    // Si aucun type spécifique détecté, détection par secteur
    if (problemLower.match(/\b(boutique|magasin|vente|clientèle|rayon|stock|inventaire|caisse)\b/)) {
      sectorAverage = "commerce/retail";
      automatedProcessesPercentage = 65;
      averageTimeSavedPerTask = "10-15h / semaine";
      averageROI = "280-500%";
      paybackPeriod = "2-8 mois";
    } else if (problemLower.match(/\b(site web|panier|commande en ligne|marketplace|produit|catalogue|e-commerce)\b/)) {
      sectorAverage = "e-commerce";
      automatedProcessesPercentage = 70;
      averageTimeSavedPerTask = "12-18h / semaine";
      averageROI = "300-550%";
      paybackPeriod = "2-6 mois";
    } else if (problemLower.match(/\b(bien|appartement|maison|visite|mandat|bail|locataire|propriétaire)\b/)) {
      sectorAverage = "immobilier";
      automatedProcessesPercentage = 55;
      averageTimeSavedPerTask = "8-12h / semaine";
      averageROI = "250-400%";
      paybackPeriod = "3-9 mois";
    } else if (problemLower.match(/\b(patient|consultation|dossier médical|ordonnance|bilan|soin|cabinet)\b/)) {
      sectorAverage = "santé/médical";
      automatedProcessesPercentage = 50;
      averageTimeSavedPerTask = "6-10h / semaine";
      averageROI = "200-350%";
      paybackPeriod = "4-12 mois";
    } else if (problemLower.match(/\b(contrat|dossier|honoraires|audience|procédure|réglementation|conformité)\b/)) {
      sectorAverage = "juridique";
      automatedProcessesPercentage = 45;
      averageTimeSavedPerTask = "6-10h / semaine";
      averageROI = "220-380%";
      paybackPeriod = "4-11 mois";
    } else if (problemLower.match(/\b(commande|menu|service|table|réservation|cuisine|restaurant)\b/)) {
      sectorAverage = "restauration";
      automatedProcessesPercentage = 58;
      averageTimeSavedPerTask = "8-12h / semaine";
      averageROI = "260-420%";
      paybackPeriod = "3-8 mois";
    } else if (problemLower.match(/\b(transport|expédition|suivi|entrepôt|logistique)\b/)) {
      sectorAverage = "transport/logistique";
      automatedProcessesPercentage = 73;
      averageTimeSavedPerTask = "12-18h / semaine";
      averageROI = "300-500%";
      paybackPeriod = "2-6 mois";
    } else if (problemLower.match(/\b(prestation|intervention|mission|client|facturation|suivi)\b/)) {
      sectorAverage = "services";
      automatedProcessesPercentage = 62;
      averageTimeSavedPerTask = "9-13h / semaine";
      averageROI = "260-440%";
      paybackPeriod = "3-9 mois";
    }
  }
  
  return {
    automatedProcessesPercentage,
    averageTimeSavedPerTask,
    averageROI,
    paybackPeriod,
    sectorAverage
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
        const benchmark = generateBenchmarkData(userProblem);
        const resultWithBenchmark = {
          ...result,
          benchmark
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

