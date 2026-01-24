import { useState } from 'react'
import { 
  Shield, 
  MapPin, 
  Infinity, 
  Wrench, 
  CheckCircle2,
  ArrowRight,
  Sparkles,
  TrendingUp
} from 'lucide-react'

/**
 * Services - Page Financement & Garantie
 * 
 * Features:
 * - Hero section rassurance
 * - Simulateur de financement interactif
 * - 3 paliers de garantie (pricing cards)
 * - Design premium bg-cream avec pattern-tires
 */
function Services() {
  // ===== ÉTAT DU SIMULATEUR =====
  const [duration, setDuration] = useState(48) // Durée en mois (12-72)
  const [deposit, setDeposit] = useState(5000) // Apport en € (0-30000)
  const basePrice = 85000 // Prix du véhicule (exemple)

  // Calcul de la mensualité (formule simplifiée avec taux 5%)
  const calculateMonthlyPayment = () => {
    const remainingAmount = basePrice - deposit
    const monthlyPayment = (remainingAmount / duration) * 1.05
    return Math.round(monthlyPayment)
  }

  const monthlyPayment = calculateMonthlyPayment()

  // ===== DONNÉES DES GARANTIES =====
  const guaranteeOptions = [
    {
      name: 'ESSENTIEL',
      duration: '12 mois',
      price: 'Inclus',
      badge: null,
      features: [
        'Moteur (bloc, culasse)',
        'Boîte de vitesses',
        'Pont & Transmission',
        'Valable en France',
      ],
      highlighted: false
    },
    {
      name: 'CONFORT',
      duration: '24 mois',
      price: '+ 890 €',
      badge: 'Populaire',
      features: [
        'Tout ESSENTIEL +',
        'Turbo & Compresseur',
        'Système d\'alimentation',
        'Freinage (étriers, disques)',
        'Valable en Europe',
      ],
      highlighted: false
    },
    {
      name: 'EXCELLENCE',
      duration: '60 mois',
      price: '+ 1 890 €',
      badge: 'Recommandé',
      features: [
        'Tout CONFORT +',
        'Électronique embarquée',
        'Système multimédia',
        'Toit ouvrant panoramique',
        'Suspension RS / M',
        'Climatisation automatique',
        'Valable en Europe + kilométrage illimité',
      ],
      highlighted: true
    }
  ]

  return (
    <main className="min-h-screen bg-cream">
      
      {/* ===== HERO SECTION (RASSURANCE) ===== */}
      <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Image de fond sombre */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=1920&q=80"
            alt="Intérieur luxe automobile"
            className="w-full h-full object-cover"
          />
          {/* Overlay dégradé Aubergine */}
          <div className="absolute inset-0 bg-gradient-to-br from-aubergine via-aubergine/80 to-black/60"></div>
        </div>

        {/* Contenu */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <h1 className="font-playfair text-4xl md:text-6xl text-cream font-bold mb-6 animate-fade-in-up">
            Roulez l'esprit libre.
          </h1>
          <p className="font-roboto text-lg md:text-xl text-cream/90 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animate-delay-100">
            Des solutions de financement sur-mesure et des garanties extensibles 
            jusqu'à 60 mois pour votre sérénité.
          </p>

          {/* Points de réassurance */}
          <div className="flex flex-wrap items-center justify-center gap-8 mt-10 animate-fade-in-up animate-delay-200">
            <div className="flex items-center gap-2 text-cream/80">
              <Shield size={20} />
              <span className="font-roboto text-sm">Garantie jusqu'à 5 ans</span>
            </div>
            <div className="flex items-center gap-2 text-cream/80">
              <TrendingUp size={20} />
              <span className="font-roboto text-sm">Taux avantageux</span>
            </div>
            <div className="flex items-center gap-2 text-cream/80">
              <CheckCircle2 size={20} />
              <span className="font-roboto text-sm">Réponse en 24h</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filigrane pattern-tires */}
      <div 
        className="fixed inset-0 opacity-[0.02] pointer-events-none z-0"
        style={{
          backgroundImage: 'url(/assets/pattern-tires.svg)',
          backgroundRepeat: 'repeat',
          backgroundSize: '400px'
        }}
      />

      {/* ===== SIMULATEUR DE FINANCEMENT ===== */}
      <section className="relative z-10 py-32 md:py-40">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
          
          {/* Titre section */}
          <div className="text-center mb-16">
            <span className="text-brown/60 font-roboto text-xs uppercase tracking-widest">
              Financement
            </span>
            <h2 className="font-playfair text-3xl md:text-4xl text-aubergine font-bold mt-3 mb-4">
              Simulez votre mensualité
            </h2>
            <p className="font-roboto text-aubergine/70 text-lg max-w-2xl mx-auto">
              Personnalisez votre plan de financement en quelques clics et obtenez 
              une estimation instantanée.
            </p>
          </div>

          {/* Carte Simulateur */}
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-2xl">
            
            {/* Prix du véhicule (exemple) */}
            <div className="text-center mb-10">
              <p className="font-roboto text-sm text-aubergine/60 uppercase tracking-wider mb-2">
                Prix du véhicule (exemple)
              </p>
              <p className="font-playfair text-3xl text-aubergine font-bold">
                {basePrice.toLocaleString('fr-FR')} €
              </p>
            </div>

            {/* Sliders */}
            <div className="space-y-10">
              
              {/* Slider Durée */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="font-roboto text-aubergine font-semibold">
                    Durée du financement
                  </label>
                  <span className="font-playfair text-2xl text-brown font-bold">
                    {duration} mois
                  </span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="72"
                  step="6"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full h-2 bg-aubergine/10 rounded-full appearance-none cursor-pointer slider-brown"
                />
                <div className="flex justify-between mt-2 text-xs text-aubergine/50 font-roboto">
                  <span>12 mois</span>
                  <span>72 mois</span>
                </div>
              </div>

              {/* Slider Apport */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="font-roboto text-aubergine font-semibold">
                    Votre apport initial
                  </label>
                  <span className="font-playfair text-2xl text-brown font-bold">
                    {deposit.toLocaleString('fr-FR')} €
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30000"
                  step="1000"
                  value={deposit}
                  onChange={(e) => setDeposit(Number(e.target.value))}
                  className="w-full h-2 bg-aubergine/10 rounded-full appearance-none cursor-pointer slider-brown"
                />
                <div className="flex justify-between mt-2 text-xs text-aubergine/50 font-roboto">
                  <span>0 €</span>
                  <span>30 000 €</span>
                </div>
              </div>
            </div>

            {/* Résultat */}
            <div className="mt-12 p-8 bg-gradient-to-br from-cream to-brown/5 rounded-xl border-2 border-brown/20">
              <p className="font-roboto text-sm text-aubergine/70 uppercase tracking-wider text-center mb-3">
                Votre mensualité estimée
              </p>
              <p className="font-playfair text-5xl md:text-6xl text-brown font-bold text-center price-glow">
                {monthlyPayment.toLocaleString('fr-FR')} €
                <span className="text-2xl text-aubergine/60 font-roboto font-normal"> / mois</span>
              </p>
              <p className="text-center font-roboto text-xs text-aubergine/50 mt-4">
                * Simulation indicative incluant un TAEG de 5%. Offre soumise à conditions et accord de notre partenaire financier.
              </p>
            </div>

            {/* CTA */}
            <button className="w-full mt-8 min-h-[56px] bg-brown text-cream rounded-xl font-roboto font-bold text-lg flex items-center justify-center gap-3 hover:bg-brown/90 active:scale-[0.98] transition-all duration-200 shadow-lg hover:shadow-xl btn-shine">
              Faire une demande de financement
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* ===== OFFRES DE GARANTIE (PRICING CARDS) ===== */}
      <section className="relative z-10 py-32 md:py-40 bg-gradient-to-b from-cream to-aubergine/5">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          
          {/* Titre section */}
          <div className="text-center mb-20">
            <span className="text-brown/60 font-roboto text-xs uppercase tracking-widest">
              Protection Mécanique
            </span>
            <h2 className="font-playfair text-3xl md:text-4xl text-aubergine font-bold mt-3 mb-4">
              Protection Mécanique Premium
            </h2>
            <p className="font-roboto text-aubergine/70 text-lg max-w-2xl mx-auto mb-6">
              Garantie partenaire <span className="font-bold text-aubergine">Opteven</span>, 
              leader européen de la garantie panne mécanique.
            </p>

            {/* Points forts globaux */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
              <div className="flex items-center gap-2 text-aubergine/70">
                <MapPin size={18} className="text-brown" />
                <span className="font-roboto text-sm">Valable dans toute l'Europe</span>
              </div>
              <div className="flex items-center gap-2 text-aubergine/70">
                <Infinity size={18} className="text-brown" />
                <span className="font-roboto text-sm">Kilométrage illimité</span>
              </div>
              <div className="flex items-center gap-2 text-aubergine/70">
                <Wrench size={18} className="text-brown" />
                <span className="font-roboto text-sm">Dépannage 0 km</span>
              </div>
            </div>
          </div>

          {/* Grille des cartes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            
            {guaranteeOptions.map((option, index) => (
              <div
                key={index}
                className={`
                  relative bg-white rounded-2xl p-8 transition-all duration-300 flex flex-col h-full
                  ${option.highlighted 
                    ? 'shadow-2xl scale-105 md:scale-110 z-10 ring-2 ring-brown/20' 
                    : 'shadow-lg hover:shadow-xl hover:-translate-y-1'
                  }
                `}
              >
                {/* Badge */}
                {option.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 px-4 py-2 bg-brown text-cream text-xs font-roboto font-bold uppercase tracking-wider rounded-full shadow-lg">
                      <Sparkles size={14} />
                      {option.badge}
                    </span>
                  </div>
                )}

                {/* Header */}
                <div className="text-center mb-6">
                  <h3 className={`
                    font-playfair text-2xl font-bold mb-2
                    ${option.highlighted ? 'text-brown' : 'text-aubergine'}
                  `}>
                    {option.name}
                  </h3>
                  <p className="font-roboto text-sm text-aubergine/60 mb-4">
                    {option.duration}
                  </p>
                  <p className={`
                    font-playfair text-3xl font-bold
                    ${option.highlighted ? 'text-brown' : 'text-aubergine'}
                  `}>
                    {option.price}
                  </p>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8 flex-grow">
                  {option.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 
                        size={18} 
                        className={`flex-shrink-0 mt-0.5 ${option.highlighted ? 'text-brown' : 'text-aubergine/60'}`} 
                      />
                      <span className="font-roboto text-sm text-aubergine/80 leading-relaxed">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button className={`
                  w-full min-h-[52px] rounded-xl font-roboto font-bold text-base transition-all duration-200
                  ${option.highlighted
                    ? 'bg-brown text-cream hover:bg-brown/90 shadow-lg hover:shadow-xl btn-shine'
                    : 'bg-aubergine/10 text-aubergine hover:bg-aubergine/20'
                  }
                `}>
                  Choisir cette garantie
                </button>
              </div>
            ))}
          </div>

          {/* Note finale */}
          <div className="mt-12 text-center">
            <p className="font-roboto text-sm text-aubergine/60 max-w-3xl mx-auto leading-relaxed">
              Les garanties sont proposées par notre partenaire <span className="font-bold">Opteven</span>, 
              spécialiste de l'assurance panne mécanique depuis 1995. Conditions détaillées sur demande.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Services
