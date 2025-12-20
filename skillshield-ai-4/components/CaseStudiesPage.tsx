import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Clock, DollarSign, Users, CheckCircle, ArrowRight, Building2, ShoppingCart, Heart, Briefcase } from 'lucide-react';
import { Button } from './ui/Button';
import { SEOHead } from './SEOHead';
import { StructuredData } from './StructuredData';

interface CaseStudy {
  id: string;
  title: string;
  company: string;
  sector: string;
  icon: React.ReactNode;
  challenge: string;
  solution: string;
  results: {
    timeSaved: string;
    roi: string;
    processesAutomated: number;
    satisfaction: string;
  };
  testimonial?: {
    quote: string;
    author: string;
    role: string;
  };
}

const caseStudies: CaseStudy[] = [
  {
    id: '1',
    title: 'Automatisation de la Gestion des Demandes Immobilières',
    company: 'Agence Immobilière Premium',
    sector: 'Immobilier',
    icon: <Building2 className="w-8 h-8" />,
    challenge: "L'agence recevait 50+ demandes quotidiennes via SeLoger et Leboncoin. L'équipe passait 4h/jour à trier, qualifier et répondre aux demandes. 70% des leads n'étaient pas qualifiés (budget insuffisant, localisation non adaptée).",
    solution: "Implémentation d'un Agent IA de qualification et prise de rendez-vous. L'agent analyse automatiquement chaque demande, vérifie le budget, la localisation souhaitée, et prend rendez-vous uniquement pour les dossiers solvables. Système de gardien humain pour validation finale.",
    results: {
      timeSaved: '15h / semaine',
      roi: '320%',
      processesAutomated: 3,
      satisfaction: '95%'
    },
    testimonial: {
      quote: "On a retrouvé notre vie. L'agent IA gère 80% des demandes, et on ne reçoit que les vrais clients. On a doublé nos ventes en 3 mois.",
      author: 'Marie D.',
      role: 'Directrice Agence'
    }
  },
  {
    id: '2',
    title: 'Service Client 24/7 pour E-commerce',
    company: 'Boutique Mode en Ligne',
    sector: 'E-commerce',
    icon: <ShoppingCart className="w-8 h-8" />,
    challenge: "L'équipe support était submergée par 200+ tickets quotidiens (suivi commande, factures, retours). Réponse moyenne : 8h. Taux de satisfaction client : 65%. L'équipe était épuisée.",
    solution: "Déploiement d'un Agent IA Gardien du Service Client. L'agent répond instantanément aux questions courantes, gère les suivis de commande, génère les factures, et traite les demandes de retour. Escalade automatique vers l'humain pour cas complexes.",
    results: {
      timeSaved: '18h / semaine',
      roi: '450%',
      processesAutomated: 5,
      satisfaction: '92%'
    },
    testimonial: {
      quote: "80% des tickets sont gérés automatiquement. L'équipe ne traite plus que les vrais problèmes. Les clients sont ravis, et nous aussi !",
      author: 'Thomas L.',
      role: 'Fondateur'
    }
  },
  {
    id: '3',
    title: 'Automatisation Administrative Cabinet Médical',
    company: 'Cabinet Médical Multidisciplinaire',
    sector: 'Santé',
    icon: <Heart className="w-8 h-8" />,
    challenge: "Le secrétariat passait 3h/jour à gérer les rendez-vous, rappels, ordonnances, et dossiers patients. Erreurs fréquentes dans les plannings. Patients insatisfaits des délais de réponse.",
    solution: "Agent IA Officier Administratif spécialisé santé. Gestion automatique des rendez-vous, rappels SMS/email, génération d'ordonnances types, organisation des dossiers patients. Conforme RGPD et normes médicales.",
    results: {
      timeSaved: '12h / semaine',
      roi: '280%',
      processesAutomated: 4,
      satisfaction: '98%'
    },
    testimonial: {
      quote: "On a libéré 12h par semaine. Les médecins peuvent se concentrer sur leurs patients. L'agent gère tout le côté administratif parfaitement.",
      author: 'Dr. Sophie M.',
      role: 'Médecin Généraliste'
    }
  },
  {
    id: '4',
    title: 'Prospection Automatisée Cabinet de Conseil',
    company: 'Cabinet de Conseil Stratégique',
    sector: 'Services',
    icon: <Briefcase className="w-8 h-8" />,
    challenge: "L'équipe commerciale passait 6h/jour à prospecter, qualifier les leads, et prendre rendez-vous. Taux de conversion faible (5%). Beaucoup de temps perdu sur des prospects non qualifiés.",
    solution: "Agent IA Assistant Commercial (SDR). Prospection automatisée, qualification intelligente des leads (budget, urgence, décisionnaire), prise de rendez-vous automatique. Intégration CRM pour suivi.",
    results: {
      timeSaved: '20h / semaine',
      roi: '520%',
      processesAutomated: 6,
      satisfaction: '90%'
    },
    testimonial: {
      quote: "On a multiplié par 3 le nombre de rendez-vous qualifiés. L'agent IA fait le tri, et on ne rencontre que les vrais prospects. ROI exceptionnel.",
      author: 'Pierre R.',
      role: 'Directeur Commercial'
    }
  }
];

export const CaseStudiesPage: React.FC<{ onNavigateHome: () => void }> = ({ onNavigateHome }) => {
  return (
    <>
      <SEOHead
        title="Études de Cas - SkillShield AI | Résultats Réels d'Implémentation IA"
        description="Découvrez les résultats concrets de nos clients : ROI réel, temps économisé, processus automatisés. Études de cas détaillées par secteur (immobilier, e-commerce, santé, services)."
        keywords="études de cas IA, résultats automatisation, ROI automatisation, cas clients IA, témoignages clients, automatisation entreprise"
        canonicalUrl="https://skillshield.app/case-studies"
      />
      <StructuredData
        type="WebSite"
        data={{
          name: 'SkillShield AI - Études de Cas',
          url: 'https://skillshield.app/case-studies'
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-bold text-cyan-300 uppercase tracking-wide">Résultats Réels</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              Études de Cas : <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Résultats Concrets</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Découvrez comment nos clients ont transformé leur entreprise avec l'IA. ROI réel, temps économisé, processus automatisés.
            </p>
          </motion.div>

          {/* Case Studies Grid */}
          <div className="space-y-12 mb-16">
            {caseStudies.map((study, index) => (
              <motion.article
                key={study.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-800/40 rounded-2xl border border-white/5 hover:border-cyan-500/20 transition-all overflow-hidden"
              >
                <div className="p-8 md:p-12">
                  {/* Header */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-violet-500/30">
                      {study.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-bold">
                          {study.sector}
                        </span>
                        <span className="text-gray-400 text-sm">{study.company}</span>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                        {study.title}
                      </h2>
                    </div>
                  </div>

                  {/* Challenge & Solution */}
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6">
                      <h3 className="text-red-400 font-bold mb-3 flex items-center gap-2">
                        <span>❌</span> Défi
                      </h3>
                      <p className="text-gray-300 leading-relaxed">{study.challenge}</p>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6">
                      <h3 className="text-green-400 font-bold mb-3 flex items-center gap-2">
                        <span>✅</span> Solution
                      </h3>
                      <p className="text-gray-300 leading-relaxed">{study.solution}</p>
                    </div>
                  </div>

                  {/* Results */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-slate-700/40 rounded-xl p-5 border border-white/5">
                      <Clock className="w-6 h-6 text-cyan-400 mb-2" />
                      <div className="text-2xl font-bold text-white mb-1">{study.results.timeSaved}</div>
                      <div className="text-xs text-gray-400">Temps économisé</div>
                    </div>
                    <div className="bg-slate-700/40 rounded-xl p-5 border border-white/5">
                      <TrendingUp className="w-6 h-6 text-green-400 mb-2" />
                      <div className="text-2xl font-bold text-white mb-1">{study.results.roi}</div>
                      <div className="text-xs text-gray-400">ROI annuel</div>
                    </div>
                    <div className="bg-slate-700/40 rounded-xl p-5 border border-white/5">
                      <CheckCircle className="w-6 h-6 text-violet-400 mb-2" />
                      <div className="text-2xl font-bold text-white mb-1">{study.results.processesAutomated}</div>
                      <div className="text-xs text-gray-400">Processus automatisés</div>
                    </div>
                    <div className="bg-slate-700/40 rounded-xl p-5 border border-white/5">
                      <Users className="w-6 h-6 text-orange-400 mb-2" />
                      <div className="text-2xl font-bold text-white mb-1">{study.results.satisfaction}</div>
                      <div className="text-xs text-gray-400">Satisfaction</div>
                    </div>
                  </div>

                  {/* Testimonial */}
                  {study.testimonial && (
                    <div className="bg-gradient-to-r from-violet-500/10 to-cyan-500/10 rounded-xl p-6 border border-violet-500/20">
                      <p className="text-white italic mb-3">"{study.testimonial.quote}"</p>
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                          {study.testimonial.author.charAt(0)}
                        </div>
                        <div>
                          <div className="text-white font-semibold">{study.testimonial.author}</div>
                          <div className="text-gray-400 text-sm">{study.testimonial.role}</div>
                        </div>
                      </div>
                    </div>
                  )}
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
              Prêt à obtenir des résultats similaires ?
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
                icon={<TrendingUp className="w-5 h-5" />}
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

