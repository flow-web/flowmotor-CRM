import { useState, useCallback, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  X, ClipboardPaste, Sparkles, Image as ImageIcon, FileText,
  Trash2, Loader2, Check, AlertCircle, ChevronRight,
} from 'lucide-react'
import { useVehicles } from '../../context/VehiclesContext'
import { useUI } from '../../context/UIContext'
import { uploadImage, deleteImage } from '../../../lib/supabase/client'
import { analyzeVehicleText, isGeminiConfigured } from '../../../lib/gemini'
import { CAR_MAKES } from '../../utils/constants'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'

const FUEL_OPTIONS = ['Essence', 'Diesel', 'Hybride', 'Électrique', 'GPL']
const GEARBOX_OPTIONS = ['Automatique', 'Manuelle']

export default function SmartImportModal({ onClose }) {
  const navigate = useNavigate()
  const { createVehicle, addImages } = useVehicles()
  const { toast } = useUI()
  const pasteZoneRef = useRef(null)

  // IDs & state
  const [tempId] = useState(() => crypto.randomUUID())
  const [rawText, setRawText] = useState('')
  const [uploadedImages, setUploadedImages] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(null)
  const [step, setStep] = useState('paste') // paste | review | creating

  // Editable form fields (populated after AI analysis or manually)
  const [form, setForm] = useState({
    brand: '', model: '', trim: '', year: new Date().getFullYear(),
    price: '', mileage: '', fuel: '', gearbox: '', color: '',
    description: '', options: '',
  })

  // Focus paste zone on mount
  useEffect(() => {
    pasteZoneRef.current?.focus()
  }, [])

  // Close on Escape
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const updateForm = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  // === PASTE HANDLER ===
  const handlePaste = useCallback(async (e) => {
    const clipboardData = e.clipboardData
    if (!clipboardData) return

    // Check for images
    const files = [...clipboardData.files].filter(f => f.type.startsWith('image/'))
    if (files.length > 0) {
      e.preventDefault()
      setIsUploading(true)
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const index = uploadedImages.length + i
        try {
          const result = await uploadImage(file, tempId, index)
          if (result) {
            setUploadedImages(prev => [...prev, {
              id: crypto.randomUUID(),
              url: result.url,
              path: result.path,
              name: file.name || `image_${index + 1}`,
            }])
          }
        } catch (err) {
          console.error('Upload error:', err)
          toast.error(`Erreur upload image ${index + 1}`)
        }
      }
      setIsUploading(false)
      return
    }

    // Check for text
    const text = clipboardData.getData('text/plain')
    if (text && text.trim()) {
      e.preventDefault()
      setRawText(prev => prev ? prev + '\n\n' + text.trim() : text.trim())
    }
  }, [tempId, uploadedImages.length, toast])

  // === REMOVE IMAGE ===
  const handleRemoveImage = async (img) => {
    if (img.path) {
      await deleteImage(img.path)
    }
    setUploadedImages(prev => prev.filter(i => i.id !== img.id))
  }

  // === AI ANALYSIS ===
  const handleAnalyze = async () => {
    if (!rawText.trim()) return

    setIsAnalyzing(true)
    try {
      const result = await analyzeVehicleText(rawText)
      if (result) {
        setAnalysisResult(result)
        setForm({
          brand: result.brand || '',
          model: result.model || '',
          trim: result.trim || '',
          year: result.year || new Date().getFullYear(),
          price: result.price || '',
          mileage: result.mileage || '',
          fuel: result.fuel || '',
          gearbox: result.gearbox || '',
          color: result.color || '',
          description: result.description || '',
          options: Array.isArray(result.options) ? result.options.join(', ') : '',
        })
        setStep('review')
        toast.success('Analyse terminée !')
      } else {
        toast.error('Impossible d\'analyser le texte. Vérifiez la clé API Gemini.')
      }
    } catch (err) {
      console.error('Analysis error:', err)
      toast.error('Erreur lors de l\'analyse')
    } finally {
      setIsAnalyzing(false)
    }
  }

  // === CREATE VEHICLE ===
  const handleCreate = async () => {
    if (!form.brand || !form.model) {
      toast.error('La marque et le modèle sont obligatoires')
      return
    }

    setIsCreating(true)
    setStep('creating')

    try {
      const payload = {
        brand: form.brand,
        model: form.model,
        trim: form.trim,
        year: parseInt(form.year) || new Date().getFullYear(),
        mileage: parseInt(form.mileage) || 0,
        color: form.color,
        purchasePrice: parseFloat(form.price) || 0,
        sellingPrice: 0,
        notes: [form.description, form.options ? `Options: ${form.options}` : '']
          .filter(Boolean).join('\n'),
        fuel: form.fuel,
        gearbox: form.gearbox,
        status: 'SOURCING',
        images: [],
      }

      const newVehicle = await createVehicle(payload)

      // If images were uploaded to temp ID, re-upload to actual vehicle ID
      if (uploadedImages.length > 0) {
        await addImages(newVehicle.id, uploadedImages.map((img, idx) => ({
          ...img,
          isPrimary: idx === 0,
        })))
      }

      toast.success('Fiche véhicule créée avec succès !')
      onClose()
      navigate(`/admin/vehicle/${newVehicle.id}`)
    } catch (err) {
      console.error('Create error:', err)
      toast.error(`Erreur: ${err.message || 'Impossible de créer le véhicule'}`)
      setStep('review')
    } finally {
      setIsCreating(false)
    }
  }

  // === SKIP TO MANUAL FORM ===
  const handleSkipToForm = () => {
    setStep('review')
  }

  const hasContent = rawText.trim() || uploadedImages.length > 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative bg-[#1A1414] border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#1A1414] border-b border-white/10 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#C4A484]/20 rounded-lg">
              <Sparkles className="text-[#C4A484]" size={20} />
            </div>
            <div>
              <h2 className="text-white font-semibold text-lg">Import Magique</h2>
              <p className="text-white/40 text-sm">Collez texte et images depuis une annonce</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-white/40 hover:text-white transition-colors rounded-lg hover:bg-white/5">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* === STEP INDICATOR === */}
          <div className="flex items-center gap-2 text-xs">
            <span className={`px-3 py-1 rounded-full font-medium ${step === 'paste' ? 'bg-[#C4A484]/20 text-[#C4A484]' : 'bg-white/5 text-white/40'}`}>
              1. Coller
            </span>
            <ChevronRight size={14} className="text-white/20" />
            <span className={`px-3 py-1 rounded-full font-medium ${step === 'review' ? 'bg-[#C4A484]/20 text-[#C4A484]' : 'bg-white/5 text-white/40'}`}>
              2. Vérifier
            </span>
            <ChevronRight size={14} className="text-white/20" />
            <span className={`px-3 py-1 rounded-full font-medium ${step === 'creating' ? 'bg-[#C4A484]/20 text-[#C4A484]' : 'bg-white/5 text-white/40'}`}>
              3. Créer
            </span>
          </div>

          {/* === PASTE ZONE (always visible) === */}
          {step === 'paste' && (
            <>
              <div
                ref={pasteZoneRef}
                tabIndex={0}
                onPaste={handlePaste}
                className="relative border-2 border-dashed border-white/20 rounded-xl p-8 text-center cursor-text focus:border-[#C4A484]/50 focus:outline-none transition-colors min-h-[180px] flex flex-col items-center justify-center gap-3"
              >
                {isUploading && (
                  <div className="absolute inset-0 bg-[#1A1414]/80 rounded-xl flex items-center justify-center z-10">
                    <Loader2 className="animate-spin text-[#C4A484]" size={32} />
                  </div>
                )}

                <ClipboardPaste size={40} className="text-white/20" />
                <p className="text-white/60 text-sm">
                  Cliquez ici puis <span className="text-[#C4A484] font-medium">CTRL+V</span> pour coller
                </p>
                <p className="text-white/30 text-xs">
                  Accepte le texte d'une annonce ET les images copiées
                </p>
              </div>

              {/* Pasted text preview */}
              {rawText && (
                <div className="bg-[#0f0a0a] rounded-xl p-4 border border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <FileText size={14} className="text-[#C4A484]" />
                      <span className="text-white/60 text-xs font-medium">Texte capturé</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-white/30 text-xs">{rawText.length} caractères</span>
                      <button
                        onClick={() => setRawText('')}
                        className="p-1 text-white/30 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                  <pre className="text-white/50 text-xs whitespace-pre-wrap max-h-[120px] overflow-y-auto leading-relaxed">
                    {rawText.slice(0, 1000)}{rawText.length > 1000 ? '...' : ''}
                  </pre>
                </div>
              )}

              {/* Uploaded images preview */}
              {uploadedImages.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <ImageIcon size={14} className="text-[#C4A484]" />
                    <span className="text-white/60 text-xs font-medium">
                      {uploadedImages.length} image{uploadedImages.length > 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    {uploadedImages.map((img) => (
                      <div key={img.id} className="relative group rounded-lg overflow-hidden border border-white/10">
                        <img
                          src={img.url}
                          alt={img.name}
                          className="w-full h-24 object-cover"
                        />
                        <button
                          onClick={() => handleRemoveImage(img)}
                          className="absolute top-1 right-1 p-1 bg-black/60 rounded-md opacity-0 group-hover:opacity-100 transition-opacity text-white/70 hover:text-red-400"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-3">
                {rawText.trim() && (
                  <Button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || !isGeminiConfigured()}
                    className="flex-1 bg-[#C4A484] hover:bg-[#C4A484]/80 text-black font-semibold h-11"
                  >
                    {isAnalyzing ? (
                      <span className="flex items-center gap-2">
                        <Loader2 size={16} className="animate-spin" />
                        Analyse en cours...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Sparkles size={16} />
                        Analyser avec l'IA
                      </span>
                    )}
                  </Button>
                )}
                {hasContent && (
                  <Button
                    onClick={handleSkipToForm}
                    variant="outline"
                    className="border-white/10 text-white/60 hover:text-white hover:bg-white/5 h-11"
                  >
                    Remplir manuellement
                  </Button>
                )}
                {!isGeminiConfigured() && rawText.trim() && (
                  <div className="flex items-center gap-1.5 text-yellow-500/80 text-xs">
                    <AlertCircle size={12} />
                    <span>Clé Gemini non configurée</span>
                  </div>
                )}
              </div>
            </>
          )}

          {/* === REVIEW FORM === */}
          {step === 'review' && (
            <>
              {analysisResult && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 flex items-center gap-2 text-sm text-green-400">
                  <Check size={16} />
                  Données extraites par l'IA — vérifiez et corrigez si nécessaire
                </div>
              )}

              <div className="space-y-4">
                {/* Brand / Model / Trim */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-white/50 text-xs">Marque *</Label>
                    <Select value={form.brand} onValueChange={(v) => updateForm('brand', v)}>
                      <SelectTrigger className="bg-[#0f0a0a] border-white/10 text-white h-9">
                        <SelectValue placeholder="Marque" />
                      </SelectTrigger>
                      <SelectContent>
                        {CAR_MAKES.map((make) => (
                          <SelectItem key={make} value={make}>{make}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-white/50 text-xs">Modèle *</Label>
                    <Input
                      value={form.model}
                      onChange={(e) => updateForm('model', e.target.value)}
                      placeholder="Ex: M3"
                      className="bg-[#0f0a0a] border-white/10 text-white h-9"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-white/50 text-xs">Finition</Label>
                    <Input
                      value={form.trim}
                      onChange={(e) => updateForm('trim', e.target.value)}
                      placeholder="Ex: Competition"
                      className="bg-[#0f0a0a] border-white/10 text-white h-9"
                    />
                  </div>
                </div>

                {/* Year / Price / Mileage */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-white/50 text-xs">Année</Label>
                    <Input
                      type="number"
                      value={form.year}
                      onChange={(e) => updateForm('year', e.target.value)}
                      className="bg-[#0f0a0a] border-white/10 text-white h-9"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-white/50 text-xs">Prix (€)</Label>
                    <Input
                      type="number"
                      value={form.price}
                      onChange={(e) => updateForm('price', e.target.value)}
                      placeholder="45000"
                      className="bg-[#0f0a0a] border-white/10 text-white h-9"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-white/50 text-xs">Kilométrage</Label>
                    <Input
                      type="number"
                      value={form.mileage}
                      onChange={(e) => updateForm('mileage', e.target.value)}
                      placeholder="35000"
                      className="bg-[#0f0a0a] border-white/10 text-white h-9"
                    />
                  </div>
                </div>

                {/* Fuel / Gearbox / Color */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-white/50 text-xs">Carburant</Label>
                    <Select value={form.fuel} onValueChange={(v) => updateForm('fuel', v)}>
                      <SelectTrigger className="bg-[#0f0a0a] border-white/10 text-white h-9">
                        <SelectValue placeholder="—" />
                      </SelectTrigger>
                      <SelectContent>
                        {FUEL_OPTIONS.map((f) => (
                          <SelectItem key={f} value={f}>{f}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-white/50 text-xs">Boîte</Label>
                    <Select value={form.gearbox} onValueChange={(v) => updateForm('gearbox', v)}>
                      <SelectTrigger className="bg-[#0f0a0a] border-white/10 text-white h-9">
                        <SelectValue placeholder="—" />
                      </SelectTrigger>
                      <SelectContent>
                        {GEARBOX_OPTIONS.map((g) => (
                          <SelectItem key={g} value={g}>{g}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-white/50 text-xs">Couleur</Label>
                    <Input
                      value={form.color}
                      onChange={(e) => updateForm('color', e.target.value)}
                      placeholder="Gris Nardo"
                      className="bg-[#0f0a0a] border-white/10 text-white h-9"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <Label className="text-white/50 text-xs">Description</Label>
                  <textarea
                    value={form.description}
                    onChange={(e) => updateForm('description', e.target.value)}
                    placeholder="Résumé de l'annonce..."
                    className="w-full min-h-[60px] px-3 py-2 rounded-md bg-[#0f0a0a] border border-white/10 text-white text-sm placeholder:text-white/20 resize-none focus:outline-none focus:ring-1 focus:ring-[#C4A484]/50"
                  />
                </div>

                {/* Options */}
                <div className="space-y-1.5">
                  <Label className="text-white/50 text-xs">Options</Label>
                  <Input
                    value={form.options}
                    onChange={(e) => updateForm('options', e.target.value)}
                    placeholder="GPS, Cuir, Toit ouvrant..."
                    className="bg-[#0f0a0a] border-white/10 text-white h-9"
                  />
                </div>
              </div>

              {/* Images summary in review */}
              {uploadedImages.length > 0 && (
                <div className="flex items-center gap-2 bg-white/5 rounded-lg p-3">
                  <ImageIcon size={14} className="text-[#C4A484]" />
                  <span className="text-white/60 text-sm">
                    {uploadedImages.length} image{uploadedImages.length > 1 ? 's' : ''} prête{uploadedImages.length > 1 ? 's' : ''}
                  </span>
                  <div className="flex -space-x-2 ml-auto">
                    {uploadedImages.slice(0, 4).map((img) => (
                      <img
                        key={img.id}
                        src={img.url}
                        alt=""
                        className="w-8 h-8 rounded-md object-cover border-2 border-[#1A1414]"
                      />
                    ))}
                    {uploadedImages.length > 4 && (
                      <div className="w-8 h-8 rounded-md bg-white/10 border-2 border-[#1A1414] flex items-center justify-center text-white/40 text-xs">
                        +{uploadedImages.length - 4}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => setStep('paste')}
                  variant="outline"
                  className="border-white/10 text-white/60 hover:text-white hover:bg-white/5 h-11"
                >
                  Retour
                </Button>
                <Button
                  onClick={handleCreate}
                  disabled={isCreating || !form.brand || !form.model}
                  className="flex-1 bg-[#5C3A2E] hover:bg-[#5C3A2E]/80 text-white font-semibold h-11"
                >
                  <span className="flex items-center gap-2">
                    <Check size={16} />
                    Créer la fiche Sourcing
                  </span>
                </Button>
              </div>
            </>
          )}

          {/* === CREATING STATE === */}
          {step === 'creating' && (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <Loader2 size={40} className="animate-spin text-[#C4A484]" />
              <p className="text-white/60 text-sm">Création de la fiche en cours...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
