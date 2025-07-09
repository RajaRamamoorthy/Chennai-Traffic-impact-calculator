import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Globe, Info } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

export function Header() {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ta' : 'en');
  };

  return (
    <header className="bg-white shadow-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="text-2xl text-primary mr-3">🚦</div>
            <h1 className="text-xl font-semibold text-slate-900">
              {t('header.title') || 'Chennai Traffic Impact Calculator'}
            </h1>
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
            <Link href="/how-it-works">
              <Button 
                variant="ghost" 
                size="sm"
                className="text-slate-600 hover:text-slate-900"
              >
                <Info className="w-4 h-4 mr-1" />
                {t('nav.about')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}