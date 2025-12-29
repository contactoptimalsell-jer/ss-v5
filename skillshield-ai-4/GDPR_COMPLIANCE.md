# 🟢 Conformité RGPD - Architecture IA + Google Cloud

## Vue d'ensemble

Ce système de prospection est **100% conforme RGPD** grâce à une architecture légale complète.

## Architecture RGPD Complète

### 1. Sources Légitimes (Article 6.1.f - Intérêt légitime)

✅ **Sources acceptées :**
- Annuaires professionnels publics (PagesJaunes, Kompass, etc.)
- Listes d'entreprises partenaires (avec accord)
- Sites web publics (données publiques - Article 6.1.e)
- Bases de données publiques autorisées

✅ **Documentation obligatoire :**
- Type de source (annuaire, partenaire, etc.)
- Nom de la source
- URL de la source (si disponible)
- Base légale RGPD choisie
- Durée de conservation
- Notes de traçabilité

### 2. Extraction de Données (Article 6.1.e - Données publiques)

✅ **Extraction uniquement d'emails génériques publics :**
- `contact@`, `info@`, `commercial@`, `vente@`, `sales@`
- `service@`, `support@`, `client@`, `hello@`, `accueil@`
- **AUCUN email personnel** (prénom.nom@) n'est extrait

✅ **Méthode légale :**
- Analyse de pages web publiques uniquement
- Extraction via Google Cloud (Gemini AI) - traitement automatisé
- Pas de scraping agressif ou de contournement de sécurité

### 3. Traçabilité Complète (Article 30 - Registre des traitements)

✅ **Métadonnées stockées pour chaque contact :**
```json
{
  "sourceName": "PagesJaunes",
  "sourceUrl": "https://...",
  "consentBasis": "legitimate_interest",
  "dataRetention": 12,
  "processedAt": "2024-01-15T10:30:00Z"
}
```

✅ **Logs RGPD :**
- Date et heure de traitement
- Source des données
- Base légale utilisée
- Durée de conservation

### 4. Droit d'Opposition (Article 21 - Opt-out)

✅ **Implémentation complète :**
- Lien de désinscription dans chaque email
- API `/api/opt-out` pour gérer les demandes
- Confirmation de désinscription
- Respect immédiat de l'opt-out

✅ **Processus :**
1. Email contient un lien unique d'opt-out
2. Clic → Page de confirmation
3. Confirmation → Désinscription immédiate
4. Plus aucun email envoyé à cette adresse

### 5. Conservation des Données (Article 5.1.e)

✅ **Durées configurables :**
- 6, 12, 24 ou 36 mois (12 mois recommandé)
- Suppression automatique après expiration
- Conservation uniquement pour raisons légales après opt-out

### 6. Message Associatif (Article 6.1.f)

✅ **Conforme à la prospection B2B :**
- Message clair sur l'origine des données
- Mention de la source légitime
- Opt-out visible et accessible
- Ton associatif et professionnel

## Bases Légales Utilisées

### Article 6.1.f - Intérêt légitime
**Utilisation :** Prospection B2B légitime
- Intérêt légitime de l'entreprise à développer son activité
- Impact minimal sur les droits des personnes (emails génériques uniquement)
- Droit d'opposition toujours disponible

### Article 6.1.e - Données publiques
**Utilisation :** Sites web publics, annuaires professionnels
- Données accessibles publiquement
- Extraction d'emails génériques uniquement
- Pas d'extraction de données personnelles sensibles

### Article 6.1.b - Partenariat contractuel
**Utilisation :** Listes d'entreprises partenaires
- Accord contractuel avec la source
- Données partagées dans le cadre du partenariat

## Conformité Technique

### ✅ Extraction Légale
- Google Cloud (Gemini AI) pour analyse intelligente
- Extraction uniquement d'emails génériques publics
- Pas de contournement de sécurité
- Respect des robots.txt (si applicable)

### ✅ Stockage Sécurisé
- Métadonnées RGPD stockées avec chaque contact
- Traçabilité complète
- Suppression automatique après expiration

### ✅ Transparence
- Message clair dans chaque email
- Mention de la source
- Lien d'opt-out visible
- Contact DPO disponible

## Checklist de Conformité

- [x] Documentation des sources légitimes
- [x] Extraction uniquement d'emails génériques publics
- [x] Traçabilité complète (métadonnées RGPD)
- [x] Opt-out fonctionnel et immédiat
- [x] Conservation limitée dans le temps
- [x] Message associatif conforme
- [x] Bases légales documentées
- [x] Logs RGPD pour audit
- [x] Respect du droit d'opposition
- [x] Sécurité des données

## Contact DPO

Pour toute question sur le traitement des données :
- Email : info@skillshield-ai.com
- Site : https://skillshield.app

## Audit RGPD

Le système génère automatiquement des logs pour faciliter les audits RGPD :
- Date de traitement
- Source des données
- Base légale utilisée
- Actions d'opt-out
- Durée de conservation

---

**Dernière mise à jour :** 2024-01-15
**Version :** 1.0
**Statut :** ✅ Conforme RGPD

