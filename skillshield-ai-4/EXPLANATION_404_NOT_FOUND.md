# 🔍 Explication complète : Erreur 404 NOT_FOUND sur Vercel

## 1. ✅ Le Fix Appliqué

**Problème identifié** : Le rewrite catch-all `/(.*)` dans `vercel.json` interceptait toutes les requêtes, y compris les routes API, avant que Vercel ne puisse les servir.

**Solution** : Exclure les routes API du rewrite SPA en utilisant une regex négative :
```json
{
  "rewrites": [
    {
      "source": "/((?!api/).*)",
      "destination": "/index.html"
    }
  ]
}
```

Cette regex `((?!api/).*)` signifie : "match tout sauf ce qui commence par `api/`".

---

## 2. 🔬 Explication de la Cause Racine

### Ce que le code faisait vs. ce qu'il devait faire

**Ce que le code faisait** :
```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/api/:path*"  // ❌ Redirection circulaire inutile
    },
    {
      "source": "/(.*)",  // ❌ Capture TOUT, y compris /api/generate-audit
      "destination": "/index.html"
    }
  ]
}
```

**Ce qui se passait** :
1. Une requête arrive : `POST /api/generate-audit`
2. Vercel cherche une API route dans `api/generate-audit.ts` ✅
3. **MAIS** le rewrite `/(.*)` capture la requête AVANT qu'elle n'atteigne l'API route
4. La requête est redirigée vers `/index.html` ❌
5. Résultat : 404 NOT_FOUND car `/index.html` ne peut pas gérer une requête POST API

**Ce que le code devait faire** :
- Laisser Vercel servir automatiquement les API routes dans `api/`
- Ne rediriger vers `/index.html` QUE les routes qui ne sont pas des API routes

### Conditions qui ont déclenché l'erreur

1. **Projet SPA (Single Page Application)** : Besoin de rediriger toutes les routes vers `index.html` pour le routing côté client
2. **API routes dans le même projet** : Les routes API doivent être exclues du rewrite SPA
3. **Ordre de traitement Vercel** : Les rewrites sont appliqués, mais Vercel devrait normalement servir les API routes en premier

### L'erreur conceptuelle

**L'idée fausse** : "Les rewrites dans `vercel.json` sont appliqués APRÈS que Vercel ait cherché les API routes"

**La réalité** : Dans certains cas, les rewrites catch-all peuvent intercepter les requêtes avant que Vercel ne serve les API routes, surtout si le pattern est trop large.

---

## 3. 📚 Enseignement du Concept

### Pourquoi cette erreur existe et ce qu'elle protège

**Pourquoi l'erreur existe** :
- Vercel doit gérer deux types de routes : les API routes (serverless functions) et les routes statiques/SPA
- Les rewrites permettent de mapper des URLs vers des destinations
- Un rewrite trop large peut intercepter des routes qui devraient être gérées différemment

**Ce que ça protège** :
- Empêche les conflits entre routing SPA et API routes
- Force à être explicite sur quelles routes doivent aller où
- Évite les redirections accidentelles de routes API vers du HTML

### Le modèle mental correct

**Architecture Vercel** :
```
Requête HTTP
    ↓
1. Vercel cherche une API route dans api/
    ↓ (si trouvée)
   → Exécute la serverless function
    ↓ (si non trouvée)
2. Vercel cherche un fichier statique
    ↓ (si trouvé)
   → Sert le fichier
    ↓ (si non trouvé)
3. Vercel applique les rewrites
    ↓
   → Redirige selon les règles
```

**Le problème** : Si un rewrite catch-all est trop agressif, il peut intercepter les requêtes avant l'étape 1.

**La solution** : Exclure explicitement les routes API du rewrite catch-all.

### Comment ça s'intègre dans le framework

**Vercel Serverless Functions** :
- Les fichiers dans `api/` sont automatiquement détectés comme des serverless functions
- Ils sont compilés et déployés séparément du frontend
- Ils ont leur propre runtime Node.js

**Vercel Routing** :
- Les rewrites sont des règles de redirection au niveau du CDN
- Ils sont appliqués après la recherche de fichiers statiques et API routes
- Mais un pattern trop large peut créer des conflits

**SPA Routing** :
- Les SPAs (React, Vue, etc.) utilisent le routing côté client
- Toutes les routes doivent servir `index.html` pour que le router côté client prenne le relais
- **SAUF** les routes API qui doivent être servies par le backend

---

## 4. 🚨 Signes d'Alerte à Reconnaître

### Patterns à surveiller

1. **Rewrite catch-all trop large** :
   ```json
   {
     "source": "/(.*)",  // ⚠️ Capture tout, y compris les API routes
     "destination": "/index.html"
   }
   ```

2. **Rewrite API inutile** :
   ```json
   {
     "source": "/api/:path*",
     "destination": "/api/:path*"  // ⚠️ Redirection circulaire
   }
   ```

3. **Ordre des rewrites** :
   ```json
   {
     "rewrites": [
       { "source": "/(.*)", "destination": "/index.html" },  // ⚠️ Trop tôt
       { "source": "/api/:path*", "destination": "/api/:path*" }  // Jamais atteint
     ]
   }
   ```

### Code smells

- ✅ **Bon** : Rewrite qui exclut explicitement les API routes
  ```json
  { "source": "/((?!api/).*)", "destination": "/index.html" }
  ```

- ⚠️ **Attention** : Rewrite catch-all sans exclusion
  ```json
  { "source": "/(.*)", "destination": "/index.html" }
  ```

- ❌ **Mauvais** : Rewrite API redondant
  ```json
  { "source": "/api/:path*", "destination": "/api/:path*" }
  ```

### Scénarios similaires

1. **Routes d'assets statiques** : Si vous avez des fichiers dans `public/`, ils ne doivent pas être interceptés par le rewrite SPA
2. **Routes Next.js** : Si vous migrez vers Next.js, les API routes sont dans `pages/api/` ou `app/api/`
3. **Routes middleware** : Les middlewares Vercel peuvent aussi intercepter les requêtes

---

## 5. 🔄 Alternatives et Trade-offs

### Solution 1 : Regex négative (✅ Appliquée)
```json
{
  "rewrites": [
    {
      "source": "/((?!api/).*)",
      "destination": "/index.html"
    }
  ]
}
```

**Avantages** :
- Simple et explicite
- Exclut clairement les routes API
- Fonctionne pour toutes les routes API

**Inconvénients** :
- Regex peut être complexe pour des patterns plus sophistiqués
- Doit être mise à jour si vous ajoutez d'autres types de routes à exclure

### Solution 2 : Liste explicite des routes à exclure
```json
{
  "rewrites": [
    {
      "source": "/(?!api|_next|static).*",
      "destination": "/index.html"
    }
  ]
}
```

**Avantages** :
- Plus flexible pour exclure plusieurs patterns
- Plus lisible pour des exclusions multiples

**Inconvénients** :
- Doit être maintenu si vous ajoutez de nouveaux patterns

### Solution 3 : Pas de rewrite, gestion côté client
Ne pas utiliser de rewrite catch-all et gérer le 404 côté client.

**Avantages** :
- Pas de conflit avec les API routes
- Contrôle total côté client

**Inconvénients** :
- Les URLs directes (bookmarks, liens) ne fonctionnent pas
- SEO moins bon

### Solution 4 : Utiliser Next.js
Next.js gère automatiquement le routing SPA et les API routes.

**Avantages** :
- Pas de configuration manuelle
- Routing intégré
- Meilleur pour le SEO

**Inconvénients** :
- Migration nécessaire
- Plus de complexité si vous n'avez pas besoin de Next.js

---

## 📝 Checklist pour Éviter ce Problème

- [ ] Vérifier que les rewrites n'interceptent pas les routes API
- [ ] Tester les routes API après avoir ajouté des rewrites
- [ ] Utiliser des patterns explicites plutôt que des catch-all
- [ ] Documenter quelles routes sont exclues et pourquoi
- [ ] Tester avec des requêtes POST/GET vers les API routes
- [ ] Vérifier les logs Vercel si une route API ne fonctionne pas

---

## 🎯 Résumé

**Le problème** : Un rewrite catch-all interceptait les routes API avant qu'elles ne soient servies.

**La solution** : Exclure explicitement les routes API du rewrite SPA avec une regex négative.

**Leçon** : Toujours être explicite sur ce qui doit être exclu d'un pattern catch-all, surtout dans un projet qui mélange SPA routing et API routes.

