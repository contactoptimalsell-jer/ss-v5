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
          
          {/* Headline principale - Simplifiée et claire */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 md:mb-16"
          >
            <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight mb-6 md:mb-8 leading-[1.1]">
              <span className="block text-white mb-2">Sécurisez vos usages IA.</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-cyan-300 to-violet-400">
                Automatisez 20-40% de vos tâches.
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-300 leading-relaxed font-medium">
              Audit IA • Implémentation sur-mesure • Résultats en 30 jours
            </p>
          </motion.div>

          {/* Value proposition - Plus concise */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-center mb-10 md:mb-12"
          >
            <p className="max-w-2xl mx-auto text-base md:text-lg text-gray-300 leading-relaxed">
              Pour <span className="text-white font-semibold">PME de services</span> (10-100 salariés) : 
              <span className="text-cyan-300"> agences immobilières, cabinets comptables, ESN, PME B2B</span>
            </p>
          </motion.div>

          {/* Stats - Simplifiées et plus lisibles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto mb-10 md:mb-12"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-violet-500/10 rounded-xl p-6 border border-violet-400/20 text-center backdrop-blur-sm"
            >
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">20-40%</div>
              <div className="text-sm text-violet-200">Tâches automatisées</div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-cyan-500/10 rounded-xl p-6 border border-cyan-400/20 text-center backdrop-blur-sm"
            >
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">30 jours</div>
              <div className="text-sm text-cyan-200">Premiers résultats</div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-orange-500/10 rounded-xl p-6 border border-orange-400/20 text-center backdrop-blur-sm"
            >
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">RGPD</div>
              <div className="text-sm text-orange-200">Risques sécurisés</div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-green-500/10 rounded-xl p-6 border border-green-400/20 text-center backdrop-blur-sm"
            >
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">Sur-mesure</div>
              <div className="text-sm text-green-200">Pas de SaaS générique</div>
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

          {/* Témoignage - Simplifié */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="max-w-2xl mx-auto mb-10 md:mb-12"
          >
            <div className="bg-slate-800/40 rounded-xl p-6 md:p-8 border border-white/10 backdrop-blur-sm">
              <p className="text-white text-base md:text-lg font-medium mb-3 italic">
                "En 30 jours, 35% de nos tâches automatisées. Risques RGPD sécurisés. ROI visible dès le premier mois."
              </p>
              <p className="text-cyan-300 text-sm">
                — Dirigeant PME, Cabinet comptable
              </p>
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

