import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, ChevronRight, Clock, BookOpen, Calendar } from 'lucide-react'
import SEO from '../../../components/SEO'

/**
 * JournalArticleLayout - Shared layout for Journal articles
 * Narrow reading column (max-w-3xl), sticky sidebar TOC, dark luxury theme
 * Font: Plus Jakarta Sans, 1.1rem, line-height 1.8
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

export default function JournalArticleLayout({
  title,
  subtitle,
  readTime,
  date,
  category,
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
    window.scrollTo(0, 0)
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

  const formattedDate = date
    ? new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    : null

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

        /* Article prose styling */
        .journal-prose {
          font-family: "Plus Jakarta Sans", sans-serif;
          font-size: 1.1rem;
          line-height: 1.8;
          color: rgba(244, 232, 216, 0.65);
        }
        .journal-prose h2 {
          font-family: "Playfair Display", serif;
          font-size: 1.75rem;
          color: white;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
          line-height: 1.3;
        }
        .journal-prose h3 {
          font-family: "Playfair Display", serif;
          font-size: 1.3rem;
          color: rgba(255, 255, 255, 0.9);
          margin-top: 2rem;
          margin-bottom: 0.75rem;
          line-height: 1.4;
        }
        .journal-prose p {
          margin-bottom: 1.25rem;
        }
        .journal-prose strong {
          color: rgba(255, 255, 255, 0.85);
          font-weight: 600;
        }
        .journal-prose a {
          color: #C4A484;
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        .journal-prose a:hover {
          color: #D4BC9A;
        }
        .journal-prose ul, .journal-prose ol {
          margin-bottom: 1.25rem;
          padding-left: 1.5rem;
        }
        .journal-prose li {
          margin-bottom: 0.5rem;
        }
        .journal-prose blockquote {
          border-left: 3px solid #C4A484;
          padding-left: 1.25rem;
          margin: 1.5rem 0;
          font-style: italic;
          color: rgba(255, 255, 255, 0.5);
        }
        @media (min-width: 640px) {
          .journal-prose h2 {
            font-size: 2rem;
          }
        }
      `}</style>

      {/* ── Breadcrumb ── */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-3">
        <nav className="flex items-center gap-2 text-xs text-white/30 font-sans" aria-label="Fil d'Ariane">
          <Link to="/" className="hover:text-[#C4A484] transition-colors duration-300">
            Accueil
          </Link>
          <ChevronRight size={12} />
          <Link to="/journal" className="hover:text-[#C4A484] transition-colors duration-300">
            Le Journal
          </Link>
          <ChevronRight size={12} />
          <span className="text-white/50 truncate max-w-[200px]">{title}</span>
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
              to="/journal"
              className="flex items-center gap-2 text-sm text-white/40 hover:text-[#C4A484] transition-colors duration-300 font-sans"
            >
              <ArrowLeft size={14} />
              Le Journal
            </Link>
          </div>

          {/* Category + Date */}
          {(category || formattedDate) && (
            <div className="flex items-center gap-3 mb-5">
              {category && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C4A484]/10 text-[#C4A484] text-[10px] font-sans font-bold uppercase tracking-[0.15em]">
                  <BookOpen size={10} />
                  {category}
                </span>
              )}
              {formattedDate && (
                <span className="flex items-center gap-1.5 text-[11px] text-white/30 font-sans">
                  <Calendar size={11} />
                  {formattedDate}
                </span>
              )}
            </div>
          )}

          {/* Title — Gold */}
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-[#C4A484] leading-tight">
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
            className="max-w-3xl journal-prose"
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
                  className="group flex items-center gap-4 p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-[#C4A484]/20 hover:bg-white/[0.04] transition-all duration-300"
                >
                  <ArrowLeft size={16} className="text-white/30 group-hover:text-[#C4A484] transition-colors shrink-0" />
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-sans mb-1">Precedent</p>
                    <p className="text-sm font-sans font-medium text-white/70 group-hover:text-[#C4A484] transition-colors">
                      {prevArticle.title}
                    </p>
                  </div>
                </Link>
              ) : <div />}

              {nextArticle ? (
                <Link
                  to={nextArticle.path}
                  className="group flex items-center justify-end gap-4 p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-[#C4A484]/20 hover:bg-white/[0.04] transition-all duration-300 text-right"
                >
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-sans mb-1">Suivant</p>
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
              <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-[#C4A484]/[0.06] blur-[80px] pointer-events-none" />

              <div className="relative">
                <p className="text-xs uppercase tracking-[0.3em] text-[#C4A484] font-sans font-medium mb-3">
                  Votre projet
                </p>
                <h3 className="font-display text-2xl sm:text-3xl text-white mb-4">
                  Ce sujet vous interesse ?
                </h3>
                <p className="text-sm text-white/50 font-sans leading-relaxed mb-8 max-w-lg">
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
        </div>
      </div>

      <div className="h-8" />
    </main>
  )
}
