import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2, CheckCircle2, FileText, Mail, User, MessageSquare, Sparkles, Search, Building2, Target, AlertCircle, ShieldCheck, BookOpen, Users, Link as LinkIcon, FileCheck } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

interface QuizPageProps {
  onNavigateHome: () => void;
}

interface ProspectEmail {
  email: string;
  companyName: string;
  name?: string;
  interestScore?: number;
  sector?: string;
  source?: string;
}

export const QuizPage: React.FC<QuizPageProps> = ({ onNavigateHome }) => {
  const [prospectName, setProspectName] = useState('');
  const [prospectEmail, setProspectEmail] = useState('');
  const [prospectProblem, setProspectProblem] = useState('');
  const [sendingQuiz, setSendingQuiz] = useState(false);
  const [quizSent, setQuizSent] = useState(false);
  const [quizError, setQuizError] = useState<string | null>(null);
  
  // États pour la prospection automatisée
  const [automatedMode, setAutomatedMode] = useState(true); // Mode automatisé par défaut
  const [category, setCategory] = useState('');
  const [sector, setSector] = useState('');
  const [location, setLocation] = useState('');
  const [directWebsites, setDirectWebsites] = useState('');
  const [useDirectMode, setUseDirectMode] = useState(false);
  const [singleSite, setSingleSite] = useState('');
  const [prospectingResult, setProspectingResult] = useState<{
    entreprise_nom: string;
    secteur?: string;
    site: string;
    email: string;
    message_personnalise: string;
  } | null>(null);
  // Mode "Prospection unique" activé par défaut sur /120000
  const [prospectingSingle, setProspectingSingle] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname === '/120000';
    }
    return false;
  });
  // Mode "Email direct" pour entrer directement un email
  const [directEmailMode, setDirectEmailMode] = useState(false);
  const [directEmail, setDirectEmail] = useState('');
  const [directCompanyName, setDirectCompanyName] = useState('');
  const [directSector, setDirectSector] = useState('');
  // Mode "Prospection multiple" pour analyser un site contenant plusieurs liens
  const [prospectingMultiple, setProspectingMultiple] = useState(false);
  const [multipleSitesResult, setMultipleSitesResult] = useState<Array<{
    entreprise_nom: string;
    secteur?: string;
    site: string;
    email: string;
    message_personnalise: string;
  }>>([]);
  const [sendingMultipleEmails, setSendingMultipleEmails] = useState<Record<string, boolean>>({});
  const [sentMultipleEmails, setSentMultipleEmails] = useState<Record<string, boolean>>({});
  const [emailType, setEmailType] = useState<'simple' | 'quiz'>('simple');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [searchingEmails, setSearchingEmails] = useState(false);
  const [sendingBulk, setSendingBulk] = useState(false);
  const [foundEmails, setFoundEmails] = useState<ProspectEmail[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [bulkResults, setBulkResults] = useState<{ sent: number; failed: number } | null>(null);
  
  // États RGPD-friendly pour la documentation des sources légitimes
  const [legitimateSource, setLegitimateSource] = useState<'annuaire' | 'partner_list' | 'provided' | 'other'>('annuaire');
  const [sourceName, setSourceName] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [consentBasis, setConsentBasis] = useState<'legitimate_interest' | 'public_data' | 'partnership'>('legitimate_interest');
  const [dataRetention, setDataRetention] = useState('12'); // mois
  const [gdprNotes, setGdprNotes] = useState('');

  // Effet pour forcer automatedMode à true sur /120000
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.pathname === '/120000') {
      setAutomatedMode(true);
      setProspectingSingle(true);
      setUseDirectMode(false);
      setDirectEmailMode(false); // Par défaut, mode "Site web" sur /120000
    }
  }, []);

  // Réinitialiser les états quand on change le site à analyser
  useEffect(() => {
    if (singleSite) {
      // Réinitialiser les résultats et états d'envoi quand on change le site
      setProspectingResult(null);
      setMultipleSitesResult([]);
      setEmailSent(false);
      setEmailType('simple');
      setSearchError(null);
      setSentMultipleEmails({});
      setSendingMultipleEmails({});
    }
  }, [singleSite]);

  // Réinitialiser les états quand on change le mode (Site web / Email)
  useEffect(() => {
    if (directEmailMode) {
      setProspectingResult(null);
      setMultipleSitesResult([]);
      setEmailSent(false);
      setEmailType('simple');
      setSearchError(null);
      setSingleSite('');
    } else {
      setDirectEmail('');
      setDirectCompanyName('');
      setDirectSector('');
      setProspectingResult(null);
      setEmailSent(false);
      setEmailType('simple');
    }
  }, [directEmailMode]);

  // Réinitialiser les états quand on change le mode ou l'email direct
  useEffect(() => {
    if (directEmailMode) {
      setProspectingResult(null);
      setMultipleSitesResult([]);
      setEmailSent(false);
      setEmailType('simple');
      setSearchError(null);
      setSingleSite('');
    }
  }, [directEmailMode]);

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
    if (useDirectMode) {
      // Mode direct : scraper les sites web fournis
      if (!directWebsites) {
        setSearchError('Veuillez entrer au moins un site web');
        return;
      }
    } else {
      // Mode recherche : nécessite secteur, lieu, catégorie
      if (!category || !sector || !location) return;
    }

    setSearchingEmails(true);
    setSearchError(null);
    setFoundEmails([]);

    try {
      const body = useDirectMode
        ? {
            websites: directWebsites
              .split('\n')
              .map(w => w.trim())
              .filter(w => w.length > 0),
            source: legitimateSource,
            sourceName,
            sourceUrl,
            consentBasis,
            dataRetention: parseInt(dataRetention),
            gdprNotes,
            sector: sector || undefined,
            location: location || undefined,
            category: category || undefined,
          }
        : {
            sector,
            location,
            category,
          };

      // Utiliser l'API légale pour le mode direct, l'API web-scraper pour le mode recherche
      const apiEndpoint = useDirectMode ? '/api/legal-prospecting' : '/api/web-scraper';
      
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      let data;
      try {
        const responseText = await response.text();
        if (!response.ok) {
          // Essayer de parser l'erreur
          try {
            data = JSON.parse(responseText);
            throw new Error(data.error || data.message || `Erreur ${response.status}: ${responseText.substring(0, 200)}`);
          } catch {
            throw new Error(`Erreur ${response.status}: ${responseText.substring(0, 200)}`);
          }
        }
        data = JSON.parse(responseText);
      } catch (parseError: any) {
        console.error('Erreur parsing réponse API:', parseError);
        throw new Error(parseError.message || 'Erreur lors du parsing de la réponse du serveur');
      }

      // Si l'API Google Search est bloquée, afficher un message avec solution
      if (data.error === 'API_KEY_SERVICE_BLOCKED' || data.message?.includes('bloquée')) {
        setSearchError(
          data.message + (data.solution ? `\n\n${data.solution}` : '') +
          (data.instructions ? `\n\n${data.instructions.join('\n')}` : '')
        );
        setFoundEmails([]);
        return;
      }

      // Convertir les contacts scrapés en format ProspectEmail
      const contacts = (data.contacts || []).map((contact: any) => ({
        email: contact.email,
        companyName: contact.companyName || 'Entreprise',
        name: contact.name,
        interestScore: contact.interestScore, // Score d'intérêt IA
        sector: contact.sector,
        source: contact.source,
      }));

      console.log('📊 Contacts reçus:', contacts.length, contacts);
      console.log('📊 Métadonnées:', data.metadata);

      setFoundEmails(contacts);
      if (contacts.length === 0 && !data.error) {
        const errorMsg = data.message || 'Aucun contact trouvé. Vérifiez que les sites web contiennent des emails de contact (contact@, info@, etc.).';
        setSearchError(errorMsg);
        console.warn('⚠️ Aucun contact trouvé:', data);
      } else {
        setSearchError(null);
      }
    } catch (error: any) {
      console.error('Error scraping web:', error);
      setSearchError(error.message || 'Erreur lors du scraping web');
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
          location,
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

        {/* Toggle entre mode manuel et automatisé - Masqué sur /120000 */}
        {!(typeof window !== 'undefined' && window.location.pathname === '/120000') && (
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
        )}

        {/* Section Manuel - Masquée sur /120000 */}
        {!automatedMode && !(typeof window !== 'undefined' && window.location.pathname === '/120000') ? (
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
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="bg-green-500/20 rounded-full p-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-green-400 font-semibold mb-2">🟢 Architecture IA + Google Cloud 100% légale (recommandée)</h3>
                    <div className="text-sm text-gray-300 space-y-1">
                      <p><strong>🔧 Pipeline propre:</strong></p>
                      <ol className="list-decimal list-inside space-y-1 ml-2">
                        <li><strong>Humain / source légitime:</strong> Annuaire pro, liste d'entreprises partenaires potentielles</li>
                        <li><strong>Google Cloud:</strong> Analyse des pages fournies, extraction d'emails génériques</li>
                        <li><strong>IA:</strong> Tri par secteur, scoring d'intérêt</li>
                        <li><strong>Email:</strong> Message associatif personnalisé, opt-out clair</li>
                      </ol>
                      <p className="mt-2 text-green-400">➡️ Scalable • ➡️ Défendable juridiquement • ➡️ Aucun scraping interdit</p>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-gray-300 mb-6">
                Utilisez des sources légitimes (annuaires pro, listes d'entreprises) et laissez Google Cloud + IA analyser et scorer les contacts.
              </p>

              {/* Toggle entre modes - Masqué sur /120000 si prospection unique active */}
              {!(typeof window !== 'undefined' && window.location.pathname === '/120000' && prospectingSingle) && (
                <div className="flex justify-center mb-6">
                  <div className="bg-slate-800/50 rounded-lg p-1 flex gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => {
                        setUseDirectMode(false);
                        setProspectingSingle(false);
                      }}
                      className={`px-4 py-2 rounded-md font-semibold transition-all text-sm ${
                        !useDirectMode && !prospectingSingle
                          ? 'bg-cyan-500 text-white'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <Search className="w-4 h-4 inline mr-2" />
                      Recherche
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setUseDirectMode(true);
                        setProspectingSingle(false);
                      }}
                      className={`px-4 py-2 rounded-md font-semibold transition-all text-sm ${
                        useDirectMode && !prospectingSingle
                          ? 'bg-violet-500 text-white'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <FileText className="w-4 h-4 inline mr-2" />
                      Sites légitimes
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setProspectingSingle(true);
                        setUseDirectMode(false);
                      }}
                      className={`px-4 py-2 rounded-md font-semibold transition-all text-sm ${
                        prospectingSingle
                          ? 'bg-green-500 text-white'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <Target className="w-4 h-4 inline mr-2" />
                      Prospection unique
                    </button>
                  </div>
                </div>
              )}

              {prospectingSingle ? (
                <div className="space-y-6">
                  {/* Toggle entre Site web et Email direct */}
                  <div className="flex justify-center mb-6">
                    <div className="bg-slate-800/50 rounded-lg p-1 flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setDirectEmailMode(false);
                          setProspectingMultiple(false);
                          setMultipleSitesResult([]);
                          setSingleSite('');
                          setDirectEmail('');
                          setDirectCompanyName('');
                          setDirectSector('');
                        }}
                        className={`px-4 py-2 rounded-md font-semibold transition-all text-sm ${
                          !directEmailMode
                            ? 'bg-cyan-500 text-white'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        <FileText className="w-4 h-4 inline mr-2" />
                        Site web
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setDirectEmailMode(true);
                          setProspectingMultiple(false);
                          setProspectingResult(null);
                          setSingleSite('');
                          setMultipleSitesResult([]);
                        }}
                        className={`px-4 py-2 rounded-md font-semibold transition-all text-sm ${
                          directEmailMode
                            ? 'bg-violet-500 text-white'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        <Mail className="w-4 h-4 inline mr-2" />
                        Email
                      </button>
                    </div>
                  </div>

                  {/* Mode Email direct */}
                  {directEmailMode ? (
                    <div className="space-y-6">
                      <div className="bg-violet-500/10 border border-violet-500/30 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <h3 className="text-violet-400 font-semibold mb-2">📧 Envoi Email Direct</h3>
                            <div className="text-sm text-gray-300 space-y-1">
                              <p>✓ Entrez directement l'email et le nom de l'entreprise</p>
                              <p>✓ Message personnalisé généré automatiquement</p>
                              <p>✓ Choix entre message simple ou quiz complet</p>
                              <p>✓ Envoi depuis contact@skillshield-ai.com</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          <Mail className="w-4 h-4 inline mr-2" />
                          Email de l'entreprise *
                        </label>
                        <input
                          type="email"
                          value={directEmail}
                          onChange={(e) => setDirectEmail(e.target.value)}
                          placeholder="Ex: contact@example.com"
                          className="w-full px-4 py-3 bg-slate-800/50 border border-violet-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          <Building2 className="w-4 h-4 inline mr-2" />
                          Nom de l'entreprise *
                        </label>
                        <input
                          type="text"
                          value={directCompanyName}
                          onChange={(e) => setDirectCompanyName(e.target.value)}
                          placeholder="Ex: Example Corp"
                          className="w-full px-4 py-3 bg-slate-800/50 border border-violet-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          <Target className="w-4 h-4 inline mr-2" />
                          Secteur d'activité <span className="text-gray-500 text-xs">(optionnel)</span>
                        </label>
                        <input
                          type="text"
                          value={directSector}
                          onChange={(e) => setDirectSector(e.target.value)}
                          placeholder="Ex: Immobilier - Agence immobilière"
                          className="w-full px-4 py-3 bg-slate-800/50 border border-violet-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                        />
                        <p className="text-xs text-gray-400 mt-2">
                          💡 Le secteur permet de personnaliser davantage le message.
                        </p>
                      </div>

                      <Button
                        type="button"
                        onClick={async () => {
                          if (!directEmail || !directCompanyName) return;
                          
                          setSearchingEmails(true);
                          setSearchError(null);
                          setProspectingResult(null);
                          setEmailSent(false);
                          setEmailType('simple');

                          try {
                            // Générer un message personnalisé
                            const response = await fetch('/api/prospection-automation', {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                              },
                              body: JSON.stringify({
                                mode: 'generate-message',
                                email: directEmail,
                                companyName: directCompanyName,
                                sector: directSector || undefined,
                              }),
                            });

                            const data = await response.json();

                            if (!response.ok) {
                              throw new Error(data.error || data.message || 'Erreur lors de la génération du message');
                            }

                            setProspectingResult({
                              entreprise_nom: directCompanyName,
                              secteur: directSector || undefined,
                              site: '',
                              email: directEmail,
                              message_personnalise: data.message || '',
                            });
                          } catch (error: any) {
                            console.error('Error generating message:', error);
                            setSearchError(error.message || 'Erreur lors de la génération du message');
                          } finally {
                            setSearchingEmails(false);
                          }
                        }}
                        disabled={searchingEmails || !directEmail || !directCompanyName}
                        className="w-full bg-violet-600 hover:bg-violet-500"
                      >
                        {searchingEmails ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Génération du message...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Générer le message personnalisé
                          </>
                        )}
                      </Button>

                      {/* Affichage résultat email direct */}
                      {prospectingResult && prospectingResult.email && (
                        <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-violet-500/30">
                          <h3 className="text-lg font-semibold text-white mb-4">Résultat de la prospection</h3>
                          <div className="mb-6">
                            <p className="text-sm text-gray-400 mb-2">Nom, secteur et email</p>
                            <div className="p-3 bg-slate-900/50 rounded border border-violet-500/20">
                              <p className="text-white font-medium">
                                <span className="text-cyan-400">{prospectingResult.entreprise_nom}</span>
                                {prospectingResult.secteur && (
                                  <> - <span className="text-violet-400">{prospectingResult.secteur}</span></>
                                )}
                                <br />
                                <span className="text-green-400">{prospectingResult.email}</span>
                              </p>
                            </div>
                          </div>

                          {!emailSent ? (
                            <>
                              <div className="mb-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                                <label className="block text-sm font-semibold text-gray-300 mb-3">
                                  Type d'email à envoyer
                                </label>
                                <div className="space-y-2">
                                  <label className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-cyan-500/30 cursor-pointer hover:border-cyan-500/50 transition-colors">
                                    <input
                                      type="radio"
                                      name="emailTypeDirect"
                                      value="simple"
                                      checked={emailType === 'simple'}
                                      onChange={(e) => setEmailType(e.target.value as 'simple' | 'quiz')}
                                      className="w-4 h-4 text-cyan-500"
                                    />
                                    <div className="flex-1">
                                      <p className="text-white font-medium">Message simple</p>
                                      <p className="text-xs text-gray-400">Message de prospection personnalisé</p>
                                    </div>
                                  </label>
                                  <label className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-violet-500/30 cursor-pointer hover:border-violet-500/50 transition-colors">
                                    <input
                                      type="radio"
                                      name="emailTypeDirect"
                                      value="quiz"
                                      checked={emailType === 'quiz'}
                                      onChange={(e) => setEmailType(e.target.value as 'simple' | 'quiz')}
                                      className="w-4 h-4 text-violet-500"
                                    />
                                    <div className="flex-1">
                                      <p className="text-white font-medium">Quiz complet</p>
                                      <p className="text-xs text-gray-400">Quiz personnalisé comme sur /92300</p>
                                    </div>
                                  </label>
                                </div>
                              </div>

                              {emailType === 'simple' && prospectingResult.message_personnalise && (
                                <div className="mb-4">
                                  <p className="text-sm text-gray-400 mb-2">Aperçu du message</p>
                                  <div className="p-3 bg-slate-900/50 rounded border border-cyan-500/20 max-h-48 overflow-y-auto">
                                    <p className="text-white text-sm whitespace-pre-line">{prospectingResult.message_personnalise}</p>
                                  </div>
                                </div>
                              )}

                              <Button
                                type="button"
                                onClick={async () => {
                                  if (!prospectingResult.email) return;
                                  
                                  setSendingEmail(true);
                                  setSearchError(null);

                                  try {
                                    const response = await fetch('/api/prospection-automation', {
                                      method: 'POST',
                                      headers: {
                                        'Content-Type': 'application/json',
                                      },
                                      body: JSON.stringify({
                                        mode: 'send-email',
                                        email: prospectingResult.email,
                                        companyName: prospectingResult.entreprise_nom,
                                        site: '',
                                        emailType: emailType,
                                        message: emailType === 'simple' ? prospectingResult.message_personnalise : null,
                                      }),
                                    });

                                    const data = await response.json();

                                    if (!response.ok) {
                                      throw new Error(data.error || data.message || 'Erreur lors de l\'envoi');
                                    }

                                    setEmailSent(true);
                                    // Réinitialiser après un court délai pour permettre une nouvelle analyse
                                    setTimeout(() => {
                                      setProspectingResult(null);
                                      setEmailSent(false);
                                      setEmailType('simple');
                                      setDirectEmail('');
                                      setDirectCompanyName('');
                                      setDirectSector('');
                                    }, 2000);
                                  } catch (error: any) {
                                    console.error('Error sending email:', error);
                                    setSearchError(error.message || 'Erreur lors de l\'envoi de l\'email');
                                  } finally {
                                    setSendingEmail(false);
                                  }
                                }}
                                disabled={sendingEmail || !prospectingResult.email}
                                className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500"
                              >
                                {sendingEmail ? (
                                  <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Envoi en cours...
                                  </>
                                ) : (
                                  <>
                                    <Mail className="w-4 h-4 mr-2" />
                                    Envoyer l'email à {prospectingResult.email}
                                  </>
                                )}
                              </Button>
                            </>
                          ) : (
                            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                              <div className="flex items-center gap-3">
                                <CheckCircle2 className="w-6 h-6 text-green-400" />
                                <div>
                                  <p className="text-green-400 font-semibold">Email envoyé avec succès !</p>
                                  <p className="text-sm text-gray-400 mt-1">
                                    L'email a été envoyé à {prospectingResult.email} depuis contact@skillshield-ai.com
                                  </p>
                                  <p className="text-xs text-gray-500 mt-2">
                                    Vous pouvez maintenant envoyer un email à une autre entreprise en entrant de nouvelles informations ci-dessus.
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      {/* Toggle entre prospection unique et multiple - Masqué sur /120000 */}
                      {!(typeof window !== 'undefined' && window.location.pathname === '/120000') && (
                        <div className="flex justify-center mb-6">
                          <div className="bg-slate-800/50 rounded-lg p-1 flex gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setProspectingMultiple(false);
                                setMultipleSitesResult([]);
                                setSingleSite('');
                              }}
                              className={`px-4 py-2 rounded-md font-semibold transition-all text-sm ${
                                !prospectingMultiple
                                  ? 'bg-green-500 text-white'
                                  : 'text-gray-400 hover:text-white'
                              }`}
                            >
                              <Target className="w-4 h-4 inline mr-2" />
                              Prospection unique
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setProspectingMultiple(true);
                                setProspectingResult(null);
                                setSingleSite('');
                              }}
                              className={`px-4 py-2 rounded-md font-semibold transition-all text-sm ${
                                prospectingMultiple
                                  ? 'bg-blue-500 text-white'
                                  : 'text-gray-400 hover:text-white'
                              }`}
                            >
                              <Building2 className="w-4 h-4 inline mr-2" />
                              Prospection multiple
                            </button>
                          </div>
                        </div>
                      )}

                      {!prospectingMultiple ? (
                        <>
                          {/* Toggle entre Site web et Email direct - Visible sur /120000 */}
                      <div className="flex justify-center mb-6">
                        <div className="bg-slate-800/50 rounded-lg p-1 flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setDirectEmailMode(false);
                              setProspectingResult(null);
                              setSingleSite('');
                              setDirectEmail('');
                              setDirectCompanyName('');
                              setDirectSector('');
                            }}
                            className={`px-4 py-2 rounded-md font-semibold transition-all text-sm ${
                              !directEmailMode
                                ? 'bg-cyan-500 text-white'
                                : 'text-gray-400 hover:text-white'
                            }`}
                          >
                            <FileText className="w-4 h-4 inline mr-2" />
                            Site web
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setDirectEmailMode(true);
                              setProspectingResult(null);
                              setSingleSite('');
                              setMultipleSitesResult([]);
                            }}
                            className={`px-4 py-2 rounded-md font-semibold transition-all text-sm ${
                              directEmailMode
                                ? 'bg-violet-500 text-white'
                                : 'text-gray-400 hover:text-white'
                            }`}
                          >
                            <Mail className="w-4 h-4 inline mr-2" />
                            Email
                          </button>
                        </div>
                      </div>

                      {/* Mode Email direct */}
                      {directEmailMode ? (
                        <div className="space-y-6">
                          <div className="bg-violet-500/10 border border-violet-500/30 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                              <CheckCircle2 className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5" />
                              <div className="flex-1">
                                <h3 className="text-violet-400 font-semibold mb-2">📧 Envoi Email Direct</h3>
                                <div className="text-sm text-gray-300 space-y-1">
                                  <p>✓ Entrez directement l'email et le nom de l'entreprise</p>
                                  <p>✓ Message personnalisé généré automatiquement</p>
                                  <p>✓ Choix entre message simple ou quiz complet</p>
                                  <p>✓ Envoi depuis contact@skillshield-ai.com</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">
                              <Mail className="w-4 h-4 inline mr-2" />
                              Email de l'entreprise *
                            </label>
                            <input
                              type="email"
                              value={directEmail}
                              onChange={(e) => setDirectEmail(e.target.value)}
                              placeholder="Ex: contact@example.com"
                              className="w-full px-4 py-3 bg-slate-800/50 border border-violet-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">
                              <Building2 className="w-4 h-4 inline mr-2" />
                              Nom de l'entreprise *
                            </label>
                            <input
                              type="text"
                              value={directCompanyName}
                              onChange={(e) => setDirectCompanyName(e.target.value)}
                              placeholder="Ex: Example Corp"
                              className="w-full px-4 py-3 bg-slate-800/50 border border-violet-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">
                              <Target className="w-4 h-4 inline mr-2" />
                              Secteur d'activité <span className="text-gray-500 text-xs">(optionnel)</span>
                            </label>
                            <input
                              type="text"
                              value={directSector}
                              onChange={(e) => setDirectSector(e.target.value)}
                              placeholder="Ex: Immobilier - Agence immobilière"
                              className="w-full px-4 py-3 bg-slate-800/50 border border-violet-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                            />
                            <p className="text-xs text-gray-400 mt-2">
                              💡 Le secteur permet de personnaliser davantage le message.
                            </p>
                          </div>

                          <Button
                            type="button"
                            onClick={async () => {
                              if (!directEmail || !directCompanyName) return;
                              
                              setSearchingEmails(true);
                              setSearchError(null);
                              setProspectingResult(null);
                              setEmailSent(false);
                              setEmailType('simple');

                              try {
                                // Générer un message personnalisé
                                const response = await fetch('/api/prospection-automation', {
                                  method: 'POST',
                                  headers: {
                                    'Content-Type': 'application/json',
                                  },
                                  body: JSON.stringify({
                                    mode: 'generate-message',
                                    email: directEmail,
                                    companyName: directCompanyName,
                                    sector: directSector || undefined,
                                  }),
                                });

                                const data = await response.json();

                                if (!response.ok) {
                                  throw new Error(data.error || data.message || 'Erreur lors de la génération du message');
                                }

                                setProspectingResult({
                                  entreprise_nom: directCompanyName,
                                  secteur: directSector || undefined,
                                  site: '',
                                  email: directEmail,
                                  message_personnalise: data.message || '',
                                });
                              } catch (error: any) {
                                console.error('Error generating message:', error);
                                setSearchError(error.message || 'Erreur lors de la génération du message');
                              } finally {
                                setSearchingEmails(false);
                              }
                            }}
                            disabled={searchingEmails || !directEmail || !directCompanyName}
                            className="w-full bg-violet-600 hover:bg-violet-500"
                          >
                            {searchingEmails ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Génération du message...
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-4 h-4 mr-2" />
                                Générer le message personnalisé
                              </>
                            )}
                          </Button>

                          {/* Affichage résultat email direct - réutiliser le même code que pour prospectingResult */}
                          {prospectingResult && prospectingResult.email && (
                            <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-violet-500/30">
                              <h3 className="text-lg font-semibold text-white mb-4">Résultat de la prospection</h3>
                              <div className="mb-6">
                                <p className="text-sm text-gray-400 mb-2">Nom, secteur et email</p>
                                <div className="p-3 bg-slate-900/50 rounded border border-violet-500/20">
                                  <p className="text-white font-medium">
                                    <span className="text-cyan-400">{prospectingResult.entreprise_nom}</span>
                                    {prospectingResult.secteur && (
                                      <> - <span className="text-violet-400">{prospectingResult.secteur}</span></>
                                    )}
                                    <br />
                                    <span className="text-green-400">{prospectingResult.email}</span>
                                  </p>
                                </div>
                              </div>

                              {!emailSent ? (
                                <>
                                  <div className="mb-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                                    <label className="block text-sm font-semibold text-gray-300 mb-3">
                                      Type d'email à envoyer
                                    </label>
                                    <div className="space-y-2">
                                      <label className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-cyan-500/30 cursor-pointer hover:border-cyan-500/50 transition-colors">
                                        <input
                                          type="radio"
                                          name="emailTypeDirect"
                                          value="simple"
                                          checked={emailType === 'simple'}
                                          onChange={(e) => setEmailType(e.target.value as 'simple' | 'quiz')}
                                          className="w-4 h-4 text-cyan-500"
                                        />
                                        <div className="flex-1">
                                          <p className="text-white font-medium">Message simple</p>
                                          <p className="text-xs text-gray-400">Message de prospection personnalisé</p>
                                        </div>
                                      </label>
                                      <label className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-violet-500/30 cursor-pointer hover:border-violet-500/50 transition-colors">
                                        <input
                                          type="radio"
                                          name="emailTypeDirect"
                                          value="quiz"
                                          checked={emailType === 'quiz'}
                                          onChange={(e) => setEmailType(e.target.value as 'simple' | 'quiz')}
                                          className="w-4 h-4 text-violet-500"
                                        />
                                        <div className="flex-1">
                                          <p className="text-white font-medium">Quiz complet</p>
                                          <p className="text-xs text-gray-400">Quiz personnalisé comme sur /92300</p>
                                        </div>
                                      </label>
                                    </div>
                                  </div>

                                  {emailType === 'simple' && prospectingResult.message_personnalise && (
                                    <div className="mb-4">
                                      <p className="text-sm text-gray-400 mb-2">Aperçu du message</p>
                                      <div className="p-3 bg-slate-900/50 rounded border border-cyan-500/20 max-h-48 overflow-y-auto">
                                        <p className="text-white text-sm whitespace-pre-line">{prospectingResult.message_personnalise}</p>
                                      </div>
                                    </div>
                                  )}

                                  <Button
                                    type="button"
                                    onClick={async () => {
                                      if (!prospectingResult.email) return;
                                      
                                      setSendingEmail(true);
                                      setSearchError(null);

                                      try {
                                        const response = await fetch('/api/prospection-automation', {
                                          method: 'POST',
                                          headers: {
                                            'Content-Type': 'application/json',
                                          },
                                          body: JSON.stringify({
                                            mode: 'send-email',
                                            email: prospectingResult.email,
                                            companyName: prospectingResult.entreprise_nom,
                                            site: '',
                                            emailType: emailType,
                                            message: emailType === 'simple' ? prospectingResult.message_personnalise : null,
                                          }),
                                        });

                                        const data = await response.json();

                                        if (!response.ok) {
                                          throw new Error(data.error || data.message || 'Erreur lors de l\'envoi');
                                        }

                                        setEmailSent(true);
                                        setTimeout(() => {
                                          setProspectingResult(null);
                                          setEmailSent(false);
                                          setEmailType('simple');
                                          setDirectEmail('');
                                          setDirectCompanyName('');
                                          setDirectSector('');
                                        }, 2000);
                                      } catch (error: any) {
                                        console.error('Error sending email:', error);
                                        setSearchError(error.message || 'Erreur lors de l\'envoi de l\'email');
                                      } finally {
                                        setSendingEmail(false);
                                      }
                                    }}
                                    disabled={sendingEmail || !prospectingResult.email}
                                    className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500"
                                  >
                                    {sendingEmail ? (
                                      <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Envoi en cours...
                                      </>
                                    ) : (
                                      <>
                                        <Mail className="w-4 h-4 mr-2" />
                                        Envoyer l'email à {prospectingResult.email}
                                      </>
                                    )}
                                  </Button>
                                </>
                              ) : (
                                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                                  <div className="flex items-center gap-3">
                                    <CheckCircle2 className="w-6 h-6 text-green-400" />
                                    <div>
                                      <p className="text-green-400 font-semibold">Email envoyé avec succès !</p>
                                      <p className="text-sm text-gray-400 mt-1">
                                        L'email a été envoyé à {prospectingResult.email} depuis contact@skillshield-ai.com
                                      </p>
                                      <p className="text-xs text-gray-500 mt-2">
                                        Vous pouvez maintenant envoyer un email à une autre entreprise en entrant de nouvelles informations ci-dessus.
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <>
                          {!prospectingMultiple ? (
                            <>
                              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                                  <div className="flex-1">
                                    <h3 className="text-green-400 font-semibold mb-2">🟢 Prospection B2B Légale - UNE entreprise</h3>
                                    <div className="text-sm text-gray-300 space-y-1">
                                      <p>✓ Analyse UNIQUEMENT du site fourni</p>
                                      <p>✓ Détection automatique du nom et secteur précis via IA</p>
                                      <p>✓ Emails autorisés uniquement : contact@, info@, partenariat@, communication@, hello@, support@</p>
                                      <p>✓ Message personnalisé avec mention légale d'opt-out</p>
                                      <p>✓ Conforme RGPD - France / UE</p>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">
                                  <FileText className="w-4 h-4 inline mr-2" />
                                  Site web de l'entreprise (UN seul site) *
                                </label>
                                <input
                                  type="text"
                                  value={singleSite}
                                  onChange={(e) => setSingleSite(e.target.value)}
                                  placeholder="Ex: example.com ou https://example.com"
                                  className="w-full px-4 py-3 bg-slate-800/50 border border-green-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                                  required
                                />
                                <p className="text-xs text-gray-400 mt-2">
                                  💡 Entrez UN seul site web. Le système analysera uniquement ce site (page d'accueil et pages de contact).
                                </p>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                  <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                                  <div className="flex-1">
                                    <h3 className="text-blue-400 font-semibold mb-2">🔵 Prospection B2B Légale - MULTIPLES entreprises</h3>
                                    <div className="text-sm text-gray-300 space-y-1">
                                      <p>✓ Analyse d'une page contenant plusieurs liens de sites</p>
                                      <p>✓ Extraction automatique de tous les sites référencés</p>
                                      <p>✓ Analyse intelligente de chaque site (nom, secteur, email)</p>
                                      <p>✓ Envoi d'emails personnalisés un par un selon les caractéristiques</p>
                                      <p>✓ Conforme RGPD - France / UE</p>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">
                                  <FileText className="w-4 h-4 inline mr-2" />
                                  Page contenant plusieurs liens de sites (annuaire, liste, etc.) *
                                </label>
                                <input
                                  type="text"
                                  value={singleSite}
                                  onChange={(e) => setSingleSite(e.target.value)}
                                  placeholder="Ex: annuaire-exemple.fr/liste-entreprises ou https://example.com/annuaire"
                                  className="w-full px-4 py-3 bg-slate-800/50 border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                  required
                                />
                                <p className="text-xs text-gray-400 mt-2">
                                  💡 Entrez l'URL d'une page qui contient plusieurs liens vers des sites d'entreprises. Le système extraira tous les liens et analysera chaque site individuellement.
                                </p>
                              </div>
                            </>
                          )}
                        </>
                      )}

                  <Button
                    type="button"
                    onClick={async () => {
                      if (!singleSite) return;
                      setSearchingEmails(true);
                      setSearchError(null);
                      setProspectingResult(null);
                      setMultipleSitesResult([]);
                      setEmailSent(false);
                      setEmailType('simple');
                      setSentMultipleEmails({});
                      setSendingMultipleEmails({});

                      try {
                        const response = await fetch('/api/prospection-automation', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({ 
                            mode: prospectingMultiple ? 'multiple' : 'single', 
                            site: singleSite 
                          }),
                        });

                        const data = await response.json();

                        if (!response.ok) {
                          throw new Error(data.error || data.message || 'Erreur lors de la prospection');
                        }

                        if (prospectingMultiple) {
                          // Mode multiple : data est un tableau
                          setMultipleSitesResult(Array.isArray(data) ? data : []);
                          if (!Array.isArray(data) || data.length === 0) {
                            setSearchError('Aucun site trouvé ou analysé avec succès');
                          }
                        } else {
                          // Mode single : data est un objet
                          setProspectingResult(data);
                          if (!data.email) {
                            setSearchError('Email non trouvé – prospection manuelle requise');
                          }
                        }
                      } catch (error: any) {
                        console.error('Error prospection:', error);
                        setSearchError(error.message || 'Erreur lors de la prospection');
                      } finally {
                        setSearchingEmails(false);
                      }
                    }}
                    disabled={searchingEmails || !singleSite}
                    className={`w-full ${prospectingMultiple ? 'bg-blue-600 hover:bg-blue-500' : 'bg-green-600 hover:bg-green-500'}`}
                  >
                    {searchingEmails ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {prospectingMultiple ? 'Analyse de plusieurs sites en cours...' : 'Analyse en cours...'}
                      </>
                    ) : (
                      <>
                        {prospectingMultiple ? (
                          <>
                            <Building2 className="w-4 h-4 mr-2" />
                            Analyser les sites de cette page
                          </>
                        ) : (
                          <>
                            <Target className="w-4 h-4 mr-2" />
                            Analyser ce site
                          </>
                        )}
                      </>
                    )}
                  </Button>

                  {/* Affichage résultats prospection multiple */}
                  {prospectingMultiple && multipleSitesResult.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-white mb-4">
                        {multipleSitesResult.length} entreprise{multipleSitesResult.length > 1 ? 's' : ''} trouvée{multipleSitesResult.length > 1 ? 's' : ''}
                      </h3>
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {multipleSitesResult.map((result, index) => (
                          <div key={index} className="p-4 bg-slate-800/50 rounded-lg border border-blue-500/30">
                            <div className="mb-4">
                              <p className="text-sm text-gray-400 mb-2">Nom, secteur, site et email</p>
                              <div className="p-3 bg-slate-900/50 rounded border border-blue-500/20">
                                <p className="text-white font-medium">
                                  <span className="text-cyan-400">{result.entreprise_nom}</span>
                                  {result.secteur && (
                                    <> - <span className="text-violet-400">{result.secteur}</span></>
                                  )}
                                  <br />
                                  <span className="text-gray-300 text-sm">{result.site}</span>
                                  <br />
                                  {result.email ? (
                                    <span className="text-green-400">{result.email}</span>
                                  ) : (
                                    <span className="text-gray-500 text-sm">Email non trouvé</span>
                                  )}
                                </p>
                              </div>
                            </div>

                            {result.email && !sentMultipleEmails[result.email] ? (
                              <>
                                <div className="mb-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                                    Type d'email à envoyer
                                  </label>
                                  <div className="space-y-2">
                                    <label className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-cyan-500/30 cursor-pointer hover:border-cyan-500/50 transition-colors">
                                      <input
                                        type="radio"
                                        name={`emailType-${index}`}
                                        value="simple"
                                        defaultChecked
                                        className="w-4 h-4 text-cyan-500"
                                      />
                                      <div className="flex-1">
                                        <p className="text-white font-medium">Message simple</p>
                                        <p className="text-xs text-gray-400">Message de prospection personnalisé</p>
                                      </div>
                                    </label>
                                    <label className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-violet-500/30 cursor-pointer hover:border-violet-500/50 transition-colors">
                                      <input
                                        type="radio"
                                        name={`emailType-${index}`}
                                        value="quiz"
                                        className="w-4 h-4 text-violet-500"
                                      />
                                      <div className="flex-1">
                                        <p className="text-white font-medium">Quiz complet</p>
                                        <p className="text-xs text-gray-400">Quiz personnalisé comme sur /92300</p>
                                      </div>
                                    </label>
                                  </div>
                                </div>

                                <Button
                                  type="button"
                                  onClick={async () => {
                                    if (!result.email) return;
                                    
                                    const selectedType = (document.querySelector(`input[name="emailType-${index}"]:checked`) as HTMLInputElement)?.value || 'simple';
                                    
                                    setSendingMultipleEmails(prev => ({ ...prev, [result.email]: true }));
                                    setSearchError(null);

                                    try {
                                      const response = await fetch('/api/prospection-automation', {
                                        method: 'POST',
                                        headers: {
                                          'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({
                                          mode: 'send-email',
                                          email: result.email,
                                          companyName: result.entreprise_nom,
                                          site: result.site,
                                          emailType: selectedType,
                                          message: selectedType === 'simple' ? result.message_personnalise : null,
                                        }),
                                      });

                                      const data = await response.json();

                                      if (!response.ok) {
                                        throw new Error(data.error || data.message || 'Erreur lors de l\'envoi');
                                      }

                                      setSentMultipleEmails(prev => ({ ...prev, [result.email]: true }));
                                    } catch (error: any) {
                                      console.error('Error sending email:', error);
                                      setSearchError(error.message || 'Erreur lors de l\'envoi de l\'email');
                                    } finally {
                                      setSendingMultipleEmails(prev => ({ ...prev, [result.email]: false }));
                                    }
                                  }}
                                  disabled={sendingMultipleEmails[result.email] || !result.email}
                                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500"
                                >
                                  {sendingMultipleEmails[result.email] ? (
                                    <>
                                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                      Envoi en cours...
                                    </>
                                  ) : (
                                    <>
                                      <Mail className="w-4 h-4 mr-2" />
                                      Envoyer l'email
                                    </>
                                  )}
                                </Button>
                              </>
                            ) : result.email && sentMultipleEmails[result.email] ? (
                              <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5" />
                                <span>L'email a été envoyé à {result.email} depuis contact@skillshield-ai.com avec succès !</span>
                              </div>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Affichage résultat prospection unique */}
                  {!prospectingMultiple && prospectingResult && prospectingResult.email && (
                    <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-green-500/30">
                      <h3 className="text-lg font-semibold text-white mb-4">Résultat de la prospection</h3>
                      <div className="mb-6">
                        <p className="text-sm text-gray-400 mb-2">Nom, secteur, site et email</p>
                        <div className="p-3 bg-slate-900/50 rounded border border-green-500/20">
                          <p className="text-white font-medium">
                            <span className="text-cyan-400">{prospectingResult.entreprise_nom}</span>
                            {prospectingResult.secteur && (
                              <> - <span className="text-violet-400">{prospectingResult.secteur}</span></>
                            )}
                            <br />
                            <span className="text-gray-300 text-sm">{prospectingResult.site}</span>
                            <br />
                            <span className="text-green-400">{prospectingResult.email}</span>
                          </p>
                        </div>
                      </div>

                      {!emailSent ? (
                        <>
                          <div className="mb-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                            <label className="block text-sm font-semibold text-gray-300 mb-3">
                              Type d'email à envoyer
                            </label>
                            <div className="space-y-2">
                              <label className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-cyan-500/30 cursor-pointer hover:border-cyan-500/50 transition-colors">
                                <input
                                  type="radio"
                                  name="emailType"
                                  value="simple"
                                  checked={emailType === 'simple'}
                                  onChange={(e) => setEmailType(e.target.value as 'simple' | 'quiz')}
                                  className="w-4 h-4 text-cyan-500"
                                />
                                <div className="flex-1">
                                  <p className="text-white font-medium">Message simple</p>
                                  <p className="text-xs text-gray-400">Message de prospection personnalisé</p>
                                </div>
                              </label>
                              <label className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-violet-500/30 cursor-pointer hover:border-violet-500/50 transition-colors">
                                <input
                                  type="radio"
                                  name="emailType"
                                  value="quiz"
                                  checked={emailType === 'quiz'}
                                  onChange={(e) => setEmailType(e.target.value as 'simple' | 'quiz')}
                                  className="w-4 h-4 text-violet-500"
                                />
                                <div className="flex-1">
                                  <p className="text-white font-medium">Quiz complet</p>
                                  <p className="text-xs text-gray-400">Quiz personnalisé comme sur /92300</p>
                                </div>
                              </label>
                            </div>
                          </div>

                          {emailType === 'simple' && prospectingResult.message_personnalise && (
                            <div className="mb-4">
                              <p className="text-sm text-gray-400 mb-2">Aperçu du message</p>
                              <div className="p-3 bg-slate-900/50 rounded border border-cyan-500/20 max-h-48 overflow-y-auto">
                                <p className="text-white text-sm whitespace-pre-line">{prospectingResult.message_personnalise}</p>
                              </div>
                            </div>
                          )}

                          <Button
                            type="button"
                            onClick={async () => {
                              if (!prospectingResult.email) return;
                              
                              setSendingEmail(true);
                              setSearchError(null);

                              try {
                                const response = await fetch('/api/prospection-automation', {
                                  method: 'POST',
                                  headers: {
                                    'Content-Type': 'application/json',
                                  },
                                  body: JSON.stringify({
                                    mode: 'send-email',
                                    email: prospectingResult.email,
                                    companyName: prospectingResult.entreprise_nom,
                                    site: prospectingResult.site,
                                    emailType: emailType,
                                    message: emailType === 'simple' ? prospectingResult.message_personnalise : null,
                                  }),
                                });

                                const data = await response.json();

                                if (!response.ok) {
                                  throw new Error(data.error || data.message || 'Erreur lors de l\'envoi');
                                }

                                setEmailSent(true);
                                // Réinitialiser après un court délai pour permettre une nouvelle analyse
                                setTimeout(() => {
                                  setProspectingResult(null);
                                  setEmailSent(false);
                                  setEmailType('simple');
                                  setSingleSite('');
                                }, 2000);
                              } catch (error: any) {
                                console.error('Error sending email:', error);
                                setSearchError(error.message || 'Erreur lors de l\'envoi de l\'email');
                              } finally {
                                setSendingEmail(false);
                              }
                            }}
                            disabled={sendingEmail}
                            className="w-full bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-500 hover:to-cyan-500"
                          >
                            {sendingEmail ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Envoi en cours...
                              </>
                            ) : (
                              <>
                                <Mail className="w-4 h-4 mr-2" />
                                Envoyer l'email à {prospectingResult.email}
                              </>
                            )}
                          </Button>
                        </>
                      ) : (
                        <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                          <div className="flex items-center gap-3">
                            <CheckCircle2 className="w-6 h-6 text-green-400" />
                            <div>
                              <p className="text-green-400 font-semibold">Email envoyé avec succès !</p>
                              <p className="text-sm text-gray-400 mt-1">
                                L'email a été envoyé à {prospectingResult.email} depuis contact@skillshield-ai.com
                              </p>
                              <p className="text-xs text-gray-500 mt-2">
                                Vous pouvez maintenant analyser un nouveau site en entrant une nouvelle URL ci-dessus.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {prospectingResult && !prospectingResult.email && (
                    <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-yellow-400" />
                        <div>
                          <p className="text-yellow-400 font-semibold">Email non trouvé</p>
                          <p className="text-sm text-gray-400 mt-1">
                            Aucun email autorisé trouvé sur {prospectingResult.site || 'le site'}. Prospection manuelle requise.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {useDirectMode ? (
                <div className="space-y-6">
                  {/* Section RGPD - Documentation de la source légitime */}
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <ShieldCheck className="w-5 h-5 text-blue-400" />
                      <h3 className="text-blue-400 font-semibold">📋 Documentation RGPD - Source Légitime</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          <BookOpen className="w-4 h-4 inline mr-2" />
                          Type de source légitime *
                        </label>
                        <select
                          value={legitimateSource}
                          onChange={(e) => setLegitimateSource(e.target.value as any)}
                          className="w-full px-4 py-3 bg-slate-800/50 border border-blue-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        >
                          <option value="annuaire">Annuaire professionnel</option>
                          <option value="partner_list">Liste d'entreprises partenaires</option>
                          <option value="provided">Liste fournie par un tiers autorisé</option>
                          <option value="other">Autre source légitime</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          <FileText className="w-4 h-4 inline mr-2" />
                          Nom de la source *
                        </label>
                        <input
                          type="text"
                          value={sourceName}
                          onChange={(e) => setSourceName(e.target.value)}
                          placeholder="Ex: PagesJaunes, Liste partenaires XYZ, etc."
                          className="w-full px-4 py-3 bg-slate-800/50 border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          <LinkIcon className="w-4 h-4 inline mr-2" />
                          URL de la source <span className="text-gray-500 text-xs">(optionnel)</span>
                        </label>
                        <input
                          type="url"
                          value={sourceUrl}
                          onChange={(e) => setSourceUrl(e.target.value)}
                          placeholder="https://..."
                          className="w-full px-4 py-3 bg-slate-800/50 border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          <ShieldCheck className="w-4 h-4 inline mr-2" />
                          Base légale RGPD *
                        </label>
                        <select
                          value={consentBasis}
                          onChange={(e) => setConsentBasis(e.target.value as any)}
                          className="w-full px-4 py-3 bg-slate-800/50 border border-blue-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        >
                          <option value="legitimate_interest">Intérêt légitime (art. 6.1.f RGPD)</option>
                          <option value="public_data">Données publiques (art. 6.1.e RGPD)</option>
                          <option value="partnership">Partenariat contractuel (art. 6.1.b RGPD)</option>
                        </select>
                        <p className="text-xs text-gray-400 mt-1">
                          {consentBasis === 'legitimate_interest' && '✓ Intérêt légitime pour la prospection B2B'}
                          {consentBasis === 'public_data' && '✓ Données publiques accessibles (sites web, annuaires)'}
                          {consentBasis === 'partnership' && '✓ Partenariat avec source autorisée'}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          <FileCheck className="w-4 h-4 inline mr-2" />
                          Conservation des données (mois) *
                        </label>
                        <select
                          value={dataRetention}
                          onChange={(e) => setDataRetention(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-800/50 border border-blue-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        >
                          <option value="6">6 mois</option>
                          <option value="12">12 mois (recommandé)</option>
                          <option value="24">24 mois</option>
                          <option value="36">36 mois</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          Notes de traçabilité <span className="text-gray-500 text-xs">(optionnel)</span>
                        </label>
                        <textarea
                          value={gdprNotes}
                          onChange={(e) => setGdprNotes(e.target.value)}
                          placeholder="Ajoutez des notes pour la traçabilité (ex: Date d'obtention, conditions d'utilisation, etc.)"
                          rows={3}
                          className="w-full px-4 py-3 bg-slate-800/50 border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section URLs */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      <FileText className="w-4 h-4 inline mr-2" />
                      URLs depuis la source légitime (une par ligne) *
                    </label>
                    <textarea
                      value={directWebsites}
                      onChange={(e) => setDirectWebsites(e.target.value)}
                      placeholder="Exemple depuis annuaire pro ou liste partenaire:&#10;https://entreprise1.com&#10;https://entreprise2.com&#10;entreprise3.com"
                      rows={6}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-violet-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 resize-none font-mono text-sm"
                      required
                    />
                    <p className="text-xs text-gray-400 mt-2">
                      💡 Entrez les URLs depuis la source légitime documentée ci-dessus. 
                      Google Cloud analysera les pages et extraira uniquement les emails génériques publics (contact@, info@, etc.).
                      L'IA triera et scorera les contacts par intérêt.
                    </p>
                  </div>
                </div>
              ) : null}
              
              {!prospectingSingle && !useDirectMode && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    <Building2 className="w-4 h-4 inline mr-2" />
                    Secteur
                  </label>
                  <input
                    type="text"
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    placeholder="Ex: Construction, Immobilier"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    required={automatedMode}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    <Target className="w-4 h-4 inline mr-2" />
                    Lieu
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Ex: Paris, Lyon, Marseille"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    required={automatedMode}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    <Building2 className="w-4 h-4 inline mr-2" />
                    Catégorie
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Ex: PME, Startup, TPE"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    required={automatedMode}
                  />
                </div>
                </div>
              )}

              <Button
                type="button"
                onClick={handleSearchEmails}
                disabled={searchingEmails || (useDirectMode ? (!directWebsites || !sourceName || !legitimateSource) : (!category || !sector || !location))}
                className="w-full"
              >
                {searchingEmails ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Scraping des pages Contact en cours...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Scraper les pages Contact
                  </>
                )}
              </Button>

              {searchError && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-red-400 text-sm whitespace-pre-line">{searchError}</p>
                      {searchError.includes('bloquée') && !useDirectMode && (
                        <button
                          type="button"
                          onClick={() => {
                            setUseDirectMode(true);
                            setSearchError(null);
                          }}
                          className="mt-3 px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-lg text-sm font-semibold transition-colors"
                        >
                          <FileText className="w-4 h-4 inline mr-2" />
                          Basculer vers le mode "Sites directs"
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {foundEmails.length > 0 && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {foundEmails.length} contact{foundEmails.length > 1 ? 's' : ''} trouvé{foundEmails.length > 1 ? 's' : ''}
                      </h3>
                      <p className="text-sm text-gray-400 mt-1">
                        Secteur: <span className="text-cyan-400">{sector}</span> • 
                        Lieu: <span className="text-cyan-400">{location}</span> • 
                        Catégorie: <span className="text-cyan-400">{category}</span>
                      </p>
                    </div>
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
                  <div className="max-h-96 overflow-y-auto space-y-2">
                    {foundEmails.map((prospect, index) => (
                      <div key={index} className="p-4 bg-slate-800/50 rounded-lg border border-cyan-500/20 hover:border-cyan-500/40 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-white font-medium">{prospect.companyName}</p>
                              {prospect.interestScore !== undefined && (
                                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                                  prospect.interestScore >= 80 ? 'bg-green-500/20 text-green-400' :
                                  prospect.interestScore >= 60 ? 'bg-blue-500/20 text-blue-400' :
                                  prospect.interestScore >= 40 ? 'bg-yellow-500/20 text-yellow-400' :
                                  'bg-gray-500/20 text-gray-400'
                                }`}>
                                  Score: {prospect.interestScore}/100
                                </span>
                              )}
                            </div>
                            <p className="text-cyan-400 text-sm mt-1">{prospect.email}</p>
                            {prospect.name && (
                              <p className="text-gray-400 text-xs mt-1">Contact: {prospect.name}</p>
                            )}
                            {prospect.sector && (
                              <p className="text-gray-400 text-xs mt-1">Secteur: {prospect.sector}</p>
                            )}
                            {prospect.source && (
                              <p className="text-gray-500 text-xs mt-1">Source: {prospect.source === 'provided' ? 'Liste fournie' : prospect.source}</p>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 ml-4">
                            <div className="bg-slate-700/50 px-2 py-1 rounded">{sector}</div>
                            <div className="bg-slate-700/50 px-2 py-1 rounded mt-1">{location}</div>
                            <div className="bg-slate-700/50 px-2 py-1 rounded mt-1">{category}</div>
                          </div>
                        </div>
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

