// Helpers pour la prospection unique - à utiliser dans prospection-automation.ts

// Emails autorisés UNIQUEMENT
export const ALLOWED_EMAIL_PATTERNS = [
  'contact@',
  'info@',
  'partenariat@',
  'communication@',
  'hello@',
  'support@'
];

// Pages à analyser (dans l'ordre de priorité)
export const CONTACT_PAGES = [
  '/contact',
  '/contactez-nous',
  '/nous-contacter',
  '/mentions-legales',
  '/mentions-légales',
  '/partenaires',
  '/partenariat'
];

// Fonction pour extraire le nom de l'entreprise depuis l'URL
export function extractCompanyNameFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.replace('www.', '');
    const domain = hostname.split('.')[0];
    return domain.charAt(0).toUpperCase() + domain.slice(1);
  } catch {
    return 'Entreprise';
  }
}

// Fonction pour extraire uniquement les emails autorisés
export function extractAllowedEmails(html: string): string[] {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const allEmails = html.match(emailRegex) || [];
  
  // Filtrer pour garder UNIQUEMENT les emails autorisés
  const allowedEmails = allEmails
    .map(email => email.toLowerCase().trim())
    .filter(email => {
      // Vérifier si c'est un email autorisé
      const isAllowed = ALLOWED_EMAIL_PATTERNS.some(pattern => email.includes(pattern));
      
      // Exclure les emails nominatifs (prénom.nom@)
      const emailLocalPart = email.split('@')[0];
      const isNominal = emailLocalPart.includes('.') && emailLocalPart.length > 10;
      
      // Exclure les emails évidents
      const excludePatterns = [
        'example@', 'test@', 'noreply@', 'no-reply@', 'donotreply@',
        'webmaster@', 'postmaster@', 'abuse@', 'privacy@', 'legal@'
      ];
      const isExcluded = excludePatterns.some(pattern => email.includes(pattern));
      
      return isAllowed && !isNominal && !isExcluded;
    })
    .filter((email, index, self) => self.indexOf(email) === index); // Supprimer doublons

  return allowedEmails;
}

// Fonction pour analyser une page web
export async function analyzePage(url: string): Promise<{ html: string; emails: string[]; companyName: string }> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();
    const emails = extractAllowedEmails(html);
    
    // Extraire le nom de l'entreprise depuis le titre ou l'URL
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const companyName = titleMatch 
      ? titleMatch[1].split('|')[0].split('-')[0].trim()
      : extractCompanyNameFromUrl(url);

    return { html, emails, companyName };
  } catch (error: any) {
    throw new Error(`Erreur lors de l'analyse de ${url}: ${error.message}`);
  }
}

// Fonction pour analyser les pages de contact
export async function findContactEmail(site: string): Promise<{ email: string; companyName: string }> {
  const baseUrl = site.startsWith('http') ? site : `https://${site}`;
  const urlObj = new URL(baseUrl);
  const baseDomain = `${urlObj.protocol}//${urlObj.hostname}`;

  // 1. Analyser la page d'accueil
  let result = await analyzePage(baseUrl);
  let companyName = result.companyName;

  // Si email trouvé sur la page d'accueil, retourner
  if (result.emails.length > 0) {
    return { email: result.emails[0], companyName };
  }

  // 2. Analyser les pages de contact (dans l'ordre)
  for (const page of CONTACT_PAGES) {
    try {
      const contactUrl = `${baseDomain}${page}`;
      result = await analyzePage(contactUrl);
      
      if (result.emails.length > 0) {
        return { email: result.emails[0], companyName: result.companyName || companyName };
      }
    } catch {
      // Page non trouvée, continuer
      continue;
    }
  }

  // Aucun email autorisé trouvé
  return { email: '', companyName };
}

// Fonction pour générer un message personnalisé avec IA
export async function generatePersonalizedMessage(
  companyName: string,
  site: string,
  activity?: string
): Promise<string> {
  const geminiApiKey = process.env.GEMINI_API_KEY || process.env.DefaultGeminiAPIKey;
  
  if (!geminiApiKey) {
    // Message par défaut si pas d'IA
    return generateDefaultMessage(companyName, activity);
  }

  try {
    const prompt = `Tu es un assistant de prospection B2B professionnel.

Génère un message personnalisé pour cette entreprise:
- Nom: ${companyName}
- Site: ${site}
${activity ? `- Activité: ${activity}` : ''}

CONTRAINTES STRICTES:
1. Ton B2B professionnel, humain, clair, respectueux
2. Inclure UNE phrase émotionnelle sur:
   - le temps perdu dans les tâches répétitives
   - la complexité de la gestion quotidienne
   - la peur de rater une opportunité d'automatisation
3. Pas de promesse mensongère
4. Pas de pression commerciale
5. Mention légale OBLIGATOIRE: "Si ce message ne vous concerne pas ou si vous ne souhaitez plus être contacté, faites-le nous savoir et nous supprimerons vos coordonnées."

Retourne UNIQUEMENT le message, sans formatage supplémentaire.`;

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

    let data;
    try {
      const responseText = await response.text();
      data = JSON.parse(responseText);
    } catch (jsonError: any) {
      throw new Error(`Erreur parsing: ${jsonError.message}`);
    }

    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    if (content && content.trim().length > 50) {
      // Vérifier que la mention légale est présente
      if (!content.includes('supprimerons') && !content.includes('ne souhaitez plus')) {
        return content.trim() + '\n\nSi ce message ne vous concerne pas ou si vous ne souhaitez plus être contacté, faites-le nous savoir et nous supprimerons vos coordonnées.';
      }
      return content.trim();
    }
  } catch (error: any) {
    console.error('Erreur génération message IA:', error.message);
  }

  return generateDefaultMessage(companyName, activity);
}

// Message par défaut si IA non disponible
function generateDefaultMessage(companyName: string, activity?: string): string {
  const emotionalPhrases = [
    'Chaque jour, des heures précieuses sont perdues dans des tâches répétitives qui pourraient être automatisées.',
    'La complexité croissante de la gestion quotidienne peut devenir un frein à votre croissance.',
    'Ne pas automatiser aujourd\'hui, c\'est risquer de prendre du retard sur vos concurrents qui ont déjà fait le pas.'
  ];
  
  const randomEmotional = emotionalPhrases[Math.floor(Math.random() * emotionalPhrases.length)];
  
  return `Bonjour,

${randomEmotional}

Nous sommes SkillShield AI, spécialisés dans l'implémentation d'IA avec gardien humain pour les entreprises comme ${companyName}.

Notre solution permet d'automatiser vos processus répétitifs tout en conservant le contrôle humain, vous faisant gagner 10-20h par semaine avec un ROI de 300-520% en 12 mois.

Seriez-vous intéressé par un audit gratuit de votre potentiel d'automatisation ?

Si ce message ne vous concerne pas ou si vous ne souhaitez plus être contacté, faites-le nous savoir et nous supprimerons vos coordonnées.

Cordialement,
L'équipe SkillShield AI`;
}

