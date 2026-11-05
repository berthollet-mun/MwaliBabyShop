import React, { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, Clock3, MessageCircle, RefreshCw } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useToast } from '../../context/ToastContext';
import { ProductCard } from '../products/ProductCard';
import { ProductGridSkeleton } from '../products/ProductCardSkeleton';

interface CategoryPageProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({ slug, onNavigate }) => {
  const {
    categories,
    products,
    generateWhatsAppUrl,
    recordWhatsAppClick,
    isLoading: isStoreLoading,
    isSlowLoading,
  } = useStore();
  const { showWhatsApp } = useToast();
  const [sortBy, setSortBy] = useState<'featured' | 'newest' | 'name-asc' | 'name-desc'>('featured');
  const [filterAvailability, setFilterAvailability] = useState<string>('all');
  const [isTransitioning, setIsTransitioning] = useState(true);

  const category = categories.find(c => c.slug === slug);

  // Smooth skeleton transition when changing category or filtering
  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setIsTransitioning(false);
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

  if (!category && isStoreLoading) {
    return (
      <div className="mx-auto grid min-h-[55vh] max-w-3xl place-items-center px-4 py-16" role="status" aria-live="polite">
        <div className="w-full rounded-3xl border border-[#ead8e5] bg-white p-6 text-center shadow-sm sm:p-10">
          <span className="relative mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#fce8f0] text-[#c92561]">
            {isSlowLoading ? <Clock3 className="h-5 w-5" /> : <RefreshCw className="h-5 w-5 animate-spin" />}
            <span className="mwali-loading-pulse absolute inset-0 rounded-full border border-[#e83c78]/25" aria-hidden="true" />
          </span>
          <h2 className="mt-5 font-['Playfair_Display',serif] text-xl font-bold text-[#32144f] sm:text-2xl">
            {isSlowLoading ? 'La boutique prépare cette collection…' : 'Chargement de la collection…'}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-stone-500 sm:text-sm">
            {isSlowLoading
              ? 'Le serveur se réveille après une période de repos. Vous serez redirigé automatiquement dès que les articles seront prêts.'
              : 'Nous récupérons les articles, leurs photos et leurs disponibilités.'}
          </p>
          <div className="mx-auto mt-5 h-1.5 max-w-sm overflow-hidden rounded-full bg-[#f2e4eb]" aria-hidden="true">
            <span className="mwali-loading-progress block h-full rounded-full bg-gradient-to-r from-[#5a237a] via-[#e83c78] to-[#ff9d3d]" />
          </div>
        </div>
      </div>
    );
  }

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
        {isStoreLoading && (
          <div className="mb-5 flex items-start gap-3 rounded-2xl border border-[#ead8e5] bg-white px-4 py-3 text-[#32144f] shadow-sm" role="status">
            <RefreshCw className="mt-0.5 h-4 w-4 shrink-0 animate-spin text-[#e83c78]" />
            <div>
              <p className="text-xs font-bold">Actualisation des articles en cours…</p>
              <p className="mt-0.5 text-[10px] text-stone-500">La sélection affichée reste consultable pendant la mise à jour.</p>
            </div>
          </div>
        )}

        {isTransitioning ? (
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
