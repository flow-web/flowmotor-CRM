// Statuts du workflow véhicule (simplifié pour CRM)
export const VEHICLE_STATUS = {
  SOURCING: 'SOURCING',  // En recherche / négociation
  STOCK: 'STOCK',        // En stock, prêt à vendre
  SOLD: 'SOLD'           // Vendu
}

// Labels français pour les statuts
export const VEHICLE_STATUS_LABELS = {
  SOURCING: 'Sourcing',
  STOCK: 'En Stock',
  SOLD: 'Vendu'
}

// Couleurs des badges par statut (Brand Board)
export const VEHICLE_STATUS_COLORS = {
  SOURCING: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  STOCK: 'bg-green-500/20 text-green-400 border-green-500/30',
  SOLD: 'bg-[#5C3A2E]/30 text-[#C4A484] border-[#5C3A2E]/50'
}

// Ordre du workflow (simplifié)
export const WORKFLOW_ORDER = [
  VEHICLE_STATUS.SOURCING,
  VEHICLE_STATUS.STOCK,
  VEHICLE_STATUS.SOLD
]

// Types de coûts
export const COST_TYPES = {
  PURCHASE: 'Achat',
  TRANSPORT: 'Transport',
  CUSTOMS: 'Douane',
  HOMOLOGATION: 'Homologation',
  CO2_MALUS: 'Malus CO2',
  ATELIER: 'Atelier',
  DETAILING: 'Detailing',
  PIECES: 'Pièces',
  OTHER: 'Autre'
}

// Types de documents
export const DOCUMENT_TYPES = {
  CARTE_GRISE: 'Carte grise',
  COC: 'COC (Certificat de Conformité)',
  FACTURE_ACHAT: 'Facture achat',
  FACTURE_TRANSPORT: 'Facture transport',
  EXPERTISE: 'Expertise',
  DOUANE: 'Document douane',
  CONTROLE_TECHNIQUE: 'Contrôle technique',
  PHOTO: 'Photo',
  OTHER: 'Autre'
}

// Devises supportées
export const CURRENCIES = {
  EUR: { code: 'EUR', symbol: '€', name: 'Euro' },
  CHF: { code: 'CHF', symbol: 'CHF', name: 'Franc Suisse' },
  GBP: { code: 'GBP', symbol: '£', name: 'Livre Sterling' },
  JPY: { code: 'JPY', symbol: '¥', name: 'Yen Japonais' }
}

// Pays d'origine courants
export const ORIGIN_COUNTRIES = [
  { code: 'CH', name: 'Suisse' },
  { code: 'DE', name: 'Allemagne' },
  { code: 'JP', name: 'Japon' },
  { code: 'GB', name: 'Royaume-Uni' },
  { code: 'BE', name: 'Belgique' },
  { code: 'IT', name: 'Italie' },
  { code: 'ES', name: 'Espagne' },
  { code: 'NL', name: 'Pays-Bas' },
  { code: 'US', name: 'États-Unis' }
]

// Marques courantes
export const CAR_MAKES = [
  'Audi', 'BMW', 'Mercedes-Benz', 'Porsche', 'Volkswagen',
  'Toyota', 'Nissan', 'Honda', 'Mazda', 'Subaru',
  'Ferrari', 'Lamborghini', 'Maserati', 'Alfa Romeo',
  'Jaguar', 'Land Rover', 'Bentley', 'Rolls-Royce',
  'McLaren', 'Aston Martin', 'Lotus'
]

// Clés localStorage
export const STORAGE_KEYS = {
  VEHICLES: 'flowmotor_vehicles',
  SETTINGS: 'flowmotor_settings',
  AUTH: 'flowmotor_auth',
  COMPANY_INFO: 'flowmotor_company_info',
  INVOICES: 'flowmotor_invoices'
}

// Informations société par défaut
export const DEFAULT_COMPANY_INFO = {
  name: 'FLOW MOTOR',
  legal: 'SASU AU CAPITAL DE 100 \u20AC',
  rcs: 'RCS Lyon',
  owner: 'Florian Meissel',
  address: '6 Rue du Bon Pasteur',
  zipCity: '69001 Lyon',
  phone: '06 22 85 26 22',
  email: 'florian@flowmotor.fr',
  siren: '992 700 427',
  tvaIntra: 'FR18992700427',
  iban: 'FR76 1695 8000 0101 7915 0306 806',
  bic: 'QNTOFRP1XXX'
}

// Paramètres par défaut
export const DEFAULT_SETTINGS = {
  defaultMargin: 15, // 15%
  vatRate: 20, // 20%
  vatOnMargin: true,
  exchangeRates: {
    CHF: 0.95,
    GBP: 1.17,
    JPY: 0.0062
  }
}
