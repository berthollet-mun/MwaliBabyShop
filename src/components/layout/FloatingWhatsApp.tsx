import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useToast } from '../../context/ToastContext';

export const FloatingWhatsApp: React.FC = () => {
  const { settings, generateWhatsAppUrl, recordWhatsAppClick } = useStore();
  const { showWhatsApp } = useToast();
  const [tooltipDismissed, setTooltipDismissed] = useState(false);

  const handleClick = () => {
    recordWhatsAppClick('floating_button');
    showWhatsApp(
      'Service Clientèle WhatsApp',
      `Ouverture de la discussion avec ${settings.companyName} Goma (${settings.whatsappDisplay}).`
    );
    window.open(generateWhatsAppUrl(), '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-end flex-col select-none">
      {/* Tooltip notice */}
      {!tooltipDismissed && (
        <div className="mb-3 max-w-xs bg-white text-stone-800 p-3 rounded-2xl shadow-xl border border-stone-200 text-xs animate-in fade-in slide-in-from-bottom-2 duration-300 relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setTooltipDismissed(true);
            }}
            className="absolute top-2 right-2 text-stone-400 hover:text-stone-700 p-0.5 rounded-full"
            aria-label="Fermer le message"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <div className="pr-4">
            <div className="font-semibold text-stone-900 flex items-center gap-1.5 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
              <span>Besoin d'un prix ou d'un conseil ?</span>
            </div>
            <p className="text-stone-600 text-[11px] leading-relaxed">
              Discutez en direct avec notre équipe sur WhatsApp. Prix et commandes négociés en toute transparence.
            </p>
          </div>
          <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white border-r border-b border-stone-200 rotate-45" />
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={handleClick}
        className="group relative flex items-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-emerald-500/30"
        aria-label="Contacter sur WhatsApp pour commander ou demander un prix"
      >
        <span className="relative flex items-center justify-center">
          <MessageCircle className="w-6 h-6 fill-white/25" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
          </span>
        </span>
        <span className="hidden sm:inline font-medium text-xs tracking-wide">
          Commander sur WhatsApp
        </span>
      </button>
    </div>
  );
};
