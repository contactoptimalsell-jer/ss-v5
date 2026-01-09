# 🎯 Solution : Training comme sous-projet dans le même compte

## ✅ Approche

Créer un projet Training **séparé** dans Vercel (même compte/team), mais configuré pour apparaître comme un sous-projet via des rewrites.

## 📋 Étapes

### 1. Créer le projet Training dans Vercel

1. **Allez sur** https://vercel.com/dashboard
2. **Cliquez** sur **"Add New"** → **"Project"**
3. **Importez** le repository **`ss-v5`**
4. **Configurez** :
   - **Project Name** : `skillshield-training` (ou `skillshield-ai-4-training`)
   - **Root Directory** : ⚠️ **`skillshield-training`** (cliquez sur "Edit")
   - **Framework Preset** : Next.js (auto-détecté)
5. **Cliquez** sur **"Deploy"**

### 2. Noter l'URL Vercel

Après le déploiement, notez l'URL Vercel :
- Exemple : `skillshield-training-abc123.vercel.app`
- Ou : `skillshield-training.vercel.app`

### 3. Mettre à jour les rewrites

**Donnez-moi l'URL Vercel** et je mettrai à jour le `vercel.json` de `skillshield-ai-4` avec la bonne URL.

### 4. Configurer le domaine (optionnel)

Pour que Training soit accessible via le même domaine :

**Option A : Sous-domaine**
- Dans le projet Training, ajoutez : `training.skillshield.app`

**Option B : Même domaine avec rewrites** (recommandé)
- Les rewrites dans `skillshield-ai-4` redirigeront `/training` vers le projet Training
- Pas besoin de configurer de domaine supplémentaire

## ✅ Résultat

- ✅ **Même compte Vercel** : Les deux projets sont dans OptimalSell
- ✅ **Même domaine** : `skillshield.app/training` fonctionne
- ✅ **Gestion unifiée** : Facile à gérer depuis le dashboard
- ✅ **Déploiements indépendants** : Chaque projet se déploie séparément

## 📝 Avantages

- ✅ Pas de problème de builds multiples
- ✅ Chaque projet garde sa configuration
- ✅ Déploiements rapides et indépendants
- ✅ Facile à scaler séparément

---

**🎯 Action** : Créez le projet Training et donnez-moi l'URL Vercel !
