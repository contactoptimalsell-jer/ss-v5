# 📋 Script SQL à copier-coller dans Supabase

## Instructions

1. Allez sur https://supabase.com/dashboard
2. Ouvrez votre projet (omqdcaatnhxrlllqqgeo)
3. Cliquez sur **SQL Editor** dans le menu de gauche
4. Cliquez sur **New query**
5. **Copiez-collez le script ci-dessous** dans l'éditeur
6. Cliquez sur **Run** (ou appuyez sur Cmd/Ctrl + Enter)

---

## Script SQL à copier :

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

-- Créer un index sur prospect_email pour les recherches
CREATE INDEX IF NOT EXISTS idx_quiz_tokens_prospect_email ON quiz_tokens(prospect_email);

-- Activer Row Level Security (RLS)
ALTER TABLE quiz_tokens ENABLE ROW LEVEL SECURITY;
```

---

## ✅ Vérification après exécution

1. Allez dans **Table Editor** (menu de gauche)
2. Vous devriez voir la table `quiz_tokens` dans la liste
3. Cliquez dessus pour voir sa structure

## 🎯 C'est tout !

Une fois la table créée, les tokens de quiz seront automatiquement sauvegardés dans Supabase et persisteront entre les déploiements.

