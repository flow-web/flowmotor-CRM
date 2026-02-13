/**
 * AdminCard - Dark luxury card with optional KPI variant
 *
 * Variants:
 * - default: standard card with subtle glass background
 * - kpi: elevated card with gold shimmer top edge on hover
 */
function AdminCard({ children, className = '', padding = true, hover = false, variant = 'default' }) {
  const baseClass = variant === 'kpi' ? 'card-admin-kpi' : 'card-admin'

  return (
    <div
      className={`
        ${baseClass}
        ${padding ? 'p-6' : ''}
        ${hover ? 'hover:border-[#D4AF37]/30 cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  )
}

// Sub-components for common structure
AdminCard.Header = function CardHeader({ title, subtitle, action, gold = false }) {
  return (
    <div className="flex items-start justify-between mb-5">
      <div>
        <h3 className={`text-sm font-semibold tracking-wide ${gold ? 'text-[#D4AF37]' : 'text-white'}`}>
          {title}
        </h3>
        {subtitle && (
          <p className="text-[11px] text-white/30 mt-0.5 tracking-wide">{subtitle}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}

AdminCard.Value = function CardValue({ value, label, trend, mono = false }) {
  return (
    <div>
      <p className={`text-3xl font-bold text-white ${mono ? 'font-mono tabular-nums tracking-tight' : ''}`}>
        {value}
      </p>
      {label && <p className="text-[11px] text-white/30 mt-1.5 uppercase tracking-wider">{label}</p>}
      {trend && (
        <p className={`text-xs mt-1 font-medium ${trend > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
          {trend > 0 ? '+' : ''}{trend}%
        </p>
      )}
    </div>
  )
}

export default AdminCard
