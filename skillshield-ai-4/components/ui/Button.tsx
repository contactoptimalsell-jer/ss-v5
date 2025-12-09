import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary';
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, icon, className = '', ...props }) => {
  const baseStyles = "relative flex items-center justify-center gap-3 rounded-2xl font-semibold transition-all duration-500 overflow-hidden";
  
  const variants = {
    primary: "bg-gradient-to-r from-violet-500 via-cyan-400 to-violet-500 bg-[length:200%_100%] hover:bg-[100%_0] text-white shadow-xl shadow-violet-500/40 hover:shadow-2xl hover:shadow-cyan-400/50 py-4 px-8 md:px-10",
    secondary: "bg-violet-500/10 border-2 border-violet-400/50 text-violet-300 hover:bg-violet-500/20 hover:border-violet-400 py-3 px-6",
    tertiary: "bg-white/5 border border-white/10 text-cyan-300 hover:bg-white/10 py-3 px-6"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
      {icon && <span className="w-5 h-5">{icon}</span>}
    </motion.button>
  );
};