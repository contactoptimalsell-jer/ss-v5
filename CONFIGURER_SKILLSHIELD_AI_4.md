# 🎯 Configuration : Tout dans skillshield-ai-4

## ✅ Objectif

Configurer le projet **`skillshield-ai-4`** sur Vercel pour qu'il serve :
- **SkillShield AI** (Axe d'implémentation) : `https://skillshield.app`
- **SkillShield Training** (Axe d'aide/training) : `https://skillshield.app/training`

## 📋 Étapes dans Vercel Dashboard

### Étape 1 : Changer le Root Directory

1. **Allez sur** https://vercel.com/optimal-sell/skillshield-ai-4
2. **Cliquez** sur **Settings** (en haut)
3. **Allez** dans **General** (menu de gauche)
4. **Cherchez** la section **"Root Directory"**
5. **Cliquez** sur "Edit" à côté de "Root Directory"
6. **Effacez** `skillshield-ai-4` (laissez **vide** ou mettez **`.`**)
7. **Sauvegardez**

⚠️ **IMPORTANT** : Cela permettra à Vercel d'utiliser le `vercel.json` à la racine du repository qui builder les deux projets.

### Étape 2 : Redéployer

1. **Allez** dans l'onglet **Deployments**
2. **Cliquez** sur les **3 points (⋯)** du dernier déploiement
3. **Sélectionnez** **"Redeploy"**
4. **Attendez** que le build se termine

### Étape 3 : Vérifier les logs

Dans les logs de build, vous devriez maintenant voir :

```
Building skillshield-ai-4...
Building skillshield-training...
```

Au lieu de juste :
```
Building skillshield-ai-4...
```

## ✅ Résultat attendu

Après configuration :

- ✅ `https://skillshield.app` → **SkillShield AI** (Axe d'implémentation)
- ✅ `https://skillshield.app/training` → **SkillShield Training** (Axe d'aide/training)
- ✅ Tout dans **un seul projet Vercel** : `skillshield-ai-4`
- ✅ **Un seul déploiement** pour les deux services

## 🔧 Configuration technique

Le `vercel.json` à la racine du repository configure :

1. **Deux builds** :
   - `skillshield-ai-4` → Build Vite (static)
   - `skillshield-training` → Build Next.js

2. **Routing automatique** :
   - `/training/*` → Projet Training
   - `/*` → Projet principal (AI)

## 📝 Notes

- Le projet `ss-v5-yx9r` peut être supprimé (il n'est plus nécessaire)
- Tout sera géré par `skillshield-ai-4`
- Les deux services seront déployés ensemble
- Les futurs axes peuvent être ajoutés de la même manière

---

**🎯 Action immédiate** : Changez le Root Directory dans Settings → General et redéployez !
