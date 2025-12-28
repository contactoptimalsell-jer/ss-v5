import React from 'react';
import Spline from '@splinetool/react-spline';

export const Hero: React.FC = () => {
  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Fond bleu en arrière-plan derrière les rochers */}
      <div className="absolute inset-0 bg-cyan-950 z-0" />
      
      {/* Animation Spline au-dessus du fond */}
      <div className="relative z-10 w-full h-full">
        <Spline
          scene="https://prod.spline.design/dyZn11P5hyN7pqxg/scene.splinecode"
        />
      </div>
      
      {/* Fond bleu allongé vers le bas */}
      <div className="absolute bottom-0 left-0 right-0 w-full z-[5]" style={{ height: '200px', width: '100%', backgroundColor: 'rgb(32, 66, 103)' }} />
      {/* Bord allongé en dessous */}
      <div className="absolute bottom-0 left-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-violet-500/50 to-transparent z-[5]" style={{ width: '150%', left: '-25%' }} />
    </main>
  );
};
