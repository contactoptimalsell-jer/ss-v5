'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { heroVariants, fadeInUp } from '@/lib/animations';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

interface Particle {
  x: number;
  y: number;
  duration: number;
}

export default function HeroSection() {
  const [particles, setParticles] = useState<Particle[]>([]);

  // Générer les particules uniquement côté client pour éviter l'erreur d'hydratation
  useEffect(() => {
    setParticles(
      Array.from({ length: 20 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: 5 + Math.random() * 5,
      }))
    );
  }, []);

  const scrollToProcess = () => {
    document.getElementById('process')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToCTA = () => {
    document.getElementById('final-cta')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 md:px-8 lg:px-12 py-24 md:py-32 lg:py-40">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy-warm-900 via-violet-soft-500/10 to-cyan-vivid-500/10" />
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-cyan-vivid-400/30 rounded-full"
            initial={{
              x: `${particle.x}%`,
              y: `${particle.y}%`,
            }}
            animate={{
              y: [`${particle.y}%`, `${(particle.y + 30) % 100}%`, `${particle.y}%`],
              x: [`${particle.x}%`, `${(particle.x + 20) % 100}%`, `${particle.x}%`],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto text-center">
        {/* Logo with breathing animation */}
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            opacity: [1, 0.9, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="mb-8 md:mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-soft-400 to-cyan-vivid-400 bg-clip-text text-transparent">
            SkillShield Training
          </h2>
        </motion.div>

        {/* Badge */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="mb-6 md:mb-8"
        >
          <Badge variant="pulse">
            🤝 200+ professionnels libérés
          </Badge>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial="hidden"
          animate="visible"
          variants={heroVariants}
          className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 md:mb-8 leading-tight tracking-tight"
        >
          <span className="bg-gradient-to-r from-violet-soft-400 via-cyan-vivid-400 to-violet-soft-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-[flow_3s_linear_infinite]">
            L'IA qui vous rend du temps.
          </span>
          <br />
          <span className="text-white">Pour ce qui compte vraiment.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="text-xl md:text-2xl lg:text-3xl text-slate-organic-400 mb-10 md:mb-12 lg:mb-14 max-w-3xl mx-auto leading-relaxed"
        >
          Nous auditons vos process. Implémentons l'IA. Vous retrouvez votre vie.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center mb-12 md:mb-16"
        >
          <Button
            variant="primary"
            size="lg"
            onClick={scrollToCTA}
            className="w-full sm:w-auto"
          >
            Demander un audit gratuit 🔍
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={scrollToProcess}
            className="w-full sm:w-auto"
          >
            Voir comment ça marche ✨
          </Button>
        </motion.div>

        {/* Hero illustration placeholder */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="mt-12 md:mt-16"
        >
          <div className="relative w-full max-w-4xl mx-auto h-64 md:h-96 rounded-3xl bg-gradient-to-br from-violet-soft-500/20 via-cyan-vivid-500/20 to-pink-empathy-500/20 border border-violet-soft-400/30 backdrop-blur-2xl flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl md:text-8xl mb-4">🤖✨</div>
              <p className="text-slate-organic-400 text-base md:text-lg leading-relaxed">Illustration humain + IA en symbiose</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

