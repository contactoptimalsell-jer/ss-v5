# 🔧 Fix : Builder les deux projets

## ❌ Problème

Les logs montrent qu'un seul build est exécuté (`skillshield-ai-4`), pas les deux. Le projet Training n'est pas buildé.

## ✅ Solution appliquée

J'ai mis à jour le `vercel.json` pour :
1. Ajouter la configuration `zeroConfig: false` pour Next.js
2. Ajouter une route pour les assets Next.js (`/_next/*`)

## 📋 Vérification

Après le prochain déploiement, dans les logs vous devriez voir :

```
Building skillshield-ai-4...
Building skillshield-training...
```

## 🔍 Note importante

**URL correcte** : Utilisez **`/training`** (avec un 'i'), pas `/traning` (sans 'i') !

- ✅ `https://skillshield.app/training`
- ❌ `https://skillshield.app/traning` (404)

## ✅ Résultat attendu

Après le redéploiement :
- ✅ Les deux projets seront buildés
- ✅ `https://skillshield.app/training` devrait fonctionner

---

**🎯 Attendez le prochain déploiement et testez avec `/training` (avec 'i') !**
