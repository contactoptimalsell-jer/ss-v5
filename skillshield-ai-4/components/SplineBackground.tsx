import React from 'react';

/**
 * Composant SplineBackground utilisant Spline Viewer
 * 
 * Utilise le web component spline-viewer de Spline
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
    <div className={`absolute inset-0 w-full h-full overflow-hidden ${className}`}>
      <spline-viewer url="https://prod.spline.design/fZ8bpqOGC2ZMQjyT/scene.splinecode"></spline-viewer>
    </div>
  );
};
