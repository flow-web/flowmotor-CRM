import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

/**
 * Navbar - Navigation principale du site public FLOW MOTOR
 * Fixed top, hauteur h-20, fond Crème #F4E8D8
 */
function Navbar() {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'Stock', path: '/stock' },
    { name: 'Services', path: '/services' },
    { name: 'Reprise', path: '/atelier' },
    { name: 'Contact', path: '/contact' },
  ]

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <nav className="fixed top-0 left-0 w-full h-20 bg-[#3D1E1E] z-50 shadow-lg">
      <div className="flex justify-between items-center h-full max-w-7xl mx-auto px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/assets/engine-white.svg"
            alt="Flow Motor"
            className="h-9 w-auto"
          />
          <div className="leading-tight">
            <span className="block font-display text-lg font-semibold tracking-wide text-white">
              FLOW MOTOR
            </span>
            <span className="text-[10px] uppercase tracking-[0.35em] text-white/50">
              Luxury Imports
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors ${
                isActive(link.path)
                  ? 'text-[#C4A484]'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden lg:block">
          <Link
            to="/login"
            className="inline-flex items-center px-5 py-2.5 bg-[#5C3A2E] text-white text-sm font-medium rounded-lg hover:bg-[#5C3A2E]/80 transition-colors"
          >
            Espace Pro
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-white hover:text-[#C4A484] transition-colors"
          aria-label="Menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-20 left-0 w-full bg-[#3D1E1E] border-t border-white/10 shadow-xl">
          <div className="flex flex-col py-4 px-6 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'bg-white/10 text-[#C4A484]'
                    : 'text-white/80 hover:bg-white/5 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 mt-2 border-t border-white/10">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center py-3 px-4 bg-[#5C3A2E] text-white text-sm font-medium rounded-lg hover:bg-[#5C3A2E]/80 transition-colors"
              >
                Espace Pro
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
