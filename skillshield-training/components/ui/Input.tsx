'use client';

import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  success?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, success, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'w-full bg-white/10 border-2 rounded-xl px-5 py-4 text-lg text-white placeholder:text-slate-organic-500',
          'focus:outline-none focus:ring-2 focus:ring-cyan-vivid-400 focus:border-transparent',
          'transition-all duration-300',
          error && 'border-pink-empathy-500 focus:ring-pink-empathy-500',
          success && 'border-green-calm-500 focus:ring-green-calm-500',
          !error && !success && 'border-violet-soft-400/30',
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export default Input;













