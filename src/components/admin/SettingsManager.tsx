import React, { useState } from 'react';
import { Save, CheckCircle2, MessageCircle, MapPin, Globe, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useToast } from '../../context/ToastContext';

export const SettingsManager: React.FC = () => {
  const { settings, updateSettings } = useStore();
  const { showSuccess } = useToast();
  const [form, setForm] = useState({ ...settings });
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(form);
    setSaved(true);
    showSuccess('Paramètres enregistrés', 'Les coordonnées de la boutique et de WhatsApp ont été mises à jour.');
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="admin-page-header admin-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-6">
        <div>
          <h2 className="font-['Playfair_Display',serif] text-lg sm:text-xl font-bold text-stone-900">
            Paramètres Généraux — {settings.companyName}
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Configurez les coordonnées de contact direct, le numéro WhatsApp, l'adresse de la boutique et les textes de présentation.
          </p>
        </div>

        {saved && (
          <span className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Paramètres sauvegardés</span>
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
        {/* Contact & WhatsApp Settings */}
        <div className="admin-card p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800 border-b border-stone-100 pb-3">
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>Configuration WhatsApp & Contact Client Direct</span>
          </div>

          <div className="admin-form-grid-2 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                Numéro WhatsApp (Format URL international) *
              </label>
              <input
                type="text"
                required
                value={form.whatsappNumber}
                onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
                placeholder="243822262471"
                className="admin-input font-mono"
              />
              <p className="text-[10px] text-stone-500 mt-1">
                Utilisé pour le lien direct <code className="bg-stone-100 px-1 py-0.5 rounded">wa.me/243822262471</code>.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                Numéro WhatsApp (Format d'affichage public) *
              </label>
              <input
                type="text"
                required
                value={form.whatsappDisplay}
                onChange={(e) => setForm({ ...form, whatsappDisplay: e.target.value })}
                placeholder="+243 822 262 471"
                className="admin-input"
              />
              <p className="text-[10px] text-stone-500 mt-1">
                Format élégant et lisible affiché sur le bandeau et le catalogue (ex : +243 822 262 471 ou 0822262471).
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                Téléphone Appel Direct
              </label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="admin-input"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                Adresse Email Officielle
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="admin-input font-mono"
              />
            </div>
          </div>
        </div>

        {/* Physical Address Settings */}
        <div className="admin-card p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800 border-b border-stone-100 pb-3">
            <MapPin className="w-4 h-4 text-amber-600" />
            <span>Localisation Showroom & Adresse Physique</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-stone-800 mb-1">
                Adresse complète *
              </label>
              <input
                type="text"
                required
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="ex. Route pavée, derrière la Mairie de Goma, 4ème entrée à droite, avant Hôtel La Versailles"
                className="admin-input"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                Ville & Pays *
              </label>
              <input
                type="text"
                required
                value={`${form.city}, ${form.country}`}
                onChange={(e) => {
                  const parts = e.target.value.split(',');
                  setForm({
                    ...form,
                    city: parts[0]?.trim() || form.city,
                    country: parts[1]?.trim() || form.country,
                  });
                }}
                className="admin-input"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-bold text-stone-800 mb-1">
                Horaires d'Ouverture du Showroom
              </label>
              <input
                type="text"
                value={form.openingHours}
                onChange={(e) => setForm({ ...form, openingHours: e.target.value })}
                className="admin-input"
              />
            </div>
          </div>
        </div>

        {/* Brand & Editorial Presentation */}
        <div className="admin-card p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-800 border-b border-stone-100 pb-3">
            <Sparkles className="w-4 h-4 text-stone-600" />
            <span>Textes & Présentation de Marque</span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                Nom de la marque / boutique
              </label>
              <input
                type="text"
                value={form.companyName}
                onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                className="admin-input"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                Texte de présentation succinct
              </label>
              <textarea
                rows={3}
                value={form.aboutText}
                onChange={(e) => setForm({ ...form, aboutText: e.target.value })}
                className="admin-textarea"
              />
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="admin-card p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-800 border-b border-stone-100 pb-3">
            <Globe className="w-4 h-4 text-stone-600" />
            <span>Réseaux Sociaux & Liens Externes</span>
          </div>

          <div className="admin-form-grid-3 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">Instagram</label>
              <input
                type="text"
                value={form.instagram || ''}
                onChange={(e) =>
                  setForm({
                    ...form,
                    instagram: e.target.value,
                  })
                }
                placeholder="https://instagram.com/..."
                className="admin-input"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">Facebook</label>
              <input
                type="text"
                value={form.facebook || ''}
                onChange={(e) =>
                  setForm({
                    ...form,
                    facebook: e.target.value,
                  })
                }
                placeholder="https://facebook.com/..."
                className="admin-input"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">TikTok</label>
              <input
                type="text"
                value={form.tiktok || ''}
                onChange={(e) =>
                  setForm({
                    ...form,
                    tiktok: e.target.value,
                  })
                }
                placeholder="https://tiktok.com/@..."
                className="admin-input"
              />
            </div>
          </div>
        </div>

        {/* Bottom Save Bar */}
        <div className="admin-sticky-save-bar flex justify-end">
          <button
            type="submit"
            className="admin-btn admin-btn-primary w-full sm:w-auto px-8 py-3 rounded-2xl shadow-xl flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Enregistrer Tous les Paramètres</span>
          </button>
        </div>
      </form>
    </div>
  );
};
