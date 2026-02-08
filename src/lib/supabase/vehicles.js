import { supabase, isDemoMode } from './client'

// Transforme les données Supabase vers le format frontend
function transformVehicleFromDB(dbVehicle) {
  return {
    id: dbVehicle.id,
    vin: dbVehicle.vin || '',
    brand: dbVehicle.brand,
    make: dbVehicle.brand, // alias pour compatibilité
    model: dbVehicle.model,
    trim: dbVehicle.trim || '',
    year: dbVehicle.year,
    mileage: dbVehicle.mileage || 0,
    color: dbVehicle.color || '',

    // Sourcing
    sourceUrl: dbVehicle.source_url || '',
    sellerName: dbVehicle.seller_name || '',

    // Prix & Finances
    purchasePrice: parseFloat(dbVehicle.purchase_price) || 0,
    currency: dbVehicle.purchase_currency || 'EUR',
    exchangeRate: parseFloat(dbVehicle.exchange_rate) || 1,

    transportCost: parseFloat(dbVehicle.transport_cost) || 0,
    customsFee: parseFloat(dbVehicle.customs_fee) || 0,
    vatAmount: parseFloat(dbVehicle.vat_amount) || 0,
    feesTotal: parseFloat(dbVehicle.fees_total) || 0,

    costPrice: parseFloat(dbVehicle.cost_price) || 0,
    sellingPrice: parseFloat(dbVehicle.selling_price) || 0,
    margin: parseFloat(dbVehicle.margin) || 0,
    marginPercent: parseFloat(dbVehicle.margin_percent) || 0,

    // Import
    originCountry: dbVehicle.import_country || 'FR',
    vatRate: parseFloat(dbVehicle.vat_rate) || 20,
    isEuOrigin: dbVehicle.is_eu_origin ?? true,

    // Workflow
    status: dbVehicle.status,
    notes: dbVehicle.notes || '',

    // Images (stockées en JSONB dans la colonne images)
    images: Array.isArray(dbVehicle.images) ? dbVehicle.images : [],

    // Relations (tables non présentes dans le schéma simplifié)
    costs: [],
    documents: [],
    timeline: [],

    // Timestamps
    createdAt: dbVehicle.created_at,
    updatedAt: dbVehicle.updated_at
  }
}

// Transforme les données frontend vers le format Supabase (reset_crm.sql)
function transformVehicleToDB(vehicle) {
  return {
    vin: vehicle.vin || null,
    brand: vehicle.brand || vehicle.make,
    model: vehicle.model,
    trim: vehicle.trim || null,
    year: parseInt(vehicle.year) || new Date().getFullYear(),
    mileage: parseInt(vehicle.mileage) || 0,
    color: vehicle.color || null,

    source_url: vehicle.sourceUrl || null,
    seller_name: vehicle.sellerName || null,

    // Prix & Finances
    purchase_price: parseFloat(vehicle.purchasePrice) || 0,
    purchase_currency: vehicle.currency || 'EUR',
    exchange_rate: parseFloat(vehicle.exchangeRate) || 1,

    transport_cost: parseFloat(vehicle.transportCost) || 0,
    customs_fee: parseFloat(vehicle.customsFee) || 0,
    vat_amount: parseFloat(vehicle.vatAmount) || 0,
    fees_total: parseFloat(vehicle.feesTotal) || 0,

    cost_price: parseFloat(vehicle.costPrice) || 0,
    selling_price: parseFloat(vehicle.sellingPrice) || 0,
    margin: parseFloat(vehicle.margin) || 0,
    margin_percent: parseFloat(vehicle.marginPercent) || 0,

    // Import
    import_country: vehicle.originCountry || vehicle.importCountry || 'FR',
    vat_rate: parseFloat(vehicle.vatRate) || 20,
    is_eu_origin: vehicle.isEuOrigin ?? true,

    status: vehicle.status || 'SOURCING',
    notes: vehicle.notes || null,
    images: vehicle.images || []
  }
}

// Récupère tous les véhicules
export async function fetchVehicles() {
  if (isDemoMode()) {
    throw new Error('Demo mode - use localStorage')
  }

  const { data: vehicles, error } = await supabase
    .from('vehicles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error

  return vehicles.map(v => transformVehicleFromDB(v))
}

// Récupère un véhicule par ID
export async function fetchVehicle(id) {
  if (isDemoMode()) {
    throw new Error('Demo mode - use localStorage')
  }

  const { data: vehicle, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error

  return transformVehicleFromDB(vehicle)
}

// Crée un nouveau véhicule
export async function createVehicle(vehicleData) {
  if (isDemoMode()) {
    throw new Error('Demo mode - use localStorage')
  }

  const dbData = transformVehicleToDB(vehicleData)

  const { data: vehicle, error } = await supabase
    .from('vehicles')
    .insert(dbData)
    .select()
    .single()

  if (error) throw error

  return transformVehicleFromDB(vehicle)
}

// Met à jour un véhicule
export async function updateVehicle(id, updates) {
  if (isDemoMode()) {
    throw new Error('Demo mode - use localStorage')
  }

  const dbUpdates = {}

  // Transforme les champs si présents (reset_crm.sql schema)
  if (updates.vin !== undefined) dbUpdates.vin = updates.vin
  if (updates.brand !== undefined || updates.make !== undefined) dbUpdates.brand = updates.brand || updates.make
  if (updates.model !== undefined) dbUpdates.model = updates.model
  if (updates.trim !== undefined) dbUpdates.trim = updates.trim
  if (updates.year !== undefined) dbUpdates.year = parseInt(updates.year)
  if (updates.mileage !== undefined) dbUpdates.mileage = parseInt(updates.mileage)
  if (updates.color !== undefined) dbUpdates.color = updates.color
  if (updates.sourceUrl !== undefined) dbUpdates.source_url = updates.sourceUrl
  if (updates.sellerName !== undefined) dbUpdates.seller_name = updates.sellerName
  if (updates.purchasePrice !== undefined) dbUpdates.purchase_price = parseFloat(updates.purchasePrice)
  if (updates.currency !== undefined) dbUpdates.purchase_currency = updates.currency
  if (updates.exchangeRate !== undefined) dbUpdates.exchange_rate = parseFloat(updates.exchangeRate)
  if (updates.originCountry !== undefined) dbUpdates.import_country = updates.originCountry
  if (updates.sellingPrice !== undefined) dbUpdates.selling_price = parseFloat(updates.sellingPrice)
  if (updates.transportCost !== undefined) dbUpdates.transport_cost = parseFloat(updates.transportCost)
  if (updates.customsFee !== undefined) dbUpdates.customs_fee = parseFloat(updates.customsFee)
  if (updates.vatAmount !== undefined) dbUpdates.vat_amount = parseFloat(updates.vatAmount)
  if (updates.feesTotal !== undefined) dbUpdates.fees_total = parseFloat(updates.feesTotal)
  if (updates.costPrice !== undefined) dbUpdates.cost_price = parseFloat(updates.costPrice)
  if (updates.margin !== undefined) dbUpdates.margin = parseFloat(updates.margin)
  if (updates.marginPercent !== undefined) dbUpdates.margin_percent = parseFloat(updates.marginPercent)
  if (updates.vatRate !== undefined) dbUpdates.vat_rate = parseFloat(updates.vatRate)
  if (updates.isEuOrigin !== undefined) dbUpdates.is_eu_origin = updates.isEuOrigin
  if (updates.status !== undefined) dbUpdates.status = updates.status
  if (updates.notes !== undefined) dbUpdates.notes = updates.notes
  if (updates.images !== undefined) dbUpdates.images = updates.images

  const { error } = await supabase
    .from('vehicles')
    .update(dbUpdates)
    .eq('id', id)

  if (error) throw error

  return fetchVehicle(id)
}

// Supprime un véhicule
export async function deleteVehicle(id) {
  if (isDemoMode()) {
    throw new Error('Demo mode - use localStorage')
  }

  const { error } = await supabase
    .from('vehicles')
    .delete()
    .eq('id', id)

  if (error) throw error
  return true
}

// Met à jour le statut (schéma simplifié: SOURCING → STOCK → SOLD)
export async function updateVehicleStatus(id, newStatus, notes = '') {
  if (isDemoMode()) {
    throw new Error('Demo mode - use localStorage')
  }

  const updateData = { status: newStatus }
  if (notes) updateData.notes = notes

  const { error } = await supabase
    .from('vehicles')
    .update(updateData)
    .eq('id', id)

  if (error) throw error

  return fetchVehicle(id)
}

// Migre les données localStorage vers Supabase
export async function migrateFromLocalStorage(localVehicles) {
  if (isDemoMode()) {
    throw new Error('Demo mode - cannot migrate')
  }

  const results = {
    success: 0,
    failed: 0,
    errors: []
  }

  for (const vehicle of localVehicles) {
    try {
      const dbData = transformVehicleToDB(vehicle)

      const { error } = await supabase
        .from('vehicles')
        .insert(dbData)
        .select()
        .single()

      if (error) throw error

      results.success++
    } catch (err) {
      results.failed++
      results.errors.push({
        vehicle: `${vehicle.brand || vehicle.make} ${vehicle.model}`,
        error: err.message
      })
    }
  }

  return results
}
