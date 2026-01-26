import { VEHICLE_STATUS_LABELS, VEHICLE_STATUS_COLORS } from '../../utils/constants'

function StatusBadge({ status, size = 'default' }) {
  const label = VEHICLE_STATUS_LABELS[status] || status
  const colorClass = VEHICLE_STATUS_COLORS[status] || 'bg-gray-500/20 text-gray-400'

  const sizeClasses = {
    small: 'text-[10px] px-2 py-0.5',
    default: 'text-xs px-2.5 py-1',
    large: 'text-sm px-3 py-1.5'
  }

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium border ${colorClass} ${sizeClasses[size]}`}
    >
      {label}
    </span>
  )
}

export default StatusBadge
