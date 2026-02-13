import { VEHICLE_STATUS_LABELS } from '../../utils/constants'

/**
 * StatusBadge - Glowing outlined pill badges for vehicle status
 *
 * Style: transparent background, colored border with outer glow,
 * uppercase micro-text for a technical/command-center aesthetic.
 */

const STATUS_STYLES = {
  SOURCING: {
    border: 'border-yellow-400/40',
    text: 'text-yellow-400',
    glow: '0 0 12px rgba(250,204,21,0.15), inset 0 0 8px rgba(250,204,21,0.05)',
    dot: 'bg-yellow-400',
  },
  STOCK: {
    border: 'border-emerald-400/40',
    text: 'text-emerald-400',
    glow: '0 0 12px rgba(52,211,153,0.15), inset 0 0 8px rgba(52,211,153,0.05)',
    dot: 'bg-emerald-400',
  },
  SOLD: {
    border: 'border-[#D4AF37]/40',
    text: 'text-[#D4AF37]',
    glow: '0 0 12px rgba(212,175,55,0.15), inset 0 0 8px rgba(212,175,55,0.05)',
    dot: 'bg-[#D4AF37]',
  },
}

const SIZE_CLASSES = {
  small: 'text-[10px] px-2.5 py-0.5 gap-1.5',
  default: 'text-[11px] px-3 py-1 gap-1.5',
  large: 'text-xs px-3.5 py-1.5 gap-2',
}

function StatusBadge({ status, size = 'default' }) {
  const label = VEHICLE_STATUS_LABELS[status] || status
  const style = STATUS_STYLES[status] || STATUS_STYLES.SOURCING
  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.default

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold uppercase tracking-[0.08em] border bg-transparent ${style.border} ${style.text} ${sizeClass}`}
      style={{ boxShadow: style.glow }}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {label}
    </span>
  )
}

export default StatusBadge
