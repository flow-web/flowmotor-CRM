import { Link } from 'react-router-dom'
import {
  Car, TrendingUp, Truck, ArrowRight, Plus, Euro, Wallet, Package, Clock,
  Percent, CalendarDays, Gauge
} from 'lucide-react'
import TopHeader from '../components/layout/TopHeader'
import AdminCard from '../components/shared/AdminCard'
import StatusBadge from '../components/shared/StatusBadge'
import { useVehicles } from '../context/VehiclesContext'
import { formatPrice, formatRelativeDate, formatVehicleName } from '../utils/formatters'
import { calculatePRU, calculateMarginPercent } from '../utils/calculations'

const MONTH_LABELS = {
  '01': 'Jan', '02': 'Fev', '03': 'Mar', '04': 'Avr',
  '05': 'Mai', '06': 'Jun', '07': 'Jul', '08': 'Aou',
  '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec'
}

/**
 * Dashboard - Command Center
 * Bento grid layout with gold-accented KPI cards and monospace numbers
 */
function Dashboard() {
  const { vehicles, stats, vehiclesByStatus } = useVehicles()

  // Recent vehicles
  const recentVehicles = [...(vehicles || [])]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)

  // Recent sales
  const recentSales = [...(vehiclesByStatus['SOLD'] || [])]
    .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
    .slice(0, 5)

  // KPI counts
  const sourcingCount = vehiclesByStatus['SOURCING']?.length || 0
  const inStockCount = vehiclesByStatus['STOCK']?.length || 0
  const soldCount = vehiclesByStatus['SOLD']?.length || 0

  // Monthly trend
  const maxMonthlyRevenue = Math.max(...(stats.monthlySales || []).map(m => m.revenue), 1)

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #0F0808 0%, #1A0F0F 40%)' }}>
      <TopHeader
        title="Dashboard"
        subtitle="Vue d'ensemble"
      />

      <div className="p-6 space-y-6 max-w-[1600px] mx-auto">

        {/* ─── Row 1: Primary KPI Cards ─── */}
        <div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          style={{ animation: 'admin-fade-up 0.5s ease-out' }}
        >
          {/* In Stock */}
          <AdminCard variant="kpi" className="relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] text-white/30 uppercase tracking-[0.15em] font-medium">En stock</p>
                <p className="text-4xl font-mono font-bold text-white mt-2 tabular-nums tracking-tight">{inStockCount}</p>
                <p className="text-[10px] text-emerald-400/70 mt-1 font-medium uppercase tracking-wider">disponibles</p>
              </div>
              <div className="p-2.5 rounded-xl" style={{ background: 'rgba(52,211,153,0.1)' }}>
                <Car className="text-emerald-400" size={20} />
              </div>
            </div>
            {/* subtle bottom accent */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(52,211,153,0.3), transparent)' }} />
          </AdminCard>

          {/* Sourcing */}
          <AdminCard variant="kpi" className="relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] text-white/30 uppercase tracking-[0.15em] font-medium">Sourcing</p>
                <p className="text-4xl font-mono font-bold text-white mt-2 tabular-nums tracking-tight">{sourcingCount}</p>
                <p className="text-[10px] text-yellow-400/70 mt-1 font-medium uppercase tracking-wider">en recherche</p>
              </div>
              <div className="p-2.5 rounded-xl" style={{ background: 'rgba(250,204,21,0.1)' }}>
                <TrendingUp className="text-yellow-400" size={20} />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(250,204,21,0.3), transparent)' }} />
          </AdminCard>

          {/* Sold */}
          <AdminCard variant="kpi" className="relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] text-white/30 uppercase tracking-[0.15em] font-medium">Vendus</p>
                <p className="text-4xl font-mono font-bold text-white mt-2 tabular-nums tracking-tight">{soldCount}</p>
                <p className="text-[10px] text-[#D4AF37]/70 mt-1 font-medium uppercase tracking-wider">vehicules</p>
              </div>
              <div className="p-2.5 rounded-xl" style={{ background: 'rgba(212,175,55,0.1)' }}>
                <Truck className="text-[#D4AF37]" size={20} />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.3), transparent)' }} />
          </AdminCard>

          {/* Average Margin */}
          <AdminCard variant="kpi" className="relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] text-white/30 uppercase tracking-[0.15em] font-medium">Marge moyenne</p>
                <p className="text-4xl font-mono font-bold text-white mt-2 tabular-nums tracking-tight">
                  {stats.averageMargin.toFixed(1)}<span className="text-lg text-white/40">%</span>
                </p>
                <p className="text-[10px] text-white/30 mt-1 font-medium uppercase tracking-wider">sur le stock</p>
              </div>
              <div className="p-2.5 rounded-xl" style={{ background: 'rgba(168,85,247,0.1)' }}>
                <Percent className="text-purple-400" size={20} />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.3), transparent)' }} />
          </AdminCard>
        </div>

        {/* ─── Row 2: Financial KPIs ─── */}
        <div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          style={{ animation: 'admin-fade-up 0.6s ease-out' }}
        >
          {/* Total Revenue */}
          <AdminCard variant="kpi">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] text-white/30 uppercase tracking-[0.15em] font-medium">CA total</p>
                <p className="text-2xl font-mono font-bold text-white mt-2 tabular-nums tracking-tight">
                  {formatPrice(stats.totalRevenue)}
                </p>
                <p className="text-[10px] text-white/25 mt-1 uppercase tracking-wider">vehicules vendus</p>
              </div>
              <div className="p-2.5 rounded-xl" style={{ background: 'rgba(52,211,153,0.08)' }}>
                <Euro className="text-emerald-400/70" size={18} />
              </div>
            </div>
          </AdminCard>

          {/* Monthly Revenue */}
          <AdminCard variant="kpi">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] text-white/30 uppercase tracking-[0.15em] font-medium">CA du mois</p>
                <p className="text-2xl font-mono font-bold text-white mt-2 tabular-nums tracking-tight">
                  {formatPrice(stats.revenueCurrentMonth)}
                </p>
                <p className="text-[10px] text-white/25 mt-1 uppercase tracking-wider">mois en cours</p>
              </div>
              <div className="p-2.5 rounded-xl" style={{ background: 'rgba(6,182,212,0.08)' }}>
                <CalendarDays className="text-cyan-400/70" size={18} />
              </div>
            </div>
          </AdminCard>

          {/* Stock Value */}
          <AdminCard variant="kpi">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] text-white/30 uppercase tracking-[0.15em] font-medium">Valeur stock</p>
                <p className="text-2xl font-mono font-bold text-white mt-2 tabular-nums tracking-tight">
                  {formatPrice(stats.stockValue)}
                </p>
                <p className="text-[10px] text-white/25 mt-1 uppercase tracking-wider">prix vente stock</p>
              </div>
              <div className="p-2.5 rounded-xl" style={{ background: 'rgba(249,115,22,0.08)' }}>
                <Package className="text-orange-400/70" size={18} />
              </div>
            </div>
          </AdminCard>

          {/* Total Profit */}
          <AdminCard variant="kpi">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] text-white/30 uppercase tracking-[0.15em] font-medium">Profit total</p>
                <p className={`text-2xl font-mono font-bold mt-2 tabular-nums tracking-tight ${stats.totalProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {formatPrice(stats.totalProfit)}
                </p>
                <p className="text-[10px] text-white/25 mt-1 uppercase tracking-wider">
                  {stats.avgDaysInStock > 0 ? `~${stats.avgDaysInStock}j en stock moy.` : 'marge cumulee'}
                </p>
              </div>
              <div className="p-2.5 rounded-xl" style={{ background: 'rgba(212,175,55,0.08)' }}>
                <Wallet className="text-[#D4AF37]/70" size={18} />
              </div>
            </div>
          </AdminCard>
        </div>

        {/* ─── Row 3: Main Content Grid ─── */}
        <div
          className="grid lg:grid-cols-3 gap-6"
          style={{ animation: 'admin-fade-up 0.7s ease-out' }}
        >
          {/* Left Column — spans 2 */}
          <div className="lg:col-span-2 space-y-6">

            {/* Monthly Trend Chart */}
            {stats.monthlySales && stats.monthlySales.length > 0 && (
              <AdminCard>
                <div className="flex items-center gap-2 mb-5">
                  <Clock size={15} className="text-[#D4AF37]/60" />
                  <h3 className="text-sm font-semibold text-white tracking-wide">Tendance mensuelle</h3>
                  <span className="text-[9px] text-white/20 uppercase tracking-wider ml-auto">6 mois</span>
                </div>
                <div className="space-y-3">
                  {stats.monthlySales.map((m) => {
                    const monthKey = m.month.split('-')[1]
                    const label = MONTH_LABELS[monthKey] || monthKey
                    const pct = maxMonthlyRevenue > 0 ? (m.revenue / maxMonthlyRevenue) * 100 : 0

                    return (
                      <div key={m.month} className="flex items-center gap-3">
                        <span className="text-[11px] font-mono text-white/40 w-8 text-right tabular-nums">{label}</span>
                        <div className="flex-1 h-7 bg-white/[0.03] rounded-lg overflow-hidden relative">
                          <div
                            className="h-full rounded-lg transition-all duration-500"
                            style={{
                              width: `${Math.max(pct, 3)}%`,
                              background: 'linear-gradient(90deg, rgba(212,175,55,0.3), rgba(212,175,55,0.15))'
                            }}
                          />
                          {m.revenue > 0 && (
                            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-white/40 tabular-nums">
                              {formatPrice(m.revenue)}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] font-mono text-[#D4AF37]/50 w-6 text-center tabular-nums">{m.count}</span>
                      </div>
                    )
                  })}
                  <div className="flex items-center justify-end gap-6 mt-2 pr-1">
                    <span className="text-[9px] text-white/20 uppercase tracking-wider">CA</span>
                    <span className="text-[9px] text-white/20 uppercase tracking-wider">Ventes</span>
                  </div>
                </div>
              </AdminCard>
            )}

            {/* Recent Vehicles */}
            <AdminCard padding={false}>
              <div className="p-5 border-b border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gauge size={15} className="text-[#D4AF37]/60" />
                  <h2 className="text-sm font-semibold text-white tracking-wide">Derniers vehicules</h2>
                </div>
                <Link
                  to="/admin/stock"
                  className="text-[10px] text-[#D4AF37]/50 hover:text-[#D4AF37] flex items-center gap-1 uppercase tracking-wider font-medium transition-colors duration-200"
                >
                  Voir tout
                  <ArrowRight size={12} />
                </Link>
              </div>

              <div className="divide-y divide-white/[0.04]">
                {recentVehicles.map((vehicle, index) => {
                  const pru = calculatePRU(vehicle)
                  const margin = calculateMarginPercent(pru, vehicle.sellingPrice)

                  return (
                    <Link
                      key={vehicle.id}
                      to={`/admin/vehicle/${vehicle.id}`}
                      className="flex items-center gap-4 px-5 py-3.5 hover:bg-[#D4AF37]/[0.03] transition-all duration-200 group"
                      style={{ animation: `admin-fade-up ${0.3 + index * 0.05}s ease-out` }}
                    >
                      {/* Thumbnail */}
                      <div className="w-14 h-10 rounded-lg overflow-hidden bg-white/[0.04] flex-shrink-0 border border-white/[0.06] group-hover:border-[#D4AF37]/20 transition-colors">
                        {vehicle.images?.[0]?.url ? (
                          <img
                            src={vehicle.images[0].url}
                            alt={formatVehicleName(vehicle)}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Car size={16} className="text-white/15" />
                          </div>
                        )}
                      </div>

                      {/* Name & Date */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate group-hover:text-[#D4AF37] transition-colors duration-200">
                          {vehicle.brand || vehicle.make} {vehicle.model}
                        </p>
                        <p className="text-[10px] text-white/30 mt-0.5 font-mono tabular-nums">
                          {vehicle.year} &middot; {formatRelativeDate(vehicle.createdAt)}
                        </p>
                      </div>

                      {/* Status */}
                      <StatusBadge status={vehicle.status} size="small" />

                      {/* Price & Margin */}
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-mono font-semibold text-white tabular-nums">
                          {formatPrice(vehicle.sellingPrice)}
                        </p>
                        <p className={`text-[10px] font-mono tabular-nums ${margin >= 10 ? 'text-emerald-400/80' : 'text-yellow-400/80'}`}>
                          {margin.toFixed(1)}% marge
                        </p>
                      </div>
                    </Link>
                  )
                })}

                {recentVehicles.length === 0 && (
                  <div className="p-10 text-center">
                    <Car size={28} className="text-white/10 mx-auto mb-3" />
                    <p className="text-[11px] text-white/30 uppercase tracking-wider">Aucun vehicule</p>
                  </div>
                )}
              </div>
            </AdminCard>
          </div>

          {/* Right Column */}
          <div className="space-y-6">

            {/* Quick Actions */}
            <AdminCard>
              <h3 className="text-[10px] text-white/30 uppercase tracking-[0.15em] font-medium mb-4">Actions rapides</h3>
              <div className="space-y-2">
                <Link
                  to="/admin/sourcing"
                  className="flex items-center gap-3 p-3.5 rounded-xl transition-all duration-300 group border border-[#D4AF37]/15 hover:border-[#D4AF37]/30"
                  style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.08), rgba(212,175,55,0.03))' }}
                >
                  <div className="p-2 rounded-lg bg-[#D4AF37]/15">
                    <Plus size={16} className="text-[#D4AF37]" />
                  </div>
                  <div>
                    <span className="text-sm text-white font-semibold group-hover:text-[#D4AF37] transition-colors">Nouveau vehicule</span>
                    <p className="text-[10px] text-white/25">Sourcing & import</p>
                  </div>
                </Link>
                <Link
                  to="/admin/stock"
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/10 hover:bg-white/[0.05] transition-all duration-300 group"
                >
                  <div className="p-2 rounded-lg bg-white/[0.06]">
                    <Car size={16} className="text-white/50" />
                  </div>
                  <div>
                    <span className="text-sm text-white/80 font-medium group-hover:text-white transition-colors">Gerer le stock</span>
                    <p className="text-[10px] text-white/20">Vue tableau complete</p>
                  </div>
                </Link>
              </div>
            </AdminCard>

            {/* Recent Sales */}
            {recentSales.length > 0 && (
              <AdminCard>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shadow-[0_0_6px_rgba(212,175,55,0.4)]" />
                  <h3 className="text-[10px] text-white/30 uppercase tracking-[0.15em] font-medium">Ventes recentes</h3>
                </div>
                <div className="space-y-2">
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
                        className="block p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.04] hover:border-[#D4AF37]/15 hover:bg-[#D4AF37]/[0.03] transition-all duration-200"
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-white font-medium truncate">
                            {v.brand || v.make} {v.model}
                          </p>
                          <p className={`text-xs font-mono font-semibold tabular-nums ${profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {profit >= 0 ? '+' : ''}{formatPrice(profit)}
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-1.5">
                          <p className="text-[10px] font-mono text-white/30 tabular-nums">{formatPrice(v.sellingPrice)}</p>
                          {daysInStock !== null && daysInStock >= 0 && (
                            <p className="text-[10px] text-white/20 font-mono tabular-nums">{daysInStock}j en stock</p>
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
              <h3 className="text-[10px] text-white/30 uppercase tracking-[0.15em] font-medium mb-4">Repartition par statut</h3>
              <div className="space-y-3">
                {Object.entries(stats.byStatus).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between">
                    <StatusBadge status={status} size="small" />
                    <span className="text-sm font-mono text-white/50 tabular-nums">{count}</span>
                  </div>
                ))}
              </div>
            </AdminCard>

            {/* Top Brands */}
            <AdminCard>
              <h3 className="text-[10px] text-white/30 uppercase tracking-[0.15em] font-medium mb-4">Top marques</h3>
              <div className="space-y-2.5">
                {Object.entries(stats.byMake)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 5)
                  .map(([make, count], index) => {
                    const maxCount = Math.max(...Object.values(stats.byMake))
                    const pct = maxCount > 0 ? (count / maxCount) * 100 : 0

                    return (
                      <div key={make}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-white/60 font-medium">{make}</span>
                          <span className="text-[11px] font-mono text-white/30 tabular-nums">{count}</span>
                        </div>
                        <div className="h-1 bg-white/[0.04] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${pct}%`,
                              background: index === 0
                                ? 'linear-gradient(90deg, #D4AF37, rgba(212,175,55,0.4))'
                                : 'linear-gradient(90deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05))'
                            }}
                          />
                        </div>
                      </div>
                    )
                  })}
              </div>
            </AdminCard>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
