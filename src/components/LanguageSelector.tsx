
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
    console.log('Tentando traduzir para:', language);
    
    if (window.google && window.google.translate) {
      // Aguardar um pouco para garantir que o Google Translate está pronto
      setTimeout(() => {
        const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
        console.log('Elemento select encontrado:', selectElement);
        
        if (selectElement) {
          selectElement.value = language;
          selectElement.dispatchEvent(new Event('change', { bubbles: true }));
          setCurrentLanguage(language);
          console.log('Idioma alterado para:', language);
        } else {
          console.log('Elemento select não encontrado, tentando novamente...');
          // Se não encontrou, tentar novamente após um pequeno delay
          setTimeout(() => {
            const selectElement2 = document.querySelector('.goog-te-combo') as HTMLSelectElement;
            if (selectElement2) {
              selectElement2.value = language;
              selectElement2.dispatchEvent(new Event('change', { bubbles: true }));
              setCurrentLanguage(language);
              console.log('Idioma alterado para (segunda tentativa):', language);
            }
          }, 500);
        }
      }, 100);
    } else {
      console.log('Google Translate não está carregado ainda');
      // Se o Google Translate ainda não estiver carregado, aguardar e tentar novamente
      setTimeout(() => translatePage(language), 1000);
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
