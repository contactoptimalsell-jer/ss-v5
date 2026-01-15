# 🔄 Redéployer le projet Training

## ✅ Corrections appliquées

J'ai retiré le `basePath: "/training"` du `next.config.ts` du projet Training.

## 🔄 Prochaine étape : Redéployer

Le projet Training doit être redéployé avec le nouveau commit qui retire le `basePath`.

### Dans Vercel Dashboard :

1. **Allez sur** le projet Training (`ss-v5-ochre`)
2. **Allez** dans **Deployments**
3. **Cliquez** sur les **3 points (⋯)** du dernier déploiement
4. **Sélectionnez** **"Redeploy"**

**OU** attendez que Vercel détecte automatiquement le nouveau commit (`5b7fc0dd` ou plus récent).

## ✅ Résultat attendu

Après redéploiement :
- ✅ Plus d'erreur `basePath can not be used with builds`
- ✅ Le build Training devrait réussir complètement
- ✅ `https://ss-v5-ochre.vercel.app/` devrait afficher Training

## 🎯 URLs

- **Projet Training direct** : `https://ss-v5-ochre.vercel.app/`
- **Via rewrites** : `https://skillshield.app/training` → redirige vers Training

---

**🎯 Action** : Redéployez le projet Training dans Vercel ou attendez le déploiement automatique !
