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

    // Technical specs
    fuelType: dbVehicle.fuel_type || '',
    transmission: dbVehicle.transmission || '',
    powerCh: dbVehicle.power_ch || 0,
    powerKw: dbVehicle.power_kw || 0,
    displacementCc: dbVehicle.displacement_cc || 0,
    cylinders: dbVehicle.cylinders || 0,
    driveType: dbVehicle.drive_type || '',
    gearsCount: dbVehicle.gears_count || 0,
    weightEmptyKg: dbVehicle.weight_empty_kg || 0,
    engineCode: dbVehicle.engine_code || '',

    // Economy & Environment
    co2Emissions: dbVehicle.co2_emissions || 0,
    consumptionMixed: parseFloat(dbVehicle.consumption_mixed) || 0,
    consumptionCity: parseFloat(dbVehicle.consumption_city) || 0,
    consumptionHighway: parseFloat(dbVehicle.consumption_highway) || 0,
    euroStandard: dbVehicle.euro_standard || '',
    critair: dbVehicle.critair || null,

    // Dimensions & Body
    lengthMm: dbVehicle.length_mm || 0,
    widthMm: dbVehicle.width_mm || 0,
    heightMm: dbVehicle.height_mm || 0,
    trunkVolumeL: dbVehicle.trunk_volume_l || 0,
    seats: dbVehicle.seats || 5,
    doors: dbVehicle.doors || 5,
    payloadKg: dbVehicle.payload_kg || 0,

    // History & State
    ownersCount: dbVehicle.owners_count || 0,
    lastServiceDate: dbVehicle.last_service_date || null,
    isImport: dbVehicle.is_import || false,
    countryOrigin: dbVehicle.country_origin || '',
    warrantyMonths: dbVehicle.warranty_months || 0,

    // Colors & Interior
    interiorMaterial: dbVehicle.interior_material || '',
    interiorColor: dbVehicle.interior_color || '',
    exteriorColorDetailed: dbVehicle.exterior_color_detailed || '',

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

    // Immatriculation
    registrationPlate: dbVehicle.registration_plate || '',

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

    // Technical specs
    fuel_type: vehicle.fuelType || null,
    transmission: vehicle.transmission || null,
    power_ch: parseInt(vehicle.powerCh) || null,
    power_kw: parseInt(vehicle.powerKw) || null,
    displacement_cc: parseInt(vehicle.displacementCc) || null,
    cylinders: parseInt(vehicle.cylinders) || null,
    drive_type: vehicle.driveType || null,
    gears_count: parseInt(vehicle.gearsCount) || null,
    weight_empty_kg: parseInt(vehicle.weightEmptyKg) || null,
    engine_code: vehicle.engineCode || null,

    // Economy & Environment
    co2_emissions: parseInt(vehicle.co2Emissions) || null,
    consumption_mixed: parseFloat(vehicle.consumptionMixed) || null,
    consumption_city: parseFloat(vehicle.consumptionCity) || null,
    consumption_highway: parseFloat(vehicle.consumptionHighway) || null,
    euro_standard: vehicle.euroStandard || null,
    critair: vehicle.critair || null,

    // Dimensions & Body
    length_mm: parseInt(vehicle.lengthMm) || null,
    width_mm: parseInt(vehicle.widthMm) || null,
    height_mm: parseInt(vehicle.heightMm) || null,
    trunk_volume_l: parseInt(vehicle.trunkVolumeL) || null,
    seats: parseInt(vehicle.seats) || 5,
    doors: parseInt(vehicle.doors) || 5,
    payload_kg: parseInt(vehicle.payloadKg) || null,

    // History & State
    owners_count: parseInt(vehicle.ownersCount) || null,
    last_service_date: vehicle.lastServiceDate || null,
    is_import: vehicle.isImport ?? false,
    country_origin: vehicle.countryOrigin || null,
    warranty_months: parseInt(vehicle.warrantyMonths) || null,

    // Colors & Interior
    interior_material: vehicle.interiorMaterial || null,
    interior_color: vehicle.interiorColor || null,
    exterior_color_detailed: vehicle.exteriorColorDetailed || null,

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
    images: vehicle.images || [],
    registration_plate: vehicle.registrationPlate || null
  }
}

// Récupère tous les véhicules avec leurs coûts
export async function fetchVehicles() {
  if (isDemoMode()) {
    throw new Error('Demo mode - use localStorage')
  }

  const { data: vehicles, error } = await supabase
    .from('vehicles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error

  // Charger les coûts depuis vehicle_costs et les rattacher
  let costsMap = {}
  try {
    const { data: allCosts, error: costsError } = await supabase
      .from('vehicle_costs')
      .select('*')
      .order('date', { ascending: false })

    if (!costsError && allCosts) {
      allCosts.forEach(c => {
        if (!costsMap[c.vehicle_id]) costsMap[c.vehicle_id] = []
        costsMap[c.vehicle_id].push({
          id: c.id,
          type: c.type,
          amount: parseFloat(c.amount),
          description: c.description || '',
          supplier: c.supplier || '',
          receipt_url: c.receipt_url || '',
          date: c.date
        })
      })
    }
  } catch (e) {
    // Table might not exist yet — silently continue with empty costs
    console.warn('[fetchVehicles] vehicle_costs not available:', e.message)
  }

  return vehicles.map(v => {
    const transformed = transformVehicleFromDB(v)
    transformed.costs = costsMap[v.id] || []
    return transformed
  })
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
  if (updates.registrationPlate !== undefined) dbUpdates.registration_plate = updates.registrationPlate

  // Technical specs
  if (updates.fuelType !== undefined) dbUpdates.fuel_type = updates.fuelType
  if (updates.transmission !== undefined) dbUpdates.transmission = updates.transmission
  if (updates.powerCh !== undefined) dbUpdates.power_ch = parseInt(updates.powerCh)
  if (updates.powerKw !== undefined) dbUpdates.power_kw = parseInt(updates.powerKw)
  if (updates.displacementCc !== undefined) dbUpdates.displacement_cc = parseInt(updates.displacementCc)
  if (updates.cylinders !== undefined) dbUpdates.cylinders = parseInt(updates.cylinders)
  if (updates.driveType !== undefined) dbUpdates.drive_type = updates.driveType
  if (updates.gearsCount !== undefined) dbUpdates.gears_count = parseInt(updates.gearsCount)
  if (updates.weightEmptyKg !== undefined) dbUpdates.weight_empty_kg = parseInt(updates.weightEmptyKg)
  if (updates.engineCode !== undefined) dbUpdates.engine_code = updates.engineCode

  // Economy & Environment
  if (updates.co2Emissions !== undefined) dbUpdates.co2_emissions = parseInt(updates.co2Emissions)
  if (updates.consumptionMixed !== undefined) dbUpdates.consumption_mixed = parseFloat(updates.consumptionMixed)
  if (updates.consumptionCity !== undefined) dbUpdates.consumption_city = parseFloat(updates.consumptionCity)
  if (updates.consumptionHighway !== undefined) dbUpdates.consumption_highway = parseFloat(updates.consumptionHighway)
  if (updates.euroStandard !== undefined) dbUpdates.euro_standard = updates.euroStandard
  if (updates.critair !== undefined) dbUpdates.critair = updates.critair

  // Dimensions & Body
  if (updates.lengthMm !== undefined) dbUpdates.length_mm = parseInt(updates.lengthMm)
  if (updates.widthMm !== undefined) dbUpdates.width_mm = parseInt(updates.widthMm)
  if (updates.heightMm !== undefined) dbUpdates.height_mm = parseInt(updates.heightMm)
  if (updates.trunkVolumeL !== undefined) dbUpdates.trunk_volume_l = parseInt(updates.trunkVolumeL)
  if (updates.seats !== undefined) dbUpdates.seats = parseInt(updates.seats)
  if (updates.doors !== undefined) dbUpdates.doors = parseInt(updates.doors)
  if (updates.payloadKg !== undefined) dbUpdates.payload_kg = parseInt(updates.payloadKg)

  // History & State
  if (updates.ownersCount !== undefined) dbUpdates.owners_count = parseInt(updates.ownersCount)
  if (updates.lastServiceDate !== undefined) dbUpdates.last_service_date = updates.lastServiceDate
  if (updates.isImport !== undefined) dbUpdates.is_import = updates.isImport
  if (updates.countryOrigin !== undefined) dbUpdates.country_origin = updates.countryOrigin
  if (updates.warrantyMonths !== undefined) dbUpdates.warranty_months = parseInt(updates.warrantyMonths)

  // Colors & Interior
  if (updates.interiorMaterial !== undefined) dbUpdates.interior_material = updates.interiorMaterial
  if (updates.interiorColor !== undefined) dbUpdates.interior_color = updates.interiorColor
  if (updates.exteriorColorDetailed !== undefined) dbUpdates.exterior_color_detailed = updates.exteriorColorDetailed

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
