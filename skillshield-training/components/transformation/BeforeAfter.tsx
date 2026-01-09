'use client';

import { motion } from 'framer-motion';
import { slideInLeft, slideInRight } from '@/lib/animations';
import Card from '@/components/ui/Card';

const before = [
  { icon: '😰', text: 'Noyé dans l\'admin' },
  { icon: '⏰', text: 'Finit à 21h' },
  { icon: '📧', text: '120 emails/jour' },
  { icon: '🔄', text: 'Process manuels' },
  { icon: '😫', text: 'Burn-out imminent' },
];

const after = [
  { icon: '😊', text: 'Focus sur la création' },
  { icon: '🏡', text: 'Rentre à 17h30' },
  { icon: '✅', text: 'IA trie et répond' },
  { icon: '⚡', text: 'Automatisations fluides' },
  { icon: '🌱', text: 'Équilibre retrouvé' },
];

export default function BeforeAfter() {
  return (
    <section className="relative py-24 md:py-32 lg:py-40 px-6 md:px-8 lg:px-12 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={slideInLeft}
          className="text-center mb-16 md:mb-20 lg:mb-24"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6 leading-tight">
            La Transformation en Action
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-10 lg:gap-12">
          {/* Before */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={slideInLeft}
          >
            <Card variant="solid" className="h-full bg-gradient-to-br from-red-900/30 via-slate-organic-700/50 to-gray-800/30">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8 text-center leading-snug">
                Avant
              </h3>
              <div className="space-y-4 md:space-y-5">
                {before.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 md:p-5 rounded-xl bg-white/5 border border-red-500/20"
                  >
                    <span className="text-3xl md:text-4xl">{item.icon}</span>
                    <span className="text-base md:text-lg text-slate-organic-300 leading-relaxed">{item.text}</span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* After */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={slideInRight}
          >
            <Card variant="gradient" glow className="h-full bg-gradient-to-br from-green-calm-500/30 via-cyan-vivid-500/30 to-violet-soft-500/20">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8 text-center leading-snug">
                Après
              </h3>
              <div className="space-y-4 md:space-y-5">
                {after.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 md:p-5 rounded-xl bg-white/10 border border-green-calm-400/30"
                  >
                    <span className="text-3xl md:text-4xl">{item.icon}</span>
                    <span className="text-base md:text-lg text-white font-medium leading-relaxed">{item.text}</span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

