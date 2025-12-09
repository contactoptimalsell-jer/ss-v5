import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      {/* Circuit lines - Background */}
      <path d="M10 20L25 35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-cyan-600/40" />
      <path d="M90 20L75 35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-cyan-600/40" />
      <path d="M50 95L50 80" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-cyan-600/40" />
      <circle cx="10" cy="20" r="2" className="fill-cyan-500/40" />
      <circle cx="90" cy="20" r="2" className="fill-cyan-500/40" />
      
      {/* Shield Shape */}
      <path 
        d="M50 92C25 78 15 35 15 15L50 5L85 15C85 35 75 78 50 92Z" 
        stroke="currentColor" 
        strokeWidth="4" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className="text-cyan-400"
      />
      
      {/* Brain Left Hemisphere */}
      <path 
        d="M48 30C40 30 32 35 32 50C32 65 40 70 48 70C49 70 48 60 48 50V30Z" 
        stroke="currentColor" 
        strokeWidth="3.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className="text-cyan-300"
      />
      {/* Brain Right Hemisphere */}
      <path 
        d="M52 30C60 30 68 35 68 50C68 65 60 70 52 70C51 70 52 60 52 50V30Z" 
        stroke="currentColor" 
        strokeWidth="3.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className="text-cyan-300"
      />
      
      {/* Brain Details (gyri/sulci) */}
      <path d="M38 42C35 42 35 48 38 48" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-cyan-200" />
      <path d="M40 58C36 58 38 62 42 62" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-cyan-200" />
      <path d="M62 42C65 42 65 48 62 48" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-cyan-200" />
      <path d="M60 58C64 58 62 62 58 62" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-cyan-200" />
    </svg>
  );
};