# 📧 Configuration Email - SkillShield AI

## Variables d'environnement requises dans Vercel

Pour que les emails soient envoyés depuis `contact@skillshield-ai.com`, vous devez configurer les variables d'environnement suivantes dans Vercel :

### 1. Accéder aux variables d'environnement

1. Allez sur [Vercel Dashboard](https://vercel.com/dashboard)
2. Sélectionnez votre projet `skillshield-ai`
3. Allez dans **Settings** → **Environment Variables**

### 2. Variables à configurer

#### Pour Gmail (recommandé pour débuter)

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=contact@skillshield-ai.com
SMTP_PASS=votre_mot_de_passe_application_gmail
```

**⚠️ Important pour Gmail :**
- Vous devez utiliser un **mot de passe d'application** (pas votre mot de passe Gmail normal)
- Pour créer un mot de passe d'application :
  1. Allez sur [Google Account](https://myaccount.google.com/)
  2. Sécurité → Validation en deux étapes (doit être activée)
  3. Mots de passe des applications → Créer un nouveau mot de passe
  4. Utilisez ce mot de passe dans `SMTP_PASS`

#### Pour un serveur SMTP personnalisé (ex: OVH, SendGrid, Mailgun)

```
SMTP_HOST=smtp.votre-serveur.com
SMTP_PORT=587 (ou 465 pour SSL)
SMTP_USER=contact@skillshield-ai.com
SMTP_PASS=votre_mot_de_passe
```

### 3. Vérification

Après avoir configuré les variables :

1. **Redéployez** votre application sur Vercel
2. Testez l'envoi d'email depuis l'interface `/12000`
3. Vérifiez les logs dans Vercel Dashboard → **Deployments** → **Functions** → **Logs**

### 4. Dépannage

#### Les emails ne partent pas

1. **Vérifiez les logs** dans Vercel :
   - Allez dans **Deployments** → Cliquez sur le dernier déploiement
   - Cliquez sur **Functions** → Trouvez `prospection-automation`
   - Consultez les logs pour voir les erreurs

2. **Erreurs communes :**
   - `SMTP_USER non configuré` → Ajoutez la variable `SMTP_USER`
   - `SMTP_PASS non configuré` → Ajoutez la variable `SMTP_PASS`
   - `Invalid login` → Vérifiez que `SMTP_USER` et `SMTP_PASS` sont corrects
   - `Connection timeout` → Vérifiez `SMTP_HOST` et `SMTP_PORT`

3. **Test de connexion SMTP :**
   - Utilisez un outil comme [Mailtrap](https://mailtrap.io/) pour tester
   - Ou testez avec un client email comme Thunderbird

#### L'email part mais n'arrive pas

1. **Vérifiez les spams** : Les emails peuvent être dans le dossier spam
2. **Vérifiez l'adresse de destination** : Assurez-vous que l'email est valide
3. **Vérifiez les logs** : Regardez si l'email a été accepté par le serveur SMTP

### 5. Configuration recommandée pour production

Pour la production, utilisez un service d'email transactionnel :

- **SendGrid** (gratuit jusqu'à 100 emails/jour)
- **Mailgun** (gratuit jusqu'à 5000 emails/mois)
- **Amazon SES** (très économique)
- **Postmark** (excellent pour les emails transactionnels)

Ces services offrent :
- Meilleure délivrabilité
- Statistiques d'envoi
- Gestion des bounces et spams
- API plus robuste

### 6. Exemple de configuration SendGrid

```
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=votre_api_key_sendgrid
```

**Note :** Avec SendGrid, le champ `from` dans le code (`contact@skillshield-ai.com`) sera utilisé comme expéditeur, mais l'authentification se fait avec `apikey` comme utilisateur.

---

**Besoin d'aide ?** Consultez les logs dans Vercel ou contactez le support.

