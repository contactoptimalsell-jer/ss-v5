import React from 'react';
import { motion } from 'framer-motion';
import { Card } from './ui/Card';
import { Clock, BatteryWarning, TrendingUp } from 'lucide-react';
import { SectionId } from '../types';
import { AnimatedText } from './ui/AnimatedText';

export const ProblemSection: React.FC = () => {
  return (
    <section id={SectionId.PROBLEM} className="py-12 sm:py-16 md:py-24 relative bg-cyan-950">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-white mb-3 sm:mb-4 px-4">
            <AnimatedText type="wordByWord" delay={0.1} highlightWords={['employés', 'ChatGPT', 'sans cadre']} highlightColor="text-orange-400">
              Vos employés utilisent ChatGPT
            </AnimatedText>
            {' '}
            <AnimatedText type="gradient" delay={0.6} className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-violet-400">
              sans cadre
            </AnimatedText>
          </h2>
          <AnimatedText type="highlight" delay={0.8} className="text-gray-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto block px-4" highlightWords={['Données sensibles', 'RGPD', 'automatisation']} highlightColor="text-red-400 font-semibold">
            Données sensibles exposées • Risques RGPD non maîtrisés • Opportunités d'automatisation perdues
          </AnimatedText>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          <Card className="p-5 sm:p-6 md:p-8">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-violet-400/20 flex items-center justify-center mb-4 sm:mb-6 text-violet-300">
              <Clock className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">Données sensibles exposées</h3>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
              ChatGPT, Claude, Copilot utilisés <span className="text-cyan-300 font-medium">sans contrôle</span>. Informations clients, contrats, données financières : risque RGPD majeur.
            </p>
          </Card>

          <Card className="p-5 sm:p-6 md:p-8" highlight>
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-orange-500/20 to-violet-500/20 border border-orange-400/20 flex items-center justify-center mb-4 sm:mb-6 text-orange-300">
              <BatteryWarning className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">Perte de productivité cachée</h3>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
              Aucune vision des usages IA. <span className="text-orange-300 font-medium">Shadow AI non maîtrisé</span>. Opportunités d'automatisation perdues.
            </p>
          </Card>

          <Card className="p-5 sm:p-6 md:p-8">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-400/20 flex items-center justify-center mb-4 sm:mb-6 text-blue-300">
              <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">Immobilisme face aux risques</h3>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
              Vous savez qu'il faut agir, mais <span className="text-violet-300 font-medium">vous ne savez pas par où commencer</span>. Risques juridiques mal compris. Pas de stratégie claire.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};