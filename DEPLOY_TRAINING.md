# 🚀 Déployer SkillShield Training sur Vercel

## ❌ Problème actuel

Quand vous allez sur `https://skillshield.app/training`, vous êtes redirigé vers la page principale car le projet Training n'est pas encore déployé sur Vercel.

## ✅ Solution : Créer un nouveau projet Vercel pour Training

### Étape 1 : Créer le projet

1. Allez sur **https://vercel.com/dashboard**
2. Cliquez sur **"Add New"** → **"Project"**
3. Si vous voyez votre repository `ss-v5`, **cliquez dessus**
   - Sinon, cliquez sur **"Import Git Repository"** et connectez votre repo

### Étape 2 : Configurer le projet

**IMPORTANT** : Configurez ces paramètres :

1. **Framework Preset** : Sélectionnez **"Next.js"** (ou laissez Vercel détecter)
2. **Root Directory** : ⚠️ **Changez-le** en cliquant sur "Edit"
   - Entrez : **`skillshield-training`**
3. **Build Command** : `npm run build` (devrait être automatique)
4. **Output Directory** : `.next` (devrait être automatique)
5. **Install Command** : `npm install` (devrait être automatique)

### Étape 3 : Variables d'environnement (optionnel)

Si vous utilisez Resend pour les emails :

1. Cliquez sur **"Environment Variables"**
2. Ajoutez :
   - **Name** : `RESEND_API_KEY`
   - **Value** : Votre clé API Resend
   - **Environments** : Cochez Production, Preview, Development
3. Ajoutez (optionnel) :
   - **Name** : `CONTACT_EMAIL`
   - **Value** : `contact@skillshield.app`
   - **Environments** : Tous

### Étape 4 : Déployer

1. Cliquez sur **"Deploy"**
2. Attendez que le build se termine
3. ✅ Le projet devrait être déployé sur une URL Vercel (ex: `skillshield-training-xxx.vercel.app`)

### Étape 5 : Configurer le domaine avec path `/training`

**Option A : Via le Dashboard (Recommandé)**

1. Dans le projet Training, allez dans **Settings** → **Domains**
2. Cliquez sur **"Add Domain"**
3. Entrez : **`skillshield.app`**
4. **IMPORTANT** : Dans les options avancées, configurez le **Path** :
   - Cherchez une option "Path" ou "Subdirectory"
   - Entrez : **`/training`**
5. Cliquez sur **"Add"**

**Option B : Si Vercel ne permet pas le path directement**

Si Vercel ne permet pas d'ajouter un path directement, vous devrez utiliser un **rewrite** dans le projet principal :

1. Dans le projet **skillshield-ai-4**, allez dans **Settings** → **Domains**
2. Vérifiez que `skillshield.app` est bien configuré
3. Créez un fichier `vercel.json` à la racine de `skillshield-ai-4` avec :

```json
{
  "rewrites": [
    {
      "source": "/training/:path*",
      "destination": "https://skillshield-training-xxx.vercel.app/training/:path*"
    },
    {
      "source": "/((?!api/|robots.txt|sitemap.xml|training).*)",
      "destination": "/index.html"
    }
  ]
}
```

Remplacez `skillshield-training-xxx.vercel.app` par l'URL réelle de votre projet Training.

### Étape 6 : Vérifier

1. Attendez quelques minutes pour la propagation
2. Testez : **https://skillshield.app/training**
3. ✅ Vous devriez voir la page SkillShield Training

## 🔍 Vérification de la configuration

Le fichier `skillshield-training/next.config.ts` contient déjà :

```typescript
basePath: "/training"
```

Cela signifie que Next.js servira automatiquement toutes les routes sous `/training`.

## ⚠️ Note importante

Si vous utilisez l'Option B (rewrite), assurez-vous que :
- Le projet Training est bien déployé et accessible
- L'URL Vercel du projet Training est correcte dans le rewrite
- Les deux projets sont dans la même team Vercel

## 🎯 Résultat attendu

Après configuration :
- ✅ `https://skillshield.app` → Page principale (SkillShield AI)
- ✅ `https://skillshield.app/training` → Page Training
- ✅ Les deux projets fonctionnent sur le même domaine

---

**⏱️ Temps estimé : 10-15 minutes**

Une fois déployé, le lien `https://skillshield.app/training` devrait fonctionner !
