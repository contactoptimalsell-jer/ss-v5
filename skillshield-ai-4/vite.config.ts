import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    // Load all environment variables (not just VITE_ prefixed ones)
    const env = loadEnv(mode, '.', '');
    // Also try to get from process.env directly (for Vercel build)
    const defaultGeminiKey = process.env.DefaultGeminiAPIKey || env.DefaultGeminiAPIKey || '';
    const geminiKey = process.env.GEMINI_API_KEY || env.GEMINI_API_KEY || '';
    const viteGeminiKey = process.env.VITE_GEMINI_API_KEY || env.VITE_GEMINI_API_KEY || '';
    const apiKey = defaultGeminiKey || geminiKey || viteGeminiKey;
    
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(apiKey),
        'process.env.GEMINI_API_KEY': JSON.stringify(apiKey),
        'process.env.DefaultGeminiAPIKey': JSON.stringify(defaultGeminiKey)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
