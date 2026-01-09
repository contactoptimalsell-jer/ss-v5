# 🔧 Solution Alternative : Projet Training Séparé

## ❌ Problème

Vercel ne semble pas builder les deux projets ensemble dans un seul `vercel.json`. Les builds multiples avec des frameworks différents (Vite + Next.js) peuvent être problématiques.

## ✅ Solution : Projet Training séparé avec rewrites

Créons un projet Training séparé et utilisons des rewrites dans le projet principal pour rediriger `/training` vers ce projet.

### Étape 1 : Créer le projet Training sur Vercel

1. **Allez sur** https://vercel.com/dashboard
2. **Cliquez** sur "Add New" → "Project"
3. **Importez** le repository `ss-v5`
4. **Configurez** :
   - **Project Name** : `skillshield-training`
   - **Root Directory** : ⚠️ **`skillshield-training`** (cliquez sur "Edit")
   - **Framework Preset** : Next.js (auto-détecté)
5. **Cliquez** sur "Deploy"

### Étape 2 : Noter l'URL Vercel

Après le déploiement, notez l'URL Vercel du projet Training :
- Exemple : `skillshield-training-abc123.vercel.app`
- Ou : `skillshield-training.vercel.app`

### Étape 3 : Configurer les rewrites dans skillshield-ai-4

Une fois que vous avez l'URL, je mettrai à jour le `vercel.json` de `skillshield-ai-4` pour rediriger `/training` vers le projet Training.

### Étape 4 : Configurer le domaine

Dans le projet Training :
1. **Settings** → **Domains**
2. Ajoutez : `training.skillshield.app` (sous-domaine)
   - OU configurez le routing dans le projet principal

## ✅ Avantages

- ✅ Les deux projets sont indépendants
- ✅ Déploiements séparés possibles
- ✅ Plus simple à gérer
- ✅ Fonctionne à coup sûr

---

**🎯 Action** : Créez le projet Training séparé et donnez-moi l'URL Vercel !
