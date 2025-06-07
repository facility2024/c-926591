
import { useState, useEffect } from "react";
import { Globe, Check } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

const LanguageSelector = () => {
  const [currentLanguage, setCurrentLanguage] = useState("pt");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Função para inicializar o Google Translate
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'pt',
          includedLanguages: 'en,pt',
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        'google_translate_element'
      );
      setIsLoaded(true);
    };

    // Carregar o script do Google Translate
    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.type = 'text/javascript';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      document.body.appendChild(script);
    }

    return () => {
      // Cleanup se necessário
    };
  }, []);

  const translatePage = (language: string) => {
    if (window.google && window.google.translate) {
      const translateElement = window.google.translate.TranslateElement;
      if (translateElement) {
        // Encontrar o elemento select do Google Translate
        const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
        if (selectElement) {
          selectElement.value = language;
          selectElement.dispatchEvent(new Event('change'));
          setCurrentLanguage(language);
        }
      }
    }
  };

  const languages = [
    { code: 'pt', name: 'Português', flag: '🇧🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
  ];

  return (
    <div className="relative">
      {/* Elemento oculto do Google Translate */}
      <div id="google_translate_element" className="hidden"></div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="glass gap-2">
            <Globe className="w-4 h-4" />
            <span className="hidden sm:inline">
              {languages.find(lang => lang.code === currentLanguage)?.flag}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {languages.map((language) => (
            <DropdownMenuItem
              key={language.code}
              onClick={() => translatePage(language.code)}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span>{language.flag}</span>
                <span>{language.name}</span>
              </div>
              {currentLanguage === language.code && (
                <Check className="w-4 h-4 text-primary" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default LanguageSelector;
