import { supabase, isDemoMode } from './client'

// Transforme les données Supabase vers le format frontend
function transformVehicleFromDB(dbVehicle, costs = [], documents = [], images = [], timeline = []) {
  return {
    id: dbVehicle.id,
    vin: dbVehicle.vin || '',
    make: dbVehicle.make,
    model: dbVehicle.model,
    trim: dbVehicle.trim || '',
    year: dbVehicle.year,
    mileage: dbVehicle.mileage || 0,
    color: dbVehicle.color || '',

    // Sourcing
    sourceUrl: dbVehicle.source_url || '',
    sellerName: dbVehicle.seller_name || '',
    sellerPhone: dbVehicle.seller_phone || '',
    sellerEmail: dbVehicle.seller_email || '',

    // Prix
    purchasePrice: parseFloat(dbVehicle.purchase_price) || 0,
    currency: dbVehicle.currency || 'EUR',
    exchangeRate: parseFloat(dbVehicle.exchange_rate) || 1,
    originCountry: dbVehicle.origin_country || '',
    marketPrice: parseFloat(dbVehicle.market_price) || 0,
    targetMargin: parseFloat(dbVehicle.target_margin) || 15,
    sellingPrice: parseFloat(dbVehicle.selling_price) || 0,

    // Workflow
    status: dbVehicle.status,
    notes: dbVehicle.notes || '',

    // Relations
    costs: costs.map(c => ({
      id: c.id,
      type: c.type,
      amount: parseFloat(c.amount) || 0,
      description: c.description || '',
      date: c.date
    })),
    documents: documents.map(d => ({
      id: d.id,
      type: d.type,
      name: d.name,
      url: d.url || '',
      storagePath: d.storage_path || ''
    })),
    images: images.map(i => ({
      id: i.id,
      url: i.url,
      isPrimary: i.is_primary || false,
      order: i.display_order || 0
    })),
    timeline: timeline.map(t => ({
      step: t.step,
      status: t.status,
      date: t.date,
      notes: t.notes || ''
    })),

    // Timestamps
    createdAt: dbVehicle.created_at,
    updatedAt: dbVehicle.updated_at
  }
}

// Transforme les données frontend vers le format Supabase
function transformVehicleToDB(vehicle) {
  return {
    vin: vehicle.vin || null,
    make: vehicle.make,
    model: vehicle.model,
    trim: vehicle.trim || null,
    year: vehicle.year,
    mileage: vehicle.mileage || 0,
    color: vehicle.color || null,

    source_url: vehicle.sourceUrl || null,
    seller_name: vehicle.sellerName || null,
    seller_phone: vehicle.sellerPhone || null,
    seller_email: vehicle.sellerEmail || null,

    purchase_price: vehicle.purchasePrice || 0,
    currency: vehicle.currency || 'EUR',
    exchange_rate: vehicle.exchangeRate || 1,
    origin_country: vehicle.originCountry || null,
    market_price: vehicle.marketPrice || 0,
    target_margin: vehicle.targetMargin || 15,
    selling_price: vehicle.sellingPrice || 0,

    status: vehicle.status || 'SOURCING',
    notes: vehicle.notes || null
  }
}

// Récupère tous les véhicules avec leurs relations
export async function fetchVehicles() {
  if (isDemoMode()) {
    throw new Error('Demo mode - use localStorage')
  }

  const { data: vehicles, error: vehiclesError } = await supabase
    .from('vehicles')
    .select('*')
    .order('created_at', { ascending: false })

  if (vehiclesError) throw vehiclesError

  // Récupère les relations pour chaque véhicule
  const vehicleIds = vehicles.map(v => v.id)

  const [costsRes, docsRes, imagesRes, timelineRes] = await Promise.all([
    supabase.from('vehicle_costs').select('*').in('vehicle_id', vehicleIds),
    supabase.from('vehicle_documents').select('*').in('vehicle_id', vehicleIds),
    supabase.from('vehicle_images').select('*').in('vehicle_id', vehicleIds).order('display_order'),
    supabase.from('vehicle_timeline').select('*').in('vehicle_id', vehicleIds)
  ])

  // Groupe les relations par vehicle_id
  const costsByVehicle = groupBy(costsRes.data || [], 'vehicle_id')
  const docsByVehicle = groupBy(docsRes.data || [], 'vehicle_id')
  const imagesByVehicle = groupBy(imagesRes.data || [], 'vehicle_id')
  const timelineByVehicle = groupBy(timelineRes.data || [], 'vehicle_id')

  return vehicles.map(v => transformVehicleFromDB(
    v,
    costsByVehicle[v.id] || [],
    docsByVehicle[v.id] || [],
    imagesByVehicle[v.id] || [],
    timelineByVehicle[v.id] || []
  ))
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

  const [costsRes, docsRes, imagesRes, timelineRes] = await Promise.all([
    supabase.from('vehicle_costs').select('*').eq('vehicle_id', id),
    supabase.from('vehicle_documents').select('*').eq('vehicle_id', id),
    supabase.from('vehicle_images').select('*').eq('vehicle_id', id).order('display_order'),
    supabase.from('vehicle_timeline').select('*').eq('vehicle_id', id)
  ])

  return transformVehicleFromDB(
    vehicle,
    costsRes.data || [],
    docsRes.data || [],
    imagesRes.data || [],
    timelineRes.data || []
  )
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

  // Crée la timeline initiale
  const workflowSteps = ['SOURCING', 'ACHETÉ', 'TRANSPORT', 'ATELIER', 'EN_VENTE', 'VENDU']
  const timelineData = workflowSteps.map((step, index) => ({
    vehicle_id: vehicle.id,
    step,
    status: index === 0 ? 'in_progress' : 'pending',
    date: index === 0 ? new Date().toISOString() : null
  }))

  await supabase.from('vehicle_timeline').insert(timelineData)

  // Insère les coûts initiaux si fournis
  if (vehicleData.costs?.length) {
    const costsData = vehicleData.costs.map(c => ({
      vehicle_id: vehicle.id,
      type: c.type,
      amount: c.amount,
      description: c.description || null,
      date: c.date || new Date().toISOString()
    }))
    await supabase.from('vehicle_costs').insert(costsData)
  }

  // Retourne le véhicule complet
  return fetchVehicle(vehicle.id)
}

// Met à jour un véhicule
export async function updateVehicle(id, updates) {
  if (isDemoMode()) {
    throw new Error('Demo mode - use localStorage')
  }

  const dbUpdates = {}

  // Transforme les champs si présents
  if (updates.vin !== undefined) dbUpdates.vin = updates.vin
  if (updates.make !== undefined) dbUpdates.make = updates.make
  if (updates.model !== undefined) dbUpdates.model = updates.model
  if (updates.trim !== undefined) dbUpdates.trim = updates.trim
  if (updates.year !== undefined) dbUpdates.year = updates.year
  if (updates.mileage !== undefined) dbUpdates.mileage = updates.mileage
  if (updates.color !== undefined) dbUpdates.color = updates.color
  if (updates.sourceUrl !== undefined) dbUpdates.source_url = updates.sourceUrl
  if (updates.sellerName !== undefined) dbUpdates.seller_name = updates.sellerName
  if (updates.sellerPhone !== undefined) dbUpdates.seller_phone = updates.sellerPhone
  if (updates.sellerEmail !== undefined) dbUpdates.seller_email = updates.sellerEmail
  if (updates.purchasePrice !== undefined) dbUpdates.purchase_price = updates.purchasePrice
  if (updates.currency !== undefined) dbUpdates.currency = updates.currency
  if (updates.exchangeRate !== undefined) dbUpdates.exchange_rate = updates.exchangeRate
  if (updates.originCountry !== undefined) dbUpdates.origin_country = updates.originCountry
  if (updates.marketPrice !== undefined) dbUpdates.market_price = updates.marketPrice
  if (updates.targetMargin !== undefined) dbUpdates.target_margin = updates.targetMargin
  if (updates.sellingPrice !== undefined) dbUpdates.selling_price = updates.sellingPrice
  if (updates.status !== undefined) dbUpdates.status = updates.status
  if (updates.notes !== undefined) dbUpdates.notes = updates.notes

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

// Met à jour le statut avec la timeline
export async function updateVehicleStatus(id, newStatus, notes = '') {
  if (isDemoMode()) {
    throw new Error('Demo mode - use localStorage')
  }

  const workflowSteps = ['SOURCING', 'ACHETÉ', 'TRANSPORT', 'ATELIER', 'EN_VENTE', 'VENDU']
  const statusIndex = workflowSteps.indexOf(newStatus)
  const now = new Date().toISOString()

  // Met à jour le véhicule
  const { error: vehicleError } = await supabase
    .from('vehicles')
    .update({ status: newStatus })
    .eq('id', id)

  if (vehicleError) throw vehicleError

  // Met à jour la timeline
  for (let i = 0; i < workflowSteps.length; i++) {
    const step = workflowSteps[i]
    let status = 'pending'
    let date = null

    if (i < statusIndex) {
      status = 'completed'
      date = now
    } else if (i === statusIndex) {
      status = 'in_progress'
      date = now
    }

    await supabase
      .from('vehicle_timeline')
      .upsert({
        vehicle_id: id,
        step,
        status,
        date,
        notes: i === statusIndex ? notes : undefined
      }, {
        onConflict: 'vehicle_id,step'
      })
  }

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

      const { data: newVehicle, error } = await supabase
        .from('vehicles')
        .insert(dbData)
        .select()
        .single()

      if (error) throw error

      // Migre les coûts
      if (vehicle.costs?.length) {
        const costsData = vehicle.costs.map(c => ({
          vehicle_id: newVehicle.id,
          type: c.type,
          amount: c.amount,
          description: c.description || null,
          date: c.date || vehicle.createdAt
        }))
        await supabase.from('vehicle_costs').insert(costsData)
      }

      // Migre les documents
      if (vehicle.documents?.length) {
        const docsData = vehicle.documents.map(d => ({
          vehicle_id: newVehicle.id,
          type: d.type,
          name: d.name,
          url: d.url || null
        }))
        await supabase.from('vehicle_documents').insert(docsData)
      }

      // Migre les images
      if (vehicle.images?.length) {
        const imagesData = vehicle.images.map((img, idx) => ({
          vehicle_id: newVehicle.id,
          url: img.url,
          is_primary: img.isPrimary || idx === 0,
          display_order: img.order || idx
        }))
        await supabase.from('vehicle_images').insert(imagesData)
      }

      // Migre la timeline
      if (vehicle.timeline?.length) {
        const timelineData = vehicle.timeline.map(t => ({
          vehicle_id: newVehicle.id,
          step: t.step,
          status: t.status,
          date: t.date,
          notes: t.notes || null
        }))
        await supabase.from('vehicle_timeline').insert(timelineData)
      }

      results.success++
    } catch (err) {
      results.failed++
      results.errors.push({
        vehicle: `${vehicle.make} ${vehicle.model}`,
        error: err.message
      })
    }
  }

  return results
}

// Helper function
function groupBy(array, key) {
  return array.reduce((acc, item) => {
    const k = item[key]
    if (!acc[k]) acc[k] = []
    acc[k].push(item)
    return acc
  }, {})
}
