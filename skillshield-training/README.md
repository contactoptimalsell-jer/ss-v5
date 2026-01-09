# SkillShield Training - Service Séparé

## 🎯 Service Indépendant

SkillShield Training est un **service séparé** de SkillShield AI, déployé et accessible indépendamment.

## 🌐 Accès

### Option 1 : Sous-domaine (Recommandé)
**URL** : `https://training.skillshield.app`

### Option 2 : Service Vercel indépendant
**URL** : `https://skillshield-training.vercel.app` (ou votre URL Vercel)

## 🚀 Déploiement

### Configuration Vercel

1. **Créer un projet Vercel séparé** :
   - Nom : `skillshield-training`
   - Root Directory : `skillshield-training`
   - Framework : Next.js (auto-détecté)

2. **Configurer le domaine** :
   - Pour sous-domaine : Ajouter `training.skillshield.app` dans Settings → Domains
   - Configurer le DNS CNAME : `training` → `cname.vercel-dns.com`

3. **Variables d'environnement** (si nécessaire) :
   - `RESEND_API_KEY` : Pour l'envoi d'emails
   - `CONTACT_EMAIL` : Email de contact (optionnel)

## 📁 Structure

Service complètement indépendant avec :
- ✅ Ses propres composants
- ✅ Ses propres routes API
- ✅ Sa propre configuration
- ✅ Déploiements indépendants

## 🔗 Lien avec SkillShield AI

Training est un **service séparé** :
- Pas de dépendance avec SkillShield AI
- Déploiements indépendants
- Scaling séparé
- Maintenance isolée

## 📝 Notes

- Le `basePath` a été retiré pour permettre l'accès à la racine
- Service accessible via sous-domaine ou URL Vercel directe
- Configuration indépendante de SkillShield AI
