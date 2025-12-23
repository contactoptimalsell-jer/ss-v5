import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Loader2, Sparkles, ArrowRight, User, Mail, Building, Briefcase, Users, Target, ShieldCheck } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

// Réutiliser les interfaces de PersonalizedSolutionsQuiz
interface QuizAnswers {
  automationNeeds: string[];
  solutionsInterested: string[];
  mainGoal: string[];
  otherAutomation?: string;
  otherSolution?: string;
  otherGoal?: string;
}

interface ProspectInfo {
  fullName: string;
  email: string;
  company: string;
  role: string;
  sector: string;
  teamSize: string;
  mainChallenge: string;
}

interface TokenData {
  prospectName: string;
  prospectEmail: string;
  prospectProblem: string;
  opened: boolean;
  completed: boolean;
}

export const QuizWithTokenPage: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers>({
    automationNeeds: [],
    solutionsInterested: [],
    mainGoal: [],
  });
  const [prospectInfo, setProspectInfo] = useState<ProspectInfo>({
    fullName: '',
    email: '',
    company: '',
    role: '',
    sector: '',
    teamSize: '',
    mainChallenge: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [calculatedScore, setCalculatedScore] = useState<{
    score: number;
    color: 'red' | 'orange' | 'green';
    level: string;
    potential: string;
    priority: string;
    recommendations: string[];
  } | null>(null);
  const [baseQuizScore, setBaseQuizScore] = useState<{
    score: number;
    color: string;
    level: string;
    potential: string;
    priority: string;
  } | null>(null);

  // Options du quiz (même que PersonalizedSolutionsQuiz)
  const automationOptions = [
    'Emails répétitifs',
    'Relances clients',
    'Gestion des leads',
    'Suivi des candidatures',
    'Création de contenu',
    'Gestion des stocks',
    'Réponses aux questions fréquentes',
    'Planification et rendez-vous',
  ];

  const solutionOptions = [
    'Chatbot pour répondre aux clients',
    'Automatisation de tâches répétitives',
    'Outils SaaS intelligents',
    'Génération de contenu automatique',
    'Tri et organisation des emails',
    'Suivi et relance automatique',
  ];

  const goalOptions = [
    'Gagner du temps',
    'Réduire les erreurs',
    'Augmenter les ventes',
    'Améliorer le suivi client',
    'Libérer mon équipe pour des tâches importantes',
    'Optimiser mes processus',
  ];

  const sectorOptions = [
    'Commerce / E-commerce',
    'Services',
    'Immobilier',
    'Santé',
    'Restauration',
    'Finance',
    'Éducation',
    'Transport',
    'BTP',
    'Industrie',
    'Autre',
  ];

  const teamSizeOptions = [
    '1-5 personnes',
    '6-20 personnes',
    '21-50 personnes',
    '51-200 personnes',
    'Plus de 200 personnes',
  ];

  // Récupérer le token depuis l'URL
  useEffect(() => {
    const path = window.location.pathname;
    const match = path.match(/^\/quiz\/(.+)$/);
    if (match) {
      const extractedToken = match[1];
      setToken(extractedToken);
      loadTokenData(extractedToken);
    } else {
      setError('Token invalide');
      setLoading(false);
    }
  }, []);

  // Charger les données du token et tracker l'ouverture
  const loadTokenData = async (tokenValue: string) => {
    try {
      console.log(`🔍 [QuizWithTokenPage] Chargement token: ${tokenValue.substring(0, 10)}...`);
      // Récupérer les données du token
      const response = await fetch(`/api/quiz-token?token=${encodeURIComponent(tokenValue)}`);
      console.log(`📡 [QuizWithTokenPage] Réponse API: ${response.status} ${response.statusText}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(`❌ [QuizWithTokenPage] Erreur API:`, errorData);
        throw new Error(errorData.error || 'Token invalide ou expiré');
      }

      const data = await response.json();
      if (data.success && data.data) {
        setTokenData(data.data);
        // Pré-remplir l'email si disponible
        if (data.data.prospectEmail) {
          setProspectInfo(prev => ({ ...prev, email: data.data.prospectEmail }));
        }
        // Tracker l'ouverture si pas déjà fait
        if (!data.data.opened) {
          await fetch('/api/quiz-token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: tokenValue, action: 'opened' }),
          });
        }
      } else {
        throw new Error('Token invalide');
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement du quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (category: keyof QuizAnswers, value: string) => {
    setQuizAnswers((prev) => {
      const currentArray = (prev[category] as string[]) || [];
      if (currentArray.includes(value)) {
        return {
          ...prev,
          [category]: currentArray.filter((item) => item !== value),
        };
      } else {
        return {
          ...prev,
          [category]: [...currentArray, value],
        };
      }
    });
  };

  const handleInputChange = (field: keyof ProspectInfo, value: string) => {
    setProspectInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleOtherInputChange = (field: keyof QuizAnswers, value: string) => {
    setQuizAnswers((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const canProceedToStep2 = () => quizAnswers.automationNeeds.length > 0;
  const canProceedToStep3 = () => quizAnswers.solutionsInterested.length > 0 || quizAnswers.otherSolution;
  const canProceedToStep4 = () => quizAnswers.mainGoal.length > 0 || quizAnswers.otherGoal;

  const canSubmit = () => {
    return (
      prospectInfo.fullName.trim() !== '' &&
      prospectInfo.email.trim() !== '' &&
      prospectInfo.email.includes('@') &&
      prospectInfo.company.trim() !== '' &&
      prospectInfo.role.trim() !== '' &&
      prospectInfo.sector.trim() !== '' &&
      prospectInfo.teamSize.trim() !== ''
    );
  };

  const handleSubmit = async () => {
    if (!canSubmit() || !token) return;

    setIsSubmitting(true);
    try {
      // 1. Calculer le score intelligent
      const scoreResponse = await fetch('/api/quiz-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'personalized', quizAnswers, prospectInfo }),
      });

      let calculatedScoreData = null;
      if (scoreResponse.ok) {
        const scoreData = await scoreResponse.json();
        if (scoreData.success && scoreData.result) {
          calculatedScoreData = scoreData.result;
          setCalculatedScore({
            score: scoreData.result.score,
            color: scoreData.result.color,
            level: scoreData.result.level,
            potential: scoreData.result.potential,
            priority: scoreData.result.priority,
            recommendations: scoreData.result.recommendations,
          });
        }
      }

      // 2. Soumettre les réponses avec le score
      const submitResponse = await fetch('/api/submit-quiz-answers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          quizAnswers,
          prospectInfo,
          calculatedScore: calculatedScoreData,
          baseQuizScore: baseQuizScore || undefined,
        }),
      });

      if (submitResponse.ok) {
        setIsSubmitted(true);
        // Rediriger vers Calendly après 2 secondes
        setTimeout(() => {
          window.open(
            'https://calendly.com/b00784336-essec?utm_source=quiz&utm_campaign=quiz_completed&utm_medium=button',
            '_blank'
          );
        }, 2000);
      } else {
        throw new Error('Erreur lors de la soumission');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-midnight text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-violet-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-300">Chargement du quiz...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-midnight text-white flex items-center justify-center">
        <Card className="max-w-md">
          <div className="text-center p-8">
            <ShieldCheck className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Erreur</h2>
            <p className="text-gray-300 mb-6">{error}</p>
            <p className="text-sm text-gray-400">
              Ce lien est invalide ou a expiré. Veuillez contacter la personne qui vous a envoyé ce quiz.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-midnight text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-midnight/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-violet-400" />
            <span className="text-white font-semibold">SkillShield AI</span>
          </div>
          {tokenData && (
            <div className="text-sm text-gray-400">
              Quiz pour {tokenData.prospectName}
            </div>
          )}
        </div>
      </header>

      <div className="container mx-auto px-6 py-12 max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold font-display text-white mb-4">
            Quiz Personnalisé <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">SkillShield AI</span>
          </h1>
          <p className="text-gray-300 text-lg">
            Répondez à quelques questions pour identifier les solutions les plus adaptées à votre activité
          </p>
          {tokenData?.prospectProblem && (
            <p className="text-gray-400 text-sm mt-2 italic">
              Contexte : {tokenData.prospectProblem}
            </p>
          )}
        </div>

        <Card className="border-violet-500/30" highlight>
          <div className="p-6 md:p-8">
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-8"
              >
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Merci ! Vos réponses ont bien été enregistrées.
                  </h3>
                  <p className="text-gray-300 text-lg mb-6">
                    Votre plan personnalisé vous sera présenté lors du rendez-vous.
                  </p>
                </div>

                {calculatedScore && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className={`mb-8 p-6 rounded-xl border-2 ${
                      calculatedScore.color === 'red' ? 'bg-red-500/10 border-red-500/30' :
                      calculatedScore.color === 'orange' ? 'bg-orange-500/10 border-orange-500/30' :
                      'bg-green-500/10 border-green-500/30'
                    }`}
                  >
                    <div className="text-center mb-4">
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-3 ${
                        calculatedScore.color === 'red' ? 'bg-red-500/20 border border-red-500/30' :
                        calculatedScore.color === 'orange' ? 'bg-orange-500/20 border border-orange-500/30' :
                        'bg-green-500/20 border border-green-500/30'
                      }`}>
                        <span className="text-2xl">
                          {calculatedScore.color === 'red' ? '🟥' : calculatedScore.color === 'orange' ? '🟧' : '🟩'}
                        </span>
                        <span className={`text-sm font-bold uppercase ${
                          calculatedScore.color === 'red' ? 'text-red-300' :
                          calculatedScore.color === 'orange' ? 'text-orange-300' :
                          'text-green-300'
                        }`}>
                          {calculatedScore.level}
                        </span>
                      </div>
                      <div className={`text-4xl font-bold mb-2 ${
                        calculatedScore.color === 'red' ? 'text-red-300' :
                        calculatedScore.color === 'orange' ? 'text-orange-300' :
                        'text-green-300'
                      }`}>
                        {calculatedScore.score}/100
                      </div>
                      <p className="text-gray-300 text-sm">
                        Potentiel : <span className="font-semibold">{calculatedScore.potential}</span> • Priorité : <span className="font-semibold">{calculatedScore.priority}</span>
                      </p>
                    </div>

                    {calculatedScore.recommendations.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <h4 className="text-white font-semibold mb-3 text-sm">Recommandations personnalisées :</h4>
                        <ul className="space-y-2">
                          {calculatedScore.recommendations.map((rec, index) => (
                            <li key={index} className="text-gray-300 text-sm flex items-start gap-2">
                              <span className="text-violet-400 mt-1">•</span>
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </motion.div>
                )}

                <div className="text-center">
                  <p className="text-sm text-gray-400 mb-6">
                    Réservez maintenant votre créneau pour découvrir vos solutions personnalisées.
                  </p>
                  <Button
                    onClick={() => {
                      window.open(
                        'https://calendly.com/b00784336-essec?utm_source=quiz&utm_campaign=quiz_completed&utm_medium=button',
                        '_blank'
                      );
                    }}
                    icon={<Sparkles className="w-5 h-5" />}
                    className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500"
                  >
                    Réserver mon rendez-vous
                  </Button>
                </div>
              </motion.div>
            ) : (
              <>
                {/* Step 1: Automation Needs */}
                {currentStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                      Choisissez ce que vous aimeriez automatiser ou améliorer dans votre quotidien, sans jargon technique.
                    </p>
                    <div className="space-y-4">
                      <label className="block text-white font-semibold mb-4 text-lg">
                        Qu'aimeriez-vous automatiser ? <span className="text-gray-400 font-normal text-sm">(plusieurs choix possibles)</span>
                      </label>
                      {automationOptions.map((option) => (
                        <label
                          key={option}
                          className="flex items-center gap-3 p-4 bg-slate-800/50 hover:bg-slate-800 border border-white/5 rounded-xl cursor-pointer transition-all group"
                        >
                          <input
                            type="checkbox"
                            checked={quizAnswers.automationNeeds.includes(option)}
                            onChange={() => handleCheckboxChange('automationNeeds', option)}
                            className="w-5 h-5 rounded border-white/20 text-violet-500 focus:ring-violet-500 focus:ring-2"
                          />
                          <span className="text-gray-200 group-hover:text-white flex-1">{option}</span>
                        </label>
                      ))}
                      <div className="mt-4">
                        <input
                          type="text"
                          placeholder="Autre (précisez)"
                          value={quizAnswers.otherAutomation || ''}
                          onChange={(e) => handleOtherInputChange('otherAutomation', e.target.value)}
                          className="w-full p-4 bg-slate-800/50 border border-white/5 rounded-xl text-white placeholder-gray-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none"
                        />
                      </div>
                    </div>
                    <div className="mt-8 flex justify-end">
                      <Button
                        onClick={() => setCurrentStep(2)}
                        disabled={!canProceedToStep2()}
                        icon={<ArrowRight className="w-4 h-4" />}
                      >
                        Continuer
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Solutions */}
                {currentStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div className="space-y-4">
                      <label className="block text-white font-semibold mb-4 text-lg">
                        Quelles solutions vous intéressent le plus ? <span className="text-gray-400 font-normal text-sm">(plusieurs choix possibles)</span>
                      </label>
                      {solutionOptions.map((option) => (
                        <label
                          key={option}
                          className="flex items-center gap-3 p-4 bg-slate-800/50 hover:bg-slate-800 border border-white/5 rounded-xl cursor-pointer transition-all group"
                        >
                          <input
                            type="checkbox"
                            checked={quizAnswers.solutionsInterested.includes(option)}
                            onChange={() => handleCheckboxChange('solutionsInterested', option)}
                            className="w-5 h-5 rounded border-white/20 text-violet-500 focus:ring-violet-500 focus:ring-2"
                          />
                          <span className="text-gray-200 group-hover:text-white flex-1">{option}</span>
                        </label>
                      ))}
                      <div className="mt-4">
                        <input
                          type="text"
                          placeholder="Autre (précisez)"
                          value={quizAnswers.otherSolution || ''}
                          onChange={(e) => handleOtherInputChange('otherSolution', e.target.value)}
                          className="w-full p-4 bg-slate-800/50 border border-white/5 rounded-xl text-white placeholder-gray-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none"
                        />
                      </div>
                    </div>
                    <div className="mt-8 flex justify-between">
                      <Button variant="secondary" onClick={() => setCurrentStep(1)}>
                        Retour
                      </Button>
                      <Button
                        onClick={() => setCurrentStep(3)}
                        disabled={!canProceedToStep3()}
                        icon={<ArrowRight className="w-4 h-4" />}
                      >
                        Continuer
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Goals */}
                {currentStep === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div className="space-y-4">
                      <label className="block text-white font-semibold mb-4 text-lg">
                        Quel est votre principal objectif ? <span className="text-gray-400 font-normal text-sm">(plusieurs choix possibles)</span>
                      </label>
                      {goalOptions.map((option) => (
                        <label
                          key={option}
                          className="flex items-center gap-3 p-4 bg-slate-800/50 hover:bg-slate-800 border border-white/5 rounded-xl cursor-pointer transition-all group"
                        >
                          <input
                            type="checkbox"
                            checked={quizAnswers.mainGoal.includes(option)}
                            onChange={() => handleCheckboxChange('mainGoal', option)}
                            className="w-5 h-5 rounded border-white/20 text-violet-500 focus:ring-violet-500 focus:ring-2"
                          />
                          <span className="text-gray-200 group-hover:text-white flex-1">{option}</span>
                        </label>
                      ))}
                      <div className="mt-4">
                        <input
                          type="text"
                          placeholder="Autre (précisez)"
                          value={quizAnswers.otherGoal || ''}
                          onChange={(e) => handleOtherInputChange('otherGoal', e.target.value)}
                          className="w-full p-4 bg-slate-800/50 border border-white/5 rounded-xl text-white placeholder-gray-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none"
                        />
                      </div>
                    </div>
                    <div className="mt-8 flex justify-between">
                      <Button variant="secondary" onClick={() => setCurrentStep(2)}>
                        Retour
                      </Button>
                      <Button
                        onClick={() => setCurrentStep(4)}
                        disabled={!canProceedToStep4()}
                        icon={<ArrowRight className="w-4 h-4" />}
                      >
                        Continuer
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Prospect Info */}
                {currentStep === 4 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <p className="text-gray-300 mb-6">
                      Quelques informations pour personnaliser votre plan :
                    </p>
                    <div className="space-y-4">
                      <div>
                        <label className="flex items-center gap-2 text-white font-medium mb-2">
                          <User className="w-4 h-4 text-violet-400" />
                          Nom complet *
                        </label>
                        <input
                          type="text"
                          value={prospectInfo.fullName}
                          onChange={(e) => handleInputChange('fullName', e.target.value)}
                          className="w-full p-4 bg-slate-800/50 border border-white/5 rounded-xl text-white placeholder-gray-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none"
                          placeholder="Jean Dupont"
                          required
                        />
                      </div>
                      <div>
                        <label className="flex items-center gap-2 text-white font-medium mb-2">
                          <Mail className="w-4 h-4 text-violet-400" />
                          Email *
                        </label>
                        <input
                          type="email"
                          value={prospectInfo.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="w-full p-4 bg-slate-800/50 border border-white/5 rounded-xl text-white placeholder-gray-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none"
                          placeholder="jean.dupont@exemple.com"
                          required
                        />
                      </div>
                      <div>
                        <label className="flex items-center gap-2 text-white font-medium mb-2">
                          <Building className="w-4 h-4 text-violet-400" />
                          Société *
                        </label>
                        <input
                          type="text"
                          value={prospectInfo.company}
                          onChange={(e) => handleInputChange('company', e.target.value)}
                          className="w-full p-4 bg-slate-800/50 border border-white/5 rounded-xl text-white placeholder-gray-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none"
                          placeholder="Mon Entreprise"
                          required
                        />
                      </div>
                      <div>
                        <label className="flex items-center gap-2 text-white font-medium mb-2">
                          <Briefcase className="w-4 h-4 text-violet-400" />
                          Poste / Rôle *
                        </label>
                        <input
                          type="text"
                          value={prospectInfo.role}
                          onChange={(e) => handleInputChange('role', e.target.value)}
                          className="w-full p-4 bg-slate-800/50 border border-white/5 rounded-xl text-white placeholder-gray-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none"
                          placeholder="Directeur, Manager, etc."
                          required
                        />
                      </div>
                      <div>
                        <label className="flex items-center gap-2 text-white font-medium mb-2">
                          <Building className="w-4 h-4 text-violet-400" />
                          Secteur d'activité *
                        </label>
                        <select
                          value={prospectInfo.sector}
                          onChange={(e) => handleInputChange('sector', e.target.value)}
                          className="w-full p-4 bg-slate-800/50 border border-white/5 rounded-xl text-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none"
                          required
                        >
                          <option value="">Sélectionnez votre secteur</option>
                          {sectorOptions.map((sector) => (
                            <option key={sector} value={sector} className="bg-slate-800">
                              {sector}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="flex items-center gap-2 text-white font-medium mb-2">
                          <Users className="w-4 h-4 text-violet-400" />
                          Taille de l'équipe *
                        </label>
                        <select
                          value={prospectInfo.teamSize}
                          onChange={(e) => handleInputChange('teamSize', e.target.value)}
                          className="w-full p-4 bg-slate-800/50 border border-white/5 rounded-xl text-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none"
                          required
                        >
                          <option value="">Sélectionnez la taille</option>
                          {teamSizeOptions.map((size) => (
                            <option key={size} value={size} className="bg-slate-800">
                              {size}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="flex items-center gap-2 text-white font-medium mb-2">
                          <Target className="w-4 h-4 text-violet-400" />
                          Défi principal actuel
                        </label>
                        <textarea
                          value={prospectInfo.mainChallenge}
                          onChange={(e) => handleInputChange('mainChallenge', e.target.value)}
                          className="w-full p-4 bg-slate-800/50 border border-white/5 rounded-xl text-white placeholder-gray-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none resize-none"
                          placeholder="Décrivez brièvement votre principal défi..."
                          rows={3}
                        />
                      </div>
                    </div>
                    <div className="mt-8 flex justify-between">
                      <Button variant="secondary" onClick={() => setCurrentStep(3)}>
                        Retour
                      </Button>
                      <Button
                        onClick={handleSubmit}
                        disabled={!canSubmit() || isSubmitting}
                        icon={isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                        className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500"
                      >
                        {isSubmitting ? 'Envoi en cours...' : 'Réserver mon rendez-vous et recevoir mon plan'}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
