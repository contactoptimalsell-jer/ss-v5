import React from 'react';
import { motion } from 'framer-motion';
import { Search, Bot, UserCheck, CheckCircle2, TrendingUp, ShieldCheck, Zap } from 'lucide-react';
import { Card } from './ui/Card';

export const OfferSection: React.FC = () => {
  const offers = [
    {
      icon: Search,
      title: "1. Audit IA",
      description: "Cartographie complète de vos usages IA actuels. Identification des risques RGPD, données sensibles, shadow AI. Opportunités d'automatisation chiffrées avec ROI estimé.",
      bullets: [
        "Cartographie des usages IA dans votre entreprise",
        "Identification des risques RGPD et données",
        "Opportunités d'automatisation chiffrées"
      ],
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20"
    },
    {
      icon: Bot,
      title: "2. Implémentation IA",
      description: "Automatisations concrètes sur-mesure. Outils internes et workflows métiers adaptés à votre entreprise. Pas de SaaS générique, mais des solutions ciblées.",
      bullets: [
        "Automatisations concrètes",
        "Outils internes et workflows métiers",
        "Sur-mesure, pas de SaaS générique"
      ],
      color: "text-violet-400",
      bg: "bg-violet-500/10",
      border: "border-violet-500/20"
    },
    {
      icon: UserCheck,
      title: "3. Accompagnement mensuel",
      description: "Amélioration continue avec nouvelles automatisations selon vos besoins. Cadre d'usage sécurisé et conforme RGPD. Suivi des résultats et optimisation.",
      bullets: [
        "Amélioration continue",
        "Nouvelles automatisations",
        "Cadre d'usage sécurisé"
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
          
          <h2 className="text-3xl md:text-5xl font-bold font-display text-white mb-6">
            Les 3 briques de <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">SkillShield</span>
          </h2>
          
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            Service premium d'audit et d'implémentation IA. Intervention humaine + IA. Sur-mesure pour votre entreprise.
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
          <div className="max-w-3xl mx-auto bg-gradient-to-br from-violet-500/10 to-cyan-500/10 border border-violet-500/20 rounded-2xl p-8 backdrop-blur-sm">
            <p className="text-gray-300 text-lg mb-4">
              <span className="font-bold text-white">Résultats visibles en 30 jours.</span> ROI mesurable dès le premier mois.
            </p>
            <p className="text-gray-400">
              Pas de formation inutile. Pas de SaaS générique. Implémentation concrète, orientée résultats.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

