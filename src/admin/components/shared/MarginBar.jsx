/**
 * MarginBar — Visual margin indicator bar
 * Props: percent (number), value (number, €), target (number, default 15)
 */
import { formatPrice } from '../../utils/formatters'

function MarginBar({ percent = 0, value = 0, target = 15 }) {
  // Clamp fill between 0 and 100 for display
  const fill = Math.max(0, Math.min(100, percent))

  // Color based on margin level
  let barColor = '#EF4444' // red < 20%
  if (percent >= 30) barColor = '#22C55E'      // green
  else if (percent >= 20) barColor = '#F59E0B'  // orange

  // Target position (clamped)
  const targetPos = Math.max(0, Math.min(100, target))

  return (
    <div className="w-full min-w-[100px]">
      {/* Bar */}
      <div className="relative h-2 bg-white/10 rounded-full overflow-visible">
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
          style={{ width: `${fill}%`, backgroundColor: barColor }}
        />
        {/* Target marker */}
        <div
          className="absolute top-[-3px] w-[2px] h-[14px] bg-white/40 rounded-full"
          style={{ left: `${targetPos}%` }}
          title={`Objectif: ${target}%`}
        />
      </div>
      {/* Label */}
      <div className="flex items-baseline justify-between mt-1">
        <span className="text-xs font-semibold" style={{ color: barColor }}>
          {percent.toFixed(1)}%
        </span>
        <span className="text-xs text-white/40">
          {formatPrice(value)}
        </span>
      </div>
    </div>
  )
}

export default MarginBar
