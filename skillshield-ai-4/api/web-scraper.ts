import type { VercelRequest, VercelResponse } from '@vercel/node';

interface ScrapedContact {
  email: string;
  name?: string;
  companyName: string;
  website?: string;
  phone?: string;
}

interface ScrapedResult {
  contacts: ScrapedContact[];
  totalFound: number;
}

// Fonction pour extraire les emails d'un texte HTML
function extractEmails(html: string): string[] {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const emails = html.match(emailRegex) || [];
  // Filtrer les emails génériques et les doublons
  const filtered = emails
    .map(email => email.toLowerCase())
    .filter(email => {
      // Exclure les emails génériques
      const genericEmails = ['noreply@', 'no-reply@', 'donotreply@', 'example@', 'test@'];
      return !genericEmails.some(generic => email.includes(generic));
    })
    .filter((email, index, self) => self.indexOf(email) === index); // Supprimer les doublons
  return filtered;
}

// Fonction pour extraire les noms de contacts (heuristique basique)
function extractNames(html: string): string[] {
  // Recherche de patterns comme "Contact: Nom Prénom" ou "M. Nom Prénom"
  const namePatterns = [
    /(?:Contact|contact|M\.|Mme|Mlle)\s*:?\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/g,
    /<h[1-6][^>]*>([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)<\/h[1-6]>/g,
  ];
  
  const names: string[] = [];
  namePatterns.forEach(pattern => {
    const matches = html.matchAll(pattern);
    for (const match of matches) {
      if (match[1] && match[1].length > 3 && match[1].length < 50) {
        names.push(match[1].trim());
      }
    }
  });
  
  return [...new Set(names)].slice(0, 5); // Limiter à 5 noms
}

// Fonction pour scraper une page Contact
async function scrapeContactPage(url: string): Promise<ScrapedContact[]> {
  try {
    // Utiliser ScraperAPI si disponible, sinon fetch direct
    const scraperApiKey = process.env.SCRAPER_API_KEY;
    let response;
    
    if (scraperApiKey) {
      // Utiliser ScraperAPI pour éviter les blocages
      const scraperUrl = `http://api.scraperapi.com?api_key=${scraperApiKey}&url=${encodeURIComponent(url)}`;
      response = await fetch(scraperUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
        signal: AbortSignal.timeout(10000), // Timeout de 10 secondes
      });
    } else {
      // Scraping direct (peut être bloqué par certains sites)
      response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
        signal: AbortSignal.timeout(10000),
      });
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();
    const emails = extractEmails(html);
    const names = extractNames(html);

    // Créer des contacts à partir des emails trouvés
    const contacts: ScrapedContact[] = emails.map((email, index) => ({
      email,
      name: names[index] || undefined,
      companyName: extractCompanyNameFromUrl(url),
      website: url,
    }));

    return contacts;
  } catch (error: any) {
    console.error(`Error scraping ${url}:`, error.message);
    return [];
  }
}

// Fonction pour extraire le nom de l'entreprise depuis l'URL
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

// Fonction pour trouver des entreprises via Google Custom Search
async function findCompaniesViaGoogle(
  sector: string,
  location: string,
  category: string
): Promise<{ name: string; website: string }[]> {
  const googleApiKey = process.env.GOOGLE_SEARCH_API_KEY;
  const googleCx = process.env.GOOGLE_SEARCH_ENGINE_ID;

  if (!googleApiKey || !googleCx) {
    console.error('❌ Google Search API non configurée: GOOGLE_SEARCH_API_KEY ou GOOGLE_SEARCH_ENGINE_ID manquant');
    return [];
  }

  // Vérifier le format des clés
  if (!googleApiKey.startsWith('AIza')) {
    console.error('❌ Format de GOOGLE_SEARCH_API_KEY invalide (doit commencer par AIza)');
    return [];
  }

  // Améliorer la requête de recherche pour être plus flexible
  // Essayer plusieurs variantes de requêtes
  const queries = [
    `${sector} ${category} ${location} contact`,
    `${sector} ${location} entreprise`,
    `${sector} ${location} ${category}`,
    `${sector} ${location}`,
  ];

  let allCompanies: { name: string; website: string }[] = [];
  const seenUrls = new Set<string>();

  for (const query of queries.slice(0, 2)) { // Essayer les 2 premières requêtes
    try {
      console.log(`🔍 Recherche Google: "${query}"`);
      const apiUrl = `https://www.googleapis.com/customsearch/v1?key=${googleApiKey}&cx=${googleCx}&q=${encodeURIComponent(query)}&num=10`;
      
      const response = await fetch(apiUrl, {
        headers: {
          'Accept': 'application/json',
        },
      });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Google Search API error ${response.status}:`, errorText);
      throw new Error(`Google Search API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (data.error) {
      console.error('❌ Google Search API error:', data.error);
      throw new Error(`Google Search API error: ${data.error.message || JSON.stringify(data.error)}`);
    }

      const companies = (data.items || []).map((item: any) => {
        // Extraire l'URL de base (sans chemin)
        let website = item.link;
        try {
          const url = new URL(item.link);
          website = `${url.protocol}//${url.hostname}`;
        } catch {
          // Si l'URL est invalide, utiliser tel quel
        }
        
        return {
          name: item.title || extractCompanyNameFromUrl(item.link),
          website: website,
        };
      }).filter((company: { name: string; website: string }) => {
        // Filtrer les doublons
        if (seenUrls.has(company.website)) {
          return false;
        }
        seenUrls.add(company.website);
        return true;
      });

      allCompanies.push(...companies);
      console.log(`✅ ${companies.length} entreprises trouvées pour "${query}"`);
      
      // Si on a trouvé assez d'entreprises, arrêter
      if (allCompanies.length >= 10) {
        break;
      }
    } catch (error: any) {
      console.error(`❌ Google Search error pour "${query}":`, error.message);
      // Continuer avec la requête suivante
      continue;
    }
  }

  console.log(`✅ Total: ${allCompanies.length} entreprises trouvées via Google Search`);
  return allCompanies;
}

// Fonction pour trouver les pages Contact d'une entreprise
async function findContactPages(website: string): Promise<string[]> {
  const commonContactPaths = [
    '/contact',
    '/contactez-nous',
    '/nous-contacter',
    '/contact-us',
    '/contact.html',
    '/contact.php',
  ];

  const contactPages: string[] = [];

  for (const path of commonContactPaths) {
    try {
      const url = `${website}${path}`;
      const response = await fetch(url, {
        method: 'HEAD',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
        signal: AbortSignal.timeout(5000),
      });

      if (response.ok) {
        contactPages.push(url);
      }
    } catch {
      // Ignorer les erreurs pour cette URL
    }
  }

  return contactPages;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sector, location, category } = req.body;

    if (!sector || !location || !category) {
      return res.status(400).json({ 
        error: 'Missing required fields: sector, location, category' 
      });
    }

    // Étape 1: Trouver des entreprises via Google Search
    console.log(`🔍 Recherche d'entreprises: ${sector} - ${category} - ${location}`);
    const companies = await findCompaniesViaGoogle(sector, location, category);

    if (companies.length === 0) {
      const googleApiKey = process.env.GOOGLE_SEARCH_API_KEY;
      const googleCx = process.env.GOOGLE_SEARCH_ENGINE_ID;
      
      if (!googleApiKey || !googleCx) {
        return res.status(200).json({
          success: false,
          contacts: [],
          totalFound: 0,
          message: 'Google Search API non configurée. Configurez GOOGLE_SEARCH_API_KEY et GOOGLE_SEARCH_ENGINE_ID dans Vercel.',
        });
      }
      
      return res.status(200).json({
        success: true,
        contacts: [],
        totalFound: 0,
        message: 'Aucune entreprise trouvée pour ces critères. Essayez avec des termes plus larges (ex: "Paris" au lieu de "Paris 15e").',
      });
    }

    // Étape 2: Pour chaque entreprise, trouver et scraper les pages Contact
    const allContacts: ScrapedContact[] = [];
    
    for (const company of companies.slice(0, 10)) { // Limiter à 10 entreprises
      try {
        // Trouver les pages Contact
        const contactPages = await findContactPages(company.website);
        
        if (contactPages.length === 0) {
          // Si aucune page Contact trouvée, essayer la page d'accueil
          contactPages.push(company.website);
        }

        // Scraper chaque page Contact
        for (const contactPage of contactPages.slice(0, 2)) { // Max 2 pages par entreprise
          const contacts = await scrapeContactPage(contactPage);
          // Ajouter le nom de l'entreprise si manquant
          contacts.forEach(contact => {
            if (!contact.companyName || contact.companyName === 'Entreprise') {
              contact.companyName = company.name;
            }
            contact.website = company.website;
          });
          allContacts.push(...contacts);
          
          // Pause pour éviter de surcharger les serveurs
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error: any) {
        console.error(`Error processing ${company.name}:`, error.message);
      }
    }

    // Supprimer les doublons d'emails
    const uniqueContacts = allContacts.reduce((acc, contact) => {
      const existing = acc.find(c => c.email === contact.email);
      if (!existing) {
        acc.push(contact);
      } else {
        // Fusionner les informations si nécessaire
        if (!existing.name && contact.name) {
          existing.name = contact.name;
        }
        if (!existing.website && contact.website) {
          existing.website = contact.website;
        }
      }
      return acc;
    }, [] as ScrapedContact[]);

    console.log(`✅ ${uniqueContacts.length} contacts trouvés`);

    return res.status(200).json({
      success: true,
      contacts: uniqueContacts.slice(0, 50), // Limiter à 50 contacts
      totalFound: uniqueContacts.length,
      metadata: {
        sector,
        location,
        category,
        companiesSearched: companies.length,
      },
    });
  } catch (error: any) {
    console.error('Web scraper error:', error);
    return res.status(500).json({
      error: 'Erreur lors du scraping web',
      message: error.message,
    });
  }
}

