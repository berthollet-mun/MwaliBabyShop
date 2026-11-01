import React, { useState } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Sparkles,
  CheckCircle,
  XCircle,
  Eye,
  MessageCircle,
  Layers,
  Image as ImageIcon,
  X,
  PlusCircle,
  Zap,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useToast } from '../../context/ToastContext';
import { Product } from '../../types';
import { ImageUploaderModal } from './ImageUploaderModal';

export const ProductsManager: React.FC = () => {
  const {
    products,
    categories,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductFeatured,
    toggleProductActive,
  } = useStore();
  const { showSuccess, showInfo, showError } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCatFilter, setSelectedCatFilter] = useState('all');

  // Modal form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Image uploader modal state
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    reference: '',
    price: '',
    description: '',
    categoryId: categories[0]?.id || '',
    images: [] as string[],
    isFeatured: false,
    isActive: true,
    material: '',
    color: '',
    sizes: '',
    dimensions: '',
    origin: 'Sélection MWALI Baby Shop',
    availability: 'En stock' as 'En stock' | 'Sur commande' | 'Série limitée',
    tags: '',
  });

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.reference && p.reference.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = selectedCatFilter === 'all' || p.categoryId === selectedCatFilter;
    return matchesSearch && matchesCat;
  });

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      name: '',
      slug: '',
      reference: `MWL-${Date.now().toString().slice(-4)}`,
      price: '$25',
      description: '',
      categoryId: categories[0]?.id || '',
      images: ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=900'],
      isFeatured: false,
      isActive: true,
      material: 'Coton doux hypoallergénique',
      color: 'Blanc / Rose / Bleu',
      sizes: 'Toutes tailles disponibles (voir sur WhatsApp)',
      dimensions: '',
      origin: 'Sélection MWALI Baby Shop',
      availability: 'En stock',
      tags: 'Nouveauté, Bébé, Enfant',
    });
    setIsFormOpen(true);
  };

  const openEditModal = (prod: Product) => {
    setEditingId(prod.id);
    setFormData({
      name: prod.name,
      slug: prod.slug,
      reference: prod.reference || '',
      price: prod.price || '',
      description: prod.description,
      categoryId: prod.categoryId,
      images: prod.images || [],
      isFeatured: prod.isFeatured,
      isActive: prod.isActive,
      material: prod.characteristics?.material || '',
      color: prod.characteristics?.color || '',
      sizes: prod.characteristics?.sizes?.join(', ') || '',
      dimensions: prod.characteristics?.dimensions || '',
      origin: prod.characteristics?.origin || '',
      availability: prod.characteristics?.availability || 'En stock',
      tags: prod.tags?.join(', ') || '',
    });
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanSlug =
      formData.slug.trim() ||
      formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const characteristics = {
      material: formData.material,
      color: formData.color,
      sizes: formData.sizes
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      dimensions: formData.dimensions,
      origin: formData.origin,
      availability: formData.availability,
    };

    const tags = formData.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      name: formData.name,
      slug: cleanSlug,
      reference: formData.reference,
      price: formData.price,
      description: formData.description,
      categoryId: formData.categoryId,
      images: formData.images.length > 0 ? formData.images : ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900'],
      isFeatured: formData.isFeatured,
      isActive: formData.isActive,
      characteristics,
      tags,
    };

    try {
      if (editingId) {
        await updateProduct(editingId, payload);
        showSuccess('Article modifié avec succès', `La pièce "${formData.name}" a été mise à jour dans le catalogue.`);
      } else {
        await addProduct(payload);
        showSuccess('Nouvel article créé', `La pièce "${formData.name}" est enregistrée et prête.`);
      }
      setIsFormOpen(false);
    } catch (error) {
      showError('Enregistrement impossible', error instanceof Error ? error.message : 'Veuillez réessayer.');
    }
  };

  const handleAddImage = (newUrl: string) => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, newUrl],
    }));
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="admin-page-header admin-card flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-6">
        <div>
          <h2 className="font-['Playfair_Display',serif] text-lg sm:text-xl font-bold text-stone-900">
            Gestion du Catalogue Articles
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Créer, éditer, ajouter des photographies et gérer la mise en avant en page d'accueil.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="admin-btn admin-btn-primary w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-white text-xs font-bold uppercase tracking-wider shadow"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter un Article</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="admin-filter-bar admin-card flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 sm:p-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par nom ou référence..."
            className="admin-input w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-stone-900"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-stone-500 whitespace-nowrap shrink-0">Univers :</span>
          <select
            value={selectedCatFilter}
            onChange={(e) => setSelectedCatFilter(e.target.value)}
            className="admin-select bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800 focus:outline-none flex-1 sm:flex-none"
          >
            <option value="all">Toutes les catégories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table with horizontal scroll container */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider font-semibold border-b border-stone-200">
            <tr>
              <th className="py-3.5 px-4 min-w-[200px]">Article</th>
              <th className="py-3.5 px-4 min-w-[120px]">Catégorie</th>
              <th className="py-3.5 px-4 min-w-[90px]">Réf.</th>
              <th className="py-3.5 px-4 min-w-[70px]">Prix</th>
              <th className="py-3.5 px-4 min-w-[100px]">Mise en avant</th>
              <th className="py-3.5 px-4 min-w-[100px]">Visibilité</th>
              <th className="py-3.5 px-4 min-w-[85px]">Stats</th>
              <th className="py-3.5 px-4 min-w-[85px] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-stone-800">
            {filtered.map((prod) => {
              const cat = categories.find((c) => c.id === prod.categoryId);
              return (
                <tr key={prod.id} className="hover:bg-stone-50/70 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={prod.images[0] || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=120'}
                        alt={prod.name}
                        loading="lazy"
                        decoding="async"
                        className="w-12 h-12 rounded-xl object-cover bg-stone-100 shrink-0 border border-stone-200"
                      />
                      <div className="min-w-0">
                        <div className="font-bold text-stone-900 line-clamp-1">{prod.name}</div>
                        <div className="text-[11px] text-stone-500 line-clamp-1 max-w-xs">
                          {prod.description}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span className="px-2.5 py-1 rounded-full bg-stone-100 font-medium text-[11px] whitespace-nowrap">
                      {cat?.name || 'Inconnu'}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-mono font-semibold text-stone-600 whitespace-nowrap">
                    {prod.reference || '—'}
                  </td>

                  <td className="py-3 px-4 font-bold text-stone-900 whitespace-nowrap">
                    {prod.price || '—'}
                  </td>

                  <td className="py-3 px-4">
                    <button
                      onClick={async () => {
                        try {
                          await toggleProductFeatured(prod.id);
                          showInfo(
                            prod.isFeatured ? 'Article retiré des vedettes' : 'Article mis en vedette',
                            `"${prod.name}" a été mis à jour.`
                          );
                        } catch (error) {
                          showError('Mise à jour impossible', error instanceof Error ? error.message : 'Veuillez réessayer.');
                        }
                      }}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1 transition-colors whitespace-nowrap ${
                        prod.isFeatured
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-stone-100 text-stone-400 hover:text-stone-700'
                      }`}
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>{prod.isFeatured ? 'Vedette' : 'Standard'}</span>
                    </button>
                  </td>

                  <td className="py-3 px-4">
                    <button
                      onClick={async () => {
                        try {
                          await toggleProductActive(prod.id);
                          showInfo(
                            prod.isActive ? 'Article masqué du catalogue' : 'Article publié en ligne',
                            `Visibilité modifiée pour "${prod.name}".`
                          );
                        } catch (error) {
                          showError('Mise à jour impossible', error instanceof Error ? error.message : 'Veuillez réessayer.');
                        }
                      }}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold inline-flex items-center gap-1 whitespace-nowrap ${
                        prod.isActive
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-stone-200 text-stone-600'
                      }`}
                    >
                      {prod.isActive ? (
                        <>
                          <CheckCircle className="w-3 h-3" />
                          <span>En Ligne</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3" />
                          <span>Masqué</span>
                        </>
                      )}
                    </button>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3 text-[11px] text-stone-500 whitespace-nowrap">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3 text-stone-400" />
                        {prod.views}
                      </span>
                      <span className="flex items-center gap-1 text-emerald-700 font-medium">
                        <MessageCircle className="w-3 h-3" />
                        {prod.whatsappClicks}
                      </span>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(prod)}
                        className="p-2 hover:bg-stone-200 rounded-lg text-stone-700 transition-colors"
                        title="Modifier l'article"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm(`Confirmez-vous la suppression de "${prod.name}" ?`)) {
                            try {
                              await deleteProduct(prod.id);
                              showSuccess('Article supprimé', `"${prod.name}" a été retiré du catalogue.`);
                            } catch (error) {
                              showError('Suppression impossible', error instanceof Error ? error.message : 'Veuillez réessayer.');
                            }
                          }
                        }}
                        className="p-2 hover:bg-rose-100 rounded-lg text-rose-600 transition-colors"
                        title="Supprimer l'article"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ADD / EDIT MODAL FORM */}
      {isFormOpen && (
        <div className="admin-modal-overlay">
          <div
            className="admin-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-modal-header">
              <div className="min-w-0 pr-2">
                <h3 className="font-['Playfair_Display',serif] text-base sm:text-lg font-bold text-stone-900 truncate">
                  {editingId ? "Modifier l'Article" : 'Ajouter un Nouvel Article'}
                </h3>
                <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-1">
                  Les clients discuteront et commanderont directement via WhatsApp.
                </p>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-2 text-stone-400 hover:text-stone-700 rounded-full shrink-0"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
              <div className="admin-modal-body space-y-4 sm:space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1">
                      Nom de l'article *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="ex. Ensemble Robe Bébé"
                      className="admin-input"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1">
                      Référence catalogue *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.reference}
                      onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                      placeholder="ex. MW-LAY-01"
                      className="admin-input font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1">
                      Prix indicatif (ex. 35 $)
                    </label>
                    <input
                      type="text"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="ex. 35 $ ou 20 $"
                      className="admin-input font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1">
                      Catégorie d'appartenance *
                    </label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                      className="admin-select"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1">
                      Disponibilité en stock
                    </label>
                    <select
                      value={formData.availability}
                      onChange={(e) => setFormData({ ...formData, availability: e.target.value as NonNullable<Product['characteristics']['availability']> })}
                      className="admin-select"
                    >
                      <option value="En stock">En stock immédiat</option>
                      <option value="Sur commande">Sur commande</option>
                      <option value="Série limitée">Série limitée</option>
                    </select>
                  </div>
                </div>

                {/* 3-Way Image Upload Manager for Product */}
                <div className="space-y-2 pt-2 border-t border-stone-100">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <label className="block text-xs font-bold text-stone-800">
                        Photos ({formData.images.length})
                      </label>
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <Zap className="w-3 h-3 text-emerald-600" />
                        <span>Compression auto</span>
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsImageModalOpen(true)}
                      className="admin-btn admin-btn-secondary text-xs py-1.5 px-3 min-h-[38px] w-full sm:w-auto"
                    >
                      <PlusCircle className="w-3.5 h-3.5 text-amber-700" />
                      <span>Ajouter photo</span>
                    </button>
                  </div>

                  {formData.images.length === 0 ? (
                    <div className="p-4 sm:p-6 border-2 border-dashed border-stone-200 rounded-2xl text-center text-xs text-stone-500">
                      Aucune photo ajoutée. Cliquez ci-dessus pour importer depuis votre appareil ou caméra.
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3 pt-2">
                      {formData.images.map((img, idx) => (
                        <div
                          key={idx}
                          className="relative aspect-square rounded-xl overflow-hidden border border-stone-200 group bg-stone-100"
                        >
                          <img src={img} alt="Aperçu" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute top-1 right-1 p-1 bg-black/75 hover:bg-black text-white rounded-full transition-colors"
                            title="Retirer cette photo"
                            aria-label="Supprimer photo"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                          {idx === 0 && (
                            <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-stone-900/80 text-white text-[9px] rounded font-semibold">
                              Couverture
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Description succincte de l'article
                  </label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="ex. Matière douce et respirante, confortable pour bébé."
                    className="admin-textarea"
                  />
                </div>

                {/* Toggles */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 pt-3 border-t border-stone-100">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-800">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="rounded text-stone-900 focus:ring-stone-900 w-4 h-4 shrink-0"
                    />
                    <span>Mettre en avant sur la page d'accueil</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-800">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="rounded text-stone-900 focus:ring-stone-900 w-4 h-4 shrink-0"
                    />
                    <span>Visible immédiatement dans le catalogue</span>
                  </label>
                </div>
              </div>

              {/* Modal Actions */}
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
                  {editingId ? 'Enregistrer les Modifications' : 'Créer et Publier l’Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* IMAGE UPLOADER MODAL (3 methods) */}
      <ImageUploaderModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        onImageSelected={handleAddImage}
        title="Ajouter une photo à cet article"
      />
    </div>
  );
};
