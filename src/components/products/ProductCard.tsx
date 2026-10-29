import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { useToast } from '../../context/ToastContext';
import { LazyImage } from '../common/LazyImage';

interface ProductCardProps {
  product: Product;
  onNavigate: (path: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onNavigate }) => {
  const { generateDiscussPriceWhatsAppUrl, recordWhatsAppClick } = useStore();
  const { showWhatsApp } = useToast();

  const handleDetail = () => {
    onNavigate(`/produit/${product.slug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDiscussPrice = (e: React.MouseEvent) => {
    e.stopPropagation();
    recordWhatsAppClick('discuss_price', product);
    showWhatsApp(
      'Discussion WhatsApp...',
      `Ouverture de la discussion pour négocier le prix de "${product.name}".`
    );
    window.open(generateDiscussPriceWhatsAppUrl(product), '_blank', 'noopener,noreferrer');
  };

  return (
    <article className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-stone-200/90 shadow-xs hover:shadow-md transition-shadow">
      {/* Product Image & Floating WhatsApp Action */}
      <div
        onClick={handleDetail}
        className="relative aspect-square w-full overflow-hidden bg-stone-100 cursor-pointer group/img"
      >
        <LazyImage
          src={product.images[0] || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600'}
          alt={product.name}
          containerClassName="w-full h-full"
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Soft darken overlay on desktop hover to make the floating button stand out */}
        <div className="absolute inset-0 bg-black/25 opacity-0 sm:group-hover/img:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Discreet Reference Tag */}
        {product.reference && (
          <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-white/95 backdrop-blur-xs text-stone-700 text-[10px] font-mono font-medium shadow-xs pointer-events-none z-10">
            {product.reference}
          </span>
        )}

        {/* Floating "Discuter le prix sur WhatsApp" Button
            - Mobile: visible en permanence
            - Desktop: apparaît au survol de l'image avec animation fluide fade-in / slide-up
        */}
        <div className="absolute inset-x-2.5 bottom-2.5 z-20">
          <button
            type="button"
            onClick={handleDiscussPrice}
            aria-label={`Discuter le prix de ${product.name} sur WhatsApp`}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] active:scale-95 text-white text-xs font-bold tracking-tight shadow-md shadow-emerald-950/25 transition-all duration-300 ease-out opacity-100 translate-y-0 sm:opacity-0 sm:translate-y-2 sm:group-hover/img:opacity-100 sm:group-hover/img:translate-y-0 sm:focus:opacity-100 sm:focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-white"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-white/20 shrink-0" />
            <span className="truncate">Discuter le prix sur WhatsApp</span>
          </button>
        </div>
      </div>

      {/* Product Info (Name & Availability only — strictly NO PRICE, NO COMMANDER BUTTON) */}
      <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between">
        <div onClick={handleDetail} className="cursor-pointer space-y-1.5">
          <h3 className="text-xs sm:text-sm font-semibold text-stone-900 line-clamp-2 leading-snug group-hover:text-amber-800 transition-colors">
            {product.name}
          </h3>

          <div className="flex items-center justify-between pt-0.5">
            <span className="text-[10px] sm:text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              {product.characteristics.availability || 'En stock'}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};
