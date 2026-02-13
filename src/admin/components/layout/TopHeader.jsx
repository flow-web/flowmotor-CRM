import { Search, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useUI } from '../../context/UIContext'

function TopHeader({ title, subtitle }) {
  const { filters, updateFilters } = useUI()

  return (
    <header className="sticky top-0 z-30 border-b border-white/[0.06]" style={{ background: 'linear-gradient(180deg, rgba(15,8,8,0.98) 0%, rgba(26,15,15,0.95) 100%)', backdropFilter: 'blur(20px)' }}>
      <div className="flex items-center justify-between h-16 px-6 max-w-[1600px] mx-auto">
        {/* Left - Title */}
        <div className="flex items-center gap-4">
          <div>
            <h1 className="font-display text-lg font-semibold text-white tracking-wide">{title}</h1>
            {subtitle && (
              <p className="text-[11px] text-[#D4AF37]/50 font-medium tracking-wider uppercase">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Center - Search */}
        <div className="hidden md:flex items-center flex-1 max-w-lg mx-8">
          <div className="relative w-full">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20" />
            <input
              type="text"
              placeholder="Rechercher un vehicule..."
              value={filters.search}
              onChange={(e) => updateFilters({ search: e.target.value })}
              className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#D4AF37]/30 focus:ring-1 focus:ring-[#D4AF37]/10 transition-all duration-300"
            />
          </div>
        </div>

        {/* Right - Actions */}
        <div className="flex items-center gap-4">
          {/* View Site */}
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] text-white/30 hover:text-[#D4AF37]/70 hover:bg-white/[0.03] transition-all duration-300 uppercase tracking-wider font-medium"
          >
            <ExternalLink size={13} />
            <span className="hidden sm:inline">Site</span>
          </Link>
        </div>
      </div>
    </header>
  )
}

export default TopHeader
