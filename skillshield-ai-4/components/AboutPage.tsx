import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, AlertTriangle, Heart, Shield, Zap, Sparkles, UserCheck, Bot } from 'lucide-react';
import { Button } from './ui/Button';

export const AboutPage: React.FC<{ onNavigateHome: () => void }> = ({ onNavigateHome }) => {
  // --- GESTION DES PHOTOS (LECTURE SEULE) ---
  const [jeromeImgSrc] = useState(() => {
    try {
      return localStorage.getItem('skillshield_jerome_photo') || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1000&auto=format&fit=crop';
    } catch {
      return 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1000&auto=format&fit=crop';
    }
  });

  const [thomasImgSrc] = useState(() => {
    try {
      return localStorage.getItem('skillshield_thomas_photo') || 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1000&auto=format&fit=crop';
    } catch {
      return 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1000&auto=format&fit=crop';
    }
  });

  const openCalendly = () => {
    window.open('https://calendly.com/b00784336-essec?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app', '_blank');
  };

  return (
    <div className="pt-24 pb-20">
      {/* Hero Section About */}
      <section className="relative px-6 mb-24">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[120px] -z-10" />
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 mb-8"
          >
            <AlertTriangle className="w-4 h-4 text-orange-400" />
            <span className="text-sm font-bold text-orange-300 uppercase tracking-wide">Le virage historique</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-display font-bold text-white mb-8 leading-tight"
          >
            Il y a eu avant Internet.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-cyan-300 to-violet-400">
              Il y aura après l'IA.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-300 leading-relaxed mb-10"
          >
            Nous vivons la plus grande bascule économique de notre siècle. <br/>
            Ce n'est pas une "mise à jour". C'est une redistribution des cartes.
          </motion.p>
        </div>
      </section>

      {/* The FOMO / Reality Check Section */}
      <section className="container mx-auto px-6 mb-32">
        <div className="grid md:grid-cols-2 gap-12 items-center bg-slate-800/30 rounded-3xl p-8 md:p-12 border border-white/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-transparent pointer-events-none" />
            
            <div className="space-y-6 relative z-10">
                <h2 className="text-3xl font-bold text-white font-display">Pourquoi vos concurrents accélèrent</h2>
                <p className="text-gray-400 text-lg leading-relaxed">
                    Pendant que vous lisez ces lignes, d'autres entreprises de votre secteur implémentent des systèmes qui :
                </p>
                <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                        <div className="p-1 bg-red-500/10 rounded-lg mt-1"><Zap className="w-4 h-4 text-red-400" /></div>
                        <span className="text-gray-300">Traitent les demandes clients en 10 secondes, 24/7.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <div className="p-1 bg-red-500/10 rounded-lg mt-1"><TrendingUp className="w-4 h-4 text-red-400" /></div>
                        <span className="text-gray-300">Analysent des milliers de données pour prendre de meilleures décisions.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <div className="p-1 bg-red-500/10 rounded-lg mt-1"><Shield className="w-4 h-4 text-red-400" /></div>
                        <span className="text-gray-300">Réduisent leurs coûts opérationnels de 40% sans licencier.</span>
                    </li>
                </ul>
                <div className="p-4 bg-red-900/20 border border-red-500/20 rounded-xl">
                    <p className="text-red-200 text-sm font-semibold">
                        ⚠️ La réalité est brutale : ceux qui n'adoptent pas l'IA maintenant ne seront simplement plus compétitifs dans 24 mois.
                    </p>
                </div>
            </div>

            <div className="relative h-full min-h-[300px] rounded-2xl overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-t from-midnight to-transparent z-10" />
                <img 
                    src="https://images.unsplash.com/photo-1483058712412-4245e9b90334?q=80&w=2070&auto=format&fit=crop" 
                    alt="High speed train motion blur" 
                    className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute bottom-6 left-6 z-20">
                    <p className="text-white font-bold text-xl">Le train quitte la gare.</p>
                    <p className="text-cyan-400">Serez-vous à bord ?</p>
                </div>
            </div>
        </div>
      </section>

      {/* NEW SECTION: Virtual Employees Alliance */}
      <section className="container mx-auto px-6 mb-32">
        <div className="bg-gradient-to-b from-slate-800/50 to-midnight rounded-3xl border border-violet-500/20 p-8 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-grid-white/[0.02] [mask-image:linear-gradient(to_bottom,transparent,black)] pointer-events-none" />
            
            <div className="text-center mb-12 relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
                    <Sparkles className="w-5 h-5 text-cyan-400" />
                    <span className="text-cyan-300 font-bold tracking-wide">L'ALLIANCE PARFAITE</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 font-display">
                    Ne remplacez pas l'humain.<br/>
                    <span className="text-cyan-400">Libérez-le.</span>
                </h2>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                    Vos équipes sont fatiguées parce qu'elles font un travail de robot. 
                    En déléguant les tâches répétitives à des employés virtuels, vous permettez à vos humains de faire ce qu'ils font de mieux.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 relative z-10">
                {/* Human Employee */}
                <div className="bg-slate-900/50 p-8 rounded-2xl border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-32 bg-violet-500/5 rounded-full blur-3xl group-hover:bg-violet-500/10 transition-colors" />
                    <div className="flex items-center gap-4 mb-6 relative z-10">
                        <div className="w-12 h-12 bg-violet-500/20 rounded-full flex items-center justify-center text-violet-300 border border-violet-500/30">
                            <UserCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Vos Talents Humains</h3>
                            <span className="text-xs text-violet-300 font-bold uppercase tracking-wider">Valeur Ajoutée</span>
                        </div>
                    </div>
                    <ul className="space-y-4 relative z-10">
                        <li className="flex flex-col text-gray-300 border-b border-white/5 pb-3">
                            <span className="text-sm text-gray-500 mb-1">Zone de Génie</span>
                            <span className="text-white font-medium flex items-center gap-2">
                                <Heart className="w-4 h-4 text-red-400" /> Empathie, Créativité, Stratégie
                            </span>
                        </li>
                        <li className="flex flex-col text-gray-300 border-b border-white/5 pb-3">
                            <span className="text-sm text-gray-500 mb-1">Problème Actuel</span>
                            <span className="text-white font-medium">Noyés sous l'administratif (70% du temps)</span>
                        </li>
                        <li className="flex flex-col text-gray-300 pt-2">
                            <span className="text-sm text-gray-500 mb-1">Avec SkillShield AI</span>
                            <span className="text-green-400 font-bold">100% focus sur le client & la croissance</span>
                        </li>
                    </ul>
                </div>

                {/* Virtual Employee */}
                <div className="bg-gradient-to-br from-violet-900/30 to-cyan-900/30 p-8 rounded-2xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/10">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center text-cyan-400 border border-cyan-400/30">
                            <Bot className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Leur Binôme Virtuel</h3>
                            <span className="text-xs text-cyan-300 font-bold uppercase tracking-wider">Force de Frappe</span>
                        </div>
                    </div>
                    <ul className="space-y-4">
                        <li className="flex flex-col text-cyan-100 border-b border-cyan-500/20 pb-3">
                            <span className="text-sm text-cyan-500/70 mb-1">Mission</span>
                            <span className="text-white font-medium flex items-center gap-2">
                                <Zap className="w-4 h-4 text-cyan-400" /> Absorber le répétitif & la Data
                            </span>
                        </li>
                        <li className="flex flex-col text-cyan-100 border-b border-cyan-500/20 pb-3">
                            <span className="text-sm text-cyan-500/70 mb-1">Disponibilité</span>
                            <span className="text-white font-medium">24h/24 - 7j/7 (Prépare le travail pour le lendemain)</span>
                        </li>
                        <li className="flex flex-col text-white pt-2">
                            <span className="text-sm text-cyan-500/70 mb-1">Impact</span>
                            <span className="text-cyan-300 font-bold">Supprime la fatigue et les erreurs</span>
                        </li>
                    </ul>
                </div>
            </div>
            
            <div className="mt-12 p-6 bg-white/5 rounded-2xl border border-white/10 text-center relative">
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-midnight border border-white/10 p-2 rounded-full text-cyan-400 shadow-xl">
                    <Heart className="w-6 h-6 fill-current" />
                 </div>
                 <h4 className="text-xl font-bold text-white mb-2 mt-2">Une entreprise plus humaine</h4>
                 <p className="text-gray-400 max-w-2xl mx-auto italic">
                     "Quand l'IA s'occupe des tâches froides (data, planning, tri), vos employés retrouvent le temps d'être chaleureux avec vos clients. 
                     C'est paradoxal, mais <span className="text-white font-semibold">plus de technologie permet plus d'humanité.</span>"
                 </p>
                 <div className="mt-8">
                    <Button onClick={openCalendly} className="animate-pulse">
                        Voir comment soulager mes équipes
                    </Button>
                 </div>
            </div>
        </div>
      </section>

      {/* The Emotional Core / Mission */}
      <section className="container mx-auto px-6 mb-32">
        <div className="max-w-3xl mx-auto text-center">
            <Heart className="w-12 h-12 text-violet-400 mx-auto mb-6 animate-pulse" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 font-display">
                Nous ne sommes pas là pour la technologie.<br/>
                <span className="text-gray-400">Nous sommes là pour votre liberté.</span>
            </h2>
            <div className="text-left space-y-6 text-lg text-gray-300 leading-relaxed bg-white/5 p-8 rounded-3xl border border-white/5">
                <p>
                    Vous n'avez pas monté votre entreprise pour passer vos soirées à faire de la comptabilité, trier des emails ou copier-coller des données Excel.
                </p>
                <p>
                    Vous l'avez fait par passion. Pour créer. Pour construire. Pour être libre.
                </p>
                <p>
                    Pourtant, aujourd'hui, <strong>l'opérationnel vous dévore.</strong>
                </p>
                <p>
                    Chez SkillShield AI, notre mission est simple : utiliser la puissance brute de l'Intelligence Artificielle pour <span className="text-cyan-300 font-bold">vous rendre votre vie.</span>
                </p>
                <p>
                    Nous ne voulons pas remplacer l'humain. Nous voulons débarrasser l'humain des tâches de robot, pour qu'il puisse enfin... être humain.
                </p>
            </div>
        </div>
      </section>

      {/* Team / Authority Section */}
      <section className="container mx-auto px-6 mb-24">
        <div className="flex flex-col gap-24 max-w-5xl mx-auto">
            
            {/* Jérôme Karr - Photo statique */}
            <div className="flex flex-col md:flex-row items-center gap-12">
                <div 
                  className="w-48 h-48 md:w-64 md:h-64 shrink-0 rounded-full border-4 border-violet-500/30 p-2 relative"
                >
                    <div className="w-full h-full rounded-full overflow-hidden bg-slate-800 relative">
                        <img 
                          src={jeromeImgSrc} 
                          alt="Jérôme Karr" 
                          className="w-full h-full object-cover transition-all duration-500" 
                        />
                    </div>
                    <div className="absolute bottom-0 right-0 bg-cyan-500 text-midnight font-bold px-4 py-1 rounded-full text-xs md:text-sm whitespace-nowrap shadow-lg z-10 pointer-events-none">Expert IA depuis 2023</div>
                </div>
                <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl font-bold text-white mb-2">Jérôme Karr</h3>
                    <p className="text-violet-400 font-medium mb-4">Fondateur SkillShield AI</p>
                    <p className="text-gray-400 mb-6 italic relative">
                        <span className="text-4xl text-violet-500/20 absolute -top-4 -left-2">"</span>
                        J'ai vu trop de chefs d'entreprise brillants s'épuiser à la tâche. L'IA est le levier le plus puissant que j'ai jamais vu pour briser ce plafond de verre. Mon obsession ? Que vous rentriez chez vous à 17h, l'esprit léger.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                        <div className="px-4 py-2 bg-white/5 rounded-lg border border-white/10 text-sm text-gray-300">Formation IA depuis 2023</div>
                        <div className="px-4 py-2 bg-white/5 rounded-lg border border-white/10 text-sm text-gray-300">Spécialiste Automatisation</div>
                    </div>
                </div>
            </div>

            {/* Thomas Estevenon - Photo statique */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-12">
                <div 
                    className="w-48 h-48 md:w-64 md:h-64 shrink-0 rounded-full border-4 border-cyan-500/30 p-2 relative"
                >
                    <div className="w-full h-full rounded-full overflow-hidden bg-slate-800 relative">
                        <img 
                            src={thomasImgSrc} 
                            alt="Thomas Estevenon" 
                            className="w-full h-full object-cover transition-all duration-500" 
                        />
                    </div>
                    <div className="absolute bottom-0 left-0 bg-violet-500 text-white font-bold px-4 py-1 rounded-full text-xs md:text-sm whitespace-nowrap shadow-lg z-10 pointer-events-none">Homme de Terrain</div>
                </div>
                <div className="flex-1 text-center md:text-right">
                    <h3 className="text-2xl font-bold text-white mb-2">Thomas Estevenon</h3>
                    <p className="text-cyan-400 font-medium mb-4">Cofondateur & Stratégie Opérationnelle</p>
                    <p className="text-gray-400 mb-6 italic relative">
                        <span className="text-4xl text-cyan-500/20 absolute -top-4 -right-2">"</span>
                        Une idée brillante qui ne s'applique pas concrètement ne vaut rien. Je suis l'homme de terrain : je m'assure que nos solutions collent parfaitement à la réalité de vos équipes. Pas de théorie fumeuse, juste du pragmatisme pour des résultats immédiats.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center md:justify-end">
                        <div className="px-4 py-2 bg-white/5 rounded-lg border border-white/10 text-sm text-gray-300">Pragmatisme</div>
                        <div className="px-4 py-2 bg-white/5 rounded-lg border border-white/10 text-sm text-gray-300">Logique Business</div>
                    </div>
                </div>
            </div>

        </div>
      </section>

      {/* Final Call to Action */}
      <section className="container mx-auto px-6 text-center">
        <div className="bg-gradient-to-r from-violet-900/40 via-cyan-900/40 to-violet-900/40 p-12 rounded-3xl border border-violet-500/20 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
             
             <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 font-display">
                Ne restez pas sur le quai.
             </h2>
             <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Chaque jour sans IA est un jour où vous travaillez plus dur que nécessaire. <br/>
                Prenons 15 minutes. Parlons de VOTRE futur.
             </p>
             
             <div className="flex flex-col md:flex-row justify-center items-center gap-6">
                 <Button onClick={openCalendly} className="shadow-[0_0_50px_-10px_rgba(139,92,246,0.5)]">
                    Réserver mon audit stratégique
                 </Button>
                 <button onClick={onNavigateHome} className="text-gray-400 hover:text-white underline underline-offset-4 decoration-violet-500/50 hover:decoration-violet-500 transition-all">
                    Retour à l'accueil
                 </button>
             </div>
        </div>
      </section>
    </div>
  );
};