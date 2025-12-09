import React from 'react';
import { SectionId } from '../types';
import { Search, Compass, Bot, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';

export const ProcessSection: React.FC = () => {
  const steps = [
    {
      icon: Search,
      title: "L'Audit de Clarté",
      desc: "On pose tout à plat. Nous identifions précisément où se perd votre temps et où se cache votre marge.",
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20"
    },
    {
      icon: Compass,
      title: "La Feuille de Route",
      desc: "Nous concevons une stratégie sur mesure pour intégrer l'IA sans perturber votre ADN d'entreprise.",
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/20"
    },
    {
      icon: Bot,
      title: "Vos Nouveaux Alliés",
      desc: "Mise en place d'agents IA qui travaillent en binôme avec vos équipes pour les soulager du répétitif.",
      color: "text-violet-400",
      bg: "bg-violet-500/10",
      border: "border-violet-500/20"
    },
    {
      icon: Rocket,
      title: "L'Expansion Sereine",
      desc: "Vous pilotez enfin votre entreprise avec recul. Votre CA augmente, mais votre charge mentale diminue.",
      color: "text-green-400",
      bg: "bg-green-500/10",
      border: "border-green-500/20"
    }
  ];

  return (
    <section id={SectionId.APPROACH} className="py-24 bg-slate-900/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold font-display text-white mb-6">
            Une transition <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">fluide et maîtrisée</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto italic">
            "L'objectif n'est pas de tout changer, mais de tout améliorer."
          </p>
        </div>

        <div className="relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-blue-900 via-violet-900 to-green-900 -translate-y-1/2 z-0 opacity-30" />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
                {steps.map((step, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.2 }}
                        className="flex flex-col items-center text-center group"
                    >
                        <div className={`w-20 h-20 rounded-full ${step.bg} ${step.border} border-2 flex items-center justify-center mb-6 shadow-lg backdrop-blur-sm group-hover:scale-110 transition-transform duration-300`}>
                            <step.icon className={`w-8 h-8 ${step.color}`} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                        <p className="text-gray-400 text-sm leading-relaxed px-4">
                            {step.desc}
                        </p>
                    </motion.div>
                ))}
            </div>
        </div>
      </div>
    </section>
  );
};