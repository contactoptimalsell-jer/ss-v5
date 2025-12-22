import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle2, TrendingUp, Target, Zap, Sparkles } from 'lucide-react';
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
  // Débutant: 0-3 points
  // Intermédiaire: 4-7 points
  // Avancé: 8-10 points

  if (score <= 3) {
    return {
      level: 'Débutant',
      potential: 'Élevé',
      priority: 'Commencer maintenant',
      color: 'red',
      emoji: '🟥',
      title: "Vous êtes au début de votre parcours d'automatisation",
      description: "Vous passez beaucoup de temps sur des tâches répétitives qui pourraient être gérées différemment. La bonne nouvelle ? Vous avez un potentiel énorme d'amélioration.",
      recommendation: "C'est le moment idéal pour commencer. Chaque petite automatisation va vous faire gagner du temps précieux. Commencez par une seule tâche qui vous prend le plus de temps."
    };
  } else if (score <= 7) {
    return {
      level: 'Intermédiaire',
      potential: 'Moyen',
      priority: 'Optimiser',
      color: 'orange',
      emoji: '🟧',
      title: "Vous avez déjà quelques automatisations en place",
      description: "C'est un bon début ! Vous avez commencé à automatiser certaines tâches, mais il reste encore du potentiel. Vous pouvez aller plus loin et optimiser ce qui existe déjà.",
      recommendation: "Vous êtes sur la bonne voie. Il est temps d'optimiser vos processus existants et d'identifier les prochaines tâches à automatiser pour gagner encore plus de temps."
    };
  } else {
    return {
      level: 'Avancé',
      potential: 'Faible',
      priority: 'Aller plus loin',
      color: 'green',
      emoji: '🟩',
      title: "Vous avez déjà bien automatisé votre quotidien",
      description: "Félicitations ! Vous avez mis en place plusieurs automatisations et vous savez gérer votre temps efficacement. Vous pouvez maintenant vous concentrer sur l'optimisation fine.",
      recommendation: "Vous maîtrisez déjà bien l'automatisation. Pour aller plus loin, identifiez les processus complexes qui pourraient encore être améliorés ou optimisés."
    };
  }
};

export const AutomationLevelQuiz: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculer le score final
      const totalScore = newAnswers.reduce((sum, answer) => sum + answer, 0);
      setScore(totalScore);
      setShowResult(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResult(false);
    setScore(0);
  };

  const result = showResult ? getResult(score) : null;

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
          </div>
        </Card>
      </div>
    </section>
  );
};

