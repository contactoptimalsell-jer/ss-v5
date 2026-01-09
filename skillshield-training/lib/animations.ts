import { Variants } from 'framer-motion';

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.19, 1, 0.22, 1] }
  }
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { 
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

export const scaleIn: Variants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { duration: 0.5, ease: [0.19, 1, 0.22, 1] }
  }
};

export const slideInLeft: Variants = {
  hidden: { x: -100, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { duration: 0.7, ease: [0.19, 1, 0.22, 1] }
  }
};

export const slideInRight: Variants = {
  hidden: { x: 100, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { duration: 0.7, ease: [0.19, 1, 0.22, 1] }
  }
};

export const heroVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.7, ease: [0.19, 1, 0.22, 1] }
  }
};

export const buttonHover = {
  scale: 1.02,
  y: -2,
  transition: { type: "spring" as const, stiffness: 300 }
};

export const buttonTap = {
  scale: 0.98,
  transition: { type: "spring" as const, stiffness: 400 }
};

