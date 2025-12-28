import type { VercelRequest, VercelResponse } from '@vercel/node';

interface ProspectEmail {
  email: string;
  companyName: string;
  name?: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { category, sector } = req.body;

  if (!category || !sector) {
    return res.status(400).json({ error: 'Catégorie et secteur requis' });
  }

  try {
    // Récupérer la clé API Grok depuis les variables d'environnement
    const grokApiKey = process.env.GROK_API_KEY;
    
    if (!grokApiKey) {
      console.error('❌ GROK_API_KEY not configured');
      return res.status(500).json({ 
        error: 'Configuration API Grok manquante. Veuillez configurer GROK_API_KEY dans Vercel.' 
      });
    }

    // Construire le prompt pour Grok
    const prompt = `Tu es un assistant expert en recherche d'entreprises et de contacts professionnels.

Tâche : Trouve des emails d'entreprises françaises dans la catégorie "${category}" et le secteur "${sector}".

Instructions :
1. Recherche des entreprises françaises correspondant à ces critères
2. Pour chaque entreprise, trouve l'email de contact principal (généralement contact@, info@, ou email du dirigeant)
3. Retourne les résultats au format JSON strict avec cette structure :
{
  "emails": [
    {
      "email": "email@entreprise.com",
      "companyName": "Nom de l'entreprise",
      "name": "Nom du contact (optionnel)"
    }
  ]
}

Important :
- Retourne UNIQUEMENT du JSON valide, sans texte avant ou après
- Limite à 10-15 entreprises maximum
- Assure-toi que les emails sont valides et pertinents
- Focus sur des entreprises françaises réelles`;

    // Appel à l'API Grok (xAI)
    const grokResponse = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${grokApiKey}`,
      },
      body: JSON.stringify({
        model: 'grok-beta',
        messages: [
          {
            role: 'system',
            content: 'Tu es un assistant expert en recherche d\'entreprises et de contacts professionnels. Tu retournes toujours du JSON valide.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!grokResponse.ok) {
      const errorData = await grokResponse.text();
      console.error('❌ Grok API error:', errorData);
      return res.status(500).json({ 
        error: 'Erreur lors de la recherche via Grok',
        details: errorData 
      });
    }

    const grokData = await grokResponse.json();
    const content = grokData.choices?.[0]?.message?.content || '';

    // Extraire le JSON de la réponse
    let emails: ProspectEmail[] = [];
    
    try {
      // Essayer de parser directement le JSON
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        emails = parsed.emails || [];
      } else {
        // Si pas de JSON trouvé, essayer de parser tout le contenu
        const parsed = JSON.parse(content);
        emails = parsed.emails || [];
      }
    } catch (parseError) {
      console.error('❌ Error parsing Grok response:', parseError);
      console.log('Grok response content:', content);
      
      // Fallback : essayer d'extraire les emails manuellement
      const emailRegex = /[\w\.-]+@[\w\.-]+\.\w+/g;
      const foundEmails = content.match(emailRegex) || [];
      
      emails = foundEmails.slice(0, 10).map((email, index) => ({
        email: email.toLowerCase(),
        companyName: `Entreprise ${index + 1} - ${sector}`,
      }));
    }

    // Valider et nettoyer les emails
    emails = emails
      .filter((p: ProspectEmail) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(p.email) && p.companyName;
      })
      .slice(0, 15); // Limiter à 15 résultats

    console.log(`✅ Found ${emails.length} emails for category: ${category}, sector: ${sector}`);

    return res.status(200).json({
      success: true,
      emails,
      count: emails.length,
    });
  } catch (error: any) {
    console.error('❌ Error in search-emails-grok:', error);
    return res.status(500).json({
      error: 'Erreur lors de la recherche d\'emails',
      message: error.message,
    });
  }
}

