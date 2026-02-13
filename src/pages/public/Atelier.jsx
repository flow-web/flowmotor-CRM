import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Search, Car, Banknote, TrendingUp, ArrowRight, ArrowLeft,
  ChevronRight, Check, Phone, Mail, User, MapPin, Shield,
  Clock, Star, Sparkles, X, Loader2
} from 'lucide-react'
import SEO from '../../components/SEO'
import { createLead } from '../../lib/supabase/leads'

/* ─────────────────────────────────────────────
   CONSTANTS
   ───────────────────────────────────────────── */

const POPULAR_BRANDS = [
  'Audi', 'BMW', 'Mercedes', 'Porsche', 'Toyota',
  'Nissan', 'Volkswagen', 'Peugeot', 'Renault', 'Citroen'
]

const YEAR_OPTIONS = Array.from({ length: 30 }, (_, i) => {
  const y = new Date().getFullYear() - i
  return { value: String(y), label: String(y) }
})

const MILEAGE_RANGES = [
  { value: '0-10000', label: 'Moins de 10 000 km' },
  { value: '10000-30000', label: '10 000 - 30 000 km' },
  { value: '30000-60000', label: '30 000 - 60 000 km' },
  { value: '60000-100000', label: '60 000 - 100 000 km' },
  { value: '100000-150000', label: '100 000 - 150 000 km' },
  { value: '150000+', label: 'Plus de 150 000 km' },
]

/* ─────────────────────────────────────────────
   FRENCH LICENSE PLATE COMPONENT
   ───────────────────────────────────────────── */

function LicensePlateInput({ value, onChange, onSubmit }) {
  const formatPlate = (raw) => {
    const clean = raw.toUpperCase().replace(/[^A-Z0-9]/g, '')
    if (clean.length <= 2) return clean
    if (clean.length <= 5) return clean.slice(0, 2) + '-' + clean.slice(2)
    return clean.slice(0, 2) + '-' + clean.slice(2, 5) + '-' + clean.slice(5, 7)
  }

  const handleChange = (e) => {
    const formatted = formatPlate(e.target.value.replace(/-/g, ''))
    if (formatted.replace(/-/g, '').length <= 7) {
      onChange(formatted)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      onSubmit()
    }
  }

  return (
    <div className="relative mx-auto max-w-md">
      <div
        className="flex items-stretch overflow-hidden rounded-lg border-2 border-[#003DA5]/60 shadow-lg shadow-black/30"
        style={{ height: '64px' }}
      >
        {/* Blue band left */}
        <div className="flex w-12 flex-col items-center justify-center bg-[#003DA5] text-white">
          <span className="text-[10px] font-bold leading-none">F</span>
          <div className="mt-0.5 h-3 w-4 overflow-hidden rounded-sm bg-white/20 flex items-center justify-center">
            <span className="text-[6px] font-bold text-white/90">EU</span>
          </div>
        </div>

        {/* Main plate area */}
        <div className="flex flex-1 items-center bg-white px-4">
          <input
            type="text"
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="AA-123-BB"
            className="w-full bg-transparent text-center font-mono text-2xl font-bold tracking-[0.15em] text-[#1A1A1A] placeholder-gray-300 outline-none sm:text-3xl"
            maxLength={9}
            autoComplete="off"
            spellCheck={false}
          />
        </div>

        {/* Blue band right */}
        <div className="flex w-12 flex-col items-center justify-center bg-[#003DA5] text-white">
          <span className="text-[8px] font-semibold leading-none opacity-60">69</span>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   STEP INDICATOR
   ───────────────────────────────────────────── */

function StepIndicator({ current, total }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-all duration-300 ${
              i < current
                ? 'bg-[#C4A484] text-[#1A0F0F]'
                : i === current
                  ? 'bg-[#C4A484]/20 text-[#C4A484] ring-2 ring-[#C4A484]/40'
                  : 'bg-white/5 text-white/30'
            }`}
          >
            {i < current ? <Check size={14} /> : i + 1}
          </div>
          {i < total - 1 && (
            <div
              className={`h-px w-8 transition-all duration-300 sm:w-12 ${
                i < current ? 'bg-[#C4A484]/60' : 'bg-white/10'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
   ───────────────────────────────────────────── */

export default function Atelier() {
  const navigate = useNavigate()

  // --- State ---
  const [plateValue, setPlateValue] = useState('')
  const [plateSubmitted, setPlateSubmitted] = useState(false)
  const [showWizard, setShowWizard] = useState(false)
  const [wizardStep, setWizardStep] = useState(0)
  const [status, setStatus] = useState('idle') // idle | sending | success | error

  // Wizard data
  const [selectedBrand, setSelectedBrand] = useState('')
  const [customBrand, setCustomBrand] = useState('')
  const [model, setModel] = useState('')
  const [year, setYear] = useState('')
  const [mileage, setMileage] = useState('')
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')

  // Override PublicLayout cream background to dark
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

  // --- Handlers ---
  const handlePlateSubmit = () => {
    if (plateValue.replace(/-/g, '').length >= 4) {
      setPlateSubmitted(true)
    }
  }

  const activeBrand = selectedBrand === 'Autre' ? customBrand : selectedBrand

  const canGoStep2 = !!activeBrand
  const canGoStep3 = !!model.trim() && !!year && !!mileage
  const canSubmit = !!contactName.trim() && !!contactEmail.trim()

  const handleWizardSubmit = async () => {
    setStatus('sending')
    try {
      const vehicleDetails = [
        `Marque : ${activeBrand}`,
        `Modele : ${model}`,
        `Annee : ${year}`,
        `Kilometrage : ${mileage}`,
      ].join('\n')

      await createLead({
        name: contactName,
        email: contactEmail,
        phone: contactPhone || null,
        subject: 'reprise',
        message: vehicleDetails,
        source: 'estimation_flash',
      })

      setStatus('success')
    } catch (err) {
      console.error('Erreur envoi estimation:', err)
      setStatus('error')
    }
  }

  const resetWizard = () => {
    setShowWizard(false)
    setWizardStep(0)
    setSelectedBrand('')
    setCustomBrand('')
    setModel('')
    setYear('')
    setMileage('')
    setContactName('')
    setContactEmail('')
    setContactPhone('')
    setPlateSubmitted(false)
    setPlateValue('')
    setStatus('idle')
  }

  /* ─────────────────────────────────────────
     WIZARD STEP RENDERERS
     ───────────────────────────────────────── */

  const renderStep1 = () => (
    <div className="space-y-6" style={{ animation: 'fadeSlideUp 0.4s ease-out' }}>
      <div className="text-center">
        <h3 className="font-display text-xl font-semibold text-[#F4E8D8]">
          Quelle est la marque ?
        </h3>
        <p className="mt-1 text-sm text-white/40">Selectionnez ou choisissez "Autre"</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
        {POPULAR_BRANDS.map((brand) => (
          <button
            key={brand}
            type="button"
            onClick={() => { setSelectedBrand(brand); setCustomBrand('') }}
            className={`rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
              selectedBrand === brand
                ? 'bg-[#C4A484] text-[#1A0F0F] shadow-lg shadow-[#C4A484]/20'
                : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            {brand}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setSelectedBrand('Autre')}
          className={`rounded-xl border border-dashed px-4 py-3 text-sm font-medium transition-all duration-300 ${
            selectedBrand === 'Autre'
              ? 'border-[#C4A484] bg-[#C4A484]/10 text-[#C4A484]'
              : 'border-white/20 text-white/50 hover:border-white/40 hover:text-white/70'
          }`}
        >
          Autre...
        </button>
      </div>

      {selectedBrand === 'Autre' && (
        <div className="mx-auto max-w-xs" style={{ animation: 'fadeSlideUp 0.3s ease-out' }}>
          <input
            type="text"
            value={customBrand}
            onChange={(e) => setCustomBrand(e.target.value)}
            placeholder="Saisissez la marque"
            className="input-showroom w-full text-center"
            autoFocus
          />
        </div>
      )}
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6" style={{ animation: 'fadeSlideUp 0.4s ease-out' }}>
      <div className="text-center">
        <h3 className="font-display text-xl font-semibold text-[#F4E8D8]">
          Decrivez votre {activeBrand}
        </h3>
        <p className="mt-1 text-sm text-white/40">Modele, annee et kilometrage</p>
      </div>

      <div className="mx-auto max-w-lg space-y-4">
        {/* Model */}
        <div>
          <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-white/40">
            Modele
          </label>
          <input
            type="text"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder={`Ex: ${activeBrand === 'Porsche' ? '911 GT3' : activeBrand === 'BMW' ? 'M3 Competition' : 'Nom du modele'}`}
            className="input-showroom w-full"
            autoFocus
          />
        </div>

        {/* Year */}
        <div>
          <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-white/40">
            Annee
          </label>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="select-showroom w-full"
          >
            <option value="">Selectionnez l'annee</option>
            {YEAR_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Mileage */}
        <div>
          <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-white/40">
            Kilometrage
          </label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {MILEAGE_RANGES.map((range) => (
              <button
                key={range.value}
                type="button"
                onClick={() => setMileage(range.value)}
                className={`rounded-lg px-3 py-2.5 text-xs font-medium transition-all duration-300 ${
                  mileage === range.value
                    ? 'bg-[#C4A484] text-[#1A0F0F] shadow-lg shadow-[#C4A484]/20'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6" style={{ animation: 'fadeSlideUp 0.4s ease-out' }}>
      <div className="text-center">
        <h3 className="font-display text-xl font-semibold text-[#F4E8D8]">
          Vos coordonnees
        </h3>
        <p className="mt-1 text-sm text-white/40">Pour recevoir votre estimation personnalisee</p>
      </div>

      <div className="mx-auto max-w-md space-y-4">
        {/* Name */}
        <div className="relative">
          <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            placeholder="Votre nom"
            className="input-showroom w-full pl-10"
            autoFocus
          />
        </div>

        {/* Email */}
        <div className="relative">
          <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            placeholder="Votre email"
            className="input-showroom w-full pl-10"
          />
        </div>

        {/* Phone */}
        <div className="relative">
          <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="tel"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
            placeholder="Telephone (optionnel)"
            className="input-showroom w-full pl-10"
          />
        </div>
      </div>

      {/* Summary card */}
      <div className="mx-auto max-w-md rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <p className="mb-2 text-xs uppercase tracking-[0.15em] text-white/40">Recapitulatif</p>
        <div className="space-y-1 text-sm text-white/70">
          <p><span className="text-[#C4A484]">{activeBrand}</span> {model}</p>
          <p>Annee {year} — {MILEAGE_RANGES.find(r => r.value === mileage)?.label}</p>
        </div>
      </div>
    </div>
  )

  /* ─────────────────────────────────────────
     SUCCESS / ERROR SCREENS
     ───────────────────────────────────────── */

  const renderSuccess = () => (
    <div className="py-12 text-center" style={{ animation: 'fadeSlideUp 0.5s ease-out' }}>
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20">
        <Check size={28} className="text-emerald-400" />
      </div>
      <h3 className="font-display text-2xl font-semibold text-[#F4E8D8]">
        Demande envoyee !
      </h3>
      <p className="mx-auto mt-3 max-w-md text-sm text-white/50 leading-relaxed">
        Notre equipe vous contactera sous 24h avec une estimation personnalisee
        pour votre {activeBrand} {model}.
      </p>
      <button
        onClick={resetWizard}
        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white/5 px-6 py-3 text-sm font-medium text-white/70 transition-all duration-300 hover:bg-white/10 hover:text-white"
      >
        Nouvelle estimation
      </button>
    </div>
  )

  const renderError = () => (
    <div className="py-12 text-center" style={{ animation: 'fadeSlideUp 0.5s ease-out' }}>
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
        <X size={28} className="text-red-400" />
      </div>
      <h3 className="font-display text-2xl font-semibold text-[#F4E8D8]">
        Une erreur est survenue
      </h3>
      <p className="mx-auto mt-3 max-w-md text-sm text-white/50 leading-relaxed">
        Veuillez reessayer ou nous contacter directement par telephone.
      </p>
      <div className="mt-8 flex items-center justify-center gap-3">
        <button
          onClick={() => setStatus('idle')}
          className="inline-flex items-center gap-2 rounded-xl bg-white/5 px-6 py-3 text-sm font-medium text-white/70 transition-all duration-300 hover:bg-white/10 hover:text-white"
        >
          Reessayer
        </button>
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 rounded-xl bg-[#C4A484] px-6 py-3 text-sm font-semibold text-[#1A0F0F] transition-all duration-300 hover:bg-[#D4BC9A]"
        >
          Nous contacter
        </Link>
      </div>
    </div>
  )

  /* ─────────────────────────────────────────
     RENDER
     ───────────────────────────────────────── */

  return (
    <main className="relative min-h-screen bg-[#1A0F0F] text-[#F4E8D8]">
      <SEO
        title="Estimation Flash - Reprise Auto"
        description="Obtenez une estimation gratuite de votre vehicule en 30 secondes. Reprise cash ou depot-vente premium avec Flow Motor, Lyon."
        url="/atelier"
      />

      {/* Inline keyframes */}
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes orbFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -20px) scale(1.05); }
          66% { transform: translate(-20px, 10px) scale(0.95); }
        }
        @keyframes shimmer {
          0% { opacity: 0.3; }
          50% { opacity: 0.6; }
          100% { opacity: 0.3; }
        }
      `}</style>

      {/* ═══════════════════════════════════════
          SECTION 1 — HERO + ESTIMATION FLASH
          ═══════════════════════════════════════ */}
      <section className="relative overflow-hidden pb-16 pt-24 sm:pt-32">
        {/* Ambient orbs */}
        <div
          className="pointer-events-none absolute left-1/4 top-1/4 h-[400px] w-[400px] rounded-full opacity-[0.07]"
          style={{
            background: 'radial-gradient(circle, #C4A484 0%, transparent 70%)',
            animation: 'orbFloat 12s ease-in-out infinite',
          }}
        />
        <div
          className="pointer-events-none absolute right-1/4 top-1/2 h-[300px] w-[300px] rounded-full opacity-[0.05]"
          style={{
            background: 'radial-gradient(circle, #C4A484 0%, transparent 70%)',
            animation: 'orbFloat 15s ease-in-out infinite reverse',
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Hero text */}
          <div className="text-center" style={{ animation: 'fadeSlideUp 0.6s ease-out' }}>
            <p className="text-xs uppercase tracking-[0.3em] text-[#C4A484]">
              Estimation gratuite
            </p>
            <h1 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Estimation Flash
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base text-white/50 leading-relaxed sm:text-lg">
              Obtenez une estimation gratuite en 30 secondes.
              <br className="hidden sm:block" />
              Reprise cash ou depot-vente premium.
            </p>
          </div>

          {/* ─── Estimation Card ─── */}
          <div
            className="mx-auto mt-12 max-w-2xl rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl sm:p-8 lg:p-10"
            style={{ animation: 'fadeSlideUp 0.7s ease-out 0.1s both' }}
          >
            {status === 'success' ? renderSuccess()
              : status === 'error' ? renderError()
              : !showWizard ? (
              <>
                {/* OPTION A — License Plate */}
                {!plateSubmitted ? (
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#C4A484]/10">
                        <Search size={20} className="text-[#C4A484]" />
                      </div>
                      <h2 className="font-display text-xl font-semibold sm:text-2xl">
                        Entrez votre plaque d'immatriculation
                      </h2>
                      <p className="mt-2 text-sm text-white/40">
                        Recherche via le fichier des immatriculations
                      </p>
                    </div>

                    <LicensePlateInput
                      value={plateValue}
                      onChange={setPlateValue}
                      onSubmit={handlePlateSubmit}
                    />

                    <button
                      onClick={handlePlateSubmit}
                      disabled={plateValue.replace(/-/g, '').length < 4}
                      className="mx-auto flex w-full max-w-md items-center justify-center gap-2 rounded-xl bg-[#C4A484] px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-[#1A0F0F] transition-all duration-300 hover:bg-[#D4BC9A] hover:shadow-lg hover:shadow-[#C4A484]/20 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Estimer ma voiture
                      <ArrowRight size={16} />
                    </button>

                    {/* Divider */}
                    <div className="relative py-2">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/10" />
                      </div>
                      <div className="relative flex justify-center">
                        <span className="bg-[#1A0F0F] px-4 text-xs text-white/30">ou</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowWizard(true)}
                      className="mx-auto flex items-center gap-2 text-sm text-[#C4A484]/70 transition-all duration-300 hover:text-[#C4A484]"
                    >
                      Je n'ai pas ma plaque
                      <ChevronRight size={14} />
                    </button>
                  </div>
                ) : (
                  /* Plate submitted — coming soon */
                  <div className="py-8 text-center" style={{ animation: 'fadeSlideUp 0.4s ease-out' }}>
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#C4A484]/10">
                      <Car size={28} className="text-[#C4A484]" />
                    </div>
                    <h3 className="font-display text-xl font-semibold">
                      Fonctionnalite bientot disponible
                    </h3>
                    <p className="mx-auto mt-3 max-w-sm text-sm text-white/50 leading-relaxed">
                      La recherche par plaque sera disponible prochainement.
                      En attendant, utilisez notre formulaire rapide ou contactez-nous.
                    </p>
                    <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                      <button
                        onClick={() => { setPlateSubmitted(false); setShowWizard(true) }}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#C4A484] px-6 py-3 text-sm font-semibold text-[#1A0F0F] transition-all duration-300 hover:bg-[#D4BC9A]"
                      >
                        Formulaire rapide
                        <ArrowRight size={14} />
                      </button>
                      <Link
                        to="/contact?subject=reprise"
                        className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-6 py-3 text-sm font-medium text-white/70 transition-all duration-300 hover:border-white/20 hover:text-white"
                      >
                        <Phone size={14} />
                        Nous contacter
                      </Link>
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* OPTION B — Wizard */
              <div>
                {/* Step indicator */}
                <div className="mb-8">
                  <StepIndicator current={wizardStep} total={3} />
                </div>

                {/* Steps */}
                {wizardStep === 0 && renderStep1()}
                {wizardStep === 1 && renderStep2()}
                {wizardStep === 2 && renderStep3()}

                {/* Navigation */}
                <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-6">
                  <button
                    onClick={() => {
                      if (wizardStep === 0) { setShowWizard(false) }
                      else { setWizardStep(wizardStep - 1) }
                    }}
                    className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm text-white/50 transition-all duration-300 hover:bg-white/5 hover:text-white/70"
                  >
                    <ArrowLeft size={14} />
                    {wizardStep === 0 ? 'Retour' : 'Precedent'}
                  </button>

                  {wizardStep < 2 ? (
                    <button
                      onClick={() => setWizardStep(wizardStep + 1)}
                      disabled={wizardStep === 0 ? !canGoStep2 : !canGoStep3}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#C4A484] px-6 py-2.5 text-sm font-semibold text-[#1A0F0F] transition-all duration-300 hover:bg-[#D4BC9A] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Suivant
                      <ArrowRight size={14} />
                    </button>
                  ) : (
                    <button
                      onClick={handleWizardSubmit}
                      disabled={!canSubmit || status === 'sending'}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#C4A484] px-6 py-2.5 text-sm font-semibold text-[#1A0F0F] transition-all duration-300 hover:bg-[#D4BC9A] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {status === 'sending' ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          Envoi...
                        </>
                      ) : (
                        <>
                          Recevoir mon estimation
                          <Sparkles size={14} />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SECTION 2 — NOS FORMULES
          ═══════════════════════════════════════ */}
      <section className="relative py-16 sm:py-24">
        {/* Subtle watermark */}
        <img
          src="/assets/gears.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 top-20 h-auto w-[500px] select-none opacity-[0.02]"
          style={{ filter: 'brightness(0) invert(1)' }}
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-[#C4A484]">Nos formules</p>
            <h2 className="mt-4 font-display text-3xl font-semibold sm:text-4xl">
              Deux solutions, un seul objectif
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-white/40 leading-relaxed">
              Maximiser la valeur de votre vehicule en toute serenite.
            </p>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            {/* Card 1 — Reprise Cash */}
            <div className="group rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:shadow-lg hover:shadow-black/20">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#C4A484]/10">
                  <Banknote size={22} className="text-[#C4A484]" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold">Reprise Cash</h3>
                  <p className="text-sm text-white/40">Paiement sous 48h</p>
                </div>
              </div>

              <ul className="mt-6 space-y-3">
                {[
                  'Evaluation gratuite et transparente',
                  'Paiement par virement sous 48h',
                  'Aucun frais ni commission',
                  'Demarches administratives prises en charge',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-white/60">
                    <Check size={14} className="mt-0.5 shrink-0 text-[#C4A484]" />
                    {item}
                  </li>
                ))}
              </ul>

              <a
                href="#top"
                onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 px-6 py-3 text-sm font-medium text-white/70 transition-all duration-300 hover:border-[#C4A484]/30 hover:text-[#C4A484]"
              >
                Demander une evaluation
                <ArrowRight size={14} />
              </a>
            </div>

            {/* Card 2 — Depot-Vente Premium (Recommande) */}
            <div className="group relative rounded-2xl border border-[#C4A484]/30 bg-white/[0.03] p-8 shadow-lg shadow-[#C4A484]/[0.05] ring-1 ring-[#C4A484]/20 backdrop-blur-xl transition-all duration-300 hover:border-[#C4A484]/40 hover:shadow-[#C4A484]/10">
              {/* Recommended badge */}
              <div className="absolute -top-3 right-6">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#C4A484] px-3 py-1 text-xs font-semibold text-[#1A0F0F]">
                  <Sparkles size={10} />
                  Recommande
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#C4A484]/10">
                  <TrendingUp size={22} className="text-[#C4A484]" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold">Depot-Vente Premium</h3>
                  <p className="text-sm text-white/40">Maximisez la valeur de votre vehicule</p>
                </div>
              </div>

              <ul className="mt-6 space-y-3">
                {[
                  'Photos et mise en valeur professionnelles',
                  'Diffusion multi-plateformes (LeBonCoin, LaCentrale...)',
                  'Negociation experte par nos equipes',
                  'Paiement securise a la vente',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-white/60">
                    <Check size={14} className="mt-0.5 shrink-0 text-[#C4A484]" />
                    {item}
                  </li>
                ))}
              </ul>

              <a
                href="#top"
                onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-[#C4A484] px-6 py-3 text-sm font-semibold text-[#1A0F0F] transition-all duration-300 hover:bg-[#D4BC9A] hover:shadow-lg hover:shadow-[#C4A484]/20"
              >
                Lancer un depot-vente
                <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SECTION 3 — REASSURANCE
          ═══════════════════════════════════════ */}
      <section className="border-t border-white/5 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-12">
            {[
              { number: '150+', label: 'Vehicules repris' },
              { number: '48h', label: 'Delai moyen de paiement' },
              { number: '100%', label: 'Clients satisfaits' },
            ].map((stat, i) => (
              <div
                key={i}
                className="text-center"
                style={{ animation: `fadeSlideUp 0.5s ease-out ${0.1 * i}s both` }}
              >
                <p className="font-display text-4xl font-bold text-[#C4A484] sm:text-5xl">
                  {stat.number}
                </p>
                <p className="mt-2 text-sm text-white/40 uppercase tracking-[0.1em]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
