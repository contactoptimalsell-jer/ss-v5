# 🚀 Déploiement sur Vercel

Guide complet pour déployer SkillShield AI sur Vercel.

## 📋 Prérequis

- Un compte GitHub (gratuit)
- Un compte Vercel (gratuit) - [vercel.com](https://vercel.com)

## 🎯 Méthode 1 : Déploiement via GitHub (Recommandé)

### Étape 1 : Créer un dépôt GitHub

1. Allez sur [github.com](https://github.com) et créez un nouveau dépôt
2. Nommez-le `skillshield-ai` (ou autre nom)
3. **Ne cochez PAS** "Initialize with README" (le projet existe déjà)

### Étape 2 : Pousser votre code sur GitHub

Dans votre terminal, depuis le dossier du projet :

```bash
# Initialiser Git (si pas déjà fait)
git init

# Ajouter tous les fichiers
git add .

# Créer le premier commit
git commit -m "Initial commit - SkillShield AI Landing Page"

# Ajouter votre dépôt GitHub (remplacez USERNAME par votre nom d'utilisateur)
git remote add origin https://github.com/USERNAME/skillshield-ai.git

# Pousser le code
git branch -M main
git push -u origin main
```

### Étape 3 : Déployer sur Vercel

1. Allez sur [vercel.com](https://vercel.com)
2. Cliquez sur **"Add New..."** → **"Project"**
3. Importez votre dépôt GitHub `skillshield-ai`
4. Vercel détectera automatiquement Next.js
5. **IMPORTANT** : Avant de cliquer sur "Deploy", configurez les variables d'environnement :

   Cliquez sur **"Environment Variables"** et ajoutez :
   
   - **Nom** : `RESEND_API_KEY`
   - **Valeur** : `re_dyjSkt8m_GCQsaeg4iTmTi2krku6Raef5`
   - **Environnements** : Cochez Production, Preview, Development
   
   - **Nom** : `CONTACT_EMAIL`
   - **Valeur** : `contact@skillshield-ai.com` (ou votre email)
   - **Environnements** : Cochez Production, Preview, Development

6. Cliquez sur **"Deploy"**

7. Attendez 2-3 minutes... 🎉 Votre site est en ligne !

---

## 🎯 Méthode 2 : Déploiement via Vercel CLI

### Étape 1 : Installer Vercel CLI

```bash
npm install -g vercel
```

### Étape 2 : Se connecter à Vercel

```bash
vercel login
```

### Étape 3 : Déployer

```bash
cd /Users/jeromekarr/Documents/skillshield-ai
vercel
```

Suivez les instructions :
- Link to existing project? → **No**
- Project name? → **skillshield-ai** (ou appuyez sur Entrée)
- Directory? → **./** (appuyez sur Entrée)
- Override settings? → **No**

### Étape 4 : Configurer les variables d'environnement

```bash
vercel env add RESEND_API_KEY
# Collez : re_dyjSkt8m_GCQsaeg4iTmTi2krku6Raef5
# Sélectionnez : Production, Preview, Development

vercel env add CONTACT_EMAIL
# Collez : contact@skillshield-ai.com
# Sélectionnez : Production, Preview, Development
```

### Étape 5 : Redéployer avec les variables

```bash
vercel --prod
```

---

## ✅ Vérification après déploiement

1. Votre site sera accessible sur : `https://skillshield-ai.vercel.app` (ou votre nom de projet)
2. Testez le formulaire d'audit - il devrait envoyer un email
3. Vérifiez les logs sur Vercel Dashboard → Project → Functions → `/api/audit-request`

---

## 🔧 Configuration Resend pour Production

**Important** : Pour que les emails fonctionnent en production :

1. Allez sur [resend.com](https://resend.com)
2. Vérifiez votre domaine (ou utilisez le domaine de test)
3. Dans `app/api/audit-request/route.ts`, ligne 23, remplacez :
   ```typescript
   from: 'SkillShield AI <onboarding@resend.dev>',
   ```
   Par votre email vérifié :
   ```typescript
   from: 'SkillShield AI <noreply@votredomaine.com>',
   ```

---

## 📝 Commandes utiles Vercel CLI

```bash
# Voir les logs en temps réel
vercel logs

# Ouvrir le dashboard
vercel dashboard

# Voir les variables d'environnement
vercel env ls

# Redéployer
vercel --prod
```

---

## 🎉 C'est tout !

Votre landing page SkillShield AI est maintenant en ligne et prête à convertir ! 🚀













