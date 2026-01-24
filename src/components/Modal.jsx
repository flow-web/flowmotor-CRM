import { useEffect } from 'react'
import { X } from 'lucide-react'

/**
 * Modal - Fenêtre modale premium FLOW MOTOR
 * 
 * Design:
 * - Overlay sombre avec backdrop-blur
 * - Contenu bg-cream avec scroll intégré
 * - Animation d'entrée/sortie fluide
 * - Fermeture au clic sur overlay ou bouton X
 * 
 * @param {boolean} isOpen - État d'ouverture du modal
 * @param {function} onClose - Callback de fermeture
 * @param {string} title - Titre du modal
 * @param {ReactNode} children - Contenu du modal
 */
function Modal({ isOpen, onClose, title, children }) {
  // Bloquer le scroll du body quand le modal est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Fermeture au clic sur l'overlay
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  // Fermeture avec la touche Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-fade-in"
      onClick={handleOverlayClick}
    >
      {/* Overlay avec blur */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      
      {/* Contenu du modal */}
      <div className="relative w-full max-w-3xl max-h-[85vh] bg-cream rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up flex flex-col">
        
        {/* Header sticky */}
        <div className="flex items-center justify-between p-6 md:p-8 border-b border-aubergine/10 bg-cream sticky top-0 z-10">
          <h2 className="font-playfair text-2xl md:text-3xl text-aubergine font-bold pr-8">
            {title}
          </h2>
          
          {/* Bouton fermer */}
          <button
            onClick={onClose}
            className="flex-shrink-0 p-2 rounded-xl text-aubergine/60 hover:text-aubergine hover:bg-aubergine/5 active:scale-95 transition-all"
            aria-label="Fermer"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Contenu scrollable */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </div>
        
        {/* Footer avec bouton */}
        <div className="p-6 md:p-8 border-t border-aubergine/10 bg-cream">
          <button
            onClick={onClose}
            className="w-full min-h-[52px] bg-aubergine text-cream rounded-xl font-roboto font-bold hover:bg-brown active:scale-[0.98] transition-all duration-200 shadow-lg btn-shine"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  )
}

export default Modal
