import React, { useState } from 'react';
import { Sparkles, ImageOff } from 'lucide-react';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  aspectRatio?: string; // e.g. "aspect-[3/4]"
  showPlaceholderIcon?: boolean;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  containerClassName = '',
  aspectRatio,
  showPlaceholderIcon = true,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Default elegant fallback image if broken
  const fallbackSrc = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80';

  return (
    <div
      className={`relative overflow-hidden bg-stone-100 ${aspectRatio || ''} ${containerClassName}`}
    >
      {/* Luxury shimmer skeleton until image is fully loaded */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-stone-100 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/70 to-transparent" />
          {showPlaceholderIcon && (
            <div className="relative z-10 flex flex-col items-center justify-center gap-1.5 opacity-50">
              <Sparkles className="w-5 h-5 text-amber-600/70" />
            </div>
          )}
        </div>
      )}

      {/* Fallback state if image fails */}
      {hasError ? (
        <div className="absolute inset-0 bg-stone-100 flex flex-col items-center justify-center text-stone-400 p-3 text-center">
          <ImageOff className="w-6 h-6 mb-1 text-stone-300" />
          <span className="text-[10px] font-medium text-stone-400">Image en cours de synchronisation</span>
        </div>
      ) : (
        <img
          src={src || fallbackSrc}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            setHasError(true);
            setIsLoaded(true);
          }}
          className={`${className} ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } transition-opacity duration-500 ease-out`}
          {...props}
        />
      )}
    </div>
  );
};
