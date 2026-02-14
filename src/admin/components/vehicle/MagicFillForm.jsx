import { useState } from 'react'
import { Sparkles, Upload, Link2, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { extractVehicleData, extractFromUrl, isAutoFillConfigured } from '../../../services/ai/autoFill'

export default function MagicFillForm({ onApply, onClose }) {
  const [mode, setMode] = useState('text') // 'text' | 'image' | 'url'
  const [inputText, setInputText] = useState('')
  const [inputUrl, setInputUrl] = useState('')
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  const [isLoading, setIsLoading] = useState(false)
  const [extractedData, setExtractedData] = useState(null)
  const [error, setError] = useState(null)

  const isConfigured = isAutoFillConfigured()

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Le fichier doit être une image (JPG, PNG, etc.)')
      return
    }

    setSelectedImage(file)
    setError(null)

    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target.result)
    }
    reader.readAsDataURL(file)
  }

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result.split(',')[1])
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const handleExtract = async () => {
    setError(null)
    setExtractedData(null)
    setIsLoading(true)

    try {
      let result

      if (mode === 'text') {
        if (!inputText.trim()) {
          setError('Veuillez saisir le texte de l\'annonce.')
          setIsLoading(false)
          return
        }
        result = await extractVehicleData(inputText, null)
      } else if (mode === 'image') {
        if (!selectedImage) {
          setError('Veuillez sélectionner une image.')
          setIsLoading(false)
          return
        }
        const base64 = await fileToBase64(selectedImage)
        result = await extractVehicleData(null, base64, selectedImage.type)
      } else if (mode === 'url') {
        if (!inputUrl.trim()) {
          setError('Veuillez saisir l\'URL de l\'annonce.')
          setIsLoading(false)
          return
        }
        result = await extractFromUrl(inputUrl)
      }

      if (result.error) {
        setError(result.error)
        setExtractedData(null)
      } else {
        setExtractedData(result)
      }
    } catch (err) {
      console.error('[Magic Fill] Error:', err)
      setError(`Erreur inattendue : ${err.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleApply = () => {
    if (!extractedData) return
    onApply(extractedData)
  }

  if (!isConfigured) {
    return (
      <div className="bg-[#1A1414] border border-white/10 rounded-lg p-6 text-center">
        <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-100 mb-2">Configuration manquante</h3>
        <p className="text-gray-400 mb-4">
          La clé API Gemini n'est pas configurée. Ajoutez VITE_GEMINI_API_KEY dans votre fichier .env pour activer le Remplissage Magique.
        </p>
        {onClose && (
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-gray-100 transition-colors"
          >
            Fermer
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="bg-[#1A1414] border border-white/10 rounded-lg overflow-hidden">
      <div className="bg-gradient-to-r from-[#C4A484]/20 to-[#C4A484]/10 border-b border-white/10 p-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#C4A484] to-[#8B7355] flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-100">Remplissage Magique</h2>
            <p className="text-gray-400 text-sm">Extrayez les données du véhicule automatiquement avec l'IA</p>
          </div>
        </div>
      </div>

      <div className="p-6 border-b border-white/10">
        <div className="flex gap-3">
          <button
            onClick={() => setMode('text')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-all ${
              mode === 'text'
                ? 'bg-[#C4A484] border-[#C4A484] text-white'
                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span className="font-medium">Texte</span>
          </button>
          <button
            onClick={() => setMode('image')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-all ${
              mode === 'image'
                ? 'bg-[#C4A484] border-[#C4A484] text-white'
                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
            }`}
          >
            <Upload className="w-5 h-5" />
            <span className="font-medium">Image</span>
          </button>
          <button
            onClick={() => setMode('url')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-all ${
              mode === 'url'
                ? 'bg-[#C4A484] border-[#C4A484] text-white'
                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
            }`}
          >
            <Link2 className="w-5 h-5" />
            <span className="font-medium">URL</span>
          </button>
        </div>
      </div>

      <div className="p-6">
        {mode === 'text' && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Collez le texte de l'annonce
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="BMW M3 Competition 2021&#10;510 ch - 35 000 km - Boîte auto 8 rapports&#10;Gris Brooklyn Métallisé - Cuir Merino Noir/Rouge&#10;Prix : 78 900 €&#10;1er main - Entretien BMW complet - Garantie 12 mois&#10;&#10;Équipements :&#10;• Sièges M Sport électriques&#10;• Pack carbone intérieur&#10;• Toit ouvrant panoramique&#10;• Harman Kardon&#10;..."
              rows={12}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C4A484] focus:border-transparent resize-none"
            />
            <p className="text-xs text-gray-500 mt-2">
              Copiez-collez le texte complet de l'annonce (Leboncoin, Mobile.de, AutoScout24, La Centrale, etc.)
            </p>
          </div>
        )}

        {mode === 'image' && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Uploadez une photo du document
            </label>
            <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-[#C4A484] transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                {imagePreview ? (
                  <div className="space-y-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-64 mx-auto rounded-lg border border-white/10"
                    />
                    <p className="text-sm text-gray-400">Cliquez pour changer d'image</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Upload className="w-12 h-12 text-gray-500 mx-auto" />
                    <div>
                      <p className="text-gray-300 font-medium">Cliquez pour uploader</p>
                      <p className="text-sm text-gray-500">Carte Grise, capture d'écran d'annonce, etc.</p>
                    </div>
                  </div>
                )}
              </label>
            </div>
          </div>
        )}

        {mode === 'url' && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Collez le lien de l'annonce
            </label>
            <input
              type="url"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="https://www.leboncoin.fr/voitures/..."
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C4A484] focus:border-transparent"
            />
            <div className="mt-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
              <p className="text-xs text-yellow-200">
                <strong>Note :</strong> L'extraction depuis URL peut échouer pour certains sites en raison des restrictions CORS.
                Si cela ne fonctionne pas, utilisez le mode "Texte" en copiant-collant le contenu de l'annonce.
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-200 font-medium">Erreur</p>
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          </div>
        )}

        <button
          onClick={handleExtract}
          disabled={isLoading}
          className="mt-6 w-full bg-gradient-to-r from-[#C4A484] to-[#8B7355] hover:from-[#D4B494] hover:to-[#9B8365] text-white font-bold py-4 px-6 rounded-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Analyse Gemini en cours...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Remplissage Magique</span>
            </>
          )}
        </button>
      </div>

      {extractedData && (
        <div className="p-6 border-t border-white/10 bg-white/5">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <h3 className="text-lg font-bold text-gray-100">Données extraites</h3>
          </div>

          <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-2">
            {Object.entries(extractedData)
              .filter(([_, value]) => value !== null && value !== undefined && value !== '')
              .map(([key, value]) => (
                <div key={key} className="bg-white/5 border border-white/10 rounded-lg p-3">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                    {formatFieldName(key)}
                  </p>
                  <p className="text-gray-100 font-medium">
                    {formatFieldValue(key, value)}
                  </p>
                </div>
              ))}
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleApply}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Appliquer au formulaire</span>
            </button>
            <button
              onClick={() => setExtractedData(null)}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-gray-100 font-medium transition-colors"
            >
              Réessayer
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function formatFieldName(key) {
  const labels = {
    brand: 'Marque',
    model: 'Modèle',
    trim: 'Finition',
    year: 'Année',
    mileage: 'Kilométrage',
    vin: 'VIN',
    registrationPlate: 'Immatriculation',
    firstRegistrationDate: '1ère immatriculation',
    fuelType: 'Carburant',
    transmission: 'Transmission',
    powerCh: 'Puissance (ch)',
    powerKw: 'Puissance (kW)',
    displacementCc: 'Cylindrée (cc)',
    cylinders: 'Cylindres',
    driveType: 'Transmission',
    gearsCount: 'Rapports',
    engineCode: 'Code moteur',
    co2Emissions: 'CO2 (g/km)',
    consumptionMixed: 'Conso mixte (L/100)',
    consumptionCity: 'Conso ville',
    consumptionHighway: 'Conso route',
    euroStandard: 'Norme Euro',
    critair: 'Crit\'Air',
    lengthMm: 'Longueur (mm)',
    widthMm: 'Largeur (mm)',
    heightMm: 'Hauteur (mm)',
    weightEmptyKg: 'Poids (kg)',
    trunkVolumeL: 'Coffre (L)',
    seats: 'Places',
    doors: 'Portes',
    payloadKg: 'Charge utile (kg)',
    color: 'Couleur',
    exteriorColorDetailed: 'Couleur détaillée',
    interiorColor: 'Couleur intérieur',
    interiorMaterial: 'Matière intérieur',
    countryOrigin: 'Pays d\'origine',
    isImport: 'Import',
    ownersCount: 'Propriétaires',
    lastServiceDate: 'Dernier entretien',
    warrantyMonths: 'Garantie (mois)',
    sellingPrice: 'Prix de vente',
    purchasePrice: 'Prix d\'achat',
    sourceUrl: 'URL source',
    sellerName: 'Vendeur',
    descriptionSummary: 'Résumé',
  }
  return labels[key] || key
}

function formatFieldValue(key, value) {
  if (typeof value === 'boolean') {
    return value ? 'Oui' : 'Non'
  }
  if (key === 'mileage') {
    return `${value.toLocaleString('fr-FR')} km`
  }
  if (key.includes('Price') || key.includes('Cost')) {
    return `${value.toLocaleString('fr-FR')} €`
  }
  return value.toString()
}
