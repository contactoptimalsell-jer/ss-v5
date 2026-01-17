# ⚠️ IMPORTANT : Ne PAS utiliser les Intégrations Vercel

## 🚫 Consigne stricte

**NE PAS configurer d'intégrations Vercel pour ce projet.**

Les intégrations Vercel (Supabase, GitHub, etc.) causent l'erreur **"Provisioning integrations failed"** et bloquent les déploiements.

## ✅ Solution correcte : Variables d'environnement uniquement

Ce projet utilise **UNIQUEMENT des variables d'environnement** pour se connecter aux services externes :

- **Supabase** : via `STORAGE_SS_SUPABASE_URL` et `STORAGE_SS_SUPABASE_SERVICE_ROLE_KEY`
- **Gemini API** : via `GEMINI_API_KEY` ou `DefaultGeminiAPIKey`
- **Email SMTP** : via `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`

## 📋 Configuration correcte dans Vercel

1. **Settings** → **Environment Variables** (pas Integrations)
2. Ajoutez les variables d'environnement nécessaires
3. Cochez Production, Preview, Development
4. **Ne créez PAS d'intégrations Vercel**

## 🔧 Si vous voyez l'erreur "Provisioning integrations failed"

1. Allez dans **Settings** → **Integrations**
2. **Supprimez TOUTES les intégrations** listées
3. Redéployez le projet

## ✅ Vérification

Le déploiement devrait réussir **sans aucune intégration Vercel configurée**.

---

**Rappel** : Les intégrations Vercel sont optionnelles et ne sont que des helpers. Ce projet n'en a PAS besoin.
