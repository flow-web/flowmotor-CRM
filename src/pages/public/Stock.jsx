import { useState } from 'react'
import { Filter } from 'lucide-react'
import VehicleCard from '../../components/VehicleCard'

function Stock() {
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
      image: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=1200&q=80'
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
      image: 'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?w=1200&q=80'
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
      image: 'https://images.unsplash.com/photo-1617531653520-e4da6d0d8b8c?w=1200&q=80'
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
      image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200&q=80'
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
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&q=80'
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
      image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200&q=80'
    }
  ]

  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    make: '',
    maxBudget: '',
    origin: ''
  })

  const filteredVehicles = vehicles.filter(vehicle => {
    if (filters.make && vehicle.make !== filters.make) return false
    if (filters.maxBudget && vehicle.price > parseInt(filters.maxBudget, 10)) return false
    if (filters.origin && vehicle.origin !== filters.origin) return false
    return true
  })

  const uniqueMakes = [...new Set(vehicles.map(v => v.make))].sort()
  const uniqueOrigins = [...new Set(vehicles.map(v => v.origin))].sort()

  return (
    <main className="bg-base-100">
      <section className="relative overflow-hidden py-16 lg:py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-base-200/70 to-transparent" />
        <div className="container relative mx-auto px-6">
          <p className="text-xs uppercase tracking-[0.3em] text-primary">Catalogue d&apos;exception</p>
          <h1 className="mt-3 text-4xl font-semibold md:text-5xl">Notre stock</h1>
          <p className="mt-4 max-w-2xl text-base-content/70">
            Une sélection premium de véhicules importés, expertisés et préparés par notre atelier.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-6 pb-20">
        <div className="mb-6 flex items-center justify-between gap-4">
          <button
            className="btn btn-outline btn-accent md:hidden"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={16} />
            {showFilters ? 'Masquer les filtres' : 'Filtrer'}
          </button>
          <div className="badge badge-primary">
            {filteredVehicles.length} véhicule{filteredVehicles.length > 1 ? 's' : ''}
          </div>
        </div>

        <div className={`card bg-base-100 shadow-lg ${showFilters ? 'block' : 'hidden'} md:block`}>
          <div className="card-body">
            <div className="grid gap-4 md:grid-cols-3">
              <label className="form-control">
                <span className="label-text text-sm uppercase tracking-wide">Marque</span>
                <select
                  value={filters.make}
                  onChange={(e) => setFilters({ ...filters, make: e.target.value })}
                  className="select select-bordered w-full"
                >
                  <option value="">Toutes les marques</option>
                  {uniqueMakes.map(make => (
                    <option key={make} value={make}>{make}</option>
                  ))}
                </select>
              </label>

              <label className="form-control">
                <span className="label-text text-sm uppercase tracking-wide">Budget max</span>
                <select
                  value={filters.maxBudget}
                  onChange={(e) => setFilters({ ...filters, maxBudget: e.target.value })}
                  className="select select-bordered w-full"
                >
                  <option value="">Tous les budgets</option>
                  <option value="50000">Jusqu&apos;à 50 000 €</option>
                  <option value="100000">Jusqu&apos;à 100 000 €</option>
                  <option value="150000">Jusqu&apos;à 150 000 €</option>
                  <option value="200000">Jusqu&apos;à 200 000 €</option>
                  <option value="300000">Jusqu&apos;à 300 000 €</option>
                </select>
              </label>

              <label className="form-control">
                <span className="label-text text-sm uppercase tracking-wide">Origine</span>
                <select
                  value={filters.origin}
                  onChange={(e) => setFilters({ ...filters, origin: e.target.value })}
                  className="select select-bordered w-full"
                >
                  <option value="">Toutes les origines</option>
                  {uniqueOrigins.map(origin => (
                    <option key={origin} value={origin}>{origin}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-4">
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setFilters({ make: '', maxBudget: '', origin: '' })}
              >
                Réinitialiser
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10">
          {filteredVehicles.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredVehicles.map(vehicle => (
                <VehicleCard key={vehicle.slug} vehicle={vehicle} />
              ))}
            </div>
          ) : (
            <div className="alert alert-warning shadow-lg">
              <span>Aucun véhicule ne correspond à vos critères.</span>
              <button
                className="btn btn-sm btn-accent"
                onClick={() => setFilters({ make: '', maxBudget: '', origin: '' })}
              >
                Réinitialiser
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

export default Stock
