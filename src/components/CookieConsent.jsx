import { useState, useEffect } from 'react'

function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if user has already accepted cookies
    const hasConsent = localStorage.getItem('flowmotor_cookie_consent')
    if (!hasConsent) {
      // Small delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('flowmotor_cookie_consent', 'accepted')
    setIsVisible(false)
  }

  const handleDecline = () => {
    localStorage.setItem('flowmotor_cookie_consent', 'declined')
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 p-4 md:p-6">
      <div
        className="max-w-4xl mx-auto bg-[#1A0F0F]/95 backdrop-blur-md rounded-2xl p-5 md:p-6 shadow-[0_-10px_50px_-12px_rgba(0,0,0,0.3)]"
        role="dialog"
        aria-label="Consentement cookies"
      >
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
          {/* Text */}
          <div className="flex-1">
            <p className="text-white/80 text-sm leading-relaxed">
              Nous utilisons des cookies pour garantir la meilleure expérience sur notre site
              et analyser notre trafic.{' '}
              <a href="/cookies" className="text-white/60 hover:text-white underline underline-offset-2">
                En savoir plus
              </a>
            </p>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={handleDecline}
              className="text-white/50 hover:text-white/80 text-sm underline underline-offset-2 transition-colors"
            >
              Continuer sans accepter
            </button>
            <button
              onClick={handleAccept}
              className="bg-white text-[#1A0F0F] px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-white/90 transition-colors"
            >
              Accepter
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CookieConsent
