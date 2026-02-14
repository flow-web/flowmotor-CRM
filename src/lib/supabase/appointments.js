import { supabase, isDemoMode } from './client'

/**
 * Fetch appointments within a date range
 * @param {string} startDate - ISO date string (YYYY-MM-DD)
 * @param {string} endDate - ISO date string (YYYY-MM-DD)
 * @returns {Promise<{data: Array, error: any}>}
 */
export async function fetchAppointments(startDate, endDate) {
  if (isDemoMode() || !supabase) {
    return { data: [], error: null }
  }

  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*, vehicles(id, brand, model, year), clients(id, first_name, last_name)')
      .gte('appointment_date', startDate)
      .lte('appointment_date', endDate)
      .order('appointment_date', { ascending: true })
      .order('appointment_time', { ascending: true })

    if (error) {
      console.error('Error fetching appointments:', error)
      return { data: [], error }
    }

    return { data: data || [], error: null }
  } catch (err) {
    console.error('Failed to fetch appointments:', err)
    return { data: [], error: err }
  }
}

/**
 * Create a new appointment
 * @param {Object} appointmentData
 * @returns {Promise<{data: Object|null, error: any}>}
 */
export async function createAppointment(appointmentData) {
  if (isDemoMode() || !supabase) {
    return { data: null, error: { message: 'Mode demo — creation impossible' } }
  }

  try {
    const { data, error } = await supabase
      .from('appointments')
      .insert([{
        vehicle_id: appointmentData.vehicleId || null,
        client_id: appointmentData.clientId || null,
        type: appointmentData.type,
        title: appointmentData.title,
        appointment_date: appointmentData.appointmentDate,
        appointment_time: appointmentData.appointmentTime,
        duration_minutes: appointmentData.durationMinutes || 60,
        location: appointmentData.location || null,
        notes: appointmentData.notes || null,
        completed: appointmentData.completed || false,
      }])
      .select()
      .single()

    if (error) {
      console.error('Error creating appointment:', error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (err) {
    console.error('Failed to create appointment:', err)
    return { data: null, error: err }
  }
}

/**
 * Update an existing appointment
 * @param {string} id - Appointment UUID
 * @param {Object} updates
 * @returns {Promise<{data: Object|null, error: any}>}
 */
export async function updateAppointment(id, updates) {
  if (isDemoMode() || !supabase) {
    return { data: null, error: { message: 'Mode demo — mise a jour impossible' } }
  }

  try {
    const payload = {}
    if (updates.vehicleId !== undefined) payload.vehicle_id = updates.vehicleId
    if (updates.clientId !== undefined) payload.client_id = updates.clientId
    if (updates.type !== undefined) payload.type = updates.type
    if (updates.title !== undefined) payload.title = updates.title
    if (updates.appointmentDate !== undefined) payload.appointment_date = updates.appointmentDate
    if (updates.appointmentTime !== undefined) payload.appointment_time = updates.appointmentTime
    if (updates.durationMinutes !== undefined) payload.duration_minutes = updates.durationMinutes
    if (updates.location !== undefined) payload.location = updates.location
    if (updates.notes !== undefined) payload.notes = updates.notes
    if (updates.completed !== undefined) payload.completed = updates.completed
    payload.updated_at = new Date().toISOString()

    const { data, error } = await supabase
      .from('appointments')
      .update(payload)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating appointment:', error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (err) {
    console.error('Failed to update appointment:', err)
    return { data: null, error: err }
  }
}

/**
 * Delete an appointment
 * @param {string} id - Appointment UUID
 * @returns {Promise<{success: boolean, error: any}>}
 */
export async function deleteAppointment(id) {
  if (isDemoMode() || !supabase) {
    return { success: false, error: { message: 'Mode demo — suppression impossible' } }
  }

  try {
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting appointment:', error)
      return { success: false, error }
    }

    return { success: true, error: null }
  } catch (err) {
    console.error('Failed to delete appointment:', err)
    return { success: false, error: err }
  }
}
