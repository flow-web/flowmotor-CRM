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

// Couleurs des badges par statut (Brand Board — Luxe Command Center)
export const VEHICLE_STATUS_COLORS = {
  SOURCING: 'bg-transparent text-yellow-400 border-yellow-400/40',
  STOCK: 'bg-transparent text-emerald-400 border-emerald-400/40',
  SOLD: 'bg-transparent text-[#D4AF37] border-[#D4AF37]/40'
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

// Couleurs par catégorie de coût (pour PRU Breakdown et chips)
export const COST_CATEGORY_COLORS = {
  'Achat': '#3498DB',
  'Transport': '#9B59B6',
  'Douane': '#E74C3C',
  'Homologation': '#E67E22',
  'Malus CO2': '#E74C3C',
  'Admin': '#F39C12',
  'Atelier': '#2ECC71',
  'Pièces': '#34495E',
  'Detailing': '#D4A574',
  'Autre': '#95A5A6'
}

// Checklist documents par pays d'origine
export const DOCUMENT_CHECKLISTS = {
  FR: [
    { key: 'carte_grise', label: 'Carte grise', required: true },
    { key: 'controle_technique', label: 'Contrôle technique', required: true },
    { key: 'facture_achat', label: "Facture d'achat", required: true },
    { key: 'cerfa_cession', label: 'CERFA Cession', required: true },
    { key: 'attestation_assurance', label: "Attestation d'assurance", required: false },
  ],
  CH: [
    { key: 'carte_grise', label: 'Carte grise suisse', required: true },
    { key: 'facture_achat', label: "Facture d'achat", required: true },
    { key: 'dédouanement', label: 'Document de dédouanement (DAU)', required: true },
    { key: 'quittance_tva', label: 'Quittance TVA import', required: true },
    { key: 'coc', label: 'COC (Certificat de Conformité)', required: true },
    { key: 'controle_technique', label: 'Contrôle technique français', required: true },
    { key: 'demande_immat', label: "Demande d'immatriculation", required: true },
    { key: 'attestation_assurance', label: "Attestation d'assurance", required: false },
  ],
  JP: [
    { key: 'export_certificate', label: "Certificat d'export japonais", required: true },
    { key: 'facture_achat', label: "Facture d'achat", required: true },
    { key: 'bill_of_lading', label: 'Bill of Lading (BL)', required: true },
    { key: 'dédouanement', label: 'Document de dédouanement (DAU)', required: true },
    { key: 'quittance_tva', label: 'Quittance TVA import', required: true },
    { key: 'homologation', label: 'Homologation DREAL/UTAC', required: true },
    { key: 'controle_technique', label: 'Contrôle technique français', required: true },
    { key: 'demande_immat', label: "Demande d'immatriculation", required: true },
    { key: 'attestation_assurance', label: "Attestation d'assurance", required: false },
  ],
  GB: [
    { key: 'v5c', label: 'V5C (logbook UK)', required: true },
    { key: 'facture_achat', label: "Facture d'achat", required: true },
    { key: 'dédouanement', label: 'Document de dédouanement (DAU)', required: true },
    { key: 'quittance_tva', label: 'Quittance TVA import', required: true },
    { key: 'coc', label: 'COC ou attestation constructeur', required: true },
    { key: 'controle_technique', label: 'Contrôle technique français', required: true },
    { key: 'demande_immat', label: "Demande d'immatriculation", required: true },
    { key: 'attestation_assurance', label: "Attestation d'assurance", required: false },
  ],
  DEFAULT: [
    { key: 'carte_grise', label: 'Carte grise / titre étranger', required: true },
    { key: 'facture_achat', label: "Facture d'achat", required: true },
    { key: 'dédouanement', label: 'Document de dédouanement', required: false },
    { key: 'quittance_tva', label: 'Quittance TVA', required: false },
    { key: 'coc', label: 'COC (Certificat de Conformité)', required: false },
    { key: 'controle_technique', label: 'Contrôle technique', required: true },
    { key: 'demande_immat', label: "Demande d'immatriculation", required: true },
    { key: 'attestation_assurance', label: "Attestation d'assurance", required: false },
  ]
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

// Types CERFA
export const CERFA_TYPES = {
  CESSION: 'cession',
  DEMANDE_IMMATRICULATION: 'demande_immatriculation',
  MANDAT_IMMATRICULATION: 'mandat_immatriculation'
}

export const CERFA_PREFIXES = {
  cession: 'CC',
  demande_immatriculation: 'DI',
  mandat_immatriculation: 'MI'
}

export const CERFA_LABELS = {
  cession: 'Certificat de Cession',
  demande_immatriculation: "Demande d'Immatriculation",
  mandat_immatriculation: "Mandat d'Immatriculation"
}

// Clés localStorage
export const STORAGE_KEYS = {
  VEHICLES: 'flowmotor_vehicles',
  SETTINGS: 'flowmotor_settings',
  AUTH: 'flowmotor_auth',
  COMPANY_INFO: 'flowmotor_company_info',
  INVOICES: 'flowmotor_invoices',
  CERFA: 'flowmotor_cerfa',
  REPRISES: 'flowmotor_reprises'
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
