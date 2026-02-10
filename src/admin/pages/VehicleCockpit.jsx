import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { pdf } from '@react-pdf/renderer'
import {
  ArrowLeft, Car, Trash2, ExternalLink,
  FileText, DollarSign, Wrench, Info, Plus, Check,
  ClipboardList, Search, Download, Receipt, Users, ImageIcon,
  FileCheck, RefreshCw, ArrowRightLeft
} from 'lucide-react'
import ImageUploader from '../components/images/ImageUploader'
import Workshop from '../components/vehicle/Workshop'
import TradeInForm from '../components/vehicle/TradeInForm'
import TopHeader from '../components/layout/TopHeader'
import AdminCard from '../components/shared/AdminCard'
import StatusBadge from '../components/shared/StatusBadge'
import { useVehicles } from '../context/VehiclesContext'
import { useUI } from '../context/UIContext'
import {
  formatPrice, formatMileage, formatDate, formatVehicleName, formatVIN
} from '../utils/formatters'
import { calculatePRU, calculateMarginPercent, calculateTotalCosts } from '../utils/calculations'
import { VEHICLE_STATUS_LABELS, WORKFLOW_ORDER, COST_TYPES, CERFA_TYPES, CERFA_PREFIXES, CERFA_LABELS } from '../utils/constants'
import { OrderForm, Invoice } from '../documents/PDFTemplates'
import { CerfaDocument } from '../documents/CerfaTemplates'
import {
  fetchClients, getNextInvoiceNumber, createInvoice,
  getNextCerfaNumber, createCerfaDocument,
  createReprise, fetchRepriseByVehicle,
  createVehicle as createVehicleInDB
} from '../../lib/supabase'
import { isDemoMode } from '../../lib/supabase/client'
import { useCompanySettings } from '../hooks/useCompanySettings'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

function VehicleCockpit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getVehicle, updateStatus, deleteVehicle, addCost, deleteCost } = useVehicles()
  const { showConfirm, toast } = useUI()
  const { companyInfo } = useCompanySettings()

  const [activeTab, setActiveTab] = useState('info')
  const [showAddCost, setShowAddCost] = useState(false)
  const [newCost, setNewCost] = useState({ type: 'Atelier', amount: '', description: '' })

  // Admin tab state
  const [clients, setClients] = useState([])
  const [clientSearch, setClientSearch] = useState('')
  const [selectedClient, setSelectedClient] = useState(null)
  const [clientsLoaded, setClientsLoaded] = useState(false)
  const [generatingPdf, setGeneratingPdf] = useState(null)
  const [billingType, setBillingType] = useState(null) // 'margin' | 'vat'

  // CERFA + Reprise state
  const [generatingCerfa, setGeneratingCerfa] = useState(null)
  const [reprise, setReprise] = useState(null)
  const [repriseLoaded, setRepriseLoaded] = useState(false)
  const [showTradeInForm, setShowTradeInForm] = useState(false)
  const [tradeinLoading, setTradeinLoading] = useState(false)

  const vehicle = getVehicle(id)

  // Default billing type based on vehicle origin
  useEffect(() => {
    if (vehicle && billingType === null) {
      // EU origin → TVA sur Marge, Non-EU → TVA Apparente
      setBillingType(vehicle.isEuOrigin ? 'margin' : 'vat')
    }
  }, [vehicle, billingType])

  // Load clients when admin tab is activated
  useEffect(() => {
    if (activeTab === 'admin' && !clientsLoaded) {
      loadClients()
    }
  }, [activeTab, clientsLoaded])

  // Load reprise when admin tab is activated
  useEffect(() => {
    if (activeTab === 'admin' && !repriseLoaded && vehicle) {
      loadReprise()
    }
  }, [activeTab, repriseLoaded, vehicle])

  const loadClients = async () => {
    try {
      if (isDemoMode()) {
        try {
          const stored = localStorage.getItem('flowmotor_clients')
          setClients(stored ? JSON.parse(stored) : [])
        } catch {
          setClients([])
        }
      } else {
        const data = await fetchClients()
        setClients(data)
      }
    } catch (err) {
      console.error('Erreur chargement clients:', err)
      try {
        const stored = localStorage.getItem('flowmotor_clients')
        setClients(stored ? JSON.parse(stored) : [])
      } catch {
        setClients([])
      }
    } finally {
      setClientsLoaded(true)
    }
  }

  const loadReprise = async () => {
    try {
      const data = await fetchRepriseByVehicle(id)
      if (data) {
        // Enrich with trade-in vehicle info for display
        const tradeinVehicle = getVehicle(data.tradein_vehicle_id)
        if (tradeinVehicle) {
          data.tradein_brand = tradeinVehicle.brand || tradeinVehicle.make
          data.tradein_model = tradeinVehicle.model
          data.tradein_vin = tradeinVehicle.vin
        }
      }
      setReprise(data)
    } catch (err) {
      console.error('Erreur chargement reprise:', err)
    } finally {
      setRepriseLoaded(true)
    }
  }

  // CERFA PDF generation
  const handleDownloadCerfa = async (cerfaType, direction = 'sale') => {
    if (!selectedClient) {
      toast.error('Veuillez sélectionner un client')
      return
    }
    if (!vehicle.registrationPlate) {
      toast.error("Veuillez renseigner l'immatriculation du véhicule (onglet Info)")
      return
    }

    setGeneratingCerfa(cerfaType)

    try {
      const prefix = CERFA_PREFIXES[cerfaType]
      const { cerfaNumber, prefix: pfx, year, sequence } = await getNextCerfaNumber(prefix)

      await createCerfaDocument({
        cerfa_number: cerfaNumber,
        prefix: pfx,
        year,
        sequence,
        cerfa_type: cerfaType,
        vehicle_id: vehicle.id,
        client_id: selectedClient.id,
        direction,
        sale_price: vehicle.sellingPrice || 0,
        vehicle_snapshot: {
          brand: vehicle.brand || vehicle.make,
          model: vehicle.model,
          trim: vehicle.trim,
          vin: vehicle.vin,
          year: vehicle.year,
          mileage: vehicle.mileage,
          color: vehicle.color,
          registrationPlate: vehicle.registrationPlate
        },
        client_snapshot: {
          firstName: selectedClient.firstName,
          lastName: selectedClient.lastName,
          email: selectedClient.email,
          phone: selectedClient.phone,
          address: selectedClient.address,
          postalCode: selectedClient.postalCode,
          city: selectedClient.city
        },
        company_snapshot: companyInfo,
        reprise_id: reprise?.id || null,
        status: 'finalized'
      })

      const PdfComponent = (
        <CerfaDocument
          type={cerfaType}
          vehicle={vehicle}
          client={selectedClient}
          company={companyInfo}
          cerfaNumber={cerfaNumber}
          direction={direction}
          salePrice={vehicle.sellingPrice || 0}
        />
      )

      const blob = await pdf(PdfComponent).toBlob()

      const vehicleName = `${vehicle.brand || vehicle.make}_${vehicle.model}`.replace(/\s+/g, '_')
      const clientName = `${selectedClient.lastName}`.replace(/\s+/g, '_')
      const fileName = `CERFA_${prefix}_${cerfaNumber}_${vehicleName}_${clientName}.pdf`

      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast.success(`${CERFA_LABELS[cerfaType]} ${cerfaNumber} généré`)
    } catch (err) {
      console.error('Erreur génération CERFA:', err)
      toast.error(`Erreur: ${err.message || 'Impossible de générer le CERFA'}`)
    } finally {
      setGeneratingCerfa(null)
    }
  }

  // Trade-in submit
  const handleTradeInSubmit = async (form) => {
    if (!selectedClient) {
      toast.error('Veuillez sélectionner un client')
      return
    }

    setTradeinLoading(true)

    try {
      const tradeinValue = parseFloat(form.tradeinValue) || 0

      // Create the trade-in vehicle in stock
      let newVehicle
      if (isDemoMode()) {
        const stored = localStorage.getItem('flowmotor_vehicles')
        const vehicles = stored ? JSON.parse(stored) : []
        newVehicle = {
          id: crypto.randomUUID(),
          brand: form.brand,
          model: form.model,
          year: parseInt(form.year) || new Date().getFullYear(),
          mileage: parseInt(form.mileage) || 0,
          vin: form.vin || null,
          color: form.color || null,
          registrationPlate: form.registrationPlate || null,
          purchasePrice: tradeinValue,
          sellingPrice: 0,
          costPrice: tradeinValue,
          currency: 'EUR',
          status: 'STOCK',
          notes: form.notes ? `Reprise: ${form.notes}` : 'Véhicule de reprise',
          images: [],
          costs: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        vehicles.push(newVehicle)
        localStorage.setItem('flowmotor_vehicles', JSON.stringify(vehicles))
      } else {
        newVehicle = await createVehicleInDB({
          brand: form.brand,
          model: form.model,
          year: parseInt(form.year) || new Date().getFullYear(),
          mileage: parseInt(form.mileage) || 0,
          vin: form.vin || null,
          color: form.color || null,
          registrationPlate: form.registrationPlate || null,
          purchasePrice: tradeinValue,
          costPrice: tradeinValue,
          status: 'STOCK',
          notes: form.notes ? `Reprise: ${form.notes}` : 'Véhicule de reprise'
        })
      }

      // Create the reprise record
      const repriseData = await createReprise({
        sale_vehicle_id: vehicle.id,
        tradein_vehicle_id: newVehicle.id,
        client_id: selectedClient.id,
        tradein_value: tradeinValue,
        notes: form.notes || null
      })

      // Enrich reprise with display info
      repriseData.tradein_brand = form.brand
      repriseData.tradein_model = form.model
      repriseData.tradein_vin = form.vin

      setReprise(repriseData)
      setShowTradeInForm(false)
      toast.success(`Reprise créée — ${form.brand} ${form.model} ajouté en stock`)
    } catch (err) {
      console.error('Erreur création reprise:', err)
      toast.error(`Erreur: ${err.message || 'Impossible de créer la reprise'}`)
    } finally {
      setTradeinLoading(false)
    }
  }

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

  // PDF generation with persistent invoice number
  const handleDownloadPdf = async (type) => {
    if (!selectedClient) {
      toast.error('Veuillez sélectionner un client')
      return
    }

    setGeneratingPdf(type)

    try {
      // Determine prefix: BC for order, FM for margin invoice, FV for VAT invoice
      const docPrefix = type === 'order' ? 'BC' : billingType === 'margin' ? 'FM' : 'FV'

      // Get next sequential invoice number
      const { invoiceNumber, prefix: pfx, year, sequence } = await getNextInvoiceNumber(docPrefix)

      // Calculate total
      const frais = 350
      const prix = vehicle.sellingPrice || 0
      let totalAmount = prix + frais
      if (type === 'invoice' && billingType === 'vat') {
        const prixHT = Math.round((prix / 1.2) * 100) / 100
        const tvaVehicule = prix - prixHT
        totalAmount = prixHT + frais + tvaVehicule
      }

      // Create invoice record BEFORE PDF generation
      await createInvoice({
        invoice_number: invoiceNumber,
        prefix: pfx,
        year,
        sequence,
        vehicle_id: vehicle.id,
        client_id: selectedClient.id,
        billing_type: type === 'order' ? null : billingType,
        total_amount: totalAmount,
        vehicle_snapshot: {
          brand: vehicle.brand || vehicle.make,
          model: vehicle.model,
          trim: vehicle.trim,
          vin: vehicle.vin,
          year: vehicle.year,
          mileage: vehicle.mileage,
          color: vehicle.color,
          sellingPrice: vehicle.sellingPrice
        },
        client_snapshot: {
          firstName: selectedClient.firstName,
          lastName: selectedClient.lastName,
          email: selectedClient.email,
          phone: selectedClient.phone,
          address: selectedClient.address,
          postalCode: selectedClient.postalCode,
          city: selectedClient.city
        },
        status: 'finalized'
      })

      // Build reprise info for invoice if exists
      const repriseInfo = reprise ? {
        tradein_value: reprise.tradein_value,
        tradein_brand: reprise.tradein_brand || '',
        tradein_model: reprise.tradein_model || ''
      } : null

      // Render PDF with the persistent invoice number
      let PdfComponent
      if (type === 'order') {
        PdfComponent = <OrderForm vehicle={vehicle} client={selectedClient} invoiceNumber={invoiceNumber} company={companyInfo} />
      } else {
        PdfComponent = <Invoice vehicle={vehicle} client={selectedClient} billingType={billingType} invoiceNumber={invoiceNumber} company={companyInfo} reprise={repriseInfo} />
      }

      const blob = await pdf(PdfComponent).toBlob()

      const vehicleName = `${vehicle.brand || vehicle.make}_${vehicle.model}`.replace(/\s+/g, '_')
      const clientName = `${selectedClient.lastName}`.replace(/\s+/g, '_')
      const suffix = type === 'invoice' && billingType === 'margin' ? '_Marge' : type === 'invoice' ? '_TVA' : ''
      const filePrefix = type === 'order' ? 'BC' : 'Facture'
      const fileName = `${filePrefix}${suffix}_${invoiceNumber}_${vehicleName}_${clientName}.pdf`

      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast.success(`${type === 'order' ? 'Bon de commande' : 'Facture'} ${invoiceNumber} généré`)
    } catch (err) {
      console.error('Erreur génération PDF:', err)
      toast.error(`Erreur: ${err.message || 'Impossible de générer le PDF'}`)
    } finally {
      setGeneratingPdf(null)
    }
  }

  // Filtered clients for search
  const filteredClients = clients.filter((c) => {
    if (!clientSearch) return true
    const q = clientSearch.toLowerCase()
    return (
      c.firstName?.toLowerCase().includes(q) ||
      c.lastName?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.phone?.includes(q)
    )
  })

  const tabs = [
    { id: 'info', label: 'Informations', icon: Info },
    { id: 'galerie', label: 'Galerie', icon: ImageIcon },
    { id: 'finance', label: 'Finance', icon: DollarSign },
    { id: 'admin', label: 'Administratif', icon: ClipboardList },
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

        {/* Workflow */}
        <AdminCard>
          <h3 className="text-sm font-medium text-white mb-4">Workflow</h3>
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {WORKFLOW_ORDER.map((status, index) => {
              const isCurrent = vehicle.status === status
              const currentIndex = WORKFLOW_ORDER.indexOf(vehicle.status)
              const isPast = index < currentIndex
              const canActivate = index <= currentIndex + 1

              return (
                <button
                  key={status}
                  onClick={() => canActivate && handleStatusChange(status)}
                  disabled={!canActivate}
                  className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
                    isCurrent
                      ? 'bg-accent text-white'
                      : isPast
                      ? 'bg-green-500/20 text-green-400'
                      : canActivate
                      ? 'bg-white/5 text-white/60 hover:bg-white/10'
                      : 'bg-white/5 text-white/20 cursor-not-allowed'
                  }`}
                >
                  {isPast && <Check size={14} />}
                  {VEHICLE_STATUS_LABELS[status]}
                </button>
              )
            })}
          </div>
        </AdminCard>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-white/10 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm transition-colors border-b-2 -mb-[2px] whitespace-nowrap ${
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
          {/* === INFO TAB === */}
          {activeTab === 'info' && (
            <div className="grid md:grid-cols-2 gap-6">
              <AdminCard>
                <h3 className="text-sm font-medium text-white mb-4">Véhicule</h3>
                <div className="space-y-3 text-sm">
                  <InfoRow label="Marque" value={vehicle.brand || vehicle.make} />
                  <InfoRow label="Modèle" value={vehicle.model} />
                  <InfoRow label="Finition" value={vehicle.trim} />
                  <InfoRow label="Année" value={vehicle.year} />
                  <InfoRow label="Kilométrage" value={formatMileage(vehicle.mileage)} />
                  <InfoRow label="Couleur" value={vehicle.color} />
                  <div className="flex justify-between">
                    <span className="text-white/50">VIN</span>
                    <span className="text-white font-mono text-xs">{vehicle.vin || '-'}</span>
                  </div>
                  <InfoRow label="Immatriculation" value={vehicle.registrationPlate} />
                </div>
              </AdminCard>

              <AdminCard>
                <h3 className="text-sm font-medium text-white mb-4">Sourcing</h3>
                <div className="space-y-3 text-sm">
                  <InfoRow label="Origine" value={vehicle.originCountry} />
                  <InfoRow label="Vendeur" value={vehicle.sellerName} />
                  <InfoRow label="Prix achat" value={formatPrice(vehicle.purchasePrice, vehicle.currency)} />
                  <InfoRow label="Transport" value={formatPrice(vehicle.transportCost)} />
                  <InfoRow label="Douane" value={formatPrice(vehicle.customsFee)} />
                  <InfoRow label="TVA" value={formatPrice(vehicle.vatAmount)} />
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

          {/* === GALERIE TAB === */}
          {activeTab === 'galerie' && (
            <AdminCard>
              <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
                <ImageIcon size={16} className="text-[#C4A484]" />
                Galerie photos
                {vehicle.images?.length > 0 && (
                  <span className="text-xs text-white/40 ml-1">({vehicle.images.length})</span>
                )}
              </h3>
              <ImageUploader vehicleId={vehicle.id} images={vehicle.images || []} />
            </AdminCard>
          )}

          {/* === FINANCE TAB === */}
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

          {/* === ADMINISTRATIF TAB === */}
          {activeTab === 'admin' && (
            <div className="space-y-6">
              {/* Client Selection */}
              <AdminCard>
                <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
                  <Users size={16} className="text-[#C4A484]" />
                  Sélectionner un client
                </h3>

                {/* Search */}
                <div className="relative mb-4">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                  <Input
                    type="text"
                    placeholder="Rechercher par nom, email, téléphone..."
                    value={clientSearch}
                    onChange={(e) => setClientSearch(e.target.value)}
                    className="pl-10 bg-[#1a1212] border-white/10 text-white placeholder:text-white/30"
                  />
                </div>

                {/* Client list */}
                <div className="max-h-48 overflow-y-auto space-y-1 rounded-lg border border-white/5">
                  {filteredClients.length > 0 ? (
                    filteredClients.map((client) => (
                      <button
                        key={client.id}
                        onClick={() => setSelectedClient(client)}
                        className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors rounded-md ${
                          selectedClient?.id === client.id
                            ? 'bg-[#5C3A2E]/40 border border-[#5C3A2E]/60'
                            : 'hover:bg-white/5'
                        }`}
                      >
                        <div>
                          <p className="text-sm font-medium text-white">
                            {client.firstName} {client.lastName}
                          </p>
                          <p className="text-xs text-white/40">
                            {client.email || client.phone || client.city || 'Pas de contact'}
                          </p>
                        </div>
                        {selectedClient?.id === client.id && (
                          <Check size={16} className="text-[#C4A484]" />
                        )}
                      </button>
                    ))
                  ) : (
                    <div className="text-center py-6">
                      <Users size={24} className="text-white/20 mx-auto mb-2" />
                      <p className="text-white/40 text-sm">
                        {clients.length === 0
                          ? 'Aucun client enregistré'
                          : 'Aucun résultat'}
                      </p>
                      {clients.length === 0 && (
                        <Link
                          to="/admin/clients"
                          className="text-[#C4A484] text-xs mt-2 inline-block hover:underline"
                        >
                          Créer un client
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              </AdminCard>

              {/* Billing Type Selector */}
              {selectedClient && (
                <AdminCard>
                  <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
                    <Receipt size={16} className="text-[#C4A484]" />
                    Type de Facturation
                  </h3>
                  <p className="text-xs text-white/40 mb-4">
                    Sélectionné automatiquement selon l'origine du véhicule ({vehicle.isEuOrigin ? 'UE' : 'Hors UE'}). Modifiable manuellement.
                  </p>

                  <div className="grid sm:grid-cols-2 gap-3">
                    {/* TVA sur Marge */}
                    <button
                      onClick={() => setBillingType('margin')}
                      className={`p-4 rounded-lg border text-left transition-all ${
                        billingType === 'margin'
                          ? 'bg-[#5C3A2E]/30 border-[#5C3A2E] ring-1 ring-[#5C3A2E]'
                          : 'bg-white/5 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-3 h-3 rounded-full border-2 ${
                          billingType === 'margin' ? 'border-[#C4A484] bg-[#C4A484]' : 'border-white/30'
                        }`} />
                        <span className="text-sm font-medium text-white">TVA sur Marge</span>
                      </div>
                      <p className="text-xs text-white/40 leading-relaxed">
                        Art. 297 A du CGI — TVA non récupérable.{' '}
                        Prix TTC uniquement affiché.
                      </p>
                    </button>

                    {/* TVA Apparente */}
                    <button
                      onClick={() => setBillingType('vat')}
                      className={`p-4 rounded-lg border text-left transition-all ${
                        billingType === 'vat'
                          ? 'bg-[#5C3A2E]/30 border-[#5C3A2E] ring-1 ring-[#5C3A2E]'
                          : 'bg-white/5 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-3 h-3 rounded-full border-2 ${
                          billingType === 'vat' ? 'border-[#C4A484] bg-[#C4A484]' : 'border-white/30'
                        }`} />
                        <span className="text-sm font-medium text-white">TVA Apparente</span>
                      </div>
                      <p className="text-xs text-white/40 leading-relaxed">
                        Affiche HT + TVA 20% + TTC.{' '}
                        TVA récupérable par le client.
                      </p>
                    </button>
                  </div>
                </AdminCard>
              )}

              {/* PDF Generation */}
              {selectedClient && (
                <AdminCard>
                  <h3 className="text-sm font-medium text-white mb-2">
                    Générer les documents
                  </h3>
                  <p className="text-xs text-white/40 mb-6">
                    Client : <span className="text-white/70">{selectedClient.firstName} {selectedClient.lastName}</span>
                    {' '}&bull;{' '}
                    Véhicule : <span className="text-white/70">{vehicle.brand || vehicle.make} {vehicle.model}</span>
                    {' '}&bull;{' '}
                    Facture : <span className="text-white/70">{billingType === 'margin' ? 'TVA Marge' : 'TVA Apparente'}</span>
                  </p>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* Bon de Commande */}
                    <Button
                      onClick={() => handleDownloadPdf('order')}
                      disabled={generatingPdf !== null}
                      className="h-auto py-6 bg-[#5C3A2E] hover:bg-[#5C3A2E]/80 text-white flex flex-col items-center gap-3"
                    >
                      {generatingPdf === 'order' ? (
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Download size={24} />
                      )}
                      <div className="text-center">
                        <p className="font-semibold text-base">Bon de Commande</p>
                        <p className="text-xs text-white/60 mt-1">Télécharger en PDF</p>
                      </div>
                    </Button>

                    {/* Facture Pro-forma */}
                    <Button
                      onClick={() => handleDownloadPdf('invoice')}
                      disabled={generatingPdf !== null}
                      className="h-auto py-6 bg-[#2a1f1f] hover:bg-[#2a1f1f]/80 text-white border border-[#5C3A2E]/50 flex flex-col items-center gap-3"
                    >
                      {generatingPdf === 'invoice' ? (
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Receipt size={24} />
                      )}
                      <div className="text-center">
                        <p className="font-semibold text-base">Facture Pro-forma</p>
                        <p className="text-xs text-white/60 mt-1">Télécharger en PDF</p>
                      </div>
                    </Button>
                  </div>
                </AdminCard>
              )}

              {/* CERFA Documents */}
              {selectedClient && (
                <AdminCard>
                  <h3 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
                    <FileCheck size={16} className="text-[#C4A484]" />
                    Documents Administratifs (CERFA)
                  </h3>
                  {!vehicle.registrationPlate ? (
                    <p className="text-xs text-yellow-400/80 bg-yellow-400/10 border border-yellow-400/20 rounded-md px-3 py-2">
                      Immatriculation requise — Renseignez-la dans l'onglet Info pour générer les CERFA.
                    </p>
                  ) : (
                    <>
                      <p className="text-xs text-white/40 mb-4">
                        Immatriculation : <span className="text-white/70 font-mono">{vehicle.registrationPlate}</span>
                      </p>
                      <div className="grid sm:grid-cols-3 gap-3">
                        {Object.entries(CERFA_TYPES).map(([key, type]) => (
                          <Button
                            key={type}
                            onClick={() => handleDownloadCerfa(type)}
                            disabled={generatingCerfa !== null}
                            className="h-auto py-4 bg-[#2a1f1f] hover:bg-[#2a1f1f]/80 text-white border border-[#5C3A2E]/30 flex flex-col items-center gap-2"
                          >
                            {generatingCerfa === type ? (
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                              <FileCheck size={20} />
                            )}
                            <span className="text-xs text-center leading-tight">{CERFA_LABELS[type]}</span>
                          </Button>
                        ))}
                      </div>
                    </>
                  )}
                </AdminCard>
              )}

              {/* Reprise (Trade-in) */}
              {selectedClient && (
                <AdminCard>
                  <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
                    <ArrowRightLeft size={16} className="text-[#C4A484]" />
                    Reprise véhicule
                  </h3>

                  {!reprise && !showTradeInForm && (
                    <Button
                      onClick={() => setShowTradeInForm(true)}
                      className="bg-white/5 hover:bg-white/10 text-white border border-white/10"
                    >
                      <Plus size={16} className="mr-2" />
                      Ajouter une reprise
                    </Button>
                  )}

                  {showTradeInForm && !reprise && (
                    <TradeInForm
                      onSubmit={handleTradeInSubmit}
                      onCancel={() => setShowTradeInForm(false)}
                      loading={tradeinLoading}
                    />
                  )}

                  {reprise && (
                    <div className="space-y-3">
                      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <RefreshCw size={14} className="text-[#C4A484]" />
                            <span className="text-sm font-medium text-white">
                              {reprise.tradein_brand || 'Véhicule'} {reprise.tradein_model || 'repris'}
                            </span>
                          </div>
                          <span className="text-sm font-semibold text-green-400">
                            {formatPrice(reprise.tradein_value)}
                          </span>
                        </div>
                        {reprise.tradein_vin && (
                          <p className="text-xs text-white/40 font-mono">{reprise.tradein_vin}</p>
                        )}
                        <div className="flex items-center gap-3 mt-3">
                          <Link
                            to={`/admin/vehicle/${reprise.tradein_vehicle_id}`}
                            className="text-xs text-[#C4A484] hover:underline"
                          >
                            Voir le véhicule repris
                          </Link>
                          {vehicle.registrationPlate && (
                            <button
                              onClick={() => handleDownloadCerfa('cession', 'purchase')}
                              disabled={generatingCerfa !== null}
                              className="text-xs text-[#C4A484] hover:underline flex items-center gap-1"
                            >
                              <FileCheck size={12} />
                              CERFA Cession (reprise)
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-white/30">
                        La valeur de reprise sera déduite de la facture.
                      </p>
                    </div>
                  )}
                </AdminCard>
              )}
            </div>
          )}

          {/* === DOCUMENTS TAB === */}
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

          {/* === ATELIER TAB === */}
          {activeTab === 'atelier' && (
            <Workshop vehicleId={vehicle.id} purchasePrice={vehicle.purchasePrice || 0} />
          )}
        </div>
      </div>
    </div>
  )
}

// Helper component
function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between">
      <span className="text-white/50">{label}</span>
      <span className="text-white">{value || '-'}</span>
    </div>
  )
}

export default VehicleCockpit
