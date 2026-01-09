'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeInUp } from '@/lib/animations';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';

const faqs = [
  {
    icon: '💰',
    question: 'L\'audit est-il vraiment gratuit ?',
    answer: 'Oui, totalement. Sans engagement. Nous voulons d\'abord comprendre votre réalité et identifier les opportunités avant de vous proposer quoi que ce soit. C\'est notre façon de créer une relation de confiance.',
  },
  {
    icon: '⏰',
    question: 'Combien de temps prend l\'implémentation ?',
    answer: 'Entre 2-8 semaines selon la complexité de vos process. Nous commençons par les automatisations les plus impactantes pour que vous voyiez des résultats rapidement, puis nous optimisons progressivement.',
  },
  {
    icon: '🤖',
    question: 'L\'IA va remplacer mon travail ?',
    answer: 'Non. L\'IA automatise les tâches répétitives et chronophages pour vous libérer du temps. Vous vous concentrez sur ce qui compte vraiment : la création, la stratégie, les relations clients. L\'IA est votre assistant, pas votre remplaçant.',
  },
  {
    icon: '💻',
    question: 'C\'est compliqué techniquement ?',
    answer: 'Pas du tout. Nous gérons toute la partie technique. Vous n\'avez pas besoin de connaissances en IA ou en programmation. Nous vous formons à utiliser les outils, et c\'est tout. Simple comme bonjour.',
  },
  {
    icon: '📊',
    question: 'Quel ROI puis-je espérer ?',
    answer: 'Nos clients récupèrent en moyenne 12-15h/semaine. Cela représente souvent un ROI en 2-3 mois. Mais au-delà des chiffres, c\'est votre qualité de vie qui s\'améliore : moins de stress, plus de temps pour ce qui compte vraiment.',
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFAQs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="relative py-24 md:py-32 lg:py-40 px-6 md:px-8 lg:px-12">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeInUp}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6 leading-tight">
            Vos Questions, Nos Réponses
          </h2>
        </motion.div>

        {/* Search bar */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="mb-8 md:mb-10"
        >
          <Input
            type="text"
            placeholder="Rechercher une question..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md mx-auto"
          />
        </motion.div>

        <div className="space-y-4 md:space-y-5">
          {filteredFAQs.map((faq, index) => (
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
                    <span className="text-2xl md:text-3xl">{faq.icon}</span>
                    <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-white leading-snug">
                      {faq.question}
                    </h3>
                  </div>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-xl text-white"
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
                      <p className="mt-6 md:mt-8 pl-10 md:pl-12 text-base md:text-lg text-slate-organic-400 leading-relaxed">
                        {faq.answer}
                      </p>
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

