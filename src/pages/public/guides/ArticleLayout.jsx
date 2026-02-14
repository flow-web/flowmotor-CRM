import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, ChevronRight, Clock, BookOpen } from 'lucide-react'
import SEO from '../../../components/SEO'

/**
 * ArticleLayout - Shared layout for Guides articles
 * Centered reading layout (max-w-3xl) with sticky desktop sidebar "Sommaire"
 * Dark luxury theme: #1A0F0F bg, gold #C4A484 accents, Playfair Display headings
 */

function TableOfContents({ sections, activeSection }) {
  const handleClick = (id) => {
    const el = document.getElementById(id)
    if (el) {
      const offset = 100
      const top = el.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  return (
    <nav className="space-y-1" aria-label="Sommaire">
      <p className="text-[10px] uppercase tracking-[0.25em] text-[#C4A484] font-sans font-semibold mb-4 flex items-center gap-2">
        <BookOpen size={12} />
        Sommaire
      </p>
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => handleClick(section.id)}
          className={`
            block w-full text-left px-3 py-2 rounded-lg text-sm font-sans transition-all duration-300
            ${activeSection === section.id
              ? 'text-[#C4A484] bg-[#C4A484]/10 border-l-2 border-[#C4A484]'
              : 'text-white/40 hover:text-white/70 hover:bg-white/[0.03] border-l-2 border-transparent'
            }
          `}
        >
          {section.title}
        </button>
      ))}
    </nav>
  )
}

export default function ArticleLayout({
  title,
  subtitle,
  readTime,
  seoTitle,
  seoDescription,
  seoUrl,
  sections = [],
  children,
  prevArticle,
  nextArticle,
}) {
  const [activeSection, setActiveSection] = useState('')

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

  // Track active section via IntersectionObserver
  useEffect(() => {
    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        }
      },
      { rootMargin: '-100px 0px -60% 0px', threshold: 0 }
    )

    sections.forEach((section) => {
      const el = document.getElementById(section.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [sections])

  return (
    <main className="bg-[#1A0F0F] min-h-screen -mt-20 pt-20">
      <SEO
        title={seoTitle || title}
        description={seoDescription}
        url={seoUrl}
        type="article"
      />

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* ── Breadcrumb ── */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-3">
        <nav className="flex items-center gap-2 text-xs text-white/30 font-sans" aria-label="Fil d'Ariane">
          <Link to="/" className="hover:text-[#C4A484] transition-colors duration-300">
            Accueil
          </Link>
          <ChevronRight size={12} />
          <Link to="/guides" className="hover:text-[#C4A484] transition-colors duration-300">
            Guides
          </Link>
          <ChevronRight size={12} />
          <span className="text-white/50">{title}</span>
        </nav>
      </div>

      {/* ── Article Header ── */}
      <header
        className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pb-8"
        style={{ animation: 'fadeSlideUp 0.6s ease-out' }}
      >
        <div className="max-w-3xl lg:ml-0">
          <div className="flex items-center gap-4 mb-6">
            <Link
              to="/guides"
              className="flex items-center gap-2 text-sm text-white/40 hover:text-[#C4A484] transition-colors duration-300 font-sans"
            >
              <ArrowLeft size={14} />
              Tous les guides
            </Link>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-white leading-tight">
            {title}
          </h1>

          {subtitle && (
            <p className="mt-4 text-lg text-white/50 font-sans leading-relaxed max-w-2xl">
              {subtitle}
            </p>
          )}

          {readTime && (
            <div className="mt-6 flex items-center gap-2 text-sm text-white/30 font-sans">
              <Clock size={14} className="text-[#C4A484]" />
              <span>{readTime} min de lecture</span>
            </div>
          )}

          {/* Gold divider */}
          <div className="mt-8 h-px bg-gradient-to-r from-[#C4A484]/40 via-[#C4A484]/20 to-transparent" />
        </div>
      </header>

      {/* ── Article Body + Sidebar ── */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <div className="lg:grid lg:grid-cols-[1fr_240px] lg:gap-12">

          {/* Main Content */}
          <article
            className="max-w-3xl prose-article"
            style={{ animation: 'fadeSlideUp 0.6s ease-out 0.1s both' }}
          >
            {children}
          </article>

          {/* Sidebar — Desktop only, sticky */}
          {sections.length > 0 && (
            <aside
              className="hidden lg:block"
              style={{ animation: 'fadeSlideUp 0.6s ease-out 0.2s both' }}
            >
              <div className="sticky top-28 space-y-6">
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
                  <TableOfContents sections={sections} activeSection={activeSection} />
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>

      {/* ── Article Navigation (Prev/Next) ── */}
      {(prevArticle || nextArticle) && (
        <div className="border-t border-white/[0.06]">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-3xl grid grid-cols-1 sm:grid-cols-2 gap-4">
              {prevArticle ? (
                <Link
                  to={prevArticle.path}
                  className="group flex items-center gap-4 p-5 rounded-xl border border-white/[0.06] bg-white/[0.02]
                             hover:border-[#C4A484]/20 hover:bg-white/[0.04] transition-all duration-300"
                >
                  <ArrowLeft size={16} className="text-white/30 group-hover:text-[#C4A484] transition-colors shrink-0" />
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-sans mb-1">
                      Precedent
                    </p>
                    <p className="text-sm font-sans font-medium text-white/70 group-hover:text-[#C4A484] transition-colors">
                      {prevArticle.title}
                    </p>
                  </div>
                </Link>
              ) : <div />}

              {nextArticle ? (
                <Link
                  to={nextArticle.path}
                  className="group flex items-center justify-end gap-4 p-5 rounded-xl border border-white/[0.06] bg-white/[0.02]
                             hover:border-[#C4A484]/20 hover:bg-white/[0.04] transition-all duration-300 text-right"
                >
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-sans mb-1">
                      Suivant
                    </p>
                    <p className="text-sm font-sans font-medium text-white/70 group-hover:text-[#C4A484] transition-colors">
                      {nextArticle.title}
                    </p>
                  </div>
                  <ArrowRight size={16} className="text-white/30 group-hover:text-[#C4A484] transition-colors shrink-0" />
                </Link>
              ) : <div />}
            </div>
          </div>
        </div>
      )}

      {/* ── CTA Box ── */}
      <div className="border-t border-white/[0.06]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-3xl">
            <div className="relative overflow-hidden rounded-2xl border border-[#C4A484]/20 bg-gradient-to-br from-[#C4A484]/[0.08] to-transparent p-8 sm:p-10">
              {/* Ambient glow */}
              <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-[#C4A484]/[0.06] blur-[80px] pointer-events-none" />

              <div className="relative">
                <p className="text-xs uppercase tracking-[0.3em] text-[#C4A484] font-sans font-medium mb-3">
                  Pret a vous lancer ?
                </p>
                <h3 className="font-display text-2xl sm:text-3xl text-white mb-4">
                  Pret a importer ?
                </h3>
                <p className="text-sm text-white/50 font-sans leading-relaxed mb-8 max-w-lg">
                  Notre equipe vous accompagne a chaque etape du processus, de la recherche du vehicule
                  a la livraison a votre porte. Contactez-nous pour demarrer votre projet.
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
        </div>
      </div>

      {/* Bottom spacer */}
      <div className="h-8" />
    </main>
  )
}
