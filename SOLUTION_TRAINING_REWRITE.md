# 🔧 Solution : Training via Rewrite

## ✅ Solution implémentée

Puisque Vercel utilise le Root Directory `skillshield-ai-4`, j'ai configuré des **rewrites** dans le `vercel.json` de `skillshield-ai-4` pour rediriger `/training` vers un projet Training séparé.

## 📋 Étapes pour activer Training

### Étape 1 : Créer le projet Training sur Vercel

1. **Allez sur** https://vercel.com/dashboard
2. **Cliquez** sur "Add New" → "Project"
3. **Importez** le repository `ss-v5`
4. **Configurez** :
   - **Project Name** : `skillshield-training`
   - **Root Directory** : ⚠️ **`skillshield-training`** (cliquez sur "Edit")
   - **Framework Preset** : Next.js (auto-détecté)
5. **Cliquez** sur "Deploy"

### Étape 2 : Noter l'URL Vercel du projet Training

Après le déploiement, notez l'URL Vercel :
- Exemple : `skillshield-training-abc123.vercel.app`
- Ou : `skillshield-training.vercel.app`

### Étape 3 : Mettre à jour le vercel.json

Une fois que vous avez l'URL Vercel du projet Training, **dites-moi l'URL** et je mettrai à jour le `vercel.json` de `skillshield-ai-4` avec la bonne URL.

**OU** vous pouvez le faire vous-même :

1. Ouvrez `skillshield-ai-4/vercel.json`
2. Remplacez `skillshield-training.vercel.app` par l'URL réelle de votre projet Training
3. Commitez et poussez

### Étape 4 : Redéployer

Après la mise à jour :

1. Le projet `skillshield-ai-4` se redéploiera automatiquement
2. `https://skillshield.app/training` redirigera vers le projet Training

## ✅ Résultat

- ✅ `https://skillshield.app` → SkillShield AI (projet principal)
- ✅ `https://skillshield.app/training` → SkillShield Training (projet séparé via rewrite)

## 🔍 Comment ça fonctionne

Le `vercel.json` de `skillshield-ai-4` contient maintenant des rewrites qui :
- Interceptent les requêtes vers `/training/*`
- Les redirigent vers le projet Training déployé séparément
- Gardent toutes les autres routes pour le projet principal

## 📝 Avantages

- ✅ Pas besoin de changer le Root Directory
- ✅ Les deux projets restent indépendants
- ✅ Déploiements séparés possibles
- ✅ Routing transparent pour l'utilisateur

---

**🎯 Action immédiate** : Créez le projet Training sur Vercel et donnez-moi l'URL !
