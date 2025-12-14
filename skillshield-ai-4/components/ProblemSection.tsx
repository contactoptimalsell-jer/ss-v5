import React from 'react';
import { Card } from './ui/Card';
import { Clock, BatteryWarning, TrendingUp } from 'lucide-react';
import { SectionId } from '../types';

export const ProblemSection: React.FC = () => {
  return (
    <section id={SectionId.PROBLEM} className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold font-display text-white mb-4">
            Vous perdez <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-violet-400">10-20h par semaine</span>
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto font-medium">
            Sur des tâches que l'IA peut gérer à votre place.<br/>
            <span className="text-cyan-300">60% des entreprises</span> ont déjà automatisé ces processus. Où en êtes-vous ?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-violet-400/20 flex items-center justify-center mb-6 text-violet-300">
              <Clock className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">15h/semaine perdues</h3>
            <p className="text-gray-400 leading-relaxed text-sm">
              Emails, devis, factures, relances... <span className="text-cyan-300 font-medium">Ces tâches répétitives</span> vous coûtent 3h par jour. L'IA peut les gérer à votre place.
            </p>
          </Card>

          <Card className="p-8" highlight>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500/20 to-violet-500/20 border border-orange-400/20 flex items-center justify-center mb-6 text-orange-300">
              <BatteryWarning className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">ROI moyen : 250-450%</h3>
            <p className="text-gray-400 leading-relaxed text-sm">
              Les entreprises qui automatisent récupèrent leur investissement en <span className="text-orange-300 font-medium">3-10 mois</span>. Données vérifiées 2024. Vous êtes en retard ?
            </p>
          </Card>

          <Card className="p-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-400/20 flex items-center justify-center mb-6 text-blue-300">
              <TrendingUp className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Vos concurrents accélèrent</h3>
            <p className="text-gray-400 leading-relaxed text-sm">
              <span className="text-violet-300 font-medium">72% des entreprises</span> automatisent déjà leurs processus. Pendant que vous lisez, d'autres gagnent en compétitivité. Agissez maintenant.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};