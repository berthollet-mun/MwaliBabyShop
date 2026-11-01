import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Search, Menu, X, ShieldCheck, ChevronRight, ChevronLeft } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  currentPath: string;
  navigate: (path: string) => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, navigate, onOpenSearch }) => {
  const { categories, settings } = useStore();
  const { isAuthenticated, currentUser, role } = useAuth();
  const shouldReduceMotion = useReducedMotion();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Scroll rail controls for categories on desktop
  const navRailRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const activeCategories = categories.filter(c => c.isActive).sort((a, b) => a.order - b.order);

  // Check scroll position to display left/right navigation arrows dynamically
  const checkScroll = useCallback(() => {
    const el = navRailRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 4);
    // Allow a small 4px margin of error for rounding
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = navRailRef.current;
    if (!el) return;

    const resizeObserver = new ResizeObserver(() => {
      checkScroll();
    });
    resizeObserver.observe(el);
    window.addEventListener('resize', checkScroll);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll, activeCategories.length]);

  const scrollNav = (direction: 'left' | 'right') => {
    const el = navRailRef.current;
    if (!el) return;
    const scrollAmount = direction === 'left' ? -220 : 220;
    el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    setTimeout(checkScroll, 250);
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const el = navRailRef.current;
    if (!el) return;
    if (Math.abs(e.deltaX) > 0) return; // already horizontal
    if (e.deltaY !== 0) {
      el.scrollBy({ left: e.deltaY, behavior: 'auto' });
      checkScroll();
    }
  };

  const handleNav = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.header
      initial={shouldReduceMotion ? false : { opacity: 0, y: -42 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12, duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
      className="mwali-navbar sticky top-0 z-40 border-b border-stone-200 bg-white/90 backdrop-blur-xl transition-all"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-3 xl:gap-4">
          
          {/* Mobile menu & search triggers (Hidden on lg+) */}
          <div className="flex items-center lg:hidden space-x-0.5 shrink-0">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-700 hover:text-black rounded-lg focus:outline-none"
              aria-label="Ouvrir le menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
            <button
              onClick={onOpenSearch}
              className="p-2 text-stone-600 hover:text-black rounded-lg"
              aria-label="Rechercher"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* 1. BRAND LOGO — Incompressible (shrink-0) to never be crushed or truncated */}
          <div className="flex items-center shrink-0">
            <button
              onClick={() => handleNav('/')}
              className="group flex flex-col text-left focus:outline-none shrink-0"
            >
              <span className="font-['Playfair_Display',serif] text-xl sm:text-2xl lg:text-2xl xl:text-3xl font-bold tracking-[0.12em] sm:tracking-[0.15em] text-stone-900 group-hover:text-[#5a237a] transition-colors whitespace-nowrap">
                {settings.companyName}
              </span>
              <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-stone-500 font-medium -mt-0.5 hidden min-[480px]:block whitespace-nowrap">
                Maternité • Layette • Enfants & Beauté
              </span>
            </button>
          </div>

          {/* 2. DYNAMIC CATEGORIES RAIL — Adapts to remaining space (flex-1 min-w-0) without EVER overflowing into Logo or Actions */}
          <div className="hidden lg:flex items-center flex-1 min-w-0 mx-2 xl:mx-4 relative overflow-hidden">
            
            {/* Left Chevron Gradient Mask */}
            {canScrollLeft && (
              <div className="absolute left-0 top-0 bottom-0 z-20 flex items-center pr-3 bg-gradient-to-r from-white via-white/90 to-transparent">
                <button
                  type="button"
                  onClick={() => scrollNav('left')}
                  className="flex items-center justify-center w-6 h-6 rounded-full bg-[#5a237a] text-white shadow-md hover:bg-[#2d1148] transition-all active:scale-95"
                  title="Catégories précédentes"
                  aria-label="Défiler vers la gauche"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Scrollable Categories List */}
            <nav
              ref={navRailRef}
              onScroll={checkScroll}
              onWheel={handleWheel}
              className="flex items-center gap-1 xl:gap-1.5 overflow-x-auto scrollbar-none py-1 scroll-smooth w-full px-1"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              aria-label="Navigation des catégories"
            >
              <button
                type="button"
                onClick={() => handleNav('/')}
                className={`shrink-0 px-2.5 py-1.5 xl:px-3 rounded-full text-[11px] xl:text-xs font-semibold tracking-wider uppercase transition-all whitespace-nowrap ${
                  currentPath === '/'
                    ? 'bg-[#5a237a] text-white shadow-sm'
                    : 'text-stone-700 hover:text-stone-950 hover:bg-stone-100'
                }`}
              >
                Accueil
              </button>

              {activeCategories.map(cat => {
                const catPath = `/categorie/${cat.slug}`;
                const isActive = currentPath === catPath;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleNav(catPath)}
                    title={cat.name}
                    className={`shrink-0 max-w-[130px] xl:max-w-[170px] 2xl:max-w-[200px] truncate px-2.5 py-1.5 xl:px-3 rounded-full text-[11px] xl:text-xs font-semibold tracking-wider uppercase transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-[#5a237a] text-white shadow-sm'
                        : 'text-stone-700 hover:text-stone-950 hover:bg-stone-100'
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </nav>

            {/* Right Chevron Gradient Mask */}
            {canScrollRight && (
              <div className="absolute right-0 top-0 bottom-0 z-20 flex items-center pl-3 bg-gradient-to-l from-white via-white/90 to-transparent">
                <button
                  type="button"
                  onClick={() => scrollNav('right')}
                  className="flex items-center justify-center w-6 h-6 rounded-full bg-[#5a237a] text-white shadow-md hover:bg-[#2d1148] transition-all active:scale-95"
                  title="Catégories suivantes"
                  aria-label="Défiler vers la droite"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* 3. RIGHT ACTIONS — Incompressible (shrink-0) to never be squished or collided */}
          <div className="flex items-center space-x-1.5 sm:space-x-2.5 shrink-0 z-10">
            {/* Desktop Search Button */}
            <button
              type="button"
              onClick={onOpenSearch}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 xl:px-3 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs font-medium transition-colors border border-stone-200/80 shrink-0 whitespace-nowrap"
              title="Rechercher un article (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Rechercher...</span>
              <kbd className="hidden 2xl:inline-block px-1.5 py-0.5 text-[10px] bg-white border border-stone-300 rounded text-stone-400 font-mono">
                ⌘K
              </kbd>
            </button>

            {/* Admin Portal Button */}
            <button
              type="button"
              onClick={() => handleNav(isAuthenticated ? '/admin' : '/admin/login')}
              className={`flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full border transition-all shrink-0 ${
                isAuthenticated
                  ? 'bg-[#5a237a] border-stone-900 text-[#ff8fb5] shadow-sm ring-1 ring-[#e83c78]/40'
                  : 'border-stone-200/90 bg-stone-50 hover:bg-stone-100 text-stone-700 hover:border-stone-300 shadow-sm'
              }`}
              title={isAuthenticated ? `Connecté : ${currentUser?.name} (${role})` : 'Espace Administration MWALI Baby Shop'}
              aria-label="Espace Administration"
            >
              <ShieldCheck className="w-4 h-4 text-[#e83c78]" />
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0, y: -18 }}
          animate={{ opacity: 1, height: 'auto', y: 0 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0, y: -12 }}
          transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
          className="max-h-[80vh] space-y-3 overflow-y-auto border-t border-stone-200 bg-white px-4 pb-6 pt-3 shadow-xl lg:hidden"
        >
          <div className="text-[11px] uppercase tracking-widest text-stone-400 font-bold px-2">
            Catalogue & Catégories
          </div>

          <div className="grid grid-cols-1 gap-1">
            <button
              type="button"
              onClick={() => handleNav('/')}
              className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm font-medium ${
                currentPath === '/' ? 'bg-stone-100 text-stone-950 font-semibold' : 'text-stone-700'
              }`}
            >
              <span>Accueil & Nouveautés</span>
              <ChevronRight className="w-4 h-4 text-stone-400" />
            </button>

            {activeCategories.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleNav(`/categorie/${cat.slug}`)}
                className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm font-medium ${
                  currentPath === `/categorie/${cat.slug}`
                    ? 'bg-stone-100 text-stone-950 font-semibold'
                    : 'text-stone-700'
                }`}
              >
                <span>{cat.name}</span>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-stone-100 space-y-1">
            <button
              type="button"
              onClick={() => handleNav(isAuthenticated ? '/admin' : '/admin/login')}
              className="flex items-center justify-between w-full px-3 py-2 text-sm text-stone-600 hover:text-black"
            >
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-stone-500" />
                Espace Administration
              </span>
              {isAuthenticated && (
                <span className="px-2 py-0.5 text-[10px] bg-[#5a237a] text-white rounded">
                  {role}
                </span>
              )}
            </button>
          </div>
        </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
