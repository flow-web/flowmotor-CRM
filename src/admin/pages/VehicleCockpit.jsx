import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft, Car, Edit, Trash2, ExternalLink,
  FileText, DollarSign, Wrench, Info, Plus, Check
} from 'lucide-react'
import TopHeader from '../components/layout/TopHeader'
import AdminCard from '../components/shared/AdminCard'
import StatusBadge from '../components/shared/StatusBadge'
import { useVehicles } from '../context/VehiclesContext'
import { useUI } from '../context/UIContext'
import {
  formatPrice, formatMileage, formatDate, formatVehicleName, formatVIN
} from '../utils/formatters'
import { calculatePRU, calculateMarginPercent, calculateTotalCosts } from '../utils/calculations'
import { VEHICLE_STATUS, VEHICLE_STATUS_LABELS, WORKFLOW_ORDER, COST_TYPES } from '../utils/constants'

function VehicleCockpit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getVehicle, updateVehicle, updateStatus, deleteVehicle, addCost, deleteCost } = useVehicles()
  const { showConfirm, toast } = useUI()

  const [activeTab, setActiveTab] = useState('info')
  const [showAddCost, setShowAddCost] = useState(false)
  const [newCost, setNewCost] = useState({ type: 'Atelier', amount: '', description: '' })

  const vehicle = getVehicle(id)

  if (!vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Car size={48} className="text-white/20 mx-auto mb-4" />
          <p className="text-white/60">Véhicule non trouvé</p>
          <Link to="/admin/stock" className="text-accent text-sm mt-2 block hover:underline">
            Retour au stock
          </Link>
        </div>
      </div>
    )
  }

  const pru = calculatePRU(vehicle)
  const margin = calculateMarginPercent(pru, vehicle.sellingPrice)
  const totalCosts = calculateTotalCosts(vehicle.costs)

  const handleDelete = async () => {
    const confirmed = await showConfirm({
      title: 'Supprimer le véhicule',
      message: `Êtes-vous sûr de vouloir supprimer ${formatVehicleName(vehicle)} ?`,
      confirmLabel: 'Supprimer',
      variant: 'danger'
    })

    if (confirmed) {
      deleteVehicle(id)
      toast.success('Véhicule supprimé')
      navigate('/admin/stock')
    }
  }

  const handleStatusChange = async (newStatus) => {
    updateStatus(id, newStatus)
    toast.success(`Statut mis à jour : ${VEHICLE_STATUS_LABELS[newStatus]}`)
  }

  const handleAddCost = (e) => {
    e.preventDefault()
    if (!newCost.amount) return

    addCost(id, {
      type: newCost.type,
      amount: parseFloat(newCost.amount),
      description: newCost.description
    })

    setNewCost({ type: 'Atelier', amount: '', description: '' })
    setShowAddCost(false)
    toast.success('Coût ajouté')
  }

  const handleDeleteCost = async (costId) => {
    const confirmed = await showConfirm({
      title: 'Supprimer ce coût',
      message: 'Cette action est irréversible.',
      confirmLabel: 'Supprimer',
      variant: 'danger'
    })

    if (confirmed) {
      deleteCost(id, costId)
      toast.success('Coût supprimé')
    }
  }

  const tabs = [
    { id: 'info', label: 'Informations', icon: Info },
    { id: 'finance', label: 'Finance', icon: DollarSign },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'atelier', label: 'Atelier', icon: Wrench }
  ]

  return (
    <div className="min-h-screen">
      <TopHeader
        title={formatVehicleName(vehicle)}
        subtitle={`VIN: ${formatVIN(vehicle.vin) || 'Non renseigné'}`}
      />

      <div className="p-6 space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <Link
            to="/admin/stock"
            className="flex items-center gap-2 text-white/60 hover:text-white/80 transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="text-sm">Retour au stock</span>
          </Link>

          <div className="flex items-center gap-2">
            {vehicle.sourceUrl && (
              <a
                href={vehicle.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-admin-secondary flex items-center gap-2"
              >
                <ExternalLink size={14} />
                Voir l'annonce
              </a>
            )}
            <button onClick={handleDelete} className="p-2 text-white/40 hover:text-red-400 transition-colors">
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <AdminCard>
            <p className="text-xs text-white/40 uppercase tracking-wider">Statut</p>
            <div className="mt-2">
              <StatusBadge status={vehicle.status} />
            </div>
          </AdminCard>
          <AdminCard>
            <p className="text-xs text-white/40 uppercase tracking-wider">PRU</p>
            <p className="text-xl font-semibold text-white mt-1">{formatPrice(pru)}</p>
          </AdminCard>
          <AdminCard>
            <p className="text-xs text-white/40 uppercase tracking-wider">Prix vente</p>
            <p className="text-xl font-semibold text-white mt-1">{formatPrice(vehicle.sellingPrice)}</p>
          </AdminCard>
          <AdminCard>
            <p className="text-xs text-white/40 uppercase tracking-wider">Marge</p>
            <p className={`text-xl font-semibold mt-1 ${margin >= 10 ? 'text-green-400' : 'text-yellow-400'}`}>
              {margin.toFixed(1)}%
            </p>
          </AdminCard>
          <AdminCard>
            <p className="text-xs text-white/40 uppercase tracking-wider">Profit estimé</p>
            <p className="text-xl font-semibold text-green-400 mt-1">
              {formatPrice(vehicle.sellingPrice - pru)}
            </p>
          </AdminCard>
        </div>

        {/* Timeline */}
        <AdminCard>
          <h3 className="text-sm font-medium text-white mb-4">Workflow</h3>
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {WORKFLOW_ORDER.map((status, index) => {
              const step = vehicle.timeline?.find(t => t.step === status)
              const isCurrent = vehicle.status === status
              const isCompleted = step?.status === 'completed'
              const canActivate = index === 0 || vehicle.timeline?.[index - 1]?.status === 'completed'

              return (
                <button
                  key={status}
                  onClick={() => canActivate && handleStatusChange(status)}
                  disabled={!canActivate}
                  className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
                    isCurrent
                      ? 'bg-accent text-white'
                      : isCompleted
                      ? 'bg-green-500/20 text-green-400'
                      : canActivate
                      ? 'bg-white/5 text-white/60 hover:bg-white/10'
                      : 'bg-white/5 text-white/20 cursor-not-allowed'
                  }`}
                >
                  {isCompleted && <Check size={14} />}
                  {VEHICLE_STATUS_LABELS[status]}
                </button>
              )
            })}
          </div>
        </AdminCard>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-white/10">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm transition-colors border-b-2 -mb-[2px] ${
                  activeTab === tab.id
                    ? 'border-accent text-white'
                    : 'border-transparent text-white/50 hover:text-white/70'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'info' && (
            <div className="grid md:grid-cols-2 gap-6">
              <AdminCard>
                <h3 className="text-sm font-medium text-white mb-4">Véhicule</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/50">Marque</span>
                    <span className="text-white">{vehicle.make}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Modèle</span>
                    <span className="text-white">{vehicle.model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Finition</span>
                    <span className="text-white">{vehicle.trim || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Année</span>
                    <span className="text-white">{vehicle.year}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Kilométrage</span>
                    <span className="text-white">{formatMileage(vehicle.mileage)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Couleur</span>
                    <span className="text-white">{vehicle.color || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">VIN</span>
                    <span className="text-white font-mono text-xs">{vehicle.vin || '-'}</span>
                  </div>
                </div>
              </AdminCard>

              <AdminCard>
                <h3 className="text-sm font-medium text-white mb-4">Sourcing</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/50">Origine</span>
                    <span className="text-white">{vehicle.originCountry || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Vendeur</span>
                    <span className="text-white">{vehicle.seller?.name || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Prix achat</span>
                    <span className="text-white">
                      {formatPrice(vehicle.purchasePrice, vehicle.currency)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Prix marché</span>
                    <span className="text-white">{formatPrice(vehicle.marketPrice)}</span>
                  </div>
                </div>

                {vehicle.notes && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Notes</p>
                    <p className="text-sm text-white/70">{vehicle.notes}</p>
                  </div>
                )}
              </AdminCard>
            </div>
          )}

          {activeTab === 'finance' && (
            <div className="space-y-6">
              <AdminCard>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-white">Coûts ({vehicle.costs?.length || 0})</h3>
                  <button
                    onClick={() => setShowAddCost(!showAddCost)}
                    className="btn-admin-secondary flex items-center gap-2 text-xs"
                  >
                    <Plus size={14} />
                    Ajouter
                  </button>
                </div>

                {showAddCost && (
                  <form onSubmit={handleAddCost} className="p-4 bg-white/5 rounded-lg mb-4 space-y-3">
                    <div className="grid grid-cols-3 gap-3">
                      <select
                        value={newCost.type}
                        onChange={(e) => setNewCost({ ...newCost, type: e.target.value })}
                        className="select-admin"
                      >
                        {Object.values(COST_TYPES).map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                      <input
                        type="number"
                        value={newCost.amount}
                        onChange={(e) => setNewCost({ ...newCost, amount: e.target.value })}
                        placeholder="Montant"
                        className="input-admin"
                        required
                      />
                      <input
                        type="text"
                        value={newCost.description}
                        onChange={(e) => setNewCost({ ...newCost, description: e.target.value })}
                        placeholder="Description"
                        className="input-admin"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button type="submit" className="btn-admin text-xs">Ajouter</button>
                      <button
                        type="button"
                        onClick={() => setShowAddCost(false)}
                        className="btn-admin-secondary text-xs"
                      >
                        Annuler
                      </button>
                    </div>
                  </form>
                )}

                <table className="table-admin">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Description</th>
                      <th>Date</th>
                      <th>Montant</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehicle.costs?.map((cost) => (
                      <tr key={cost.id}>
                        <td className="text-white">{cost.type}</td>
                        <td className="text-white/60">{cost.description || '-'}</td>
                        <td className="text-white/40">{formatDate(cost.date)}</td>
                        <td className="text-white font-medium">{formatPrice(cost.amount)}</td>
                        <td>
                          <button
                            onClick={() => handleDeleteCost(cost.id)}
                            className="text-white/40 hover:text-red-400"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {(!vehicle.costs || vehicle.costs.length === 0) && (
                      <tr>
                        <td colSpan={5} className="text-center py-8 text-white/40">
                          Aucun coût enregistré
                        </td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-white/10">
                      <td colSpan={3} className="text-white/60 font-medium">Total coûts</td>
                      <td className="text-white font-semibold">{formatPrice(totalCosts)}</td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </AdminCard>
            </div>
          )}

          {activeTab === 'documents' && (
            <AdminCard>
              <h3 className="text-sm font-medium text-white mb-4">Documents</h3>
              <div className="text-center py-12">
                <FileText size={32} className="text-white/20 mx-auto mb-3" />
                <p className="text-white/40 text-sm">Fonctionnalité à venir</p>
                <p className="text-white/30 text-xs mt-1">Upload de documents (carte grise, factures...)</p>
              </div>
            </AdminCard>
          )}

          {activeTab === 'atelier' && (
            <AdminCard>
              <h3 className="text-sm font-medium text-white mb-4">Notes atelier</h3>
              <div className="text-center py-12">
                <Wrench size={32} className="text-white/20 mx-auto mb-3" />
                <p className="text-white/40 text-sm">Fonctionnalité à venir</p>
                <p className="text-white/30 text-xs mt-1">Checklist préparation, notes mécanicien</p>
              </div>
            </AdminCard>
          )}
        </div>
      </div>
    </div>
  )
}

export default VehicleCockpit
