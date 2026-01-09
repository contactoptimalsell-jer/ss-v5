# 🏗️ Configuration Monorepo - Un seul déploiement

## ✅ Solution implémentée

Les deux projets sont maintenant configurés pour être déployés dans **un seul déploiement Vercel** via un monorepo.

## 📁 Structure

```
ss-v5/
├── vercel.json                    # Configuration monorepo (à la racine) ⚠️ IMPORTANT
├── skillshield-ai-4/              # Projet principal (Vite/React)
│   ├── package.json
│   └── vercel.json                # Configuration SPA
└── skillshield-training/           # Projet Training (Next.js)
    ├── package.json
    └── next.config.ts             # basePath: "/training"
```

## 🔧 Configuration du `vercel.json` à la racine

Le fichier `vercel.json` à la racine configure :

1. **Deux builds parallèles** :
   - `skillshield-ai-4` : Build Vite → static files
   - `skillshield-training` : Build Next.js

2. **Routing automatique** :
   - `/training/*` → Projet Training
   - `/*` → Projet principal (SkillShield AI)

## 🚀 Déploiement

### Configuration dans Vercel Dashboard

**IMPORTANT** : Pour que le monorepo fonctionne :

1. **Allez sur** https://vercel.com/dashboard
2. **Ouvrez le projet** `ss-v5` (ou le projet qui utilise le repo `ss-v5`)
3. **Vérifiez** :
   - **Root Directory** : Doit être **vide** ou **`.`** (racine du repo)
   - **Framework** : Vercel utilisera le `vercel.json` à la racine
4. **Le `vercel.json` à la racine** sera automatiquement utilisé

### Build automatique

Quand vous poussez sur le repository :

1. Vercel détecte le `vercel.json` à la racine
2. **Build les deux projets en parallèle** :
   - Build 1 : `skillshield-ai-4` (Vite)
   - Build 2 : `skillshield-training` (Next.js)
3. **Route les requêtes** automatiquement :
   - `skillshield.app` → SkillShield AI
   - `skillshield.app/training` → SkillShield Training

## ✅ Résultat

- ✅ **Un seul déploiement** pour les deux projets
- ✅ **Un seul repository** à gérer
- ✅ **Déploiements synchronisés** (les deux se déploient ensemble)
- ✅ **Routing automatique** via `vercel.json`

## 🔍 Vérification

Après le prochain déploiement :

1. **Vérifiez les logs de build** :
   - Vous devriez voir deux builds : un pour `skillshield-ai-4` et un pour `skillshield-training`

2. **Testez les URLs** :
   - ✅ `https://skillshield.app` → SkillShield AI
   - ✅ `https://skillshield.app/training` → SkillShield Training

## ⚠️ Notes importantes

- Le `vercel.json` à la racine est **obligatoire** pour le monorepo
- Les deux projets gardent leurs propres configurations :
  - `skillshield-ai-4/vercel.json` : Configuration SPA
  - `skillshield-training/next.config.ts` : basePath: "/training"
- Les builds se font **en parallèle** pour optimiser le temps de déploiement
- Le routing est géré par Vercel selon les routes définies dans le `vercel.json` à la racine

## 🐛 Dépannage

Si le build échoue :

1. **Vérifiez** que le `vercel.json` est bien à la racine du repo
2. **Vérifiez** que les chemins dans `builds` sont corrects
3. **Vérifiez** les logs de build pour voir quel build échoue
4. **Assurez-vous** que les deux `package.json` existent et sont valides

---

**🎯 Configuration terminée !** Les deux projets seront déployés ensemble dans un seul déploiement au prochain push.
