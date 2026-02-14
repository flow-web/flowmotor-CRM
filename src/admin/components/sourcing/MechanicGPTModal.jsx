import { useState, useCallback, useRef, useEffect } from 'react'
import {
  X, Upload, Loader2, AlertTriangle, AlertCircle,
  CheckCircle2, Wrench, ShieldAlert, ShieldCheck, Shield,
  CircleDollarSign, Plus, FileImage, Trash2,
} from 'lucide-react'
import { analyzeTechnicalReport, isGeminiConfigured } from '../../../services/ai/gemini'
import { useUI } from '../../context/UIContext'
import { Button } from '@/components/ui/button'

const RISK_CONFIG = {
  Low: {
    icon: ShieldCheck,
    color: 'text-green-400',
    bg: 'bg-green-500/10 border-green-500/20',
    label: 'Risque Faible',
    barColor: 'bg-green-500',
  },
  Medium: {
    icon: Shield,
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10 border-yellow-500/20',
    label: 'Risque Moyen',
    barColor: 'bg-yellow-500',
  },
  High: {
    icon: ShieldAlert,
    color: 'text-red-400',
    bg: 'bg-red-500/10 border-red-500/20',
    label: 'Risque Eleve',
    barColor: 'bg-red-500',
  },
}

export default function MechanicGPTModal({ onClose, onAddToExpenses }) {
  const { toast } = useUI()
  const fileInputRef = useRef(null)
  const dropZoneRef = useRef(null)

  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState(null)
  const [isDragging, setIsDragging] = useState(false)

  // Close on Escape
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const handleFile = useCallback((file) => {
    if (!file) return
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      toast.error('Format non supporté. Utilisez une image (JPG, PNG) ou un PDF.')
      return
    }
    setImageFile(file)
    setAnalysis(null)

    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => setImagePreview(e.target.result)
      reader.readAsDataURL(file)
    } else {
      setImagePreview(null)
    }
  }, [toast])

  // Drag and drop handlers
  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    const file = e.dataTransfer?.files?.[0]
    if (file) handleFile(file)
  }, [handleFile])

  const handleFileInput = (e) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview(null)
    setAnalysis(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // Analyze CT report
  const handleAnalyze = async () => {
    if (!imageFile) return
    if (!isGeminiConfigured()) {
      toast.error('Cle API Gemini non configuree')
      return
    }

    setIsAnalyzing(true)
    try {
      const result = await analyzeTechnicalReport(imageFile)
      if (result) {
        setAnalysis(result)
        toast.success('Analyse terminee !')
      } else {
        toast.error("Impossible d'analyser le rapport. Verifiez l'image et reessayez.")
      }
    } catch (err) {
      console.error('CT analysis error:', err)
      toast.error("Erreur lors de l'analyse")
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Add repair cost to vehicle expenses
  const handleAddToExpenses = () => {
    if (!analysis || !onAddToExpenses) return
    onAddToExpenses({
      category: 'Atelier',
      description: `Reparations CT — ${analysis.defects.length} defaut(s) detecte(s)`,
      amount: analysis.totalEstimatedRepairCost,
      defects: analysis.defects,
    })
    toast.success(`${formatPrice(analysis.totalEstimatedRepairCost)} ajoutes aux frais prevus`)
    onClose()
  }

  const formatPrice = (value) => {
    if (!value && value !== 0) return '-'
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(value)
  }

  const majorDefects = analysis?.defects?.filter((d) => d.severity === 'major') || []
  const minorDefects = analysis?.defects?.filter((d) => d.severity === 'minor') || []
  const riskConfig = analysis ? RISK_CONFIG[analysis.riskLevel] || RISK_CONFIG.Medium : null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative bg-[#1A1414] border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#1A1414] border-b border-white/10 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <Wrench className="text-red-400" size={20} />
            </div>
            <div>
              <h2 className="text-white font-semibold text-lg">Mechanic GPT</h2>
              <p className="text-white/40 text-sm">Analyseur de Controle Technique</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/40 hover:text-white transition-colors rounded-lg hover:bg-white/5"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Drop zone */}
          {!analysis && (
            <div
              ref={dropZoneRef}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => !imageFile && fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer min-h-[180px] flex flex-col items-center justify-center gap-3 ${
                isDragging
                  ? 'border-[#C4A484] bg-[#C4A484]/5'
                  : imageFile
                  ? 'border-white/10 bg-[#0f0a0a]'
                  : 'border-white/20 hover:border-white/30'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,application/pdf"
                onChange={handleFileInput}
                className="hidden"
              />

              {isAnalyzing && (
                <div className="absolute inset-0 bg-[#1A1414]/90 rounded-xl flex flex-col items-center justify-center z-10 gap-3">
                  <Loader2 className="animate-spin text-[#C4A484]" size={36} />
                  <p className="text-white/60 text-sm">Analyse du rapport en cours...</p>
                  <p className="text-white/30 text-xs">Le mecanicien virtuel inspecte le CT</p>
                </div>
              )}

              {!imageFile ? (
                <>
                  <Upload size={40} className="text-white/20" />
                  <p className="text-white/60 text-sm">
                    <span className="text-[#C4A484] font-medium">Glisser le CT ici</span> pour analyse
                  </p>
                  <p className="text-white/30 text-xs">
                    ou cliquez pour selectionner un fichier (JPG, PNG, PDF)
                  </p>
                </>
              ) : (
                <div className="w-full">
                  <div className="flex items-center gap-3 mb-3">
                    <FileImage size={16} className="text-[#C4A484]" />
                    <span className="text-white/70 text-sm truncate flex-1">{imageFile.name}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleRemoveImage() }}
                      className="p-1 text-white/30 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="CT Report Preview"
                      className="max-h-[200px] mx-auto rounded-lg border border-white/10 object-contain"
                    />
                  )}
                  {!imagePreview && imageFile.type === 'application/pdf' && (
                    <div className="flex items-center justify-center py-6 text-white/40 text-sm">
                      PDF selectionne — pret pour analyse
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Analyze button */}
          {imageFile && !analysis && (
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !isGeminiConfigured()}
              className="w-full bg-[#C4A484] hover:bg-[#C4A484]/80 text-black font-semibold h-12"
            >
              {isAnalyzing ? (
                <span className="flex items-center gap-2">
                  <Loader2 size={18} className="animate-spin" />
                  Analyse en cours...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Wrench size={18} />
                  Analyser le Controle Technique
                </span>
              )}
            </Button>
          )}

          {!isGeminiConfigured() && (
            <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 text-sm text-yellow-400">
              <AlertTriangle size={16} />
              <span>Cle API Gemini non configuree dans .env</span>
            </div>
          )}

          {/* ============ HEALTH CARD ============ */}
          {analysis && (
            <>
              {/* Risk level + Total cost header */}
              <div className={`rounded-xl p-5 border ${riskConfig.bg}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <riskConfig.icon size={24} className={riskConfig.color} />
                    <div>
                      <h3 className={`font-semibold ${riskConfig.color}`}>
                        {riskConfig.label}
                      </h3>
                      <p className="text-white/40 text-xs">
                        {analysis.ctResult !== 'Inconnu' && `CT : ${analysis.ctResult}`}
                        {analysis.ctDate && ` — ${analysis.ctDate}`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white/40 text-xs uppercase tracking-wider">
                      Cout estime
                    </p>
                    <p className={`text-2xl font-bold ${riskConfig.color}`}>
                      {formatPrice(analysis.totalEstimatedRepairCost)}
                    </p>
                  </div>
                </div>

                {/* Risk bar */}
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${riskConfig.barColor}`}
                    style={{
                      width: `${Math.min(
                        analysis.riskLevel === 'Low' ? 25 :
                        analysis.riskLevel === 'Medium' ? 55 : 90,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>

              {/* Vehicle info from CT */}
              {analysis.vehicleInfo && (
                <div className="bg-[#0f0a0a] rounded-xl p-4 border border-white/5 flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-[#C4A484] flex-shrink-0" />
                  <p className="text-white/60 text-sm">{analysis.vehicleInfo}</p>
                </div>
              )}

              {/* Defects list */}
              <div className="bg-[#0f0a0a] rounded-xl border border-white/5 overflow-hidden">
                <div className="px-5 py-3 border-b border-white/5">
                  <h3 className="text-white/50 text-xs uppercase tracking-wider">
                    Defauts detectes ({analysis.defects.length})
                  </h3>
                </div>

                {analysis.defects.length === 0 ? (
                  <div className="p-6 text-center">
                    <CheckCircle2 size={32} className="text-green-400 mx-auto mb-2" />
                    <p className="text-green-400 font-medium">Aucun defaut detecte</p>
                    <p className="text-white/40 text-sm mt-1">Le CT semble favorable</p>
                  </div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {/* Major defects */}
                    {majorDefects.length > 0 && (
                      <div>
                        <div className="px-5 py-2 bg-red-500/5">
                          <span className="text-red-400 text-xs font-medium uppercase tracking-wider">
                            Defaillances Majeures ({majorDefects.length})
                          </span>
                        </div>
                        {majorDefects.map((defect, i) => (
                          <div key={`major-${i}`} className="px-5 py-3 flex items-center gap-3">
                            <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-white text-sm">{defect.name}</p>
                              {defect.code && (
                                <span className="text-white/30 text-xs font-mono">{defect.code}</span>
                              )}
                            </div>
                            <span className="text-red-400 font-semibold text-sm whitespace-nowrap">
                              {formatPrice(defect.estimatedCost)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Minor defects */}
                    {minorDefects.length > 0 && (
                      <div>
                        <div className="px-5 py-2 bg-yellow-500/5">
                          <span className="text-yellow-400 text-xs font-medium uppercase tracking-wider">
                            Defaillances Mineures ({minorDefects.length})
                          </span>
                        </div>
                        {minorDefects.map((defect, i) => (
                          <div key={`minor-${i}`} className="px-5 py-3 flex items-center gap-3">
                            <AlertTriangle size={16} className="text-yellow-400 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-white/80 text-sm">{defect.name}</p>
                              {defect.code && (
                                <span className="text-white/30 text-xs font-mono">{defect.code}</span>
                              )}
                            </div>
                            <span className="text-yellow-400 font-semibold text-sm whitespace-nowrap">
                              {formatPrice(defect.estimatedCost)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Total */}
                {analysis.defects.length > 0 && (
                  <div className="px-5 py-3 bg-white/5 border-t border-white/5 flex items-center justify-between">
                    <span className="text-white/60 text-sm font-medium">Total reparations</span>
                    <span className="text-[#C4A484] font-bold text-lg">
                      {formatPrice(analysis.totalEstimatedRepairCost)}
                    </span>
                  </div>
                )}
              </div>

              {/* Notes */}
              {analysis.notes && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 flex items-start gap-3">
                  <Wrench size={16} className="text-blue-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-400/90 leading-relaxed">{analysis.notes}</p>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex items-center gap-3">
                {onAddToExpenses && analysis.totalEstimatedRepairCost > 0 && (
                  <Button
                    onClick={handleAddToExpenses}
                    className="flex-1 bg-[#5C3A2E] hover:bg-[#5C3A2E]/80 text-white font-semibold h-12"
                  >
                    <span className="flex items-center gap-2">
                      <Plus size={16} />
                      Ajouter {formatPrice(analysis.totalEstimatedRepairCost)} aux Frais
                    </span>
                  </Button>
                )}

                <Button
                  onClick={handleRemoveImage}
                  variant="outline"
                  className="border-white/10 text-white/60 hover:text-white hover:bg-white/5 h-12"
                >
                  <span className="flex items-center gap-2">
                    <CircleDollarSign size={16} />
                    Analyser un autre CT
                  </span>
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
