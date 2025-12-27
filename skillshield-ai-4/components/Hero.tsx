import React from 'react';
import { motion } from 'framer-motion';
import { SplineBackground } from './SplineBackground';

export const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Spline Animation Background - Plein écran, entièrement interactive */}
      <SplineBackground className="opacity-100" />
      
      {/* Overlay très subtil pour harmoniser avec SkillShield - ne bloque pas les interactions */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-900/3 to-transparent pointer-events-none z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-r from-violet-600/2 via-transparent to-cyan-500/2 pointer-events-none z-[1]" />

      {/* Overlay texte pour remplacer "Fast. Efficient. Revolutionary" par "Plus vite. Et mieux" */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none"
        style={{
          textAlign: 'center',
        }}
      >
        <div className="relative">
          {/* Fond pour masquer le texte original de l'animation */}
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm rounded-2xl -m-4" />
          <h2 className="relative text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white drop-shadow-2xl px-6 py-4">
            <span className="block">Plus vite.</span>
            <span className="block mt-1 md:mt-2">Et mieux</span>
          </h2>
        </div>
      </motion.div>
    </section>
  );
};
