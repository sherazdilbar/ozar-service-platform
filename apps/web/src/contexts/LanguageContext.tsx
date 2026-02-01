'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import en from '@/locales/en.json';
import hu from '@/locales/hu.json';

type Language = 'en' | 'hu';
type Translations = typeof en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Translations> = { en, hu };

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [language, setLanguageState] = useState<Language>('en');
  const [mounted, setMounted] = useState(false);

  // Initialize language on mount
  useEffect(() => {
    setMounted(true);
    
    // Priority: URL > localStorage > Browser > Default
    const urlLang = searchParams?.get('lang');
    if (urlLang === 'hu' || urlLang === 'en') {
      setLanguageState(urlLang);
      localStorage.setItem('language', urlLang);
      return;
    }
    
    // Check localStorage
    const savedLang = localStorage.getItem('language');
    if (savedLang === 'hu' || savedLang === 'en') {
      setLanguageState(savedLang);
      return;
    }
    
    // Detect browser language
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('hu')) {
      setLanguageState('hu');
      localStorage.setItem('language', 'hu');
    }
  }, [searchParams]);

  // Update HTML lang attribute
  useEffect(() => {
    if (mounted) {
      document.documentElement.lang = language;
    }
  }, [language, mounted]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    
    // Update URL with ?lang=hu
    const params = new URLSearchParams(searchParams.toString());
    if (lang === 'hu') {
      params.set('lang', 'hu');
    } else {
      params.delete('lang');
    }
    
    const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.replace(newUrl);
  };

  // Translation function with nested key support
  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
