import { useState } from 'react'
import { X, Car } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CAR_MAKES } from '../../utils/constants'

export default function TradeInForm({ onSubmit, onCancel, loading }) {
  const [form, setForm] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    vin: '',
    mileage: '',
    registrationPlate: '',
    color: '',
    tradeinValue: '',
    notes: ''
  })

  const [brandSuggestions, setBrandSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  const handleBrandChange = (value) => {
    setForm({ ...form, brand: value })
    if (value.length >= 1) {
      const filtered = CAR_MAKES.filter(m =>
        m.toLowerCase().startsWith(value.toLowerCase())
      )
      setBrandSuggestions(filtered)
      setShowSuggestions(filtered.length > 0)
    } else {
      setShowSuggestions(false)
    }
  }

  const selectBrand = (brand) => {
    setForm({ ...form, brand })
    setShowSuggestions(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.brand || !form.model || !form.tradeinValue) return
    onSubmit(form)
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-medium text-white flex items-center gap-2">
          <Car size={16} className="text-[#C4A484]" />
          Véhicule repris
        </h4>
        <button onClick={onCancel} className="text-white/40 hover:text-white/70">
          <X size={18} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {/* Marque avec autocomplete */}
          <div className="relative">
            <label className="text-xs text-white/50 mb-1 block">Marque *</label>
            <Input
              type="text"
              value={form.brand}
              onChange={(e) => handleBrandChange(e.target.value)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              placeholder="Ex: BMW"
              className="bg-[#1a1212] border-white/10 text-white placeholder:text-white/30"
              required
            />
            {showSuggestions && (
              <div className="absolute z-10 top-full mt-1 w-full bg-[#2a1f1f] border border-white/10 rounded-md max-h-32 overflow-y-auto">
                {brandSuggestions.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => selectBrand(b)}
                    className="w-full text-left px-3 py-1.5 text-sm text-white hover:bg-white/10"
                  >
                    {b}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Modèle */}
          <div>
            <label className="text-xs text-white/50 mb-1 block">Modèle *</label>
            <Input
              type="text"
              value={form.model}
              onChange={(e) => setForm({ ...form, model: e.target.value })}
              placeholder="Ex: Série 3"
              className="bg-[#1a1212] border-white/10 text-white placeholder:text-white/30"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-xs text-white/50 mb-1 block">Année</label>
            <Input
              type="number"
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
              className="bg-[#1a1212] border-white/10 text-white"
            />
          </div>
          <div>
            <label className="text-xs text-white/50 mb-1 block">Kilométrage</label>
            <Input
              type="number"
              value={form.mileage}
              onChange={(e) => setForm({ ...form, mileage: e.target.value })}
              placeholder="km"
              className="bg-[#1a1212] border-white/10 text-white placeholder:text-white/30"
            />
          </div>
          <div>
            <label className="text-xs text-white/50 mb-1 block">Couleur</label>
            <Input
              type="text"
              value={form.color}
              onChange={(e) => setForm({ ...form, color: e.target.value })}
              placeholder="Noir"
              className="bg-[#1a1212] border-white/10 text-white placeholder:text-white/30"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-white/50 mb-1 block">VIN</label>
            <Input
              type="text"
              value={form.vin}
              onChange={(e) => setForm({ ...form, vin: e.target.value.toUpperCase() })}
              placeholder="17 caractères"
              maxLength={17}
              className="bg-[#1a1212] border-white/10 text-white font-mono placeholder:text-white/30"
            />
          </div>
          <div>
            <label className="text-xs text-white/50 mb-1 block">Immatriculation</label>
            <Input
              type="text"
              value={form.registrationPlate}
              onChange={(e) => setForm({ ...form, registrationPlate: e.target.value.toUpperCase() })}
              placeholder="AA-123-BB"
              className="bg-[#1a1212] border-white/10 text-white font-mono placeholder:text-white/30"
            />
          </div>
        </div>

        {/* Valeur de reprise */}
        <div>
          <label className="text-xs text-white/50 mb-1 block">Valeur de reprise (EUR) *</label>
          <Input
            type="number"
            value={form.tradeinValue}
            onChange={(e) => setForm({ ...form, tradeinValue: e.target.value })}
            placeholder="0.00"
            step="0.01"
            min="0"
            className="bg-[#1a1212] border-white/10 text-white text-lg font-semibold placeholder:text-white/30"
            required
          />
        </div>

        {/* Notes */}
        <div>
          <label className="text-xs text-white/50 mb-1 block">Notes</label>
          <textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder="État du véhicule, remarques..."
            rows={2}
            className="w-full bg-[#1a1212] border border-white/10 rounded-md px-3 py-2 text-sm text-white placeholder:text-white/30 resize-none focus:outline-none focus:ring-1 focus:ring-[#5C3A2E]"
          />
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            type="submit"
            disabled={loading || !form.brand || !form.model || !form.tradeinValue}
            className="bg-[#5C3A2E] hover:bg-[#5C3A2E]/80 text-white"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
            ) : null}
            Valider la reprise
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            className="text-white/60 hover:text-white hover:bg-white/5"
          >
            Annuler
          </Button>
        </div>
      </form>
    </div>
  )
}
