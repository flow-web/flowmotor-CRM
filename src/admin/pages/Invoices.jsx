import { useState, useEffect } from 'react'
import { pdf } from '@react-pdf/renderer'
import {
  Receipt, Search, Download, CheckCircle, XCircle, FileText, Filter
} from 'lucide-react'
import TopHeader from '../components/layout/TopHeader'
import AdminCard from '../components/shared/AdminCard'
import { useUI } from '../context/UIContext'
import { useCompanySettings } from '../hooks/useCompanySettings'
import { fetchInvoices, finalizeInvoice, cancelInvoice } from '../../lib/supabase'
import { OrderForm, Invoice } from '../documents/PDFTemplates'
import { formatPrice } from '../utils/formatters'

const STATUS_LABELS = {
  draft: 'Brouillon',
  finalized: 'Finalisée',
  cancelled: 'Annulée'
}

const STATUS_COLORS = {
  draft: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  finalized: 'bg-green-500/20 text-green-400 border-green-500/30',
  cancelled: 'bg-red-500/20 text-red-400 border-red-500/30'
}

const PREFIX_LABELS = {
  BC: 'Bon de Commande',
  FM: 'Facture Marge',
  FV: 'Facture TVA'
}

const PREFIX_COLORS = {
  BC: 'bg-blue-500/20 text-blue-400',
  FM: 'bg-purple-500/20 text-purple-400',
  FV: 'bg-orange-500/20 text-orange-400'
}

function Invoices() {
  const { toast, showConfirm } = useUI()
  const { companyInfo } = useCompanySettings()
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [regenerating, setRegenerating] = useState(null)

  useEffect(() => {
    loadInvoices()
  }, [])

  const loadInvoices = async () => {
    try {
      const data = await fetchInvoices()
      setInvoices(data)
    } catch (err) {
      if (err.name === 'AbortError' || err.message?.includes('aborted')) return
      console.error('Erreur chargement factures:', err)
      toast.error('Erreur chargement factures')
    } finally {
      setLoading(false)
    }
  }

  const handleFinalize = async (invoice) => {
    const confirmed = await showConfirm({
      title: 'Finaliser la facture',
      message: `Finaliser ${invoice.invoice_number} ? Cette action est irréversible.`,
      confirmLabel: 'Finaliser',
      variant: 'default'
    })
    if (!confirmed) return

    try {
      await finalizeInvoice(invoice.id)
      toast.success(`${invoice.invoice_number} finalisée`)
      loadInvoices()
    } catch (err) {
      toast.error('Erreur finalisation')
    }
  }

  const handleCancel = async (invoice) => {
    const confirmed = await showConfirm({
      title: 'Annuler la facture',
      message: `Annuler ${invoice.invoice_number} ? Le numéro sera conservé (pas de suppression).`,
      confirmLabel: 'Annuler la facture',
      variant: 'danger'
    })
    if (!confirmed) return

    try {
      await cancelInvoice(invoice.id)
      toast.success(`${invoice.invoice_number} annulée`)
      loadInvoices()
    } catch (err) {
      toast.error('Erreur annulation')
    }
  }

  const handleRedownload = async (invoice) => {
    if (!invoice.vehicle_snapshot || !invoice.client_snapshot) {
      toast.error('Snapshots manquants — impossible de re-générer')
      return
    }

    setRegenerating(invoice.id)
    try {
      const vehicle = invoice.vehicle_snapshot
      const client = invoice.client_snapshot
      let PdfComponent

      if (invoice.prefix === 'BC') {
        PdfComponent = (
          <OrderForm
            vehicle={vehicle}
            client={client}
            invoiceNumber={invoice.invoice_number}
            company={companyInfo}
          />
        )
      } else {
        PdfComponent = (
          <Invoice
            vehicle={vehicle}
            client={client}
            billingType={invoice.billing_type}
            invoiceNumber={invoice.invoice_number}
            company={companyInfo}
          />
        )
      }

      const blob = await pdf(PdfComponent).toBlob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${invoice.invoice_number}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast.success(`${invoice.invoice_number} re-téléchargé`)
    } catch (err) {
      console.error('Erreur re-téléchargement:', err)
      toast.error('Erreur génération PDF')
    } finally {
      setRegenerating(null)
    }
  }

  // Filters
  const filtered = invoices.filter((inv) => {
    if (filterStatus !== 'all' && inv.status !== filterStatus) return false
    if (filterType !== 'all' && inv.prefix !== filterType) return false
    if (search) {
      const q = search.toLowerCase()
      const clientName = inv.client_snapshot
        ? `${inv.client_snapshot.firstName} ${inv.client_snapshot.lastName}`.toLowerCase()
        : ''
      const vehicleName = inv.vehicle_snapshot
        ? `${inv.vehicle_snapshot.brand} ${inv.vehicle_snapshot.model}`.toLowerCase()
        : ''
      return (
        inv.invoice_number.toLowerCase().includes(q) ||
        clientName.includes(q) ||
        vehicleName.includes(q)
      )
    }
    return true
  })

  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  return (
    <div className="min-h-screen">
      <TopHeader
        title="Factures"
        subtitle={`${invoices.length} document${invoices.length !== 1 ? 's' : ''} enregistré${invoices.length !== 1 ? 's' : ''}`}
      />

      <div className="p-6 space-y-6">
        {/* Filters */}
        <AdminCard>
          <div className="flex flex-wrap gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="text"
                placeholder="Rechercher par numéro, client, véhicule..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-admin w-full pl-10"
              />
            </div>

            {/* Status filter */}
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-white/40" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="select-admin text-sm"
              >
                <option value="all">Tous statuts</option>
                <option value="draft">Brouillon</option>
                <option value="finalized">Finalisée</option>
                <option value="cancelled">Annulée</option>
              </select>
            </div>

            {/* Type filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="select-admin text-sm"
            >
              <option value="all">Tous types</option>
              <option value="BC">Bon de Commande</option>
              <option value="FM">Facture Marge</option>
              <option value="FV">Facture TVA</option>
            </select>
          </div>
        </AdminCard>

        {/* Table */}
        <AdminCard padding={false}>
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-8 h-8 border-2 border-white/20 border-t-[#C4A484] rounded-full animate-spin mx-auto mb-3" />
              <p className="text-white/40 text-sm">Chargement...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center">
              <Receipt size={32} className="text-white/20 mx-auto mb-3" />
              <p className="text-white/40 text-sm">
                {invoices.length === 0
                  ? 'Aucune facture générée'
                  : 'Aucun résultat avec ces filtres'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table-admin w-full">
                <thead>
                  <tr>
                    <th>Numéro</th>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Client</th>
                    <th>Véhicule</th>
                    <th>Montant</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((inv) => (
                    <tr key={inv.id}>
                      <td>
                        <span className="text-white font-mono text-xs">
                          {inv.invoice_number}
                        </span>
                      </td>
                      <td className="text-white/60 text-xs">
                        {formatDate(inv.created_at)}
                      </td>
                      <td>
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium ${PREFIX_COLORS[inv.prefix] || ''}`}>
                          {PREFIX_LABELS[inv.prefix] || inv.prefix}
                        </span>
                      </td>
                      <td className="text-white text-sm">
                        {inv.client_snapshot
                          ? `${inv.client_snapshot.firstName} ${inv.client_snapshot.lastName}`
                          : '-'}
                      </td>
                      <td className="text-white/60 text-sm">
                        {inv.vehicle_snapshot
                          ? `${inv.vehicle_snapshot.brand} ${inv.vehicle_snapshot.model}`
                          : '-'}
                      </td>
                      <td className="text-white font-medium text-sm">
                        {formatPrice(inv.total_amount)}
                      </td>
                      <td>
                        <span className={`inline-block px-2 py-0.5 rounded border text-[10px] font-medium ${STATUS_COLORS[inv.status] || ''}`}>
                          {STATUS_LABELS[inv.status] || inv.status}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-1">
                          {/* Re-download */}
                          <button
                            onClick={() => handleRedownload(inv)}
                            disabled={regenerating === inv.id}
                            className="p-1.5 text-white/40 hover:text-[#C4A484] transition-colors"
                            title="Re-télécharger"
                          >
                            {regenerating === inv.id ? (
                              <div className="w-4 h-4 border-2 border-white/20 border-t-[#C4A484] rounded-full animate-spin" />
                            ) : (
                              <Download size={14} />
                            )}
                          </button>

                          {/* Finalize (only for drafts) */}
                          {inv.status === 'draft' && (
                            <button
                              onClick={() => handleFinalize(inv)}
                              className="p-1.5 text-white/40 hover:text-green-400 transition-colors"
                              title="Finaliser"
                            >
                              <CheckCircle size={14} />
                            </button>
                          )}

                          {/* Cancel (only for non-cancelled) */}
                          {inv.status !== 'cancelled' && (
                            <button
                              onClick={() => handleCancel(inv)}
                              className="p-1.5 text-white/40 hover:text-red-400 transition-colors"
                              title="Annuler"
                            >
                              <XCircle size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </AdminCard>
      </div>
    </div>
  )
}

export default Invoices
