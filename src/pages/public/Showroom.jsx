import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { Search, Filter, Car, ArrowRight, Calendar, Gauge } from 'lucide-react'

const formatPrice = (price) => {
  if (!price) return '—'
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(price)
}

const formatKm = (km) => {
  if (!km) return '—'
  return new Intl.NumberFormat('fr-FR').format(km) + ' km'
}

export default function Showroom() {
  const [vehicles, setVehicles] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [brandFilter, setBrandFilter] = useState('')
  const [budgetFilter, setBudgetFilter] = useState('')

  // Chargement des véhicules publics (STOCK + SOURCING)
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const { data, error } = await supabase
          .from('vehicles')
          .select('*')
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

  // Marques uniques pour le filtre
  const uniqueBrands = useMemo(() => {
    return [...new Set(vehicles.map(v => v.brand).filter(Boolean))].sort()
  }, [vehicles])

  // Filtrage
  const filteredVehicles = useMemo(() => {
    return vehicles.filter(v => {
      // Recherche texte
      if (searchTerm) {
        const search = searchTerm.toLowerCase()
        const name = `${v.brand || ''} ${v.model || ''} ${v.trim || ''}`.toLowerCase()
        if (!name.includes(search)) return false
      }
      // Filtre marque
      if (brandFilter && v.brand !== brandFilter) return false
      // Filtre budget
      if (budgetFilter && v.selling_price > parseInt(budgetFilter)) return false
      return true
    })
  }, [vehicles, searchTerm, brandFilter, budgetFilter])

  const resetFilters = () => {
    setSearchTerm('')
    setBrandFilter('')
    setBudgetFilter('')
  }

  return (
    <main className="bg-base-100">
      {/* Header */}
      <section className="relative overflow-hidden section-spacing">
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent" />
        <div className="container relative mx-auto px-6">
          <p className="text-xs uppercase tracking-[0.3em] text-primary">Catalogue d&apos;exception</p>
          <h1 className="mt-4 text-4xl font-semibold md:text-5xl font-display">Notre Showroom</h1>
          <p className="mt-5 max-w-2xl text-base-content/60 text-lg leading-relaxed">
            Véhicules premium importés, expertisés et préparés par notre atelier. Chaque modèle est sélectionné avec exigence.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-6 pb-24">
        {/* Filtres */}
        <div className="card card-premium p-6 mb-10">
          <div className="grid gap-4 md:grid-cols-4 items-end">
            {/* Recherche */}
            <div className="md:col-span-1">
              <label className="text-xs uppercase tracking-[0.2em] text-base-content/50 mb-2 block">Recherche</label>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/30" />
                <input
                  type="text"
                  placeholder="Marque, modèle..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-base-100 border-0 rounded-lg focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                />
              </div>
            </div>

            {/* Marque */}
            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-base-content/50 mb-2 block">Marque</label>
              <select
                value={brandFilter}
                onChange={(e) => setBrandFilter(e.target.value)}
                className="w-full py-3 px-4 bg-base-100 border-0 rounded-lg focus:ring-2 focus:ring-accent/20 outline-none text-sm"
              >
                <option value="">Toutes</option>
                {uniqueBrands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>

            {/* Budget */}
            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-base-content/50 mb-2 block">Budget max</label>
              <select
                value={budgetFilter}
                onChange={(e) => setBudgetFilter(e.target.value)}
                className="w-full py-3 px-4 bg-base-100 border-0 rounded-lg focus:ring-2 focus:ring-accent/20 outline-none text-sm"
              >
                <option value="">Tous les budgets</option>
                <option value="30000">Jusqu&apos;à 30 000 €</option>
                <option value="50000">Jusqu&apos;à 50 000 €</option>
                <option value="100000">Jusqu&apos;à 100 000 €</option>
                <option value="150000">Jusqu&apos;à 150 000 €</option>
                <option value="200000">Jusqu&apos;à 200 000 €</option>
              </select>
            </div>

            {/* Reset */}
            <div>
              <button
                onClick={resetFilters}
                className="w-full py-3 px-4 text-sm text-base-content/50 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
              >
                Réinitialiser
              </button>
            </div>
          </div>
        </div>

        {/* Compteur */}
        <div className="flex items-center justify-between mb-8">
          <div className="px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary">
            {filteredVehicles.length} véhicule{filteredVehicles.length > 1 ? 's' : ''}
          </div>
        </div>

        {/* Grille de véhicules */}
        {isLoading ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card card-premium animate-pulse">
                <div className="h-56 bg-base-300/50 rounded-t-2xl" />
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-base-300/50 rounded w-3/4" />
                  <div className="h-4 bg-base-300/50 rounded w-1/2" />
                  <div className="h-8 bg-base-300/50 rounded w-1/3 mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredVehicles.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredVehicles.map(vehicle => (
              <ShowroomCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        ) : (
          <div className="card card-premium p-12 text-center">
            <Car size={48} className="mx-auto text-base-content/20 mb-4" />
            <p className="text-base-content/60 mb-4">Aucun véhicule ne correspond à vos critères.</p>
            <button
              className="btn bg-accent text-white border-0 hover:bg-accent/90"
              onClick={resetFilters}
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-base-200 via-base-100 to-accent/10 py-16">
        <div className="container mx-auto px-6 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-primary">Vous cherchez un modèle précis ?</p>
          <h2 className="mt-3 text-3xl font-semibold md:text-4xl font-display">
            Sourcing sur-mesure
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-base-content/60">
            Vous ne trouvez pas le véhicule idéal ? Notre réseau européen nous permet de trouver et importer le modèle exact que vous recherchez.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/contact" className="btn bg-accent text-white border-0 hover:bg-accent/90 px-8">
              Nous contacter
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

// === Carte Véhicule ===
function ShowroomCard({ vehicle }) {
  const primaryImage = vehicle.images?.[0]?.url || null

  const statusLabel = vehicle.status === 'SOURCING' ? 'Arrivage' : 'Disponible'
  const statusClass = vehicle.status === 'SOURCING'
    ? 'bg-amber-500 text-white'
    : 'bg-primary text-primary-content'

  return (
    <Link
      to={`/vehicule/${vehicle.id}`}
      className="card card-premium group hover:shadow-xl transition-all duration-300"
    >
      {/* Image */}
      <figure className="relative h-56 overflow-hidden rounded-t-2xl bg-base-300">
        {primaryImage ? (
          <img
            src={primaryImage}
            alt={`${vehicle.brand} ${vehicle.model}`}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <Car size={48} className="text-base-content/20" />
          </div>
        )}
        <div className="absolute left-4 top-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusClass}`}>
            {statusLabel}
          </span>
        </div>
      </figure>

      {/* Body */}
      <div className="p-6 space-y-3">
        <h3 className="text-xl font-semibold font-display group-hover:text-accent transition-colors">
          {vehicle.brand} {vehicle.model}
        </h3>
        {vehicle.trim && (
          <p className="text-sm text-base-content/50">{vehicle.trim}</p>
        )}

        <div className="flex items-center gap-4 text-sm text-base-content/60">
          {vehicle.year && (
            <span className="flex items-center gap-1">
              <Calendar size={14} /> {vehicle.year}
            </span>
          )}
          {vehicle.mileage && (
            <span className="flex items-center gap-1">
              <Gauge size={14} /> {formatKm(vehicle.mileage)}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-base-content/10">
          <span className="text-2xl font-display text-accent">
            {formatPrice(vehicle.selling_price)}
          </span>
          <span className="text-sm text-base-content/40 group-hover:text-accent flex items-center gap-1 transition-colors">
            Détails <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </Link>
  )
}
