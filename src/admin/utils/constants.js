// Statuts du workflow véhicule
export const VEHICLE_STATUS = {
  SOURCING: 'SOURCING',
  ACHETE: 'ACHETÉ',
  TRANSPORT: 'TRANSPORT',
  ATELIER: 'ATELIER',
  EN_VENTE: 'EN_VENTE',
  VENDU: 'VENDU'
}

// Labels français pour les statuts
export const VEHICLE_STATUS_LABELS = {
  SOURCING: 'Sourcing',
  ACHETE: 'Acheté',
  TRANSPORT: 'Transport',
  ATELIER: 'Atelier',
  EN_VENTE: 'En vente',
  VENDU: 'Vendu'
}

// Couleurs des badges par statut
export const VEHICLE_STATUS_COLORS = {
  SOURCING: 'badge-status-sourcing',
  ACHETE: 'badge-status-achete',
  TRANSPORT: 'badge-status-transport',
  ATELIER: 'badge-status-atelier',
  EN_VENTE: 'badge-status-en-vente',
  VENDU: 'badge-status-vendu'
}

// Ordre du workflow
export const WORKFLOW_ORDER = [
  VEHICLE_STATUS.SOURCING,
  VEHICLE_STATUS.ACHETE,
  VEHICLE_STATUS.TRANSPORT,
  VEHICLE_STATUS.ATELIER,
  VEHICLE_STATUS.EN_VENTE,
  VEHICLE_STATUS.VENDU
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
  AUTH: 'flowmotor_auth'
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
