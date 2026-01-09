# 🔧 Fix : package.json manquant à la racine

## ❌ Problème

Vercel cherche un `package.json` à la racine mais ne le trouve pas :
```
npm error path /vercel/path0/package.json
npm error errno -2
npm error enoent Could not read package.json
```

## ✅ Solution appliquée

J'ai créé un `package.json` minimal à la racine qui sert de point d'entrée pour le monorepo.

## 📋 Fichiers créés/modifiés

1. **`package.json` à la racine** : Point d'entrée minimal pour Vercel
2. **`vercel.json` mis à jour** : Ajout d'un `buildCommand` par défaut

## 🚀 Prochaines étapes

1. **Commitez et poussez** les changements :
   ```bash
   git add package.json vercel.json
   git commit -m "Add root package.json for monorepo"
   git push
   ```

2. **Vercel redéploiera automatiquement**

3. **Vérifiez les logs** : Vous devriez voir les deux builds :
   ```
   Building skillshield-ai-4...
   Building skillshield-training...
   ```

## ✅ Résultat attendu

Après le redéploiement :
- ✅ Plus d'erreur `package.json` manquant
- ✅ Les deux projets seront buildés
- ✅ `/training` devrait fonctionner

---

**🎯 Action** : Commitez et poussez les changements pour déclencher un nouveau déploiement !
