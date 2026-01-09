# 🚀 Créer le projet Training séparé

## ✅ Solution : Projet Training séparé

Puisque les builds multiples ne fonctionnent pas bien, créons un projet Training séparé.

## 📋 Étapes dans Vercel

### 1. Créer le projet

1. **Allez sur** https://vercel.com/dashboard
2. **Cliquez** sur **"Add New"** → **"Project"**
3. **Importez** le repository **`ss-v5`**
4. **Configurez** :
   - **Project Name** : `skillshield-training`
   - **Root Directory** : ⚠️ **`skillshield-training`** (cliquez sur "Edit" et entrez)
   - **Framework Preset** : Next.js (devrait être auto-détecté)
5. **Cliquez** sur **"Deploy"**

### 2. Noter l'URL Vercel

Après le déploiement, notez l'URL Vercel :
- Exemple : `skillshield-training-abc123.vercel.app`
- Ou : `skillshield-training.vercel.app`

### 3. Me donner l'URL

**Donnez-moi l'URL Vercel du projet Training** et je mettrai à jour le `vercel.json` de `skillshield-ai-4` avec la bonne URL.

### 4. Redéployer skillshield-ai-4

Après que j'aie mis à jour le `vercel.json`, redéployez `skillshield-ai-4` :
- Deployments → Redeploy

## ✅ Résultat

Après configuration :
- ✅ `https://skillshield.app` → SkillShield AI
- ✅ `https://skillshield.app/training` → SkillShield Training (via rewrite)

## 📝 Note

J'ai déjà préparé les rewrites dans `skillshield-ai-4/vercel.json`. Il suffit de remplacer l'URL placeholder par l'URL réelle de votre projet Training.

---

**🎯 Action** : Créez le projet Training et donnez-moi l'URL Vercel !
