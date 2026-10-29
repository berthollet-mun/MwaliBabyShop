import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Appear smoothly after 380px of scrolling down
          if (window.scrollY > 380) {
            setIsVisible(true);
          } else {
            setIsVisible(false);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Check initial position
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.85 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-22 right-6 sm:bottom-24 sm:right-6 z-40"
        >
          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Retour en haut de page"
            className="group relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 hover:bg-white text-stone-700 hover:text-stone-950 border border-stone-200/90 shadow-md hover:shadow-lg backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
          >
            <ArrowUp className="w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform duration-200 group-hover:-translate-y-0.5 text-stone-700 group-hover:text-stone-950" />

            {/* Discreet Tooltip on Desktop Hover */}
            <span className="pointer-events-none absolute -top-8 right-1/2 translate-x-1/2 px-2 py-0.5 rounded-md bg-stone-900 text-white text-[10px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-sm hidden sm:block">
              Haut de page
            </span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
