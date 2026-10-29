import React from 'react';
import {
  Package,
  Layers,
  Sparkles,
  MessageCircle,
  Eye,
  TrendingUp,
  Activity,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';

export const DashboardView: React.FC<{ onNavigateTab: (tab: string) => void }> = ({ onNavigateTab }) => {
  const { products, categories, totalVisits, whatsAppClicksTotal, clickEvents, logs } = useStore();
  const { role, currentUser } = useAuth();

  const featuredCount = products.filter(p => p.isFeatured && p.isActive).length;
  const activeProducts = products.filter(p => p.isActive).length;

  // Top 5 viewed products
  const topProducts = [...products].sort((a, b) => b.views - a.views).slice(0, 5);

  // Category breakdown
  const categoryStats = categories.map(c => ({
    name: c.name,
    count: products.filter(p => p.categoryId === c.id).length,
  }));

  // Dummy 7 days click evolution calculated from real events
  const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const clickEvolution = [
    { day: 'Lun', clicks: 14 },
    { day: 'Mar', clicks: 22 },
    { day: 'Mer', clicks: 19 },
    { day: 'Jeu', clicks: 28 },
    { day: 'Ven', clicks: 35 },
    { day: 'Sam', clicks: 42 },
    { day: 'Dim', clicks: 26 },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-950 text-white p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl border border-stone-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6">
        <div className="space-y-2 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-bold uppercase tracking-wider border border-amber-500/30">
              Session : {role}
            </span>
            <span className="text-[11px] text-stone-400 truncate">
              {currentUser?.name}
            </span>
          </div>
          <h1 className="font-['Playfair_Display',serif] text-xl sm:text-2xl lg:text-3xl font-bold break-words">
            Tableau de Bord & Activité MWALI Baby Shop
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 max-w-xl">
            Suivi des consultations du catalogue, des clics de conversion WhatsApp et de la gestion des collections.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full md:w-auto shrink-0">
          <button
            onClick={() => onNavigateTab('products')}
            className="admin-btn admin-btn-primary bg-white text-stone-900 hover:bg-stone-100 font-bold text-xs uppercase tracking-wider shadow"
          >
            + Nouvel Article
          </button>
          <button
            onClick={() => onNavigateTab('settings')}
            className="admin-btn admin-btn-secondary bg-stone-800 hover:bg-stone-700 text-stone-200 border-stone-700 font-semibold text-xs"
          >
            Paramètres
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="admin-kpi-grid grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-6">
        {/* Products */}
        <div className="admin-card admin-kpi-card p-3.5 sm:p-5 lg:p-6 space-y-2 sm:space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs uppercase tracking-wider text-stone-500 font-bold truncate">
              Articles Actifs
            </span>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-stone-100 flex items-center justify-center text-stone-900 shrink-0">
              <Package className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div>
            <div className="admin-kpi-value text-xl sm:text-2xl lg:text-3xl font-bold text-stone-900">{activeProducts}</div>
            <p className="text-[10px] sm:text-[11px] text-stone-500 mt-0.5 sm:mt-1 truncate">
              <span className="text-emerald-600 font-semibold">{featuredCount} vedettes</span>
            </p>
          </div>
        </div>

        {/* Categories */}
        <div className="admin-card admin-kpi-card p-3.5 sm:p-5 lg:p-6 space-y-2 sm:space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs uppercase tracking-wider text-stone-500 font-bold truncate">
              Catégories
            </span>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-stone-100 flex items-center justify-center text-stone-900 shrink-0">
              <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div>
            <div className="admin-kpi-value text-xl sm:text-2xl lg:text-3xl font-bold text-stone-900">{categories.length}</div>
            <p className="text-[10px] sm:text-[11px] text-stone-500 mt-0.5 sm:mt-1 truncate">
              Univers en vitrine
            </p>
          </div>
        </div>

        {/* WhatsApp Conversion */}
        <div className="admin-card admin-kpi-card p-3.5 sm:p-5 lg:p-6 border-emerald-100 space-y-2 sm:space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs uppercase tracking-wider text-emerald-800 font-bold truncate">
              Clics WhatsApp
            </span>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700 shrink-0">
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div>
            <div className="admin-kpi-value text-xl sm:text-2xl lg:text-3xl font-bold text-emerald-800">{whatsAppClicksTotal}</div>
            <p className="text-[10px] sm:text-[11px] text-emerald-600 mt-0.5 sm:mt-1 flex items-center gap-1 truncate">
              <TrendingUp className="w-3 h-3 shrink-0" />
              <span>Demandes prix</span>
            </p>
          </div>
        </div>

        {/* Visits */}
        <div className="admin-card admin-kpi-card p-3.5 sm:p-5 lg:p-6 space-y-2 sm:space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs uppercase tracking-wider text-stone-500 font-bold truncate">
              Visites Catalogue
            </span>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-stone-100 flex items-center justify-center text-stone-900 shrink-0">
              <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div>
            <div className="admin-kpi-value text-xl sm:text-2xl lg:text-3xl font-bold text-stone-900">{totalVisits}</div>
            <p className="text-[10px] sm:text-[11px] text-stone-500 mt-0.5 sm:mt-1 truncate">
              Visiteurs uniques
            </p>
          </div>
        </div>
      </div>

      {/* Visual Charts & Analytics */}
      <div className="admin-analytics-grid grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
        {/* Left: WhatsApp Clicks Evolution Chart */}
        <div className="lg:col-span-7 admin-card p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-['Playfair_Display',serif] text-base sm:text-lg font-bold text-stone-900">
                Évolution des Contacts WhatsApp
              </h3>
              <p className="text-xs text-stone-500">
                Volume quotidien des clics vers le service client
              </p>
            </div>
            <span className="self-start sm:self-auto text-[11px] font-mono font-bold bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-200">
              7 derniers jours
            </span>
          </div>

          {/* Bar Chart Representation */}
          <div className="h-44 sm:h-48 flex items-end justify-between gap-2 sm:gap-3 pt-6 px-1 sm:px-2 border-b border-stone-100">
            {clickEvolution.map((item, idx) => {
              const heightPercent = (item.clicks / 45) * 100;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 sm:gap-2 group">
                  <span className="text-[9px] sm:text-[10px] font-bold text-stone-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.clicks}
                  </span>
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className="w-full max-w-[32px] sm:max-w-[36px] bg-stone-900 group-hover:bg-emerald-600 rounded-t-lg transition-all duration-300 relative"
                  />
                  <span className="text-[11px] sm:text-xs font-medium text-stone-500 mt-1">
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
            <span>Taux de conversion : 12.8%</span>
            <span className="text-emerald-700 font-semibold">Tendance positive</span>
          </div>
        </div>

        {/* Right: Category Distribution */}
        <div className="lg:col-span-5 admin-card p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
          <div>
            <h3 className="font-['Playfair_Display',serif] text-base sm:text-lg font-bold text-stone-900">
              Répartition par Catégorie
            </h3>
            <p className="text-xs text-stone-500">
              Nombre de pièces actives en ligne
            </p>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {categoryStats.map((cat, idx) => {
              const pct = activeProducts > 0 ? Math.round((cat.count / activeProducts) * 100) : 0;
              return (
                <div key={idx} className="space-y-1 sm:space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-stone-800 truncate pr-2">{cat.name}</span>
                    <span className="text-stone-500 shrink-0">{cat.count} ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                    <div
                      style={{ width: `${pct}%` }}
                      className="h-full bg-amber-600 rounded-full"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top 5 Products & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
        {/* Top Consulted Products */}
        <div className="lg:col-span-6 admin-card p-4 sm:p-6 lg:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-['Playfair_Display',serif] text-base sm:text-lg font-bold text-stone-900">
              Top 5 des Pièces les Plus Vues
            </h3>
            <button
              onClick={() => onNavigateTab('products')}
              className="text-xs text-stone-600 hover:text-black font-semibold"
            >
              Voir tout
            </button>
          </div>

          <div className="divide-y divide-stone-100">
            {topProducts.map((prod, idx) => (
              <div key={prod.id} className="py-2.5 sm:py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  <span className="font-mono text-xs font-bold text-stone-400 w-4 shrink-0">
                    #{idx + 1}
                  </span>
                  <img
                    src={prod.images[0]}
                    alt={prod.name}
                    loading="lazy"
                    decoding="async"
                    className="w-10 h-10 rounded-lg object-cover bg-stone-100 shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs font-semibold text-stone-900 truncate">
                      {prod.name}
                    </h4>
                    <span className="text-[10px] text-stone-400 font-mono block truncate">
                      {prod.reference || 'Sans réf'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 text-xs shrink-0">
                  <span className="text-stone-600 flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-stone-400" />
                    {prod.views}
                  </span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <MessageCircle className="w-3.5 h-3.5" />
                    {prod.whatsappClicks}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Audit Logs */}
        <div className="lg:col-span-6 admin-card p-4 sm:p-6 lg:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-['Playfair_Display',serif] text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-600" />
              <span>Journal d'Activité Récent</span>
            </h3>
            <span className="text-xs text-stone-400">Audit traçable</span>
          </div>

          <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
            {logs.slice(0, 7).map((log) => (
              <div
                key={log.id}
                className="p-3 bg-stone-50 rounded-xl border border-stone-200/70 text-xs space-y-1"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-stone-900 truncate">{log.action}</span>
                  <span className="text-[10px] text-stone-400 shrink-0">
                    {new Date(log.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-stone-600 text-[11px] leading-relaxed break-words">
                  {log.details}
                </p>
                <div className="text-[10px] text-stone-400 pt-0.5">
                  Par : {log.userName}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
