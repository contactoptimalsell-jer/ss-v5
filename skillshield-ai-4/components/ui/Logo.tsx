import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => {
  return (
    <img 
      src="/images/skillshield-logo.png" 
      alt="SkillShield AI Logo" 
      className={className}
      style={{
        objectFit: 'contain',
        mixBlendMode: 'screen',
        filter: 'brightness(1.2) contrast(1.1) drop-shadow(0 0 8px rgba(139, 92, 246, 0.5))',
        WebkitFilter: 'brightness(1.2) contrast(1.1) drop-shadow(0 0 8px rgba(139, 92, 246, 0.5))'
      }}
    />
  );
};