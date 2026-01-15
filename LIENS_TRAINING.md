# 🔗 Liens pour Training

## 📍 URLs disponibles

### Projet Training (direct) : `ss-v5-ochre`

- **URL Vercel directe** : `https://ss-v5-ochre.vercel.app/`
  - ✅ Accessible immédiatement
  - ✅ Training à la racine (pas besoin de /training)

### Via le projet principal : `ss-v5-k32l` (skillshield-ai-4)

- **Via rewrites** : `https://ss-v5-k32l.vercel.app/training`
  - Redirige vers `https://ss-v5-ochre.vercel.app/`
  - Configuration dans `skillshield-ai-4/vercel.json`

### Production (skillshield.app)

- **Production** : `https://skillshield.app/training`
  - Redirige vers le projet Training via rewrites
  - Configuration dans `skillshield-ai-4/vercel.json`

## ✅ Statut actuel

- ✅ **Projet Training** : `ss-v5-ochre.vercel.app` - Build réussi
- ✅ **Projet principal** : `ss-v5-k32l.vercel.app` - Build réussi  
- ✅ **Rewrites configurés** : `/training` → `ss-v5-ochre.vercel.app`

## 🎯 Test

Testez ces URLs :
1. `https://ss-v5-ochre.vercel.app/` → Devrait afficher Training
2. `https://ss-v5-k32l.vercel.app/training` → Devrait rediriger vers Training
3. `https://skillshield.app/training` → Devrait rediriger vers Training (si domaine configuré)

---

**📝 Note** : Le projet Training est maintenant un projet séparé, accessible à la racine de son URL Vercel.
