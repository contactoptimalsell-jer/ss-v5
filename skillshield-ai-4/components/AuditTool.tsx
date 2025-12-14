import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Loader2, CheckCircle2, Clock, ShieldCheck, Zap, TrendingUp, BarChart3, Target } from 'lucide-react';
import { generateAudit } from '../services/geminiService';
import { AuditResult, SectionId } from '../types';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

export const AuditTool: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AuditResult | null>(null);

  const handleAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setResult(null);
    const auditData = await generateAudit(input);
    setResult(auditData);
    setLoading(false);
  };

  const openCalendly = () => {
    window.open('https://calendly.com/b00784336-essec?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app', '_blank');
  };

  return (
    <section id={SectionId.AUDIT_TOOL} className="py-24 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-violet-900/10 to-cyan-900/20 rounded-full blur-[100px] -z-10" />

      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-sm font-bold mb-4">
            🎯 Test Gratuit • 2 Minutes
          </span>
          <h2 className="text-3xl md:text-5xl font-bold font-display text-white mb-4">
            Découvrez ce que vous pouvez <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">automatiser dès aujourd'hui</span>
          </h2>
          <p className="text-gray-300 text-lg font-medium mb-2">
            Décrivez une tâche chronophage. Notre IA vous montre <span className="text-cyan-300">exactement</span> comment l'automatiser et combien de temps vous gagnerez.
          </p>
          <p className="text-gray-500 text-sm">
            <span className="text-violet-300 font-semibold">Gratuit</span> • <span className="text-cyan-300 font-semibold">Sans engagement</span> • <span className="text-green-300 font-semibold">Résultats en 30 secondes</span>
          </p>
        </div>

        <Card className="border-violet-500/30" highlight>
          <div className="p-8 md:p-12 max-h-[70vh] overflow-y-auto">
            <form onSubmit={handleAudit} className="space-y-6">
              <div>
                <label htmlFor="problem" className="block text-sm font-medium text-cyan-200 mb-2">
                  Quelle tâche chronophage aimeriez-vous voir disparaître ?
                </label>
                <div className="relative">
                  <textarea
                    id="problem"
                    rows={6}
                    className="w-full bg-slate-900/50 border-2 border-violet-400/30 rounded-xl p-4 text-white placeholder-slate-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all outline-none resize-none"
                    placeholder="Ex: Je passe 2h par jour à trier mes emails, faire des devis manuellement, répondre aux mêmes questions..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button type="submit" disabled={loading || !input} icon={loading ? <Loader2 className="animate-spin" /> : <Zap />}>
                  {loading ? 'Analyse de votre potentiel...' : 'Voir la solution IA'}
                </Button>
              </div>
            </form>

            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-10 pt-10 border-t border-white/10"
                >
                  <div className="mb-8">
                      <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                          <span className="text-2xl">💡</span> Notre Analyse
                      </h3>
                      <p className="text-violet-200 italic font-medium">"{result.analysis}"</p>
                  </div>

                  <div className="grid gap-6 md:grid-cols-3">
                    {result.suggestions.map((suggestion, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-slate-800/40 rounded-2xl p-6 border border-white/5 hover:bg-slate-800/60 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className={`
                              px-2 py-1 rounded text-xs font-bold uppercase
                              ${suggestion.difficulty === 'Facile' ? 'bg-green-500/20 text-green-400' : 
                                suggestion.difficulty === 'Moyen' ? 'bg-orange-500/20 text-orange-400' : 'bg-red-500/20 text-red-400'}
                          `}>
                              {suggestion.difficulty}
                          </div>
                          <div className="flex items-center gap-1 text-cyan-300 text-sm font-bold">
                              <Clock className="w-3 h-3" /> {suggestion.timeSaved}
                          </div>
                        </div>
                        <h4 className="font-bold text-white mb-2">{suggestion.title}</h4>
                        <p className="text-sm text-gray-400">{suggestion.description}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Section Benchmark IA/Automatisation - Placée stratégiquement après les suggestions et avant le CTA */}
                  {result.benchmark && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="mt-10 bg-gradient-to-br from-orange-900/20 to-violet-900/20 rounded-2xl p-8 border border-orange-500/20 relative overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl -z-10" />
                      <div className="absolute bottom-0 right-0 w-40 h-40 bg-violet-500/10 rounded-full blur-3xl -z-10" />
                      
                      <div className="relative z-10">
                          <div className="flex items-center gap-3 mb-6">
                              <BarChart3 className="w-6 h-6 text-orange-400" />
                              <h4 className="text-2xl font-bold text-white">
                                  Benchmark IA/Automatisation
                              </h4>
                          </div>
                          <p className="text-gray-300 mb-6 text-sm">
                              Données comparatives basées sur des études réelles du secteur <span className="font-semibold text-orange-300 capitalize">{result.benchmark.sectorAverage}</span> en 2024. 
                              <span className="text-cyan-300 font-medium"> Sources vérifiées : thunderbit.com, gsst.fr</span>
                          </p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                              <div className="bg-slate-800/40 rounded-xl p-5 border border-orange-500/20 hover:bg-slate-800/60 transition-colors">
                                  <div className="flex items-center gap-2 mb-2">
                                      <Target className="w-5 h-5 text-orange-400" />
                                      <span className="text-xs font-semibold text-gray-400 uppercase">Processus automatisés</span>
                                  </div>
                                  <div className="text-3xl font-bold text-white mb-1">{result.benchmark.automatedProcessesPercentage}%</div>
                                  <p className="text-xs text-gray-400">des entreprises du secteur</p>
                              </div>
                              
                              <div className="bg-slate-800/40 rounded-xl p-5 border border-cyan-500/20 hover:bg-slate-800/60 transition-colors">
                                  <div className="flex items-center gap-2 mb-2">
                                      <Clock className="w-5 h-5 text-cyan-400" />
                                      <span className="text-xs font-semibold text-gray-400 uppercase">Temps économisé</span>
                                  </div>
                                  <div className="text-2xl font-bold text-white mb-1">{result.benchmark.averageTimeSavedPerTask}</div>
                                  <p className="text-xs text-gray-400">par tâche automatisée</p>
                              </div>
                              
                              <div className="bg-slate-800/40 rounded-xl p-5 border border-violet-500/20 hover:bg-slate-800/60 transition-colors">
                                  <div className="flex items-center gap-2 mb-2">
                                      <TrendingUp className="w-5 h-5 text-violet-400" />
                                      <span className="text-xs font-semibold text-gray-400 uppercase">ROI moyen</span>
                                  </div>
                                  <div className="text-2xl font-bold text-white mb-1">{result.benchmark.averageROI}</div>
                                  <p className="text-xs text-gray-400">dès la première année</p>
                              </div>
                              
                              <div className="bg-slate-800/40 rounded-xl p-5 border border-green-500/20 hover:bg-slate-800/60 transition-colors">
                                  <div className="flex items-center gap-2 mb-2">
                                      <Zap className="w-5 h-5 text-green-400" />
                                      <span className="text-xs font-semibold text-gray-400 uppercase">Rentabilité</span>
                                  </div>
                                  <div className="text-2xl font-bold text-white mb-1">{result.benchmark.paybackPeriod}</div>
                                  <p className="text-xs text-gray-400">pour récupérer l'investissement</p>
                              </div>
                          </div>
                          
                          <div className="mt-6 p-4 bg-gradient-to-r from-orange-500/10 to-violet-500/10 rounded-lg border border-orange-500/20">
                              <p className="text-sm text-orange-200 text-center">
                                  <span className="font-bold">💡 Le potentiel de transformation est réel.</span> Les entreprises qui automatisent leurs processus gagnent en compétitivité et libèrent du temps pour l'essentiel.
                              </p>
                          </div>
                      </div>
                    </motion.div>
                  )}
                  
                  <div className="mt-10 bg-gradient-to-br from-violet-900/30 to-cyan-900/30 rounded-2xl p-8 border border-violet-500/30 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl -z-10" />
                      
                      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                          <div className="text-left space-y-2">
                              <h4 className="text-xl font-bold text-white">Ce n'est que le début.</h4>
                              <p className="text-gray-300">
                                  Imaginez ce que vous feriez avec ces heures gagnées chaque semaine.
                              </p>
                              <div className="flex items-start gap-2 mt-4 text-sm text-cyan-200 bg-cyan-900/20 p-3 rounded-lg border border-cyan-500/20">
                                  <ShieldCheck className="w-5 h-5 shrink-0 text-cyan-400" />
                                  <span>
                                      <span className="font-bold text-cyan-400">Garantie Résultat :</span> Nous ne facturons que si nous créons de la valeur réelle pour vous. <span className="font-bold text-cyan-300">Remboursé à 90%</span>, comme nous sommes sûrs de vous apporter ces technologies de la bonne manière.
                                  </span>
                              </div>
                          </div>
                          <Button 
                            onClick={openCalendly}
                            className="shrink-0 whitespace-nowrap shadow-[0_0_30px_-5px_rgba(139,92,246,0.3)] hover:shadow-[0_0_40px_-5px_rgba(34,211,238,0.4)]"
                          >
                              En parler de vive voix (15 min)
                          </Button>
                      </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Card>
      </div>
    </section>
  );
};