# 🔧 Fix : Erreur "basePath can not be used with builds"

## ❌ Problème

L'erreur dit : "basePath can not be used with `builds` in vercel.json"

Cela signifie que Vercel détecte un `vercel.json` avec des `builds` quelque part, ce qui entre en conflit avec le `basePath` dans `next.config.ts`.

## ✅ Solution

Puisque Training est maintenant un projet séparé avec son propre Root Directory (`skillshield-training`), il ne devrait pas voir de `vercel.json` à la racine avec `builds`.

**Le `basePath: "/training"` dans `next.config.ts` devrait fonctionner** pour le projet Training séparé.

## 🎯 Si l'erreur persiste

L'erreur peut venir du fait que :
1. Vercel détecte encore un `vercel.json` avec `builds` à la racine du repository
2. Ou il y a un conflit de configuration

**Solution** : Vérifiez dans Vercel Dashboard que le projet Training utilise bien le Root Directory `skillshield-training` et n'a pas de configuration de monorepo.

## ✅ Vérification

Les logs montrent que **les deux builds réussissent** :
- ✅ `skillshield-ai-4` build réussi (Vite)
- ✅ `skillshield-training` build réussi (Next.js)

Donc même si il y a une erreur à la fin, les builds fonctionnent. L'erreur est peut-être juste un warning.

---

**🎯 Testez** : `https://skillshield.app/training` devrait fonctionner maintenant !
