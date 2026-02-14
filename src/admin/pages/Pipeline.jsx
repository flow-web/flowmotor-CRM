import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Search, Truck, Shield, Wrench, Package, CheckCircle2,
  Car, ChevronRight, ChevronLeft, AlertTriangle, Clock
} from 'lucide-react'
import TopHeader from '../components/layout/TopHeader'
import AdminCard from '../components/shared/AdminCard'
import { useVehicles } from '../context/VehiclesContext'
import { formatPrice, formatMileage } from '../utils/formatters'

// ─── Pipeline stages derived from DB statuses ───
// SOURCING status splits into: SOURCING, IN_TRANSIT, CUSTOMS, WORKSHOP
// based on vehicle cost categories present
// STOCK and SOLD map directly

const PIPELINE_STAGES = [
  {
    key: 'SOURCING',
    label: 'Sourcing',
    subtitle: 'Recherche & negociation',
    icon: Search,
    color: '#FBBF24',       // yellow-400
    bgTint: 'rgba(251,191,36,0.06)',
    borderColor: 'rgba(251,191,36,0.25)',
    dotGlow: '0 0 8px rgba(251,191,36,0.4)',
  },
  {
    key: 'IN_TRANSIT',
    label: 'Transit',
    subtitle: 'En cours de livraison',
    icon: Truck,
    color: '#38BDF8',       // sky-400
    bgTint: 'rgba(56,189,248,0.06)',
    borderColor: 'rgba(56,189,248,0.25)',
    dotGlow: '0 0 8px rgba(56,189,248,0.4)',
  },
  {
    key: 'CUSTOMS',
    label: 'Douane',
    subtitle: 'Dedouanement & homologation',
    icon: Shield,
    color: '#A78BFA',       // violet-400
    bgTint: 'rgba(167,139,250,0.06)',
    borderColor: 'rgba(167,139,250,0.25)',
    dotGlow: '0 0 8px rgba(167,139,250,0.4)',
  },
  {
    key: 'WORKSHOP',
    label: 'Atelier',
    subtitle: 'Preparation & detailing',
    icon: Wrench,
    color: '#FB923C',       // orange-400
    bgTint: 'rgba(251,146,60,0.06)',
    borderColor: 'rgba(251,146,60,0.25)',
    dotGlow: '0 0 8px rgba(251,146,60,0.4)',
  },
  {
    key: 'STOCK',
    label: 'En Stock',
    subtitle: 'Pret a la vente',
    icon: Package,
    color: '#34D399',       // emerald-400
    bgTint: 'rgba(52,211,153,0.06)',
    borderColor: 'rgba(52,211,153,0.25)',
    dotGlow: '0 0 8px rgba(52,211,153,0.4)',
  },
  {
    key: 'SOLD',
    label: 'Vendu',
    subtitle: 'Livraison client',
    icon: CheckCircle2,
    color: '#D4AF37',
    bgTint: 'rgba(212,175,55,0.06)',
    borderColor: 'rgba(212,175,55,0.25)',
    dotGlow: '0 0 8px rgba(212,175,55,0.4)',
  },
]

// Pipeline stage order for forward/backward navigation
const STAGE_ORDER = PIPELINE_STAGES.map(s => s.key)

/**
 * Derive a pipeline stage from a vehicle's DB status + cost data.
 * SOURCING vehicles are sub-classified based on which costs exist:
 *   - has transport cost => IN_TRANSIT
 *   - has customs/homologation cost => CUSTOMS
 *   - has atelier/detailing/pieces cost => WORKSHOP
 *   - otherwise => SOURCING (pure search phase)
 */
function derivePipelineStage(vehicle) {
  if (vehicle.status === 'STOCK') return 'STOCK'
  if (vehicle.status === 'SOLD') return 'SOLD'

  // For SOURCING vehicles, look at costs to determine sub-stage
  const costs = vehicle.costs || []
  const costCategories = costs.map(c => (c.category || c.type || '').toUpperCase())

  const hasWorkshop = costCategories.some(c =>
    ['ATELIER', 'DETAILING', 'PIECES'].includes(c)
  )
  const hasCustoms = costCategories.some(c =>
    ['CUSTOMS', 'DOUANE', 'HOMOLOGATION', 'CO2_MALUS'].includes(c)
  )
  const hasTransport = costCategories.some(c =>
    ['TRANSPORT'].includes(c)
  ) || (vehicle.transportCost && vehicle.transportCost > 0)

  if (hasWorkshop) return 'WORKSHOP'
  if (hasCustoms) return 'CUSTOMS'
  if (hasTransport) return 'IN_TRANSIT'
  return 'SOURCING'
}

/**
 * Calculate days in current stage from updatedAt
 */
function daysInStage(vehicle) {
  const ref = vehicle.updatedAt || vehicle.createdAt
  if (!ref) return 0
  const now = new Date()
  const then = new Date(ref)
  return Math.max(0, Math.floor((now - then) / (1000 * 60 * 60 * 24)))
}

/**
 * Map a pipeline stage back to the actual DB status for updateStatus()
 */
function stageToDbStatus(stage) {
  if (stage === 'STOCK') return 'STOCK'
  if (stage === 'SOLD') return 'SOLD'
  // All pre-stock stages map to SOURCING in DB
  return 'SOURCING'
}

function Pipeline() {
  const { vehicles, updateStatus } = useVehicles()

  // Group vehicles by pipeline stage
  const stageGroups = useMemo(() => {
    const groups = {}
    PIPELINE_STAGES.forEach(s => { groups[s.key] = [] })

    ;(vehicles || []).forEach(v => {
      const stage = derivePipelineStage(v)
      if (groups[stage]) {
        groups[stage].push({ ...v, _pipelineStage: stage, _daysInStage: daysInStage(v) })
      }
    })

    // Sort each group: longest in stage first (alerts at top)
    Object.keys(groups).forEach(key => {
      groups[key].sort((a, b) => b._daysInStage - a._daysInStage)
    })

    return groups
  }, [vehicles])

  const totalActive = useMemo(() => {
    return (vehicles || []).filter(v => v.status !== 'SOLD').length
  }, [vehicles])

  // Move vehicle to next/previous pipeline stage (only changes actual DB status when crossing SOURCING/STOCK/SOLD boundary)
  const handleMove = async (vehicle, direction) => {
    const currentIdx = STAGE_ORDER.indexOf(vehicle._pipelineStage)
    const newIdx = direction === 'forward' ? currentIdx + 1 : currentIdx - 1
    if (newIdx < 0 || newIdx >= STAGE_ORDER.length) return

    const newStage = STAGE_ORDER[newIdx]
    const newDbStatus = stageToDbStatus(newStage)
    const currentDbStatus = vehicle.status

    // Only call updateStatus if the DB status actually changes
    if (newDbStatus !== currentDbStatus) {
      await updateStatus(vehicle.id, newDbStatus)
    }
    // Note: sub-stage changes within SOURCING are derived from costs,
    // so moving between SOURCING/IN_TRANSIT/CUSTOMS/WORKSHOP is informational.
    // The actual sub-stage is auto-derived from cost data.
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #0F0808 0%, #1A0F0F 40%)' }}>
      <TopHeader
        title="Control Tower"
        subtitle="Pipeline logistique"
      />

      <div className="p-4 sm:p-6 max-w-[1600px] mx-auto space-y-5">

        {/* ─── Summary bar ─── */}
        <div
          className="flex items-center gap-6 px-5 py-3 rounded-xl border border-white/[0.06]"
          style={{ background: 'rgba(255,255,255,0.02)', animation: 'admin-fade-up 0.4s ease-out' }}
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#D4AF37] shadow-[0_0_8px_rgba(212,175,55,0.5)]" />
            <span className="text-[10px] text-white/30 uppercase tracking-[0.15em] font-medium">Pipeline actif</span>
          </div>
          <span className="text-lg font-mono font-bold text-white tabular-nums">{totalActive}</span>
          <span className="text-[10px] text-white/20 uppercase tracking-wider">vehicules en cours</span>
          <div className="ml-auto flex items-center gap-4">
            {PIPELINE_STAGES.slice(0, -1).map(stage => {
              const count = stageGroups[stage.key]?.length || 0
              if (count === 0) return null
              return (
                <div key={stage.key} className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: stage.color }} />
                  <span className="text-[10px] text-white/30 font-mono tabular-nums">{count}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* ─── Kanban Board ─── */}
        <div
          className="overflow-x-auto pb-4 -mx-4 sm:-mx-6 px-4 sm:px-6"
          style={{ animation: 'admin-fade-up 0.5s ease-out' }}
        >
          <div className="flex gap-4 min-w-max">
            {PIPELINE_STAGES.map((stage, stageIdx) => {
              const Icon = stage.icon
              const items = stageGroups[stage.key] || []
              const alertCount = items.filter(v => v._daysInStage > 7).length

              return (
                <div
                  key={stage.key}
                  className="w-[280px] flex-shrink-0 flex flex-col rounded-2xl border border-white/[0.06] overflow-hidden"
                  style={{
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                    animation: `admin-fade-up ${0.4 + stageIdx * 0.08}s ease-out`,
                  }}
                >
                  {/* Column Header */}
                  <div
                    className="px-4 py-3.5 border-b border-white/[0.06] flex items-center gap-3"
                    style={{ background: stage.bgTint }}
                  >
                    <div
                      className="p-1.5 rounded-lg"
                      style={{ background: `${stage.color}15` }}
                    >
                      <Icon size={16} style={{ color: stage.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-white tracking-wide">{stage.label}</h3>
                        <span
                          className="text-[11px] font-mono font-bold tabular-nums px-1.5 py-0.5 rounded-md"
                          style={{
                            color: stage.color,
                            background: `${stage.color}15`,
                          }}
                        >
                          {items.length}
                        </span>
                      </div>
                      <p className="text-[10px] text-white/25 mt-0.5 tracking-wide">{stage.subtitle}</p>
                    </div>
                    {alertCount > 0 && (
                      <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-red-500/10">
                        <AlertTriangle size={11} className="text-red-400" />
                        <span className="text-[10px] font-mono text-red-400 tabular-nums">{alertCount}</span>
                      </div>
                    )}
                  </div>

                  {/* Column Body */}
                  <div className="flex-1 p-2.5 space-y-2 overflow-y-auto max-h-[calc(100vh-260px)] min-h-[120px]">
                    {items.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-10 text-center">
                        <Icon size={24} className="text-white/10 mb-2" />
                        <p className="text-[11px] text-white/20 uppercase tracking-wider">Aucun vehicule</p>
                      </div>
                    )}

                    {items.map((vehicle, vIdx) => (
                      <VehicleCard
                        key={vehicle.id}
                        vehicle={vehicle}
                        stage={stage}
                        stageIdx={stageIdx}
                        isFirst={stageIdx === 0}
                        isLast={stageIdx === PIPELINE_STAGES.length - 1}
                        onMove={handleMove}
                        animDelay={0.5 + stageIdx * 0.08 + vIdx * 0.04}
                      />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * VehicleCard — Individual vehicle in a pipeline column
 */
function VehicleCard({ vehicle, stage, stageIdx, isFirst, isLast, onMove, animDelay }) {
  const days = vehicle._daysInStage
  const isAlert = days > 7
  const isCritical = days > 14
  const primaryImage = vehicle.images?.[0]?.url || vehicle.images?.find?.(i => i.isPrimary)?.url

  return (
    <Link
      to={`/admin/vehicle/${vehicle.id}`}
      className="block rounded-xl border transition-all duration-200 group hover:border-[#D4AF37]/25 hover:shadow-[0_0_20px_rgba(212,175,55,0.06)]"
      style={{
        background: '#1A1414',
        borderColor: isAlert ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.06)',
        animation: `admin-fade-up ${animDelay}s ease-out`,
      }}
    >
      {/* Thumbnail + Info */}
      <div className="p-3">
        <div className="flex items-start gap-3">
          {/* Thumbnail */}
          <div className="w-12 h-9 rounded-lg overflow-hidden bg-white/[0.04] flex-shrink-0 border border-white/[0.06] group-hover:border-[#D4AF37]/20 transition-colors">
            {primaryImage ? (
              <img
                src={primaryImage}
                alt={`${vehicle.brand || vehicle.make} ${vehicle.model}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Car size={14} className="text-white/15" />
              </div>
            )}
          </div>

          {/* Vehicle info */}
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-white truncate group-hover:text-[#D4AF37] transition-colors duration-200">
              {vehicle.brand || vehicle.make} {vehicle.model}
            </p>
            <p className="text-[10px] text-white/30 font-mono tabular-nums mt-0.5">
              {vehicle.year}{vehicle.mileage ? ` \u00B7 ${formatMileage(vehicle.mileage)}` : ''}
            </p>
          </div>
        </div>

        {/* Price + Days badge row */}
        <div className="flex items-center justify-between mt-2.5">
          {vehicle.sellingPrice ? (
            <span className="text-[12px] font-mono font-semibold text-white/70 tabular-nums">
              {formatPrice(vehicle.sellingPrice)}
            </span>
          ) : (
            <span className="text-[11px] text-white/20 italic">Prix non defini</span>
          )}

          <span
            className="inline-flex items-center gap-1 text-[10px] font-mono font-medium px-2 py-0.5 rounded-md tabular-nums"
            style={{
              color: isCritical ? '#EF4444' : isAlert ? '#FB923C' : 'rgba(255,255,255,0.35)',
              background: isCritical ? 'rgba(239,68,68,0.1)' : isAlert ? 'rgba(251,146,60,0.1)' : 'rgba(255,255,255,0.04)',
            }}
          >
            <Clock size={10} />
            {days}j
          </span>
        </div>
      </div>

      {/* Action buttons — stop propagation to prevent Link navigation */}
      <div
        className="flex border-t border-white/[0.04] divide-x divide-white/[0.04]"
        onClick={(e) => e.preventDefault()}
      >
        <button
          disabled={isFirst}
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onMove(vehicle, 'backward') }}
          className="flex-1 flex items-center justify-center gap-1 py-2 text-[10px] uppercase tracking-wider font-medium transition-colors duration-200 disabled:opacity-20 disabled:cursor-not-allowed text-white/30 hover:text-white/60 hover:bg-white/[0.03]"
          title="Etape precedente"
        >
          <ChevronLeft size={12} />
          Reculer
        </button>
        <button
          disabled={isLast}
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onMove(vehicle, 'forward') }}
          className="flex-1 flex items-center justify-center gap-1 py-2 text-[10px] uppercase tracking-wider font-medium transition-colors duration-200 disabled:opacity-20 disabled:cursor-not-allowed hover:bg-white/[0.03]"
          style={{ color: isLast ? 'rgba(255,255,255,0.2)' : stage.color }}
          title="Etape suivante"
        >
          Avancer
          <ChevronRight size={12} />
        </button>
      </div>
    </Link>
  )
}

export default Pipeline
