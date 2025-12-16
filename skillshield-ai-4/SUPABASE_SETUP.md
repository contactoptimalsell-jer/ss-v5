# Configuration de Supabase pour le Rate Limiting

## 📋 Étapes de configuration

### 1. Créer la table dans Supabase

1. Allez sur [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Ouvrez votre projet
3. Allez dans **SQL Editor** (menu de gauche)
4. Exécutez cette requête SQL :

```sql
-- Créer la table pour le rate limiting
CREATE TABLE IF NOT EXISTS email_rate_limits (
  email TEXT PRIMARY KEY,
  last_sent_at BIGINT NOT NULL,
  count INTEGER NOT NULL DEFAULT 1,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Créer un index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_email_rate_limits_email ON email_rate_limits(email);

-- Optionnel : Créer une fonction pour nettoyer automatiquement les anciens enregistrements (> 7 jours)
CREATE OR REPLACE FUNCTION cleanup_old_email_rate_limits()
RETURNS void AS $$
BEGIN
  DELETE FROM email_rate_limits
  WHERE last_sent_at < EXTRACT(EPOCH FROM NOW() - INTERVAL '7 days') * 1000;
END;
$$ LANGUAGE plpgsql;
```

### 2. Configurer les variables d'environnement dans Vercel

1. Allez sur [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Ouvrez votre projet **skillshield-ai**
3. Allez dans **Settings** → **Environment Variables**
4. Ajoutez les variables suivantes :

   - **Name**: `SUPABASE_URL`
     - **Value**: Votre URL Supabase (ex: `https://xxxxx.supabase.co`)
     - **Environments**: Production, Preview, Development

   - **Name**: `SUPABASE_ANON_KEY`
     - **Value**: Votre clé anonyme Supabase (trouvable dans Settings → API)
     - **Environments**: Production, Preview, Development

   - **Name**: `SUPABASE_SERVICE_ROLE_KEY` (optionnel, pour plus de permissions)
     - **Value**: Votre clé service role Supabase (trouvable dans Settings → API)
     - **Environments**: Production, Preview, Development

### 3. Configurer les politiques RLS (Row Level Security)

1. Dans Supabase, allez dans **Authentication** → **Policies**
2. Pour la table `email_rate_limits`, créez une politique :

```sql
-- Permettre les lectures et écritures pour les requêtes authentifiées
-- Ou désactiver RLS si vous utilisez service_role_key
ALTER TABLE email_rate_limits DISABLE ROW LEVEL SECURITY;
```

**Note**: Si vous utilisez `SUPABASE_SERVICE_ROLE_KEY`, vous pouvez désactiver RLS car cette clé bypass les politiques.

### 4. Redéployer

1. Allez dans l'onglet **Deployments** de Vercel
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
- `📦 Found record in Supabase for email@example.com` - Si un enregistrement existe
- `💾 Saved record to Supabase for email@example.com` - Si l'enregistrement est sauvegardé
- `⚠️ Supabase not available` - Si Supabase n'est pas configuré

## 💰 Coûts

Supabase propose un plan gratuit avec :
- 500 MB de base de données
- 2 GB de bande passante
- Suffisant pour la plupart des cas d'usage

Pour plus d'informations : [https://supabase.com/docs](https://supabase.com/docs)

