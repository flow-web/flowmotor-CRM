import { useEffect } from 'react'
import { X } from 'lucide-react'

function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-3xl bg-base-100">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-display text-2xl font-semibold">{title}</h3>
          <button className="btn btn-ghost btn-sm btn-circle" onClick={onClose} aria-label="Fermer">
            <X size={18} />
          </button>
        </div>

        <div className="mt-6 max-h-[60vh] overflow-y-auto">
          {children}
        </div>

        <div className="modal-action">
          <button className="btn btn-accent" onClick={onClose}>
            Fermer
          </button>
        </div>
      </div>
      <div className="modal-backdrop">
        <button onClick={onClose} aria-label="Fermer le modal"></button>
      </div>
    </div>
  )
}

export default Modal
