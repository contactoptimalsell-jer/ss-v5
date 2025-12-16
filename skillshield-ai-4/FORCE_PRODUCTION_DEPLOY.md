# 🚀 Forcer le déploiement en production sur Vercel

## ✅ Commit créé
Un nouveau commit a été créé pour forcer le redéploiement : `FORCE REDEPLOY - Production ready avec Prospection /77230 et conditions générales`

## 📋 Étapes pour promouvoir en production

### Option 1 : Via le Dashboard Vercel (RECOMMANDÉ)

1. **Allez sur [Vercel Dashboard](https://vercel.com/dashboard)**
2. **Ouvrez votre projet** `skillshield-ai`
3. **Allez dans l'onglet "Deployments"**
4. **Attendez 1-2 minutes** que le nouveau déploiement apparaisse (avec le commit récent)
5. **Trouvez le nouveau déploiement** (le plus récent en haut de la liste)
6. **Cliquez sur les 3 points (⋯)** à droite
7. **Sélectionnez "Promote to Production"**
8. **Confirmez la promotion**

### Option 2 : Redeploy le déploiement actuel

Si le nouveau déploiement n'apparaît pas :

1. **Dans "Deployments"**, trouvez le déploiement actuel en production
2. **Cliquez sur les 3 points (⋯)**
3. **Sélectionnez "Redeploy"**
4. **Décochez "Use existing Build Cache"** (IMPORTANT)
5. **Cliquez sur "Redeploy"**
6. **Attendez que le déploiement soit terminé**
7. **Il sera automatiquement promu en production** (car c'est le déploiement actuel)

### Option 3 : Via la CLI Vercel (si installée)

```bash
# Installer Vercel CLI si pas déjà fait
npm i -g vercel

# Se connecter
vercel login

# Aller dans le dossier du projet
cd skillshield-ai-4

# Déployer en production
vercel --prod
```

## 🔍 Vérification après déploiement

Une fois le déploiement promu en production, vérifiez :

1. **https://skillshield.app** → Plus de bouton "Prospection" dans le menu
2. **Scroll en bas** → Conditions générales visibles
3. **https://skillshield.app/77230** → Page de prospection accessible

## ⚠️ Si ça ne fonctionne pas

1. Vérifiez que le commit est bien sur GitHub
2. Vérifiez que Vercel est bien connecté à votre repo GitHub
3. Vérifiez les webhooks GitHub → Vercel dans les settings du projet
4. Contactez le support Vercel si nécessaire

