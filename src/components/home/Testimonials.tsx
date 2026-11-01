import React from 'react';
import { Star, Quote, CheckCircle2 } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const reviews = [
    {
      name: 'Maman Grâce Furaha',
      location: 'Goma, Centre-Ville',
      role: 'Future Maman & Cliente',
      comment: 'J’ai préparé toute ma valise de maternité et la layette de mon bébé chez MWALI Baby Shop à Goma (derrière la Mairie de Goma, avant Hôtel La Versailles). Les articles sont d’une douceur incroyable et le conseil sur WhatsApp a été super rapide !',
      rating: 5,
    },
    {
      name: 'Patrick & Clarisse',
      location: 'Goma, Quartier les Volcans',
      role: 'Parents de 3 enfants',
      comment: 'Pour les habits et chaussures de nos enfants de 2 à 10 ans, c’est notre boutique préférée à Goma. Les vêtements taillent très bien, durent longtemps et les chaussures sont hyper confortables.',
      rating: 5,
    },
    {
      name: 'Aline Kavira',
      location: 'Goma, Himbi',
      role: 'Cliente Beauté & Soins',
      comment: 'Enfin une adresse à Goma où l’on trouve des produits de beauté 100% authentiques pour nous les mamans et des soins sûrs pour la peau des bébés. Service impeccable !',
      rating: 5,
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-[#fff0f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-pink-700 block mb-2">
            Avis & Témoignages
          </span>
          <h2 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl font-bold text-stone-900">
            Ce Que Disent Nos Clientes & Familles
          </h2>
          <p className="text-stone-500 text-sm mt-3">
            La confiance des mamans et des familles de Goma est notre plus belle fierté.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="bg-white p-8 rounded-2xl border border-stone-200/80 shadow-sm flex flex-col justify-between relative"
            >
              <Quote className="w-8 h-8 text-stone-200 absolute top-6 right-6" />

              <div className="space-y-4">
                <div className="flex items-center gap-1 text-pink-500">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>

                <p className="text-stone-700 text-sm leading-relaxed italic">
                  « {rev.comment} »
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <h4 className="font-['Playfair_Display',serif] text-sm font-bold text-stone-900 flex items-center gap-1.5">
                    {rev.name}
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  </h4>
                  <p className="text-xs text-stone-500">{rev.role} • {rev.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
