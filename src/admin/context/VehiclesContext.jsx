import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react'
import { STORAGE_KEYS, VEHICLE_STATUS, WORKFLOW_ORDER } from '../utils/constants'
import { calculatePRU, calculateStockStats } from '../utils/calculations'
import { generateId } from '../utils/formatters'
import { mockVehicles } from '../data/mockVehicles'
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
  }

  const loadVehicles = async () => {
    setIsLoading(true)
    setError(null)

    try {
      if (dataMode === DATA_MODE.SUPABASE) {
        // Charge depuis Supabase
        const supabaseVehicles = await supabaseFetchVehicles()
        setVehicles(supabaseVehicles)
      } else {
        // Charge depuis localStorage
        loadVehiclesFromLocalStorage()
      }
    } catch (err) {
      console.error('Erreur chargement véhicules:', err)
      setError('Erreur de chargement des données')
      // Fallback sur localStorage en cas d'erreur Supabase
      if (dataMode === DATA_MODE.SUPABASE) {
        setDataMode(DATA_MODE.LOCAL)
        loadVehiclesFromLocalStorage()
      }
    } finally {
      setIsLoading(false)
    }
  }

  const loadVehiclesFromLocalStorage = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.VEHICLES)
      if (stored) {
        setVehicles(JSON.parse(stored))
      } else {
        setVehicles(mockVehicles)
      }
    } catch (err) {
      console.error('Erreur chargement localStorage:', err)
      setVehicles(mockVehicles)
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
        console.error('Erreur création Supabase:', err)
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
    if (dataMode === DATA_MODE.SUPABASE) {
      try {
        const newCost = await supabaseAddCost(vehicleId, cost)
        setVehicles(prev => prev.map(v => {
          if (v.id !== vehicleId) return v
          return { ...v, costs: [...v.costs, newCost] }
        }))
        return newCost
      } catch (err) {
        console.error('Erreur ajout coût Supabase:', err)
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

  // Images Management
  const addImage = (vehicleId, image) => {
    const newImage = {
      id: generateId(),
      ...image,
      order: 999
    }

    setVehicles(prev => prev.map(v => {
      if (v.id !== vehicleId) return v
      const images = [...v.images, newImage]
      if (images.length === 1) {
        images[0].isPrimary = true
      }
      return {
        ...v,
        images,
        updatedAt: new Date().toISOString()
      }
    }))
  }

  const deleteImage = (vehicleId, imageId) => {
    setVehicles(prev => prev.map(v => {
      if (v.id !== vehicleId) return v
      const images = v.images.filter(i => i.id !== imageId)
      if (images.length > 0 && !images.some(i => i.isPrimary)) {
        images[0].isPrimary = true
      }
      return {
        ...v,
        images,
        updatedAt: new Date().toISOString()
      }
    }))
  }

  const setPrimaryImage = (vehicleId, imageId) => {
    setVehicles(prev => prev.map(v => {
      if (v.id !== vehicleId) return v
      return {
        ...v,
        images: v.images.map(i => ({ ...i, isPrimary: i.id === imageId })),
        updatedAt: new Date().toISOString()
      }
    }))
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
    addImage,
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
