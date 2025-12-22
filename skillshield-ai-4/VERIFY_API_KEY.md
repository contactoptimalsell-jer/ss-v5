# Vérification de la clé API Gemini

## ⚠️ Problème actuel
La variable `DefaultGeminiAPIKey` n'est pas détectée au moment du build.

## ✅ Vérification étape par étape

### 1. Vérifier dans le Dashboard Vercel

1. Allez sur https://vercel.com/dashboard
2. Ouvrez le projet **skillshield-ai** (team **OptimalSell**)
3. Cliquez sur **Settings** → **Environment Variables**
4. Vérifiez que `DefaultGeminiAPIKey` existe
5. **IMPORTANT** : Vérifiez que les environnements sont cochés :
   - ✅ **Production**
   - ✅ **Preview**  
   - ✅ **Development**

### 2. Si la variable n'existe pas ou n'est pas activée pour Production

1. Cliquez sur **Add New** (ou modifiez la variable existante)
2. **Name** : `DefaultGeminiAPIKey`
3. **Value** : Votre clé API (commence par `AIza...`)
4. **Environments** : Cochez **TOUS** (Production, Preview, Development)
5. Cliquez sur **Save**

### 3. Redéployer OBLIGATOIREMENT

**Après avoir ajouté/modifié une variable d'environnement, vous DEVEZ redéployer !**

**Via Dashboard :**
1. Allez dans **Deployments**
2. Cliquez sur les **3 points (⋯)** du dernier déploiement
3. Sélectionnez **Redeploy**
4. Attendez la fin du déploiement

**Via CLI :**
```bash
vercel --prod --scope optimal-sell
```

### 4. Vérifier les logs de build

1. Allez dans **Deployments**
2. Cliquez sur le dernier déploiement
3. Allez dans l'onglet **Build Logs**
4. Cherchez des erreurs ou des warnings

### 5. Tester sur le site

1. Allez sur https://skillshield.app
2. Ouvrez la console du navigateur (F12)
3. Remplissez le formulaire d'audit
4. Regardez les messages dans la console :
   - Si vous voyez `✅ API Key found and configured` → Ça fonctionne !
   - Si vous voyez `❌ API Key is NOT set!` → La variable n'est pas chargée

## 🔧 Solution alternative : Renommer la variable

Si `DefaultGeminiAPIKey` ne fonctionne pas, vous pouvez :

1. **Supprimer** `DefaultGeminiAPIKey` dans Vercel
2. **Ajouter** une nouvelle variable nommée `GEMINI_API_KEY`
3. **Redéployer**

Le code supporte les deux noms.

## 📝 Note importante

Les variables d'environnement dans Vercel sont injectées **au moment du build**. Si vous ajoutez une variable après le déploiement, elle ne sera pas disponible tant que vous n'avez pas redéployé.










