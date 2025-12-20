import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/Button';
import { Sparkles, ArrowRight, Lightbulb, Mail, ShieldCheck, TrendingUp, Clock, CheckCircle2 } from 'lucide-react';
import { SectionId } from '../types';

export const Hero: React.FC = () => {
  const openCalendly = () => {
    window.open('https://calendly.com/b00784336-essec?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app', '_blank');
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob" />
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000" />
      <div className="absolute -bottom-32 left-1/3 w-[600px] h-[600px] bg-blue-500/10 rounded-full mix-blend-screen filter blur-[120px] animate-blob animation-delay-4000" />

      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-6 backdrop-blur-sm"
        >
          <ShieldCheck className="w-4 h-4 text-violet-400" />
          <span className="text-sm font-bold text-violet-300 tracking-wide uppercase">Garantie Résultat • Remboursé à 90%</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-display font-bold text-4xl md:text-6xl lg:text-7xl tracking-tight mb-6"
        >
          <span className="text-white">Implémentation IA</span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-cyan-300 to-violet-400">
            avec Gardien Humain
          </span>
          <span className="text-2xl md:text-3xl lg:text-4xl font-normal text-gray-300 block mt-3 font-sans">
            Remboursement 90% si non performant • France
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-2xl mx-auto text-lg md:text-xl text-gray-300 leading-relaxed mb-8 font-medium"
        >
          SkillShield AI : l'agence française d'implémentation d'intelligence artificielle pour entreprises. Notre système de gardien humain unique garantit la performance. Diagnostic SaaS gratuit. Restaurez 10-20h/semaine aux dirigeants.
          Nos agents IA travaillent 24/7 pour vous libérer des tâches chronophages.<br/>
          <span className="text-cyan-300">ROI moyen : 250-450% dès la première année.</span> Données vérifiées.
        </motion.p>

        {/* Chiffres de preuve sociale */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mb-10"
        >
          <div className="bg-slate-800/40 rounded-xl p-4 border border-white/5">
            <div className="text-2xl md:text-3xl font-bold text-white mb-1">20+</div>
            <div className="text-xs text-gray-400">Dirigeants libérés</div>
          </div>
          <div className="bg-slate-800/40 rounded-xl p-4 border border-white/5">
            <div className="text-2xl md:text-3xl font-bold text-cyan-400 mb-1">15h</div>
            <div className="text-xs text-gray-400">Temps gagné/semaine</div>
          </div>
          <div className="bg-slate-800/40 rounded-xl p-4 border border-white/5">
            <div className="text-2xl md:text-3xl font-bold text-violet-400 mb-1">90%</div>
            <div className="text-xs text-gray-400">Garantie remboursement</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col items-center justify-center gap-6"
        >
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <Button 
              onClick={() => document.getElementById(SectionId.AUDIT_TOOL)?.scrollIntoView({ behavior: 'smooth' })} 
              icon={<Sparkles className="w-5 h-5"/>} 
              className="shadow-violet-500/20 hover:shadow-violet-500/40 border border-white/10 text-lg px-8 py-4"
            >
              Découvrir ce que je peux automatiser (Gratuit)
            </Button>
            <Button 
              variant="secondary" 
              onClick={openCalendly} 
              icon={<ArrowRight className="w-5 h-5"/>}
              className="text-lg px-8 py-4"
            >
              Parler à un expert (15 min)
            </Button>
          </div>
          
          {/* Garantie et transparence */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-wrap items-center justify-center gap-6 text-sm"
          >
            <div className="flex items-center gap-2 text-cyan-300">
              <CheckCircle2 className="w-4 h-4" />
              <span>Test gratuit • Sans engagement</span>
            </div>
            <div className="flex items-center gap-2 text-violet-300">
              <ShieldCheck className="w-4 h-4" />
              <span>Garantie résultat • Remboursé à 90%</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Clock className="w-4 h-4" />
              <span>Réponse sous 24h</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Call to action vers le test */}
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 1, duration: 0.8 }}
           className="mt-12"
        >
          <button
            onClick={() => document.getElementById(SectionId.AUDIT_TOOL)?.scrollIntoView({ behavior: 'smooth' })}
            className="group flex items-center gap-2 text-gray-400 hover:text-cyan-300 transition-colors text-sm font-medium"
          >
            <span>Ou testez directement en bas de page</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};