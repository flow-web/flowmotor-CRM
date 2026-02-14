/**
 * Example usage and tests for importCost.js
 * Run in browser console or create a dedicated test page
 */

import {
  calculateTotalLandedCost,
  getMalusCO2,
  getMalusWeight
} from './importCost.js'

// ============================================
// EXAMPLE 1: BMW M3 from Germany (EU import)
// ============================================
console.log('=== EXAMPLE 1: BMW M3 from Germany (EU) ===')
const bmwM3 = calculateTotalLandedCost({
  countryOrigin: 'DE',
  co2GKm: 210, // High emissions (sporty car)
  weightKg: 1850,
  firstRegDate: '2020-05-15', // 6 years old (as of 2026)
  purchasePrice: 45000,
  fuelType: 'Essence',
  shippingCost: 800,
  firstRegYear: 2020
})

console.log('BMW M3 (2020, Germany):')
console.log('Purchase Price:', bmwM3.purchase_price, '€')
console.log('Shipping:', bmwM3.shipping_cost, '€')
console.log('Customs:', bmwM3.customs_duty, '€', `(${bmwM3.customs_rate * 100}%)`)
console.log('VAT:', bmwM3.vat, '€', `(${bmwM3.vat_rate * 100}%)`)
console.log('CO2 Malus:', bmwM3.malus_co2, '€', `(was ${bmwM3.malus_co2_before_age_reduction}€, -${bmwM3.age_reduction_percent}% age reduction)`)
console.log('Weight Malus:', bmwM3.malus_weight, '€')
console.log('--- TOTAL LANDED COST:', bmwM3.total_landed_cost, '€ ---')
console.log('Margin if sold at 65,000€:', bmwM3.margin_if_sold_at(65000), '€')
console.log('Breakdown:', bmwM3.breakdown)
console.log('')

// ============================================
// EXAMPLE 2: Nissan GT-R from Japan (non-EU)
// ============================================
console.log('=== EXAMPLE 2: Nissan GT-R from Japan (non-EU) ===')
const gtrJapan = calculateTotalLandedCost({
  countryOrigin: 'JP',
  co2GKm: 275, // Very high emissions
  weightKg: 1770,
  firstRegDate: '2018-01-20', // 8 years old
  purchasePrice: 55000,
  fuelType: 'Essence',
  shippingCost: 3500, // Expensive Japan→France shipping
  firstRegYear: 2018
})

console.log('Nissan GT-R (2018, Japan):')
console.log('Purchase Price:', gtrJapan.purchase_price, '€')
console.log('Shipping:', gtrJapan.shipping_cost, '€')
console.log('Customs (10% non-EU):', gtrJapan.customs_duty, '€')
console.log('VAT:', gtrJapan.vat, '€')
console.log('CO2 Malus:', gtrJapan.malus_co2, '€', `(was ${gtrJapan.malus_co2_before_age_reduction}€, -${gtrJapan.age_reduction_percent}% age reduction)`)
console.log('Weight Malus:', gtrJapan.malus_weight, '€', '(0 because registered before 2023)')
console.log('--- TOTAL LANDED COST:', gtrJapan.total_landed_cost, '€ ---')
console.log('Margin if sold at 90,000€:', gtrJapan.margin_if_sold_at(90000), '€')
console.log('')

// ============================================
// EXAMPLE 3: Tesla Model 3 from Switzerland (non-EU, electric)
// ============================================
console.log('=== EXAMPLE 3: Tesla Model 3 from Switzerland (non-EU, electric) ===')
const teslaSwiss = calculateTotalLandedCost({
  countryOrigin: 'CH',
  co2GKm: 0, // Electric = 0 emissions
  weightKg: 1900,
  firstRegDate: '2023-03-10', // Recent (3 years old)
  purchasePrice: 38000,
  fuelType: 'Électrique',
  shippingCost: 600,
  firstRegYear: 2023
})

console.log('Tesla Model 3 (2023, Switzerland):')
console.log('Purchase Price:', teslaSwiss.purchase_price, '€')
console.log('Shipping:', teslaSwiss.shipping_cost, '€')
console.log('Customs (10% non-EU):', teslaSwiss.customs_duty, '€')
console.log('VAT:', teslaSwiss.vat, '€')
console.log('CO2 Malus:', teslaSwiss.malus_co2, '€', '(0 for electric)')
console.log('Weight Malus:', teslaSwiss.malus_weight, '€', '(1900kg electric → threshold 1800kg → 100kg × 10€)')
console.log('--- TOTAL LANDED COST:', teslaSwiss.total_landed_cost, '€ ---')
console.log('Margin if sold at 55,000€:', teslaSwiss.margin_if_sold_at(55000), '€')
console.log('')

// ============================================
// EXAMPLE 4: Peugeot 208 from France (local)
// ============================================
console.log('=== EXAMPLE 4: Peugeot 208 from France (local) ===')
const peugeotFrance = calculateTotalLandedCost({
  countryOrigin: 'FR',
  co2GKm: 105, // Below threshold (no malus)
  weightKg: 1100, // Light car
  firstRegDate: '2021-09-01',
  purchasePrice: 12000,
  fuelType: 'Essence',
  shippingCost: 150, // Local transport
  firstRegYear: 2021
})

console.log('Peugeot 208 (2021, France):')
console.log('Purchase Price:', peugeotFrance.purchase_price, '€')
console.log('Shipping:', peugeotFrance.shipping_cost, '€')
console.log('Customs:', peugeotFrance.customs_duty, '€', '(0 for EU)')
console.log('VAT:', peugeotFrance.vat, '€')
console.log('CO2 Malus:', peugeotFrance.malus_co2, '€', '(0 because < 113 g/km)')
console.log('Weight Malus:', peugeotFrance.malus_weight, '€', '(0 because < 1600kg)')
console.log('--- TOTAL LANDED COST:', peugeotFrance.total_landed_cost, '€ ---')
console.log('Margin if sold at 18,000€:', peugeotFrance.margin_if_sold_at(18000), '€')
console.log('')

// ============================================
// EXAMPLE 5: Old diesel with NEDC conversion
// ============================================
console.log('=== EXAMPLE 5: Mercedes C220d (2017, NEDC→WLTP conversion) ===')
const mercNedc = calculateTotalLandedCost({
  countryOrigin: 'DE',
  co2GKm: 95, // Suspiciously low for diesel → will be converted to WLTP
  weightKg: 1650,
  firstRegDate: '2017-06-10', // 9 years old
  purchasePrice: 22000,
  fuelType: 'Diesel',
  shippingCost: 500,
  firstRegYear: 2017
})

console.log('Mercedes C220d (2017, Germany):')
console.log('Stated CO2:', 95, 'g/km (NEDC)')
console.log('Adjusted CO2 (WLTP):', mercNedc.adjusted_co2, 'g/km (×1.21 conversion)')
console.log('Purchase Price:', mercNedc.purchase_price, '€')
console.log('Shipping:', mercNedc.shipping_cost, '€')
console.log('Customs:', mercNedc.customs_duty, '€')
console.log('VAT:', mercNedc.vat, '€')
console.log('CO2 Malus:', mercNedc.malus_co2, '€', `(was ${mercNedc.malus_co2_before_age_reduction}€, -${mercNedc.age_reduction_percent}% age reduction)`)
console.log('Weight Malus:', mercNedc.malus_weight, '€')
console.log('--- TOTAL LANDED COST:', mercNedc.total_landed_cost, '€ ---')
console.log('Margin if sold at 32,000€:', mercNedc.margin_if_sold_at(32000), '€')
console.log('')

// ============================================
// ISOLATED FUNCTION TESTS
// ============================================
console.log('=== ISOLATED FUNCTION TESTS ===')

console.log('getMalusCO2(113):', getMalusCO2(113), '€ (should be 50€)')
console.log('getMalusCO2(150):', getMalusCO2(150), '€ (should be ~1,960€)')
console.log('getMalusCO2(200):', getMalusCO2(200), '€ (should be ~30,410€)')
console.log('getMalusCO2(250):', getMalusCO2(250), '€ (capped at ~60,000€)')
console.log('getMalusCO2(100):', getMalusCO2(100), '€ (should be 0€)')

console.log('getMalusWeight(1700, "Essence", 2023):', getMalusWeight(1700, 'Essence', 2023), '€ (should be 1000€ = 100kg × 10€)')
console.log('getMalusWeight(1900, "Électrique", 2024):', getMalusWeight(1900, 'Électrique', 2024), '€ (should be 1000€ = threshold 1800kg)')
console.log('getMalusWeight(1500, "Essence", 2023):', getMalusWeight(1500, 'Essence', 2023), '€ (should be 0€)')
console.log('getMalusWeight(2000, "Diesel", 2020):', getMalusWeight(2000, 'Diesel', 2020), '€ (should be 0€ because before 2023)')

console.log('')
console.log('✅ All examples completed!')
