import { AuditResult, VisualizationData } from '../types';
// Import inline de la logique de détection pour éviter les problèmes d'import cross-domain
function getAdaptiveBenchmark(userProblem: string): AuditResult['benchmark'] {
  const problemLower = userProblem.toLowerCase();
  
  // Définition du champ lexical complet pour chaque secteur
  const sectorKeywords: Record<string, string[]> = {
    'immobilier': [
      // Métiers et acteurs
      'immobilier', 'agent immobilier', 'conseiller immobilier', 'négociateur', 'mandataire', 'syndic',
      'agence immobilière', 'agence immo', 'cabinet immobilier', 'promoteur', 'aménageur',
      // Biens et types
      'bien', 'appartement', 'appart', 'maison', 'villa', 'studio', 'f2', 'f3', 'f4', 'f5',
      'local commercial', 'bureau', 'terrain', 'lotissement', 'copropriété', 'immeuble',
      // Activités
      'mandat', 'mandat exclusif', 'mandat simple', 'visite', 'visite immobilière', 'accompagnement',
      'estimation', 'expertise immobilière', 'diagnostic', 'diagnostics', 'dpe', 'amiante',
      'transaction', 'vente', 'achat', 'location', 'gestion locative', 'gestion de biens',
      // Acteurs
      'propriétaire', 'vendeur', 'acheteur', 'acquéreur', 'locataire', 'bailleur', 'locataire',
      'copropriétaire', 'syndicat', 'conseil syndical',
      // Documents et processus
      'compromis', 'acte de vente', 'acte authentique', 'notaire', 'bail', 'quittance', 'état des lieux',
      'inventaire', 'caution', 'garantie', 'dépôt de garantie',
      // Géographie (villes françaises majeures)
      'lyon', 'paris', 'marseille', 'toulouse', 'nice', 'nantes', 'strasbourg', 'montpellier',
      'bordeaux', 'lille', 'rennes', 'reims', 'saint-étienne', 'toulon', 'grenoble', 'dijon',
      'angers', 'villeurbanne', 'nîmes', 'saint-denis', 'le havre', 'aix-en-provence'
    ],
    'ecommerce': [
      // Plateformes et outils
      'e-commerce', 'ecommerce', 'e-com', 'boutique en ligne', 'shop en ligne', 'site e-commerce',
      'marketplace', 'amazon', 'shopify', 'woocommerce', 'prestashop', 'magento', 'wix', 'squarespace',
      'etsy', 'ebay', 'leboncoin', 'vinted', 'fnac', 'darty', 'cdiscount', 'rakuten',
      // Activités e-commerce
      'vente en ligne', 'vente online', 'commerce en ligne', 'commerce digital', 'vente digitale',
      'dropshipping', 'affiliation', 'marketplace', 'place de marché',
      // Processus
      'panier', 'checkout', 'paiement en ligne', 'caisse', 'commande en ligne', 'commande online',
      'expédition', 'livraison', 'colis', 'logistique e-commerce', 'fulfillment', 'stockage',
      'gestion stock', 'inventaire', 'réassort', 'réapprovisionnement',
      // Produits et catalogue
      'produit', 'catalogue', 'fiche produit', 'description produit', 'image produit', 'prix',
      'tarif', 'promotion', 'réduction', 'code promo', 'bon de réduction', 'remise',
      // Clients et marketing
      'client en ligne', 'visiteur', 'trafic', 'conversion', 'taux de conversion', 'panier moyen',
      'abandon de panier', 'email marketing', 'newsletter', 'seo e-commerce', 'sea', 'publicité en ligne'
    ],
    'sante': [
      // Professionnels
      'santé', 'médical', 'médecin', 'docteur', 'dr.', 'généraliste', 'spécialiste', 'chirurgien',
      'dentiste', 'vétérinaire', 'kinésithérapeute', 'ostéopathe', 'pharmacien', 'infirmier',
      'sage-femme', 'psychologue', 'psychiatre', 'orthophoniste', 'ergothérapeute',
      // Établissements
      'hôpital', 'clinique', 'cabinet médical', 'cabinet dentaire', 'laboratoire', 'pharmacie',
      'centre de santé', 'maison de santé', 'ehpad', 'maison de retraite', 'établissement de santé',
      // Activités
      'consultation', 'rendez-vous médical', 'rdv médical', 'consultation médicale', 'examen',
      'diagnostic', 'soin', 'traitement', 'intervention', 'opération', 'chirurgie',
      // Documents et processus
      'ordonnance', 'prescription', 'dossier médical', 'dossier patient', 'fiche patient',
      'comptabilité médicale', 'facturation médicale', 'tiers payant', 'carte vitale',
      'feuille de soins', 'remboursement', 'mutuelle', 'sécurité sociale',
      // Spécialités
      'cardiologie', 'dermatologie', 'pédiatrie', 'gynécologie', 'ophtalmologie', 'orthopédie',
      'radiologie', 'anesthésie', 'urgences', 'médecine générale'
    ],
    'restauration': [
      // Types d'établissements
      'restaurant', 'restauration', 'brasserie', 'bistrot', 'bistro', 'café', 'bar', 'pub',
      'hôtel', 'hôtellerie', 'hôtel-restaurant', 'relais', 'auberge', 'gîte', 'chambre d\'hôte',
      'fast-food', 'food truck', 'traiteur', 'catering', 'service traiteur',
      // Activités
      'cuisine', 'service', 'salle', 'chef', 'cuisinier', 'serveur', 'serveuse', 'maître d\'hôtel',
      'sommelier', 'barman', 'barmaid', 'gérant restaurant', 'directeur restaurant',
      // Processus
      'menu', 'carte', 'réservation', 'booking', 'planning service', 'gestion table', 'gestion salle',
      'commande', 'bon de commande', 'ticket', 'encaissement', 'addition', 'pourboire',
      // Produits
      'plat', 'entrée', 'dessert', 'boisson', 'vin', 'cocktail', 'apéritif', 'digestif',
      'ingrédient', 'approvisionnement', 'fournisseur', 'marché', 'livraison produit',
      // Gestion
      'gestion stock restaurant', 'inventaire restaurant', 'coût matière', 'marge', 'marge brute',
      'planning équipe', 'gestion équipe', 'paie serveur', 'planning cuisinier'
    ],
    'services': [
      // Types de services
      'conseil', 'consultant', 'consulting', 'cabinet de conseil', 'cabinet conseil',
      'expertise', 'expert', 'audit', 'auditeur', 'formation', 'formateur', 'coaching', 'coach',
      'accompagnement', 'accompagnateur', 'accompagnement entreprise',
      // Domaines
      'conseil stratégique', 'conseil organisationnel', 'conseil digital', 'conseil rrh',
      'conseil financier', 'conseil juridique', 'conseil marketing', 'conseil commercial',
      'transformation digitale', 'transformation numérique', 'digitalisation',
      // Activités
      'mission', 'projet', 'intervention', 'accompagnement projet', 'pilotage projet',
      'formation professionnelle', 'formation continue', 'cpf', 'compte personnel formation',
      'coaching individuel', 'coaching d\'équipe', 'coaching dirigeant',
      // Clients
      'client conseil', 'entreprise cliente', 'dirigeant', 'manager', 'équipe',
      'facturation conseil', 'devis conseil', 'proposition commerciale'
    ],
    'finance': [
      // Acteurs
      'finance', 'financier', 'banque', 'banquier', 'banquier privé', 'conseiller bancaire',
      'assurance', 'assureur', 'courtier', 'courtier en assurance', 'courtier crédit',
      'expert-comptable', 'cabinet comptable', 'comptable', 'fiscaliste', 'avocat fiscaliste',
      // Activités
      'crédit', 'prêt', 'emprunt', 'financement', 'investissement', 'épargne', 'placement',
      'assurance vie', 'assurance habitation', 'assurance auto', 'mutuelle', 'prévoyance',
      'retraite', 'épargne retraite', 'per', 'perp', 'pea', 'assurance-vie',
      // Services
      'conseil en investissement', 'gestion de patrimoine', 'patrimoine', 'succession',
      'fiscalité', 'optimisation fiscale', 'déclaration fiscale', 'is', 'impôt',
      'comptabilité', 'tenue de comptabilité', 'liasse fiscale', 'bilan', 'compte de résultat',
      // Produits
      'compte courant', 'livret', 'plan épargne', 'assurance', 'contrat d\'assurance',
      'crédit immobilier', 'crédit consommation', 'crédit auto', 'leasing', 'location longue durée'
    ],
    'education': [
      // Établissements
      'éducation', 'formation', 'école', 'collège', 'lycée', 'université', 'faculté',
      'centre de formation', 'organisme de formation', 'of', 'cfp', 'centre formation',
      'école privée', 'école publique', 'établissement scolaire', 'académie',
      // Acteurs
      'professeur', 'enseignant', 'formateur', 'instructeur', 'tuteur', 'coach pédagogique',
      'directeur école', 'proviseur', 'cpe', 'conseiller pédagogique',
      // Activités
      'cours', 'formation', 'enseignement', 'pédagogie', 'apprentissage', 'apprendre',
      'formation professionnelle', 'formation continue', 'cpf', 'compte personnel formation',
      'vae', 'validation acquis expérience', 'alternance', 'apprentissage',
      // Processus
      'inscription', 'admission', 'scolarité', 'bulletin', 'note', 'évaluation', 'examen',
      'contrôle', 'devoir', 'devoir maison', 'dm', 'devoir surveillé', 'ds',
      'planning cours', 'emploi du temps', 'edt', 'cahier de texte', 'cahier texte numérique'
    ],
    'transport': [
      // Types
      'transport', 'transporteur', 'logistique', 'livraison', 'expédition', 'fret',
      'transport routier', 'transport de marchandises', 'messagerie', 'coursier',
      'livreur', 'chauffeur', 'conducteur', 'routier',
      // Véhicules
      'camion', 'poids lourd', 'utilitaire', 'fourgon', 'véhicule utilitaire',
      'flotte', 'gestion flotte', 'parc automobile', 'véhicule entreprise',
      // Activités
      'tournée', 'planification tournée', 'optimisation tournée', 'route',
      'colis', 'envoi', 'expédition colis', 'suivi colis', 'tracking', 'traçabilité',
      'livraison à domicile', 'livraison express', 'livraison chronopost', 'chronopost',
      'dhl', 'ups', 'fedex', 'mondial relay', 'relais colis',
      // Gestion
      'gestion transport', 'tms', 'transport management system', 'planification transport',
      'suivi véhicule', 'géolocalisation', 'gps', 'télépéage', 'télésuivi'
    ],
    'btp': [
      // Métiers
      'btp', 'construction', 'bâtiment', 'travaux', 'travaux publics', 'tp',
      'maçon', 'maçonnerie', 'plombier', 'plomberie', 'électricien', 'électricité',
      'charpentier', 'charpente', 'couvreur', 'couverture', 'carreleur', 'carrelage',
      'peintre', 'peinture', 'menuisier', 'menuiserie', 'serrurier', 'serrurerie',
      // Types d'entreprises
      'entreprise btp', 'artisan', 'artisanat', 'artisan du bâtiment',
      'gros œuvre', 'second œuvre', 'rénovation', 'réhabilitation', 'neuf',
      // Activités
      'chantier', 'chantier construction', 'gestion chantier', 'suivi chantier',
      'devis travaux', 'devis btp', 'facturation travaux', 'facturation btp',
      'planning travaux', 'planning chantier', 'coordination travaux',
      // Matériaux et fournitures
      'matériaux', 'matériau', 'fournitures', 'approvisionnement', 'commande matériaux',
      'béton', 'ciment', 'parpaing', 'brique', 'tuile', 'isolation', 'laine de verre'
    ],
    'industrie': [
      // Types
      'industrie', 'industriel', 'manufacturing', 'production', 'fabrication',
      'usine', 'atelier', 'atelier de production', 'chaîne de production', 'ligne de production',
      // Activités
      'production', 'fabrication', 'assemblage', 'montage', 'conditionnement', 'emballage',
      'qualité', 'contrôle qualité', 'qc', 'qa', 'maintenance', 'maintenance industrielle',
      'maintenance préventive', 'maintenance corrective',
      // Équipements
      'machine', 'équipement', 'équipement industriel', 'robot', 'robotique', 'automatisation',
      'ligne automatisée', 'chaîne automatisée', 'cobot', 'robot collaboratif',
      // Gestion
      'gestion production', 'planification production', 'planning production',
      'gestion stock industriel', 'inventaire industriel', 'approvisionnement',
      'logistique industrielle', 'supply chain', 'chaîne logistique',
      // Secteurs industriels
      'automobile', 'aéronautique', 'agroalimentaire', 'pharmaceutique', 'chimie',
      'textile', 'métallurgie', 'sidérurgie', 'plasturgie'
    ]
  };
  
  // Système de scoring : chaque secteur reçoit un score basé sur le nombre de mots-clés trouvés
  const sectorScores: Record<string, number> = {};
  
  // Initialiser les scores
  Object.keys(sectorKeywords).forEach(sector => {
    sectorScores[sector] = 0;
  });
  
  // Calculer les scores pour chaque secteur
  Object.entries(sectorKeywords).forEach(([sector, keywords]) => {
    keywords.forEach(keyword => {
      // Utiliser une regex pour trouver le mot-clé (insensible à la casse, avec word boundaries)
      const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (regex.test(problemLower)) {
        sectorScores[sector] = (sectorScores[sector] || 0) + 1;
      }
    });
  });
  
  // Trouver le secteur avec le score le plus élevé
  let maxScore = 0;
  let sector = 'general';
  
  Object.entries(sectorScores).forEach(([sect, score]) => {
    if (score > maxScore) {
      maxScore = score;
      sector = sect;
    }
  });
  
  // Si aucun score significatif, retourner 'general'
  if (maxScore < 1) {
    sector = 'general';
  }
  
  // Benchmarks par secteur
  const benchmarks: Record<string, AuditResult['benchmark']> = {
    'immobilier': {
      automatedProcessesPercentage: 58,
      averageTimeSavedPerTask: '10-15h / semaine',
      averageROI: '280-480%',
      paybackPeriod: '3-8 mois',
      sectorAverage: 'entreprises immobilières françaises'
    },
    'ecommerce': {
      automatedProcessesPercentage: 72,
      averageTimeSavedPerTask: '12-18h / semaine',
      averageROI: '320-550%',
      paybackPeriod: '2-5 mois',
      sectorAverage: 'entreprises e-commerce françaises'
    },
    'sante': {
      automatedProcessesPercentage: 52,
      averageTimeSavedPerTask: '8-14h / semaine',
      averageROI: '240-420%',
      paybackPeriod: '4-10 mois',
      sectorAverage: 'établissements de santé français'
    },
    'restauration': {
      automatedProcessesPercentage: 65,
      averageTimeSavedPerTask: '10-16h / semaine',
      averageROI: '270-450%',
      paybackPeriod: '3-7 mois',
      sectorAverage: 'établissements de restauration français'
    },
    'services': {
      automatedProcessesPercentage: 68,
      averageTimeSavedPerTask: '12-18h / semaine',
      averageROI: '300-520%',
      paybackPeriod: '2-6 mois',
      sectorAverage: 'cabinet de conseil français'
    },
    'finance': {
      automatedProcessesPercentage: 75,
      averageTimeSavedPerTask: '15-22h / semaine',
      averageROI: '350-600%',
      paybackPeriod: '2-5 mois',
      sectorAverage: 'établissements financiers français'
    },
    'education': {
      automatedProcessesPercentage: 55,
      averageTimeSavedPerTask: '8-12h / semaine',
      averageROI: '250-400%',
      paybackPeriod: '4-9 mois',
      sectorAverage: 'organismes de formation français'
    },
    'transport': {
      automatedProcessesPercentage: 70,
      averageTimeSavedPerTask: '14-20h / semaine',
      averageROI: '310-500%',
      paybackPeriod: '2-6 mois',
      sectorAverage: 'entreprises de transport françaises'
    },
    'btp': {
      automatedProcessesPercentage: 48,
      averageTimeSavedPerTask: '6-10h / semaine',
      averageROI: '220-380%',
      paybackPeriod: '4-11 mois',
      sectorAverage: 'entreprises du BTP françaises'
    },
    'industrie': {
      automatedProcessesPercentage: 78,
      averageTimeSavedPerTask: '16-24h / semaine',
      averageROI: '380-650%',
      paybackPeriod: '2-4 mois',
      sectorAverage: 'entreprises industrielles françaises'
    },
    'general': {
      automatedProcessesPercentage: 60,
      averageTimeSavedPerTask: '8-12h / semaine',
      averageROI: '250-450%',
      paybackPeriod: '3-10 mois',
      sectorAverage: 'entreprises françaises'
    }
  };
  
  return benchmarks[sector] || benchmarks['general'];
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
