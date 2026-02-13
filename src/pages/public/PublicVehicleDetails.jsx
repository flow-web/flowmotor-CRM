import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { createLead } from '../../lib/supabase/leads'
import {
  ArrowLeft,
  Calendar,
  Gauge,
  Palette,
  MapPin,
  Phone,
  Mail,
  Car,
  ChevronLeft,
  ChevronRight,
  Shield,
  Wrench,
  Send,
  CheckCircle,
  Loader2,
  Zap,
  Ruler,
  Leaf,
  Cog,
  Fuel,
  Clock,
  FileText,
  Heart
} from 'lucide-react'
import SEO from '../../components/SEO'

const formatPrice = (price) => {
  if (!price) return 'Prix sur demande'
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(price)
}

const formatKm = (km) => {
  if (!km) return null
  return new Intl.NumberFormat('fr-FR').format(km) + ' km'
}

/* ─── Vehicle Inquiry Form (Dark Luxury) ─── */
function VehicleInquiryForm({ vehicle, vehicleName }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [status, setStatus] = useState('idle')

  const defaultMessage = `Bonjour, je suis interesse(e) par ${vehicleName}${vehicle.year ? ` (${vehicle.year})` : ''}. Pouvez-vous me recontacter ?`

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    try {
      await createLead({
        name: form.name,
        email: form.email,
        phone: form.phone || null,
        subject: 'achat',
        message: form.message || defaultMessage,
        vehicleId: vehicle.id,
        vehicleLabel: `${vehicle.brand} ${vehicle.model} ${vehicle.year || ''}`.trim(),
        source: 'vehicle_inquiry',
      })
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.05] p-6" style={{ animation: 'fadeSlideUp 0.3s ease-out' }}>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 flex-shrink-0">
            <CheckCircle size={22} className="text-emerald-400" />
          </div>
          <div>
            <p className="font-semibold text-emerald-400 font-sans">Demande envoyee !</p>
            <p className="text-sm text-emerald-400/60 mt-0.5">Notre equipe vous repondra sous 24h.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-[#C4A484]/20 bg-white/[0.03] backdrop-blur-xl p-6">
      <h3 className="text-lg font-display font-semibold text-white mb-1">Ce vehicule vous interesse ?</h3>
      <p className="text-sm text-white/40 font-sans mb-5">Laissez-nous vos coordonnees, nous vous recontactons rapidement.</p>

      {status === 'error' && (
        <div className="mb-4 p-3 rounded-xl border border-red-500/30 bg-red-500/10 text-sm text-red-400 flex items-center gap-2">
          <span>Erreur lors de l'envoi. Reessayez ou appelez-nous directement.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <input
            type="text"
            placeholder="Votre nom"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-[#F4E8D8] placeholder-white/25 outline-none transition-all duration-300 focus:border-[#C4A484]/60 focus:ring-2 focus:ring-[#C4A484]/20 font-sans"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-[#F4E8D8] placeholder-white/25 outline-none transition-all duration-300 focus:border-[#C4A484]/60 focus:ring-2 focus:ring-[#C4A484]/20 font-sans"
            required
          />
        </div>
        <input
          type="tel"
          placeholder="Telephone (recommande)"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-[#F4E8D8] placeholder-white/25 outline-none transition-all duration-300 focus:border-[#C4A484]/60 focus:ring-2 focus:ring-[#C4A484]/20 font-sans"
        />
        <textarea
          placeholder={defaultMessage}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-[#F4E8D8] placeholder-white/25 outline-none transition-all duration-300 focus:border-[#C4A484]/60 focus:ring-2 focus:ring-[#C4A484]/20 font-sans min-h-[80px] resize-none"
        />
        <button
          type="submit"
          disabled={status === 'sending'}
          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-[#C4A484] text-[#1A0F0F] font-semibold text-sm tracking-wide hover:bg-[#D4BC9A] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#C4A484]/50 shadow-lg shadow-[#C4A484]/10 hover:shadow-[#C4A484]/20"
        >
          {status === 'sending' ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Envoi en cours...
            </>
          ) : (
            <>
              <Send size={16} />
              Envoyer ma demande
            </>
          )}
        </button>
      </form>
    </div>
  )
}


/* ─── Bento Spec Cell ─── */
function BentoSpecCell({ icon: Icon, label, value, placeholder }) {
  const hasValue = value !== null && value !== undefined && value !== ''

  return (
    <div
      className={`group relative rounded-2xl border transition-all duration-300 overflow-hidden ${
        hasValue
          ? 'border-white/10 bg-white/[0.03] hover:border-[#C4A484]/30 hover:shadow-lg hover:shadow-[#C4A484]/5'
          : 'border-white/[0.04] bg-white/[0.015]'
      }`}
    >
      {/* Subtle gold gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#C4A484]/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative p-5 flex items-start gap-4">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl flex-shrink-0 transition-all duration-300 ${
          hasValue
            ? 'bg-[#C4A484]/10 group-hover:bg-[#C4A484]/15'
            : 'bg-white/[0.03]'
        }`}>
          <Icon size={20} className={hasValue ? 'text-[#C4A484]' : 'text-white/15'} />
        </div>
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.15em] text-white/35 font-sans font-medium mb-1">
            {label}
          </p>
          <p className={`text-sm font-semibold font-sans ${
            hasValue ? 'text-[#F4E8D8]' : 'text-white/15 italic font-normal'
          }`}>
            {hasValue ? value : (placeholder || 'Bientot disponible')}
          </p>
        </div>
      </div>
    </div>
  )
}


/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════ */
export default function PublicVehicleDetails() {
  const { id } = useParams()
  const [vehicle, setVehicle] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [error, setError] = useState(null)
  const [isFav, setIsFav] = useState(false)

  /* --- dark bg override --- */
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

  /* --- Favorites --- */
  useEffect(() => {
    try {
      const favs = JSON.parse(localStorage.getItem('flowmotor-favorites') || '[]')
      setIsFav(favs.includes(id))
    } catch { /* ignore */ }
  }, [id])

  const toggleFavorite = () => {
    try {
      const favs = JSON.parse(localStorage.getItem('flowmotor-favorites') || '[]')
      const next = isFav ? favs.filter((f) => f !== id) : [...favs, id]
      localStorage.setItem('flowmotor-favorites', JSON.stringify(next))
      setIsFav(!isFav)
    } catch { /* ignore */ }
  }

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const { data, error } = await supabase
          .from('vehicles')
          .select('id, brand, model, trim, year, mileage, color, status, selling_price, images, import_country, is_eu_origin, notes, din_power, fiscal_power, co2, transmission, fuel, doors, seats, critair')
          .eq('id', id)
          .in('status', ['STOCK', 'SOURCING'])
          .single()

        if (error) throw error
        setVehicle(data)
      } catch (err) {
        console.error('Erreur chargement vehicule:', err)
        setError('Vehicule introuvable')
      } finally {
        setIsLoading(false)
      }
    }

    if (id) fetchVehicle()
  }, [id])

  // Navigation images
  const images = vehicle?.images || []
  const hasImages = images.length > 0

  const nextImage = () => {
    if (images.length > 1) {
      setCurrentImageIndex(prev => (prev + 1) % images.length)
    }
  }
  const prevImage = () => {
    if (images.length > 1) {
      setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length)
    }
  }

  /* ─── Loading Skeleton (dark luxury) ─── */
  if (isLoading) {
    return (
      <main className="bg-[#1A0F0F] min-h-screen -mt-20 pt-20">
        <style>{`
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
        `}</style>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="h-4 w-40 rounded-lg mb-8" style={{
            background: 'linear-gradient(90deg, rgba(196,164,132,0.05) 25%, rgba(196,164,132,0.1) 50%, rgba(196,164,132,0.05) 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite'
          }} />
          <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
            <div className="space-y-3">
              <div className="aspect-[4/3] rounded-2xl" style={{
                background: 'linear-gradient(90deg, rgba(196,164,132,0.03) 25%, rgba(196,164,132,0.07) 50%, rgba(196,164,132,0.03) 75%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s infinite'
              }} />
              <div className="grid grid-cols-5 gap-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="aspect-[4/3] rounded-lg" style={{
                    background: 'linear-gradient(90deg, rgba(196,164,132,0.03) 25%, rgba(196,164,132,0.07) 50%, rgba(196,164,132,0.03) 75%)',
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 1.5s infinite',
                    animationDelay: `${i * 100}ms`
                  }} />
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="h-8 w-3/4 rounded-lg" style={{ background: 'linear-gradient(90deg, rgba(196,164,132,0.05) 25%, rgba(196,164,132,0.1) 50%, rgba(196,164,132,0.05) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
              <div className="h-5 w-1/2 rounded-lg" style={{ background: 'linear-gradient(90deg, rgba(196,164,132,0.05) 25%, rgba(196,164,132,0.1) 50%, rgba(196,164,132,0.05) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
              <div className="h-12 w-1/3 rounded-lg" style={{ background: 'linear-gradient(90deg, rgba(196,164,132,0.05) 25%, rgba(196,164,132,0.1) 50%, rgba(196,164,132,0.05) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
              <div className="grid grid-cols-2 gap-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-20 rounded-2xl" style={{ background: 'linear-gradient(90deg, rgba(196,164,132,0.03) 25%, rgba(196,164,132,0.07) 50%, rgba(196,164,132,0.03) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite', animationDelay: `${i * 100}ms` }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  /* ─── Error / 404 ─── */
  if (error || !vehicle) {
    return (
      <main className="bg-[#1A0F0F] min-h-screen -mt-20 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-white/[0.03] flex items-center justify-center">
              <Car size={48} className="text-white/15" />
            </div>
          </div>
          <h1 className="text-3xl font-display font-semibold text-white mb-4">
            {error || 'Vehicule introuvable'}
          </h1>
          <p className="text-white/40 mb-8 font-sans">
            Ce vehicule n'existe pas ou n'est plus disponible.
          </p>
          <Link
            to="/showroom"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#C4A484] text-[#1A0F0F] font-semibold text-sm hover:bg-[#D4BC9A] transition-all duration-300 shadow-lg shadow-[#C4A484]/10"
          >
            <ArrowLeft size={16} />
            Retour au showroom
          </Link>
        </div>
      </main>
    )
  }

  const statusConfig = {
    SOURCING: { label: 'Arrivage', bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30', dot: 'bg-amber-400' },
    STOCK: { label: 'Disponible', bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30', dot: 'bg-emerald-400' },
    SOLD: { label: 'Vendu', bg: 'bg-white/10', text: 'text-white/60', border: 'border-white/20', dot: 'bg-white/40' },
  }
  const st = statusConfig[vehicle.status] || statusConfig.STOCK

  const vehicleName = `${vehicle.brand} ${vehicle.model}${vehicle.trim ? ` ${vehicle.trim}` : ''}`
  const vehicleImage = images[0]?.url || null
  const vehiclePrice = vehicle?.selling_price || null

  const productJsonLd = vehicle ? {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: vehicleName,
    image: vehicleImage,
    description: `${vehicleName} ${vehicle.year || ''} — ${formatKm(vehicle.mileage) || ''}`,
    brand: { '@type': 'Brand', name: vehicle.brand },
    offers: vehiclePrice ? {
      '@type': 'Offer',
      price: vehiclePrice,
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      seller: { '@type': 'Organization', name: 'FLOW MOTOR' }
    } : undefined
  } : null

  return (
    <main className="bg-[#1A0F0F] min-h-screen -mt-20 pt-20">
      {vehicle && (
        <SEO
          title={vehicleName}
          description={`${vehicleName} ${vehicle.year || ''} — ${formatKm(vehicle.mileage) || ''} — ${vehiclePrice ? formatPrice(vehiclePrice) : 'Prix sur demande'}`}
          image={vehicleImage}
          url={`/vehicule/${id}`}
          type="product"
          jsonLd={productJsonLd}
        />
      )}

      {/* Inline keyframes */}
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Ambient orbs */}
      <div className="fixed inset-0 pointer-events-none select-none overflow-hidden z-0" aria-hidden="true">
        <div className="absolute -top-60 -right-60 w-[600px] h-[600px] rounded-full bg-[#C4A484]/[0.02] blur-[200px]" />
        <div className="absolute -bottom-60 -left-60 w-[500px] h-[500px] rounded-full bg-[#C4A484]/[0.015] blur-[180px]" />
      </div>

      {/* ══════════════════════════════════════
          BREADCRUMB
         ══════════════════════════════════════ */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <Link
          to="/showroom"
          className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-[#C4A484] transition-colors duration-300 font-sans"
        >
          <ArrowLeft size={16} />
          Retour au showroom
        </Link>
      </section>

      {/* ══════════════════════════════════════
          MAIN CONTENT — 2 col cockpit
         ══════════════════════════════════════ */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid gap-8 lg:gap-12 lg:grid-cols-[1.35fr_1fr]" style={{ animation: 'fadeSlideUp 0.6s ease-out' }}>

          {/* === LEFT: Gallery === */}
          <div className="space-y-3">
            {/* Main image */}
            <div className="relative overflow-hidden rounded-2xl bg-[#0D0707] border border-white/5">
              {hasImages ? (
                <>
                  <img
                    src={images[currentImageIndex]?.url}
                    alt={`${vehicle.brand} ${vehicle.model}`}
                    className="w-full aspect-[4/3] object-cover transition-opacity duration-300"
                  />
                  {/* Nav arrows */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/70 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#C4A484]/50"
                        aria-label="Image precedente"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/70 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#C4A484]/50"
                        aria-label="Image suivante"
                      >
                        <ChevronRight size={20} />
                      </button>
                      {/* Counter pill */}
                      <div className="absolute bottom-3 right-3 px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-full text-white/80 text-xs font-sans tabular-nums">
                        {currentImageIndex + 1} / {images.length}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="aspect-[4/3] flex items-center justify-center">
                  <Car size={80} className="text-white/[0.06]" />
                </div>
              )}

              {/* Status badge */}
              <div className="absolute left-4 top-4">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${st.bg} ${st.text} ${st.border} border backdrop-blur-sm`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                  {st.label}
                </span>
              </div>

              {/* Favorite button */}
              <button
                onClick={toggleFavorite}
                className="absolute right-4 top-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#C4A484]/50"
                aria-label={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
              >
                <Heart
                  size={18}
                  className={isFav ? 'text-[#C4A484] fill-[#C4A484]' : 'text-white/60'}
                />
              </button>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {images.map((img, index) => (
                  <button
                    key={img.id || index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                      currentImageIndex === index
                        ? 'border-[#C4A484]/60 shadow-md shadow-[#C4A484]/10'
                        : 'border-transparent opacity-60 hover:opacity-100 hover:border-white/10'
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={`Photo ${index + 1}`}
                      className="w-full aspect-[4/3] object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* === RIGHT: Vehicle Info === */}
          <div className="space-y-6">
            {/* Title block */}
            <div>
              <h1 className="text-3xl sm:text-4xl font-display font-semibold text-white leading-tight">
                {vehicle.brand} {vehicle.model}
              </h1>
              {vehicle.trim && (
                <p className="mt-2 text-lg text-[#C4A484] font-sans font-medium">{vehicle.trim}</p>
              )}
              <p className="mt-2 text-sm text-white/40 font-sans">
                {[vehicle.year, vehicle.color, vehicle.import_country && `Import ${vehicle.import_country}`]
                  .filter(Boolean)
                  .join(' \u2022 ')}
              </p>
            </div>

            {/* Price card */}
            <div className="rounded-2xl border border-[#C4A484]/20 bg-gradient-to-br from-[#C4A484]/[0.06] to-transparent p-6">
              <p className="text-3xl sm:text-4xl font-display font-semibold text-[#C4A484] tabular-nums">
                {formatPrice(vehicle.selling_price)}
              </p>
              <p className="text-sm text-white/40 mt-2 font-sans">TVA sur marge &bull; Import & preparation inclus</p>
            </div>

            {/* Quick specs row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: Calendar, label: 'Annee', value: vehicle.year },
                { icon: Gauge, label: 'Km', value: formatKm(vehicle.mileage) },
                { icon: Palette, label: 'Couleur', value: vehicle.color },
                { icon: MapPin, label: 'Origine', value: vehicle.import_country },
              ].filter(s => s.value).map(({ icon: Icon, label, value }) => (
                <div key={label} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-center">
                  <Icon size={16} className="text-[#C4A484]/60 mx-auto mb-1.5" />
                  <p className="text-xs text-white/30 font-sans mb-0.5">{label}</p>
                  <p className="text-sm font-semibold text-[#F4E8D8] font-sans">{value}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            {vehicle.notes && (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <h3 className="text-xs uppercase tracking-[0.15em] text-white/35 font-sans font-medium mb-3">Description</h3>
                <p className="text-sm text-white/60 leading-relaxed whitespace-pre-line font-sans">{vehicle.notes}</p>
              </div>
            )}

            {/* Guarantees */}
            <div className="grid grid-cols-2 gap-3">
              <div className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition-all duration-300 hover:border-[#C4A484]/20 hover:bg-white/[0.04]">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C4A484]/10">
                    <Shield size={18} className="text-[#C4A484]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#F4E8D8] font-sans">Garantie</p>
                    <p className="text-xs text-white/35 font-sans">Jusqu'a 60 mois</p>
                  </div>
                </div>
              </div>
              <div className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition-all duration-300 hover:border-[#C4A484]/20 hover:bg-white/[0.04]">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C4A484]/10">
                    <Wrench size={18} className="text-[#C4A484]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#F4E8D8] font-sans">Preparation</p>
                    <p className="text-xs text-white/35 font-sans">Atelier certifie</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Inquiry form */}
            <VehicleInquiryForm vehicle={vehicle} vehicleName={vehicleName} />

            {/* Phone CTA */}
            <a
              href="tel:+33668396937"
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl border border-[#C4A484]/30 text-[#C4A484] text-sm font-semibold font-sans hover:bg-[#C4A484] hover:text-[#1A0F0F] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#C4A484]/50"
            >
              <Phone size={16} />
              Ou appelez-nous : 06 68 39 69 37
            </a>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          BENTO GRID — Technical Specs
         ══════════════════════════════════════ */}
      <section className="relative z-10 border-t border-white/5 py-16 sm:py-20">
        {/* Watermark */}
        <img
          src="/assets/gears.svg"
          alt=""
          aria-hidden="true"
          className="absolute -right-32 top-10 w-[400px] h-auto opacity-[0.015] pointer-events-none select-none rotate-12"
          style={{ filter: 'brightness(0) invert(1)' }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10" style={{ animation: 'fadeSlideUp 0.5s ease-out' }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C4A484]/10 text-[#C4A484] text-xs font-semibold tracking-wider uppercase mb-4 font-sans">
              <FileText size={14} />
              Fiche technique
            </div>
            <h2 className="font-display text-3xl md:text-4xl text-white">
              Specifications
            </h2>
          </div>

          {/* Bento Grid — 4 columns on desktop, 2 on mobile */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3" style={{ animation: 'fadeSlideUp 0.6s ease-out 0.1s both' }}>
            {/* Row 1: Core specs (from DB) */}
            <BentoSpecCell icon={Calendar} label="Annee" value={vehicle.year} />
            <BentoSpecCell icon={Gauge} label="Kilometrage" value={formatKm(vehicle.mileage)} />
            <BentoSpecCell icon={Palette} label="Couleur" value={vehicle.color} />
            <BentoSpecCell icon={MapPin} label="Origine" value={vehicle.import_country} />

            {/* Row 2: Engine & Performance */}
            <BentoSpecCell icon={Zap} label="Puissance DIN" value={vehicle.din_power ? `${vehicle.din_power} ch` : null} placeholder="-- ch" />
            <BentoSpecCell icon={Cog} label="Transmission" value={vehicle.transmission} placeholder="--" />
            <BentoSpecCell icon={Fuel} label="Carburant" value={vehicle.fuel} placeholder="--" />
            <BentoSpecCell icon={Shield} label="Puissance fiscale" value={vehicle.fiscal_power ? `${vehicle.fiscal_power} CV` : null} placeholder="-- CV" />

            {/* Row 3: Economy & Body */}
            <BentoSpecCell icon={Leaf} label="Crit'Air" value={vehicle.critair} placeholder="--" />
            <BentoSpecCell icon={Leaf} label="CO2" value={vehicle.co2 ? `${vehicle.co2} g/km` : null} placeholder="-- g/km" />
            <BentoSpecCell icon={Car} label="Portes" value={vehicle.doors} placeholder="--" />
            <BentoSpecCell icon={Car} label="Places" value={vehicle.seats} placeholder="--" />
          </div>

          {/* Data availability note */}
          <p className="text-center text-xs text-white/20 mt-6 font-sans">
            Les informations detaillees sont renseignees progressivement par notre equipe.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA BANNER — Sourcing
         ══════════════════════════════════════ */}
      <section className="relative z-10 py-16 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center" style={{ animation: 'fadeSlideUp 0.5s ease-out' }}>
          <h2 className="font-display text-2xl sm:text-3xl text-white mb-3">
            Ce n'est pas le bon vehicule ?
          </h2>
          <p className="text-white/40 font-sans mb-8 max-w-xl mx-auto">
            Notre service de sourcing sur mesure trouve le vehicule de vos reves partout en Europe et au Japon.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/contact?subject=recherche"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#C4A484] text-[#1A0F0F] font-semibold text-sm hover:bg-[#D4BC9A] transition-all duration-300 shadow-lg shadow-[#C4A484]/10 hover:shadow-[#C4A484]/20"
            >
              <Mail size={16} />
              Lancer une recherche
            </Link>
            <Link
              to="/showroom"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border border-white/10 text-white/60 text-sm font-sans hover:text-white hover:border-white/20 transition-all duration-300"
            >
              <ArrowLeft size={16} />
              Explorer le showroom
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom spacer */}
      <div className="h-8" />
    </main>
  )
}
