# Comment vider le cache Vercel pour éliminer Supabase

## 🎯 Étapes à suivre

### 1. Purger le Data Cache ✅

1. Allez sur [Vercel Dashboard](https://vercel.com/dashboard)
2. Ouvrez votre projet **skillshield-ai**
3. Allez dans **Settings** → **Data Cache**
4. Cliquez sur **Purge Cache** → **Delete the entire contents of the Data Cache**
5. Confirmez la suppression

### 2. Purger le CDN Cache (optionnel mais recommandé)

1. Dans le même écran **Settings**
2. Allez dans **CDN Cache**
3. Cliquez sur **Purge Cache** → **Invalidate or delete contents of the CDN Cache**
4. Confirmez la suppression

### 3. Redéployer avec cache vidé

Après avoir purgé les caches :

1. Allez dans l'onglet **Deployments**
2. Cliquez sur les **3 points (⋯)** du dernier déploiement
3. Sélectionnez **Redeploy**
4. **IMPORTANT** : Cochez l'option **"Use existing Build Cache"** → **DÉCOCHEZ-LA** (si disponible)
5. Cliquez sur **Redeploy**

### 4. Alternative : Nouveau déploiement via Git

Si l'option ci-dessus n'est pas disponible, faites un nouveau commit :

```bash
git commit --allow-empty -m "chore: Force rebuild after cache purge"
git push origin main
```

## ⚠️ Important

Le problème vient du fait que Vercel a mis en cache l'ancienne version avec Supabase dans `node_modules`. 

**Le code utilise maintenant Vercel KV, pas Supabase !**

- ✅ Les variables Supabase ne sont **plus nécessaires**
- ✅ Le code n'importe **plus** Supabase
- ✅ Le système utilise **Vercel KV** (ou cache fichier en fallback)

## 🔍 Vérification après purge

Après avoir purgé les caches et redéployé :

1. Vérifiez les logs de build dans Vercel
2. Vous ne devriez **plus** voir d'erreur `@supabase/supabase-js`
3. Testez l'envoi d'un PDF

## 💡 Si le problème persiste

Si après avoir purgé les caches, l'erreur persiste encore :

1. Contactez le support Vercel pour vider le cache de build
2. Ou créez un nouveau projet Vercel et redéployez (solution de dernier recours)

