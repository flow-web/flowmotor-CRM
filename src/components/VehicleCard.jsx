import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import ImageWithPreload from './ImageWithPreload'

/**
 * VehicleCard - Carte de présentation premium d'un véhicule
 * 
 * Design:
 * - Image aspect-video avec badge status coloré + preload blur-up
 * - Fond blanc pur avec dégradé subtil
 * - Hover: image scale-105 + carte monte + shadow-2xl + bouton "Voir les détails"
 * - Gestion de tous les statuts: DISPONIBLE, ARRIVAGE SUISSE, RÉSERVÉ, VENDU
 * 
 * @param {Object} vehicle - Données du véhicule
 */
function VehicleCard({ vehicle }) {
  // ===== LOGIQUE DE COULEUR DU BADGE STATUS =====
  const getStatusStyle = (status) => {
    if (status.includes('ARRIVAGE')) {
      return 'bg-aubergine text-cream'
    }
    if (status === 'DISPONIBLE') {
      return 'bg-brown text-cream'
    }
    if (status === 'RÉSERVÉ') {
      return 'bg-brown/70 text-cream'
    }
    if (status === 'VENDU') {
      return 'bg-aubergine/40 text-white/80'
    }
    return 'bg-cream text-aubergine'
  }

  return (
    <Link 
      to={`/vehicule/${vehicle.slug}`}
      className="group block bg-white rounded-2xl overflow-hidden card-lift h-full flex flex-col"
    >
      {/* Image avec badge status */}
      <div className="relative aspect-video overflow-hidden flex-shrink-0 bg-cream/30">
        <ImageWithPreload
          src={vehicle.image}
          alt={`${vehicle.make} ${vehicle.model}`}
          className="group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        
        {/* Badge Status - Haut gauche */}
        <div className="absolute top-4 left-4">
          <span className={`
            px-3 py-1.5 text-xs font-roboto font-bold uppercase tracking-wider rounded-md
            transition-transform duration-300 group-hover:scale-105
            ${getStatusStyle(vehicle.status)}
          `}>
            {vehicle.status}
          </span>
        </div>

        {/* Bouton "Voir les détails" - Apparaît au survol */}
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-brown text-cream rounded-lg font-roboto text-sm font-medium shadow-lg">
            Voir les détails
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
          </span>
        </div>
      </div>
      
      {/* Contenu */}
      <div className="p-6 flex flex-col flex-grow bg-gradient-to-b from-white to-cream/20">
        {/* Modèle - Gros titre serif */}
        <h3 className="font-playfair text-2xl md:text-3xl text-aubergine font-bold leading-tight group-hover:text-brown transition-colors duration-300">
          {vehicle.make} {vehicle.model}
        </h3>
        
        {/* Infos techniques - Année, Kilométrage, Transmission */}
        <p className="font-roboto text-sm text-aubergine/60 mt-2">
          {vehicle.year} • {vehicle.mileage.toLocaleString('fr-FR')} km
          {vehicle.transmission && ` • ${vehicle.transmission}`}
        </p>
        
        {/* Prix - Marron Bold avec effet glow */}
        <div className="mt-auto pt-4 flex items-end justify-between">
          <p className="font-playfair text-3xl md:text-4xl text-brown font-bold price-glow">
            {vehicle.price.toLocaleString('fr-FR')} €
          </p>
        </div>
      </div>
    </Link>
  )
}

export default VehicleCard
