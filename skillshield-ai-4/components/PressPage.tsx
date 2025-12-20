import React from 'react';
import { motion } from 'framer-motion';
import { Mail, FileText, Download, Calendar, Users, ShieldCheck, ArrowRight, ExternalLink, Newspaper, Mic, Video } from 'lucide-react';
import { Button } from './ui/Button';
import { SEOHead } from './SEOHead';
import { StructuredData } from './StructuredData';

interface MediaContact {
  name: string;
  description: string;
  icon: React.ReactNode;
}

const mediaContacts: MediaContact[] = [
  {
    name: 'TechCrunch France',
    description: 'Média tech de référence pour les startups et l\'innovation',
    icon: <Newspaper className="w-5 h-5" />
  },
  {
    name: 'Les Echos Tech',
    description: 'Actualité tech et innovation pour les entreprises',
    icon: <Newspaper className="w-5 h-5" />
  },
  {
    name: 'Maddyness',
    description: 'Média dédié aux startups et à l\'entrepreneuriat français',
    icon: <Newspaper className="w-5 h-5" />
  },
  {
    name: 'FrenchWeb',
    description: 'Actualité du digital et de la transformation numérique',
    icon: <Newspaper className="w-5 h-5" />
  },
  {
    name: 'Journal du Net',
    description: 'Référence pour les professionnels du digital',
    icon: <Newspaper className="w-5 h-5" />
  },
  {
    name: 'Le Monde Informatique',
    description: 'Actualité IT et solutions d\'entreprise',
    icon: <Newspaper className="w-5 h-5" />
  }
];

export const PressPage: React.FC<{ onNavigateHome: () => void }> = ({ onNavigateHome }) => {
  return (
    <>
      <SEOHead
        title="Kit Presse - SkillShield AI | Ressources pour Journalistes"
        description="Kit presse SkillShield AI : communiqués, ressources, contacts. Découvrez notre innovation unique : système de gardien humain et garantie remboursement 90%."
        keywords="kit presse SkillShield, contact presse, communiqué de presse, ressources médias, presse tech France"
        canonicalUrl="https://skillshield.app/press"
      />
      <StructuredData
        type="WebSite"
        data={{
          name: 'SkillShield AI - Kit Presse',
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
              <FileText className="w-4 h-4 text-violet-400" />
              <span className="text-sm font-bold text-violet-300 uppercase tracking-wide">Kit Presse</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              Ressources pour <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Journalistes & Médias</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Découvrez SkillShield AI : l'agence française qui révolutionne l'implémentation IA avec son système de gardien humain unique.
            </p>
          </motion.div>

          {/* About Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/40 rounded-2xl border border-white/5 p-8 md:p-12 mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-6">À propos de SkillShield AI</h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                <strong className="text-white">SkillShield AI</strong> est une agence française spécialisée dans l'implémentation d'intelligence artificielle pour les entreprises. Fondée en 2024, nous accompagnons les PME et ETI dans leur transformation digitale avec une approche unique.
              </p>
              <p>
                <strong className="text-white">Notre innovation :</strong> Le système de gardien humain qui garantit la qualité de l'automatisation IA. Contrairement aux solutions d'IA "pures", notre approche combine l'efficacité de l'IA avec la supervision humaine pour garantir des résultats de qualité.
              </p>
              <p>
                <strong className="text-white">Notre engagement :</strong> Nous proposons un remboursement de 90% si l'IA ne génère pas les résultats promis dans les 3 premiers mois. C'est notre garantie de résultat unique sur le marché français.
              </p>
              <p>
                <strong className="text-white">Nos résultats :</strong> Nous avons accompagné plus de 20 entreprises françaises, générant en moyenne 10-20 heures de temps économisé par semaine et un ROI de 300-520% sur 12 mois.
              </p>
            </div>
          </motion.div>

          {/* Key Facts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid md:grid-cols-3 gap-6 mb-12"
          >
            <div className="bg-gradient-to-br from-violet-900/30 to-cyan-900/30 rounded-2xl p-6 border border-violet-500/30">
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="w-8 h-8 text-cyan-400" />
                <h3 className="text-xl font-bold text-white">Garantie Unique</h3>
              </div>
              <p className="text-gray-300">
                Remboursement 90% si l'IA ne performe pas dans les 3 premiers mois. Première agence IA française à proposer cette garantie.
              </p>
            </div>
            <div className="bg-gradient-to-br from-violet-900/30 to-cyan-900/30 rounded-2xl p-6 border border-violet-500/30">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-8 h-8 text-cyan-400" />
                <h3 className="text-xl font-bold text-white">Système Gardien Humain</h3>
              </div>
              <p className="text-gray-300">
                Supervision humaine en temps réel qui garantit la qualité, intervient sur les cas complexes et améliore l'IA continuellement.
              </p>
            </div>
            <div className="bg-gradient-to-br from-violet-900/30 to-cyan-900/30 rounded-2xl p-6 border border-violet-500/30">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-8 h-8 text-cyan-400" />
                <h3 className="text-xl font-bold text-white">ROI Mesurable</h3>
              </div>
              <p className="text-gray-300">
                ROI moyen de 300-520% sur 12 mois, avec 10-20 heures économisées par semaine pour les dirigeants.
              </p>
            </div>
          </motion.div>

          {/* Press Kit Resources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-800/40 rounded-2xl border border-white/5 p-8 mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-6">Ressources Presse</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-slate-700/40 rounded-xl border border-white/5">
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="w-6 h-6 text-cyan-400" />
                  <h3 className="text-xl font-bold text-white">Communiqué de Presse</h3>
                </div>
                <p className="text-gray-300 mb-4">
                  Communiqué de presse détaillé sur SkillShield AI, son innovation et ses résultats.
                </p>
                <Button
                  onClick={() => window.open('mailto:contact@skillshield-ai.com?subject=Demande%20Kit%20Presse', '_blank')}
                  variant="secondary"
                  icon={<Download className="w-4 h-4" />}
                >
                  Télécharger
                </Button>
              </div>
              <div className="p-6 bg-slate-700/40 rounded-xl border border-white/5">
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="w-6 h-6 text-cyan-400" />
                  <h3 className="text-xl font-bold text-white">Dossier de Presse</h3>
                </div>
                <p className="text-gray-300 mb-4">
                  Dossier complet avec photos, logos, chiffres clés et témoignages clients.
                </p>
                <Button
                  onClick={() => window.open('mailto:contact@skillshield-ai.com?subject=Demande%20Dossier%20Presse', '_blank')}
                  variant="secondary"
                  icon={<Download className="w-4 h-4" />}
                >
                  Télécharger
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Media Contacts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-800/40 rounded-2xl border border-white/5 p-8 mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-6">Médias Tech Français</h2>
            <p className="text-gray-300 mb-6">
              SkillShield AI est disponible pour des interviews, témoignages clients, démos de technologie, ou articles sur l'implémentation IA en France.
            </p>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {mediaContacts.map((media, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-slate-700/40 rounded-xl border border-white/5">
                  <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 shrink-0">
                    {media.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-1">{media.name}</h3>
                    <p className="text-sm text-gray-400">{media.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-gray-400 text-sm italic">
              * Ces médias sont des contacts potentiels pour des articles futurs. Contactez-nous si vous souhaitez organiser une interview ou un article.
            </p>
          </motion.div>

          {/* Actualités Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-violet-900/30 to-cyan-900/30 rounded-2xl border border-violet-500/30 p-8 mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-6">Actualités</h2>
            <div className="space-y-6">
              <div className="p-6 bg-slate-800/40 rounded-xl border border-white/5">
                <div className="flex items-center gap-3 mb-3">
                  <Calendar className="w-5 h-5 text-cyan-400" />
                  <span className="text-sm text-gray-400">Décembre 2024</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Lancement de SkillShield AI</h3>
                <p className="text-gray-300">
                  SkillShield AI lance son service d'implémentation IA avec système de gardien humain et garantie remboursement 90%. Première agence française à proposer cette approche unique.
                </p>
              </div>
              <div className="p-6 bg-slate-800/40 rounded-xl border border-white/5">
                <div className="flex items-center gap-3 mb-3">
                  <Users className="w-5 h-5 text-cyan-400" />
                  <span className="text-sm text-gray-400">Novembre 2024</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Premiers Clients & Résultats</h3>
                <p className="text-gray-300">
                  SkillShield AI accompagne ses premiers clients avec des résultats mesurables : 10-20 heures économisées par semaine, ROI moyen de 300-520% sur 12 mois.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-violet-900/30 to-cyan-900/30 rounded-2xl p-8 border border-violet-500/30 text-center"
          >
            <h3 className="text-2xl font-bold text-white mb-4">
              Vous êtes journaliste ou média ?
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Contactez-nous pour une interview, un témoignage client, une démo de notre technologie, ou pour recevoir notre kit presse complet.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => window.open('mailto:contact@skillshield-ai.com?subject=Demande%20Presse', '_blank')}
                icon={<Mail className="w-5 h-5" />}
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
                icon={<ArrowRight className="w-5 h-5" />}
              >
                Découvrir SkillShield
              </Button>
            </div>
            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-gray-400 text-sm">
                <strong className="text-white">Contact Presse :</strong> contact@skillshield-ai.com
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};
