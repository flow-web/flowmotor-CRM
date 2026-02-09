import { Link } from 'react-router-dom'
import { Car, TrendingUp, Truck, DollarSign, ArrowRight, Plus, Euro, Wallet, Package, Clock } from 'lucide-react'
import TopHeader from '../components/layout/TopHeader'
import AdminCard from '../components/shared/AdminCard'
import StatusBadge from '../components/shared/StatusBadge'
import { useVehicles } from '../context/VehiclesContext'
import { formatPrice, formatRelativeDate, formatVehicleName } from '../utils/formatters'
import { calculatePRU, calculateMarginPercent } from '../utils/calculations'

const MONTH_LABELS = {
  '01': 'Jan', '02': 'Fév', '03': 'Mar', '04': 'Avr',
  '05': 'Mai', '06': 'Jun', '07': 'Jul', '08': 'Aoû',
  '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Déc'
}

/**
 * Dashboard - Vue globale du CRM FLOW MOTOR
 */
function Dashboard() {
  const { vehicles, stats, vehiclesByStatus } = useVehicles()

  // Derniers véhicules ajoutés
  const recentVehicles = [...(vehicles || [])]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)

  // Dernières ventes
  const recentSales = [...(vehiclesByStatus['SOLD'] || [])]
    .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
    .slice(0, 5)

  // KPI — schéma simplifié : SOURCING / STOCK / SOLD
  const sourcingCount = vehiclesByStatus['SOURCING']?.length || 0
  const inStockCount = vehiclesByStatus['STOCK']?.length || 0
  const soldCount = vehiclesByStatus['SOLD']?.length || 0

  // Monthly trend max for bar scaling
  const maxMonthlyRevenue = Math.max(...(stats.monthlySales || []).map(m => m.revenue), 1)

  return (
    <div className="min-h-screen bg-[#1a1212]">
      <TopHeader
        title="Dashboard"
        subtitle="Vue d'ensemble de votre activité"
      />

      <div className="p-6 space-y-6">
        {/* Row 1 — KPI existants */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <AdminCard>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-white/40 uppercase tracking-wider">En stock</p>
                <p className="text-3xl font-semibold text-white mt-1">{inStockCount}</p>
                <p className="text-xs text-white/40 mt-1">disponibles</p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-xl">
                <Car className="text-green-400" size={24} />
              </div>
            </div>
          </AdminCard>

          <AdminCard>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-white/40 uppercase tracking-wider">Sourcing</p>
                <p className="text-3xl font-semibold text-white mt-1">{sourcingCount}</p>
                <p className="text-xs text-white/40 mt-1">en recherche</p>
              </div>
              <div className="p-3 bg-yellow-500/20 rounded-xl">
                <TrendingUp className="text-yellow-400" size={24} />
              </div>
            </div>
          </AdminCard>

          <AdminCard>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-white/40 uppercase tracking-wider">Vendus</p>
                <p className="text-3xl font-semibold text-white mt-1">{soldCount}</p>
                <p className="text-xs text-white/40 mt-1">véhicules</p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <Truck className="text-blue-400" size={24} />
              </div>
            </div>
          </AdminCard>

          <AdminCard>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-white/40 uppercase tracking-wider">Marge moyenne</p>
                <p className="text-3xl font-semibold text-white mt-1">
                  {stats.averageMargin.toFixed(1)}%
                </p>
                <p className="text-xs text-white/40 mt-1">sur le stock</p>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <DollarSign className="text-purple-400" size={24} />
              </div>
            </div>
          </AdminCard>
        </div>

        {/* Row 2 — KPIs financiers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <AdminCard>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-white/40 uppercase tracking-wider">CA total</p>
                <p className="text-2xl font-semibold text-white mt-1">{formatPrice(stats.totalRevenue)}</p>
                <p className="text-xs text-white/40 mt-1">véhicules vendus</p>
              </div>
              <div className="p-3 bg-emerald-500/20 rounded-xl">
                <Euro className="text-emerald-400" size={24} />
              </div>
            </div>
          </AdminCard>

          <AdminCard>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-white/40 uppercase tracking-wider">CA du mois</p>
                <p className="text-2xl font-semibold text-white mt-1">{formatPrice(stats.revenueCurrentMonth)}</p>
                <p className="text-xs text-white/40 mt-1">mois en cours</p>
              </div>
              <div className="p-3 bg-cyan-500/20 rounded-xl">
                <TrendingUp className="text-cyan-400" size={24} />
              </div>
            </div>
          </AdminCard>

          <AdminCard>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-white/40 uppercase tracking-wider">Valeur stock</p>
                <p className="text-2xl font-semibold text-white mt-1">{formatPrice(stats.stockValue)}</p>
                <p className="text-xs text-white/40 mt-1">prix vente stock actuel</p>
              </div>
              <div className="p-3 bg-orange-500/20 rounded-xl">
                <Package className="text-orange-400" size={24} />
              </div>
            </div>
          </AdminCard>

          <AdminCard>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-white/40 uppercase tracking-wider">Profit total</p>
                <p className={`text-2xl font-semibold mt-1 ${stats.totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formatPrice(stats.totalProfit)}
                </p>
                <p className="text-xs text-white/40 mt-1">
                  {stats.avgDaysInStock > 0 ? `~${stats.avgDaysInStock}j en stock moy.` : 'marge cumulée'}
                </p>
              </div>
              <div className="p-3 bg-[#5C3A2E]/30 rounded-xl">
                <Wallet className="text-[#C4A484]" size={24} />
              </div>
            </div>
          </AdminCard>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Monthly Trend */}
            {stats.monthlySales && stats.monthlySales.length > 0 && (
              <AdminCard>
                <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
                  <Clock size={16} className="text-[#C4A484]" />
                  Tendance mensuelle (6 mois)
                </h3>
                <div className="space-y-3">
                  {stats.monthlySales.map((m) => {
                    const monthKey = m.month.split('-')[1]
                    const label = MONTH_LABELS[monthKey] || monthKey
                    const pct = maxMonthlyRevenue > 0 ? (m.revenue / maxMonthlyRevenue) * 100 : 0

                    return (
                      <div key={m.month} className="flex items-center gap-3">
                        <span className="text-xs text-white/50 w-8 text-right">{label}</span>
                        <div className="flex-1 h-6 bg-white/5 rounded overflow-hidden relative">
                          <div
                            className="h-full bg-[#5C3A2E] rounded transition-all"
                            style={{ width: `${Math.max(pct, 2)}%` }}
                          />
                          {m.revenue > 0 && (
                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-white/60">
                              {formatPrice(m.revenue)}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-white/40 w-6 text-center">{m.count}</span>
                      </div>
                    )
                  })}
                  <div className="flex items-center justify-end gap-4 mt-1">
                    <span className="text-[10px] text-white/30">CA</span>
                    <span className="text-[10px] text-white/30">Ventes</span>
                  </div>
                </div>
              </AdminCard>
            )}

            {/* Recent Vehicles */}
            <AdminCard padding={false}>
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <h2 className="font-medium text-white">Derniers véhicules</h2>
                <Link
                  to="/admin/stock"
                  className="text-xs text-accent hover:text-accent/80 flex items-center gap-1"
                >
                  Voir tout
                  <ArrowRight size={14} />
                </Link>
              </div>

              <div className="divide-y divide-white/5">
                {recentVehicles.map((vehicle) => {
                  const pru = calculatePRU(vehicle)
                  const margin = calculateMarginPercent(pru, vehicle.sellingPrice)

                  return (
                    <Link
                      key={vehicle.id}
                      to={`/admin/vehicle/${vehicle.id}`}
                      className="flex items-center gap-4 p-4 hover:bg-white/[0.02] transition-colors"
                    >
                      <div className="w-16 h-12 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                        {vehicle.images?.[0]?.url ? (
                          <img
                            src={vehicle.images[0].url}
                            alt={formatVehicleName(vehicle)}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Car size={20} className="text-white/20" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {vehicle.brand || vehicle.make} {vehicle.model}
                        </p>
                        <p className="text-xs text-white/40">
                          {vehicle.year} • {formatRelativeDate(vehicle.createdAt)}
                        </p>
                      </div>
                      <StatusBadge status={vehicle.status} size="small" />
                      <div className="text-right">
                        <p className="text-sm font-medium text-white">
                          {formatPrice(vehicle.sellingPrice)}
                        </p>
                        <p className={`text-xs ${margin >= 10 ? 'text-green-400' : 'text-yellow-400'}`}>
                          {margin.toFixed(1)}% marge
                        </p>
                      </div>
                    </Link>
                  )
                })}

                {recentVehicles.length === 0 && (
                  <div className="p-8 text-center">
                    <Car size={32} className="text-white/20 mx-auto mb-3" />
                    <p className="text-sm text-white/40">Aucun véhicule</p>
                  </div>
                )}
              </div>
            </AdminCard>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <AdminCard>
              <h3 className="text-sm font-medium text-white mb-4">Actions rapides</h3>
              <div className="space-y-2">
                <Link
                  to="/admin/sourcing"
                  className="flex items-center gap-3 p-3 bg-accent/20 hover:bg-accent/30 rounded-lg transition-colors"
                >
                  <Plus size={18} className="text-accent" />
                  <span className="text-sm text-white">Nouveau véhicule</span>
                </Link>
                <Link
                  to="/admin/stock"
                  className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Car size={18} className="text-white/60" />
                  <span className="text-sm text-white/80">Gérer le stock</span>
                </Link>
              </div>
            </AdminCard>

            {/* Recent Sales */}
            {recentSales.length > 0 && (
              <AdminCard>
                <h3 className="text-sm font-medium text-white mb-4">Ventes récentes</h3>
                <div className="space-y-3">
                  {recentSales.map((v) => {
                    const pru = calculatePRU(v)
                    const profit = (v.sellingPrice || 0) - pru
                    const createdDate = v.createdAt ? new Date(v.createdAt) : null
                    const soldDate = v.updatedAt ? new Date(v.updatedAt) : null
                    const daysInStock = createdDate && soldDate
                      ? Math.round((soldDate - createdDate) / (1000 * 60 * 60 * 24))
                      : null

                    return (
                      <Link
                        key={v.id}
                        to={`/admin/vehicle/${v.id}`}
                        className="block p-3 bg-white/5 rounded-lg hover:bg-white/[0.07] transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-white font-medium truncate">
                            {v.brand || v.make} {v.model}
                          </p>
                          <p className={`text-xs font-medium ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {profit >= 0 ? '+' : ''}{formatPrice(profit)}
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-white/40">{formatPrice(v.sellingPrice)}</p>
                          {daysInStock !== null && daysInStock >= 0 && (
                            <p className="text-xs text-white/30">{daysInStock}j en stock</p>
                          )}
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </AdminCard>
            )}

            {/* Status Breakdown */}
            <AdminCard>
              <h3 className="text-sm font-medium text-white mb-4">Répartition par statut</h3>
              <div className="space-y-3">
                {Object.entries(stats.byStatus).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between">
                    <StatusBadge status={status} size="small" />
                    <span className="text-sm text-white/60">{count}</span>
                  </div>
                ))}
              </div>
            </AdminCard>

            {/* Top Brands */}
            <AdminCard>
              <h3 className="text-sm font-medium text-white mb-4">Top marques</h3>
              <div className="space-y-2">
                {Object.entries(stats.byMake)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 5)
                  .map(([make, count]) => (
                    <div key={make} className="flex items-center justify-between">
                      <span className="text-sm text-white/70">{make}</span>
                      <span className="text-sm text-white/40">{count}</span>
                    </div>
                  ))}
              </div>
            </AdminCard>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
