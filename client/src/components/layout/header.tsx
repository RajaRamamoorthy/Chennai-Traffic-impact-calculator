import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Globe, Info, Home, Navigation } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useTranslation } from "@/lib/i18n";

export function Header() {
  const { language, toggleLanguage } = useLanguage();
  const t = useTranslation(language);

  return (
    <header className="bg-white shadow-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-2">
          <div className="flex items-center min-w-0 flex-1">
            <div className="text-2xl text-primary mr-2 sm:mr-3 flex-shrink-0">🚦</div>
            <h1 className="text-lg sm:text-xl font-semibold text-slate-900 truncate">
              {t.header.title}
            </h1>
            <Link href="/">
              <Button 
                variant="ghost" 
                size="sm"
                className="ml-2 sm:ml-4 text-slate-600 hover:text-slate-900 flex-shrink-0"
                title={t.header.home}
              >
                <Home className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button 
                variant="ghost" 
                size="sm"
                className="ml-1 sm:ml-2 text-slate-600 hover:text-slate-900 flex-shrink-0"
                title="Dashboard"
              >
                <Navigation className="w-4 h-4 sm:mr-1" />
                <span className="hidden sm:inline">Dashboard</span>
              </Button>
            </Link>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={toggleLanguage}
              className="text-slate-600 hover:text-slate-900"
            >
              <Globe className="w-4 h-4 sm:mr-1" />
              <span className="hidden sm:inline">
                {language === 'en' ? 'தமிழ்' : 'English'}
              </span>
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
              <Info className="w-4 h-4 sm:mr-1" />
              <span className="hidden sm:inline">
                {t.header.about}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}