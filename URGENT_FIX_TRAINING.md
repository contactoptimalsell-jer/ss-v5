# 🚨 URGENT : Fix pour /training

## ❌ Problème actuel

- `https://skillshield.app/training` ne fonctionne pas
- Les logs montrent qu'un seul build est exécuté (skillshield-ai-4)
- Le projet Training n'est pas buildé

## 🔍 Cause

Le **Root Directory** dans Vercel est probablement configuré sur `skillshield-ai-4` au lieu de la racine, donc Vercel utilise le `vercel.json` dans `skillshield-ai-4` au lieu de celui à la racine.

## ✅ Solution immédiate (2 minutes)

### Dans Vercel Dashboard :

1. **Allez sur** https://vercel.com/dashboard
2. **Ouvrez le projet** `ss-v5` (ou le projet qui utilise ce repo)
3. **Settings** → **General**
4. **Cherchez** "Root Directory"
5. **Si c'est** `skillshield-ai-4` :
   - Cliquez sur "Edit"
   - **Effacez** `skillshield-ai-4` (laissez vide)
   - Sauvegardez
6. **Redéployez** :
   - Deployments → Redeploy

## ✅ Vérification

Après redéploiement, dans les logs vous devriez voir :

```
Building skillshield-ai-4...
Building skillshield-training...
```

Et `https://skillshield.app/training` devrait fonctionner !

---

**⏱️ Temps : 2 minutes**

Faites cette modification maintenant et redéployez !
