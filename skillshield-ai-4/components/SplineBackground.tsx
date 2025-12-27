import React from 'react';

/**
 * Composant SplineBackground utilisant Spline Viewer
 * 
 * Utilise le web component spline-viewer de Spline pour afficher l'animation 3D
 * Le script CDN est chargé dans index.html
 */

interface SplineBackgroundProps {
  className?: string;
}

// Déclaration TypeScript pour le web component spline-viewer
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'spline-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        url?: string;
      }, HTMLElement>;
    }
  }
}

export const SplineBackground: React.FC<SplineBackgroundProps> = ({ 
  className = ''
}) => {
  return (
    <div 
      className={`absolute inset-0 w-full h-full overflow-hidden ${className}`}
      style={{ zIndex: 0 }}
    >
      <spline-viewer 
        url="https://prod.spline.design/fZ8bpqOGC2ZMQjyT/scene.splinecode"
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
      
      {/* Overlay de couleur très subtil pour harmoniser avec SkillShield */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-900/5 to-transparent pointer-events-none" style={{ zIndex: 1 }} />
      <div className="absolute inset-0 bg-gradient-to-r from-violet-600/3 via-transparent to-cyan-500/3 pointer-events-none" style={{ zIndex: 1 }} />
      <div className="absolute inset-0 bg-gradient-to-t from-orange-500/2 via-transparent to-transparent pointer-events-none" style={{ zIndex: 1 }} />
    </div>
  );
};
