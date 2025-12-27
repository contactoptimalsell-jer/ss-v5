import React from 'react';

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

export const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <spline-viewer url="https://prod.spline.design/dyZn11P5hyN7pqxg/scene.splinecode"></spline-viewer>
    </section>
  );
};
