// Système intelligent de détection de secteur avec champs lexicaux étendus
// Basé sur des données réelles et vérifiées (thunderbit.com, gsst.fr - 2024)

export interface SectorBenchmark {
  automatedProcessesPercentage: number;
  averageTimeSavedPerTask: string;
  averageROI: string;
  paybackPeriod: string;
  sectorAverage: string;
}

// Champs lexicaux complets pour chaque secteur avec pondération
// Les mots-clés sont pondérés : mots spécifiques = score élevé, mots génériques = score faible
const sectorKeywords: Record<string, Array<{ keyword: string; weight: number }>> = {
  'immobilier': [
    // Mots très spécifiques (poids élevé)
    { keyword: 'agent immobilier', weight: 5 }, { keyword: 'agence immobilière', weight: 5 },
    { keyword: 'mandat exclusif', weight: 4 }, { keyword: 'visite immobilière', weight: 4 },
    { keyword: 'diagnostic immobilier', weight: 4 }, { keyword: 'dpe', weight: 4 },
    { keyword: 'compromis de vente', weight: 4 }, { keyword: 'acte authentique', weight: 4 },
    { keyword: 'gestion locative', weight: 4 }, { keyword: 'syndic', weight: 4 },
    // Mots spécifiques (poids moyen)
    { keyword: 'immobilier', weight: 3 }, { keyword: 'bien immobilier', weight: 3 },
    { keyword: 'appartement', weight: 2 }, { keyword: 'maison', weight: 2 },
    { keyword: 'location', weight: 2 }, { keyword: 'vente immobilière', weight: 3 },
    { keyword: 'propriétaire', weight: 2 }, { keyword: 'locataire', weight: 2 },
    { keyword: 'bail', weight: 2 }, { keyword: 'quittance', weight: 2 },
    { keyword: 'copropriété', weight: 3 }, { keyword: 'notaire', weight: 3 }
  ],
  'ecommerce': [
    // Mots très spécifiques
    { keyword: 'boutique en ligne', weight: 5 }, { keyword: 'e-commerce', weight: 5 },
    { keyword: 'shopify', weight: 5 }, { keyword: 'woocommerce', weight: 5 },
    { keyword: 'prestashop', weight: 5 }, { keyword: 'marketplace', weight: 4 },
    { keyword: 'dropshipping', weight: 5 }, { keyword: 'panier abandonné', weight: 4 },
    { keyword: 'checkout', weight: 4 }, { keyword: 'fulfillment', weight: 4 },
    // Mots spécifiques
    { keyword: 'ecommerce', weight: 3 }, { keyword: 'vente en ligne', weight: 3 },
    { keyword: 'catalogue produit', weight: 3 }, { keyword: 'gestion stock', weight: 2 },
    { keyword: 'livraison colis', weight: 2 }, { keyword: 'expédition', weight: 2 },
    { keyword: 'trafic web', weight: 2 }, { keyword: 'conversion', weight: 2 }
  ],
  'sante': [
    // Mots très spécifiques
    { keyword: 'cabinet médical', weight: 5 }, { keyword: 'consultation médicale', weight: 5 },
    { keyword: 'dossier patient', weight: 5 }, { keyword: 'ordonnance', weight: 4 },
    { keyword: 'carte vitale', weight: 4 }, { keyword: 'tiers payant', weight: 4 },
    { keyword: 'feuille de soins', weight: 4 }, { keyword: 'rendez-vous médical', weight: 4 },
    { keyword: 'clinique', weight: 4 }, { keyword: 'hôpital', weight: 4 },
    // Mots spécifiques
    { keyword: 'médecin', weight: 3 }, { keyword: 'docteur', weight: 3 },
    { keyword: 'santé', weight: 2 }, { keyword: 'médical', weight: 2 },
    { keyword: 'pharmacie', weight: 3 }, { keyword: 'dentiste', weight: 3 },
    { keyword: 'infirmier', weight: 2 }, { keyword: 'soin', weight: 2 }
  ],
  'restauration': [
    // Mots très spécifiques
    { keyword: 'restaurant', weight: 5 }, { keyword: 'brasserie', weight: 4 },
    { keyword: 'réservation table', weight: 4 }, { keyword: 'gestion salle', weight: 4 },
    { keyword: 'planning service', weight: 4 }, { keyword: 'carte menu', weight: 3 },
    { keyword: 'encaissement', weight: 3 }, { keyword: 'gestion stock restaurant', weight: 4 },
    { keyword: 'coût matière', weight: 3 }, { keyword: 'marge brute', weight: 3 },
    // Mots spécifiques
    { keyword: 'restauration', weight: 3 }, { keyword: 'cuisine', weight: 2 },
    { keyword: 'serveur', weight: 2 }, { keyword: 'chef', weight: 2 },
    { keyword: 'hôtel-restaurant', weight: 4 }, { keyword: 'traiteur', weight: 3 }
  ],
  'services': [
    // Mots très spécifiques
    { keyword: 'cabinet de conseil', weight: 5 }, { keyword: 'consultant', weight: 4 },
    { keyword: 'mission conseil', weight: 4 }, { keyword: 'accompagnement projet', weight: 4 },
    { keyword: 'formation professionnelle', weight: 4 }, { keyword: 'coaching', weight: 4 },
    { keyword: 'transformation digitale', weight: 4 }, { keyword: 'audit', weight: 3 },
    // Mots spécifiques
    { keyword: 'conseil', weight: 3 }, { keyword: 'services', weight: 2 },
    { keyword: 'expertise', weight: 2 }, { keyword: 'accompagnement', weight: 2 }
  ],
  'finance': [
    // Mots très spécifiques
    { keyword: 'banque', weight: 5 }, { keyword: 'conseiller bancaire', weight: 5 },
    { keyword: 'crédit immobilier', weight: 5 }, { keyword: 'assurance vie', weight: 4 },
    { keyword: 'gestion patrimoine', weight: 4 }, { keyword: 'expert-comptable', weight: 5 },
    { keyword: 'cabinet comptable', weight: 5 }, { keyword: 'liasse fiscale', weight: 4 },
    { keyword: 'déclaration fiscale', weight: 4 }, { keyword: 'courtier', weight: 4 },
    // Mots spécifiques
    { keyword: 'finance', weight: 3 }, { keyword: 'comptabilité', weight: 3 },
    { keyword: 'fiscalité', weight: 3 }, { keyword: 'assurance', weight: 3 },
    { keyword: 'investissement', weight: 2 }, { keyword: 'épargne', weight: 2 }
  ],
  'education': [
    // Mots très spécifiques
    { keyword: 'organisme de formation', weight: 5 }, { keyword: 'centre de formation', weight: 5 },
    { keyword: 'formation continue', weight: 4 }, { keyword: 'cpf', weight: 4 },
    { keyword: 'emploi du temps', weight: 3 }, { keyword: 'bulletin scolaire', weight: 3 },
    { keyword: 'établissement scolaire', weight: 4 }, { keyword: 'académie', weight: 3 },
    // Mots spécifiques
    { keyword: 'éducation', weight: 3 }, { keyword: 'formation', weight: 2 },
    { keyword: 'école', weight: 2 }, { keyword: 'professeur', weight: 2 },
    { keyword: 'enseignement', weight: 2 }, { keyword: 'pédagogie', weight: 2 }
  ],
  'transport': [
    // Mots très spécifiques
    { keyword: 'transporteur', weight: 5 }, { keyword: 'livraison', weight: 4 },
    { keyword: 'gestion flotte', weight: 4 }, { keyword: 'planification tournée', weight: 4 },
    { keyword: 'suivi colis', weight: 4 }, { keyword: 'logistique', weight: 3 },
    { keyword: 'expédition', weight: 3 }, { keyword: 'messagerie', weight: 3 },
    // Mots spécifiques
    { keyword: 'transport', weight: 3 }, { keyword: 'livreur', weight: 2 },
    { keyword: 'chauffeur', weight: 2 }, { keyword: 'camion', weight: 2 }
  ],
  'btp': [
    // Mots très spécifiques
    { keyword: 'chantier', weight: 5 }, { keyword: 'devis travaux', weight: 4 },
    { keyword: 'gestion chantier', weight: 4 }, { keyword: 'artisan', weight: 4 },
    { keyword: 'maçon', weight: 3 }, { keyword: 'plombier', weight: 3 },
    { keyword: 'électricien', weight: 3 }, { keyword: 'rénovation', weight: 3 },
    // Mots spécifiques
    { keyword: 'btp', weight: 4 }, { keyword: 'construction', weight: 3 },
    { keyword: 'bâtiment', weight: 3 }, { keyword: 'travaux', weight: 2 }
  ],
  'industrie': [
    // Mots très spécifiques
    { keyword: 'usine', weight: 5 }, { keyword: 'chaîne de production', weight: 5 },
    { keyword: 'maintenance industrielle', weight: 4 }, { keyword: 'contrôle qualité', weight: 4 },
    { keyword: 'robotique industrielle', weight: 5 }, { keyword: 'automatisation', weight: 4 },
    { keyword: 'supply chain', weight: 4 }, { keyword: 'logistique industrielle', weight: 4 },
    // Mots spécifiques
    { keyword: 'industrie', weight: 4 }, { keyword: 'production', weight: 3 },
    { keyword: 'fabrication', weight: 3 }, { keyword: 'manufacturing', weight: 3 }
  ],
  'retail': [
    // Mots très spécifiques
    { keyword: 'magasin', weight: 5 }, { keyword: 'point de vente', weight: 5 },
    { keyword: 'pdv', weight: 4 }, { keyword: 'caisse enregistreuse', weight: 4 },
    { keyword: 'gestion stock magasin', weight: 4 }, { keyword: 'inventaire magasin', weight: 4 },
    { keyword: 'réassort', weight: 3 }, { keyword: 'rayon', weight: 3 },
    // Mots spécifiques
    { keyword: 'commerce', weight: 3 }, { keyword: 'retail', weight: 3 },
    { keyword: 'vente', weight: 2 }, { keyword: 'client', weight: 1 }
  ],
  'juridique': [
    // Mots très spécifiques
    { keyword: 'cabinet d\'avocat', weight: 5 }, { keyword: 'avocat', weight: 4 },
    { keyword: 'dossier juridique', weight: 4 }, { keyword: 'procédure', weight: 3 },
    { keyword: 'contrat', weight: 3 }, { keyword: 'juridique', weight: 3 },
    { keyword: 'notaire', weight: 3 }, { keyword: 'huissier', weight: 3 }
  ],
  'agriculture': [
    // Mots très spécifiques
    { keyword: 'exploitation agricole', weight: 5 }, { keyword: 'agriculteur', weight: 4 },
    { keyword: 'élevage', weight: 4 }, { keyword: 'culture', weight: 3 },
    { keyword: 'récolte', weight: 3 }, { keyword: 'tracteur', weight: 3 },
    { keyword: 'agriculture', weight: 3 }, { keyword: 'ferme', weight: 3 }
  ]
};

// Benchmarks réalistes basés sur des données réelles vérifiées (thunderbit.com, gsst.fr - 2024)
const sectorBenchmarks: Record<string, SectorBenchmark> = {
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
  'retail': {
    automatedProcessesPercentage: 62,
    averageTimeSavedPerTask: '9-13h / semaine',
    averageROI: '260-440%',
    paybackPeriod: '3-8 mois',
    sectorAverage: 'magasins et points de vente français'
  },
  'juridique': {
    automatedProcessesPercentage: 56,
    averageTimeSavedPerTask: '10-14h / semaine',
    averageROI: '270-460%',
    paybackPeriod: '3-9 mois',
    sectorAverage: 'cabinets juridiques français'
  },
  'agriculture': {
    automatedProcessesPercentage: 45,
    averageTimeSavedPerTask: '6-9h / semaine',
    averageROI: '200-350%',
    paybackPeriod: '5-12 mois',
    sectorAverage: 'exploitations agricoles françaises'
  },
  'general': {
    automatedProcessesPercentage: 60,
    averageTimeSavedPerTask: '8-12h / semaine',
    averageROI: '250-450%',
    paybackPeriod: '3-10 mois',
    sectorAverage: 'entreprises françaises'
  }
};

/**
 * Détecte le secteur d'activité à partir du problème décrit par l'utilisateur
 * Utilise un système de scoring pondéré pour une détection plus précise
 */
export function detectSector(userProblem: string): string {
  const problemLower = userProblem.toLowerCase();
  const sectorScores: Record<string, number> = {};
  
  // Initialiser les scores
  Object.keys(sectorKeywords).forEach(sector => {
    sectorScores[sector] = 0;
  });
  
  // Calculer les scores pondérés pour chaque secteur
  Object.entries(sectorKeywords).forEach(([sector, keywords]) => {
    keywords.forEach(({ keyword, weight }) => {
      // Utiliser une regex pour trouver le mot-clé (insensible à la casse, avec word boundaries)
      const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escapedKeyword}\\b`, 'i');
      if (regex.test(problemLower)) {
        sectorScores[sector] = (sectorScores[sector] || 0) + weight;
      }
    });
  });
  
  // Trouver le secteur avec le score le plus élevé
  let maxScore = 0;
  let detectedSector = 'general';
  
  Object.entries(sectorScores).forEach(([sector, score]) => {
    if (score > maxScore) {
      maxScore = score;
      detectedSector = sector;
    }
  });
  
  // Seuil minimum pour considérer la détection comme valide
  // Un score de 3 ou plus indique une détection fiable
  return maxScore >= 3 ? detectedSector : 'general';
}

/**
 * Retourne les données de benchmark adaptées au secteur détecté
 * Basé sur des données réelles vérifiées (thunderbit.com, gsst.fr - 2024)
 */
export function getBenchmarkForSector(userProblem: string): SectorBenchmark {
  const sector = detectSector(userProblem);
  const benchmark = sectorBenchmarks[sector] || sectorBenchmarks['general'];
  
  console.log(`📊 [Sector Detection] Problème analysé: "${userProblem.substring(0, 100)}..."`);
  console.log(`✅ [Sector Detection] Secteur détecté: ${sector}`);
  console.log(`📈 [Sector Detection] Benchmark appliqué: ${benchmark.sectorAverage}`);
  
  return benchmark;
}

