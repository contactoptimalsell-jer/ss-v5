// Stockage persistant pour les tokens de quiz
// Utilise le système de fichiers /tmp pour persister entre les requêtes
// En production, remplacer par Vercel KV ou une base de données

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

// Chemin du fichier de stockage
const STORAGE_FILE = join('/tmp', 'quiz-tokens.json');
const TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 jours

// Charger les tokens depuis le fichier
async function loadTokens(): Promise<Map<string, QuizTokenData>> {
  try {
    const data = await fs.readFile(STORAGE_FILE, 'utf-8');
    const tokens = JSON.parse(data);
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
      return new Map();
    }
    console.error('Erreur lors du chargement des tokens:', error);
    return new Map();
  }
}

// Sauvegarder les tokens dans le fichier
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
    await fs.writeFile(STORAGE_FILE, JSON.stringify(obj, null, 2), 'utf-8');
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des tokens:', error);
    // Ne pas throw pour éviter de bloquer l'application
  }
}

// Cache en mémoire pour améliorer les performances
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

export async function getQuizTokenData(token: string): Promise<QuizTokenData | undefined> {
  const tokens = await getTokensMap();
  return tokens.get(token);
}

export async function setQuizTokenData(token: string, data: QuizTokenData): Promise<void> {
  const tokens = await getTokensMap();
  tokens.set(token, data);
  await saveTokens(tokens);
  tokensCache = tokens; // Mettre à jour le cache
}

export async function updateQuizToken(token: string, updates: Partial<QuizTokenData>): Promise<void> {
  const tokens = await getTokensMap();
  const existing = tokens.get(token);
  if (existing) {
    tokens.set(token, { ...existing, ...updates });
    await saveTokens(tokens);
    tokensCache = tokens; // Mettre à jour le cache
  }
}

export async function deleteQuizToken(token: string): Promise<void> {
  const tokens = await getTokensMap();
  tokens.delete(token);
  await saveTokens(tokens);
  tokensCache = tokens; // Mettre à jour le cache
}
