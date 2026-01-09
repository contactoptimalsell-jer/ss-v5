'use client';

import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

const steps = [
  {
    icon: '🔍',
    title: 'Audit Complet',
    description: 'Nous analysons TOUS vos process quotidiens',
  },
  {
    icon: '💡',
    title: 'Opportunités IA',
    description: 'Identification des tâches automatisables',
  },
  {
    icon: '🚀',
    title: 'Implémentation Sur-Mesure',
    description: 'IA adaptée à VOTRE façon de travailler',
  },
  {
    icon: '🌟',
    title: 'Vie Simplifiée',
    description: 'Vous récupérez 10-20h par semaine',
  },
];

export default function AuditTimeline() {
  const scrollToCTA = () => {
    document.getElementById('final-cta')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative py-24 md:py-32 lg:py-40 px-6 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeInUp}
          className="text-center mb-16 md:mb-20 lg:mb-24"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 leading-tight">
            <span className="bg-gradient-to-r from-violet-soft-400 to-cyan-vivid-400 bg-clip-text text-transparent">
              L'Audit qui Change Tout
            </span>
          </h2>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-violet-soft-500 via-cyan-vivid-500 to-green-calm-500 transform -translate-x-1/2" />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="space-y-12 md:space-y-16"
          >
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className={`flex flex-col md:flex-row items-center gap-6 md:gap-8 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                <div className="w-full md:w-1/2">
                  <Card variant="glass" glow>
                    <div className="flex items-start gap-4 md:gap-6">
                      <div className="text-4xl md:text-5xl">{step.icon}</div>
                      <div>
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 md:mb-4 leading-snug">
                          {step.title}
                        </h3>
                        <p className="text-base md:text-lg text-slate-organic-400 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
                
                {/* Timeline dot */}
                <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-cyan-vivid-500 rounded-full border-4 border-navy-warm-900 z-10" 
                  style={{ marginTop: `${index * 25}%` }} 
                />

                <div className="w-full md:w-1/2" />
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mt-12 md:mt-16 lg:mt-20"
        >
          <Button
            variant="primary"
            size="lg"
            onClick={scrollToCTA}
          >
            Commencer mon audit gratuit
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

