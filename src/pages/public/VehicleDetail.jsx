import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  Calendar, 
  Gauge, 
  Settings, 
  Fuel, 
  CheckCircle2, 
  Download,
  ArrowLeft,
  MapPin,
  Palette,
  Clock
} from 'lucide-react'
import ImageWithPreload from '../../components/ImageWithPreload'

/**
 * VehicleDetail - Page de détail d'un véhicule (Vitrine Premium)
 * 
 * Features:
 * - Galerie photo avec miniatures (changement au clic)
 * - Fiche technique complète avec Quick Specs
 * - Timeline de suivi exclusive (5 étapes)
 * - Checklist d'expertise FLOW MOTOR
 * - Formulaire de contact dédié
 * - Design ultra-premium avec engine-brown.svg en filigrane
 */
function VehicleDetail() {
  const { slug } = useParams()

  // ===== MOCK DATA - AUDI RS6 AVANT =====
  const vehicle = {
    slug: 'audi-rs6-avant-2021',
    make: 'Audi',
    model: 'RS6 Avant',
    year: 2021,
    mileage: 45000,
    price: 115000,
    color: 'Gris Nardo',
    transmission: 'Automatique 8 rapports Tiptronic',
    power: '600 ch',
    fuel: 'Essence',
    origin: 'Suisse',
    status: 'ARRIVAGE SUISSE',
    
    // Images (principale + miniatures)
    images: [
      'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=1200&q=80',
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200&q=80',
      'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?w=1200&q=80',
      'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=1200&q=80'
    ],

    // Description longue
    description: `Découvrez cette Audi RS6 Avant 2021 d'exception, importée de Suisse. 
    Version C8 dans sa configuration la plus exclusive, cette RS6 arbore la mythique teinte Gris Nardo. 
    Avec seulement 45 000 km au compteur, ce break sportif de 600 ch est en état impeccable. 
    Historique complet, carnet d'entretien Audi à jour, aucun accident.`,

    // Équipements principaux
    equipment: [
      'Pack Carbone Intérieur & Extérieur',
      'Sièges Sport RS en cuir Valcona',
      'Système Audio Bang & Olufsen 3D',
      'Châssis Sport RS+ avec suspension pilotée',
      'Échappement Sport RS (soupapes)',
      'Jantes 22" RS Design Noir Brillant',
      'Pack Assistance à la conduite',
      'Toit Panoramique',
      'Matrix LED avec signature numérique'
    ],

    // Timeline de suivi
    timeline: [
      { label: 'Sourcing', status: 'completed', date: '12 Déc 2024' },
      { label: 'Expertise & Achat', status: 'completed', date: '18 Déc 2024' },
      { label: 'Logistique & Douane', status: 'in-progress', date: 'En cours' },
      { label: 'Préparation Atelier', status: 'pending', date: 'À venir' },
      { label: 'Disponible', status: 'pending', date: 'Janv. 2025' }
    ],

    // Checklist d'expertise FLOW MOTOR
    expertiseChecks: [
      'Diagnostic moteur complet (Valise VCDS)',
      'État du système Quattro',
      'Boîte Tiptronic 8 rapports (Inspection)',
      'Turbocompresseurs & FAP',
      'Suspension pneumatique RS+',
      'Freinage (Disques céramique 420mm)',
      'Carrosserie (Épaisseur de peinture)',
      'Vitrage & Optiques',
      'Système électronique (Matrix LED, MMI)',
      'Historique complet (Contrôle Carfax)',
      'Essai routier (Performance & Confort)',
      'Préparation esthétique (Detailing)'
    ]
  }

  // État pour la gestion de la galerie
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  return (
    <main className="bg-cream relative min-h-screen">
      {/* Engine-brown.svg en filigrane */}
      <div 
        className="fixed inset-0 opacity-[0.02] pointer-events-none z-0"
        style={{
          backgroundImage: 'url(/assets/engine-white.svg)',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: '60%'
        }}
      />

      {/* Contenu principal - Espaces doublés */}
      <div className="relative z-10 page-transition">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 md:py-24">
          
          {/* Bouton retour */}
          <Link 
            to="/stock"
            className="group inline-flex items-center gap-2 font-roboto text-aubergine/60 hover:text-aubergine transition-colors mb-8 md:mb-10"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform duration-300" />
            Retour au stock
          </Link>

          {/* ===== LAYOUT PRINCIPAL : 2 COLONNES ===== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-14 mb-20">
            
            {/* ===== COLONNE GAUCHE : GALERIE PHOTO ===== */}
            <div className="space-y-4">
              {/* Image principale */}
              <div className="relative aspect-[4/3] bg-white rounded-xl overflow-hidden shadow-2xl group">
                <ImageWithPreload
                  src={vehicle.images[currentImageIndex]}
                  alt={`${vehicle.make} ${vehicle.model} - Photo ${currentImageIndex + 1}`}
                  className="cursor-zoom-in group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                
                {/* Badge IMPORT SUISSE */}
                <div className="absolute top-4 left-4">
                  <span className="px-4 py-2 bg-aubergine text-cream text-xs font-roboto font-bold uppercase tracking-wider rounded-md shadow-lg">
                    {vehicle.status}
                  </span>
                </div>
              </div>

              {/* Miniatures */}
              <div className="grid grid-cols-4 gap-3">
                {vehicle.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`
                      aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all duration-300
                      ${currentImageIndex === index 
                        ? 'border-brown shadow-lg scale-105 ring-2 ring-brown/20' 
                        : 'border-aubergine/20 hover:border-brown/50 hover:scale-102 active:scale-95'
                      }
                    `}
                  >
                    <ImageWithPreload
                      src={image}
                      alt={`Miniature ${index + 1}`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* ===== COLONNE DROITE : INFOS & ACTION ===== */}
            <div className="space-y-8">
              
              {/* En-tête */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1.5 bg-brown text-cream text-xs font-roboto font-bold uppercase tracking-wider rounded-md">
                    Disponible
                  </span>
                  <span className="text-aubergine/60 font-roboto text-sm">
                    Réf: {vehicle.slug}
                  </span>
                </div>
                
                <h1 className="font-playfair text-4xl md:text-5xl text-aubergine font-bold leading-tight mb-2">
                  {vehicle.make} {vehicle.model}
                </h1>
                
                <p className="font-roboto text-lg text-aubergine/70">
                  {vehicle.year} • {vehicle.color} • Import {vehicle.origin}
                </p>
              </div>

              {/* Bloc Prix */}
              <div className="bg-white rounded-xl p-8 shadow-xl shadow-md">
                <p className="font-playfair text-5xl md:text-6xl text-brown font-bold mb-3 price-glow">
                  {vehicle.price.toLocaleString('fr-FR')} €
                </p>
                <p className="font-roboto text-sm text-aubergine/60">
                  TVA sur marge • Import & Douanes inclus
                </p>
              </div>

              {/* Quick Specs - Grille 2x2 */}
              <div className="grid grid-cols-2 gap-4">
                {/* Année */}
                <div className="bg-white rounded-xl p-5 shadow-md shadow-md flex items-center gap-3">
                  <div className="w-10 h-10 bg-brown/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="text-brown" size={20} />
                  </div>
                  <div>
                    <p className="font-roboto text-xs text-aubergine/60 uppercase tracking-wider">Année</p>
                    <p className="font-roboto text-lg font-bold text-aubergine">{vehicle.year}</p>
                  </div>
                </div>

                {/* Kilométrage */}
                <div className="bg-white rounded-xl p-5 shadow-md shadow-md flex items-center gap-3">
                  <div className="w-10 h-10 bg-brown/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Gauge className="text-brown" size={20} />
                  </div>
                  <div>
                    <p className="font-roboto text-xs text-aubergine/60 uppercase tracking-wider">Kilométrage</p>
                    <p className="font-roboto text-lg font-bold text-aubergine">
                      {vehicle.mileage.toLocaleString('fr-FR')} km
                    </p>
                  </div>
                </div>

                {/* Boîte */}
                <div className="bg-white rounded-xl p-5 shadow-md shadow-md flex items-center gap-3">
                  <div className="w-10 h-10 bg-brown/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Settings className="text-brown" size={20} />
                  </div>
                  <div>
                    <p className="font-roboto text-xs text-aubergine/60 uppercase tracking-wider">Boîte</p>
                    <p className="font-roboto text-sm font-bold text-aubergine">Automatique</p>
                  </div>
                </div>

                {/* Puissance */}
                <div className="bg-white rounded-xl p-5 shadow-md shadow-md flex items-center gap-3">
                  <div className="w-10 h-10 bg-brown/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Fuel className="text-brown" size={20} />
                  </div>
                  <div>
                    <p className="font-roboto text-xs text-aubergine/60 uppercase tracking-wider">Puissance</p>
                    <p className="font-roboto text-lg font-bold text-aubergine">{vehicle.power}</p>
                  </div>
                </div>
              </div>

              {/* Boutons d'Action */}
              <div className="space-y-4">
                <button className="w-full min-h-[56px] bg-brown text-cream rounded-xl font-roboto font-bold text-lg uppercase tracking-wide hover:bg-brown/90 active:scale-[0.98] transition-all duration-200 shadow-lg hover:shadow-xl btn-shine">
                  Réserver ce véhicule
                </button>
                
                <button className="group w-full min-h-[56px] bg-white border-2 border-aubergine text-aubergine rounded-xl font-roboto font-medium flex items-center justify-center gap-3 hover:bg-aubergine hover:text-cream active:scale-[0.98] transition-all duration-300">
                  <Download size={20} className="group-hover:animate-bounce" />
                  Télécharger le dossier historique
                </button>
              </div>

              {/* Contact rapide */}
              <div className="bg-aubergine/5 rounded-xl p-5 shadow-md">
                <p className="font-roboto text-sm text-aubergine/70 mb-3">
                  Une question sur ce véhicule ?
                </p>
                <a 
                  href="tel:+33123456789"
                  className="inline-flex items-center gap-2 font-roboto font-bold text-brown hover:underline"
                >
                  📞 +33 1 23 45 67 89
                </a>
              </div>
            </div>
          </div>

          {/* ===== TIMELINE DE SUIVI (EXCLUSIVITÉ FLOW MOTOR) ===== */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <span className="text-brown font-roboto text-sm uppercase tracking-widest">
                Exclusivité FLOW MOTOR
              </span>
              <h2 className="font-playfair text-3xl md:text-4xl text-aubergine font-bold mt-2">
                Suivi de ce Véhicule
              </h2>
              <p className="font-roboto text-aubergine/60 mt-3 max-w-2xl mx-auto">
                Transparence totale sur le parcours de votre futur véhicule, du sourcing à la livraison.
              </p>
            </div>

            {/* Timeline horizontale (Desktop) / Verticale (Mobile) */}
            <div className="bg-white rounded-xl p-6 md:p-10 shadow-xl shadow-md">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-4 relative">
                {/* Ligne de connexion (Desktop uniquement) */}
                <div className="hidden md:block absolute top-6 left-0 right-0 h-1 bg-aubergine/10 z-0" />
                
                {vehicle.timeline.map((step, index) => (
                  <div key={index} className="flex md:flex-col items-center gap-4 md:gap-3 relative z-10 flex-1">
                    {/* Icône étape */}
                    <div className={`
                      w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all
                      ${step.status === 'completed' 
                        ? 'bg-brown text-cream shadow-lg' 
                        : step.status === 'in-progress'
                        ? 'bg-brown/70 text-cream shadow-md animate-pulse'
                        : 'bg-aubergine/10 text-aubergine/40'
                      }
                    `}>
                      {step.status === 'completed' ? (
                        <CheckCircle2 size={24} />
                      ) : step.status === 'in-progress' ? (
                        <Clock size={24} />
                      ) : (
                        <div className="w-3 h-3 bg-aubergine/30 rounded-full" />
                      )}
                    </div>

                    {/* Label et date */}
                    <div className="flex-1 md:text-center">
                      <p className={`
                        font-roboto text-sm md:text-base font-bold
                        ${step.status === 'pending' ? 'text-aubergine/40' : 'text-aubergine'}
                      `}>
                        {step.label}
                      </p>
                      <p className={`
                        font-roboto text-xs mt-1
                        ${step.status === 'pending' ? 'text-aubergine/30' : 'text-aubergine/60'}
                      `}>
                        {step.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ===== DESCRIPTION & ÉQUIPEMENTS ===== */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-20">
            {/* Description */}
            <div className="bg-white rounded-xl p-8 shadow-lg shadow-md">
              <h3 className="font-playfair text-2xl text-aubergine font-bold mb-4">
                Description
              </h3>
              <p className="font-roboto text-aubergine/70 leading-relaxed whitespace-pre-line">
                {vehicle.description}
              </p>
            </div>

            {/* Équipements principaux */}
            <div className="bg-white rounded-xl p-8 shadow-lg shadow-md">
              <h3 className="font-playfair text-2xl text-aubergine font-bold mb-4">
                Équipements Principaux
              </h3>
              <ul className="space-y-3">
                {vehicle.equipment.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="text-brown flex-shrink-0 mt-0.5" size={18} />
                    <span className="font-roboto text-aubergine/80 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* ===== EXPERTISE TECHNIQUE (CHECKLIST) ===== */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <span className="text-brown font-roboto text-sm uppercase tracking-widest">
                Garantie Qualité
              </span>
              <h2 className="font-playfair text-3xl md:text-4xl text-aubergine font-bold mt-2">
                Contrôle FLOW MOTOR
              </h2>
              <p className="font-roboto text-aubergine/60 mt-3 max-w-2xl mx-auto">
                Chaque véhicule passe par un contrôle en 12 points avant d'intégrer notre catalogue.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 md:p-10 shadow-xl shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vehicle.expertiseChecks.map((check, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-cream/30 transition-colors">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="text-white" size={16} />
                    </div>
                    <span className="font-roboto text-aubergine/80 text-sm">
                      {check}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ===== CTA FINAL ===== */}
          <section className="bg-gradient-to-r from-aubergine to-brown rounded-2xl p-10 md:p-16 text-center shadow-2xl">
            <h2 className="font-playfair text-3xl md:text-5xl text-cream font-bold mb-5">
              Intéressé par cette {vehicle.model} ?
            </h2>
            <p className="font-roboto text-cream/80 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
              Réservez dès maintenant ou demandez des informations complémentaires à notre équipe d'experts.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <button className="min-h-[56px] px-10 bg-cream text-aubergine rounded-xl font-roboto font-bold text-lg hover:bg-white active:scale-[0.98] transition-all duration-200 shadow-xl btn-shine">
                Réserver maintenant
              </button>
              <Link 
                to="/contact"
                className="group min-h-[56px] px-10 border-2 border-cream text-cream rounded-xl font-roboto font-medium flex items-center justify-center gap-2 hover:bg-cream/10 active:scale-[0.98] transition-all duration-300"
              >
                Nous contacter
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}

export default VehicleDetail
