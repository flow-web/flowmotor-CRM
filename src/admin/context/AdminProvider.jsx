import { AuthProvider } from './AuthContext'
import { VehiclesProvider } from './VehiclesContext'
import { UIProvider } from './UIContext'

/**
 * Provider combiné pour toute la section admin
 * Encapsule Auth, Vehicles et UI contexts
 */
export function AdminProvider({ children }) {
  return (
    <AuthProvider>
      <VehiclesProvider>
        <UIProvider>
          {children}
        </UIProvider>
      </VehiclesProvider>
    </AuthProvider>
  )
}

export default AdminProvider
