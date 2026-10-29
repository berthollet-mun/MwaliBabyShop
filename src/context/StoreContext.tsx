import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Category,
  Product,
  Banner,
  SiteSettings,
  ActivityLog,
  WhatsAppClickEvent,
  User,
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_BANNERS,
  INITIAL_SETTINGS,
  INITIAL_LOGS,
  INITIAL_USERS,
} from '../data/seedData';
import { getDiscussPriceWhatsAppUrl } from '../config/whatsapp';

interface StoreContextType {
  categories: Category[];
  products: Product[];
  banners: Banner[];
  settings: SiteSettings;
  users: User[];
  logs: ActivityLog[];
  totalVisits: number;
  whatsAppClicksTotal: number;
  clickEvents: WhatsAppClickEvent[];
  // Actions
  addProduct: (productData: Omit<Product, 'id' | 'views' | 'whatsappClicks' | 'createdAt' | 'updatedAt'>) => Product;
  updateProduct: (id: string, productData: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleProductFeatured: (id: string) => void;
  toggleProductActive: (id: string) => void;
  incrementProductViews: (id: string) => void;
  // Categories
  addCategory: (catData: Omit<Category, 'id' | 'createdAt'>) => Category;
  updateCategory: (id: string, catData: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  // Banners
  addBanner: (bannerData: Omit<Banner, 'id'>) => Banner;
  updateBanner: (id: string, bannerData: Partial<Banner>) => void;
  deleteBanner: (id: string) => void;
  // Users
  addUser: (userData: Omit<User, 'id' | 'createdAt'>) => User;
  updateUser: (id: string, userData: Partial<User>) => void;
  deleteUser: (id: string) => void;
  // Settings
  updateSettings: (newSettings: Partial<SiteSettings>) => void;
  // WhatsApp helpers
  generateWhatsAppUrl: (product?: Product, customNote?: string) => string;
  generateOrderWhatsAppUrl: (product: Product) => string;
  generateInquiryWhatsAppUrl: (product: Product) => string;
  generateDiscussPriceWhatsAppUrl: (product: Product) => string;
  recordWhatsAppClick: (source: WhatsAppClickEvent['source'], product?: Product) => void;
  // Log
  addLog: (action: string, entityType: ActivityLog['entityType'], details: string) => void;
  // Reset demo data
  resetToDefaultData: () => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

const STORAGE_KEYS = {
  PRODUCTS: 'mwali_products_v7',
  CATEGORIES: 'mwali_categories_v7',
  BANNERS: 'mwali_banners_v7',
  SETTINGS: 'mwali_settings_v7',
  USERS: 'mwali_users_v7',
  LOGS: 'mwali_logs_v7',
  VISITS: 'mwali_visits_v7',
  CLICKS: 'mwali_whatsapp_clicks_v7',
  CLICK_EVENTS: 'mwali_whatsapp_events_v7',
};

// Helper to sanitize any legacy age bracket strings from names
const sanitizeLegacyAgeText = (str: string): string => {
  if (!str) return str;
  return str
    .replace(/\s*\(?0\s*[-–àa]\s*12\s*ans?\)?/gi, '')
    .replace(/\s*de\s*0\s*[-–àa]\s*12\s*ans?/gi, '')
    .replace(/\s*jusqu['’]à\s*12\s*ans/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (saved) {
        const parsed = JSON.parse(saved) as Category[];
        return parsed.map(c => ({
          ...c,
          name: sanitizeLegacyAgeText(c.name),
          description: sanitizeLegacyAgeText(c.description || ''),
        }));
      }
      return INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (saved) {
        const parsed = JSON.parse(saved) as Product[];
        return parsed.map(p => ({
          ...p,
          name: sanitizeLegacyAgeText(p.name),
        }));
      }
      return INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [banners, setBanners] = useState<Banner[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BANNERS);
      if (saved) {
        const parsed = JSON.parse(saved) as Banner[];
        return parsed.map(b => ({
          ...b,
          title: sanitizeLegacyAgeText(b.title),
          subtitle: sanitizeLegacyAgeText(b.subtitle || ''),
        }));
      }
      return INITIAL_BANNERS;
    } catch {
      return INITIAL_BANNERS;
    }
  });

  const [settings, setSettings] = useState<SiteSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) {
        const parsed = JSON.parse(saved) as SiteSettings;
        return {
          ...parsed,
          tagline: sanitizeLegacyAgeText(parsed.tagline || ''),
          aboutText: sanitizeLegacyAgeText(parsed.aboutText || ''),
          heroSubheadline: sanitizeLegacyAgeText(parsed.heroSubheadline || ''),
        };
      }
      return INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USERS);
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  const [logs, setLogs] = useState<ActivityLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LOGS);
      return saved ? JSON.parse(saved) : INITIAL_LOGS;
    } catch {
      return INITIAL_LOGS;
    }
  });

  const [totalVisits, setTotalVisits] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.VISITS);
      return saved ? parseInt(saved, 10) : 1840;
    } catch {
      return 1840;
    }
  });

  const [clickEvents, setClickEvents] = useState<WhatsAppClickEvent[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CLICK_EVENTS);
      return saved ? JSON.parse(saved) : [
        { id: 'ev-1', timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), productName: 'Trousseau Complet de Maternité & Valise de Naissance', source: 'product_detail' },
        { id: 'ev-2', timestamp: new Date(Date.now() - 3600000 * 5).toISOString(), productName: 'Coffret Layette Royal Nouveau-Né 18 Pièces', source: 'quick_card' },
        { id: 'ev-3', timestamp: new Date(Date.now() - 3600000 * 12).toISOString(), productName: 'Gamme de Soins Corps & Visage — Produits de Beauté Authentiques', source: 'product_detail' },
        { id: 'ev-4', timestamp: new Date(Date.now() - 3600000 * 24).toISOString(), source: 'floating_button' },
      ];
    } catch {
      return [];
    }
  });

  // Track session visit count
  useEffect(() => {
    try {
      const hasCountedSession = sessionStorage.getItem('ortance_session_counted');
      if (!hasCountedSession) {
        setTotalVisits(prev => {
          const next = prev + 1;
          localStorage.setItem(STORAGE_KEYS.VISITS, next.toString());
          return next;
        });
        sessionStorage.setItem('ortance_session_counted', 'true');
      }
    } catch {
      // ignore
    }
  }, []);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch (e) { console.error(e); }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) { console.error(e); }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BANNERS, JSON.stringify(banners));
    } catch (e) { console.error(e); }
  }, [banners]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) { console.error(e); }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    } catch (e) { console.error(e); }
  }, [users]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
    } catch (e) { console.error(e); }
  }, [logs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CLICK_EVENTS, JSON.stringify(clickEvents));
    } catch (e) { console.error(e); }
  }, [clickEvents]);

  const addLog = (action: string, entityType: ActivityLog['entityType'], details: string) => {
    const newLog: ActivityLog = {
      id: 'log-' + Date.now(),
      timestamp: new Date().toISOString(),
      userId: 'current-user',
      userName: 'Administration MWALI Baby Shop',
      action,
      entityType,
      details,
    };
    setLogs(prev => [newLog, ...prev.slice(0, 49)]);
  };

  const addProduct = (data: Omit<Product, 'id' | 'views' | 'whatsappClicks' | 'createdAt' | 'updatedAt'>): Product => {
    const newProduct: Product = {
      ...data,
      id: 'prod-' + Date.now(),
      views: 0,
      whatsappClicks: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProducts(prev => [newProduct, ...prev]);
    addLog('Création produit', 'product', `Nouvel article créé : "${data.name}" (${data.reference || 'Sans réf'})`);
    return newProduct;
  };

  const updateProduct = (id: string, data: Partial<Product>) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id === id) {
          const updated = { ...p, ...data, updatedAt: new Date().toISOString() };
          addLog('Mise à jour produit', 'product', `Article modifié : "${updated.name}"`);
          return updated;
        }
        return p;
      })
    );
  };

  const deleteProduct = (id: string) => {
    const prod = products.find(p => p.id === id);
    setProducts(prev => prev.filter(p => p.id !== id));
    if (prod) {
      addLog('Suppression produit', 'product', `Article supprimé : "${prod.name}"`);
    }
  };

  const toggleProductFeatured = (id: string) => {
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, isFeatured: !p.isFeatured } : p))
    );
  };

  const toggleProductActive = (id: string) => {
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, isActive: !p.isActive } : p))
    );
  };

  const incrementProductViews = (id: string) => {
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, views: p.views + 1 } : p))
    );
  };

  const addCategory = (data: Omit<Category, 'id' | 'createdAt'>): Category => {
    const newCat: Category = {
      ...data,
      id: 'cat-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setCategories(prev => [...prev, newCat]);
    addLog('Création catégorie', 'category', `Catégorie ajoutée : "${data.name}"`);
    return newCat;
  };

  const updateCategory = (id: string, data: Partial<Category>) => {
    setCategories(prev =>
      prev.map(c => (c.id === id ? { ...c, ...data } : c))
    );
    addLog('Mise à jour catégorie', 'category', `Catégorie mise à jour.`);
  };

  const deleteCategory = (id: string) => {
    const cat = categories.find(c => c.id === id);
    setCategories(prev => prev.filter(c => c.id !== id));
    if (cat) {
      addLog('Suppression catégorie', 'category', `Catégorie supprimée : "${cat.name}"`);
    }
  };

  const addBanner = (data: Omit<Banner, 'id'>): Banner => {
    const newBanner: Banner = {
      ...data,
      id: 'banner-' + Date.now(),
    };
    setBanners(prev => [...prev, newBanner]);
    addLog('Création bannière', 'banner', `Bannière ajoutée : "${data.title}"`);
    return newBanner;
  };

  const updateBanner = (id: string, data: Partial<Banner>) => {
    setBanners(prev => prev.map(b => (b.id === id ? { ...b, ...data } : b)));
    addLog('Mise à jour bannière', 'banner', `Bannière modifiée.`);
  };

  const deleteBanner = (id: string) => {
    setBanners(prev => prev.filter(b => b.id !== id));
    addLog('Suppression bannière', 'banner', `Bannière supprimée.`);
  };

  const addUser = (userData: Omit<User, 'id' | 'createdAt'>): User => {
    const newUser: User = {
      ...userData,
      id: 'user-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setUsers(prev => [...prev, newUser]);
    addLog('Création utilisateur', 'user', `Nouvel utilisateur : ${newUser.name} (${newUser.role})`);
    return newUser;
  };

  const updateUser = (id: string, userData: Partial<User>) => {
    setUsers(prev => prev.map(u => (u.id === id ? { ...u, ...userData } : u)));
    addLog('Mise à jour utilisateur', 'user', `Utilisateur modifié`);
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    addLog('Suppression utilisateur', 'user', `Utilisateur révoqué`);
  };

  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    addLog('Mise à jour paramètres', 'setting', `Paramètres de la boutique MWALI Baby Shop mis à jour.`);
  };

  const recordWhatsAppClick = (source: WhatsAppClickEvent['source'], product?: Product) => {
    const newEvent: WhatsAppClickEvent = {
      id: 'ev-' + Date.now(),
      timestamp: new Date().toISOString(),
      productId: product?.id,
      productName: product?.name,
      source,
    };
    setClickEvents(prev => [newEvent, ...prev.slice(0, 99)]);

    if (product) {
      setProducts(prev =>
        prev.map(p =>
          p.id === product.id ? { ...p, whatsappClicks: (p.whatsappClicks || 0) + 1 } : p
        )
      );
    }
  };

  const generateWhatsAppUrl = (product?: Product, customNote?: string): string => {
    // International WhatsApp number format: no + or spaces, just digits
    const cleanNumber = (settings.whatsappNumber || '243977807994').replace(/\D/g, '');
    const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://mwalibabyshop.com';
    const storeAddress = settings.address || 'Route pavée, derrière la Mairie de Goma, 4ème entrée à droite, avant Hôtel La Versailles, Goma';

    let textMessage = '';
    if (product) {
      const productPageLink = typeof window !== 'undefined'
        ? `${window.location.origin}/produit/${product.slug}`
        : currentUrl;

      textMessage =
`Bonjour boutique MWALI Baby Shop,

Je vous contacte au sujet de cet article vu sur votre catalogue en ligne :
• Produit : ${product.name}
• Référence : ${product.reference || 'Non spécifiée'}
• Lien de la fiche : ${productPageLink}

📍 Adresse de la boutique notée : ${storeAddress}

Je souhaite connaître le prix et passer commande. Je confirme que notre commande sera validée une fois notre accord mutuel établi. Merci !`;
    } else if (customNote) {
      textMessage = `Bonjour boutique MWALI Baby Shop,\n\n${customNote}\n\nMerci de me renseigner sur vos articles disponibles.`;
    } else {
      textMessage =
`Bonjour boutique MWALI Baby Shop,

Je consulte votre catalogue en ligne (${currentUrl}) et souhaite avoir des renseignements sur vos articles (Maternité, Layette, Mode Enfants, Chaussures & Produits de Beauté), connaître les prix et commander.

📍 Adresse notée : ${storeAddress}
Merci de m'orienter !`;
    }

    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(textMessage)}`;
  };

  const generateOrderWhatsAppUrl = (product: Product): string => {
    const cleanNumber = (settings.whatsappNumber || '243977807994').replace(/\D/g, '');
    const priceText = product.price ? ` — Prix : ${product.price}` : '';
    const refText = product.reference ? ` (Réf: ${product.reference})` : '';
    const textMessage = `Bonjour MWALI Baby Shop,\n\nJe souhaite COMMANDER le produit suivant :\n• Article : ${product.name}${refText}${priceText}\n\nMerci de me confirmer la disponibilité et les modalités de livraison à Goma.`;
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(textMessage)}`;
  };

  const generateInquiryWhatsAppUrl = (product: Product): string => {
    const cleanNumber = (settings.whatsappNumber || '243977807994').replace(/\D/g, '');
    const refText = product.reference ? ` (Réf: ${product.reference})` : '';
    const textMessage = `Bonjour MWALI Baby Shop,\n\nJe souhaite discuter au sujet de cet article :\n• Article : ${product.name}${refText}\n\nPouvez-vous me donner plus de précisions ? Merci !`;
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(textMessage)}`;
  };

  const generateDiscussPriceWhatsAppUrl = (product: Product): string => {
    return getDiscussPriceWhatsAppUrl(product.name, settings.whatsappNumber);
  };

  const resetToDefaultData = () => {
    setCategories(INITIAL_CATEGORIES);
    setProducts(INITIAL_PRODUCTS);
    setBanners(INITIAL_BANNERS);
    setSettings(INITIAL_SETTINGS);
    setUsers(INITIAL_USERS);
    setLogs(INITIAL_LOGS);
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    localStorage.removeItem(STORAGE_KEYS.BANNERS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.LOGS);
  };

  const whatsAppClicksTotal = products.reduce((acc, p) => acc + (p.whatsappClicks || 0), 0) + clickEvents.length;

  return (
    <StoreContext.Provider
      value={{
        categories,
        products,
        banners,
        settings,
        users,
        logs,
        totalVisits,
        whatsAppClicksTotal,
        clickEvents,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductFeatured,
        toggleProductActive,
        incrementProductViews,
        addCategory,
        updateCategory,
        deleteCategory,
        addBanner,
        updateBanner,
        deleteBanner,
        addUser,
        updateUser,
        deleteUser,
        updateSettings,
        generateWhatsAppUrl,
        generateOrderWhatsAppUrl,
        generateInquiryWhatsAppUrl,
        generateDiscussPriceWhatsAppUrl,
        recordWhatsAppClick,
        addLog,
        resetToDefaultData,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
