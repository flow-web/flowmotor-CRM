import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Heart, User, Menu, X, ChevronRight, Car, Phone } from 'lucide-react'

/**
 * Navbar - Navigation principale du site public FLOW MOTOR
 * Fixed top, h-20, fond noir profond semi-transparent avec backdrop blur
 * Charte "Luxe Old School Freestyle"
 */

const NAV_LINKS = [
  { name: 'Stock', path: '/showroom' },
  { name: 'Financement', path: '/services' },
  { name: 'Reprise', path: '/atelier' },
  { name: 'Guides', path: '/guides' },
  { name: 'Contact', path: '/contact' },
]

const FAVORITES_KEY = 'flowmotor-favorites'

function getFavoritesFromStorage() {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function setFavoritesToStorage(ids) {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids))
  } catch {
    // Silently fail if localStorage is full or unavailable
  }
}

function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [favoritesOpen, setFavoritesOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [favorites, setFavorites] = useState(getFavoritesFromStorage)

  const favoritesRef = useRef(null)
  const profileRef = useRef(null)
  const profileModalRef = useRef(null)
  const navRef = useRef(null)

  // Sync favorites from localStorage on storage event (cross-tab)
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === FAVORITES_KEY) {
        setFavorites(getFavoritesFromStorage())
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  // Also poll localStorage periodically to catch same-tab updates from Showroom
  useEffect(() => {
    const interval = setInterval(() => {
      const stored = getFavoritesFromStorage()
      setFavorites(prev => {
        if (JSON.stringify(prev) !== JSON.stringify(stored)) return stored
        return prev
      })
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (favoritesRef.current && !favoritesRef.current.contains(e.target)) {
        setFavoritesOpen(false)
      }
      if (
        profileRef.current && !profileRef.current.contains(e.target) &&
        (!profileModalRef.current || !profileModalRef.current.contains(e.target))
      ) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
    setFavoritesOpen(false)
    setProfileOpen(false)
  }, [location.pathname])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileMenuOpen])

  const isActive = useCallback((path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }, [location.pathname])

  const removeFavorite = useCallback((id) => {
    setFavorites(prev => {
      const next = prev.filter(fid => fid !== id)
      setFavoritesToStorage(next)
      return next
    })
  }, [])

  const clearAllFavorites = useCallback(() => {
    setFavorites([])
    setFavoritesToStorage([])
  }, [])

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 w-full h-20 bg-[#1A0F0F]/95 backdrop-blur-xl z-50 border-b border-white/5"
      >
        <div className="flex justify-between items-center h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ========== LEFT: Logo ========== */}
          <Link to="/" className="flex items-center group">
            <img
              src="/assets/logo-cream.svg"
              alt="Flow Motor - Import automobile de luxe"
              className="h-14 w-auto transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* ========== CENTER: Desktop Navigation ========== */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`
                  relative px-4 py-2 text-xs font-sans font-medium uppercase tracking-[0.15em]
                  transition-all duration-300
                  ${isActive(link.path)
                    ? 'text-[#C4A484]'
                    : 'text-white/60 hover:text-[#C4A484]'
                  }
                `}
              >
                {link.name}
                {/* Active underline */}
                <span
                  className={`
                    absolute bottom-0 left-1/2 -translate-x-1/2 h-[1.5px] bg-[#C4A484] rounded-full
                    transition-all duration-300
                    ${isActive(link.path) ? 'w-6 opacity-100' : 'w-0 opacity-0'}
                  `}
                />
              </Link>
            ))}
          </div>

          {/* ========== RIGHT: User Zone ========== */}
          <div className="flex items-center gap-2">

            {/* --- Favorites Button --- */}
            <div ref={favoritesRef} className="relative">
              <button
                onClick={() => { setFavoritesOpen(!favoritesOpen); setProfileOpen(false) }}
                className="relative flex items-center justify-center h-10 w-10 rounded-full
                           text-white/60 hover:text-[#C4A484] hover:bg-white/5
                           transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#C4A484]/50"
                aria-label={`Favoris (${favorites.length})`}
              >
                <Heart
                  size={19}
                  className={favorites.length > 0 ? 'fill-[#C4A484] text-[#C4A484]' : ''}
                />
                {favorites.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center
                                   min-w-[18px] h-[18px] px-1 rounded-full
                                   bg-[#C4A484] text-[#1A0F0F] text-[10px] font-bold
                                   animate-[scale-in_0.2s_ease-out]">
                    {favorites.length}
                  </span>
                )}
              </button>

              {/* Favorites Dropdown */}
              {favoritesOpen && (
                <div className="absolute right-0 top-14 w-80 bg-[#1A0F0F] border border-white/10 rounded-xl
                                shadow-2xl shadow-black/50 overflow-hidden
                                animate-[fadeSlideDown_0.2s_ease-out]"
                >
                  <div className="p-4 border-b border-white/5 flex items-center justify-between">
                    <span className="text-sm font-sans font-medium text-white/90">
                      Mes favoris
                    </span>
                    {favorites.length > 0 && (
                      <button
                        onClick={clearAllFavorites}
                        className="text-[10px] uppercase tracking-wider text-white/30 hover:text-[#C4A484] transition-colors"
                      >
                        Tout effacer
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto">
                    {favorites.length === 0 ? (
                      <div className="p-8 text-center">
                        <Heart size={28} className="mx-auto text-white/10 mb-3" />
                        <p className="text-sm text-white/40">Aucun favori pour le moment</p>
                        <p className="text-xs text-white/20 mt-1">
                          Ajoutez des vehicules depuis le showroom
                        </p>
                      </div>
                    ) : (
                      <div className="p-2 space-y-1">
                        {favorites.map((id) => (
                          <div
                            key={id}
                            className="flex items-center justify-between gap-3 p-3 rounded-lg
                                       hover:bg-white/5 transition-colors group/fav"
                          >
                            <Link
                              to={`/vehicule/${id}`}
                              className="flex items-center gap-3 flex-1 min-w-0"
                              onClick={() => setFavoritesOpen(false)}
                            >
                              <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-white/5 shrink-0">
                                <Car size={16} className="text-[#C4A484]/60" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm text-white/80 truncate">
                                  Vehicule #{String(id).slice(0, 8)}
                                </p>
                                <p className="text-[11px] text-white/30">Voir le detail</p>
                              </div>
                            </Link>
                            <button
                              onClick={(e) => { e.stopPropagation(); removeFavorite(id) }}
                              className="shrink-0 p-1.5 rounded-md text-white/20 hover:text-red-400 hover:bg-red-400/10
                                         opacity-0 group-hover/fav:opacity-100 transition-all duration-200"
                              aria-label="Retirer des favoris"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {favorites.length > 0 && (
                    <div className="p-3 border-t border-white/5">
                      <Link
                        to="/showroom"
                        onClick={() => setFavoritesOpen(false)}
                        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg
                                   bg-[#C4A484]/10 text-[#C4A484] text-xs font-medium uppercase tracking-wider
                                   hover:bg-[#C4A484]/20 transition-colors"
                      >
                        Voir le showroom
                        <ChevronRight size={14} />
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* --- Profile Button --- */}
            <div ref={profileRef} className="relative">
              <button
                onClick={() => { setProfileOpen(!profileOpen); setFavoritesOpen(false) }}
                className="flex items-center justify-center h-10 w-10 rounded-full
                           border border-white/10 text-white/60 hover:text-[#C4A484] hover:border-[#C4A484]/30
                           transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#C4A484]/50"
                aria-label="Mon compte"
              >
                <User size={18} />
              </button>
            </div>

            {/* --- Mobile Burger --- */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex items-center justify-center h-10 w-10 rounded-full
                         text-white/60 hover:text-[#C4A484] hover:bg-white/5
                         transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#C4A484]/50 ml-1"
              aria-label="Menu principal"
            >
              <div className="relative w-5 h-4 flex flex-col justify-between">
                <span
                  className={`block h-[2px] w-full bg-current rounded-full transition-all duration-300 origin-center
                    ${mobileMenuOpen ? 'rotate-45 translate-y-[7px]' : ''}`}
                />
                <span
                  className={`block h-[2px] w-full bg-current rounded-full transition-all duration-300
                    ${mobileMenuOpen ? 'opacity-0 scale-x-0' : ''}`}
                />
                <span
                  className={`block h-[2px] w-full bg-current rounded-full transition-all duration-300 origin-center
                    ${mobileMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`}
                />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* ========== PROFILE MODAL (Glassmorphism) ========== */}
      {profileOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
            onClick={() => setProfileOpen(false)}
          />

          {/* Modal */}
          <div
            ref={profileModalRef}
            className="relative w-full max-w-sm rounded-2xl overflow-hidden
                        bg-[#1A0F0F]/80 backdrop-blur-2xl border border-white/10
                        shadow-2xl shadow-black/50
                        animate-[fadeScaleIn_0.3s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setProfileOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-white/30 hover:text-white/60
                         hover:bg-white/5 transition-all duration-200"
              aria-label="Fermer"
            >
              <X size={18} />
            </button>

            {/* Header */}
            <div className="pt-10 pb-6 px-8 text-center">
              <div className="mx-auto mb-5 flex items-center justify-center h-16 w-16 rounded-full
                              bg-gradient-to-br from-[#C4A484]/20 to-[#C4A484]/5 border border-[#C4A484]/20">
                <User size={28} className="text-[#C4A484]" />
              </div>
              <h2 className="font-display text-2xl text-white/95 mb-1">Bienvenue</h2>
              <p className="text-sm text-white/40">Connectez-vous a votre espace</p>
            </div>

            {/* Options */}
            <div className="px-8 space-y-3">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setProfileOpen(false)
                  setTimeout(() => navigate('/login'), 100)
                }}
                className="w-full flex items-center gap-4 p-4 rounded-xl
                           bg-white/[0.04] border border-white/[0.06] hover:border-[#C4A484]/20 hover:bg-white/[0.07]
                           transition-all duration-300 group/opt text-left"
              >
                <div className="flex items-center justify-center h-10 w-10 rounded-lg
                                bg-[#C4A484]/10 text-[#C4A484] transition-colors
                                group-hover/opt:bg-[#C4A484]/20">
                  <Car size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white/90">Espace Client</p>
                  <p className="text-xs text-white/35 mt-0.5">Suivez vos commandes et favoris</p>
                </div>
                <ChevronRight size={16} className="text-white/20 group-hover/opt:text-[#C4A484] transition-colors" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setProfileOpen(false)
                  setTimeout(() => navigate('/admin'), 100)
                }}
                className="w-full flex items-center gap-4 p-4 rounded-xl
                           bg-white/[0.04] border border-white/[0.06] hover:border-[#C4A484]/20 hover:bg-white/[0.07]
                           transition-all duration-300 group/opt text-left"
              >
                <div className="flex items-center justify-center h-10 w-10 rounded-lg
                                bg-[#C4A484]/10 text-[#C4A484] transition-colors
                                group-hover/opt:bg-[#C4A484]/20">
                  <Phone size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white/90">Espace Partenaire</p>
                  <p className="text-xs text-white/35 mt-0.5">Acces professionnel et import</p>
                </div>
                <ChevronRight size={16} className="text-white/20 group-hover/opt:text-[#C4A484] transition-colors" />
              </button>
            </div>

            {/* Divider */}
            <div className="mx-8 my-5 flex items-center gap-3">
              <div className="flex-1 h-px bg-white/[0.06]" />
              <span className="text-[10px] uppercase tracking-widest text-white/20">ou</span>
              <div className="flex-1 h-px bg-white/[0.06]" />
            </div>

            {/* Google Button */}
            <div className="px-8 pb-8">
              <button
                className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl
                           bg-white/[0.06] border border-white/[0.08] text-white/70
                           hover:bg-white/[0.10] hover:text-white/90 hover:border-white/15
                           transition-all duration-300 text-sm font-medium"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continuer avec Google
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========== MOBILE FULL-SCREEN MENU ========== */}
      <div
        className={`
          fixed inset-0 z-[55] lg:hidden
          transition-all duration-500
          ${mobileMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
          }
        `}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-[#1A0F0F]/98 backdrop-blur-2xl transition-opacity duration-500
            ${mobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* Content */}
        <div className={`relative flex flex-col h-full pt-24 pb-8 px-6 transition-transform duration-500
          ${mobileMenuOpen ? 'translate-y-0' : '-translate-y-4'}`}>

          {/* Navigation Links */}
          <div className="flex-1 flex flex-col justify-center -mt-16">
            <div className="space-y-2">
              {NAV_LINKS.map((link, index) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    block py-4 px-4 rounded-xl text-left
                    transition-all duration-300
                    ${isActive(link.path)
                      ? 'text-[#C4A484] bg-[#C4A484]/5'
                      : 'text-white/60 hover:text-white/90 hover:bg-white/[0.03]'
                    }
                  `}
                  style={{ transitionDelay: mobileMenuOpen ? `${index * 60}ms` : '0ms' }}
                >
                  <span className="text-2xl font-display tracking-wide">{link.name}</span>
                  {isActive(link.path) && (
                    <div className="mt-1 h-[1.5px] w-8 bg-[#C4A484] rounded-full" />
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile User Zone */}
          <div className="space-y-3 pt-6 border-t border-white/5">
            {/* Favorites summary */}
            <Link
              to="/showroom"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors"
            >
              <Heart size={18} className={favorites.length > 0 ? 'fill-[#C4A484] text-[#C4A484]' : 'text-white/40'} />
              <span className="text-sm text-white/70 flex-1">
                {favorites.length > 0
                  ? `${favorites.length} vehicule${favorites.length > 1 ? 's' : ''} en favoris`
                  : 'Aucun favori'
                }
              </span>
              <ChevronRight size={16} className="text-white/20" />
            </Link>

            {/* Profile link */}
            <button
              onClick={() => { setMobileMenuOpen(false); setTimeout(() => setProfileOpen(true), 350) }}
              className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors w-full text-left"
            >
              <User size={18} className="text-white/40" />
              <span className="text-sm text-white/70 flex-1">Mon espace</span>
              <ChevronRight size={16} className="text-white/20" />
            </button>
          </div>
        </div>
      </div>

      {/* ========== CUSTOM ANIMATIONS (inline style tag) ========== */}
      <style>{`
        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes fadeScaleIn {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes scale-in {
          from { transform: scale(0); }
          to   { transform: scale(1); }
        }
      `}</style>
    </>
  )
}

export default Navbar
