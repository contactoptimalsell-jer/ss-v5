import React from 'react';
import { motion } from 'framer-motion';
import { SplineBackground } from './SplineBackground';
import { SectionId } from '../types';
import { Sparkles } from 'lucide-react';

export const Hero: React.FC = () => {
  const handleQuizClick = () => {
    const auditSection = document.getElementById(SectionId.AUDIT_TOOL);
    if (auditSection) {
      auditSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Spline Animation Background - Plein écran, opacité maximale */}
      <SplineBackground className="opacity-100" />
      
      {/* Overlay très subtil pour harmoniser avec SkillShield - ne masque pas l'animation */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-900/3 to-transparent pointer-events-none z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-r from-violet-600/2 via-transparent to-cyan-500/2 pointer-events-none z-[1]" />

      {/* Bouton cliquable superposé à l'animation Spline */}
      <motion.button
        onClick={handleQuizClick}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="absolute bottom-20 md:bottom-24 left-1/2 transform -translate-x-1/2 z-20
                   bg-gradient-to-r from-violet-600 via-cyan-600 to-violet-600 
                   hover:from-violet-500 hover:via-cyan-500 hover:to-violet-500
                   text-white font-bold text-lg md:text-xl px-8 md:px-12 py-4 md:py-5
                   rounded-2xl shadow-2xl shadow-violet-500/50
                   backdrop-blur-sm border border-white/20
                   flex items-center gap-3
                   transition-all duration-300
                   hover:shadow-violet-500/70"
        style={{
          backgroundSize: '200% 100%',
          animation: 'gradient-shift 3s ease infinite',
        }}
      >
        <Sparkles className="w-5 h-5 md:w-6 md:h-6" />
        <span>Calculer votre degré d'IA</span>
      </motion.button>
    </section>
  );
};
