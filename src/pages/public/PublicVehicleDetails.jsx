import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
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
  Wrench
} from 'lucide-react'

const formatPrice = (price) => {
  if (!price) return '—'
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(price)
}

const formatKm = (km) => {
  if (!km) return '—'
  return new Intl.NumberFormat('fr-FR').format(km) + ' km'
}

export default function PublicVehicleDetails() {
  const { id } = useParams()
  const [vehicle, setVehicle] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const { data, error } = await supabase
          .from('vehicles')
          .select('id, brand, model, trim, year, mileage, color, status, selling_price, images, import_country, is_eu_origin')
          .eq('id', id)
          .single()

        if (error) throw error
        setVehicle(data)
      } catch (err) {
        console.error('Erreur chargement véhicule:', err)
        setError('Véhicule introuvable')
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

  // Loading
  if (isLoading) {
    return (
      <main className="bg-base-100">
        <div className="container mx-auto px-6 py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-6 w-48 bg-base-300/50 rounded" />
            <div className="grid gap-10 lg:grid-cols-2">
              <div className="h-[450px] bg-base-300/50 rounded-2xl" />
              <div className="space-y-6">
                <div className="h-10 bg-base-300/50 rounded w-3/4" />
                <div className="h-6 bg-base-300/50 rounded w-1/2" />
                <div className="h-12 bg-base-300/50 rounded w-1/3" />
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  // Erreur / 404
  if (error || !vehicle) {
    return (
      <main className="bg-base-100">
        <div className="container mx-auto px-6 py-24 text-center">
          <Car size={64} className="mx-auto text-base-content/20 mb-6" />
          <h1 className="text-3xl font-semibold font-display mb-4">{error || 'Véhicule introuvable'}</h1>
          <p className="text-base-content/60 mb-8">Ce véhicule n&apos;existe pas ou n&apos;est plus disponible.</p>
          <Link to="/showroom" className="btn bg-accent text-white border-0 hover:bg-accent/90">
            Retour au showroom
          </Link>
        </div>
      </main>
    )
  }

  const statusLabel = vehicle.status === 'SOURCING' ? 'Arrivage' : vehicle.status === 'SOLD' ? 'Vendu' : 'Disponible'

  // Fiche technique
  const specs = [
    { label: 'Année', value: vehicle.year, icon: Calendar },
    { label: 'Kilométrage', value: formatKm(vehicle.mileage), icon: Gauge },
    { label: 'Couleur', value: vehicle.color, icon: Palette },
    { label: 'Origine', value: vehicle.import_country, icon: MapPin },
  ].filter(s => s.value)

  return (
    <main className="bg-base-100">
      {/* Breadcrumb */}
      <section className="container mx-auto px-6 pt-8 pb-4">
        <Link
          to="/showroom"
          className="inline-flex items-center gap-2 text-sm text-base-content/50 hover:text-primary transition-colors"
        >
          <ArrowLeft size={16} />
          Retour au showroom
        </Link>
      </section>

      {/* Contenu principal */}
      <section className="container mx-auto px-6 pb-16">
        <div className="grid gap-10 lg:grid-cols-2">

          {/* === COLONNE GAUCHE : Galerie === */}
          <div className="space-y-4">
            {/* Image principale */}
            <div className="relative overflow-hidden rounded-2xl bg-base-300 shadow-lg">
              {hasImages ? (
                <>
                  <img
                    src={images[currentImageIndex]?.url}
                    alt={`${vehicle.brand} ${vehicle.model}`}
                    className="w-full h-[450px] object-cover"
                  />
                  {/* Navigation flèches */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors"
                      >
                        <ChevronRight size={20} />
                      </button>
                      {/* Compteur */}
                      <div className="absolute bottom-3 right-3 px-3 py-1 bg-black/50 rounded-full text-white text-xs">
                        {currentImageIndex + 1} / {images.length}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="h-[450px] flex items-center justify-center">
                  <Car size={80} className="text-base-content/10" />
                </div>
              )}

              {/* Badge statut */}
              <div className="absolute left-4 top-4">
                <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                  vehicle.status === 'SOURCING' ? 'bg-amber-500 text-white' :
                  vehicle.status === 'SOLD' ? 'bg-base-content/60 text-white' :
                  'bg-primary text-primary-content'
                }`}>
                  {statusLabel}
                </span>
              </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {images.map((img, index) => (
                  <button
                    key={img.id || index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`overflow-hidden rounded-lg border-2 transition-all ${
                      currentImageIndex === index
                        ? 'border-accent shadow-md'
                        : 'border-transparent opacity-70 hover:opacity-100'
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

          {/* === COLONNE DROITE : Informations === */}
          <div className="space-y-6">
            {/* Titre */}
            <div>
              <h1 className="text-3xl font-semibold md:text-4xl font-display">
                {vehicle.brand} {vehicle.model}
              </h1>
              {vehicle.trim && (
                <p className="mt-2 text-lg text-base-content/60">{vehicle.trim}</p>
              )}
              <p className="mt-2 text-sm text-base-content/40">
                {[vehicle.year, vehicle.color, vehicle.import_country && `Import ${vehicle.import_country}`]
                  .filter(Boolean)
                  .join(' • ')}
              </p>
            </div>

            {/* Prix */}
            <div className="card card-premium p-6">
              <p className="text-4xl font-semibold text-accent font-display">
                {formatPrice(vehicle.selling_price)}
              </p>
              <p className="text-sm text-base-content/50 mt-1">TVA sur marge • Import & préparation inclus</p>
            </div>

            {/* Fiche technique */}
            <div className="card card-premium p-6">
              <h3 className="text-sm uppercase tracking-wider text-base-content/40 mb-4">Fiche technique</h3>
              <div className="grid grid-cols-2 gap-4">
                {specs.map(({ label, value, icon: Icon }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center">
                      <Icon size={18} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-base-content/40">{label}</p>
                      <p className="font-medium text-sm">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Garanties */}
            <div className="grid grid-cols-2 gap-3">
              <div className="card card-premium p-4">
                <div className="flex items-center gap-3">
                  <Shield size={20} className="text-accent" />
                  <div>
                    <p className="text-sm font-medium">Garantie</p>
                    <p className="text-xs text-base-content/50">Jusqu&apos;à 60 mois</p>
                  </div>
                </div>
              </div>
              <div className="card card-premium p-4">
                <div className="flex items-center gap-3">
                  <Wrench size={20} className="text-accent" />
                  <div>
                    <p className="text-sm font-medium">Préparation</p>
                    <p className="text-xs text-base-content/50">Atelier certifié</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="space-y-3 pt-2">
              <Link
                to={`/contact?subject=achat&vehicleId=${vehicle.id}&vehicle=${encodeURIComponent(`${vehicle.brand} ${vehicle.model} ${vehicle.year || ''}`.trim())}`}
                className="btn bg-accent text-white border-0 hover:bg-accent/90 w-full py-3 h-auto text-base"
              >
                <Mail size={18} />
                Demander plus d&apos;informations
              </Link>
              <a
                href="tel:+33668396937"
                className="btn btn-outline border-primary/20 text-primary hover:bg-primary/5 w-full py-3 h-auto text-base"
              >
                <Phone size={18} />
                06 68 39 69 37
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Section CTA finale */}
      <section className="bg-gradient-to-br from-base-200 via-base-100 to-primary/10 py-16">
        <div className="container mx-auto px-6">
          <div className="card bg-primary text-primary-content shadow-2xl">
            <div className="card-body text-center p-10">
              <h2 className="text-3xl font-semibold md:text-4xl font-display">
                Intéressé par {vehicle.brand === 'Audi' || vehicle.brand === 'Alpine' ? 'cette' : 'ce'} {vehicle.model} ?
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-primary-content/70">
                Réservez dès maintenant ou demandez un dossier complet. Notre équipe vous répond sous 24h.
              </p>
              <div className="card-actions mt-6 justify-center gap-4">
                <Link to="/contact" className="btn bg-accent text-white border-0 hover:bg-accent/90">
                  Nous contacter
                </Link>
                <Link to="/showroom" className="btn btn-outline border-primary-content/30 text-primary-content hover:bg-primary-content/10">
                  Voir les autres véhicules
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
