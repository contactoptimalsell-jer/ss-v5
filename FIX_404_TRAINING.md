# 🔧 Fix 404 sur /training

## ❌ Problème actuel

Vous obtenez une 404 sur `/training` alors que les rewrites sont configurés dans `skillshield-ai-4/vercel.json`.

## 🔍 Diagnostic

Le problème vient probablement du fait que :
1. Le projet Training (`ss-v5-ochre`) n'est **pas accessible** à l'URL `https://ss-v5-ochre.vercel.app/`
2. Les rewrites pointent vers une URL qui n'existe pas ou qui retourne 404
3. Le projet Training n'est peut-être pas déployé avec le bon Root Directory

## ✅ Solution : Vérifier et déployer le projet Training

### Étape 1 : Vérifier que le projet Training est déployé

1. **Dans Vercel Dashboard** :
   - Cherchez le projet **Training** (peut-être nommé `ss-v5-ochre` ou `skillshield-training`)
   - Vérifiez qu'il est bien déployé (dernière deployment réussie)

2. **Tester l'URL directe** :
   - Allez sur `https://ss-v5-ochre.vercel.app/` directement
   - Si ça donne 404 → Le projet n'est pas déployé correctement

### Étape 2 : Si le projet Training n'existe pas ou n'est pas accessible

**Option A : Créer un nouveau projet Training dans Vercel**

1. **Dans Vercel Dashboard** :
   - Cliquez sur **"Add New Project"**
   - Importez le repository `ss-v5`
   - **Root Directory** : `skillshield-training` (IMPORTANT !)
   - **Framework Preset** : Next.js (devrait être détecté automatiquement)
   - **Build Command** : `npm run build` (défaut Next.js)
   - **Output Directory** : `.next` (défaut Next.js)
   - Cliquez sur **Deploy**

2. **Une fois déployé** :
   - Notez l'URL Vercel du projet (ex: `ss-v5-training-xyz.vercel.app`)
   - Mettez à jour les rewrites dans `skillshield-ai-4/vercel.json` avec cette nouvelle URL

**Option B : Si le projet existe déjà, vérifier le Root Directory**

1. **Dans Vercel Dashboard** → Projet Training :
   - **Settings** → **General**
   - **Root Directory** : Doit être `skillshield-training` (exactement)
   - Si c'est vide ou `.`, changez-le et sauvegardez

2. **Redéployer** :
   - **Deployments** → **Redeploy**

### Étape 3 : Mettre à jour les rewrites avec la bonne URL

Une fois que vous avez l'URL du projet Training :

1. **Ouvrez** `skillshield-ai-4/vercel.json`
2. **Remplacez** `https://ss-v5-ochre.vercel.app/` par la vraie URL du projet Training
3. **Committez et pushez** :
   ```bash
   git add skillshield-ai-4/vercel.json
   git commit -m "Update Training project URL in rewrites"
   git push
   ```

## 🎯 Vérification finale

1. **Testez l'URL directe du Training** : `https://[URL-TRAINING].vercel.app/`
   - Devrait afficher la page Training (pas 404)

2. **Testez via le projet principal** : `https://ss-v5-k32l.vercel.app/training`
   - Devrait rediriger vers le Training

3. **Testez en production** : `https://skillshield.app/training`
   - Devrait rediriger vers le Training (si domaine configuré)

---

**📝 Action immédiate** : Vérifiez dans Vercel Dashboard si le projet Training existe et quelle est son URL !
