'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';

export default function FloatingCTA() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleScroll = () => {
      const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      setIsVisible(scrollPercentage > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToCTA = () => {
    document.getElementById('final-cta')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-6 right-6 z-50 md:bottom-8 md:right-8"
        >
          <Button
            variant="primary"
            size="md"
            onClick={scrollToCTA}
            className="shadow-2xl"
          >
            Audit gratuit 🔍
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

