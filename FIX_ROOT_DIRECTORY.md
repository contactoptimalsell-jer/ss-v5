# 🔧 Fix : Root Directory dans Vercel

## ❌ Problème

Les logs montrent qu'un seul build est exécuté (`skillshield-ai-4`), ce qui signifie que Vercel utilise le `vercel.json` dans `skillshield-ai-4` au lieu de celui à la racine.

## ✅ Solution : Configurer le Root Directory

### Étape 1 : Vérifier le Root Directory actuel

1. Allez sur **https://vercel.com/dashboard**
2. Ouvrez le projet **`ss-v5`** (ou le projet qui utilise ce repo)
3. Allez dans **Settings** → **General**
4. Cherchez la section **"Root Directory"**
5. **Vérifiez** ce qui est configuré :
   - Si c'est `skillshield-ai-4` → C'est le problème !
   - Si c'est vide ou `.` → C'est correct

### Étape 2 : Changer le Root Directory

Si le Root Directory est `skillshield-ai-4` :

1. **Cliquez** sur "Edit" à côté de "Root Directory"
2. **Effacez** `skillshield-ai-4` ou laissez **vide**
3. **Sauvegardez**

**OU** si l'option n'existe pas dans l'interface :

1. Le Root Directory doit être **vide** ou **`.`** (point)
2. Vercel utilisera alors le `vercel.json` à la racine du repo

### Étape 3 : Redéployer

Après avoir changé le Root Directory :

1. Allez dans **Deployments**
2. Cliquez sur **"Redeploy"** du dernier déploiement
3. **OU** faites un nouveau commit et push

### Étape 4 : Vérifier les logs

Dans les nouveaux logs de build, vous devriez voir :

```
Building skillshield-ai-4...
Building skillshield-training...
```

Au lieu de juste :
```
Building skillshield-ai-4...
```

## 🔍 Alternative : Si vous ne pouvez pas changer le Root Directory

Si l'interface Vercel ne vous permet pas de changer le Root Directory, vous pouvez :

1. **Créer un nouveau projet Vercel** :
   - Importez le même repository `ss-v5`
   - **Ne configurez PAS** de Root Directory (laissez vide)
   - Vercel utilisera automatiquement le `vercel.json` à la racine

2. **Migrer le domaine** :
   - Dans le nouveau projet, ajoutez le domaine `skillshield.app`
   - Supprimez-le de l'ancien projet

## ✅ Résultat attendu

Après correction :

- ✅ **Deux builds** dans les logs : `skillshield-ai-4` et `skillshield-training`
- ✅ **Routing fonctionnel** : `/training` → Training, `/` → AI
- ✅ **Un seul déploiement** pour les deux projets

---

**🎯 Action immédiate** : Vérifiez et changez le Root Directory dans Vercel Dashboard !
