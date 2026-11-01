import React from 'react';
import { MapPin, Phone, MessageCircle, Clock, ShieldCheck, Truck, Navigation } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useToast } from '../../context/ToastContext';

export const AddressContactHighlight: React.FC = () => {
  const { settings, generateWhatsAppUrl, recordWhatsAppClick } = useStore();
  const { showWhatsApp } = useToast();

  const handleWhatsApp = () => {
    recordWhatsAppClick('contact_page');
    showWhatsApp(
      'Connexion WhatsApp',
      `Ouverture du chat avec ${settings.companyName} (${settings.whatsappDisplay}).`
    );
    window.open(generateWhatsAppUrl(undefined, "Bonjour MWALI Baby Shop, je souhaite visiter votre boutique à Goma (Route pavée, derrière la Mairie de Goma, 4ème entrée à droite, avant Hôtel La Versailles) et obtenir des renseignements sur vos articles."), '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-br from-[#24103f] via-[#32144f] to-[#24103f] text-white relative overflow-hidden">
      {/* Subtle decorative background glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#e83c78]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-stone-900/80 border border-stone-800 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl backdrop-blur-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left: Address Info & Welcome */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-widest">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Goma • Derrière la Mairie de Goma</span>
              </div>

              <h2 className="font-['Playfair_Display',serif] text-2xl sm:text-4xl font-bold leading-tight text-white">
                Boutique Physique & Conseil Direct sur WhatsApp
              </h2>

              <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
                Située à <strong>Goma</strong> (Réf : <strong>Route pavée, derrière la Mairie de Goma, 4ème entrée à droite, avant Hôtel La Versailles</strong>), la boutique <strong>{settings.companyName}</strong> vous accueille pour tous vos besoins en articles pour femmes enceintes, layette nouveau-né, vêtements et chaussures pour enfants ainsi que produits de beauté authentiques.
              </p>

              {/* Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-stone-950/60 border border-stone-800/80">
                  <Navigation className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs uppercase tracking-wider text-stone-400 font-semibold block">
                      Adresse Officielle
                    </span>
                    <span className="text-xs sm:text-sm text-stone-100 font-medium leading-snug block mt-0.5">
                      {settings.address} ({settings.city}, RDC)
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-stone-950/60 border border-stone-800/80">
                  <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs uppercase tracking-wider text-stone-400 font-semibold block">
                      Horaires & Accueil
                    </span>
                    <span className="text-xs sm:text-sm text-stone-100 font-medium leading-snug block mt-0.5">
                      {settings.openingHours}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Instant WhatsApp Call to Action Box */}
            <div className="lg:col-span-5 flex flex-col justify-center bg-stone-950 p-6 sm:p-8 rounded-2xl border border-stone-800 space-y-5">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                  Ligne Directe WhatsApp
                </span>
                <h3 className="text-xl font-bold text-white font-['Playfair_Display',serif]">
                  Commander ou Se Renseigner
                </h3>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Aucun paiement n’est prélevé en ligne. Vous échangez en direct avec notre équipe pour connaître les prix, vérifier les tailles et valider votre commande.
                </p>
              </div>

              <div className="p-4 bg-emerald-950/40 border border-emerald-800/50 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs text-emerald-300">
                  <span>Numéro officiel vérifié :</span>
                  <span className="font-mono font-bold text-sm text-white">
                    {settings.whatsappDisplay}
                  </span>
                </div>
                <div className="text-[11px] text-stone-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Commande validée sous réserve d'accord des deux parties</span>
                </div>
              </div>

              <button
                onClick={handleWhatsApp}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm tracking-wide shadow-lg hover:shadow-emerald-900/40 transition-all active:scale-98"
              >
                <MessageCircle className="w-5 h-5 fill-white/20" />
                <span>Ouvrir la Discussion WhatsApp</span>
              </button>

              <div className="flex items-center justify-center gap-4 text-xs text-stone-400 pt-1">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-stone-400" />
                  Livraison Goma & Provinces (RDC)
                </span>
                <span>•</span>
                <span>Retrait en boutique</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
