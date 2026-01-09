'use client';

import { useEffect } from 'react';
import HeroSection from '@/components/hero/HeroSection';
import FloatingCTA from '@/components/hero/FloatingCTA';
import ProblemSection from '@/components/problem/ProblemSection';
import AuditTimeline from '@/components/approach/AuditTimeline';
import BeforeAfter from '@/components/transformation/BeforeAfter';
import BenefitsGrid from '@/components/benefits/BenefitsGrid';
import ProcessAccordion from '@/components/process/ProcessAccordion';
import TestimonialsCarousel from '@/components/testimonials/TestimonialsCarousel';
import FAQSection from '@/components/faq/FAQSection';
import FinalCTA from '@/components/cta/FinalCTA';

export default function Home() {
  useEffect(() => {
    // Scroll progress bar
    if (typeof window === 'undefined') return;
    
    const handleScroll = () => {
      const scrollPercentage =
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      const progressBar = document.getElementById('scroll-progress');
      if (progressBar) {
        progressBar.style.width = `${scrollPercentage}%`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className="relative min-h-screen bg-navy-warm-900 text-white">
      {/* Scroll progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-navy-warm-800 z-50">
        <div
          id="scroll-progress"
          className="h-full bg-gradient-to-r from-violet-soft-500 to-cyan-vivid-500 transition-all duration-150"
          style={{ width: '0%' }}
        />
      </div>

      <HeroSection />
      <ProblemSection />
      <AuditTimeline />
      <BeforeAfter />
      <BenefitsGrid />
      <ProcessAccordion />
      <TestimonialsCarousel />
      <FAQSection />
      <FinalCTA />
      <FloatingCTA />

      {/* Footer */}
      <footer className="relative py-12 px-6 md:px-8 border-t border-slate-organic-700/50">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-slate-organic-500 mb-2">
            © {new Date().getFullYear()} SkillShield Training. Tous droits réservés.
          </p>
          <p className="text-slate-organic-600 text-sm">
            Développez vos compétences. Formez vos équipes. Pour ce qui compte vraiment.
          </p>
        </div>
      </footer>
    </main>
  );
}
