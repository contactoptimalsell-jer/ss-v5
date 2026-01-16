import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Sparkles, Mail, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/Button';

interface PromoCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PromoCodeModal: React.FC<PromoCodeModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const promoCode = 'TRANSFORM5';
  const discount = '-5%';

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      
      // Fermer avec la touche Escape
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'unset';
      };
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Veuillez entrer une adresse email valide');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/promo-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          promoCode,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        // Sauvegarder dans localStorage pour ne plus afficher le popup
        try {
          localStorage.setItem('skillshield_promo_code_submitted', 'true');
          localStorage.setItem('skillshield_promo_code', promoCode);
        } catch (e) {
          // Ignorer les erreurs localStorage
        }
        
        // Fermer après 3 secondes
        setTimeout(() => {
          onClose();
          setIsSuccess(false);
          setEmail('');
        }, 3000);
      } else {
        setError(data.error || 'Une erreur est survenue. Veuillez réessayer.');
      }
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9998]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none"
          >
            <div 
              className="relative w-full max-w-md pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Background effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 via-cyan-500/20 to-violet-500/20 rounded-3xl blur-2xl" />
              
              {/* Modal content */}
              <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl border border-white/10 p-8 shadow-2xl backdrop-blur-xl">
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                  aria-label="Fermer"
                >
                  <X className="w-5 h-5" />
                </button>

                {!isSuccess ? (
                  <>
                    {/* Header */}
                    <div className="text-center mb-6">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-violet-400/30 mb-4"
                      >
                        <Gift className="w-8 h-8 text-violet-400" />
                      </motion.div>
                      
                      <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-3xl font-display font-bold text-white mb-2"
                      >
                        Offre Spéciale 🎁
                      </motion.h2>
                      
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-gray-300 text-base leading-relaxed"
                      >
                        Vous arrivez <span className="text-cyan-400 font-semibold">au bon moment</span> !
                      </motion.p>
                      
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, type: "spring" }}
                        className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-500/20 to-cyan-500/20 border border-violet-400/30"
                      >
                        <Sparkles className="w-4 h-4 text-violet-400" />
                        <span className="text-white font-bold text-lg">{discount}</span>
                        <span className="text-gray-300 text-sm">sur votre première implémentation IA</span>
                      </motion.div>
                    </div>

                    {/* Value proposition */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="bg-slate-800/50 rounded-xl p-4 mb-6 border border-white/5"
                    >
                      <p className="text-gray-300 text-sm leading-relaxed text-center">
                        Bénéficiez de <span className="text-violet-400 font-semibold">{discount}</span> sur votre première implémentation IA avec le code{' '}
                        <span className="font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded">{promoCode}</span>
                      </p>
                    </motion.div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label htmlFor="promo-email" className="block text-sm font-medium text-gray-300 mb-2">
                          <Mail className="w-4 h-4 inline mr-2 text-cyan-400" />
                          Votre email pour recevoir le code promo
                        </label>
                        <input
                          id="promo-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="votre@email.com"
                          required
                          className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border-2 border-white/10 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-white placeholder-gray-500 transition-all outline-none"
                        />
                      </div>

                      {error && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-400 text-sm text-center"
                        >
                          {error}
                        </motion.p>
                      )}

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full"
                        icon={isSubmitting ? <Sparkles className="w-5 h-5 animate-spin" /> : <Gift className="w-5 h-5" />}
                      >
                        {isSubmitting ? 'Envoi en cours...' : `Recevoir mon code ${discount}`}
                      </Button>

                      <p className="text-gray-500 text-xs text-center">
                        En renseignant votre email, vous acceptez de recevoir des communications de SkillShield AI. 
                        Vous pouvez vous désabonner à tout moment.
                      </p>
                    </form>

                    {/* Bouton fermer / plus tard */}
                    <div className="mt-6 text-center">
                      <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white text-sm underline underline-offset-4 transition-colors"
                      >
                        Plus tard
                      </button>
                    </div>
                  </>
                ) : (
                  /* Success state */
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-4"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.2 }}
                      className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 border border-green-400/30 mb-4"
                    >
                      <CheckCircle2 className="w-8 h-8 text-green-400" />
                    </motion.div>
                    
                    <h3 className="text-2xl font-display font-bold text-white mb-2">
                      Code promo envoyé ! ✨
                    </h3>
                    
                    <p className="text-gray-300 mb-6">
                      Vérifiez votre boîte email (<span className="text-cyan-400 font-semibold">{email}</span>) pour recevoir votre code <span className="font-mono font-bold text-violet-400">{promoCode}</span>
                    </p>
                    
                    <div className="bg-gradient-to-r from-violet-500/20 to-cyan-500/20 rounded-xl p-4 border border-violet-400/30">
                      <p className="text-white font-bold text-lg mb-1">Votre code promo :</p>
                      <p className="font-mono text-2xl font-bold text-cyan-400">{promoCode}</p>
                      <p className="text-gray-300 text-sm mt-2">{discount} de réduction sur votre première implémentation IA</p>
                    </div>

                    {/* Bouton fermer */}
                    <div className="mt-6 text-center">
                      <Button
                        onClick={onClose}
                        variant="secondary"
                        className="w-full"
                      >
                        Fermer
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
