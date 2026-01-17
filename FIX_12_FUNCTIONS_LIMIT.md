# 🔧 Fix : Limite de 12 Serverless Functions (Hobby Plan)

## ❌ Problème

Erreur : **"No more than 12 Serverless Functions can be added to a Deployment on the Hobby plan."**

## ✅ Solution appliquée

**Nombre actuel : 10 fonctions API** (sous la limite de 12)

### Fonctions API conservées (10) :
1. `generate-audit.ts`
2. `promo-code.ts`
3. `prospection-automation.ts`
4. `quiz-email.ts`
5. `quiz-score.ts`
6. `quiz-token.ts`
7. `send-pdf-prospection.ts`
8. `send-pdf.ts`
9. `send-quiz-link.ts`
10. `submit-quiz-answers.ts`

### Fonctions supprimées :
- `opt-out.ts` ❌
- `legal-prospecting.ts` ❌
- `web-scraper.ts` ❌

## 🔍 Si l'erreur persiste

### Vérifications à faire :

1. **Vérifier le cache Vercel** :
   - Allez dans **Settings** → **Build & Development Settings**
   - Cliquez sur **Clear Build Cache**
   - Redéployez

2. **Vérifier les Edge Functions** :
   - Les Edge Functions sont comptées séparément
   - Vérifiez s'il y a des fichiers `middleware.ts` ou `_middleware.ts`

3. **Vérifier les fonctions dans `vercel.json`** :
   - Les fonctions définies dans `vercel.json` peuvent aussi être comptées

4. **Vérifier les fichiers dans `dist/`** :
   - Si `dist/` est commité par erreur, il peut contenir des fonctions

## 📋 Si 10 fonctions ne suffisent pas

### Option 1 : Fusionner des fonctions similaires
- Combiner `send-pdf.ts` et `send-pdf-prospection.ts`
- Combiner plusieurs fonctions `quiz-*` en une seule route avec un paramètre

### Option 2 : Passer au Pro Plan
- Le Pro Plan permet plus de fonctions serverless
- Aller sur https://vercel.com/pricing

### Option 3 : Utiliser un autre service
- Déplacer certaines fonctions vers un autre service (Supabase Functions, AWS Lambda, etc.)

## ✅ Vérification actuelle

```bash
# Compter les fonctions API
ls -1 api/*.ts | wc -l
# Résultat attendu : 10
```

## 🎯 Résultat attendu

Avec 10 fonctions API :
- ✅ Déploiement devrait réussir
- ✅ Marge de sécurité de 2 fonctions
- ✅ Toutes les fonctionnalités principales conservées
