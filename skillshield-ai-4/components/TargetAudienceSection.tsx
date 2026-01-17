import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Building2, Users, Target, AlertTriangle } from 'lucide-react';
import { Card } from './ui/Card';
import { useLanguage } from '../contexts/LanguageContext';

export const TargetAudienceSection: React.FC = () => {
  const { t } = useLanguage();
  const forWho = [
    {
      icon: Building2,
      text: t.targetAudience.forWho1
    },
    {
      icon: Users,
      text: t.targetAudience.forWho2
    },
    {
      icon: Target,
      text: t.targetAudience.forWho3
    },
    {
      icon: CheckCircle2,
      text: t.targetAudience.forWho4
    },
    {
      icon: CheckCircle2,
      text: t.targetAudience.forWho5
    }
  ];

  const notForWho = [
    {
      icon: XCircle,
      text: t.targetAudience.notForWho1
    },
    {
      icon: XCircle,
      text: t.targetAudience.notForWho2
    },
    {
      icon: XCircle,
      text: t.targetAudience.notForWho3
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-cyan-950">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-orange-600/10 rounded-full mix-blend-screen filter blur-[120px] animate-blob" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-violet-500/10 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold font-display text-white mb-6">
            {t.targetAudience.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-violet-400">{t.targetAudience.titleSlash}</span> {t.targetAudience.titleNot}
          </h2>
          
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            {t.targetAudience.subtitle}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Pour qui */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-green-500/10 border-green-500/30 h-full">
              <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">{t.targetAudience.forWho}</h3>
                </div>
                
                <div className="space-y-4">
                  {forWho.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <div key={index} className="flex items-start gap-3">
                        <Icon className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                        <span className="text-gray-300">{item.text}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Pour qui pas */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-red-500/10 border-red-500/30 h-full">
              <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center">
                    <XCircle className="w-6 h-6 text-red-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">{t.targetAudience.notForWho}</h3>
                </div>
                
                <div className="space-y-4">
                  {notForWho.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <div key={index} className="flex items-start gap-3">
                        <Icon className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                        <span className="text-gray-300">{item.text}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Bottom Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <div className="max-w-3xl mx-auto bg-slate-800/50 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
            <p className="text-gray-300">
              <span className="font-bold text-white">{t.targetAudience.bottomNote}</span> {t.targetAudience.bottomNoteText}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

