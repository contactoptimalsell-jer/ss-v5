# ⚠️ URGENT : Vérifier le Root Directory du projet Training

## ❌ Problème

Les logs montrent que Vercel utilise toujours le commit `80ec99a` et détecte encore un `vercel.json` avec `builds`. Cela signifie que le **Root Directory** du projet Training n'est **PAS** configuré correctement.

## ✅ Solution immédiate

### Dans Vercel Dashboard - Projet Training (`ss-v5-ochre`) :

1. **Allez sur** le projet Training : `ss-v5-ochre` dans Vercel
2. **Settings** → **General**
3. **Cherchez** **"Root Directory"**
4. **Vérifiez** ce qui est configuré :
   - ❌ Si c'est **vide** ou **`.`** → C'est le problème !
   - ✅ Si c'est **`skillshield-training`** → C'est correct

### Si le Root Directory est vide ou `.` :

1. **Cliquez** sur **"Edit"** à côté de "Root Directory"
2. **Entrez** : **`skillshield-training`** (exactement, sans espaces)
3. **Sauvegardez**
4. **Redéployez** :
   - Deployments → Redeploy

## ✅ Vérification après correction

Après avoir configuré le Root Directory et redéployé :

1. **Dans les logs**, vous devriez voir :
   ```
   > skillshield-training@0.1.0 build
   > next build
   ```

2. **Plus de warning** "Due to `builds` existing"
3. **Plus d'erreur** "basePath can not be used with builds"

## 📝 Note importante

Le Root Directory **DOIT** être `skillshield-training` (exactement) pour que Vercel :
- Utilise le bon dossier
- Ne voie pas le vercel.json à la racine
- Build le projet Next.js correctement

---

**🎯 Action immédiate** : Vérifiez et configurez le Root Directory sur `skillshield-training` dans le projet Training !
