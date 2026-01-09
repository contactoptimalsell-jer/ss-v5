'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'pulse' | 'glow';
  className?: string;
}

export default function Badge({ children, variant = 'default', className }: BadgeProps) {
  const baseStyles = 'inline-flex items-center px-4 py-2 rounded-full text-sm font-medium';
  
  const variants = {
    default: 'bg-violet-soft-500/20 text-violet-soft-400 border border-violet-soft-400/30',
    pulse: 'bg-violet-soft-500/20 text-violet-soft-400 border border-violet-soft-400/30',
    glow: 'bg-gradient-to-r from-violet-soft-500/30 to-cyan-vivid-500/30 text-white border border-cyan-vivid-400/30',
  };

  if (variant === 'pulse') {
    return (
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          opacity: [1, 0.9, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className={cn(baseStyles, variants[variant], className)}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={cn(baseStyles, variants[variant], className)}>
      {children}
    </div>
  );
}













