import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { LazyImage } from '../common/LazyImage';

interface CategoryGridProps {
  onNavigate: (path: string) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ onNavigate }) => {
  const { categories, products, isLoading } = useStore();
  const activeCategories = categories.filter(c => c.isActive).sort((a, b) => a.order - b.order);

  const getProductCount = (catId: string) => {
    return products.filter(p => p.categoryId === catId && p.isActive).length;
  };

  return (
    <section className="py-12 sm:py-16 bg-white flex-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-3">
          <div>
            <h1 className="font-['Playfair_Display',serif] text-2xl sm:text-4xl font-bold text-stone-900 tracking-tight">
              Catalogues par Catégorie
            </h1>
            <p className="text-stone-500 text-xs sm:text-sm mt-1">
              Sélectionnez une catégorie pour voir les produits disponibles.
            </p>
          </div>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {isLoading && Array.from({ length: 5 }).map((_, index) => (
            <div key={`category-skeleton-${index}`} className="overflow-hidden rounded-2xl border border-[#eedfe7] bg-white" aria-hidden="true">
              <div className="relative aspect-[4/5] overflow-hidden bg-[#f8eaf1]">
                <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/70 to-transparent" />
              </div>
              <div className="space-y-2 p-3">
                <div className="h-3 w-4/5 rounded-full bg-[#f1dce7]" />
                <div className="h-2.5 w-2/3 rounded-full bg-[#f6e8ef]" />
              </div>
            </div>
          ))}
          {!isLoading && activeCategories.map((category) => {
            const count = getProductCount(category.id);
            return (
              <div
                key={category.id}
                onClick={() => {
                  onNavigate(`/categorie/${category.slug}`);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group relative flex flex-col rounded-2xl overflow-hidden bg-stone-100 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Image Container with LazyImage */}
                <div className="relative aspect-[4/5] w-full overflow-hidden">
                  <LazyImage
                    src={category.image || 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600'}
                    alt={category.name}
                    containerClassName="w-full h-full"
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />

                  {/* Pill badge */}
                  <div className="absolute bottom-2.5 inset-x-2.5 sm:bottom-3 sm:inset-x-3 flex items-center justify-between gap-1.5 z-10">
                    <span className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white/95 backdrop-blur-md text-stone-900 text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-sm group-hover:bg-stone-900 group-hover:text-white transition-colors truncate">
                      {category.name}
                    </span>

                    <span className="hidden min-[380px]:flex w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/85 backdrop-blur-md items-center justify-center text-stone-900 group-hover:bg-[#e83c78] group-hover:text-white transition-colors shadow-sm shrink-0">
                      <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </span>
                  </div>

                  {/* Top count indicator */}
                  <div className="absolute top-3 right-3 z-10">
                    <span className="px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md text-white text-[10px] font-medium">
                      {count} {count > 1 ? 'articles' : 'article'}
                    </span>
                  </div>
                </div>

                {/* Subtitle description */}
                <div className="p-3 bg-white border-t border-stone-100">
                  <p className="text-[11px] text-stone-500 line-clamp-1">
                    {category.description || 'Découvrir la sélection'}
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
