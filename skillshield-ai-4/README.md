# SkillShield AI

Agence française d'implémentation d'intelligence artificielle pour entreprises.

## ⚠️ IMPORTANT : Configuration Vercel

**NE PAS utiliser les Intégrations Vercel pour ce projet.**

Voir [VERCEL_INTEGRATIONS_WARNING.md](../VERCEL_INTEGRATIONS_WARNING.md) pour plus de détails.

Ce projet utilise **UNIQUEMENT des variables d'environnement** :
- Supabase : via `STORAGE_SS_SUPABASE_URL` et `STORAGE_SS_SUPABASE_SERVICE_ROLE_KEY`
- Gemini API : via `GEMINI_API_KEY`
- Email SMTP : via `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`

## 🚀 Installation

```bash
npm install
```

## 🛠️ Développement

```bash
npm run dev
```

## 📦 Build

```bash
npm run build
```

## 🌐 Déploiement

Le projet est configuré pour se déployer automatiquement sur Vercel lors des pushes sur `main`.

**Configuration Vercel requise** :
- **Root Directory** : `skillshield-ai-4`
- **Build Command** : `npm run build`
- **Output Directory** : `dist`

## 📝 Variables d'environnement

Configurez les variables d'environnement dans Vercel Dashboard :
- **Settings** → **Environment Variables** (pas Integrations)
- Ajoutez les variables nécessaires
- Cochez Production, Preview, Development

## 🚫 Erreur "Provisioning integrations failed"

Si vous voyez cette erreur :
1. Allez dans **Settings** → **Integrations**
2. **Supprimez TOUTES les intégrations**
3. Redéployez

Les intégrations Vercel ne sont PAS nécessaires pour ce projet.
