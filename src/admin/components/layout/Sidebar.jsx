import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Search,
  Car,
  Users,
  Kanban,
  Book,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut
} from 'lucide-react'
import { useUI } from '../../context/UIContext'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/sourcing', label: 'Sourcing', icon: Search },
  { path: '/admin/stock', label: 'Stock', icon: Car },
  { path: '/admin/clients', label: 'Clients', icon: Users },
  { path: '/admin/leads', label: 'Leads', icon: Kanban },
  { path: '/admin/police', label: 'Livre de Police', icon: Book },
  { path: '/admin/settings', label: 'Paramètres', icon: Settings }
]

/**
 * Sidebar - Navigation Admin CRM
 * Couleur Aubergine #3D1E1E
 */
function Sidebar() {
  const location = useLocation()
  const { sidebarCollapsed, toggleSidebar } = useUI()
  const { logout, user } = useAuth()

  const isActive = (path) => location.pathname === path

  return (
    <div className="h-full bg-[#3D1E1E] flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-white/10">
        <Link to="/admin/dashboard" className="flex items-center gap-3">
          <img
            src="/assets/engine-white.svg"
            alt="Flow Motor"
            className="h-8 w-8 flex-shrink-0"
          />
          {!sidebarCollapsed && (
            <div className="leading-tight">
              <span className="block font-display text-sm font-semibold text-white">
                FLOW MOTOR
              </span>
              <span className="text-[10px] uppercase tracking-widest text-white/40">
                CRM
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-admin-item ${active ? 'active' : ''}`}
              title={sidebarCollapsed ? item.label : undefined}
            >
              <Icon size={20} className={active ? 'text-[#C4A484]' : 'text-white/60'} />
              {!sidebarCollapsed && (
                <span className={active ? 'text-white font-medium' : 'text-white/60'}>
                  {item.label}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* User & Actions */}
      <div className="p-3 border-t border-white/10 space-y-2">
        {/* User info */}
        {!sidebarCollapsed && user && (
          <div className="px-3 py-2">
            <p className="text-xs text-white/40 truncate">{user.email}</p>
          </div>
        )}

        {/* Logout */}
        <button
          onClick={logout}
          className="nav-admin-item w-full text-white/40 hover:text-red-400"
          title={sidebarCollapsed ? 'Déconnexion' : undefined}
        >
          <LogOut size={20} />
          {!sidebarCollapsed && <span>Déconnexion</span>}
        </button>

        {/* Toggle */}
        <button
          onClick={toggleSidebar}
          className="nav-admin-item w-full text-white/40 hover:text-white"
          title={sidebarCollapsed ? 'Agrandir' : 'Réduire'}
        >
          {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          {!sidebarCollapsed && <span>Réduire</span>}
        </button>
      </div>
    </div>
  )
}

export default Sidebar
