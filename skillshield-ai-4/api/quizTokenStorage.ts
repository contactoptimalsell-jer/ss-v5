// Stockage persistant pour les tokens de quiz
// Utilise Vercel KV en priorité, fallback vers /tmp si non configuré

import { promises as fs } from 'fs';
import { join } from 'path';

interface QuizTokenData {
  token: string;
  prospectName: string;
  prospectEmail: string;
  prospectProblem: string;
  createdAt: Date | string;
  opened: boolean;
  openedAt?: Date | string;
  completed: boolean;
  completedAt?: Date | string;
}

// Chemin du fichier de stockage (fallback)
const STORAGE_FILE = join('/tmp', 'quiz-tokens.json');
const TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 jours

// Vérifier si Vercel KV est disponible
let kv: any = null;
let kvAvailable = false;

// Initialiser Vercel KV de manière asynchrone
async function initKV() {
  if (kvAvailable) return; // Déjà initialisé
  
  try {
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      const { kv: vercelKv } = await import('@vercel/kv');
      kv = vercelKv;
      kvAvailable = true;
      console.log('✅ [quizTokenStorage] Vercel KV est disponible');
    } else {
      console.log('⚠️ [quizTokenStorage] Vercel KV non configuré, utilisation du fallback /tmp');
    }
  } catch (error) {
    console.log('⚠️ [quizTokenStorage] Vercel KV non disponible, utilisation du fallback /tmp:', error);
  }
}

// Initialiser au chargement du module
initKV().catch(console.error);

// ===== FONCTIONS VERCEL KV =====
async function getTokenFromKV(token: string): Promise<QuizTokenData | undefined> {
  await initKV(); // S'assurer que KV est initialisé
  if (!kvAvailable || !kv) return undefined;
  
  try {
    const key = `quiz-token:${token}`;
    const data = await kv.get(key);
    if (!data) return undefined;
    
    // Vérifier l'expiration
    const createdAt = typeof data.createdAt === 'string' ? new Date(data.createdAt) : data.createdAt;
    const now = new Date().getTime();
    if (now - createdAt.getTime() > TOKEN_EXPIRY_MS) {
      await kv.del(key);
      return undefined;
    }
    
    return {
      ...data,
      createdAt: createdAt,
      openedAt: data.openedAt ? (typeof data.openedAt === 'string' ? new Date(data.openedAt) : data.openedAt) : undefined,
      completedAt: data.completedAt ? (typeof data.completedAt === 'string' ? new Date(data.completedAt) : data.completedAt) : undefined,
    };
  } catch (error) {
    console.error('❌ [quizTokenStorage] Erreur KV get:', error);
    return undefined;
  }
}

async function setTokenInKV(token: string, data: QuizTokenData): Promise<void> {
  await initKV(); // S'assurer que KV est initialisé
  if (!kvAvailable || !kv) return;
  
  try {
    const key = `quiz-token:${token}`;
    await kv.set(key, {
      ...data,
      createdAt: data.createdAt instanceof Date ? data.createdAt.toISOString() : data.createdAt,
      openedAt: data.openedAt instanceof Date ? data.openedAt.toISOString() : data.openedAt,
      completedAt: data.completedAt instanceof Date ? data.completedAt.toISOString() : data.completedAt,
    });
    // Définir une expiration (7 jours)
    await kv.expire(key, 7 * 24 * 60 * 60);
    console.log(`✅ [quizTokenStorage] Token sauvegardé dans KV: ${token.substring(0, 10)}...`);
  } catch (error) {
    console.error('❌ [quizTokenStorage] Erreur KV set:', error);
  }
}

async function updateTokenInKV(token: string, updates: Partial<QuizTokenData>): Promise<void> {
  await initKV(); // S'assurer que KV est initialisé
  if (!kvAvailable || !kv) return;
  
  try {
    const existing = await getTokenFromKV(token);
    if (existing) {
      await setTokenInKV(token, { ...existing, ...updates });
    }
  } catch (error) {
    console.error('❌ [quizTokenStorage] Erreur KV update:', error);
  }
}

// ===== FONCTIONS FALLBACK /tmp =====
async function loadTokens(): Promise<Map<string, QuizTokenData>> {
  try {
    console.log(`📂 [quizTokenStorage] Chargement depuis: ${STORAGE_FILE}`);
    const data = await fs.readFile(STORAGE_FILE, 'utf-8');
    const tokens = JSON.parse(data);
    console.log(`📊 [quizTokenStorage] ${Object.keys(tokens).length} tokens chargés`);
    const map = new Map<string, QuizTokenData>();
    
    // Convertir les dates et nettoyer les tokens expirés
    const now = new Date().getTime();
    for (const [token, tokenData] of Object.entries(tokens)) {
      const data = tokenData as any;
      const createdAt = typeof data.createdAt === 'string' ? new Date(data.createdAt) : data.createdAt;
      const createdAtTime = createdAt.getTime();
      
      // Supprimer les tokens expirés
      if (now - createdAtTime > TOKEN_EXPIRY_MS) {
        continue;
      }
      
      map.set(token, {
        ...data,
        createdAt: createdAt,
        openedAt: data.openedAt ? (typeof data.openedAt === 'string' ? new Date(data.openedAt) : data.openedAt) : undefined,
        completedAt: data.completedAt ? (typeof data.completedAt === 'string' ? new Date(data.completedAt) : data.completedAt) : undefined,
      });
    }
    
    return map;
  } catch (error: any) {
    // Si le fichier n'existe pas, retourner une Map vide
    if (error.code === 'ENOENT') {
      console.log(`📂 [quizTokenStorage] Fichier n'existe pas encore: ${STORAGE_FILE}`);
      return new Map();
    }
    console.error('❌ [quizTokenStorage] Erreur lors du chargement des tokens:', error);
    return new Map();
  }
}

async function saveTokens(tokens: Map<string, QuizTokenData>): Promise<void> {
  try {
    const obj: Record<string, any> = {};
    tokens.forEach((value, key) => {
      obj[key] = {
        ...value,
        createdAt: value.createdAt instanceof Date ? value.createdAt.toISOString() : value.createdAt,
        openedAt: value.openedAt instanceof Date ? value.openedAt.toISOString() : value.openedAt,
        completedAt: value.completedAt instanceof Date ? value.completedAt.toISOString() : value.completedAt,
      };
    });
    console.log(`💾 [quizTokenStorage] Sauvegarde de ${tokens.size} tokens dans ${STORAGE_FILE}`);
    await fs.writeFile(STORAGE_FILE, JSON.stringify(obj, null, 2), 'utf-8');
    console.log(`✅ [quizTokenStorage] Tokens sauvegardés avec succès`);
  } catch (error) {
    console.error('❌ [quizTokenStorage] Erreur lors de la sauvegarde des tokens:', error);
  }
}

// Cache en mémoire pour améliorer les performances (fallback uniquement)
let tokensCache: Map<string, QuizTokenData> | null = null;
let lastCacheUpdate = 0;
const CACHE_TTL = 1000; // 1 seconde de cache

async function getTokensMap(): Promise<Map<string, QuizTokenData>> {
  const now = Date.now();
  if (tokensCache && (now - lastCacheUpdate) < CACHE_TTL) {
    return tokensCache;
  }
  
  tokensCache = await loadTokens();
  lastCacheUpdate = now;
  return tokensCache;
}

// ===== API PUBLIQUE =====
export async function getQuizTokenData(token: string): Promise<QuizTokenData | undefined> {
  // Essayer Vercel KV en premier
  if (kvAvailable) {
    const kvData = await getTokenFromKV(token);
    if (kvData) {
      console.log(`✅ [quizTokenStorage] Token trouvé dans KV: ${token.substring(0, 10)}...`);
      return kvData;
    }
  }
  
  // Fallback vers /tmp
  const tokens = await getTokensMap();
  const data = tokens.get(token);
  if (data) {
    console.log(`✅ [quizTokenStorage] Token trouvé dans /tmp: ${token.substring(0, 10)}...`);
  } else {
    console.log(`❌ [quizTokenStorage] Token non trouvé: ${token.substring(0, 10)}...`);
  }
  return data;
}

export async function setQuizTokenData(token: string, data: QuizTokenData): Promise<void> {
  console.log(`💾 [quizTokenStorage] Sauvegarde token: ${token.substring(0, 10)}... pour ${data.prospectEmail}`);
  
  // Sauvegarder dans Vercel KV si disponible
  if (kvAvailable) {
    await setTokenInKV(token, data);
  }
  
  // Sauvegarder aussi dans /tmp (fallback)
  const tokens = await getTokensMap();
  tokens.set(token, data);
  await saveTokens(tokens);
  tokensCache = tokens; // Mettre à jour le cache
  console.log(`✅ [quizTokenStorage] Token sauvegardé avec succès`);
}

export async function updateQuizToken(token: string, updates: Partial<QuizTokenData>): Promise<void> {
  // Mettre à jour dans Vercel KV si disponible
  if (kvAvailable) {
    await updateTokenInKV(token, updates);
  }
  
  // Mettre à jour aussi dans /tmp (fallback)
  const tokens = await getTokensMap();
  const existing = tokens.get(token);
  if (existing) {
    tokens.set(token, { ...existing, ...updates });
    await saveTokens(tokens);
    tokensCache = tokens; // Mettre à jour le cache
  }
}

export async function deleteQuizToken(token: string): Promise<void> {
  // Supprimer de Vercel KV si disponible
  if (kvAvailable && kv) {
    try {
      await kv.del(`quiz-token:${token}`);
    } catch (error) {
      console.error('❌ [quizTokenStorage] Erreur KV delete:', error);
    }
  }
  
  // Supprimer aussi de /tmp (fallback)
  const tokens = await getTokensMap();
  tokens.delete(token);
  await saveTokens(tokens);
  tokensCache = tokens; // Mettre à jour le cache
}
