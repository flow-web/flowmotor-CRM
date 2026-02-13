import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Phone, Mail, MapPin, Send, ChevronDown, CheckCircle, AlertCircle,
  Loader2, Clock, Globe, ArrowRight
} from 'lucide-react'
import { createLead } from '../../lib/supabase/leads'
import SEO from '../../components/SEO'

/* ─── Subject mapping ─── */
const SUBJECT_OPTIONS = [
  { value: 'achat', label: 'Achat vehicule' },
  { value: 'reprise', label: 'Reprise / Depot-vente' },
  { value: 'financement', label: 'Financement' },
  { value: 'garantie', label: 'Garantie' },
  { value: 'import', label: 'Import sur mesure' },
  { value: 'autre', label: 'Autre' },
]

const SUBJECT_ALIAS = {
  recherche: 'achat',
}

function mapSubjectParam(param) {
  if (!param) return ''
  const alias = SUBJECT_ALIAS[param]
  if (alias) return alias
  const found = SUBJECT_OPTIONS.find((o) => o.value === param)
  return found ? found.value : ''
}

/* ─── FAQ data ─── */
const FAQ_ITEMS = [
  {
    q: "Quels sont les delais d'importation ?",
    a: "Depuis la Suisse, comptez 2 a 3 semaines. Depuis le Japon, 6 a 8 semaines (transport maritime + dedouanement).",
  },
  {
    q: 'Quelles garanties sont incluses ?',
    a: "Chaque vehicule est expertise en 12 points. Garantie mecanique 6 mois incluse, extensible jusqu'a 24 mois.",
  },
  {
    q: 'Proposez-vous la livraison a domicile ?',
    a: 'Oui, livraison partout en France et en Suisse. Transport securise en camion ferme.',
  },
  {
    q: 'Peut-on combiner financement et reprise ?',
    a: "Bien sur. La valeur de reprise de votre ancien vehicule peut servir d'apport, reduisant ainsi le montant a financer et vos mensualites.",
  },
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

/* ═══════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════ */
function Contact() {
  const [searchParams] = useSearchParams()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: mapSubjectParam(searchParams.get('subject')),
    message: searchParams.get('vehicle')
      ? `Bonjour, je suis interesse(e) par le vehicule ${searchParams.get('vehicle')}. `
      : ''
  })
  const [status, setStatus] = useState('idle') // 'idle' | 'sending' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('')

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    setErrorMessage('')

    try {
      await createLead({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        subject: formData.subject,
        message: formData.message,
        vehicleId: searchParams.get('vehicleId') || null,
        vehicleLabel: searchParams.get('vehicle') || null,
        source: 'contact_form',
      })

      setStatus('success')
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
    } catch (err) {
      console.error('Erreur envoi formulaire:', err)
      setStatus('error')
      setErrorMessage('Une erreur est survenue. Veuillez reessayer ou nous contacter par telephone.')
    }
  }

  return (
    <main className="bg-[#1A0F0F] min-h-screen -mt-20 pt-20">
      <SEO
        title="Contact"
        description="Contactez FLOW MOTOR pour l'achat, l'import ou la recherche de votre vehicule sportif ou de collection. Base a Lyon et Geneve."
        url="/contact"
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
      `}</style>

      {/* ══════════════════════════════════════
          HERO
         ══════════════════════════════════════ */}
      <section className="relative overflow-hidden py-20 sm:py-24">
        {/* Ambient orbs */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#C4A484]/[0.04] blur-[120px]" />
          <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-[#C4A484]/[0.03] blur-[150px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#C4A484]/[0.02] blur-[180px]" />
        </div>

        {/* Watermark */}
        <img
          src="/assets/gears.svg"
          alt=""
          aria-hidden="true"
          className="absolute -right-40 -top-10 w-[500px] h-auto opacity-[0.02] pointer-events-none select-none rotate-45"
          style={{ filter: 'brightness(0) invert(1)' }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center" style={{ animation: 'fadeSlideUp 0.6s ease-out' }}>
          <p className="text-xs uppercase tracking-[0.3em] text-[#C4A484] font-sans font-medium">
            Conciergerie automobile
          </p>
          <h1 className="mt-5 font-display text-4xl sm:text-5xl md:text-6xl text-white leading-tight">
            Contactez-nous
          </h1>
          <p className="mt-5 text-lg text-white/50 max-w-2xl mx-auto leading-relaxed font-sans">
            Notre equipe vous accompagne pour l'achat, la reprise ou la recherche personnalisee
            de votre prochain vehicule d'exception.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-8 text-sm text-white/60">
            <span className="flex items-center gap-2">
              <Clock size={16} className="text-[#C4A484]" />
              Reponse sous 24h
            </span>
            <span className="flex items-center gap-2">
              <Globe size={16} className="text-[#C4A484]" />
              Lyon & Geneve
            </span>
            <span className="flex items-center gap-2">
              <Phone size={16} className="text-[#C4A484]" />
              Appel gratuit
            </span>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CONTACT GRID — 2 columns
         ══════════════════════════════════════ */}
      <section className="relative pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] items-start">

            {/* ── LEFT COLUMN: Contact Info + Hours + Map ── */}
            <div className="space-y-6" style={{ animation: 'fadeSlideUp 0.6s ease-out 0.1s both' }}>

              {/* Phone cards */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                {/* Lyon */}
                <a
                  href="tel:+33412345678"
                  className="group flex items-start gap-4 rounded-2xl border border-[#C4A484]/20 bg-white/[0.03] backdrop-blur-xl p-6 transition-all duration-300 hover:border-[#C4A484]/40 hover:shadow-lg hover:shadow-[#C4A484]/5"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#C4A484]/10 flex-shrink-0 transition-all duration-300 group-hover:bg-[#C4A484]/20">
                    <Phone size={20} className="text-[#C4A484]" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/40 font-sans font-medium mb-1">
                      Expertise Lyon
                    </p>
                    <p className="text-lg font-semibold text-[#F4E8D8] font-sans group-hover:text-[#C4A484] transition-colors duration-300">
                      +33 4 12 34 56 78
                    </p>
                  </div>
                </a>

                {/* Geneva */}
                <a
                  href="tel:+41221234567"
                  className="group flex items-start gap-4 rounded-2xl border border-[#C4A484]/20 bg-white/[0.03] backdrop-blur-xl p-6 transition-all duration-300 hover:border-[#C4A484]/40 hover:shadow-lg hover:shadow-[#C4A484]/5"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#C4A484]/10 flex-shrink-0 transition-all duration-300 group-hover:bg-[#C4A484]/20">
                    <Phone size={20} className="text-[#C4A484]" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/40 font-sans font-medium mb-1">
                      Expertise Geneve
                    </p>
                    <p className="text-lg font-semibold text-[#F4E8D8] font-sans group-hover:text-[#C4A484] transition-colors duration-300">
                      +41 22 123 45 67
                    </p>
                  </div>
                </a>
              </div>

              {/* Email card */}
              <a
                href="mailto:contact@flowmotor.fr"
                className="group flex items-start gap-4 rounded-2xl border border-[#C4A484]/20 bg-white/[0.03] backdrop-blur-xl p-6 transition-all duration-300 hover:border-[#C4A484]/40 hover:shadow-lg hover:shadow-[#C4A484]/5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#C4A484]/10 flex-shrink-0 transition-all duration-300 group-hover:bg-[#C4A484]/20">
                  <Mail size={20} className="text-[#C4A484]" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/40 font-sans font-medium mb-1">
                    Email
                  </p>
                  <p className="text-lg font-semibold text-[#F4E8D8] font-sans group-hover:text-[#C4A484] transition-colors duration-300">
                    contact@flowmotor.fr
                  </p>
                </div>
              </a>

              {/* Addresses + Hours card */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 space-y-6">
                {/* Addresses */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C4A484]/10">
                      <MapPin size={18} className="text-[#C4A484]" />
                    </div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/40 font-sans font-medium">
                      Nos showrooms
                    </p>
                  </div>
                  <div className="space-y-3 pl-[52px]">
                    <div>
                      <p className="text-sm font-medium text-[#F4E8D8]">Lyon, France</p>
                      <p className="text-xs text-white/40 mt-0.5">69 Rhone-Alpes</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#F4E8D8]">Geneve, Suisse</p>
                      <p className="text-xs text-white/40 mt-0.5">Canton de Geneve</p>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-white/5" />

                {/* Hours */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C4A484]/10">
                      <Clock size={18} className="text-[#C4A484]" />
                    </div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/40 font-sans font-medium">
                      Horaires d'ouverture
                    </p>
                  </div>
                  <div className="space-y-3 pl-[52px] text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-white/60">Lundi - Vendredi</span>
                      <span className="font-semibold text-[#F4E8D8] tabular-nums">9h - 19h</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/60">Samedi</span>
                      <span className="font-semibold text-[#F4E8D8] tabular-nums">10h - 17h</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/40">Dimanche</span>
                      <span className="text-white/40 text-xs">Sur rendez-vous</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map placeholder */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl overflow-hidden">
                <div className="relative aspect-[16/10] bg-[#0D0707]">
                  {/* Dark styled map placeholder */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {/* Decorative grid lines */}
                    <div className="absolute inset-0 opacity-[0.03]" style={{
                      backgroundImage: `
                        linear-gradient(rgba(196,164,132,0.3) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(196,164,132,0.3) 1px, transparent 1px)
                      `,
                      backgroundSize: '40px 40px'
                    }} />

                    {/* Location pins */}
                    <div className="relative w-full h-full">
                      {/* Lyon */}
                      <div className="absolute top-[40%] left-[35%] flex flex-col items-center gap-1">
                        <div className="relative">
                          <div className="w-3 h-3 rounded-full bg-[#C4A484] shadow-lg shadow-[#C4A484]/30" />
                          <div className="absolute inset-0 w-3 h-3 rounded-full bg-[#C4A484] animate-ping opacity-40" />
                        </div>
                        <span className="text-[10px] text-[#C4A484] font-semibold tracking-wider uppercase whitespace-nowrap mt-1">
                          Lyon
                        </span>
                      </div>

                      {/* Geneva */}
                      <div className="absolute top-[35%] right-[30%] flex flex-col items-center gap-1">
                        <div className="relative">
                          <div className="w-3 h-3 rounded-full bg-[#C4A484] shadow-lg shadow-[#C4A484]/30" />
                          <div className="absolute inset-0 w-3 h-3 rounded-full bg-[#C4A484] animate-ping opacity-40" style={{ animationDelay: '0.5s' }} />
                        </div>
                        <span className="text-[10px] text-[#C4A484] font-semibold tracking-wider uppercase whitespace-nowrap mt-1">
                          Geneve
                        </span>
                      </div>

                      {/* Decorative connection line */}
                      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <line x1="37" y1="42" x2="68" y2="37" stroke="#C4A484" strokeWidth="0.3" strokeDasharray="2 2" opacity="0.3" />
                      </svg>
                    </div>
                  </div>

                  {/* Bottom gradient */}
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#0D0707] to-transparent" />
                </div>

                <div className="p-4 flex items-center justify-between">
                  <span className="text-xs text-white/30 font-sans">
                    2 showrooms en France & Suisse
                  </span>
                  <span className="text-xs text-[#C4A484]/50 font-sans flex items-center gap-1">
                    <MapPin size={12} />
                    Sur rendez-vous
                  </span>
                </div>
              </div>
            </div>

            {/* ── RIGHT COLUMN: Contact Form ── */}
            <div
              className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 sm:p-8 lg:sticky lg:top-28"
              style={{ animation: 'fadeSlideUp 0.6s ease-out 0.2s both' }}
            >
              <div className="text-center mb-8">
                <h2 className="font-display text-2xl sm:text-3xl text-white">
                  Envoyez-nous un message
                </h2>
                <p className="mt-2 text-sm text-white/40 font-sans">
                  Notre equipe vous repondra sous 24 heures
                </p>
              </div>

              {/* Success state */}
              {status === 'success' && (
                <div
                  className="mb-6 p-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex items-start gap-3"
                  style={{ animation: 'fadeSlideUp 0.3s ease-out' }}
                >
                  <CheckCircle size={20} className="flex-shrink-0 text-emerald-400 mt-0.5" />
                  <div>
                    <p className="font-semibold text-emerald-400 text-sm">Message envoye avec succes !</p>
                    <p className="mt-1 text-xs text-emerald-400/60">Notre equipe vous repondra sous 24h.</p>
                  </div>
                </div>
              )}

              {/* Error state */}
              {status === 'error' && (
                <div
                  className="mb-6 p-5 rounded-xl border border-red-500/30 bg-red-500/10 flex items-start gap-3"
                  style={{ animation: 'fadeSlideUp 0.3s ease-out' }}
                >
                  <AlertCircle size={20} className="flex-shrink-0 text-red-400 mt-0.5" />
                  <p className="text-sm text-red-400">{errorMessage}</p>
                </div>
              )}

              {/* Form */}
              {status !== 'success' ? (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name + Email row */}
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs uppercase tracking-[0.15em] text-white/40 font-sans font-medium mb-2">
                        Nom complet
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Votre nom"
                        required
                        className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3.5 text-sm text-[#F4E8D8] placeholder-white/25 outline-none transition-all duration-300 focus:border-[#C4A484]/60 focus:ring-2 focus:ring-[#C4A484]/20 focus:bg-white/[0.07] font-sans"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-[0.15em] text-white/40 font-sans font-medium mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="vous@email.com"
                        required
                        className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3.5 text-sm text-[#F4E8D8] placeholder-white/25 outline-none transition-all duration-300 focus:border-[#C4A484]/60 focus:ring-2 focus:ring-[#C4A484]/20 focus:bg-white/[0.07] font-sans"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs uppercase tracking-[0.15em] text-white/40 font-sans font-medium mb-2">
                      Telephone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="06 12 34 56 78"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3.5 text-sm text-[#F4E8D8] placeholder-white/25 outline-none transition-all duration-300 focus:border-[#C4A484]/60 focus:ring-2 focus:ring-[#C4A484]/20 focus:bg-white/[0.07] font-sans"
                    />
                  </div>

                  {/* Subject — clickable chip buttons (No Write, Just Click) */}
                  <div>
                    <label className="block text-xs uppercase tracking-[0.15em] text-white/40 font-sans font-medium mb-3">
                      Sujet
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {SUBJECT_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, subject: opt.value })}
                          className={`px-4 py-2 rounded-xl text-sm font-sans font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#C4A484]/50 ${
                            formData.subject === opt.value
                              ? 'bg-[#C4A484] text-[#1A0F0F] shadow-lg shadow-[#C4A484]/20'
                              : 'border border-white/10 bg-white/[0.03] text-white/50 hover:border-[#C4A484]/30 hover:text-white/70'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                    {/* Hidden input for form validation */}
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      required
                      tabIndex={-1}
                      className="sr-only"
                      onChange={() => {}}
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs uppercase tracking-[0.15em] text-white/40 font-sans font-medium mb-2">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Decrivez votre projet..."
                      required
                      rows={5}
                      className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3.5 text-sm text-[#F4E8D8] placeholder-white/25 outline-none transition-all duration-300 focus:border-[#C4A484]/60 focus:ring-2 focus:ring-[#C4A484]/20 focus:bg-white/[0.07] font-sans resize-none"
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-[#C4A484] text-[#1A0F0F] font-semibold text-sm tracking-wide hover:bg-[#D4BC9A] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#C4A484]/50 shadow-lg shadow-[#C4A484]/10 hover:shadow-[#C4A484]/20"
                  >
                    {status === 'sending' ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        Envoyer le message
                      </>
                    )}
                  </button>

                  <p className="text-[10px] text-white/25 text-center leading-relaxed">
                    En soumettant ce formulaire, vous acceptez d'etre contacte par notre equipe commerciale.
                  </p>
                </form>
              ) : (
                /* Send another message button */
                <button
                  onClick={() => setStatus('idle')}
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl border border-[#C4A484]/30 text-[#C4A484] text-sm font-semibold hover:bg-[#C4A484] hover:text-[#1A0F0F] transition-all duration-300 mt-4 focus:outline-none focus:ring-2 focus:ring-[#C4A484]/50"
                >
                  Envoyer un autre message
                  <ArrowRight size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FAQ SECTION
         ══════════════════════════════════════ */}
      <section className="relative py-20 border-t border-white/5">
        {/* Watermark */}
        <img
          src="/assets/gear-motion.svg"
          alt=""
          aria-hidden="true"
          className="absolute -left-32 bottom-10 w-[400px] h-auto opacity-[0.02] pointer-events-none select-none"
          style={{ filter: 'brightness(0) invert(1)' }}
        />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C4A484]/10 text-[#C4A484] text-xs font-semibold tracking-wider uppercase mb-4">
              <ChevronDown size={14} />
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

      {/* ── Bottom spacer so footer connects smoothly ── */}
      <div className="h-8" />
    </main>
  )
}

export default Contact
