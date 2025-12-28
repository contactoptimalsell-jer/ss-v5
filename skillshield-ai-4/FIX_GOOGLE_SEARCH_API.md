# 🔧 Correction de l'erreur Google Custom Search API

## ❌ Problème

Erreur `403 - API_KEY_SERVICE_BLOCKED` : L'API Custom Search est bloquée pour votre clé API.

## ✅ Solution : Activer l'API Custom Search

### Étape 1 : Activer l'API dans Google Cloud Console

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Sélectionnez votre projet (celui associé à votre clé API)
3. Allez dans **APIs & Services** → **Library** (ou **Bibliothèque**)
4. Recherchez **"Custom Search API"**
5. Cliquez sur **"Custom Search API"**
6. Cliquez sur **"Enable"** (ou **"Activer"**)
7. Attendez quelques secondes que l'activation soit confirmée

### Étape 2 : Vérifier les restrictions de la clé API

1. Allez dans **APIs & Services** → **Credentials**
2. Cliquez sur votre clé API (`AIzaSyDWChFy-TmKgOdON6ZOtTWjGId4S6aExnY`)
3. Vérifiez la section **"API restrictions"** :
   - Si **"Don't restrict key"** est sélectionné → C'est bon ✅
   - Si **"Restrict key"** est sélectionné → Vérifiez que **"Custom Search API"** est dans la liste
4. Si nécessaire, ajoutez **"Custom Search API"** à la liste
5. Cliquez sur **"Save"**

### Étape 3 : Vérifier le quota

1. Allez dans **APIs & Services** → **Dashboard**
2. Vérifiez que **Custom Search API** apparaît dans la liste
3. Cliquez dessus pour voir le quota (100 requêtes gratuites/jour)

### Étape 4 : Redéployer

Après avoir activé l'API, attendez 1-2 minutes puis testez à nouveau sur https://skillshield.app/12000

## 🔄 Alternative : Utiliser une autre méthode de recherche

Si vous ne pouvez pas activer l'API Google Custom Search, nous pouvons implémenter une alternative utilisant :
- ScraperAPI avec recherche web
- SerpAPI (alternative à Google Search)
- Bing Search API
- Ou une recherche directe via scraping

## 📝 Vérification rapide

Pour vérifier que l'API est activée, testez cette URL dans votre navigateur (remplacez YOUR_API_KEY et YOUR_CX) :

```
https://www.googleapis.com/customsearch/v1?key=YOUR_API_KEY&cx=YOUR_CX&q=test
```

Si vous voyez une réponse JSON (même avec une erreur de quota), l'API est activée.
Si vous voyez toujours `403 - API_KEY_SERVICE_BLOCKED`, l'API n'est pas activée.

