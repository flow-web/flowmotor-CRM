import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import {
  Search, Car, ArrowRight, Heart, Grid3x3, List, SlidersHorizontal,
  X, ChevronDown, Zap, Filter, RotateCcw, MapPin, Eye,
  Fuel, Calendar, Gauge, Droplets, Cog, Leaf, Battery, Flame
} from 'lucide-react'
import SEO from '../../components/SEO'

const ITEMS_PER_PAGE = 12
const FAVORITES_KEY = 'flowmotor-favorites'

const BUDGET_RANGES = [
  { label: '< 20k', max: 20000 },
  { label: '20 - 30k', min: 20000, max: 30000 },
  { label: '30 - 50k', min: 30000, max: 50000 },
  { label: '50 - 75k', min: 50000, max: 75000 },
  { label: '75 - 100k', min: 75000, max: 100000 },
  { label: '100k+', min: 100000 },
]

const KM_RANGES = [
  { label: '< 10k', max: 10000 },
  { label: '10 - 50k', min: 10000, max: 50000 },
  { label: '50 - 100k', min: 50000, max: 100000 },
  { label: '100k+', min: 100000 },
]

const COLOR_OPTIONS = [
  { name: 'Noir', hex: '#1a1a1a' },
  { name: 'Blanc', hex: '#f5f5f5' },
  { name: 'Gris', hex: '#808080' },
  { name: 'Rouge', hex: '#c0392b' },
  { name: 'Bleu', hex: '#2471a3' },
  { name: 'Vert', hex: '#27ae60' },
  { name: 'Marron', hex: '#6e3b1e' },
  { name: 'Or', hex: '#C4A484' },
]

const TRANSMISSION_OPTIONS = [
  { value: 'automatic', label: 'Automatique', icon: Cog },
  { value: 'manual', label: 'Manuelle', icon: Cog },
]

const FUEL_OPTIONS = [
  { value: 'essence', label: 'Essence', icon: Fuel },
  { value: 'diesel', label: 'Diesel', icon: Droplets },
  { value: 'hybride', label: 'Hybride', icon: Leaf },
  { value: 'electrique', label: 'Electrique', icon: Battery },
]

const SORT_OPTIONS = [
  { value: 'recent', label: 'Plus recents' },
  { value: 'price_asc', label: 'Prix croissant' },
  { value: 'price_desc', label: 'Prix decroissant' },
  { value: 'km_asc', label: 'Km croissant' },
  { value: 'year_desc', label: 'Annee recente' },
]

function getFavoritesFromStorage() {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY)
    if (!raw) return new Set()
    const parsed = JSON.parse(raw)
    return new Set(Array.isArray(parsed) ? parsed : [])
  } catch {
    return new Set()
  }
}

function saveFavoritesToStorage(favSet) {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favSet]))
  } catch {
    // Silently fail
  }
}

const formatPrice = (price) => {
  if (!price) return 'Sur demande'
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(price)
}

const formatKm = (km) => {
  if (!km) return 'N/C'
  return new Intl.NumberFormat('fr-FR').format(km) + ' km'
}

export default function Showroom() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const [vehicles, setVehicles] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const [selectedBrand, setSelectedBrand] = useState('')
  const [budgetRange, setBudgetRange] = useState(null)
  const [kmRange, setKmRange] = useState(null)
  const [selectedColors, setSelectedColors] = useState([])
  const [selectedTransmission, setSelectedTransmission] = useState('')
  const [selectedFuel, setSelectedFuel] = useState('')

  const [sortBy, setSortBy] = useState('recent')
  const [viewMode, setViewMode] = useState('grid')
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE)
  const [favorites, setFavorites] = useState(getFavoritesFromStorage)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)

  const [brandSearch, setBrandSearch] = useState('')
  const [brandDropdownOpen, setBrandDropdownOpen] = useState(false)
  const brandInputRef = useRef(null)
  const brandDropdownRef = useRef(null)
  const sortRef = useRef(null)

  useEffect(() => {
    const parent = document.querySelector('[data-theme="flowmotor"]')
    if (parent) {
      parent.style.backgroundColor = '#1A0F0F'
      parent.style.color = '#F4E8D8'
    }
    return () => {
      if (parent) {
        parent.style.backgroundColor = ''
        parent.style.color = ''
      }
    }
  }, [])

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const { data, error } = await supabase
          .from('vehicles')
          .select('id, brand, model, trim, year, mileage, color, status, selling_price, images, import_country')
          .in('status', ['STOCK', 'SOURCING'])
          .order('created_at', { ascending: false })

        if (error) throw error
        setVehicles(data || [])
      } catch (error) {
        console.error('Erreur chargement showroom:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchVehicles()
  }, [])

  useEffect(() => {
    const brand = searchParams.get('brand')
    const budgetMax = searchParams.get('budgetMax')
    const yearMin = searchParams.get('yearMin')

    if (brand) setSelectedBrand(brand)
    if (budgetMax) {
      const maxVal = parseInt(budgetMax)
      const match = BUDGET_RANGES.find(r => {
        if (r.max && !r.min) return maxVal <= r.max
        if (r.min && r.max) return maxVal >= r.min && maxVal <= r.max
        if (r.min && !r.max) return maxVal >= r.min
        return false
      })
      if (match) setBudgetRange(match)
    }
  }, [searchParams])

  const uniqueBrands = useMemo(() => {
    return [...new Set(vehicles.map(v => v.brand).filter(Boolean))].sort()
  }, [vehicles])

  const filteredBrands = useMemo(() => {
    if (!brandSearch) return uniqueBrands
    return uniqueBrands.filter(b => b.toLowerCase().includes(brandSearch.toLowerCase()))
  }, [uniqueBrands, brandSearch])

  useEffect(() => {
    const handler = (e) => {
      if (
        brandDropdownRef.current &&
        !brandDropdownRef.current.contains(e.target) &&
        brandInputRef.current &&
        !brandInputRef.current.contains(e.target)
      ) {
        setBrandDropdownOpen(false)
      }
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setSortOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  const filteredVehicles = useMemo(() => {
    let result = vehicles.filter(v => {
      if (selectedBrand && v.brand !== selectedBrand) return false

      if (budgetRange) {
        const price = v.selling_price || 0
        if (budgetRange.min && price < budgetRange.min) return false
        if (budgetRange.max && price > budgetRange.max) return false
      }

      if (kmRange) {
        const km = v.mileage || 0
        if (kmRange.min && km < kmRange.min) return false
        if (kmRange.max && km > kmRange.max) return false
      }

      // selectedColors: filtrage desactive tant que la colonne DB n'existe pas

      if (selectedTransmission && v.transmission) {
        const vTrans = v.transmission.toLowerCase()
        if (selectedTransmission === 'automatic' && !vTrans.includes('auto')) return false
        if (selectedTransmission === 'manual' && !vTrans.includes('manu')) return false
      }

      if (selectedFuel && v.fuel) {
        const vFuel = v.fuel.toLowerCase()
        if (!vFuel.includes(selectedFuel)) return false
      }

      return true
    })

    switch (sortBy) {
      case 'price_asc':
        result.sort((a, b) => (a.selling_price || 0) - (b.selling_price || 0))
        break
      case 'price_desc':
        result.sort((a, b) => (b.selling_price || 0) - (a.selling_price || 0))
        break
      case 'km_asc':
        result.sort((a, b) => (a.mileage || 0) - (b.mileage || 0))
        break
      case 'year_desc':
        result.sort((a, b) => (b.year || 0) - (a.year || 0))
        break
      default:
        break
    }

    return result
  }, [vehicles, selectedBrand, budgetRange, kmRange, selectedColors, selectedTransmission, selectedFuel, sortBy])

  const visibleVehicles = filteredVehicles.slice(0, visibleCount)
  const hasMore = visibleCount < filteredVehicles.length

  const hasActiveFilters = selectedBrand || budgetRange || kmRange || selectedColors.length > 0 || selectedTransmission || selectedFuel
  const activeFilterCount = [selectedBrand, budgetRange, kmRange, selectedColors.length > 0, selectedTransmission, selectedFuel].filter(Boolean).length

  const resetFilters = useCallback(() => {
    setSelectedBrand('')
    setBudgetRange(null)
    setKmRange(null)
    setSelectedColors([])
    setSelectedTransmission('')
    setSelectedFuel('')
    setBrandSearch('')
    setSortBy('recent')
    setVisibleCount(ITEMS_PER_PAGE)
  }, [])

  const toggleFavorite = useCallback((e, id) => {
    e.preventDefault()
    e.stopPropagation()
    setFavorites(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      saveFavoritesToStorage(next)
      return next
    })
  }, [])

  const selectBrand = useCallback((brand) => {
    setSelectedBrand(brand)
    setBrandSearch('')
    setBrandDropdownOpen(false)
    setVisibleCount(ITEMS_PER_PAGE)
  }, [])

  const clearBrand = useCallback(() => {
    setSelectedBrand('')
    setBrandSearch('')
    setVisibleCount(ITEMS_PER_PAGE)
  }, [])

  const toggleColor = useCallback((colorName) => {
    setSelectedColors(prev =>
      prev.includes(colorName) ? prev.filter(c => c !== colorName) : [...prev, colorName]
    )
    setVisibleCount(ITEMS_PER_PAGE)
  }, [])

  const FilterPanel = ({ onClose }) => (
    <div className="flex flex-col h-full">
      {onClose && (
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <Filter size={18} className="text-[#C4A484]" />
            <span className="font-display text-lg text-[#F4E8D8]">Filtres</span>
            {activeFilterCount > 0 && (
              <span className="flex items-center justify-center min-w-[22px] h-[22px] px-1 rounded-full bg-[#C4A484] text-[#1A0F0F] text-[11px] font-bold">
                {activeFilterCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#F4E8D8]/40 hover:text-[#F4E8D8] hover:bg-white/5 transition-all duration-300"
            aria-label="Fermer les filtres"
          >
            <X size={20} />
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-5">

        <div>
          <label className="text-[11px] uppercase tracking-[0.2em] text-[#F4E8D8]/35 font-medium mb-3 block">
            Marque
          </label>

          {selectedBrand ? (
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#C4A484]/15 border border-[#C4A484]/25 text-[#C4A484] text-sm font-medium">
              {selectedBrand}
              <button
                onClick={clearBrand}
                className="p-0.5 rounded hover:bg-[#C4A484]/20 transition-colors"
                aria-label="Supprimer le filtre marque"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#F4E8D8]/25 pointer-events-none" />
              <input
                ref={brandInputRef}
                type="text"
                placeholder="Rechercher..."
                value={brandSearch}
                onChange={(e) => {
                  setBrandSearch(e.target.value)
                  setBrandDropdownOpen(true)
                }}
                onFocus={() => setBrandDropdownOpen(true)}
                className="input-showroom pl-9 text-sm"
              />
              {brandDropdownOpen && filteredBrands.length > 0 && (
                <div
                  ref={brandDropdownRef}
                  className="absolute left-0 right-0 top-full mt-1 max-h-48 overflow-y-auto rounded-lg bg-[#2A1515] border border-white/10 shadow-xl shadow-black/40 z-20"
                >
                  {filteredBrands.map(brand => (
                    <button
                      key={brand}
                      onClick={() => selectBrand(brand)}
                      className="w-full text-left px-4 py-2.5 text-sm text-[#F4E8D8]/70 hover:bg-[#C4A484]/10 hover:text-[#C4A484] transition-colors"
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div>
          <label className="text-[11px] uppercase tracking-[0.2em] text-[#F4E8D8]/35 font-medium mb-3 block">
            Budget
          </label>
          <div className="flex flex-wrap gap-2">
            {BUDGET_RANGES.map((range) => {
              const isActive = budgetRange === range
              return (
                <button
                  key={range.label}
                  onClick={() => {
                    setBudgetRange(isActive ? null : range)
                    setVisibleCount(ITEMS_PER_PAGE)
                  }}
                  className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-all duration-300
                    ${isActive
                      ? 'bg-[#C4A484] text-[#1A0F0F] shadow-lg shadow-[#C4A484]/20'
                      : 'bg-white/[0.04] text-[#F4E8D8]/50 border border-white/[0.06] hover:border-[#C4A484]/25 hover:text-[#C4A484]'
                    }`}
                >
                  {range.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* ── KM Chips ── */}
        <div>
          <label className="text-[11px] uppercase tracking-[0.2em] text-[#F4E8D8]/35 font-medium mb-3 block">
            Kilometrage
          </label>
          <div className="flex flex-wrap gap-2">
            {KM_RANGES.map((range) => {
              const isActive = kmRange === range
              return (
                <button
                  key={range.label}
                  onClick={() => {
                    setKmRange(isActive ? null : range)
                    setVisibleCount(ITEMS_PER_PAGE)
                  }}
                  className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-all duration-300
                    ${isActive
                      ? 'bg-[#C4A484] text-[#1A0F0F] shadow-lg shadow-[#C4A484]/20'
                      : 'bg-white/[0.04] text-[#F4E8D8]/50 border border-white/[0.06] hover:border-[#C4A484]/25 hover:text-[#C4A484]'
                    }`}
                >
                  {range.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Color Dots ── */}
        <div>
          <label className="text-[11px] uppercase tracking-[0.2em] text-[#F4E8D8]/35 font-medium mb-3 block">
            Couleur
          </label>
          <div className="flex flex-wrap gap-3">
            {COLOR_OPTIONS.map((color) => {
              const isActive = selectedColors.includes(color.name)
              return (
                <button
                  key={color.name}
                  onClick={() => toggleColor(color.name)}
                  className={`relative w-9 h-9 rounded-full transition-all duration-300 group/color
                    ${isActive
                      ? 'ring-2 ring-[#C4A484] ring-offset-2 ring-offset-[#1A0F0F] scale-110'
                      : 'hover:scale-110'
                    }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                  aria-label={`Couleur ${color.name}${isActive ? ' (selectionne)' : ''}`}
                >
                  {/* Inner border for light colors */}
                  {(color.name === 'Blanc' || color.name === 'Or') && (
                    <span className="absolute inset-0 rounded-full border border-white/20" />
                  )}
                  {isActive && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className={`w-3 h-3 rounded-full ${color.name === 'Noir' || color.name === 'Bleu' || color.name === 'Vert' || color.name === 'Marron' ? 'bg-white' : 'bg-[#1A0F0F]'}`} />
                    </span>
                  )}
                </button>
              )
            })}
          </div>
          <p className="text-[10px] text-[#F4E8D8]/20 mt-2 italic">Bientot disponible</p>
        </div>

        {/* ── Transmission Toggle ── */}
        <div>
          <label className="text-[11px] uppercase tracking-[0.2em] text-[#F4E8D8]/35 font-medium mb-3 block">
            Boite de vitesses
          </label>
          <div className="flex gap-2">
            {TRANSMISSION_OPTIONS.map(opt => {
              const isActive = selectedTransmission === opt.value
              return (
                <button
                  key={opt.value}
                  onClick={() => {
                    setSelectedTransmission(isActive ? '' : opt.value)
                    setVisibleCount(ITEMS_PER_PAGE)
                  }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium transition-all duration-300 flex-1 justify-center
                    ${isActive
                      ? 'bg-[#C4A484] text-[#1A0F0F] shadow-lg shadow-[#C4A484]/20'
                      : 'bg-white/[0.04] text-[#F4E8D8]/50 border border-white/[0.06] hover:border-[#C4A484]/25 hover:text-[#C4A484]'
                    }`}
                >
                  <opt.icon size={14} />
                  {opt.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Fuel Chips ── */}
        <div>
          <label className="text-[11px] uppercase tracking-[0.2em] text-[#F4E8D8]/35 font-medium mb-3 block">
            Energie
          </label>
          <div className="flex flex-wrap gap-2">
            {FUEL_OPTIONS.map(opt => {
              const isActive = selectedFuel === opt.value
              return (
                <button
                  key={opt.value}
                  onClick={() => {
                    setSelectedFuel(isActive ? '' : opt.value)
                    setVisibleCount(ITEMS_PER_PAGE)
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-all duration-300
                    ${isActive
                      ? 'bg-[#C4A484] text-[#1A0F0F] shadow-lg shadow-[#C4A484]/20'
                      : 'bg-white/[0.04] text-[#F4E8D8]/50 border border-white/[0.06] hover:border-[#C4A484]/25 hover:text-[#C4A484]'
                    }`}
                >
                  <opt.icon size={13} />
                  {opt.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Reset Button ── */}
      <div className="p-5 border-t border-white/5">
        <button
          onClick={() => {
            resetFilters()
            if (onClose) onClose()
          }}
          disabled={!hasActiveFilters}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all duration-300
            ${hasActiveFilters
              ? 'text-[#C4A484] border border-[#C4A484]/25 hover:bg-[#C4A484]/10'
              : 'text-[#F4E8D8]/20 border border-white/5 cursor-not-allowed'
            }`}
        >
          <RotateCcw size={14} />
          Reinitialiser les filtres
        </button>
      </div>
    </div>
  )

  // ═══════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════
  return (
    <main className="bg-[#1A0F0F] min-h-screen -mt-20 pt-20">
      <SEO
        title="Showroom"
        description="Decouvrez notre stock de vehicules sportifs et de collection disponibles a Lyon. Import Suisse, Japon, Allemagne."
        url="/showroom"
      />

      {/* ═══════ Hero Section ═══════ */}
      <section className="relative overflow-hidden py-8 md:py-10">
        {/* Ambient gradient circles */}
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-[#C4A484]/[0.04] blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-[#5C3A2E]/[0.12] blur-[80px] pointer-events-none" />

        <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[11px] uppercase tracking-[0.45em] text-[#C4A484]/70 mb-4 font-medium">
            Collection d'exception
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-semibold text-[#F4E8D8] leading-[1.15]">
            L'Excellence{' '}
            <span className="text-[#C4A484]">Automobile</span>
          </h1>
          <p className="mt-4 max-w-xl mx-auto text-[#F4E8D8]/40 text-sm sm:text-base leading-relaxed">
            Vehicules premium importes, expertises et prepares par notre atelier.
            Chaque modele est selectionne avec exigence.
          </p>
        </div>
      </section>

      {/* ═══════ Main Content: Sidebar + Grid ═══════ */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="flex gap-5">

          {/* ─── Desktop Sidebar ─── */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24 glass-panel overflow-hidden" style={{ maxHeight: 'calc(100vh - 7rem)' }}>
              <FilterPanel onClose={null} />
            </div>
          </aside>

          {/* ─── Main Area ─── */}
          <div className="flex-1 min-w-0">

            {/* ── Toolbar ── */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              {/* Left: Filter button (mobile) + Count */}
              <div className="flex items-center gap-3">
                {/* Mobile filter trigger */}
                <button
                  onClick={() => setDrawerOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[#F4E8D8]/60 hover:text-[#C4A484] hover:border-[#C4A484]/25 transition-all duration-300 text-sm font-medium"
                >
                  <SlidersHorizontal size={16} />
                  Filtres
                  {activeFilterCount > 0 && (
                    <span className="flex items-center justify-center min-w-[20px] h-[20px] px-1 rounded-full bg-[#C4A484] text-[#1A0F0F] text-[10px] font-bold">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                {/* Vehicle count */}
                <span className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#C4A484]/[0.08] text-[#C4A484] text-sm font-medium border border-[#C4A484]/[0.12]">
                  <Car size={15} />
                  <span className="tabular-nums">{filteredVehicles.length}</span>
                  {' '}vehicule{filteredVehicles.length !== 1 ? 's' : ''}
                  {hasActiveFilters && (
                    <span className="text-[#C4A484]/50 text-xs ml-1">(filtre)</span>
                  )}
                </span>
              </div>

              {/* Right: Sort + View toggle */}
              <div className="flex items-center gap-2">
                {/* View toggle */}
                <div className="flex items-center bg-white/[0.03] rounded-lg p-1 border border-white/5">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-all duration-300 ${
                      viewMode === 'grid'
                        ? 'bg-[#C4A484]/15 text-[#C4A484]'
                        : 'text-[#F4E8D8]/30 hover:text-[#F4E8D8]/60'
                    }`}
                    title="Vue grille"
                    aria-label="Vue grille"
                  >
                    <Grid3x3 size={17} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-all duration-300 ${
                      viewMode === 'list'
                        ? 'bg-[#C4A484]/15 text-[#C4A484]'
                        : 'text-[#F4E8D8]/30 hover:text-[#F4E8D8]/60'
                    }`}
                    title="Vue liste"
                    aria-label="Vue liste"
                  >
                    <List size={17} />
                  </button>
                </div>

                {/* Sort dropdown (custom, not native select) */}
                <div className="relative" ref={sortRef}>
                  <button
                    onClick={() => setSortOpen(!sortOpen)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[#F4E8D8]/60 hover:text-[#C4A484] hover:border-[#C4A484]/25 transition-all duration-300 text-sm"
                  >
                    {SORT_OPTIONS.find(o => o.value === sortBy)?.label}
                    <ChevronDown size={14} className={`transition-transform duration-300 ${sortOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {sortOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 rounded-lg bg-[#2A1515] border border-white/10 shadow-xl shadow-black/40 z-20 overflow-hidden">
                      {SORT_OPTIONS.map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => { setSortBy(opt.value); setSortOpen(false) }}
                          className={`w-full text-left px-4 py-2.5 text-sm transition-colors
                            ${sortBy === opt.value
                              ? 'bg-[#C4A484]/10 text-[#C4A484]'
                              : 'text-[#F4E8D8]/60 hover:bg-white/[0.04] hover:text-[#F4E8D8]'
                            }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── Active Filters Pills (desktop summary) ── */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {selectedBrand && (
                  <FilterPill label={selectedBrand} onRemove={clearBrand} />
                )}
                {budgetRange && (
                  <FilterPill label={`Budget: ${budgetRange.label}`} onRemove={() => setBudgetRange(null)} />
                )}
                {kmRange && (
                  <FilterPill label={`Km: ${kmRange.label}`} onRemove={() => setKmRange(null)} />
                )}
                {selectedTransmission && (
                  <FilterPill
                    label={TRANSMISSION_OPTIONS.find(o => o.value === selectedTransmission)?.label}
                    onRemove={() => setSelectedTransmission('')}
                  />
                )}
                {selectedFuel && (
                  <FilterPill
                    label={FUEL_OPTIONS.find(o => o.value === selectedFuel)?.label}
                    onRemove={() => setSelectedFuel('')}
                  />
                )}
                {selectedColors.map(c => (
                  <FilterPill key={c} label={c} onRemove={() => toggleColor(c)} />
                ))}
                <button
                  onClick={resetFilters}
                  className="text-xs text-[#F4E8D8]/30 hover:text-[#C4A484] transition-colors ml-1"
                >
                  Tout effacer
                </button>
              </div>
            )}

            {/* ── Vehicle Grid / List ── */}
            {isLoading ? (
              <SkeletonGrid viewMode={viewMode} />
            ) : filteredVehicles.length > 0 ? (
              <>
                {viewMode === 'grid' ? (
                  <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                    {visibleVehicles.map((vehicle, i) => (
                      <ShowroomCard
                        key={vehicle.id}
                        vehicle={vehicle}
                        isFavorite={favorites.has(vehicle.id)}
                        onToggleFavorite={toggleFavorite}
                        index={i}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {visibleVehicles.map((vehicle, i) => (
                      <ShowroomListCard
                        key={vehicle.id}
                        vehicle={vehicle}
                        isFavorite={favorites.has(vehicle.id)}
                        onToggleFavorite={toggleFavorite}
                        index={i}
                      />
                    ))}
                  </div>
                )}

                {/* Load more */}
                {hasMore && (
                  <div className="mt-8 text-center">
                    <button
                      onClick={() => setVisibleCount(prev => prev + ITEMS_PER_PAGE)}
                      className="inline-flex items-center gap-2 px-8 py-3.5 border border-[#C4A484]/25 text-[#C4A484] rounded-xl hover:bg-[#C4A484]/10 hover:border-[#C4A484]/40 transition-all duration-300 text-sm font-medium"
                    >
                      Voir plus de vehicules
                      <ChevronDown size={16} />
                    </button>
                    <p className="text-[11px] text-[#F4E8D8]/25 mt-3 tabular-nums">
                      {visibleCount} sur {filteredVehicles.length}
                    </p>
                  </div>
                )}
              </>
            ) : (
              /* ═══════ Empty State: Chasseur Auto ═══════ */
              <div className="glass-panel p-8 sm:p-10 text-center max-w-lg mx-auto">
                <div className="mx-auto mb-4 flex items-center justify-center w-20 h-20 rounded-2xl bg-[#C4A484]/[0.06] border border-[#C4A484]/10">
                  <Search size={32} className="text-[#C4A484]/40" />
                </div>
                <h3 className="font-display text-xl sm:text-2xl text-[#F4E8D8] mb-2">
                  Aucun vehicule ne correspond
                </h3>
                <p className="text-sm text-[#F4E8D8]/40 mb-5 leading-relaxed max-w-sm mx-auto">
                  Notre service <span className="text-[#C4A484]">Chasseur Auto</span> peut trouver votre perle rare partout en Europe.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    to="/contact?subject=recherche"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#C4A484] text-[#1A0F0F] rounded-xl text-sm font-semibold hover:bg-[#d4b494] transition-all duration-300 shadow-lg shadow-[#C4A484]/15"
                  >
                    <Search size={15} />
                    Lancer une recherche personnalisee
                  </Link>
                  <button
                    onClick={resetFilters}
                    className="inline-flex items-center gap-2 px-5 py-3 border border-white/10 text-[#F4E8D8]/50 rounded-xl text-sm font-medium hover:text-[#F4E8D8] hover:border-white/20 transition-all duration-300"
                  >
                    <RotateCcw size={14} />
                    Reinitialiser les filtres
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Sourcing CTA Banner ── */}
        <section className="mt-10">
          <Link
            to="/contact"
            className="block relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#5C3A2E]/60 to-[#3D1E1E]/40 p-5 md:p-8 group border border-white/5 hover:border-[#C4A484]/20 transition-all duration-500"
          >
            <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-[#C4A484]/[0.06] blur-[60px] group-hover:bg-[#C4A484]/[0.12] transition-all duration-700" />
            <div className="absolute -left-16 -bottom-16 w-48 h-48 rounded-full bg-[#5C3A2E]/20 blur-[50px]" />

            <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-5">
              <div>
                <p className="text-[11px] uppercase tracking-[0.35em] text-[#C4A484]/70 mb-2 font-medium">
                  Vous cherchez un modele precis ?
                </p>
                <h2 className="text-xl md:text-2xl font-display text-[#F4E8D8] font-semibold">
                  Sourcing sur-mesure dans toute l'Europe
                </h2>
                <p className="text-sm text-[#F4E8D8]/35 mt-2 max-w-lg">
                  Notre reseau nous permet de trouver et importer le vehicule exact que vous recherchez.
                </p>
              </div>
              <div className="flex-shrink-0">
                <span className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-[#C4A484] text-[#1A0F0F] text-sm font-semibold rounded-xl group-hover:bg-[#d4b494] transition-all duration-300 shadow-lg shadow-[#C4A484]/10">
                  Nous contacter
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </div>
            </div>
          </Link>
        </section>
      </div>

      {/* ═══════ Mobile Drawer Overlay ═══════ */}
      <div
        className={`fixed inset-0 z-[60] lg:hidden transition-opacity duration-300 ${
          drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setDrawerOpen(false)}
        />

        {/* Drawer panel */}
        <div
          className={`absolute left-0 top-0 h-full w-[320px] max-w-[85vw] bg-[#1A0F0F] border-r border-white/5 shadow-2xl shadow-black/50 transition-transform duration-400 ease-out
            ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <FilterPanel onClose={() => setDrawerOpen(false)} />
        </div>
      </div>

      {/* ═══════ Custom Animations ═══════ */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-fade-up {
          animation: fadeUp 0.4s ease-out both;
        }
        .skeleton-shimmer {
          background: linear-gradient(
            90deg,
            rgba(255,255,255,0.03) 25%,
            rgba(196,164,132,0.06) 50%,
            rgba(255,255,255,0.03) 75%
          );
          background-size: 200% 100%;
          animation: shimmer 2s ease-in-out infinite;
        }
      `}</style>
    </main>
  )
}

// ═══════════════════════════════════════════════════════════
// FILTER PILL
// ═══════════════════════════════════════════════════════════
function FilterPill({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C4A484]/10 border border-[#C4A484]/20 text-[#C4A484] text-xs font-medium">
      {label}
      <button
        onClick={onRemove}
        className="p-0.5 rounded hover:bg-[#C4A484]/20 transition-colors"
        aria-label={`Supprimer ${label}`}
      >
        <X size={12} />
      </button>
    </span>
  )
}

// ═══════════════════════════════════════════════════════════
// SKELETON LOADING
// ═══════════════════════════════════════════════════════════
function SkeletonGrid({ viewMode }) {
  if (viewMode === 'list') {
    return (
      <div className="flex flex-col gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card-showroom overflow-hidden flex flex-col sm:flex-row">
            <div className="w-full sm:w-64 md:w-72 aspect-[16/10] sm:aspect-auto sm:min-h-[160px] skeleton-shimmer" />
            <div className="flex-1 p-5 space-y-3">
              <div className="h-5 w-2/3 rounded skeleton-shimmer" />
              <div className="h-4 w-1/3 rounded skeleton-shimmer" />
              <div className="flex gap-4 mt-4">
                <div className="h-4 w-20 rounded skeleton-shimmer" />
                <div className="h-4 w-20 rounded skeleton-shimmer" />
                <div className="h-4 w-20 rounded skeleton-shimmer" />
              </div>
              <div className="h-6 w-24 rounded skeleton-shimmer mt-4" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="card-showroom overflow-hidden">
          <div className="aspect-[16/10] skeleton-shimmer" />
          <div className="p-5 space-y-3">
            <div className="h-5 w-3/4 rounded skeleton-shimmer" />
            <div className="h-4 w-1/2 rounded skeleton-shimmer" />
            <div className="grid grid-cols-2 gap-2 mt-3">
              <div className="h-4 rounded skeleton-shimmer" />
              <div className="h-4 rounded skeleton-shimmer" />
              <div className="h-4 rounded skeleton-shimmer" />
              <div className="h-4 rounded skeleton-shimmer" />
            </div>
            <div className="h-7 w-1/3 rounded skeleton-shimmer mt-4" />
          </div>
        </div>
      ))}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// GRID CARD
// ═══════════════════════════════════════════════════════════
function ShowroomCard({ vehicle, isFavorite, onToggleFavorite, index }) {
  const primaryImage = vehicle.images?.find(img => img.isPrimary)?.url || vehicle.images?.[0]?.url || null

  const isStock = vehicle.status === 'STOCK'
  const statusLabel = isStock ? 'En Stock' : 'En Arrivage'
  const statusClasses = isStock
    ? 'bg-emerald-500/90 text-white'
    : 'bg-amber-500/90 text-white'

  const availability = isStock ? 'Immediate' : 'En transit'

  return (
    <Link
      to={`/vehicule/${vehicle.id}`}
      className="card-showroom group overflow-hidden flex flex-col animate-fade-up"
      style={{ animationDelay: `${Math.min(index, 8) * 50}ms` }}
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[#2A1515]">
        {primaryImage ? (
          <img
            src={primaryImage}
            alt={`${vehicle.brand} ${vehicle.model}`}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-br from-[#2A1515] to-[#1A0F0F]">
            <img
              src="/assets/logo-cream.svg"
              alt="Flow Motor"
              className="h-14 w-auto opacity-15"
            />
            <span className="mt-2 text-[10px] uppercase tracking-[0.2em] text-white/15">Photo à venir</span>
          </div>
        )}

        {/* Bottom gradient */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Status badge */}
        <div className="absolute left-3 top-3">
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide ${statusClasses}`}>
            {statusLabel}
          </span>
        </div>

        {/* Favorite button */}
        <button
          onClick={(e) => onToggleFavorite(e, vehicle.id)}
          className={`absolute right-3 top-3 p-2.5 rounded-full transition-all duration-300 ${
            isFavorite
              ? 'bg-red-500/90 text-white scale-100'
              : 'bg-black/40 text-white/50 opacity-0 group-hover:opacity-100 hover:bg-black/60 hover:text-white'
          }`}
          aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        >
          <Heart size={15} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        {/* Title row */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-[15px] font-semibold text-[#F4E8D8] font-display group-hover:text-[#C4A484] transition-colors duration-300 line-clamp-1">
            {vehicle.brand} {vehicle.model}
          </h3>
          {vehicle.year && (
            <span className="flex-shrink-0 px-2 py-0.5 rounded-md bg-white/[0.04] text-[#F4E8D8]/50 text-xs font-medium tabular-nums">
              {vehicle.year}
            </span>
          )}
        </div>

        {vehicle.trim && (
          <p className="text-[11px] text-[#F4E8D8]/30 mb-3 line-clamp-1">{vehicle.trim}</p>
        )}

        {/* Specs 2x2 */}
        <div className="grid grid-cols-2 gap-x-3 gap-y-2 mt-auto mb-4 text-[11px] text-[#F4E8D8]/45">
          <span className="flex items-center gap-1.5">
            <Gauge size={12} className="text-[#C4A484]/50" />
            {formatKm(vehicle.mileage)}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin size={12} className="text-[#C4A484]/50" />
            {vehicle.import_country || 'N/C'}
          </span>
          <span className="flex items-center gap-1.5">
            <Fuel size={12} className="text-[#C4A484]/50" />
            {vehicle.fuel || 'N/C'}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar size={12} className="text-[#C4A484]/50" />
            {availability}
          </span>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          <span className="text-lg font-display font-semibold text-[#C4A484] tabular-nums">
            {formatPrice(vehicle.selling_price)}
          </span>
          <span className="flex items-center gap-1.5 text-[11px] text-[#C4A484]/60 group-hover:text-[#C4A484] transition-colors duration-300">
            <Eye size={13} />
            <span className="hidden sm:inline">Voir</span>
            <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform duration-300" />
          </span>
        </div>
      </div>
    </Link>
  )
}

// ═══════════════════════════════════════════════════════════
// LIST CARD
// ═══════════════════════════════════════════════════════════
function ShowroomListCard({ vehicle, isFavorite, onToggleFavorite, index }) {
  const primaryImage = vehicle.images?.find(img => img.isPrimary)?.url || vehicle.images?.[0]?.url || null

  const isStock = vehicle.status === 'STOCK'
  const statusLabel = isStock ? 'En Stock' : 'En Arrivage'
  const statusClasses = isStock
    ? 'bg-emerald-500/90 text-white'
    : 'bg-amber-500/90 text-white'

  const availability = isStock ? 'Immediate' : 'En transit'

  return (
    <Link
      to={`/vehicule/${vehicle.id}`}
      className="card-showroom group overflow-hidden flex flex-col sm:flex-row animate-fade-up"
      style={{ animationDelay: `${Math.min(index, 8) * 50}ms` }}
    >
      {/* Image */}
      <div className="relative w-full sm:w-60 md:w-72 flex-shrink-0 aspect-[16/10] sm:aspect-auto sm:min-h-[160px] overflow-hidden bg-[#2A1515]">
        {primaryImage ? (
          <img
            src={primaryImage}
            alt={`${vehicle.brand} ${vehicle.model}`}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full flex flex-col items-center justify-center min-h-[140px] bg-gradient-to-br from-[#2A1515] to-[#1A0F0F]">
            <img src="/assets/logo-cream.svg" alt="Flow Motor" className="h-12 w-auto opacity-15" />
            <span className="mt-1.5 text-[9px] uppercase tracking-[0.2em] text-white/15">Photo à venir</span>
          </div>
        )}
        <div className="absolute left-3 top-3">
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide ${statusClasses}`}>
            {statusLabel}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 min-w-0">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="text-base sm:text-lg font-semibold text-[#F4E8D8] font-display group-hover:text-[#C4A484] transition-colors duration-300 truncate">
              {vehicle.brand} {vehicle.model}
            </h3>
            {vehicle.year && (
              <span className="flex-shrink-0 px-2 py-0.5 rounded-md bg-white/[0.04] text-[#F4E8D8]/50 text-xs font-medium tabular-nums">
                {vehicle.year}
              </span>
            )}
          </div>
          {vehicle.trim && (
            <p className="text-[11px] text-[#F4E8D8]/30 mb-3">{vehicle.trim}</p>
          )}
          <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-[11px] text-[#F4E8D8]/45">
            <span className="flex items-center gap-1.5">
              <Gauge size={12} className="text-[#C4A484]/50" />
              {formatKm(vehicle.mileage)}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin size={12} className="text-[#C4A484]/50" />
              {vehicle.import_country || 'N/C'}
            </span>
            <span className="flex items-center gap-1.5">
              <Fuel size={12} className="text-[#C4A484]/50" />
              {vehicle.fuel || 'N/C'}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={12} className="text-[#C4A484]/50" />
              {availability}
            </span>
          </div>
        </div>

        {/* Right: Price + Actions */}
        <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:gap-3 flex-shrink-0">
          <span className="text-xl font-display font-semibold text-[#C4A484] tabular-nums">
            {formatPrice(vehicle.selling_price)}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => onToggleFavorite(e, vehicle.id)}
              className={`p-2.5 rounded-full transition-all duration-300 ${
                isFavorite
                  ? 'bg-red-500/90 text-white'
                  : 'bg-white/[0.04] text-[#F4E8D8]/25 hover:text-red-400 hover:bg-red-400/10'
              }`}
              aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            >
              <Heart size={15} fill={isFavorite ? 'currentColor' : 'none'} />
            </button>
            <span className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#C4A484]/[0.08] text-[#C4A484] text-xs font-medium group-hover:bg-[#C4A484] group-hover:text-[#1A0F0F] transition-all duration-300">
              <Eye size={13} />
              Voir
              <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform duration-300" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
