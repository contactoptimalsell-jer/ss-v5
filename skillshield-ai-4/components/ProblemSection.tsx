import React from 'react';
import { Card } from './ui/Card';
import { Clock, BatteryWarning, TrendingUp } from 'lucide-react';
import { SectionId } from '../types';

export const ProblemSection: React.FC = () => {
  return (
    <section id={SectionId.PROBLEM} className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold font-display text-white mb-6">
            La Surcharge <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-violet-400">Silencieuse</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Aujourd'hui, diriger rime trop souvent avec "tout gérer". <br/>
            Ce bruit de fond opérationnel vous empêche de voir plus loin.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-violet-400/20 flex items-center justify-center mb-6 text-violet-300">
              <Clock className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Le Temps Précieux</h3>
            <p className="text-gray-400 leading-relaxed">
              Vos journées ne sont pas extensibles. Chaque heure passée sur des tâches à faible valeur ajoutée est une heure volée à votre famille, vos passions, ou votre stratégie.
            </p>
          </Card>

          <Card className="p-8" highlight>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500/20 to-violet-500/20 border border-orange-400/20 flex items-center justify-center mb-6 text-orange-300">
              <BatteryWarning className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">La Fatigue Décisionnelle</h3>
            <p className="text-gray-400 leading-relaxed">
              À force de gérer des micro-problèmes toute la journée, vous n'avez plus l'énergie mentale pour les grandes décisions. Vous finissez la semaine épuisé, avec le sentiment de stagner.
            </p>
          </Card>

          <Card className="p-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-400/20 flex items-center justify-center mb-6 text-blue-300">
              <TrendingUp className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Le Plafond de Verre</h3>
            <p className="text-gray-400 leading-relaxed">
              Votre entreprise a du potentiel, mais vos processus actuels saturent. Pour grandir sans vous épuiser, il ne faut pas travailler plus dur, mais plus intelligemment.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};