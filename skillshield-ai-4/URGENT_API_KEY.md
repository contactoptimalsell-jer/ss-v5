# ⚠️ URGENT : Configuration de l'API Key Gemini

## Problème actuel
L'outil d'audit retourne toujours les mêmes réponses génériques car la clé API Gemini n'est **PAS configurée** dans Vercel.

## Solution immédiate

### Étape 1 : Obtenir votre clé API Gemini

1. Allez sur https://aistudio.google.com/app/apikey
2. Connectez-vous avec votre compte Google
3. Cliquez sur **"Create API Key"**
4. Copiez la clé (elle commence par `AIza...`)

### Étape 2 : Configurer dans Vercel

**Option A : Via le Dashboard (Recommandé)**

1. Allez sur https://vercel.com/dashboard
2. Ouvrez le projet **skillshield-ai** (dans la team **OptimalSell**)
3. Cliquez sur **Settings** (en haut)
4. Allez dans **Environment Variables** (menu de gauche)
5. Cliquez sur **Add New**
6. Remplissez :
   - **Name** : `GEMINI_API_KEY`
   - **Value** : Collez votre clé API (commence par `AIza...`)
   - **Environments** : Cochez **Production**, **Preview**, et **Development**
7. Cliquez sur **Save**

**Option B : Via la CLI**

```bash
cd /Users/jeromekarr/Documents/GitHub/ss-v5/skillshield-ai-4
vercel env add GEMINI_API_KEY production --scope optimal-sell
# Entrez votre clé API quand demandé
```

### Étape 3 : Redéployer

**Via Dashboard :**
1. Allez dans l'onglet **Deployments**
2. Cliquez sur les **3 points (⋯)** du dernier déploiement
3. Sélectionnez **Redeploy**

**Via CLI :**
```bash
vercel --prod --scope optimal-sell
```

## ✅ Vérification

Après avoir configuré et redéployé :

1. Testez sur https://skillshield.app
2. Remplissez le formulaire d'audit avec un problème spécifique
3. Les réponses devraient maintenant être **personnalisées** et **adaptées** à votre demande

## 🔍 Comment savoir si c'est configuré ?

Si vous voyez toujours les mêmes réponses génériques :
- "Agent IA de tri et réponse d'emails"
- "Agent IA de gestion documentaire intelligente"
- "Agent IA de planification et gestion d'agenda"

→ L'API key n'est **PAS** configurée

Si les réponses sont **différentes** et **adaptées** à chaque problème :
→ L'API key est **configurée** et fonctionne ✅

## 📝 Note importante

Les variables d'environnement dans Vercel doivent être configurées **AVANT** le build. Si vous ajoutez la variable après le déploiement, vous devez **redéployer** pour qu'elle soit prise en compte.





