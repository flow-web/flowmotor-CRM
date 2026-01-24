import { ArrowRight, Shield, Truck, Award } from 'lucide-react'
import { Link } from 'react-router-dom'
import VehicleCard from '../../components/VehicleCard'

function Home() {
  const featuredVehicles = [
    {
      slug: 'porsche-911-gt3-2023',
      make: 'Porsche',
      model: '911 GT3',
      year: 2023,
      price: 189900,
      mileage: 8500,
      image: 'https://images.unsplash.com/photo-1614200179396-2bdb77ebf81b?w=1200&q=80',
      status: 'DISPONIBLE'
    },
    {
      slug: 'audi-rs6-avant-2022',
      make: 'Audi',
      model: 'RS6 Avant',
      year: 2022,
      price: 134900,
      mileage: 12000,
      image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200&q=80',
      status: 'ARRIVAGE'
    },
    {
      slug: 'bmw-m4-competition-2023',
      make: 'BMW',
      model: 'M4 Competition',
      year: 2023,
      price: 98900,
      mileage: 6500,
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&q=80',
      status: 'DISPONIBLE'
    }
  ]

  return (
    <main className="bg-base-100">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=1920&q=80"
            alt="Véhicule de luxe"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral/95 via-neutral/70 to-transparent" />
          <div className="absolute -top-24 right-10 h-72 w-72 rounded-full bg-accent/25 blur-3xl animate-[slow-float_10s_ease-in-out_infinite]" />
        </div>

        <div className="container relative mx-auto px-6 py-20 lg:py-28">
          <div className="max-w-2xl text-neutral-content">
            <div className="badge badge-accent uppercase tracking-[0.3em]">Import Suisse & Japon</div>
            <h1 className="mt-6 text-4xl font-semibold leading-tight md:text-6xl text-balance animate-[soft-rise_0.6s_ease-out]">
              L&apos;excellence automobile, sélectionnée pour les passionnés exigeants.
            </h1>
            <p className="mt-6 text-lg text-neutral-content/80">
              Véhicules rares, préparation atelier complète et accompagnement sur-mesure pour une expérience d&apos;achat premium.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/stock" className="btn btn-accent">
                Voir le stock
                <ArrowRight size={18} />
              </Link>
              <Link to="/contact" className="btn btn-outline btn-accent">
                Nous contacter
              </Link>
            </div>

            <div className="stats stats-vertical mt-10 bg-neutral/40 text-neutral-content shadow sm:stats-horizontal">
              <div className="stat">
                <div className="stat-title text-neutral-content/70">Imports signés</div>
                <div className="stat-value text-2xl">150+</div>
              </div>
              <div className="stat">
                <div className="stat-title text-neutral-content/70">Expertise</div>
                <div className="stat-value text-2xl">48h</div>
              </div>
              <div className="stat">
                <div className="stat-title text-neutral-content/70">Réseau VIP</div>
                <div className="stat-value text-2xl">Europe</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-primary">Notre sélection</p>
              <h2 className="mt-3 text-3xl font-semibold md:text-4xl">Derniers arrivages</h2>
            </div>
            <Link to="/stock" className="btn btn-ghost">
              Voir tout le stock
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.slug} vehicle={vehicle} />
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-br from-base-200 via-base-100 to-accent/10 py-16 lg:py-24">
        <div className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-accent/15 blur-3xl" />

        <div className="container relative mx-auto grid gap-8 px-6 lg:grid-cols-2 lg:items-center">
          <div className="card bg-neutral text-neutral-content shadow-xl">
            <div className="card-body">
              <div className="badge badge-outline">Atelier FLOW MOTOR</div>
              <h3 className="mt-3 text-3xl font-semibold">Préparation & performance</h3>
              <p className="text-neutral-content/70">
                Diagnostic complet, detailing premium et optimisation mécanique. Votre véhicule est prêt, impeccablement.
              </p>
              <div className="card-actions mt-6">
                <Link to="/atelier" className="btn btn-accent">
                  Découvrir l&apos;atelier
                </Link>
              </div>
            </div>
          </div>

          <div className="grid gap-6">
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <div className="flex items-center gap-3">
                  <div className="rounded-box bg-primary/10 p-3">
                    <Shield size={22} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Garantie premium</h4>
                    <p className="text-sm text-base-content/70">Extensions jusqu&apos;à 60 mois.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <div className="flex items-center gap-3">
                  <div className="rounded-box bg-primary/10 p-3">
                    <Truck size={22} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Logistique maîtrisée</h4>
                    <p className="text-sm text-base-content/70">Transport sécurisé et suivi complet.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <div className="flex items-center gap-3">
                  <div className="rounded-box bg-primary/10 p-3">
                    <Award size={22} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Expertise reconnue</h4>
                    <p className="text-sm text-base-content/70">Sélection rigoureuse, passion automobile.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Home
