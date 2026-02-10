import { supabase, isDemoMode } from './client'
import { STORAGE_KEYS } from '../../admin/utils/constants'

// ================================================================
// Helpers localStorage (mode démo)
// ================================================================
function getLocalReprises() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.REPRISES)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveLocalReprises(reprises) {
  localStorage.setItem(STORAGE_KEYS.REPRISES, JSON.stringify(reprises))
}

// ================================================================
// CRUD
// ================================================================
export async function createReprise(repriseData) {
  if (isDemoMode()) {
    const reprise = {
      id: crypto.randomUUID(),
      ...repriseData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    const reprises = getLocalReprises()
    reprises.push(reprise)
    saveLocalReprises(reprises)
    return reprise
  }

  const { data, error } = await supabase
    .from('reprises')
    .insert(repriseData)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function fetchRepriseByVehicle(saleVehicleId) {
  if (isDemoMode()) {
    const reprises = getLocalReprises()
    return reprises.find((r) => r.sale_vehicle_id === saleVehicleId) || null
  }

  const { data, error } = await supabase
    .from('reprises')
    .select('*')
    .eq('sale_vehicle_id', saleVehicleId)
    .limit(1)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function fetchReprises() {
  if (isDemoMode()) {
    return getLocalReprises().sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    )
  }

  const { data, error } = await supabase
    .from('reprises')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function updateReprise(id, updates) {
  if (isDemoMode()) {
    const reprises = getLocalReprises()
    const idx = reprises.findIndex((r) => r.id === id)
    if (idx === -1) throw new Error('Reprise not found')
    reprises[idx] = { ...reprises[idx], ...updates, updated_at: new Date().toISOString() }
    saveLocalReprises(reprises)
    return reprises[idx]
  }

  const { data, error } = await supabase
    .from('reprises')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteReprise(id) {
  if (isDemoMode()) {
    const reprises = getLocalReprises()
    const filtered = reprises.filter((r) => r.id !== id)
    saveLocalReprises(filtered)
    return true
  }

  const { error } = await supabase
    .from('reprises')
    .delete()
    .eq('id', id)

  if (error) throw error
  return true
}
