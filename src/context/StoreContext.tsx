import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ActivityLog, Banner, Category, Product, SiteSettings, User, WhatsAppClickEvent } from '../types';
import { INITIAL_BANNERS, INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_SETTINGS } from '../data/seedData';
import { getDiscussPriceWhatsAppUrl } from '../config/whatsapp';
import { api } from '../lib/api';

interface StorefrontPayload {
  categories: Category[];
  products: Product[];
  banners: Banner[];
  settings: SiteSettings;
}

interface AdminPayload extends StorefrontPayload {
  users: User[];
  logs: ActivityLog[];
  totalVisits: number;
  clickEvents: WhatsAppClickEvent[];
}

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
  isLoading: boolean;
  refreshStorefront: () => Promise<void>;
  apiError: string | null;
  refreshAdminData: () => Promise<void>;
  addProduct: (data: Omit<Product, 'id' | 'views' | 'whatsappClicks' | 'createdAt' | 'updatedAt'>) => Promise<Product>;
  updateProduct: (id: string, data: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  toggleProductFeatured: (id: string) => Promise<void>;
  toggleProductActive: (id: string) => Promise<void>;
  incrementProductViews: (id: string) => void;
  addCategory: (data: Omit<Category, 'id' | 'createdAt'>) => Promise<Category>;
  updateCategory: (id: string, data: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  addBanner: (data: Omit<Banner, 'id'>) => Promise<Banner>;
  updateBanner: (id: string, data: Partial<Banner>) => Promise<void>;
  deleteBanner: (id: string) => Promise<void>;
  addUser: (data: Omit<User, 'id' | 'createdAt'> & { password: string }) => Promise<User>;
  updateUser: (id: string, data: Partial<User> & { password?: string }) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  updateSettings: (data: Partial<SiteSettings>) => Promise<void>;
  generateWhatsAppUrl: (product?: Product, customNote?: string) => string;
  generateOrderWhatsAppUrl: (product: Product) => string;
  generateInquiryWhatsAppUrl: (product: Product) => string;
  generateDiscussPriceWhatsAppUrl: (product: Product) => string;
  recordWhatsAppClick: (source: WhatsAppClickEvent['source'], product?: Product) => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [banners, setBanners] = useState<Banner[]>(INITIAL_BANNERS);
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SETTINGS);
  const [users, setUsers] = useState<User[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [totalVisits, setTotalVisits] = useState(0);
  const [clickEvents, setClickEvents] = useState<WhatsAppClickEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  const applyStorefront = useCallback((data: StorefrontPayload) => {
    if (data.categories) setCategories(data.categories);
    if (data.products) setProducts(data.products);
    if (data.banners) setBanners(data.banners);
    if (data.settings) setSettings(data.settings);
  }, []);

  const loadStorefront = useCallback(async () => {
    try {
      const data = await api.get<StorefrontPayload>('/storefront');
      applyStorefront(data);
      setApiError(null);
    } catch {
      setApiError('Le catalogue en direct est momentanément indisponible. Une sélection locale est affichée.');
    } finally {
      setIsLoading(false);
    }
  }, [applyStorefront]);

  useEffect(() => {
    void loadStorefront();
    if (!sessionStorage.getItem('mwali_visit_counted')) {
      sessionStorage.setItem('mwali_visit_counted', 'true');
      void api.post('/metrics/visit').catch(() => undefined);
    }
  }, [loadStorefront]);

  const refreshAdminData = useCallback(async () => {
    const data = await api.get<AdminPayload>('/admin/bootstrap');
    applyStorefront(data);
    setUsers(data.users || []);
    setLogs(data.logs || []);
    setTotalVisits(data.totalVisits || 0);
    setClickEvents(data.clickEvents || []);
    setApiError(null);
  }, [applyStorefront]);

  const addProduct = async (data: Omit<Product, 'id' | 'views' | 'whatsappClicks' | 'createdAt' | 'updatedAt'>) => {
    const result = await api.post<{ product: Product }>('/admin/products', data);
    setProducts(previous => [result.product, ...previous]);
    return result.product;
  };

  const updateProduct = async (id: string, data: Partial<Product>) => {
    const result = await api.patch<{ product: Product }>(`/admin/products/${id}`, data);
    setProducts(previous => previous.map(product => product.id === id ? result.product : product));
  };

  const deleteProduct = async (id: string) => {
    await api.delete(`/admin/products/${id}`);
    setProducts(previous => previous.filter(product => product.id !== id));
  };

  const toggleProductFeatured = async (id: string) => {
    const product = products.find(item => item.id === id);
    if (product) await updateProduct(id, { isFeatured: !product.isFeatured });
  };

  const toggleProductActive = async (id: string) => {
    const product = products.find(item => item.id === id);
    if (product) await updateProduct(id, { isActive: !product.isActive });
  };

  const incrementProductViews = (id: string) => {
    setProducts(previous => previous.map(product => product.id === id ? { ...product, views: product.views + 1 } : product));
    void api.post(`/metrics/product-view/${id}`).catch(() => undefined);
  };

  const addCategory = async (data: Omit<Category, 'id' | 'createdAt'>) => {
    const result = await api.post<{ category: Category }>('/admin/categories', data);
    setCategories(previous => [...previous, result.category]);
    return result.category;
  };

  const updateCategory = async (id: string, data: Partial<Category>) => {
    const result = await api.patch<{ category: Category }>(`/admin/categories/${id}`, data);
    setCategories(previous => previous.map(category => category.id === id ? result.category : category));
  };

  const deleteCategory = async (id: string) => {
    await api.delete(`/admin/categories/${id}`);
    setCategories(previous => previous.filter(category => category.id !== id));
  };

  const addBanner = async (data: Omit<Banner, 'id'>) => {
    const result = await api.post<{ banner: Banner }>('/admin/banners', data);
    setBanners(previous => [...previous, result.banner]);
    return result.banner;
  };

  const updateBanner = async (id: string, data: Partial<Banner>) => {
    const result = await api.patch<{ banner: Banner }>(`/admin/banners/${id}`, data);
    setBanners(previous => previous.map(banner => banner.id === id ? result.banner : banner));
  };

  const deleteBanner = async (id: string) => {
    await api.delete(`/admin/banners/${id}`);
    setBanners(previous => previous.filter(banner => banner.id !== id));
  };

  const addUser = async (data: Omit<User, 'id' | 'createdAt'> & { password: string }) => {
    const result = await api.post<{ user: User }>('/admin/users', data);
    setUsers(previous => [...previous, result.user]);
    return result.user;
  };

  const updateUser = async (id: string, data: Partial<User> & { password?: string }) => {
    const result = await api.patch<{ user: User }>(`/admin/users/${id}`, data);
    setUsers(previous => previous.map(user => user.id === id ? result.user : user));
  };

  const deleteUser = async (id: string) => {
    await api.delete(`/admin/users/${id}`);
    setUsers(previous => previous.filter(user => user.id !== id));
  };

  const updateSettings = async (data: Partial<SiteSettings>) => {
    const result = await api.patch<{ settings: SiteSettings }>('/admin/settings', data);
    setSettings(result.settings);
  };

  const generateWhatsAppUrl = useCallback((product?: Product, customNote?: string): string => {
    const cleanNumber = (settings.whatsappNumber || '243971171975').replace(/\D/g, '');
    const address = settings.address || 'Route pavée, derrière la Mairie de Goma, Goma';
    const currentUrl = window.location.href;
    let message: string;
    if (product) {
      message = `Bonjour MWALI Baby Shop,\n\nJe souhaite des renseignements sur :\n• ${product.name}\n• Référence : ${product.reference || 'Non spécifiée'}\n• Lien : ${window.location.origin}/#/produit/${product.slug}\n\nAdresse notée : ${address}\nMerci !`;
    } else if (customNote) {
      message = `Bonjour MWALI Baby Shop,\n\n${customNote}\n\nMerci de me renseigner.`;
    } else {
      message = `Bonjour MWALI Baby Shop,\n\nJe consulte votre catalogue (${currentUrl}) et souhaite être conseillé(e).\n\nAdresse notée : ${address}`;
    }
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
  }, [settings.address, settings.whatsappNumber]);

  const generateOrderWhatsAppUrl = useCallback((product: Product) => {
    const cleanNumber = (settings.whatsappNumber || '243971171975').replace(/\D/g, '');
    const message = `Bonjour MWALI Baby Shop,\n\nJe souhaite commander : ${product.name} (${product.reference})${product.price ? ` — ${product.price}` : ''}.\nMerci de confirmer la disponibilité.`;
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
  }, [settings.whatsappNumber]);

  const generateInquiryWhatsAppUrl = useCallback((product: Product) => {
    const cleanNumber = (settings.whatsappNumber || '243971171975').replace(/\D/g, '');
    const message = `Bonjour MWALI Baby Shop,\n\nPouvez-vous me renseigner sur ${product.name} (${product.reference}) ? Merci !`;
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
  }, [settings.whatsappNumber]);

  const generateDiscussPriceWhatsAppUrl = useCallback((product: Product) =>
    getDiscussPriceWhatsAppUrl(product.name, settings.whatsappNumber), [settings.whatsappNumber]);

  const recordWhatsAppClick = (source: WhatsAppClickEvent['source'], product?: Product) => {
    const event: WhatsAppClickEvent = {
      id: `pending-${Date.now()}`,
      timestamp: new Date().toISOString(),
      productId: product?.id,
      productName: product?.name,
      source,
    };
    setClickEvents(previous => [event, ...previous].slice(0, 100));
    if (product) {
      setProducts(previous => previous.map(item => item.id === product.id ? { ...item, whatsappClicks: item.whatsappClicks + 1 } : item));
    }
    void api.post('/metrics/whatsapp', { source, productId: product?.id, productName: product?.name }).catch(() => undefined);
  };

  const whatsAppClicksTotal = useMemo(
    () => products.reduce((total, product) => total + (product.whatsappClicks || 0), 0),
    [products],
  );

  return (
    <StoreContext.Provider value={{
      categories, products, banners, settings, users, logs, totalVisits, whatsAppClicksTotal,
      clickEvents, isLoading, apiError, refreshStorefront: loadStorefront, refreshAdminData,
      addProduct, updateProduct, deleteProduct, toggleProductFeatured, toggleProductActive, incrementProductViews,
      addCategory, updateCategory, deleteCategory, addBanner, updateBanner, deleteBanner,
      addUser, updateUser, deleteUser, updateSettings,
      generateWhatsAppUrl, generateOrderWhatsAppUrl, generateInquiryWhatsAppUrl,
      generateDiscussPriceWhatsAppUrl, recordWhatsAppClick,
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within a StoreProvider');
  return context;
};
