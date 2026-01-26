import { VEHICLE_STATUS } from '../utils/constants'
import { generateId } from '../utils/formatters'

export const mockVehicles = [
  {
    id: generateId(),
    vin: 'WVWZZZ3CZWE123456',
    make: 'Audi',
    model: 'RS6 Avant',
    trim: 'Performance',
    year: 2021,
    mileage: 45000,
    color: 'Gris Nardo',
    registration: 'ZH-123456',

    sourceUrl: 'https://www.autoscout24.ch/example',
    seller: {
      name: 'Auto Zentrum Zürich',
      phone: '+41 44 123 45 67',
      email: 'contact@autozentrum.ch',
      type: 'professional'
    },
    purchasePrice: 95000,
    currency: 'CHF',
    exchangeRate: 0.95,
    originCountry: 'CH',

    marketPrice: 125000,
    targetMargin: 15,

    status: VEHICLE_STATUS.EN_VENTE,
    timeline: [
      { step: VEHICLE_STATUS.SOURCING, status: 'completed', date: '2024-12-01', notes: 'Véhicule repéré sur Autoscout24' },
      { step: VEHICLE_STATUS.ACHETE, status: 'completed', date: '2024-12-05', notes: 'Négociation réussie -3000 CHF' },
      { step: VEHICLE_STATUS.TRANSPORT, status: 'completed', date: '2024-12-10', notes: 'Livraison par camion plateau' },
      { step: VEHICLE_STATUS.ATELIER, status: 'completed', date: '2024-12-15', notes: 'Révision complète, detailing' },
      { step: VEHICLE_STATUS.EN_VENTE, status: 'in_progress', date: '2024-12-20', notes: 'Publié sur le site' },
      { step: VEHICLE_STATUS.VENDU, status: 'pending', date: null, notes: '' }
    ],

    costs: [
      { id: '1', type: 'Transport', amount: 850, date: '2024-12-10', invoiceUrl: null, description: 'Transport Zürich → Lyon' },
      { id: '2', type: 'Douane', amount: 0, date: '2024-12-10', invoiceUrl: null, description: 'Import Suisse - pas de droits' },
      { id: '3', type: 'Atelier', amount: 1200, date: '2024-12-15', invoiceUrl: null, description: 'Révision complète' },
      { id: '4', type: 'Detailing', amount: 350, date: '2024-12-18', invoiceUrl: null, description: 'Polissage + traitement céramique' }
    ],

    sellingPrice: 115000,

    images: [
      { id: '1', url: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=1200&q=80', isPrimary: true, order: 0 },
      { id: '2', url: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200&q=80', isPrimary: false, order: 1 }
    ],
    documents: [],

    createdAt: '2024-12-01T10:00:00Z',
    updatedAt: '2024-12-20T14:30:00Z',
    notes: 'Excellent état, historique complet Audi. Client potentiel M. Martin intéressé.'
  },
  {
    id: generateId(),
    vin: 'WP0ZZZ99ZPS123456',
    make: 'Porsche',
    model: '911 GT3',
    trim: 'Touring',
    year: 2022,
    mileage: 12000,
    color: 'Bleu Requin',
    registration: '',

    sourceUrl: 'https://www.mobile.de/example',
    seller: {
      name: 'Porsche Zentrum München',
      phone: '+49 89 123 45 67',
      email: 'sales@porsche-muenchen.de',
      type: 'professional'
    },
    purchasePrice: 195000,
    currency: 'EUR',
    exchangeRate: 1,
    originCountry: 'DE',

    marketPrice: 235000,
    targetMargin: 12,

    status: VEHICLE_STATUS.TRANSPORT,
    timeline: [
      { step: VEHICLE_STATUS.SOURCING, status: 'completed', date: '2024-12-15', notes: '' },
      { step: VEHICLE_STATUS.ACHETE, status: 'completed', date: '2024-12-18', notes: 'Achat direct' },
      { step: VEHICLE_STATUS.TRANSPORT, status: 'in_progress', date: '2024-12-22', notes: 'En transit Munich → Lyon' },
      { step: VEHICLE_STATUS.ATELIER, status: 'pending', date: null, notes: '' },
      { step: VEHICLE_STATUS.EN_VENTE, status: 'pending', date: null, notes: '' },
      { step: VEHICLE_STATUS.VENDU, status: 'pending', date: null, notes: '' }
    ],

    costs: [
      { id: '1', type: 'Transport', amount: 650, date: '2024-12-22', invoiceUrl: null, description: 'Transport Munich → Lyon' }
    ],

    sellingPrice: 225000,

    images: [
      { id: '1', url: 'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?w=1200&q=80', isPrimary: true, order: 0 }
    ],
    documents: [],

    createdAt: '2024-12-15T09:00:00Z',
    updatedAt: '2024-12-22T11:00:00Z',
    notes: 'GT3 Touring très rare. Pack Chrono + Baquets carbone.'
  },
  {
    id: generateId(),
    vin: 'WBAPH5C55BA123456',
    make: 'BMW',
    model: 'M4 Competition',
    trim: 'xDrive',
    year: 2023,
    mileage: 8000,
    color: 'Vert Isle of Man',
    registration: '',

    sourceUrl: '',
    seller: {
      name: 'Particulier',
      phone: '+33 6 12 34 56 78',
      email: '',
      type: 'particular'
    },
    purchasePrice: 82000,
    currency: 'EUR',
    exchangeRate: 1,
    originCountry: 'DE',

    marketPrice: 98000,
    targetMargin: 10,

    status: VEHICLE_STATUS.SOURCING,
    timeline: [
      { step: VEHICLE_STATUS.SOURCING, status: 'in_progress', date: '2024-12-26', notes: 'En négociation' },
      { step: VEHICLE_STATUS.ACHETE, status: 'pending', date: null, notes: '' },
      { step: VEHICLE_STATUS.TRANSPORT, status: 'pending', date: null, notes: '' },
      { step: VEHICLE_STATUS.ATELIER, status: 'pending', date: null, notes: '' },
      { step: VEHICLE_STATUS.EN_VENTE, status: 'pending', date: null, notes: '' },
      { step: VEHICLE_STATUS.VENDU, status: 'pending', date: null, notes: '' }
    ],

    costs: [],

    sellingPrice: 95000,

    images: [
      { id: '1', url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&q=80', isPrimary: true, order: 0 }
    ],
    documents: [],

    createdAt: '2024-12-26T08:00:00Z',
    updatedAt: '2024-12-26T08:00:00Z',
    notes: 'À négocier. Vendeur demande 85k, objectif 80k.'
  },
  {
    id: generateId(),
    vin: 'WDB2030461A123456',
    make: 'Mercedes-AMG',
    model: 'GT R',
    trim: 'Pro',
    year: 2019,
    mileage: 18000,
    color: 'Vert Enfer',
    registration: 'AB-123-CD',

    sourceUrl: '',
    seller: {
      name: 'Client reprise',
      phone: '+33 6 98 76 54 32',
      email: 'client@email.com',
      type: 'particular'
    },
    purchasePrice: 145000,
    currency: 'EUR',
    exchangeRate: 1,
    originCountry: 'FR',

    marketPrice: 175000,
    targetMargin: 12,

    status: VEHICLE_STATUS.VENDU,
    timeline: [
      { step: VEHICLE_STATUS.SOURCING, status: 'completed', date: '2024-10-01', notes: 'Reprise client' },
      { step: VEHICLE_STATUS.ACHETE, status: 'completed', date: '2024-10-05', notes: '' },
      { step: VEHICLE_STATUS.TRANSPORT, status: 'completed', date: '2024-10-05', notes: 'Déjà sur site' },
      { step: VEHICLE_STATUS.ATELIER, status: 'completed', date: '2024-10-15', notes: 'Révision freins' },
      { step: VEHICLE_STATUS.EN_VENTE, status: 'completed', date: '2024-10-20', notes: '' },
      { step: VEHICLE_STATUS.VENDU, status: 'completed', date: '2024-11-15', notes: 'Vendu à M. Dupont' }
    ],

    costs: [
      { id: '1', type: 'Atelier', amount: 2800, date: '2024-10-15', invoiceUrl: null, description: 'Disques + plaquettes céramique' }
    ],

    sellingPrice: 165000,

    images: [
      { id: '1', url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200&q=80', isPrimary: true, order: 0 }
    ],
    documents: [],

    createdAt: '2024-10-01T14:00:00Z',
    updatedAt: '2024-11-15T16:00:00Z',
    notes: 'VENDU - Marge réalisée: 17 200€'
  }
]
