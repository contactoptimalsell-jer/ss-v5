import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle2, TrendingUp, Target, Zap, Sparkles, Briefcase, MessageCircle, Megaphone, Settings, Users, Loader2 } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

interface Question {
  id: number;
  text: string;
  options: {
    value: number;
    label: string;
  }[];
}

const questions: Question[] = [
  {
    id: 1,
    text: "Combien de temps passez-vous chaque semaine sur des tâches répétitives ? (emails, devis, relances, saisies...)",
    options: [
      { value: 0, label: "Plus de 15 heures" },
      { value: 1, label: "Entre 5 et 15 heures" },
      { value: 2, label: "Moins de 5 heures" }
    ]
  },
  {
    id: 2,
    text: "Quand vous partez en vacances, votre travail s'accumule-t-il ?",
    options: [
      { value: 0, label: "Oui, beaucoup" },
      { value: 1, label: "Un peu" },
      { value: 2, label: "Non, tout est géré" }
    ]
  },
  {
    id: 3,
    text: "Avez-vous des outils qui travaillent pour vous en votre absence ?",
    options: [
      { value: 0, label: "Non, tout est manuel" },
      { value: 1, label: "Quelques outils basiques" },
      { value: 2, label: "Oui, plusieurs outils automatisés" }
    ]
  },
  {
    id: 4,
    text: "Recevez-vous souvent les mêmes questions par email ou téléphone ?",
    options: [
      { value: 0, label: "Oui, très souvent" },
      { value: 1, label: "Parfois" },
      { value: 2, label: "Rarement ou jamais" }
    ]
  },
  {
    id: 5,
    text: "Avez-vous le temps de vous concentrer sur ce qui fait vraiment grandir votre entreprise ?",
    options: [
      { value: 0, label: "Non, je suis noyé dans l'administratif" },
      { value: 1, label: "Parfois, mais pas assez" },
      { value: 2, label: "Oui, je me concentre sur l'essentiel" }
    ]
  }
];

interface Result {
  level: 'Débutant' | 'Intermédiaire' | 'Avancé';
  potential: 'Élevé' | 'Moyen' | 'Faible';
  priority: 'Commencer maintenant' | 'Optimiser' | 'Aller plus loin';
  color: 'red' | 'orange' | 'green';
  emoji: '🟥' | '🟧' | '🟩';
  title: string;
  description: string;
  recommendation: string;
}

const getResult = (score: number): Result => {
  // Score max = 10 (5 questions × 2 points max)
  // Débutant: 0-5 points
  // Intermédiaire: 6-8 points
  // Avancé: 9-10 points

  if (score <= 5) {
    return {
      level: 'Débutant',
      potential: 'Élevé',
      priority: 'Commencer maintenant',
      color: 'red',
      emoji: '🟥',
      title: "Beaucoup de tâches reposent encore sur l'humain et le manuel.",
      description: "Beaucoup de tâches reposent encore sur l'humain et le manuel.",
      recommendation: "C'est le moment idéal pour commencer. Chaque petite automatisation va vous faire gagner du temps précieux. Commencez par une seule tâche qui vous prend le plus de temps."
    };
  } else if (score <= 8) {
    return {
      level: 'Intermédiaire',
      potential: 'Moyen',
      priority: 'Optimiser intelligemment',
      color: 'orange',
      emoji: '🟧',
      title: "Certaines choses sont déjà automatisées, mais il reste des gains simples à atteindre.",
      description: "Certaines choses sont déjà automatisées, mais il reste des gains simples à atteindre.",
      recommendation: "Vous êtes sur la bonne voie. Il est temps d'optimiser vos processus existants et d'identifier les prochaines tâches à automatiser pour gagner encore plus de temps."
    };
  } else {
    return {
      level: 'Avancé',
      potential: 'Faible',
      priority: 'Aller plus loin',
      color: 'green',
      emoji: '🟩',
      title: "Votre organisation est déjà efficace, quelques optimisations peuvent améliorer votre quotidien.",
      description: "Votre organisation est déjà efficace, quelques optimisations peuvent améliorer votre quotidien.",
      recommendation: "Vous maîtrisez déjà bien l'automatisation. Pour aller plus loin, identifiez les processus complexes qui pourraient encore être améliorés ou optimisés."
    };
  }
};

export const AutomationLevelQuiz: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const [sendingEmail, setSendingEmail] = useState(false);

  const CALENDLY_URL = 'https://calendly.com/b00784336-essec?utm_source=quiz&utm_campaign=automation_quiz&utm_medium=button';

  const handleProfessionClick = async (profession: string, automation: string) => {
    if (!result) return;

    setSendingEmail(true);
    try {
      // Envoyer l'email avec les données du quiz
      const response = await fetch('/api/send-quiz-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          score,
          level: result.level,
          potential: result.potential,
          priority: result.priority,
          selectedProfession: profession,
          selectedAutomation: automation,
        }),
      });

      if (!response.ok) {
        console.error('Erreur lors de l\'envoi de l\'email');
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
    } finally {
      setSendingEmail(false);
      // Ouvrir Calendly dans un nouvel onglet
      window.open(CALENDLY_URL, '_blank');
    }
  };

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculer le score final
      const totalScore = newAnswers.reduce((sum, answer) => sum + answer, 0);
      setScore(totalScore);
      const quizResult = getResult(totalScore);
      setResult(quizResult);
      setShowResult(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResult(false);
    setScore(0);
    setResult(null);
  };

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-violet-900/10 to-cyan-900/20 rounded-full blur-[100px] -z-10" />

      <div className="container mx-auto px-6 max-w-3xl">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm font-bold mb-4">
            📊 Diagnostic Rapide
          </span>
          <h2 className="text-3xl md:text-5xl font-bold font-display text-white mb-4">
            Votre niveau d'<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">automatisation</span> aujourd'hui
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Répondez à 5 questions simples sur votre quotidien. En 2 minutes, découvrez où vous en êtes et ce que vous pouvez améliorer.
          </p>
        </div>

        <Card className="border-violet-500/30" highlight>
          <div className="p-8 md:p-12">
            <AnimatePresence mode="wait">
              {!showResult ? (
                <motion.div
                  key={`question-${currentQuestion}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  {/* Progress Bar */}
                  <div className="mb-8">
                    <div className="flex justify-between text-sm text-gray-400 mb-2">
                      <span>Question {currentQuestion + 1} sur {questions.length}</span>
                      <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
                    </div>
                    <div className="w-full bg-slate-800/50 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                        className="bg-gradient-to-r from-violet-500 to-cyan-500 h-2 rounded-full"
                      />
                    </div>
                  </div>

                  {/* Question */}
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-6 leading-relaxed">
                      {questions[currentQuestion].text}
                    </h3>
                    <div className="space-y-3">
                      {questions[currentQuestion].options.map((option, index) => (
                        <motion.button
                          key={index}
                          onClick={() => handleAnswer(option.value)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full text-left p-4 bg-slate-800/50 hover:bg-slate-700/50 border-2 border-slate-700/50 hover:border-violet-500/50 rounded-xl transition-all duration-200 group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full border-2 border-gray-500 group-hover:border-violet-400 flex items-center justify-center shrink-0">
                              <div className="w-3 h-3 rounded-full bg-violet-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <span className="text-gray-200 group-hover:text-white font-medium">
                              {option.label}
                            </span>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-8"
                >
                  {/* Result Header */}
                  <div className="text-center">
                    <div className="text-6xl mb-4">{result?.emoji}</div>
                    <h3 className="text-3xl font-bold text-white mb-2">{result?.title}</h3>
                    <p className="text-gray-300 text-lg">{result?.description}</p>
                  </div>

                  {/* Result Cards */}
                  <div className="grid md:grid-cols-3 gap-4">
                    {/* Niveau */}
                    <div className={`p-6 rounded-xl border-2 ${
                      result?.color === 'red' ? 'bg-red-500/10 border-red-500/30' :
                      result?.color === 'orange' ? 'bg-orange-500/10 border-orange-500/30' :
                      'bg-green-500/10 border-green-500/30'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        <Target className={`w-5 h-5 ${
                          result?.color === 'red' ? 'text-red-400' :
                          result?.color === 'orange' ? 'text-orange-400' :
                          'text-green-400'
                        }`} />
                        <span className="text-sm text-gray-400 font-semibold">Votre niveau</span>
                      </div>
                      <p className={`text-2xl font-bold ${
                        result?.color === 'red' ? 'text-red-300' :
                        result?.color === 'orange' ? 'text-orange-300' :
                        'text-green-300'
                      }`}>
                        {result?.level}
                      </p>
                    </div>

                    {/* Potentiel */}
                    <div className={`p-6 rounded-xl border-2 ${
                      result?.color === 'red' ? 'bg-red-500/10 border-red-500/30' :
                      result?.color === 'orange' ? 'bg-orange-500/10 border-orange-500/30' :
                      'bg-green-500/10 border-green-500/30'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className={`w-5 h-5 ${
                          result?.color === 'red' ? 'text-red-400' :
                          result?.color === 'orange' ? 'text-orange-400' :
                          'text-green-400'
                        }`} />
                        <span className="text-sm text-gray-400 font-semibold">Potentiel</span>
                      </div>
                      <p className={`text-2xl font-bold ${
                        result?.color === 'red' ? 'text-red-300' :
                        result?.color === 'orange' ? 'text-orange-300' :
                        'text-green-300'
                      }`}>
                        {result?.potential}
                      </p>
                    </div>

                    {/* Priorité */}
                    <div className={`p-6 rounded-xl border-2 ${
                      result?.color === 'red' ? 'bg-red-500/10 border-red-500/30' :
                      result?.color === 'orange' ? 'bg-orange-500/10 border-orange-500/30' :
                      'bg-green-500/10 border-green-500/30'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className={`w-5 h-5 ${
                          result?.color === 'red' ? 'text-red-400' :
                          result?.color === 'orange' ? 'text-orange-400' :
                          'text-green-400'
                        }`} />
                        <span className="text-sm text-gray-400 font-semibold">Priorité</span>
                      </div>
                      <p className={`text-xl font-bold ${
                        result?.color === 'red' ? 'text-red-300' :
                        result?.color === 'orange' ? 'text-orange-300' :
                        'text-green-300'
                      }`}>
                        {result?.priority}
                      </p>
                    </div>
                  </div>

                  {/* Recommendation */}
                  <div className="p-6 bg-gradient-to-r from-violet-500/10 to-cyan-500/10 border border-violet-500/30 rounded-xl">
                    <div className="flex items-start gap-3">
                      <Sparkles className="w-6 h-6 text-cyan-400 shrink-0 mt-1" />
                      <div>
                        <h4 className="text-lg font-bold text-white mb-2">Notre recommandation</h4>
                        <p className="text-gray-300 leading-relaxed">{result?.recommendation}</p>
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      onClick={() => {
                        document.getElementById('audit-tool')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      icon={<ArrowRight className="w-5 h-5" />}
                      className="flex-1"
                    >
                      Découvrir mes solutions personnalisées
                    </Button>
                    <Button
                      onClick={handleRestart}
                      variant="secondary"
                      className="flex-1"
                    >
                      Refaire le diagnostic
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 2️⃣ CTA Générique - Affiche uniquement après le résultat */}
            {showResult && result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8"
              >
                <Card className="border-cyan-500/30 bg-gradient-to-br from-cyan-900/20 via-violet-900/20 to-cyan-900/20">
                  <div className="p-8 md:p-10 text-center">
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
                      Vous voyez où vous perdez le plus de temps ?
                    </h3>
                    <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed mb-8">
                      Commencez par automatiser la première tâche simple dès maintenant.
                    </p>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        onClick={() => {
                          document.getElementById('audit-tool')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        icon={<Sparkles className="w-6 h-6" />}
                        className="bg-gradient-to-r from-cyan-600 to-violet-600 hover:from-cyan-500 hover:to-violet-500 text-white border-0 text-xl px-10 py-6 rounded-2xl shadow-2xl shadow-cyan-500/30 font-bold transition-all duration-300"
                      >
                        Découvrir ma première automatisation
                      </Button>
                    </motion.div>
                    <p className="text-sm text-gray-300 mt-6 italic">
                      Aucune compétence technique nécessaire — on vous guide pas à pas.
                    </p>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* 3️⃣ CTA Personnalisé selon le Score - Affiche uniquement après le résultat */}
            {showResult && result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8"
              >
                <Card className={`border-2 ${
                  result.color === 'red' ? 'border-red-500/30 bg-gradient-to-br from-red-900/20 via-orange-900/20 to-red-900/20' :
                  result.color === 'orange' ? 'border-orange-500/30 bg-gradient-to-br from-orange-900/20 via-violet-900/20 to-orange-900/20' :
                  'border-green-500/30 bg-gradient-to-br from-green-900/20 via-cyan-900/20 to-green-900/20'
                }`}>
                  <div className="p-8 md:p-10 text-center">
                    <div className="mb-8">
                      {/* CTA Débutant 🟥 */}
                      {result.color === 'red' && (
                        <>
                          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
                            Commencez par automatiser votre tâche la plus chronophage aujourd'hui
                          </h3>
                        </>
                      )}

                      {/* CTA Intermédiaire 🟧 */}
                      {result.color === 'orange' && (
                        <>
                          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
                            Optimisez les tâches répétitives qui vous prennent le plus de temps
                          </h3>
                        </>
                      )}

                      {/* CTA Avancé 🟩 */}
                      {result.color === 'green' && (
                        <>
                          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
                            Améliorez les petites tâches restantes pour gagner encore plus de temps
                          </h3>
                        </>
                      )}
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        onClick={() => {
                          document.getElementById('audit-tool')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        icon={<Sparkles className="w-6 h-6" />}
                        className={`text-white border-0 text-xl px-10 py-6 rounded-2xl shadow-2xl font-bold transition-all duration-300 ${
                          result.color === 'red' ? 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 shadow-red-500/30' :
                          result.color === 'orange' ? 'bg-gradient-to-r from-orange-600 to-violet-600 hover:from-orange-500 hover:to-violet-500 shadow-orange-500/30' :
                          'bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-500 hover:to-cyan-500 shadow-green-500/30'
                        }`}
                      >
                        {result.color === 'red' ? 'Je veux ma première automatisation' :
                         result.color === 'orange' ? 'Optimiser mes premières automatisations' :
                         'Aller plus loin dans l\'automatisation'}
                      </Button>
                    </motion.div>
                    <p className="text-sm text-gray-300 mt-6 italic">
                      Aucune compétence technique nécessaire — on vous guide pas à pas.
                    </p>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* 4️⃣ CTA par Métier - Affiche uniquement après le résultat */}
            {showResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="mt-8 md:mt-12"
              >
                <div className="text-center mb-6 md:mb-8 px-4">
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2 md:mb-3 leading-tight">
                    Automatisez selon votre <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">métier</span>
                  </h3>
                  <p className="text-gray-300 text-sm md:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">
                    Choisissez votre métier et découvrez la première automatisation qui vous fera gagner du temps dès cette semaine.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {/* Commercial */}
                  <motion.div
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="bg-gradient-to-br from-green-900/30 to-emerald-900/20 rounded-xl p-4 md:p-6 border-2 border-green-500/30 cursor-pointer group flex flex-col h-full"
                  >
                    <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                      <div className="p-2 md:p-3 rounded-xl bg-green-500/20 border border-green-500/30 shrink-0">
                        <Briefcase className="w-5 h-5 md:w-6 md:h-6 text-green-400" />
                      </div>
                      <h4 className="text-lg md:text-xl font-bold text-white">Commercial</h4>
                    </div>
                    <p className="text-gray-200 mb-4 md:mb-5 leading-relaxed text-sm md:text-base flex-grow">
                      Vos relances prennent trop de temps ? <span className="text-green-300 font-semibold">Automatisez la première tâche simple et concentrez-vous sur vos ventes.</span>
                    </p>
                    <div className="mt-auto">
                      <Button
                        variant="secondary"
                        icon={sendingEmail ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                        onClick={() => handleProfessionClick('Commercial', 'Automatiser ma première relance')}
                        disabled={sendingEmail}
                        className="w-full bg-green-500/10 hover:bg-green-500/20 border-green-500/30 text-green-300 text-sm md:text-base py-2.5 md:py-3"
                      >
                        {sendingEmail ? 'Envoi en cours...' : 'Automatiser ma première relance'}
                      </Button>
                      <p className="text-xs text-gray-400 mt-2 md:mt-3 italic text-center">
                        Aucune compétence technique nécessaire
                      </p>
                    </div>
                  </motion.div>

                  {/* Support Client */}
                  <motion.div
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="bg-gradient-to-br from-blue-900/30 to-cyan-900/20 rounded-xl p-4 md:p-6 border-2 border-blue-500/30 cursor-pointer group flex flex-col h-full"
                  >
                    <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                      <div className="p-2 md:p-3 rounded-xl bg-blue-500/20 border border-blue-500/30 shrink-0">
                        <MessageCircle className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
                      </div>
                      <h4 className="text-lg md:text-xl font-bold text-white">Support client</h4>
                    </div>
                    <p className="text-gray-200 mb-4 md:mb-5 leading-relaxed text-sm md:text-base flex-grow">
                      Les questions répétitives vous ralentissent ? <span className="text-blue-300 font-semibold">Automatisez la première réponse type dès maintenant.</span>
                    </p>
                    <div className="mt-auto">
                      <Button
                        variant="secondary"
                        icon={sendingEmail ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                        onClick={() => handleProfessionClick('Support client', 'Créer ma première réponse automatique')}
                        disabled={sendingEmail}
                        className="w-full bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/30 text-blue-300 text-sm md:text-base py-2.5 md:py-3"
                      >
                        {sendingEmail ? 'Envoi en cours...' : 'Créer ma première réponse automatique'}
                      </Button>
                      <p className="text-xs text-gray-400 mt-2 md:mt-3 italic text-center">
                        Aucune compétence technique nécessaire
                      </p>
                    </div>
                  </motion.div>

                  {/* Marketing */}
                  <motion.div
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="bg-gradient-to-br from-purple-900/30 to-pink-900/20 rounded-xl p-4 md:p-6 border-2 border-purple-500/30 cursor-pointer group flex flex-col h-full"
                  >
                    <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                      <div className="p-2 md:p-3 rounded-xl bg-purple-500/20 border border-purple-500/30 shrink-0">
                        <Megaphone className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
                      </div>
                      <h4 className="text-lg md:text-xl font-bold text-white">Marketing</h4>
                    </div>
                    <p className="text-gray-200 mb-4 md:mb-5 leading-relaxed text-sm md:text-base flex-grow">
                      La création de contenus et campagnes vous prend trop de temps ? <span className="text-purple-300 font-semibold">Commencez par automatiser une tâche simple.</span>
                    </p>
                    <div className="mt-auto">
                      <Button
                        variant="secondary"
                        icon={sendingEmail ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                        onClick={() => handleProfessionClick('Marketing', 'Automatiser ma première campagne')}
                        disabled={sendingEmail}
                        className="w-full bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/30 text-purple-300 text-sm md:text-base py-2.5 md:py-3"
                      >
                        {sendingEmail ? 'Envoi en cours...' : 'Automatiser ma première campagne'}
                      </Button>
                      <p className="text-xs text-gray-400 mt-2 md:mt-3 italic text-center">
                        Aucune compétence technique nécessaire
                      </p>
                    </div>
                  </motion.div>

                  {/* Opérations / Admin */}
                  <motion.div
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="bg-gradient-to-br from-orange-900/30 to-amber-900/20 rounded-xl p-4 md:p-6 border-2 border-orange-500/30 cursor-pointer group flex flex-col h-full"
                  >
                    <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                      <div className="p-2 md:p-3 rounded-xl bg-orange-500/20 border border-orange-500/30 shrink-0">
                        <Settings className="w-5 h-5 md:w-6 md:h-6 text-orange-400" />
                      </div>
                      <h4 className="text-lg md:text-xl font-bold text-white">Opérations / Admin</h4>
                    </div>
                    <p className="text-gray-200 mb-4 md:mb-5 leading-relaxed text-sm md:text-base flex-grow">
                      Les tâches répétitives vous épuisent ? <span className="text-orange-300 font-semibold">Automatisez la première opération facilement.</span>
                    </p>
                    <div className="mt-auto">
                      <Button
                        variant="secondary"
                        icon={sendingEmail ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                        onClick={() => handleProfessionClick('Opérations / Admin', 'Automatiser ma première opération')}
                        disabled={sendingEmail}
                        className="w-full bg-orange-500/10 hover:bg-orange-500/20 border-orange-500/30 text-orange-300 text-sm md:text-base py-2.5 md:py-3"
                      >
                        {sendingEmail ? 'Envoi en cours...' : 'Automatiser ma première opération'}
                      </Button>
                      <p className="text-xs text-gray-400 mt-2 md:mt-3 italic text-center">
                        Aucune compétence technique nécessaire
                      </p>
                    </div>
                  </motion.div>

                  {/* RH */}
                  <motion.div
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="bg-gradient-to-br from-indigo-900/30 to-violet-900/20 rounded-xl p-4 md:p-6 border-2 border-indigo-500/30 cursor-pointer group flex flex-col h-full md:col-span-2 lg:col-span-1"
                  >
                    <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                      <div className="p-2 md:p-3 rounded-xl bg-indigo-500/20 border border-indigo-500/30 shrink-0">
                        <Users className="w-5 h-5 md:w-6 md:h-6 text-indigo-400" />
                      </div>
                      <h4 className="text-lg md:text-xl font-bold text-white">RH</h4>
                    </div>
                    <p className="text-gray-200 mb-4 md:mb-5 leading-relaxed text-sm md:text-base flex-grow">
                      Le suivi des candidatures prend trop de temps ? <span className="text-indigo-300 font-semibold">Automatisez la première étape simple dès maintenant.</span>
                    </p>
                    <div className="mt-auto">
                      <Button
                        variant="secondary"
                        icon={sendingEmail ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                        onClick={() => handleProfessionClick('RH', 'Automatiser mon premier process RH')}
                        disabled={sendingEmail}
                        className="w-full bg-indigo-500/10 hover:bg-indigo-500/20 border-indigo-500/30 text-indigo-300 text-sm md:text-base py-2.5 md:py-3"
                      >
                        {sendingEmail ? 'Envoi en cours...' : 'Automatiser mon premier process RH'}
                      </Button>
                      <p className="text-xs text-gray-400 mt-2 md:mt-3 italic text-center">
                        Aucune compétence technique nécessaire
                      </p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </div>
        </Card>
      </div>
    </section>
  );
};

