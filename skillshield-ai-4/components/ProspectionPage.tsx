import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2, CheckCircle2, FileText, Mail, User, MessageSquare } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { generateAudit } from '../services/geminiService';
import { AuditResult } from '../types';

interface ProspectionPageProps {
  onNavigateHome: () => void;
}

export const ProspectionPage: React.FC<ProspectionPageProps> = ({ onNavigateHome }) => {
  const [prospectName, setProspectName] = useState('');
  const [prospectEmail, setProspectEmail] = useState('');
  const [prospectProblem, setProspectProblem] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [sendingPDF, setSendingPDF] = useState(false);
  const [pdfSent, setPdfSent] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prospectProblem.trim()) return;

    setLoading(true);
    setResult(null);
    const auditData = await generateAudit(prospectProblem);
    setResult(auditData);
    setLoading(false);
  };

  const handleSendPDF = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prospectEmail || !prospectName || !result) return;

    setSendingPDF(true);
    setPdfError(null);

    try {
      const response = await fetch('/api/send-pdf-prospection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: prospectEmail,
          prospectName: prospectName,
          auditResult: result,
          userProblem: prospectProblem,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          // Rate limit atteint
          const nextAvailableAt = data.nextAvailableAt ? new Date(data.nextAvailableAt) : null;
          const hoursRemaining = nextAvailableAt 
            ? Math.ceil((nextAvailableAt.getTime() - Date.now()) / (60 * 60 * 1000))
            : 24;
          throw new Error(data.message || `Un PDF a déjà été envoyé à cette adresse. Vous pourrez renvoyer dans ${hoursRemaining} heure${hoursRemaining > 1 ? 's' : ''}.`);
        }
        throw new Error(data.message || `HTTP ${response.status}`);
      }

      setPdfSent(true);
    } catch (error: any) {
      console.error('Error sending PDF:', error);
      setPdfError(error.message || 'Erreur lors de l\'envoi du PDF');
    } finally {
      setSendingPDF(false);
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
            Mode Prospection
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-display text-white mb-4">
            Outil de <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Prospection</span>
          </h1>
          <p className="text-gray-300 text-lg">
            Générez et envoyez un plan d'automatisation personnalisé à vos prospects
          </p>
        </div>

        <Card className="border-violet-500/30" highlight>
          <form onSubmit={handleAnalyze} className="space-y-6">
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
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Problème / Situation du prospect
              </label>
              <textarea
                value={prospectProblem}
                onChange={(e) => setProspectProblem(e.target.value)}
                placeholder="Décrivez le problème ou la situation du prospect (ex: Je perds du temps avec la gestion de mes emails et la qualification de mes leads immobiliers à Lyon)"
                rows={5}
                className="w-full px-4 py-3 bg-slate-800/50 border border-violet-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 resize-none"
              />
            </div>

            <Button
              type="submit"
              disabled={loading || !prospectProblem.trim()}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyse en cours...
                </>
              ) : (
                <>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Générer l'analyse
                </>
              )}
            </Button>
          </form>
        </Card>

        {/* Résultats */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <Card className="border-cyan-500/30">
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle2 className="w-6 h-6 text-cyan-400" />
                <h2 className="text-2xl font-bold text-white">Analyse générée avec succès</h2>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-300 mb-2">Analyse</h3>
                  <p className="text-gray-400">{result.analysis}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-300 mb-2">Solutions proposées</h3>
                  <ul className="space-y-2">
                    {result.suggestions.map((suggestion, index) => (
                      <li key={index} className="text-gray-400">
                        <strong className="text-cyan-400">{suggestion.title}</strong> - {suggestion.timeSaved}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {!pdfSent ? (
                <form onSubmit={handleSendPDF} className="space-y-4">
                  <div className="p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
                    <p className="text-sm text-cyan-200 mb-2">
                      <strong>Prêt à envoyer :</strong> Un email professionnel sera envoyé à {prospectName} ({prospectEmail}) avec le PDF personnalisé.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={sendingPDF || !prospectEmail || !prospectName}
                    className="w-full"
                  >
                    {sendingPDF ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4 mr-2" />
                        Envoyer le PDF par email
                      </>
                    )}
                  </Button>
                </form>
              ) : (
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle2 className="w-5 h-5" />
                    <p className="font-semibold">PDF envoyé avec succès !</p>
                  </div>
                  <p className="text-sm text-gray-400 mt-2">
                    Le plan d'automatisation a été envoyé à {prospectEmail}
                  </p>
                </div>
              )}

              {pdfError && (
                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-red-400 text-sm">{pdfError}</p>
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

