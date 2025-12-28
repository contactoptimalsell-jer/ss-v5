# Configuration du Scraping Web pour SkillShield AI

Ce guide explique comment configurer le système de scraping web légal des pages "Contact" des entreprises.

## 🎯 Fonctionnalité

Le système permet de :
1. **Rechercher des entreprises** selon secteur, lieu et catégorie
2. **Scraper leurs pages Contact** de manière légale
3. **Extraire les emails et noms** de contacts
4. **Classer les résultats** par catégorie, secteur et lieu

## ⚙️ Configuration Requise

### 1. Google Custom Search API (Recommandé)

Pour rechercher des entreprises efficacement, configurez Google Custom Search :

#### 1.1 Créer un moteur de recherche personnalisé

1. Allez sur [Google Custom Search](https://programmablesearchengine.google.com/)
2. Cliquez sur **"Add"** pour créer un nouveau moteur de recherche
3. Configurez :
   - **Sites à rechercher** : Laissez vide ou mettez `*` pour rechercher tout le web
   - **Nom du moteur** : Ex: "SkillShield Prospection"
4. Cliquez sur **"Create"**

#### 1.2 Obtenir la clé API et l'ID du moteur

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un projet ou sélectionnez un projet existant
3. Activez l'API **Custom Search API**
4. Allez dans **Credentials** → **Create Credentials** → **API Key**
5. Copiez votre **API Key**
6. Retournez sur [Google Custom Search](https://programmablesearchengine.google.com/)
7. Cliquez sur votre moteur de recherche
8. Allez dans **Setup** → **Basics**
9. Copiez votre **Search engine ID** (CX)

#### 1.3 Configurer dans Vercel

1. Allez sur [Vercel Dashboard](https://vercel.com/dashboard)
2. Ouvrez votre projet **skillshield-ai**
3. **Settings** → **Environment Variables**
4. Ajoutez :
   - **Key** : `GOOGLE_SEARCH_API_KEY`
   - **Value** : Votre clé API Google
   - **Environments** : Production, Preview, Development
5. Ajoutez :
   - **Key** : `GOOGLE_SEARCH_ENGINE_ID`
   - **Value** : Votre Search engine ID (CX)
   - **Environments** : Production, Preview, Development

### 2. ScraperAPI (Optionnel mais recommandé)

Pour éviter les blocages lors du scraping, utilisez ScraperAPI :

#### 2.1 Obtenir une clé ScraperAPI

1. Allez sur [ScraperAPI](https://www.scraperapi.com/)
2. Créez un compte (plan gratuit disponible : 1000 requêtes/mois)
3. Allez dans **Dashboard** → **API Key**
4. Copiez votre clé API

#### 2.2 Configurer dans Vercel

1. Dans Vercel Dashboard → **Settings** → **Environment Variables**
2. Ajoutez :
   - **Key** : `SCRAPER_API_KEY`
   - **Value** : Votre clé ScraperAPI
   - **Environments** : Production, Preview, Development

⚠️ **Note** : Sans ScraperAPI, le scraping direct peut être bloqué par certains sites web.

## 🚀 Utilisation

### Sur la page `/12000`

1. Activez le **"Mode Automatisé"**
2. Remplissez les champs :
   - **Secteur** : Ex: "Construction", "Immobilier", "E-commerce"
   - **Lieu** : Ex: "Paris", "Lyon", "Marseille"
   - **Catégorie** : Ex: "PME", "Startup", "TPE", "Grand groupe"
3. Cliquez sur **"Scraper les pages Contact"**
4. Les résultats s'affichent classés par secteur, lieu et catégorie
5. Cliquez sur **"Envoyer les quiz"** pour envoyer les quiz personnalisés

## 📊 Fonctionnement Technique

### Processus de scraping

1. **Recherche d'entreprises** :
   - Utilise Google Custom Search pour trouver des entreprises
   - Requête : `{sector} {category} {location} site:contact OR site:nous-contacter`

2. **Découverte des pages Contact** :
   - Teste les chemins communs : `/contact`, `/contactez-nous`, `/nous-contacter`, etc.
   - Limite à 2 pages par entreprise

3. **Extraction des données** :
   - Extrait les emails avec regex
   - Extrait les noms de contacts (heuristique)
   - Filtre les emails génériques (noreply@, etc.)

4. **Classification** :
   - Chaque contact est classé par secteur, lieu et catégorie
   - Affichage organisé dans l'interface

### Limites et bonnes pratiques

- **Limite de recherche** : 10 entreprises par requête
- **Limite de contacts** : 50 contacts maximum par recherche
- **Délai entre requêtes** : 1 seconde pour éviter de surcharger les serveurs
- **Timeout** : 10 secondes par page

## ⚠️ Aspects Légaux

### Conformité RGPD

- ✅ Scraping de pages **publiques** uniquement
- ✅ Respect des `robots.txt` (via ScraperAPI)
- ✅ Pas de stockage permanent des données
- ✅ Utilisation légitime pour la prospection B2B

### Recommandations

1. **Respectez les conditions d'utilisation** des sites web
2. **Ne scrapez pas trop fréquemment** le même site
3. **Utilisez ScraperAPI** pour respecter automatiquement les règles
4. **Vérifiez les emails** avant l'envoi de quiz

## 🛠️ Dépannage

### Aucun contact trouvé

**Causes possibles :**
- Google Custom Search API non configurée
- Aucune entreprise trouvée pour les critères
- Pages Contact non accessibles

**Solutions :**
1. Vérifiez que `GOOGLE_SEARCH_API_KEY` et `GOOGLE_SEARCH_ENGINE_ID` sont configurés
2. Essayez des critères plus larges (ex: "Paris" au lieu de "Paris 15e")
3. Vérifiez les logs Vercel pour voir les erreurs

### Erreur "HTTP 429" ou "Rate limit exceeded"

**Cause :** Trop de requêtes vers Google Search API

**Solution :** Attendez quelques minutes ou augmentez votre quota Google Cloud

### Erreur "Blocked" ou "Forbidden"

**Cause :** Le site web bloque le scraping direct

**Solution :** Configurez `SCRAPER_API_KEY` pour utiliser ScraperAPI

### Emails invalides trouvés

**Cause :** Extraction d'emails génériques ou incorrects

**Solution :** Le système filtre automatiquement les emails génériques. Vérifiez manuellement si nécessaire.

## 📈 Coûts

### Google Custom Search API

- **100 requêtes gratuites/jour**
- Au-delà : ~$5 pour 1000 requêtes
- [Tarifs détaillés](https://developers.google.com/custom-search/v1/overview#pricing)

### ScraperAPI

- **Plan gratuit** : 1000 requêtes/mois
- **Plan Starter** : $29/mois pour 10 000 requêtes
- [Tarifs détaillés](https://www.scraperapi.com/pricing/)

## 🔒 Sécurité

### Variables d'environnement

- Ne jamais commiter les clés API dans Git
- Utilisez uniquement les variables d'environnement Vercel
- Limitez l'accès aux clés API

### Rate Limiting

Le système inclut des délais entre les requêtes pour éviter de surcharger les serveurs.

## 📚 Ressources

- [Google Custom Search API Documentation](https://developers.google.com/custom-search/v1/overview)
- [ScraperAPI Documentation](https://www.scraperapi.com/documentation/)
- [RGPD et prospection B2B](https://www.cnil.fr/fr/rgpd-et-prospection-commerciale)

---

**Besoin d'aide ?** Consultez les logs Vercel ou contactez le support.

