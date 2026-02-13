import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Ship, Shield, ShoppingBag, ArrowRight, BookOpen,
  Clock, ChevronRight, Globe, Wrench, Star
} from 'lucide-react'
import SEO from '../../components/SEO'

/**
 * Guides - Index page for "Guides & Journal" section
 * Bento Grid layout with dark luxury theme
 * High-end magazine feel, Playfair Display headings, gold accents
 */

const GUIDES = [
  {
    slug: 'processus-import',
    title: 'Le processus d\'import en 5 etapes',
    subtitle: 'De la recherche du vehicule a la remise des cles, chaque etape de l\'importation expliquee en detail.',
    icon: Ship,
    readTime: 8,
    tag: 'Import',
    featured: true,
    gradient: 'from-[#C4A484]/[0.08] via-transparent to-transparent',
  },
  {
    slug: 'garanties',
    title: 'Nos garanties : Gold & Platinum',
    subtitle: 'Deux niveaux de protection mecanique pour rouler l\'esprit tranquille. Comparatif detaille.',
    icon: Shield,
    readTime: 6,
    tag: 'Garantie',
    featured: false,
    gradient: 'from-amber-500/[0.06] via-transparent to-transparent',
  },
  {
    slug: 'comment-acheter',
    title: 'Comment acheter chez Flow Motor',
    subtitle: 'Parcours d\'achat, financement, reprise : tout savoir avant de se lancer.',
    icon: ShoppingBag,
    readTime: 5,
    tag: 'Achat',
    featured: false,
    gradient: 'from-blue-500/[0.06] via-transparent to-transparent',
  },
]

const HIGHLIGHTS = [
  { icon: Globe, label: 'Import Suisse, Allemagne, Japon', sublabel: '3 marches sources' },
  { icon: Shield, label: 'Garantie 6 a 24 mois', sublabel: 'Protection mecanique' },
  { icon: Wrench, label: 'Inspection 120 points', sublabel: 'Expertise rigoureuse' },
  { icon: Star, label: '4.9/5 sur Google', sublabel: '50+ avis verifies' },
]

function GuideCard({ guide, index }) {
  const Icon = guide.icon
  const isFeatured = guide.featured

  return (
    <Link
      to={`/guides/${guide.slug}`}
      className={`
        group relative overflow-hidden rounded-2xl border bg-white/[0.02]
        transition-all duration-500
        hover:shadow-xl hover:shadow-[#C4A484]/[0.06]
        focus:outline-none focus:ring-2 focus:ring-[#C4A484]/50
        ${isFeatured
          ? 'md:col-span-2 border-[#C4A484]/15 hover:border-[#C4A484]/30'
          : 'border-white/[0.06] hover:border-[#C4A484]/20'
        }
      `}
      style={{ animation: `fadeSlideUp 0.5s ease-out ${0.1 + index * 0.1}s both` }}
    >
      {/* Ambient gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${guide.gradient} pointer-events-none`} />

      {/* Content */}
      <div className={`relative ${isFeatured ? 'p-8 sm:p-10' : 'p-6 sm:p-8'}`}>
        {/* Top row: Tag + Read time */}
        <div className="flex items-center justify-between mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C4A484]/10 text-[#C4A484] text-[10px] font-sans font-semibold uppercase tracking-wider">
            <BookOpen size={10} />
            {guide.tag}
          </span>
          <span className="flex items-center gap-1.5 text-[11px] text-white/30 font-sans">
            <Clock size={11} />
            {guide.readTime} min
          </span>
        </div>

        {/* Icon */}
        <div className={`
          flex items-center justify-center rounded-xl bg-[#C4A484]/10
          group-hover:bg-[#C4A484]/15 transition-colors duration-300 mb-6
          ${isFeatured ? 'w-14 h-14' : 'w-12 h-12'}
        `}>
          <Icon size={isFeatured ? 24 : 20} className="text-[#C4A484]" />
        </div>

        {/* Title */}
        <h3 className={`
          font-display text-white group-hover:text-[#C4A484] transition-colors duration-300 mb-3
          ${isFeatured ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'}
        `}>
          {guide.title}
        </h3>

        {/* Subtitle */}
        <p className={`
          text-white/40 font-sans leading-relaxed mb-6
          ${isFeatured ? 'text-base max-w-xl' : 'text-sm'}
        `}>
          {guide.subtitle}
        </p>

        {/* CTA */}
        <div className="flex items-center gap-2 text-sm text-[#C4A484]/70 font-sans font-medium group-hover:text-[#C4A484] transition-colors duration-300">
          <span>Lire le guide</span>
          <ArrowRight
            size={14}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </div>
      </div>

      {/* Decorative corner accent for featured */}
      {isFeatured && (
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#C4A484]/[0.03] rounded-bl-[100px] pointer-events-none" />
      )}
    </Link>
  )
}

export default function Guides() {
  // Dark bg override
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

  return (
    <main className="bg-[#1A0F0F] min-h-screen -mt-20 pt-20">
      <SEO
        title="Guides & Journal"
        description="Guides pratiques sur l'importation automobile, les garanties et le processus d'achat. Conseils d'experts par Flow Motor, specialiste import auto."
        url="/guides"
      />

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* ══════════════════════════════════════
          HERO SECTION
         ══════════════════════════════════════ */}
      <section className="relative overflow-hidden py-20 sm:py-28">
        {/* Ambient orbs */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#C4A484]/[0.04] blur-[120px]" />
          <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-[#C4A484]/[0.03] blur-[150px]" />
        </div>

        {/* Watermark */}
        <img
          src="/assets/gears.svg"
          alt=""
          aria-hidden="true"
          className="absolute -right-40 top-10 w-[500px] h-auto opacity-[0.02] pointer-events-none select-none rotate-12"
          style={{ filter: 'brightness(0) invert(1)' }}
        />

        <div
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          style={{ animation: 'fadeSlideUp 0.6s ease-out' }}
        >
          {/* Breadcrumb */}
          <nav className="flex items-center justify-center gap-2 text-xs text-white/30 font-sans mb-8" aria-label="Fil d'Ariane">
            <Link to="/" className="hover:text-[#C4A484] transition-colors duration-300">
              Accueil
            </Link>
            <ChevronRight size={12} />
            <span className="text-white/50">Guides</span>
          </nav>

          <p className="text-xs uppercase tracking-[0.3em] text-[#C4A484] font-sans font-medium">
            Guides & Journal
          </p>
          <h1 className="mt-5 font-display text-4xl sm:text-5xl md:text-6xl text-white leading-tight">
            Notre expertise, <br className="hidden sm:block" />
            vos connaissances
          </h1>
          <p className="mt-5 text-lg text-white/50 max-w-2xl mx-auto leading-relaxed font-sans">
            Guides pratiques, conseils d'experts et informations transparentes
            pour vous accompagner dans votre projet automobile.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════
          HIGHLIGHTS BAR
         ══════════════════════════════════════ */}
      <section className="border-t border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
            style={{ animation: 'fadeSlideUp 0.5s ease-out 0.15s both' }}
          >
            {HIGHLIGHTS.map(({ icon: HIcon, label, sublabel }, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#C4A484]/10 shrink-0">
                  <HIcon size={18} className="text-[#C4A484]" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-sans font-medium text-white/70 truncate">{label}</p>
                  <p className="text-[11px] text-white/30 font-sans">{sublabel}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          BENTO GRID — Article Cards
         ══════════════════════════════════════ */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {GUIDES.map((guide, i) => (
              <GuideCard key={guide.slug} guide={guide} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA SECTION
         ══════════════════════════════════════ */}
      <section className="border-t border-white/[0.04] py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="relative overflow-hidden rounded-2xl border border-[#C4A484]/20 bg-gradient-to-br from-[#C4A484]/[0.08] to-transparent p-8 sm:p-12"
            style={{ animation: 'fadeSlideUp 0.5s ease-out 0.3s both' }}
          >
            {/* Ambient glow */}
            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-[#C4A484]/[0.06] blur-[80px] pointer-events-none" />

            <div className="relative max-w-2xl">
              <p className="text-xs uppercase tracking-[0.3em] text-[#C4A484] font-sans font-medium mb-3">
                Une question ?
              </p>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-white mb-4">
                Vous ne trouvez pas la reponse ?
              </h2>
              <p className="text-white/50 font-sans leading-relaxed mb-8 max-w-lg">
                Notre equipe est a votre disposition pour repondre a toutes vos questions
                sur l'import, les garanties ou le processus d'achat.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl
                             bg-[#C4A484] text-[#1A0F0F] text-sm font-semibold
                             hover:bg-[#D4BC9A] hover:shadow-lg hover:shadow-[#C4A484]/20
                             transition-all duration-300
                             focus:outline-none focus:ring-2 focus:ring-[#C4A484]/50"
                >
                  Contactez-nous
                  <ArrowRight size={14} />
                </Link>
                <Link
                  to="/showroom"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl
                             border border-white/10 text-white/70 text-sm font-medium
                             hover:border-[#C4A484]/30 hover:text-[#C4A484]
                             transition-all duration-300
                             focus:outline-none focus:ring-2 focus:ring-[#C4A484]/50"
                >
                  Voir le stock
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom spacer */}
      <div className="h-8" />
    </main>
  )
}
