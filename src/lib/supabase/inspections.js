import { supabase, isDemoMode } from './client'

/**
 * Transform inspection from DB (snake_case) to frontend (camelCase)
 */
function transformInspectionFromDB(dbInspection) {
  return {
    id: dbInspection.id,
    vehicleId: dbInspection.vehicle_id,
    inspectionType: dbInspection.inspection_type,
    status: dbInspection.status,
    result: dbInspection.result || {},
    healthScore: dbInspection.health_score || null,
    totalRepairCost: parseFloat(dbInspection.total_repair_cost) || 0,
    riskLevel: dbInspection.risk_level || 'low',
    inspectorNotes: dbInspection.inspector_notes || '',
    images: dbInspection.images || [],
    inspector: dbInspection.inspector || 'AI_GEMINI',
    inspectionDurationSeconds: dbInspection.inspection_duration_seconds || null,
    apiModel: dbInspection.api_model || null,
    createdAt: dbInspection.created_at,
    updatedAt: dbInspection.updated_at
  }
}

/**
 * Transform inspection from frontend (camelCase) to DB (snake_case)
 */
function transformInspectionToDB(inspection) {
  return {
    vehicle_id: inspection.vehicleId,
    inspection_type: inspection.inspectionType,
    status: inspection.status || 'completed',
    result: inspection.result || {},
    health_score: inspection.healthScore || null,
    total_repair_cost: parseFloat(inspection.totalRepairCost) || 0,
    risk_level: inspection.riskLevel || 'low',
    inspector_notes: inspection.inspectorNotes || null,
    images: inspection.images || [],
    inspector: inspection.inspector || 'AI_GEMINI',
    inspection_duration_seconds: inspection.inspectionDurationSeconds || null,
    api_model: inspection.apiModel || null
  }
}

/**
 * Create a new inspection
 * @param {Object} inspectionData
 * @returns {Promise<Object>}
 */
export async function createInspection(inspectionData) {
  if (isDemoMode()) {
    throw new Error('Demo mode - inspections not available in localStorage')
  }

  const dbData = transformInspectionToDB(inspectionData)

  const { data, error } = await supabase
    .from('vehicle_inspections')
    .insert(dbData)
    .select()
    .single()

  if (error) throw error

  return transformInspectionFromDB(data)
}

/**
 * Get all inspections for a vehicle
 * @param {string} vehicleId
 * @returns {Promise<Array>}
 */
export async function getInspectionsByVehicle(vehicleId) {
  if (isDemoMode()) {
    throw new Error('Demo mode - inspections not available in localStorage')
  }

  const { data, error } = await supabase
    .from('vehicle_inspections')
    .select('*')
    .eq('vehicle_id', vehicleId)
    .order('created_at', { ascending: false })

  if (error) throw error

  return data.map(transformInspectionFromDB)
}

/**
 * Get latest inspection of a specific type for a vehicle
 * @param {string} vehicleId
 * @param {string} inspectionType
 * @returns {Promise<Object|null>}
 */
export async function getLatestInspection(vehicleId, inspectionType) {
  if (isDemoMode()) {
    throw new Error('Demo mode - inspections not available in localStorage')
  }

  const { data, error } = await supabase
    .from('vehicle_inspections')
    .select('*')
    .eq('vehicle_id', vehicleId)
    .eq('inspection_type', inspectionType)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // No rows found
    throw error
  }

  return transformInspectionFromDB(data)
}

/**
 * Get inspection by ID
 * @param {string} inspectionId
 * @returns {Promise<Object>}
 */
export async function getInspection(inspectionId) {
  if (isDemoMode()) {
    throw new Error('Demo mode - inspections not available in localStorage')
  }

  const { data, error } = await supabase
    .from('vehicle_inspections')
    .select('*')
    .eq('id', inspectionId)
    .single()

  if (error) throw error

  return transformInspectionFromDB(data)
}

/**
 * Update inspection
 * @param {string} inspectionId
 * @param {Object} updates
 * @returns {Promise<Object>}
 */
export async function updateInspection(inspectionId, updates) {
  if (isDemoMode()) {
    throw new Error('Demo mode - inspections not available in localStorage')
  }

  const dbUpdates = {}

  // Map camelCase to snake_case selectively
  if (updates.status !== undefined) dbUpdates.status = updates.status
  if (updates.result !== undefined) dbUpdates.result = updates.result
  if (updates.healthScore !== undefined) dbUpdates.health_score = updates.healthScore
  if (updates.totalRepairCost !== undefined) dbUpdates.total_repair_cost = parseFloat(updates.totalRepairCost)
  if (updates.riskLevel !== undefined) dbUpdates.risk_level = updates.riskLevel
  if (updates.inspectorNotes !== undefined) dbUpdates.inspector_notes = updates.inspectorNotes
  if (updates.images !== undefined) dbUpdates.images = updates.images
  if (updates.inspector !== undefined) dbUpdates.inspector = updates.inspector
  if (updates.inspectionDurationSeconds !== undefined) dbUpdates.inspection_duration_seconds = updates.inspectionDurationSeconds
  if (updates.apiModel !== undefined) dbUpdates.api_model = updates.apiModel

  const { data, error } = await supabase
    .from('vehicle_inspections')
    .update(dbUpdates)
    .eq('id', inspectionId)
    .select()
    .single()

  if (error) throw error

  return transformInspectionFromDB(data)
}

/**
 * Delete inspection
 * @param {string} inspectionId
 * @returns {Promise<boolean>}
 */
export async function deleteInspection(inspectionId) {
  if (isDemoMode()) {
    throw new Error('Demo mode - inspections not available in localStorage')
  }

  const { error } = await supabase
    .from('vehicle_inspections')
    .delete()
    .eq('id', inspectionId)

  if (error) throw error

  return true
}

/**
 * Get vehicle health score (average of all completed inspections)
 * Uses the database function
 * @param {string} vehicleId
 * @returns {Promise<number>}
 */
export async function getVehicleHealthScore(vehicleId) {
  if (isDemoMode()) {
    throw new Error('Demo mode - inspections not available in localStorage')
  }

  const { data, error } = await supabase
    .rpc('get_vehicle_health_score', { p_vehicle_id: vehicleId })

  if (error) throw error

  return data || 0
}

/**
 * Get total estimated repair cost for a vehicle
 * Uses the database function
 * @param {string} vehicleId
 * @returns {Promise<number>}
 */
export async function getVehicleTotalRepairCost(vehicleId) {
  if (isDemoMode()) {
    throw new Error('Demo mode - inspections not available in localStorage')
  }

  const { data, error } = await supabase
    .rpc('get_vehicle_total_repair_cost', { p_vehicle_id: vehicleId })

  if (error) throw error

  return parseFloat(data) || 0
}

/**
 * Get all high-risk inspections across all vehicles
 * @returns {Promise<Array>}
 */
export async function getHighRiskInspections() {
  if (isDemoMode()) {
    throw new Error('Demo mode - inspections not available in localStorage')
  }

  const { data, error } = await supabase
    .from('vehicle_inspections')
    .select(`
      *,
      vehicles:vehicle_id (
        id,
        brand,
        model,
        year,
        vin
      )
    `)
    .in('risk_level', ['high', 'critical'])
    .eq('status', 'completed')
    .order('created_at', { ascending: false })

  if (error) throw error

  return data.map((item) => ({
    ...transformInspectionFromDB(item),
    vehicle: item.vehicles
  }))
}

/**
 * Get inspection statistics for dashboard
 * @returns {Promise<Object>}
 */
export async function getInspectionStats() {
  if (isDemoMode()) {
    throw new Error('Demo mode - inspections not available in localStorage')
  }

  const { data, error } = await supabase
    .from('vehicle_inspections')
    .select('inspection_type, status, risk_level, health_score, total_repair_cost')

  if (error) throw error

  // Calculate stats
  const stats = {
    total: data.length,
    byType: {},
    byStatus: {},
    byRiskLevel: {},
    avgHealthScore: 0,
    totalEstimatedCost: 0
  }

  let healthScoreSum = 0
  let healthScoreCount = 0

  data.forEach((inspection) => {
    // Count by type
    stats.byType[inspection.inspection_type] = (stats.byType[inspection.inspection_type] || 0) + 1

    // Count by status
    stats.byStatus[inspection.status] = (stats.byStatus[inspection.status] || 0) + 1

    // Count by risk level
    stats.byRiskLevel[inspection.risk_level] = (stats.byRiskLevel[inspection.risk_level] || 0) + 1

    // Sum health scores
    if (inspection.health_score !== null) {
      healthScoreSum += inspection.health_score
      healthScoreCount++
    }

    // Sum repair costs
    stats.totalEstimatedCost += parseFloat(inspection.total_repair_cost) || 0
  })

  stats.avgHealthScore = healthScoreCount > 0 ? Math.round(healthScoreSum / healthScoreCount) : 0

  return stats
}

/**
 * Batch create inspections
 * Useful for running multiple inspections at once
 * @param {Array<Object>} inspections
 * @returns {Promise<Array>}
 */
export async function batchCreateInspections(inspections) {
  if (isDemoMode()) {
    throw new Error('Demo mode - inspections not available in localStorage')
  }

  const dbData = inspections.map(transformInspectionToDB)

  const { data, error } = await supabase
    .from('vehicle_inspections')
    .insert(dbData)
    .select()

  if (error) throw error

  return data.map(transformInspectionFromDB)
}
