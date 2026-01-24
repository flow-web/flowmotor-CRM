import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

/**
 * Navbar - Barre de navigation principale
 * 
 * Design: Fond Aubergine, Texte Cream
 * Features: Animation menu mobile, lien actif avec indicateur
 * Conteneur: max-w-7xl mx-auto pour alignement parfait avec le contenu
 */
function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const navLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'Stock', path: '/stock' },
    { name: 'Services', path: '/services' },
    { name: 'Reprise', path: '/atelier' },
    { name: 'Contact', path: '/contact' },
  ]

  // Vérifie si le lien est actif
  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <nav className="bg-aubergine/95 backdrop-blur-md text-cream sticky top-0 z-50 border-b border-cream/10">
      {/* Conteneur centré - Aligné avec le contenu du site */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full flex justify-between items-center h-16 md:h-20">
        
        {/* Logo unique - Icône moteur blanche */}
        <Link to="/" className="flex items-center gap-3 flex-shrink-0 group">
          <img 
            src="/assets/engine-white.svg" 
            alt="Flow Motor" 
            className="h-10 md:h-12 w-auto transition-transform duration-300 group-hover:rotate-12"
          />
          <span className="font-playfair text-xl md:text-2xl font-bold tracking-wide">
            FLOW MOTOR
          </span>
        </Link>

        {/* Navigation Desktop */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`
                relative font-roboto text-sm uppercase tracking-wider transition-colors duration-200
                ${isActive(link.path) 
                  ? 'text-cream' 
                  : 'text-cream/70 hover:text-cream'
                }
              `}
            >
              {link.name}
              {/* Indicateur actif animé */}
              <span className={`
                absolute -bottom-1 left-0 right-0 h-0.5 bg-brown rounded-full
                transition-transform duration-300 origin-left
                ${isActive(link.path) ? 'scale-x-100' : 'scale-x-0'}
              `} />
            </Link>
          ))}
          
          {/* Bouton Espace Pro */}
          <Link
            to="/login"
            className="ml-4 px-5 py-2.5 text-xs uppercase tracking-wider border border-cream/40 rounded-xl hover:bg-cream/10 hover:border-cream/60 transition-all duration-300 btn-press"
          >
            Espace Pro
          </Link>
        </div>

        {/* Bouton Menu Mobile */}
        <button
          onClick={toggleMenu}
          className="md:hidden p-3 rounded-xl hover:bg-cream/10 active:scale-95 transition-all"
          aria-label="Menu"
        >
          <div className="transition-transform duration-300">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </div>
        </button>
      </div>

      {/* Menu Mobile avec animation */}
      {isMenuOpen && (
        <div className="md:hidden bg-aubergine/95 backdrop-blur-md border-t border-cream/10 menu-slide-enter">
          <div className="px-6 py-4 space-y-1">
            {navLinks.map((link, index) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`
                  block py-4 font-roboto text-sm uppercase tracking-wider transition-all duration-200
                  ${isActive(link.path) 
                    ? 'text-cream pl-4 border-l-2 border-brown' 
                    : 'text-cream/70 hover:text-cream hover:pl-2'
                  }
                `}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/login"
              onClick={() => setIsMenuOpen(false)}
              className="block mt-4 py-4 text-center text-xs uppercase tracking-wider border border-cream/40 rounded-xl hover:bg-cream/10 active:scale-[0.98] transition-all"
            >
              Espace Pro
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
