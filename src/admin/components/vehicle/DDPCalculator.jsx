import { useState, useMemo } from 'react'
import { Calculator, AlertTriangle, TrendingDown, ChevronDown, ChevronUp } from 'lucide-react'
import { calculateTotalLandedCost } from '../../../services/calculators/importCost'
import { formatPrice } from '../../utils/formatters'

/**
 * Calculateur DDP intégré au VehicleCockpit.
 * Calcule automatiquement les frais d'import (douane, TVA, malus CO2, malus poids)
 * à partir des données du véhicule.
 * @param {{ vehicle: Object, onApplyCost?: (cost: number) => void }} props
 */
export default function DDPCalculator({ vehicle, onApplyCost }) {
  const [expanded, setExpanded] = useState(false)
  const [customShipping, setCustomShipping] = useState('')

  const shippingCost = customShipping !== ''
    ? parseFloat(customShipping) || 0
    : parseFloat(vehicle.transportCost) || 0

  const result = useMemo(() => {
    if (!vehicle.purchasePrice) return null

    return calculateTotalLandedCost({
      countryOrigin: vehicle.importCountry || 'FR',
      co2GKm: parseFloat(vehicle.co2) || 0,
      weightKg: parseFloat(vehicle.weight) || 0,
      firstRegDate: vehicle.firstRegistrationDate || null,
      purchasePrice: parseFloat(vehicle.purchasePrice) || 0,
      fuelType: vehicle.fuel || '',
      shippingCost,
      firstRegYear: vehicle.year || null,
    })
  }, [vehicle, shippingCost])

  if (!result) return null

  const isImport = !result.is_eu_origin || vehicle.importCountry !== 'FR'
  const hasTaxes = result.customs_duty > 0 || result.malus_co2 > 0 || result.malus_weight > 0

  return (
    <div className="bg-[#0f0a0a] rounded-xl border border-white/5 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#C4A484]/10 rounded-lg">
            <Calculator size={18} className="text-[#C4A484]" />
          </div>
          <div className="text-left">
            <p className="text-white font-medium text-sm">Coût DDP Total</p>
            <p className="text-white/40 text-xs">
              {result.is_eu_origin ? 'Origine UE' : `Import ${vehicle.importCountry || '?'}`}
              {hasTaxes && ' — Taxes applicables'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[#C4A484] font-mono font-semibold text-lg">
            {formatPrice(result.total_landed_cost)}
          </span>
          {expanded ? <ChevronUp size={16} className="text-white/40" /> : <ChevronDown size={16} className="text-white/40" />}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-white/5 p-4 space-y-3">
          {/* Transport override */}
          <div className="flex items-center gap-3">
            <label className="text-white/50 text-xs w-24">Transport</label>
            <input
              type="number"
              value={customShipping !== '' ? customShipping : shippingCost || ''}
              onChange={(e) => setCustomShipping(e.target.value)}
              placeholder="0"
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white placeholder:text-white/20 focus:border-[#C4A484]/50 focus:outline-none"
            />
          </div>

          {/* Breakdown */}
          <div className="space-y-1.5 pt-2">
            {result.breakdown.map((line, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="text-white/60">{line.label}</span>
                <span className={`font-mono ${line.amount > 500 ? 'text-orange-400' : 'text-white/80'}`}>
                  {formatPrice(line.amount)}
                </span>
              </div>
            ))}
            <div className="border-t border-white/10 pt-2 flex items-center justify-between">
              <span className="text-white font-medium text-sm">Total DDP</span>
              <span className="text-[#C4A484] font-mono font-semibold">
                {formatPrice(result.total_landed_cost)}
              </span>
            </div>
          </div>

          {/* Warnings */}
          {result.malus_co2 > 2000 && (
            <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-xs text-red-400">
              <AlertTriangle size={14} className="mt-0.5 shrink-0" />
              <span>Malus CO2 de {formatPrice(result.malus_co2)} — impact fort sur la marge.</span>
            </div>
          )}

          {/* Apply button */}
          {onApplyCost && result.total_landed_cost > result.purchase_price && (
            <button
              onClick={() => onApplyCost(Math.round(result.total_landed_cost))}
              className="w-full mt-2 bg-[#C4A484]/10 hover:bg-[#C4A484]/20 border border-[#C4A484]/20 text-[#C4A484] rounded-lg py-2 text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <TrendingDown size={14} />
              Appliquer {formatPrice(result.total_landed_cost)} comme PRU
            </button>
          )}
        </div>
      )}
    </div>
  )
}
