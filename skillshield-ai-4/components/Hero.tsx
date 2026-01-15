import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Clock, AlertTriangle } from 'lucide-react';

export const Hero: React.FC = () => {
  const [timeWasted, setTimeWasted] = useState(0);
  const [moneyLost, setMoneyLost] = useState(0);

  // Calculer le temps et l'argent perdus depuis le chargement de la page (psychologie de l'urgence)
  useEffect(() => {
    const interval = setInterval(() => {
      // Estimation : 2h/semaine perdues = ~17 min/jour = ~1.2 min/heure
      setTimeWasted(prev => prev + 0.02); // minutes
      // Estimation : 500€/mois perdus = ~16.7€/jour = ~0.7€/heure
      setMoneyLost(prev => prev + 0.01); // euros
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-cyan-950 via-midnight to-cyan-950">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Logo en arrière-plan - bien fondu avec le fond */}
        <div 
          className="absolute inset-0 opacity-[0.06] mix-blend-screen"
          style={{
            backgroundImage: 'url(/images/skillshield-logo.png)',
            backgroundSize: '55%',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            filter: 'brightness(1.1) contrast(0.9)',
            maskImage: 'radial-gradient(ellipse 85% 65% at 50% 50%, black 35%, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse 85% 65% at 50% 50%, black 35%, transparent 75%)'
          }}
        />
        
        {/* Gradient orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      </div>

      {/* Psychological Trigger: Comparison & Urgency */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left: The Problem - What you're losing */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 mb-4">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="text-red-300 text-sm font-bold">Pendant que vous lisez ceci...</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-tight">
              <span className="block mb-2">Vos concurrents</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-400 to-orange-400">
                automatisent déjà.
              </span>
            </h1>

            {/* Real-time loss counter - Psychological trigger */}
            <div className="bg-slate-900/60 backdrop-blur-sm rounded-xl p-6 border border-red-500/20">
              <p className="text-gray-400 text-sm mb-4">Coût de l'inaction (depuis votre arrivée) :</p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-red-300">
                    <Clock className="w-5 h-5" />
                    <span className="text-sm">Temps perdu</span>
                  </div>
                  <span className="text-white font-bold text-lg">
                    {timeWasted.toFixed(1)} min
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-red-300">
                    <TrendingDown className="w-5 h-5" />
                    <span className="text-sm">Opportunités perdues</span>
                  </div>
                  <span className="text-white font-bold text-lg">
                    {moneyLost.toFixed(2)} €
                  </span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-red-500/20">
                <p className="text-red-200 text-xs">
                  💡 <span className="font-semibold">78% des PME de votre secteur</span> ont déjà commencé leur automatisation IA
                </p>
                <p className="text-red-300/60 text-[10px] mt-1 italic">Source: Elementor Blog</p>
              </div>
            </div>
          </motion.div>

          {/* Right: The Solution - What you could gain */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-4">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-green-300 text-sm font-bold">Ceux qui ont agi :</span>
            </div>

            <div className="bg-gradient-to-br from-violet-500/10 to-cyan-500/10 backdrop-blur-sm rounded-xl p-8 border border-violet-500/20">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                Ils ont récupéré en moyenne :
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-green-500/20">
                  <div>
                    <p className="text-gray-300 text-sm">Temps récupéré</p>
                    <p className="text-green-400 font-bold text-xl">12-20h / semaine</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-400" />
                </div>
                
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-violet-500/20">
                  <div>
                    <p className="text-gray-300 text-sm">Tâches automatisées</p>
                    <p className="text-violet-400 font-bold text-xl">20-40%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-violet-400" />
                </div>
                
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-cyan-500/20">
                  <div>
                    <p className="text-gray-300 text-sm">ROI moyen</p>
                    <p className="text-cyan-400 font-bold text-xl">300-500%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-cyan-400" />
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-white text-sm font-semibold mb-2">En seulement 30 jours</p>
                <p className="text-gray-400 text-xs">
                  Risques RGPD sécurisés • Automatisations opérationnelles • ROI visible
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Challenge to ego - Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <div className="bg-gradient-to-r from-orange-500/10 via-red-500/10 to-orange-500/10 rounded-xl p-6 border border-orange-500/20 backdrop-blur-sm max-w-3xl mx-auto">
            <p className="text-white text-lg md:text-xl font-bold mb-2">
              Êtes-vous prêt à rester en arrière ?
            </p>
            <p className="text-gray-300 text-sm md:text-base">
              Ou préférez-vous rejoindre les 78% qui ont déjà pris de l'avance ?
            </p>
            <p className="text-gray-400/60 text-[10px] mt-2 italic">Source: Elementor Blog</p>
          </div>
        </motion.div>
      </div>
      
      {/* Smooth transition to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cyan-950 to-transparent z-10" />
    </main>
  );
};
