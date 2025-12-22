// Stockage partagé pour les tokens de quiz
// En production, remplacer par une base de données (Vercel KV, PostgreSQL, etc.)

interface QuizTokenData {
  token: string;
  prospectName: string;
  prospectEmail: string;
  prospectProblem: string;
  createdAt: Date;
  opened: boolean;
  openedAt?: Date;
  completed: boolean;
  completedAt?: Date;
}

// Stockage en mémoire (temporaire - à remplacer par une DB en production)
const quizTokens = new Map<string, QuizTokenData>();

export function getQuizTokenData(token: string): QuizTokenData | undefined {
  return quizTokens.get(token);
}

export function setQuizTokenData(token: string, data: QuizTokenData): void {
  quizTokens.set(token, data);
}

export function updateQuizToken(token: string, updates: Partial<QuizTokenData>): void {
  const existing = quizTokens.get(token);
  if (existing) {
    quizTokens.set(token, { ...existing, ...updates });
  }
}

export function deleteQuizToken(token: string): void {
  quizTokens.delete(token);
}

