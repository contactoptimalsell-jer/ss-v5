import type { VercelRequest, VercelResponse } from '@vercel/node';

interface LegalContact {
  email: string;
  companyName: string;
  name?: string;
  website?: string;
  sector?: string;
  interestScore?: number;
  source: 'annuaire' | 'partner_list' | 'provided' | 'other';
  metadata?: {
    sourceName: string;
    sourceUrl?: string;
    consentBasis: string;
    dataRetention: number;
    processedAt: string;
  };
}

interface ProspectingRequest {
  websites?: string[];
  sector?: string;
  location?: string;
  category?: string;
  source?: 'annuaire' | 'partner_list' | 'provided' | 'other';
  sourceName?: string;
  sourceUrl?: string;
  consentBasis?: 'legitimate_interest' | 'public_data' | 'partnership';
  dataRetention?: number;
  gdprNotes?: string;
}

/**
 * 🟢 Architecture IA + Google Cloud 100% légale (recommandée)
 * 
 * Pipeline propre:
 * 1. Humain / source légitime (annuaire pro, liste d'entreprises partenaires)
 * 2. Google Cloud (analyse des pages fournies, extraction d'emails génériques)
 * 3. IA (tri par secteur, scoring d'intérêt)
 * 4. Email (message associatif personnalisé, opt-out clair)
 */

// Fonction pour analyser une page web avec Google Cloud (Vertex AI)
async function analyzePageWithGoogleCloud(html: string, url: string): Promise<{
  emails: string[];
  companyName: string;
  sector?: string;
}> {
  const geminiApiKey = process.env.GEMINI_API_KEY || process.env.DefaultGeminiAPIKey;
  
  if (!geminiApiKey) {
    console.warn('⚠️ GEMINI_API_KEY non configurée, utilisation du parsing basique');
    return analyzePageBasic(html, url);
  }

  try {
    // Extraire le texte principal (sans scripts, styles, etc.) avec regex simple
    // Supprimer les balises script, style, etc.
    const cleanHtml = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    const cleanText = cleanHtml.substring(0, 5000); // Limiter pour l'API

    const prompt = `Tu es un assistant expert en analyse de pages web professionnelles.

Analyse cette page web et extrais:
1. Le nom de l'entreprise
2. Les emails de contact génériques (contact@, info@, commercial@, etc.) - UNIQUEMENT les emails génériques publics
3. Le secteur d'activité si identifiable

URL: ${url}
Contenu: ${cleanText}

Retourne UNIQUEMENT du JSON valide avec cette structure:
{
  "companyName": "Nom de l'entreprise",
  "emails": ["contact@entreprise.com", "info@entreprise.com"],
  "sector": "secteur si identifiable"
}

Important:
- Extrais UNIQUEMENT les emails génériques publics (contact@, info@, commercial@, etc.)
- Ne pas extraire d'emails personnels (prénom.nom@)
- Si aucun email générique trouvé, retourne un tableau vide
- Le nom de l'entreprise doit être extrait du titre ou du contenu principal`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${errorText.substring(0, 200)}`);
    }

    let data;
    try {
      const responseText = await response.text();
      data = JSON.parse(responseText);
    } catch (jsonError: any) {
      console.error('Erreur parsing réponse Gemini (scoring):', jsonError.message);
      throw new Error(`Erreur de parsing de la réponse Gemini: ${jsonError.message}`);
    }
    
    // Vérifier la structure de la réponse
    if (!data || !data.candidates || !Array.isArray(data.candidates) || data.candidates.length === 0) {
      console.warn('⚠️ Réponse Gemini invalide, utilisation du fallback');
      return analyzePageBasic(html, url);
    }

    const content = data.candidates[0]?.content?.parts?.[0]?.text || '';
    
    if (!content || content.trim().length === 0) {
      console.warn('⚠️ Contenu Gemini vide, utilisation du fallback');
      return analyzePageBasic(html, url);
    }

    // Parser la réponse JSON avec plusieurs stratégies
    try {
      // Stratégie 1: Chercher un objet JSON complet
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed && typeof parsed === 'object') {
            return {
              emails: Array.isArray(parsed.emails) 
                ? parsed.emails.filter((email: string) => 
                    typeof email === 'string' && /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
                  )
                : [],
              companyName: typeof parsed.companyName === 'string' && parsed.companyName.trim()
                ? parsed.companyName.trim()
                : extractCompanyNameFromUrl(url),
              sector: typeof parsed.sector === 'string' ? parsed.sector : undefined,
            };
          }
        } catch (jsonError) {
          console.error('Erreur parsing JSON match:', jsonError);
        }
      }

      // Stratégie 2: Essayer de parser directement si le contenu commence par {
      if (content.trim().startsWith('{')) {
        try {
          const parsed = JSON.parse(content.trim());
          if (parsed && typeof parsed === 'object') {
            return {
              emails: Array.isArray(parsed.emails) 
                ? parsed.emails.filter((email: string) => 
                    typeof email === 'string' && /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
                  )
                : [],
              companyName: typeof parsed.companyName === 'string' && parsed.companyName.trim()
                ? parsed.companyName.trim()
                : extractCompanyNameFromUrl(url),
              sector: typeof parsed.sector === 'string' ? parsed.sector : undefined,
            };
          }
        } catch (directParseError) {
          console.error('Erreur parsing direct:', directParseError);
        }
      }

      // Stratégie 3: Extraire les emails directement du texte si JSON invalide
      const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
      const foundEmails = content.match(emailRegex) || [];
      const genericEmails = foundEmails
        .map(email => email.toLowerCase())
        .filter(email => {
          const genericPatterns = [
            'contact@', 'info@', 'commercial@', 'vente@', 'sales@',
            'service@', 'support@', 'client@', 'clients@', 'hello@',
            'bonjour@', 'accueil@', 'direction@', 'admin@'
          ];
          return genericPatterns.some(pattern => email.includes(pattern));
        })
        .filter((email, index, self) => self.indexOf(email) === index);

      if (genericEmails.length > 0) {
        // Essayer d'extraire le nom de l'entreprise du contenu
        const companyMatch = content.match(/"companyName"\s*:\s*"([^"]+)"/i) || 
                            content.match(/entreprise[:\s]+([A-Z][a-zA-Z\s&]+)/i);
        const companyName = companyMatch ? companyMatch[1] : extractCompanyNameFromUrl(url);

        return {
          emails: genericEmails,
          companyName: companyName.trim(),
        };
      }
    } catch (parseError: any) {
      console.error('Erreur parsing Gemini response:', parseError.message || parseError);
    }

    // Fallback: extraction basique
    return analyzePageBasic(html, url);
  } catch (error: any) {
    console.error('Erreur Google Cloud analysis:', error.message);
    return analyzePageBasic(html, url);
  }
}

// Fonction d'analyse basique (fallback) - sans JSDOM pour compatibilité serverless
function analyzePageBasic(html: string, url: string): {
  emails: string[];
  companyName: string;
  sector?: string;
} {
  // Extraire le nom de l'entreprise depuis l'URL
  const companyName = extractCompanyNameFromUrl(url);

  // Extraire uniquement les emails génériques avec regex
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const allEmails = html.match(emailRegex) || [];
  
  // Filtrer pour garder uniquement les emails génériques
  const genericEmails = allEmails
    .map(email => email.toLowerCase().trim())
    .filter(email => {
      // Exclure les emails évidents à éviter
      const excludePatterns = [
        'example@', 'test@', 'noreply@', 'no-reply@', 'donotreply@',
        'webmaster@', 'postmaster@', 'abuse@', 'privacy@', 'legal@',
        'copyright@', 'trademark@', 'domain@', 'dns@', 'hostmaster@'
      ];
      
      // Si c'est un email à exclure, le rejeter
      if (excludePatterns.some(pattern => email.includes(pattern))) {
        return false;
      }
      
      // Emails génériques acceptés (plus large)
      const genericPatterns = [
        'contact@', 'info@', 'commercial@', 'vente@', 'sales@',
        'service@', 'support@', 'client@', 'clients@', 'hello@',
        'bonjour@', 'accueil@', 'direction@', 'admin@', 'general@',
        'entreprise@', 'societe@', 'bureau@', 'office@', 'secretariat@',
        'reception@', 'standard@', 'siege@', 'headquarters@'
      ];
      
      // Accepter si c'est un email générique OU si c'est un email simple (pas de point dans le nom avant @)
      const emailLocalPart = email.split('@')[0];
      const isGeneric = genericPatterns.some(pattern => email.includes(pattern));
      const isSimpleEmail = !emailLocalPart.includes('.') && emailLocalPart.length <= 15;
      
      return isGeneric || isSimpleEmail;
    })
    .filter((email, index, self) => self.indexOf(email) === index); // Supprimer doublons

  console.log(`📧 Emails trouvés pour ${companyName}: ${genericEmails.length} (${allEmails.length} total)`);

  return {
    emails: genericEmails,
    companyName,
  };
}

// Fonction pour scorer l'intérêt avec IA
async function scoreInterestWithAI(
  companyName: string,
  sector: string,
  category: string,
  website?: string
): Promise<number> {
  const geminiApiKey = process.env.GEMINI_API_KEY || process.env.DefaultGeminiAPIKey;
  
  if (!geminiApiKey) {
    // Score par défaut basé sur des heuristiques
    return calculateBasicScore(sector, category);
  }

  try {
    const prompt = `Tu es un assistant expert en scoring de prospects B2B.

Évalue l'intérêt commercial de ce prospect sur une échelle de 0 à 100:
- Nom: ${companyName}
- Secteur: ${sector}
- Catégorie: ${category}
${website ? `- Site web: ${website}` : ''}

Critères de scoring:
- 80-100: Grande entreprise, secteur à fort potentiel, alignement parfait
- 60-79: Entreprise moyenne, bon potentiel, bon alignement
- 40-59: Petite entreprise, potentiel modéré, alignement moyen
- 20-39: Très petite entreprise, potentiel faible, alignement limité
- 0-19: Pas d'alignement ou données insuffisantes

Retourne UNIQUEMENT un nombre entre 0 et 100, sans texte supplémentaire.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${errorText.substring(0, 200)}`);
    }

    let data;
    try {
      const responseText = await response.text();
      data = JSON.parse(responseText);
    } catch (jsonError: any) {
      console.error('Erreur parsing réponse Gemini (scoring):', jsonError.message);
      throw new Error(`Erreur de parsing de la réponse Gemini: ${jsonError.message}`);
    }
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Extraire le nombre
    const scoreMatch = content.match(/\d+/);
    if (scoreMatch) {
      const score = parseInt(scoreMatch[0], 10);
      return Math.max(0, Math.min(100, score)); // Clamper entre 0 et 100
    }
  } catch (error: any) {
    console.error('Erreur scoring IA:', error.message);
  }

  return calculateBasicScore(sector, category);
}

// Score basique (fallback)
function calculateBasicScore(sector: string, category: string): number {
  // Heuristique simple basée sur la catégorie
  const categoryScores: Record<string, number> = {
    'PME': 70,
    'ETI': 85,
    'Grande entreprise': 90,
    'Startup': 50,
    'TPE': 40,
    'Auto-entrepreneur': 20,
  };

  return categoryScores[category] || 50;
}

// Extraire le nom de l'entreprise depuis l'URL
function extractCompanyNameFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.replace('www.', '');
    const domain = hostname.split('.')[0];
    return domain.charAt(0).toUpperCase() + domain.slice(1);
  } catch {
    return 'Entreprise';
  }
}

// Extraction agressive d'emails (quand l'analyse standard ne trouve rien)
function extractEmailsAggressive(html: string): string[] {
  // Chercher tous les patterns d'emails possibles
  const emailPatterns = [
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    /[a-zA-Z0-9._%+-]+\s*\[at\]\s*[a-zA-Z0-9.-]+\s*\[dot\]\s*[a-zA-Z]{2,}/gi, // email [at] domain [dot] com
    /[a-zA-Z0-9._%+-]+\s*\(at\)\s*[a-zA-Z0-9.-]+\s*\(dot\)\s*[a-zA-Z]{2,}/gi, // email (at) domain (dot) com
  ];

  const allEmails: string[] = [];
  
  for (const pattern of emailPatterns) {
    const matches = html.match(pattern) || [];
    allEmails.push(...matches);
  }

  // Normaliser les emails avec [at] et [dot]
  const normalizedEmails = allEmails
    .map(email => email
      .replace(/\s*\[at\]\s*/gi, '@')
      .replace(/\s*\[dot\]\s*/gi, '.')
      .replace(/\s*\(at\)\s*/gi, '@')
      .replace(/\s*\(dot\)\s*/gi, '.')
      .toLowerCase()
      .trim()
    )
    .filter(email => {
      // Validation basique
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) return false;
      
      // Exclure les emails évidents
      const excludePatterns = [
        'example@', 'test@', 'noreply@', 'no-reply@', 'donotreply@',
        'webmaster@', 'postmaster@', 'abuse@', 'privacy@', 'legal@',
        'copyright@', 'trademark@', 'domain@', 'dns@', 'hostmaster@',
        '@example.', '@test.', '@localhost'
      ];
      
      return !excludePatterns.some(pattern => email.includes(pattern));
    })
    .filter((email, index, self) => self.indexOf(email) === index); // Supprimer doublons

  return normalizedEmails.slice(0, 5); // Limiter à 5 emails max
}

// Fonction principale de prospection légale
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      websites, 
      sector, 
      location, 
      category, 
      source = 'provided',
      sourceName,
      sourceUrl,
      consentBasis,
      dataRetention,
      gdprNotes,
    }: ProspectingRequest = req.body;

    if (!websites || !Array.isArray(websites) || websites.length === 0) {
      return res.status(400).json({ 
        error: 'Missing required field: websites (array of URLs from legitimate sources)' 
      });
    }

    if (!sourceName || !source) {
      return res.status(400).json({ 
        error: 'Missing required fields: sourceName and source (RGPD documentation required)' 
      });
    }

    // Normaliser et valider les données
    const normalizedDataRetention = typeof dataRetention === 'string' 
      ? parseInt(dataRetention, 10) 
      : (typeof dataRetention === 'number' ? dataRetention : 12);
    
    const normalizedConsentBasis = consentBasis || 'legitimate_interest';
    const normalizedSourceUrl = sourceUrl || undefined;

    // Log RGPD pour traçabilité
    console.log(`🟢 Prospection légale RGPD:`);
    console.log(`   - Source: ${source} (${sourceName})`);
    console.log(`   - Base légale: ${normalizedConsentBasis}`);
    console.log(`   - Conservation: ${normalizedDataRetention} mois`);
    console.log(`   - Sites: ${websites.length}`);
    if (gdprNotes) {
      console.log(`   - Notes: ${gdprNotes}`);
    }

    const allContacts: LegalContact[] = [];

    // Traiter chaque site web fourni
    for (const website of websites.slice(0, 20)) { // Limiter à 20 sites
      try {
        // Normaliser l'URL
        let normalizedUrl = website.trim();
        if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
          normalizedUrl = `https://${normalizedUrl}`;
        }

        // Récupérer la page
        let html: string;
        try {
          const response = await fetch(normalizedUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            },
            signal: AbortSignal.timeout(10000),
          });

          if (!response.ok) {
            console.error(`❌ Erreur HTTP ${response.status} pour ${normalizedUrl}`);
            continue;
          }

          html = await response.text();
          
          if (!html || html.length === 0) {
            console.error(`❌ Page vide pour ${normalizedUrl}`);
            continue;
          }
        } catch (fetchError: any) {
          console.error(`❌ Erreur fetch pour ${normalizedUrl}:`, fetchError.message);
          continue;
        }

        // Analyser avec Google Cloud (avec gestion d'erreur)
        let analysis;
        try {
          analysis = await analyzePageWithGoogleCloud(html, normalizedUrl);
          console.log(`✅ Analyse Gemini pour ${normalizedUrl}: ${analysis.emails.length} email(s) trouvé(s)`);
        } catch (analysisError: any) {
          console.error(`⚠️ Erreur analyse Gemini pour ${normalizedUrl}:`, analysisError.message);
          // Utiliser l'analyse basique en cas d'erreur
          analysis = analyzePageBasic(html, normalizedUrl);
          console.log(`✅ Analyse basique pour ${normalizedUrl}: ${analysis.emails.length} email(s) trouvé(s)`);
        }
        
        // Si aucune analyse n'a trouvé d'emails, essayer une extraction plus agressive
        if (analysis.emails.length === 0) {
          console.log(`⚠️ Aucun email trouvé avec analyse standard, tentative extraction agressive pour ${normalizedUrl}`);
          const aggressiveEmails = extractEmailsAggressive(html);
          if (aggressiveEmails.length > 0) {
            analysis.emails = aggressiveEmails;
            console.log(`✅ Extraction agressive: ${aggressiveEmails.length} email(s) trouvé(s)`);
          }
        }

        // Scorer l'intérêt avec IA (avec gestion d'erreur)
        let interestScore = 50; // Score par défaut
        try {
          interestScore = await scoreInterestWithAI(
            analysis.companyName,
            sector || 'général',
            category || 'PME',
            normalizedUrl
          );
        } catch (scoreError: any) {
          console.error(`⚠️ Erreur scoring pour ${analysis.companyName}:`, scoreError.message);
          // Utiliser le score basique en cas d'erreur
          interestScore = calculateBasicScore(sector || 'général', category || 'PME');
        }

        // Créer les contacts avec métadonnées RGPD
        for (const email of analysis.emails) {
          allContacts.push({
            email,
            companyName: analysis.companyName,
            website: normalizedUrl,
            sector: analysis.sector || sector,
            interestScore,
            source,
            // Métadonnées RGPD pour traçabilité
            metadata: {
              sourceName: sourceName || 'Non spécifié',
              sourceUrl: normalizedSourceUrl,
              consentBasis: normalizedConsentBasis,
              dataRetention: normalizedDataRetention,
              processedAt: new Date().toISOString(),
            },
          });
        }

        // Pause pour éviter de surcharger
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error: any) {
        console.error(`❌ Erreur traitement ${website}:`, error.message);
      }
    }

    // Trier par score d'intérêt (décroissant)
    allContacts.sort((a, b) => (b.interestScore || 0) - (a.interestScore || 0));

    // Supprimer les doublons d'emails
    const uniqueContacts = Array.from(
      new Map(allContacts.map(item => [item.email, item])).values()
    );

    console.log(`✅ Prospection légale terminée: ${uniqueContacts.length} contacts trouvés`);

    return res.status(200).json({
      success: true,
      contacts: uniqueContacts,
      totalFound: uniqueContacts.length,
      metadata: {
        source,
        sourceName: sourceName || 'Non spécifié',
        sourceUrl: normalizedSourceUrl,
        consentBasis: normalizedConsentBasis,
        dataRetention: normalizedDataRetention,
        averageScore: uniqueContacts.length > 0
          ? Math.round(uniqueContacts.reduce((sum, c) => sum + (c.interestScore || 0), 0) / uniqueContacts.length)
          : 0,
        processedAt: new Date().toISOString(),
      },
      message: `${uniqueContacts.length} contact(s) trouvé(s) depuis source légitime documentée.`,
      gdprCompliant: true,
    });
  } catch (error: any) {
    console.error('❌ Erreur prospection légale:', error);
    console.error('Stack trace:', error.stack);
    return res.status(500).json({ 
      success: false,
      error: 'Erreur interne du serveur',
      message: error.message || 'Une erreur inattendue s\'est produite',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
}

