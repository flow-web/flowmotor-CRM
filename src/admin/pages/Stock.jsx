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
  SOLD: '#C4A484'       // brand accent
}

// Days in stock color helper
function getDaysColor(days) {
  if (days <= 30) return 'text-green-400'
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
import { Skeleton } from '@/components/ui/skeleton'

function Stock() {
  const { vehicles, deleteVehicle, isLoading, refresh, isSupabaseMode } = useVehicles()
  const { showConfirm, toast } = useUI()

  const [sorting, setSorting] = useState([{ id: 'daysInStock', desc: true }])
  const [globalFilter, setGlobalFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Refresh silencieux au montage — données fraîches sans F5
  useEffect(() => {
    refresh()
  }, [])

  // Filtered data (safe si vehicles est vide ou null)
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
      title: 'Supprimer le véhicule',
      message: `Êtes-vous sûr de vouloir supprimer ${formatVehicleName(vehicle)} ? Cette action est irréversible.`,
      confirmLabel: 'Supprimer',
      variant: 'danger'
    })

    if (confirmed) {
      try {
        await deleteVehicle(vehicle.id)
        toast.success('Véhicule supprimé avec succès')
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
          <div className="w-12 h-9 rounded-lg overflow-hidden bg-secondary/50 flex-shrink-0">
            {primaryImage?.url ? (
              <img
                src={primaryImage.url}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Car size={16} className="text-muted-foreground" />
              </div>
            )}
          </div>
        )
      }
    },
    {
      accessorKey: 'model',
      header: ({ column }) => (
        <SortableHeader column={column}>Modèle</SortableHeader>
      ),
      accessorFn: (row) => `${row.make} ${row.model}`,
      cell: ({ row }) => {
        const vehicle = row.original
        const dotColor = STATUS_DOT_COLORS[vehicle.status] || '#95A5A6'
        return (
          <Link to={`/admin/vehicle/${vehicle.id}`} className="group flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: dotColor }}
              title={VEHICLE_STATUS_LABELS[vehicle.status] || vehicle.status}
            />
            <div>
              <p className="font-semibold text-primary group-hover:text-accent transition-colors">
                {vehicle.make} {vehicle.model}
              </p>
              <p className="text-xs text-muted-foreground">
                {vehicle.year} • {vehicle.color || 'N/A'}
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
        <span className="text-muted-foreground text-sm">
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
            <p className="text-muted-foreground">{formatPrice(row.original.purchasePrice)}</p>
            <p className="text-xs text-muted-foreground/60">PRU: {formatPrice(pru)}</p>
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
        <span className="font-semibold text-accent">
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
          <span className={`text-sm font-medium ${getDaysColor(days)}`}>
            {days}j
          </span>
        )
      }
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <SortableHeader column={column}>Ajouté</SortableHeader>
      ),
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground">
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
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              title="Voir"
            >
              <Eye size={16} />
            </Link>
            <button
              onClick={() => handleDelete(vehicle)}
              className="p-2 text-muted-foreground hover:text-destructive transition-colors"
              title="Supprimer"
            >
              <Trash2 size={16} />
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
      <div className="min-h-screen bg-[#1a1212]">
        <TopHeader
          title="Stock"
          subtitle="Chargement..."
        />
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-10 w-40" />
          </div>
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="p-4 space-y-3">
              {[...Array(10)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#1a1212]">
      <TopHeader
        title="Stock"
        subtitle={`${filteredData.length} véhicule${filteredData.length > 1 ? 's' : ''}`}
      />

      <div className="p-6 space-y-4">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Rechercher..."
                value={globalFilter ?? ''}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="pl-10 w-64 bg-secondary/50 border-border"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] bg-secondary/50 border-border">
                <Filter size={16} className="mr-2 text-muted-foreground" />
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                {uniqueStatuses.map(status => (
                  <SelectItem key={status} value={status}>
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
              className="bg-secondary/50 border-border"
              title="Rafraîchir"
            >
              <RefreshCw size={16} />
            </Button>
          </div>

          {/* Add Button */}
          <Link to="/admin/sourcing">
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Plus size={16} className="mr-2" />
              Nouveau véhicule
            </Button>
          </Link>
        </div>

        {/* Connection indicator */}
        {isSupabaseMode && (
          <Badge variant="outline" className="text-green-400 border-green-400/50">
            Connecté à Supabase
          </Badge>
        )}

        {/* Data Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-lg">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id} className="border-border hover:bg-transparent">
                  {headerGroup.headers.map(header => (
                    <TableHead
                      key={header.id}
                      className="text-xs uppercase tracking-wider text-muted-foreground font-medium bg-secondary/30"
                      style={{ width: header.getSize() }}
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
                table.getRowModel().rows.map(row => (
                  <TableRow
                    key={row.id}
                    className="border-border hover:bg-secondary/20 transition-colors"
                  >
                    {row.getVisibleCells().map(cell => (
                      <TableCell key={cell.id} className="py-3">
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
                      title="Aucun véhicule trouvé"
                      subtitle={
                        (globalFilter || statusFilter !== 'all')
                          ? 'Essayez de modifier vos filtres de recherche.'
                          : 'Ajoutez votre premier véhicule pour commencer.'
                      }
                      primaryAction={
                        (globalFilter || statusFilter !== 'all')
                          ? { label: 'Réinitialiser les filtres', onClick: () => { setGlobalFilter(''); setStatusFilter('all') } }
                          : { label: 'Nouveau véhicule', to: '/admin/sourcing' }
                      }
                    />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {table.getPageCount() > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-secondary/20">
              <div className="text-sm text-muted-foreground">
                Page {table.getState().pagination.pageIndex + 1} sur {table.getPageCount()}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="bg-secondary/50"
                >
                  Précédent
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="bg-secondary/50"
                >
                  Suivant
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          <StatCard
            label="Total"
            value={(vehicles || []).length}
            suffix="véhicules"
          />
          <StatCard
            label="En Stock"
            value={(vehicles || []).filter(v => v.status === 'STOCK').length}
            suffix="véhicules"
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
      className="flex items-center gap-1 hover:text-foreground transition-colors"
      onClick={() => column.toggleSorting(sorted === 'asc')}
    >
      {children}
      {sorted === 'asc' ? (
        <ChevronUp size={14} />
      ) : sorted === 'desc' ? (
        <ChevronDown size={14} />
      ) : (
        <ChevronsUpDown size={14} className="opacity-30" />
      )}
    </button>
  )
}

// Stat Card Component
function StatCard({ label, value, suffix, highlight }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-xl font-semibold ${highlight ? 'text-accent' : 'text-foreground'}`}>
        {value}
      </p>
      {suffix && <p className="text-xs text-muted-foreground">{suffix}</p>}
    </div>
  )
}

export default Stock
