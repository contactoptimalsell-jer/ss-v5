# 🔐 Authentification Supabase - Guide Complet

## 📌 Il y a 3 choses différentes à comprendre :

### 1. 🖥️ Accéder au Dashboard Supabase (pour vous, développeur)

**Question :** Avec quelle adresse email je me connecte au dashboard Supabase ?

**Réponse :** 
- L'**adresse email avec laquelle vous avez créé votre compte Supabase**
- C'est l'email que vous avez utilisé lors de la création du projet sur [supabase.com](https://supabase.com)
- Vous vous connectez sur [https://supabase.com/dashboard](https://supabase.com/dashboard)

**Exemple :**
- Si vous avez créé le projet avec `jerome@example.com`
- → Vous vous connectez avec `jerome@example.com`

---

### 2. 🔑 Connexion de l'application à Supabase (automatique)

**Question :** L'application a-t-elle besoin d'un email pour se connecter ?

**Réponse :** ❌ **NON !** Pas besoin d'email !

**Comment ça fonctionne :**
- L'application utilise les **clés API** (pas d'email)
- Les clés sont déjà configurées dans Vercel :
  - `SUPABASE_URL`
  - `SUPABASE_ANON_KEY`
- Le code fait des requêtes REST avec ces clés (voir `emailRateLimit.ts`)

**C'est automatique :**
```typescript
// Le code utilise les clés API, pas d'email
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
// → Fait des requêtes REST automatiquement
```

---

### 3. 📧 Les emails dans la table `email_rate_limits`

**Question :** À quoi servent les emails dans la base de données ?

**Réponse :** 
- Ce sont les **emails des utilisateurs** qui reçoivent les PDFs
- **PAS** pour l'authentification
- Utilisés pour le **rate limiting** (limiter les envois)

**Exemple :**
```
Table: email_rate_limits
┌─────────────────────┬──────────────┬───────┐
│ email               │ last_sent_at │ count │
├─────────────────────┼──────────────┼───────┤
│ client@example.com  │ 1702734000   │ 1     │
│ prospect@test.fr    │ 1702735000   │ 1     │
└─────────────────────┴──────────────┴───────┘
```

Ces emails sont ceux des **clients/prospects** qui demandent un PDF, pas pour se connecter à Supabase !

---

## ✅ Résumé

| Contexte | Email nécessaire ? | Quel email ? |
|----------|-------------------|--------------|
| **Dashboard Supabase** (vous) | ✅ Oui | Email avec lequel vous avez créé le compte |
| **Application → Supabase** (code) | ❌ Non | Utilise les clés API (`SUPABASE_ANON_KEY`) |
| **Table `email_rate_limits`** | 📧 Stockage | Emails des clients qui reçoivent les PDFs |

---

## 🎯 Ce que vous devez faire

### ✅ Déjà fait (normalement) :
1. Vous avez un compte Supabase (avec votre email)
2. Vous avez créé un projet Supabase
3. Vous avez ajouté les variables dans Vercel :
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`

### 🔍 Si vous ne vous souvenez plus de votre email Supabase :

1. Allez sur [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Cliquez sur "Forgot password" si besoin
3. Ou vérifiez vos emails pour trouver l'inscription Supabase

### 🚨 Si vous n'avez pas de compte Supabase :

1. Allez sur [https://supabase.com](https://supabase.com)
2. Cliquez sur "Start your project"
3. Créez un compte (avec n'importe quel email)
4. Créez un nouveau projet
5. Récupérez `SUPABASE_URL` et `SUPABASE_ANON_KEY` dans Settings → API
6. Ajoutez-les dans Vercel

---

## 💡 Important

**L'application n'a PAS besoin de votre email pour fonctionner !**

Elle utilise uniquement :
- ✅ `SUPABASE_URL` (déjà dans Vercel)
- ✅ `SUPABASE_ANON_KEY` (déjà dans Vercel)

Ces deux variables suffisent pour que l'application se connecte à Supabase automatiquement ! 🎉

