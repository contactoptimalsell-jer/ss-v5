import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/Button';
import { Sparkles, ArrowRight, Zap, ShieldCheck, TrendingUp, Clock, CheckCircle2, Star, Rocket, Heart, Timer } from 'lucide-react';
import { SectionId } from '../types';
import { SplineBackground } from './SplineBackground';

export const Hero: React.FC = () => {
  const openCalendly = () => {
    window.open('https://calendly.com/b00784336-essec?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app', '_blank');
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Spline Animation Background - Opacité augmentée pour visibilité */}
      <SplineBackground className="opacity-90" />
      
      {/* Enhanced Dynamic Background Elements (complementary to Spline) - Réduits pour laisser place à Spline */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-600/10 rounded-full mix-blend-screen filter blur-[120px] animate-blob z-[1]" />
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full mix-blend-screen filter blur-[120px] animate-blob animation-delay-2000 z-[1]" />
      <div className="absolute -bottom-32 left-1/3 w-[700px] h-[700px] bg-orange-500/8 rounded-full mix-blend-screen filter blur-[140px] animate-blob animation-delay-4000 z-[1]" />
      
      {/* Gradient radial intelligent : assombrit le centre (contenu) mais laisse les bords visibles */}
      <div className="absolute inset-0 bg-radial-gradient from-slate-900/60 via-slate-900/40 to-transparent pointer-events-none z-[5]" 
           style={{
             background: 'radial-gradient(ellipse at center, rgba(15, 23, 42, 0.7) 0%, rgba(15, 23, 42, 0.4) 40%, transparent 70%)'
           }} />
      
      {/* Gradient vertical pour créer une séparation naturelle */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-transparent to-slate-900/50 pointer-events-none z-[5]" />
      
      {/* Overlay de couleur subtil pour harmoniser avec SkillShield */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-900/8 to-transparent pointer-events-none z-[6]" />
      <div className="absolute inset-0 bg-gradient-to-r from-violet-600/5 via-transparent to-cyan-500/5 pointer-events-none z-[6]" />

      {/* Contenu avec backdrop-blur subtil pour lisibilité */}
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto relative">
          {/* Fond subtil pour améliorer la lisibilité du contenu - crée une séparation visuelle avec l'animation */}
          <div className="absolute inset-0 -mx-6 -my-8 bg-slate-900/40 backdrop-blur-md rounded-3xl pointer-events-none" style={{ zIndex: -1 }} />
          {/* Badge avec animation pulse */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center mb-8"
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-violet-500/20 via-cyan-500/20 to-violet-500/20 border border-violet-400/30 backdrop-blur-md shadow-lg shadow-violet-500/20"
            >
              <ShieldCheck className="w-5 h-5 text-violet-300" />
              <span className="text-sm font-bold text-white tracking-wide">
                <span className="text-cyan-300">Remboursé à 90%</span> si non performant
              </span>
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            </motion.div>
          </motion.div>

          {/* Headline ultra-impactante */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-8"
          >
            <h1 className="font-display font-bold text-5xl md:text-7xl lg:text-8xl tracking-tight mb-6 leading-[1.1]">
              <span className="block text-white">
                Reprenez le contrôle
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-cyan-300 to-orange-400 animate-gradient bg-[length:200%_auto]">
                de votre temps
              </span>
              <span className="block text-3xl md:text-4xl lg:text-5xl font-normal text-gray-300 mt-4 font-sans">
                avec l'IA qui <span className="text-cyan-300 font-semibold">garantit</span> ses résultats
              </span>
            </h1>
          </motion.div>

          {/* Value proposition percutante */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mb-10"
          >
            <p className="max-w-3xl mx-auto text-xl md:text-2xl text-gray-200 leading-relaxed font-medium mb-6">
              <span className="text-white font-semibold">Imaginez :</span> Vous rentrez à 17h30, vous dînez avec vos enfants, vous avez retrouvé votre vie. 
              <span className="text-cyan-300 font-semibold"> C'est ce que font nos clients.</span>
            </p>
            <p className="max-w-2xl mx-auto text-lg text-gray-300 leading-relaxed">
              Notre système de <span className="text-violet-300 font-semibold">gardien humain</span> garantit que l'IA travaille parfaitement pour vous. 
              <span className="text-orange-300 font-semibold"> 10-20h par semaine</span> récupérées. 
              <span className="text-cyan-300 font-semibold"> ROI de 300-520%</span> en 12 mois.
            </p>
          </motion.div>

          {/* Stats impactantes avec animations */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12"
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gradient-to-br from-violet-900/40 to-violet-800/20 rounded-2xl p-6 border border-violet-400/30 backdrop-blur-sm text-center shadow-lg shadow-violet-500/10"
            >
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">20+</div>
              <div className="text-sm text-violet-200 font-medium">Dirigeants libérés</div>
              <div className="text-xs text-violet-300/70 mt-1">Ils ont retrouvé leur vie</div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gradient-to-br from-cyan-900/40 to-cyan-800/20 rounded-2xl p-6 border border-cyan-400/30 backdrop-blur-sm text-center shadow-lg shadow-cyan-500/10"
            >
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">15h</div>
              <div className="text-sm text-cyan-200 font-medium">Par semaine</div>
              <div className="text-xs text-cyan-300/70 mt-1">Temps récupéré</div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gradient-to-br from-orange-900/40 to-orange-800/20 rounded-2xl p-6 border border-orange-400/30 backdrop-blur-sm text-center shadow-lg shadow-orange-500/10"
            >
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">420%</div>
              <div className="text-sm text-orange-200 font-medium">ROI moyen</div>
              <div className="text-xs text-orange-300/70 mt-1">En 12 mois</div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gradient-to-br from-green-900/40 to-green-800/20 rounded-2xl p-6 border border-green-400/30 backdrop-blur-sm text-center shadow-lg shadow-green-500/10"
            >
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">90%</div>
              <div className="text-sm text-green-200 font-medium">Garantie</div>
              <div className="text-xs text-green-300/70 mt-1">Remboursement</div>
            </motion.div>
          </motion.div>

          {/* CTA Principal ultra-attractif */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-center mb-8"
          >
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  onClick={() => document.getElementById(SectionId.AUDIT_TOOL)?.scrollIntoView({ behavior: 'smooth' })} 
                  icon={<Sparkles className="w-6 h-6"/>} 
                  className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white border-0 text-xl px-10 py-6 rounded-2xl shadow-2xl shadow-violet-500/30 font-bold transition-all duration-300"
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
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-md border-2 border-white/20 text-white text-xl px-10 py-6 rounded-2xl font-bold transition-all duration-300"
                >
                  <span className="flex items-center gap-2">
                    Parler à un expert
                    <ArrowRight className="w-5 h-5" />
                  </span>
                </Button>
              </motion.div>
            </div>

            {/* Trust indicators avec icônes */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="flex flex-wrap items-center justify-center gap-6 text-sm"
            >
              <div className="flex items-center gap-2 text-cyan-300 bg-cyan-500/10 px-4 py-2 rounded-full border border-cyan-500/20">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-semibold">100% Gratuit • Sans engagement</span>
              </div>
              <div className="flex items-center gap-2 text-violet-300 bg-violet-500/10 px-4 py-2 rounded-full border border-violet-500/20">
                <ShieldCheck className="w-5 h-5" />
                <span className="font-semibold">Remboursé à 90% si non performant</span>
              </div>
              <div className="flex items-center gap-2 text-orange-300 bg-orange-500/10 px-4 py-2 rounded-full border border-orange-500/20">
                <Timer className="w-5 h-5" />
                <span className="font-semibold">Résultats en 2 minutes</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Social proof avec témoignage */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="max-w-3xl mx-auto"
          >
            <div className="bg-gradient-to-r from-slate-800/60 to-slate-900/60 rounded-2xl p-6 border border-white/10 backdrop-blur-md">
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
                    "Je dîne avec mes enfants tous les soirs maintenant. L'IA gère les réservations, et je garde le contrôle sur les cas complexes."
                  </p>
                  <p className="text-cyan-300 text-sm font-semibold">
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
            transition={{ duration: 0.8, delay: 1.4 }}
            className="mt-12 text-center"
          >
            <motion.button
              onClick={() => document.getElementById(SectionId.AUDIT_TOOL)?.scrollIntoView({ behavior: 'smooth' })}
              className="group flex flex-col items-center gap-2 text-gray-400 hover:text-cyan-300 transition-colors"
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
