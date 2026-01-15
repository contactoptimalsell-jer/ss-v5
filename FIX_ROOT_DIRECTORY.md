# 🔧 Fix Root Directory pour les projets Vercel

## ❌ Problème identifié

Les projets Vercel utilisent des commits anciens qui contiennent encore un `vercel.json` avec `builds` à la racine. Cela cause le warning "Due to `builds` existing in your configuration file".

## ✅ Solution : Configurer le Root Directory

### Pour le projet `skillshield-ai-4` :

1. **Dans Vercel Dashboard** :
   - Allez sur https://vercel.com/dashboard
   - Ouvrez le projet **`skillshield-ai-4`**

2. **Configurer le Root Directory** :
   - **Settings** → **General**
   - Cherchez **"Root Directory"**
   - Si c'est vide ou `.`, changez-le en : **`skillshield-ai-4`** (exactement)
   - **Sauvegardez**

3. **Redéployer** :
   - **Deployments** → Cliquez sur les **3 points (⋯)** du dernier déploiement
   - Sélectionnez **"Redeploy"**
   - Vérifiez que le commit utilisé est **`8c6132c3`** ou plus récent

### Pour le projet `ss-v5-k32l` (si c'est un doublon) :

**Option A : Si c'est un doublon de `skillshield-ai-4`**
- Vous pouvez le supprimer ou le configurer de la même manière

**Option B : Si c'est un projet différent**
- Configurez le Root Directory sur **`skillshield-ai-4`**
- Redéployez avec le dernier commit

## 🎯 Résultat attendu

Après configuration du Root Directory :
- ✅ Plus de warning "Due to `builds` existing"
- ✅ Vercel utilise le `vercel.json` dans `skillshield-ai-4/vercel.json` (sans `builds`)
- ✅ Les redirects pour `/training` fonctionnent correctement
- ✅ Le dernier commit est utilisé

## 📝 Configuration attendue

Une fois configuré, chaque projet devrait avoir :
- **Root Directory** : `skillshield-ai-4`
- **Build Command** : `npm run build` (défaut)
- **Output Directory** : `dist` (défaut)
- **Framework** : Vite (détecté automatiquement)

Le `vercel.json` utilisé sera celui dans `skillshield-ai-4/vercel.json`, qui contient les redirects pour Training.

---

**🚨 Action immédiate** : Configurez le Root Directory sur `skillshield-ai-4` pour chaque projet !
