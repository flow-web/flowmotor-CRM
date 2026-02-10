/**
 * PRUBreakdown — Visual breakdown of PRU (Prix de Revient Unitaire)
 * Shows a stacked horizontal bar + detailed legend + net margin card
 */
import { AlertTriangle } from 'lucide-react'
import { COST_CATEGORY_COLORS } from '../../utils/constants'
import { formatPrice } from '../../utils/formatters'

function PRUBreakdown({ vehicle, pru, margin, marginValue, targetMargin = 15 }) {
  const costs = vehicle?.costs || []
  const purchasePrice = vehicle?.purchasePrice || 0

  // Aggregate costs by type
  const aggregated = {}
  // Start with purchase price as "Achat"
  if (purchasePrice > 0) {
    aggregated['Achat'] = purchasePrice
  }
  costs.forEach(c => {
    const type = c.type || 'Autre'
    aggregated[type] = (aggregated[type] || 0) + (c.amount || 0)
  })

  const total = pru || Object.values(aggregated).reduce((s, v) => s + v, 0)
  if (total <= 0) return null

  // Build segments
  const segments = Object.entries(aggregated)
    .filter(([, amount]) => amount > 0)
    .map(([type, amount]) => ({
      type,
      amount,
      percent: (amount / total) * 100,
      color: COST_CATEGORY_COLORS[type] || '#95A5A6'
    }))
    .sort((a, b) => b.amount - a.amount)

  // Margin colors
  const isNegative = marginValue < 0
  const marginBg = isNegative ? 'bg-red-500/10 border-red-500/20' : 'bg-green-500/10 border-green-500/20'
  const marginText = isNegative ? 'text-red-400' : 'text-green-400'

  return (
    <div className="space-y-4">
      {/* Stacked bar */}
      <div>
        <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Décomposition PRU</p>
        <div className="flex h-8 rounded-lg overflow-hidden bg-white/5">
          {segments.map((seg) => (
            <div
              key={seg.type}
              className="h-full transition-all duration-500 relative group"
              style={{
                width: `${seg.percent}%`,
                backgroundColor: seg.color,
                minWidth: seg.percent > 0 ? '2px' : 0
              }}
              title={`${seg.type}: ${formatPrice(seg.amount)} (${seg.percent.toFixed(1)}%)`}
            >
              {/* Tooltip on hover */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity z-10">
                {seg.type}: {formatPrice(seg.amount)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2">
        {segments.map((seg) => (
          <div key={seg.type} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div
                className="w-3 h-3 rounded-sm flex-shrink-0"
                style={{ backgroundColor: seg.color }}
              />
              <span className="text-xs text-white/60 truncate">{seg.type}</span>
              <span className="text-xs text-white/30">{seg.percent.toFixed(0)}%</span>
            </div>
            <span className="text-xs text-white font-medium whitespace-nowrap">
              {formatPrice(seg.amount)}
            </span>
          </div>
        ))}
      </div>

      {/* Net margin card */}
      <div className={`rounded-lg border p-4 ${marginBg}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-white/40 uppercase tracking-wider">Marge nette</p>
            <p className={`text-2xl font-bold mt-1 ${marginText}`}>
              {formatPrice(marginValue)}
            </p>
          </div>
          <div className="text-right">
            <p className={`text-lg font-semibold ${marginText}`}>
              {margin.toFixed(1)}%
            </p>
            <p className="text-xs text-white/30">PRU: {formatPrice(pru)}</p>
          </div>
        </div>
      </div>

      {/* Warning if margin below target */}
      {margin < targetMargin && margin >= 0 && (
        <div className="flex items-center gap-2 px-3 py-2 bg-yellow-400/10 border border-yellow-400/20 rounded-lg">
          <AlertTriangle size={14} className="text-yellow-400 flex-shrink-0" />
          <p className="text-xs text-yellow-400/80">
            Marge inférieure à l'objectif de {targetMargin}% — Actuel : {margin.toFixed(1)}%
          </p>
        </div>
      )}
    </div>
  )
}

export default PRUBreakdown
