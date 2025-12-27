import React from 'react';

/**
 * Composant SplineBackground utilisant un iframe
 * 
 * Utilise un iframe pour afficher l'animation Spline
 */

interface SplineBackgroundProps {
  className?: string;
}

export const SplineBackground: React.FC<SplineBackgroundProps> = ({ 
  className = ''
}) => {
  return (
    <iframe 
      src="https://my.spline.design/prismcoin-HGqF8Ux4WZ2cb7LC16fkZR7R/" 
      frameBorder="0" 
      width="100%" 
      height="100%"
      className={className}
    />
  );
};
