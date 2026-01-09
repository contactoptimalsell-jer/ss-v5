# 🚀 Configuration GitHub - Guide Complet

## ✅ Étape 1 : Créer le dépôt sur GitHub

1. Allez sur [github.com](https://github.com) et connectez-vous avec votre compte **SkillShield2002**
2. Cliquez sur le **"+"** en haut à droite → **"New repository"**
3. Remplissez :
   - **Repository name** : `skillshield-ai`
   - **Description** : "SkillShield AI Landing Page - High Conversion SaaS Landing Page"
   - **Visibilité** : Public ou Private (votre choix)
   - ❌ **NE COCHEZ PAS** "Add a README file"
   - ❌ **NE COCHEZ PAS** "Add .gitignore" (déjà présent)
   - ❌ **NE COCHEZ PAS** "Choose a license"
4. Cliquez sur **"Create repository"**

---

## 🔑 Étape 2 : Créer un Personal Access Token (PAT)

GitHub ne permet plus les mots de passe simples. Vous devez créer un token :

1. Allez sur [github.com/settings/tokens](https://github.com/settings/tokens)
2. Cliquez sur **"Generate new token"** → **"Generate new token (classic)"**
3. Remplissez le formulaire :
   - **Note** : `SkillShield AI Deployment`
   - **Expiration** : Choisissez (ex: 90 days ou No expiration)
   - **Scopes** : Cochez **`repo`** (accès complet aux dépôts)
4. Cliquez sur **"Generate token"** en bas de la page
5. **⚠️ IMPORTANT** : Copiez le token immédiatement (il commence par `ghp_...`)
   - Vous ne pourrez plus le voir après !
   - Gardez-le dans un endroit sûr (ex: gestionnaire de mots de passe)

---

## 📝 Étape 3 : Configurer Git dans votre terminal

Exécutez ces commandes dans votre terminal :

```bash
# 1. Aller dans le dossier du projet
cd /Users/jeromekarr/Documents/skillshield-ai

# 2. Vérifier que vous êtes sur la branche main
git branch

# 3. Ajouter le dépôt GitHub comme remote
git remote add origin https://github.com/SkillShield2002/skillshield-ai.git

# 4. Vérifier que c'est bien configuré
git remote -v
```

Vous devriez voir :
```
origin  https://github.com/SkillShield2002/skillshield-ai.git (fetch)
origin  https://github.com/SkillShield2002/skillshield-ai.git (push)
```

---

## 🚀 Étape 4 : Pousser le code sur GitHub

```bash
git push -u origin main
```

**Quand GitHub vous demande :**
- **Username** : `SkillShield2002`
- **Password** : Collez votre **Personal Access Token** (pas votre mot de passe GitHub !)

Le token commence par `ghp_` et fait environ 40 caractères.

---

## ✅ Vérification

1. Allez sur [github.com/SkillShield2002/skillshield-ai](https://github.com/SkillShield2002/skillshield-ai)
2. Vous devriez voir tous vos fichiers
3. Le dépôt est prêt ! 🎉

---

## 🔄 Commandes utiles pour plus tard

```bash
# Voir l'état
git status

# Ajouter des changements
git add .

# Créer un commit
git commit -m "Description de vos changements"

# Pousser vers GitHub
git push

# Récupérer les dernières modifications
git pull
```

---

## 🛠️ Dépannage

### Erreur "Permission denied"
- Vérifiez que vous utilisez le **token** et non votre mot de passe
- Vérifiez que le token a bien le scope `repo`

### Erreur "Repository not found"
- Vérifiez que le dépôt existe sur GitHub
- Vérifiez que vous êtes connecté avec le bon compte

### Erreur "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/SkillShield2002/skillshield-ai.git
```

---

## 📌 Prochaines étapes

Une fois le code sur GitHub, vous pourrez :
1. Déployer sur Vercel en connectant votre dépôt GitHub
2. Configurer les variables d'environnement sur Vercel
3. Votre site sera en ligne ! 🚀













