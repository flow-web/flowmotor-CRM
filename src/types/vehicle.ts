/**
 * Vehicle Type Definitions
 * Complete TypeScript interface for Flow Motor CRM vehicles
 * Matches schema in supabase/reset_crm.sql (Phase 4)
 */

export type VehicleStatus = 'SOURCING' | 'STOCK' | 'SOLD'

export type DriveType = 'FWD' | 'RWD' | 'AWD' | '4WD'

export type FuelType =
  | 'Essence'
  | 'Diesel'
  | 'Hybride'
  | 'Électrique'
  | 'Hybride rechargeable'
  | 'GPL'
  | 'GNV'

export type Transmission =
  | 'Manuelle'
  | 'Automatique'
  | 'Séquentielle'
  | 'Robotisée'

export type EuroStandard =
  | 'Euro 3'
  | 'Euro 4'
  | 'Euro 5'
  | 'Euro 6b'
  | 'Euro 6c'
  | 'Euro 6d-TEMP'
  | 'Euro 6d'

export type InteriorMaterial =
  | 'Tissu'
  | 'Cuir'
  | 'Alcantara'
  | 'Cuir/Alcantara'
  | 'Velours'
  | 'Similicuir'

export interface VehicleImage {
  id: string
  url: string
  path: string
  isPrimary: boolean
  name?: string
}

export interface VehicleCost {
  id: string
  type: string
  amount: number
  description: string
  supplier?: string
  receipt_url?: string
  date: string
}

export interface Vehicle {
  // Core identifiers
  id: string
  vin: string

  // Basic information
  brand: string
  make: string // alias for compatibility
  model: string
  trim: string
  year: number
  mileage: number
  color: string

  // Technical specifications
  fuelType: string
  transmission: string
  powerCh: number
  powerKw: number
  displacementCc: number
  cylinders: number
  driveType: string
  gearsCount: number
  weightEmptyKg: number
  engineCode: string

  // Economy & Environment
  co2Emissions: number
  consumptionMixed: number
  consumptionCity: number
  consumptionHighway: number
  euroStandard: string
  critair: number | null

  // Dimensions & Body
  lengthMm: number
  widthMm: number
  heightMm: number
  trunkVolumeL: number
  seats: number
  doors: number
  payloadKg: number

  // History & State
  ownersCount: number
  lastServiceDate: string | null
  isImport: boolean
  countryOrigin: string
  warrantyMonths: number

  // Colors & Interior
  interiorMaterial: string
  interiorColor: string
  exteriorColorDetailed: string

  // Sourcing
  sourceUrl: string
  sellerName: string

  // Financial data
  purchasePrice: number
  currency: string
  exchangeRate: number
  transportCost: number
  customsFee: number
  vatAmount: number
  feesTotal: number
  costPrice: number
  sellingPrice: number
  margin: number
  marginPercent: number

  // Import info
  originCountry: string
  vatRate: number
  isEuOrigin: boolean

  // Status & workflow
  status: VehicleStatus
  notes: string

  // Images
  images: VehicleImage[]

  // Registration
  registrationPlate: string

  // Relations
  costs: VehicleCost[]
  documents: any[]
  timeline: any[]

  // Timestamps
  createdAt: string
  updatedAt: string
}

// Partial vehicle for create/update operations
export type VehicleInput = Partial<Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>>

// Vehicle search filters
export interface VehicleFilters {
  status?: VehicleStatus | VehicleStatus[]
  brand?: string
  fuelType?: FuelType
  transmission?: Transmission
  driveType?: DriveType
  minYear?: number
  maxYear?: number
  minPrice?: number
  maxPrice?: number
  minMileage?: number
  maxMileage?: number
  countryOrigin?: string
  euroStandard?: EuroStandard
  minPowerCh?: number
  maxPowerCh?: number
}

// Vehicle statistics
export interface VehicleStats {
  totalCount: number
  sourcingCount: number
  stockCount: number
  soldCount: number
  stockValue: number
  totalRevenue: number
  totalMargin: number
  avgMarginPercent: number
}
