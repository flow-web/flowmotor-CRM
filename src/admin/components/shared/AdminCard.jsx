function AdminCard({ children, className = '', padding = true, hover = false }) {
  return (
    <div
      className={`
        card-admin
        ${padding ? 'p-5' : ''}
        ${hover ? 'hover:border-accent/30 cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  )
}

// Sous-composants pour structure commune
AdminCard.Header = function CardHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div>
        <h3 className="text-sm font-medium text-white">{title}</h3>
        {subtitle && <p className="text-xs text-white/40 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}

AdminCard.Value = function CardValue({ value, label, trend }) {
  return (
    <div>
      <p className="text-2xl font-semibold text-white">{value}</p>
      {label && <p className="text-xs text-white/40 mt-1">{label}</p>}
      {trend && (
        <p className={`text-xs mt-1 ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
          {trend > 0 ? '+' : ''}{trend}%
        </p>
      )}
    </div>
  )
}

export default AdminCard
