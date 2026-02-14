import { useState } from 'react'
import {
  X, Target, TrendingDown, TrendingUp, AlertTriangle, Loader2,
  CheckCircle2, XCircle, Zap, Activity, Info,
} from 'lucide-react'
import { analyzeMarketPrice, isGeminiConfigured } from '../../../services/ai/gemini'
import { useUI } from '../../context/UIContext'
import { Button } from '@/components/ui/button'

export default function MarketSniperModal({ vehicle, onClose, onApplyPrice }) {
  const { toast } = useUI()
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState(null)

  const calculateDealMetrics = (marketData) => {
    const purchasePrice = parseFloat(vehicle.purchasePrice) || 0
    const costPrice = parseFloat(vehicle.costPrice) || purchasePrice
    const avgMarketPrice = marketData.averagePrice

    const potentialMargin = avgMarketPrice - costPrice
    const potentialMarginPercent = costPrice > 0 ? (potentialMargin / avgMarketPrice) * 100 : 0

    const marketDiscount = avgMarketPrice - purchasePrice
    const marketDiscountPercent = avgMarketPrice > 0 ? (marketDiscount / avgMarketPrice) * 100 : 0

    let dealQuality = 'danger'
    let dealLabel = 'Prix élevé'
    let dealIcon = XCircle

    if (marketDiscountPercent >= 20) {
      dealQuality = 'excellent' // Green
      dealLabel = 'Excellente affaire'
      dealIcon = CheckCircle2
    } else if (marketDiscountPercent >= 10) {
      dealQuality = 'good' // Light green
      dealLabel = 'Bonne affaire'
      dealIcon = Zap
    } else if (marketDiscountPercent >= 0) {
      dealQuality = 'neutral' // Orange
      dealLabel = 'Prix marché'
      dealIcon = Activity
    }

    return {
      potentialMargin,
      potentialMarginPercent,
      marketDiscount,
      marketDiscountPercent,
      dealQuality,
      dealLabel,
      dealIcon,
    }
  }

  const handleAnalyze = async () => {
    if (!isGeminiConfigured()) {
      toast.error('Clé API Gemini non configurée')
      return
    }

    setIsAnalyzing(true)
    try {
      const vehicleData = {
        year: vehicle.year,
        brand: vehicle.brand,
        model: vehicle.model,
        trim: vehicle.trim,
        mileage: vehicle.mileage,
        fuel: vehicle.fuel,
        transmission: vehicle.gearbox,
        color: vehicle.color,
      }

      const result = await analyzeMarketPrice(vehicleData)

      if (result) {
        setAnalysis(result)
        toast.success('Analyse terminée')
      } else {
        toast.error('Impossible d\'analyser le marché. Réessayez.')
      }
    } catch (err) {
      console.error('Market analysis error:', err)
      toast.error('Erreur lors de l\'analyse')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const metrics = analysis ? calculateDealMetrics(analysis) : null

  const formatPrice = (value) => {
    if (!value && value !== 0) return '—'
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(value)
  }

  const confidenceColors = {
    low: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    medium: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    high: 'text-green-400 bg-green-400/10 border-green-400/20',
  }

  const confidenceLabels = {
    low: 'Confiance faible',
    medium: 'Confiance moyenne',
    high: 'Confiance élevée',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-[#1A1414] border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 z-10 bg-[#1A1414] border-b border-white/10 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#C4A484]/20 rounded-lg">
              <Target className="text-[#C4A484]" size={20} />
            </div>
            <div>
              <h2 className="text-white font-semibold text-lg">Market Sniper</h2>
              <p className="text-white/40 text-sm">Analyse de marché IA</p>
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
          <div className="bg-[#0f0a0a] rounded-xl p-4 border border-white/5">
            <h3 className="text-white font-medium mb-2">
              {vehicle.year} {vehicle.brand} {vehicle.model}
              {vehicle.trim && <span className="text-white/50"> {vehicle.trim}</span>}
            </h3>
            <div className="flex flex-wrap gap-4 text-sm text-white/60">
              {vehicle.mileage > 0 && (
                <span>{vehicle.mileage.toLocaleString('fr-FR')} km</span>
              )}
              {vehicle.fuel && <span>{vehicle.fuel}</span>}
              {vehicle.gearbox && <span>{vehicle.gearbox}</span>}
              {vehicle.color && <span>{vehicle.color}</span>}
            </div>
            <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
              <span className="text-white/50 text-sm">Prix d'achat</span>
              <span className="text-[#C4A484] font-semibold">
                {formatPrice(vehicle.purchasePrice)}
              </span>
            </div>
            {vehicle.costPrice && vehicle.costPrice !== vehicle.purchasePrice && (
              <div className="mt-2 flex items-center justify-between">
                <span className="text-white/50 text-sm">PRU (avec frais)</span>
                <span className="text-white font-semibold">
                  {formatPrice(vehicle.costPrice)}
                </span>
              </div>
            )}
          </div>

          {!analysis && (
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
                  <Target size={18} />
                  Analyser le Marché
                </span>
              )}
            </Button>
          )}

          {!isGeminiConfigured() && (
            <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 text-sm text-yellow-400">
              <AlertTriangle size={16} />
              <span>Clé API Gemini non configurée dans .env</span>
            </div>
          )}

          {analysis && metrics && (
            <>
              <div className="bg-[#0f0a0a] rounded-xl p-5 border border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-medium flex items-center gap-2">
                    <metrics.dealIcon size={18} className={
                      metrics.dealQuality === 'excellent' ? 'text-green-400' :
                      metrics.dealQuality === 'good' ? 'text-lime-400' :
                      metrics.dealQuality === 'neutral' ? 'text-orange-400' :
                      'text-red-400'
                    } />
                    {metrics.dealLabel}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                    confidenceColors[analysis.confidence] || confidenceColors.medium
                  }`}>
                    {confidenceLabels[analysis.confidence] || confidenceLabels.medium}
                  </span>
                </div>

                <div className="relative h-3 bg-white/5 rounded-full overflow-hidden mb-2">
                  <div
                    className={`absolute top-0 left-0 h-full rounded-full transition-all ${
                      metrics.dealQuality === 'excellent' ? 'bg-green-500' :
                      metrics.dealQuality === 'good' ? 'bg-lime-500' :
                      metrics.dealQuality === 'neutral' ? 'bg-orange-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(Math.max(metrics.marketDiscountPercent, 0), 100)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-white/40 mb-4">
                  <span>Prix élevé</span>
                  <span>Prix marché</span>
                  <span>Bonne affaire</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">Prix vs. Marché</span>
                  <span className={`font-semibold ${
                    metrics.marketDiscountPercent >= 10 ? 'text-green-400' :
                    metrics.marketDiscountPercent >= 0 ? 'text-orange-400' :
                    'text-red-400'
                  }`}>
                    {metrics.marketDiscountPercent >= 0 ? '−' : '+'}{Math.abs(metrics.marketDiscountPercent).toFixed(1)}%
                    {metrics.marketDiscountPercent >= 0 && ' sous le marché'}
                  </span>
                </div>
              </div>

              <div className="bg-[#0f0a0a] rounded-xl p-5 border border-white/5">
                <h3 className="text-white/50 text-xs uppercase tracking-wider mb-4">
                  Fourchette de prix marché
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingDown size={14} className="text-white/40" />
                      <span className="text-white/60 text-sm">Prix bas</span>
                    </div>
                    <span className="text-white font-medium">{formatPrice(analysis.lowPrice)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity size={14} className="text-[#C4A484]" />
                      <span className="text-white/60 text-sm">Prix moyen</span>
                    </div>
                    <span className="text-[#C4A484] font-semibold text-lg">
                      {formatPrice(analysis.averagePrice)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp size={14} className="text-white/40" />
                      <span className="text-white/60 text-sm">Prix haut</span>
                    </div>
                    <span className="text-white font-medium">{formatPrice(analysis.highPrice)}</span>
                  </div>
                </div>

                <div className="mt-4 relative h-2 bg-gradient-to-r from-red-500/20 via-yellow-500/20 to-green-500/20 rounded-full">
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-[#C4A484] border-2 border-[#1A1414] rounded-full"
                    style={{
                      left: `${Math.min(Math.max(((vehicle.purchasePrice - analysis.lowPrice) / (analysis.highPrice - analysis.lowPrice)) * 100, 0), 100)}%`,
                    }}
                    title="Votre prix d'achat"
                  />
                </div>
                <div className="flex items-center justify-between mt-2 text-xs text-white/40">
                  <span>{formatPrice(analysis.lowPrice)}</span>
                  <span className="text-[#C4A484]">Votre prix</span>
                  <span>{formatPrice(analysis.highPrice)}</span>
                </div>
              </div>

              <div className="bg-[#0f0a0a] rounded-xl p-5 border border-white/5">
                <h3 className="text-white/50 text-xs uppercase tracking-wider mb-4">
                  Marge brute estimée
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">Prix marché moyen</span>
                    <span className="text-white">{formatPrice(analysis.averagePrice)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">PRU (coût total)</span>
                    <span className="text-white">− {formatPrice(vehicle.costPrice || vehicle.purchasePrice)}</span>
                  </div>
                  <div className="border-t border-white/5 pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-white/80 font-medium">Marge estimée</span>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${
                          metrics.potentialMarginPercent >= 15 ? 'text-green-400' :
                          metrics.potentialMarginPercent >= 10 ? 'text-yellow-400' :
                          'text-red-400'
                        }`}>
                          {formatPrice(metrics.potentialMargin)}
                        </div>
                        <div className={`text-sm ${
                          metrics.potentialMarginPercent >= 15 ? 'text-green-400/70' :
                          metrics.potentialMarginPercent >= 10 ? 'text-yellow-400/70' :
                          'text-red-400/70'
                        }`}>
                          {metrics.potentialMarginPercent.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {metrics.potentialMarginPercent < 10 && (
                  <div className="mt-4 flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm text-red-400">
                    <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
                    <span>Marge insuffisante. Recommandé: renégocier ou passer.</span>
                  </div>
                )}
              </div>

              <div className="bg-[#0f0a0a] rounded-xl p-5 border border-white/5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white/50 text-xs uppercase tracking-wider">Score de liquidité</h3>
                  <span className="text-2xl font-bold text-[#C4A484]">
                    {analysis.liquidityScore}/10
                  </span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#C4A484] to-[#D4AF37] rounded-full transition-all"
                    style={{ width: `${(analysis.liquidityScore / 10) * 100}%` }}
                  />
                </div>
                <p className="mt-3 text-sm text-white/60">
                  {analysis.liquidityScore >= 7 ? 'Forte demande, vente rapide probable' :
                   analysis.liquidityScore >= 5 ? 'Demande moyenne, délai de vente standard' :
                   'Demande faible, peut nécessiter du temps'}
                </p>
              </div>

              {analysis.marketNotes && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 flex items-start gap-3">
                  <Info size={16} className="text-blue-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-400/90 leading-relaxed">
                    {analysis.marketNotes}
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                {onApplyPrice && (
                  <Button
                    onClick={() => {
                      onApplyPrice(Math.round(analysis.averagePrice))
                      onClose()
                    }}
                    className="flex-1 bg-[#C4A484] hover:bg-[#C4A484]/80 text-black font-semibold h-11"
                  >
                    <span className="flex items-center gap-2">
                      <CheckCircle2 size={16} />
                      Appliquer {formatPrice(analysis.averagePrice)}
                    </span>
                  </Button>
                )}
                <Button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  variant="outline"
                  className={`${onApplyPrice ? '' : 'w-full '}flex-1 border-white/10 text-white/60 hover:text-white hover:bg-white/5 h-11`}
                >
                  <span className="flex items-center gap-2">
                    <Target size={16} />
                    Ré-analyser
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
