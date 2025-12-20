import React, { useState, useEffect, useRef } from 'react';
import { Hero } from './components/Hero';
import { ProblemSection } from './components/ProblemSection';
import { GuardianModeSection } from './components/GuardianModeSection';
import { ProcessSection } from './components/ProcessSection';
import { AuditTool } from './components/AuditTool';
import { Footer } from './components/Footer';
import { AboutPage } from './components/AboutPage';
import { VirtualEmployeesPage } from './components/VirtualEmployeesPage';
import { UploadPhotosPage } from './components/UploadPhotosPage';
import { ProspectionPage } from './components/ProspectionPage';
import { TermsPage } from './components/TermsPage';
import { FAQPage } from './components/FAQPage';
import { BlogPage } from './components/BlogPage';
import { SEOHead } from './components/SEOHead';
import { StructuredData } from './components/StructuredData';
import { Menu, ShieldCheck, Home, X, Upload, Mail } from 'lucide-react';
import { Logo } from './components/ui/Logo';
import { SectionId, PageView } from './types';
import { motion, AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // -- GESTION LOGO (MODE ÉDITION RÉACTIVÉ) --
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [customLogoSrc, setCustomLogoSrc] = useState<string | null>(() => {
    try {
      return localStorage.getItem('skillshield_custom_logo');
    } catch {
      return null;
    }
  });

  const handleLogoClick = () => {
    logoInputRef.current?.click();
  };

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setCustomLogoSrc(base64String);
        try {
          localStorage.setItem('skillshield_custom_logo', base64String);
        } catch (e) {
          console.error("Image trop lourde pour la sauvegarde locale", e);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  // -------------------------------

  const testimonials = [
    {
      quote: "Je dîne avec mes enfants tous les soirs maintenant.",
      author: "Marc, CEO dans le BTP en Charente-Maritime"
    },
    {
      quote: "L'IA gère désormais 80% de mes emails de réservation. J'ai retrouvé le temps d'accueillir mes clients avec le sourire.",
      author: "Angèle, Dirigeante d'un hôtel dans le Poitou"
    },
    {
      quote: "Je pensais l'IA réservée aux géants de la Tech. Erreur. J'ai récupéré 12h par semaine sur ma gestion de stocks.",
      author: "Karine, Grossiste alimentaire en Auvergne"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobileMenuOpen(false);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Détecter la route /77230 pour afficher la page de prospection
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/77230') {
      setCurrentPage('prospection');
      // Nettoyer l'URL sans recharger la page
      window.history.replaceState({}, '', '/77230');
    }
  }, []);

  // Raccourci clavier pour accéder à l'upload (Ctrl/Cmd + Shift + U)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'U') {
        e.preventDefault();
        navigateTo('upload-photos');
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const openCalendly = () => {
    window.open('https://calendly.com/b00784336-essec?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app', '_blank');
    setIsMobileMenuOpen(false);
  };

  const navigateTo = (page: PageView) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMobileMenuOpen(false);
    // Si on navigue vers prospection, mettre à jour l'URL
    if (page === 'prospection') {
      window.history.pushState({}, '', '/77230');
    } else if (window.location.pathname === '/77230') {
      // Si on quitte la prospection, nettoyer l'URL
      window.history.pushState({}, '', '/');
    }
  };

  const scrollToSection = (id: string) => {
    if (currentPage !== 'home') {
      setCurrentPage('home');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const renderContent = () => {
    switch(currentPage) {
      case 'home':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Hero />
            <ProblemSection />
            <GuardianModeSection />
            
            <section className="py-20 bg-slate-800/30 border-y border-white/5">
               <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
                  <div className="space-y-6">
                     <h2 className="text-3xl font-bold font-display text-white">
                        Avant <span className="text-violet-400">/</span> Après
                     </h2>
                     <p className="text-gray-400 text-lg">
                        La différence ne se mesure pas qu'en chiffres, mais en qualité de vie.
                     </p>
                     <div className="space-y-4">
                        <div className="flex items-center gap-4 text-gray-400">
                           <span className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 shrink-0">✕</span>
                           <span>Finit à 21h, stressé et épuisé</span>
                        </div>
                        <div className="flex items-center gap-4 text-gray-300">
                           <span className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-400 shrink-0">✓</span>
                           <span className="font-medium text-white">Rentre à 17h30, serein</span>
                        </div>
                     </div>
                  </div>
                  <div className="relative h-64 md:h-80 rounded-3xl overflow-hidden border border-white/10">
                     <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 to-cyan-600/20" />
                     <img 
                        src="https://picsum.photos/800/600?grayscale" 
                        alt="Serene professional" 
                        className="w-full h-full object-cover opacity-60 mix-blend-luminosity hover:mix-blend-normal hover:opacity-80 transition-all duration-700" 
                     />
                     <div className="absolute bottom-6 left-6 right-6 p-4 bg-black/40 backdrop-blur-md rounded-xl border border-white/10 min-h-[120px] flex items-center">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={currentTestimonialIndex}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.5 }}
                            className="w-full"
                          >
                            <p className="text-white italic">"{testimonials[currentTestimonialIndex].quote}"</p>
                            <p className="text-cyan-300 text-sm mt-1">— {testimonials[currentTestimonialIndex].author}</p>
                          </motion.div>
                        </AnimatePresence>
                     </div>
                  </div>
               </div>
            </section>

            <ProcessSection />
            <AuditTool />

            <section className="py-32 relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-b from-midnight via-violet-900/10 to-midnight" />
               <div className="container mx-auto px-6 relative z-10 text-center">
                  <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-8">
                     Prêt à retrouver <br/>
                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-violet-400">votre vie ?</span>
                  </h2>
                  <div className="flex flex-col items-center gap-6">
                     <button onClick={openCalendly} className="bg-white text-midnight font-bold py-4 px-12 rounded-full hover:scale-105 transition-transform shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]">
                        Réserver mon audit gratuit
                     </button>
                     <div className="flex flex-col items-center gap-2">
                        <p className="text-gray-400 text-sm font-medium">15 minutes. Sans engagement. 100% Humain.</p>
                        <div className="flex items-center gap-2 text-xs text-violet-300 bg-violet-500/10 px-3 py-1.5 rounded-full border border-violet-500/20">
                            <ShieldCheck className="w-3 h-3" />
                            <span>Si aucun bénéfice le 1er mois, <span className="font-bold text-violet-200">remboursé à 90%</span>. Cet appel peut tout changer.</span>
                        </div>
                     </div>
                     
                     {/* Contact Email - Transparence */}
                     <div className="mt-6 pt-6 border-t border-white/10 w-full max-w-md">
                        <a 
                          href="mailto:contact@skillshield-ai.com?subject=Question%20sur%20SkillShield%20AI"
                          className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm text-gray-300 hover:text-cyan-400 transition-colors border border-white/10 hover:border-cyan-500/30 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-sm w-full md:w-auto"
                        >
                          <Mail className="w-4 h-4" />
                          <span>Nous contacter directement</span>
                        </a>
                        <p className="text-xs text-gray-500 mt-3 text-center">
                          💬 Transparence totale • contact@skillshield-ai.com • Réponse sous 24h
                        </p>
                     </div>
                  </div>
               </div>
            </section>
          </motion.div>
        );
      case 'about':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <AboutPage onNavigateHome={() => navigateTo('home')} />
          </motion.div>
        );
      case 'virtual-employees':
        return (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <VirtualEmployeesPage onNavigateHome={() => navigateTo('home')} />
          </motion.div>
        );
      case 'upload-photos':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <UploadPhotosPage onNavigateHome={() => navigateTo('home')} />
          </motion.div>
        );
      case 'prospection':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ProspectionPage onNavigateHome={() => navigateTo('home')} />
          </motion.div>
        );
      case 'terms':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <TermsPage onNavigateHome={() => navigateTo('home')} />
          </motion.div>
        );
      case 'faq':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <FAQPage onNavigateHome={() => navigateTo('home')} />
          </motion.div>
        );
      case 'blog':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <BlogPage onNavigateHome={() => navigateTo('home')} />
          </motion.div>
        );
      default:
        return null;
    }
  };

  // Métadonnées SEO selon la page
  const getSEOData = () => {
    switch(currentPage) {
      case 'home':
        return {
          title: "SkillShield AI - Implémentation IA avec Gardien Humain | Remboursement 90% | France",
          description: "SkillShield AI : Agence française d'implémentation d'intelligence artificielle pour entreprises. Système de gardien humain, remboursement 90% si non performant, diagnostic SaaS unique. Restaurez 10-20h/semaine aux dirigeants.",
          canonicalUrl: "https://skillshield.app/"
        };
      case 'about':
        return {
          title: "À propos - SkillShield AI | L'agence française d'implémentation IA",
          description: "Découvrez SkillShield AI, l'agence française qui révolutionne l'implémentation d'intelligence artificielle pour les entreprises avec son système de gardien humain unique.",
          canonicalUrl: "https://skillshield.app/about"
        };
      case 'virtual-employees':
        return {
          title: "Employés Virtuels IA - SkillShield AI | Agents IA sur mesure",
          description: "Découvrez nos agents IA sur mesure : Assistant Commercial, Gardien Service Client, Officier Administratif. Automatisez vos processus avec notre système de gardien humain.",
          canonicalUrl: "https://skillshield.app/virtual-employees"
        };
      case 'faq':
        return {
          title: "FAQ - SkillShield AI | Questions fréquentes sur l'implémentation IA",
          description: "Réponses aux questions fréquentes sur SkillShield AI : système de gardien humain, garantie remboursement 90%, diagnostic SaaS, automatisation IA pour entreprises françaises.",
          canonicalUrl: "https://skillshield.app/faq"
        };
      case 'prospection':
        return {
          title: "Prospection Automatisée - SkillShield AI | Agent IA de prospection",
          description: "Automatisez votre prospection avec notre agent IA spécialisé. Qualifiez les leads, prenez rendez-vous, suivez vos prospects 24/7 avec notre système de gardien humain.",
          canonicalUrl: "https://skillshield.app/77230"
        };
      default:
        return {
          title: "SkillShield AI - Implémentation IA avec Gardien Humain",
          description: "Agence française d'implémentation d'intelligence artificielle pour entreprises.",
          canonicalUrl: "https://skillshield.app/"
        };
    }
  };

  const seoData = getSEOData();

  return (
    <div className="min-h-screen font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      <SEOHead {...seoData} />
      {currentPage === 'home' && (
        <>
          <StructuredData type="Organization" />
          <StructuredData type="Service" />
          <StructuredData type="WebSite" />
        </>
      )}
      
       {/* Input hidden for logo upload */}
       <input 
        type="file" 
        ref={logoInputRef}
        onChange={handleLogoChange}
        className="hidden"
        accept="image/*"
      />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-midnight/80 backdrop-blur-lg border-b border-white/5 transition-all duration-300">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div 
               className="flex items-center justify-center cursor-pointer relative group" 
               onClick={handleLogoClick}
               title="Cliquez pour changer le logo"
             >
                {customLogoSrc ? (
                    <img 
                      src={customLogoSrc} 
                      alt="Logo" 
                      className="w-12 h-12 object-contain"
                    />
                ) : (
                    <Logo className="w-12 h-12 text-cyan-400" />
                )}
                {/* Petit indicateur au survol */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <Upload className="w-4 h-4 text-white" />
                </div>
             </div>
             
             <span className="font-display font-bold text-lg md:text-xl tracking-tight text-white cursor-pointer" onClick={() => navigateTo('home')}>
                SkillShield AI
             </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
             {currentPage === 'home' ? (
               <>
                 <button onClick={() => scrollToSection(SectionId.PROBLEM)} className="hover:text-cyan-400 transition-colors">Problème</button>
                 <button onClick={() => scrollToSection(SectionId.APPROACH)} className="hover:text-cyan-400 transition-colors">Méthode</button>
                 <button onClick={() => navigateTo('virtual-employees')} className="hover:text-cyan-400 transition-colors">Nos Agents</button>
                 <button onClick={() => navigateTo('blog')} className="hover:text-cyan-400 transition-colors">Blog</button>
                 <button onClick={() => navigateTo('about')} className="hover:text-cyan-400 transition-colors">À propos</button>
                 <button onClick={() => navigateTo('faq')} className="hover:text-cyan-400 transition-colors">FAQ</button>
               </>
             ) : (
               <>
                 <button onClick={() => navigateTo('home')} className="flex items-center gap-2 hover:text-cyan-400 transition-colors">
                    <Home className="w-4 h-4" /> Accueil
                 </button>
                 {currentPage !== 'virtual-employees' && (
                     <button onClick={() => navigateTo('virtual-employees')} className="hover:text-cyan-400 transition-colors">Nos Agents</button>
                 )}
                 {currentPage !== 'blog' && (
                     <button onClick={() => navigateTo('blog')} className="hover:text-cyan-400 transition-colors">Blog</button>
                 )}
                 {currentPage !== 'about' && (
                     <button onClick={() => navigateTo('about')} className="hover:text-cyan-400 transition-colors">À propos</button>
                 )}
                 {currentPage !== 'faq' && (
                     <button onClick={() => navigateTo('faq')} className="hover:text-cyan-400 transition-colors">FAQ</button>
                 )}
               </>
             )}
             
             <button onClick={openCalendly} className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-violet-400/50 transition-all text-white">
                Audit Gratuit
             </button>
          </div>

          <button 
            className="md:hidden text-white p-2 hover:bg-white/5 rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Menu"
          >
             {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: '100vh' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed top-20 left-0 right-0 z-40 bg-midnight/95 backdrop-blur-xl border-t border-white/10 md:hidden overflow-hidden"
          >
            <div className="flex flex-col p-6 space-y-2 h-full">
              {currentPage === 'home' ? (
                <>
                  <button 
                    onClick={() => scrollToSection(SectionId.PROBLEM)} 
                    className="w-full text-left py-4 px-4 text-lg font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all border-b border-white/5"
                  >
                    Problème
                  </button>
                  <button 
                    onClick={() => scrollToSection(SectionId.APPROACH)} 
                    className="w-full text-left py-4 px-4 text-lg font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all border-b border-white/5"
                  >
                    Méthode
                  </button>
                  <button 
                    onClick={() => navigateTo('virtual-employees')} 
                    className="w-full text-left py-4 px-4 text-lg font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all border-b border-white/5"
                  >
                    Nos Agents
                  </button>
                  <button 
                    onClick={() => navigateTo('about')} 
                    className="w-full text-left py-4 px-4 text-lg font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all border-b border-white/5"
                  >
                    À propos
                  </button>
                  <button 
                    onClick={() => navigateTo('faq')} 
                    className="w-full text-left py-4 px-4 text-lg font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all border-b border-white/5"
                  >
                    FAQ
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => navigateTo('home')} 
                    className="w-full flex items-center gap-3 py-4 px-4 text-lg font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all border-b border-white/5"
                  >
                    <Home className="w-5 h-5" /> Retour Accueil
                  </button>
                   <button 
                    onClick={() => navigateTo('virtual-employees')} 
                    className="w-full text-left py-4 px-4 text-lg font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all border-b border-white/5"
                  >
                    Nos Agents
                  </button>
                  <button 
                    onClick={() => navigateTo('blog')} 
                    className="w-full text-left py-4 px-4 text-lg font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all border-b border-white/5"
                  >
                    Blog
                  </button>
                  <button 
                    onClick={() => navigateTo('about')} 
                    className="w-full text-left py-4 px-4 text-lg font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all border-b border-white/5"
                  >
                    À propos
                  </button>
                  <button 
                    onClick={() => navigateTo('faq')} 
                    className="w-full text-left py-4 px-4 text-lg font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all border-b border-white/5"
                  >
                    FAQ
                  </button>
                </>
              )}
              
              <div className="pt-6 mt-auto pb-32">
                 <button 
                    onClick={openCalendly} 
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-bold text-lg shadow-lg active:scale-95 transition-transform"
                 >
                    Audit Gratuit
                 </button>
                 <p className="text-center text-gray-500 text-sm mt-4">15 min • Sans engagement</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        {renderContent()}
      </main>

      <Footer onNavigate={navigateTo} customLogo={customLogoSrc} />
    </div>
  );
};

export default App;