import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Search,
  Car,
  Users,
  Kanban,
  Receipt,
  Book,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Crown
} from 'lucide-react'
import { useUI } from '../../context/UIContext'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/sourcing', label: 'Sourcing', icon: Search },
  { path: '/admin/stock', label: 'Stock', icon: Car },
  { path: '/admin/clients', label: 'Clients', icon: Users },
  { path: '/admin/leads', label: 'Leads', icon: Kanban },
  { path: '/admin/invoices', label: 'Factures', icon: Receipt },
  { path: '/admin/police', label: 'Livre de Police', icon: Book },
  { path: '/admin/settings', label: 'Parametres', icon: Settings }
]

/**
 * Sidebar - Navigation Admin CRM
 * Luxe Command Center — dark with gold accents
 */
function Sidebar() {
  const location = useLocation()
  const { sidebarCollapsed, toggleSidebar } = useUI()
  const { logout, user } = useAuth()

  const isActive = (path) => location.pathname === path

  return (
    <div className="h-full flex flex-col" style={{ background: 'linear-gradient(180deg, #0F0808 0%, #1A0F0F 100%)' }}>
      {/* Logo */}
      <div className="p-4 border-b border-white/[0.06]">
        <Link to="/admin/dashboard" className="flex items-center gap-3 group">
          <div className="relative flex-shrink-0">
            <img
              src="/assets/engine-white.svg"
              alt="Flow Motor"
              className="h-8 w-8 transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]"
            />
          </div>
          {!sidebarCollapsed && (
            <div className="leading-tight">
              <span className="block font-display text-sm font-semibold text-white tracking-wider">
                FLOW MOTOR
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#D4AF37]/60 font-medium">
                Command Center
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto">
        {sidebarCollapsed ? null : (
          <p className="px-3 mb-3 text-[9px] uppercase tracking-[0.2em] text-white/20 font-medium">
            Navigation
          </p>
        )}
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
              <Icon
                size={18}
                className={`transition-all duration-200 ${
                  active ? 'text-[#D4AF37]' : 'text-white/40'
                }`}
              />
              {!sidebarCollapsed && (
                <span
                  className={`text-[13px] transition-colors duration-200 ${
                    active
                      ? 'text-[#D4AF37] font-semibold'
                      : 'text-white/50 font-medium'
                  }`}
                >
                  {item.label}
                </span>
              )}
              {active && !sidebarCollapsed && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#D4AF37] shadow-[0_0_6px_rgba(212,175,55,0.5)]" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* User & Actions */}
      <div className="p-3 border-t border-white/[0.06] space-y-1">
        {/* User info */}
        {!sidebarCollapsed && user && (
          <div className="px-3 py-2.5 rounded-lg bg-white/[0.03] mb-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#D4AF37]/20 flex items-center justify-center">
                <Crown size={12} className="text-[#D4AF37]" />
              </div>
              <p className="text-[11px] text-white/40 truncate">{user.email}</p>
            </div>
          </div>
        )}

        {/* Logout */}
        <button
          onClick={logout}
          className="nav-admin-item w-full text-white/30 hover:text-red-400/80"
          title={sidebarCollapsed ? 'Deconnexion' : undefined}
        >
          <LogOut size={18} />
          {!sidebarCollapsed && <span className="text-[13px]">Deconnexion</span>}
        </button>

        {/* Toggle */}
        <button
          onClick={toggleSidebar}
          className="nav-admin-item w-full text-white/30 hover:text-white/60"
          title={sidebarCollapsed ? 'Agrandir' : 'Reduire'}
        >
          {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          {!sidebarCollapsed && <span className="text-[13px]">Reduire</span>}
        </button>
      </div>
    </div>
  )
}

export default Sidebar
