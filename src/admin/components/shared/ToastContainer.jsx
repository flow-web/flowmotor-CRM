import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { useUI } from '../../context/UIContext'

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info
}

const colors = {
  success: 'bg-green-500/20 border-green-500/30 text-green-400',
  error: 'bg-red-500/20 border-red-500/30 text-red-400',
  warning: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400',
  info: 'bg-blue-500/20 border-blue-500/30 text-blue-400'
}

function ToastContainer() {
  const { toasts, dismissToast } = useUI()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => {
        const Icon = icons[toast.type] || Info
        const colorClass = colors[toast.type] || colors.info

        return (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-sm animate-[soft-rise_0.3s_ease-out] ${colorClass}`}
          >
            <Icon size={18} />
            <span className="text-sm">{toast.message}</span>
            <button
              onClick={() => dismissToast(toast.id)}
              className="ml-2 opacity-60 hover:opacity-100 transition-opacity"
            >
              <X size={16} />
            </button>
          </div>
        )
      })}
    </div>
  )
}

export default ToastContainer
