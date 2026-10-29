import React from 'react';
import { ChevronLeft, Home, MessageCircle } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface NotFoundPageProps {
  onNavigate: (path: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate }) => {
  const { generateWhatsAppUrl, recordWhatsAppClick } = useStore();

  const handleWhatsApp = () => {
    recordWhatsAppClick('contact_page');
    window.open(generateWhatsAppUrl(), '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-[#FAFAFA] px-4 py-20">
      <div className="max-w-md w-full bg-white p-8 sm:p-12 rounded-3xl border border-stone-200 shadow-xl text-center space-y-6">
        <span className="font-mono text-5xl font-bold text-amber-600 block">404</span>

        <div className="space-y-2">
          <h1 className="font-['Playfair_Display',serif] text-2xl font-bold text-stone-900">
            Page Non Trouvée
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
            La page ou la collection demandée n'existe pas ou a été déplacée dans notre catalogue.
          </p>
        </div>

        <div className="pt-2 flex flex-col gap-3">
          <button
            onClick={() => onNavigate('/')}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Retourner à l'Accueil</span>
          </button>

          <button
            onClick={handleWhatsApp}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-emerald-600 text-emerald-700 hover:bg-emerald-50 text-xs font-semibold transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Assistance WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
