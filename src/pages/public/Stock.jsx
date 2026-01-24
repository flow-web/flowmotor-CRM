import { useState } from 'react'
import { Filter } from 'lucide-react'
import VehicleCard from '../../components/VehicleCard'

/**
 * Page Stock - Galerie d'exposition de prestige
 * 
 * Features:
 * - Mock data ultra-réaliste (5+ véhicules)
 * - Barre de filtres premium (responsive)
 * - Grille adaptative (1/2/3 colonnes)
 * - Pattern-tires.svg en filigrane
 */
function Stock() {
  // ===== MOCK DATA - CATALOGUE MAISON TÉMOIN =====
  const vehicles = [
    {
      slug: 'audi-rs6-avant-2021',
      make: 'Audi',
      model: 'RS6 Avant',
      year: 2021,
      mileage: 45000,
      price: 115000,
      color: 'Gris Nardo',
      transmission: 'Auto',
      origin: 'Suisse',
      status: 'ARRIVAGE SUISSE',
      image: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800&q=80'
    },
    {
      slug: 'porsche-911-gt3-2022',
      make: 'Porsche',
      model: '911 GT3',
      year: 2022,
      mileage: 12000,
      price: 225000,
      color: 'Bleu Requin',
      transmission: 'PDK',
      origin: 'Europe',
      status: 'DISPONIBLE',
      image: 'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?w=800&q=80'
    },
    {
      slug: 'bmw-m4-competition-2023',
      make: 'BMW',
      model: 'M4 Competition',
      year: 2023,
      mileage: 8000,
      price: 98000,
      color: 'Noir Intense',
      transmission: 'Auto',
      origin: 'Europe',
      status: 'RÉSERVÉ',
      image: 'https://images.unsplash.com/photo-1617531653520-e4da6d0d8b8c?w=800&q=80'
    },
    {
      slug: 'audi-s4-b85-2014',
      make: 'Audi',
      model: 'S4 B8.5',
      year: 2014,
      mileage: 85000,
      price: 28500,
      color: 'Bleu Sepang',
      transmission: 'S-Tronic',
      origin: 'Japon',
      status: 'DISPONIBLE',
      image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80'
    },
    {
      slug: 'bmw-m2-cs-2020',
      make: 'BMW',
      model: 'M2 CS',
      year: 2020,
      mileage: 25000,
      price: 82000,
      color: 'Bleu Misano',
      transmission: 'DCT',
      origin: 'Europe',
      status: 'VENDU',
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80'
    },
    {
      slug: 'mercedes-amg-gt-r-2019',
      make: 'Mercedes-AMG',
      model: 'GT R',
      year: 2019,
      mileage: 18000,
      price: 165000,
      color: 'Vert Enfer',
      transmission: 'AMG Speedshift',
      origin: 'Suisse',
      status: 'DISPONIBLE',
      image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80'
    }
  ]

  // ===== ÉTATS DES FILTRES =====
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    make: '',
    maxBudget: '',
    origin: ''
  })

  // ===== FILTRAGE DES VÉHICULES =====
  const filteredVehicles = vehicles.filter(vehicle => {
    // Filtre par marque
    if (filters.make && vehicle.make !== filters.make) return false
    
    // Filtre par budget max
    if (filters.maxBudget && vehicle.price > parseInt(filters.maxBudget)) return false
    
    // Filtre par origine
    if (filters.origin && vehicle.origin !== filters.origin) return false
    
    return true
  })

  // ===== EXTRACTION DES VALEURS UNIQUES POUR LES FILTRES =====
  const uniqueMakes = [...new Set(vehicles.map(v => v.make))].sort()
  const uniqueOrigins = [...new Set(vehicles.map(v => v.origin))].sort()

  return (
    <main className="bg-cream relative min-h-screen">
      {/* Pattern-tires.svg en filigrane */}
      <div 
        className="fixed inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{
          backgroundImage: 'url(/assets/pattern-tires.svg)',
          backgroundRepeat: 'repeat',
          backgroundSize: '300px'
        }}
      />

      {/* Contenu principal - Espacements doublés */}
      <div className="relative z-10 py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          
          {/* ===== HEADER DE PAGE ===== */}
          <div className="mb-20 md:mb-28">
            <span className="text-brown font-roboto text-sm uppercase tracking-widest">
              Catalogue d'Exception
            </span>
            <h1 className="font-playfair text-4xl md:text-6xl text-aubergine font-bold mt-3 mb-5">
              Notre Stock d'Exception
            </h1>
            <p className="font-roboto text-aubergine/70 text-base md:text-lg max-w-2xl leading-relaxed">
              Découvrez notre sélection exclusive de véhicules de prestige, soigneusement sélectionnés 
              en Suisse et au Japon. Chaque véhicule est expertisé et préparé dans notre atelier.
            </p>
          </div>

          {/* ===== BARRE DE FILTRES PREMIUM ===== */}
          <div className="mb-12 md:mb-14">
            {/* Bouton mobile */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden w-full flex items-center justify-center gap-2 bg-white border border-aubergine/10 rounded-xl px-6 py-4 font-roboto text-aubergine hover:bg-cream/50 active:scale-[0.98] transition-all shadow-lg"
            >
              <Filter size={18} className={`transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
              {showFilters ? 'Masquer les filtres' : 'Filtrer la sélection'}
            </button>

            {/* Barre de filtres - Sans bordure, juste fond blanc */}
            <div className={`
              ${showFilters ? 'block mt-4 menu-slide-enter' : 'hidden'} md:block md:mt-0
              bg-white rounded-2xl p-8 md:p-10 shadow-lg
            `}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                
                {/* Filtre Marque */}
                <div>
                  <label className="block font-roboto text-xs font-bold uppercase tracking-wider text-aubergine/80 mb-2">
                    Marque
                  </label>
                  <select
                    value={filters.make}
                    onChange={(e) => setFilters({ ...filters, make: e.target.value })}
                    className="w-full bg-cream/50 border border-aubergine/20 rounded-lg px-4 py-2.5 font-roboto text-aubergine focus:outline-none focus:border-brown transition-colors"
                  >
                    <option value="">Toutes les marques</option>
                    {uniqueMakes.map(make => (
                      <option key={make} value={make}>{make}</option>
                    ))}
                  </select>
                </div>

                {/* Filtre Budget Max */}
                <div>
                  <label className="block font-roboto text-xs font-bold uppercase tracking-wider text-aubergine/80 mb-2">
                    Budget Maximum
                  </label>
                  <select
                    value={filters.maxBudget}
                    onChange={(e) => setFilters({ ...filters, maxBudget: e.target.value })}
                    className="w-full bg-cream/50 border border-aubergine/20 rounded-lg px-4 py-2.5 font-roboto text-aubergine focus:outline-none focus:border-brown transition-colors"
                  >
                    <option value="">Tous les budgets</option>
                    <option value="50000">Jusqu'à 50 000 €</option>
                    <option value="100000">Jusqu'à 100 000 €</option>
                    <option value="150000">Jusqu'à 150 000 €</option>
                    <option value="200000">Jusqu'à 200 000 €</option>
                    <option value="300000">Jusqu'à 300 000 €</option>
                  </select>
                </div>

                {/* Filtre Type d'Import */}
                <div>
                  <label className="block font-roboto text-xs font-bold uppercase tracking-wider text-aubergine/80 mb-2">
                    Type d'Import
                  </label>
                  <select
                    value={filters.origin}
                    onChange={(e) => setFilters({ ...filters, origin: e.target.value })}
                    className="w-full bg-cream/50 border border-aubergine/20 rounded-lg px-4 py-2.5 font-roboto text-aubergine focus:outline-none focus:border-brown transition-colors"
                  >
                    <option value="">Toutes les origines</option>
                    {uniqueOrigins.map(origin => (
                      <option key={origin} value={origin}>{origin}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Compteur de résultats */}
              <div className="mt-4 pt-4 border-t border-aubergine/10">
                <p className="font-roboto text-sm text-aubergine/60">
                  <span className="font-bold text-brown">{filteredVehicles.length}</span>
                  {' '}véhicule{filteredVehicles.length > 1 ? 's' : ''} trouvé{filteredVehicles.length > 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>

          {/* ===== GRILLE DE VÉHICULES ===== */}
          {filteredVehicles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {filteredVehicles.map((vehicle) => (
                <VehicleCard key={vehicle.slug} vehicle={vehicle} />
              ))}
            </div>
          ) : (
            // Message si aucun résultat
            <div className="text-center py-20">
              <p className="font-roboto text-xl text-aubergine/60 mb-8">
                Aucun véhicule ne correspond à vos critères.
              </p>
              <button
                onClick={() => setFilters({ make: '', maxBudget: '', origin: '' })}
                className="px-8 py-4 bg-brown text-cream rounded-xl font-roboto font-medium hover:bg-brown/90 active:scale-[0.98] transition-all shadow-lg btn-shine"
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export default Stock
