'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { buttonHover, buttonTap } from '@/lib/animations';
import { cn } from '@/lib/utils';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  icon?: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  disabled?: boolean;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  onClick,
  type = 'button',
  className,
  disabled = false,
}: ButtonProps) {
  const baseStyles = 'relative inline-flex items-center justify-center font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-violet-soft-400 focus:ring-offset-2 focus:ring-offset-navy-warm-900 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-gradient-to-r from-violet-soft-500 to-cyan-vivid-500 text-white shadow-xl hover:shadow-2xl rounded-2xl',
    secondary: 'border-2 border-violet-soft-500/50 bg-violet-soft-500/10 text-white hover:bg-violet-soft-500/20 rounded-xl',
    tertiary: 'bg-white/5 text-white hover:bg-white/10 rounded-xl',
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm md:text-base',
    md: 'px-6 py-3 text-base md:text-lg',
    lg: 'px-8 py-4 md:px-10 md:py-5 text-base md:text-lg lg:text-xl',
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? buttonHover : undefined}
      whileTap={!disabled ? buttonTap : undefined}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </motion.button>
  );
}

