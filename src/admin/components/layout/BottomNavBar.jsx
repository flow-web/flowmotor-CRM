import { useState, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Car, Users, Menu, X, Plus, Receipt, Book, Settings, Search, LogOut, Camera, Upload } from 'lucide-react'
import { useUI } from '../../context/UIContext'
import { useAuth } from '../../context/AuthContext'

const primaryTabs = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/stock', label: 'Stock', icon: Car },
  // Centre = bouton scanner (géré séparément)
  { path: '/admin/leads', label: 'Leads', icon: Users },
  // Dernier = bouton menu (géré séparément)
]

const moreMenuItems = [
  { path: '/admin/sourcing', label: 'Sourcing', icon: Search },
  { path: '/admin/clients', label: 'Clients', icon: Users },
  { path: '/admin/invoices', label: 'Factures', icon: Receipt },
  { path: '/admin/police', label: 'Livre de Police', icon: Book },
  { path: '/admin/settings', label: 'Paramètres', icon: Settings },
]

function BottomNavBar() {
  const location = useLocation()
  const { toast } = useUI()
  const { logout } = useAuth()
  const [showMore, setShowMore] = useState(false)
  const [showScanner, setShowScanner] = useState(false)

  const cameraInputRef = useRef(null)
  const fileInputRef = useRef(null)

  const isActive = (path) => location.pathname === path

  const handleFileSelected = (e, source) => {
    const file = e.target.files?.[0]
    if (file) {
      console.log(`[Scanner] Image reçue via ${source}:`, file.name, file.type, `${(file.size / 1024).toFixed(1)} Ko`)
      toast.success(`Image capturée : ${file.name}`)
      setShowScanner(false)
    }
    e.target.value = ''
  }

  return (
    <>
      {/* Scanner Drawer Overlay */}
      {showScanner && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setShowScanner(false)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          <div
            className="absolute bottom-[calc(64px+env(safe-area-inset-bottom))] left-0 right-0 bg-[#141414] border-t border-white/5 rounded-t-2xl p-5 animate-in slide-in-from-bottom duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-white/15" />

            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-white">Ajouter un document</span>
              <button onClick={() => setShowScanner(false)} className="text-zinc-500 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Option A — Photo rapide (caméra) */}
              <button
                onClick={() => cameraInputRef.current?.click()}
                className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-orange-500/10 hover:border-orange-500/20 active:scale-95 transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center">
                  <Camera size={24} className="text-orange-500" />
                </div>
                <span className="text-sm font-medium text-white">Photo Rapide</span>
                <span className="text-[10px] text-zinc-500">Ouvrir la caméra</span>
              </button>

              {/* Option B — Upload fichier */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-orange-500/10 hover:border-orange-500/20 active:scale-95 transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center">
                  <Upload size={24} className="text-orange-500" />
                </div>
                <span className="text-sm font-medium text-white">Upload Fichier</span>
                <span className="text-[10px] text-zinc-500">Depuis l'appareil</span>
              </button>
            </div>

            {/* Hidden file inputs */}
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => handleFileSelected(e, 'camera')}
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              onChange={(e) => handleFileSelected(e, 'upload')}
            />
          </div>
        </div>
      )}

      {/* More Menu Overlay */}
      {showMore && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setShowMore(false)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          <div
            className="absolute bottom-[calc(64px+env(safe-area-inset-bottom))] left-0 right-0 bg-[#141414] border-t border-white/5 rounded-t-2xl p-4 space-y-1 animate-in slide-in-from-bottom duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-white/15" />

            <div className="flex items-center justify-between mb-3 px-2">
              <span className="text-[11px] text-zinc-500 uppercase tracking-wider font-medium">Menu</span>
              <button onClick={() => setShowMore(false)} className="text-zinc-500 hover:text-white">
                <X size={18} />
              </button>
            </div>

            {moreMenuItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.path)
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setShowMore(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    active
                      ? 'bg-orange-500/10 text-orange-500'
                      : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              )
            })}

            {/* Logout */}
            <button
              onClick={() => { setShowMore(false); logout() }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-zinc-500 hover:bg-white/5 hover:text-red-400 transition-colors mt-2 border-t border-white/5 pt-3"
            >
              <LogOut size={20} />
              <span className="text-sm font-medium">Déconnexion</span>
            </button>
          </div>
        </div>
      )}

      {/* Bottom Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <div
          className="flex items-end justify-around bg-black/95 backdrop-blur-md border-t border-white/5"
          style={{ height: 'calc(64px + env(safe-area-inset-bottom))', paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          {/* Dashboard */}
          <TabItem item={primaryTabs[0]} isActive={isActive(primaryTabs[0].path)} />

          {/* Stock */}
          <TabItem item={primaryTabs[1]} isActive={isActive(primaryTabs[1].path)} />

          {/* Scanner — bouton central surélevé */}
          <div className="flex flex-col items-center -mt-5">
            <button
              onClick={() => { setShowMore(false); setShowScanner(!showScanner) }}
              className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-all duration-200 ${
                showScanner ? 'shadow-orange-500/20' : 'shadow-orange-500/30'
              }`}
              style={{ background: showScanner
                ? 'radial-gradient(circle at 40% 40%, #9a3412, #7c2d12)'
                : 'radial-gradient(circle at 40% 40%, #f97316, #c2410c)'
              }}
            >
              <Plus size={28} className={`text-white transition-transform duration-200 ${showScanner ? 'rotate-45' : ''}`} />
            </button>
            <span className={`text-[10px] mt-1 ${showScanner ? 'text-orange-500' : 'text-zinc-500'}`}>Scanner</span>
          </div>

          {/* Leads */}
          <TabItem item={primaryTabs[2]} isActive={isActive(primaryTabs[2].path)} />

          {/* Menu */}
          <button
            onClick={() => { setShowScanner(false); setShowMore(!showMore) }}
            className="flex flex-col items-center justify-center gap-0.5 py-2 px-3 min-w-[56px] h-16"
          >
            <div className="relative">
              {showMore ? (
                <X size={22} className="text-orange-500" />
              ) : (
                <Menu size={22} className="text-zinc-500" />
              )}
            </div>
            <span className={`text-[10px] ${showMore ? 'text-orange-500' : 'text-zinc-500'}`}>
              Menu
            </span>
          </button>
        </div>
      </nav>
    </>
  )
}

function TabItem({ item, isActive }) {
  const Icon = item.icon

  return (
    <Link
      to={item.path}
      className="flex flex-col items-center justify-center gap-0.5 py-2 px-3 min-w-[56px] h-16 relative"
    >
      <Icon size={22} className={isActive ? 'text-orange-500' : 'text-zinc-500'} />
      <span className={`text-[10px] ${isActive ? 'text-orange-500 font-medium' : 'text-zinc-500'}`}>
        {item.label}
      </span>
    </Link>
  )
}

export default BottomNavBar
