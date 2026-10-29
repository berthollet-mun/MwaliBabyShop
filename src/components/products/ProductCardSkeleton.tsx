import React from 'react';

interface ProductCardSkeletonProps {
  className?: string;
}

export const ProductCardSkeleton: React.FC<ProductCardSkeletonProps> = ({ className = '' }) => {
  return (
    <article
      className={`relative flex flex-col bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-xs select-none ${className}`}
      aria-hidden="true"
    >
      {/* Image Skeleton Box with Shimmer */}
      <div className="relative aspect-square w-full overflow-hidden bg-stone-100">
        <div className="absolute inset-0 bg-gradient-to-b from-stone-100 via-stone-100/60 to-stone-200/50" />
        {/* Shimmer sweep */}
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/80 to-transparent" />

        {/* Top Reference Tag Placeholder */}
        <div className="absolute top-2.5 left-2.5 z-10">
          <div className="h-4 w-14 rounded bg-stone-200/80" />
        </div>

        {/* Floating Button Placeholder on Image */}
        <div className="absolute inset-x-2.5 bottom-2.5 z-10">
          <div className="h-8 w-full rounded-xl bg-stone-200/70" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between space-y-2">
        <div className="space-y-1.5">
          {/* Title Lines */}
          <div className="h-3.5 w-4/5 rounded bg-stone-200" />
          <div className="h-3 w-3/5 rounded bg-stone-100" />
        </div>

        {/* Stock status placeholder */}
        <div className="pt-1">
          <div className="h-4 w-16 rounded bg-emerald-100/70" />
        </div>
      </div>
    </article>
  );
};

interface ProductGridSkeletonProps {
  count?: number;
  className?: string;
}

export const ProductGridSkeleton: React.FC<ProductGridSkeletonProps> = ({
  count = 8,
  className = 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6',
}) => {
  return (
    <div className={className} aria-busy="true" aria-label="Chargement des articles...">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={`skeleton-${index}`} />
      ))}
    </div>
  );
};
