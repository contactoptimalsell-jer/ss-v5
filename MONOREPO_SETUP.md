# 🏗️ Configuration Monorepo - Un seul déploiement

## ✅ Solution : Monorepo Vercel

Les deux projets (SkillShield AI et Training) sont maintenant configurés pour être déployés dans **un seul déploiement Vercel**.

## 📁 Structure

```
ss-v5/
├── vercel.json              # Configuration monorepo (à la racine)
├── skillshield-ai-4/        # Projet principal (Vite/React)
│   └── vercel.json          # Configuration SPA
└── skillshield-training/    # Projet Training (Next.js)
    └── next.config.ts        # basePath: "/training"
```

## 🔧 Configuration

### Fichier `vercel.json` à la racine

Le fichier `vercel.json` à la racine configure :
- **Build 1** : `skillshield-ai-4` (Vite → static build)
- **Build 2** : `skillshield-training` (Next.js)
- **Routing** :
  - `/training/*` → Projet Training
  - `/*` → Projet principal (SkillShield AI)

## 🚀 Déploiement

### Configuration dans Vercel Dashboard

1. **Allez sur** https://vercel.com/dashboard
2. **Ouvrez le projet** `ss-v5` (ou créez-le si nécessaire)
3. **Vérifiez la configuration** :
   - **Root Directory** : Ne doit **PAS** être configuré (laisser vide ou à la racine)
   - **Framework** : Vercel détectera automatiquement les deux projets
4. **Le `vercel.json` à la racine** gérera automatiquement les deux builds

### Build automatique

Quand vous poussez sur le repository :
1. Vercel détecte le `vercel.json` à la racine
2. Build les deux projets selon la configuration
3. Route les requêtes automatiquement :
   - `skillshield.app` → SkillShield AI
   - `skillshield.app/training` → SkillShield Training

## ✅ Résultat

- ✅ **Un seul déploiement** pour les deux projets
- ✅ **Un seul repository** à gérer
- ✅ **Routing automatique** via `vercel.json`
- ✅ **Déploiements synchronisés** (les deux se déploient ensemble)

## 🔍 Vérification

Après déploiement :
- ✅ `https://skillshield.app` → SkillShield AI
- ✅ `https://skillshield.app/training` → SkillShield Training
- ✅ Les deux fonctionnent dans le même déploiement

## 📝 Notes importantes

- Le `vercel.json` à la racine est **obligatoire** pour le monorepo
- Les deux projets gardent leurs propres configurations (`vercel.json` dans skillshield-ai-4, `next.config.ts` dans skillshield-training)
- Les builds se font en parallèle
- Le routing est géré par Vercel selon les routes définies

---

**🎯 Configuration terminée !** Les deux projets seront déployés ensemble dans un seul déploiement.
