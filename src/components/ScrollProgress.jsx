import { useEffect, useState } from 'react'

/**
 * ScrollProgress - Barre de progression du scroll en haut de page
 * 
 * Affiche une fine ligne qui se remplit au fur et à mesure du scroll
 * Couleur : dégradé primary → accent
 */
function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0

      setScrollProgress(progress)
      
      // Afficher la barre après 100px de scroll
      setIsVisible(scrollTop > 100)
    }

    window.addEventListener('scroll', updateScrollProgress, { passive: true })
    updateScrollProgress() // Init

    return () => window.removeEventListener('scroll', updateScrollProgress)
  }, [])

  return (
    <div
      className={`fixed top-0 left-0 z-[60] h-1 w-full origin-left bg-gradient-to-r from-primary via-accent to-primary transition-opacity ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      style={{ transform: `scaleX(${scrollProgress / 100})` }}
    />
  )
}

export default ScrollProgress
