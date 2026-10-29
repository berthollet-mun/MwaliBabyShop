import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MessageCircle, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface HeroCarouselProps {
  onNavigate: (path: string) => void;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ onNavigate }) => {
  const { banners, generateWhatsAppUrl, recordWhatsAppClick } = useStore();
  const activeBanners = banners.filter(b => b.isActive).sort((a, b) => a.order - b.order);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (activeBanners.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % activeBanners.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [activeBanners.length, isPaused]);

  if (activeBanners.length === 0) return null;

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + activeBanners.length) % activeBanners.length);
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % activeBanners.length);
  };

  const handleWhatsApp = () => {
    recordWhatsAppClick('header');
    window.open(generateWhatsAppUrl(undefined, 'Bonjour, je souhaite des informations sur les articles en bannière.'), '_blank', 'noopener,noreferrer');
  };

  return (
    <section
      aria-label="Carrousel des collections en vedette"
      className="relative w-full overflow-hidden bg-stone-900 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative h-[440px] min-[480px]:h-[480px] sm:h-[520px] lg:h-[600px] xl:h-[650px] w-full">
        {activeBanners.map((banner, idx) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Background image with cinematic gradient */}
            <img
              src={banner.image}
              alt={banner.title}
              loading={idx === 0 ? 'eager' : 'lazy'}
              decoding="async"
              className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-10000"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/35" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />

            {/* Content box */}
            <div className="relative z-20 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
              <div className="max-w-2xl space-y-3 sm:space-y-5 text-white">
                {banner.badge && (
                  <span className="inline-flex items-center px-3 py-0.5 sm:px-3.5 sm:py-1 rounded-full bg-amber-500/95 text-stone-950 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] shadow-lg">
                    {banner.badge}
                  </span>
                )}

                <h1 className="font-['Playfair_Display',serif] text-2xl min-[420px]:text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
                  {banner.title}
                </h1>

                {banner.subtitle && (
                  <p className="text-stone-300 text-xs sm:text-base lg:text-lg max-w-xl font-light leading-relaxed line-clamp-3 sm:line-clamp-none">
                    {banner.subtitle}
                  </p>
                )}

                <div className="pt-2 flex flex-col min-[480px]:flex-row items-stretch min-[480px]:items-center gap-2.5 sm:gap-4">
                  {banner.link && (
                    <button
                      onClick={() => onNavigate(banner.link!)}
                      className="flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-white text-stone-900 text-xs sm:text-sm font-bold uppercase tracking-wider hover:bg-stone-100 transition-all active:scale-95 shadow-md"
                    >
                      <span>Explorer la sélection</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    onClick={handleWhatsApp}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-all active:scale-95 shadow-md"
                  >
                    <MessageCircle className="w-4 h-4 fill-white/20" />
                    <span>Commander sur WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Controls */}
      {activeBanners.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="hidden sm:flex absolute left-3 md:left-4 top-1/2 -translate-y-1/2 z-30 p-2.5 md:p-3 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-sm border border-white/20 transition-all focus:outline-none"
            aria-label="Diapositive précédente"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="hidden sm:flex absolute right-3 md:right-4 top-1/2 -translate-y-1/2 z-30 p-2.5 md:p-3 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-sm border border-white/20 transition-all focus:outline-none"
            aria-label="Diapositive suivante"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-6 inset-x-0 z-30 flex justify-center items-center gap-2">
            {activeBanners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 transition-all rounded-full ${
                  idx === currentIndex ? 'w-8 bg-amber-400' : 'w-2 bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Aller à la diapositive ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};
