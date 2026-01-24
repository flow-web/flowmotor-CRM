import { Link } from 'react-router-dom'
import { Instagram } from 'lucide-react'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-neutral text-neutral-content">
      <div className="container mx-auto px-6">
        <div className="footer py-12 text-sm">
          <aside className="space-y-3">
            <div className="flex items-center gap-3">
              <img
                src="/assets/engine-white.svg"
                alt="Flow Motor"
                className="h-8 w-auto"
              />
              <span className="font-display text-lg">FLOW MOTOR</span>
            </div>
            <p className="text-neutral-content/70">
              Import premium Suisse & Japon. Préparation atelier et conciergerie sur-mesure.
            </p>
            <div className="flex gap-3">
              <a
                href="https://instagram.com/flowmotor"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost btn-sm text-neutral-content"
              >
                <Instagram size={16} />
                Instagram
              </a>
              <a
                href="https://tiktok.com/@flowmotor"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost btn-sm text-neutral-content"
              >
                TikTok
              </a>
            </div>
          </aside>

          <nav>
            <h6 className="footer-title opacity-80">Navigation</h6>
            <Link to="/" className="link link-hover">Accueil</Link>
            <Link to="/stock" className="link link-hover">Stock</Link>
            <Link to="/services" className="link link-hover">Services</Link>
            <Link to="/atelier" className="link link-hover">Reprise</Link>
            <Link to="/contact" className="link link-hover">Contact</Link>
          </nav>

          <nav>
            <h6 className="footer-title opacity-80">Contact</h6>
            <span>Lyon, France</span>
            <span>Genève, Suisse</span>
            <a href="mailto:contact@flowmotor.fr" className="link link-hover">
              contact@flowmotor.fr
            </a>
          </nav>

          <nav>
            <h6 className="footer-title opacity-80">Légal</h6>
            <Link to="/mentions-legales" className="link link-hover">Mentions légales</Link>
            <Link to="/cgv" className="link link-hover">CGV</Link>
            <Link to="/confidentialite" className="link link-hover">Confidentialité</Link>
            <Link to="/cookies" className="link link-hover">Cookies</Link>
          </nav>
        </div>
      </div>

      <div className="border-t border-neutral/40">
        <div className="container mx-auto px-6 py-4 text-center text-xs text-neutral-content/60">
          © {currentYear} FLOW MOTOR. Tous droits réservés.
        </div>
      </div>
    </footer>
  )
}

export default Footer
