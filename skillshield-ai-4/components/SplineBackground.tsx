import React, { Suspense } from 'react';
import Spline from '@splinetool/react-spline';

/**
 * Composant SplineBackground utilisant React Spline
 * 
 * Utilise @splinetool/react-spline pour afficher l'animation 3D
 */

interface SplineBackgroundProps {
  className?: string;
}

export const SplineBackground: React.FC<SplineBackgroundProps> = ({ 
  className = ''
}) => {
  return (
    <div 
      className={`absolute inset-0 w-full h-full overflow-hidden ${className}`}
      style={{ zIndex: 0 }}
    >
      <Suspense fallback={
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
        </div>
      }>
        <Spline
          scene="https://prod.spline.design/fZ8bpqOGC2ZMQjyT/scene.splinecode"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 0,
            border: 'none',
          }}
          className="w-full h-full"
        />
      </Suspense>
      
      {/* Overlay de couleur très subtil pour harmoniser avec SkillShield */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-900/5 to-transparent pointer-events-none" style={{ zIndex: 1 }} />
      <div className="absolute inset-0 bg-gradient-to-r from-violet-600/3 via-transparent to-cyan-500/3 pointer-events-none" style={{ zIndex: 1 }} />
      <div className="absolute inset-0 bg-gradient-to-t from-orange-500/2 via-transparent to-transparent pointer-events-none" style={{ zIndex: 1 }} />
    </div>
  );
};
