import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useSpring, useTransform } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

interface AnimatedStatProps {
  label: string;
  value: string;
  color: 'green' | 'violet' | 'cyan';
  delay?: number;
  icon?: React.ReactNode;
}

export const AnimatedStat: React.FC<AnimatedStatProps> = ({ 
  label, 
  value, 
  color, 
  delay = 0,
  icon
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  
  // Extraire les chiffres pour l'animation
  const extractNumbers = (str: string): { prefix: string; numbers: string[]; suffix: string } => {
    const match = str.match(/(\d+)-(\d+)/);
    if (match) {
      const before = str.substring(0, str.indexOf(match[0]));
      const after = str.substring(str.indexOf(match[0]) + match[0].length);
      return {
        prefix: before,
        numbers: [match[1], match[2]],
        suffix: after
      };
    }
    return { prefix: str, numbers: [], suffix: '' };
  };

  const { prefix, numbers, suffix } = extractNumbers(value);
  
  // Animation spring pour un effet fluide
  const springConfig = { stiffness: 100, damping: 30 };
  const progress = useSpring(0, springConfig);
  
  useEffect(() => {
    if (isInView) {
      progress.set(1);
    }
  }, [isInView, progress]);

  // Animations des nombres
  useEffect(() => {
    if (!isInView || numbers.length === 0) {
      setDisplayValue(value);
      setIsAnimationComplete(true);
      return;
    }

    const duration = 2000; // 2 secondes
    const startTime = Date.now() + (delay * 1000);

    const animate = () => {
      const elapsed = Math.max(0, Date.now() - startTime);
      const t = Math.min(1, elapsed / duration);
      
      // Easing function pour un effet de ralenti en fin (ease-out)
      const eased = 1 - Math.pow(1 - t, 3);
      
      if (numbers.length === 2) {
        const start1 = parseInt(numbers[0]);
        const end1 = parseInt(numbers[0]);
        const start2 = 0;
        const end2 = parseInt(numbers[1]);
        
        const num1 = Math.floor(start1 + (end1 - start1) * eased);
        const num2 = Math.floor(start2 + (end2 - start2) * eased);
        
        setDisplayValue(`${prefix}${num1}-${num2}${suffix}`);
        
        // Vérifier si on a atteint les valeurs maximales (le deuxième nombre doit atteindre sa valeur max)
        if (num2 >= parseInt(numbers[1])) {
          setDisplayValue(value); // Valeur finale exacte
          setIsAnimationComplete(true);
          return;
        }
      } else {
        const num = value.match(/(\d+)/)?.[1];
        if (num) {
          const numValue = parseInt(num);
          const start = 0;
          const end = numValue;
          const current = Math.floor(start + (end - start) * eased);
          setDisplayValue(value.replace(/\d+/, current.toString()));
          
          // Vérifier si on a atteint la valeur maximale
          if (current >= numValue) {
            setDisplayValue(value); // Valeur finale exacte
            setIsAnimationComplete(true);
            return;
          }
        }
      }

      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(value); // Valeur finale exacte
        setIsAnimationComplete(true);
      }
    };

    const timeout = setTimeout(() => {
      animate();
    }, delay * 1000);

    return () => clearTimeout(timeout);
  }, [isInView, value, numbers, prefix, suffix, delay]);

  const colorClasses = {
    green: {
      text: 'text-green-400',
      border: 'border-green-500/20',
      bg: 'bg-green-500/10',
      icon: 'text-green-400',
      glow: 'shadow-[0_0_20px_rgba(74,222,128,0.3)]',
      hex: '#4ade80'
    },
    violet: {
      text: 'text-violet-400',
      border: 'border-violet-500/20',
      bg: 'bg-violet-500/10',
      icon: 'text-violet-400',
      glow: 'shadow-[0_0_20px_rgba(167,139,250,0.3)]',
      hex: '#a78bfa'
    },
    cyan: {
      text: 'text-cyan-400',
      border: 'border-cyan-500/20',
      bg: 'bg-cyan-500/10',
      icon: 'text-cyan-400',
      glow: 'shadow-[0_0_20px_rgba(34,211,238,0.3)]',
      hex: '#22d3ee'
    }
  };

  const colors = colorClasses[color];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ 
        duration: 0.6, 
        delay: delay,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ scale: 1.02, y: -2 }}
      className="relative"
    >
      <motion.div 
        className={`flex items-center justify-between p-4 bg-white/5 rounded-lg border ${colors.border} transition-all duration-300 group relative overflow-hidden`}
        whileHover={{ borderColor: colors.border.replace('/20', '/40'), backgroundColor: colors.bg.replace('/10', '/20') }}
      >
        {/* Barre de progression animée en arrière-plan */}
        <motion.div
          className={`absolute inset-0 ${colors.bg} rounded-lg`}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={isInView ? { scaleX: 1, opacity: 0.3 } : {}}
          transition={{ duration: 2, delay: delay + 0.3, ease: "easeOut" }}
          style={{ transformOrigin: "left" }}
        />
        <motion.div
          className={`absolute inset-0 ${colors.bg} rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
        />
        
        <div className="relative z-10">
          <motion.p 
            className="text-gray-300 text-sm mb-1"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: delay + 0.2 }}
          >
            {label}
          </motion.p>
          <motion.p 
            className={`${colors.text} font-bold text-xl relative inline-block`}
            animate={isInView && !isAnimationComplete ? {
              textShadow: [
                `0 0 0px ${colors.hex}`,
                `0 0 15px ${colors.hex}`,
                `0 0 0px ${colors.hex}`
              ]
            } : {}}
            transition={{
              duration: 2,
              repeat: isAnimationComplete ? 0 : Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          >
            {/* Animation de révélation du chiffre */}
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ 
                duration: 0.8, 
                delay: delay + 0.4,
                type: "spring",
                stiffness: 200
              }}
              className="inline-block"
            >
              {displayValue}
            </motion.span>
            
            {/* Effet de brillance qui traverse - s'arrête quand l'animation est terminée */}
            {isInView && !isAnimationComplete && (
              <motion.span
                className={`absolute inset-0 ${colors.bg} blur-xl opacity-30 pointer-events-none`}
                initial={{ x: "-100%" }}
                animate={{ x: "200%" }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 2,
                  ease: "easeInOut"
                }}
              />
            )}
          </motion.p>
        </div>
        
        {/* Icône avec animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0, rotate: -180 }}
          animate={isInView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
          transition={{ 
            duration: 0.8, 
            delay: delay + 0.5,
            type: "spring",
            stiffness: 200
          }}
          className={`relative ${colors.icon}`}
        >
          {icon || <TrendingUp className="w-8 h-8" />}
          {/* Particules animées autour de l'icône - s'arrêtent quand l'animation est terminée */}
          {isInView && !isAnimationComplete && (
            <>
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className={`absolute inset-0 rounded-full ${colors.bg}`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: [1, 1.5, 2],
                    opacity: [1, 0.5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: "easeOut"
                  }}
                />
              ))}
            </>
          )}
        </motion.div>
      </motion.div>
      
      {/* Ligne de progression sous le card */}
      <motion.div
        className={`absolute bottom-0 left-0 h-1 ${colors.bg} rounded-b-lg`}
        initial={{ width: 0 }}
        animate={isInView ? { width: "100%" } : {}}
        transition={{ duration: 2, delay: delay + 0.3, ease: "easeOut" }}
      />
    </motion.div>
  );
};
