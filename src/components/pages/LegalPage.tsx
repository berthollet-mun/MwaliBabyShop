import React from 'react';
import { ShieldCheck, ChevronLeft } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface LegalPageProps {
  onNavigate: (path: string) => void;
}

export const LegalPage: React.FC<LegalPageProps> = ({ onNavigate }) => {
  const { settings } = useStore();

  return (
    <div className="min-h-screen bg-white py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <button
          onClick={() => onNavigate('/')}
          className="inline-flex items-center gap-1.5 text-stone-500 hover:text-black text-xs uppercase tracking-wider font-semibold transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Retour à l'accueil</span>
        </button>

        <div className="space-y-3 pb-8 border-b border-stone-200">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 text-stone-700 text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>Transparence & Cadre Juridique</span>
          </div>
          <h1 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl font-bold text-stone-900">
            Mentions Légales & Conditions de Commande
          </h1>
          <p className="text-xs text-stone-400">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
          </p>
        </div>

        <div className="prose prose-stone text-sm text-stone-700 space-y-8 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-stone-900 font-['Playfair_Display',serif]">
              1. Éditeur de l’application & Identité
            </h2>
            <p>
              Le présent site vitrine et catalogue interactif est édité par la boutique <strong>{settings.companyName}</strong>, établie au :
            </p>
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs font-mono text-stone-800">
              {settings.companyName}<br />
              {settings.address}<br />
              {settings.city}, {settings.country}<br />
              Téléphone : {settings.phone}<br />
              WhatsApp : {settings.whatsappDisplay}<br />
              Email : {settings.email}
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-stone-900 font-['Playfair_Display',serif]">
              2. Modalités de commande sans paiement en ligne
            </h2>
            <p>
              Le site <strong>{settings.companyName}</strong> fonctionne exclusivement comme un catalogue vitrine. Aucun numéro de carte bancaire ni paiement direct n’est exigé ou collecté sur cette plateforme.
            </p>
            <p>
              Toute intention de commande s’effectue par mise en relation sur l’application de messagerie instantanée <strong>WhatsApp</strong> :
            </p>
            <ul className="list-disc list-inside space-y-1 text-xs text-stone-600 pl-2">
              <li>Le client consulte les caractéristiques et visuels de l'article sur le catalogue.</li>
              <li>Le clic sur le bouton « Commander sur WhatsApp » pré-remplit un message détaillé mentionnant la référence et le nom de la pièce.</li>
              <li>Les discussions tarifaires, les disponibilités de tailles et les modalités de remise s’effectuent en direct avec nos conseillers.</li>
              <li><strong>Accord mutuel :</strong> La commande n'est réputée conclue qu’après confirmation réciproque écrite et accord mutuel des deux parties.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-stone-900 font-['Playfair_Display',serif]">
              3. Absence d’affichage des prix
            </h2>
            <p>
              Conformément à la politique commerciale de <strong>{settings.companyName}</strong>, les prix sont communiqués directement par nos conseillers sur demande via WhatsApp afin de vous accompagner dans le choix des tailles et modèles d'habits, des lots de maternité/layette ou des gammes de beauté.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-stone-900 font-['Playfair_Display',serif]">
              4. Données personnelles & Confidentialité
            </h2>
            <p>
              Aucune donnée bancaire n'est stockée. Les éventuelles coordonnées communiquées lors des échanges WhatsApp ne sont utilisées que dans le strict cadre du traitement de votre commande et de la relation client personnalisée.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-stone-900 font-['Playfair_Display',serif]">
              5. Propriété intellectuelle
            </h2>
            <p>
              Tous les textes, marques, logos, graphismes et photographies présentés sur ce site sont la propriété exclusive de <strong>{settings.companyName}</strong> ou de leurs auteurs respectifs sous licence. Toute reproduction partielle ou intégrale sans autorisation préalable est interdite.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
