import React, { useEffect } from 'react';
import {
  MessageCircle,
  ChevronLeft,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useToast } from '../../context/ToastContext';
import { ProductGallery } from '../products/ProductGallery';

interface ProductDetailPageProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ slug, onNavigate }) => {
  const {
    products,
    categories,
    settings,
    generateDiscussPriceWhatsAppUrl,
    recordWhatsAppClick,
    incrementProductViews,
  } = useStore();
  const { showWhatsApp } = useToast();

  const product = products.find(p => p.slug === slug || p.id === slug);

  useEffect(() => {
    if (product) {
      incrementProductViews(product.id);
      window.scrollTo(0, 0);
    }
  }, [product?.id]);

  if (!product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-3">
        <h2 className="text-xl font-bold font-['Playfair_Display',serif] text-stone-900">
          Article Introuvable
        </h2>
        <p className="text-stone-500 text-xs">
          Cet article n'est plus disponible ou a été déplacé.
        </p>
        <button
          onClick={() => onNavigate('/')}
          className="px-5 py-2 rounded-lg bg-stone-900 text-white text-xs font-semibold"
        >
          Retourner aux catalogues
        </button>
      </div>
    );
  }

  const category = categories.find(c => c.id === product.categoryId);

  const handleDiscussPrice = () => {
    recordWhatsAppClick('discuss_price', product);
    showWhatsApp(
      'Discussion WhatsApp...',
      `Ouverture de la discussion pour négocier le prix de "${product.name}".`
    );
    window.open(generateDiscussPriceWhatsAppUrl(product), '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-16">
      {/* Top Navigation */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between text-xs">
          <button
            onClick={() => onNavigate(category ? `/categorie/${category.slug}` : '/')}
            className="flex items-center gap-1.5 text-stone-600 hover:text-stone-950 font-medium transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{category ? `Retour à ${category.name}` : 'Retour aux catalogues'}</span>
          </button>

          {category && (
            <span className="text-stone-400 font-medium hidden sm:inline">
              {category.name}
            </span>
          )}
        </div>
      </div>

      {/* Minimal Product Sheet (Strictly NO PRICE, NO COMMANDER BUTTON) */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10">
        <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-8 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Image Gallery with Floating Action */}
            <div>
              <ProductGallery
                images={product.images}
                productName={product.name}
                onDiscussPrice={handleDiscussPrice}
              />
            </div>

            {/* Essential Info & WhatsApp Price Discussion */}
            <div className="flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                {/* Header: Reference & Availability */}
                <div className="flex items-center justify-between gap-2 text-xs">
                  {product.reference && (
                    <span className="font-mono text-[11px] px-2.5 py-0.5 rounded bg-stone-100 text-stone-600 font-medium">
                      Réf : {product.reference}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded font-medium text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{product.characteristics.availability || 'En stock'}</span>
                  </span>
                </div>

                {/* Name */}
                <h1 className="font-['Playfair_Display',serif] text-2xl sm:text-3xl font-bold text-stone-900 leading-snug">
                  {product.name}
                </h1>

                {/* Short Essential Description */}
                {product.description && (
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed pt-1">
                    {product.description}
                  </p>
                )}

                {/* Sizes or colors if available */}
                {product.characteristics.sizes && product.characteristics.sizes.length > 0 && (
                  <div className="text-xs text-stone-600 flex items-center gap-2 pt-1">
                    <span className="font-semibold text-stone-800">Tailles disponibles :</span>
                    <span>{product.characteristics.sizes.join(', ')}</span>
                  </div>
                )}
              </div>

              {/* ACTION: Discuter le prix sur WhatsApp (Exclusive Action) */}
              <div className="space-y-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={handleDiscussPrice}
                  aria-label={`Discuter le prix de ${product.name} sur WhatsApp`}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] active:scale-98 text-white text-sm font-bold tracking-wide transition-all shadow-md shadow-emerald-950/20 focus:outline-none focus:ring-4 focus:ring-emerald-500/20"
                >
                  <MessageCircle className="w-5 h-5 fill-white/20" />
                  <span>Discuter le prix sur WhatsApp</span>
                </button>

                {/* Discreet Address Notice */}
                {settings.address && (
                  <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-stone-500 text-center">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>Boutique physique : {settings.address} ({settings.city})</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
