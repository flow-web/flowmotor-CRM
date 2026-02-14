import { useState, useCallback, useRef } from 'react'
import {
  Upload, FileImage, AlertTriangle, AlertCircle, CheckCircle,
  Shield, ShieldAlert, ShieldX, Loader2, Plus, X, RotateCcw, Stethoscope
} from 'lucide-react'
import { analyzeTechnicalReport, isGeminiConfigured } from '../../../services/ai/gemini'
import { formatPrice } from '../../utils/formatters'

const RISK_CONFIG = {
  Low: {
    icon: Shield,
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    label: 'Risque Faible',
  },
  Medium: {
    icon: ShieldAlert,
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
    label: 'Risque Moyen',
  },
  High: {
    icon: ShieldX,
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    label: 'Risque Elevé',
  },
}

export default function CTAnalyzer({ vehicleId, onAddCost }) {
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [addedToCosts, setAddedToCosts] = useState(false)
  const [preview, setPreview] = useState(null)
  const inputRef = useRef(null)

  const handleFile = useCallback(async (file) => {
    if (!file) return
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      setError('Format non supporté. Utilisez une image (JPG, PNG) ou un PDF.')
      return
    }

    // Preview
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file)
      setPreview(url)
    } else {
      setPreview(null)
    }

    setError(null)
    setResult(null)
    setAddedToCosts(false)
    setAnalyzing(true)

    try {
      const data = await analyzeTechnicalReport(file)
      if (!data) {
        setError("Impossible de lire le rapport. Vérifiez que l'image est lisible et réessayez.")
        return
      }
      setResult(data)
    } catch (err) {
      console.error('[CTAnalyzer] Error:', err)
      setError(err.message || "Erreur lors de l'analyse")
    } finally {
      setAnalyzing(false)
    }
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    const file = e.dataTransfer?.files?.[0]
    if (file) handleFile(file)
  }, [handleFile])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleInputChange = useCallback((e) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }, [handleFile])

  const handleAddToCosts = async () => {
    if (!result || addedToCosts) return

    const costs = []

    // Add each defect as a separate cost entry for transparency
    if (result.defects.length <= 3) {
      for (const defect of result.defects) {
        if (defect.estimatedCost > 0) {
          costs.push({
            type: 'Atelier',
            amount: defect.estimatedCost,
            description: `CT: ${defect.name}${defect.code ? ` (${defect.code})` : ''} [${defect.severity === 'major' ? 'Majeur' : 'Mineur'}]`,
            supplier: 'Estimation CT (Mechanic GPT)',
          })
        }
      }
    } else {
      // Many defects → group as single cost
      costs.push({
        type: 'Atelier',
        amount: result.totalEstimatedRepairCost,
        description: `Estimation CT: ${result.defects.length} défauts (${result.defects.filter(d => d.severity === 'major').length} majeurs)`,
        supplier: 'Estimation CT (Mechanic GPT)',
      })
    }

    if (costs.length === 0) return

    try {
      for (const cost of costs) {
        await onAddCost(cost)
      }
      setAddedToCosts(true)
    } catch (err) {
      console.error('[CTAnalyzer] Error adding costs:', err)
      setError("Erreur lors de l'ajout aux frais")
    }
  }

  const handleReset = () => {
    setResult(null)
    setError(null)
    setAddedToCosts(false)
    if (preview) {
      URL.revokeObjectURL(preview)
      setPreview(null)
    }
    if (inputRef.current) inputRef.current.value = ''
  }

  if (!isGeminiConfigured()) return null

  const majorCount = result?.defects?.filter(d => d.severity === 'major').length || 0
  const minorCount = result?.defects?.filter(d => d.severity === 'minor').length || 0
  const risk = result ? RISK_CONFIG[result.riskLevel] || RISK_CONFIG.Medium : null

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-[#F4E8D8] font-medium flex items-center gap-2">
          <Stethoscope size={18} className="text-purple-400" />
          Mechanic GPT — Analyse CT
        </h3>
        {result && (
          <button
            onClick={handleReset}
            className="text-xs text-white/40 hover:text-white/70 flex items-center gap-1 transition-colors"
          >
            <RotateCcw size={13} />
            Nouvelle analyse
          </button>
        )}
      </div>

      {/* DropZone — only when no result */}
      {!result && !analyzing && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => inputRef.current?.click()}
          className="relative cursor-pointer border-2 border-dashed border-purple-500/30 hover:border-purple-500/60 rounded-xl p-8 text-center transition-all group bg-purple-500/5 hover:bg-purple-500/10"
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*,application/pdf"
            onChange={handleInputChange}
            className="hidden"
          />
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileImage size={28} className="text-purple-400" />
            </div>
            <div>
              <p className="text-white/80 text-sm font-medium">
                Analyser un Controle Technique
              </p>
              <p className="text-white/40 text-xs mt-1">
                Glissez une photo du rapport CT ou cliquez pour parcourir
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-white/30">
              <Upload size={12} />
              JPG, PNG ou PDF
            </div>
          </div>
        </div>
      )}

      {/* Analyzing spinner */}
      {analyzing && (
        <div className="border border-purple-500/20 rounded-xl p-10 text-center bg-purple-500/5">
          <Loader2 size={36} className="text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-white/70 text-sm font-medium">Analyse en cours...</p>
          <p className="text-white/40 text-xs mt-1">Mechanic GPT lit le rapport CT</p>
        </div>
      )}

      {/* Error */}
      {error && !analyzing && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-300 text-sm">{error}</p>
            <button
              onClick={handleReset}
              className="text-xs text-red-400/70 hover:text-red-300 mt-2 underline"
            >
              Réessayer
            </button>
          </div>
        </div>
      )}

      {/* Results — Health Card */}
      {result && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
          {/* Top summary card */}
          <div className={`rounded-xl border p-5 ${risk.bg} ${risk.border}`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {(() => {
                  const RiskIcon = risk.icon
                  return <RiskIcon size={28} className={risk.color} />
                })()}
                <div>
                  <p className={`font-semibold text-lg ${risk.color}`}>{risk.label}</p>
                  <p className="text-white/50 text-xs">
                    {result.ctResult !== 'Inconnu' && `Résultat: ${result.ctResult}`}
                    {result.ctDate && ` — ${result.ctDate}`}
                  </p>
                </div>
              </div>
              {/* Cost badge */}
              <div className="text-right">
                <p className="text-white/40 text-xs uppercase">Cout estimé</p>
                <p className={`text-2xl font-serif font-bold ${
                  result.totalEstimatedRepairCost > 1500 ? 'text-red-400' :
                  result.totalEstimatedRepairCost > 500 ? 'text-yellow-400' :
                  'text-green-400'
                }`}>
                  {formatPrice(result.totalEstimatedRepairCost)}
                </p>
              </div>
            </div>

            {/* Counters */}
            <div className="flex gap-4 text-xs">
              {majorCount > 0 && (
                <span className="flex items-center gap-1.5 text-red-400">
                  <AlertTriangle size={13} />
                  {majorCount} défaut{majorCount > 1 ? 's' : ''} majeur{majorCount > 1 ? 's' : ''}
                </span>
              )}
              {minorCount > 0 && (
                <span className="flex items-center gap-1.5 text-yellow-400">
                  <AlertCircle size={13} />
                  {minorCount} défaut{minorCount > 1 ? 's' : ''} mineur{minorCount > 1 ? 's' : ''}
                </span>
              )}
              {majorCount === 0 && minorCount === 0 && (
                <span className="flex items-center gap-1.5 text-green-400">
                  <CheckCircle size={13} />
                  Aucun défaut détecté
                </span>
              )}
            </div>

            {result.vehicleInfo && (
              <p className="text-white/40 text-xs mt-3">{result.vehicleInfo}</p>
            )}
          </div>

          {/* Defects list */}
          {result.defects.length > 0 && (
            <div className="bg-[#1A0F0F] border border-white/10 rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-white/5">
                <p className="text-white/60 text-xs uppercase tracking-wider">
                  Détail des défauts ({result.defects.length})
                </p>
              </div>
              <div className="divide-y divide-white/5">
                {result.defects.map((defect, i) => {
                  const isMajor = defect.severity === 'major'
                  return (
                    <div key={i} className="flex items-center justify-between px-4 py-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isMajor ? 'bg-red-500/15' : 'bg-yellow-500/15'
                        }`}>
                          {isMajor
                            ? <AlertTriangle size={14} className="text-red-400" />
                            : <AlertCircle size={14} className="text-yellow-400" />
                          }
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm text-white/90 truncate">{defect.name}</p>
                          <p className="text-xs text-white/40">
                            {isMajor ? 'Majeur' : 'Mineur'}
                            {defect.code && ` — ${defect.code}`}
                          </p>
                        </div>
                      </div>
                      <span className={`text-sm font-mono flex-shrink-0 ml-3 ${
                        isMajor ? 'text-red-300' : 'text-yellow-300'
                      }`}>
                        {formatPrice(defect.estimatedCost)}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Notes */}
          {result.notes && (
            <p className="text-xs text-white/40 italic px-1">{result.notes}</p>
          )}

          {/* Add to costs button */}
          {result.totalEstimatedRepairCost > 0 && (
            <button
              onClick={handleAddToCosts}
              disabled={addedToCosts}
              className={`w-full py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all ${
                addedToCosts
                  ? 'bg-green-600/20 border border-green-500/30 text-green-400 cursor-default'
                  : 'bg-purple-600 hover:bg-purple-500 text-white'
              }`}
            >
              {addedToCosts ? (
                <>
                  <CheckCircle size={16} />
                  Ajouté aux frais atelier
                </>
              ) : (
                <>
                  <Plus size={16} />
                  Ajouter {formatPrice(result.totalEstimatedRepairCost)} aux frais
                </>
              )}
            </button>
          )}

          {/* Preview thumbnail */}
          {preview && (
            <div className="relative">
              <button
                onClick={() => { URL.revokeObjectURL(preview); setPreview(null) }}
                className="absolute top-2 right-2 bg-black/60 rounded-full p-1 text-white/60 hover:text-white transition-colors z-10"
              >
                <X size={14} />
              </button>
              <img
                src={preview}
                alt="CT Report"
                className="w-full max-h-64 object-contain rounded-lg border border-white/10 bg-black/20"
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
