'use client';

import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import Card from '@/components/ui/Card';

const benefits = [
  {
    icon: '⏰',
    number: '15h',
    unit: '/semaine',
    title: 'Temps retrouvé pour votre vie',
    gradient: 'from-violet-soft-500/30 to-pink-empathy-500/30',
  },
  {
    icon: '💡',
    number: '60%',
    title: 'Productivité',
    subtitle: 'Sans travailler plus',
    gradient: 'from-cyan-vivid-500/30 to-blue-500/30',
  },
  {
    icon: '🏡',
    title: 'Équilibre vie pro/perso',
    subtitle: 'Dîners en famille garantis',
    gradient: 'from-green-calm-500/30 to-emerald-500/30',
  },
  {
    icon: '🎨',
    title: 'Créativité libérée',
    subtitle: 'L\'IA gère l\'opérationnel',
    gradient: 'from-orange-warm-500/30 to-yellow-500/30',
  },
  {
    icon: '💰',
    title: 'ROI 3 mois',
    subtitle: 'Investissement rapidement rentabilisé',
    gradient: 'from-cyan-vivid-500/30 to-violet-soft-500/30',
  },
  {
    icon: '😊',
    title: 'Sérénité quotidienne',
    subtitle: 'Moins de stress, plus de sens',
    gradient: 'from-pink-empathy-500/30 to-violet-soft-500/30',
  },
];

export default function BenefitsGrid() {
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
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6 leading-tight">
            Ce Que Nos Clients Récupèrent
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
            >
              <Card
                variant="glass"
                glow
                className={`h-full bg-gradient-to-br ${benefit.gradient} hover:shadow-2xl transition-all duration-300`}
              >
                <div className="text-5xl md:text-6xl mb-6 md:mb-8">{benefit.icon}</div>
                {benefit.number && (
                  <div className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-white to-slate-organic-300 bg-clip-text text-transparent mb-3 md:mb-4">
                    {benefit.number}
                    {benefit.unit && <span className="text-3xl md:text-4xl">{benefit.unit}</span>}
                  </div>
                )}
                <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-3 md:mb-4 leading-snug">
                  {benefit.title}
                </h3>
                {benefit.subtitle && (
                  <p className="text-base md:text-lg text-slate-organic-400 leading-relaxed">
                    {benefit.subtitle}
                  </p>
                )}
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

