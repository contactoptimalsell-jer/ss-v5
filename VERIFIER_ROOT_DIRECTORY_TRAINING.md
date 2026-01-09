# ⚠️ IMPORTANT : Vérifier le Root Directory du projet Training

## ❌ Problème détecté

Les logs du projet Training montrent qu'il build **`skillshield-ai-4`** (Vite) au lieu de **`skillshield-training`** (Next.js).

## 🔍 Cause

Le **Root Directory** du projet Training dans Vercel n'est **PAS** configuré sur `skillshield-training`.

## ✅ Solution : Configurer le Root Directory

### Dans Vercel Dashboard :

1. **Allez sur** le projet **Training** (celui avec l'URL `ss-v5-ochre.vercel.app`)
2. **Cliquez** sur **Settings** (en haut)
3. **Allez** dans **General** (menu de gauche)
4. **Cherchez** **"Root Directory"**
5. **Cliquez** sur **"Edit"**
6. **Entrez** : **`skillshield-training`** (exactement comme ça)
7. **Sauvegardez**

### Redéployer :

1. **Allez** dans **Deployments**
2. **Cliquez** sur les **3 points (⋯)** du dernier déploiement
3. **Sélectionnez** **"Redeploy"**

## ✅ Résultat attendu

Après avoir configuré le Root Directory et redéployé, dans les logs vous devriez voir :

```
Installing dependencies...
> skillshield-training@0.1.0 build
> next build
```

Au lieu de :
```
> skillshield-ai@0.0.0 build
> vite build
```

## 🎯 Vérification

Après correction :
- ✅ Le projet Training devrait builder Next.js (pas Vite)
- ✅ `https://ss-v5-ochre.vercel.app/training` devrait fonctionner
- ✅ `https://skillshield.app/training` devrait fonctionner (via rewrites)

---

**🎯 Action immédiate** : Configurez le Root Directory sur `skillshield-training` dans le projet Training !
