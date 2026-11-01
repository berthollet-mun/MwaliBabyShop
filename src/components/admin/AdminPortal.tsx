import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  Layers,
  Image as ImageIcon,
  Users,
  Settings,
  LogOut,
  ExternalLink,
  ShieldCheck,
  UserCheck,
  Activity,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { useToast } from '../../context/ToastContext';
import { UserRole } from '../../types';
import { DashboardView } from './DashboardView';
import { ProductsManager } from './ProductsManager';
import { CategoriesManager } from './CategoriesManager';
import { BannersManager } from './BannersManager';
import { UsersManager } from './UsersManager';
import { SettingsManager } from './SettingsManager';

interface AdminPortalProps {
  onNavigateHome: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onNavigateHome }) => {
  const { currentUser, role, logout } = useAuth();
  const { showInfo } = useToast();
  const { logs } = useStore();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    showInfo('Session fermée', 'Vous avez été déconnecté de l’espace d’administration.');
  };

  const isIT = role === UserRole.ADMIN;

  const navigationItems = [
    { id: 'dashboard', label: 'Tableau de Bord', icon: LayoutDashboard },
    { id: 'products', label: 'Catalogue Articles', icon: Package },
    { id: 'categories', label: 'Catégories', icon: Layers },
    { id: 'banners', label: 'Bannières & Carrousel', icon: ImageIcon },
    ...(isIT ? [{ id: 'users', label: 'Utilisateurs & Rôles', icon: Users }] : []),
    { id: 'settings', label: 'Paramètres', icon: Settings },
    ...(isIT ? [{ id: 'logs', label: 'Journal d’Audit & Logs', icon: Activity }] : []),
  ];

  return (
    <div className="admin-portal min-h-screen bg-[#F8F9FA] flex flex-col lg:flex-row">
      {/* Sidebar for Desktop */}
      <aside className="admin-desktop-sidebar hidden lg:flex w-72 bg-[#24103f] text-white flex-col justify-between p-6 border-r border-white/10 shrink-0">
        <div className="space-y-8">
          {/* Brand header */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-['Playfair_Display',serif] text-xl font-bold tracking-[0.12em] text-white">
                MWALI Baby Shop
              </span>
              <span className="px-2 py-0.5 rounded bg-stone-800 text-[10px] font-mono font-semibold text-stone-300">
                ADMIN
              </span>
            </div>
            <p className="text-[11px] text-stone-400">
              Derrière la Mairie • Goma
            </p>
          </div>

          {/* Current user role card */}
          <div className="p-3.5 bg-stone-900 rounded-2xl border border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-800 text-[#ff8fb5] font-bold flex items-center justify-center text-sm">
              {currentUser?.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-white truncate">
                {currentUser?.name}
              </div>
              <div className="flex items-center gap-1 text-[11px] text-stone-400">
                {isIT ? (
                  <ShieldCheck className="w-3 h-3 text-purple-400" />
                ) : (
                  <UserCheck className="w-3 h-3 text-emerald-400" />
                )}
                <span className="truncate">{role}</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-amber-600 text-stone-950 font-bold shadow-md'
                      : 'text-stone-300 hover:bg-stone-900 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions: View public site & Logout */}
        <div className="pt-6 border-t border-white/10 space-y-2">
          <button
            onClick={onNavigateHome}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-850 text-xs font-semibold text-stone-300 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Voir le Site Public</span>
            </span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl hover:bg-rose-950/40 text-rose-400 hover:text-rose-300 text-xs font-semibold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Header (Sticky) */}
      <div className="admin-mobile-topbar lg:hidden bg-[#24103f] text-white px-4 py-3 border-b border-white/10 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-['Playfair_Display',serif] text-base sm:text-lg font-bold tracking-wider text-white truncate">
            MWALI
          </span>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-stone-800 text-amber-300 rounded font-bold shrink-0">
            {role === UserRole.ADMIN ? 'ADMIN' : 'RESP'}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onNavigateHome}
            className="p-2 text-stone-300 hover:text-white rounded-lg hover:bg-stone-900 flex items-center gap-1 text-xs"
            title="Voir le site public"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="hidden sm:inline text-[11px]">Site Public</span>
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-stone-200 hover:text-white rounded-lg bg-stone-900 border border-white/10"
            aria-label="Menu navigation admin"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-[#ff8fb5]" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Backdrop & Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-30 top-[53px]">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer content */}
          <div className="relative bg-[#24103f] border-b border-white/10 p-4 space-y-2 max-h-[calc(100vh-53px)] max-h-[calc(100dvh-53px)] overflow-y-auto shadow-2xl">
            {/* User status info */}
            <div className="p-3 bg-stone-900 rounded-xl border border-white/10 flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-lg bg-stone-800 text-[#ff8fb5] font-bold flex items-center justify-center text-xs">
                {currentUser?.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-white truncate">
                  {currentUser?.name}
                </div>
                <div className="text-[11px] text-stone-400 truncate">
                  {role}
                </div>
              </div>
            </div>

            <nav className="space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold min-h-[44px] transition-colors ${
                      isActive ? 'bg-amber-600 text-stone-950 font-bold' : 'text-stone-300 hover:bg-stone-900'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="pt-3 border-t border-white/10 space-y-2">
              <button
                onClick={() => {
                  onNavigateHome();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-stone-300 bg-stone-900 text-xs font-semibold min-h-[44px]"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Voir le Site Public</span>
              </button>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-rose-400 bg-rose-950/20 text-xs font-semibold min-h-[44px]"
              >
                <LogOut className="w-4 h-4" />
                <span>Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="admin-main flex-1 p-3 sm:p-6 lg:p-10 max-w-7xl mx-auto w-full min-w-0">
        {activeTab === 'dashboard' && <DashboardView onNavigateTab={setActiveTab} />}
        {activeTab === 'products' && <ProductsManager />}
        {activeTab === 'categories' && <CategoriesManager />}
        {activeTab === 'banners' && <BannersManager />}
        {activeTab === 'users' && <UsersManager />}
        {activeTab === 'settings' && <SettingsManager />}

        {/* Audit Logs tab for IT Engineer */}
        {activeTab === 'logs' && isIT && (
          <div className="space-y-6">
            <div className="admin-page-header admin-card p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-['Playfair_Display',serif] text-lg sm:text-xl font-bold text-stone-900">
                  Journal d'Audit Complet & Sécurité
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Historique immuable de toutes les actions (création, modification, suppression, connexions).
                </p>
              </div>
              <span className="self-start sm:self-auto px-3 py-1 bg-stone-100 rounded-full font-mono text-xs font-bold text-stone-700">
                {logs.length} événements
              </span>
            </div>

            <div className="admin-table-container">
              <table className="admin-table">
                <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider font-semibold border-b border-stone-200">
                  <tr>
                    <th className="py-3 px-4 min-w-[140px]">Horodatage</th>
                    <th className="py-3 px-4 min-w-[120px]">Action</th>
                    <th className="py-3 px-4 min-w-[220px]">Détails de l'Opération</th>
                    <th className="py-3 px-4 min-w-[120px]">Opérateur</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-800">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-stone-50/70">
                      <td className="py-3 px-4 font-mono text-stone-500 whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString('fr-FR')}
                      </td>
                      <td className="py-3 px-4 font-bold text-stone-900">{log.action}</td>
                      <td className="py-3 px-4 text-stone-600 max-w-sm truncate sm:whitespace-normal">{log.details}</td>
                      <td className="py-3 px-4 font-medium text-stone-800">{log.userName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
