import { Search, Bell, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useUI } from '../../context/UIContext'

function TopHeader({ title, subtitle }) {
  const { filters, updateFilters } = useUI()

  return (
    <header className="sticky top-0 z-30 bg-[#0F0A0A]/95 backdrop-blur border-b border-white/5">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left - Title */}
        <div>
          <h1 className="text-lg font-semibold text-white">{title}</h1>
          {subtitle && (
            <p className="text-xs text-white/40">{subtitle}</p>
          )}
        </div>

        {/* Center - Search */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Rechercher un véhicule (VIN, marque, modèle...)"
              value={filters.search}
              onChange={(e) => updateFilters({ search: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20"
            />
          </div>
        </div>

        {/* Right - Actions */}
        <div className="flex items-center gap-3">
          {/* Voir le site */}
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-2 text-xs text-white/40 hover:text-white/60 transition-colors"
          >
            <ExternalLink size={14} />
            <span className="hidden sm:inline">Voir le site</span>
          </Link>

          {/* Notifications (placeholder) */}
          <button className="relative p-2 text-white/40 hover:text-white/60 transition-colors">
            <Bell size={18} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
          </button>
        </div>
      </div>
    </header>
  )
}

export default TopHeader
