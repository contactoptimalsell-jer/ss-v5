// Stockage persistant pour les tokens de quiz
// Utilise Supabase en priorité, fallback vers /tmp si non configuré

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

// Initialiser Supabase
let supabase: any = null;
let supabaseAvailable = false;

async function initSupabase() {
  if (supabaseAvailable) return; // Déjà initialisé
  
  try {
    const supabaseUrl = process.env.STORAGE_SS_SUPABASE_URL;
    const supabaseKey = process.env.STORAGE_SS_SUPABASE_SERVICE_ROLE_KEY;
    
    if (supabaseUrl && supabaseKey) {
      const { createClient } = await import('@supabase/supabase-js');
      supabase = createClient(supabaseUrl, supabaseKey);
      supabaseAvailable = true;
      console.log('✅ [quizTokenStorage] Supabase est disponible');
      
      // Créer la table si elle n'existe pas (via une requête de test)
      await ensureTableExists();
    } else {
      console.log('⚠️ [quizTokenStorage] Supabase non configuré, utilisation du fallback /tmp');
    }
  } catch (error) {
    console.log('⚠️ [quizTokenStorage] Supabase non disponible, utilisation du fallback /tmp:', error);
  }
}

// S'assurer que la table existe (création automatique via RPC ou vérification)
async function ensureTableExists() {
  if (!supabaseAvailable || !supabase) return;
  
  try {
    // Vérifier si la table existe en essayant une requête simple
    const { error } = await supabase
      .from('quiz_tokens')
      .select('token')
      .limit(1);
    
    // Si l'erreur indique que la table n'existe pas, on la créera manuellement
    // Pour l'instant, on suppose qu'elle existe ou sera créée via Supabase Dashboard
    if (error && error.code === 'PGRST116') {
      console.log('⚠️ [quizTokenStorage] Table quiz_tokens n\'existe pas. Créez-la dans Supabase Dashboard.');
    }
  } catch (error) {
    console.log('⚠️ [quizTokenStorage] Erreur vérification table:', error);
  }
}

// Initialiser au chargement du module
initSupabase().catch(console.error);

// ===== FONCTIONS SUPABASE =====
async function getTokenFromSupabase(token: string): Promise<QuizTokenData | undefined> {
  await initSupabase();
  if (!supabaseAvailable || !supabase) return undefined;
  
  try {
    const { data, error } = await supabase
      .from('quiz_tokens')
      .select('*')
      .eq('token', token)
      .single();
    
    if (error || !data) {
      console.log(`❌ [quizTokenStorage] Token non trouvé dans Supabase: ${token.substring(0, 10)}...`);
      return undefined;
    }
    
    // Vérifier l'expiration
    const createdAt = typeof data.created_at === 'string' ? new Date(data.created_at) : new Date(data.created_at);
    const now = new Date().getTime();
    if (now - createdAt.getTime() > TOKEN_EXPIRY_MS) {
      await supabase.from('quiz_tokens').delete().eq('token', token);
      console.log(`⏰ [quizTokenStorage] Token expiré supprimé: ${token.substring(0, 10)}...`);
      return undefined;
    }
    
    console.log(`✅ [quizTokenStorage] Token trouvé dans Supabase: ${token.substring(0, 10)}...`);
    return {
      token: data.token,
      prospectName: data.prospect_name,
      prospectEmail: data.prospect_email,
      prospectProblem: data.prospect_problem || '',
      createdAt: createdAt,
      opened: data.opened || false,
      openedAt: data.opened_at ? (typeof data.opened_at === 'string' ? new Date(data.opened_at) : new Date(data.opened_at)) : undefined,
      completed: data.completed || false,
      completedAt: data.completed_at ? (typeof data.completed_at === 'string' ? new Date(data.completed_at) : new Date(data.completed_at)) : undefined,
    };
  } catch (error) {
    console.error('❌ [quizTokenStorage] Erreur Supabase get:', error);
    return undefined;
  }
}

async function setTokenInSupabase(token: string, data: QuizTokenData): Promise<void> {
  await initSupabase();
  if (!supabaseAvailable || !supabase) return;
  
  try {
    const { error } = await supabase
      .from('quiz_tokens')
      .upsert({
        token: data.token,
        prospect_name: data.prospectName,
        prospect_email: data.prospectEmail,
        prospect_problem: data.prospectProblem,
        created_at: data.createdAt instanceof Date ? data.createdAt.toISOString() : data.createdAt,
        opened: data.opened,
        opened_at: data.openedAt instanceof Date ? data.openedAt.toISOString() : data.openedAt || null,
        completed: data.completed,
        completed_at: data.completedAt instanceof Date ? data.completedAt.toISOString() : data.completedAt || null,
      }, {
        onConflict: 'token'
      });
    
    if (error) {
      console.error('❌ [quizTokenStorage] Erreur Supabase set:', error);
    } else {
      console.log(`✅ [quizTokenStorage] Token sauvegardé dans Supabase: ${token.substring(0, 10)}...`);
    }
  } catch (error) {
    console.error('❌ [quizTokenStorage] Erreur Supabase set:', error);
  }
}

async function updateTokenInSupabase(token: string, updates: Partial<QuizTokenData>): Promise<void> {
  await initSupabase();
  if (!supabaseAvailable || !supabase) return;
  
  try {
    const updateData: any = {};
    
    if (updates.opened !== undefined) updateData.opened = updates.opened;
    if (updates.openedAt !== undefined) {
      updateData.opened_at = updates.openedAt instanceof Date ? updates.openedAt.toISOString() : updates.openedAt;
    }
    if (updates.completed !== undefined) updateData.completed = updates.completed;
    if (updates.completedAt !== undefined) {
      updateData.completed_at = updates.completedAt instanceof Date ? updates.completedAt.toISOString() : updates.completedAt;
    }
    
    const { error } = await supabase
      .from('quiz_tokens')
      .update(updateData)
      .eq('token', token);
    
    if (error) {
      console.error('❌ [quizTokenStorage] Erreur Supabase update:', error);
    }
  } catch (error) {
    console.error('❌ [quizTokenStorage] Erreur Supabase update:', error);
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
  // Essayer Supabase en premier
  if (supabaseAvailable) {
    const supabaseData = await getTokenFromSupabase(token);
    if (supabaseData) {
      return supabaseData;
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
  
  // Sauvegarder dans Supabase si disponible
  if (supabaseAvailable) {
    await setTokenInSupabase(token, data);
  }
  
  // Sauvegarder aussi dans /tmp (fallback)
  const tokens = await getTokensMap();
  tokens.set(token, data);
  await saveTokens(tokens);
  tokensCache = tokens; // Mettre à jour le cache
  console.log(`✅ [quizTokenStorage] Token sauvegardé avec succès`);
}

export async function updateQuizToken(token: string, updates: Partial<QuizTokenData>): Promise<void> {
  // Mettre à jour dans Supabase si disponible
  if (supabaseAvailable) {
    await updateTokenInSupabase(token, updates);
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
  // Supprimer de Supabase si disponible
  if (supabaseAvailable && supabase) {
    try {
      await supabase.from('quiz_tokens').delete().eq('token', token);
    } catch (error) {
      console.error('❌ [quizTokenStorage] Erreur Supabase delete:', error);
    }
  }
  
  // Supprimer aussi de /tmp (fallback)
  const tokens = await getTokensMap();
  tokens.delete(token);
  await saveTokens(tokens);
  tokensCache = tokens; // Mettre à jour le cache
}
