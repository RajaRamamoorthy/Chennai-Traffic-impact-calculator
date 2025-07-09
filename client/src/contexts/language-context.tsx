import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'ta';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    'nav.home': 'Home',
    'nav.calculator': 'Calculator',
    'nav.about': 'About',
    'nav.language': 'Language',
    'footer.about': 'About',
    'footer.howItWorks': 'How it works',
    'footer.methodology': 'Methodology',
    'footer.dataSources': 'Data sources',
    'footer.legal': 'Legal',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.contact': 'Contact',
    'footer.copyright': '© 2024 Chennai Traffic Impact Calculator. All rights reserved.',
  },
  ta: {
    'nav.home': 'முகப்பு',
    'nav.calculator': 'கணக்கீட்டு கருவி',
    'nav.about': 'பற்றி',
    'nav.language': 'மொழி',
    'footer.about': 'பற்றி',
    'footer.howItWorks': 'எப்படி வேலை செய்கிறது',
    'footer.methodology': 'முறையியல்',
    'footer.dataSources': 'தரவு ஆதாரங்கள்',
    'footer.legal': 'சட்ட',
    'footer.privacy': 'தனியுரிமை கொள்கை',
    'footer.terms': 'சேவை விதிமுறைகள்',
    'footer.contact': 'தொடர்பு',
    'footer.copyright': '© 2024 சென்னை போக்குவரத்து தாக்க கணக்கீட்டாளர். அனைத்து உரிமைகளும் محفوظ் வைக்கப்பட்டுள்ளன.',
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}