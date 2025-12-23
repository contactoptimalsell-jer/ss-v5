# Configuration Supabase pour les tokens de quiz

## 📋 Création de la table `quiz_tokens`

Pour que le stockage des tokens fonctionne avec Supabase, vous devez créer la table dans votre base de données Supabase.

### Option 1 : Via Supabase Dashboard (Recommandé)

1. Allez sur https://supabase.com/dashboard
2. Ouvrez votre projet (omqdcaatnhxrlllqqgeo)
3. Allez dans **SQL Editor** (menu de gauche)
4. Exécutez cette requête SQL :

```sql
-- Créer la table quiz_tokens
CREATE TABLE IF NOT EXISTS quiz_tokens (
  token TEXT PRIMARY KEY,
  prospect_name TEXT NOT NULL,
  prospect_email TEXT NOT NULL,
  prospect_problem TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  opened BOOLEAN DEFAULT FALSE,
  opened_at TIMESTAMPTZ,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ
);

-- Créer un index sur created_at pour les requêtes d'expiration
CREATE INDEX IF NOT EXISTS idx_quiz_tokens_created_at ON quiz_tokens(created_at);

-- Activer Row Level Security (RLS) - Optionnel mais recommandé
ALTER TABLE quiz_tokens ENABLE ROW LEVEL SECURITY;

-- Créer une politique pour permettre l'accès via service role key
-- (Le code utilise SERVICE_ROLE_KEY donc cette politique n'est pas strictement nécessaire,
-- mais c'est une bonne pratique pour la sécurité)
CREATE POLICY "Service role can manage quiz tokens"
ON quiz_tokens
FOR ALL
USING (true)
WITH CHECK (true);
```

### Option 2 : Via Supabase CLI

```bash
# Créer un fichier migration
supabase migration new create_quiz_tokens_table

# Ajouter le SQL dans le fichier de migration
# Puis appliquer la migration
supabase db push
```

## ✅ Vérification

Après avoir créé la table :

1. Allez dans **Table Editor** dans Supabase Dashboard
2. Vous devriez voir la table `quiz_tokens`
3. Testez l'envoi d'un quiz
4. Vérifiez que les tokens apparaissent dans la table

## 🔒 Sécurité

- La table utilise la `SERVICE_ROLE_KEY` pour les opérations serveur
- Les tokens expirent automatiquement après 7 jours
- RLS est activé pour une sécurité supplémentaire

## 📊 Structure de la table

| Colonne | Type | Description |
|---------|------|-------------|
| `token` | TEXT (PK) | Token unique du quiz |
| `prospect_name` | TEXT | Nom du prospect |
| `prospect_email` | TEXT | Email du prospect |
| `prospect_problem` | TEXT | Problème du prospect |
| `created_at` | TIMESTAMPTZ | Date de création |
| `opened` | BOOLEAN | Si le quiz a été ouvert |
| `opened_at` | TIMESTAMPTZ | Date d'ouverture |
| `completed` | BOOLEAN | Si le quiz a été complété |
| `completed_at` | TIMESTAMPTZ | Date de complétion |

