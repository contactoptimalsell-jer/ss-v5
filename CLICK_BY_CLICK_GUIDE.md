# 🖱️ Guide Click-by-Click : Supprimer les intégrations Vercel

## 📍 Navigation exacte dans Vercel Dashboard

### Étape 1 : Accéder au projet
1. Ouvrez : **https://vercel.com/dashboard**
2. Dans la liste des projets, **cliquez** sur : **`skillshield-ai-4`**
3. Vous devriez voir la page du projet avec les onglets : **Overview**, **Deployments**, **Settings**, etc.

### Étape 2 : Aller dans Settings
1. **Cliquez** sur l'onglet **"Settings"** (en haut de la page, à côté de "Deployments")
2. Vous devriez voir un menu de gauche avec :
   - General
   - Environment Variables
   - **Integrations** ← C'EST ICI
   - Domains
   - etc.

### Étape 3 : Ouvrir Integrations
1. **Cliquez** sur **"Integrations"** dans le menu de gauche
2. Vous devriez voir une liste d'intégrations avec :
   - **SkillShieldQuizz**
   - **SupabaseSkillShield**
   - **SupabaseSkillShieldOFF**

### Étape 4 : Supprimer chaque intégration

**Pour SkillShieldQuizz :**
1. Trouvez la ligne **"SkillShieldQuizz"** dans la liste
2. À droite de cette ligne, cherchez **3 points verticaux (⋯)** ou un bouton **"..."**
3. **Cliquez** sur ces 3 points
4. Un menu déroulant apparaît
5. **Cliquez** sur **"Remove"** ou **"Disconnect"** ou **"Delete"**
6. Si une confirmation apparaît, **cliquez** sur **"Confirm"** ou **"Yes"**

**Répétez pour SupabaseSkillShield :**
1. Trouvez **"SupabaseSkillShield"**
2. **Cliquez** sur les **3 points (⋯)**
3. **Cliquez** sur **"Remove"**
4. **Confirmez**

**Répétez pour SupabaseSkillShieldOFF :**
1. Trouvez **"SupabaseSkillShieldOFF"**
2. **Cliquez** sur les **3 points (⋯)**
3. **Cliquez** sur **"Remove"**
4. **Confirmez**

### Étape 5 : Redéployer
1. **Cliquez** sur l'onglet **"Deployments"** (en haut)
2. Vous voyez la liste des déploiements
3. Trouvez le dernier déploiement (celui qui a échoué, avec "Build Failed")
4. À droite de ce déploiement, **cliquez** sur les **3 points (⋯)**
5. Un menu apparaît
6. **Cliquez** sur **"Redeploy"**
7. Attendez que le déploiement se termine

## 🆘 Si vous ne voyez pas l'onglet "Integrations"

**Alternative 1 : Via le déploiement**
1. **Cliquez** sur le déploiement qui a échoué
2. Vous voyez la page "Deployment Details"
3. Développez la section **"Provisioning Integrations"** (cliquez dessus)
4. Vous voyez les 3 intégrations listées
5. **Cliquez** sur chaque intégration (ex: "SkillShieldQuizz")
6. Une page ou un modal s'ouvre
7. Cherchez un bouton **"Remove"**, **"Disconnect"**, ou **"Delete"**
8. **Cliquez** dessus et confirmez

**Alternative 2 : Via Settings → General**
1. **Settings** → **General**
2. Cherchez une section **"Connected Integrations"** ou **"Integrations"**
3. Suivez les mêmes étapes pour supprimer

## 📸 À quoi ça ressemble

L'interface Vercel devrait ressembler à ça :

```
┌─────────────────────────────────────┐
│  skillshield-ai-4                    │
├─────────────────────────────────────┤
│ Overview │ Deployments │ Settings │  │
├─────────────────────────────────────┤
│ Settings                            │
│                                     │
│ General                             │
│ Environment Variables               │
│ ▶ Integrations  ← CLIQUEZ ICI      │
│ Domains                             │
│ ...                                 │
└─────────────────────────────────────┘
```

Puis dans Integrations :

```
┌─────────────────────────────────────┐
│ Integrations                        │
├─────────────────────────────────────┤
│ SkillShieldQuizz          [⋯]      │ ← Cliquez sur [⋯]
│ SupabaseSkillShield        [⋯]      │ ← Cliquez sur [⋯]
│ SupabaseSkillShieldOFF     [⋯]      │ ← Cliquez sur [⋯]
└─────────────────────────────────────┘
```

## ✅ Résultat attendu

Après avoir supprimé les 3 intégrations :
- La liste "Integrations" devrait être vide (ou ne plus contenir ces 3)
- Quand vous redéployez, l'étape "Provisioning Integrations" devrait passer
- Le build devrait continuer normalement

## 🎯 Si ça ne fonctionne toujours pas

Si après avoir supprimé les intégrations, le problème persiste :

1. **Vérifiez** que les intégrations sont bien supprimées (la liste devrait être vide)
2. **Attendez** 1-2 minutes (parfois Vercel met du temps à synchroniser)
3. **Redéployez** à nouveau
4. Si ça ne marche toujours pas, **créez un nouveau projet Vercel** et importez le même repo

---

**💡 Astuce** : Prenez une capture d'écran de chaque étape si vous bloquez, et je pourrai vous guider plus précisément !
