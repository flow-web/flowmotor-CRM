import { Link } from 'react-router-dom'
import { MapPin, Mail, Phone, Instagram, ArrowRight, Star, ExternalLink } from 'lucide-react'

/* ──────────────────────────────────────────────────────────
   Footer - Flow Motor Public Site
   Charte "Luxe Old School Freestyle"
   ────────────────────────────────────────────────────────── */

const BRAND_MARQUEE = [
  'Audi', 'BMW', 'Mercedes-Benz', 'Porsche', 'Volkswagen',
  'Toyota', 'Nissan', 'Subaru', 'Mazda', 'Lexus',
]

const NAV_LINKS = [
  { label: 'Accueil', to: '/' },
  { label: 'Stock', to: '/showroom' },
  { label: 'Financement', to: '/services' },
  { label: 'Reprise', to: '/atelier' },
  { label: 'Journal', to: '/journal' },
  { label: 'Contact', to: '/contact' },
]

const SERVICE_LINKS = [
  { label: 'Import sur mesure', to: '/services' },
  { label: 'Estimation reprise', to: '/atelier' },
  { label: 'Garantie premium', to: '/services' },
  { label: 'Financement', to: '/services' },
  { label: 'Atelier mecanique', to: '/atelier' },
]

const LEGAL_LINKS = [
  { label: 'Mentions legales', to: '/mentions-legales' },
  { label: 'CGV', to: '/cgv' },
  { label: 'Confidentialite', to: '/confidentialite' },
  { label: 'Cookies', to: '/cookies' },
]

/* ── Inline SVG Icons (Lucide doesn't have these) ── */

function TikTokIcon({ size = 18, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  )
}

function FacebookIcon({ size = 18, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

function YouTubeIcon({ size = 18, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  )
}

const SOCIAL_LINKS = [
  { label: 'Instagram', href: 'https://instagram.com/flowmotor', Icon: Instagram },
  { label: 'TikTok', href: 'https://tiktok.com/@flowmotor', Icon: TikTokIcon },
  { label: 'Facebook', href: 'https://facebook.com/flowmotor', Icon: FacebookIcon },
  { label: 'YouTube', href: 'https://youtube.com/@flowmotor', Icon: YouTubeIcon },
]

/* ══════════════════════════════════════════════════════════ */

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative" style={{ background: 'linear-gradient(to bottom, #0D0707, #1A0F0F)' }}>

      {/* ──── 1. Brand Marquee Banner ──── */}
      <div className="border-t border-[#C4A484]/20">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center gap-0 overflow-hidden whitespace-nowrap">
            {BRAND_MARQUEE.map((brand, i) => (
              <span key={brand} className="flex items-center shrink-0">
                {i > 0 && (
                  <span className="text-[#C4A484]/40 mx-3 sm:mx-4 text-xs select-none" aria-hidden="true">
                    ·
                  </span>
                )}
                <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-white/20 font-sans font-medium select-none">
                  {brand}
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ──── 2. Main Section (4 columns) ──── */}
      <div className="border-t border-white/5">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid gap-8 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">

            {/* Column 1 - Brand */}
            <div className="space-y-4 sm:col-span-2 lg:col-span-1">
              <Link to="/" className="inline-block group">
                <img
                  src="/assets/logo-cream.svg"
                  alt="Flow Motor - Import automobile de luxe"
                  className="h-16 w-auto transition-transform duration-300 group-hover:scale-105"
                />
              </Link>

              <p className="text-sm leading-relaxed text-white/50 max-w-xs">
                Specialiste import automobile depuis Lyon. Vehicules premium selectionnes en Suisse, Allemagne et Japon.
              </p>

              {/* Social Icons */}
              <div className="flex items-center gap-3 pt-1">
                {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center h-10 w-10 rounded-full
                               border border-white/[0.08] text-white/40
                               hover:text-[#C4A484] hover:border-[#C4A484]/30 hover:bg-[#C4A484]/5
                               transition-all duration-300
                               focus:outline-none focus:ring-2 focus:ring-[#C4A484]/50"
                    aria-label={label}
                  >
                    <Icon size={17} />
                  </a>
                ))}
              </div>
            </div>

            {/* Column 2 - Navigation */}
            <div className="space-y-4">
              <h6 className="text-xs uppercase tracking-[0.2em] text-white/40 font-sans font-medium">
                Navigation
              </h6>
              <nav className="flex flex-col gap-3">
                {NAV_LINKS.map(({ label, to }) => (
                  <Link
                    key={label}
                    to={to}
                    className="text-sm text-white/50 hover:text-[#C4A484] transition-colors duration-300"
                  >
                    {label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Column 3 - Services */}
            <div className="space-y-4">
              <h6 className="text-xs uppercase tracking-[0.2em] text-white/40 font-sans font-medium">
                Services
              </h6>
              <nav className="flex flex-col gap-3">
                {SERVICE_LINKS.map(({ label, to }) => (
                  <Link
                    key={label}
                    to={to}
                    className="text-sm text-white/50 hover:text-[#C4A484] transition-colors duration-300"
                  >
                    {label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Column 4 - Contact */}
            <div className="space-y-4">
              <h6 className="text-xs uppercase tracking-[0.2em] text-white/40 font-sans font-medium">
                Contact
              </h6>
              <div className="space-y-4">
                {/* Lyon */}
                <div className="space-y-2">
                  <div className="flex items-start gap-2.5">
                    <MapPin size={15} className="text-[#C4A484]/60 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-white/60">Lyon, France</p>
                      <p className="text-xs text-white/30 mt-0.5">69 Rhone-Alpes</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 pl-[25px]">
                    <Phone size={13} className="text-[#C4A484]/60 shrink-0" />
                    <a
                      href="tel:+33600000000"
                      className="text-sm text-white/50 hover:text-[#C4A484] transition-colors duration-300"
                    >
                      +33 6 00 00 00 00
                    </a>
                  </div>
                </div>

                {/* Geneve */}
                <div className="space-y-2">
                  <div className="flex items-start gap-2.5">
                    <MapPin size={15} className="text-[#C4A484]/60 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-white/60">Geneve, Suisse</p>
                      <p className="text-xs text-white/30 mt-0.5">Canton de Geneve</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 pl-[25px]">
                    <Phone size={13} className="text-[#C4A484]/60 shrink-0" />
                    <a
                      href="tel:+41000000000"
                      className="text-sm text-white/50 hover:text-[#C4A484] transition-colors duration-300"
                    >
                      +41 00 000 00 00
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center gap-2.5 pt-1">
                  <Mail size={15} className="text-[#C4A484]/60 shrink-0" />
                  <a
                    href="mailto:contact@flowmotor.fr"
                    className="text-sm text-white/50 hover:text-[#C4A484] transition-colors duration-300"
                  >
                    contact@flowmotor.fr
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ──── 3. Google Reviews Banner ──── */}
      <div className="border-t border-white/5">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5">
            {/* Stars */}
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  className="fill-[#C4A484] text-[#C4A484]"
                />
              ))}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <span className="font-display text-2xl font-semibold text-[#C4A484]">
                4.9/5
              </span>
              <span className="text-sm text-white/40">
                sur Google · 50+ avis
              </span>
            </div>

            {/* CTA Link */}
            <a
              href="https://g.page/flowmotor/review"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-[#C4A484]/70 hover:text-[#C4A484]
                         transition-colors duration-300 group/review"
            >
              <span>Voir les avis</span>
              <ArrowRight
                size={14}
                className="transition-transform duration-300 group-hover/review:translate-x-1"
              />
              <ExternalLink size={12} className="opacity-40" />
            </a>
          </div>
        </div>
      </div>

      {/* ──── 4. Bottom Bar ──── */}
      <div className="border-t border-white/5">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-3
                        flex flex-col sm:flex-row items-center justify-between gap-3
                        text-xs text-white/30">
          <span>
            &copy; {currentYear} Flow Motor. Tous droits reserves.
          </span>
          <nav className="flex items-center gap-1 flex-wrap justify-center">
            {LEGAL_LINKS.map(({ label, to }, i) => (
              <span key={label} className="flex items-center">
                {i > 0 && (
                  <span className="mx-2 text-white/10 select-none" aria-hidden="true">|</span>
                )}
                <Link
                  to={to}
                  className="hover:text-white/60 transition-colors duration-300"
                >
                  {label}
                </Link>
              </span>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  )
}

export default Footer
