import { createContext, useContext, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

export type Language = 'ko' | 'en';

interface LanguageContextType {
  lang: Language;
  isEnglish: boolean;
  basePath: string; // '' for ko, '/en' for en
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'ko',
  isEnglish: false,
  basePath: '',
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const isEnglish = location.pathname.startsWith('/en');
  const lang: Language = isEnglish ? 'en' : 'ko';
  const basePath = isEnglish ? '/en' : '';

  return (
    <LanguageContext.Provider value={{ lang, isEnglish, basePath }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
