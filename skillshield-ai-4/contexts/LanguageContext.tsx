import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fr } from '../translations/fr';
import { en } from '../translations/en';

type Language = 'fr' | 'en';
type Translations = typeof fr;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  language?: Language; // For compatibility
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('skillshield_language') as Language;
      return saved === 'fr' || saved === 'en' ? saved : 'fr';
    }
    return 'fr';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('skillshield_language', lang);
    }
  };

  const translations: Translations = language === 'fr' ? fr : en;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations }}>
      {children}
    </LanguageContext.Provider>
  );
};
