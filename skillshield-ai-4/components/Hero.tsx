import React from 'react';
import Spline from '@splinetool/react-spline';

export const Hero: React.FC = () => {
  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <Spline
        scene="https://prod.spline.design/dyZn11P5hyN7pqxg/scene.splinecode"
      />
      {/* Bord allongé en dessous */}
      <div className="absolute bottom-0 left-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" style={{ width: '150%', left: '-25%' }} />
    </main>
  );
};
