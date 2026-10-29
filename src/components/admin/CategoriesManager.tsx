import React, { useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Layers,
  CheckCircle,
  XCircle,
  ArrowUpDown,
  Image as ImageIcon,
  X,
  PlusCircle,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useToast } from '../../context/ToastContext';
import { Category } from '../../types';
import { ImageUploaderModal } from './ImageUploaderModal';

export const CategoriesManager: React.FC = () => {
  const { categories, products, addCategory, updateCategory, deleteCategory } = useStore();
  const { showSuccess, showError } = useToast();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800',
    order: categories.length + 1,
    isActive: true,
  });

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800',
      order: categories.length + 1,
      isActive: true,
    });
    setIsFormOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingId(cat.id);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      image: cat.image || '',
      order: cat.order,
      isActive: cat.isActive,
    });
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanSlug =
      formData.slug.trim() ||
      formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const payload = {
      name: formData.name,
      slug: cleanSlug,
      description: formData.description,
      image: formData.image,
      order: Number(formData.order) || 1,
      isActive: formData.isActive,
    };

    if (editingId) {
      updateCategory(editingId, payload);
      showSuccess('Catégorie mise à jour', `L’univers "${formData.name}" a été modifié.`);
    } else {
      addCategory(payload);
      showSuccess('Catégorie créée', `L’univers "${formData.name}" a été ajouté au catalogue.`);
    }

    setIsFormOpen(false);
  };

  const sortedCategories = [...categories].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="admin-page-header admin-card flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-6">
        <div>
          <h2 className="font-['Playfair_Display',serif] text-lg sm:text-xl font-bold text-stone-900">
            Gestion des Catégories & Univers
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Organisez les univers affichés en premier plan sur le site pour faciliter la navigation de vos clients.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="admin-btn admin-btn-primary w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-white text-xs font-bold uppercase tracking-wider shadow"
        >
          <Plus className="w-4 h-4" />
          <span>Nouvelle Catégorie</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {sortedCategories.map((cat) => {
          const count = products.filter((p) => p.categoryId === cat.id).length;
          return (
            <div
              key={cat.id}
              className="admin-card flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                {/* Image Cover */}
                <div className="relative aspect-[16/9] w-full bg-stone-100 overflow-hidden">
                  <img
                    src={cat.image || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600'}
                    alt={cat.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                  <div className="absolute top-3 right-3 flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white font-mono text-[10px] font-bold">
                      Ordre : #{cat.order}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="font-['Playfair_Display',serif] text-base sm:text-lg font-bold truncate">
                      {cat.name}
                    </h3>
                    <span className="text-[11px] text-stone-300 font-mono block truncate">
                      /{cat.slug} • {count} {count > 1 ? 'articles' : 'article'}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div className="p-4 sm:p-5 space-y-2">
                  <p className="text-xs text-stone-600 line-clamp-2">
                    {cat.description || 'Aucune description saisie.'}
                  </p>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="px-4 sm:px-5 py-3.5 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                    cat.isActive ? 'text-emerald-700' : 'text-stone-500'
                  }`}
                >
                  {cat.isActive ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Actif</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3.5 h-3.5 text-stone-400" />
                      <span>Masqué</span>
                    </>
                  )}
                </span>

                <div className="flex items-center gap-1 sm:gap-2">
                  <button
                    onClick={() => openEditModal(cat)}
                    className="p-2 hover:bg-stone-200 text-stone-700 rounded-lg transition-colors"
                    title="Modifier"
                    aria-label="Modifier"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (count > 0) {
                        showError('Suppression impossible', `Cette catégorie contient ${count} articles. Réassignez-les au préalable.`);
                        return;
                      }
                      if (confirm(`Supprimer la catégorie "${cat.name}" ?`)) {
                        deleteCategory(cat.id);
                        showSuccess('Catégorie supprimée', `"${cat.name}" a été retirée.`);
                      }
                    }}
                    className="p-2 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors"
                    title="Supprimer"
                    aria-label="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ADD / EDIT MODAL */}
      {isFormOpen && (
        <div className="admin-modal-overlay">
          <div
            className="admin-modal-card max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-modal-header">
              <h3 className="font-['Playfair_Display',serif] text-base sm:text-lg font-bold text-stone-900">
                {editingId ? 'Modifier la Catégorie' : 'Nouvelle Catégorie'}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-2 text-stone-400 hover:text-stone-700 rounded-full"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
              <div className="admin-modal-body space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Nom de la catégorie *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="ex. Robes de Soirée & Gala"
                    className="admin-input"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Identifiant URL (Slug)
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="ex. robes-de-soiree (généré automatiquement si vide)"
                    className="admin-input font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Description succincte
                  </label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Présentation des créations de cette catégorie..."
                    className="admin-textarea"
                  />
                </div>

                {/* Category Image with 3-way upload */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <label className="block text-xs font-bold text-stone-800">
                      Visuel de la catégorie
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsImageModalOpen(true)}
                      className="admin-btn admin-btn-secondary text-xs py-1.5 px-3 min-h-[38px] w-full sm:w-auto"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Changer la photo</span>
                    </button>
                  </div>

                  {formData.image && (
                    <div className="h-28 rounded-xl overflow-hidden bg-stone-100 border border-stone-200">
                      <img
                        src={formData.image}
                        alt="Aperçu catégorie"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-stone-100">
                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1">
                      Ordre d'affichage
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                      className="admin-input"
                    />
                  </div>

                  <div className="flex items-center sm:items-end pb-1 sm:pb-2">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-800">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        className="rounded text-stone-900 focus:ring-stone-900 w-4 h-4 shrink-0"
                      />
                      <span>Afficher en ligne</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="admin-btn admin-btn-secondary"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="admin-btn admin-btn-primary"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Uploader Modal */}
      <ImageUploaderModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        onImageSelected={(url) => setFormData((p) => ({ ...p, image: url }))}
        title="Sélectionner l'image de la catégorie"
      />
    </div>
  );
};
