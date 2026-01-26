// Client & Helpers
export {
  supabase,
  isDemoMode,
  checkSupabaseConnection,
  withFallback,
  hashApiKey,
  getKeyPrefix,
  uploadImage,
  deleteImage
} from './client'

// Vehicles API
export {
  fetchVehicles,
  fetchVehicle,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  updateVehicleStatus,
  migrateFromLocalStorage
} from './vehicles'

// Costs API
export {
  addCost,
  updateCost,
  deleteCost,
  fetchCosts,
  getTotalCosts
} from './costs'

// API Keys
export {
  generateApiKey,
  listApiKeys,
  revokeApiKey,
  reactivateApiKey,
  deleteApiKey,
  updateApiKey,
  validateApiKey
} from './api-keys'

// KPIs
export {
  fetchFinancialKPIs,
  fetchActivityKPIs,
  fetchRecentSales,
  fetchAllKPIsWithApiKey,
  calculateLocalStats
} from './kpis'
