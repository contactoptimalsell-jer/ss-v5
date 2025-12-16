# Comment faire un rollback sur Vercel

## 🎯 Méthode 1 : Via le Dashboard Vercel (RECOMMANDÉ)

### Étapes :

1. **Allez sur [Vercel Dashboard](https://vercel.com/dashboard)**
2. **Ouvrez votre projet** `skillshield-ai`
3. **Allez dans l'onglet "Deployments"**
4. **Trouvez la version qui fonctionnait** (celle qui est actuellement en production)
5. **Cliquez sur les 3 points (⋯)** à droite du déploiement
6. **Sélectionnez "Promote to Production"** (ou "Redeploy" si c'est déjà en production)

## 🔍 Comment identifier la bonne version ?

### Option A : Par date/heure
- Regardez les déploiements et trouvez celui qui fonctionnait ce matin (avant les modifications)
- Les déploiements sont triés par date, le plus récent en haut

### Option B : Par commit
- Cliquez sur un déploiement pour voir le commit associé
- Cherchez un commit d'avant les modifications d'aujourd'hui
- Par exemple, un commit d'hier ou de ce matin très tôt

### Option C : Par statut
- Les déploiements avec un ✅ vert sont ceux qui ont réussi
- Évitez les déploiements avec ❌ rouge

## 🚀 Méthode 2 : Via Git (si vous connaissez le commit)

Si vous savez quel commit fonctionnait :

```bash
# Trouver le commit qui fonctionnait
git log --oneline --since="2025-12-15" | head -20

# Créer un nouveau commit qui revient à cette version
git revert <commit-hash>
# ou
git reset --hard <commit-hash>
git push --force origin main
```

⚠️ **Attention** : `git reset --hard` et `git push --force` sont destructifs. Utilisez avec précaution.

## 📋 Méthode 3 : Promouvoir un déploiement spécifique

1. Dans **Deployments**, trouvez le déploiement qui fonctionnait
2. Cliquez dessus pour voir les détails
3. Cliquez sur **"Promote to Production"** (bouton en haut à droite)
4. Confirmez la promotion

## ✅ Vérification après rollback

Après avoir promu une ancienne version :

1. **Attendez 1-2 minutes** pour que le déploiement se propage
2. **Testez votre site** : https://skillshield.app
3. **Vérifiez les logs Vercel** pour confirmer qu'il n'y a plus d'erreur
4. **Testez l'envoi de PDF** pour confirmer que tout fonctionne

## 🔄 Si vous voulez revenir à la version actuelle plus tard

Une fois que vous avez identifié le problème et que vous voulez revenir à la version actuelle :

1. Allez dans **Deployments**
2. Trouvez le déploiement le plus récent (celui avec les modifications)
3. Cliquez sur **"Promote to Production"**

## 💡 Astuce

Pour éviter ce problème à l'avenir :
- Testez toujours sur une preview avant de promouvoir en production
- Utilisez les "Deployment Protection Rules" dans Vercel
- Créez des branches pour tester les modifications importantes


