import React from 'react';
import { Linkedin, Mail, MapPin } from 'lucide-react';
import { Logo } from './ui/Logo';

interface FooterProps {
  onNavigate?: (page: 'home' | 'about' | 'virtual-employees' | 'terms') => void;
  customLogo?: string | null;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, customLogo }) => {
  const handleNav = (page: 'home' | 'about' | 'virtual-employees' | 'terms', e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="border-t border-white/10 bg-midnight pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            {customLogo ? (
                <img src={customLogo} alt="Logo" className="w-8 h-8 object-contain" />
            ) : (
                <Logo className="w-8 h-8 text-cyan-400" />
            )}
            <span className="font-display font-bold text-xl text-white">SkillShield AI</span>
          </div>
          <div className="flex gap-8 text-gray-400 text-sm md:text-base">
            <a href="#" onClick={(e) => handleNav('virtual-employees', e)} className="hover:text-cyan-400 transition-colors">Nos Agents</a>
            <a href="#" onClick={(e) => handleNav('about', e)} className="hover:text-cyan-400 transition-colors">À propos</a>
            <a href="https://calendly.com/b00784336-essec?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">Audit</a>
            <a href="#" onClick={(e) => handleNav('home', e)} className="hover:text-cyan-400 transition-colors">Accueil</a>
            <a href="#" onClick={(e) => handleNav('terms', e)} className="hover:text-cyan-400 transition-colors">Conditions Générales</a>
            <a href="mailto:contact@skillshield-ai.com" className="hover:text-cyan-400 transition-colors">Contact</a>
          </div>
        </div>
        
        {/* Adresse et Contact */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Adresse */}
          <div className="bg-slate-900/50 rounded-xl p-6 border border-white/5">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-cyan-400" />
              Notre Adresse
            </h3>
            <address className="text-gray-300 not-italic leading-relaxed">
              <p className="font-semibold text-white mb-1">SkillShield AI</p>
              <p>113 Rue Jean Jaurès</p>
              <p>92300 Levallois-Perret</p>
              <p className="mt-2">France</p>
            </address>
            <a 
              href="https://www.google.com/maps/search/?api=1&query=113+Rue+Jean+Jaurès+92300+Levallois-Perret"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 text-cyan-400 hover:text-cyan-300 text-sm transition-colors"
            >
              <MapPin className="w-4 h-4" />
              Voir sur Google Maps
            </a>
          </div>

          {/* Contact */}
          <div className="bg-slate-900/50 rounded-xl p-6 border border-white/5">
            <h3 className="text-white font-bold mb-4">Contact</h3>
            <div className="space-y-3 text-gray-300">
              <a 
                href="mailto:contact@skillshield-ai.com" 
                className="flex items-center gap-2 hover:text-cyan-400 transition-colors"
              >
                <Mail className="w-4 h-4" />
                contact@skillshield-ai.com
              </a>
              <div className="flex items-center gap-4 pt-2">
                <a 
                  href="https://www.linkedin.com/in/j%C3%A9r%C3%B4me-karr-394027206?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-all"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a 
                  href="mailto:contact@skillshield-ai.com" 
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-all"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Google Maps Embed */}
        <div className="mb-12 rounded-xl overflow-hidden border border-white/5 bg-slate-900/30">
          <iframe
            src="https://www.google.com/maps?q=113+Rue+Jean+Jaurès+92300+Levallois-Perret+France&output=embed"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Localisation SkillShield AI - 113 Rue Jean Jaurès, 92300 Levallois-Perret, France"
            className="w-full"
          />
        </div>

        <div className="flex justify-center gap-6 mb-8">
            <a 
              href="https://www.linkedin.com/in/j%C3%A9r%C3%B4me-karr-394027206?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-all"
            >
                <Linkedin className="w-5 h-5" />
            </a>
            <a href="mailto:contact@skillshield-ai.com" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-all">
                <Mail className="w-5 h-5" />
            </a>
        </div>

        <div className="text-center text-gray-500 text-xs border-t border-white/5 pt-8 space-y-2">
          <p className="max-w-3xl mx-auto leading-relaxed">
            <strong className="text-gray-400">Avertissement :</strong> Les données, statistiques et informations présentées sur ce site peuvent ne pas représenter la réalité exacte, du fait du secteur de l'intelligence artificielle en mouvement perpétuel depuis les années 2022. Les benchmarks, estimations et projections sont fournis à titre indicatif et peuvent varier selon les contextes, secteurs d'activité et évolutions technologiques. SkillShield AI ne garantit pas l'exactitude, la complétude ou l'actualité des informations fournies.
          </p>
        </div>
        
        <div className="text-center text-gray-600 text-sm border-t border-white/5 pt-6 mt-6">
          <p>© {new Date().getFullYear()} SkillShield AI. Tous droits réservés.</p>
          <p className="mt-2">L'IA au service de l'humain, pas l'inverse.</p>
        </div>
      </div>
    </footer>
  );
};