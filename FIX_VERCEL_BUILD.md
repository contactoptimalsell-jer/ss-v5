# 🔧 Fix de l'erreur "Provisioning integrations failed"

## ❌ Problème
L'erreur "Provisioning integrations failed" est causée par le fichier `vercel.json` à la racine qui essaie de gérer deux projets en même temps, ce qui interfère avec la configuration existante de Vercel.

## ✅ Solution : Configuration séparée

Le fichier `vercel.json` à la racine a été supprimé. Les deux projets doivent être configurés **séparément** dans Vercel.

### Option 1 : Deux projets Vercel séparés (Recommandé)

1. **Projet 1 : SkillShield AI** (existant)
   - Projet Vercel : `skillshield-ai` ou `skillshield-ai-4`
   - Dossier : `skillshield-ai-4/`
   - Domaine : `skillshield.app` (racine)
   - ✅ Déjà configuré et fonctionnel

2. **Projet 2 : SkillShield Training** (nouveau)
   - Créez un nouveau projet Vercel
   - Nom : `skillshield-training`
   - Dossier : `skillshield-training/`
   - Domaine : `skillshield.app` avec path `/training`
   - Configuration : Le `basePath: "/training"` dans `next.config.ts` est déjà configuré

### Configuration dans Vercel Dashboard

#### Pour SkillShield Training :

1. **Créer le projet** :
   - Allez sur https://vercel.com/dashboard
   - Cliquez sur **"Add New"** → **"Project"**
   - Importez le repository `ss-v5`
   - Configurez :
     - **Framework Preset** : Next.js
     - **Root Directory** : `skillshield-training`
     - **Build Command** : `npm run build` (automatique)
     - **Output Directory** : `.next` (automatique)

2. **Configurer le domaine** :
   - Allez dans **Settings** → **Domains**
   - Ajoutez : `skillshield.app`
   - Dans les options, configurez le **Path** : `/training`
   - Ou utilisez un sous-domaine : `training.skillshield.app`

3. **Variables d'environnement** :
   - Allez dans **Settings** → **Environment Variables**
   - Ajoutez :
     - `RESEND_API_KEY` : Votre clé API Resend
     - `CONTACT_EMAIL` : `contact@skillshield.app` (optionnel)

### Option 2 : Monorepo avec détection automatique

Si vous préférez un seul projet Vercel :

1. Vercel peut détecter automatiquement les sous-projets dans un monorepo
2. Configurez les **Project Settings** → **Monorepo**
3. Spécifiez les dossiers :
   - `skillshield-ai-4` → Framework: Vite
   - `skillshield-training` → Framework: Next.js

## 🚀 Redéploiement

Après avoir supprimé le `vercel.json` à la racine :

1. **Pour SkillShield AI** (existant) :
   - Le projet devrait se redéployer automatiquement
   - Ou faites un commit vide pour déclencher un nouveau build

2. **Pour SkillShield Training** :
   - Créez le nouveau projet dans Vercel comme décrit ci-dessus
   - Le premier déploiement se fera automatiquement

## ✅ Vérification

Après configuration :

1. **SkillShield AI** : https://skillshield.app ✅ (devrait fonctionner)
2. **SkillShield Training** : https://skillshield.app/training (après configuration)

## 📝 Note importante

Le fichier `vercel.json` à la racine a été supprimé car il causait des conflits avec la configuration existante. Chaque projet a sa propre configuration :
- `skillshield-ai-4/vercel.json` : Configuration SPA pour le projet principal
- `skillshield-training/next.config.ts` : Configuration Next.js avec basePath
