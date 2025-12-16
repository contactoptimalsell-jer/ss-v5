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

// Stockage en mémoire (cache rapide - fallback uniquement)
const emailSendRecords = new Map<string, EmailSendRecord>();

// Fichier de cache persistant (fallback si Vercel KV n'est pas disponible)
const CACHE_FILE_PATH = join('/tmp', 'email-rate-limit-cache.json');
const CLEANUP_INTERVAL_MS = 7 * 24 * 60 * 60 * 1000; // 7 jours

const RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000; // 24 heures

// Vérifier si les variables d'environnement Supabase sont configurées
function hasSupabaseConfig(): boolean {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  return !!(supabaseUrl && supabaseKey);
}

// Utiliser l'API REST de Supabase directement (évite les problèmes de modules ES)
async function supabaseRequest(endpoint: string, method: string = 'GET', body?: any): Promise<{ data: any; error: any }> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    return { data: null, error: { message: 'Supabase not configured' } };
  }
  
  try {
    const url = `${supabaseUrl}/rest/v1/${endpoint}`;
    const response = await fetch(url, {
      method,
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: body ? JSON.stringify(body) : undefined
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      return { 
        data: null, 
        error: { 
          message: `HTTP ${response.status}: ${errorText}`,
          code: response.status === 404 ? 'PGRST116' : undefined
        } 
      };
    }
    
    const data = await response.json();
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: { message: error.message } };
  }
}

// Vérifier si Supabase est disponible
async function isSupabaseAvailable(): Promise<boolean> {
  if (!hasSupabaseConfig()) {
    return false;
  }
  
  try {
    const { error } = await supabaseRequest('email_rate_limits?select=count&limit=1');
    // Si la table n'existe pas, on retourne false mais on pourra la créer
    if (error && error.code !== 'PGRST116') {
      console.log(`⚠️ Supabase connection issue: ${error.message}`);
      return false;
    }
    return true;
  } catch (error: any) {
    console.log(`⚠️ Supabase not available: ${error.message}`);
    return false;
  }
}

// Charger le cache depuis le fichier
async function loadCache(): Promise<EmailRecordsCache> {
  try {
    console.log(`📂 Attempting to load cache from: ${CACHE_FILE_PATH}`);
    const data = await fs.readFile(CACHE_FILE_PATH, 'utf-8');
    const cache: EmailRecordsCache = JSON.parse(data);
    
    console.log(`📦 Cache file loaded, records count: ${Object.keys(cache.records).length}`);
    
    // Nettoyer les anciens enregistrements
    const now = Date.now();
    const cleanedRecords: Record<string, EmailSendRecord> = {};
    
    for (const [email, record] of Object.entries(cache.records)) {
      const age = now - record.lastSentAt;
      if (age < CLEANUP_INTERVAL_MS) {
        cleanedRecords[email] = record;
      } else {
        console.log(`🗑️ Removing old record for ${email} (age: ${Math.round(age / (24 * 60 * 60 * 1000))} days)`);
      }
    }
    
    // Mettre à jour le cache en mémoire
    emailSendRecords.clear();
    Object.entries(cleanedRecords).forEach(([email, record]) => {
      emailSendRecords.set(email, record);
    });
    
    console.log(`✅ Cache loaded into memory: ${emailSendRecords.size} records`);
    
    return {
      records: cleanedRecords,
      lastCleanup: now
    };
  } catch (error: any) {
    // Fichier n'existe pas ou erreur de lecture, retourner un cache vide
    console.log(`📁 Cache file not found or error reading (${error.message}), starting fresh`);
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
let cacheLoadingPromise: Promise<void> | null = null;

async function ensureCacheLoaded() {
  // Si le cache est déjà initialisé, retourner immédiatement
  if (cacheInitialized) {
    return;
  }
  
  // Si un chargement est déjà en cours, attendre qu'il se termine
  if (cacheLoadingPromise) {
    await cacheLoadingPromise;
    return;
  }
  
  // Démarrer le chargement du cache
  cacheLoadingPromise = (async () => {
    try {
      console.log('📂 Loading cache from file...');
      await loadCache();
      cacheInitialized = true;
      console.log(`✅ Cache loaded. Records in memory: ${emailSendRecords.size}`);
    } catch (error) {
      console.error('❌ Error loading cache:', error);
      // Même en cas d'erreur, on marque comme initialisé pour éviter les boucles infinies
      cacheInitialized = true;
    } finally {
      cacheLoadingPromise = null;
    }
  })();
  
  await cacheLoadingPromise;
}

// Fonction pour obtenir le record depuis Supabase, fichier cache ou mémoire
async function getEmailRecord(email: string): Promise<EmailSendRecord | null> {
  const normalizedEmail = email.toLowerCase().trim();
  
  // PRIORITÉ 1: Supabase (persistant et partagé entre toutes les instances)
  const supabaseAvailable = await isSupabaseAvailable();
  if (supabaseAvailable) {
    try {
      const { data, error } = await supabaseRequest(
        `email_rate_limits?email=eq.${encodeURIComponent(normalizedEmail)}&select=*`
      );
      
      if (error && error.code !== 'PGRST116') {
        console.error(`❌ Error reading from Supabase:`, error.message);
      } else if (data && Array.isArray(data) && data.length > 0) {
        const recordData = data[0];
        const record: EmailSendRecord = {
          email: recordData.email,
          lastSentAt: recordData.last_sent_at,
          count: recordData.count
        };
        console.log(`📦 Found record in Supabase for ${normalizedEmail}:`, record);
        return record;
      }
      console.log(`📦 No record in Supabase for ${normalizedEmail}`);
    } catch (error: any) {
      console.error(`❌ Error reading from Supabase:`, error.message);
      // Continuer avec le fallback
    }
  }
  
  // PRIORITÉ 2: Cache fichier (fallback si Vercel KV n'est pas disponible)
  try {
    await ensureCacheLoaded();
    const record = emailSendRecords.get(normalizedEmail);
    if (record) {
      console.log(`📁 Found record in file cache for ${normalizedEmail}:`, record);
      return record;
    }
    console.log(`📁 No record in file cache for ${normalizedEmail}`);
  } catch (error: any) {
    console.error(`❌ Error reading from file cache:`, error.message);
  }
  
  return null;
}

// Fonction pour sauvegarder le record dans Supabase, fichier cache ou mémoire
async function setEmailRecord(email: string, record: EmailSendRecord): Promise<void> {
  const normalizedEmail = email.toLowerCase().trim();
  
  // PRIORITÉ 1: Supabase (persistant et partagé entre toutes les instances)
  const supabaseAvailable = await isSupabaseAvailable();
  if (supabaseAvailable) {
    try {
      // Vérifier d'abord si l'enregistrement existe
      const { data: existingData, error: checkError } = await supabaseRequest(
        `email_rate_limits?email=eq.${encodeURIComponent(normalizedEmail)}&select=email`
      );
      
      if (checkError && checkError.code !== 'PGRST116') {
        console.error(`❌ Error checking Supabase:`, checkError.message);
      } else if (existingData && Array.isArray(existingData) && existingData.length > 0) {
        // L'enregistrement existe, faire un PATCH (mise à jour)
        const { error: patchError } = await supabaseRequest(
          `email_rate_limits?email=eq.${encodeURIComponent(normalizedEmail)}`,
          'PATCH',
          {
            last_sent_at: record.lastSentAt,
            count: record.count,
            updated_at: new Date().toISOString()
          }
        );
        
        if (patchError) {
          console.error(`❌ Error updating Supabase:`, patchError.message);
        } else {
          console.log(`💾 Updated record in Supabase for ${normalizedEmail}`);
          return; // Succès
        }
      } else {
        // L'enregistrement n'existe pas, faire un POST (création)
        const { error: postError } = await supabaseRequest(
          'email_rate_limits',
          'POST',
          {
            email: normalizedEmail,
            last_sent_at: record.lastSentAt,
            count: record.count,
            updated_at: new Date().toISOString()
          }
        );
        
        if (postError) {
          console.error(`❌ Error creating in Supabase:`, postError.message);
        } else {
          console.log(`💾 Created record in Supabase for ${normalizedEmail}`);
          return; // Succès
        }
      }
    } catch (error: any) {
      console.error(`❌ Error saving to Supabase:`, error.message);
      // Continuer avec le fallback
    }
  }
  
  // PRIORITÉ 2: Cache fichier (fallback si Vercel KV n'est pas disponible)
  try {
    await ensureCacheLoaded();
    emailSendRecords.set(normalizedEmail, record);
    
    // Sauvegarder dans le fichier (de manière asynchrone pour ne pas bloquer)
    saveCache().catch(err => {
      console.error('❌ Error saving cache file:', err);
    });
    
    console.log(`💾 Saved record to file cache for ${normalizedEmail}`);
  } catch (error: any) {
    console.error(`❌ Error saving to file cache:`, error.message);
  }
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
  
  // IMPORTANT: Charger le cache AVANT la vérification
  await ensureCacheLoaded();
  
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
  const hoursSinceLastSend = timeSinceLastSend / (60 * 60 * 1000);
  console.log(`⏰ Time since last send: ${timeSinceLastSend}ms (${hoursSinceLastSend.toFixed(2)} hours)`);
  console.log(`⏳ Rate limit window: ${RATE_LIMIT_WINDOW}ms (24 hours)`);
  console.log(`🔢 Comparison: ${timeSinceLastSend} < ${RATE_LIMIT_WINDOW} = ${timeSinceLastSend < RATE_LIMIT_WINDOW}`);
  
  if (timeSinceLastSend < RATE_LIMIT_WINDOW) {
    // Moins de 24h depuis le dernier envoi
    const hoursRemaining = Math.ceil((RATE_LIMIT_WINDOW - timeSinceLastSend) / (60 * 60 * 1000));
    const nextAvailableAt = record.lastSentAt + RATE_LIMIT_WINDOW;
    
    console.log(`❌ Rate limit exceeded for ${normalizedEmail}. Hours remaining: ${hoursRemaining}`);
    console.log(`🚫 BLOCKING send for ${normalizedEmail}`);
    
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
 * Tente de verrouiller un email pour l'envoi (atomique)
 * Retourne success: false si l'email a déjà été envoyé récemment
 */
export async function tryLockEmail(email: string): Promise<{
  success: boolean;
  hoursRemaining?: number;
  nextAvailableAt?: number;
}> {
  const normalizedEmail = email.toLowerCase().trim();
  const now = Date.now();
  
  // Charger le cache AVANT la vérification
  await ensureCacheLoaded();
  
  console.log(`🔒 Attempting to lock email: ${normalizedEmail}`);
  console.log(`📊 Memory records before lock: ${emailSendRecords.size}`);
  
  const existingRecord = await getEmailRecord(normalizedEmail);
  
  if (existingRecord) {
    const timeSinceLastSend = now - existingRecord.lastSentAt;
    console.log(`⏰ Time since last send: ${timeSinceLastSend}ms`);
    
    if (timeSinceLastSend < RATE_LIMIT_WINDOW) {
      // Moins de 24h, refuser le verrouillage
      const hoursRemaining = Math.ceil((RATE_LIMIT_WINDOW - timeSinceLastSend) / (60 * 60 * 1000));
      const nextAvailableAt = existingRecord.lastSentAt + RATE_LIMIT_WINDOW;
      
      console.log(`❌ Email already sent recently, lock failed. Hours remaining: ${hoursRemaining}`);
      return {
        success: false,
        hoursRemaining,
        nextAvailableAt
      };
    }
  }
  
  // Enregistrer immédiatement (verrouillage atomique)
  const newRecord: EmailSendRecord = {
    email: normalizedEmail,
    lastSentAt: now,
    count: (existingRecord?.count || 0) + 1
  };
  
  await setEmailRecord(normalizedEmail, newRecord);
  console.log(`✅ Email locked successfully for: ${normalizedEmail} at ${new Date(now).toISOString()}`);
  console.log(`📊 Memory records after lock: ${emailSendRecords.size}`);
  
  return { success: true };
}

/**
 * Enregistre un envoi d'email (déprécié, utiliser tryLockEmail à la place)
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

