import { useState, useEffect, useMemo, useCallback } from 'react'
import {
  Search, Car, Fuel, Calendar, Gauge, ArrowRight,
  ChevronRight, ChevronLeft, Zap, Trees, Users, Trophy,
  MapPin, Shield, Truck, Award, Sparkles, X
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import SEO from '../../components/SEO'

/* ═══════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════ */

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

/* ═══════════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════════ */

const BUDGET_OPTIONS = [
  { value: '', label: 'Pas de limite' },
  { value: '20000', label: '20 000 €' },
  { value: '30000', label: '30 000 €' },
  { value: '40000', label: '40 000 €' },
  { value: '50000', label: '50 000 €' },
  { value: '75000', label: '75 000 €' },
  { value: '100000', label: '100 000 €' },
  { value: '150000', label: '150 000 €' },
  { value: '200000', label: '200 000 €' },
]

const YEAR_OPTIONS = [
  { value: '', label: 'Toutes' },
  { value: '2025', label: '2025' },
  { value: '2024', label: '2024' },
  { value: '2023', label: '2023' },
  { value: '2022', label: '2022' },
  { value: '2021', label: '2021' },
  { value: '2020', label: '2020' },
  { value: '2018', label: '2018' },
  { value: '2015', label: '2015' },
  { value: '2010', label: '2010' },
]

const BODY_TYPES = [
  { id: 'suv', label: 'SUV', icon: Truck },
  { id: 'berline', label: 'Berline', icon: Car },
  { id: 'coupe', label: 'Coupé', icon: Sparkles },
  { id: 'cabriolet', label: 'Cabriolet', icon: Zap },
  { id: 'break', label: 'Break', icon: Car },
  { id: 'citadine', label: 'Citadine', icon: MapPin },
  { id: 'utilitaire', label: 'Utilitaire', icon: Truck },
]

const ENERGY_TYPES = [
  { id: 'essence', label: 'Essence', icon: Fuel },
  { id: 'diesel', label: 'Diesel', icon: Fuel },
  { id: 'hybride', label: 'Hybride', icon: Zap },
  { id: 'electrique', label: 'Électrique', icon: Zap },
]

const USAGE_TYPES = [
  { id: 'ville', label: 'Ville', icon: MapPin },
  { id: 'route', label: 'Route', icon: ArrowRight },
  { id: 'famille', label: 'Famille', icon: Users },
  { id: 'sport', label: 'Sport', icon: Trophy },
  { id: 'tous', label: 'Tous usages', icon: Car },
]

/* ═══════════════════════════════════════════════
   WIZARD MODAL
   ═══════════════════════════════════════════════ */

function WizardModal({ isOpen, onClose }) {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [selections, setSelections] = useState({
    bodyType: null,
    energy: null,
    usage: null,
  })

  const totalSteps = 3

  const handleSelect = (key, value) => {
    setSelections((prev) => ({
      ...prev,
      [key]: prev[key] === value ? null : value,
    }))
  }

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1)
  }

  const handlePrev = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = () => {
    const params = new URLSearchParams()
    if (selections.bodyType) params.set('type', selections.bodyType)
    if (selections.energy) params.set('energy', selections.energy)
    if (selections.usage) params.set('usage', selections.usage)
    const query = params.toString()
    navigate(query ? `/showroom?${query}` : '/showroom')
    onClose()
    setStep(1)
    setSelections({ bodyType: null, energy: null, usage: null })
  }

  const handleClose = () => {
    onClose()
    setStep(1)
    setSelections({ bodyType: null, energy: null, usage: null })
  }

  if (!isOpen) return null

  const stepConfig = {
    1: {
      title: 'Quel type de véhicule ?',
      subtitle: 'Sélectionnez la carrosserie qui vous convient',
      items: BODY_TYPES,
      key: 'bodyType',
    },
    2: {
      title: 'Quelle énergie ?',
      subtitle: 'Choisissez votre motorisation',
      items: ENERGY_TYPES,
      key: 'energy',
    },
    3: {
      title: 'Quel usage principal ?',
      subtitle: 'Nous adaptons nos recommandations',
      items: USAGE_TYPES,
      key: 'usage',
    },
  }

  const current = stepConfig[step]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-2xl bg-[#1A0F0F] border border-white/10 rounded-2xl overflow-hidden"
        style={{ animation: 'soft-rise 0.4s ease-out' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#C4A484] mb-1">
              Étape {step} sur {totalSteps}
            </p>
            <h3 className="text-2xl font-display font-semibold text-[#F4E8D8]">
              {current.title}
            </h3>
            <p className="text-sm text-[#F4E8D8]/40 mt-1">{current.subtitle}</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-white/5 text-[#F4E8D8]/40 hover:text-[#F4E8D8] transition-colors"
            aria-label="Fermer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className={`grid gap-3 ${
            current.items.length <= 4
              ? 'grid-cols-2 sm:grid-cols-4'
              : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
          }`}>
            {current.items.map((item) => {
              const Icon = item.icon
              const isSelected = selections[current.key] === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(current.key, item.id)}
                  className={`flex flex-col items-center gap-3 p-5 rounded-xl border transition-all duration-300 ${
                    isSelected
                      ? 'bg-[#C4A484]/15 border-[#C4A484]/50 text-[#C4A484] shadow-lg shadow-[#C4A484]/10'
                      : 'bg-white/[0.03] border-white/10 text-[#F4E8D8]/60 hover:border-white/20 hover:bg-white/5 hover:text-[#F4E8D8]'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300 ${
                    isSelected ? 'bg-[#C4A484]/20' : 'bg-white/5'
                  }`}>
                    <Icon size={22} />
                  </div>
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-white/10">
          {/* Progress dots */}
          <div className="flex items-center gap-2">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i + 1 === step
                    ? 'w-6 bg-[#C4A484]'
                    : i + 1 < step
                    ? 'w-2 bg-[#C4A484]/60'
                    : 'w-2 bg-white/20'
                }`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-3">
            {step > 1 && (
              <button
                onClick={handlePrev}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-[#F4E8D8]/60 hover:text-[#F4E8D8] hover:bg-white/5 transition-colors"
              >
                <ChevronLeft size={16} />
                Précédent
              </button>
            )}
            {step < totalSteps ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-[#C4A484] text-[#1A0F0F] hover:bg-[#D4B494] transition-colors"
              >
                Suivant
                <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-[#C4A484] text-[#1A0F0F] hover:bg-[#D4B494] transition-colors"
              >
                Voir les résultats
                <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   VEHICLE CARD V2
   ═══════════════════════════════════════════════ */

function VehicleCardV2({ vehicle }) {
  const primaryImage =
    vehicle.images?.find((img) => img.isPrimary)?.url ||
    vehicle.images?.[0]?.url ||
    null

  const statusLabel = vehicle.status === 'SOURCING' ? 'En Arrivage' : 'En Stock'
  const statusClasses =
    vehicle.status === 'SOURCING'
      ? 'bg-amber-500/90 text-white'
      : 'bg-emerald-500/90 text-white'

  return (
    <Link
      to={`/vehicule/${vehicle.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/[0.07] hover:border-[#C4A484]/30 hover:shadow-xl hover:shadow-[#C4A484]/10 transition-all duration-500"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#2A1515]">
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
              className="h-16 w-auto opacity-20"
            />
            <span className="mt-2 text-[10px] uppercase tracking-[0.2em] text-white/20">Photo à venir</span>
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" />

        {/* Status badge */}
        <div className="absolute left-3 top-3">
          <span
            className={`px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide ${statusClasses}`}
          >
            {statusLabel}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-display font-semibold text-[#F4E8D8] group-hover:text-[#C4A484] transition-colors line-clamp-1">
          {vehicle.brand} {vehicle.model}
        </h3>
        {vehicle.trim && (
          <p className="text-xs text-[#F4E8D8]/40 mt-0.5 line-clamp-1">
            {vehicle.trim}
          </p>
        )}

        {/* Specs row */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-xs text-[#F4E8D8]/50">
          {vehicle.year && (
            <span className="flex items-center gap-1.5">
              <Calendar size={13} className="text-[#C4A484]/50" />
              {vehicle.year}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Gauge size={13} className="text-[#C4A484]/50" />
            {formatKm(vehicle.mileage)}
          </span>
          {vehicle.import_country && (
            <span className="flex items-center gap-1.5">
              <MapPin size={13} className="text-[#C4A484]/50" />
              {vehicle.import_country}
            </span>
          )}
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
          <span className="text-2xl font-display font-semibold text-[#C4A484]">
            {formatPrice(vehicle.selling_price)}
          </span>
          <span className="flex items-center gap-1 text-xs font-medium text-[#C4A484]/70 group-hover:text-[#C4A484] transition-colors">
            Voir le détail
            <ArrowRight
              size={14}
              className="group-hover:translate-x-1 transition-transform duration-300"
            />
          </span>
        </div>
      </div>
    </Link>
  )
}

/* ═══════════════════════════════════════════════
   HOME PAGE
   ═══════════════════════════════════════════════ */

function Home() {
  const navigate = useNavigate()
  const [vehicles, setVehicles] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [wizardOpen, setWizardOpen] = useState(false)

  // Search module state
  const [selectedBrand, setSelectedBrand] = useState('')
  const [selectedModel, setSelectedModel] = useState('')
  const [selectedBudget, setSelectedBudget] = useState('')
  const [selectedYear, setSelectedYear] = useState('')

  // Fetch all available vehicles
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const { data } = await supabase
          .from('vehicles')
          .select(
            'id, brand, model, trim, year, mileage, color, status, selling_price, images, import_country'
          )
          .in('status', ['STOCK', 'SOURCING'])
          .order('created_at', { ascending: false })
        setVehicles(data || [])
      } catch (err) {
        console.error('Erreur chargement:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchVehicles()
  }, [])

  // Unique brands from live data
  const uniqueBrands = useMemo(() => {
    return [...new Set(vehicles.map((v) => v.brand).filter(Boolean))].sort()
  }, [vehicles])

  // Models filtered by selected brand
  const availableModels = useMemo(() => {
    if (!selectedBrand) return []
    return [
      ...new Set(
        vehicles
          .filter((v) => v.brand === selectedBrand)
          .map((v) => v.model)
          .filter(Boolean)
      ),
    ].sort()
  }, [vehicles, selectedBrand])

  // Reset model when brand changes
  const handleBrandChange = useCallback((value) => {
    setSelectedBrand(value)
    setSelectedModel('')
  }, [])

  // Count matching vehicles (live filtering)
  const matchingCount = useMemo(() => {
    return vehicles.filter((v) => {
      if (selectedBrand && v.brand !== selectedBrand) return false
      if (selectedModel && v.model !== selectedModel) return false
      if (selectedBudget && v.selling_price > parseInt(selectedBudget))
        return false
      if (selectedYear && v.year < parseInt(selectedYear)) return false
      return true
    }).length
  }, [vehicles, selectedBrand, selectedModel, selectedBudget, selectedYear])

  // Featured vehicles (3 latest)
  const featuredVehicles = useMemo(() => {
    return vehicles.slice(0, 6)
  }, [vehicles])

  // Navigate to showroom with filters
  const handleSearch = () => {
    const params = new URLSearchParams()
    if (selectedBrand) params.set('brand', selectedBrand)
    if (selectedModel) params.set('model', selectedModel)
    if (selectedBudget) params.set('budgetMax', selectedBudget)
    if (selectedYear) params.set('yearMin', selectedYear)
    const query = params.toString()
    navigate(query ? `/showroom?${query}` : '/showroom')
  }

  // Schema.org JSON-LD
  const autoDealerJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AutoDealer',
    name: 'FLOW MOTOR',
    description:
      "Spécialiste import et vente de véhicules sportifs et de collection à Lyon.",
    url: 'https://www.flowmotor.fr',
    logo: 'https://www.flowmotor.fr/assets/LOGO_AUBERGINE.png',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '6 Rue du Bon Pasteur',
      addressLocality: 'Lyon',
      postalCode: '69001',
      addressCountry: 'FR',
    },
    telephone: '+33622852622',
    email: 'florian@flowmotor.fr',
    sameAs: [],
  }

  return (
    <main className="bg-[#1A0F0F] -mt-20">
      <SEO
        url="/"
        description="Spécialiste import et vente de véhicules sportifs et de collection. Youngtimers, JDM, allemandes. Stock disponible à Lyon et recherche personnalisée."
        jsonLd={autoDealerJsonLd}
      />

      {/* ══════════════════════════════════════
          HERO SECTION
          ══════════════════════════════════════ */}
      <section className="relative overflow-hidden min-h-[92vh] flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=1920&q=80"
            alt="Véhicule de luxe"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-black/50" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
        </div>

        {/* Ambient glow */}
        <div className="absolute -top-32 right-10 h-80 w-80 rounded-full bg-[#C4A484]/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-[#5C3A2E]/20 blur-[100px] pointer-events-none" />

        {/* Content */}
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div
            className="text-center max-w-4xl mx-auto"
            style={{ animation: 'soft-rise 0.8s ease-out' }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#C4A484]/15 border border-[#C4A484]/30 mb-8">
              <Sparkles size={14} className="text-[#C4A484]" />
              <span className="text-xs uppercase tracking-[0.3em] font-medium text-[#C4A484]">
                Import Suisse & Japon
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold text-white leading-[1.1] text-balance">
              L&apos;excellence automobile,{' '}
              <span className="text-[#C4A484]">sélectionnée</span> pour vous.
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-lg md:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed">
              Véhicules rares, préparation atelier complète et accompagnement sur-mesure
              pour une expérience d&apos;achat premium.
            </p>

            {/* ─── SEARCH MODULE ─── */}
            <div className="mt-12 glass-panel p-5 md:p-8 max-w-4xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Brand */}
                <div className="text-left">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-[#F4E8D8]/30 mb-1.5 block font-medium">
                    Marque
                  </label>
                  <select
                    value={selectedBrand}
                    onChange={(e) => handleBrandChange(e.target.value)}
                    className="select-showroom"
                  >
                    <option value="">Toutes les marques</option>
                    {uniqueBrands.map((brand) => (
                      <option key={brand} value={brand}>
                        {brand}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Model */}
                <div className="text-left">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-[#F4E8D8]/30 mb-1.5 block font-medium">
                    Modèle
                  </label>
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    disabled={!selectedBrand}
                    className={`select-showroom ${
                      !selectedBrand ? 'opacity-40 cursor-not-allowed' : ''
                    }`}
                  >
                    <option value="">
                      {selectedBrand
                        ? 'Tous les modèles'
                        : "Choisir une marque d'abord"}
                    </option>
                    {availableModels.map((model) => (
                      <option key={model} value={model}>
                        {model}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Budget */}
                <div className="text-left">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-[#F4E8D8]/30 mb-1.5 block font-medium">
                    Budget max
                  </label>
                  <select
                    value={selectedBudget}
                    onChange={(e) => setSelectedBudget(e.target.value)}
                    className="select-showroom"
                  >
                    {BUDGET_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Year Min */}
                <div className="text-left">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-[#F4E8D8]/30 mb-1.5 block font-medium">
                    Année min
                  </label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="select-showroom"
                  >
                    {YEAR_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={handleSearch}
                className="mt-5 w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-[#C4A484] text-[#1A0F0F] font-bold text-base hover:bg-[#D4B494] active:scale-[0.98] transition-all duration-300 focus:ring-2 focus:ring-[#C4A484]/50 focus:outline-none"
              >
                <Search size={18} />
                {isLoading ? (
                  'Chargement...'
                ) : (
                  <>
                    VOIR LES {matchingCount} VÉHICULE
                    {matchingCount > 1 ? 'S' : ''}
                  </>
                )}
              </button>
            </div>

            {/* Wizard link */}
            <button
              onClick={() => setWizardOpen(true)}
              className="mt-6 inline-flex items-center gap-2 text-sm text-white/40 hover:text-[#C4A484] transition-colors duration-300 group"
            >
              <Sparkles
                size={14}
                className="group-hover:text-[#C4A484] transition-colors"
              />
              Besoin d&apos;aide pour choisir ?
              <ChevronRight
                size={14}
                className="group-hover:translate-x-1 transition-transform duration-300"
              />
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          DERNIERS ARRIVAGES
          ══════════════════════════════════════ */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        {/* Watermark */}
        <img
          src="/assets/gears.svg"
          alt=""
          aria-hidden="true"
          className="absolute -right-32 top-1/2 -translate-y-1/2 w-[500px] h-auto opacity-[0.03] pointer-events-none select-none"
          style={{ filter: 'brightness(0)' }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Section header */}
          <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#C4A484] mb-2">
                Notre sélection
              </p>
              <h2 className="text-3xl md:text-4xl font-display font-semibold text-[#F4E8D8]">
                Derniers arrivages
              </h2>
            </div>
            <Link
              to="/showroom"
              className="flex items-center gap-2 text-sm font-medium text-[#C4A484] hover:text-[#D4B494] transition-colors group"
            >
              Voir tout le stock
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform duration-300"
              />
            </Link>
          </div>

          {/* Vehicle grid */}
          {isLoading ? (
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl overflow-hidden bg-white/[0.03] border border-white/[0.07] animate-pulse"
                >
                  <div className="aspect-[4/3] bg-white/5" />
                  <div className="p-5 space-y-3">
                    <div className="h-5 bg-white/5 rounded w-3/4" />
                    <div className="h-4 bg-white/5 rounded w-1/2" />
                    <div className="flex gap-3 mt-3">
                      <div className="h-4 bg-white/5 rounded w-16" />
                      <div className="h-4 bg-white/5 rounded w-20" />
                      <div className="h-4 bg-white/5 rounded w-12" />
                    </div>
                    <div className="h-8 bg-white/5 rounded w-1/3 mt-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : featuredVehicles.length > 0 ? (
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {featuredVehicles.map((vehicle) => (
                <VehicleCardV2 key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          ) : (
            <div className="glass-panel p-16 text-center">
              <Car size={48} className="mx-auto text-white/10 mb-4" />
              <p className="text-[#F4E8D8]/50 text-lg">
                Aucun véhicule disponible pour le moment.
              </p>
              <p className="text-[#F4E8D8]/30 text-sm mt-2">
                Revenez bientôt ou contactez-nous pour une recherche
                personnalisée.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════
          REASSURANCE / FEATURES
          ══════════════════════════════════════ */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        {/* Watermark */}
        <img
          src="/assets/gear-motion.svg"
          alt=""
          aria-hidden="true"
          className="absolute -left-20 top-20 w-[400px] h-auto opacity-[0.025] pointer-events-none select-none rotate-12"
          style={{ filter: 'brightness(0)' }}
        />

        {/* Ambient blurs */}
        <div className="absolute -left-10 top-10 h-56 w-56 rounded-full bg-[#5C3A2E]/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-[#C4A484]/5 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            {/* Left: Atelier CTA card */}
            <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-[#5C3A2E] to-[#3D1E1E] p-8 md:p-10 border border-[#C4A484]/10">
              <span className="text-xs uppercase tracking-[0.3em] text-[#C4A484]/70">
                Atelier FLOW MOTOR
              </span>
              <h3 className="mt-4 text-3xl font-display font-semibold text-[#F4E8D8]">
                Préparation & performance
              </h3>
              <p className="mt-3 text-[#F4E8D8]/60 leading-relaxed">
                Diagnostic complet, detailing premium et optimisation mécanique.
                Votre véhicule est prêt, impeccablement.
              </p>
              <div className="mt-8">
                <Link
                  to="/atelier"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#C4A484] text-[#1A0F0F] font-semibold text-sm hover:bg-[#D4B494] transition-colors"
                >
                  Découvrir l&apos;atelier
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            {/* Right: Feature cards */}
            <div className="grid gap-4">
              {[
                {
                  icon: Shield,
                  title: 'Garantie premium',
                  desc: "Extensions jusqu'à 60 mois.",
                },
                {
                  icon: Truck,
                  title: 'Logistique maîtrisée',
                  desc: 'Transport sécurisé et suivi complet.',
                },
                {
                  icon: Award,
                  title: 'Expertise reconnue',
                  desc: 'Sélection rigoureuse, passion automobile.',
                },
              ].map((feature) => {
                const Icon = feature.icon
                return (
                  <div
                    key={feature.title}
                    className="flex items-center gap-5 p-5 rounded-xl bg-white/[0.03] border border-white/[0.07] hover:border-[#C4A484]/20 transition-all duration-300 group"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#C4A484]/10 flex items-center justify-center group-hover:bg-[#C4A484]/20 transition-colors">
                      <Icon size={22} className="text-[#C4A484]" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#F4E8D8] text-base">
                        {feature.title}
                      </h4>
                      <p className="text-sm text-[#F4E8D8]/40 mt-0.5">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SOURCING CTA BANNER
          ══════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-24">
        <Link
          to="/contact"
          className="block relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#5C3A2E] to-[#3D1E1E] p-8 md:p-10 group border border-[#C4A484]/10 hover:border-[#C4A484]/30 transition-colors duration-500"
        >
          {/* Glow */}
          <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-[#C4A484]/10 blur-2xl group-hover:bg-[#C4A484]/20 transition-colors duration-500" />

          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#C4A484] mb-2">
                Vous cherchez un modèle précis ?
              </p>
              <h2 className="text-xl md:text-2xl font-display font-semibold text-[#F4E8D8]">
                Sourcing sur-mesure dans toute l&apos;Europe
              </h2>
              <p className="text-sm text-[#F4E8D8]/40 mt-2 max-w-lg">
                Notre réseau nous permet de trouver et importer le véhicule
                exact que vous recherchez. Suisse, Japon, Allemagne.
              </p>
            </div>
            <div className="flex-shrink-0">
              <span className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#C4A484] text-[#1A0F0F] text-sm font-bold rounded-xl group-hover:bg-[#D4B494] transition-colors">
                Nous contacter
                <ArrowRight size={16} />
              </span>
            </div>
          </div>
        </Link>
      </section>

      {/* Wizard Modal */}
      <WizardModal isOpen={wizardOpen} onClose={() => setWizardOpen(false)} />
    </main>
  )
}

export default Home
