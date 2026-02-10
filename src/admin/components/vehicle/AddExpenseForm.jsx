/**
 * AddExpenseForm — Expense form with category chips
 * Props: onSubmit(costData), onCancel(), costTypes (array of strings)
 */
import { useState, useEffect } from 'react'
import { Upload } from 'lucide-react'
import { COST_TYPES, COST_CATEGORY_COLORS } from '../../utils/constants'

const SUPPLIER_STORAGE_KEY = 'flowmotor_suppliers'

function AddExpenseForm({ onSubmit, onCancel }) {
  const types = Object.values(COST_TYPES)
  const [selected, setSelected] = useState(types[5]) // 'Atelier' default
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [supplier, setSupplier] = useState('')
  const [supplierSuggestions, setSupplierSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Load saved suppliers from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SUPPLIER_STORAGE_KEY)
      if (stored) setSupplierSuggestions(JSON.parse(stored))
    } catch { /* ignore */ }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!amount) return

    // Save supplier to autocomplete list
    if (supplier.trim()) {
      const updated = [...new Set([supplier.trim(), ...supplierSuggestions])].slice(0, 50)
      localStorage.setItem(SUPPLIER_STORAGE_KEY, JSON.stringify(updated))
    }

    onSubmit({
      type: selected,
      amount: parseFloat(amount),
      description: description.trim() || undefined,
      supplier: supplier.trim() || undefined
    })
  }

  const filteredSuggestions = supplier.trim()
    ? supplierSuggestions.filter(s => s.toLowerCase().includes(supplier.toLowerCase()))
    : []

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white/5 rounded-lg mb-4 space-y-4">
      {/* Category chips */}
      <div>
        <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Catégorie</p>
        <div className="flex flex-wrap gap-2">
          {types.map(type => {
            const color = COST_CATEGORY_COLORS[type] || '#95A5A6'
            const isActive = selected === type
            return (
              <button
                key={type}
                type="button"
                onClick={() => setSelected(type)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border"
                style={{
                  backgroundColor: isActive ? `${color}20` : 'rgba(255,255,255,0.05)',
                  borderColor: isActive ? color : 'rgba(255,255,255,0.1)',
                  color: isActive ? color : 'rgba(255,255,255,0.6)'
                }}
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: color }}
                />
                {type}
              </button>
            )
          })}
        </div>
      </div>

      {/* Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="text-xs text-white/40 block mb-1">Montant *</label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="input-admin w-full"
            required
          />
        </div>
        <div>
          <label className="text-xs text-white/40 block mb-1">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="input-admin w-full"
          />
        </div>
        <div className="relative">
          <label className="text-xs text-white/40 block mb-1">Fournisseur</label>
          <input
            type="text"
            value={supplier}
            onChange={(e) => {
              setSupplier(e.target.value)
              setShowSuggestions(true)
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder="Fournisseur"
            className="input-admin w-full"
          />
          {/* Autocomplete dropdown */}
          {showSuggestions && filteredSuggestions.length > 0 && (
            <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-[#2a1f1f] border border-white/10 rounded-lg shadow-lg max-h-32 overflow-y-auto">
              {filteredSuggestions.map(s => (
                <button
                  key={s}
                  type="button"
                  className="block w-full text-left px-3 py-2 text-sm text-white/70 hover:bg-white/10 transition-colors"
                  onMouseDown={() => {
                    setSupplier(s)
                    setShowSuggestions(false)
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button type="submit" className="btn-admin text-xs">Ajouter</button>
        <button type="button" onClick={onCancel} className="btn-admin-secondary text-xs">
          Annuler
        </button>
      </div>
    </form>
  )
}

export default AddExpenseForm
