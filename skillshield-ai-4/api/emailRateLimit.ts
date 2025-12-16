// Système de rate limiting pour les envois d'email
// Limite : 1 envoi par email, possibilité de renvoyer après 24h

interface EmailSendRecord {
  email: string;
  lastSentAt: number;
  count: number;
}

// Stockage en mémoire (pour Vercel serverless)
// ⚠️ LIMITATION: Le stockage en mémoire ne persiste pas entre les redémarrages des fonctions serverless
// Pour une persistance réelle en production, utilisez Vercel KV (Redis) ou Edge Config
// Pour l'instant, ce système fonctionne pour limiter les envois multiples dans la même session
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

// Fonction pour obtenir le record depuis Vercel KV ou mémoire
async function getEmailRecord(email: string): Promise<EmailSendRecord | null> {
  const normalizedEmail = email.toLowerCase().trim();
  
  // Essayer Vercel KV d'abord (si disponible)
  try {
    // @ts-ignore - Vercel KV peut ne pas être installé
    const { kv } = await import('@vercel/kv');
    if (kv) {
      const key = `email_send:${normalizedEmail}`;
      const record = await kv.get<EmailSendRecord>(key);
      return record;
    }
  } catch (error) {
    // Vercel KV n'est pas disponible, utiliser la mémoire
  }
  
  // Fallback: stockage en mémoire
  return emailSendRecords.get(normalizedEmail) || null;
}

// Fonction pour sauvegarder le record dans Vercel KV ou mémoire
async function setEmailRecord(email: string, record: EmailSendRecord): Promise<void> {
  const normalizedEmail = email.toLowerCase().trim();
  
  // Essayer Vercel KV d'abord (si disponible)
  try {
    // @ts-ignore - Vercel KV peut ne pas être installé
    const { kv } = await import('@vercel/kv');
    if (kv) {
      const key = `email_send:${normalizedEmail}`;
      const RECORD_TTL = 7 * 24 * 60 * 60; // 7 jours en secondes
      await kv.set(key, record, { ex: RECORD_TTL }); // TTL de 7 jours
      return;
    }
  } catch (error) {
    // Vercel KV n'est pas disponible, utiliser la mémoire
  }
  
  // Fallback: stockage en mémoire
  emailSendRecords.set(normalizedEmail, record);
}

/**
 * Vérifie si un email peut recevoir un PDF
 * @param email L'adresse email à vérifier
 * @returns { canSend: boolean, message?: string, nextAvailableAt?: number }
 */
export async function canSendEmail(email: string): Promise<{ 
  canSend: boolean; 
  message?: string; 
  nextAvailableAt?: number;
}> {
  const normalizedEmail = email.toLowerCase().trim();
  const now = Date.now();
  
  const record = await getEmailRecord(normalizedEmail);
  
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
export async function recordEmailSend(email: string): Promise<void> {
  const normalizedEmail = email.toLowerCase().trim();
  const now = Date.now();
  
  const existingRecord = await getEmailRecord(normalizedEmail);
  const newRecord: EmailSendRecord = {
    email: normalizedEmail,
    lastSentAt: now,
    count: (existingRecord?.count || 0) + 1
  };
  
  await setEmailRecord(normalizedEmail, newRecord);
  console.log(`📧 Email send recorded for: ${normalizedEmail} at ${new Date(now).toISOString()}`);
}

/**
 * Obtient les statistiques d'envoi pour un email
 * @param email L'adresse email
 */
export async function getEmailStats(email: string): Promise<{
  count: number;
  lastSentAt: number | null;
  nextAvailableAt: number | null;
}> {
  const normalizedEmail = email.toLowerCase().trim();
  const record = await getEmailRecord(normalizedEmail);
  
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

