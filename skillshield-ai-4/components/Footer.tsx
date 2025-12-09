import React from 'react';
import { Linkedin, Mail } from 'lucide-react';
import { Logo } from './ui/Logo';

interface FooterProps {
  onNavigate?: (page: 'home' | 'about' | 'virtual-employees') => void;
  customLogo?: string | null;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, customLogo }) => {
  const handleNav = (page: 'home' | 'about' | 'virtual-employees', e: React.MouseEvent) => {
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
            <a href="mailto:contact@skillshield-ai.com" className="hover:text-cyan-400 transition-colors">Contact</a>
          </div>
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

        <div className="text-center text-gray-600 text-sm border-t border-white/5 pt-8">
          <p>© {new Date().getFullYear()} SkillShield AI. Tous droits réservés.</p>
          <p className="mt-2">L'IA au service de l'humain, pas l'inverse.</p>
        </div>
      </div>
    </footer>
  );
};