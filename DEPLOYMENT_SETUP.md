# Configuration du déploiement SkillShield

Ce repository contient deux projets qui seront déployés sur le même domaine `skillshield.app` :

1. **SkillShield AI** (`skillshield-ai-4/`) - Application principale sur `https://skillshield.app`
2. **SkillShield Training** (`skillshield-training/`) - Application de formation sur `https://skillshield.app/training`

## Structure du projet

```
ss-v5/
├── skillshield-ai-4/          # Application Vite/React (route principale)
├── skillshield-training/      # Application Next.js (route /training)
└── DEPLOYMENT_SETUP.md        # Ce fichier
```

## Configuration Vercel

### Option 1 : Monorepo avec routing Vercel (Recommandé)

Pour déployer les deux projets sur le même domaine avec des routes différentes :

1. **Créer un projet Vercel monorepo** :
   - Allez sur https://vercel.com/dashboard
   - Créez un nouveau projet ou utilisez le projet existant
   - Connectez le repository `ss-v5`

2. **Configurer les projets** :
   - Vercel détectera automatiquement les deux projets
   - Configurez `skillshield-ai-4` comme projet principal
   - Configurez `skillshield-training` comme sous-projet

3. **Configuration du routing** :
   - Créez un fichier `vercel.json` à la racine du repository :

```json
{
  "version": 2,
  "builds": [
    {
      "src": "skillshield-ai-4/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    },
    {
      "src": "skillshield-training/package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/training/(.*)",
      "dest": "/skillshield-training/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/skillshield-ai-4/$1"
    }
  ]
}
```

### Option 2 : Deux projets Vercel séparés (Alternative)

Si vous préférez gérer les deux projets séparément :

1. **Projet 1 : SkillShield AI**
   - Projet Vercel : `skillshield-ai`
   - Domaine : `skillshield.app` (racine)
   - Dossier : `skillshield-ai-4/`

2. **Projet 2 : SkillShield Training**
   - Projet Vercel : `skillshield-training`
   - Domaine : `skillshield.app` avec path `/training`
   - Dossier : `skillshield-training/`
   - Configuration : Le `basePath: "/training"` dans `next.config.ts` est déjà configuré

## Variables d'environnement

### SkillShield AI (`skillshield-ai-4/`)
- `GEMINI_API_KEY` : Clé API Google Gemini

### SkillShield Training (`skillshield-training/`)
- `RESEND_API_KEY` : Clé API Resend pour l'envoi d'emails
- `CONTACT_EMAIL` : Email de contact (optionnel, défaut: `contact@skillshield.app`)

## Commandes de développement

### SkillShield AI
```bash
cd skillshield-ai-4
npm install
npm run dev
# Accessible sur http://localhost:3000
```

### SkillShield Training
```bash
cd skillshield-training
npm install
npm run dev
# Accessible sur http://localhost:3000/training
```

## Déploiement

### Déploiement manuel

**SkillShield AI :**
```bash
cd skillshield-ai-4
vercel --prod
```

**SkillShield Training :**
```bash
cd skillshield-training
vercel --prod
```

### Déploiement automatique

Les deux projets se déploieront automatiquement via Git :
- Push sur `main` → Déploiement en production
- Pull Request → Déploiement en preview

## Vérification

Après déploiement, vérifiez :

1. **SkillShield AI** : https://skillshield.app
2. **SkillShield Training** : https://skillshield.app/training

## Notes importantes

- Le projet `skillshield-training` utilise `basePath: "/training"` dans `next.config.ts`
- Les routes API de Training sont accessibles via `/training/api/*`
- Les assets statiques de Training sont servis depuis `/training/_next/static/*`
- Assurez-vous que les deux projets sont correctement configurés dans Vercel
