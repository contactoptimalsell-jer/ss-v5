# ⚡ Déploiement rapide : SkillShield Training

## 🎯 Objectif

Déployer Training sur `https://skillshield.app/training`

## 📋 Étapes rapides

### 1. Créer le projet Vercel

1. **https://vercel.com/dashboard** → **"Add New"** → **"Project"**
2. **Importez** le repository `ss-v5`
3. **Configurez** :
   - **Root Directory** : `skillshield-training` ⚠️ IMPORTANT
   - **Framework** : Next.js (auto-détecté)
4. **Cliquez** sur **"Deploy"**

### 2. Noter l'URL Vercel

Après le déploiement, notez l'URL Vercel du projet Training :
- Exemple : `skillshield-training-abc123.vercel.app`
- Ou : `skillshield-training.vercel.app`

### 3. Mettre à jour le routing

Une fois que vous avez l'URL Vercel du projet Training, dites-moi et je mettrai à jour le `vercel.json` du projet principal avec la bonne URL.

**OU** vous pouvez le faire vous-même :

1. Dans le projet **skillshield-ai-4**, modifiez `vercel.json`
2. Remplacez `skillshield-training.vercel.app` par l'URL réelle de votre projet Training
3. Commitez et poussez

### 4. Configurer le domaine

**Option simple** : Ajoutez le domaine dans le projet Training

1. Dans le projet Training Vercel
2. **Settings** → **Domains**
3. Ajoutez : `skillshield.app`
4. Vercel devrait automatiquement gérer le routing avec le `basePath: "/training"`

## ✅ Résultat

Après ces étapes :
- ✅ `https://skillshield.app` → SkillShield AI
- ✅ `https://skillshield.app/training` → SkillShield Training

---

**💡 Astuce** : Si vous préférez, je peux vous guider étape par étape en temps réel !
