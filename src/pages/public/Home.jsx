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
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/stock"
                className="btn bg-[#5C3A2E] border-0 text-white px-8 py-3 h-auto rounded-xl hover:bg-[#5C3A2E]/90 shadow-lg shadow-[#5C3A2E]/25"
              >
                Voir le stock
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/contact"
                className="btn btn-ghost text-neutral-content border border-neutral-content/20 px-8 py-3 h-auto rounded-xl hover:bg-white/10 hover:border-neutral-content/30"
              >
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

      <section className="section-spacing relative overflow-hidden">
        {/* Watermark - Mission 3 */}
        <img
          src="/assets/gears.svg"
          alt=""
          aria-hidden="true"
          className="absolute -right-32 top-1/2 -translate-y-1/2 w-[500px] h-auto opacity-[0.03] pointer-events-none select-none"
          style={{ filter: 'brightness(0)' }}
        />

        <div className="container relative mx-auto px-6">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-primary">Notre sélection</p>
              <h2 className="mt-3 text-3xl font-semibold md:text-4xl font-display">Derniers arrivages</h2>
            </div>
            <Link to="/stock" className="btn btn-ghost text-primary hover:bg-primary/5">
              Voir tout le stock
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featuredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.slug} vehicle={vehicle} />
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden section-spacing">
        {/* Watermark - Mission 3 */}
        <img
          src="/assets/gear-motion.svg"
          alt=""
          aria-hidden="true"
          className="absolute -left-20 top-20 w-[400px] h-auto opacity-[0.025] pointer-events-none select-none rotate-12"
          style={{ filter: 'brightness(0)' }}
        />

        <div className="absolute -left-10 top-10 h-56 w-56 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-accent/8 blur-3xl" />

        <div className="container relative mx-auto grid gap-10 px-6 lg:grid-cols-2 lg:items-center">
          <div className="card card-premium bg-primary text-primary-content">
            <div className="card-body p-8">
              <span className="text-xs uppercase tracking-[0.3em] text-primary-content/70">Atelier FLOW MOTOR</span>
              <h3 className="mt-4 text-3xl font-semibold font-display">Préparation & performance</h3>
              <p className="mt-3 text-primary-content/80 leading-relaxed">
                Diagnostic complet, detailing premium et optimisation mécanique. Votre véhicule est prêt, impeccablement.
              </p>
              <div className="card-actions mt-8">
                <Link to="/atelier" className="btn bg-accent text-white border-0 hover:bg-accent/90">
                  Découvrir l&apos;atelier
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>

          <div className="grid gap-6">
            <div className="card card-premium">
              <div className="card-body p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-2xl bg-primary/8 p-4">
                    <Shield size={24} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Garantie premium</h4>
                    <p className="text-sm text-base-content/60 mt-1">Extensions jusqu&apos;à 60 mois.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card card-premium">
              <div className="card-body p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-2xl bg-primary/8 p-4">
                    <Truck size={24} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Logistique maîtrisée</h4>
                    <p className="text-sm text-base-content/60 mt-1">Transport sécurisé et suivi complet.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card card-premium">
              <div className="card-body p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-2xl bg-primary/8 p-4">
                    <Award size={24} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Expertise reconnue</h4>
                    <p className="text-sm text-base-content/60 mt-1">Sélection rigoureuse, passion automobile.</p>
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
