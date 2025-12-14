# 🔧 Fix : Root Directory non configuré - Build vide

## ❌ Problème actuel

Le build Vercel se termine en 32ms sans rien produire :
```
Build Completed in /vercel/output [32ms]
Skipping cache upload because no files were prepared
```

**Cause** : Vercel cherche les fichiers à la racine du repo `ss-v5/` mais le projet est dans `ss-v5/skillshield-ai-4/`.

## ✅ Solution : Configurer le Root Directory

### Méthode 1 : Via le Dashboard Vercel (Recommandé)

1. **Accéder au projet** :
   - Allez sur https://vercel.com/dashboard
   - Ouvrez le projet **skillshield-ai** (team **OptimalSell**)

2. **Configurer le Root Directory** :
   - Cliquez sur **Settings** (en haut)
   - Allez dans l'onglet **General** (menu de gauche)
   - Scroll jusqu'à **Root Directory**
   - Cliquez sur **Edit**
   - Entrez : `skillshield-ai-4`
   - Cliquez sur **Save**

3. **Redéployer** :
   - Allez dans l'onglet **Deployments**
   - Cliquez sur les **3 points (⋯)** du dernier déploiement
   - Sélectionnez **Redeploy**

### Méthode 2 : Via la CLI (si vous avez les permissions)

```bash
# Depuis le dossier du projet
cd skillshield-ai-4
vercel --prod
```

Puis dans le Dashboard, configurez le Root Directory comme décrit ci-dessus.

## 🔍 Vérification

Après avoir configuré le Root Directory, le build devrait :
- Installer les dépendances (`npm install`)
- Builder le projet (`npm run build`)
- Prendre plus de temps (plusieurs secondes/minutes)
- Produire des fichiers dans `dist/`

## 📋 Structure attendue

```
ss-v5/                          (Racine du repo Git)
└── skillshield-ai-4/           (Root Directory Vercel)
    ├── api/
    │   └── generate-audit.ts
    ├── components/
    ├── dist/                   (Output après build)
    ├── package.json
    ├── vercel.json
    └── ...
```

## ⚠️ Important

Le Root Directory doit être configuré dans le Dashboard Vercel. Le fichier `vercel.json` ne peut pas définir le Root Directory - c'est une configuration au niveau du projet.


