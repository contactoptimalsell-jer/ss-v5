-- Script SQL pour créer la table quiz_tokens dans Supabase
-- À exécuter dans Supabase Dashboard → SQL Editor

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

-- Note: Le code utilise SERVICE_ROLE_KEY donc les politiques RLS ne sont pas strictement nécessaires
-- mais c'est une bonne pratique pour la sécurité
-- Si vous voulez activer RLS strictement, créez une politique :
-- CREATE POLICY "Service role can manage quiz tokens"
-- ON quiz_tokens
-- FOR ALL
-- USING (true)
-- WITH CHECK (true);

