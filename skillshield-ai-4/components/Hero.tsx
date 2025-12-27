import React from 'react';
import Spline from '@splinetool/react-spline';

export const Hero: React.FC = () => {
  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <Spline
        scene="https://prod.spline.design/dyZn11P5hyN7pqxg/scene.splinecode"
      />
    </main>
  );
};
