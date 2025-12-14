import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line, Cell } from 'recharts';
import { TrendingUp, Clock, Target, Zap } from 'lucide-react';
import { VisualizationData } from '../types';

interface VisualizationDashboardProps {
  data: VisualizationData;
}

export const VisualizationDashboard: React.FC<VisualizationDashboardProps> = ({ data }) => {
  // Préparer les données pour le graphique en barres
  const barChartData = data.timeGainBySolution.map((item, index) => ({
    name: item.name,
    heures: item.hoursPerWeek,
    difficulty: item.difficulty
  }));

  // Couleurs selon la difficulté
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Facile': return '#10B981'; // vert
      case 'Moyen': return '#F59E0B'; // orange
      case 'Complexe': return '#EF4444'; // rouge
      default: return '#9333EA'; // violet
    }
  };

  // Préparer les données pour le graphique radar (impact par catégorie)
  const radarData = data.impactByCategory.map(cat => ({
    category: cat.category,
    'Temps actuel': cat.currentTime,
    'Temps automatisé': cat.automatedTime,
    'Gain (%)': cat.gainPercentage
  }));

  // Préparer les données pour le graphique ROI
  const roiData = data.roiProjection.map(item => ({
    mois: `M${item.month}`,
    'ROI cumulé (%)': item.cumulativeROI
  }));

  // Calculer le total des heures économisées
  const totalHoursSaved = data.timeGainBySolution.reduce((sum, item) => sum + item.hoursPerWeek, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mt-10 bg-gradient-to-br from-slate-900/80 to-slate-800/80 rounded-2xl p-8 border border-cyan-500/30 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-violet-500/10 rounded-full blur-3xl -z-10" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-6 h-6 text-cyan-400" />
          <h4 className="text-2xl font-bold text-white">
            Diagnostic Visuel des Gains d'Automatisation
          </h4>
        </div>
        <p className="text-gray-300 mb-8 text-sm">
          Visualisation interactive basée sur vos données réelles. Analysez où les gains d'automatisation sont les plus importants.
        </p>

        {/* Résumé en haut */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-800/60 rounded-xl p-5 border border-cyan-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-cyan-400" />
              <span className="text-xs font-semibold text-gray-400 uppercase">Temps total économisé</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{totalHoursSaved}h</div>
            <p className="text-xs text-gray-400">par semaine</p>
          </div>
          
          <div className="bg-slate-800/60 rounded-xl p-5 border border-violet-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-violet-400" />
              <span className="text-xs font-semibold text-gray-400 uppercase">Potentiel d'automatisation</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {Math.round(data.automationPotential.reduce((sum, p) => sum + p.automationLevel, 0) / data.automationPotential.length)}%
            </div>
            <p className="text-xs text-gray-400">moyen</p>
          </div>
          
          <div className="bg-slate-800/60 rounded-xl p-5 border border-green-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-green-400" />
              <span className="text-xs font-semibold text-gray-400 uppercase">Solutions proposées</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{data.timeGainBySolution.length}</div>
            <p className="text-xs text-gray-400">automatisations</p>
          </div>
        </div>

        {/* Graphique 1: Gains de temps par solution */}
        <div className="mb-8 bg-slate-800/40 rounded-xl p-6 border border-cyan-500/20">
          <h5 className="text-lg font-bold text-white mb-4">Gains de Temps par Solution</h5>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="name" 
                stroke="#9CA3AF"
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
              />
              <YAxis 
                stroke="#9CA3AF"
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                label={{ value: 'Heures/semaine', angle: -90, position: 'insideLeft', fill: '#9CA3AF' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F3F4F6'
                }}
                formatter={(value: number) => [`${value}h/semaine`, 'Temps économisé']}
              />
              <Bar dataKey="heures" radius={[8, 8, 0, 0]}>
                {barChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getDifficultyColor(entry.difficulty)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-4 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-green-500"></div>
              <span className="text-xs text-gray-400">Facile</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-orange-500"></div>
              <span className="text-xs text-gray-400">Moyen</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-red-500"></div>
              <span className="text-xs text-gray-400">Complexe</span>
            </div>
          </div>
        </div>

        {/* Graphique 2: Impact par catégorie (Radar) */}
        {data.impactByCategory.length > 0 && (
          <div className="mb-8 bg-slate-800/40 rounded-xl p-6 border border-violet-500/20">
            <h5 className="text-lg font-bold text-white mb-4">Impact par Catégorie de Tâche</h5>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#374151" />
                <PolarAngleAxis 
                  dataKey="category" 
                  tick={{ fill: '#9CA3AF', fontSize: 11 }}
                />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 100]}
                  tick={{ fill: '#9CA3AF', fontSize: 10 }}
                />
                <Radar
                  name="Gain (%)"
                  dataKey="Gain (%)"
                  stroke="#9333EA"
                  fill="#9333EA"
                  fillOpacity={0.6}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F3F4F6'
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
            <p className="text-xs text-gray-400 mt-4 text-center">
              Plus la zone est grande, plus le potentiel d'automatisation est élevé
            </p>
          </div>
        )}

        {/* Graphique 3: Projection ROI */}
        <div className="bg-slate-800/40 rounded-xl p-6 border border-green-500/20">
          <h5 className="text-lg font-bold text-white mb-4">Projection du ROI sur 12 Mois</h5>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={roiData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="mois" 
                stroke="#9CA3AF"
                tick={{ fill: '#9CA3AF', fontSize: 11 }}
              />
              <YAxis 
                stroke="#9CA3AF"
                tick={{ fill: '#9CA3AF', fontSize: 11 }}
                label={{ value: 'ROI (%)', angle: -90, position: 'insideLeft', fill: '#9CA3AF' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F3F4F6'
                }}
                formatter={(value: number) => [`${value}%`, 'ROI cumulé']}
              />
              <Line 
                type="monotone" 
                dataKey="ROI cumulé (%)" 
                stroke="#10B981" 
                strokeWidth={3}
                dot={{ fill: '#10B981', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-400 mt-4 text-center">
            Projection basée sur les données réelles du secteur
          </p>
        </div>
      </div>
    </motion.div>
  );
};


