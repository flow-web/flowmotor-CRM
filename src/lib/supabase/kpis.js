import { supabase, isDemoMode, hashApiKey } from './client'

// Récupère les KPIs financiers
export async function fetchFinancialKPIs() {
  if (isDemoMode()) {
    throw new Error('Demo mode - use localStorage calculations')
  }

  const { data, error } = await supabase
    .from('view_kpi_financials')
    .select('*')
    .single()

  if (error) throw error

  return {
    caTotal: parseFloat(data.ca_total) || 0,
    caMoisCourant: parseFloat(data.ca_mois_courant) || 0,
    valeurStock: parseFloat(data.valeur_stock) || 0,
    vehiculesVendus: parseInt(data.vehicules_vendus) || 0,
    vehiculesEnStock: parseInt(data.vehicules_en_stock) || 0,
    totalVehicules: parseInt(data.total_vehicules) || 0
  }
}

// Récupère les KPIs par statut
export async function fetchActivityKPIs() {
  if (isDemoMode()) {
    throw new Error('Demo mode - use localStorage calculations')
  }

  const { data, error } = await supabase
    .from('view_kpi_activity')
    .select('*')

  if (error) throw error

  return data.map(row => ({
    status: row.status,
    count: parseInt(row.count) || 0,
    totalValue: parseFloat(row.total_value) || 0,
    avgValue: parseFloat(row.avg_value) || 0
  }))
}

// Récupère les dernières ventes
export async function fetchRecentSales(limit = 10) {
  if (isDemoMode()) {
    throw new Error('Demo mode - use localStorage')
  }

  const { data, error } = await supabase
    .from('view_recent_sales')
    .select('*')
    .limit(limit)

  if (error) throw error

  return data.map(sale => ({
    id: sale.id,
    make: sale.make,
    model: sale.model,
    year: sale.year,
    sellingPrice: parseFloat(sale.selling_price) || 0,
    purchasePrice: parseFloat(sale.purchase_price) || 0,
    profit: parseFloat(sale.profit) || 0,
    soldAt: sale.sold_at
  }))
}

// Récupère tous les KPIs via clé API (pour accès externe)
export async function fetchAllKPIsWithApiKey(apiKey) {
  if (!apiKey) {
    throw new Error('API key required')
  }

  const keyHash = await hashApiKey(apiKey)

  const { data, error } = await supabase.rpc('get_kpis', {
    api_key_hash: keyHash
  })

  if (error) {
    if (error.message.includes('Invalid')) {
      throw new Error('Clé API invalide ou expirée')
    }
    throw error
  }

  return {
    financials: {
      caTotal: parseFloat(data.financials?.ca_total) || 0,
      caMoisCourant: parseFloat(data.financials?.ca_mois_courant) || 0,
      valeurStock: parseFloat(data.financials?.valeur_stock) || 0,
      vehiculesVendus: parseInt(data.financials?.vehicules_vendus) || 0,
      vehiculesEnStock: parseInt(data.financials?.vehicules_en_stock) || 0
    },
    activity: data.activity?.map(a => ({
      status: a.status,
      count: parseInt(a.count) || 0,
      totalValue: parseFloat(a.total_value) || 0
    })) || [],
    recentSales: data.recent_sales?.map(s => ({
      id: s.id,
      make: s.make,
      model: s.model,
      year: s.year,
      sellingPrice: parseFloat(s.selling_price) || 0,
      profit: parseFloat(s.profit) || 0,
      soldAt: s.sold_at
    })) || [],
    generatedAt: data.generated_at
  }
}

// Calcule les statistiques de stock (fallback local)
export function calculateLocalStats(vehicles) {
  const stats = {
    total: vehicles.length,
    byStatus: {},
    caTotal: 0,
    caMoisCourant: 0,
    valeurStock: 0,
    vehiculesVendus: 0,
    vehiculesEnStock: 0
  }

  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  vehicles.forEach(v => {
    // Compte par statut
    if (!stats.byStatus[v.status]) {
      stats.byStatus[v.status] = { count: 0, value: 0 }
    }
    stats.byStatus[v.status].count++
    stats.byStatus[v.status].value += v.sellingPrice || 0

    // CA et stock
    if (v.status === 'VENDU') {
      stats.caTotal += v.sellingPrice || 0
      stats.vehiculesVendus++

      // CA du mois courant
      const updatedAt = new Date(v.updatedAt)
      if (updatedAt.getMonth() === currentMonth && updatedAt.getFullYear() === currentYear) {
        stats.caMoisCourant += v.sellingPrice || 0
      }
    } else {
      stats.valeurStock += v.sellingPrice || 0
      stats.vehiculesEnStock++
    }
  })

  return stats
}
