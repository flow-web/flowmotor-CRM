/**
 * Calcule le prix d'achat converti en EUR
 */
export function convertToEUR(amount, currency, exchangeRate = 1) {
  if (currency === 'EUR') return amount
  return amount * exchangeRate
}

/**
 * Calcule le total des coûts additionnels
 */
export function calculateTotalCosts(costs = []) {
  return costs.reduce((sum, cost) => sum + (cost.amount || 0), 0)
}

/**
 * Calcule le Prix de Revient Unitaire (PRU)
 * PRU = Prix d'achat (en EUR) + Total des coûts
 */
export function calculatePRU(vehicle) {
  if (!vehicle) return 0

  const purchaseInEUR = convertToEUR(
    vehicle.purchasePrice || 0,
    vehicle.currency || 'EUR',
    vehicle.exchangeRate || 1
  )

  const totalCosts = calculateTotalCosts(vehicle.costs)

  return purchaseInEUR + totalCosts
}

/**
 * Calcule la marge en pourcentage
 * Marge = ((Prix de vente - PRU) / Prix de vente) * 100
 */
export function calculateMarginPercent(pru, sellingPrice) {
  if (!sellingPrice || sellingPrice === 0) return 0
  return ((sellingPrice - pru) / sellingPrice) * 100
}

/**
 * Calcule la marge en valeur absolue
 */
export function calculateMarginValue(pru, sellingPrice) {
  return sellingPrice - pru
}

/**
 * Calcule le prix de vente recommandé pour atteindre une marge cible
 * Prix = PRU / (1 - marge%)
 */
export function calculateRecommendedPrice(pru, targetMarginPercent) {
  if (targetMarginPercent >= 100) return pru * 2
  return pru / (1 - targetMarginPercent / 100)
}

/**
 * Calcule le malus CO2 français (barème 2024-2025)
 * Simplifié - à ajuster selon le barème officiel
 */
export function calculateCO2Malus(co2, year) {
  if (!co2 || year < 2004) return 0

  // Seuil de déclenchement (2024)
  const threshold = 118

  if (co2 <= threshold) return 0

  // Barème progressif simplifié
  const excess = co2 - threshold

  if (excess <= 10) return excess * 50
  if (excess <= 20) return 500 + (excess - 10) * 75
  if (excess <= 50) return 1250 + (excess - 20) * 125
  if (excess <= 100) return 5000 + (excess - 50) * 200

  // Maximum
  return Math.min(60000, 15000 + (excess - 100) * 300)
}

/**
 * Estime les frais de douane/TVA import
 */
export function calculateImportFees(purchasePrice, originCountry, vatRate = 20) {
  // Pas de droits de douane UE/Suisse
  const euCountries = ['DE', 'BE', 'IT', 'ES', 'NL', 'CH']

  if (euCountries.includes(originCountry)) {
    // TVA sur marge ou TVA complète selon le cas
    return purchasePrice * (vatRate / 100)
  }

  // Import hors UE (ex: Japon, UK)
  const customsDuty = purchasePrice * 0.10 // 10% droits de douane
  const vat = (purchasePrice + customsDuty) * (vatRate / 100)

  return customsDuty + vat
}

/**
 * Calcule les statistiques globales du stock
 */
export function calculateStockStats(vehicles = []) {
  const stats = {
    total: vehicles.length,
    totalValue: 0,
    totalPRU: 0,
    averageMargin: 0,
    byStatus: {},
    byMake: {}
  }

  let marginsSum = 0
  let marginsCount = 0

  vehicles.forEach(vehicle => {
    // Par statut
    stats.byStatus[vehicle.status] = (stats.byStatus[vehicle.status] || 0) + 1

    // Par marque
    stats.byMake[vehicle.make] = (stats.byMake[vehicle.make] || 0) + 1

    // Valeur totale (prix de vente)
    stats.totalValue += vehicle.sellingPrice || 0

    // PRU total
    const pru = calculatePRU(vehicle)
    stats.totalPRU += pru

    // Marge moyenne
    if (vehicle.sellingPrice) {
      marginsSum += calculateMarginPercent(pru, vehicle.sellingPrice)
      marginsCount++
    }
  })

  stats.averageMargin = marginsCount > 0 ? marginsSum / marginsCount : 0

  return stats
}
