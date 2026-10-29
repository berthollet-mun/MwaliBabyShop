import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle, Send, CheckCircle2, Navigation } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useToast } from '../../context/ToastContext';

export const ContactPage: React.FC = () => {
  const { settings, generateWhatsAppUrl, recordWhatsAppClick } = useStore();
  const { showWhatsApp } = useToast();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    subject: 'Renseignement sur une collection',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    recordWhatsAppClick('contact_page');

    // Generate formatted WhatsApp message from the form
    const customText = `Bonjour ${settings.companyName},\n\nJe suis ${form.name} (${form.phone}).\nObjet : ${form.subject}\n\nMessage :\n${form.message}`;
    const cleanNum = settings.whatsappNumber.replace(/\D/g, '');
    const url = `https://wa.me/${cleanNum}?text=${encodeURIComponent(customText)}`;

    setSubmitted(true);
    showWhatsApp(
      'Message prêt pour WhatsApp',
      `Redirection vers le chat ${settings.companyName} Goma avec votre message pré-rempli.`
    );
    setTimeout(() => {
      window.open(url, '_blank', 'noopener,noreferrer');
    }, 400);
  };

  const handleDirectWhatsApp = () => {
    recordWhatsAppClick('contact_page');
    showWhatsApp(
      'Service Clientèle WhatsApp',
      `Ouverture du chat direct avec ${settings.companyName} Goma (${settings.whatsappDisplay}).`
    );
    window.open(generateWhatsAppUrl(undefined, "Bonjour MWALI Baby Shop, je souhaite vous contacter pour une visite en boutique ou une commande."), '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-20">
      {/* Header */}
      <div className="bg-stone-900 text-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-amber-400 block mb-2">
            Goma • Derrière la Mairie de Goma
          </span>
          <h1 className="font-['Playfair_Display',serif] text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            Contactez {settings.companyName}
          </h1>
          <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
            Pour toute demande de prix sur nos articles de maternité, layette, habits & chaussures enfants ou produits de beauté authentiques, écrivez-nous sur WhatsApp ou passez en boutique à Goma.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Contact Cards & Coordinates */}
          <div className="lg:col-span-5 space-y-6">
            {/* Physical Address Card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800">
                <MapPin className="w-4 h-4 text-amber-600" />
                <span>Boutique Physique</span>
              </div>

              <h2 className="font-['Playfair_Display',serif] text-xl font-bold text-stone-900">
                Goma, Nord-Kivu
              </h2>

              <p className="text-sm text-stone-600 leading-relaxed">
                {settings.address}
                <br />
                {settings.city}, {settings.country}
              </p>

              <div className="pt-2 border-t border-stone-100 flex items-start gap-2.5 text-xs text-stone-500">
                <Clock className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-stone-800 block">Horaires de réception :</span>
                  <span>{settings.openingHours}</span>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Callout */}
            <div className="bg-emerald-950 text-white p-6 sm:p-8 rounded-3xl border border-emerald-800 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-400">
                <MessageCircle className="w-4 h-4" />
                <span>Service le Plus Rapide</span>
              </div>

              <h2 className="font-['Playfair_Display',serif] text-xl font-bold">
                WhatsApp Officiel
              </h2>

              <p className="text-xs text-stone-300 leading-relaxed">
                Toutes nos transactions et demandes de tarifs s'effectuent en direct sur WhatsApp.
              </p>

              <div className="p-3.5 bg-emerald-900/50 rounded-2xl border border-emerald-700/50 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-emerald-300 block">Numéro actif :</span>
                  <span className="font-mono text-sm font-bold text-white">{settings.whatsappDisplay}</span>
                </div>
                <button
                  onClick={handleDirectWhatsApp}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-stone-950 rounded-xl font-bold text-xs shadow transition-colors"
                >
                  Ouvrir
                </button>
              </div>
            </div>

            {/* Email & Phone */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-3 text-xs">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-stone-500" />
                <div>
                  <span className="font-semibold text-stone-900 block">Téléphone standard :</span>
                  <a href={`tel:${settings.phone}`} className="text-stone-600 hover:underline">{settings.phone}</a>
                </div>
              </div>
              <div className="flex items-center gap-3 pt-2 border-t border-stone-100">
                <Mail className="w-4 h-4 text-stone-500" />
                <div>
                  <span className="font-semibold text-stone-900 block">Courriel :</span>
                  <a href={`mailto:${settings.email}`} className="text-stone-600 hover:underline">{settings.email}</a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Form + Interactive Map */}
          <div className="lg:col-span-7 space-y-8">
            {/* Contact Form */}
            <div className="bg-white p-8 sm:p-10 rounded-3xl border border-stone-200 shadow-sm">
              <div className="mb-6 space-y-1">
                <h2 className="font-['Playfair_Display',serif] text-2xl font-bold text-stone-900">
                  Envoyer une Demande
                </h2>
                <p className="text-xs text-stone-500">
                  Remplissez ce formulaire pour initier instantanément une conversation avec notre conseiller sur WhatsApp.
                </p>
              </div>

              {submitted ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h4 className="text-sm font-bold text-emerald-950">Demande Prête !</h4>
                  <p className="text-xs text-emerald-800 max-w-sm mx-auto">
                    Votre message a été formulé. La fenêtre WhatsApp s'est ouverte pour transmettre votre échange à nos conseillers.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-xs text-stone-600 underline font-medium"
                  >
                    Envoyer un autre message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Votre Nom complet *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="ex. Marie Kabila"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Numéro de téléphone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="ex. +243 81..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Objet de votre démarche
                    </label>
                    <select
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 bg-white"
                    >
                      <option>Demande de prix & disponibilité d'un article</option>
                      <option>Trousseau de maternité & préparation accouchement</option>
                      <option>Layette nouveau-né & coffrets cadeaux</option>
                      <option>Habits & chaussures pour enfants</option>
                      <option>Produits de beauté authentiques</option>
                      <option>Autre question</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Votre Message *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Indiquez l'article, l'âge de l'enfant ou toute précision concernant votre demande..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all active:scale-98"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Envoyer vers notre WhatsApp ({settings.whatsappDisplay})</span>
                  </button>
                </form>
              )}
            </div>

            {/* Google Maps / Location Visualizer (Goma, Nord-Kivu) */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-900">
                  <Navigation className="w-4 h-4 text-amber-600" />
                  <span>Plan d'Accès Boutique</span>
                </div>
                <span className="text-xs text-stone-500 font-medium">Goma — Derrière la Mairie de Goma</span>
              </div>

              {/* Styled Interactive Map with Google Maps Embed for Goma */}
              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-stone-200 bg-stone-100">
                <iframe
                  title="Carte localisation MWALI Baby Shop Goma"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  marginHeight={0}
                  marginWidth={0}
                  src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=fr&amp;q=Mairie%20de%20Goma,%20Nord-Kivu,%20RDC+(MWALI%20Baby%20Shop%20-%20Goma)&amp;t=&amp;z=15&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
                  className="w-full h-full filter contrast-105"
                />

                <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-sm border border-stone-200 text-[11px] font-medium text-stone-800">
                  📍 {settings.address} ({settings.city})
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
