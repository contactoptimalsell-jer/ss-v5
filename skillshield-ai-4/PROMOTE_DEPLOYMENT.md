# Comment promouvoir un déploiement en production sur Vercel

## 🎯 Situation actuelle
- **Déploiement actuel en production** : `789a558` (16h ago)
- **Commits récents non déployés** : `7338ef83`, `66f05688`, `d6fe6398`, `cfa47649`

## ✅ Solution : Promouvoir le nouveau déploiement

### Méthode 1 : Via le Dashboard Vercel (RECOMMANDÉ)

1. **Allez sur [Vercel Dashboard](https://vercel.com/dashboard)**
2. **Ouvrez votre projet** `skillshield-ai`
3. **Allez dans l'onglet "Deployments"**
4. **Trouvez le déploiement avec le commit `7338ef83`** ou le plus récent
   - Cherchez un déploiement créé il y a moins de 5 minutes
   - Le commit devrait être `7338ef83` ou plus récent
5. **Cliquez sur les 3 points (⋯)** à droite du déploiement
6. **Sélectionnez "Promote to Production"**
7. **Confirmez la promotion**

### Méthode 2 : Si aucun nouveau déploiement n'existe

Si vous ne voyez pas de nouveau déploiement avec les commits récents :

1. **Allez dans "Deployments"**
2. **Cliquez sur "Redeploy"** sur le déploiement actuel
3. **Décochez "Use existing Build Cache"** si disponible
4. **Cliquez sur "Redeploy"**

### Méthode 3 : Forcer un nouveau déploiement via Git

Si les méthodes ci-dessus ne fonctionnent pas, un nouveau commit sera créé pour forcer le déploiement.

## 🔍 Comment identifier le bon déploiement

Le bon déploiement devrait avoir :
- **Commit** : `7338ef83` ou plus récent
- **Message** : "chore: Redéploiement production - conditions générales et /77230"
- **Statut** : "Ready" (vert)
- **Créé** : Il y a quelques minutes

## ⚠️ Si le déploiement ne se crée pas automatiquement

Cela peut arriver si :
- Vercel n'a pas détecté le push Git
- Il y a un problème de webhook GitHub → Vercel

**Solution** : Forcer un nouveau commit (voir ci-dessous)

