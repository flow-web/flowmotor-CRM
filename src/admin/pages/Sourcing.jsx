import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calculator, Plus, ExternalLink, PanelRightOpen } from 'lucide-react'
import TopHeader from '../components/layout/TopHeader'
import AdminCard from '../components/shared/AdminCard'
import SourcingSheet from '@/components/admin/SourcingSheet'
import { useVehicles } from '../context/VehiclesContext'
import { useUI } from '../context/UIContext'
import { formatPrice } from '../utils/formatters'
import { calculateRecommendedPrice, calculateCO2Malus, calculateImportFees } from '../utils/calculations'
import { CURRENCIES, ORIGIN_COUNTRIES, CAR_MAKES, DEFAULT_SETTINGS } from '../utils/constants'
import { Button } from '@/components/ui/button'

function Sourcing() {
  const navigate = useNavigate()
  const { createVehicle } = useVehicles()
  const { toast } = useUI()

  // SourcingSheet state
  const [sheetOpen, setSheetOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSheetSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      const newVehicle = await createVehicle({
        ...data,
        exchangeRate: data.currency === 'EUR' ? 1 : data.exchangeRate
      })
      toast.success('Véhicule créé avec succès')
      navigate(`/admin/vehicle/${newVehicle.id}`)
    } catch (err) {
      toast.error('Erreur lors de la création')
      throw err
    } finally {
      setIsSubmitting(false)
    }
  }

  // Calculator state
  const [calc, setCalc] = useState({
    purchasePrice: '',
    currency: 'EUR',
    exchangeRate: 1,
    originCountry: 'DE',
    transportCost: 800,
    co2: '',
    year: new Date().getFullYear(),
    targetMargin: DEFAULT_SETTINGS.defaultMargin
  })

  // New vehicle form
  const [form, setForm] = useState({
    make: '',
    model: '',
    trim: '',
    year: new Date().getFullYear(),
    mileage: '',
    color: '',
    vin: '',
    sourceUrl: '',
    sellerName: '',
    sellerPhone: '',
    sellerEmail: '',
    purchasePrice: '',
    currency: 'EUR',
    originCountry: 'DE',
    marketPrice: '',
    notes: ''
  })

  // Calculator results
  const purchaseEUR = calc.purchasePrice ? (parseFloat(calc.purchasePrice) * calc.exchangeRate) : 0
  const co2Malus = calculateCO2Malus(parseInt(calc.co2) || 0, calc.year)
  const importFees = calculateImportFees(purchaseEUR, calc.originCountry)
  const totalCost = purchaseEUR + parseFloat(calc.transportCost || 0) + co2Malus
  const recommendedPrice = calculateRecommendedPrice(totalCost, calc.targetMargin)

  const handleCalcChange = (e) => {
    const { name, value } = e.target
    setCalc(prev => {
      const newCalc = { ...prev, [name]: value }

      // Update exchange rate when currency changes
      if (name === 'currency') {
        newCalc.exchangeRate = value === 'EUR' ? 1 : (DEFAULT_SETTINGS.exchangeRates[value] || 1)
      }

      return newCalc
    })
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleCreateVehicle = (e) => {
    e.preventDefault()

    if (!form.make || !form.model || !form.year) {
      toast.error('Veuillez remplir les champs obligatoires')
      return
    }

    const newVehicle = createVehicle({
      make: form.make,
      model: form.model,
      trim: form.trim,
      year: parseInt(form.year),
      mileage: parseInt(form.mileage) || 0,
      color: form.color,
      vin: form.vin,
      registration: '',
      sourceUrl: form.sourceUrl,
      seller: {
        name: form.sellerName,
        phone: form.sellerPhone,
        email: form.sellerEmail,
        type: 'professional'
      },
      purchasePrice: parseFloat(form.purchasePrice) || 0,
      currency: form.currency,
      exchangeRate: form.currency === 'EUR' ? 1 : (DEFAULT_SETTINGS.exchangeRates[form.currency] || 1),
      originCountry: form.originCountry,
      marketPrice: parseFloat(form.marketPrice) || 0,
      targetMargin: DEFAULT_SETTINGS.defaultMargin,
      sellingPrice: parseFloat(form.marketPrice) || 0,
      notes: form.notes
    })

    toast.success('Véhicule créé avec succès')
    navigate(`/admin/vehicle/${newVehicle.id}`)
  }

  return (
    <div className="min-h-screen">
      <TopHeader
        title="Sourcing"
        subtitle="Calculateur et création de véhicule"
      />

      {/* SourcingSheet avec calcul de marge en temps réel */}
      <SourcingSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onSubmit={handleSheetSubmit}
        isLoading={isSubmitting}
      />

      <div className="p-6">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Quick Calculator */}
          <AdminCard>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-accent/20 rounded-lg">
                <Calculator className="text-accent" size={20} />
              </div>
              <div>
                <h2 className="font-medium text-white">Calculateur rapide</h2>
                <p className="text-xs text-white/40">Estimez votre marge avant achat</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-white/40 uppercase tracking-wider block mb-2">
                    Prix d'achat
                  </label>
                  <input
                    type="number"
                    name="purchasePrice"
                    value={calc.purchasePrice}
                    onChange={handleCalcChange}
                    placeholder="0"
                    className="input-admin w-full"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/40 uppercase tracking-wider block mb-2">
                    Devise
                  </label>
                  <select
                    name="currency"
                    value={calc.currency}
                    onChange={handleCalcChange}
                    className="select-admin w-full"
                  >
                    {Object.entries(CURRENCIES).map(([code, { name }]) => (
                      <option key={code} value={code}>{code} - {name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-white/40 uppercase tracking-wider block mb-2">
                    Pays d'origine
                  </label>
                  <select
                    name="originCountry"
                    value={calc.originCountry}
                    onChange={handleCalcChange}
                    className="select-admin w-full"
                  >
                    {ORIGIN_COUNTRIES.map(({ code, name }) => (
                      <option key={code} value={code}>{name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-white/40 uppercase tracking-wider block mb-2">
                    Transport estimé
                  </label>
                  <input
                    type="number"
                    name="transportCost"
                    value={calc.transportCost}
                    onChange={handleCalcChange}
                    className="input-admin w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-white/40 uppercase tracking-wider block mb-2">
                    CO2 (g/km)
                  </label>
                  <input
                    type="number"
                    name="co2"
                    value={calc.co2}
                    onChange={handleCalcChange}
                    placeholder="Ex: 250"
                    className="input-admin w-full"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/40 uppercase tracking-wider block mb-2">
                    Marge cible (%)
                  </label>
                  <input
                    type="number"
                    name="targetMargin"
                    value={calc.targetMargin}
                    onChange={handleCalcChange}
                    className="input-admin w-full"
                  />
                </div>
              </div>

              {/* Results */}
              {calc.purchasePrice && (
                <div className="mt-6 p-4 bg-white/5 rounded-xl space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Prix d'achat (EUR)</span>
                    <span className="text-white">{formatPrice(purchaseEUR)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Transport</span>
                    <span className="text-white">{formatPrice(parseFloat(calc.transportCost) || 0)}</span>
                  </div>
                  {co2Malus > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Malus CO2</span>
                      <span className="text-yellow-400">{formatPrice(co2Malus)}</span>
                    </div>
                  )}
                  <div className="border-t border-white/10 pt-3 flex justify-between">
                    <span className="text-white/60">Coût de revient (PRU)</span>
                    <span className="font-medium text-white">{formatPrice(totalCost)}</span>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span className="text-white/60">Prix de vente conseillé</span>
                    <span className="font-semibold text-green-400">{formatPrice(recommendedPrice)}</span>
                  </div>
                </div>
              )}
            </div>
          </AdminCard>

          {/* New Vehicle Form */}
          <AdminCard>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Plus className="text-blue-400" size={20} />
              </div>
              <div>
                <h2 className="font-medium text-white">Nouveau véhicule</h2>
                <p className="text-xs text-white/40">Créer une fiche véhicule</p>
              </div>
            </div>

            <form onSubmit={handleCreateVehicle} className="space-y-4">
              {/* Vehicle Info */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-white/40 uppercase tracking-wider block mb-2">
                    Marque *
                  </label>
                  <select
                    name="make"
                    value={form.make}
                    onChange={handleFormChange}
                    className="select-admin w-full"
                    required
                  >
                    <option value="">Sélectionner</option>
                    {CAR_MAKES.map(make => (
                      <option key={make} value={make}>{make}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-white/40 uppercase tracking-wider block mb-2">
                    Modèle *
                  </label>
                  <input
                    type="text"
                    name="model"
                    value={form.model}
                    onChange={handleFormChange}
                    placeholder="Ex: RS6"
                    className="input-admin w-full"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-white/40 uppercase tracking-wider block mb-2">
                    Finition
                  </label>
                  <input
                    type="text"
                    name="trim"
                    value={form.trim}
                    onChange={handleFormChange}
                    placeholder="Ex: Performance"
                    className="input-admin w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-white/40 uppercase tracking-wider block mb-2">
                    Année *
                  </label>
                  <input
                    type="number"
                    name="year"
                    value={form.year}
                    onChange={handleFormChange}
                    className="input-admin w-full"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-white/40 uppercase tracking-wider block mb-2">
                    Kilométrage
                  </label>
                  <input
                    type="number"
                    name="mileage"
                    value={form.mileage}
                    onChange={handleFormChange}
                    placeholder="0"
                    className="input-admin w-full"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/40 uppercase tracking-wider block mb-2">
                    Couleur
                  </label>
                  <input
                    type="text"
                    name="color"
                    value={form.color}
                    onChange={handleFormChange}
                    placeholder="Ex: Gris Nardo"
                    className="input-admin w-full"
                  />
                </div>
              </div>

              {/* Source & Seller */}
              <div>
                <label className="text-xs text-white/40 uppercase tracking-wider block mb-2">
                  Lien annonce
                </label>
                <input
                  type="url"
                  name="sourceUrl"
                  value={form.sourceUrl}
                  onChange={handleFormChange}
                  placeholder="https://www.autoscout24.ch/..."
                  className="input-admin w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-white/40 uppercase tracking-wider block mb-2">
                    Prix d'achat
                  </label>
                  <input
                    type="number"
                    name="purchasePrice"
                    value={form.purchasePrice}
                    onChange={handleFormChange}
                    placeholder="0"
                    className="input-admin w-full"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/40 uppercase tracking-wider block mb-2">
                    Prix marché estimé
                  </label>
                  <input
                    type="number"
                    name="marketPrice"
                    value={form.marketPrice}
                    onChange={handleFormChange}
                    placeholder="0"
                    className="input-admin w-full"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-white/40 uppercase tracking-wider block mb-2">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleFormChange}
                  placeholder="Notes internes..."
                  className="input-admin w-full min-h-[80px] resize-none"
                />
              </div>

              <button type="submit" className="btn-admin w-full mt-4">
                Créer le véhicule
              </button>
            </form>
          </AdminCard>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Button
            onClick={() => setSheetOpen(true)}
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            <PanelRightOpen size={16} className="mr-2" />
            Formulaire avancé (avec marge)
          </Button>

          <div className="h-6 border-l border-white/20" />

          <a
            href="https://www.autoscout24.ch"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-white/40 hover:text-white/60 transition-colors"
          >
            <ExternalLink size={14} />
            AutoScout24 Suisse
          </a>
          <a
            href="https://www.mobile.de"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-white/40 hover:text-white/60 transition-colors"
          >
            <ExternalLink size={14} />
            Mobile.de
          </a>
          <a
            href="https://www.lacentrale.fr/cote-auto.html"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-white/40 hover:text-white/60 transition-colors"
          >
            <ExternalLink size={14} />
            La Centrale (Cote)
          </a>
        </div>
      </div>
    </div>
  )
}

export default Sourcing
