import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, ChevronDown, ShieldCheck, Clock, Zap, Users, CheckCircle } from 'lucide-react';
import { Button } from './ui/Button';
import { SEOHead } from './SEOHead';
import { StructuredData } from './StructuredData';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "Qu'est-ce que SkillShield AI et comment fonctionne l'implémentation d'IA ?",
    answer: "SkillShield AI est une agence française spécialisée dans l'implémentation d'intelligence artificielle pour les entreprises. Nous créons des agents IA sur mesure qui automatisent vos tâches répétitives, avec un système de gardien humain qui supervise et intervient si nécessaire. Notre diagnostic SaaS unique identifie précisément vos besoins et vous permet de restaurer 10-20h par semaine."
  },
  {
    question: "Comment fonctionne le système de gardien humain ?",
    answer: "Notre système de gardien humain est une innovation unique : chaque agent IA est supervisé par un expert humain qui vérifie la qualité, intervient en cas de problème complexe, et garantit que l'automatisation fonctionne comme prévu. Cette présence humaine assure la fiabilité et la performance du système."
  },
  {
    question: "Qu'est-ce que la garantie remboursement à 90% ?",
    answer: "Si le système d'IA que nous implémentons n'est pas performant ou ne répond pas à vos attentes, nous vous remboursons 90% de votre investissement. Cette garantie unique dans le secteur prouve notre confiance en notre capacité à créer de la valeur réelle pour votre entreprise."
  },
  {
    question: "Combien de temps puis-je gagner avec l'automatisation IA ?",
    answer: "Nos clients gagnent en moyenne 10-20h par semaine. Notre diagnostic SaaS identifie précisément les tâches automatisables dans votre entreprise et calcule le temps que vous pourrez restaurer pour vous concentrer sur ce qui est vraiment important."
  },
  {
    question: "Qu'est-ce que le diagnostic SaaS unique de SkillShield ?",
    answer: "Notre diagnostic SaaS est un outil unique qui analyse votre entreprise, identifie les processus automatisables, calcule le ROI potentiel, et vous propose un plan d'action personnalisé. C'est gratuit, sans engagement, et vous donne une vision claire de votre potentiel d'automatisation."
  },
  {
    question: "Pourquoi SkillShield est différent des autres agences IA ?",
    answer: "SkillShield se distingue par 3 éléments uniques : 1) Le système de gardien humain qui assure la qualité, 2) La garantie remboursement 90% si non performant, 3) Le diagnostic SaaS unique qui identifie précisément vos besoins. Nous ne facturons que si nous créons de la valeur réelle."
  },
  {
    question: "Quels types d'entreprises peuvent bénéficier de SkillShield ?",
    answer: "Toutes les entreprises françaises, quelle que soit leur taille ou leur secteur, peuvent bénéficier de nos services. Nous avons déjà aidé des entreprises dans l'immobilier, l'e-commerce, la santé, la restauration, les services, la finance, l'éducation, le transport, le BTP, l'industrie et bien d'autres."
  },
  {
    question: "Combien coûte l'implémentation d'un agent IA ?",
    answer: "Le coût dépend de la complexité de l'automatisation. Notre diagnostic gratuit vous donne une estimation précise. Avec notre garantie remboursement 90%, vous investissez en toute sécurité. Le ROI moyen de nos clients est de 250-600% dès la première année."
  },
  {
    question: "Combien de temps prend l'implémentation d'un agent IA ?",
    answer: "L'implémentation varie selon la complexité : de 2-4 semaines pour une automatisation simple à 2-3 mois pour un système complexe. Notre diagnostic vous donne un délai précis selon vos besoins spécifiques."
  },
  {
    question: "Comment puis-je tester SkillShield avant de m'engager ?",
    answer: "Vous pouvez tester notre diagnostic SaaS gratuitement en quelques minutes sur notre site. Il vous donne une analyse complète de votre potentiel d'automatisation, des solutions IA adaptées, et un plan d'action détaillé. Aucun engagement requis."
  }
];

export const FAQPage: React.FC<{ onNavigateHome: () => void }> = ({ onNavigateHome }) => {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Préparer les données structurées pour Schema.org
  const faqStructuredData = {
    faqs: faqs.map((faq, index) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };

  return (
    <>
      <SEOHead
        title="FAQ - SkillShield AI | Questions fréquentes sur l'implémentation IA"
        description="Réponses aux questions fréquentes sur SkillShield AI : système de gardien humain, garantie remboursement 90%, diagnostic SaaS, automatisation IA pour entreprises françaises."
        keywords="FAQ SkillShield, questions implémentation IA, gardien humain IA, remboursement 90%, diagnostic IA SaaS, automatisation entreprise"
        canonicalUrl="https://skillshield.app/faq"
      />
      <StructuredData type="FAQPage" data={faqStructuredData} />
      
      <div className="pt-24 pb-20 min-h-screen">
        <div className="container mx-auto px-6 max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-bold text-cyan-300 uppercase tracking-wide">Questions Fréquentes</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              Tout savoir sur <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">SkillShield AI</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Réponses aux questions les plus fréquentes sur notre système de gardien humain, notre garantie remboursement 90%, et notre diagnostic SaaS unique.
            </p>
          </motion.div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-800/40 rounded-2xl border border-white/5 overflow-hidden hover:border-cyan-500/20 transition-colors"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left group"
                >
                  <h3 className="text-lg font-bold text-white pr-4 group-hover:text-cyan-300 transition-colors">
                    {faq.question}
                  </h3>
                  <ChevronDown
                    className={`w-5 h-5 text-cyan-400 shrink-0 transition-transform ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <motion.div
                  initial={false}
                  animate={{
                    height: openIndex === index ? 'auto' : 0,
                    opacity: openIndex === index ? 1 : 0
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-5 text-gray-300 leading-relaxed">
                    {faq.answer}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 bg-gradient-to-br from-violet-900/30 to-cyan-900/30 rounded-2xl p-8 border border-violet-500/30 text-center"
          >
            <h2 className="text-2xl font-bold text-white mb-4">
              Vous avez d'autres questions ?
            </h2>
            <p className="text-gray-300 mb-6">
              Testez notre diagnostic gratuit pour découvrir votre potentiel d'automatisation et obtenir des réponses personnalisées.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => {
                  onNavigateHome();
                  setTimeout(() => {
                    document.getElementById('audit-tool')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                icon={<Zap className="w-5 h-5" />}
              >
                Tester le diagnostic gratuit
              </Button>
              <Button
                onClick={() => window.open('https://calendly.com/b00784336-essec?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app', '_blank')}
                variant="secondary"
                icon={<Users className="w-5 h-5" />}
              >
                Parler à un expert (15 min)
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

