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
      title: "IA qui exécute",
      description: "Des agents IA autonomes qui gèrent vos tâches répétitives avec précision et rapidité.",
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20"
    },
    {
      icon: Eye,
      title: "IA qui surveille l'IA",
      description: "Un système de monitoring intelligent qui détecte automatiquement les anomalies et les dérives.",
      color: "text-violet-400",
      bg: "bg-violet-500/10",
      border: "border-violet-500/20"
    },
    {
      icon: UserCheck,
      title: "Expert humain qui vérifie",
      description: "Un expert vérifie chaque mois, en temps réel, que chaque fonctionnalité délivre ce qu'elle doit délivrer.",
      color: "text-orange-400",
      bg: "bg-orange-500/10",
      border: "border-orange-500/20"
    }
  ];

  const protections = [
    {
      icon: AlertTriangle,
      text: "Si un workflow déraille",
      result: "→ l'IA le détecte"
    },
    {
      icon: Eye,
      text: "Si quelque chose échappe à l'IA",
      result: "→ l'expert humain le voit"
    },
    {
      icon: CheckCircle2,
      text: "Si une fonctionnalité ne délivre plus",
      result: "→ elle est corrigée avant même que l'entreprise ne s'en aperçoive"
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800/50 to-slate-900">
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
            <span className="text-sm font-bold text-violet-300 tracking-wide uppercase">Guardian Mode™</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold font-display text-white mb-6">
            Le Paradoxe de la <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Fiabilité</span>
          </h2>
          
          <p className="text-gray-300 text-lg max-w-3xl mx-auto mb-4">
            L'IA est moins fiable que l'humain ?
          </p>
          <p className="text-gray-400 text-base max-w-3xl mx-auto">
            C'est l'argument préféré de ceux qui... n'ont jamais mesuré la fiabilité humaine.
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
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 backdrop-blur-sm">
            <p className="text-gray-300 text-lg leading-relaxed mb-4">
              <span className="font-bold text-white">L'humain se trompe. Souvent.</span>
            </p>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-400">
              <div className="flex items-start gap-2">
                <span className="text-red-400 mt-1">•</span>
                <span>Fatigue, distraction, surcharge</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-red-400 mt-1">•</span>
                <span>Routine, biais, erreurs de reporting</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-red-400 mt-1">•</span>
                <span>Oublis, incohérences</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-red-400 mt-1">•</span>
                <span>Et pourtant, on lui fait confiance les yeux fermés</span>
              </div>
            </div>
            <p className="text-violet-300 font-semibold mt-6 text-center">
              Le vrai paradoxe : on exige de l'IA une perfection qu'on n'a jamais exigée de l'humain.
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
              C'est précisément pour ça que <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">SkillShield AI</span> existe
            </h3>
            <p className="text-gray-400 text-lg">
              Un système où l'erreur n'a pas d'endroit où se cacher.
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
                Comment ça fonctionne en pratique
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
              Résultat ?
            </h3>
            <div className="space-y-3 text-lg">
              <p className="text-gray-300">
                Les process deviennent <span className="font-bold text-green-400">plus fiables que l'humain</span>.
              </p>
              <p className="text-gray-300">
                Plus fiables que <span className="font-bold text-cyan-400">l'IA seule</span>.
              </p>
              <p className="text-gray-300">
                Plus fiables que <span className="font-bold text-violet-400">les deux séparés</span>.
              </p>
              <p className="text-white font-bold text-xl mt-6">
                C'est la combinaison qui change tout.
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
            La vraie question n'est plus : <span className="text-gray-300 italic">"L'IA est-elle moins fiable que l'humain ?"</span>
          </p>
          <p className="text-white font-bold text-xl mb-8">
            La vraie question est : <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">"Combien de temps allez-vous accepter de dépendre d'un système SANS filet de sécurité ?"</span>
          </p>
          
          <div className="flex flex-col items-center gap-4">
            <p className="text-gray-300 text-sm mb-2">
              Parce que nous, on est suffisamment confiants pour être payés uniquement quand ça marche.
            </p>
            <Button 
              onClick={openCalendly} 
              icon={<Shield className="w-5 h-5"/>}
              className="shadow-violet-500/20 hover:shadow-violet-500/40 border border-white/10"
            >
              Votre Guardian Mode™ en 5 minutes
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};




