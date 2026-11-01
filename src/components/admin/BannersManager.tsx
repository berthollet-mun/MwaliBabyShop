import React, { useState } from 'react';
import { Plus, Edit2, Trash2, CheckCircle, XCircle, Image as ImageIcon, X, PlusCircle } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useToast } from '../../context/ToastContext';
import { Banner } from '../../types';
import { ImageUploaderModal } from './ImageUploaderModal';

export const BannersManager: React.FC = () => {
  const { banners, addBanner, updateBanner, deleteBanner } = useStore();
  const { showSuccess, showError } = useToast();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600',
    link: '/',
    order: banners.length + 1,
    isActive: true,
  });

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      title: '',
      subtitle: '',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600',
      link: '/',
      order: banners.length + 1,
      isActive: true,
    });
    setIsFormOpen(true);
  };

  const openEditModal = (banner: Banner) => {
    setEditingId(banner.id);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle || '',
      image: banner.image,
      link: banner.link || '/',
      order: banner.order,
      isActive: banner.isActive,
    });
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: formData.title,
      subtitle: formData.subtitle,
      image: formData.image,
      link: formData.link,
      order: Number(formData.order) || 1,
      isActive: formData.isActive,
    };

    try {
      if (editingId) {
        await updateBanner(editingId, payload);
        showSuccess('Bannière mise à jour', `La bannière "${formData.title}" a été modifiée.`);
      } else {
        await addBanner(payload);
        showSuccess('Bannière créée', `La bannière "${formData.title}" est ajoutée au carrousel.`);
      }
      setIsFormOpen(false);
    } catch (error) {
      showError('Enregistrement impossible', error instanceof Error ? error.message : 'Veuillez réessayer.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm">
        <div>
          <h2 className="font-['Playfair_Display',serif] text-xl font-bold text-stone-900">
            Gestion des Bannières & Médias du Carrousel
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Configurez les visuels majeurs qui défilent en tête de page d'accueil pour séduire les visiteurs.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider shadow transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Nouvelle Bannière</span>
        </button>
      </div>

      {/* Banners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="bg-white rounded-3xl border border-stone-200/80 shadow-sm overflow-hidden flex flex-col justify-between"
          >
            <div className="relative aspect-[16/9] w-full bg-stone-900">
              <img
                src={banner.image}
                alt={banner.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              <div className="absolute top-3 right-3 flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white font-mono text-[10px] font-bold">
                  Position #{banner.order}
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="font-['Playfair_Display',serif] text-lg font-bold line-clamp-1">
                  {banner.title}
                </h3>
                {banner.subtitle && (
                  <p className="text-xs text-stone-300 line-clamp-1">{banner.subtitle}</p>
                )}
              </div>
            </div>

            <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-xs">
              <span
                className={`inline-flex items-center gap-1 font-semibold ${
                  banner.isActive ? 'text-emerald-700' : 'text-stone-400'
                }`}
              >
                {banner.isActive ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Actif en vitrine</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-3.5 h-3.5 text-stone-400" />
                    <span>Inactif</span>
                  </>
                )}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(banner)}
                  className="p-1.5 hover:bg-stone-200 text-stone-700 rounded-lg transition-colors"
                  title="Modifier"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={async () => {
                    if (confirm(`Supprimer la bannière "${banner.title}" ?`)) {
                      try {
                        await deleteBanner(banner.id);
                        showSuccess('Bannière supprimée', `"${banner.title}" a été retirée.`);
                      } catch (error) {
                        showError('Suppression impossible', error instanceof Error ? error.message : 'Veuillez réessayer.');
                      }
                    }
                  }}
                  className="p-1.5 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 bg-black/70 backdrop-blur-sm flex justify-center items-center animate-in fade-in duration-200">
          <div
            className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-stone-200 flex items-center justify-between">
              <h3 className="font-['Playfair_Display',serif] text-xl font-bold text-stone-900">
                {editingId ? 'Modifier la Bannière' : 'Nouvelle Bannière Hero'}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-2 text-stone-400 hover:text-stone-700 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Titre d'accroche *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="ex. Éclat & Raffinement au Quotidien"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Sous-titre explicatif
                </label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="ex. Pièces de prêt-à-porter de prestige disponibles à Goma"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-stone-900"
                />
              </div>

              {/* 3-way image upload */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-stone-800">
                    Image haute définition
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsImageModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-lg text-xs font-bold hover:bg-amber-100"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Sélectionner (PC / Mobile / URL)</span>
                  </button>
                </div>

                {formData.image && (
                  <div className="h-32 rounded-xl overflow-hidden bg-stone-900 border border-stone-200">
                    <img
                      src={formData.image}
                      alt="Aperçu bannière"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-stone-100">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Ordre d'apparition
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none"
                  />
                </div>

                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-800">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="rounded text-stone-900 focus:ring-stone-900 w-4 h-4"
                    />
                    <span>Actif immédiatement</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Uploader */}
      <ImageUploaderModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        onImageSelected={(url) => setFormData((p) => ({ ...p, image: url }))}
        title="Sélectionner l'image de la bannière"
      />
    </div>
  );
};
