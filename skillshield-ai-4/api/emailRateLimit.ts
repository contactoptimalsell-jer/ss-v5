// Système de rate limiting pour les envois d'email
// Limite : 1 envoi par email, possibilité de renvoyer après 24h

import { promises as fs } from 'fs';
import { join } from 'path';

interface EmailSendRecord {
  email: string;
  lastSentAt: number;
  count: number;
}

interface EmailRecordsCache {
  records: Record<string, EmailSendRecord>;
  lastCleanup: number;
}

// Stockage en mémoire (cache rapide)
const emailSendRecords = new Map<string, EmailSendRecord>();

// Fichier de cache persistant
const CACHE_FILE_PATH = join('/tmp', 'email-rate-limit-cache.json');
const CLEANUP_INTERVAL_MS = 7 * 24 * 60 * 60 * 1000; // 7 jours

const RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000; // 24 heures

// Charger le cache depuis le fichier
async function loadCache(): Promise<EmailRecordsCache> {
  try {
    const data = await fs.readFile(CACHE_FILE_PATH, 'utf-8');
    const cache: EmailRecordsCache = JSON.parse(data);
    
    // Nettoyer les anciens enregistrements
    const now = Date.now();
    const cleanedRecords: Record<string, EmailSendRecord> = {};
    
    for (const [email, record] of Object.entries(cache.records)) {
      if (now - record.lastSentAt < CLEANUP_INTERVAL_MS) {
        cleanedRecords[email] = record;
      }
    }
    
    // Mettre à jour le cache en mémoire
    emailSendRecords.clear();
    Object.entries(cleanedRecords).forEach(([email, record]) => {
      emailSendRecords.set(email, record);
    });
    
    return {
      records: cleanedRecords,
      lastCleanup: now
    };
  } catch (error) {
    // Fichier n'existe pas ou erreur de lecture, retourner un cache vide
    console.log('📁 Cache file not found or error reading, starting fresh');
    return {
      records: {},
      lastCleanup: Date.now()
    };
  }
}

// Sauvegarder le cache dans le fichier
async function saveCache(): Promise<void> {
  try {
    const cache: EmailRecordsCache = {
      records: Object.fromEntries(emailSendRecords.entries()),
      lastCleanup: Date.now()
    };
    
    await fs.writeFile(CACHE_FILE_PATH, JSON.stringify(cache, null, 2), 'utf-8');
    console.log(`💾 Cache saved to ${CACHE_FILE_PATH}`);
  } catch (error) {
    console.error('❌ Error saving cache:', error);
    // Ne pas faire échouer la requête si on ne peut pas sauvegarder le cache
  }
}

// Initialiser le cache au chargement du module
let cacheInitialized = false;
async function ensureCacheLoaded() {
  if (!cacheInitialized) {
    await loadCache();
    cacheInitialized = true;
  }
}

// Fonction pour obtenir le record depuis Vercel KV, fichier cache ou mémoire
async function getEmailRecord(email: string): Promise<EmailSendRecord | null> {
  const normalizedEmail = email.toLowerCase().trim();
  
  // Essayer Vercel KV d'abord (si disponible)
  try {
    // @ts-ignore - Vercel KV peut ne pas être installé
    const { kv } = await import('@vercel/kv');
    if (kv) {
      const key = `email_send:${normalizedEmail}`;
      const record = await kv.get<EmailSendRecord>(key);
      if (record) {
        console.log(`📦 Found record in Vercel KV for ${normalizedEmail}`);
        return record;
      }
    }
  } catch (error) {
    // Vercel KV n'est pas disponible, continuer avec le cache fichier
  }
  
  // Charger le cache depuis le fichier si nécessaire
  await ensureCacheLoaded();
  
  // Chercher dans le cache mémoire (qui est synchronisé avec le fichier)
  const record = emailSendRecords.get(normalizedEmail);
  if (record) {
    console.log(`📁 Found record in file cache for ${normalizedEmail}`);
  }
  
  return record || null;
}

// Fonction pour sauvegarder le record dans Vercel KV, fichier cache ou mémoire
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
      console.log(`💾 Saved record to Vercel KV for ${normalizedEmail}`);
      return;
    }
  } catch (error) {
    // Vercel KV n'est pas disponible, utiliser le cache fichier
  }
  
  // Charger le cache depuis le fichier si nécessaire
  await ensureCacheLoaded();
  
  // Sauvegarder dans le cache mémoire
  emailSendRecords.set(normalizedEmail, record);
  
  // Sauvegarder dans le fichier (de manière asynchrone pour ne pas bloquer)
  saveCache().catch(err => {
    console.error('Error saving cache file:', err);
  });
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
  
  console.log(`🔍 Checking rate limit for: ${normalizedEmail}`);
  console.log(`📊 Current memory records count: ${emailSendRecords.size}`);
  console.log(`📋 Memory records:`, Array.from(emailSendRecords.entries()));
  
  const record = await getEmailRecord(normalizedEmail);
  
  console.log(`📧 Record found for ${normalizedEmail}:`, record);
  
  if (!record) {
    // Premier envoi, autorisé
    console.log(`✅ First send for ${normalizedEmail}, allowing`);
    return { canSend: true };
  }
  
  const timeSinceLastSend = now - record.lastSentAt;
  console.log(`⏰ Time since last send: ${timeSinceLastSend}ms (${Math.round(timeSinceLastSend / (60 * 60 * 1000))} hours)`);
  console.log(`⏳ Rate limit window: ${RATE_LIMIT_WINDOW}ms (24 hours)`);
  
  if (timeSinceLastSend < RATE_LIMIT_WINDOW) {
    // Moins de 24h depuis le dernier envoi
    const hoursRemaining = Math.ceil((RATE_LIMIT_WINDOW - timeSinceLastSend) / (60 * 60 * 1000));
    const nextAvailableAt = record.lastSentAt + RATE_LIMIT_WINDOW;
    
    console.log(`❌ Rate limit exceeded for ${normalizedEmail}. Hours remaining: ${hoursRemaining}`);
    
    return {
      canSend: false,
      message: `Un PDF a déjà été envoyé à cette adresse. Vous pourrez renvoyer dans ${hoursRemaining} heure${hoursRemaining > 1 ? 's' : ''}.`,
      nextAvailableAt
    };
  }
  
  // Plus de 24h, autorisé
  console.log(`✅ More than 24h passed for ${normalizedEmail}, allowing`);
  return { canSend: true };
}

/**
 * Enregistre un envoi d'email
 * @param email L'adresse email
 */
export async function recordEmailSend(email: string): Promise<void> {
  const normalizedEmail = email.toLowerCase().trim();
  const now = Date.now();
  
  console.log(`💾 Recording email send for: ${normalizedEmail}`);
  console.log(`📊 Memory records before: ${emailSendRecords.size}`);
  
  const existingRecord = await getEmailRecord(normalizedEmail);
  console.log(`📋 Existing record:`, existingRecord);
  
  const newRecord: EmailSendRecord = {
    email: normalizedEmail,
    lastSentAt: now,
    count: (existingRecord?.count || 0) + 1
  };
  
  await setEmailRecord(normalizedEmail, newRecord);
  console.log(`✅ Email send recorded for: ${normalizedEmail} at ${new Date(now).toISOString()}`);
  console.log(`📊 Memory records after: ${emailSendRecords.size}`);
  console.log(`📋 New record:`, newRecord);
  console.log(`📋 All records in memory:`, Array.from(emailSendRecords.entries()));
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

