'use client';

import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import Card from '@/components/ui/Card';

const problems = [
  {
    icon: '⏰',
    title: '18h → 22h chaque soir',
    description: 'Tâches répétitives qui grugent votre créativité',
  },
  {
    icon: '📧',
    title: '127 emails non-lus',
    description: 'Gestion admin qui vous éloigne de vos clients',
  },
  {
    icon: '🔄',
    title: 'Même process, chaque semaine',
    description: 'Temps perdu sur ce que l\'IA pourrait faire',
  },
];

export default function ProblemSection() {
  return (
    <section className="relative py-24 md:py-32 lg:py-40 px-6 md:px-8 lg:px-12 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-soft-500/30 via-slate-organic-700/25 to-cyan-vivid-500/30" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeInUp}
          className="text-center mb-16 md:mb-20 lg:mb-24"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6 leading-tight">
            Vous êtes coincés dans l'opérationnel
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10"
        >
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
            >
              <Card variant="glass" glow className="h-full text-center hover:scale-105 hover:-translate-y-2 transition-all duration-300">
                <div className="text-5xl mb-6 md:mb-8">{problem.icon}</div>
                <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-4 md:mb-5 leading-snug">
                  {problem.title}
                </h3>
                <p className="text-base md:text-lg text-slate-organic-400 leading-relaxed">
                  {problem.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

