import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';

interface AnimatedTextProps {
  children: React.ReactNode;
  type?: 'typewriter' | 'fadeInUp' | 'highlight' | 'wordByWord' | 'gradient' | 'pulse';
  delay?: number;
  duration?: number;
  className?: string;
  highlightWords?: string[];
  highlightColor?: string;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  children,
  type = 'fadeInUp',
  delay = 0,
  duration = 0.8,
  className = '',
  highlightWords = [],
  highlightColor = 'text-violet-400'
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const text = typeof children === 'string' ? children : String(children);

  // Typewriter effect
  useEffect(() => {
    if (type === 'typewriter' && isInView) {
      const timeout = setTimeout(() => {
        if (currentIndex < text.length) {
          setDisplayedText(text.substring(0, currentIndex + 1));
          setCurrentIndex(currentIndex + 1);
        }
      }, 30);
      return () => clearTimeout(timeout);
    } else if (type === 'typewriter') {
      setDisplayedText('');
      setCurrentIndex(0);
    }
  }, [currentIndex, text, isInView, type]);

  // Word by word animation
  const words = text.split(' ');
  const highlightRegex = highlightWords.length > 0 
    ? new RegExp(`(${highlightWords.join('|')})`, 'gi')
    : null;

  if (type === 'typewriter') {
    return (
      <motion.span
        ref={ref}
        className={className}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay, duration: 0.3 }}
      >
        {displayedText}
        {currentIndex < text.length && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="inline-block w-0.5 h-5 bg-current ml-1"
          />
        )}
      </motion.span>
    );
  }

  if (type === 'wordByWord') {
    return (
      <motion.span ref={ref} className={className}>
        {words.map((word, index) => {
          const isHighlight = highlightWords.length > 0 && highlightWords.some(hw => 
            word.toLowerCase().includes(hw.toLowerCase())
          );
          
          return (
            <motion.span
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                delay: delay + (index * 0.1),
                duration: duration / words.length,
                type: "spring",
                stiffness: 100
              }}
              className={isHighlight ? highlightColor + ' font-bold' : ''}
            >
              {word}
              {index < words.length - 1 && '\u00A0'}
            </motion.span>
          );
        })}
      </motion.span>
    );
  }

  if (type === 'highlight') {
    if (!highlightRegex) {
      return <span className={className}>{children}</span>;
    }
    
    const parts = text.split(highlightRegex);
    
    return (
      <motion.span
        ref={ref}
        className={className}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay, duration }}
      >
        {parts.map((part, index) => {
          const isHighlight = highlightWords.some(hw => 
            part.toLowerCase() === hw.toLowerCase()
          );
          
          return isHighlight ? (
            <motion.span
              key={index}
              className={`${highlightColor} font-bold relative`}
              initial={{ scale: 1 }}
              animate={isInView ? {
                scale: [1, 1.05, 1],
              } : {}}
              transition={{
                duration: 2,
                delay: delay + 0.5,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            >
              {part}
              <motion.span
                className={`absolute inset-0 ${highlightColor.replace('text-', 'bg-')}/20 blur-md -z-10`}
                animate={isInView ? {
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5]
                } : {}}
                transition={{
                  duration: 2,
                  delay: delay + 0.5,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
            </motion.span>
          ) : (
            <span key={index}>{part}</span>
          );
        })}
      </motion.span>
    );
  }

  if (type === 'gradient') {
    return (
      <motion.span
        ref={ref}
        className={`${className} bg-clip-text text-transparent bg-gradient-to-r`}
        initial={{ opacity: 0, backgroundPosition: '0% 50%' }}
        animate={isInView ? {
          opacity: 1,
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
        } : {}}
        transition={{
          delay,
          duration,
          backgroundPosition: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
        style={{
          backgroundImage: 'linear-gradient(90deg, #a78bfa, #22d3ee, #fbbf24, #a78bfa)',
          backgroundSize: '200% 200%'
        }}
      >
        {children}
      </motion.span>
    );
  }

  if (type === 'pulse') {
    return (
      <motion.span
        ref={ref}
        className={className}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={isInView ? {
          opacity: 1,
          scale: [1, 1.02, 1]
        } : {}}
        transition={{
          opacity: { delay, duration },
          scale: {
            delay: delay + duration,
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
      >
        {children}
      </motion.span>
    );
  }

  // Default: fadeInUp
  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        delay,
        duration,
        type: "spring",
        stiffness: 100
      }}
    >
      {children}
    </motion.span>
  );
};
