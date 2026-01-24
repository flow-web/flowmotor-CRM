import { useEffect, useState } from 'react'

/**
 * ScrollProgress - Barre de progression du scroll en haut de page
 * 
 * Affiche une fine ligne qui se remplit au fur et à mesure du scroll
 * Couleur : dégradé brown → aubergine
 */
function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (scrollTop / docHeight) * 100

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
      className={`scroll-progress ${isVisible ? 'visible' : ''}`}
      style={{ transform: `scaleX(${scrollProgress / 100})` }}
    />
  )
}

export default ScrollProgress
