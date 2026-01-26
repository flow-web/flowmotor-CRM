import { AlertTriangle, X } from 'lucide-react'
import { useUI } from '../../context/UIContext'

function ConfirmDialog() {
  const { confirmDialog, closeConfirm } = useUI()

  if (!confirmDialog) return null

  const isDanger = confirmDialog.variant === 'danger'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={closeConfirm}
      />

      {/* Dialog */}
      <div className="relative bg-[#1A1414] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-[soft-rise_0.2s_ease-out]">
        {/* Close button */}
        <button
          onClick={closeConfirm}
          className="absolute top-4 right-4 text-white/40 hover:text-white/60 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Icon */}
        {isDanger && (
          <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
            <AlertTriangle className="text-red-400" size={24} />
          </div>
        )}

        {/* Title */}
        <h3 className="text-lg font-semibold text-white mb-2">
          {confirmDialog.title}
        </h3>

        {/* Message */}
        <p className="text-white/60 text-sm mb-6">
          {confirmDialog.message}
        </p>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={confirmDialog.onCancel}
            className="px-4 py-2 text-sm text-white/60 hover:text-white/80 transition-colors"
          >
            {confirmDialog.cancelLabel}
          </button>
          <button
            onClick={confirmDialog.onConfirm}
            className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${
              isDanger
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-accent hover:bg-accent/80 text-white'
            }`}
          >
            {confirmDialog.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
