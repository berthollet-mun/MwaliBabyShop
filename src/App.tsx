import React, { lazy, Suspense, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { StoreProvider, useStore } from './context/StoreContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { AddressRibbon } from './components/layout/AddressRibbon';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ScrollToTopButton } from './components/layout/ScrollToTopButton';
import { SearchModal } from './components/common/SearchModal';
import { HomePage } from './components/pages/HomePage';
import { CategoryPage } from './components/pages/CategoryPage';
import { ProductDetailPage } from './components/pages/ProductDetailPage';
import { AboutPage } from './components/pages/AboutPage';
import { ContactPage } from './components/pages/ContactPage';
import { LegalPage } from './components/pages/LegalPage';
import { NotFoundPage } from './components/pages/NotFoundPage';

const AdminPortal = lazy(() => import('./components/admin/AdminPortal').then(module => ({ default: module.AdminPortal })));
const AdminLoginPage = lazy(() => import('./components/admin/AdminLoginPage').then(module => ({ default: module.AdminLoginPage })));

const AppFallback = () => (
  <div className="min-h-screen grid place-items-center bg-[#fff8fb] text-[#32144f] text-sm font-semibold">Chargement de MWALI Baby Shop…</div>
);

function AppContent() {
  const { isAuthenticated, isCheckingSession } = useAuth();
  const { apiError, refreshStorefront } = useStore();
  const [currentPath, setCurrentPath] = useState<string>(() => {
    // Initial path from hash or pathname
    const hash = window.location.hash.replace(/^#/, '');
    return hash || window.location.pathname || '/';
  });

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Sync route on popstate and hashchange
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.replace(/^#/, '');
      const path = hash || window.location.pathname || '/';
      setCurrentPath(path);
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const navigate = (path: string) => {
    setCurrentPath(path);
    window.location.hash = path;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Check if we are in admin mode
  const isAdminRoute = currentPath.startsWith('/admin');

  if (isAdminRoute && isCheckingSession) {
    return (
      <div className="min-h-screen grid place-items-center bg-[#24103f] text-white" role="status" aria-live="polite">
        <div className="text-center space-y-3">
          <div className="mx-auto h-10 w-10 rounded-full border-4 border-white/25 border-t-[#e83c78] animate-spin" />
          <p className="text-sm font-semibold">Vérification de la session sécurisée…</p>
        </div>
      </div>
    );
  }

  if (isAdminRoute) {
    if (!isAuthenticated) {
      return (
        <AnimatePresence mode="wait">
          <motion.div
            key="admin-login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <AdminLoginPage onBackToSite={() => navigate('/')} />
          </motion.div>
        </AnimatePresence>
      );
    }
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="admin-portal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          <AdminPortal onNavigateHome={() => navigate('/')} />
        </motion.div>
      </AnimatePresence>
    );
  }

  // Public View Router
  const renderPublicPage = () => {
    // 1. Home
    if (currentPath === '/' || currentPath === '') {
      return <HomePage onNavigate={navigate} />;
    }

    // 2. Category: /categorie/:slug
    if (currentPath.startsWith('/categorie/')) {
      const slug = currentPath.replace('/categorie/', '').split('?')[0];
      return <CategoryPage slug={slug} onNavigate={navigate} />;
    }

    // 3. Product: /produit/:slug
    if (currentPath.startsWith('/produit/')) {
      const slug = currentPath.replace('/produit/', '').split('?')[0];
      return <ProductDetailPage slug={slug} onNavigate={navigate} />;
    }

    // 4. About
    if (currentPath === '/a-propos') {
      return <AboutPage onNavigate={navigate} />;
    }

    // 5. Contact
    if (currentPath === '/contact') {
      return <ContactPage />;
    }

    // 6. Mentions légales / conditions
    if (currentPath === '/mentions-legales') {
      return <LegalPage onNavigate={navigate} />;
    }

    // 7. Not Found fallback
    return <NotFoundPage onNavigate={navigate} />;
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fffafc] text-[#261d2c] font-['Plus_Jakarta_Sans',sans-serif] selection:bg-[#f8a9c4] selection:text-[#2d1148]">
      {/* 1. Address & Contact Ribbon (Ultra visible at the very top) */}
      <AddressRibbon />

      {/* 2. Responsive Luxury Navigation */}
      <Navbar
        currentPath={currentPath}
        navigate={navigate}
        onOpenSearch={() => setIsSearchOpen(true)}
      />


      {apiError && (
        <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-amber-950" role="alert">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-2 text-xs sm:flex-row sm:items-center">
            <span>{apiError}</span>
            <button
              type="button"
              onClick={() => void refreshStorefront()}
              className="rounded-full bg-white px-3 py-1 font-bold text-[#5a237a] shadow-sm ring-1 ring-[#5a237a]/20 hover:bg-[#fff8fb]"
            >
              Réessayer
            </button>
          </div>
        </div>
      )}
      {/* 3. Main Page Body with smooth luxury Fade-in entry */}
      <main className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPath}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="w-full flex-1 flex flex-col"
          >
            {renderPublicPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 4. Luxury Footer */}
      <Footer navigate={navigate} />

      {/* 5. Discreet Luxury Scroll To Top Button */}
      <ScrollToTopButton />

      {/* 7. Instant Catalog Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        navigate={navigate}
      />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AuthProvider>
        <ToastProvider>
          <Suspense fallback={<AppFallback />}>
            <AppContent />
          </Suspense>
        </ToastProvider>
      </AuthProvider>
    </StoreProvider>
  );
}
