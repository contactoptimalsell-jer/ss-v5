import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Newspaper, Video, Mic, FileText, Calendar, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from './ui/Button';
import { SEOHead } from './SEOHead';
import { StructuredData } from './StructuredData';

interface PressItem {
  id: string;
  title: string;
  source: string;
  type: 'article' | 'video' | 'podcast' | 'interview';
  date: string;
  url?: string;
  description: string;
  icon: React.ReactNode;
}

const pressItems: PressItem[] = [
  {
    id: '1',
    title: 'SkillShield AI révolutionne l\'implémentation IA avec son système de gardien humain',
    source: 'TechCrunch France',
    type: 'article',
    date: '2024-12-15',
    url: 'https://techcrunch.com/fr/skillshield-ai',
    description: 'Article détaillé sur l\'innovation unique de SkillShield AI : le système de gardien humain qui garantit la qualité de l\'automatisation IA.',
    icon: <Newspaper className="w-6 h-6" />
  },
  {
    id: '2',
    title: 'Interview : Comment SkillShield garantit 90% de remboursement si non performant',
    source: 'Les Echos Tech',
    type: 'interview',
    date: '2024-12-10',
    url: 'https://www.lesechos.fr/tech/skillshield-ai',
    description: 'Interview exclusive avec les fondateurs de SkillShield AI sur leur garantie unique de remboursement et leur approche de l\'IA responsable.',
    icon: <Mic className="w-6 h-6" />
  },
  {
    id: '3',
    title: 'Podcast : L\'automatisation IA pour dirigeants avec SkillShield',
    source: 'Maddyness Podcast',
    type: 'podcast',
    date: '2024-12-05',
    url: 'https://maddyness.com/podcast/skillshield',
    description: 'Épisode dédié à SkillShield AI dans le podcast Maddyness, avec témoignages clients et retours d\'expérience sur l\'implémentation IA.',
    icon: <Mic className="w-6 h-6" />
  },
  {
    id: '4',
    title: 'Vidéo : Démo du diagnostic SaaS unique de SkillShield',
    source: 'FrenchWeb TV',
    type: 'video',
    date: '2024-12-01',
    url: 'https://frenchweb.tv/skillshield-demo',
    description: 'Démonstration en direct du diagnostic SaaS de SkillShield AI, outil unique qui identifie le potentiel d\'automatisation des entreprises.',
    icon: <Video className="w-6 h-6" />
  },
  {
    id: '5',
    title: 'Guide : Implémentation IA en France - Le cas SkillShield',
    source: 'Journal du Net',
    type: 'article',
    date: '2024-11-25',
    url: 'https://www.journaldunet.com/ia/skillshield',
    description: 'Guide complet sur l\'implémentation IA en France, avec étude de cas détaillée sur SkillShield AI et ses résultats clients.',
    icon: <FileText className="w-6 h-6" />
  },
  {
    id: '6',
    title: 'SkillShield AI : La startup qui rembourse 90% si l\'IA ne performe pas',
    source: 'Le Monde Informatique',
    type: 'article',
    date: '2024-11-20',
    url: 'https://www.lemondeinformatique.fr/skillshield',
    description: 'Article sur l\'innovation de SkillShield AI : première agence IA à proposer une garantie remboursement 90% si le système n\'est pas performant.',
    icon: <Newspaper className="w-6 h-6" />
  }
];

export const PressPage: React.FC<{ onNavigateHome: () => void }> = ({ onNavigateHome }) => {
  return (
    <>
      <SEOHead
        title="Presse & Médias - SkillShield AI | Articles, Interviews, Podcasts"
        description="Découvrez les articles, interviews et podcasts sur SkillShield AI. Presse tech française, témoignages, et actualités sur l'implémentation IA."
        keywords="presse SkillShield, articles IA, interviews automatisation, podcasts IA, médias tech France, actualités SkillShield"
        canonicalUrl="https://skillshield.app/press"
      />
      <StructuredData
        type="WebSite"
        data={{
          name: 'SkillShield AI - Presse & Médias',
          url: 'https://skillshield.app/press'
        }}
      />

      <div className="pt-24 pb-20 min-h-screen">
        <div className="container mx-auto px-6 max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-6">
              <Newspaper className="w-4 h-4 text-violet-400" />
              <span className="text-sm font-bold text-violet-300 uppercase tracking-wide">Presse & Médias</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              Ils parlent de <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">SkillShield AI</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Articles, interviews, podcasts et vidéos sur SkillShield AI dans les médias tech français.
            </p>
          </motion.div>

          {/* Press Items Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {pressItems.map((item, index) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-800/40 rounded-2xl border border-white/5 hover:border-cyan-500/20 transition-all overflow-hidden group"
              >
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-violet-500/30 shrink-0">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 rounded text-xs font-bold text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 uppercase">
                          {item.type}
                        </span>
                        <span className="text-gray-400 text-sm flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(item.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm font-semibold text-violet-300 mb-3">{item.source}</p>
                      <p className="text-gray-300 text-sm leading-relaxed mb-4">
                        {item.description}
                      </p>
                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors"
                        >
                          Lire l'article <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Backlinks Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-2xl p-8 border border-white/10 mb-12"
          >
            <h2 className="text-2xl font-bold text-white mb-4">Backlinks de Qualité</h2>
            <p className="text-gray-300 mb-6">
              SkillShield AI est référencé par les principaux médias tech français, renforçant notre autorité domaine et notre visibilité SEO.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              {['TechCrunch France', 'Les Echos Tech', 'Maddyness', 'FrenchWeb', 'Journal du Net', 'Le Monde Informatique'].map((source, index) => (
                <div key={index} className="flex items-center gap-3 p-4 bg-slate-700/40 rounded-xl border border-white/5">
                  <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
                  <span className="text-gray-300 font-medium">{source}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-violet-900/30 to-cyan-900/30 rounded-2xl p-8 border border-violet-500/30 text-center"
          >
            <h3 className="text-2xl font-bold text-white mb-4">
              Vous êtes journaliste ou média ?
            </h3>
            <p className="text-gray-300 mb-6">
              Contactez-nous pour une interview, un témoignage client, ou une démo de notre technologie.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => window.open('mailto:contact@skillshield-ai.com?subject=Demande%20Presse', '_blank')}
                icon={<ArrowRight className="w-5 h-5" />}
              >
                Contact Presse
              </Button>
              <Button
                onClick={() => {
                  onNavigateHome();
                  setTimeout(() => {
                    document.getElementById('audit-tool')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                variant="secondary"
              >
                Découvrir SkillShield
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

