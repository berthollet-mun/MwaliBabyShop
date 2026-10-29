import React, { useState } from 'react';
import { Maximize2, X, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
import { LazyImage } from '../common/LazyImage';

interface ProductGalleryProps {
  images: string[];
  productName: string;
  onDiscussPrice?: () => void;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  images,
  productName,
  onDiscussPrice,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);

  const displayImages = images.length > 0 ? images : ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900'];
  const currentImage = displayImages[selectedIndex] || displayImages[0];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIndex(prev => (prev - 1 + displayImages.length) % displayImages.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIndex(prev => (prev + 1) % displayImages.length);
  };

  return (
    <div className="space-y-4">
      {/* Main Image Display with LazyImage */}
      <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-stone-100 border border-stone-200/80 group">
        <LazyImage
          src={currentImage}
          alt={`${productName} - Vue ${selectedIndex + 1}`}
          containerClassName="w-full h-full"
          className="w-full h-full object-cover object-center transition-all duration-300"
        />

        {/* Soft darken overlay on desktop hover */}
        <div className="absolute inset-0 bg-black/20 opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Fullscreen Trigger */}
        <button
          onClick={() => setFullscreenOpen(true)}
          className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 hover:bg-white text-stone-800 shadow-md transition-all opacity-90 hover:opacity-100 focus:outline-none z-10"
          title="Agrandir l'image"
          aria-label="Agrandir l'image"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Carousel arrows if more than 1 image (visible on mobile, hover on desktop) */}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 hover:bg-white text-stone-800 shadow-md transition-all sm:opacity-0 sm:group-hover:opacity-100 focus:outline-none z-10"
              aria-label="Image précédente"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 hover:bg-white text-stone-800 shadow-md transition-all sm:opacity-0 sm:group-hover:opacity-100 focus:outline-none z-10"
              aria-label="Image suivante"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Image count pill */}
        <div className="absolute top-4 left-4 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-medium z-10">
          {selectedIndex + 1} / {displayImages.length}
        </div>

        {/* Floating "Discuter le prix sur WhatsApp" Button
            - Mobile: visible en permanence
            - Desktop: apparaît au survol avec transition fluide fade-in / slide-up
        */}
        {onDiscussPrice && (
          <div className="absolute inset-x-3 bottom-3 z-20 flex justify-center">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDiscussPrice();
              }}
              aria-label={`Discuter le prix de ${productName} sur WhatsApp`}
              className="w-full sm:w-auto sm:px-6 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] active:scale-95 text-white text-xs sm:text-sm font-bold tracking-tight shadow-lg shadow-emerald-950/30 transition-all duration-300 ease-out opacity-100 translate-y-0 sm:opacity-0 sm:translate-y-2 sm:group-hover:opacity-100 sm:group-hover:translate-y-0 sm:focus:opacity-100 sm:focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-white"
            >
              <MessageCircle className="w-4 h-4 fill-white/20 shrink-0" />
              <span>Discuter le prix sur WhatsApp</span>
            </button>
          </div>
        )}
      </div>

      {/* Thumbnails Row */}
      {displayImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {displayImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`relative flex-shrink-0 w-20 h-24 rounded-xl overflow-hidden border-2 transition-all ${
                selectedIndex === idx
                  ? 'border-stone-900 ring-2 ring-stone-900/10 scale-105'
                  : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={img}
                alt={`Miniature ${idx + 1}`}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {fullscreenOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setFullscreenOpen(false)}
        >
          <button
            onClick={() => setFullscreenOpen(false)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Fermer le plein écran"
          >
            <X className="w-6 h-6" />
          </button>

          <img
            src={currentImage}
            alt={productName}
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};
