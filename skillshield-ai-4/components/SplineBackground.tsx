import React, { useEffect, useRef } from 'react';

/**
 * Composant SplineBackground utilisant Hana Viewer
 * 
 * Utilise le web component hana-viewer de Spline pour afficher l'animation 3D
 * Le script CDN est chargé dans index.html
 */

interface SplineBackgroundProps {
  className?: string;
  sceneUrl?: string;
}

// Déclaration TypeScript pour le web component hana-viewer
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'hana-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        url?: string;
      }, HTMLElement>;
    }
  }
}

export const SplineBackground: React.FC<SplineBackgroundProps> = ({ 
  className = '',
  // URL de la scène Spline Hana
  sceneUrl = 'https://prod.spline.design/KGSdmjafxHorkMjP-4hD/scene.hanacode'
}) => {
  const viewerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // S'assurer que le script hana-viewer est chargé et définir l'URL
    const setupHanaViewer = () => {
      if (viewerRef.current && customElements.get('hana-viewer')) {
        // Définir l'attribut url directement sur l'élément
        if (viewerRef.current) {
          viewerRef.current.setAttribute('url', sceneUrl);
        }
        return true;
      }
      return false;
    };

    // Vérifier immédiatement
    if (!setupHanaViewer()) {
      // Si le web component n'est pas encore défini, attendre
      const interval = setInterval(() => {
        if (setupHanaViewer()) {
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
      <hana-viewer
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

