import React from 'react';
import { motion } from 'framer-motion';
import { Search, Bot, UserCheck, CheckCircle2, TrendingUp, ShieldCheck, Zap } from 'lucide-react';
import { Card } from './ui/Card';

export const OfferSection: React.FC = () => {
  const offers = [
    {
      icon: Search,
      title: "1. Audit IA",
      description: "Cartographie de vos usages IA. Identification des risques RGPD. Opportunités d'automatisation chiffrées.",
      bullets: [
        "Cartographie des usages IA",
        "Risques RGPD identifiés",
        "Opportunités chiffrées avec ROI"
      ],
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20"
    },
    {
      icon: Bot,
      title: "2. Implémentation IA",
      description: "Automatisations sur-mesure. Outils internes adaptés à votre entreprise. Pas de SaaS générique.",
      bullets: [
        "Automatisations concrètes",
        "Outils internes sur-mesure",
        "Pas de SaaS générique"
      ],
      color: "text-violet-400",
      bg: "bg-violet-500/10",
      border: "border-violet-500/20"
    },
    {
      icon: UserCheck,
      title: "3. Accompagnement mensuel",
      description: "Amélioration continue. Nouvelles automatisations selon vos besoins. Cadre sécurisé et conforme RGPD.",
      bullets: [
        "Amélioration continue",
        "Nouvelles automatisations",
        "Cadre sécurisé RGPD"
      ],
      color: "text-orange-400",
      bg: "bg-orange-500/10",
      border: "border-orange-500/20"
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-cyan-950">
      {/* Background Effects */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-violet-600/10 rounded-full mix-blend-screen filter blur-[120px] animate-blob" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-6 backdrop-blur-sm">
            <ShieldCheck className="w-4 h-4 text-violet-400" />
            <span className="text-sm font-bold text-violet-300 tracking-wide uppercase">Notre Offre</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold font-display text-white mb-4">
            Les 3 briques de <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">SkillShield</span>
          </h2>
          
          <p className="text-gray-300 text-base max-w-2xl mx-auto">
            Audit IA • Implémentation sur-mesure • Accompagnement continu
          </p>
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
                  <div className="p-8">
                    {/* Icon */}
                    <div className={`w-16 h-16 ${offer.bg} ${offer.border} border rounded-2xl flex items-center justify-center mb-6 ${offer.color}`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    
                    {/* Title */}
                    <h3 className={`text-2xl font-bold mb-4 ${offer.color}`}>
                      {offer.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-gray-300 mb-6 leading-relaxed">
                      {offer.description}
                    </p>
                    
                    {/* Bullets */}
                    <div className="space-y-3">
                      {offer.bullets.map((bullet, bulletIndex) => (
                        <div key={bulletIndex} className="flex items-start gap-3">
                          <CheckCircle2 className={`w-5 h-5 ${offer.color} shrink-0 mt-0.5`} />
                          <span className="text-gray-400 text-sm">{bullet}</span>
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
          <div className="max-w-2xl mx-auto bg-violet-500/10 border border-violet-500/20 rounded-xl p-6 backdrop-blur-sm">
            <p className="text-gray-300 text-base">
              <span className="font-bold text-white">Résultats visibles en 30 jours.</span> ROI mesurable dès le premier mois. Implémentation concrète, orientée résultats.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

