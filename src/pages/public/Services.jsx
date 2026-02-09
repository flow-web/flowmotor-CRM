import { useState } from 'react'
import { Shield, TrendingUp, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react'
import SEO from '../../components/SEO'

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
      <SEO
        title="Services"
        description="Garantie, financement, import personnalisé : découvrez les services FLOW MOTOR pour l'achat de votre véhicule sportif."
        url="/services"
      />
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=1920&q=80"
            alt="Intérieur luxe automobile"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-neutral/95 via-neutral/75 to-transparent" />
        </div>

        <div className="container relative mx-auto px-6 py-24 text-center text-neutral-content lg:py-32">
          <span className="text-xs uppercase tracking-[0.3em] text-accent">Financement & Garantie</span>
          <h1 className="mt-5 text-4xl font-semibold font-display md:text-5xl">
            Roulez l&apos;esprit libre.
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg text-neutral-content/70 leading-relaxed">
            Des solutions sur-mesure et des garanties extensibles jusqu&apos;à 60 mois.
          </p>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm">
            <div className="flex items-center gap-2 text-neutral-content/80">
              <Shield size={18} className="text-accent" />
              Garantie jusqu&apos;à 5 ans
            </div>
            <div className="flex items-center gap-2 text-neutral-content/80">
              <TrendingUp size={18} className="text-accent" />
              Taux avantageux
            </div>
            <div className="flex items-center gap-2 text-neutral-content/80">
              <CheckCircle2 size={18} className="text-accent" />
              Réponse en 24h
            </div>
          </div>
        </div>
      </section>

      {/* Financing Calculator */}
      <section className="section-spacing relative overflow-hidden">
        {/* Watermark */}
        <img
          src="/assets/gears.svg"
          alt=""
          aria-hidden="true"
          className="absolute -left-40 top-1/2 -translate-y-1/2 w-[600px] h-auto opacity-[0.025] pointer-events-none select-none"
          style={{ filter: 'brightness(0)' }}
        />

        <div className="container relative mx-auto px-6">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-primary">Financement</p>
            <h2 className="mt-4 text-3xl font-semibold font-display md:text-4xl">Simulez votre mensualité</h2>
            <p className="mx-auto mt-4 max-w-2xl text-base-content/60 leading-relaxed">
              Ajustez durée et apport pour estimer votre mensualité.
            </p>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-[2fr_1fr]">
            <div className="card card-premium p-8">
              <div className="space-y-8">
                <div className="text-center pb-6">
                  <p className="text-xs uppercase tracking-[0.2em] text-base-content/50">Prix du véhicule</p>
                  <p className="mt-2 text-4xl font-semibold font-display text-accent">
                    {basePrice.toLocaleString('fr-FR')} €
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
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
                    className="range-slider w-full"
                  />
                  <div className="mt-3 flex justify-between text-xs text-base-content/50">
                    <span>12 mois</span>
                    <span>72 mois</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
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
                    className="range-slider w-full"
                  />
                  <div className="mt-3 flex justify-between text-xs text-base-content/50">
                    <span>0 €</span>
                    <span>30 000 €</span>
                  </div>
                </div>

                <button className="btn bg-[#5C3A2E] border-0 text-white w-full py-4 h-auto rounded-xl hover:bg-[#5C3A2E]/90 shadow-lg shadow-[#5C3A2E]/20">
                  Faire une demande de financement
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>

            <div className="card card-premium bg-primary text-primary-content p-8 flex flex-col justify-center">
              <div className="text-center">
                <p className="text-xs uppercase tracking-[0.2em] text-primary-content/60">
                  Mensualité estimée
                </p>
                <p className="mt-3 text-5xl font-semibold font-display">
                  {monthlyPayment.toLocaleString('fr-FR')} €
                </p>
                <p className="mt-2 text-primary-content/60">/ mois</p>
                <p className="mt-6 text-xs text-primary-content/50 leading-relaxed">
                  * Simulation indicative avec TAEG 5%. Offre soumise à conditions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Guarantee Options */}
      <section className="section-spacing relative overflow-hidden">
        {/* Watermark */}
        <img
          src="/assets/gear-motion.svg"
          alt=""
          aria-hidden="true"
          className="absolute -right-32 bottom-0 w-[450px] h-auto opacity-[0.02] pointer-events-none select-none -rotate-12"
          style={{ filter: 'brightness(0)' }}
        />

        <div className="container relative mx-auto px-6">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-primary">Protection mécanique</p>
            <h2 className="mt-4 text-3xl font-semibold font-display md:text-4xl">Garanties premium</h2>
            <p className="mx-auto mt-4 max-w-2xl text-base-content/60 leading-relaxed">
              Partenariat Opteven, leader européen de la garantie panne mécanique.
            </p>
          </div>

          <div className="mt-14 grid gap-8 lg:grid-cols-3">
            {guaranteeOptions.map((option, index) => (
              <div
                key={index}
                className={`card card-premium p-8 ${option.highlighted ? 'ring-2 ring-primary/20 scale-[1.02]' : ''}`}
              >
                <div className="space-y-4">
                  {option.badge && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 rounded-full text-xs font-medium text-primary">
                      <Sparkles size={12} />
                      {option.badge}
                    </div>
                  )}
                  <h3 className="text-2xl font-semibold font-display">{option.name}</h3>
                  <p className="text-sm text-base-content/50">{option.duration}</p>
                  <p className="text-3xl font-semibold font-display text-accent">{option.price}</p>

                  <ul className="pt-4 space-y-3 text-sm text-base-content/70">
                    {option.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle2 size={16} className="text-primary mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-6">
                    <button
                      className={`btn w-full py-3 h-auto rounded-xl ${
                        option.highlighted
                          ? 'bg-[#5C3A2E] border-0 text-white hover:bg-[#5C3A2E]/90'
                          : 'btn-outline border-primary/20 text-primary hover:bg-primary hover:text-primary-content hover:border-primary'
                      }`}
                    >
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
