import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2, CheckCircle2, FileText, Mail, User, MessageSquare, Sparkles } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

interface QuizPageProps {
  onNavigateHome: () => void;
}

export const QuizPage: React.FC<QuizPageProps> = ({ onNavigateHome }) => {
  const [prospectName, setProspectName] = useState('');
  const [prospectEmail, setProspectEmail] = useState('');
  const [prospectProblem, setProspectProblem] = useState('');
  const [sendingQuiz, setSendingQuiz] = useState(false);
  const [quizSent, setQuizSent] = useState(false);
  const [quizError, setQuizError] = useState<string | null>(null);

  const handleSendQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prospectEmail || !prospectName) return;

    setSendingQuiz(true);
    setQuizError(null);
    setQuizSent(false);

    try {
      const response = await fetch('/api/send-quiz-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: prospectEmail,
          prospectName: prospectName,
          prospectProblem: prospectProblem,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          const nextAvailableAt = data.nextAvailableAt ? new Date(data.nextAvailableAt) : null;
          const hoursRemaining = nextAvailableAt
            ? Math.ceil((nextAvailableAt.getTime() - Date.now()) / (60 * 60 * 1000))
            : 24;
          throw new Error(data.message || `Un quiz a déjà été envoyé à cette adresse. Vous pourrez renvoyer dans ${hoursRemaining} heure${hoursRemaining > 1 ? 's' : ''}.`);
        }
        throw new Error(data.message || `HTTP ${response.status}`);
      }

      setQuizSent(true);
      setQuizError(null);
    } catch (error: any) {
      console.error('Error sending quiz:', error);
      setQuizError(error.message || 'Erreur lors de l\'envoi du quiz');
      setQuizSent(false);
    } finally {
      setSendingQuiz(false);
    }
  };

  return (
    <div className="min-h-screen bg-midnight text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-midnight/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={onNavigateHome}
            className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-2"
          >
            ← Retour à l'accueil
          </button>
          <div className="text-sm text-gray-400">
            Envoi de Quiz Personnalisé
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-display text-white mb-4">
            Envoyez un <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Quiz Personnalisé</span>
          </h1>
          <p className="text-gray-300 text-lg">
            Envoyez un quiz personnalisé à vos prospects pour identifier leurs besoins et préparer votre rendez-vous
          </p>
        </div>

        <Card className="border-violet-500/30" highlight>
          <form onSubmit={handleSendQuiz} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Nom du prospect
              </label>
              <input
                type="text"
                value={prospectName}
                onChange={(e) => setProspectName(e.target.value)}
                placeholder="Ex: Jean Dupont"
                className="w-full px-4 py-3 bg-slate-800/50 border border-violet-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Email du prospect
              </label>
              <input
                type="email"
                value={prospectEmail}
                onChange={(e) => setProspectEmail(e.target.value)}
                placeholder="Ex: jean.dupont@example.com"
                className="w-full px-4 py-3 bg-slate-800/50 border border-violet-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Contexte / Situation du prospect <span className="text-gray-500 text-xs">(optionnel)</span>
              </label>
              <textarea
                value={prospectProblem}
                onChange={(e) => setProspectProblem(e.target.value)}
                placeholder="Décrivez brièvement le contexte ou la situation du prospect (ex: Dirigeant d'une agence immobilière à Lyon, perd du temps avec la gestion des leads)"
                rows={4}
                className="w-full px-4 py-3 bg-slate-800/50 border border-violet-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 resize-none"
              />
            </div>

            <Button
              type="submit"
              disabled={sendingQuiz || !prospectEmail || !prospectName}
              className="w-full"
            >
              {sendingQuiz ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Envoyer le quiz personnalisé
                </>
              )}
            </Button>
          </form>
        </Card>

        {/* Confirmation */}
        {quizSent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <Card className="border-green-500/30">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6 text-green-400" />
                <h2 className="text-2xl font-bold text-white">Quiz envoyé avec succès !</h2>
              </div>
              <p className="text-gray-300 mb-2">
                Un email avec un lien vers le quiz personnalisé a été envoyé à <strong className="text-white">{prospectName}</strong> ({prospectEmail}).
              </p>
              <p className="text-sm text-gray-400">
                Vous recevrez un email récapitulatif à info@skillshield-ai.com une fois que le prospect aura complété le quiz.
              </p>
            </Card>
          </motion.div>
        )}

        {quizError && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <Card className="border-red-500/30">
              <div className="flex items-start gap-2">
                <span className="text-red-400 font-bold">⚠️</span>
                <div>
                  <p className="text-red-300 font-semibold mb-1">Impossible d'envoyer le quiz</p>
                  <p className="text-red-400 text-sm">{quizError}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

