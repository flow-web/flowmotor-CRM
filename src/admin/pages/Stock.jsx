import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table'
import { Plus, Search, Filter, Car, Eye, Trash2, ChevronUp, ChevronDown, ChevronsUpDown, RefreshCw } from 'lucide-react'
import TopHeader from '../components/layout/TopHeader'
import StatusBadge from '../components/shared/StatusBadge'
import MarginBar from '../components/shared/MarginBar'
import EmptyState from '../components/shared/EmptyState'
import { useVehicles } from '../context/VehiclesContext'
import { useUI } from '../context/UIContext'
import { formatPrice, formatMileage, formatVehicleName, formatRelativeDate } from '../utils/formatters'
import { calculatePRU, calculateMarginPercent } from '../utils/calculations'
import { VEHICLE_STATUS_LABELS } from '../utils/constants'

// Status dot colors for inline indicator
const STATUS_DOT_COLORS = {
  SOURCING: '#EAB308',  // yellow
  STOCK: '#22C55E',     // green
  SOLD: '#D4AF37'       // gold
}

// Days in stock color helper
function getDaysColor(days) {
  if (days <= 30) return 'text-emerald-400'
  if (days <= 60) return 'text-yellow-400'
  return 'text-red-400'
}

function getDaysInStock(createdAt) {
  if (!createdAt) return 0
  const created = new Date(createdAt)
  const now = new Date()
  return Math.floor((now - created) / (1000 * 60 * 60 * 24))
}

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

function Stock() {
  const { vehicles, deleteVehicle, isLoading, refresh, isSupabaseMode } = useVehicles()
  const { showConfirm, toast } = useUI()

  const [sorting, setSorting] = useState([{ id: 'daysInStock', desc: true }])
  const [globalFilter, setGlobalFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Refresh silencieux au montage
  useEffect(() => {
    refresh()
  }, [])

  // Filtered data
  const filteredData = useMemo(() => {
    return (vehicles || []).filter(vehicle => {
      if (statusFilter && statusFilter !== 'all' && vehicle.status !== statusFilter) {
        return false
      }
      return true
    })
  }, [vehicles, statusFilter])

  // Unique statuses
  const uniqueStatuses = useMemo(() => {
    return [...new Set((vehicles || []).map(v => v.status))]
  }, [vehicles])

  // Handle delete
  const handleDelete = async (vehicle) => {
    const confirmed = await showConfirm({
      title: 'Supprimer le vehicule',
      message: `Etes-vous sur de vouloir supprimer ${formatVehicleName(vehicle)} ? Cette action est irreversible.`,
      confirmLabel: 'Supprimer',
      variant: 'danger'
    })

    if (confirmed) {
      try {
        await deleteVehicle(vehicle.id)
        toast.success('Vehicule supprime avec succes')
      } catch (err) {
        toast.error('Erreur lors de la suppression')
      }
    }
  }

  // Table columns definition
  const columns = useMemo(() => [
    {
      accessorKey: 'image',
      header: '',
      size: 60,
      enableSorting: false,
      cell: ({ row }) => {
        const vehicle = row.original
        const primaryImage = vehicle.images?.[0]
        return (
          <div className="w-12 h-9 rounded-lg overflow-hidden bg-white/[0.04] flex-shrink-0 border border-white/[0.06]">
            {primaryImage?.url ? (
              <img
                src={primaryImage.url}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Car size={14} className="text-white/15" />
              </div>
            )}
          </div>
        )
      }
    },
    {
      accessorKey: 'model',
      header: ({ column }) => (
        <SortableHeader column={column}>Modele</SortableHeader>
      ),
      accessorFn: (row) => `${row.make} ${row.model}`,
      cell: ({ row }) => {
        const vehicle = row.original
        const dotColor = STATUS_DOT_COLORS[vehicle.status] || '#95A5A6'
        return (
          <Link to={`/admin/vehicle/${vehicle.id}`} className="group flex items-center gap-2.5">
            <div
              className="w-2 h-2 rounded-full flex-shrink-0 shadow-sm"
              style={{
                backgroundColor: dotColor,
                boxShadow: `0 0 6px ${dotColor}40`
              }}
              title={VEHICLE_STATUS_LABELS[vehicle.status] || vehicle.status}
            />
            <div>
              <p className="font-semibold text-white group-hover:text-[#D4AF37] transition-colors duration-200">
                {vehicle.make} {vehicle.model}
              </p>
              <p className="text-[10px] text-white/30 font-mono tabular-nums">
                {vehicle.year} &middot; {vehicle.color || 'N/A'}
              </p>
            </div>
          </Link>
        )
      }
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <SortableHeader column={column}>Statut</SortableHeader>
      ),
      cell: ({ row }) => (
        <StatusBadge status={row.original.status} size="small" />
      )
    },
    {
      accessorKey: 'mileage',
      header: ({ column }) => (
        <SortableHeader column={column}>Km</SortableHeader>
      ),
      cell: ({ row }) => (
        <span className="text-white/50 text-sm font-mono tabular-nums">
          {formatMileage(row.original.mileage)}
        </span>
      )
    },
    {
      accessorKey: 'purchasePrice',
      header: ({ column }) => (
        <SortableHeader column={column}>Prix Achat</SortableHeader>
      ),
      cell: ({ row }) => {
        const pru = calculatePRU(row.original)
        return (
          <div className="text-sm">
            <p className="text-white/60 font-mono tabular-nums">{formatPrice(row.original.purchasePrice)}</p>
            <p className="text-[10px] text-white/25 font-mono tabular-nums">PRU: {formatPrice(pru)}</p>
          </div>
        )
      }
    },
    {
      accessorKey: 'sellingPrice',
      header: ({ column }) => (
        <SortableHeader column={column}>Prix Vente</SortableHeader>
      ),
      cell: ({ row }) => (
        <span className="font-semibold text-[#D4AF37] font-mono tabular-nums">
          {formatPrice(row.original.sellingPrice)}
        </span>
      )
    },
    {
      accessorKey: 'margin',
      header: ({ column }) => (
        <SortableHeader column={column}>Marge</SortableHeader>
      ),
      size: 160,
      accessorFn: (row) => {
        const pru = calculatePRU(row)
        return calculateMarginPercent(pru, row.sellingPrice)
      },
      cell: ({ row }) => {
        const pru = calculatePRU(row.original)
        const margin = calculateMarginPercent(pru, row.original.sellingPrice)
        const marginValue = row.original.sellingPrice - pru
        return <MarginBar percent={margin} value={marginValue} />
      }
    },
    {
      id: 'daysInStock',
      header: ({ column }) => (
        <SortableHeader column={column}>Jours</SortableHeader>
      ),
      accessorFn: (row) => getDaysInStock(row.createdAt),
      cell: ({ row }) => {
        const days = getDaysInStock(row.original.createdAt)
        return (
          <span className={`text-sm font-mono font-semibold tabular-nums ${getDaysColor(days)}`}>
            {days}j
          </span>
        )
      }
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <SortableHeader column={column}>Ajoute</SortableHeader>
      ),
      cell: ({ row }) => (
        <span className="text-[11px] text-white/30 font-mono tabular-nums">
          {formatRelativeDate(row.original.createdAt)}
        </span>
      )
    },
    {
      id: 'actions',
      header: '',
      size: 80,
      enableSorting: false,
      cell: ({ row }) => {
        const vehicle = row.original
        return (
          <div className="flex items-center gap-1">
            <Link
              to={`/admin/vehicle/${vehicle.id}`}
              className="p-2 text-white/20 hover:text-[#D4AF37] transition-colors duration-200"
              title="Voir"
            >
              <Eye size={15} />
            </Link>
            <button
              onClick={() => handleDelete(vehicle)}
              className="p-2 text-white/20 hover:text-red-400 transition-colors duration-200"
              title="Supprimer"
            >
              <Trash2 size={15} />
            </button>
          </div>
        )
      }
    }
  ], [handleDelete])

  // TanStack Table instance
  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 20,
      }
    }
  })

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #0F0808 0%, #1A0F0F 40%)' }}>
        <TopHeader
          title="Stock"
          subtitle="Chargement..."
        />
        <div className="p-6 space-y-4 max-w-[1600px] mx-auto">
          <div className="flex items-center justify-between gap-4">
            <div className="h-10 w-64 skeleton-gold" />
            <div className="h-10 w-40 skeleton-gold" />
          </div>
          <div className="rounded-xl border border-white/[0.06] overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <div className="p-4 space-y-3">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-12 w-full skeleton-gold" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #0F0808 0%, #1A0F0F 40%)' }}>
      <TopHeader
        title="Stock"
        subtitle={`${filteredData.length} vehicule${filteredData.length > 1 ? 's' : ''}`}
      />

      <div className="p-6 space-y-4 max-w-[1600px] mx-auto" style={{ animation: 'admin-fade-up 0.4s ease-out' }}>
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
              <Input
                type="text"
                placeholder="Rechercher..."
                value={globalFilter ?? ''}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="pl-10 w-64 bg-white/[0.04] border-white/[0.08] text-white placeholder-white/20 focus:border-[#D4AF37]/30 focus:ring-[#D4AF37]/10 rounded-xl"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] bg-white/[0.04] border-white/[0.08] text-white/60 rounded-xl">
                <Filter size={14} className="mr-2 text-white/20" />
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent className="bg-[#1A0F0F] border-white/10">
                <SelectItem value="all" className="text-white/80 focus:bg-[#D4AF37]/10 focus:text-[#D4AF37]">Tous les statuts</SelectItem>
                {uniqueStatuses.map(status => (
                  <SelectItem key={status} value={status} className="text-white/80 focus:bg-[#D4AF37]/10 focus:text-[#D4AF37]">
                    {VEHICLE_STATUS_LABELS[status] || status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Refresh */}
            <Button
              variant="outline"
              size="icon"
              onClick={refresh}
              className="bg-white/[0.04] border-white/[0.08] text-white/40 hover:text-[#D4AF37] hover:border-[#D4AF37]/20 rounded-xl"
              title="Rafraichir"
            >
              <RefreshCw size={15} />
            </Button>
          </div>

          {/* Add Button */}
          <Link to="/admin/sourcing">
            <Button className="btn-admin rounded-xl">
              <Plus size={15} className="mr-2" />
              Nouveau vehicule
            </Button>
          </Link>
        </div>

        {/* Connection indicator */}
        {isSupabaseMode && (
          <Badge variant="outline" className="text-emerald-400/80 border-emerald-400/30 text-[10px] uppercase tracking-wider font-medium">
            Supabase connecte
          </Badge>
        )}

        {/* Data Table */}
        <div className="rounded-xl border border-white/[0.06] overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)' }}>
          <Table>
            <TableHeader className="table-gold-header">
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id} className="border-none hover:bg-transparent">
                  {headerGroup.headers.map(header => (
                    <TableHead
                      key={header.id}
                      style={{
                        width: header.getSize(),
                        background: 'linear-gradient(135deg, rgba(212,175,55,0.85), rgba(184,150,12,0.75))',
                        color: '#1A0F0F',
                        fontSize: '0.6875rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        fontWeight: 600,
                        fontFamily: '"Plus Jakarta Sans", sans-serif',
                      }}
                      className="py-3 px-4"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row, index) => (
                  <TableRow
                    key={row.id}
                    className="border-white/[0.04] hover:bg-[#D4AF37]/[0.03] transition-colors duration-200"
                    style={{ animation: `admin-fade-up ${0.15 + Math.min(index, 10) * 0.03}s ease-out` }}
                  >
                    {row.getVisibleCells().map(cell => (
                      <TableCell key={cell.id} className="py-3 px-4">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="p-0">
                    <EmptyState
                      icon={Car}
                      title="Aucun vehicule trouve"
                      subtitle={
                        (globalFilter || statusFilter !== 'all')
                          ? 'Essayez de modifier vos filtres de recherche.'
                          : 'Ajoutez votre premier vehicule pour commencer.'
                      }
                      primaryAction={
                        (globalFilter || statusFilter !== 'all')
                          ? { label: 'Reinitialiser les filtres', onClick: () => { setGlobalFilter(''); setStatusFilter('all') } }
                          : { label: 'Nouveau vehicule', to: '/admin/sourcing' }
                      }
                    />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {table.getPageCount() > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-white/[0.06]" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <div className="text-[11px] text-white/30 font-mono tabular-nums">
                Page {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="bg-white/[0.04] border-white/[0.08] text-white/50 hover:text-[#D4AF37] hover:border-[#D4AF37]/20 text-xs rounded-lg disabled:opacity-30"
                >
                  Precedent
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="bg-white/[0.04] border-white/[0.08] text-white/50 hover:text-[#D4AF37] hover:border-[#D4AF37]/20 text-xs rounded-lg disabled:opacity-30"
                >
                  Suivant
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6" style={{ animation: 'admin-fade-up 0.6s ease-out' }}>
          <StatCard
            label="Total"
            value={(vehicles || []).length}
            suffix="vehicules"
          />
          <StatCard
            label="En Stock"
            value={(vehicles || []).filter(v => v.status === 'STOCK').length}
            suffix="vehicules"
            highlight
          />
          <StatCard
            label="Valeur Stock"
            value={formatPrice((vehicles || []).filter(v => v.status !== 'SOLD').reduce((sum, v) => sum + (v.sellingPrice || 0), 0))}
          />
          <StatCard
            label="Marge Moyenne"
            value={`${((vehicles || []).reduce((sum, v) => {
              const pru = calculatePRU(v)
              return sum + calculateMarginPercent(pru, v.sellingPrice)
            }, 0) / ((vehicles || []).length || 1)).toFixed(1)}%`}
          />
        </div>
      </div>
    </div>
  )
}

// Sortable Header Component
function SortableHeader({ column, children }) {
  const sorted = column.getIsSorted()

  return (
    <button
      className="flex items-center gap-1.5 hover:opacity-80 transition-opacity text-[#1A0F0F]"
      onClick={() => column.toggleSorting(sorted === 'asc')}
    >
      {children}
      {sorted === 'asc' ? (
        <ChevronUp size={13} />
      ) : sorted === 'desc' ? (
        <ChevronDown size={13} />
      ) : (
        <ChevronsUpDown size={13} className="opacity-40" />
      )}
    </button>
  )
}

// Stat Card Component
function StatCard({ label, value, suffix, highlight }) {
  return (
    <div className="card-admin-kpi p-5">
      <p className="text-[10px] text-white/25 uppercase tracking-[0.15em] font-medium mb-1.5">{label}</p>
      <p className={`text-xl font-mono font-bold tabular-nums ${highlight ? 'text-[#D4AF37]' : 'text-white'}`}>
        {value}
      </p>
      {suffix && <p className="text-[10px] text-white/20 mt-0.5 uppercase tracking-wider">{suffix}</p>}
    </div>
  )
}

export default Stock
