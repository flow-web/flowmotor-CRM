import { Link } from 'react-router-dom'
import { Instagram } from 'lucide-react'

/**
 * Footer - Version Minimaliste "Murmure"
 * 
 * Philosophy: Le footer doit être presque invisible
 * - Typographie ultra-réduite (text-xs)
 * - Couleurs très atténuées (text-cream/40)
 * - Pas de séparateur agressif
 * - Espacements minimaux
 * - Il murmure, il ne crie pas
 */
function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-black-tech relative z-10">
      {/* Contenu principal - Ultra discret */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Colonne 1 - Marque (réduite) */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-3">
              <img 
                src="/assets/engine-white.svg" 
                alt="Flow Motor" 
                className="h-6 w-auto opacity-60"
              />
              <span className="font-playfair text-sm text-cream/60">
                FLOW MOTOR
              </span>
            </Link>
            <p className="font-roboto text-cream/40 text-xs leading-relaxed">
              L'excellence de l'import automobile premium.
            </p>
          </div>

          {/* Colonne 2 - Menu */}
          <div>
            <h4 className="font-roboto text-cream/50 text-[10px] font-semibold uppercase tracking-widest mb-3">
              Menu
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="font-roboto text-cream/40 text-xs hover:text-cream/70 transition-colors duration-200">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/stock" className="font-roboto text-cream/40 text-xs hover:text-cream/70 transition-colors duration-200">
                  Stock
                </Link>
              </li>
              <li>
                <Link to="/services" className="font-roboto text-cream/40 text-xs hover:text-cream/70 transition-colors duration-200">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/atelier" className="font-roboto text-cream/40 text-xs hover:text-cream/70 transition-colors duration-200">
                  Reprise
                </Link>
              </li>
              <li>
                <Link to="/contact" className="font-roboto text-cream/40 text-xs hover:text-cream/70 transition-colors duration-200">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne 3 - Contact */}
          <div>
            <h4 className="font-roboto text-cream/50 text-[10px] font-semibold uppercase tracking-widest mb-3">
              Contact
            </h4>
            <ul className="space-y-2 font-roboto text-cream/40 text-xs">
              <li>Lyon, France</li>
              <li>Genève, Suisse</li>
              <li className="pt-1">
                <a 
                  href="mailto:contact@flowmotor.fr" 
                  className="hover:text-cream/70 transition-colors"
                >
                  contact@flowmotor.fr
                </a>
              </li>
            </ul>
          </div>

          {/* Colonne 4 - Réseaux Sociaux */}
          <div>
            <h4 className="font-roboto text-cream/50 text-[10px] font-semibold uppercase tracking-widest mb-3">
              Suivez-nous
            </h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://instagram.com/flowmotor" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-roboto text-cream/40 text-xs hover:text-cream/70 transition-colors group"
                >
                  <Instagram className="w-4 h-4" />
                  Instagram
                </a>
              </li>
              <li>
                <a 
                  href="https://tiktok.com/@flowmotor" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-roboto text-cream/40 text-xs hover:text-cream/70 transition-colors group"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                  TikTok
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Barre copyright - Encore plus discrète */}
      <div className="border-t border-cream/5">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-4">
          <p className="font-roboto text-[10px] text-cream/30 text-center">
            © {currentYear} FLOW MOTOR. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
