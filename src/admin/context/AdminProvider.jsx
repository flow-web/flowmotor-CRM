import { VehiclesProvider } from './VehiclesContext'
import { UIProvider } from './UIContext'

/**
 * Provider combiné pour toute la section admin
 * AuthProvider est monté au niveau App (instance unique)
 * AdminProvider encapsule Vehicles et UI contexts
 */
export function AdminProvider({ children }) {
  return (
    <VehiclesProvider>
      <UIProvider>
        {children}
      </UIProvider>
    </VehiclesProvider>
  )
}

export default AdminProvider
