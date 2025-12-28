# Configuration de l'API Grok (xAI) pour SkillShield AI

Ce guide vous explique comment obtenir et configurer une clé API Grok pour utiliser la fonctionnalité de prospection automatisée.

## 📋 Prérequis

- Un compte xAI (Grok)
- Accès au dashboard Vercel de votre projet

## 🔑 Étape 1 : Obtenir une clé API Grok

### 1.1 Créer un compte xAI

1. Rendez-vous sur [https://x.ai](https://x.ai)
2. Créez un compte ou connectez-vous avec votre compte existant
3. Accédez à la section API : [https://x.ai/api](https://x.ai/api)

### 1.2 Générer une clé API

1. Dans le dashboard xAI, allez dans la section **API Keys** ou **Clés API**
2. Cliquez sur **"Create API Key"** ou **"Créer une clé API"**
3. Donnez un nom à votre clé (ex: "SkillShield Prospection")
4. **Copiez la clé API** immédiatement (elle ne sera affichée qu'une seule fois)
   - Format typique : `xai-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

⚠️ **Important** : Si vous perdez la clé, vous devrez en créer une nouvelle.

## ⚙️ Étape 2 : Configurer la clé dans Vercel

### 2.1 Accéder aux variables d'environnement

1. Connectez-vous à [Vercel Dashboard](https://vercel.com/dashboard)
2. Sélectionnez votre projet **skillshield-ai**
3. Allez dans **Settings** (Paramètres)
4. Cliquez sur **Environment Variables** (Variables d'environnement)

### 2.2 Ajouter la variable GROK_API_KEY

1. Cliquez sur **"Add New"** (Ajouter)
2. Remplissez les champs :
   - **Key** (Clé) : `GROK_API_KEY`
   - **Value** (Valeur) : Collez votre clé API Grok (ex: `xai-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`)
   - **Environments** : Cochez **toutes les cases** :
     - ✅ Production
     - ✅ Preview
     - ✅ Development

3. Cliquez sur **"Save"** (Enregistrer)

### 2.3 Redéployer l'application

⚠️ **Important** : Après avoir ajouté une nouvelle variable d'environnement, vous devez redéployer l'application pour que les changements prennent effet.

**Option 1 : Via le Dashboard Vercel**
1. Allez dans l'onglet **Deployments**
2. Cliquez sur les **3 points (⋯)** du dernier déploiement
3. Sélectionnez **"Redeploy"**

**Option 2 : Via la ligne de commande**
```bash
cd skillshield-ai-4
vercel --prod --yes
```

## ✅ Étape 3 : Vérifier la configuration

### 3.1 Tester la fonctionnalité

1. Accédez à `https://skillshield.app/92300` (ou `/12000`)
2. Activez le **"Mode Automatisé"**
3. Remplissez les champs :
   - **Catégorie** : Ex: "agence immobilière"
   - **Secteur** : Ex: "Paris"
4. Cliquez sur **"Rechercher des emails de prospects"**

### 3.2 Vérifier les logs en cas d'erreur

Si vous rencontrez une erreur, vérifiez les logs Vercel :

1. Allez dans **Deployments** → Dernier déploiement
2. Cliquez sur **"Functions"** → `api/prospection-automation`
3. Consultez les logs pour voir les erreurs éventuelles

**Erreurs courantes :**
- `GROK_API_KEY not configured` → La variable d'environnement n'est pas configurée ou le déploiement n'a pas été fait après l'ajout
- `401 Unauthorized` → La clé API est invalide ou expirée
- `429 Too Many Requests` → Limite de taux atteinte (attendez quelques minutes)

## 🔒 Sécurité

### Bonnes pratiques

1. **Ne jamais commiter la clé API dans Git**
   - La clé est déjà dans `.gitignore`
   - Utilisez uniquement les variables d'environnement Vercel

2. **Limiter l'accès**
   - Ne partagez pas votre clé API
   - Utilisez des clés différentes pour chaque environnement si nécessaire

3. **Surveiller l'utilisation**
   - Vérifiez régulièrement l'utilisation de votre clé dans le dashboard xAI
   - Configurez des alertes si vous avez des limites de coût

## 📊 Coûts et limites

### Tarification Grok API

- Consultez [https://x.ai/pricing](https://x.ai/pricing) pour les tarifs actuels
- Les coûts dépendent du nombre de tokens utilisés
- Chaque recherche d'emails utilise environ 2000 tokens maximum

### Limites de taux

- Vérifiez les limites de votre plan dans le dashboard xAI
- En cas de dépassement, vous recevrez une erreur `429 Too Many Requests`

## 🛠️ Dépannage

### La recherche ne fonctionne pas

1. **Vérifiez que la variable est bien configurée :**
   ```bash
   # Dans Vercel Dashboard → Settings → Environment Variables
   # Vérifiez que GROK_API_KEY existe et a une valeur
   ```

2. **Vérifiez que le déploiement a été fait après l'ajout :**
   - Les nouvelles variables nécessitent un redéploiement

3. **Testez la clé API directement :**
   ```bash
   curl https://api.x.ai/v1/chat/completions \
     -H "Authorization: Bearer YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{
       "model": "grok-beta",
       "messages": [{"role": "user", "content": "Hello"}]
     }'
   ```

### Erreur "Invalid API Key"

- Vérifiez que vous avez copié la clé complète (sans espaces)
- Vérifiez que la clé commence par `xai-`
- Créez une nouvelle clé si nécessaire

## 📚 Ressources

- [Documentation xAI API](https://docs.x.ai)
- [Dashboard xAI](https://x.ai/api)
- [Documentation Vercel - Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

## 💡 Astuces

1. **Utilisez des catégories spécifiques** pour de meilleurs résultats :
   - ✅ Bon : "agence immobilière", "cabinet comptable", "restaurant"
   - ❌ Moins bon : "entreprise", "société", "business"

2. **Soyez précis avec les secteurs** :
   - ✅ Bon : "Paris 15e", "Lyon 3e", "Marseille"
   - ❌ Moins bon : "France", "Europe"

3. **Limitez le nombre de recherches** pour éviter les coûts excessifs

---

**Besoin d'aide ?** Consultez les logs Vercel ou contactez le support xAI si le problème persiste.

