/**
 * Configuration WhatsApp centralisée pour MWALI Baby Shop
 * 
 * Ce fichier centralise le numéro de contact WhatsApp et les modèles de messages.
 * Pour changer le numéro ou le texte du message, il suffit d'éditer les valeurs ci-dessous.
 */

export const WHATSAPP_CONFIG = {
  // Numéro WhatsApp boutique (format international sans '+' ni espaces)
  // Numéro officiel : +243 971 171 975 (0971171975)
  phoneNumber: '243971171975',

  // Modèle de message pré-rempli pour la discussion du prix
  // {{NOM_PRODUIT}} est automatiquement remplacé par le nom du produit sélectionné
  messageTemplate: 'Bonjour, je suis intéressé par le produit "{{NOM_PRODUIT}}", pouvons-nous discuter du prix ?',
};

/**
 * Génère l'URL WhatsApp avec message pré-rempli pour discuter du prix d'un produit
 * @param productName Nom du produit
 * @param customPhone Numéro optionnel pour remplacer le numéro par défaut
 */
export const getDiscussPriceWhatsAppUrl = (productName: string, customPhone?: string): string => {
  const phone = (customPhone || WHATSAPP_CONFIG.phoneNumber).replace(/\D/g, '');
  const text = WHATSAPP_CONFIG.messageTemplate.replace('{{NOM_PRODUIT}}', productName);
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
};
