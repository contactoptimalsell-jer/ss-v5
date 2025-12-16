# Synchronisation Vercel ↔ Supabase

## 🔄 Comprendre la relation entre Vercel et Supabase

Il y a **deux configurations distinctes** qui fonctionnent **indépendamment** :

### 1. Variables d'environnement dans Vercel ✅ (DÉJÀ FAIT)

**Ce que vous avez configuré :**
- `SUPABASE_URL` dans Vercel
- `SUPABASE_ANON_KEY` dans Vercel

**À quoi ça sert :**
- Permet à votre application (déployée sur Vercel) de se connecter à Supabase
- Utilisé par le code dans `/api/emailRateLimit.ts` pour faire des requêtes REST à Supabase
- **C'est tout ce dont vous avez besoin !** ✅

### 2. Import GitHub dans Supabase (Optionnel)

**Ce que vous avez peut-être fait :**
- Connecté votre repo GitHub à Supabase

**À quoi ça sert :**
- Migrations de base de données (créer/modifier des tables via Git)
- Déploiements automatiques de fonctions Edge
- Gestion de schéma de base de données versionnée

**⚠️ Ce n'est PAS nécessaire pour le rate limiting !**

## ✅ Réponse : Pas besoin de synchronisation !

**Les deux fonctionnent indépendamment :**

```
┌─────────────────┐         ┌──────────────────┐
│   Vercel App    │─────────▶│   Supabase DB    │
│                 │         │                  │
│ Variables env:  │         │ Table:           │
│ - SUPABASE_URL  │  REST   │ email_rate_limits│
│ - SUPABASE_KEY  │  API    │                  │
└─────────────────┘         └──────────────────┘
         │
         │ (déploiement)
         │
┌─────────────────┐
│  GitHub Repo    │
│  (votre code)   │
└─────────────────┘
```

## 🎯 Ce qui est important

### ✅ Déjà configuré (et suffisant) :
1. **Variables d'environnement dans Vercel** :
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   
2. **Table créée dans Supabase** :
   - Table `email_rate_limits` créée via SQL Editor

### ❌ Pas nécessaire :
- Synchroniser quoi que ce soit entre Vercel et Supabase
- L'import GitHub dans Supabase (sauf si vous voulez faire des migrations versionnées)

## 🔍 Vérification que tout fonctionne

### 1. Vérifier les variables dans Vercel
1. Vercel Dashboard → Settings → Environment Variables
2. Vérifiez que `SUPABASE_URL` et `SUPABASE_ANON_KEY` existent
3. Vérifiez qu'elles sont activées pour **Production**, **Preview**, et **Development**

### 2. Vérifier la table dans Supabase
1. Supabase Dashboard → Table Editor
2. Vérifiez que la table `email_rate_limits` existe avec les colonnes :
   - `email` (TEXT, PRIMARY KEY)
   - `last_sent_at` (BIGINT)
   - `count` (INTEGER)
   - `updated_at` (TIMESTAMP)

### 3. Tester le rate limiting
1. Envoyez un PDF avec une adresse email
2. Réessayez immédiatement avec la même adresse
3. Vous devriez voir : "Un PDF a déjà été envoyé à cette adresse..."

### 4. Vérifier les logs Vercel
Dans les logs, vous devriez voir :
- `📦 Found record in Supabase for email@example.com` ✅
- `💾 Saved record to Supabase for email@example.com` ✅

## 🚨 Si ça ne fonctionne pas

### Problème : "Supabase not available"
**Solution :**
1. Vérifiez que les variables d'environnement sont bien dans Vercel
2. **Redéployez** après avoir ajouté les variables
3. Vérifiez que RLS est désactivé sur la table :
   ```sql
   ALTER TABLE email_rate_limits DISABLE ROW LEVEL SECURITY;
   ```

### Problème : Erreur 401/403 dans les logs
**Solution :**
1. Vérifiez que `SUPABASE_ANON_KEY` est la bonne clé
2. Vérifiez que RLS est désactivé ou que les politiques permettent l'accès

## 📝 Résumé

**Vous n'avez PAS besoin de synchroniser quoi que ce soit !**

- ✅ Variables dans Vercel → Permettent à l'app de se connecter à Supabase
- ✅ Table dans Supabase → Stocke les données de rate limiting
- ✅ C'est tout ! Les deux fonctionnent ensemble automatiquement

L'import GitHub dans Supabase est **optionnel** et sert uniquement si vous voulez :
- Faire des migrations de base de données versionnées
- Déployer des fonctions Edge Supabase
- Gérer votre schéma de base de données via Git

Pour le rate limiting, vous n'en avez **pas besoin** ! 🎉

