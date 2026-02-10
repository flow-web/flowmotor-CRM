/**
 * EmptyState — Reusable empty-state placeholder
 * Props: icon (LucideIcon), title, subtitle, primaryAction, secondaryAction
 * Actions: { label: string, onClick: fn } or { label: string, to: string }
 */
import { Link } from 'react-router-dom'

function EmptyState({ icon: Icon, title, subtitle, primaryAction, secondaryAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {Icon && <Icon size={48} className="text-white/15 mb-4" />}
      {title && <p className="text-white font-medium text-base mb-1">{title}</p>}
      {subtitle && <p className="text-white/40 text-sm text-center max-w-sm">{subtitle}</p>}

      {(primaryAction || secondaryAction) && (
        <div className="flex items-center gap-3 mt-6">
          {primaryAction && (
            primaryAction.to ? (
              <Link to={primaryAction.to} className="btn-admin text-sm px-4 py-2">
                {primaryAction.label}
              </Link>
            ) : (
              <button onClick={primaryAction.onClick} className="btn-admin text-sm px-4 py-2">
                {primaryAction.label}
              </button>
            )
          )}
          {secondaryAction && (
            secondaryAction.to ? (
              <Link to={secondaryAction.to} className="btn-admin-secondary text-sm px-4 py-2">
                {secondaryAction.label}
              </Link>
            ) : (
              <button onClick={secondaryAction.onClick} className="btn-admin-secondary text-sm px-4 py-2">
                {secondaryAction.label}
              </button>
            )
          )}
        </div>
      )}
    </div>
  )
}

export default EmptyState
