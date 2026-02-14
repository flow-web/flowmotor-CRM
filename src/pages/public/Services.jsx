import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Shield, Check, X, ChevronDown, Calculator, CreditCard,
  Clock, ArrowRight, Sparkles, HelpCircle
} from 'lucide-react'
import SEO from '../../components/SEO'

/* ─── helpers ─── */
const fmtEUR = (v) =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(v)

const RATE = 0.049
const DURATIONS = [12, 24, 36, 48, 60, 72]

/* ─── FAQ data ─── */
const FAQ_ITEMS = [
  {
    q: 'Quels documents sont necessaires ?',
    a: "Piece d'identite en cours de validite, trois derniers bulletins de salaire, dernier avis d'imposition, RIB et justificatif de domicile de moins de trois mois.",
  },
  {
    q: "Puis-je financer un vehicule importe ?",
    a: "Absolument. Nous travaillons avec des partenaires financiers habitues aux vehicules d'importation. Le financement s'adapte que le vehicule provienne de Suisse, d'Allemagne ou du Japon.",
  },
  {
    q: 'Le financement est-il possible sans apport ?',
    a: "Oui, un financement sans apport est envisageable selon votre profil. L'apport reste neanmoins recommande pour reduire vos mensualites et obtenir un taux plus avantageux.",
  },
  {
    q: 'Combien de temps pour obtenir une reponse ?',
    a: "Nous nous engageons sur un retour sous 24 heures ouvrees. Dans la majorite des cas, vous recevez une proposition de financement le jour meme de votre demande.",
  },
  {
    q: 'Peut-on combiner financement et reprise ?',
    a: "Bien sur. La valeur de reprise de votre ancien vehicule peut servir d'apport, reduisant ainsi le montant a financer et vos mensualites.",
  },
]

/* ─── Guarantee comparison data ─── */
const GUARANTEE_FEATURES = [
  { label: 'Duree', essential: '12 mois', confort: '24 mois', excellence: '60 mois', isText: true },
  { label: 'Moteur & boite', essential: true, confort: true, excellence: true },
  { label: 'Electronique', essential: false, confort: true, excellence: true },
  { label: 'Climatisation', essential: false, confort: true, excellence: true },
  { label: 'Direction & freins', essential: false, confort: false, excellence: true },
  { label: 'Assistance 24/7', essential: false, confort: false, excellence: true },
  { label: 'Vehicule de pret', essential: false, confort: false, excellence: true },
  { label: 'Prix', essential: 'Incluse', confort: '+ 890 \u20AC', excellence: '+ 1 890 \u20AC', isText: true },
]

/* ─── FAQ Accordion item ─── */
function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:border-white/20">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left focus:outline-none focus:ring-2 focus:ring-[#C4A484]/50 rounded-2xl"
        aria-expanded={open}
      >
        <span className="font-sans font-semibold text-[#F4E8D8] text-sm sm:text-base">{question}</span>
        <ChevronDown
          size={20}
          className={`text-[#C4A484] flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: open ? '300px' : '0px', opacity: open ? 1 : 0 }}
      >
        <p className="px-6 pb-5 text-sm text-white/50 leading-relaxed">{answer}</p>
      </div>
    </div>
  )
}

/* ─── Guarantee Card (mobile: card layout) ─── */
function GuaranteeCard({ tier, badge, price, features, highlighted, recommended }) {
  return (
    <div
      className={`relative rounded-2xl p-4 sm:p-6 transition-all duration-300 flex flex-col ${
        recommended
          ? 'bg-[#C4A484]/[0.08] border-2 border-[#C4A484]/40 scale-[1.02] shadow-lg shadow-[#C4A484]/10'
          : highlighted
            ? 'bg-white/[0.05] border border-[#C4A484]/20'
            : 'bg-white/[0.03] border border-white/10'
      } hover:border-[#C4A484]/30 hover:shadow-lg hover:shadow-[#C4A484]/10`}
    >
      {badge && (
        <span
          className={`absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-semibold tracking-wide ${
            recommended
              ? 'bg-[#C4A484] text-[#1A0F0F]'
              : 'bg-[#C4A484]/20 text-[#C4A484]'
          }`}
        >
          <Sparkles size={12} />
          {badge}
        </span>
      )}

      <div className="text-center mt-2">
        <h3 className="font-display text-2xl text-white">{tier}</h3>
        <p className="mt-4 font-display text-3xl text-[#C4A484]">{price}</p>
      </div>

      <div className="mt-6 space-y-3 flex-grow">
        {features.map((f, i) => (
          <div key={i} className="flex items-center gap-3 text-sm">
            {f.value === true ? (
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <Check size={12} className="text-emerald-400" />
              </span>
            ) : f.value === false ? (
              <span className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                <X size={12} className="text-white/20" />
              </span>
            ) : (
              <span className="w-5 h-5 flex-shrink-0" />
            )}
            <span className="text-white/60">
              {f.label}
              {typeof f.value === 'string' && (
                <span className="ml-1 text-[#F4E8D8] font-medium">{f.value}</span>
              )}
            </span>
          </div>
        ))}
      </div>

      <Link
        to="/contact?subject=garantie"
        className={`mt-5 flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-semibold tracking-wide transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#C4A484]/50 ${
          recommended
            ? 'bg-[#C4A484] text-[#1A0F0F] hover:bg-[#d4b494]'
            : 'border border-[#C4A484]/30 text-[#C4A484] hover:bg-[#C4A484] hover:text-[#1A0F0F]'
        }`}
      >
        Choisir
        <ArrowRight size={16} />
      </Link>
    </div>
  )
}

/* ═══════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════ */
function Services() {
  /* --- state --- */
  const [vehiclePrice, setVehiclePrice] = useState(50000)
  const [deposit, setDeposit] = useState(10000)
  const [duration, setDuration] = useState(48)
  /* --- dark bg override --- */
  useEffect(() => {
    const parent = document.querySelector('[data-theme="flowmotor"]')
    if (parent) {
      parent.style.backgroundColor = '#1A0F0F'
      parent.style.color = '#F4E8D8'
    }
    return () => {
      if (parent) {
        parent.style.backgroundColor = ''
        parent.style.color = ''
      }
    }
  }, [])

  /* --- credit calculation --- */
  const { monthly, totalCredit, amountBorrowed } = useMemo(() => {
    const monthlyRate = RATE / 12
    const amount = Math.max(vehiclePrice - deposit, 0)
    if (amount === 0) return { monthly: 0, totalCredit: 0, amountBorrowed: 0 }
    const m = amount * monthlyRate / (1 - Math.pow(1 + monthlyRate, -duration))
    const total = m * duration
    return {
      monthly: Math.round(m),
      totalCredit: Math.round(total - amount),
      amountBorrowed: amount,
    }
  }, [vehiclePrice, deposit, duration])

  /* --- clamp deposit if price drops below it --- */
  useEffect(() => {
    if (deposit > vehiclePrice) setDeposit(vehiclePrice)
  }, [vehiclePrice, deposit])

  /* --- slider progress CSS helper --- */
  const sliderProgress = (value, min, max) => {
    const pct = ((value - min) / (max - min)) * 100
    return `linear-gradient(to right, #C4A484 ${pct}%, rgba(255,255,255,0.1) ${pct}%)`
  }

  return (
    <main className="bg-[#1A0F0F] min-h-screen -mt-20 pt-20">
      <SEO
        title="Financement & Garantie"
        description="Simulez votre financement auto et decouvrez nos garanties premium jusqu'a 60 mois. Solutions sur-mesure pour votre projet automobile."
        url="/services"
      />

      {/* ── Range slider styles ── */}
      <style>{`
        .luxe-slider {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 6px;
          border-radius: 9999px;
          outline: none;
          cursor: pointer;
        }
        .luxe-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #C4A484;
          border: 3px solid #1A0F0F;
          box-shadow: 0 0 0 3px rgba(196,164,132,0.25), 0 2px 8px rgba(0,0,0,0.4);
          cursor: grab;
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .luxe-slider::-webkit-slider-thumb:hover {
          box-shadow: 0 0 0 5px rgba(196,164,132,0.35), 0 2px 12px rgba(0,0,0,0.5);
          transform: scale(1.1);
        }
        .luxe-slider::-webkit-slider-thumb:active {
          cursor: grabbing;
          transform: scale(0.95);
        }
        .luxe-slider::-moz-range-thumb {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #C4A484;
          border: 3px solid #1A0F0F;
          box-shadow: 0 0 0 3px rgba(196,164,132,0.25), 0 2px 8px rgba(0,0,0,0.4);
          cursor: grab;
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .luxe-slider::-moz-range-thumb:hover {
          box-shadow: 0 0 0 5px rgba(196,164,132,0.35), 0 2px 12px rgba(0,0,0,0.5);
        }
        .luxe-slider::-moz-range-track {
          height: 6px;
          border-radius: 9999px;
          background: transparent;
        }
        .luxe-slider:focus-visible::-webkit-slider-thumb {
          box-shadow: 0 0 0 4px rgba(196,164,132,0.5), 0 2px 8px rgba(0,0,0,0.4);
        }
      `}</style>

      {/* ══════════════════════════════════════
          HERO COMPACT
         ══════════════════════════════════════ */}
      <section className="relative overflow-hidden py-10 sm:py-12">
        {/* Ambient orbs */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#C4A484]/[0.04] blur-[120px]" />
          <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-[#C4A484]/[0.03] blur-[150px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#C4A484]/[0.02] blur-[180px]" />
        </div>

        <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-[#C4A484] font-sans font-medium">
            Financement & Garantie
          </p>
          <h1 className="mt-5 font-display text-4xl sm:text-5xl md:text-6xl text-white leading-tight">
            Financement & Garantie
          </h1>
          <p className="mt-5 text-lg text-white/50 max-w-2xl mx-auto leading-relaxed font-sans">
            Des solutions sur-mesure pour votre projet automobile
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-5 text-sm text-white/60">
            <span className="flex items-center gap-2">
              <Shield size={16} className="text-[#C4A484]" />
              Garantie jusqu&apos;a 5 ans
            </span>
            <span className="flex items-center gap-2">
              <CreditCard size={16} className="text-[#C4A484]" />
              Taux avantageux
            </span>
            <span className="flex items-center gap-2">
              <Clock size={16} className="text-[#C4A484]" />
              Reponse en 24h
            </span>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SIMULATEUR DE CREDIT
         ══════════════════════════════════════ */}
      <section className="relative py-10">
        {/* Watermark */}
        <img
          src="/assets/gears.svg"
          alt=""
          aria-hidden="true"
          className="absolute -left-40 top-1/2 -translate-y-1/2 w-[600px] h-auto opacity-[0.02] pointer-events-none select-none"
          style={{ filter: 'brightness(0) invert(1)' }}
        />

        <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C4A484]/10 text-[#C4A484] text-xs font-semibold tracking-wider uppercase mb-4">
              <Calculator size={14} />
              Simulateur
            </div>
            <h2 className="font-display text-3xl md:text-4xl text-white">
              Simulez votre financement
            </h2>
            <p className="mt-4 text-white/60 max-w-xl mx-auto font-sans">
              Ajustez les curseurs pour estimer votre mensualite en temps reel
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr] items-start">
            {/* ── Left column: Sliders ── */}
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-6 space-y-8">

              {/* Prix du vehicule */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-white/60 font-sans font-medium">Prix du vehicule</span>
                  <span className="font-display text-2xl text-[#C4A484] tabular-nums">
                    {fmtEUR(vehiclePrice)}
                  </span>
                </div>
                <input
                  type="range"
                  min={10000}
                  max={200000}
                  step={5000}
                  value={vehiclePrice}
                  onChange={(e) => setVehiclePrice(Number(e.target.value))}
                  className="luxe-slider"
                  style={{ background: sliderProgress(vehiclePrice, 10000, 200000) }}
                  aria-label="Prix du vehicule"
                />
                <div className="flex justify-between mt-2 text-xs text-white/25 font-sans tabular-nums">
                  <span>10 000 &euro;</span>
                  <span>200 000 &euro;</span>
                </div>
              </div>

              {/* Apport personnel */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-white/60 font-sans font-medium">Apport personnel</span>
                  <span className="font-display text-2xl text-[#C4A484] tabular-nums">
                    {fmtEUR(deposit)}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={vehiclePrice}
                  step={1000}
                  value={deposit}
                  onChange={(e) => setDeposit(Number(e.target.value))}
                  className="luxe-slider"
                  style={{ background: sliderProgress(deposit, 0, vehiclePrice) }}
                  aria-label="Apport personnel"
                />
                <div className="flex justify-between mt-2 text-xs text-white/25 font-sans tabular-nums">
                  <span>0 &euro;</span>
                  <span>{fmtEUR(vehiclePrice)}</span>
                </div>
              </div>

              {/* Duree */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-white/60 font-sans font-medium">Duree du financement</span>
                  <span className="font-display text-2xl text-[#C4A484] tabular-nums">
                    {duration} mois
                  </span>
                </div>
                <input
                  type="range"
                  min={12}
                  max={72}
                  step={6}
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="luxe-slider"
                  style={{ background: sliderProgress(duration, 12, 72) }}
                  aria-label="Duree du financement"
                />

                {/* Duration chips */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {DURATIONS.map((d) => (
                    <button
                      key={d}
                      onClick={() => setDuration(d)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold font-sans tabular-nums transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#C4A484]/50 ${
                        duration === d
                          ? 'bg-[#C4A484] text-[#1A0F0F]'
                          : 'bg-white/[0.05] text-white/60 hover:bg-white/[0.08] hover:text-white/60'
                      }`}
                      aria-label={`${d} mois`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Right column: Result card ── */}
            <div className="bg-white/[0.05] backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-6 flex flex-col justify-between lg:sticky lg:top-28">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/60 font-sans text-center">
                  Votre mensualite estimee
                </p>

                <div className="mt-6 text-center">
                  <span className="font-display text-5xl sm:text-6xl text-[#C4A484] tabular-nums leading-none">
                    {amountBorrowed === 0 ? '0' : monthly.toLocaleString('fr-FR')}
                  </span>
                  <span className="text-xl text-[#C4A484]/60 font-display ml-2">&euro;/mois</span>
                </div>

                {/* Detail rows */}
                <div className="mt-8 space-y-4">
                  <div className="flex justify-between text-base border-b border-white/5 pb-3">
                    <span className="text-white/60">Montant emprunté</span>
                    <span className="text-[#F4E8D8] font-medium tabular-nums">{fmtEUR(amountBorrowed)}</span>
                  </div>
                  <div className="flex justify-between text-base border-b border-white/5 pb-3">
                    <span className="text-white/60">Durée</span>
                    <span className="text-[#F4E8D8] font-medium tabular-nums">{duration} mois</span>
                  </div>
                  <div className="flex justify-between text-base border-b border-white/5 pb-3">
                    <span className="text-white/60">Taux indicatif</span>
                    <span className="text-[#F4E8D8] font-medium">4,9 %</span>
                  </div>
                  <div className="flex justify-between text-base">
                    <span className="text-white/60">Coût total du crédit</span>
                    <span className="text-[#C4A484] font-semibold tabular-nums">{fmtEUR(totalCredit)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <Link
                  to="/contact?subject=financement"
                  className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-[#C4A484] text-[#1A0F0F] font-semibold text-sm tracking-wide hover:bg-[#d4b494] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#C4A484]/50"
                >
                  Demander un devis financement
                  <ArrowRight size={16} />
                </Link>
                <p className="text-[10px] text-white/25 text-center leading-relaxed">
                  Simulation indicative, non contractuelle. Taux et conditions sous reserve d&apos;acceptation par l&apos;organisme preteur.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FAQ FINANCEMENT
         ══════════════════════════════════════ */}
      <section className="relative py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C4A484]/10 text-[#C4A484] text-xs font-semibold tracking-wider uppercase mb-4">
              <HelpCircle size={14} />
              FAQ
            </div>
            <h2 className="font-display text-3xl md:text-4xl text-white">
              Questions frequentes
            </h2>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <FAQItem key={i} question={item.q} answer={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          TABLEAU COMPARATIF GARANTIES
         ══════════════════════════════════════ */}
      <section className="relative py-10 overflow-hidden">
        {/* Watermark */}
        <img
          src="/assets/gear-motion.svg"
          alt=""
          aria-hidden="true"
          className="absolute -right-32 bottom-0 w-[450px] h-auto opacity-[0.02] pointer-events-none select-none -rotate-12"
          style={{ filter: 'brightness(0) invert(1)' }}
        />

        <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C4A484]/10 text-[#C4A484] text-xs font-semibold tracking-wider uppercase mb-4">
              <Shield size={14} />
              Protection
            </div>
            <h2 className="font-display text-3xl md:text-4xl text-white">
              Nos Garanties
            </h2>
            <p className="mt-4 text-white/60 max-w-xl mx-auto font-sans">
              Partenariat Opteven, leader europeen de la garantie panne mecanique
            </p>
          </div>

          {/* ── Desktop: comparison table ── */}
          <div className="hidden lg:block">
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="py-6 px-8 text-left text-sm text-white/60 font-sans font-medium w-[240px]">
                      Couverture
                    </th>
                    <th className="py-6 px-6 text-center">
                      <span className="font-display text-xl text-white">Essentielle</span>
                    </th>
                    <th className="py-6 px-6 text-center relative">
                      <span className="absolute -top-0 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 px-3 py-1 rounded-b-lg bg-[#C4A484]/20 text-[#C4A484] text-[10px] font-semibold tracking-wider uppercase">
                        <Sparkles size={10} />
                        Populaire
                      </span>
                      <span className="font-display text-xl text-white">Confort</span>
                    </th>
                    <th className="py-6 px-6 text-center relative bg-[#C4A484]/[0.05]">
                      <span className="absolute -top-0 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 px-3 py-1 rounded-b-lg bg-[#C4A484] text-[#1A0F0F] text-[10px] font-semibold tracking-wider uppercase">
                        <Sparkles size={10} />
                        Recommande
                      </span>
                      <span className="font-display text-xl text-white">Excellence</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {GUARANTEE_FEATURES.map((row, i) => (
                    <tr
                      key={i}
                      className={`border-b border-white/5 ${i === GUARANTEE_FEATURES.length - 1 ? 'border-b-0' : ''}`}
                    >
                      <td className="py-4 px-8 text-sm text-white/60 font-sans">{row.label}</td>
                      {['essential', 'confort', 'excellence'].map((tier) => (
                        <td
                          key={tier}
                          className={`py-4 px-6 text-center ${tier === 'excellence' ? 'bg-[#C4A484]/[0.05]' : ''}`}
                        >
                          {row.isText ? (
                            <span className={`text-sm font-medium ${tier === 'excellence' ? 'text-[#C4A484]' : 'text-[#F4E8D8]'}`}>
                              {row[tier]}
                            </span>
                          ) : row[tier] ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20">
                              <Check size={14} className="text-emerald-400" />
                            </span>
                          ) : (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/5">
                              <X size={14} className="text-white/20" />
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-white/10">
                    <td className="py-6 px-8" />
                    <td className="py-6 px-6 text-center">
                      <Link
                        to="/contact?subject=garantie"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[#C4A484]/30 text-[#C4A484] text-sm font-semibold hover:bg-[#C4A484] hover:text-[#1A0F0F] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#C4A484]/50"
                      >
                        Choisir
                        <ArrowRight size={14} />
                      </Link>
                    </td>
                    <td className="py-6 px-6 text-center">
                      <Link
                        to="/contact?subject=garantie"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[#C4A484]/30 text-[#C4A484] text-sm font-semibold hover:bg-[#C4A484] hover:text-[#1A0F0F] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#C4A484]/50"
                      >
                        Choisir
                        <ArrowRight size={14} />
                      </Link>
                    </td>
                    <td className="py-6 px-6 text-center bg-[#C4A484]/[0.05]">
                      <Link
                        to="/contact?subject=garantie"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#C4A484] text-[#1A0F0F] text-sm font-semibold hover:bg-[#d4b494] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#C4A484]/50"
                      >
                        Choisir
                        <ArrowRight size={14} />
                      </Link>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* ── Mobile/Tablet: stacked cards ── */}
          <div className="lg:hidden grid gap-4 sm:grid-cols-2">
            <GuaranteeCard
              tier="Essentielle"
              price="Incluse"
              features={GUARANTEE_FEATURES.filter((f) => !f.isText || f.label !== 'Prix').map((f) => ({
                label: f.label,
                value: f.isText ? f.essential : f.essential,
              }))}
            />
            <GuaranteeCard
              tier="Confort"
              badge="Populaire"
              price="+ 890 \u20AC"
              highlighted
              features={GUARANTEE_FEATURES.filter((f) => !f.isText || f.label !== 'Prix').map((f) => ({
                label: f.label,
                value: f.isText ? f.confort : f.confort,
              }))}
            />
            <GuaranteeCard
              tier="Excellence"
              badge="Recommande"
              price="+ 1 890 \u20AC"
              recommended
              features={GUARANTEE_FEATURES.filter((f) => !f.isText || f.label !== 'Prix').map((f) => ({
                label: f.label,
                value: f.isText ? f.excellence : f.excellence,
              }))}
            />
          </div>
        </div>
      </section>

      {/* ── Bottom spacer so footer connects smoothly ── */}
      <div className="h-8" />
    </main>
  )
}

export default Services
