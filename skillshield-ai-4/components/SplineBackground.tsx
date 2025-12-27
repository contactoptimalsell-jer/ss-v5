import React, { useEffect, useRef } from 'react';

/**
 * Composant SplineBackground utilisant Spline Viewer
 * 
 * Utilise le web component spline-viewer de Spline pour afficher l'animation 3D
 * Le script CDN est chargé dans index.html
 */

interface SplineBackgroundProps {
  className?: string;
  sceneUrl?: string;
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
  className = '',
  // URL de la scène Spline
  sceneUrl = 'https://prod.spline.design/fZ8bpqOGC2ZMQjyT/scene.splinecode'
}) => {
  const viewerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // S'assurer que le script spline-viewer est chargé et définir l'URL
    const setupSplineViewer = () => {
      if (viewerRef.current && customElements.get('spline-viewer')) {
        // Définir l'attribut url directement sur l'élément
        if (viewerRef.current) {
          viewerRef.current.setAttribute('url', sceneUrl);
        }
        return true;
      }
      return false;
    };

    // Vérifier immédiatement
    if (!setupSplineViewer()) {
      // Si le web component n'est pas encore défini, attendre
      const interval = setInterval(() => {
        if (setupSplineViewer()) {
          clearInterval(interval);
        }
      }, 100);

      // Timeout de sécurité après 5 secondes
      const timeout = setTimeout(() => {
        clearInterval(interval);
      }, 5000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [sceneUrl]);

  return (
    <div 
      className={`absolute inset-0 w-full h-full overflow-hidden ${className}`}
      style={{ zIndex: 0 }}
    >
      <spline-viewer
        ref={viewerRef}
        url={sceneUrl}
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
      
      {/* Overlay de couleur très subtil pour harmoniser avec SkillShield - Réduit pour laisser l'animation visible */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-900/5 to-transparent pointer-events-none" style={{ zIndex: 1 }} />
      <div className="absolute inset-0 bg-gradient-to-r from-violet-600/3 via-transparent to-cyan-500/3 pointer-events-none" style={{ zIndex: 1 }} />
      <div className="absolute inset-0 bg-gradient-to-t from-orange-500/2 via-transparent to-transparent pointer-events-none" style={{ zIndex: 1 }} />
    </div>
  );
};

