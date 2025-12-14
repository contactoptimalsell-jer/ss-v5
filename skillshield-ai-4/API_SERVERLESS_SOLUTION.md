# ✅ Solution : API Route Serverless pour sécuriser la clé API

## 🔧 Ce qui a été fait

### 1. Création d'une API Route Serverless
- **Fichier créé** : `/api/generate-audit.ts`
- **Fonction** : Gère les appels à l'API Gemini côté serveur
- **Sécurité** : La clé API reste sur le serveur, jamais exposée au client

### 2. Modification du service client
- **Fichier modifié** : `/services/geminiService.ts`
- **Changement** : Appelle maintenant `/api/generate-audit` au lieu d'utiliser directement l'API Gemini
- **Avantage** : Plus sécurisé, la clé API n'est jamais dans le code client

### 3. Configuration Vercel
- **vercel.json** : Exclut `/api/*` des rewrites SPA
- **Dépendance** : Ajout de `@vercel/node` pour les fonctions serverless

## 🔑 Configuration de la clé API

### Dans Vercel Dashboard

1. Allez sur https://vercel.com/dashboard
2. Ouvrez le projet **skillshield-ai** (team **OptimalSell**)
3. **Settings** → **Environment Variables**
4. Ajoutez ou vérifiez :
   - **Name** : `DefaultGeminiAPIKey` (ou `GEMINI_API_KEY`)
   - **Value** : Votre clé API Gemini (commence par `AIza...`)
   - **Environments** : ✅ Production, ✅ Preview, ✅ Development
5. **Save**

### Redéployer après configuration

**Important** : Après avoir ajouté/modifié une variable d'environnement, vous DEVEZ redéployer !

```bash
vercel --prod --scope optimal-sell
```

Ou via Dashboard : **Deployments** → **3 points (⋯)** → **Redeploy**

## ✅ Avantages de cette solution

1. **Sécurité** : La clé API n'est jamais exposée au client
2. **Fiabilité** : Les variables d'environnement sont accessibles côté serveur
3. **Flexibilité** : Facile à modifier sans rebuild du client
4. **Meilleures pratiques** : Architecture recommandée pour les clés API

## 🧪 Test

1. Allez sur https://skillshield.app
2. Remplissez le formulaire d'audit
3. Les réponses devraient maintenant être **personnalisées** et **adaptées** à votre demande

## 📝 Note

L'API route serverless est automatiquement détectée par Vercel. Le dossier `api/` est traité comme des fonctions serverless et est déployé automatiquement.




