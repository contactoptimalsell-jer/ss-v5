# 🎯 Système de Prospection Automatisée

## Fonctionnalités

Le système de prospection automatisée permet de :
1. **Rechercher automatiquement des emails** d'entreprises via Grok (xAI) en fonction d'une catégorie et d'un secteur
2. **Envoyer des quiz personnalisés** en masse à ces entreprises
3. **Personnaliser les quiz** avec le nom de l'entreprise

## Configuration requise

### 1. Clé API Grok (xAI)

Pour utiliser la recherche d'emails via Grok, vous devez configurer la clé API :

1. Obtenez votre clé API sur https://x.ai/api
2. Ajoutez-la dans Vercel :
   - Allez sur https://vercel.com/dashboard
   - Ouvrez le projet **skillshield-ai**
   - **Settings** → **Environment Variables**
   - Ajoutez :
     - **Name** : `GROK_API_KEY`
     - **Value** : Votre clé API Grok
     - **Environments** : Production, Preview, Development
   - Cliquez sur **Save**

3. Redéployez l'application :
   ```bash
   vercel --prod --yes
   ```

### 2. Configuration SMTP

Assurez-vous que les variables SMTP sont configurées :
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`

## Utilisation

### Mode Manuel
1. Remplissez le formulaire avec :
   - Nom du prospect
   - Email du prospect
   - Contexte (optionnel)
2. Cliquez sur "Envoyer le quiz personnalisé"

### Mode Automatisé
1. Activez le mode "Automatisé"
2. Remplissez :
   - **Catégorie d'entreprise** : Ex: PME, Startup, Grand groupe
   - **Secteur d'activité** : Ex: Immobilier, E-commerce, Santé
3. Cliquez sur "Rechercher des emails"
   - Le système utilise Grok pour trouver des entreprises correspondantes
   - Les emails trouvés s'affichent dans une liste
4. Cliquez sur "Envoyer les quiz" pour envoyer automatiquement les quiz à tous les emails trouvés

## Limites

- **Recherche** : Maximum 15 emails par recherche
- **Envoi en masse** : Maximum 50 quiz par batch
- **Rate limiting** : Respect des limites d'envoi (1 quiz par email toutes les 24h)

## API Route

### `/api/prospection-automation`
Route unifiée pour la prospection automatisée avec deux actions :

#### Action `search` - Recherche d'emails
- **Method** : POST
- **Body** : `{ action: "search", category: string, sector: string }`
- **Response** : `{ success: boolean, emails: ProspectEmail[], count: number }`

#### Action `send` - Envoi en masse
- **Method** : POST
- **Body** : `{ action: "send", prospects: ProspectEmail[], category: string, sector: string }`
- **Response** : `{ success: boolean, sent: number, failed: number, results: Array }`

## Structure des données

```typescript
interface ProspectEmail {
  email: string;
  companyName: string;
  name?: string;
}
```

## Notes importantes

- Les emails sont validés avant l'envoi
- Chaque quiz génère un token unique
- Les quiz sont personnalisés avec le nom de l'entreprise
- Un email récapitulatif est envoyé à info@skillshield-ai.com quand un prospect complète le quiz

