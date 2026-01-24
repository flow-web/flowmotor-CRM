import { Link, useLocation } from 'react-router-dom'
import { Menu } from 'lucide-react'

function Navbar() {
  const location = useLocation()

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
    <nav className="sticky top-0 z-50 border-b border-primary/20 bg-primary/95 text-primary-content backdrop-blur">
      <div className="navbar container mx-auto px-4 sm:px-6">
        <div className="navbar-start gap-2">
          <div className="dropdown">
            <button tabIndex={0} className="btn btn-ghost lg:hidden" aria-label="Menu">
              <Menu size={22} />
            </button>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content z-[1] mt-3 w-56 rounded-box bg-base-100 p-2 text-base-content shadow-lg"
            >
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link className={isActive(link.path) ? 'active font-semibold' : ''} to={link.path}>
                    {link.name}
                  </Link>
                </li>
              ))}
              <li className="mt-1">
                <Link to="/login">Espace Pro</Link>
              </li>
            </ul>
          </div>

          <Link to="/" className="flex items-center gap-3">
            <img
              src="/assets/engine-white.svg"
              alt="Flow Motor"
              className="h-9 w-auto"
            />
            <div className="leading-tight">
              <span className="block font-display text-lg font-semibold tracking-wide">
                FLOW MOTOR
              </span>
              <span className="text-[11px] uppercase tracking-[0.3em] text-primary-content/60">
                Luxury Imports
              </span>
            </div>
          </Link>
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal gap-1 px-1">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={isActive(link.path) ? 'active font-semibold' : ''}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="navbar-end">
          <Link to="/login" className="btn btn-accent btn-sm hidden sm:inline-flex">
            Espace Pro
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
