import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Bot, Eye, UserCheck, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Button } from './ui/Button';

export const GuardianModeSection: React.FC = () => {
  const openCalendly = () => {
    window.open('https://calendly.com/b00784336-essec?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app', '_blank');
  };

  const layers = [
    {
      icon: Bot,
      title: "1. Audit IA",
      description: "Cartographie de vos usages IA actuels. Identification des risques RGPD, données sensibles, shadow AI. Opportunités d'automatisation chiffrées.",
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20"
    },
    {
      icon: Eye,
      title: "2. Implémentation IA",
      description: "Automatisations concrètes sur-mesure. Outils internes et workflows métiers. Pas de SaaS générique, mais des solutions adaptées à votre entreprise.",
      color: "text-violet-400",
      bg: "bg-violet-500/10",
      border: "border-violet-500/20"
    },
    {
      icon: UserCheck,
      title: "3. Accompagnement mensuel",
      description: "Amélioration continue. Nouvelles automatisations selon vos besoins. Cadre d'usage sécurisé et conforme RGPD.",
      color: "text-orange-400",
      bg: "bg-orange-500/10",
      border: "border-orange-500/20"
    }
  ];

  const protections = [
    {
      icon: AlertTriangle,
      text: "Risques RGPD identifiés",
      result: "→ Cadre d'usage sécurisé mis en place"
    },
    {
      icon: Eye,
      text: "Opportunités d'automatisation",
      result: "→ Implémentées avec ROI mesurable"
    },
    {
      icon: CheckCircle2,
      text: "Résultats en 30 jours",
      result: "→ 20 à 40% de tâches automatisées"
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
            <Shield className="w-4 h-4 text-violet-400" />
            <span className="text-sm font-bold text-violet-300 tracking-wide uppercase">Solution SkillShield</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold font-display text-white mb-6">
            Audit IA rapide. <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Implémentation ciblée.</span>
          </h2>
          
          <p className="text-gray-300 text-lg max-w-3xl mx-auto mb-4">
            Nous aidons les PME à réduire les risques liés à l'IA
          </p>
          <p className="text-gray-400 text-base max-w-3xl mx-auto">
            et à automatiser 20 à 40% de leurs tâches internes en 30 jours.
          </p>
        </motion.div>

        {/* The Problem */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto mb-16"
        >
          <div className="bg-violet-500/10 border border-violet-500/20 rounded-2xl p-8 backdrop-blur-sm">
            <p className="text-gray-300 text-lg leading-relaxed mb-4">
              <span className="font-bold text-white">Intervention humaine + IA. Sur-mesure. Pas de SaaS générique.</span>
            </p>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-400">
              <div className="flex items-start gap-2">
                <span className="text-violet-400 mt-1">•</span>
                <span>Audit rapide de vos usages IA actuels</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-violet-400 mt-1">•</span>
                <span>Identification des risques RGPD et données</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-violet-400 mt-1">•</span>
                <span>Opportunités d'automatisation chiffrées</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-violet-400 mt-1">•</span>
                <span>Implémentation concrète, pas de théorie</span>
              </div>
            </div>
            <p className="text-cyan-300 font-semibold mt-6 text-center">
              Résultats visibles en 30 jours. ROI mesurable dès le premier mois.
            </p>
          </div>
        </motion.div>

        {/* The Solution - Guardian Mode */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-4xl font-bold font-display text-white mb-4">
              Comment <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">SkillShield</span> fonctionne
            </h3>
            <p className="text-gray-400 text-lg">
              Service premium d'audit et d'implémentation IA pour PME de services.
            </p>
          </div>

          {/* Three Layers */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {layers.map((layer, index) => {
              const Icon = layer.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  className="relative"
                >
                  <div className={`${layer.bg} ${layer.border} border-2 rounded-2xl p-8 h-full backdrop-blur-sm relative overflow-hidden`}>
                    {/* Number Badge */}
                    <div className={`absolute top-4 right-4 w-10 h-10 ${layer.bg} ${layer.border} border rounded-full flex items-center justify-center ${layer.color} font-bold text-lg`}>
                      {index + 1}
                    </div>
                    
                    <div className={`w-16 h-16 ${layer.bg} ${layer.border} border rounded-2xl flex items-center justify-center mb-6 ${layer.color}`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    
                    <h4 className={`text-xl font-bold mb-3 ${layer.color}`}>
                      {layer.title}
                    </h4>
                    
                    <p className="text-gray-400 leading-relaxed">
                      {layer.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Protection System */}
          <div className="max-w-3xl mx-auto">
            <div className="bg-gradient-to-br from-violet-500/10 to-cyan-500/10 border border-violet-500/20 rounded-2xl p-8 backdrop-blur-sm">
              <h4 className="text-xl font-bold text-white mb-6 text-center">
                Ce que vous obtenez
              </h4>
              <div className="space-y-4">
                {protections.map((protection, index) => {
                  const Icon = protection.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                      className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/10"
                    >
                      <div className="w-10 h-10 rounded-lg bg-violet-500/20 border border-violet-500/30 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-violet-300" />
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-300 font-medium">
                          {protection.text}
                        </p>
                        <p className="text-cyan-400 font-semibold mt-1">
                          {protection.result}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Result */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mb-12"
        >
          <div className="max-w-3xl mx-auto bg-gradient-to-br from-green-500/10 to-cyan-500/10 border border-green-500/20 rounded-2xl p-8 backdrop-blur-sm">
            <h3 className="text-2xl md:text-3xl font-bold font-display text-white mb-6">
              Résultats mesurables
            </h3>
            <div className="space-y-3 text-lg">
              <p className="text-gray-300">
                <span className="font-bold text-green-400">20 à 40% de tâches automatisées</span> en 30 jours.
              </p>
              <p className="text-gray-300">
                <span className="font-bold text-cyan-400">Risques RGPD identifiés et sécurisés</span> dès l'audit.
              </p>
              <p className="text-gray-300">
                <span className="font-bold text-violet-400">ROI mesurable</span> dès le premier mois.
              </p>
              <p className="text-white font-bold text-xl mt-6">
                Implémentation concrète, pas de théorie.
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-center"
        >
          <p className="text-gray-400 text-lg mb-6 max-w-2xl mx-auto">
            Service premium pour PME de services : agences immobilières, cabinets comptables, ESN, PME B2B.
          </p>
          <p className="text-white font-bold text-xl mb-8">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Audit rapide. Implémentation ciblée. Résultats en 30 jours.</span>
          </p>
          
          <div className="flex flex-col items-center gap-4">
            <p className="text-gray-300 text-sm mb-2">
              Intervention humaine + IA. Sur-mesure. Pas de formation inutile.
            </p>
            <Button 
              onClick={openCalendly} 
              icon={<Shield className="w-5 h-5"/>}
              className="shadow-violet-500/20 hover:shadow-violet-500/40 border border-white/10"
            >
              Demander un audit IA
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};











