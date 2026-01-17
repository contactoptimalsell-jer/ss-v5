import React from 'react';
import { Linkedin, Mail, MapPin } from 'lucide-react';
import { Logo } from './ui/Logo';
import { useLanguage } from '../contexts/LanguageContext';

interface FooterProps {
  onNavigate?: (page: 'home' | 'about' | 'virtual-employees' | 'terms') => void;
  customLogo?: string | null;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, customLogo }) => {
  const { t } = useLanguage();
  const handleNav = (page: 'home' | 'about' | 'virtual-employees' | 'terms', e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="border-t border-white/10 bg-midnight pt-10 sm:pt-12 md:pt-16 pb-6 sm:pb-8">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 sm:mb-10 md:mb-12">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 md:mb-0">
            {customLogo ? (
                <img src={customLogo} alt="Logo" className="w-7 h-7 sm:w-8 sm:h-8 object-contain" />
            ) : (
                <Logo className="w-7 h-7 sm:w-8 sm:h-8 text-cyan-400" />
            )}
            <span className="font-display font-bold text-lg sm:text-xl text-white">SkillShield AI</span>
          </div>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 text-gray-400 text-xs sm:text-sm md:text-base">
            <a href="#" onClick={(e) => handleNav('virtual-employees', e)} className="hover:text-cyan-400 transition-colors">{t.nav.agents}</a>
            <a href="#" onClick={(e) => handleNav('about', e)} className="hover:text-cyan-400 transition-colors">{t.nav.about}</a>
            <a href="https://calendly.com/b00784336-essec?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">{t.nav.audit}</a>
            <a href="#" onClick={(e) => handleNav('home', e)} className="hover:text-cyan-400 transition-colors">{t.nav.home}</a>
            <a href="#" onClick={(e) => handleNav('terms', e)} className="hover:text-cyan-400 transition-colors">{t.nav.terms}</a>
            <a href="mailto:contact@skillshield-ai.com" className="hover:text-cyan-400 transition-colors">{t.nav.contact}</a>
          </div>
        </div>
        
        {/* Adresse et Contact */}
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-10 md:mb-12">
          {/* Adresse */}
          <div className="bg-slate-900/50 rounded-xl p-4 sm:p-5 md:p-6 border border-white/5">
            <h3 className="text-white font-bold mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
              {t.footer.ourAddress}
            </h3>
            <address className="text-gray-300 not-italic leading-relaxed text-xs sm:text-sm">
              <p className="font-semibold text-white mb-1">SkillShield AI</p>
              <p>113 Rue Jean Jaurès</p>
              <p>92300 Levallois-Perret</p>
              <p className="mt-2">France</p>
            </address>
            <a 
              href="https://www.google.com/maps/search/?api=1&query=113+Rue+Jean+Jaurès+92300+Levallois-Perret"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-3 sm:mt-4 text-cyan-400 hover:text-cyan-300 text-xs sm:text-sm transition-colors"
            >
              <MapPin className="w-4 h-4" />
              {t.footer.seeOnMaps}
            </a>
          </div>

          {/* Contact */}
          <div className="bg-slate-900/50 rounded-xl p-4 sm:p-5 md:p-6 border border-white/5">
            <h3 className="text-white font-bold mb-3 sm:mb-4 text-sm sm:text-base">{t.footer.contactTitle}</h3>
            <div className="space-y-2 sm:space-y-3 text-gray-300">
              <a 
                href="mailto:contact@skillshield-ai.com" 
                className="flex items-center gap-2 hover:text-cyan-400 transition-colors text-xs sm:text-sm break-all"
              >
                <Mail className="w-4 h-4 shrink-0" />
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
        <div className="mb-8 sm:mb-10 md:mb-12 rounded-xl overflow-hidden border border-white/5 bg-slate-900/30">
          <iframe
            src="https://www.google.com/maps?q=113+Rue+Jean+Jaurès+92300+Levallois-Perret+France&output=embed"
            width="100%"
            height="300"
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

        <div className="text-center text-gray-500 text-[10px] sm:text-xs border-t border-white/5 pt-6 sm:pt-8 space-y-2 px-4">
          <p className="max-w-3xl mx-auto leading-relaxed">
            <strong className="text-gray-400">{t.footer.warning}</strong> {t.footer.warningText}
          </p>
        </div>
        
        <div className="text-center text-gray-600 text-sm border-t border-white/5 pt-6 mt-6">
          <p>© {new Date().getFullYear()} SkillShield AI. {t.footer.rights}</p>
          <p className="mt-2">{t.footer.tagline}</p>
        </div>
      </div>
    </footer>
  );
};