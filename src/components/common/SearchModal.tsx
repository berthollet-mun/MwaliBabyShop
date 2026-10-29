import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ChevronRight, MessageCircle } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  navigate: (path: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, navigate }) => {
  const { products, categories, generateDiscussPriceWhatsAppUrl, recordWhatsAppClick } = useStore();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const cleanQ = query.trim().toLowerCase();
  const filteredProducts = cleanQ
    ? products.filter(
        p =>
          p.isActive &&
          (p.name.toLowerCase().includes(cleanQ) ||
            p.description.toLowerCase().includes(cleanQ) ||
            (p.reference && p.reference.toLowerCase().includes(cleanQ)) ||
            p.tags?.some(t => t.toLowerCase().includes(cleanQ)))
      )
    : products.filter(p => p.isActive && p.isFeatured).slice(0, 4);

  const filteredCategories = cleanQ
    ? categories.filter(c => c.isActive && c.name.toLowerCase().includes(cleanQ))
    : [];

  const handleSelectProduct = (prod: Product) => {
    navigate(`/produit/${prod.slug}`);
    onClose();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategory = (slug: string) => {
    navigate(`/categorie/${slug}`);
    onClose();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleWhatsAppInquiry = (prod: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    recordWhatsAppClick('discuss_price', prod);
    window.open(generateDiscussPriceWhatsAppUrl(prod), '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20 bg-black/60 backdrop-blur-sm flex justify-center items-start animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-stone-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-stone-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher une robe, costume, sac, montre, référence..."
            className="w-full text-stone-900 placeholder-stone-400 text-sm sm:text-base focus:outline-none bg-transparent"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-stone-400 hover:text-stone-600 p-1 text-xs"
            >
              Effacer
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-lg"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4 divide-y divide-stone-100">
          {/* Categories matches if any */}
          {filteredCategories.length > 0 && (
            <div className="pb-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-2">
                Catégories
              </span>
              <div className="flex flex-wrap gap-2">
                {filteredCategories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => handleSelectCategory(cat.slug)}
                    className="px-3 py-1 rounded-full bg-stone-100 hover:bg-stone-200 text-xs text-stone-800 font-medium transition-colors"
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Products List */}
          <div className="pt-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-3">
              {cleanQ ? `Articles trouvés (${filteredProducts.length})` : 'Suggestions & Articles à la une'}
            </span>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-8 text-stone-500 text-sm">
                Aucun article ne correspond à « {query} ».
                <p className="text-xs text-stone-400 mt-1">
                  Essayez un autre mot-clé ou contactez-nous directement sur WhatsApp pour une recherche personnalisée.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredProducts.map(prod => (
                  <div
                    key={prod.id}
                    onClick={() => handleSelectProduct(prod)}
                    className="group flex items-center justify-between p-2.5 rounded-xl hover:bg-stone-50 border border-transparent hover:border-stone-200 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={prod.images[0] || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=120'}
                        alt={prod.name}
                        loading="lazy"
                        decoding="async"
                        className="w-12 h-12 rounded-lg object-cover bg-stone-100 shrink-0"
                      />
                      <div>
                        <div className="text-sm font-semibold text-stone-900 group-hover:text-amber-900 transition-colors line-clamp-1">
                          {prod.name}
                        </div>
                        <div className="text-xs text-stone-500 flex items-center gap-2 mt-0.5">
                          {prod.reference && (
                            <span className="font-mono bg-stone-100 px-1.5 py-0.2 text-[10px] rounded text-stone-600">
                              {prod.reference}
                            </span>
                          )}
                          <span className="text-emerald-700 text-[11px] font-medium">
                            Prix & détails sur WhatsApp
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={(e) => handleWhatsAppInquiry(prod, e)}
                        className="p-2 rounded-full text-emerald-600 hover:bg-emerald-50 transition-colors"
                        title="Discuter du prix sur WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>
                      <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-stone-700" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer info in modal */}
        <div className="bg-stone-50 p-3 px-4 text-xs text-stone-500 border-t border-stone-200 flex items-center justify-between">
          <span>Prix négocié et commande validée sur WhatsApp</span>
          <span className="font-medium text-stone-700">Boutique Goma</span>
        </div>
      </div>
    </div>
  );
};
