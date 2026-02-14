/**
 * InspectionCockpit — "Flow Inspector"
 *
 * Mobile-first inspection cockpit with three core actions:
 *   1. Ecouter Moteur  (audio recording + waveform)
 *   2. Scanner Carrosserie (camera capture + zebra filter)
 *   3. Traduire Papiers (document photo + translation)
 *
 * Results stream into a live-feed timeline below the action cards.
 * A collapsible health-report summary sits at the bottom.
 *
 * All AI calls are mocked for now — the actual functions from
 * `src/lib/ai/inspection.js` will be wired in later.
 */

import { useState, useRef, useEffect, useCallback } from 'react'
import {
  ArrowLeft,
  Mic,
  MicOff,
  Camera,
  FileText,
  Loader2,
  ChevronDown,
  ChevronUp,
  Copy,
  Save,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  SlidersHorizontal,
  X,
  Eye,
} from 'lucide-react'
import AudioWaveform from './AudioWaveform'

/* ─────────────────────────────────────────────
   MOCK AI FUNCTIONS
   Replace with real imports from lib/ai/inspection.js
   ───────────────────────────────────────────── */

const wait = (ms) => new Promise((r) => setTimeout(r, ms))

async function mockAnalyzeAudio() {
  await wait(2800)
  return {
    healthScore: 7.2,
    findings: [
      { severity: 'warning', message: 'Leger bruit metallique a froid — surveiller chaine de distribution' },
      { severity: 'success', message: 'Ralenti stable, pas de rates d\'allumage detectes' },
      { severity: 'info', message: 'Regime moteur mesure : ~780 tr/min au ralenti' },
    ],
  }
}

async function mockAnalyzeBody(/* file */) {
  await wait(3200)
  return {
    healthScore: 8.5,
    findings: [
      { severity: 'success', message: 'Carrosserie — aucun defaut majeur detecte' },
      { severity: 'warning', message: 'Micro-rayure detectee sur aile avant droite (< 5 cm)' },
      { severity: 'info', message: 'Epaisseur peinture homogene — pas de signe de reprise' },
    ],
  }
}

async function mockTranslateDocs(/* file */) {
  await wait(2500)
  return {
    detectedLanguage: 'DE',
    healthScore: null,
    findings: [
      { severity: 'success', message: 'Document traduit — Carte grise allemande (Fahrzeugbrief)' },
      { severity: 'warning', message: 'Revision des 100 000 km manquante dans le carnet d\'entretien' },
      { severity: 'info', message: 'Dernier controle technique : 14/03/2024 — valide' },
    ],
    translatedData: {
      'Marque': 'Porsche',
      'Modele': '911 Carrera S (997)',
      'Premiere immatriculation': '12/06/2008',
      'Puissance': '261 kW (355 ch)',
      'Cylindree': '3 824 cm3',
      'Couleur': 'Noir (Basaltschwarz)',
    },
  }
}

/* ─────────────────────────────────────────────
   SEVERITY HELPERS
   ───────────────────────────────────────────── */

const SEVERITY = {
  success: {
    icon: CheckCircle,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    dot: 'bg-emerald-400',
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    dot: 'bg-amber-400',
  },
  error: {
    icon: XCircle,
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    dot: 'bg-red-400',
  },
  info: {
    icon: Info,
    color: 'text-sky-400',
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/20',
    dot: 'bg-sky-400',
  },
}

function scoreColor(score) {
  if (score == null) return { ring: 'border-white/20', text: 'text-white/40', label: '--' }
  if (score >= 7.5) return { ring: 'border-emerald-400', text: 'text-emerald-400', label: 'Bon' }
  if (score >= 5) return { ring: 'border-amber-400', text: 'text-amber-400', label: 'Moyen' }
  return { ring: 'border-red-400', text: 'text-red-400', label: 'Critique' }
}

/* ─────────────────────────────────────────────
   HEALTH SCORE CIRCLE
   ───────────────────────────────────────────── */

function HealthBadge({ score, size = 'default' }) {
  const s = scoreColor(score)
  const dim = size === 'large' ? 'w-20 h-20' : 'w-12 h-12'
  const textSize = size === 'large' ? 'text-2xl' : 'text-base'

  return (
    <div
      className={`${dim} rounded-full border-2 ${s.ring} flex items-center justify-center flex-shrink-0 transition-all duration-500`}
    >
      <span className={`${textSize} font-bold font-mono tabular-nums ${s.text}`}>
        {score != null ? score.toFixed(1) : '--'}
      </span>
    </div>
  )
}

/* ─────────────────────────────────────────────
   FINDING ENTRY (live feed row)
   ───────────────────────────────────────────── */

function FindingEntry({ finding, index }) {
  const sev = SEVERITY[finding.severity] || SEVERITY.info
  const Icon = sev.icon

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 rounded-xl ${sev.bg} border ${sev.border} transition-all duration-300`}
      style={{ animation: `fadeSlideUp 0.35s ease-out ${index * 0.08}s both` }}
    >
      <div className="mt-0.5 flex-shrink-0">
        <Icon size={16} className={sev.color} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-[#F4E8D8]/90 leading-relaxed">{finding.message}</p>
        <p className="text-[10px] text-white/30 mt-1 font-mono tabular-nums">{finding.timestamp}</p>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   ACTION CARD WRAPPER
   ───────────────────────────────────────────── */

function ActionCard({ icon: Icon, label, sublabel, active, recording, analyzing, onClick, disabled, children }) {
  const isActive = active || recording || analyzing

  return (
    <div
      className={`
        relative rounded-2xl border p-5 transition-all duration-300
        ${recording
          ? 'bg-red-500/[0.06] border-red-500/30 shadow-[0_0_24px_rgba(239,68,68,0.1)]'
          : isActive
            ? 'bg-[#C4A484]/[0.06] border-[#C4A484]/30 shadow-[0_0_24px_rgba(196,164,132,0.08)]'
            : 'bg-white/[0.03] border-white/[0.07] hover:border-[#C4A484]/20 hover:bg-white/[0.05]'
        }
        ${recording ? 'animate-pulse' : ''}
      `}
    >
      {/* Header row */}
      <button
        onClick={onClick}
        disabled={disabled}
        className="w-full flex items-center gap-4 min-h-[56px] text-left focus:outline-none focus:ring-2 focus:ring-[#C4A484]/40 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label={label}
      >
        <div
          className={`
            w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300
            ${recording
              ? 'bg-red-500/20 text-red-400'
              : isActive
                ? 'bg-[#C4A484]/15 text-[#C4A484]'
                : 'bg-white/[0.06] text-white/50'
            }
          `}
        >
          {analyzing ? (
            <Loader2 size={24} className="animate-spin text-[#C4A484]" />
          ) : (
            <Icon size={24} />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#F4E8D8] tracking-wide">{label}</p>
          <p className="text-xs text-white/35 mt-0.5">{sublabel}</p>
        </div>
        {recording && (
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
        )}
      </button>

      {/* Expandable content area */}
      {children && (
        <div className="mt-4 pt-4 border-t border-white/[0.06]">
          {children}
        </div>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────
   TRANSLATED DATA TABLE
   ───────────────────────────────────────────── */

function TranslatedTable({ data, language }) {
  if (!data || Object.keys(data).length === 0) return null

  return (
    <div className="mt-3 space-y-2">
      {language && (
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#C4A484]/70">Langue detectee</span>
          <span className="px-2 py-0.5 rounded-md bg-[#C4A484]/10 border border-[#C4A484]/20 text-xs font-mono font-bold text-[#C4A484]">
            {language}
          </span>
        </div>
      )}
      <div className="rounded-xl border border-white/[0.06] overflow-hidden">
        {Object.entries(data).map(([key, value], i) => (
          <div
            key={key}
            className={`flex items-center justify-between px-4 py-2.5 text-sm ${
              i % 2 === 0 ? 'bg-white/[0.02]' : 'bg-transparent'
            }`}
          >
            <span className="text-white/40 text-xs">{key}</span>
            <span className="text-[#F4E8D8] font-medium text-xs text-right">{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   IMAGE PREVIEW WITH ZEBRA FILTER
   ───────────────────────────────────────────── */

function ImagePreview({ src, zebraMode, onToggleZebra, onClear }) {
  if (!src) return null

  return (
    <div className="relative rounded-xl overflow-hidden border border-white/[0.06]">
      <img
        src={src}
        alt="Apercu inspection"
        className="w-full h-48 object-cover transition-all duration-300"
        style={{
          filter: zebraMode ? 'contrast(3) saturate(0)' : 'none',
        }}
      />
      <div className="absolute top-2 right-2 flex gap-1.5">
        <button
          onClick={onToggleZebra}
          className={`
            p-2 rounded-lg backdrop-blur-sm transition-all duration-200
            ${zebraMode
              ? 'bg-[#C4A484]/30 border border-[#C4A484]/40 text-[#C4A484]'
              : 'bg-black/50 border border-white/10 text-white/60 hover:text-white'
            }
          `}
          title="Filtre Zebra (haut contraste)"
          aria-label="Activer le filtre Zebra"
        >
          <SlidersHorizontal size={14} />
        </button>
        <button
          onClick={onClear}
          className="p-2 rounded-lg bg-black/50 border border-white/10 text-white/60 hover:text-white backdrop-blur-sm transition-all duration-200"
          title="Supprimer l'image"
          aria-label="Supprimer l'image"
        >
          <X size={14} />
        </button>
      </div>
      {zebraMode && (
        <div className="absolute bottom-2 left-2">
          <span className="px-2 py-1 rounded-md bg-black/60 border border-[#C4A484]/30 text-[10px] font-bold uppercase tracking-wider text-[#C4A484]">
            Zebra
          </span>
        </div>
      )}
    </div>
  )
}

/* ═════════════════════════════════════════════
   MAIN COMPONENT — InspectionCockpit
   ═════════════════════════════════════════════ */

export default function InspectionCockpit({ vehicle, onSaveReport, onBack }) {
  /* ── State ── */
  const [activeMode, setActiveMode] = useState(null)       // null | 'audio' | 'body' | 'docs'
  const [isRecording, setIsRecording] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [findings, setFindings] = useState([])
  const [healthScore, setHealthScore] = useState(null)
  const [reportExpanded, setReportExpanded] = useState(false)
  const [copied, setCopied] = useState(false)

  // Body scanner
  const [bodyPreview, setBodyPreview] = useState(null)
  const [zebraMode, setZebraMode] = useState(false)
  const bodyInputRef = useRef(null)

  // Docs translator
  const [docPreview, setDocPreview] = useState(null)
  const [translatedData, setTranslatedData] = useState(null)
  const [detectedLanguage, setDetectedLanguage] = useState(null)
  const docInputRef = useRef(null)

  // Live feed scroll
  const feedEndRef = useRef(null)

  // Auto-scroll feed
  useEffect(() => {
    if (feedEndRef.current) {
      feedEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [findings])

  /* ── Helpers ── */
  const now = () => new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })

  const addFindings = useCallback((items, type) => {
    const timestamped = items.map((f, i) => ({
      id: `${Date.now()}-${type}-${i}`,
      type,
      ...f,
      timestamp: now(),
    }))
    setFindings((prev) => [...prev, ...timestamped])
  }, [])

  const computeOverallScore = useCallback((newScore) => {
    setHealthScore((prev) => {
      if (prev == null) return newScore
      if (newScore == null) return prev
      // Average of all scores gathered so far
      return Math.round(((prev + newScore) / 2) * 10) / 10
    })
  }, [])

  /* ── Audio Action ── */
  const handleAudioToggle = async () => {
    if (isAnalyzing) return

    if (isRecording) {
      // Stop recording -> analyze
      setIsRecording(false)
      setIsAnalyzing(true)
      setActiveMode('audio')
      try {
        const result = await mockAnalyzeAudio()
        addFindings(result.findings, 'audio')
        computeOverallScore(result.healthScore)
      } catch {
        addFindings([{ severity: 'error', message: 'Erreur lors de l\'analyse audio' }], 'audio')
      } finally {
        setIsAnalyzing(false)
        setActiveMode(null)
      }
    } else {
      // Start recording
      setIsRecording(true)
      setActiveMode('audio')
    }
  }

  /* ── Body Scanner Action ── */
  const handleBodyCapture = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const url = URL.createObjectURL(file)
    setBodyPreview(url)
    setZebraMode(false)
    analyzeBody(file)
  }

  const analyzeBody = async (/* file */) => {
    setIsAnalyzing(true)
    setActiveMode('body')
    try {
      const result = await mockAnalyzeBody()
      addFindings(result.findings, 'body')
      computeOverallScore(result.healthScore)
    } catch {
      addFindings([{ severity: 'error', message: 'Erreur lors de l\'analyse carrosserie' }], 'body')
    } finally {
      setIsAnalyzing(false)
      setActiveMode(null)
    }
  }

  const clearBodyPreview = () => {
    if (bodyPreview) URL.revokeObjectURL(bodyPreview)
    setBodyPreview(null)
    setZebraMode(false)
    if (bodyInputRef.current) bodyInputRef.current.value = ''
  }

  /* ── Document Translator Action ── */
  const handleDocCapture = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file)
      setDocPreview(url)
    }
    translateDoc(file)
  }

  const translateDoc = async (/* file */) => {
    setIsAnalyzing(true)
    setActiveMode('docs')
    setTranslatedData(null)
    setDetectedLanguage(null)
    try {
      const result = await mockTranslateDocs()
      addFindings(result.findings, 'docs')
      computeOverallScore(result.healthScore)
      if (result.translatedData) setTranslatedData(result.translatedData)
      if (result.detectedLanguage) setDetectedLanguage(result.detectedLanguage)
    } catch {
      addFindings([{ severity: 'error', message: 'Erreur lors de la traduction du document' }], 'docs')
    } finally {
      setIsAnalyzing(false)
      setActiveMode(null)
    }
  }

  /* ── Report Actions ── */
  const handleSaveReport = () => {
    const report = {
      vehicleId: vehicle?.id,
      healthScore,
      findings,
      translatedData,
      detectedLanguage,
      createdAt: new Date().toISOString(),
    }
    onSaveReport?.(report)
  }

  const handleCopyReport = async () => {
    const lines = findings.map((f) => {
      const prefix = f.severity === 'success' ? '[OK]' : f.severity === 'warning' ? '[ATTENTION]' : f.severity === 'error' ? '[CRITIQUE]' : '[INFO]'
      return `${prefix} ${f.message}`
    })
    const summary = [
      `--- Flow Inspector : Rapport ---`,
      `Vehicule : ${vehicle?.brand || ''} ${vehicle?.model || ''} ${vehicle?.year || ''}`.trim(),
      `Score global : ${healthScore != null ? healthScore + '/10' : 'N/A'}`,
      ``,
      ...lines,
    ].join('\n')

    try {
      await navigator.clipboard.writeText(summary)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* clipboard not available */ }
  }

  /* ── Vehicle label ── */
  const vehicleLabel = vehicle
    ? `${vehicle.brand || ''} ${vehicle.model || ''}${vehicle.trim ? ` ${vehicle.trim}` : ''}`.trim()
    : 'Vehicule'
  const vehicleYear = vehicle?.year ? ` — ${vehicle.year}` : ''

  const hasFindings = findings.length > 0

  /* ─── RENDER ─── */
  return (
    <div className="min-h-screen bg-[#1A0F0F]">
      {/* Page-scoped keyframes */}
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* ── HEADER ── */}
        <header className="flex items-center gap-4" style={{ animation: 'fadeSlideUp 0.4s ease-out' }}>
          {onBack && (
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-white/50 hover:text-[#C4A484] hover:border-[#C4A484]/30 transition-all duration-200 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-[#C4A484]/40"
              aria-label="Retour"
            >
              <ArrowLeft size={18} />
            </button>
          )}
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-display font-semibold text-[#F4E8D8] tracking-wide truncate">
              Flow Inspector
            </h1>
            <p className="text-xs text-white/40 mt-0.5 truncate">
              {vehicleLabel}<span className="text-[#C4A484]/60">{vehicleYear}</span>
            </p>
          </div>
          <HealthBadge score={healthScore} />
        </header>

        {/* ── 3 ACTION CARDS ── */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
          style={{ animation: 'fadeSlideUp 0.4s ease-out 0.1s both' }}
        >
          {/* 1. Ecouter Moteur */}
          <ActionCard
            icon={isRecording ? MicOff : Mic}
            label={isRecording ? 'Arreter l\'ecoute' : 'Ecouter Moteur'}
            sublabel={isRecording ? 'Enregistrement en cours...' : 'Analyse sonore du moteur'}
            active={activeMode === 'audio'}
            recording={isRecording}
            analyzing={isAnalyzing && activeMode === 'audio'}
            onClick={handleAudioToggle}
            disabled={isAnalyzing && activeMode !== 'audio'}
          >
            <AudioWaveform active={isRecording} />
          </ActionCard>

          {/* 2. Scanner Carrosserie */}
          <ActionCard
            icon={Camera}
            label="Scanner Carrosserie"
            sublabel="Photo + detection defauts"
            active={activeMode === 'body'}
            analyzing={isAnalyzing && activeMode === 'body'}
            onClick={() => bodyInputRef.current?.click()}
            disabled={isAnalyzing}
          >
            <input
              ref={bodyInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleBodyCapture}
            />
            {bodyPreview && (
              <ImagePreview
                src={bodyPreview}
                zebraMode={zebraMode}
                onToggleZebra={() => setZebraMode((z) => !z)}
                onClear={clearBodyPreview}
              />
            )}
          </ActionCard>

          {/* 3. Traduire Papiers */}
          <ActionCard
            icon={FileText}
            label="Traduire Papiers"
            sublabel="Traduction + extraction donnees"
            active={activeMode === 'docs'}
            analyzing={isAnalyzing && activeMode === 'docs'}
            onClick={() => docInputRef.current?.click()}
            disabled={isAnalyzing}
          >
            <input
              ref={docInputRef}
              type="file"
              accept="image/*,application/pdf"
              capture="environment"
              className="hidden"
              onChange={handleDocCapture}
            />
            {docPreview && (
              <div className="rounded-xl overflow-hidden border border-white/[0.06]">
                <img
                  src={docPreview}
                  alt="Document uploade"
                  className="w-full h-36 object-cover"
                />
              </div>
            )}
            <TranslatedTable data={translatedData} language={detectedLanguage} />
          </ActionCard>
        </div>

        {/* ── LIVE FEED ── */}
        <section style={{ animation: 'fadeSlideUp 0.4s ease-out 0.2s both' }}>
          <div className="flex items-center gap-2 mb-3">
            <Eye size={14} className="text-[#C4A484]/60" />
            <h2 className="text-xs font-semibold uppercase tracking-widest text-[#C4A484]/60">
              Resultats d'inspection
            </h2>
            {hasFindings && (
              <span className="ml-auto text-[10px] font-mono tabular-nums text-white/25">
                {findings.length} element{findings.length > 1 ? 's' : ''}
              </span>
            )}
          </div>

          <div
            className="
              rounded-2xl border border-white/[0.07] bg-white/[0.02]
              max-h-[400px] overflow-y-auto
              scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent
            "
          >
            {hasFindings ? (
              <div className="p-4 space-y-2.5">
                {findings.map((f, i) => (
                  <FindingEntry key={f.id} finding={f} index={i} />
                ))}
                <div ref={feedEndRef} />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-14 px-4">
                <div className="w-12 h-12 rounded-xl bg-white/[0.04] flex items-center justify-center mb-3">
                  <Eye size={20} className="text-white/15" />
                </div>
                <p className="text-sm text-white/30 text-center">
                  Lancez une inspection pour voir les resultats ici
                </p>
              </div>
            )}
          </div>
        </section>

        {/* ── HEALTH REPORT SUMMARY ── */}
        {hasFindings && (
          <section style={{ animation: 'fadeSlideUp 0.4s ease-out 0.3s both' }}>
            <div
              className="rounded-2xl border border-white/[0.07] bg-white/[0.03] overflow-hidden transition-all duration-300"
            >
              {/* Collapsible header */}
              <button
                onClick={() => setReportExpanded((e) => !e)}
                className="w-full flex items-center justify-between p-5 text-left focus:outline-none focus:ring-2 focus:ring-[#C4A484]/30 rounded-t-2xl"
                aria-expanded={reportExpanded}
              >
                <div className="flex items-center gap-4">
                  <HealthBadge score={healthScore} size="large" />
                  <div>
                    <p className="text-sm font-semibold text-[#F4E8D8]">Rapport de sante</p>
                    <p className="text-xs text-white/35 mt-0.5">
                      {scoreColor(healthScore).label}
                      {' — '}
                      {findings.length} point{findings.length > 1 ? 's' : ''} releve{findings.length > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="text-white/30">
                  {reportExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </button>

              {/* Expanded details */}
              <div
                className="transition-all duration-300 overflow-hidden"
                style={{
                  maxHeight: reportExpanded ? '600px' : '0px',
                  opacity: reportExpanded ? 1 : 0,
                }}
              >
                <div className="px-5 pb-5 space-y-4">
                  {/* Score breakdown by type */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { type: 'audio', label: 'Moteur', icon: Mic },
                      { type: 'body', label: 'Carrosserie', icon: Camera },
                      { type: 'docs', label: 'Documents', icon: FileText },
                    ].map(({ type, label, icon: TypeIcon }) => {
                      const typeFindings = findings.filter((f) => f.type === type)
                      const warnings = typeFindings.filter((f) => f.severity === 'warning' || f.severity === 'error').length
                      return (
                        <div
                          key={type}
                          className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3 text-center"
                        >
                          <TypeIcon size={16} className="text-[#C4A484]/50 mx-auto mb-1.5" />
                          <p className="text-[11px] font-medium text-white/50">{label}</p>
                          {typeFindings.length > 0 ? (
                            <p className="text-xs mt-1">
                              <span className={warnings > 0 ? 'text-amber-400' : 'text-emerald-400'}>
                                {warnings > 0 ? `${warnings} alerte${warnings > 1 ? 's' : ''}` : 'OK'}
                              </span>
                            </p>
                          ) : (
                            <p className="text-[10px] text-white/20 mt-1">Non teste</p>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {/* Separator */}
                  <div className="h-px bg-gradient-to-r from-[#C4A484]/20 via-[#C4A484]/10 to-transparent" />

                  {/* Action buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleSaveReport}
                      className="
                        flex-1 flex items-center justify-center gap-2
                        bg-gradient-to-r from-[#C4A484]/20 to-[#C4A484]/10
                        border border-[#C4A484]/25
                        rounded-xl py-3 px-4
                        text-sm font-medium text-[#C4A484]
                        hover:from-[#C4A484]/30 hover:to-[#C4A484]/15 hover:border-[#C4A484]/40
                        transition-all duration-200
                        focus:outline-none focus:ring-2 focus:ring-[#C4A484]/40
                      "
                    >
                      <Save size={16} />
                      Sauvegarder le rapport
                    </button>
                    <button
                      onClick={handleCopyReport}
                      className="
                        flex-1 flex items-center justify-center gap-2
                        bg-white/[0.04] border border-white/[0.08]
                        rounded-xl py-3 px-4
                        text-sm font-medium text-white/60
                        hover:bg-white/[0.08] hover:text-white/80 hover:border-white/15
                        transition-all duration-200
                        focus:outline-none focus:ring-2 focus:ring-[#C4A484]/40
                      "
                    >
                      {copied ? <CheckCircle size={16} className="text-emerald-400" /> : <Copy size={16} />}
                      {copied ? 'Copie !' : 'Partager'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

      </div>
    </div>
  )
}
