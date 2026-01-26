import { createContext, useContext, useState, useCallback } from 'react'
import { generateId } from '../utils/formatters'

const UIContext = createContext(null)

export function UIProvider({ children }) {
  // Sidebar state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Toast notifications
  const [toasts, setToasts] = useState([])

  // Confirm dialog
  const [confirmDialog, setConfirmDialog] = useState(null)

  // Filters state (pour la page Stock)
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    make: '',
    minPrice: '',
    maxPrice: ''
  })

  // Sidebar
  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed(prev => !prev)
  }, [])

  // Filters
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }, [])

  const resetFilters = useCallback(() => {
    setFilters({
      search: '',
      status: '',
      make: '',
      minPrice: '',
      maxPrice: ''
    })
  }, [])

  // Toasts
  const showToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = generateId()
    const toast = { id, message, type }

    setToasts(prev => [...prev, toast])

    // Auto-remove après duration
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, duration)

    return id
  }, [])

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  // Helpers pour les toasts typés
  const toast = {
    success: (message) => showToast(message, 'success'),
    error: (message) => showToast(message, 'error', 6000),
    warning: (message) => showToast(message, 'warning'),
    info: (message) => showToast(message, 'info')
  }

  // Confirm Dialog
  const showConfirm = useCallback((options) => {
    return new Promise((resolve) => {
      setConfirmDialog({
        title: options.title || 'Confirmation',
        message: options.message || 'Êtes-vous sûr ?',
        confirmLabel: options.confirmLabel || 'Confirmer',
        cancelLabel: options.cancelLabel || 'Annuler',
        variant: options.variant || 'default', // 'default' | 'danger'
        onConfirm: () => {
          setConfirmDialog(null)
          resolve(true)
        },
        onCancel: () => {
          setConfirmDialog(null)
          resolve(false)
        }
      })
    })
  }, [])

  const closeConfirm = useCallback(() => {
    if (confirmDialog?.onCancel) {
      confirmDialog.onCancel()
    }
    setConfirmDialog(null)
  }, [confirmDialog])

  const value = {
    // Sidebar
    sidebarCollapsed,
    toggleSidebar,

    // Filters
    filters,
    updateFilters,
    resetFilters,

    // Toasts
    toasts,
    showToast,
    dismissToast,
    toast,

    // Confirm
    confirmDialog,
    showConfirm,
    closeConfirm
  }

  return (
    <UIContext.Provider value={value}>
      {children}
    </UIContext.Provider>
  )
}

export function useUI() {
  const context = useContext(UIContext)
  if (!context) {
    throw new Error('useUI doit être utilisé dans un UIProvider')
  }
  return context
}

export default UIContext
