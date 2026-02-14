import { useState } from 'react'
import { Volume2, Camera, FileText, Upload, Loader2, AlertTriangle, CheckCircle2, Info } from 'lucide-react'
import { analyzeEngineSound, analyzeBodyCondition, translateServiceHistory, isInspectionConfigured } from '../../../services/ai/inspection'

export default function FlowInspector() {
  const [activeTab, setActiveTab] = useState('engine') // 'engine' | 'body' | 'service'

  const isConfigured = isInspectionConfigured()

  if (!isConfigured) {
    return (
      <div className="bg-[#1A1414] border border-white/10 rounded-lg p-8 text-center">
        <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-100 mb-2">Configuration manquante</h3>
        <p className="text-gray-400">
          La clé API Gemini n'est pas configurée. Ajoutez VITE_GEMINI_API_KEY dans votre fichier .env pour activer Flow Inspector.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-[#1A1414] border border-white/10 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-b border-white/10 p-6">
        <h2 className="text-2xl font-bold text-gray-100 mb-2">Flow Inspector AI</h2>
        <p className="text-gray-400">Inspection complète du véhicule par Intelligence Artificielle</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-white/10">
        <button
          onClick={() => setActiveTab('engine')}
          className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-colors ${
            activeTab === 'engine'
              ? 'bg-purple-500/20 text-purple-300 border-b-2 border-purple-500'
              : 'text-gray-400 hover:text-gray-300 hover:bg-white/5'
          }`}
        >
          <Volume2 className="w-5 h-5" />
          <span>Son Moteur</span>
        </button>
        <button
          onClick={() => setActiveTab('body')}
          className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-colors ${
            activeTab === 'body'
              ? 'bg-blue-500/20 text-blue-300 border-b-2 border-blue-500'
              : 'text-gray-400 hover:text-gray-300 hover:bg-white/5'
          }`}
        >
          <Camera className="w-5 h-5" />
          <span>État Carrosserie</span>
        </button>
        <button
          onClick={() => setActiveTab('service')}
          className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-colors ${
            activeTab === 'service'
              ? 'bg-green-500/20 text-green-300 border-b-2 border-green-500'
              : 'text-gray-400 hover:text-gray-300 hover:bg-white/5'
          }`}
        >
          <FileText className="w-5 h-5" />
          <span>Historique</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'engine' && <EngineSoundTab />}
        {activeTab === 'body' && <BodyConditionTab />}
        {activeTab === 'service' && <ServiceHistoryTab />}
      </div>
    </div>
  )
}

// ======================
// ENGINE SOUND TAB
// ======================

function EngineSoundTab() {
  const [audioFile, setAudioFile] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setAudioFile(file)
      setResult(null)
      setError(null)
    }
  }

  const handleAnalyze = async () => {
    if (!audioFile) return

    setIsAnalyzing(true)
    setError(null)

    try {
      const reader = new FileReader()
      reader.onload = async (e) => {
        const base64 = e.target.result.split(',')[1]
        const analysis = await analyzeEngineSound(base64, audioFile.type)

        if (analysis.error) {
          setError(analysis.error)
        } else {
          setResult(analysis)
        }
        setIsAnalyzing(false)
      }
      reader.readAsDataURL(audioFile)
    } catch (err) {
      setError(`Erreur: ${err.message}`)
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-purple-200">
          <p className="font-medium mb-1">Comment enregistrer ?</p>
          <p className="text-purple-300">Enregistrez le son du moteur au ralenti pendant 10-15 secondes avec votre smartphone. Placez-vous près du compartiment moteur capot ouvert.</p>
        </div>
      </div>

      {/* File Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Fichier audio (MP3, WAV, M4A...)
        </label>
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          className="block w-full text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-500/20 file:text-purple-300 hover:file:bg-purple-500/30 file:cursor-pointer"
        />
        {audioFile && (
          <p className="text-sm text-gray-400 mt-2">Fichier sélectionné: {audioFile.name}</p>
        )}
      </div>

      {/* Analyze Button */}
      <button
        onClick={handleAnalyze}
        disabled={!audioFile || isAnalyzing}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Analyse en cours...</span>
          </>
        ) : (
          <>
            <Volume2 className="w-5 h-5" />
            <span>Analyser le son moteur</span>
          </>
        )}
      </button>

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-red-200 text-sm">{error}</p>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-4 border-t border-white/10 pt-6">
          {/* Health Score */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">Note de santé</p>
                <p className="text-5xl font-bold text-gray-100">{result.healthScore}/10</p>
              </div>
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                result.healthScore >= 8 ? 'bg-green-500/20' :
                result.healthScore >= 5 ? 'bg-yellow-500/20' :
                'bg-red-500/20'
              }`}>
                {result.healthScore >= 8 ? (
                  <CheckCircle2 className="w-8 h-8 text-green-400" />
                ) : (
                  <AlertTriangle className={`w-8 h-8 ${
                    result.healthScore >= 5 ? 'text-yellow-400' : 'text-red-400'
                  }`} />
                )}
              </div>
            </div>
            <p className="text-gray-300">Type de moteur détecté: <strong>{result.engineType}</strong></p>
            <p className="text-xs text-gray-500 mt-2">Confiance: {result.confidence === 'high' ? 'Élevée' : result.confidence === 'medium' ? 'Moyenne' : 'Faible'}</p>
          </div>

          {/* Anomalies */}
          {result.anomalies.length > 0 ? (
            <div>
              <p className="text-sm font-medium text-gray-300 mb-3">Anomalies détectées ({result.anomalies.length}):</p>
              <div className="space-y-2">
                {result.anomalies.map((anomaly, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 p-4 rounded-lg ${
                      anomaly.severity === 'critical'
                        ? 'bg-red-500/10 border border-red-500/20'
                        : anomaly.severity === 'major'
                        ? 'bg-orange-500/10 border border-orange-500/20'
                        : 'bg-yellow-500/10 border border-yellow-500/20'
                    }`}
                  >
                    <AlertTriangle
                      className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        anomaly.severity === 'critical'
                          ? 'text-red-400'
                          : anomaly.severity === 'major'
                          ? 'text-orange-400'
                          : 'text-yellow-400'
                      }`}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-gray-100">{anomaly.name}</p>
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          anomaly.severity === 'critical'
                            ? 'bg-red-500/20 text-red-300'
                            : anomaly.severity === 'major'
                            ? 'bg-orange-500/20 text-orange-300'
                            : 'bg-yellow-500/20 text-yellow-300'
                        }`}>
                          {anomaly.severity === 'critical' ? 'Critique' : anomaly.severity === 'major' ? 'Majeur' : 'Mineur'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400">{anomaly.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <p className="text-green-200 font-medium">Aucune anomalie détectée. Moteur sain.</p>
            </div>
          )}

          {/* Maintenance Advice */}
          {result.maintenanceAdvice && (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <p className="text-sm text-blue-400 font-medium mb-2">Conseil d'entretien</p>
              <p className="text-blue-200">{result.maintenanceAdvice}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ======================
// BODY CONDITION TAB
// ======================

function BodyConditionTab() {
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setResult(null)
      setError(null)

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => setImagePreview(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const handleAnalyze = async () => {
    if (!imageFile) return

    setIsAnalyzing(true)
    setError(null)

    try {
      const reader = new FileReader()
      reader.onload = async (e) => {
        const base64 = e.target.result.split(',')[1]
        const analysis = await analyzeBodyCondition(base64, imageFile.type)

        if (analysis.error) {
          setError(analysis.error)
        } else {
          setResult(analysis)
        }
        setIsAnalyzing(false)
      }
      reader.readAsDataURL(imageFile)
    } catch (err) {
      setError(`Erreur: ${err.message}`)
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-200">
          <p className="font-medium mb-1">Meilleure pratique</p>
          <p className="text-blue-300">Prenez des photos en plein jour, à environ 3-4 mètres du véhicule, en capturant un panneau complet (portière, aile, etc.)</p>
        </div>
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Photo du véhicule
        </label>
        <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="body-image-upload"
          />
          <label htmlFor="body-image-upload" className="cursor-pointer">
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="max-h-64 mx-auto rounded-lg" />
            ) : (
              <div className="space-y-2">
                <Upload className="w-12 h-12 text-gray-500 mx-auto" />
                <p className="text-gray-300">Cliquez pour uploader une photo</p>
              </div>
            )}
          </label>
        </div>
      </div>

      {/* Analyze Button */}
      <button
        onClick={handleAnalyze}
        disabled={!imageFile || isAnalyzing}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Analyse en cours...</span>
          </>
        ) : (
          <>
            <Camera className="w-5 h-5" />
            <span>Analyser l'état carrosserie</span>
          </>
        )}
      </button>

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-red-200 text-sm">{error}</p>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-4 border-t border-white/10 pt-6">
          {/* Summary */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">État général</p>
                <p className="text-2xl font-bold text-gray-100 capitalize">{result.overallCondition}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Coût réparations estimé</p>
                <p className="text-2xl font-bold text-gray-100">{result.totalRepairCost.toLocaleString('fr-FR')} €</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">Confiance: {result.confidence === 'high' ? 'Élevée' : result.confidence === 'medium' ? 'Moyenne' : 'Faible'}</p>
          </div>

          {/* Defects */}
          {result.defects.length > 0 ? (
            <div>
              <p className="text-sm font-medium text-gray-300 mb-3">Défauts identifiés ({result.defects.length}):</p>
              <div className="space-y-2">
                {result.defects.map((defect, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg ${
                      defect.severity === 'critical'
                        ? 'bg-red-500/10 border border-red-500/20'
                        : defect.severity === 'major'
                        ? 'bg-orange-500/10 border border-orange-500/20'
                        : 'bg-yellow-500/10 border border-yellow-500/20'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-gray-100">{defect.name}</p>
                          <span className="text-xs text-gray-400">• {defect.location}</span>
                        </div>
                        <p className="text-sm text-gray-400 mb-2">{defect.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-100">{defect.estimatedCost} €</p>
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          defect.severity === 'critical'
                            ? 'bg-red-500/20 text-red-300'
                            : defect.severity === 'major'
                            ? 'bg-orange-500/20 text-orange-300'
                            : 'bg-yellow-500/20 text-yellow-300'
                        }`}>
                          {defect.severity === 'critical' ? 'Critique' : defect.severity === 'major' ? 'Majeur' : 'Mineur'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <p className="text-green-200 font-medium">Aucun défaut visible détecté. Carrosserie impeccable.</p>
            </div>
          )}

          {/* Advice */}
          {result.advice && (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <p className="text-sm text-blue-400 font-medium mb-2">Conseil</p>
              <p className="text-blue-200">{result.advice}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ======================
// SERVICE HISTORY TAB
// ======================

function ServiceHistoryTab() {
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setResult(null)
      setError(null)

      const reader = new FileReader()
      reader.onload = (e) => setImagePreview(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const handleAnalyze = async () => {
    if (!imageFile) return

    setIsAnalyzing(true)
    setError(null)

    try {
      const reader = new FileReader()
      reader.onload = async (e) => {
        const base64 = e.target.result.split(',')[1]
        const analysis = await translateServiceHistory(base64, imageFile.type)

        if (analysis.error) {
          setError(analysis.error)
        } else {
          setResult(analysis)
        }
        setIsAnalyzing(false)
      }
      reader.readAsDataURL(imageFile)
    } catch (err) {
      setError(`Erreur: ${err.message}`)
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-green-200">
          <p className="font-medium mb-1">Langues supportées</p>
          <p className="text-green-300">Allemand, Italien, Anglais, Japonais, Néerlandais, Espagnol → traduction automatique en français</p>
        </div>
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Photo du carnet d'entretien ou facture
        </label>
        <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-green-500 transition-colors">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="service-image-upload"
          />
          <label htmlFor="service-image-upload" className="cursor-pointer">
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="max-h-64 mx-auto rounded-lg" />
            ) : (
              <div className="space-y-2">
                <Upload className="w-12 h-12 text-gray-500 mx-auto" />
                <p className="text-gray-300">Cliquez pour uploader une photo</p>
              </div>
            )}
          </label>
        </div>
      </div>

      {/* Analyze Button */}
      <button
        onClick={handleAnalyze}
        disabled={!imageFile || isAnalyzing}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Traduction en cours...</span>
          </>
        ) : (
          <>
            <FileText className="w-5 h-5" />
            <span>Traduire et analyser</span>
          </>
        )}
      </button>

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-red-200 text-sm">{error}</p>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-4 border-t border-white/10 pt-6">
          {/* Language Detected */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-1">Langue détectée</p>
            <p className="text-xl font-bold text-gray-100">{result.detectedLanguage}</p>
            <p className="text-xs text-gray-500 mt-2">Confiance: {result.confidence === 'high' ? 'Élevée' : result.confidence === 'medium' ? 'Moyenne' : 'Faible'}</p>
          </div>

          {/* Translated Text */}
          {result.translatedText && (
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-2">Traduction française</p>
              <p className="text-gray-100 whitespace-pre-wrap">{result.translatedText}</p>
            </div>
          )}

          {/* Service Entries */}
          {result.entries.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-300 mb-3">Historique d'entretien ({result.entries.length}):</p>
              <div className="space-y-2">
                {result.entries.map((entry, idx) => (
                  <div key={idx} className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-gray-100">{entry.operation}</p>
                        <p className="text-sm text-gray-400">{entry.garage}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-300">{entry.date || 'Date inconnue'}</p>
                        <p className="text-xs text-gray-500">{entry.mileageKm ? `${entry.mileageKm.toLocaleString('fr-FR')} km` : ''}</p>
                      </div>
                    </div>
                    {entry.parts.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-white/10">
                        <p className="text-xs text-gray-400 mb-1">Pièces remplacées:</p>
                        <div className="flex flex-wrap gap-1">
                          {entry.parts.map((part, pidx) => (
                            <span key={pidx} className="text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded">
                              {part}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Missing Services */}
          {result.missingServices.length > 0 && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
              <p className="text-sm text-yellow-400 font-medium mb-3">Révisions potentiellement manquantes:</p>
              <div className="space-y-2">
                {result.missingServices.map((service, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-yellow-200 font-medium">{service.service}</p>
                      <p className="text-xs text-yellow-300">{service.status} (attendu à {service.expectedAtKm.toLocaleString('fr-FR')} km)</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
