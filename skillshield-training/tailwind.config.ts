import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'navy-warm': {
          900: '#0F172A',
          800: '#1E293B',
        },
        'cyan-vivid': {
          500: '#06B6D4',
          400: '#22D3EE',
        },
        'violet-soft': {
          500: '#8B5CF6',
          400: '#A78BFA',
        },
        'slate-organic': {
          700: '#334155',
          600: '#475569',
          500: '#64748B',
        },
        'orange-warm': {
          500: '#F59E0B',
          400: '#FBBF24',
        },
        'green-calm': {
          500: '#10B981',
          400: '#34D399',
        },
        'pink-empathy': {
          500: '#EC4899',
          400: '#F472B6',
        },
        beige: {
          200: '#FEF3C7',
          300: '#FDE68A',
        },
      },
      animation: {
        'breathe': 'breathe 4s ease-in-out infinite',
        'flow': 'flow 3s linear infinite',
        'heartbeat': 'heartbeat 2s ease-in-out infinite',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.05)', opacity: '0.9' },
        },
        flow: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
        heartbeat: {
          '0%, 40%, 100%': { transform: 'scale(1)' },
          '10%': { transform: 'scale(1.1)' },
          '20%': { transform: 'scale(1.05)' },
          '30%': { transform: 'scale(1.15)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;













