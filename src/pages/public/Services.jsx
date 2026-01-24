import { useState } from 'react'
import { Shield, TrendingUp, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react'

function Services() {
  const [duration, setDuration] = useState(48)
  const [deposit, setDeposit] = useState(5000)
  const basePrice = 85000

  const calculateMonthlyPayment = () => {
    const remainingAmount = basePrice - deposit
    const monthlyPayment = (remainingAmount / duration) * 1.05
    return Math.round(monthlyPayment)
  }

  const monthlyPayment = calculateMonthlyPayment()

  const guaranteeOptions = [
    {
      name: 'Essentiel',
      duration: '12 mois',
      price: 'Inclus',
      badge: null,
      features: [
        'Moteur (bloc, culasse)',
        'Boîte de vitesses',
        'Pont & transmission',
        'Valable en France',
      ],
      highlighted: false
    },
    {
      name: 'Confort',
      duration: '24 mois',
      price: '+ 890 €',
      badge: 'Populaire',
      features: [
        'Tout Essentiel +',
        'Turbo & compresseur',
        'Système d\'alimentation',
        'Freinage (étriers, disques)',
        'Valable en Europe',
      ],
      highlighted: false
    },
    {
      name: 'Excellence',
      duration: '60 mois',
      price: '+ 1 890 €',
      badge: 'Recommandé',
      features: [
        'Tout Confort +',
        'Électronique embarquée',
        'Système multimédia',
        'Toit ouvrant panoramique',
        'Suspension RS / M',
        'Climatisation automatique',
        'Europe + kilométrage illimité',
      ],
      highlighted: true
    }
  ]

  return (
    <main className="bg-base-100">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=1920&q=80"
            alt="Intérieur luxe automobile"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-neutral/90 via-neutral/70 to-transparent" />
        </div>

        <div className="container relative mx-auto px-6 py-20 text-center text-neutral-content lg:py-24">
          <div className="badge badge-accent">Financement & Garantie</div>
          <h1 className="mt-5 text-4xl font-semibold md:text-5xl">
            Roulez l&apos;esprit libre.
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-lg text-neutral-content/80">
            Des solutions sur-mesure et des garanties extensibles jusqu&apos;à 60 mois.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Shield size={18} />
              Garantie jusqu&apos;à 5 ans
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp size={18} />
              Taux avantageux
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} />
              Réponse en 24h
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-16 lg:py-20">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-primary">Financement</p>
          <h2 className="mt-3 text-3xl font-semibold md:text-4xl">Simulez votre mensualité</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base-content/70">
            Ajustez durée et apport pour estimer votre mensualité.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[2fr_1fr]">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body gap-6">
              <div className="text-center">
                <p className="text-sm uppercase tracking-[0.2em] text-base-content/60">Prix du véhicule</p>
              <p className="mt-2 text-3xl font-semibold text-accent">
                {basePrice.toLocaleString('fr-FR')} €
              </p>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Durée du financement</span>
                  <span className="text-lg font-semibold text-primary">{duration} mois</span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="72"
                  step="6"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="range range-primary mt-3"
                />
                <div className="mt-2 flex justify-between text-xs text-base-content/60">
                  <span>12 mois</span>
                  <span>72 mois</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Votre apport initial</span>
                  <span className="text-lg font-semibold text-accent">{deposit.toLocaleString('fr-FR')} €</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30000"
                  step="1000"
                  value={deposit}
                  onChange={(e) => setDeposit(Number(e.target.value))}
                  className="range range-primary mt-3"
                />
                <div className="mt-2 flex justify-between text-xs text-base-content/60">
                  <span>0 €</span>
                  <span>30 000 €</span>
                </div>
              </div>

              <button className="btn btn-accent">
                Faire une demande de financement
                <ArrowRight size={18} />
              </button>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-base-100 to-base-200 shadow-xl">
            <div className="card-body text-center">
              <p className="text-xs uppercase tracking-[0.2em] text-base-content/60">
                Mensualité estimée
              </p>
              <p className="mt-2 text-4xl font-semibold text-accent">
                {monthlyPayment.toLocaleString('fr-FR')} €
              </p>
              <p className="text-sm text-base-content/70">/ mois</p>
              <p className="mt-4 text-xs text-base-content/60">
                * Simulation indicative avec TAEG 5%. Offre soumise à conditions.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-base-200 via-base-100 to-accent/10 py-16 lg:py-20">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-primary">Protection mécanique</p>
            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">Garanties premium</h2>
            <p className="mx-auto mt-4 max-w-2xl text-base-content/70">
              Partenariat Opteven, leader européen de la garantie panne mécanique.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {guaranteeOptions.map((option, index) => (
              <div
                key={index}
                className={`card bg-base-100 shadow-xl ${option.highlighted ? 'ring-2 ring-primary/30' : ''}`}
              >
                <div className="card-body">
                  {option.badge && (
                    <div className="badge badge-primary gap-1">
                      <Sparkles size={14} />
                      {option.badge}
                    </div>
                  )}
                  <h3 className="mt-2 text-2xl font-semibold">{option.name}</h3>
                  <p className="text-sm text-base-content/60">{option.duration}</p>
                  <p className="mt-2 text-3xl font-semibold text-accent">{option.price}</p>

                  <ul className="mt-4 space-y-2 text-sm text-base-content/70">
                    {option.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="card-actions mt-4">
                    <button className={`btn ${option.highlighted ? 'btn-accent' : 'btn-outline btn-accent'}`}>
                      Choisir cette garantie
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

export default Services
