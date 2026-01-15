import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => {
  return (
    <img 
      src="/images/skillshield-logo.png" 
      alt="SkillShield AI Logo" 
      className={className}
      style={{
        objectFit: 'contain',
        mixBlendMode: 'normal',
        filter: 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.4))',
        WebkitFilter: 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.4))'
      }}
    />
  );
};