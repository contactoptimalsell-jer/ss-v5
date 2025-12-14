# Configuration de l'Envoi d'Email (Lead Magnet PDF)

## 📧 Configuration SMTP

Pour que le système d'envoi de PDF fonctionne, vous devez configurer les variables d'environnement SMTP dans Vercel.

### Option 1 : Gmail (Recommandé - Simple et Fiable)

1. **Créer un "App Password" Gmail** :
   - Allez sur https://myaccount.google.com/apppasswords
   - Connectez-vous avec le compte `contact@skillshield-ai.com` (ou votre compte Gmail)
   - Créez un nouveau mot de passe d'application
   - Copiez le mot de passe généré (16 caractères)

2. **Configurer les variables dans Vercel** :
   - Allez dans Vercel Dashboard → Votre projet → Settings → Environment Variables
   - Ajoutez les variables suivantes :

   ```
   SMTP_HOST = smtp.gmail.com
   SMTP_PORT = 587
   SMTP_USER = contact@skillshield-ai.com
   SMTP_PASS = [Votre App Password Gmail de 16 caractères]
   ```

3. **Redéployer** :
   - Après avoir ajouté les variables, redéployez votre projet
   - Les variables seront disponibles dans votre API

### Option 2 : Autre Service SMTP

Si vous utilisez un autre service email (Outlook, SendGrid, Mailgun, etc.), configurez les variables en conséquence :

**Exemple pour Outlook/Office 365** :
```
SMTP_HOST = smtp.office365.com
SMTP_PORT = 587
SMTP_USER = contact@skillshield-ai.com
SMTP_PASS = [Votre mot de passe]
```

**Exemple pour SendGrid** :
```
SMTP_HOST = smtp.sendgrid.net
SMTP_PORT = 587
SMTP_USER = apikey
SMTP_PASS = [Votre API Key SendGrid]
```

## ✅ Test

Une fois configuré, testez le système :
1. Allez sur votre site
2. Passez le test IA
3. Entrez votre email dans le formulaire "Recevez votre Plan d'Automatisation en PDF"
4. Vérifiez votre boîte de réception

## 🔒 Sécurité

- ⚠️ **Ne commitez JAMAIS** les mots de passe SMTP dans votre code
- ✅ Utilisez **toujours** les variables d'environnement Vercel
- ✅ Pour Gmail, utilisez un **App Password** (pas votre mot de passe principal)

## 📝 Contenu du PDF

Le PDF généré automatiquement contient :
1. **Notre Analyse** : Analyse empathique du problème
2. **Vos Solutions d'Automatisation IA** : 3 solutions personnalisées
3. **Benchmark IA/Automatisation** : Données comparatives du secteur
4. **Plan d'Action en 5 Étapes** : Guide de mise en œuvre
5. **Prochaines Étapes** : Appel à l'action

## 🐛 Dépannage

**Erreur "EAUTH" ou "ECONNECTION"** :
- Vérifiez que vos variables d'environnement sont correctement configurées
- Pour Gmail, assurez-vous d'utiliser un App Password (pas votre mot de passe principal)
- Vérifiez que le compte email a l'authentification à 2 facteurs activée (requis pour App Password)

**Le PDF ne s'envoie pas** :
- Vérifiez les logs Vercel (Dashboard → Deployments → View Function Logs)
- Vérifiez que l'email de destination est valide
- Vérifiez que le service SMTP est accessible depuis Vercel

