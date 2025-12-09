import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/Button';
import { Sparkles, ArrowRight, Lightbulb } from 'lucide-react';
import { SectionId } from '../types';

export const Hero: React.FC = () => {
  const openCalendly = () => {
    window.open('https://calendly.com/b00784336-essec?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app', '_blank');
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob" />
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000" />
      <div className="absolute -bottom-32 left-1/3 w-[600px] h-[600px] bg-blue-500/10 rounded-full mix-blend-screen filter blur-[120px] animate-blob animation-delay-4000" />

      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-8 backdrop-blur-sm"
        >
          <Lightbulb className="w-4 h-4 text-violet-400" />
          <span className="text-sm font-bold text-violet-300 tracking-wide uppercase">Le futur du travail est là</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-display font-bold text-5xl md:text-7xl lg:text-8xl tracking-tight mb-8"
        >
          L'IA ne remplace pas l'humain.
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-cyan-300 to-violet-400 pb-2">
            Elle l'élève.
          </span>
          <span className="text-2xl md:text-4xl lg:text-5xl font-normal text-gray-300 block mt-4 font-sans">
            Retrouvez le sens de votre métier.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-2xl mx-auto text-lg md:text-xl text-gray-400 leading-relaxed mb-12"
        >
          Vous n'avez pas créé votre entreprise pour gérer de l'administratif, mais pour construire une vision.<br/>
          Déléguez le répétitif à nos systèmes IA et concentrez votre énergie là où vous êtes irremplaçable.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col md:flex-row items-center justify-center gap-6"
        >
          <Button onClick={openCalendly} icon={<Sparkles className="w-5 h-5"/>} className="shadow-violet-500/20 hover:shadow-violet-500/40 border border-white/10">
            Libérer mon potentiel (Audit Offert)
          </Button>
          <Button variant="secondary" onClick={() => document.getElementById(SectionId.APPROACH)?.scrollIntoView({ behavior: 'smooth' })} icon={<ArrowRight className="w-5 h-5"/>}>
            Découvrir notre méthode
          </Button>
        </motion.div>

        {/* Floating Social Proof */}
        <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 1, duration: 1 }}
           className="mt-16 flex items-center justify-center gap-4 text-sm text-gray-500"
        >
           <div className="flex -space-x-3">
              {[1,2,3,4].map((i) => (
                <img key={i} src={`https://picsum.photos/40/40?random=${i}`} alt="Client" className="w-10 h-10 rounded-full border-2 border-slate-900 object-cover" />
              ))}
           </div>
           <p>Déjà <span className="text-white font-bold">20+ dirigeants</span> ont retrouvé leur équilibre vie pro/vie perso.</p>
        </motion.div>
      </div>
    </section>
  );
};