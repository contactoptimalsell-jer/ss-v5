# 🎯 SkillShield Training - Service Séparé

## 📋 Configuration

SkillShield Training est configuré comme un **service séparé** de SkillShield AI, accessible indépendamment.

## 🌐 Options de déploiement

### Option 1 : Sous-domaine (Recommandé)
**URL** : `https://training.skillshield.app`

- Service complètement indépendant
- Meilleure séparation des services
- Plus facile à gérer et scaler séparément

### Option 2 : Service sur le même domaine
**URL** : `https://skillshield.app/training`

- Même domaine, service séparé
- Routing via basePath Next.js

## ✅ Configuration actuelle

Le projet Training est configuré avec :
- `basePath: "/training"` dans `next.config.ts` (pour Option 2)
- Service indépendant avec ses propres composants et API
- Pas de dépendance avec SkillShield AI

## 🚀 Déploiement

### Pour Option 1 (Sous-domaine) :

1. **Créer un projet Vercel séparé** :
   - Nom : `skillshield-training`
   - Root Directory : `skillshield-training`
   - Framework : Next.js

2. **Modifier `next.config.ts`** :
   - Retirer `basePath: "/training"` (pas nécessaire pour sous-domaine)

3. **Configurer le domaine** :
   - Dans Vercel, ajouter le domaine : `training.skillshield.app`
   - Configurer le DNS CNAME pointant vers Vercel

### Pour Option 2 (Même domaine) :

1. **Créer un projet Vercel séparé** :
   - Nom : `skillshield-training`
   - Root Directory : `skillshield-training`
   - Framework : Next.js

2. **Garder `basePath: "/training"`** dans `next.config.ts`

3. **Configurer le routing** :
   - Le projet principal redirige `/training/*` vers le projet Training

## 📝 Avantages d'un service séparé

- ✅ Déploiements indépendants
- ✅ Scaling séparé
- ✅ Maintenance isolée
- ✅ Équipes différentes possibles
- ✅ Monitoring séparé
