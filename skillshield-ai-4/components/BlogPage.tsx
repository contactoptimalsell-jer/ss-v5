import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Clock, FileText, Users, ShieldCheck } from 'lucide-react';
import { Button } from './ui/Button';
import { SEOHead } from './SEOHead';
import { StructuredData } from './StructuredData';

interface BlogArticle {
  id: string;
  title: string;
  description: string;
  slug: string;
  readTime: string;
  date: string;
  category: string;
  keywords: string[];
}

const articles: BlogArticle[] = [
  {
    id: '1',
    title: 'Guide Complet : Implémentation IA pour Entreprises en France',
    description: 'Découvrez comment implémenter l\'intelligence artificielle dans votre entreprise française. Guide pratique avec ROI réel, cas d\'usage concrets et système de gardien humain.',
    slug: 'guide-implementation-ia',
    readTime: '15 min',
    date: '2024-11-15',
    category: 'Guide',
    keywords: ['implémentation IA', 'intelligence artificielle entreprise', 'automatisation IA France']
  },
  {
    id: '2',
    title: 'Comment Choisir un Agent IA sur Mesure pour Votre Entreprise',
    description: 'Tout ce que vous devez savoir pour choisir le bon agent IA : critères, questions à poser, ROI attendu, et pourquoi le système de gardien humain est essentiel.',
    slug: 'choisir-agent-ia',
    readTime: '12 min',
    date: '2024-11-22',
    category: 'Guide',
    keywords: ['agent IA sur mesure', 'choisir agent IA', 'automatisation entreprise']
  },
  {
    id: '3',
    title: 'Automatisation Processus : ROI Réel et Gains de Temps Mesurables',
    description: 'Analyse détaillée du ROI réel de l\'automatisation : données vérifiées, calculs concrets, temps économisé par secteur. Basé sur 20+ implémentations réelles.',
    slug: 'roi-automatisation',
    readTime: '18 min',
    date: '2024-11-28',
    category: 'Étude',
    keywords: ['ROI automatisation', 'gain de temps dirigeant', 'automatisation processus entreprise']
  },
  {
    id: '4',
    title: 'Système Gardien Humain IA : Pourquoi C\'est Unique et Essentiel',
    description: 'Découvrez pourquoi le système de gardien humain révolutionne l\'implémentation IA : qualité garantie, intervention humaine, remboursement 90% si non performant.',
    slug: 'gardien-humain-ia',
    readTime: '10 min',
    date: '2024-12-05',
    category: 'Innovation',
    keywords: ['gardien humain IA', 'système gardien humain', 'IA avec supervision humaine']
  },
  {
    id: '5',
    title: 'IA 2025 : Pourquoi les PME Françaises Accélèrent leur Transformation',
    description: 'Découvrez les nouvelles positives sur l\'IA en 2025 : 78% des PME automatisent déjà, ROI moyen de 300-500%, et gains de productivité mesurables. L\'intelligence artificielle devient accessible à tous.',
    slug: 'ia-2025-pme-transformation',
    readTime: '12 min',
    date: '2025-01-16',
    category: 'Actualité',
    keywords: ['IA 2025', 'transformation IA PME', 'actualités IA', 'productivité IA', 'automatisation 2025']
  },
  {
    id: '6',
    title: 'Comment Identifier les Processus Automatisables avec l\'IA : Guide Étape par Étape',
    description: 'Découvrez comment identifier les processus automatisables dans votre entreprise. Guide pratique avec grille d\'analyse, critères de sélection, et exemples concrets par secteur. Gagnez du temps dès la phase d\'audit.',
    slug: 'comment-identifier-processus-automatisables-ia',
    readTime: '10 min',
    date: '2025-01-20',
    category: 'HowTo',
    keywords: ['processus automatisables', 'identifier tâches IA', 'audit automatisation', 'processus répétitifs']
  },
  {
    id: '7',
    title: 'Comment Mettre en Place un Agent IA pour la Gestion des Emails : Tutoriel Complet',
    description: 'Apprenez à mettre en place un agent IA pour automatiser la gestion de vos emails. Étape par étape : configuration, formation, déploiement. Réduisez votre temps de traitement d\'emails de 8h à 1h par semaine.',
    slug: 'comment-agent-ia-gestion-emails',
    readTime: '14 min',
    date: '2025-01-22',
    category: 'HowTo',
    keywords: ['agent IA emails', 'automatisation emails', 'gestion emails IA', 'tri emails automatique']
  },
  {
    id: '8',
    title: 'Comment Automatiser la Prospection Commerciale avec l\'IA : Guide Pratique',
    description: 'Découvrez comment automatiser votre prospection commerciale avec l\'IA. Qualification de leads, prise de rendez-vous, suivi commercial. Multipliez votre nombre de rendez-vous qualifiés par 3 avec un agent IA sur mesure.',
    slug: 'comment-automatiser-prospection-commerciale-ia',
    readTime: '12 min',
    date: '2025-01-25',
    category: 'HowTo',
    keywords: ['prospection IA', 'qualification leads IA', 'automatisation commercial', 'agent IA SDR']
  },
  {
    id: '9',
    title: 'Comment Mesurer le ROI de l\'Automatisation IA : Formules et Exemples Concrets',
    description: 'Apprenez à calculer le ROI réel de votre automatisation IA. Formules de calcul, métriques à suivre, exemples concrets par secteur. Mesurez l\'impact réel de l\'IA sur votre productivité et vos résultats.',
    slug: 'comment-mesurer-roi-automatisation-ia',
    readTime: '16 min',
    date: '2025-01-28',
    category: 'HowTo',
    keywords: ['ROI automatisation', 'calcul ROI IA', 'mesurer impact IA', 'métriques automatisation']
  },
  {
    id: '10',
    title: 'Comment Sécuriser les Usages IA en Entreprise : Guide RGPD et Conformité',
    description: 'Découvrez comment sécuriser les usages IA dans votre entreprise. Conformité RGPD, gestion des données sensibles, cadre d\'usage sécurisé. Protégez votre entreprise des risques juridiques liés à l\'IA.',
    slug: 'comment-securiser-usages-ia-entreprise-rgpd',
    readTime: '13 min',
    date: '2025-02-01',
    category: 'HowTo',
    keywords: ['IA RGPD', 'sécurité IA entreprise', 'conformité IA', 'données sensibles IA']
  }
];

interface BlogPageProps {
  onNavigateHome: () => void;
  onNavigateToArticle?: (slug: string) => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({ onNavigateHome, onNavigateToArticle }) => {
  return (
    <>
      <SEOHead
        title="Blog - SkillShield AI | Guides et Articles sur l'Implémentation IA"
        description="Articles et guides pratiques sur l'implémentation d'intelligence artificielle pour entreprises. ROI réel, cas d'usage, système de gardien humain."
        keywords="blog IA, guide implémentation IA, articles automatisation, ROI automatisation, gardien humain IA"
        canonicalUrl="https://skillshield.app/blog"
      />
      <StructuredData
        type="WebSite"
        data={{
          name: 'SkillShield AI Blog',
          url: 'https://skillshield.app/blog'
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
              <span className="text-sm font-bold text-violet-300 uppercase tracking-wide">Blog & Ressources</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              Guides et Articles sur l'<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Implémentation IA</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Découvrez nos guides pratiques, études de cas et analyses sur l'automatisation IA pour entreprises françaises.
            </p>
          </motion.div>

          {/* Articles Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {articles.map((article, index) => (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-800/40 rounded-2xl border border-white/5 hover:border-cyan-500/20 transition-all overflow-hidden group"
              >
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-bold">
                      {article.category}
                    </span>
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(article.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>{article.readTime}</span>
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors">
                    {article.title}
                  </h2>

                  <p className="text-gray-300 mb-6 leading-relaxed">
                    {article.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <Button
                      onClick={() => {
                        if (onNavigateToArticle) {
                          onNavigateToArticle(article.slug);
                        } else {
                          window.location.href = `/blog/${article.slug}`;
                        }
                      }}
                      variant="secondary"
                      icon={<ArrowRight className="w-4 h-4" />}
                      className="group-hover:bg-cyan-500/20 group-hover:border-cyan-400/50"
                    >
                      Lire l'article
                    </Button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-violet-900/30 to-cyan-900/30 rounded-2xl p-8 border border-violet-500/30 text-center"
          >
            <h3 className="text-2xl font-bold text-white mb-4">
              Prêt à implémenter l'IA dans votre entreprise ?
            </h3>
            <p className="text-gray-300 mb-6">
              Testez notre diagnostic gratuit et découvrez votre potentiel d'automatisation en 2 minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => {
                  onNavigateHome();
                  setTimeout(() => {
                    document.getElementById('audit-tool')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                icon={<ShieldCheck className="w-5 h-5" />}
              >
                Diagnostic Gratuit
              </Button>
              <Button
                onClick={() => window.open('https://calendly.com/b00784336-essec?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app', '_blank')}
                variant="secondary"
                icon={<Users className="w-5 h-5" />}
              >
                Parler à un expert
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

