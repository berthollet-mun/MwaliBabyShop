import React from 'react';
import { MapPin, Phone, MessageCircle, ShieldCheck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface FooterProps {
  navigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  const { settings, categories, generateWhatsAppUrl, recordWhatsAppClick } = useStore();

  const handleWhatsApp = () => {
    recordWhatsAppClick('header');
  };

  return (
    <footer className="bg-[#0F0F0F] text-stone-300 pt-12 pb-10 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 border-b border-stone-800">
          {/* Col 1: Brand & WhatsApp */}
          <div className="space-y-3">
            <span className="font-['Playfair_Display',serif] text-2xl font-bold tracking-[0.12em] text-white block">
              {settings.companyName}
            </span>
            <p className="text-xs uppercase tracking-[0.15em] text-amber-500 font-medium">
              Maternité • Layette • Enfants & Beauté
            </p>
            <div className="pt-2">
              <a
                href={generateWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleWhatsApp}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors"
              >
                <MessageCircle className="w-4 h-4 fill-white/20" />
                <span>WhatsApp : {settings.whatsappDisplay}</span>
              </a>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-white">
              Catalogues
            </h4>
            <div className="grid grid-cols-1 gap-2 text-xs">
              {categories.filter(c => c.isActive).map(cat => (
                <button
                  key={cat.id}
                  onClick={() => {
                    navigate(`/categorie/${cat.slug}`);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-left text-stone-400 hover:text-white transition-colors"
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Col 3: Discreet Physical Address & Admin */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-white flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              Adresse & Retrait
            </h4>
            <p className="text-stone-300 text-xs leading-relaxed">
              {settings.address}
              <br />
              {settings.city}, {settings.country}
            </p>
            {settings.phone && (
              <a
                href={`tel:${settings.phone}`}
                className="text-stone-400 hover:text-white text-xs flex items-center gap-1"
              >
                <Phone className="w-3 h-3 text-amber-400" />
                <span>{settings.phone}</span>
              </a>
            )}
            <div className="pt-2">
              <button
                onClick={() => {
                  navigate('/admin');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-stone-500 hover:text-stone-300 text-[11px] flex items-center gap-1 transition-colors"
              >
                <ShieldCheck className="w-3 h-3 text-amber-500" />
                <span>Administration</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} {settings.companyName}. Tous droits réservés.</p>
          <span className="text-stone-500 text-[11px]">Goma, Nord-Kivu, RDC</span>
        </div>
      </div>
    </footer>
  );
};
