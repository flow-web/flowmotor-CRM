import { useState, useEffect } from 'react'

/**
 * ImageWithPreload - Composant d'image avec effet blur-up premium
 * 
 * Affiche une version floue légère pendant le chargement,
 * puis transition fluide vers l'image HD
 * 
 * @param {string} src - URL de l'image HD
 * @param {string} alt - Texte alternatif
 * @param {string} className - Classes Tailwind supplémentaires
 * @param {string} lowQualitySrc - URL optionnelle de la version LQ (sinon génère un placeholder)
 */
function ImageWithPreload({ 
  src, 
  alt, 
  className = '', 
  lowQualitySrc = null,
  ...props 
}) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentSrc, setCurrentSrc] = useState(lowQualitySrc || src)

  useEffect(() => {
    // Si on n'a pas de version LQ, on utilise directement la HD
    if (!lowQualitySrc) {
      const img = new Image()
      img.src = src
      img.onload = () => {
        setCurrentSrc(src)
        // Petit délai pour voir la transition
        setTimeout(() => setIsLoaded(true), 50)
      }
      return
    }

    // Précharger l'image HD
    const hdImage = new Image()
    hdImage.src = src
    hdImage.onload = () => {
      setCurrentSrc(src)
      // Petit délai pour voir la transition
      setTimeout(() => setIsLoaded(true), 50)
    }
  }, [src, lowQualitySrc])

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Image avec effet blur-up */}
      <img
        src={currentSrc}
        alt={alt}
        className={`
          w-full h-full object-cover
          transition-all duration-700 ease-out
          ${!isLoaded ? 'blur-md scale-105' : 'blur-0 scale-100'}
        `}
        loading="lazy"
        {...props}
      />
      
      {/* Overlay pendant le chargement */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-cream/20 to-aubergine/10 animate-pulse" />
      )}
    </div>
  )
}

export default ImageWithPreload
