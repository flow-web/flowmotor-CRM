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
    byMake: {},
    // Phase 2 — KPIs enrichis
    totalRevenue: 0,
    totalProfit: 0,
    stockValue: 0,
    revenueCurrentMonth: 0,
    avgDaysInStock: 0,
    monthlySales: []
  }

  let marginsSum = 0
  let marginsCount = 0
  let daysInStockSum = 0
  let daysInStockCount = 0

  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  // Pour les 6 derniers mois
  const monthlyMap = {}
  for (let i = 5; i >= 0; i--) {
    const d = new Date(currentYear, currentMonth - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    monthlyMap[key] = { month: key, count: 0, revenue: 0, profit: 0 }
  }

  vehicles.forEach(vehicle => {
    // Par statut
    stats.byStatus[vehicle.status] = (stats.byStatus[vehicle.status] || 0) + 1

    // Par marque
    const make = vehicle.brand || vehicle.make
    if (make) {
      stats.byMake[make] = (stats.byMake[make] || 0) + 1
    }

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

    // Véhicules vendus — CA et profit
    if (vehicle.status === 'SOLD') {
      const revenue = vehicle.sellingPrice || 0
      const profit = revenue - pru
      stats.totalRevenue += revenue
      stats.totalProfit += profit

      // CA du mois courant
      const soldDate = vehicle.soldAt ? new Date(vehicle.soldAt) : (vehicle.updatedAt ? new Date(vehicle.updatedAt) : null)
      if (soldDate && soldDate.getMonth() === currentMonth && soldDate.getFullYear() === currentYear) {
        stats.revenueCurrentMonth += revenue
      }

      // Monthly breakdown
      if (soldDate) {
        const key = `${soldDate.getFullYear()}-${String(soldDate.getMonth() + 1).padStart(2, '0')}`
        if (monthlyMap[key]) {
          monthlyMap[key].count++
          monthlyMap[key].revenue += revenue
          monthlyMap[key].profit += profit
        }
      }

      // Days in stock
      const createdDate = vehicle.createdAt ? new Date(vehicle.createdAt) : null
      if (createdDate && soldDate) {
        const days = Math.round((soldDate - createdDate) / (1000 * 60 * 60 * 24))
        if (days >= 0) {
          daysInStockSum += days
          daysInStockCount++
        }
      }
    }

    // Valeur stock actuel (véhicules en stock)
    if (vehicle.status === 'STOCK') {
      stats.stockValue += vehicle.sellingPrice || pru
    }
  })

  stats.averageMargin = marginsCount > 0 ? marginsSum / marginsCount : 0
  stats.avgDaysInStock = daysInStockCount > 0 ? Math.round(daysInStockSum / daysInStockCount) : 0
  stats.monthlySales = Object.values(monthlyMap)

  return stats
}
