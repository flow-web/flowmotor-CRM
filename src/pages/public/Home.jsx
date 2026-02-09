import { useState, useEffect } from 'react'
import { ArrowRight, Shield, Truck, Award, Calendar, Gauge, Car } from 'lucide-react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

const formatPrice = (price) => {
  if (!price) return '—'
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(price)
}

const formatKm = (km) => {
  if (!km) return '—'
  return new Intl.NumberFormat('fr-FR').format(km) + ' km'
}

function Home() {
  const [featuredVehicles, setFeaturedVehicles] = useState([])

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await supabase
          .from('vehicles')
          .select('*')
          .in('status', ['STOCK', 'SOURCING'])
          .order('created_at', { ascending: false })
          .limit(3)
        setFeaturedVehicles(data || [])
      } catch (err) {
        console.error('Erreur featured:', err)
      }
    }
    fetchFeatured()
  }, [])

  return (
    <main className="bg-base-100">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=1920&q=80"
            alt="Véhicule de luxe"
            className="h-full w-full object-cover"
          />
          {/* Overlay Dégradé - Noir vers transparent */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          {/* Accent glow */}
          <div className="absolute -top-24 right-10 h-72 w-72 rounded-full bg-[#5C3A2E]/30 blur-3xl animate-[slow-float_10s_ease-in-out_infinite]" />
        </div>

        <div className="container relative mx-auto px-6 py-20 lg:py-28">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-block px-4 py-2 rounded-full bg-[#5C3A2E] text-[#F4E8D8] text-xs uppercase tracking-[0.3em] font-medium">
              Import Suisse & Japon
            </div>

            {/* Titre en Blanc/Crème */}
            <h1 className="mt-6 text-4xl font-semibold leading-tight md:text-6xl text-balance animate-[soft-rise_0.6s_ease-out] text-white font-display">
              L&apos;excellence automobile, sélectionnée pour les passionnés exigeants.
            </h1>

            {/* Sous-titre en Crème */}
            <p className="mt-6 text-lg text-[#F4E8D8]/90 leading-relaxed">
              Véhicules rares, préparation atelier complète et accompagnement sur-mesure pour une expérience d&apos;achat premium.
            </p>

            {/* Boutons */}
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/showroom"
                className="btn bg-[#5C3A2E] border-0 text-white px-8 py-3 h-auto rounded-xl hover:bg-[#5C3A2E]/80 shadow-lg shadow-[#5C3A2E]/40 font-medium"
              >
                Voir le stock
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/contact"
                className="btn bg-transparent text-white border-2 border-white/80 px-8 py-3 h-auto rounded-xl hover:bg-white/10 hover:border-white font-medium"
              >
                Nous contacter
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-12 flex flex-wrap gap-8 sm:gap-12">
              <div className="text-center sm:text-left">
                <div className="text-3xl font-bold text-white">150+</div>
                <div className="text-sm text-[#F4E8D8]/70 mt-1">Imports signés</div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-3xl font-bold text-white">48h</div>
                <div className="text-sm text-[#F4E8D8]/70 mt-1">Expertise</div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-3xl font-bold text-white">Europe</div>
                <div className="text-sm text-[#F4E8D8]/70 mt-1">Réseau VIP</div>
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
            <Link to="/showroom" className="btn btn-ghost text-primary hover:bg-primary/5">
              Voir tout le stock
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featuredVehicles.map((vehicle) => {
              const img = vehicle.images?.[0]?.url
              return (
                <Link
                  key={vehicle.id}
                  to={`/vehicule/${vehicle.id}`}
                  className="card card-premium group"
                >
                  <figure className="relative h-56 overflow-hidden rounded-t-2xl bg-base-300">
                    {img ? (
                      <img src={img} alt={`${vehicle.brand} ${vehicle.model}`} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center"><Car size={48} className="text-base-content/20" /></div>
                    )}
                    <div className="absolute left-4 top-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${vehicle.status === 'SOURCING' ? 'bg-amber-500 text-white' : 'bg-primary text-primary-content'}`}>
                        {vehicle.status === 'SOURCING' ? 'Arrivage' : 'Disponible'}
                      </span>
                    </div>
                  </figure>
                  <div className="card-body gap-3">
                    <h3 className="card-title font-display text-2xl">{vehicle.brand} {vehicle.model}</h3>
                    <p className="text-sm text-base-content/70">
                      {vehicle.year} • {formatKm(vehicle.mileage)}
                    </p>
                    <div className="card-actions items-center justify-between pt-2">
                      <span className="text-2xl font-display text-accent">{formatPrice(vehicle.selling_price)}</span>
                      <span className="btn btn-ghost btn-sm">Détails <ArrowRight size={16} /></span>
                    </div>
                  </div>
                </Link>
              )
            })}
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
