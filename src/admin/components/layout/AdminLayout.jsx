import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import { useUI } from '../../context/UIContext'
import ToastContainer from '../shared/ToastContainer'
import ConfirmDialog from '../shared/ConfirmDialog'

function AdminLayout() {
  const { sidebarCollapsed } = useUI()

  return (
    <div data-theme="flowmotor-admin" className="min-h-screen bg-[#0F0A0A] text-white/90">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main
        className={`transition-all duration-300 ${
          sidebarCollapsed ? 'ml-16' : 'ml-60'
        }`}
      >
        <Outlet />
      </main>

      {/* Global UI Components */}
      <ToastContainer />
      <ConfirmDialog />
    </div>
  )
}

export default AdminLayout
