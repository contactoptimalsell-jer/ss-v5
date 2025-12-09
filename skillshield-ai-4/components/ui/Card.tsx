import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  highlight?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', highlight = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5, boxShadow: "0 20px 40px -10px rgba(139, 92, 246, 0.2)" }}
      className={`
        relative overflow-hidden rounded-3xl backdrop-blur-2xl transition-all duration-300 border
        ${highlight 
          ? 'bg-gradient-to-br from-violet-900/40 via-slate-800/40 to-cyan-900/40 border-violet-400/40 shadow-2xl shadow-violet-500/20' 
          : 'bg-white/5 border-violet-400/20 hover:border-violet-400/40'}
        ${className}
      `}
    >
      {/* Warm glow effect */}
      {highlight && (
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-orange-400/10 blur-[80px] rounded-full pointer-events-none" />
      )}
      <div className="relative z-10 h-full">
        {children}
      </div>
    </motion.div>
  );
};