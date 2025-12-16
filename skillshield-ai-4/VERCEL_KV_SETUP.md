# Configuration de Vercel KV pour le Rate Limiting

## ⚠️ Important
Le rate limiting des emails nécessite Vercel KV pour fonctionner correctement. Sans cette configuration, le système utilisera un cache fichier qui ne persiste pas entre les requêtes serverless.

## 📋 Étapes de configuration

### 1. Créer une base Vercel KV

1. Allez sur [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Ouvrez votre projet **skillshield-ai** (dans la team **OptimalSell**)
3. Allez dans l'onglet **Storage** (menu de gauche)
4. Cliquez sur **Create Database**
5. Sélectionnez **KV** (Key-Value)
6. Choisissez un nom (ex: `skillshield-kv`)
7. Sélectionnez la région la plus proche (ex: `fra1` pour l'Europe)
8. Cliquez sur **Create**

### 2. Lier la base KV au projet

1. Une fois la base créée, cliquez dessus
2. Allez dans l'onglet **Settings**
3. Dans la section **Environment Variables**, vous verrez les variables nécessaires
4. Les variables suivantes seront automatiquement ajoutées à votre projet :
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
   - `KV_REST_API_READ_ONLY_TOKEN`

### 3. Vérifier la configuration

1. Allez dans **Settings** → **Environment Variables** de votre projet
2. Vérifiez que les variables `KV_REST_API_URL` et `KV_REST_API_TOKEN` sont présentes
3. Assurez-vous qu'elles sont disponibles pour **Production**, **Preview**, et **Development**

### 4. Redéployer

1. Allez dans l'onglet **Deployments**
2. Cliquez sur les **3 points (⋯)** du dernier déploiement
3. Sélectionnez **Redeploy**
4. Ou faites un nouveau commit et push

## ✅ Vérification

Après avoir configuré et redéployé :

1. Testez l'envoi d'un PDF avec une adresse email
2. Réessayez immédiatement avec la même adresse
3. Vous devriez voir un message d'erreur : "Un PDF a déjà été envoyé à cette adresse. Vous pourrez renvoyer dans X heures."

## 🔍 Logs de diagnostic

Si le rate limiting ne fonctionne pas, vérifiez les logs Vercel. Vous devriez voir :
- `✅ Vercel KV is available` - Si Vercel KV est configuré
- `📦 Found record in Vercel KV for email@example.com` - Si un enregistrement existe
- `💾 Saved record to Vercel KV for email@example.com` - Si l'enregistrement est sauvegardé

## 💰 Coûts

Vercel KV propose un plan gratuit avec :
- 256 MB de stockage
- 30 000 requêtes par jour
- Suffisant pour la plupart des cas d'usage

Pour plus d'informations : [https://vercel.com/docs/storage/vercel-kv](https://vercel.com/docs/storage/vercel-kv)



