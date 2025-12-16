// Système de rate limiting pour les envois d'email
// Limite : 1 envoi par email, possibilité de renvoyer après 24h

interface EmailSendRecord {
  email: string;
  lastSentAt: number;
  count: number;
}

// Stockage en mémoire (pour Vercel serverless)
// Note: En production, utilisez Vercel KV ou Edge Config pour la persistance
const emailSendRecords = new Map<string, EmailSendRecord>();

// Nettoyer les anciens enregistrements (plus de 7 jours)
const CLEANUP_INTERVAL = 7 * 24 * 60 * 60 * 1000; // 7 jours
const RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000; // 24 heures

function cleanupOldRecords() {
  const now = Date.now();
  for (const [email, record] of emailSendRecords.entries()) {
    if (now - record.lastSentAt > CLEANUP_INTERVAL) {
      emailSendRecords.delete(email);
    }
  }
}

// Nettoyer toutes les 10 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupOldRecords, 10 * 60 * 1000);
}

/**
 * Vérifie si un email peut recevoir un PDF
 * @param email L'adresse email à vérifier
 * @returns { canSend: boolean, message?: string, nextAvailableAt?: number }
 */
export function canSendEmail(email: string): { 
  canSend: boolean; 
  message?: string; 
  nextAvailableAt?: number;
} {
  const normalizedEmail = email.toLowerCase().trim();
  const now = Date.now();
  
  const record = emailSendRecords.get(normalizedEmail);
  
  if (!record) {
    // Premier envoi, autorisé
    return { canSend: true };
  }
  
  const timeSinceLastSend = now - record.lastSentAt;
  
  if (timeSinceLastSend < RATE_LIMIT_WINDOW) {
    // Moins de 24h depuis le dernier envoi
    const hoursRemaining = Math.ceil((RATE_LIMIT_WINDOW - timeSinceLastSend) / (60 * 60 * 1000));
    const nextAvailableAt = record.lastSentAt + RATE_LIMIT_WINDOW;
    
    return {
      canSend: false,
      message: `Un PDF a déjà été envoyé à cette adresse. Vous pourrez renvoyer dans ${hoursRemaining} heure${hoursRemaining > 1 ? 's' : ''}.`,
      nextAvailableAt
    };
  }
  
  // Plus de 24h, autorisé
  return { canSend: true };
}

/**
 * Enregistre un envoi d'email
 * @param email L'adresse email
 */
export function recordEmailSend(email: string): void {
  const normalizedEmail = email.toLowerCase().trim();
  const now = Date.now();
  
  emailSendRecords.set(normalizedEmail, {
    email: normalizedEmail,
    lastSentAt: now,
    count: (emailSendRecords.get(normalizedEmail)?.count || 0) + 1
  });
  
  console.log(`📧 Email send recorded for: ${normalizedEmail} at ${new Date(now).toISOString()}`);
}

/**
 * Obtient les statistiques d'envoi pour un email
 * @param email L'adresse email
 */
export function getEmailStats(email: string): {
  count: number;
  lastSentAt: number | null;
  nextAvailableAt: number | null;
} {
  const normalizedEmail = email.toLowerCase().trim();
  const record = emailSendRecords.get(normalizedEmail);
  
  if (!record) {
    return {
      count: 0,
      lastSentAt: null,
      nextAvailableAt: null
    };
  }
  
  return {
    count: record.count,
    lastSentAt: record.lastSentAt,
    nextAvailableAt: record.lastSentAt + RATE_LIMIT_WINDOW
  };
}

