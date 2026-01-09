# 🔧 Fix 404 pour le projet ss-v5-yx9r

## ❌ Problème

Le projet `ss-v5-yx9r` est déployé mais retourne une erreur **404 NOT FOUND**.

## 🔍 Cause

Le projet ne trouve pas les fichiers à servir. Cela peut être dû à :
1. **Root Directory** non configuré ou incorrect
2. Le `vercel.json` à la racine n'est pas détecté
3. Les builds ne sont pas configurés correctement

## ✅ Solution

### Option 1 : Configurer le Root Directory (Recommandé)

1. **Dans Vercel Dashboard** :
   - Ouvrez le projet **`ss-v5-yx9r`**
   - Allez dans **Settings** → **General**
   - Cherchez **"Root Directory"**
   - **Laissez vide** ou mettez **`.`** (point)
   - Sauvegardez

2. **Redéployez** :
   - Deployments → Redeploy

Le `vercel.json` à la racine devrait alors être utilisé et builder les deux projets.

### Option 2 : Si vous voulez seulement SkillShield AI

Si ce projet doit servir uniquement SkillShield AI :

1. **Settings** → **General** → **Root Directory**
2. Mettez : **`skillshield-ai-4`**
3. Sauvegardez et redéployez

### Option 3 : Si vous voulez seulement Training

Si ce projet doit servir uniquement Training :

1. **Settings** → **General** → **Root Directory**
2. Mettez : **`skillshield-training`**
3. Sauvegardez et redéployez

## 🎯 Recommandation

Pour avoir les deux projets dans le même déploiement :

1. **Root Directory** : Laissez **vide** (racine)
2. Le `vercel.json` à la racine builder les deux projets
3. Le routing gérera `/training` → Training et `/` → AI

## ✅ Vérification

Après configuration et redéploiement :

- ✅ `https://ss-v5-yx9r.vercel.app` → Devrait afficher SkillShield AI
- ✅ `https://ss-v5-yx9r.vercel.app/training` → Devrait afficher Training

---

**🎯 Action immédiate** : Vérifiez et configurez le Root Directory dans Settings → General !
