import { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { STORAGE_KEYS, VEHICLE_STATUS, WORKFLOW_ORDER } from '../utils/constants'
import { calculatePRU, calculateStockStats } from '../utils/calculations'
import { generateId } from '../utils/formatters'
import {
  isDemoMode,
  checkSupabaseConnection,
  fetchVehicles as supabaseFetchVehicles,
  createVehicle as supabaseCreateVehicle,
  updateVehicle as supabaseUpdateVehicle,
  deleteVehicle as supabaseDeleteVehicle,
  updateVehicleStatus as supabaseUpdateStatus,
  addCost as supabaseAddCost,
  updateCost as supabaseUpdateCost,
  deleteCost as supabaseDeleteCost,
  migrateFromLocalStorage
} from '../../lib/supabase'
import { supabase } from '../../lib/supabase/client'

const VehiclesContext = createContext(null)

// Mode de données: 'supabase' | 'localStorage' | 'demo'
const DATA_MODE = {
  SUPABASE: 'supabase',
  LOCAL: 'localStorage',
  DEMO: 'demo'
}

export function VehiclesProvider({ children }) {
  const [vehicles, setVehicles] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [dataMode, setDataMode] = useState(DATA_MODE.LOCAL)
  const [connectionStatus, setConnectionStatus] = useState({ connected: false, mode: 'checking' })
  const hasLoadedOnce = useRef(false)

  // Vérifie la connexion Supabase au démarrage
  useEffect(() => {
    checkConnection()
  }, [])

  // Charge les véhicules après vérification de la connexion
  useEffect(() => {
    if (connectionStatus.mode !== 'checking') {
      loadVehicles()
    }
  }, [connectionStatus.mode])

  // Sauvegarde automatique en mode localStorage uniquement
  useEffect(() => {
    if (!isLoading && vehicles.length > 0 && dataMode === DATA_MODE.LOCAL) {
      saveVehiclesToLocalStorage()
    }
  }, [vehicles, isLoading, dataMode])

  const checkConnection = async () => {
    try {
      if (isDemoMode()) {
        setConnectionStatus({ connected: false, mode: 'demo' })
        setDataMode(DATA_MODE.LOCAL)
        return
      }

      const status = await checkSupabaseConnection()
      setConnectionStatus(status)

      if (status.connected) {
        setDataMode(DATA_MODE.SUPABASE)
      } else {
        setDataMode(DATA_MODE.LOCAL)
      }
    } catch (err) {
      // AbortError en Strict Mode — présumer Supabase OK
      if (err.name === 'AbortError' || err.message?.includes('aborted')) {
        setConnectionStatus({ connected: true, mode: 'supabase' })
        setDataMode(DATA_MODE.SUPABASE)
        return
      }
      console.error('[checkConnection] Erreur fatale:', err)
      // Fallback garanti — ne jamais rester en 'checking'
      setConnectionStatus({ connected: false, mode: 'offline' })
      setDataMode(DATA_MODE.LOCAL)
    }
  }

  // Chargement complet (premier appel = skeleton, ensuite silencieux)
  const loadVehicles = async () => {
    // Premier appel : montre le skeleton. Appels suivants : silencieux
    if (!hasLoadedOnce.current) {
      setIsLoading(true)
    }
    setError(null)

    try {
      if (dataMode === DATA_MODE.SUPABASE) {
        const supabaseVehicles = await supabaseFetchVehicles()
        setVehicles(supabaseVehicles)
      } else {
        loadVehiclesFromLocalStorage()
      }
    } catch (err) {
      // AbortError en Strict Mode — ignorer silencieusement
      if (err.name === 'AbortError' || err.message?.includes('aborted')) return

      console.error('[loadVehicles] Erreur:', err)
      setError('Erreur de chargement des données')
      // Fallback sur localStorage en cas d'erreur Supabase
      if (dataMode === DATA_MODE.SUPABASE) {
        setDataMode(DATA_MODE.LOCAL)
        loadVehiclesFromLocalStorage()
      }
    } finally {
      setIsLoading(false)
      hasLoadedOnce.current = true
    }
  }

  const loadVehiclesFromLocalStorage = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.VEHICLES)
      if (stored) {
        setVehicles(JSON.parse(stored))
      } else {
        setVehicles([])
      }
    } catch (err) {
      console.error('Erreur chargement localStorage:', err)
      setVehicles([])
    }
  }

  const saveVehiclesToLocalStorage = () => {
    try {
      localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(vehicles))
    } catch (err) {
      console.error('Erreur sauvegarde localStorage:', err)
    }
  }

  // CRUD Operations
  const getVehicle = useCallback((id) => {
    return vehicles.find(v => v.id === id) || null
  }, [vehicles])

  const createVehicle = async (data) => {
    const now = new Date().toISOString()

    if (dataMode === DATA_MODE.SUPABASE) {
      try {
        const newVehicle = await supabaseCreateVehicle(data)
        setVehicles(prev => [newVehicle, ...prev])
        return newVehicle
      } catch (err) {
        console.error('Erreur création Supabase:', err.message || err, '| code:', err.code, '| details:', err.details, '| hint:', err.hint)
        throw err
      }
    }

    // Mode localStorage
    const timeline = WORKFLOW_ORDER.map((step, index) => ({
      step,
      status: index === 0 ? 'in_progress' : 'pending',
      date: index === 0 ? now : null,
      notes: ''
    }))

    const newVehicle = {
      id: generateId(),
      ...data,
      status: VEHICLE_STATUS.SOURCING,
      timeline,
      costs: data.costs || [],
      images: data.images || [],
      documents: data.documents || [],
      createdAt: now,
      updatedAt: now
    }

    setVehicles(prev => [newVehicle, ...prev])
    return newVehicle
  }

  const updateVehicle = async (id, updates) => {
    if (dataMode === DATA_MODE.SUPABASE) {
      try {
        const updatedVehicle = await supabaseUpdateVehicle(id, updates)
        setVehicles(prev => prev.map(v => v.id === id ? updatedVehicle : v))
        return updatedVehicle
      } catch (err) {
        console.error('Erreur mise à jour Supabase:', err)
        throw err
      }
    }

    // Mode localStorage
    setVehicles(prev => prev.map(v => {
      if (v.id !== id) return v
      return {
        ...v,
        ...updates,
        updatedAt: new Date().toISOString()
      }
    }))
  }

  const deleteVehicle = async (id) => {
    if (dataMode === DATA_MODE.SUPABASE) {
      try {
        await supabaseDeleteVehicle(id)
        setVehicles(prev => prev.filter(v => v.id !== id))
        return true
      } catch (err) {
        console.error('Erreur suppression Supabase:', err)
        throw err
      }
    }

    // Mode localStorage
    setVehicles(prev => prev.filter(v => v.id !== id))
  }

  // Status Management
  const updateStatus = async (id, newStatus, notes = '') => {
    if (dataMode === DATA_MODE.SUPABASE) {
      try {
        const updatedVehicle = await supabaseUpdateStatus(id, newStatus, notes)
        setVehicles(prev => prev.map(v => v.id === id ? updatedVehicle : v))
        return updatedVehicle
      } catch (err) {
        console.error('Erreur mise à jour statut Supabase:', err)
        throw err
      }
    }

    // Mode localStorage
    setVehicles(prev => prev.map(v => {
      if (v.id !== id) return v

      const now = new Date().toISOString()
      const statusIndex = WORKFLOW_ORDER.indexOf(newStatus)

      const newTimeline = v.timeline.map((step, index) => {
        if (WORKFLOW_ORDER[index] === newStatus) {
          return { ...step, status: 'in_progress', date: now, notes: notes || step.notes }
        }
        if (index < statusIndex) {
          return { ...step, status: 'completed', date: step.date || now }
        }
        return { ...step, status: 'pending' }
      })

      return {
        ...v,
        status: newStatus,
        timeline: newTimeline,
        updatedAt: now
      }
    }))
  }

  // Costs Management
  const addCost = async (vehicleId, cost) => {
    console.log('[addCost] mode:', dataMode, '| vehicleId:', vehicleId, '| cost:', cost)
    if (dataMode === DATA_MODE.SUPABASE) {
      try {
        const newCost = await supabaseAddCost(vehicleId, cost)
        console.log('[addCost] SUCCESS — Supabase returned:', newCost)
        setVehicles(prev => prev.map(v => {
          if (v.id !== vehicleId) return v
          const updated = { ...v, costs: [...(v.costs || []), newCost] }
          console.log('[addCost] State updated — costs count:', updated.costs.length)
          return updated
        }))
        return newCost
      } catch (err) {
        console.error('[addCost] ERREUR Supabase:', err.message, '| code:', err.code, '| details:', err.details)
        throw err
      }
    }

    // Mode localStorage
    const newCost = {
      id: generateId(),
      ...cost,
      date: cost.date || new Date().toISOString()
    }

    setVehicles(prev => prev.map(v => {
      if (v.id !== vehicleId) return v
      return {
        ...v,
        costs: [...v.costs, newCost],
        updatedAt: new Date().toISOString()
      }
    }))
  }

  const updateCost = async (vehicleId, costId, updates) => {
    if (dataMode === DATA_MODE.SUPABASE) {
      try {
        const updatedCost = await supabaseUpdateCost(costId, updates)
        setVehicles(prev => prev.map(v => {
          if (v.id !== vehicleId) return v
          return {
            ...v,
            costs: v.costs.map(c => c.id === costId ? updatedCost : c)
          }
        }))
        return updatedCost
      } catch (err) {
        console.error('Erreur mise à jour coût Supabase:', err)
        throw err
      }
    }

    // Mode localStorage
    setVehicles(prev => prev.map(v => {
      if (v.id !== vehicleId) return v
      return {
        ...v,
        costs: v.costs.map(c => c.id === costId ? { ...c, ...updates } : c),
        updatedAt: new Date().toISOString()
      }
    }))
  }

  const deleteCost = async (vehicleId, costId) => {
    if (dataMode === DATA_MODE.SUPABASE) {
      try {
        await supabaseDeleteCost(costId)
        setVehicles(prev => prev.map(v => {
          if (v.id !== vehicleId) return v
          return {
            ...v,
            costs: v.costs.filter(c => c.id !== costId)
          }
        }))
        return true
      } catch (err) {
        console.error('Erreur suppression coût Supabase:', err)
        throw err
      }
    }

    // Mode localStorage
    setVehicles(prev => prev.map(v => {
      if (v.id !== vehicleId) return v
      return {
        ...v,
        costs: v.costs.filter(c => c.id !== costId),
        updatedAt: new Date().toISOString()
      }
    }))
  }

  // Documents Management
  const addDocument = (vehicleId, doc) => {
    const newDoc = {
      id: generateId(),
      ...doc,
      date: doc.date || new Date().toISOString()
    }

    setVehicles(prev => prev.map(v => {
      if (v.id !== vehicleId) return v
      return {
        ...v,
        documents: [...v.documents, newDoc],
        updatedAt: new Date().toISOString()
      }
    }))
  }

  const deleteDocument = (vehicleId, docId) => {
    setVehicles(prev => prev.map(v => {
      if (v.id !== vehicleId) return v
      return {
        ...v,
        documents: v.documents.filter(d => d.id !== docId),
        updatedAt: new Date().toISOString()
      }
    }))
  }

  // ============================================
  // IMAGES MANAGEMENT — Appels directs Supabase
  // ============================================

  const addImages = async (vehicleId, newImagesList) => {
    // Ajouter un ID unique à chaque image
    const stamped = newImagesList.map(img => ({ id: generateId(), ...img }))

    // 1. State local immédiat — utilise prev pour éviter la stale closure
    setVehicles(prev => prev.map(v => {
      if (v.id !== vehicleId) return v
      return {
        ...v,
        images: [...(v.images || []), ...stamped],
        updatedAt: new Date().toISOString()
      }
    }))

    // 2. Persist Supabase — lire le DB actuel, merger, sauver (évite race condition)
    if (dataMode === DATA_MODE.SUPABASE && supabase) {
      try {
        // Lire les images actuelles depuis la DB
        const { data, error: readError } = await supabase
          .from('vehicles')
          .select('images')
          .eq('id', vehicleId)
          .single()

        if (readError) {
          console.error('[addImages] Read error:', readError.message)
          return
        }

        const currentDbImages = Array.isArray(data?.images) ? data.images : []
        const merged = [...currentDbImages, ...stamped]

        const { error } = await supabase
          .from('vehicles')
          .update({ images: merged })
          .eq('id', vehicleId)

        if (error) {
          console.error('[addImages] Supabase error:', error.message)
        }
      } catch (err) {
        console.error('[addImages] Network error:', err)
      }
    }
  }

  const deleteImage = async (vehicleId, imagePath) => {
    const vehicle = vehicles.find(v => v.id === vehicleId)
    if (!vehicle) return

    // 1. Storage : Supprimer le fichier du bucket
    if (dataMode === DATA_MODE.SUPABASE && supabase && imagePath) {
      try {
        const { error: storageError } = await supabase.storage
          .from('vehicles')
          .remove([imagePath])
        if (storageError) {
          console.error('[deleteImage] Storage error:', storageError.message)
        }
      } catch (err) {
        console.error('[deleteImage] Storage network error:', err)
      }
    }

    // 2. Database : Filtrer le tableau pour retirer cette image
    const newImages = (vehicle.images || []).filter(i => i.path !== imagePath)

    // 3. State local immédiat (UI réactive)
    setVehicles(prev => prev.map(v => {
      if (v.id !== vehicleId) return v
      return { ...v, images: newImages, updatedAt: new Date().toISOString() }
    }))

    // 4. Persist Supabase
    if (dataMode === DATA_MODE.SUPABASE && supabase) {
      try {
        const { error } = await supabase
          .from('vehicles')
          .update({ images: newImages })
          .eq('id', vehicleId)
        if (error) {
          console.error('[deleteImage] DB error:', error.message)
        }
      } catch (err) {
        console.error('[deleteImage] DB network error:', err)
      }
    }
  }

  const setPrimaryImage = async (vehicleId, imagePath) => {
    const vehicle = vehicles.find(v => v.id === vehicleId)
    if (!vehicle) return

    const currentImages = vehicle.images || []
    const targetIndex = currentImages.findIndex(i => i.path === imagePath)
    if (targetIndex < 0) return

    // Déplacer l'image choisie à l'index 0 = image principale
    const target = currentImages[targetIndex]
    const newImages = [target, ...currentImages.filter((_, idx) => idx !== targetIndex)]

    // 1. State local immédiat (UI réactive)
    setVehicles(prev => prev.map(v => {
      if (v.id !== vehicleId) return v
      return { ...v, images: newImages, updatedAt: new Date().toISOString() }
    }))

    // 2. Persist Supabase
    if (dataMode === DATA_MODE.SUPABASE && supabase) {
      try {
        const { error } = await supabase
          .from('vehicles')
          .update({ images: newImages })
          .eq('id', vehicleId)
        if (error) {
          console.error('[setPrimaryImage] Supabase error:', error.message)
        }
      } catch (err) {
        console.error('[setPrimaryImage] Network error:', err)
      }
    }
  }

  // Migration localStorage -> Supabase
  const migrateToSupabase = async () => {
    if (isDemoMode()) {
      throw new Error('Migration non disponible en mode démo')
    }

    const status = await checkSupabaseConnection()
    if (!status.connected) {
      throw new Error('Connexion Supabase non disponible')
    }

    const localVehicles = JSON.parse(localStorage.getItem(STORAGE_KEYS.VEHICLES) || '[]')
    if (localVehicles.length === 0) {
      throw new Error('Aucune donnée locale à migrer')
    }

    const result = await migrateFromLocalStorage(localVehicles)

    // Recharge les données depuis Supabase
    if (result.success > 0) {
      setDataMode(DATA_MODE.SUPABASE)
      await loadVehicles()
    }

    return result
  }

  // Computed Values
  const stats = useMemo(() => calculateStockStats(vehicles), [vehicles])

  const vehiclesByStatus = useMemo(() => {
    const grouped = {}
    WORKFLOW_ORDER.forEach(status => {
      grouped[status] = vehicles.filter(v => v.status === status)
    })
    return grouped
  }, [vehicles])

  const value = {
    // State
    vehicles,
    isLoading,
    error,

    // Mode & Connection
    dataMode,
    connectionStatus,
    isSupabaseMode: dataMode === DATA_MODE.SUPABASE,
    isDemoMode: isDemoMode(),

    // CRUD
    getVehicle,
    createVehicle,
    updateVehicle,
    deleteVehicle,

    // Status
    updateStatus,

    // Costs
    addCost,
    updateCost,
    deleteCost,

    // Documents
    addDocument,
    deleteDocument,

    // Images
    addImages,
    deleteImage,
    setPrimaryImage,

    // Computed
    stats,
    vehiclesByStatus,

    // Utils
    refresh: loadVehicles,
    checkConnection,
    migrateToSupabase
  }

  return (
    <VehiclesContext.Provider value={value}>
      {children}
    </VehiclesContext.Provider>
  )
}

export function useVehicles() {
  const context = useContext(VehiclesContext)
  if (!context) {
    throw new Error('useVehicles doit être utilisé dans un VehiclesProvider')
  }
  return context
}

export default VehiclesContext
