/**
 * SIV API Integration - French Vehicle Registration Lookup
 *
 * Dual-mode implementation:
 * - Real API mode: If VITE_SIV_API_KEY is set, calls the actual SIV API
 * - Mock mode: If no API key, returns realistic demo data
 *
 * Supported plate formats: AA-123-BB, AA123BB, aa 123 bb
 * Normalized format: AA-123-BB
 */

const API_KEY = import.meta.env.VITE_SIV_API_KEY
const API_URL = 'https://api.siv-auto.fr/v1/vehicles' // Example endpoint - adjust based on actual API

/**
 * Validates and normalizes a French license plate format
 * @param {string} plate - Raw plate input
 * @returns {{valid: boolean, normalized: string, error?: string}}
 */
export function validatePlate(plate) {
  if (!plate || typeof plate !== 'string') {
    return { valid: false, normalized: '', error: 'Plaque invalide' }
  }

  // Remove all non-alphanumeric characters and convert to uppercase
  const clean = plate.toUpperCase().replace(/[^A-Z0-9]/g, '')

  // French format: 2 letters - 3 numbers - 2 letters
  const regex = /^[A-Z]{2}[0-9]{3}[A-Z]{2}$/

  if (!regex.test(clean)) {
    return {
      valid: false,
      normalized: '',
      error: 'Format invalide. Attendu: AA-123-BB'
    }
  }

  // Normalize to AA-123-BB format
  const normalized = `${clean.slice(0, 2)}-${clean.slice(2, 5)}-${clean.slice(5, 7)}`

  return { valid: true, normalized }
}

/**
 * Mock data generator for demo mode
 * Returns realistic vehicle data based on plate
 */
function getMockVehicleData(plate) {
  // Database of common mock vehicles
  const mockDatabase = {
    'AA-123-BB': {
      brand: 'Renault',
      model: 'Clio V',
      version: 'Intens',
      year: 2020,
      fuel: 'Essence',
      mileage: 45000,
      color: 'Noir',
      vin: 'VF1RJA00123456789'
    },
    'BB-456-CC': {
      brand: 'Peugeot',
      model: '308',
      version: 'GT Line',
      year: 2019,
      fuel: 'Diesel',
      mileage: 68000,
      color: 'Gris',
      vin: 'VF3LCYHZJKS123456'
    },
    'CC-789-DD': {
      brand: 'BMW',
      model: 'Série 3',
      version: '320d',
      year: 2021,
      fuel: 'Diesel',
      mileage: 32000,
      color: 'Blanc',
      vin: 'WBA3A5C50EF123456'
    },
    'DD-012-EE': {
      brand: 'Volkswagen',
      model: 'Golf',
      version: 'GTI',
      year: 2018,
      fuel: 'Essence',
      mileage: 85000,
      color: 'Rouge',
      vin: 'WVWZZZAUZJW123456'
    },
    'EE-345-FF': {
      brand: 'Audi',
      model: 'A4',
      version: 'S Line',
      year: 2022,
      fuel: 'Diesel',
      mileage: 22000,
      color: 'Bleu',
      vin: 'WAUZZZ8V9MA123456'
    }
  }

  // Return exact match if exists
  if (mockDatabase[plate]) {
    return { success: true, data: mockDatabase[plate] }
  }

  // Generate random vehicle for unknown plates
  const brands = ['Renault', 'Peugeot', 'Citroën', 'Volkswagen', 'BMW', 'Mercedes', 'Audi', 'Toyota', 'Nissan']
  const models = ['Clio', '308', 'Golf', 'Série 3', 'A4', 'Corolla', 'Qashqai', 'C3', '208']
  const fuels = ['Essence', 'Diesel', 'Hybride']
  const colors = ['Noir', 'Blanc', 'Gris', 'Bleu', 'Rouge', 'Argent']

  const randomBrand = brands[Math.floor(Math.random() * brands.length)]
  const randomModel = models[Math.floor(Math.random() * models.length)]
  const randomYear = 2015 + Math.floor(Math.random() * 10) // 2015-2024
  const randomMileage = 10000 + Math.floor(Math.random() * 140000) // 10k-150k

  return {
    success: true,
    data: {
      brand: randomBrand,
      model: randomModel,
      version: 'Standard',
      year: randomYear,
      fuel: fuels[Math.floor(Math.random() * fuels.length)],
      mileage: randomMileage,
      color: colors[Math.floor(Math.random() * colors.length)],
      vin: `VF${plate.replace(/-/g, '')}${Math.random().toString(36).substring(7).toUpperCase()}`
    }
  }
}

/**
 * Calls the real SIV API
 * @param {string} plate - Normalized plate (AA-123-BB)
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
async function callRealAPI(plate) {
  try {
    const response = await fetch(`${API_URL}?plate=${encodeURIComponent(plate)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      if (response.status === 404) {
        return { success: false, error: 'Véhicule non trouvé dans la base SIV' }
      }
      if (response.status === 429) {
        return { success: false, error: 'Limite de requêtes atteinte. Réessayez dans quelques instants.' }
      }
      return { success: false, error: `Erreur API: ${response.status}` }
    }

    const result = await response.json()

    // Transform API response to our schema
    return {
      success: true,
      data: {
        brand: result.brand || result.marque,
        model: result.model || result.modele,
        version: result.version || result.finition,
        year: result.year || result.annee,
        fuel: result.fuel || result.carburant,
        mileage: result.mileage || result.kilometrage || null, // API may not have mileage
        color: result.color || result.couleur,
        vin: result.vin
      }
    }
  } catch (err) {
    console.error('[SIV API] Network error:', err)
    return { success: false, error: 'Erreur réseau. Vérifiez votre connexion.' }
  }
}

/**
 * Main function: Gets vehicle data by license plate
 * @param {string} plate - License plate (any format)
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export async function getVehicleByPlate(plate) {
  // 1. Validate and normalize plate
  const validation = validatePlate(plate)
  if (!validation.valid) {
    return { success: false, error: validation.error }
  }

  const normalizedPlate = validation.normalized

  // 2. Choose mode: Real API or Mock
  if (API_KEY) {
    console.log('[SIV API] Mode: Real API')
    return await callRealAPI(normalizedPlate)
  } else {
    console.log('[SIV API] Mode: Mock (no API key)')
    // Simulate network delay for realism
    await new Promise(resolve => setTimeout(resolve, 800))
    return getMockVehicleData(normalizedPlate)
  }
}

/**
 * Check if SIV API is configured
 * @returns {boolean}
 */
export function isSIVConfigured() {
  return !!API_KEY
}

/**
 * Maps fuel types from SIV to our DB schema values
 */
export const FUEL_MAPPING = {
  'Essence': 'essence',
  'Diesel': 'diesel',
  'Hybride': 'hybride',
  'Électrique': 'electric',
  'GPL': 'gpl'
}

/**
 * Estimates mileage range based on year (if API doesn't provide it)
 * @param {number} year - Vehicle year
 * @returns {string} - Estimated mileage range value
 */
export function estimateMileageRange(year) {
  const age = new Date().getFullYear() - year
  const avgKmPerYear = 12000
  const estimatedKm = age * avgKmPerYear

  if (estimatedKm < 10000) return '0-10000'
  if (estimatedKm < 30000) return '10000-30000'
  if (estimatedKm < 60000) return '30000-60000'
  if (estimatedKm < 100000) return '60000-100000'
  if (estimatedKm < 150000) return '100000-150000'
  return '150000+'
}
