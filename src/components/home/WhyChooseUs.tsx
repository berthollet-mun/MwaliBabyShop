import React from 'react';
import { Sparkles, MessageCircle, ShieldCheck, Truck, RefreshCw, Award } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const WhyChooseUs: React.FC = () => {
  const { settings } = useStore();

  const features = [
    {
      icon: Sparkles,
      title: 'Maternité & Layette Complète',
      description: 'Tout pour accompagner les femmes enceintes et accueillir bébé : valises de maternité, vêtements de grossesse et trousseaux de naissance en coton doux.',
    },
    {
      icon: Award,
      title: 'Mode & Chaussures Enfants',
      description: 'Des habits élégants, tenues de fête, vêtements du quotidien et chaussures confortables adaptés à chaque étape de croissance des enfants.',
    },
    {
      icon: ShieldCheck,
      title: 'Produits de Beauté Authentiques',
      description: 'Une sélection rigoureuse de gammes corporelles, soins dermo-cosmétiques, laits et huiles 100% authentiques pour les mamans et toute la famille.',
    },
    {
      icon: MessageCircle,
      title: 'Conseil Direct sur WhatsApp',
      description: `Échangez directement avec notre équipe au ${settings.whatsappDisplay || '+243 971 171 975'} (0971171975) pour vérifier les tailles, connaître les prix et composer votre commande.`,
    },
    {
      icon: Truck,
      title: 'Boutique à Goma & Livraison Rapide',
      description: 'Retrouvez-nous sur la route pavée, derrière la Mairie de Goma, 4ème entrée à droite, avant Hôtel La Versailles, ou commandez avec livraison rapide.',
    },
    {
      icon: RefreshCw,
      title: 'Accompagnement & Confiance',
      description: 'Chaque commande est validée d’un commun accord avec vous, avec un service attentionné pour garantir la satisfaction des parents.',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-[#e83c78] mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Engagement & Excellence</span>
          </div>
          <h2 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
            {settings.whyChooseUsTitle || 'Pourquoi Choisir MWALI Baby Shop ?'}
          </h2>
          <p className="mt-4 text-sm sm:text-base text-stone-500">
            Une expérience d'achat personnalisée alliant la proximité de notre boutique à Goma et la réactivité d'un service client dédié sur WhatsApp.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-2xl bg-[#FAFAFA] border border-stone-200/80 hover:border-stone-300 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-stone-900 text-pink-400 flex items-center justify-center shadow-sm">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-['Playfair_Display',serif] text-lg font-bold text-stone-900">
                    {item.title}
                  </h3>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
