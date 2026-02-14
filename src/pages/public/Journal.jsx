import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Search, ArrowRight, BookOpen, Clock, ChevronRight,
  Ship, Scale, Wrench, TrendingUp, Calendar, Filter
} from 'lucide-react'
import SEO from '../../components/SEO'

/**
 * Journal - Premium "Le Journal" index page
 * High-end automotive magazine layout with bento grid
 * Dark luxury theme: #1A0F0F bg, gold #C4A484 accents
 */

const CATEGORIES = [
  { id: 'all', label: 'Tous les articles', icon: BookOpen },
  { id: 'import', label: 'Guides Import', icon: Ship },
  { id: 'fiscalite', label: 'Fiscalite & Malus', icon: Scale },
  { id: 'mecanique', label: 'Mecanique & Entretien', icon: Wrench },
]

const ARTICLES = [
  {
    slug: 'comment-importer-sans-risque',
    title: 'Comment importer sans risque en 2026 ?',
    subtitle: 'Le guide complet pour acheter votre vehicule a l\'etranger en toute serenite. De la recherche a l\'immatriculation, chaque etape decryptee.',
    category: 'import',
    readTime: 12,
    featured: true,
    date: '2026-01-15',
    icon: Ship,
    gradient: 'from-[#C4A484]/15 via-[#C4A484]/5 to-transparent',
  },
  {
    slug: 'fiscalite-malus-co2',
    title: 'Fiscalite auto 2026 : malus CO2 et TVA, ce qui change',
    subtitle: 'Bareme du malus ecologique, TVA sur marge vs TVA apparente, et strategies d\'optimisation pour votre import.',
    category: 'fiscalite',
    readTime: 8,
    featured: false,
    date: '2026-01-22',
    icon: Scale,
    gradient: 'from-emerald-500/[0.06] via-transparent to-transparent',
  },
  {
    slug: 'entretien-vehicule-premium',
    title: 'Entretenir un vehicule premium : les 10 commandements',
    subtitle: 'BMW, Mercedes, Audi : les points de vigilance pour preserver la valeur de votre investissement automobile.',
    category: 'mecanique',
    readTime: 7,
    featured: false,
    date: '2025-12-10',
    icon: Wrench,
    gradient: 'from-blue-500/[0.06] via-transparent to-transparent',
  },
  {
    slug: 'garanties',
    title: 'Nos garanties : Gold & Platinum',
    subtitle: 'Deux niveaux de protection mecanique pour rouler l\'esprit tranquille. Comparatif detaille.',
    category: 'mecanique',
    readTime: 6,
    featured: false,
    date: '2025-11-28',
    icon: TrendingUp,
    gradient: 'from-amber-500/[0.06] via-transparent to-transparent',
    externalPath: '/guides/garanties',
  },
]

function formatArticleDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/* ─── Featured Card ─── */
function FeaturedCard({ article }) {
  const Icon = article.icon
  const path = article.externalPath || `/journal/${article.slug}`

  return (
    <Link
      to={path}
      className="group relative col-span-1 md:col-span-2 overflow-hidden rounded-2xl border border-[#C4A484]/20 hover:border-[#C4A484]/40 transition-all duration-500 hover:shadow-2xl hover:shadow-[#C4A484]/[0.08] min-h-[340px] flex"
      style={{ animation: 'fadeSlideUp 0.5s ease-out 0.1s both' }}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#C4A484]/[0.12] via-[#1A0F0F] to-[#1A0F0F]" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1A0F0F] via-transparent to-transparent" />

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#C4A484]/[0.04] rounded-bl-[160px] pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-[#C4A484]/[0.03] blur-[80px] pointer-events-none" />

      {/* Pattern watermark */}
      <img
        src="/assets/gears.svg"
        alt=""
        aria-hidden="true"
        className="absolute right-0 top-0 w-[400px] h-auto opacity-[0.015] pointer-events-none select-none rotate-12"
        style={{ filter: 'brightness(0) invert(1)' }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-end p-8 sm:p-10 lg:p-12">
        <div className="flex items-center gap-3 mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#C4A484]/15 text-[#C4A484] text-[10px] font-sans font-bold uppercase tracking-[0.15em]">
            A la une
          </span>
          <span className="flex items-center gap-1.5 text-[11px] text-white/30 font-sans">
            <Clock size={11} />
            {article.readTime} min
          </span>
          <span className="flex items-center gap-1.5 text-[11px] text-white/30 font-sans">
            <Calendar size={11} />
            {formatArticleDate(article.date)}
          </span>
        </div>

        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white leading-tight mb-4 group-hover:text-[#C4A484] transition-colors duration-500">
          {article.title}
        </h2>

        <p className="text-base text-white/45 font-sans leading-relaxed mb-8 max-w-2xl">
          {article.subtitle}
        </p>

        <div className="flex items-center gap-2.5 text-sm text-[#C4A484] font-sans font-semibold">
          <span>Lire l'article</span>
          <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1.5" />
        </div>
      </div>
    </Link>
  )
}

/* ─── Standard Card ─── */
function ArticleCard({ article, index }) {
  const Icon = article.icon
  const path = article.externalPath || `/journal/${article.slug}`

  return (
    <Link
      to={path}
      className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-[#C4A484]/25 hover:shadow-xl hover:shadow-[#C4A484]/[0.04] transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-[#C4A484]/50"
      style={{ animation: `fadeSlideUp 0.5s ease-out ${0.15 + index * 0.08}s both` }}
    >
      {/* Gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${article.gradient} pointer-events-none`} />

      <div className="relative p-4 sm:p-6">
        {/* Top row */}
        <div className="flex items-center justify-between mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.05] text-white/50 text-[10px] font-sans font-semibold uppercase tracking-wider">
            {CATEGORIES.find(c => c.id === article.category)?.label || article.category}
          </span>
          <span className="flex items-center gap-1.5 text-[11px] text-white/25 font-sans">
            <Clock size={11} />
            {article.readTime} min
          </span>
        </div>

        {/* Icon */}
        <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-[#C4A484]/10 group-hover:bg-[#C4A484]/15 transition-colors duration-300 mb-4">
          <Icon size={20} className="text-[#C4A484]" />
        </div>

        {/* Title */}
        <h3 className="font-display text-xl sm:text-2xl text-white group-hover:text-[#C4A484] transition-colors duration-300 mb-2 leading-snug">
          {article.title}
        </h3>

        {/* Subtitle */}
        <p className="text-sm text-white/40 font-sans leading-relaxed mb-4 line-clamp-2">
          {article.subtitle}
        </p>

        {/* Bottom */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-white/20 font-sans">
            {formatArticleDate(article.date)}
          </span>
          <div className="flex items-center gap-1.5 text-sm text-[#C4A484]/60 font-sans font-medium group-hover:text-[#C4A484] transition-colors duration-300">
            <span>Lire</span>
            <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function Journal() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')

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

  const filteredArticles = useMemo(() => {
    let results = ARTICLES
    if (activeCategory !== 'all') {
      results = results.filter(a => a.category === activeCategory)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      results = results.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.subtitle.toLowerCase().includes(q)
      )
    }
    return results
  }, [searchQuery, activeCategory])

  const featured = filteredArticles.find(a => a.featured)
  const standard = filteredArticles.filter(a => !a.featured)

  return (
    <main className="bg-[#1A0F0F] min-h-screen -mt-20 pt-20">
      <SEO
        title="Le Journal - Guides & Expertise"
        description="L'expertise Flow Motor : guides d'import automobile, fiscalite, entretien vehicule premium. Conseils d'experts pour acheter et entretenir votre voiture."
        url="/journal"
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
      <section className="relative overflow-hidden py-10 sm:py-12 lg:py-14">
        {/* Ambient orbs */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
          <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-[#C4A484]/[0.04] blur-[140px]" />
          <div className="absolute -bottom-48 -right-48 w-[600px] h-[600px] rounded-full bg-[#C4A484]/[0.03] blur-[160px]" />
        </div>

        {/* Watermark */}
        <img
          src="/assets/gears.svg"
          alt=""
          aria-hidden="true"
          className="absolute -right-48 top-0 w-[600px] h-auto opacity-[0.02] pointer-events-none select-none rotate-12"
          style={{ filter: 'brightness(0) invert(1)' }}
        />

        <div
          className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 text-center"
          style={{ animation: 'fadeSlideUp 0.6s ease-out' }}
        >
          {/* Breadcrumb */}
          <nav className="flex items-center justify-center gap-2 text-xs text-white/30 font-sans mb-6" aria-label="Fil d'Ariane">
            <Link to="/" className="hover:text-[#C4A484] transition-colors duration-300">
              Accueil
            </Link>
            <ChevronRight size={12} />
            <span className="text-white/50">Le Journal</span>
          </nav>

          <p className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#C4A484] font-sans font-semibold mb-5">
            Le Journal
          </p>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-[1.1]">
            L'Expertise <br className="hidden sm:block" />
            <span className="text-[#C4A484]">Flow Motor</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-white/45 max-w-2xl mx-auto leading-relaxed font-sans">
            Guides pratiques, decryptages et conseils d'experts
            pour acheter, importer et entretenir votre vehicule.
          </p>

          {/* Search Bar */}
          <div
            className="mt-10 max-w-xl mx-auto"
            style={{ animation: 'fadeSlideUp 0.5s ease-out 0.15s both' }}
          >
            <div className="relative group">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 group-focus-within:text-[#C4A484] transition-colors duration-300" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un article..."
                className="w-full pl-12 pr-5 py-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-white/25 font-sans text-sm focus:outline-none focus:border-[#C4A484]/30 focus:bg-white/[0.06] transition-all duration-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CATEGORY FILTER
         ══════════════════════════════════════ */}
      <section className="border-t border-white/[0.04]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div
            className="flex items-center gap-2 overflow-x-auto no-scrollbar"
            style={{ animation: 'fadeSlideUp 0.5s ease-out 0.2s both' }}
          >
            <Filter size={14} className="text-white/20 shrink-0 mr-1" />
            {CATEGORIES.map((cat) => {
              const CatIcon = cat.icon
              const isActive = activeCategory === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-sans font-medium whitespace-nowrap transition-all duration-300 ${
                    isActive
                      ? 'bg-[#C4A484]/15 text-[#C4A484] border border-[#C4A484]/25'
                      : 'bg-white/[0.03] text-white/40 border border-white/[0.06] hover:text-white/60 hover:border-white/10'
                  }`}
                >
                  <CatIcon size={13} />
                  {cat.label}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          BENTO GRID — Articles
         ══════════════════════════════════════ */}
      <section className="py-10 sm:py-12">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          {filteredArticles.length === 0 ? (
            <div className="text-center py-20" style={{ animation: 'fadeSlideUp 0.4s ease-out' }}>
              <Search size={32} className="text-white/10 mx-auto mb-4" />
              <p className="text-white/30 font-sans">Aucun article ne correspond a votre recherche.</p>
              <button
                onClick={() => { setSearchQuery(''); setActiveCategory('all') }}
                className="mt-4 text-sm text-[#C4A484] hover:underline font-sans"
              >
                Voir tous les articles
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Featured card */}
              {featured && <FeaturedCard article={featured} />}

              {/* Standard cards */}
              {standard.map((article, i) => (
                <ArticleCard key={article.slug} article={article} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA SECTION
         ══════════════════════════════════════ */}
      <section className="border-t border-white/[0.04] py-12 sm:py-14">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="relative overflow-hidden rounded-2xl border border-[#C4A484]/20 bg-gradient-to-br from-[#C4A484]/[0.08] to-transparent p-8 sm:p-12"
            style={{ animation: 'fadeSlideUp 0.5s ease-out 0.3s both' }}
          >
            {/* Ambient glow */}
            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-[#C4A484]/[0.06] blur-[80px] pointer-events-none" />

            <div className="relative max-w-2xl">
              <p className="text-xs uppercase tracking-[0.3em] text-[#C4A484] font-sans font-medium mb-3">
                Votre projet
              </p>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-white mb-4">
                Ce sujet vous interesse ?
              </h2>
              <p className="text-white/50 font-sans leading-relaxed mb-8 max-w-lg">
                Lancez une recherche personnalisee. Notre equipe identifie le vehicule ideal
                selon vos criteres, votre budget et vos exigences.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#C4A484] text-[#1A0F0F] text-sm font-semibold hover:bg-[#D4BC9A] hover:shadow-lg hover:shadow-[#C4A484]/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#C4A484]/50"
                >
                  Lancer une recherche personnalisee
                  <ArrowRight size={14} />
                </Link>
                <Link
                  to="/showroom"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-white/10 text-white/70 text-sm font-medium hover:border-[#C4A484]/30 hover:text-[#C4A484] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#C4A484]/50"
                >
                  Voir le stock
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="h-8" />
    </main>
  )
}
