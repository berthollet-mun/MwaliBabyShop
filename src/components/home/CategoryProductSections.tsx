import React from 'react';
import { ChevronRight, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../products/ProductCard';

interface CategoryProductSectionsProps {
  onNavigate: (path: string) => void;
}

export const CategoryProductSections: React.FC<CategoryProductSectionsProps> = ({ onNavigate }) => {
  const { categories, products } = useStore();
  const activeCategories = categories.filter(c => c.isActive).sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-16 sm:space-y-24 py-12 sm:py-16 bg-[#FAFAFA]">
      {activeCategories.map((category) => {
        const catProducts = products
          .filter(p => p.categoryId === category.id && p.isActive)
          .slice(0, 4);

        if (catProducts.length === 0) return null;

        return (
          <section
            key={category.id}
            id={`section-${category.slug}`}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          >
            {/* Header of category section */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-stone-200 gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-amber-700 mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Rayon {category.name}</span>
                </div>
                <h3 className="font-['Playfair_Display',serif] text-2xl sm:text-3xl font-bold text-stone-900">
                  {category.name}
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-xl">
                  {category.description}
                </p>
              </div>

              <button
                onClick={() => {
                  onNavigate(`/categorie/${category.slug}`);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-stone-300 hover:border-stone-900 bg-white hover:bg-stone-900 text-xs font-bold uppercase tracking-wider text-stone-800 hover:text-white transition-all self-start sm:self-auto"
              >
                <span>Voir tout ({catProducts.length}+)</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Products grid */}
            <div className="mt-6 sm:mt-8 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {catProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};
