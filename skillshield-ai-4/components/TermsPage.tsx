import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield } from 'lucide-react';
import { Button } from './ui/Button';

interface TermsPageProps {
  onNavigateHome: () => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onNavigateHome }) => {
  return (
    <div className="min-h-screen bg-midnight pt-32 pb-20">
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à l'accueil
          </button>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-8">
              <Shield className="w-8 h-8 text-cyan-400" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">Conditions Générales d'Utilisation</h1>
            </div>

            <div className="prose prose-invert max-w-none text-gray-300 space-y-6">
              <p className="text-sm text-gray-400">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

              <section>
                <h2 className="text-xl font-semibold text-white mt-8 mb-4">1. Acceptation des Conditions</h2>
                <p>
                  En accédant et en utilisant le site web SkillShield AI (ci-après "le Site"), vous acceptez d'être lié par les présentes Conditions Générales d'Utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser le Site.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mt-8 mb-4">2. Avertissement sur les Données et Informations</h2>
                <p>
                  <strong className="text-white">Les données, statistiques, benchmarks, estimations et informations présentées sur ce Site sont fournies à titre indicatif uniquement.</strong> Elles peuvent ne pas représenter la réalité exacte, du fait du secteur de l'intelligence artificielle en mouvement perpétuel depuis les années 2022.
                </p>
                <p>
                  SkillShield AI ne garantit pas l'exactitude, la complétude, l'actualité ou la pertinence des informations fournies. Les résultats peuvent varier selon les contextes, secteurs d'activité, évolutions technologiques et circonstances spécifiques à chaque entreprise.
                </p>
                <p>
                  Les projections de ROI, temps économisés, processus automatisés et autres métriques sont des estimations basées sur des données sectorielles moyennes et ne constituent en aucun cas une promesse de résultats.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mt-8 mb-4">3. Limitation de Responsabilité</h2>
                <p>
                  SkillShield AI, ses dirigeants, employés, partenaires et prestataires ne pourront en aucun cas être tenus responsables de :
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Dommages directs, indirects, accessoires, consécutifs ou spéciaux résultant de l'utilisation ou de l'impossibilité d'utiliser le Site</li>
                  <li>Pertes de données, profits, revenus, opportunités commerciales ou autres pertes économiques</li>
                  <li>Décisions prises sur la base des informations fournies par le Site</li>
                  <li>Résultats obtenus ou non obtenus suite à l'utilisation des services ou informations du Site</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mt-8 mb-4">4. Propriété Intellectuelle</h2>
                <p>
                  Tous les contenus du Site, incluant mais sans s'y limiter : textes, graphiques, logos, icônes, images, clips audio, téléchargements numériques, compilations de données et logiciels, sont la propriété de SkillShield AI ou de ses fournisseurs de contenu et sont protégés par les lois françaises et internationales sur la propriété intellectuelle.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mt-8 mb-4">5. Utilisation du Site</h2>
                <p>Vous vous engagez à utiliser le Site de manière légale et conforme à ces Conditions Générales. Il est interdit de :</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Utiliser le Site à des fins illégales ou non autorisées</li>
                  <li>Tenter d'accéder à des zones non autorisées du Site</li>
                  <li>Reproduire, dupliquer, copier, vendre ou exploiter commercialement tout ou partie du Site</li>
                  <li>Utiliser des robots, scripts automatisés ou autres moyens pour accéder au Site</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mt-8 mb-4">6. Données Personnelles</h2>
                <p>
                  Les données personnelles collectées via le Site sont traitées conformément à notre politique de confidentialité et à la réglementation applicable (RGPD). En utilisant le Site, vous acceptez le traitement de vos données personnelles dans les conditions décrites.
                </p>
                <p>
                  <strong className="text-white">Utilisation de l'adresse email pour communications commerciales :</strong> En fournissant votre adresse email pour recevoir le PDF d'audit personnalisé, vous acceptez expressément de recevoir des communications commerciales de la part de SkillShield AI concernant nos services, offres promotionnelles et actualités liées à l'automatisation et à l'intelligence artificielle. Vous pouvez à tout moment vous désinscrire de ces communications en cliquant sur le lien de désinscription présent dans chaque email ou en nous contactant à <a href="mailto:contact@skillshield-ai.com" className="text-cyan-400 hover:underline">contact@skillshield-ai.com</a>.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mt-8 mb-4">7. Modifications des Conditions</h2>
                <p>
                  SkillShield AI se réserve le droit de modifier ces Conditions Générales à tout moment. Les modifications entrent en vigueur dès leur publication sur le Site. Il est de votre responsabilité de consulter régulièrement ces conditions.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mt-8 mb-4">8. Droit Applicable et Juridiction</h2>
                <p>
                  Les présentes Conditions Générales sont régies par le droit français. Tout litige relatif à l'utilisation du Site relève de la compétence exclusive des tribunaux français.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mt-8 mb-4">9. Contact</h2>
                <p>
                  Pour toute question concernant ces Conditions Générales, vous pouvez nous contacter à : <a href="mailto:contact@skillshield-ai.com" className="text-cyan-400 hover:underline">contact@skillshield-ai.com</a>
                </p>
              </section>

              <div className="mt-12 pt-8 border-t border-white/10">
                <p className="text-sm text-gray-400 text-center">
                  En utilisant SkillShield AI, vous reconnaissez avoir lu, compris et accepté ces Conditions Générales d'Utilisation.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

