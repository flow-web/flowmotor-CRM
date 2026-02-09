import { useState, useMemo } from 'react'
import { Book, Download, Search, Calendar, Car, ArrowUpDown } from 'lucide-react'
import TopHeader from '../components/layout/TopHeader'
import { useVehicles } from '../context/VehiclesContext'
import { formatPrice } from '../utils/formatters'

/**
 * Livre de Police — Obligation légale (Art. R321-10 Code de la Route)
 * Registre chronologique des véhicules achetés/vendus par un négociant VO.
 */

const ORIGIN_LABELS = {
  FR: 'France', DE: 'Allemagne', CH: 'Suisse', JP: 'Japon',
  BE: 'Belgique', IT: 'Italie', ES: 'Espagne', NL: 'Pays-Bas',
  GB: 'Royaume-Uni', US: 'États-Unis',
}

function formatDateFR(dateStr) {
  if (!dateStr) return '—'
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  }).format(new Date(dateStr))
}

function PoliceRegister() {
  const { vehicles } = useVehicles()
  const [searchTerm, setSearchTerm] = useState('')
  const [yearFilter, setYearFilter] = useState('')
  const [sortOrder, setSortOrder] = useState('desc')

  // Trier par date de création (registre chronologique)
  const sortedVehicles = useMemo(() => {
    let filtered = [...vehicles]

    if (searchTerm) {
      const s = searchTerm.toLowerCase()
      filtered = filtered.filter(v =>
        [v.brand, v.model, v.vin, v.sellerName, v.seller_name]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(s)
      )
    }

    if (yearFilter) {
      filtered = filtered.filter(v => {
        const created = new Date(v.createdAt || v.created_at)
        return created.getFullYear().toString() === yearFilter
      })
    }

    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt || a.created_at)
      const dateB = new Date(b.createdAt || b.created_at)
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA
    })

    return filtered
  }, [vehicles, searchTerm, yearFilter, sortOrder])

  const availableYears = useMemo(() => {
    const years = new Set()
    vehicles.forEach(v => {
      const d = new Date(v.createdAt || v.created_at)
      if (!isNaN(d)) years.add(d.getFullYear().toString())
    })
    return [...years].sort().reverse()
  }, [vehicles])

  // Export CSV (séparateur ; pour Excel FR)
  const handleExportCSV = () => {
    const headers = [
      'N°', 'Date Entrée', 'Marque', 'Modèle', 'Année',
      'VIN', 'Couleur', 'Kilométrage', 'Origine',
      'Vendeur', 'Prix Achat (EUR)', 'Statut', 'Prix Vente (EUR)', 'Date Sortie'
    ]

    const rows = sortedVehicles.map((v, i) => {
      const entryNum = sortOrder === 'asc' ? i + 1 : sortedVehicles.length - i
      const purchasePrice = v.purchasePrice || v.purchase_price || ''
      const sellingPrice = v.sellingPrice || v.selling_price || ''
      const origin = v.importCountry || v.import_country || ''

      return [
        entryNum,
        formatDateFR(v.createdAt || v.created_at),
        v.brand || '', v.model || '', v.year || '',
        v.vin || '', v.color || '', v.mileage || '',
        ORIGIN_LABELS[origin] || origin,
        v.sellerName || v.seller_name || '',
        purchasePrice, v.status || '', sellingPrice,
        v.status === 'SOLD' ? formatDateFR(v.updatedAt || v.updated_at) : '',
      ].map(val => `"${String(val).replace(/"/g, '""')}"`)
    })

    const csv = [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `livre_police_flowmotor_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-[#1a1212]">
      <TopHeader
        title="Livre de Police"
        subtitle="Registre obligatoire — Art. R321-10 Code de la Route"
      />

      <div className="p-6 space-y-6">
        {/* Info légale */}
        <div className="bg-[#5C3A2E]/20 border border-[#5C3A2E]/30 rounded-xl p-4 flex items-start gap-3">
          <Book size={20} className="text-[#C4A484] flex-shrink-0 mt-0.5" />
          <div className="text-sm text-white/60">
            <p className="text-white/80 font-medium mb-1">Obligation légale pour tout négociant VO</p>
            <p>
              Ce registre recense chronologiquement tous les véhicules achetés et vendus.
              Il doit être présenté aux autorités sur demande. Conservation 6 ans minimum.
            </p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Rechercher (marque, VIN, vendeur...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#2a1f1f] border border-white/10 rounded-lg text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#5C3A2E]"
            />
          </div>

          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-white/30" />
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="bg-[#2a1f1f] border border-white/10 rounded-lg text-white text-sm px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#5C3A2E]"
            >
              <option value="">Toutes les années</option>
              {availableYears.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
            className="flex items-center gap-2 px-3 py-2.5 bg-[#2a1f1f] border border-white/10 rounded-lg text-white/60 hover:text-white text-sm transition-colors"
          >
            <ArrowUpDown size={14} />
            {sortOrder === 'asc' ? 'Plus ancien' : 'Plus récent'}
          </button>

          <button
            onClick={handleExportCSV}
            disabled={sortedVehicles.length === 0}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#5C3A2E] text-white rounded-lg hover:bg-[#5C3A2E]/80 text-sm font-medium disabled:opacity-40 transition-colors"
          >
            <Download size={16} />
            Exporter CSV
          </button>
        </div>

        <p className="text-xs text-white/30">
          {sortedVehicles.length} entrée{sortedVehicles.length > 1 ? 's' : ''} dans le registre
        </p>

        {/* Tableau */}
        {sortedVehicles.length === 0 ? (
          <div className="bg-[#2a1f1f] border border-white/5 rounded-xl p-12 text-center">
            <Car size={48} className="mx-auto text-white/10 mb-4" />
            <p className="text-white/40">Aucune entrée dans le registre.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-white/5">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#3D1E1E] text-white/70 text-xs uppercase tracking-wider">
                  <th className="px-4 py-3 text-left font-medium">N°</th>
                  <th className="px-4 py-3 text-left font-medium">Date Entrée</th>
                  <th className="px-4 py-3 text-left font-medium">Véhicule</th>
                  <th className="px-4 py-3 text-left font-medium">VIN</th>
                  <th className="px-4 py-3 text-left font-medium">Origine</th>
                  <th className="px-4 py-3 text-left font-medium">Vendeur</th>
                  <th className="px-4 py-3 text-right font-medium">Prix Achat</th>
                  <th className="px-4 py-3 text-center font-medium">Statut</th>
                  <th className="px-4 py-3 text-right font-medium">Prix Vente</th>
                  <th className="px-4 py-3 text-left font-medium">Date Sortie</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {sortedVehicles.map((v, i) => {
                  const entryNum = sortOrder === 'asc' ? i + 1 : sortedVehicles.length - i
                  const purchasePrice = v.purchasePrice || v.purchase_price
                  const sellingPrice = v.sellingPrice || v.selling_price
                  const origin = v.importCountry || v.import_country

                  return (
                    <tr key={v.id} className="bg-[#2a1f1f] hover:bg-[#352828] transition-colors">
                      <td className="px-4 py-3 text-[#C4A484] font-mono font-medium">{entryNum}</td>
                      <td className="px-4 py-3 text-white/60">{formatDateFR(v.createdAt || v.created_at)}</td>
                      <td className="px-4 py-3">
                        <span className="text-white font-medium">{v.brand} {v.model}</span>
                        {v.year && <span className="text-white/40 ml-2">{v.year}</span>}
                        {v.color && <span className="text-white/30 ml-2">• {v.color}</span>}
                      </td>
                      <td className="px-4 py-3 font-mono text-white/50 text-xs">{v.vin || '—'}</td>
                      <td className="px-4 py-3 text-white/50">{ORIGIN_LABELS[origin] || origin || '—'}</td>
                      <td className="px-4 py-3 text-white/50">{v.sellerName || v.seller_name || '—'}</td>
                      <td className="px-4 py-3 text-right text-white/60">{purchasePrice ? formatPrice(purchasePrice) : '—'}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-medium ${
                          v.status === 'SOLD' ? 'bg-green-500/20 text-green-400' :
                          v.status === 'STOCK' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {v.status === 'SOLD' ? 'Vendu' : v.status === 'STOCK' ? 'En stock' : 'Sourcing'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-white/60">{v.status === 'SOLD' && sellingPrice ? formatPrice(sellingPrice) : '—'}</td>
                      <td className="px-4 py-3 text-white/50">
                        {v.status === 'SOLD' ? formatDateFR(v.updatedAt || v.updated_at) : '—'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Styles d'impression */}
      <style>{`
        @media print {
          body { background: white !important; color: black !important; }
          nav, button, input, select, [class*="TopHeader"] { display: none !important; }
          .bg-\\[\\#1a1212\\] { background: white !important; }
          table { width: 100%; border-collapse: collapse; font-size: 9pt; }
          th, td { border: 1px solid #ccc; padding: 4px 6px; color: black !important; }
          thead tr { background: #eee !important; }
          .rounded-xl { border-radius: 0 !important; }
        }
      `}</style>
    </div>
  )
}

export default PoliceRegister
