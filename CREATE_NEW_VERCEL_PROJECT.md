# 🆕 Solution alternative : Créer un nouveau projet Vercel

Si vous n'arrivez pas à supprimer les intégrations, créez un nouveau projet Vercel propre.

## 📋 Étapes pour créer un nouveau projet

### Étape 1 : Créer le nouveau projet
1. Allez sur **https://vercel.com/dashboard**
2. Cliquez sur **"Add New"** → **"Project"**
3. Sélectionnez votre repository **`ss-v5`** (ou importez-le depuis GitHub)

### Étape 2 : Configurer le projet
1. **Framework Preset** : Sélectionnez **"Vite"** (ou laissez Vercel détecter automatiquement)
2. **Root Directory** : Entrez **`skillshield-ai-4`**
3. **Build Command** : `npm run build` (devrait être automatique)
4. **Output Directory** : `dist` (devrait être automatique)
5. **Install Command** : `npm install` (devrait être automatique)

### Étape 3 : Copier les variables d'environnement

**IMPORTANT** : Avant de déployer, copiez toutes vos variables d'environnement depuis l'ancien projet.

1. Allez dans l'**ancien projet** `skillshield-ai-4`
2. **Settings** → **Environment Variables**
3. **Notez** toutes les variables (ou prenez des captures d'écran)
4. Retournez dans le **nouveau projet**
5. **Settings** → **Environment Variables**
6. **Ajoutez** toutes les variables une par une :
   - `GEMINI_API_KEY`
   - `STORAGE_SS_SUPABASE_URL`
   - `STORAGE_SS_SUPABASE_SERVICE_ROLE_KEY`
   - Toutes les autres variables que vous avez

### Étape 4 : Déployer
1. Cliquez sur **"Deploy"**
2. Attendez que le build se termine
3. ✅ Le nouveau projet devrait se déployer sans les intégrations problématiques

### Étape 5 : Configurer le domaine
1. Dans le nouveau projet, allez dans **Settings** → **Domains**
2. Ajoutez le domaine : **`skillshield.app`**
3. Vercel vous donnera des instructions DNS si nécessaire

### Étape 6 : (Optionnel) Supprimer l'ancien projet
Une fois que le nouveau projet fonctionne :
1. Allez dans l'ancien projet `skillshield-ai-4`
2. **Settings** → **General** → Scroll en bas
3. Cliquez sur **"Delete Project"**
4. Confirmez la suppression

## ✅ Avantages de cette méthode

- ✅ Pas besoin de supprimer les intégrations manuellement
- ✅ Projet propre sans historique d'erreurs
- ✅ Même code, juste un nouveau projet Vercel
- ✅ Les intégrations ne seront pas automatiquement ajoutées

## 📝 Variables d'environnement à copier

Assurez-vous de copier ces variables depuis l'ancien projet :

- `GEMINI_API_KEY` (ou `DefaultGeminiAPIKey`)
- `STORAGE_SS_SUPABASE_URL`
- `STORAGE_SS_SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY` (si utilisé)
- `CONTACT_EMAIL` (si utilisé)
- Toutes les autres variables que vous avez configurées

## 🎯 Résultat

Vous aurez un nouveau projet Vercel qui :
- ✅ Se déploie sans erreur
- ✅ N'a pas les intégrations problématiques
- ✅ Utilise le même code
- ✅ Fonctionne exactement comme avant

---

**⏱️ Temps estimé : 10-15 minutes**

Cette méthode est plus rapide que d'essayer de réparer les intégrations si vous avez des difficultés à les supprimer.
