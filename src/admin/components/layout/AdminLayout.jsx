import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import BottomNavBar from './BottomNavBar'
import { useUI } from '../../context/UIContext'
import ToastContainer from '../shared/ToastContainer'
import ConfirmDialog from '../shared/ConfirmDialog'

/**
 * AdminLayout - Layout principal du CRM FLOW MOTOR
 * Desktop : Sidebar fixe à gauche + contenu scrollable
 * Mobile  : Bottom Tab Bar + contenu plein écran
 */
function AdminLayout() {
  const { sidebarCollapsed } = useUI()

  return (
    <div
      data-theme="flowmotor-admin"
      className="flex h-screen w-full bg-[#1A0F0F] text-white overflow-hidden"
    >
      {/* Sidebar - Desktop only */}
      <aside
        className={`flex-shrink-0 border-r border-white/10 hidden md:block transition-all duration-300 ${
          sidebarCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        <Sidebar />
      </aside>

      {/* Main Content - pb-24 on mobile for bottom bar clearance */}
      <main className="flex-1 overflow-y-auto pb-24 md:pb-0">
        <Outlet />
      </main>

      {/* Bottom Nav Bar - Mobile only */}
      <BottomNavBar />

      {/* Global UI Components */}
      <ToastContainer />
      <ConfirmDialog />
    </div>
  )
}

export default AdminLayout
