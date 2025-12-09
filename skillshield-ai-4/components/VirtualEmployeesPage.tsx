import React from 'react';
import { motion } from 'framer-motion';
import { Users, Bot, Briefcase, Mail, BarChart3, MessageCircle, FileText, Search, UserPlus, ShieldCheck } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

export const VirtualEmployeesPage: React.FC<{ onNavigateHome: () => void }> = ({ onNavigateHome }) => {
  const openCalendly = () => {
    window.open('https://calendly.com/b00784336-essec?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app', '_blank');
  };

  const agents = [
    {
      role: "L'Assistant Commercial (SDR)",
      icon: Briefcase,
      color: "text-green-400",
      bg: "bg-green-500/10",
      border: "border-green-500/20",
      mission: [
        "Répond aux leads entrants en < 2 min",
        "Qualifie le prospect (Budget, Urgence)",
        "Prend rendez-vous pour vos commerciaux"
      ],
      example: {
        sector: "Immobilier",
        desc: "Traite les 50 demandes quotidiennes issues de SeLoger/Leboncoin. Écarte les curieux, et booke les visites pour les agents uniquement avec les dossiers solvables."
      }
    },
    {
      role: "Le Gardien du Service Client",
      icon: MessageCircle,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      mission: [
        "Répond 24h/24 et 7j/7",
        "Gère les réclamations et suivis de commande",
        "Escalade à l'humain si complexe"
      ],
      example: {
        sector: "E-commerce",
        desc: "Gère 80% des tickets (Où est mon colis ? Facture ?). Résultat : l'équipe support ne gère plus que les litiges complexes et a retrouvé le sourire."
      }
    },
    {
      role: "L'Officier Administratif",
      icon: FileText,
      color: "text-violet-400",
      bg: "bg-violet-500/10",
      border: "border-violet-500/20",
      mission: [
        "Extrait les données des factures PDF",
        "Met à jour le CRM / ERP",
        "Prépare les devis standards"
      ],
      example: {
        sector: "BTP / Artisanat",
        desc: "Dès qu'un fournisseur envoie une facture, l'agent la lit, vérifie les montants, la classe dans le bon dossier Drive et prépare le virement pour le chef d'entreprise."
      }
    },
    {
      role: "Le Recruteur Junior",
      icon: UserPlus,
      color: "text-pink-400",
      bg: "bg-pink-500/10",
      border: "border-pink-500/20",
      mission: [
        "Trie les centaines de CV reçus",
        "Scanne les compétences clés",
        "Répond à tous les candidats (marque employeur)"
      ],
      example: {
        sector: "Entreprise de Services",
        desc: "Sur 200 CV reçus pour un poste, l'agent identifie le Top 10 qui matche à 90% les critères et propose des créneaux d'entretien. Zéro CV ignoré."
      }
    },
    {
      role: "L'Analyste de Données",
      icon: BarChart3,
      color: "text-orange-400",
      bg: "bg-orange-500/10",
      border: "border-orange-500/20",
      mission: [
        "Analyse vos ventes hebdomadaires",
        "Détecte les anomalies de trésorerie",
        "Génère un rapport synthétique le lundi matin"
      ],
      example: {
        sector: "Commerce de détail",
        desc: "Analyse les tickets de caisse et prévient le gérant : 'Attention, les ventes de ce produit chutent anormalement le mardi, vérifiez le stock ou l'affichage'."
      }
    },
    {
      role: "Le Créateur de Contenu",
      icon: Search,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20",
      mission: [
        "Rédige des posts LinkedIn / Blog",
        "Optimise le SEO de vos pages",
        "Transforme une vidéo en article"
      ],
      example: {
        sector: "Consulting / Agence",
        desc: "Écoute l'enregistrement vocal du dirigeant qui raconte une expertise, et le transforme en 3 posts LinkedIn viraux et 1 newsletter prête à envoyer."
      }
    }
  ];

  return (
    <div className="pt-24 pb-20">
      {/* Hero Section */}
      <section className="relative px-6 mb-24 text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[120px] -z-10" />
        
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-8"
          >
            <Bot className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-bold text-cyan-300 uppercase tracking-wide">Votre Future Équipe</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-display font-bold text-white mb-8 leading-tight"
        >
          Découvrez vos nouveaux<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-violet-400 to-cyan-400">
            Meilleurs Employés.
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-12"
        >
          Ils ne prennent pas de vacances, ne tombent jamais malades, et adorent les tâches répétitives que vos humains détestent.<br/>
          Voici les profils que nous implémentons le plus souvent.
        </motion.p>
      </section>

      {/* Grid of Agents */}
      <section className="container mx-auto px-6 mb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {agents.map((agent, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                >
                    <Card className={`h-full flex flex-col border ${agent.border} hover:border-opacity-100 transition-all`}>
                        <div className="p-8 flex-1">
                            <div className={`w-14 h-14 rounded-2xl ${agent.bg} flex items-center justify-center mb-6`}>
                                <agent.icon className={`w-7 h-7 ${agent.color}`} />
                            </div>
                            
                            <h3 className="text-2xl font-bold text-white mb-2">{agent.role}</h3>
                            <div className="w-12 h-1 bg-white/10 rounded-full mb-6"></div>
                            
                            <ul className="space-y-3 mb-8">
                                {agent.mission.map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-gray-300 text-sm">
                                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white/50 shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Concrete Example Box */}
                        <div className="bg-slate-900/50 p-6 border-t border-white/5">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Cas Concret</span>
                                <span className={`text-xs px-2 py-0.5 rounded ${agent.bg} ${agent.color} border ${agent.border}`}>
                                    {agent.example.sector}
                                </span>
                            </div>
                            <p className="text-sm text-gray-400 italic leading-relaxed">
                                "{agent.example.desc}"
                            </p>
                        </div>
                    </Card>
                </motion.div>
            ))}
        </div>
      </section>

      {/* Integration Process Summary */}
      <section className="container mx-auto px-6 mb-24">
          <div className="bg-white/5 rounded-3xl p-8 md:p-12 border border-white/10 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Comment ça marche ?</h2>
              <div className="grid md:grid-cols-3 gap-8 text-left">
                  <div className="flex flex-col gap-4">
                      <span className="text-4xl font-bold text-white/10">01</span>
                      <h3 className="text-xl font-bold text-white">Définition du Rôle</h3>
                      <p className="text-gray-400">On rédige la "fiche de poste" de l'agent ensemble. Ce qu'il doit faire, ce qu'il ne doit pas faire, et le ton à employer.</p>
                  </div>
                  <div className="flex flex-col gap-4">
                      <span className="text-4xl font-bold text-white/10">02</span>
                      <h3 className="text-xl font-bold text-white">Connexion aux Outils</h3>
                      <p className="text-gray-400">On connecte l'agent à vos outils existants (Gmail, Calendly, CRM, Excel...). Pas de nouveau logiciel complexe à apprendre.</p>
                  </div>
                  <div className="flex flex-col gap-4">
                      <span className="text-4xl font-bold text-white/10">03</span>
                      <h3 className="text-xl font-bold text-white">Pilotage</h3>
                      <p className="text-gray-400">Vous gardez la main. L'agent travaille, vous supervisez. Vous recevez un rapport quotidien de ses actions.</p>
                  </div>
              </div>
          </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-white mb-8 font-display">
            Quel agent voulez-vous recruter <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">aujourd'hui ?</span>
        </h2>
        <div className="flex flex-col md:flex-row justify-center items-center gap-6">
            <Button onClick={openCalendly}>
                Constituer mon équipe virtuelle
            </Button>
            <button onClick={onNavigateHome} className="text-gray-400 hover:text-white underline underline-offset-4 decoration-white/20 hover:decoration-white transition-all">
                Retour à l'accueil
            </button>
        </div>
      </section>
    </div>
  );
};