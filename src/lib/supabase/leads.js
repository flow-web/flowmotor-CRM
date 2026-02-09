import { supabase } from './client'

/**
 * Crée un nouveau lead (formulaire de contact public)
 * Utilise la clé anon — la policy RLS autorise INSERT pour anon
 */
export async function createLead(leadData) {
  if (!supabase) throw new Error('Supabase non configuré')

  const { data, error } = await supabase
    .from('leads')
    .insert({
      name: leadData.name,
      email: leadData.email,
      phone: leadData.phone || null,
      subject: leadData.subject,
      message: leadData.message || null,
      vehicle_id: leadData.vehicleId || null,
      vehicle_label: leadData.vehicleLabel || null,
      source: leadData.source || 'contact_form',
    })
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Récupère tous les leads (CRM admin — nécessite authenticated)
 */
export async function fetchLeads() {
  if (!supabase) return []

  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

/**
 * Met à jour un lead (status, notes)
 */
export async function updateLead(id, updates) {
  if (!supabase) throw new Error('Supabase non configuré')

  const { data, error } = await supabase
    .from('leads')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Supprime un lead
 */
export async function deleteLead(id) {
  if (!supabase) throw new Error('Supabase non configuré')

  const { error } = await supabase
    .from('leads')
    .delete()
    .eq('id', id)

  if (error) throw error
  return true
}
