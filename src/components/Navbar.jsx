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
    <nav className="sticky top-0 z-50 bg-primary text-primary-content">
      <div className="navbar container mx-auto px-4 sm:px-6 py-2">
        <div className="navbar-start gap-2">
          <div className="dropdown">
            <button tabIndex={0} className="btn btn-ghost lg:hidden" aria-label="Menu">
              <Menu size={22} />
            </button>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content z-[1] mt-3 w-56 rounded-2xl bg-white p-3 text-base-content shadow-[0_20px_50px_-12px_rgba(61,30,30,0.2)]"
            >
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    className={`rounded-xl ${isActive(link.path) ? 'bg-primary/10 font-semibold text-primary' : ''}`}
                    to={link.path}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
              <li className="mt-2">
                <Link to="/login" className="bg-accent text-white rounded-xl">Espace Pro</Link>
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
              <span className="text-[10px] uppercase tracking-[0.35em] text-primary-content/50">
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
                  className={`rounded-lg transition-colors ${isActive(link.path) ? 'bg-white/10 font-semibold' : 'hover:bg-white/5'}`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="navbar-end">
          <Link to="/login" className="btn bg-accent border-0 text-white btn-sm hidden sm:inline-flex hover:bg-accent/90">
            Espace Pro
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
