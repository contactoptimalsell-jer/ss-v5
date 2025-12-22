# Configuration des variables d'environnement sur Vercel

## ⚠️ Problème actuel
L'erreur `"An API Key must be set when running in a browser"` indique que la clé API Gemini n'est pas configurée dans Vercel.

## ✅ Solution : Ajouter GEMINI_API_KEY dans Vercel

### Méthode 1 : Via le Dashboard Vercel (Recommandé)

1. **Accéder au projet** :
   - Allez sur https://vercel.com/dashboard
   - Ouvrez le projet : **skillshield-ai** (dans la team OptimalSell)

2. **Ajouter la variable d'environnement** :
   - Cliquez sur **Settings** (en haut)
   - Allez dans l'onglet **Environment Variables** (menu de gauche)
   - Cliquez sur **Add New**
   - Remplissez :
     - **Name** : `GEMINI_API_KEY`
     - **Value** : Votre clé API Gemini (commence par `AIza...`)
     - **Environments** : Cochez **Production**, **Preview**, et **Development**
   - Cliquez sur **Save**

3. **Redéployer** :
   - Allez dans l'onglet **Deployments**
   - Cliquez sur les **3 points (⋯)** du dernier déploiement
   - Sélectionnez **Redeploy**
   - Ou faites un nouveau commit et push

### Méthode 2 : Via la CLI

```bash
# Depuis le dossier du projet
vercel env add GEMINI_API_KEY production --scope optimal-sell
# Entrez votre clé API quand demandé
```

Puis redéployez :
```bash
vercel --prod --scope optimal-sell
```

## 🔑 Obtenir votre clé API Gemini

1. Allez sur https://aistudio.google.com/app/apikey
2. Cliquez sur **Create API Key**
3. Copiez la clé (commence par `AIza...`)
4. Ajoutez-la dans Vercel comme décrit ci-dessus

## ✅ Vérification

Après avoir configuré la variable et redéployé :

1. **Testez le site** : https://skillshield.app
2. **Testez l'outil d'audit** : Remplissez le formulaire et vérifiez qu'il fonctionne
3. **Vérifiez la console** : Plus d'erreur `"An API Key must be set"`

## 🔒 Sécurité

⚠️ **Note importante** : Exposer une clé API directement dans le code client n'est pas idéal pour la sécurité. Pour une production sérieuse, considérez :

1. **Créer une API route serverless** :
   - Créer `/api/generate-audit.ts` dans Vercel
   - Stocker la clé API côté serveur uniquement
   - Appeler cette API depuis le client

2. **Utiliser des limites de quota** :
   - Configurez des limites dans Google Cloud Console
   - Surveillez l'utilisation de l'API

Pour l'instant, la solution actuelle fonctionne mais la clé API sera visible dans le code JavaScript compilé.










