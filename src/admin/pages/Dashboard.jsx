import { Link } from 'react-router-dom'
import { Car, TrendingUp, Truck, DollarSign, ArrowRight, Plus } from 'lucide-react'
import TopHeader from '../components/layout/TopHeader'
import AdminCard from '../components/shared/AdminCard'
import StatusBadge from '../components/shared/StatusBadge'
import { useVehicles } from '../context/VehiclesContext'
import { formatPrice, formatRelativeDate, formatVehicleName } from '../utils/formatters'
import { calculatePRU, calculateMarginPercent } from '../utils/calculations'
/**
 * Dashboard - Vue globale du CRM FLOW MOTOR
 * Design: Fond sombre #1a1212, Accent #C4A484, Boutons #5C3A2E
 */
function Dashboard() {
  const { vehicles, stats, vehiclesByStatus } = useVehicles()

  // Derniers véhicules ajoutés
  const recentVehicles = [...(vehicles || [])]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)

  // KPI — schéma simplifié : SOURCING / STOCK / SOLD
  const sourcingCount = vehiclesByStatus['SOURCING']?.length || 0
  const inStockCount = vehiclesByStatus['STOCK']?.length || 0
  const soldCount = vehiclesByStatus['SOLD']?.length || 0

  return (
    <div className="min-h-screen bg-[#1a1212]">
      <TopHeader
        title="Dashboard"
        subtitle="Vue d'ensemble de votre activité"
      />

      <div className="p-6 space-y-6">
        {/* KPI Cards */}
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

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Vehicles */}
          <div className="lg:col-span-2">
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
                      {/* Image */}
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

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {vehicle.make} {vehicle.model}
                        </p>
                        <p className="text-xs text-white/40">
                          {vehicle.year} • {formatRelativeDate(vehicle.createdAt)}
                        </p>
                      </div>

                      {/* Status */}
                      <StatusBadge status={vehicle.status} size="small" />

                      {/* Price */}
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

          {/* Quick Actions & Stats */}
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
