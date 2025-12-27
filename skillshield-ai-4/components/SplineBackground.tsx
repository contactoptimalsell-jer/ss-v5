import React, { useEffect, useRef } from 'react';
import { SectionId } from '../types';

/**
 * Composant SplineBackground utilisant Spline Viewer
 * 
 * Utilise le web component spline-viewer de Spline pour afficher l'animation 3D
 * Le script CDN est chargé dans index.html
 * Écoute les événements du bouton "Join Waitlist" pour rediriger vers le Quizz IA
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

  // Écouter les événements du spline-viewer pour détecter les interactions
  useEffect(() => {
    const scrollToQuiz = () => {
      // Rediriger vers le Quizz IA (AuditTool)
      setTimeout(() => {
        const auditSection = document.getElementById(SectionId.AUDIT_TOOL);
        if (auditSection) {
          auditSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    };

    const handleSplineEvent = (event: Event) => {
      // Les événements Spline peuvent être des CustomEvent avec des détails
      const customEvent = event as CustomEvent;
      const eventData = customEvent.detail;
      
      // Vérifier si c'est un clic sur un bouton ou une interaction
      const eventName = eventData?.name || eventData?.target?.name || eventData?.button || '';
      const eventType = customEvent.type || eventData?.type || '';
      
      // Détecter les clics sur les boutons (Join Waitlist, ou tout bouton)
      if (
        eventName === 'Join Waitlist' ||
        eventName.toLowerCase().includes('waitlist') ||
        eventName.toLowerCase().includes('join') ||
        eventName.toLowerCase().includes('calculer') ||
        eventName.toLowerCase().includes('quiz') ||
        (eventType.includes('click') && eventData?.target)
      ) {
        scrollToQuiz();
      }
    };

    // Écouter les événements personnalisés du spline-viewer
    const viewer = viewerRef.current;
    if (viewer) {
      // Écouter différents types d'événements possibles
      viewer.addEventListener('spline-event', handleSplineEvent);
      viewer.addEventListener('interaction', handleSplineEvent);
      viewer.addEventListener('click', handleSplineEvent);
      viewer.addEventListener('pointerdown', handleSplineEvent);
      
      // Écouter aussi les événements au niveau du document pour capturer les événements Spline
      document.addEventListener('spline-event', handleSplineEvent);
      document.addEventListener('spline-interaction', handleSplineEvent);
      document.addEventListener('spline-button-click', handleSplineEvent);
      
      // Essayer d'accéder à l'API Spline si disponible pour une meilleure détection
      const checkSplineAPI = () => {
        try {
          // @ts-ignore - L'API Spline peut être disponible via le viewer
          const splineApp = (viewer as any).application;
          if (splineApp) {
            // Écouter les événements via l'API Spline
            splineApp.addEventListener('interaction', (e: any) => {
              const targetName = e.target?.name?.toLowerCase() || '';
              if (
                targetName.includes('waitlist') || 
                targetName.includes('join') ||
                targetName.includes('calculer') ||
                targetName.includes('quiz') ||
                e.type === 'click'
              ) {
                scrollToQuiz();
              }
            });
          }
        } catch (error) {
          // L'API n'est pas disponible, on continue avec les event listeners
        }
      };

      // Vérifier l'API après un court délai pour laisser le viewer se charger
      setTimeout(checkSplineAPI, 2000);
      
      return () => {
        viewer.removeEventListener('spline-event', handleSplineEvent);
        viewer.removeEventListener('interaction', handleSplineEvent);
        viewer.removeEventListener('click', handleSplineEvent);
        viewer.removeEventListener('pointerdown', handleSplineEvent);
        document.removeEventListener('spline-event', handleSplineEvent);
        document.removeEventListener('spline-interaction', handleSplineEvent);
        document.removeEventListener('spline-button-click', handleSplineEvent);
      };
    }
  }, []);

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
          pointerEvents: 'auto', // Permet les interactions avec l'animation
        }}
        className="w-full h-full"
      />
      
      {/* Overlay de couleur très subtil pour harmoniser avec SkillShield - pointer-events-none pour ne pas bloquer */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-900/5 to-transparent pointer-events-none" style={{ zIndex: 1 }} />
      <div className="absolute inset-0 bg-gradient-to-r from-violet-600/3 via-transparent to-cyan-500/3 pointer-events-none" style={{ zIndex: 1 }} />
      <div className="absolute inset-0 bg-gradient-to-t from-orange-500/2 via-transparent to-transparent pointer-events-none" style={{ zIndex: 1 }} />
    </div>
  );
};

