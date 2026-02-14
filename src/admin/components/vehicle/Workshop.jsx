import { useState } from 'react'
import { Wrench, Trash2, Plus } from 'lucide-react'
import { useVehicles } from '../../context/VehiclesContext'
import { useUI } from '../../context/UIContext'
import { formatPrice } from '../../utils/formatters'
import { COST_CATEGORY_COLORS } from '../../utils/constants'
import CTAnalyzer from './CTAnalyzer'

// Types atelier — sous-ensemble de COST_TYPES qui impactent le PRU via vehicle_costs
const WORKSHOP_TYPES = [
  { value: 'Atelier', label: 'Mécanique' },
  { value: 'Pièces', label: 'Pièces' },
  { value: 'Detailing', label: 'Esthétique / Detailing' },
]

// Tous les types affichés dans l'onglet Atelier
const WORKSHOP_TYPE_VALUES = WORKSHOP_TYPES.map(t => t.value)

export default function Workshop({ vehicleId, purchasePrice }) {
  const { getVehicle, addCost, deleteCost } = useVehicles()
  const { showConfirm, toast } = useUI()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    supplier: '',
    type: 'Atelier',
    date: new Date().toISOString().split('T')[0]
  })

  const vehicle = getVehicle(vehicleId)

  // Filtrer les coûts atelier depuis vehicle.costs (source unique = vehicle_costs)
  const workshopCosts = (vehicle?.costs || []).filter(c =>
    WORKSHOP_TYPE_VALUES.includes(c.type)
  )

  const totalWorkshop = workshopCosts.reduce((sum, c) => sum + (c.amount || 0), 0)
  const totalCost = (Number(purchasePrice) || 0) + totalWorkshop

  // Ajout — passe par le Context → vehicle_costs
  const handleAdd = async (e) => {
    e.preventDefault()
    if (!formData.amount) return

    setIsSubmitting(true)
    try {
      await addCost(vehicleId, {
        type: formData.type,
        amount: parseFloat(formData.amount),
        description: formData.description.trim() || undefined,
        supplier: formData.supplier.trim() || undefined,
        date: new Date(formData.date).toISOString()
      })
      toast.success('Frais atelier ajouté')
      setFormData({ ...formData, description: '', amount: '', supplier: '' })
    } catch (err) {
      console.error('[Workshop] Erreur ajout:', err)
      toast.error(`Erreur: ${err.message || "Impossible d'ajouter"}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Suppression — passe par le Context → vehicle_costs
  const handleDelete = async (costId) => {
    const confirmed = await showConfirm({
      title: 'Supprimer ce frais',
      message: 'Cette action est irréversible.',
      confirmLabel: 'Supprimer',
      variant: 'danger'
    })
    if (!confirmed) return

    try {
      await deleteCost(vehicleId, costId)
      toast.success('Frais supprimé')
    } catch (err) {
      console.error('[Workshop] Erreur suppression:', err)
      toast.error('Erreur suppression')
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#1A0F0F] p-4 rounded-xl border border-white/10">
          <p className="text-white/40 text-xs uppercase mb-1">Total Achat</p>
          <p className="text-2xl font-serif text-[#F4E8D8]">{formatPrice(purchasePrice)}</p>
        </div>
        <div className="bg-[#1A0F0F] p-4 rounded-xl border border-orange-500/30">
          <p className="text-orange-400/60 text-xs uppercase mb-1">Frais Atelier</p>
          <p className="text-2xl font-serif text-orange-400">{formatPrice(totalWorkshop)}</p>
        </div>
        <div className="bg-[#1A0F0F] p-4 rounded-xl border border-green-500/30">
          <p className="text-green-400/60 text-xs uppercase mb-1">PRU (avec atelier)</p>
          <p className="text-2xl font-serif text-green-400">{formatPrice(totalCost)}</p>
        </div>
      </div>

      {/* Mechanic GPT — CT Analyzer */}
      <div className="bg-[#1A0F0F] border border-white/10 rounded-xl p-5">
        <CTAnalyzer
          vehicleId={vehicleId}
          onAddCost={async (costData) => {
            await addCost(vehicleId, {
              ...costData,
              date: new Date().toISOString()
            })
            toast.success('Frais CT ajouté')
          }}
        />
      </div>

      {/* Formulaire */}
      <div className="bg-[#1A0F0F] border border-white/10 rounded-xl p-5">
        <h3 className="text-[#F4E8D8] font-medium mb-4 flex items-center gap-2">
          <Wrench size={18} /> Ajouter un frais atelier
        </h3>
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-4 space-y-1">
            <label className="text-xs text-white/40">Description *</label>
            <input
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-[#F4E8D8] focus:border-orange-500/50 outline-none"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="Ex: Vidange, Pneus, Polish..."
            />
          </div>
          <div className="md:col-span-2 space-y-1">
            <label className="text-xs text-white/40">Montant (€) *</label>
            <input
              required
              type="number"
              step="0.01"
              className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-[#F4E8D8] outline-none"
              value={formData.amount}
              onChange={e => setFormData({ ...formData, amount: e.target.value })}
              placeholder="0.00"
            />
          </div>
          <div className="md:col-span-2 space-y-1">
            <label className="text-xs text-white/40">Catégorie</label>
            <select
              className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-[#F4E8D8] outline-none"
              value={formData.type}
              onChange={e => setFormData({ ...formData, type: e.target.value })}
            >
              {WORKSHOP_TYPES.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2 space-y-1">
            <label className="text-xs text-white/40">Fournisseur</label>
            <input
              className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-[#F4E8D8] outline-none"
              value={formData.supplier}
              onChange={e => setFormData({ ...formData, supplier: e.target.value })}
              placeholder="Garage..."
            />
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white p-2.5 rounded-lg flex justify-center transition-colors"
            >
              {isSubmitting ? '...' : <Plus size={20} />}
            </button>
          </div>
        </form>
      </div>

      {/* Liste */}
      <div className="space-y-2">
        {workshopCosts.length === 0 ? (
          <div className="text-center py-8 bg-white/5 rounded-xl border border-dashed border-white/10">
            <Wrench size={24} className="text-white/15 mx-auto mb-2" />
            <p className="text-white/30 text-sm">Aucun frais atelier pour ce véhicule.</p>
          </div>
        ) : (
          workshopCosts.map(cost => {
            const color = COST_CATEGORY_COLORS[cost.type] || '#95A5A6'
            return (
              <div key={cost.id} className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/5">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${color}20` }}
                  >
                    <Wrench size={14} style={{ color }} />
                  </div>
                  <div>
                    <p className="text-[#F4E8D8] text-sm font-medium">{cost.description || cost.type}</p>
                    <p className="text-xs text-white/40">
                      {cost.type}
                      {cost.supplier && ` • ${cost.supplier}`}
                      {' • '}
                      {new Date(cost.date).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-orange-200 font-mono">
                    - {formatPrice(cost.amount)}
                  </span>
                  <button
                    onClick={() => handleDelete(cost.id)}
                    className="text-white/20 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
