# 🚀 Déployer SkillShield Training comme Service Séparé

## ✅ Configuration effectuée

Training est maintenant configuré comme un **service complètement séparé** de SkillShield AI :
- ✅ `basePath` retiré de `next.config.ts`
- ✅ Routing indépendant
- ✅ Service accessible à la racine

## 📋 Étapes de déploiement

### Étape 1 : Créer le projet Vercel

1. Allez sur **https://vercel.com/dashboard**
2. Cliquez sur **"Add New"** → **"Project"**
3. Sélectionnez le repository **`ss-v5`**
4. Configurez :
   - **Project Name** : `skillshield-training`
   - **Root Directory** : ⚠️ **`skillshield-training`** (cliquez sur "Edit")
   - **Framework Preset** : Next.js (auto-détecté)
   - **Build Command** : `npm run build` (automatique)
   - **Output Directory** : `.next` (automatique)
5. Cliquez sur **"Deploy"**

### Étape 2 : Configurer le sous-domaine (Recommandé)

**Option A : Sous-domaine `training.skillshield.app`**

1. Dans le projet Training, allez dans **Settings** → **Domains**
2. Cliquez sur **"Add Domain"**
3. Entrez : **`training.skillshield.app`**
4. Vercel vous donnera des instructions DNS :
   - Type : **CNAME**
   - Name : **`training`**
   - Value : **`cname.vercel-dns.com`** (ou la valeur fournie par Vercel)
5. Configurez le DNS chez votre registrar
6. Attendez la propagation DNS (5-30 minutes)

**Option B : Utiliser l'URL Vercel directe**

- L'URL Vercel sera : `https://skillshield-training-xxx.vercel.app`
- Accessible immédiatement après le déploiement

### Étape 3 : Variables d'environnement (optionnel)

Si vous utilisez Resend pour les emails :

1. **Settings** → **Environment Variables**
2. Ajoutez :
   - **Name** : `RESEND_API_KEY`
   - **Value** : Votre clé API Resend
   - **Environments** : Production, Preview, Development
3. Ajoutez (optionnel) :
   - **Name** : `CONTACT_EMAIL`
   - **Value** : `contact@skillshield.app`

## ✅ Résultat

Après déploiement :

- ✅ **Service indépendant** : `https://training.skillshield.app` (ou URL Vercel)
- ✅ **Déploiements séparés** de SkillShield AI
- ✅ **Scaling indépendant**
- ✅ **Maintenance isolée**

## 🔗 Services disponibles

- **SkillShield AI** : `https://skillshield.app`
- **SkillShield Training** : `https://training.skillshield.app` (service séparé)

## 📝 Avantages

- ✅ Services complètement indépendants
- ✅ Déploiements sans impact mutuel
- ✅ Équipes différentes possibles
- ✅ Monitoring séparé
- ✅ Scaling indépendant

---

**⏱️ Temps estimé : 10-15 minutes**

Une fois déployé, Training sera accessible comme un service complètement séparé !
