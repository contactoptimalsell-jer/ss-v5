import React from 'react';
import { motion } from 'framer-motion';
import { Card } from './ui/Card';
import { Clock, BatteryWarning, TrendingUp } from 'lucide-react';
import { SectionId } from '../types';
import { AnimatedText } from './ui/AnimatedText';
import { useLanguage } from '../contexts/LanguageContext';

export const ProblemSection: React.FC = () => {
  const { t } = useLanguage();
  return (
    <section id={SectionId.PROBLEM} className="py-12 sm:py-16 md:py-24 relative bg-cyan-950">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-white mb-3 sm:mb-4 px-4">
            <AnimatedText type="wordByWord" delay={0.1} highlightWords={t.language === 'fr' ? ['employés', 'ChatGPT', 'sans cadre'] : ['employees', 'ChatGPT', 'framework']} highlightColor="text-orange-400">
              {t.problem.title}
            </AnimatedText>
            {' '}
            <AnimatedText type="gradient" delay={0.6} className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-violet-400">
              {t.problem.withoutFrame}
            </AnimatedText>
          </h2>
          <AnimatedText type="highlight" delay={0.8} className="text-gray-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto block px-4" highlightWords={t.language === 'fr' ? ['Données sensibles', 'RGPD', 'automatisation'] : ['Sensitive data', 'GDPR', 'automation']} highlightColor="text-red-400 font-semibold">
            {t.problem.description}
          </AnimatedText>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          <Card className="p-5 sm:p-6 md:p-8">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-violet-400/20 flex items-center justify-center mb-4 sm:mb-6 text-violet-300">
              <Clock className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">{t.problem.dataExposed}</h3>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
              {t.problem.dataExposedDesc}
            </p>
          </Card>

          <Card className="p-5 sm:p-6 md:p-8" highlight>
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-orange-500/20 to-violet-500/20 border border-orange-400/20 flex items-center justify-center mb-4 sm:mb-6 text-orange-300">
              <BatteryWarning className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">{t.problem.productivityLost}</h3>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
              {t.problem.productivityLostDesc}
            </p>
          </Card>

          <Card className="p-5 sm:p-6 md:p-8">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-400/20 flex items-center justify-center mb-4 sm:mb-6 text-blue-300">
              <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">{t.problem.immobility}</h3>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
              {t.problem.immobilityDesc}
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};