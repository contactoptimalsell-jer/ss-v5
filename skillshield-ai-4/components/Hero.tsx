import React from 'react';
import { SplineBackground } from './SplineBackground';

export const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Spline Animation Background - Plein écran, entièrement interactive */}
      <SplineBackground className="opacity-100" />
      
      {/* Overlay très subtil pour harmoniser avec SkillShield - ne bloque pas les interactions */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-900/3 to-transparent pointer-events-none z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-r from-violet-600/2 via-transparent to-cyan-500/2 pointer-events-none z-[1]" />
    </section>
  );
};
