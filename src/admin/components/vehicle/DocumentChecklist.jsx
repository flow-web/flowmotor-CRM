/**
 * DocumentChecklist — Interactive document checklist per vehicle origin country
 * Statuses stored in localStorage per vehicle
 */
import { useState, useEffect } from 'react'
import { CheckCircle2, Clock, XCircle, FileText } from 'lucide-react'
import { DOCUMENT_CHECKLISTS, ORIGIN_COUNTRIES } from '../../utils/constants'
import EmptyState from '../shared/EmptyState'

const STATUS_CYCLE = ['missing', 'in_progress', 'obtained']

const STATUS_CONFIG = {
  missing: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-400/10', label: 'Manquant' },
  in_progress: { icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-400/10', label: 'En cours' },
  obtained: { icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-400/10', label: 'Obtenu' },
}

function DocumentChecklist({ vehicleId, importCountry }) {
  const storageKey = `flowmotor_doc_statuses_${vehicleId}`

  // Determine which checklist template to use
  const countryCode = importCountry?.toUpperCase() || ''
  const checklist = DOCUMENT_CHECKLISTS[countryCode] || DOCUMENT_CHECKLISTS.DEFAULT

  // Load statuses from localStorage
  const [statuses, setStatuses] = useState(() => {
    try {
      const stored = localStorage.getItem(storageKey)
      if (stored) return JSON.parse(stored)
    } catch { /* ignore */ }
    // Default: all missing
    const defaults = {}
    checklist.forEach(item => { defaults[item.key] = 'missing' })
    return defaults
  })

  // Persist on change
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(statuses))
  }, [statuses, storageKey])

  // Cycle status on click
  const cycleStatus = (key) => {
    setStatuses(prev => {
      const current = prev[key] || 'missing'
      const idx = STATUS_CYCLE.indexOf(current)
      const next = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length]
      return { ...prev, [key]: next }
    })
  }

  // Progress calculation
  const total = checklist.length
  const obtained = checklist.filter(item => statuses[item.key] === 'obtained').length
  const progressPercent = total > 0 ? (obtained / total) * 100 : 0

  // Find country name
  const countryName = ORIGIN_COUNTRIES.find(c => c.code === countryCode)?.name || countryCode || 'Inconnu'

  if (checklist.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="Pas de checklist disponible"
        subtitle="Aucun template de documents pour ce pays d'origine."
      />
    )
  }

  return (
    <div className="space-y-4">
      {/* Header + Progress */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-white/40 uppercase tracking-wider">
            Documents — {countryName}
          </p>
          <span className="text-xs text-white/60">
            {obtained}/{total} obtenus
          </span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progressPercent}%`,
              backgroundColor: progressPercent === 100 ? '#22C55E' : progressPercent > 50 ? '#F59E0B' : '#EF4444'
            }}
          />
        </div>
      </div>

      {/* Checklist items */}
      <div className="space-y-1">
        {checklist.map(item => {
          const status = statuses[item.key] || 'missing'
          const config = STATUS_CONFIG[status]
          const Icon = config.icon

          return (
            <button
              key={item.key}
              onClick={() => cycleStatus(item.key)}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                transition-all text-left
                hover:bg-white/5
                ${config.bg}
              `}
            >
              <Icon size={18} className={`flex-shrink-0 ${config.color}`} />
              <div className="flex-1 min-w-0">
                <span className="text-sm text-white">{item.label}</span>
                {item.required && status === 'missing' && (
                  <span className="ml-2 text-[10px] text-red-400/60 uppercase">requis</span>
                )}
              </div>
              <span className={`text-[10px] uppercase tracking-wider ${config.color} opacity-60`}>
                {config.label}
              </span>
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 pt-2 border-t border-white/5">
        <p className="text-[10px] text-white/30">Cliquez pour changer le statut :</p>
        {STATUS_CYCLE.map(s => {
          const c = STATUS_CONFIG[s]
          const I = c.icon
          return (
            <div key={s} className="flex items-center gap-1">
              <I size={12} className={c.color} />
              <span className={`text-[10px] ${c.color} opacity-60`}>{c.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default DocumentChecklist
