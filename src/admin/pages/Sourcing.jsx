import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calculator, Plus, ExternalLink, TrendingUp, AlertTriangle, Check } from 'lucide-react'
import TopHeader from '../components/layout/TopHeader'
import { useVehicles } from '../context/VehiclesContext'
import { useUI } from '../context/UIContext'
import { CAR_MAKES } from '../utils/constants'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

// Configuration des devises
const CURRENCIES = {
  EUR: { symbol: '€', rate: 1, name: 'Euro' },
  CHF: { symbol: 'CHF', rate: 0.93, name: 'Franc Suisse' },
  JPY: { symbol: '¥', rate: 0.0062, name: 'Yen Japonais' },
  GBP: { symbol: '£', rate: 1.17, name: 'Livre Sterling' },
}

// Configuration des pays d'origine
const ORIGIN_COUNTRIES = [
  { code: 'FR', name: 'France', isEU: true },
  { code: 'DE', name: 'Allemagne', isEU: true },
  { code: 'BE', name: 'Belgique', isEU: true },
  { code: 'IT', name: 'Italie', isEU: true },
  { code: 'ES', name: 'Espagne', isEU: true },
  { code: 'NL', name: 'Pays-Bas', isEU: true },
  { code: 'CH', name: 'Suisse', isEU: false },
  { code: 'JP', name: 'Japon', isEU: false },
  { code: 'GB', name: 'Royaume-Uni', isEU: false },
  { code: 'US', name: 'États-Unis', isEU: false },
]

// Taux par défaut
const DEFAULT_VAT_RATE = 20 // TVA France
const DEFAULT_CUSTOMS_RATE = 10 // Douane hors UE

function Sourcing() {
  const navigate = useNavigate()
  const { createVehicle } = useVehicles()
  const { toast } = useUI()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // === ÉTAT DU CALCULATEUR ===
  const [calc, setCalc] = useState({
    purchasePrice: '', // Prix d'achat en devise étrangère
    currency: 'EUR',
    exchangeRate: 1,
    originCountry: 'CH',
    transportCost: 800,
    customsRate: DEFAULT_CUSTOMS_RATE, // 10% si hors UE
    vatRate: DEFAULT_VAT_RATE, // 20% TVA
    targetSellingPrice: '', // Prix de vente cible
  })

  // === ÉTAT DU FORMULAIRE VÉHICULE ===
  const [vehicle, setVehicle] = useState({
    brand: '',
    model: '',
    trim: '',
    year: new Date().getFullYear(),
    mileage: '',
    color: '',
    vin: '',
    sourceUrl: '',
    sellerName: '',
    notes: '',
  })

  // === CALCULS EN TEMPS RÉEL ===
  const calculations = useMemo(() => {
    const purchasePrice = parseFloat(calc.purchasePrice) || 0
    const exchangeRate = parseFloat(calc.exchangeRate) || 1
    const transportCost = parseFloat(calc.transportCost) || 0
    const customsRate = parseFloat(calc.customsRate) || 0
    const vatRate = parseFloat(calc.vatRate) || 0
    const targetSellingPrice = parseFloat(calc.targetSellingPrice) || 0

    // Déterminer si pays UE
    const country = ORIGIN_COUNTRIES.find((c) => c.code === calc.originCountry)
    const isEU = country?.isEU ?? true

    // Prix d'achat en EUR
    const purchasePriceEUR = purchasePrice * exchangeRate

    // Frais de douane (10% si hors UE, 0 si UE)
    const customsFee = isEU ? 0 : purchasePriceEUR * (customsRate / 100)

    // Base pour TVA (prix + transport + douane)
    const baseForVAT = purchasePriceEUR + transportCost + customsFee

    // TVA sur marge : on ne taxe que la marge, pas le prix total
    // Pour simplifier, on calcule la TVA sur la valeur ajoutée
    const vatAmount = baseForVAT * (vatRate / 100)

    // Total des frais
    const feesTotal = transportCost + customsFee + vatAmount

    // PRU (Prix de Revient Unitaire)
    const costPrice = purchasePriceEUR + feesTotal

    // Marge si prix de vente cible défini
    const margin = targetSellingPrice > 0 ? targetSellingPrice - costPrice : 0
    const marginPercent = targetSellingPrice > 0 ? (margin / targetSellingPrice) * 100 : 0

    // Prix de vente minimum pour 15% de marge
    const minSellingPrice = costPrice / (1 - 0.15)

    return {
      purchasePriceEUR,
      customsFee,
      vatAmount,
      feesTotal,
      costPrice,
      margin,
      marginPercent,
      minSellingPrice,
      isEU,
    }
  }, [calc])

  // === HANDLERS ===
  const handleCalcChange = (field, value) => {
    setCalc((prev) => {
      const newCalc = { ...prev, [field]: value }

      // Mise à jour automatique du taux de change
      if (field === 'currency') {
        newCalc.exchangeRate = CURRENCIES[value]?.rate || 1
      }

      // Mise à jour automatique des frais de douane selon le pays
      if (field === 'originCountry') {
        const country = ORIGIN_COUNTRIES.find((c) => c.code === value)
        newCalc.customsRate = country?.isEU ? 0 : DEFAULT_CUSTOMS_RATE
      }

      return newCalc
    })
  }

  const handleVehicleChange = (field, value) => {
    setVehicle((prev) => ({ ...prev, [field]: value }))
  }

  // === SOUMISSION VERS SUPABASE ===
  const handleAddToStock = async () => {
    // Validation
    if (!vehicle.brand || !vehicle.model) {
      toast.error('Veuillez renseigner la marque et le modèle')
      return
    }

    if (!calc.purchasePrice) {
      toast.error("Veuillez renseigner le prix d'achat")
      return
    }

    setIsSubmitting(true)

    try {
      // Payload propre : camelCase → transformVehicleToDB fera le mapping snake_case
      const payload = {
        // Infos véhicule
        brand: vehicle.brand,
        model: vehicle.model,
        trim: vehicle.trim,
        year: parseInt(vehicle.year),
        mileage: parseInt(vehicle.mileage) || 0,
        color: vehicle.color,
        vin: vehicle.vin,
        sourceUrl: vehicle.sourceUrl,
        sellerName: vehicle.sellerName,
        notes: vehicle.notes,

        // Prix d'achat
        purchasePrice: parseFloat(calc.purchasePrice) || 0,
        currency: calc.currency,
        exchangeRate: parseFloat(calc.exchangeRate) || 1,
        originCountry: calc.originCountry,

        // Frais calculés
        transportCost: parseFloat(calc.transportCost) || 0,
        customsFee: calculations.customsFee,
        vatAmount: calculations.vatAmount,
        feesTotal: calculations.feesTotal,

        // Prix & Marge
        costPrice: calculations.costPrice,
        sellingPrice: parseFloat(calc.targetSellingPrice) || calculations.minSellingPrice,
        margin: calculations.margin,
        marginPercent: calculations.marginPercent,

        // Import
        vatRate: parseFloat(calc.vatRate) || DEFAULT_VAT_RATE,
        isEuOrigin: calculations.isEU,

        // Statut initial
        status: 'SOURCING',
      }

      const newVehicle = await createVehicle(payload)

      toast.success('Véhicule ajouté au stock !')

      // Reset du formulaire
      setVehicle({
        brand: '',
        model: '',
        trim: '',
        year: new Date().getFullYear(),
        mileage: '',
        color: '',
        vin: '',
        sourceUrl: '',
        sellerName: '',
        notes: '',
      })

      navigate('/admin/stock')
    } catch (error) {
      console.error('Erreur création véhicule:', error)
      toast.error(`Erreur: ${error.message || 'Impossible de créer le véhicule'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  // === FORMAT HELPERS ===
  const formatPrice = (value) => {
    if (!value && value !== 0) return '-'
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="min-h-screen bg-[#1a1212]">
      <TopHeader title="Sourcing" subtitle="Calculateur d'import & création véhicule" />

      <div className="p-6">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* === CALCULATEUR D'IMPORT === */}
          <Card className="bg-[#2a1f1f] border-[#3D1E1E]">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#5C3A2E]/30 rounded-lg">
                  <Calculator className="text-[#C4A484]" size={20} />
                </div>
                <div>
                  <CardTitle className="text-white">Calculateur d'Import</CardTitle>
                  <CardDescription className="text-white/50">
                    Estimez votre PRU et marge nette en temps réel
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-5">
              {/* Prix d'achat + Devise */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white/70 text-xs uppercase tracking-wider">
                    Prix d'achat (Devise étrangère)
                  </Label>
                  <Input
                    type="number"
                    value={calc.purchasePrice}
                    onChange={(e) => handleCalcChange('purchasePrice', e.target.value)}
                    placeholder="Ex: 45000"
                    className="bg-[#1a1212] border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/70 text-xs uppercase tracking-wider">Devise</Label>
                  <Select value={calc.currency} onValueChange={(v) => handleCalcChange('currency', v)}>
                    <SelectTrigger className="bg-[#1a1212] border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(CURRENCIES).map(([code, { name, symbol }]) => (
                        <SelectItem key={code} value={code}>
                          {symbol} - {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Taux de change + Pays */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white/70 text-xs uppercase tracking-wider">
                    Taux de change (→ EUR)
                  </Label>
                  <Input
                    type="number"
                    step="0.0001"
                    value={calc.exchangeRate}
                    onChange={(e) => handleCalcChange('exchangeRate', e.target.value)}
                    className="bg-[#1a1212] border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/70 text-xs uppercase tracking-wider">Pays d'origine</Label>
                  <Select
                    value={calc.originCountry}
                    onValueChange={(v) => handleCalcChange('originCountry', v)}
                  >
                    <SelectTrigger className="bg-[#1a1212] border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ORIGIN_COUNTRIES.map(({ code, name, isEU }) => (
                        <SelectItem key={code} value={code}>
                          {name} {!isEU && '(Hors UE)'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Transport + Douane */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white/70 text-xs uppercase tracking-wider">
                    Frais Transport (€)
                  </Label>
                  <Input
                    type="number"
                    value={calc.transportCost}
                    onChange={(e) => handleCalcChange('transportCost', e.target.value)}
                    className="bg-[#1a1212] border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/70 text-xs uppercase tracking-wider">
                    Frais Douane (%) {calculations.isEU && '→ UE = 0%'}
                  </Label>
                  <Input
                    type="number"
                    value={calc.customsRate}
                    onChange={(e) => handleCalcChange('customsRate', e.target.value)}
                    disabled={calculations.isEU}
                    className="bg-[#1a1212] border-white/10 text-white disabled:opacity-50"
                  />
                </div>
              </div>

              {/* TVA + Prix vente cible */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white/70 text-xs uppercase tracking-wider">TVA (%)</Label>
                  <Input
                    type="number"
                    value={calc.vatRate}
                    onChange={(e) => handleCalcChange('vatRate', e.target.value)}
                    className="bg-[#1a1212] border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/70 text-xs uppercase tracking-wider">
                    Prix de vente cible (€)
                  </Label>
                  <Input
                    type="number"
                    value={calc.targetSellingPrice}
                    onChange={(e) => handleCalcChange('targetSellingPrice', e.target.value)}
                    placeholder="Ex: 55000"
                    className="bg-[#1a1212] border-white/10 text-white"
                  />
                </div>
              </div>

              {/* === RÉSULTATS EN TEMPS RÉEL === */}
              {calc.purchasePrice && (
                <div className="mt-6 p-4 bg-[#1a1212] rounded-xl space-y-3 border border-white/5">
                  <h3 className="text-xs uppercase tracking-wider text-white/40 mb-3">
                    Résultat du calcul
                  </h3>

                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Prix d'achat (EUR)</span>
                    <span className="text-white font-medium">{formatPrice(calculations.purchasePriceEUR)}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Transport</span>
                    <span className="text-white">{formatPrice(parseFloat(calc.transportCost) || 0)}</span>
                  </div>

                  {!calculations.isEU && (
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60 flex items-center gap-1">
                        <AlertTriangle size={12} className="text-yellow-500" />
                        Droits de douane ({calc.customsRate}%)
                      </span>
                      <span className="text-yellow-400">{formatPrice(calculations.customsFee)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">TVA ({calc.vatRate}%)</span>
                    <span className="text-white">{formatPrice(calculations.vatAmount)}</span>
                  </div>

                  <div className="border-t border-white/10 pt-3 mt-3">
                    <div className="flex justify-between text-base font-semibold">
                      <span className="text-white/80">PRU (Prix de Revient)</span>
                      <span className="text-[#C4A484]">{formatPrice(calculations.costPrice)}</span>
                    </div>
                  </div>

                  {calc.targetSellingPrice && (
                    <div className="border-t border-white/10 pt-3 mt-3 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">Prix de vente cible</span>
                        <span className="text-white">{formatPrice(parseFloat(calc.targetSellingPrice))}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold">
                        <span className="text-white/80">Marge Nette</span>
                        <span
                          className={
                            calculations.marginPercent >= 15
                              ? 'text-green-400'
                              : calculations.marginPercent >= 10
                              ? 'text-yellow-400'
                              : 'text-red-400'
                          }
                        >
                          {formatPrice(calculations.margin)} ({calculations.marginPercent.toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="bg-[#5C3A2E]/20 rounded-lg p-3 mt-4">
                    <div className="flex items-center gap-2 text-sm">
                      <TrendingUp size={16} className="text-[#C4A484]" />
                      <span className="text-white/60">Prix minimum conseillé (marge 15%)</span>
                    </div>
                    <p className="text-lg font-bold text-[#C4A484] mt-1">
                      {formatPrice(calculations.minSellingPrice)}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* === FORMULAIRE VÉHICULE === */}
          <Card className="bg-[#2a1f1f] border-[#3D1E1E]">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Plus className="text-blue-400" size={20} />
                </div>
                <div>
                  <CardTitle className="text-white">Informations Véhicule</CardTitle>
                  <CardDescription className="text-white/50">
                    Créer une fiche véhicule et l'ajouter au stock
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-5">
              {/* Marque / Modèle / Finition */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-white/70 text-xs uppercase tracking-wider">Marque *</Label>
                  <Select value={vehicle.brand} onValueChange={(v) => handleVehicleChange('brand', v)}>
                    <SelectTrigger className="bg-[#1a1212] border-white/10 text-white">
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      {CAR_MAKES.map((make) => (
                        <SelectItem key={make} value={make}>
                          {make}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-white/70 text-xs uppercase tracking-wider">Modèle *</Label>
                  <Input
                    value={vehicle.model}
                    onChange={(e) => handleVehicleChange('model', e.target.value)}
                    placeholder="Ex: RS6"
                    className="bg-[#1a1212] border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/70 text-xs uppercase tracking-wider">Finition</Label>
                  <Input
                    value={vehicle.trim}
                    onChange={(e) => handleVehicleChange('trim', e.target.value)}
                    placeholder="Ex: Performance"
                    className="bg-[#1a1212] border-white/10 text-white"
                  />
                </div>
              </div>

              {/* Année / Km / Couleur */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-white/70 text-xs uppercase tracking-wider">Année *</Label>
                  <Input
                    type="number"
                    value={vehicle.year}
                    onChange={(e) => handleVehicleChange('year', e.target.value)}
                    className="bg-[#1a1212] border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/70 text-xs uppercase tracking-wider">Kilométrage</Label>
                  <Input
                    type="number"
                    value={vehicle.mileage}
                    onChange={(e) => handleVehicleChange('mileage', e.target.value)}
                    placeholder="Ex: 45000"
                    className="bg-[#1a1212] border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/70 text-xs uppercase tracking-wider">Couleur</Label>
                  <Input
                    value={vehicle.color}
                    onChange={(e) => handleVehicleChange('color', e.target.value)}
                    placeholder="Ex: Gris Nardo"
                    className="bg-[#1a1212] border-white/10 text-white"
                  />
                </div>
              </div>

              {/* VIN */}
              <div className="space-y-2">
                <Label className="text-white/70 text-xs uppercase tracking-wider">
                  VIN (Numéro de série)
                </Label>
                <Input
                  value={vehicle.vin}
                  onChange={(e) => handleVehicleChange('vin', e.target.value.toUpperCase())}
                  placeholder="Ex: WVWZZZ3CZWE123456"
                  maxLength={17}
                  className="bg-[#1a1212] border-white/10 text-white font-mono"
                />
              </div>

              {/* Source URL */}
              <div className="space-y-2">
                <Label className="text-white/70 text-xs uppercase tracking-wider">Lien annonce</Label>
                <Input
                  type="url"
                  value={vehicle.sourceUrl}
                  onChange={(e) => handleVehicleChange('sourceUrl', e.target.value)}
                  placeholder="https://www.autoscout24.ch/..."
                  className="bg-[#1a1212] border-white/10 text-white"
                />
              </div>

              {/* Vendeur */}
              <div className="space-y-2">
                <Label className="text-white/70 text-xs uppercase tracking-wider">Nom vendeur</Label>
                <Input
                  value={vehicle.sellerName}
                  onChange={(e) => handleVehicleChange('sellerName', e.target.value)}
                  placeholder="Ex: AutoHaus Zürich"
                  className="bg-[#1a1212] border-white/10 text-white"
                />
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label className="text-white/70 text-xs uppercase tracking-wider">Notes</Label>
                <textarea
                  value={vehicle.notes}
                  onChange={(e) => handleVehicleChange('notes', e.target.value)}
                  placeholder="Notes internes..."
                  className="w-full min-h-[80px] px-3 py-2 rounded-md bg-[#1a1212] border border-white/10 text-white placeholder:text-white/30 resize-none focus:outline-none focus:ring-2 focus:ring-[#5C3A2E]"
                />
              </div>

              {/* Bouton Ajouter au Stock */}
              <Button
                onClick={handleAddToStock}
                disabled={isSubmitting || !vehicle.brand || !vehicle.model || !calc.purchasePrice}
                className="w-full bg-[#5C3A2E] hover:bg-[#5C3A2E]/80 text-white h-12 text-base font-semibold"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Création en cours...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Check size={18} />
                    Ajouter au Stock
                  </span>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* === LIENS RAPIDES === */}
        <div className="mt-6 flex flex-wrap items-center gap-4 p-4 bg-[#2a1f1f] rounded-xl border border-[#3D1E1E]">
          <span className="text-sm text-white/40">Rechercher sur :</span>
          <a
            href="https://www.autoscout24.ch"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-white/60 hover:text-[#C4A484] transition-colors"
          >
            <ExternalLink size={14} />
            AutoScout24 Suisse
          </a>
          <a
            href="https://www.mobile.de"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-white/60 hover:text-[#C4A484] transition-colors"
          >
            <ExternalLink size={14} />
            Mobile.de
          </a>
          <a
            href="https://www.lacentrale.fr/cote-auto.html"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-white/60 hover:text-[#C4A484] transition-colors"
          >
            <ExternalLink size={14} />
            La Centrale
          </a>
          <a
            href="https://www.goo-net.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-white/60 hover:text-[#C4A484] transition-colors"
          >
            <ExternalLink size={14} />
            Goo-net (Japon)
          </a>
        </div>
      </div>
    </div>
  )
}

export default Sourcing
