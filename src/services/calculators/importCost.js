/**
 * Total Landed Cost Calculator for Imported Vehicles
 * Calculates customs, VAT, CO2 malus (2026 grid), and weight malus for French imports
 */

// EU countries (no customs duty)
const EU_COUNTRIES = [
  'FR', 'DE', 'IT', 'ES', 'NL', 'BE', 'AT', 'PT', 'PL', 'CZ', 'HU', 'RO', 'BG',
  'GR', 'SE', 'DK', 'FI', 'IE', 'SK', 'SI', 'HR', 'LT', 'LV', 'EE', 'CY', 'MT', 'LU'
]

// French CO2 Malus Grid 2026 (g/km → €)
// Progressive scale from 113 g/km to 225+ g/km
const MALUS_CO2_GRID_2026 = {
  0: 0, 10: 0, 20: 0, 30: 0, 40: 0, 50: 0, 60: 0, 70: 0, 80: 0, 90: 0,
  100: 0, 110: 0, 112: 0,
  113: 50,
  114: 75,
  115: 100,
  116: 125,
  117: 150,
  118: 170,
  119: 190,
  120: 210,
  121: 230,
  122: 240,
  123: 260,
  124: 280,
  125: 310,
  126: 330,
  127: 360,
  128: 390,
  129: 420,
  130: 460,
  131: 500,
  132: 540,
  133: 580,
  134: 630,
  135: 680,
  136: 740,
  137: 790,
  138: 850,
  139: 920,
  140: 980,
  141: 1050,
  142: 1130,
  143: 1210,
  144: 1300,
  145: 1390,
  146: 1490,
  147: 1600,
  148: 1710,
  149: 1830,
  150: 1960,
  151: 2100,
  152: 2240,
  153: 2390,
  154: 2550,
  155: 2720,
  156: 2900,
  157: 3090,
  158: 3290,
  159: 3500,
  160: 3720,
  161: 3960,
  162: 4200,
  163: 4460,
  164: 4740,
  165: 5020,
  166: 5320,
  167: 5640,
  168: 5970,
  169: 6320,
  170: 6680,
  171: 7060,
  172: 7460,
  173: 7870,
  174: 8300,
  175: 8750,
  176: 9220,
  177: 9710,
  178: 10220,
  179: 10750,
  180: 11310,
  181: 11890,
  182: 12500,
  183: 13140,
  184: 13810,
  185: 14510,
  186: 15240,
  187: 16010,
  188: 16820,
  189: 17670,
  190: 18560,
  191: 19490,
  192: 20470,
  193: 21500,
  194: 22590,
  195: 23730,
  196: 24930,
  197: 26200,
  198: 27530,
  199: 28930,
  200: 30410,
  201: 31980,
  202: 33630,
  203: 35370,
  204: 37200,
  205: 39130,
  206: 41160,
  207: 43300,
  208: 45550,
  209: 47920,
  210: 50410,
  211: 53030,
  212: 55790,
  213: 58690,
  214: 61740,
  215: 64950,
  216: 68330,
  217: 71890,
  218: 75640,
  219: 79590,
  220: 83750,
  221: 88130,
  222: 92740,
  223: 97600,
  224: 102720,
  225: 108120 // Capped at ~60,000€ max in reality, but using progressive scale
}

/**
 * Get raw CO2 malus from grid (no age reduction)
 * @param {number} co2GKm - CO2 emissions in g/km
 * @returns {number} - Malus amount in €
 */
export function getMalusCO2(co2GKm) {
  if (!co2GKm || co2GKm <= 112) return 0

  // Find exact match or interpolate
  if (MALUS_CO2_GRID_2026[co2GKm]) {
    return MALUS_CO2_GRID_2026[co2GKm]
  }

  // Cap at 225+ g/km
  if (co2GKm >= 225) {
    return Math.min(60000, MALUS_CO2_GRID_2026[225] || 60000)
  }

  // Linear interpolation between known points
  const lowerKey = Math.floor(co2GKm)
  const upperKey = Math.ceil(co2GKm)

  const lowerValue = MALUS_CO2_GRID_2026[lowerKey] || 0
  const upperValue = MALUS_CO2_GRID_2026[upperKey] || lowerValue

  const fraction = co2GKm - lowerKey
  return Math.round(lowerValue + (upperValue - lowerValue) * fraction)
}

/**
 * Get weight malus (Malus au Poids 2026)
 * @param {number} weightKg - Empty weight in kg
 * @param {string} fuelType - Fuel type (Essence, Diesel, Électrique, Hybride, etc.)
 * @param {number} firstRegYear - Year of first registration
 * @returns {number} - Weight malus in €
 */
export function getMalusWeight(weightKg, fuelType, firstRegYear) {
  // Only applies to vehicles first registered after 2022
  if (!firstRegYear || firstRegYear <= 2022) return 0
  if (!weightKg) return 0

  // Determine threshold based on fuel type
  const isElectricOrHybrid =
    fuelType?.toLowerCase().includes('électrique') ||
    fuelType?.toLowerCase().includes('hybride')

  const threshold = isElectricOrHybrid ? 1800 : 1600

  // Calculate malus
  if (weightKg <= threshold) return 0

  const excessKg = weightKg - threshold
  return excessKg * 10 // 10€ per kg over threshold
}

/**
 * Convert NEDC CO2 values to WLTP if needed
 * NEDC values are typically lower, especially for diesels
 * @param {number} co2GKm - Stated CO2 value
 * @param {string} fuelType - Fuel type
 * @returns {number} - Adjusted CO2 in WLTP
 */
function adjustCO2ToWLTP(co2GKm, fuelType) {
  if (!co2GKm) return 0

  // Heuristic: if diesel with suspiciously low CO2 (< 100), likely NEDC
  // Or any value that seems too good to be true for pre-2020 vehicles
  const isDiesel = fuelType?.toLowerCase().includes('diesel')

  if (isDiesel && co2GKm < 100) {
    // Apply 1.21 conversion factor (NEDC → WLTP average)
    return Math.round(co2GKm * 1.21)
  }

  // For non-diesel, trust the value (most modern values are WLTP)
  return co2GKm
}

/**
 * Calculate age reduction for used vehicle CO2 malus
 * @param {string|Date} firstRegDate - First registration date
 * @returns {number} - Reduction percentage (0-100)
 */
function getAgeReductionPercent(firstRegDate) {
  if (!firstRegDate) return 0

  const regDate = new Date(firstRegDate)
  const now = new Date()

  // Calculate years since registration
  const yearsDiff = now.getFullYear() - regDate.getFullYear()
  const monthsDiff = now.getMonth() - regDate.getMonth()

  // Adjust if birthday hasn't occurred yet this year
  const ageYears = monthsDiff < 0 ? yearsDiff - 1 : yearsDiff

  // 10% reduction per year, capped at 100%
  return Math.min(100, Math.max(0, ageYears * 10))
}

/**
 * Calculate total landed cost for an imported vehicle
 *
 * @param {Object} params
 * @param {string} params.countryOrigin - Country code (DE, JP, US, CH, etc.)
 * @param {number} params.co2GKm - CO2 emissions in g/km
 * @param {number} params.weightKg - Empty weight in kg
 * @param {string|Date} params.firstRegDate - First registration date
 * @param {number} params.purchasePrice - Purchase price in EUR
 * @param {string} params.fuelType - Fuel type (Essence, Diesel, Hybride, etc.)
 * @param {number} params.shippingCost - Transport/shipping cost in EUR
 * @param {number} params.firstRegYear - Year of first registration (optional, for weight malus)
 *
 * @returns {Object} - Detailed cost breakdown
 */
export function calculateTotalLandedCost(params) {
  const {
    countryOrigin = 'FR',
    co2GKm = 0,
    weightKg = 0,
    firstRegDate = null,
    purchasePrice = 0,
    fuelType = '',
    shippingCost = 0,
    firstRegYear = null
  } = params

  // A. Customs Duty
  const isEU = EU_COUNTRIES.includes(countryOrigin?.toUpperCase())
  const customsRate = isEU ? 0 : 0.10 // 10% for non-EU
  const customsBase = purchasePrice + shippingCost
  const customsDuty = Math.round(customsBase * customsRate * 100) / 100

  // B. VAT (20% on purchase + shipping + customs)
  const vatRate = 0.20
  const vatBase = purchasePrice + shippingCost + customsDuty
  const vat = Math.round(vatBase * vatRate * 100) / 100

  // C. CO2 Malus (2026 grid with age reduction)
  const adjustedCO2 = adjustCO2ToWLTP(co2GKm, fuelType)
  const malusCO2Raw = getMalusCO2(adjustedCO2)
  const ageReductionPercent = getAgeReductionPercent(firstRegDate)
  const malusCO2 = Math.max(0, Math.round(malusCO2Raw * (1 - ageReductionPercent / 100)))

  // D. Weight Malus (2026)
  const malusWeight = getMalusWeight(weightKg, fuelType, firstRegYear)

  // E. Total Landed Cost
  const totalLandedCost = Math.round(
    (purchasePrice + shippingCost + customsDuty + vat + malusCO2 + malusWeight) * 100
  ) / 100

  // F. Breakdown for display
  const breakdown = [
    { label: 'Prix d\'achat', amount: purchasePrice },
    { label: 'Transport', amount: shippingCost },
    ...(customsDuty > 0 ? [{ label: `Douane (${customsRate * 100}%)`, amount: customsDuty }] : []),
    { label: `TVA (${vatRate * 100}%)`, amount: vat },
    ...(malusCO2 > 0 ? [{
      label: `Malus CO₂ (${adjustedCO2}g/km${ageReductionPercent > 0 ? `, -${ageReductionPercent}% âge` : ''})`,
      amount: malusCO2
    }] : []),
    ...(malusWeight > 0 ? [{ label: `Malus Poids (${weightKg}kg)`, amount: malusWeight }] : []),
  ]

  return {
    // Inputs
    purchase_price: purchasePrice,
    shipping_cost: shippingCost,

    // Customs
    customs_duty: customsDuty,
    customs_rate: customsRate,

    // VAT
    vat,
    vat_rate: vatRate,

    // CO2 Malus
    malus_co2: malusCO2,
    malus_co2_before_age_reduction: malusCO2Raw,
    age_reduction_percent: ageReductionPercent,
    adjusted_co2: adjustedCO2, // WLTP-adjusted value used

    // Weight Malus
    malus_weight: malusWeight,

    // Total
    total_landed_cost: totalLandedCost,

    // Helper function for margin calculation
    margin_if_sold_at: (sellingPrice) => Math.round((sellingPrice - totalLandedCost) * 100) / 100,

    // Detailed breakdown
    breakdown,

    // Metadata
    is_eu_origin: isEU,
    country_origin: countryOrigin
  }
}
