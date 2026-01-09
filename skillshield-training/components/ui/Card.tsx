'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  variant?: 'glass' | 'solid' | 'gradient';
  glow?: boolean;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function Card({
  variant = 'glass',
  glow = false,
  children,
  className,
  onClick,
}: CardProps) {
  const baseStyles = 'backdrop-blur-2xl rounded-3xl p-8 md:p-10 lg:p-12 transition-all duration-300';
  
  const variants = {
    glass: 'bg-gradient-to-br from-violet-soft-500/30 via-slate-organic-700/25 to-cyan-vivid-500/30 border border-white/10',
    solid: 'bg-slate-organic-800/50 border border-slate-organic-600/50',
    gradient: 'bg-gradient-to-br from-violet-soft-500/20 to-cyan-vivid-500/20 border border-violet-soft-400/30',
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        baseStyles,
        variants[variant],
        glow && 'relative before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-r before:from-orange-warm-500/10 before:to-pink-empathy-500/10 before:blur-xl before:-z-10',
        onClick && 'cursor-pointer hover:scale-[1.03] hover:-translate-y-2 hover:border-violet-soft-400/40 hover:shadow-2xl',
        className
      )}
    >
      {children}
    </div>
  );
}

