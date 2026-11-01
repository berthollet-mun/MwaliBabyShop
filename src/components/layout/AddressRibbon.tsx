import React from 'react';
import { MapPin, Phone, Clock, MessageCircle } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { useStore } from '../../context/StoreContext';

export const AddressRibbon: React.FC = () => {
  const { settings, generateWhatsAppUrl, recordWhatsAppClick } = useStore();
  const shouldReduceMotion = useReducedMotion();

  const handleWhatsAppClick = () => {
    recordWhatsAppClick('header');
  };

  return (
    <motion.aside
      aria-label="Informations boutique"
      initial={shouldReduceMotion ? false : { opacity: 0, y: -28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      className="mwali-ribbon relative overflow-hidden border-b border-white/10 bg-[#2d1148] px-3 py-1.5 text-xs tracking-wide text-stone-200 sm:px-4 sm:py-2"
    >
      <span className="mwali-ribbon-light pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/15 to-transparent" aria-hidden="true" />
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Physical store location */}
        <div className="flex items-center gap-1.5 min-w-0">
          <MapPin className="w-3.5 h-3.5 text-[#ff8fb5] shrink-0" />
          <span className="hidden sm:inline font-medium text-stone-100 shrink-0">Boutique physique :</span>
          <span className="truncate text-stone-300 text-[11px] sm:text-xs">
            {settings.city} — {settings.address}
          </span>
        </div>

        {/* Right side contact links */}
        <div className="flex items-center gap-2.5 sm:gap-5 text-stone-300 text-[11px] sm:text-xs shrink-0">
          <div className="hidden md:flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-stone-400 shrink-0" />
            <span>{settings.openingHours}</span>
          </div>

          <a
            href={generateWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleWhatsAppClick}
            className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors font-medium shrink-0"
          >
            <MessageCircle className="w-3.5 h-3.5 shrink-0 fill-emerald-400/20" />
            <span className="hidden min-[420px]:inline">WhatsApp : {settings.whatsappDisplay}</span>
            <span className="min-[420px]:hidden">{settings.whatsappDisplay}</span>
          </a>

          <a
            href={`tel:${settings.phone}`}
            className="hidden lg:flex items-center gap-1 hover:text-white transition-colors shrink-0"
          >
            <Phone className="w-3 h-3 text-stone-400 shrink-0" />
            <span>{settings.phone}</span>
          </a>
        </div>
      </div>
    </motion.aside>
  );
};
