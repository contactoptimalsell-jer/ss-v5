import type { VercelRequest, VercelResponse } from '@vercel/node';
import { JSDOM } from 'jsdom';

interface LegalContact {
  email: string;
  companyName: string;
  name?: string;
  website?: string;
  sector?: string;
  interestScore?: number;
  source: 'annuaire' | 'partner_list' | 'provided';
}

interface ProspectingRequest {
  websites?: string[];
  sector?: string;
  location?: string;
  category?: string;
  source?: 'annuaire' | 'partner_list' | 'provided';
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
    // Utiliser Gemini pour analyser la page de manière intelligente
    const dom = new JSDOM(html);
    const textContent = dom.window.document.body.textContent || '';
    
    // Extraire le texte principal (sans scripts, styles, etc.)
    const cleanText = textContent
      .replace(/\s+/g, ' ')
      .substring(0, 5000); // Limiter pour l'API

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
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Parser la réponse JSON
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          emails: (parsed.emails || []).filter((email: string) => 
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
          ),
          companyName: parsed.companyName || extractCompanyNameFromUrl(url),
          sector: parsed.sector,
        };
      }
    } catch (parseError) {
      console.error('Erreur parsing Gemini response:', parseError);
    }

    // Fallback: extraction basique
    return analyzePageBasic(html, url);
  } catch (error: any) {
    console.error('Erreur Google Cloud analysis:', error.message);
    return analyzePageBasic(html, url);
  }
}

// Fonction d'analyse basique (fallback)
function analyzePageBasic(html: string, url: string): {
  emails: string[];
  companyName: string;
  sector?: string;
} {
  const dom = new JSDOM(html);
  const document = dom.window.document;

  // Extraire le nom de l'entreprise
  const title = document.querySelector('title')?.textContent || '';
  const companyName = extractCompanyNameFromUrl(url);

  // Extraire uniquement les emails génériques
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const allEmails = html.match(emailRegex) || [];
  
  // Filtrer pour garder uniquement les emails génériques
  const genericEmails = allEmails
    .map(email => email.toLowerCase())
    .filter(email => {
      // Emails génériques acceptés
      const genericPatterns = [
        'contact@', 'info@', 'commercial@', 'vente@', 'sales@',
        'service@', 'support@', 'client@', 'clients@', 'hello@',
        'bonjour@', 'accueil@', 'direction@', 'admin@'
      ];
      return genericPatterns.some(pattern => email.includes(pattern));
    })
    .filter((email, index, self) => self.indexOf(email) === index); // Supprimer doublons

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
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
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

// Fonction principale de prospection légale
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { websites, sector, location, category, source = 'provided' }: ProspectingRequest = req.body;

    if (!websites || !Array.isArray(websites) || websites.length === 0) {
      return res.status(400).json({ 
        error: 'Missing required field: websites (array of URLs from legitimate sources)' 
      });
    }

    console.log(`🟢 Prospection légale: ${websites.length} site(s) depuis source ${source}`);

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

        const html = await response.text();

        // Analyser avec Google Cloud
        const analysis = await analyzePageWithGoogleCloud(html, normalizedUrl);

        // Scorer l'intérêt avec IA
        const interestScore = await scoreInterestWithAI(
          analysis.companyName,
          sector || 'général',
          category || 'PME',
          normalizedUrl
        );

        // Créer les contacts
        for (const email of analysis.emails) {
          allContacts.push({
            email,
            companyName: analysis.companyName,
            website: normalizedUrl,
            sector: analysis.sector || sector,
            interestScore,
            source,
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
        averageScore: uniqueContacts.length > 0
          ? Math.round(uniqueContacts.reduce((sum, c) => sum + (c.interestScore || 0), 0) / uniqueContacts.length)
          : 0,
      },
      message: `${uniqueContacts.length} contact(s) trouvé(s) depuis source légitime.`,
    });
  } catch (error: any) {
    console.error('❌ Erreur prospection légale:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Erreur interne du serveur',
      message: error.message 
    });
  }
}

