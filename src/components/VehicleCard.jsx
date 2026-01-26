import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import ImageWithPreload from './ImageWithPreload'

function VehicleCard({ vehicle }) {
  const getStatusBadge = (status) => {
    if (status.includes('ARRIVAGE')) return 'badge badge-accent'
    if (status === 'DISPONIBLE') return 'badge badge-primary'
    if (status === 'RÉSERVÉ') return 'badge badge-secondary'
    if (status === 'VENDU') return 'badge badge-neutral badge-outline'
    return 'badge'
  }

  return (
    <Link
      to={`/vehicule/${vehicle.slug}`}
      className="card card-premium group"
    >
      <figure className="relative">
        <ImageWithPreload
          src={vehicle.image}
          alt={`${vehicle.make} ${vehicle.model}`}
          className="h-56 w-full"
        />
        <div className="absolute left-4 top-4">
          <span className={getStatusBadge(vehicle.status)}>{vehicle.status}</span>
        </div>
      </figure>
      <div className="card-body gap-3">
        <h3 className="card-title font-display text-2xl">{vehicle.make} {vehicle.model}</h3>
        <p className="text-sm text-base-content/70">
          {vehicle.year} • {vehicle.mileage.toLocaleString('fr-FR')} km
          {vehicle.transmission ? ` • ${vehicle.transmission}` : ''}
        </p>
        <div className="card-actions items-center justify-between pt-2">
          <span className="text-2xl font-display text-accent">
            {vehicle.price.toLocaleString('fr-FR')} €
          </span>
          <span className="btn btn-ghost btn-sm">
            Détails
            <ArrowRight size={16} />
          </span>
        </div>
      </div>
    </Link>
  )
}

export default VehicleCard
