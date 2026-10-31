export enum UserRole {
  RESPONSABLE = 'RESPONSABLE',
  INFORMATICIEN = 'INFORMATICIEN',
}

export type Role = 'RESPONSABLE' | 'INFORMATICIEN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  order: number;
  isActive: boolean;
  itemCount?: number;
  createdAt?: string;
}

export interface ProductCharacteristics {
  material?: string;
  color?: string;
  sizes?: string[];
  dimensions?: string;
  origin?: string;
  availability?: 'En stock' | 'Sur commande' | 'Série limitée';
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  reference: string;
  price?: string;
  description: string;
  categoryId: string;
  images: string[];
  isFeatured: boolean;
  isActive: boolean;
  characteristics: ProductCharacteristics;
  tags: string[];
  views: number;
  whatsappClicks: number;
  createdAt: string;
  updatedAt: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  badge?: string;
  image: string;
  link?: string;
  order: number;
  isActive: boolean;
}

export interface SiteSettings {
  id: string;
  companyName: string;
  tagline: string;
  address: string;
  city: string;
  country: string;
  whatsappNumber: string; // e.g. "243971171975"
  whatsappDisplay: string; // e.g. "+243 971 171 975"
  email: string;
  phone: string;
  openingHours: string;
  facebook: string;
  instagram: string;
  tiktok: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
  };
  aboutText: string;
  heroHeadline: string;
  heroSubheadline: string;
  whyChooseUsTitle: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  entityType: 'product' | 'category' | 'banner' | 'user' | 'setting' | 'auth';
  details: string;
}

export interface WhatsAppClickEvent {
  id: string;
  timestamp: string;
  productId?: string;
  productName?: string;
  source: 'product_detail' | 'quick_card' | 'floating_button' | 'contact_page' | 'header' | 'discuss_price';
}
