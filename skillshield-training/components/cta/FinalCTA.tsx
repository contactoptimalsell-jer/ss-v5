'use client';

import { motion } from 'framer-motion';
import { fadeInUp } from '@/lib/animations';
import AuditForm from './AuditForm';
import Card from '@/components/ui/Card';

export default function FinalCTA() {
  return (
    <section
      id="final-cta"
      className="relative py-32 md:py-40 lg:py-48 px-6 md:px-8 lg:px-12 overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-soft-500/20 via-orange-warm-500/10 to-cyan-vivid-500/20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_50%)]" />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeInUp}
          className="mb-12 md:mb-16 lg:mb-20"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 md:mb-8 leading-tight">
            Prêt à Retrouver Votre Temps ?
          </h2>
          <p className="text-xl md:text-2xl text-slate-organic-400 leading-relaxed max-w-3xl mx-auto">
            Commencez par un audit gratuit de 30 minutes...
          </p>
        </motion.div>

        <Card variant="glass" glow className="mb-12 md:mb-16">
          <AuditForm />
        </Card>

        {/* Social proof */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center"
        >
          <p className="text-base md:text-lg text-slate-organic-400 mb-4 md:mb-6 leading-relaxed">
            Rejoignez 200+ professionnels qui ont repris le contrôle
          </p>
          <div className="flex items-center justify-center gap-2">
            <div className="flex -space-x-2">
              {['👨‍💼', '👩‍💼', '👨‍💻', '👩‍🎨', '👨‍🏫'].map((emoji, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-soft-500 to-cyan-vivid-500 flex items-center justify-center text-xl border-2 border-navy-warm-900"
                >
                  {emoji}
                </div>
              ))}
            </div>
            <div className="ml-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-xl text-orange-warm-400">⭐</span>
                ))}
              </div>
              <p className="text-sm text-slate-organic-500">4.9/5</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

