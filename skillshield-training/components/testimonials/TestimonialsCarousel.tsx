'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeInUp } from '@/lib/animations';
import Card from '@/components/ui/Card';

const testimonials = [
  {
    name: 'Thomas',
    role: 'Consultant Indépendant',
    image: '👨‍💼',
    quote: 'J\'ai automatisé toute ma facturation et relances. 8h récupérées chaque semaine que je passe avec mes enfants.',
    rating: 5,
  },
  {
    name: 'Sophie',
    role: 'Directrice Marketing',
    image: '👩‍💼',
    quote: 'L\'IA gère maintenant mes emails et planning. Je rentre à 18h et j\'ai retrouvé ma vie personnelle.',
    rating: 5,
  },
  {
    name: 'Marc',
    role: 'Entrepreneur',
    image: '👨‍💻',
    quote: 'ROI en 2 mois. Mes process sont automatisés et je me concentre sur ce qui compte vraiment : développer mon business.',
    rating: 5,
  },
  {
    name: 'Julie',
    role: 'Freelance Designer',
    image: '👩‍🎨',
    quote: 'Fini les tâches répétitives. L\'IA s\'occupe de l\'admin, je crée. C\'est exactement ce dont j\'avais besoin.',
    rating: 5,
  },
  {
    name: 'David',
    role: 'Coach Professionnel',
    image: '👨‍🏫',
    quote: '15h par semaine récupérées. Je peux enfin me concentrer sur mes clients sans être noyé dans l\'opérationnel.',
    rating: 5,
  },
];

export default function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <section className="relative py-24 md:py-32 lg:py-40 px-6 md:px-8 lg:px-12 bg-gradient-to-br from-violet-soft-500/20 via-slate-organic-800/30 to-cyan-vivid-500/20">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeInUp}
          className="text-center mb-16 md:mb-20"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6 leading-tight">
            Ils Ont Retrouvé Leur Vie
          </h2>
        </motion.div>

        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
            >
              <Card
                variant="glass"
                glow
                className="max-w-3xl mx-auto border-2 border-violet-soft-400/40"
              >
                <div className="text-center">
                  <div className="text-6xl md:text-7xl mb-6 md:mb-8">{testimonials[currentIndex].image}</div>
                  <div className="flex justify-center gap-1 mb-6 md:mb-8">
                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                      <span key={i} className="text-2xl md:text-3xl text-orange-warm-400">⭐</span>
                    ))}
                  </div>
                  <blockquote className="text-lg md:text-xl lg:text-2xl text-white mb-6 md:mb-8 italic leading-relaxed">
                    "{testimonials[currentIndex].quote}"
                  </blockquote>
                  <div>
                    <p className="text-lg md:text-xl font-bold text-white mb-1">
                      {testimonials[currentIndex].name}
                    </p>
                    <p className="text-base md:text-lg text-slate-organic-400 leading-normal">
                      {testimonials[currentIndex].role}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Navigation dots */}
          <div className="flex justify-center gap-2 mt-8 md:mt-10">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-cyan-vivid-400 w-8'
                    : 'bg-slate-organic-600'
                }`}
                aria-label={`Voir témoignage ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

