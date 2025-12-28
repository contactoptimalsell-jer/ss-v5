import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2, CheckCircle2, FileText, Mail, User, MessageSquare, Sparkles, Search, Building2, Target } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

interface QuizPageProps {
  onNavigateHome: () => void;
}

interface ProspectEmail {
  email: string;
  companyName: string;
  name?: string;
}

export const QuizPage: React.FC<QuizPageProps> = ({ onNavigateHome }) => {
  const [prospectName, setProspectName] = useState('');
  const [prospectEmail, setProspectEmail] = useState('');
  const [prospectProblem, setProspectProblem] = useState('');
  const [sendingQuiz, setSendingQuiz] = useState(false);
  const [quizSent, setQuizSent] = useState(false);
  const [quizError, setQuizError] = useState<string | null>(null);
  
  // États pour la prospection automatisée
  const [automatedMode, setAutomatedMode] = useState(false);
  const [category, setCategory] = useState('');
  const [sector, setSector] = useState('');
  const [searchingEmails, setSearchingEmails] = useState(false);
  const [sendingBulk, setSendingBulk] = useState(false);
  const [foundEmails, setFoundEmails] = useState<ProspectEmail[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [bulkResults, setBulkResults] = useState<{ sent: number; failed: number } | null>(null);

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

  const handleSearchEmails = async () => {
    if (!category || !sector) return;

    setSearchingEmails(true);
    setSearchError(null);
    setFoundEmails([]);

    try {
      const response = await fetch('/api/prospection-automation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'search',
          category,
          sector,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la recherche d\'emails');
      }

      setFoundEmails(data.emails || []);
      if (data.emails && data.emails.length === 0) {
        setSearchError('Aucun email trouvé pour cette catégorie et ce secteur.');
      }
    } catch (error: any) {
      console.error('Error searching emails:', error);
      setSearchError(error.message || 'Erreur lors de la recherche d\'emails');
    } finally {
      setSearchingEmails(false);
    }
  };

  const handleSendBulkQuizzes = async () => {
    if (foundEmails.length === 0) return;

    setSendingBulk(true);
    setBulkResults(null);

    try {
      const response = await fetch('/api/prospection-automation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'send',
          prospects: foundEmails,
          category,
          sector,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'envoi en masse');
      }

      setBulkResults({
        sent: data.sent || 0,
        failed: data.failed || 0,
      });
    } catch (error: any) {
      console.error('Error sending bulk quizzes:', error);
      setSearchError(error.message || 'Erreur lors de l\'envoi en masse');
    } finally {
      setSendingBulk(false);
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

        {/* Toggle entre mode manuel et automatisé */}
        <div className="flex justify-center mb-8">
          <div className="bg-slate-800/50 rounded-lg p-1 flex gap-2">
            <button
              type="button"
              onClick={() => setAutomatedMode(false)}
              className={`px-6 py-2 rounded-md font-semibold transition-all ${
                !automatedMode
                  ? 'bg-violet-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <User className="w-4 h-4 inline mr-2" />
              Manuel
            </button>
            <button
              type="button"
              onClick={() => setAutomatedMode(true)}
              className={`px-6 py-2 rounded-md font-semibold transition-all ${
                automatedMode
                  ? 'bg-cyan-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Target className="w-4 h-4 inline mr-2" />
              Automatisé
            </button>
          </div>
        </div>

        {!automatedMode ? (
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
        ) : (
          <Card className="border-cyan-500/30" highlight>
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <Search className="w-6 h-6 text-cyan-400" />
                <h2 className="text-2xl font-bold text-white">Prospection Automatisée</h2>
              </div>
              <p className="text-gray-300 mb-6">
                Recherchez automatiquement des emails d'entreprises dans une catégorie et un secteur spécifiques, puis envoyez-leur un quiz personnalisé.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    <Building2 className="w-4 h-4 inline mr-2" />
                    Catégorie d'entreprise
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Ex: PME, Startup, Grand groupe"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    required={automatedMode}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    <Target className="w-4 h-4 inline mr-2" />
                    Secteur d'activité
                  </label>
                  <input
                    type="text"
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    placeholder="Ex: Immobilier, E-commerce, Santé"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    required={automatedMode}
                  />
                </div>
              </div>

              <Button
                type="button"
                onClick={handleSearchEmails}
                disabled={searchingEmails || !category || !sector}
                className="w-full"
              >
                {searchingEmails ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Recherche en cours via Grok...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Rechercher des emails
                  </>
                )}
              </Button>

              {searchError && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <p className="text-red-400 text-sm">{searchError}</p>
                </div>
              )}

              {foundEmails.length > 0 && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">
                      {foundEmails.length} email{foundEmails.length > 1 ? 's' : ''} trouvé{foundEmails.length > 1 ? 's' : ''}
                    </h3>
                    <Button
                      type="button"
                      onClick={handleSendBulkQuizzes}
                      disabled={sendingBulk}
                      className="bg-gradient-to-r from-cyan-600 to-violet-600 hover:from-cyan-500 hover:to-violet-500"
                    >
                      {sendingBulk ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          <Mail className="w-4 h-4 mr-2" />
                          Envoyer les quiz ({foundEmails.length})
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {foundEmails.map((prospect, index) => (
                      <div key={index} className="p-3 bg-slate-800/50 rounded-lg border border-cyan-500/20">
                        <p className="text-white font-medium">{prospect.companyName}</p>
                        <p className="text-cyan-400 text-sm">{prospect.email}</p>
                        {prospect.name && (
                          <p className="text-gray-400 text-xs">{prospect.name}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {bulkResults && (
                <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-400 mb-2">Résultats de l'envoi</h3>
                  <p className="text-white">✅ {bulkResults.sent} quiz envoyé{bulkResults.sent > 1 ? 's' : ''} avec succès</p>
                  {bulkResults.failed > 0 && (
                    <p className="text-red-400">❌ {bulkResults.failed} échec{bulkResults.failed > 1 ? 's' : ''}</p>
                  )}
                </div>
              )}
            </div>
          </Card>
        )}

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

