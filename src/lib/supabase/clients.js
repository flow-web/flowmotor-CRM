import { supabase, isDemoMode } from './client'

function requireSupabase() {
  if (!supabase) throw new Error('Supabase non initialisé')
}

// Récupère tous les clients
export async function fetchClients() {
  if (isDemoMode()) {
    throw new Error('Demo mode - use localStorage')
  }
  requireSupabase()

  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error

  return (data || []).map(transformClientFromDB)
}

// Récupère un client par ID
export async function fetchClient(id) {
  if (isDemoMode()) {
    throw new Error('Demo mode - use localStorage')
  }
  requireSupabase()

  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error

  return transformClientFromDB(data)
}

// Crée un nouveau client
export async function createClient(clientData) {
  if (isDemoMode()) {
    throw new Error('Demo mode - use localStorage')
  }
  requireSupabase()

  const dbData = transformClientToDB(clientData)

  const { data, error } = await supabase
    .from('clients')
    .insert(dbData)
    .select()
    .single()

  if (error) {
    console.error('[createClient] Erreur Supabase:', error.message, error.details, error.hint)
    throw new Error(`Supabase: ${error.message}${error.hint ? ` (${error.hint})` : ''}`)
  }

  if (!data) {
    throw new Error('Aucune donnée retournée après création du client')
  }

  return transformClientFromDB(data)
}

// Met à jour un client
export async function updateClient(id, updates) {
  if (isDemoMode()) {
    throw new Error('Demo mode - use localStorage')
  }
  requireSupabase()

  const dbUpdates = {}
  if (updates.firstName !== undefined) dbUpdates.first_name = updates.firstName
  if (updates.lastName !== undefined) dbUpdates.last_name = updates.lastName
  if (updates.email !== undefined) dbUpdates.email = updates.email
  if (updates.phone !== undefined) dbUpdates.phone = updates.phone
  if (updates.address !== undefined) dbUpdates.address = updates.address
  if (updates.city !== undefined) dbUpdates.city = updates.city
  if (updates.postalCode !== undefined) dbUpdates.postal_code = updates.postalCode
  if (updates.country !== undefined) dbUpdates.country = updates.country
  if (updates.notes !== undefined) dbUpdates.notes = updates.notes

  const { data, error } = await supabase
    .from('clients')
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error

  return transformClientFromDB(data)
}

// Supprime un client
export async function deleteClient(id) {
  if (isDemoMode()) {
    throw new Error('Demo mode - use localStorage')
  }
  requireSupabase()

  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', id)

  if (error) throw error
  return true
}

// === Transformations ===

function transformClientFromDB(row) {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email || '',
    phone: row.phone || '',
    address: row.address || '',
    city: row.city || '',
    postalCode: row.postal_code || '',
    country: row.country || 'France',
    notes: row.notes || '',
    createdAt: row.created_at,
  }
}

function transformClientToDB(client) {
  return {
    first_name: client.firstName,
    last_name: client.lastName,
    email: client.email || null,
    phone: client.phone || null,
    address: client.address || null,
    city: client.city || null,
    postal_code: client.postalCode || null,
    country: client.country || 'France',
    notes: client.notes || null,
  }
}
