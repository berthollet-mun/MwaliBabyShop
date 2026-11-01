import React from 'react';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'motion/react';
import { useStore } from '../../context/StoreContext';
import { LazyImage } from '../common/LazyImage';
import type { Category } from '../../types';

interface CategoryGridProps {
  onNavigate: (path: string) => void;
}

interface AnimatedCategoryCardProps {
  category: Category;
  count: number;
  index: number;
  onNavigate: (path: string) => void;
}

const AnimatedCategoryCard: React.FC<AnimatedCategoryCardProps> = ({
  category,
  count,
  index,
  onNavigate,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotateX = useSpring(useTransform(pointerY, [-0.5, 0.5], [7, -7]), {
    stiffness: 260,
    damping: 24,
  });
  const rotateY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-8, 8]), {
    stiffness: 260,
    damping: 24,
  });

  const handlePointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (shouldReduceMotion || event.pointerType !== 'mouse') return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const resetTilt = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  const openCategory = () => {
    onNavigate(`/categorie/${category.slug}`);
    window.scrollTo({ top: 0, behavior: shouldReduceMotion ? 'auto' : 'smooth' });
  };

  return (
    <motion.button
      type="button"
      onClick={openCategory}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 72, scale: 0.86, rotate: index % 2 === 0 ? -3 : 3 }}
      animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
      transition={{
        delay: shouldReduceMotion ? 0 : 0.42 + index * 0.12,
        type: 'spring',
        stiffness: 105,
        damping: 16,
        mass: 0.8,
      }}
      whileHover={shouldReduceMotion ? undefined : { y: -12, scale: 1.018 }}
      whileTap={{ scale: 0.965 }}
      style={shouldReduceMotion ? undefined : { rotateX, rotateY, transformPerspective: 1000 }}
      className="mwali-category-card group relative flex flex-col overflow-hidden rounded-[1.35rem] bg-white text-left focus:outline-none"
      aria-label={`Découvrir ${category.name}, ${count} ${count > 1 ? 'articles' : 'article'}`}
    >
      <div className="relative aspect-[3/4] sm:aspect-[4/5] w-full overflow-hidden">
        <motion.div
          className="h-full w-full"
          whileHover={shouldReduceMotion ? undefined : { scale: 1.09 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <LazyImage
            src={category.image || 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600'}
            alt={category.name}
            containerClassName="w-full h-full"
            className="h-full w-full object-cover object-center"
          />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-t from-[#170823]/95 via-[#2d1148]/20 to-transparent pointer-events-none" />
        <div className="mwali-card-sheen pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 rotate-[12deg] bg-gradient-to-r from-transparent via-white/55 to-transparent blur-sm" />
        <div className="pointer-events-none absolute inset-0 rounded-[1.35rem] ring-1 ring-inset ring-white/25" />

        <motion.div
          className="absolute right-3 top-3 z-10"
          initial={{ opacity: 0, scale: 0, rotate: -30 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.55 + index * 0.08, type: 'spring', stiffness: 280, damping: 17 }}
        >
          <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/35 px-2 py-1 text-[9px] font-bold text-white shadow-lg backdrop-blur-md sm:text-[10px]">
            <Sparkles className="h-2.5 w-2.5 text-[#ff8fb5]" />
            {count} {count > 1 ? 'articles' : 'article'}
          </span>
        </motion.div>

        <div className="absolute inset-x-2.5 bottom-2.5 z-10 flex items-end justify-between gap-2 sm:inset-x-3 sm:bottom-3">
          <span className="min-w-0 rounded-full border border-white/40 bg-white/95 px-2.5 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.08em] text-stone-900 shadow-xl backdrop-blur-md transition-colors duration-300 group-hover:bg-[#2d1148] group-hover:text-white sm:px-3 sm:text-[11px]">
            <span className="block truncate">{category.name}</span>
          </span>
          <motion.span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-stone-900 shadow-xl sm:h-9 sm:w-9"
            whileHover={shouldReduceMotion ? undefined : { rotate: 45, scale: 1.12, backgroundColor: '#e83c78', color: '#ffffff' }}
            transition={{ type: 'spring', stiffness: 320, damping: 18 }}
          >
            <ArrowUpRight className="h-4 w-4" />
          </motion.span>
        </div>
      </div>

      <div className="relative w-full overflow-hidden border-t border-[#f2e4eb] bg-white p-3">
        <p className="line-clamp-1 text-[10px] text-stone-500 sm:text-[11px]">
          {category.description || 'Découvrir la sélection'}
        </p>
        <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-[#e83c78] to-[#5a237a] transition-all duration-500 group-hover:w-full" />
      </div>
    </motion.button>
  );
};

export const CategoryGrid: React.FC<CategoryGridProps> = ({ onNavigate }) => {
  const { categories, products, isLoading } = useStore();
  const shouldReduceMotion = useReducedMotion();
  const activeCategories = categories.filter(c => c.isActive).sort((a, b) => a.order - b.order);

  const getProductCount = (catId: string) => {
    return products.filter(p => p.categoryId === catId && p.isActive).length;
  };

  return (
    <section className="mwali-catalog-stage relative flex-1 overflow-hidden py-12 sm:py-20 lg:py-24">
      <div className="mwali-grid-drift pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
      <div className="mwali-orb mwali-orb-one pointer-events-none absolute" aria-hidden="true" />
      <div className="mwali-orb mwali-orb-two pointer-events-none absolute" aria-hidden="true" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-4/5 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#e83c78]/40 to-transparent" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-9 sm:mb-12"
        >
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08, duration: 0.65 }}
            className="mb-3 flex items-center gap-3"
          >
            <span className="h-px w-8 bg-[#e83c78] sm:w-12" />
            <span className="text-[10px] font-extrabold uppercase tracking-[0.32em] text-[#8a2c65] sm:text-xs">
              L’univers MWALI
            </span>
            <Sparkles className="mwali-spark h-4 w-4 text-[#e83c78]" />
          </motion.div>

          <h1 className="font-['Playfair_Display',serif] text-[2rem] font-bold leading-[1.05] tracking-tight text-stone-950 sm:text-5xl lg:text-6xl">
            {['Catalogues', 'par', 'Catégorie'].map((word, index) => (
              <motion.span
                key={word}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 42, rotateX: -70 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.16 + index * 0.1, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                className={index === 2 ? 'mwali-title-shine mr-[0.22em] inline-block' : 'mr-[0.22em] inline-block'}
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.55, duration: 0.7 }}
            className="mt-3 max-w-xl text-xs leading-relaxed text-stone-500 sm:text-sm"
          >
            Touchez une collection et entrez dans son univers.
          </motion.p>
        </motion.div>

        <motion.div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-5 lg:gap-6">
          {isLoading && Array.from({ length: 5 }).map((_, index) => (
            <div key={`category-skeleton-${index}`} className="overflow-hidden rounded-[1.35rem] border border-[#eedfe7] bg-white" aria-hidden="true">
              <div className="relative aspect-[3/4] overflow-hidden bg-[#f8eaf1] sm:aspect-[4/5]">
                <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/70 to-transparent" />
              </div>
              <div className="space-y-2 p-3">
                <div className="h-3 w-4/5 rounded-full bg-[#f1dce7]" />
                <div className="h-2.5 w-2/3 rounded-full bg-[#f6e8ef]" />
              </div>
            </div>
          ))}
          {!isLoading && activeCategories.map((category, index) => (
            <AnimatedCategoryCard
              key={category.id}
              category={category}
              count={getProductCount(category.id)}
              index={index}
              onNavigate={onNavigate}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};
