import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Globe, Info, Home } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useTranslation } from "@/lib/i18n";

export function Header() {
  const { language, toggleLanguage } = useLanguage();
  const t = useTranslation(language);

  return (
    <header className="bg-white shadow-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="text-2xl text-primary mr-3">🚦</div>
            <h1 className="text-xl font-semibold text-slate-900">
              {t.header.title}
            </h1>
            <Link href="/">
              <Button 
                variant="ghost" 
                size="sm"
                className="ml-4 text-slate-600 hover:text-slate-900"
                title={t.header.home}
              >
                <Home className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={toggleLanguage}
              className="text-slate-600 hover:text-slate-900"
            >
              <Globe className="w-4 h-4 mr-1" />
              {language === 'en' ? 'தமிழ்' : 'English'}
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-slate-600 hover:text-slate-900"
              onClick={() => {
                const aboutSection = document.querySelector('#about-section');
                if (aboutSection) {
                  aboutSection.scrollIntoView({ behavior: 'smooth' });
                  // Add highlight effect
                  aboutSection.classList.add('bg-blue-50', 'transition-colors', 'duration-1000');
                  setTimeout(() => {
                    aboutSection.classList.remove('bg-blue-50');
                  }, 2000);
                }
              }}
            >
              <Info className="w-4 h-4 mr-1" />
              {t.header.about}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}