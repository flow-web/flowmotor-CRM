import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import { useUI } from '../../context/UIContext'
import ToastContainer from '../shared/ToastContainer'
import ConfirmDialog from '../shared/ConfirmDialog'

/**
 * AdminLayout - Layout principal du CRM FLOW MOTOR
 * Structure Flexbox : Sidebar fixe à gauche, contenu scrollable à droite
 */
function AdminLayout() {
  const { sidebarCollapsed } = useUI()

  return (
    <div
      data-theme="flowmotor-admin"
      className="flex h-screen w-full bg-[#1A0F0F] text-white overflow-hidden"
    >
      {/* Sidebar - Fixe à gauche, Aubergine */}
      <aside
        className={`flex-shrink-0 border-r border-white/10 hidden md:block transition-all duration-300 ${
          sidebarCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        <Sidebar />
      </aside>

      {/* Main Content - Scrollable */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

      {/* Global UI Components */}
      <ToastContainer />
      <ConfirmDialog />
    </div>
  )
}

export default AdminLayout
