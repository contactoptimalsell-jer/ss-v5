import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Loader2, Sparkles, ArrowRight, User, Mail, Building, Briefcase, Users, Target } from 'lucide-react';
import { Button } from './ui/Button';

interface PersonalizedSolutionsQuizProps {
  isOpen: boolean;
  onClose: () => void;
  quizScore?: number;
  quizLevel?: string;
  quizPotential?: string;
  quizPriority?: string;
}

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

export const PersonalizedSolutionsQuiz: React.FC<PersonalizedSolutionsQuizProps> = ({
  isOpen,
  onClose,
  quizScore,
  quizLevel,
  quizPotential,
  quizPriority,
}) => {
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
  const [showEmailPrompt, setShowEmailPrompt] = useState(false);
  const [resultEmail, setResultEmail] = useState('');
  const [sendingResults, setSendingResults] = useState(false);
  const [resultsSent, setResultsSent] = useState(false);

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

  const handleCheckboxChange = (
    category: keyof QuizAnswers,
    value: string,
    isOther: boolean = false
  ) => {
    setQuizAnswers((prev) => {
      const currentArray = (prev[category] as string[]) || [];
      if (isOther) {
        // Pour "Autre", on gère le champ texte séparément
        return prev;
      }
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

  const canProceedToStep2 = () => {
    return quizAnswers.automationNeeds.length > 0;
  };

  const canProceedToStep3 = () => {
    return quizAnswers.solutionsInterested.length > 0 || quizAnswers.otherSolution;
  };

  const canProceedToStep4 = () => {
    return quizAnswers.mainGoal.length > 0 || quizAnswers.otherGoal;
  };

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
    if (!canSubmit()) return;

    setIsSubmitting(true);
    try {
      // 1. Calculer le score intelligent
      const scoreResponse = await fetch('/api/quiz-score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'personalized',
          quizAnswers,
          prospectInfo,
        }),
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

      // 2. Envoyer l'email avec le score calculé
      const emailResponse = await fetch('/api/quiz-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'complete',
          quizData: {
            score: quizScore,
            level: quizLevel,
            potential: quizPotential,
            priority: quizPriority,
          },
          calculatedScore: calculatedScoreData,
          quizAnswers,
          prospectInfo,
        }),
      });

      if (emailResponse.ok) {
        setIsSubmitted(true);
        // Afficher la demande d'email discrète après 1 seconde
        setTimeout(() => {
          setShowEmailPrompt(true);
        }, 1000);
      } else {
        console.error('Erreur lors de l\'envoi');
        alert('Une erreur est survenue. Veuillez réessayer.');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendResults = async () => {
    const emailToUse = resultEmail || prospectInfo.email;
    if (!emailToUse || !emailToUse.includes('@')) return;

    setSendingResults(true);
    try {
      // Extraire les informations pour le format demandé
      const profession = prospectInfo.role || 'Non spécifié';
      const automation = quizAnswers.automationNeeds[0] || quizAnswers.otherAutomation || 'Non spécifié';
      const score = calculatedScore 
        ? `${calculatedScore.score}/100 - ${calculatedScore.level}`
        : quizScore 
        ? `${quizScore}/10 - ${quizLevel || 'Non spécifié'}`
        : 'Non calculé';
      const potential = calculatedScore?.potential || quizPotential || 'Non spécifié';
      const priority = calculatedScore?.priority || quizPriority || 'Non spécifié';

      const response = await fetch('/api/send-quiz-results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: emailToUse,
          prospectName: prospectInfo.fullName || 'Prospect',
          profession,
          automation,
          score,
          potential,
          priority,
          companyName: prospectInfo.company,
          calculatedScore,
          quizAnswers,
        }),
      });

      if (response.ok) {
        setResultsSent(true);
      } else {
        throw new Error('Erreur lors de l\'envoi');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Une erreur est survenue lors de l\'envoi des résultats.');
    } finally {
      setSendingResults(false);
    }
  };

  const handleClose = () => {
    if (isSubmitted) {
      onClose();
      // Reset form
      setCurrentStep(1);
      setQuizAnswers({
        automationNeeds: [],
        solutionsInterested: [],
        mainGoal: [],
      });
      setProspectInfo({
        fullName: '',
        email: '',
        company: '',
        role: '',
        sector: '',
        teamSize: '',
        mainChallenge: '',
      });
      setIsSubmitted(false);
      setShowEmailPrompt(false);
      setResultEmail('');
      setResultsSent(false);
    } else {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-slate-900 rounded-2xl border border-white/10 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-slate-900/95 backdrop-blur-sm border-b border-white/10 p-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                Personnalisez vos solutions
              </h2>
              {currentStep < 4 && (
                <p className="text-sm text-gray-400">
                  Étape {currentStep} sur 4
                </p>
              )}
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            {isSubmitted ? (
              // Confirmation avec score calculé
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

                {/* Affichage du score calculé */}
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

                    {/* Recommandations */}
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
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      onClick={() => {
                        window.open(
                          'https://calendly.com/b00784336-essec?utm_source=quiz&utm_campaign=personalized_quiz&utm_medium=button',
                          '_blank'
                        );
                      }}
                      icon={<Sparkles className="w-5 h-5" />}
                      className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500"
                    >
                      Réserver mon rendez-vous
                    </Button>
                    <Button
                      onClick={handleClose}
                      variant="secondary"
                    >
                      Fermer
                    </Button>
                  </div>
                </div>

                {/* Demande d'email discrète pour envoyer les résultats */}
                {showEmailPrompt && !resultsSent && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-8 p-6 bg-gradient-to-br from-violet-500/10 to-cyan-500/10 rounded-xl border border-violet-500/20"
                  >
                    <p className="text-gray-300 text-sm mb-4 text-center">
                      💡 <strong>Souhaitez-vous recevoir vos résultats par email ?</strong>
                    </p>
                    <div className="flex gap-3">
                      <input
                        type="email"
                        value={resultEmail || prospectInfo.email}
                        onChange={(e) => setResultEmail(e.target.value)}
                        placeholder="votre@email.com"
                        className="flex-1 px-4 py-2 bg-slate-800/50 border border-violet-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 text-sm"
                      />
                      <Button
                        onClick={handleSendResults}
                        disabled={sendingResults || !resultEmail && !prospectInfo.email}
                        className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500"
                      >
                        {sendingResults ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Mail className="w-4 h-4 mr-2" />
                            Recevoir
                          </>
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-3 text-center">
                      Nous vous enverrons un récapitulatif de vos réponses
                    </p>
                  </motion.div>
                )}

                {resultsSent && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-center"
                  >
                    <CheckCircle2 className="w-5 h-5 text-green-400 mx-auto mb-2" />
                    <p className="text-green-300 text-sm">
                      ✅ Résultats envoyés à {resultEmail || prospectInfo.email}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <>
                {/* Introduction (Step 1) */}
                {currentStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                      Choisissez ce que vous aimeriez automatiser ou améliorer dans votre quotidien, sans jargon technique. Nous transformerons vos réponses en solutions concrètes.
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
                          <span className="text-gray-200 group-hover:text-white flex-1">
                            {option}
                          </span>
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
                          <span className="text-gray-200 group-hover:text-white flex-1">
                            {option}
                          </span>
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
                      <Button
                        variant="secondary"
                        onClick={() => setCurrentStep(1)}
                      >
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
                          <span className="text-gray-200 group-hover:text-white flex-1">
                            {option}
                          </span>
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
                      <Button
                        variant="secondary"
                        onClick={() => setCurrentStep(2)}
                      >
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
                      <Button
                        variant="secondary"
                        onClick={() => setCurrentStep(3)}
                      >
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
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

