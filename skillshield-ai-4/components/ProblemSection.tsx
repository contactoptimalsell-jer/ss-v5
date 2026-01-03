import React from 'react';
import { Card } from './ui/Card';
import { Clock, BatteryWarning, TrendingUp } from 'lucide-react';
import { SectionId } from '../types';

export const ProblemSection: React.FC = () => {
  return (
    <section id={SectionId.PROBLEM} className="py-24 relative bg-cyan-950">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold font-display text-white mb-4">
            Vos employés utilisent ChatGPT <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-violet-400">sans cadre</span>
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto font-medium">
            Données sensibles exposées. Aucune vision claire des usages IA. Risques RGPD non maîtrisés.<br/>
            <span className="text-cyan-300">Pendant ce temps, vos concurrents automatisent</span> et gagnent en productivité.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-violet-400/20 flex items-center justify-center mb-6 text-violet-300">
              <Clock className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Données sensibles exposées</h3>
            <p className="text-gray-400 leading-relaxed text-sm">
              Vos équipes utilisent ChatGPT, Claude, Copilot <span className="text-cyan-300 font-medium">sans cadre ni contrôle</span>. Informations clients, contrats, données financières : tout peut fuiter. Risque RGPD majeur.
            </p>
          </Card>

          <Card className="p-8" highlight>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500/20 to-violet-500/20 border border-orange-400/20 flex items-center justify-center mb-6 text-orange-300">
              <BatteryWarning className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Perte de productivité cachée</h3>
            <p className="text-gray-400 leading-relaxed text-sm">
              Aucune vision claire des usages IA dans votre entreprise. <span className="text-orange-300 font-medium">Shadow AI non maîtrisé</span>. Opportunités d'automatisation non identifiées. Vous perdez du temps et de l'argent sans le savoir.
            </p>
          </Card>

          <Card className="p-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-400/20 flex items-center justify-center mb-6 text-blue-300">
              <TrendingUp className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Peur juridique + immobilisme</h3>
            <p className="text-gray-400 leading-relaxed text-sm">
              Vous savez qu'il faut agir, mais <span className="text-violet-300 font-medium">vous ne savez pas par où commencer</span>. Risques juridiques mal compris. Pas de stratégie claire. Résultat : vous restez immobile pendant que vos concurrents avancent.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};