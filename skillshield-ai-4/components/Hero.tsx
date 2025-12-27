import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/Button';
import { Sparkles, ArrowRight, Zap, ShieldCheck, CheckCircle2, Star, Rocket, Heart, Timer } from 'lucide-react';
import { SectionId } from '../types';
import { SplineBackground } from './SplineBackground';

export const Hero: React.FC = () => {
  const openCalendly = () => {
    window.open('https://calendly.com/b00784336-essec?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app', '_blank');
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Spline Animation Background - Plein écran, opacité maximale */}
      <SplineBackground className="opacity-100" />
      
      {/* Overlay très subtil pour harmoniser avec SkillShield - ne masque pas l'animation */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-900/3 to-transparent pointer-events-none z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-r from-violet-600/2 via-transparent to-cyan-500/2 pointer-events-none z-[1]" />

      {/* Contenu intégré intelligemment dans l'animation */}
      <div className="relative z-10 w-full px-4 md:px-6 py-8 md:py-12">
        <div className="container mx-auto max-w-7xl">
          
          {/* Badge flottant en haut */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center mb-6 md:mb-8"
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-violet-500/40 via-cyan-500/40 to-violet-500/40 border border-violet-400/50 backdrop-blur-xl shadow-2xl shadow-violet-500/40"
            >
              <ShieldCheck className="w-5 h-5 text-violet-300" />
              <span className="text-sm font-bold text-white tracking-wide">
                <span className="text-cyan-300">Remboursé à 90%</span> si non performant
              </span>
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            </motion.div>
          </motion.div>

          {/* Headline principale - Centrée */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-center mb-6 md:mb-8"
          >
            <h1 className="font-display font-bold text-4xl md:text-6xl lg:text-7xl xl:text-8xl tracking-tight mb-4 md:mb-6 leading-[1.1]">
              <span className="block text-white drop-shadow-2xl">Reprenez le contrôle</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-cyan-300 to-orange-400 drop-shadow-2xl">
                de votre temps
              </span>
              <span className="block text-xl md:text-3xl lg:text-4xl xl:text-5xl font-normal text-gray-200 mt-3 md:mt-4 font-sans drop-shadow-xl">
                avec l'IA qui <span className="text-cyan-300 font-semibold">garantit</span> ses résultats
              </span>
            </h1>
          </motion.div>

          {/* Value proposition - Carte glassmorphism flottante */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl mx-auto mb-6 md:mb-8"
          >
            <div className="bg-slate-900/50 backdrop-blur-2xl rounded-2xl border border-white/20 shadow-2xl p-6 md:p-8">
              <p className="text-center text-lg md:text-xl text-gray-200 leading-relaxed font-medium mb-4">
                <span className="text-white font-semibold">Imaginez :</span> Vous rentrez à 17h30, vous dînez avec vos enfants, vous avez retrouvé votre vie. 
                <span className="text-cyan-300 font-semibold"> C'est ce que font nos clients.</span>
              </p>
              <p className="text-center text-base md:text-lg text-gray-300 leading-relaxed">
                Notre système de <span className="text-violet-300 font-semibold">gardien humain</span> garantit que l'IA travaille parfaitement pour vous. 
                <span className="text-orange-300 font-semibold"> 10-20h par semaine</span> récupérées. 
                <span className="text-cyan-300 font-semibold"> ROI de 300-520%</span> en 12 mois.
              </p>
            </div>
          </motion.div>

          {/* Stats - Grid compact avec glassmorphism */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-5xl mx-auto mb-6 md:mb-8"
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gradient-to-br from-violet-900/60 to-violet-800/40 rounded-xl p-4 md:p-5 border border-violet-400/40 backdrop-blur-xl text-center shadow-xl"
            >
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">20+</div>
              <div className="text-xs md:text-sm text-violet-200 font-medium">Dirigeants libérés</div>
              <div className="text-xs text-violet-300/70 mt-1">Ils ont retrouvé leur vie</div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gradient-to-br from-cyan-900/60 to-cyan-800/40 rounded-xl p-4 md:p-5 border border-cyan-400/40 backdrop-blur-xl text-center shadow-xl"
            >
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">15h</div>
              <div className="text-xs md:text-sm text-cyan-200 font-medium">Par semaine</div>
              <div className="text-xs text-cyan-300/70 mt-1">Temps récupéré</div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gradient-to-br from-orange-900/60 to-orange-800/40 rounded-xl p-4 md:p-5 border border-orange-400/40 backdrop-blur-xl text-center shadow-xl"
            >
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">420%</div>
              <div className="text-xs md:text-sm text-orange-200 font-medium">ROI moyen</div>
              <div className="text-xs text-orange-300/70 mt-1">En 12 mois</div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gradient-to-br from-green-900/60 to-green-800/40 rounded-xl p-4 md:p-5 border border-green-400/40 backdrop-blur-xl text-center shadow-xl"
            >
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">90%</div>
              <div className="text-xs md:text-sm text-green-200 font-medium">Garantie</div>
              <div className="text-xs text-green-300/70 mt-1">Remboursement</div>
            </motion.div>
          </motion.div>

          {/* CTA et Trust indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mb-6 md:mb-8"
          >
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  onClick={() => document.getElementById(SectionId.AUDIT_TOOL)?.scrollIntoView({ behavior: 'smooth' })} 
                  icon={<Sparkles className="w-6 h-6"/>} 
                  className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white border-0 text-lg md:text-xl px-8 md:px-10 py-5 md:py-6 rounded-2xl shadow-2xl shadow-violet-500/40 font-bold transition-all duration-300 backdrop-blur-sm"
                >
                  <span className="flex items-center gap-2">
                    <Rocket className="w-5 h-5" />
                    Découvrir mon potentiel (Gratuit)
                  </span>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="secondary" 
                  onClick={openCalendly} 
                  icon={<Zap className="w-6 h-6"/>}
                  className="bg-white/15 hover:bg-white/25 backdrop-blur-xl border-2 border-white/30 text-white text-lg md:text-xl px-8 md:px-10 py-5 md:py-6 rounded-2xl font-bold transition-all duration-300 shadow-xl"
                >
                  <span className="flex items-center gap-2">
                    Parler à un expert
                    <ArrowRight className="w-5 h-5" />
                  </span>
                </Button>
              </motion.div>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 text-sm">
              <div className="flex items-center gap-2 text-cyan-300 bg-cyan-500/20 px-4 py-2 rounded-full border border-cyan-500/30 backdrop-blur-md shadow-lg">
                <CheckCircle2 className="w-4 h-4" />
                <span className="font-semibold">100% Gratuit • Sans engagement</span>
              </div>
              <div className="flex items-center gap-2 text-violet-300 bg-violet-500/20 px-4 py-2 rounded-full border border-violet-500/30 backdrop-blur-md shadow-lg">
                <ShieldCheck className="w-4 h-4" />
                <span className="font-semibold">Remboursé à 90% si non performant</span>
              </div>
              <div className="flex items-center gap-2 text-orange-300 bg-orange-500/20 px-4 py-2 rounded-full border border-orange-500/30 backdrop-blur-md shadow-lg">
                <Timer className="w-4 h-4" />
                <span className="font-semibold">Résultats en 2 minutes</span>
              </div>
            </div>
          </motion.div>

          {/* Témoignage - Carte glassmorphism */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="max-w-3xl mx-auto mb-6 md:mb-8"
          >
            <div className="bg-gradient-to-r from-slate-800/70 to-slate-900/70 rounded-2xl p-5 md:p-6 border border-white/20 backdrop-blur-2xl shadow-2xl">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-lg">
                    <Heart className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-white text-base md:text-lg font-medium mb-2 italic">
                    "Je dîne avec mes enfants tous les soirs maintenant. L'IA gère les réservations, et je garde le contrôle sur les cas complexes."
                  </p>
                  <p className="text-cyan-300 text-xs md:text-sm font-semibold">
                    — Marc, CEO dans le BTP en Charente-Maritime
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center"
          >
            <motion.button
              onClick={() => document.getElementById(SectionId.AUDIT_TOOL)?.scrollIntoView({ behavior: 'smooth' })}
              className="group flex flex-col items-center gap-2 text-gray-300 hover:text-cyan-300 transition-colors backdrop-blur-sm bg-white/5 px-4 py-2 rounded-full border border-white/10"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-sm font-medium">Découvrez comment ça marche</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
