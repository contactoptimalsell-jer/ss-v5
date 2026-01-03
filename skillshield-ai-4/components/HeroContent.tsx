import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/Button';
import { Sparkles, ArrowRight, Zap, ShieldCheck, CheckCircle2, Star, Rocket, Heart, Timer } from 'lucide-react';
import { SectionId } from '../types';

export const HeroContent: React.FC = () => {
  const openCalendly = () => {
    window.open('https://calendly.com/b00784336-essec?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app', '_blank');
  };

  return (
    <section className="relative py-20 md:py-24 bg-cyan-950">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Headline principale */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8 md:mb-12"
          >
            <h1 className="font-display font-bold text-4xl md:text-6xl lg:text-7xl tracking-tight mb-4 md:mb-6 leading-[1.1]">
              <span className="block text-white">Stoppez les risques IA.</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-cyan-300 to-orange-400">
                Automatisez ce qui vous coûte du temps.
              </span>
              <span className="block text-xl md:text-3xl lg:text-4xl font-normal text-gray-300 mt-3 md:mt-4 font-sans">
                Réduisez les risques et automatisez <span className="text-cyan-300 font-semibold">20 à 40%</span> de vos tâches en 30 jours
              </span>
            </h1>
          </motion.div>

          {/* Value proposition */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-center mb-8 md:mb-12"
          >
            <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-200 leading-relaxed font-medium mb-4">
              <span className="text-white font-semibold">Service premium d'audit et d'implémentation IA</span> pour PME de services (10-100 salariés). 
              <span className="text-cyan-300 font-semibold"> Agences immobilières, cabinets comptables, ESN, PME B2B.</span>
            </p>
            <p className="max-w-2xl mx-auto text-base md:text-lg text-gray-300 leading-relaxed">
              <span className="text-violet-300 font-bold text-xl">Audit rapide.</span>{' '}
              <span className="text-cyan-300 font-bold text-xl">Implémentation ciblée.</span>{' '}
              <span className="text-orange-300 font-bold text-xl">Résultats mesurables.</span>
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto mb-8 md:mb-12"
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gradient-to-br from-violet-900/60 to-violet-800/40 rounded-xl p-5 md:p-6 border border-violet-400/30 text-center shadow-xl"
            >
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">20-40%</div>
              <div className="text-sm md:text-base text-violet-200 font-medium">Tâches automatisées</div>
              <div className="text-xs md:text-sm text-violet-300/70 mt-1">En 30 jours</div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gradient-to-br from-cyan-900/60 to-cyan-800/40 rounded-xl p-5 md:p-6 border border-cyan-400/30 text-center shadow-xl"
            >
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">30 jours</div>
              <div className="text-sm md:text-base text-cyan-200 font-medium">Premiers résultats</div>
              <div className="text-xs md:text-sm text-cyan-300/70 mt-1">Visibles et mesurables</div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gradient-to-br from-orange-900/60 to-orange-800/40 rounded-xl p-5 md:p-6 border border-orange-400/30 text-center shadow-xl"
            >
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">RGPD</div>
              <div className="text-sm md:text-base text-orange-200 font-medium">Risques identifiés</div>
              <div className="text-xs md:text-sm text-orange-300/70 mt-1">Et sécurisés</div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gradient-to-br from-green-900/60 to-green-800/40 rounded-xl p-5 md:p-6 border border-green-400/30 text-center shadow-xl"
            >
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">Sur-mesure</div>
              <div className="text-sm md:text-base text-green-200 font-medium">Pas de SaaS générique</div>
              <div className="text-xs md:text-sm text-green-300/70 mt-1">Implémentation ciblée</div>
            </motion.div>
          </motion.div>

          {/* CTA et Trust indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center mb-8 md:mb-12"
          >
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  onClick={openCalendly} 
                  icon={<Sparkles className="w-6 h-6"/>} 
                  className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white border-0 text-lg md:text-xl px-8 md:px-10 py-5 md:py-6 rounded-2xl shadow-2xl shadow-violet-500/40 font-bold transition-all duration-300"
                >
                  <span className="flex items-center gap-2">
                    <Rocket className="w-5 h-5" />
                    Demander un audit IA
                  </span>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="secondary" 
                  onClick={() => document.getElementById(SectionId.AUDIT_TOOL)?.scrollIntoView({ behavior: 'smooth' })} 
                  icon={<Zap className="w-6 h-6"/>}
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-md border-2 border-white/20 text-white text-lg md:text-xl px-8 md:px-10 py-5 md:py-6 rounded-2xl font-bold transition-all duration-300"
                >
                  <span className="flex items-center gap-2">
                    Voir comment ça marche
                    <ArrowRight className="w-5 h-5" />
                  </span>
                </Button>
              </motion.div>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 text-sm">
              <div className="flex items-center gap-2 text-cyan-300 bg-cyan-500/10 px-4 py-2 rounded-full border border-cyan-500/20">
                <CheckCircle2 className="w-4 h-4" />
                <span className="font-semibold">Audit rapide • 30 jours pour résultats</span>
              </div>
              <div className="flex items-center gap-2 text-violet-300 bg-violet-500/10 px-4 py-2 rounded-full border border-violet-500/20">
                <ShieldCheck className="w-4 h-4" />
                <span className="font-semibold">Risques RGPD identifiés et sécurisés</span>
              </div>
              <div className="flex items-center gap-2 text-orange-300 bg-orange-500/10 px-4 py-2 rounded-full border border-orange-500/20">
                <Timer className="w-4 h-4" />
                <span className="font-semibold">ROI mesurable dès le premier mois</span>
              </div>
            </div>
          </motion.div>

          {/* Témoignage */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-3xl mx-auto mb-8 md:mb-12"
          >
            <div className="bg-gradient-to-r from-slate-800/60 to-slate-900/60 rounded-2xl p-6 md:p-8 border border-white/10 backdrop-blur-md">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-white text-lg font-medium mb-2 italic">
                    "En 30 jours, on a automatisé 35% de nos tâches administratives. Les risques RGPD sont identifiés et sécurisés. ROI visible dès le premier mois."
                  </p>
                  <p className="text-cyan-300 text-sm font-semibold">
                    — Dirigeant PME, Cabinet comptable
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-center"
          >
            <motion.button
              onClick={() => document.getElementById(SectionId.AUDIT_TOOL)?.scrollIntoView({ behavior: 'smooth' })}
              className="group flex flex-col items-center gap-2 text-gray-400 hover:text-cyan-300 transition-colors"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-sm font-medium">Évaluez votre potentiel IA</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

