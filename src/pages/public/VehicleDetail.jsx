import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Gauge, Settings, Fuel, Download, Phone } from 'lucide-react'
import ImageWithPreload from '../../components/ImageWithPreload'

function VehicleDetail() {
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
    images: [
      'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=1200&q=80',
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200&q=80',
      'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?w=1200&q=80',
      'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=1200&q=80'
    ],
    description: `Découvrez cette Audi RS6 Avant 2021 d'exception, importée de Suisse.
Version C8 dans sa configuration la plus exclusive, en teinte Gris Nardo.
Avec seulement 45 000 km, ce break sportif de 600 ch est en état impeccable.`,
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
    timeline: [
      { label: 'Sourcing', status: 'completed', date: '12 Déc 2024' },
      { label: 'Expertise', status: 'completed', date: '18 Déc 2024' },
      { label: 'Logistique', status: 'in-progress', date: 'En cours' },
      { label: 'Préparation', status: 'pending', date: 'À venir' },
      { label: 'Disponible', status: 'pending', date: 'Janv. 2025' }
    ],
    expertiseChecks: [
      'Diagnostic moteur complet (Valise VCDS)',
      'État du système Quattro',
      'Boîte Tiptronic 8 rapports',
      'Suspension pneumatique RS+',
      'Freinage (Disques céramique 420mm)',
      'Historique complet (Contrôle Carfax)'
    ]
  }

  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const getStepClass = (status) => {
    if (status === 'completed') return 'step-primary'
    if (status === 'in-progress') return 'step-accent'
    return ''
  }

  return (
    <main className="bg-base-100">
      <section className="container mx-auto px-6 py-10">
        <div className="breadcrumbs text-sm">
          <ul>
            <li><Link to="/stock">Stock</Link></li>
            <li>{vehicle.make} {vehicle.model}</li>
          </ul>
        </div>

        <div className="mt-6 grid gap-10 lg:grid-cols-2">
          <div>
            <div className="card bg-base-100 shadow-xl">
              <figure className="relative">
                <ImageWithPreload
                  src={vehicle.images[currentImageIndex]}
                  alt={`${vehicle.make} ${vehicle.model}`}
                  className="h-[420px] w-full"
                />
                <div className="absolute left-4 top-4">
                  <span className="badge badge-accent">{vehicle.status}</span>
                </div>
              </figure>
            </div>

            <div className="mt-4 grid grid-cols-4 gap-3">
              {vehicle.images.map((image, index) => (
                <button
                  key={image}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`overflow-hidden rounded-box border ${currentImageIndex === index ? 'border-primary' : 'border-base-300'}`}
                >
                  <ImageWithPreload
                    src={image}
                    alt={`Miniature ${index + 1}`}
                    className="aspect-[4/3]"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="badge badge-primary">Disponible</div>
              <h1 className="mt-3 text-4xl font-semibold md:text-5xl">
                {vehicle.make} {vehicle.model}
              </h1>
              <p className="mt-2 text-base-content/70">
                {vehicle.year} • {vehicle.color} • Import {vehicle.origin}
              </p>
            </div>

            <div className="card bg-base-100 shadow-lg">
              <div className="card-body gap-4">
                <div>
                  <p className="text-4xl font-semibold text-accent">
                    {vehicle.price.toLocaleString('fr-FR')} €
                  </p>
                  <p className="text-sm text-base-content/60">TVA sur marge • Import & Douanes inclus</p>
                </div>

                <div className="stats stats-vertical bg-base-200 text-sm sm:stats-horizontal">
                  <div className="stat">
                    <div className="stat-figure text-primary"><Calendar size={18} /></div>
                    <div className="stat-title">Année</div>
                    <div className="stat-value text-lg">{vehicle.year}</div>
                  </div>
                  <div className="stat">
                    <div className="stat-figure text-primary"><Gauge size={18} /></div>
                    <div className="stat-title">Kilométrage</div>
                    <div className="stat-value text-lg">{vehicle.mileage.toLocaleString('fr-FR')} km</div>
                  </div>
                  <div className="stat">
                    <div className="stat-figure text-primary"><Settings size={18} /></div>
                    <div className="stat-title">Boîte</div>
                    <div className="stat-value text-lg">Automatique</div>
                  </div>
                  <div className="stat">
                    <div className="stat-figure text-primary"><Fuel size={18} /></div>
                    <div className="stat-title">Puissance</div>
                    <div className="stat-value text-lg">{vehicle.power}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <button className="btn btn-accent">Réserver ce véhicule</button>
              <button className="btn btn-outline btn-accent">
                <Download size={18} />
                Télécharger le dossier
              </button>
            </div>

            <div className="alert">
              <Phone size={18} />
              <span>Une question ? +33 1 23 45 67 89</span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-base-200 via-base-100 to-primary/10 py-16">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-primary">Suivi FLOW MOTOR</p>
            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">Parcours du véhicule</h2>
          </div>

          <ul className="steps steps-vertical mt-8 bg-base-100 p-6 lg:steps-horizontal">
            {vehicle.timeline.map((step, index) => (
              <li key={index} className={`step ${getStepClass(step.status)}`}>
                {step.label}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container mx-auto grid gap-8 px-6 py-16 lg:grid-cols-2">
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h3 className="text-2xl font-semibold">Description</h3>
            <p className="text-base-content/70 whitespace-pre-line">
              {vehicle.description}
            </p>
          </div>
        </div>

        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h3 className="text-2xl font-semibold">Équipements principaux</h3>
            <ul className="mt-2 space-y-2 text-sm text-base-content/70">
              {vehicle.equipment.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="badge badge-primary badge-xs" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-base-200 via-base-100 to-accent/10 py-16">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-primary">Contrôle qualité</p>
            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">Contrôle FLOW MOTOR</h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {vehicle.expertiseChecks.map((check) => (
              <div key={check} className="card bg-base-100 shadow">
                <div className="card-body">
                  <p className="text-sm text-base-content/70">{check}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 pb-16">
        <div className="card bg-neutral text-neutral-content shadow-2xl">
          <div className="card-body text-center">
            <h2 className="text-3xl font-semibold md:text-4xl">
              Intéressé par cette {vehicle.model} ?
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-neutral-content/70">
              Réservez dès maintenant ou demandez un dossier complet à notre équipe.
            </p>
            <div className="card-actions mt-6 justify-center gap-4">
              <button className="btn btn-accent">Réserver maintenant</button>
              <Link to="/contact" className="btn btn-outline btn-accent">Nous contacter</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default VehicleDetail
