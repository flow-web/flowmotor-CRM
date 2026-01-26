import { Link } from 'react-router-dom'
import { Instagram, MapPin, Mail } from 'lucide-react'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#1A0F0F] text-white/60">
      <div className="container mx-auto px-6 py-16">
        <div className="grid gap-12 md:grid-cols-3">
          {/* Column 1 - Brand */}
          <div className="space-y-5">
            <Link to="/" className="flex items-center gap-3">
              <img
                src="/assets/engine-white.svg"
                alt="Flow Motor"
                className="h-8 w-auto opacity-90"
              />
              <span className="font-display text-lg text-white/90">FLOW MOTOR</span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs">
              Import premium Suisse & Japon. Expertise atelier et accompagnement sur-mesure.
            </p>
            <div className="flex gap-4 pt-2">
              <a
                href="https://instagram.com/flowmotor"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-white/80 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://tiktok.com/@flowmotor"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-white/80 transition-colors text-sm font-medium"
              >
                TikTok
              </a>
            </div>
          </div>

          {/* Column 2 - Navigation */}
          <div className="space-y-5">
            <h6 className="text-xs uppercase tracking-[0.2em] text-white/40">Navigation</h6>
            <nav className="flex flex-col gap-3 text-sm">
              <Link to="/" className="hover:text-white/90 transition-colors">Accueil</Link>
              <Link to="/stock" className="hover:text-white/90 transition-colors">Stock</Link>
              <Link to="/services" className="hover:text-white/90 transition-colors">Services</Link>
              <Link to="/atelier" className="hover:text-white/90 transition-colors">Reprise & Dépôt-Vente</Link>
              <Link to="/contact" className="hover:text-white/90 transition-colors">Contact</Link>
            </nav>
          </div>

          {/* Column 3 - Contact */}
          <div className="space-y-5">
            <h6 className="text-xs uppercase tracking-[0.2em] text-white/40">Contact</h6>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-white/30" />
                <span>Lyon, France</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-white/30" />
                <span>Genève, Suisse</span>
              </div>
              <a
                href="mailto:contact@flowmotor.fr"
                className="flex items-center gap-2 hover:text-white/90 transition-colors"
              >
                <Mail size={14} className="text-white/30" />
                contact@flowmotor.fr
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="container mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <span>© {currentYear} FLOW MOTOR. Tous droits réservés.</span>
          <nav className="flex gap-6">
            <Link to="/mentions-legales" className="hover:text-white/60 transition-colors">Mentions légales</Link>
            <Link to="/cgv" className="hover:text-white/60 transition-colors">CGV</Link>
            <Link to="/confidentialite" className="hover:text-white/60 transition-colors">Confidentialité</Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}

export default Footer
