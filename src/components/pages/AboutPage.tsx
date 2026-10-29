import React from 'react';
import { Sparkles, MessageCircle, MapPin, Award, Baby, ShieldCheck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface AboutPageProps {
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const { settings, generateWhatsAppUrl, recordWhatsAppClick } = useStore();

  const handleWhatsApp = () => {
    recordWhatsAppClick('contact_page');
    window.open(
      generateWhatsAppUrl(
        undefined,
        "Bonjour MWALI Baby Shop, j'ai consulté votre page À Propos et j'aimerais en savoir plus sur vos articles (Maternité, Layette, Mode Enfants et Produits de beauté)."
      ),
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header */}
      <div className="relative bg-stone-950 text-white py-20 sm:py-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-amber-400 block mb-3">
            Goma • Derrière la Mairie de Goma
          </span>
          <h1 className="font-['Playfair_Display',serif] text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6">
            À Propos de {settings.companyName}
          </h1>
          <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
            Votre boutique spécialisée dans la vente d'articles pour femmes enceintes (préparation à la maternité), layette nouveau-né, habits et chaussures pour enfants ainsi que de produits de beauté authentiques.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-20">
        {/* Story Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-6 relative aspect-[4/5] rounded-3xl overflow-hidden shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=900&auto=format&fit=crop&q=80"
              alt="Univers Maternité, Layette et Enfants MWALI Baby Shop"
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="md:col-span-6 space-y-5">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-700 block">
              Notre Vocation à Goma
            </span>
            <h2 className="font-['Playfair_Display',serif] text-2xl sm:text-3xl font-bold text-stone-900">
              Accompagner les Mamans, les Bébés et les Enfants
            </h2>
            <div className="text-sm text-stone-600 space-y-4 leading-relaxed">
              <p>{settings.aboutText}</p>
              <p>
                Chez <strong>{settings.companyName}</strong>, nous savons à quel point l'arrivée d'un enfant et sa croissance sont des étapes précieuses. C'est pourquoi chaque trousseau de maternité, vêtement, paire de chaussures et produit cosmétique est sélectionné avec exigence pour offrir douceur, sécurité et élégance.
              </p>
            </div>
          </div>
        </div>

        {/* Pillars / Specialties from the official business card */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-700 block mb-2">
              Nos Spécialités
            </span>
            <h2 className="font-['Playfair_Display',serif] text-2xl sm:text-3xl font-bold text-stone-900">
              Tout l'Univers de la Maman, de l'Enfant & de la Beauté
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#FAFAFA] border border-stone-200/80 space-y-3">
              <Baby className="w-6 h-6 text-amber-600" />
              <h3 className="text-base font-bold text-stone-900">1. Maternité & Layette</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Tout le nécessaire pour les femmes enceintes (préparation à la maternité, robes d'allaitement, sacs) et des trousseaux complets de layette pour accueillir bébé.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAFAFA] border border-stone-200/80 space-y-3">
              <Award className="w-6 h-6 text-emerald-600" />
              <h3 className="text-base font-bold text-stone-900">2. Mode & Chaussures Enfants</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Habits et chaussures de qualité pour filles et garçons : tenues de cérémonie, vêtements du quotidien et souliers confortables.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAFAFA] border border-stone-200/80 space-y-3">
              <ShieldCheck className="w-6 h-6 text-rose-600" />
              <h3 className="text-base font-bold text-stone-900">3. Beauté Authentique</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Une gamme de produits de beauté et de soins corporels 100% authentiques pour prendre soin de la peau des mamans et de toute la famille.
              </p>
            </div>
          </div>
        </div>

        {/* Physical Store Callout */}
        <div className="p-8 sm:p-12 rounded-3xl bg-stone-900 text-white flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-xs uppercase tracking-wider text-amber-400 font-bold">
              <MapPin className="w-4 h-4" />
              <span>Visitez Notre Boutique à Goma</span>
            </div>
            <h3 className="font-['Playfair_Display',serif] text-2xl font-bold">
              {settings.address}
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 max-w-lg">
              Contacts : {settings.whatsappDisplay} / {settings.phone} • {settings.openingHours}
            </p>
          </div>

          <button
            onClick={handleWhatsApp}
            className="flex-shrink-0 flex items-center gap-2 px-6 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold shadow-lg"
          >
            <MessageCircle className="w-4 h-4 fill-white/20" />
            <span>Écrire sur WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
