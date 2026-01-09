'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeInUp } from '@/lib/animations';
import Card from '@/components/ui/Card';

const processSteps = [
  {
    icon: '📞',
    title: 'Appel Découverte (30min)',
    content: [
      'Compréhension de votre quotidien',
      'Identification des frustrations',
      'Sans engagement',
    ],
  },
  {
    icon: '🔍',
    title: 'Audit Approfondi (2-3 jours)',
    content: [
      'Analyse de tous vos process',
      'Mapping opportunités IA',
      'Rapport détaillé personnalisé',
    ],
  },
  {
    icon: '💡',
    title: 'Proposition Sur-Mesure',
    content: [
      'Solutions IA adaptées',
      'Timeline implémentation',
      'Budget transparent',
    ],
  },
  {
    icon: '🚀',
    title: 'Implémentation & Formation',
    content: [
      'Déploiement progressif',
      'Formation de vos équipes',
      'Support continu',
    ],
  },
  {
    icon: '🌱',
    title: 'Suivi & Optimisation',
    content: [
      'Ajustements réguliers',
      'Nouvelles opportunités',
      'Votre succès = notre succès',
    ],
  },
];

export default function ProcessAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="process" className="relative py-24 md:py-32 lg:py-40 px-6 md:px-8 lg:px-12">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeInUp}
          className="text-center mb-16 md:mb-20 lg:mb-24"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6 leading-tight">
            Comment Ça Marche ?
          </h2>
        </motion.div>

        <div className="space-y-4 md:space-y-5">
          {processSteps.map((step, index) => (
            <motion.div
              key={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={fadeInUp}
            >
              <Card
                variant="glass"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 md:gap-6">
                    <span className="text-3xl md:text-4xl">{step.icon}</span>
                    <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-white leading-snug">
                      {step.title}
                    </h3>
                  </div>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-2xl text-white"
                  >
                    ▼
                  </motion.div>
                </div>

                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <ul className="mt-6 md:mt-8 space-y-3 md:space-y-4 pl-12">
                        {step.content.map((item, itemIndex) => (
                          <li
                            key={itemIndex}
                            className="text-base md:text-lg text-slate-organic-400 flex items-start gap-2 leading-relaxed"
                          >
                            <span className="text-cyan-vivid-400 mt-1">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

