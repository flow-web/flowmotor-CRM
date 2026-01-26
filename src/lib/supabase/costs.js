import { supabase, isDemoMode } from './client'

// Ajoute un coût à un véhicule
export async function addCost(vehicleId, costData) {
  if (isDemoMode()) {
    throw new Error('Demo mode - use localStorage')
  }

  const { data, error } = await supabase
    .from('vehicle_costs')
    .insert({
      vehicle_id: vehicleId,
      type: costData.type,
      amount: costData.amount,
      description: costData.description || null,
      date: costData.date || new Date().toISOString()
    })
    .select()
    .single()

  if (error) throw error
  return {
    id: data.id,
    type: data.type,
    amount: parseFloat(data.amount),
    description: data.description || '',
    date: data.date
  }
}

// Met à jour un coût
export async function updateCost(costId, updates) {
  if (isDemoMode()) {
    throw new Error('Demo mode - use localStorage')
  }

  const dbUpdates = {}
  if (updates.type !== undefined) dbUpdates.type = updates.type
  if (updates.amount !== undefined) dbUpdates.amount = updates.amount
  if (updates.description !== undefined) dbUpdates.description = updates.description
  if (updates.date !== undefined) dbUpdates.date = updates.date

  const { data, error } = await supabase
    .from('vehicle_costs')
    .update(dbUpdates)
    .eq('id', costId)
    .select()
    .single()

  if (error) throw error
  return {
    id: data.id,
    type: data.type,
    amount: parseFloat(data.amount),
    description: data.description || '',
    date: data.date
  }
}

// Supprime un coût
export async function deleteCost(costId) {
  if (isDemoMode()) {
    throw new Error('Demo mode - use localStorage')
  }

  const { error } = await supabase
    .from('vehicle_costs')
    .delete()
    .eq('id', costId)

  if (error) throw error
  return true
}

// Récupère tous les coûts d'un véhicule
export async function fetchCosts(vehicleId) {
  if (isDemoMode()) {
    throw new Error('Demo mode - use localStorage')
  }

  const { data, error } = await supabase
    .from('vehicle_costs')
    .select('*')
    .eq('vehicle_id', vehicleId)
    .order('date', { ascending: false })

  if (error) throw error
  return data.map(c => ({
    id: c.id,
    type: c.type,
    amount: parseFloat(c.amount),
    description: c.description || '',
    date: c.date
  }))
}

// Calcule le total des coûts d'un véhicule
export async function getTotalCosts(vehicleId) {
  if (isDemoMode()) {
    throw new Error('Demo mode - use localStorage')
  }

  const { data, error } = await supabase
    .from('vehicle_costs')
    .select('amount')
    .eq('vehicle_id', vehicleId)

  if (error) throw error
  return data.reduce((sum, c) => sum + parseFloat(c.amount), 0)
}
