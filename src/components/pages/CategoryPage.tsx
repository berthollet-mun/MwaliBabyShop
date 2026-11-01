import React, { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, SlidersHorizontal, Sparkles, MessageCircle } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useToast } from '../../context/ToastContext';
import { ProductCard } from '../products/ProductCard';
import { ProductGridSkeleton } from '../products/ProductCardSkeleton';

interface CategoryPageProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({ slug, onNavigate }) => {
  const { categories, products, generateWhatsAppUrl, recordWhatsAppClick } = useStore();
  const { showWhatsApp } = useToast();
  const [sortBy, setSortBy] = useState<'featured' | 'newest' | 'name-asc' | 'name-desc'>('featured');
  const [filterAvailability, setFilterAvailability] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  const category = categories.find(c => c.slug === slug);

  // Smooth skeleton transition when changing category or filtering
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 240);
    return () => clearTimeout(timer);
  }, [slug, sortBy, filterAvailability]);

  const categoryProducts = useMemo(() => {
    if (!category) return [];
    let list = products.filter(p => p.categoryId === category.id && p.isActive);

    if (filterAvailability !== 'all') {
      list = list.filter(p => p.characteristics.availability === filterAvailability);
    }

    switch (sortBy) {
      case 'newest':
        return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'name-asc':
        return list.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return list.sort((a, b) => b.name.localeCompare(a.name));
      case 'featured':
      default:
        return list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }
  }, [category, products, sortBy, filterAvailability]);

  if (!category) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold font-['Playfair_Display',serif] text-stone-900 mb-3">
          Catégorie Introuvable
        </h2>
        <p className="text-stone-500 text-sm mb-6">
          La catégorie demandée n'existe pas ou a été désactivée.
        </p>
        <button
          onClick={() => onNavigate('/')}
          className="px-6 py-2.5 rounded-full bg-[#5a237a] text-white text-xs font-semibold uppercase tracking-wider"
        >
          Retourner au catalogue
        </button>
      </div>
    );
  }

  const handleCustomInquiry = () => {
    recordWhatsAppClick('contact_page');
    showWhatsApp(
      'Demande personnalisée WhatsApp',
      `Ouverture de la discussion pour la catégorie ${category.name}. Nos conseillers à Goma vous répondent immédiatement.`
    );
    window.open(generateWhatsAppUrl(undefined, `Bonjour, je recherche des articles dans la catégorie ${category.name}. Que pouvez-vous me proposer ?`), '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-[#fffafc] pb-16">
      {/* Minimal Header */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <button
              onClick={() => onNavigate('/')}
              className="inline-flex items-center gap-1.5 text-stone-500 hover:text-stone-900 text-xs font-semibold uppercase tracking-wider transition-colors mb-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Tous les catalogues</span>
            </button>
            <h1 className="font-['Playfair_Display',serif] text-2xl sm:text-3xl font-bold text-stone-900">
              {category.name}
            </h1>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="text-stone-500 font-medium">
              {categoryProducts.length} {categoryProducts.length > 1 ? 'articles' : 'article'}
            </span>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs text-stone-800 focus:outline-none focus:border-stone-400 font-medium"
            >
              <option value="featured">Sélection vedette</option>
              <option value="newest">Nouveautés</option>
              <option value="name-asc">Nom (A → Z)</option>
              <option value="name-desc">Nom (Z → A)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {isLoading ? (
          <ProductGridSkeleton count={8} />
        ) : categoryProducts.length === 0 ? (
          <div className="bg-white rounded-xl border border-stone-200 p-12 text-center space-y-3">
            <h3 className="text-base font-bold text-stone-800">
              Aucun article disponible pour le moment
            </h3>
            <p className="text-stone-500 text-xs">
              De nouveaux arrivages arrivent régulièrement en boutique à Goma.
            </p>
            <button
              onClick={() => onNavigate('/')}
              className="px-4 py-2 rounded-lg bg-[#5a237a] text-white text-xs font-semibold"
            >
              Retourner aux catalogues
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {categoryProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
