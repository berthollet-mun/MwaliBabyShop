import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { StoreProvider } from './context/StoreContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { AddressRibbon } from './components/layout/AddressRibbon';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { FloatingWhatsApp } from './components/layout/FloatingWhatsApp';
import { ScrollToTopButton } from './components/layout/ScrollToTopButton';
import { SearchModal } from './components/common/SearchModal';
import { HomePage } from './components/pages/HomePage';
import { CategoryPage } from './components/pages/CategoryPage';
import { ProductDetailPage } from './components/pages/ProductDetailPage';
import { AboutPage } from './components/pages/AboutPage';
import { ContactPage } from './components/pages/ContactPage';
import { LegalPage } from './components/pages/LegalPage';
import { NotFoundPage } from './components/pages/NotFoundPage';
import { AdminPortal } from './components/admin/AdminPortal';
import { AdminLoginPage } from './components/admin/AdminLoginPage';

function AppContent() {
  const { isAuthenticated } = useAuth();
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
    <div className="flex flex-col min-h-screen bg-[#FAFAFA] text-stone-900 font-['Plus_Jakarta_Sans',sans-serif] selection:bg-amber-200 selection:text-stone-900">
      {/* 1. Address & Contact Ribbon (Ultra visible at the very top) */}
      <AddressRibbon />

      {/* 2. Responsive Luxury Navigation */}
      <Navbar
        currentPath={currentPath}
        navigate={navigate}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

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

      {/* 5. Floating WhatsApp Button (Fixed bottom right) */}
      <FloatingWhatsApp />

      {/* 6. Discreet Luxury Scroll To Top Button */}
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
          <AppContent />
        </ToastProvider>
      </AuthProvider>
    </StoreProvider>
  );
}
