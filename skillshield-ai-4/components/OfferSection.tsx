import React from 'react';
import { motion } from 'framer-motion';
import { Search, Bot, UserCheck, CheckCircle2, TrendingUp, ShieldCheck, Zap } from 'lucide-react';
import { Card } from './ui/Card';
import { AnimatedText } from './ui/AnimatedText';
import { useLanguage } from '../contexts/LanguageContext';

export const OfferSection: React.FC = () => {
  const { t } = useLanguage();
  const offers = [
    {
      icon: Search,
      title: t.offer.auditTitle,
      description: t.offer.auditDesc,
      bullets: [
        t.offer.audit1,
        t.offer.audit2,
        t.offer.audit3
      ],
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20"
    },
    {
      icon: Bot,
      title: t.offer.implementationTitle,
      description: t.offer.implementationDesc,
      bullets: [
        t.offer.implementation1,
        t.offer.implementation2,
        t.offer.implementation3
      ],
      color: "text-violet-400",
      bg: "bg-violet-500/10",
      border: "border-violet-500/20"
    },
    {
      icon: UserCheck,
      title: t.offer.supportTitle,
      description: t.offer.supportDesc,
      bullets: [
        t.offer.support1,
        t.offer.support2,
        t.offer.support3
      ],
      color: "text-orange-400",
      bg: "bg-orange-500/10",
      border: "border-orange-500/20"
    }
  ];

  return (
    <section className="py-12 sm:py-16 md:py-24 relative overflow-hidden bg-cyan-950">
      {/* Background Effects */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-violet-600/10 rounded-full mix-blend-screen filter blur-[120px] animate-blob" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-4 sm:mb-6 backdrop-blur-sm">
            <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-violet-400" />
            <span className="text-xs sm:text-sm font-bold text-violet-300 tracking-wide uppercase">{t.offer.title}</span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-white mb-3 sm:mb-4 px-4">
            <AnimatedText type="wordByWord" delay={0.2} highlightWords={t.language === 'fr' ? ['3', 'briques', 'SkillShield'] : ['3', 'building', 'SkillShield']} highlightColor="text-violet-400 font-bold">
              {t.offer.subtitle} {t.offer.skillshield}
            </AnimatedText>
          </h2>
          
          <AnimatedText type="highlight" delay={1.0} className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto block px-4" highlightWords={t.language === 'fr' ? ['Audit IA', 'Implémentation', 'sur-mesure', 'Accompagnement'] : ['AI Audit', 'Implementation', 'custom', 'Support']} highlightColor="text-cyan-300 font-semibold">
            {t.offer.description}
          </AnimatedText>
        </motion.div>

        {/* Offers Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {offers.map((offer, index) => {
            const Icon = offer.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className={`${offer.bg} ${offer.border} border-2 h-full`}>
                  <div className="p-5 sm:p-6 md:p-8">
                    {/* Icon */}
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 ${offer.bg} ${offer.border} border rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 ${offer.color}`}>
                      <Icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                    </div>
                    
                    {/* Title */}
                    <h3 className={`text-xl sm:text-2xl font-bold mb-3 sm:mb-4 ${offer.color}`}>
                      {offer.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-gray-300 text-sm sm:text-base mb-4 sm:mb-6 leading-relaxed">
                      {offer.description}
                    </p>
                    
                    {/* Bullets */}
                    <div className="space-y-2 sm:space-y-3">
                      {offer.bullets.map((bullet, bulletIndex) => (
                        <div key={bulletIndex} className="flex items-start gap-2 sm:gap-3">
                          <CheckCircle2 className={`w-4 h-4 sm:w-5 sm:h-5 ${offer.color} shrink-0 mt-0.5`} />
                          <span className="text-gray-400 text-xs sm:text-sm leading-relaxed">{bullet}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <div className="max-w-2xl mx-auto bg-violet-500/10 border border-violet-500/20 rounded-xl p-4 sm:p-6 backdrop-blur-sm px-4">
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              {t.offer.results}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

