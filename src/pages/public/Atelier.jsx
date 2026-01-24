import { useState } from 'react'
import { Banknote, Shield, TrendingUp, Users, CheckCircle2, Sparkles } from 'lucide-react'
import Modal from '../../components/Modal'

function Atelier() {
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: '',
    mileage: '',
    options: '',
    desiredPrice: '',
    name: '',
    email: '',
    phone: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [acceptedConditions, setAcceptedConditions] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!acceptedConditions) {
      alert('Veuillez accepter les conditions de dépôt-vente pour continuer.')
      return
    }
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({
        brand: '', model: '', year: '', mileage: '',
        options: '', desiredPrice: '', name: '', email: '', phone: ''
      })
      setAcceptedConditions(false)
    }, 3000)
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <main className="bg-base-100">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1600&q=80"
            alt="Véhicule de luxe"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral/90 via-neutral/70 to-neutral/40" />
        </div>

        <div className="container relative mx-auto px-6 py-20 text-neutral-content lg:py-24">
          <div className="max-w-3xl">
            <div className="badge badge-accent">Conciergerie Automobile</div>
            <h1 className="mt-5 text-4xl font-semibold md:text-6xl">
              Confiez-nous votre exception.
            </h1>
            <p className="mt-6 text-lg text-neutral-content/80">
              Reprise cash ou dépôt-vente premium : nous maximisons la valeur de votre véhicule et sécurisons la transaction.
            </p>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              <div className="rounded-box border border-white/20 bg-white/10 p-4 backdrop-blur">
                <Shield className="text-accent" size={22} />
                <p className="mt-2 text-sm">Paiement 100% sécurisé</p>
              </div>
              <div className="rounded-box border border-white/20 bg-white/10 p-4 backdrop-blur">
                <TrendingUp className="text-accent" size={22} />
                <p className="mt-2 text-sm">Prix au juste marché</p>
              </div>
              <div className="rounded-box border border-white/20 bg-white/10 p-4 backdrop-blur">
                <Users className="text-accent" size={22} />
                <p className="mt-2 text-sm">Réseau d'acheteurs VIP</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-16 lg:py-20">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-primary">Deux solutions premium</p>
          <h2 className="mt-3 text-3xl font-semibold md:text-4xl">Choisissez votre formule</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base-content/70">
            Une reprise immédiate ou un dépôt-vente optimisé : nous adaptons la stratégie à votre objectif.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="badge badge-primary">Solution express</div>
              <div className="mt-4 flex items-center gap-3">
                <div className="rounded-box bg-primary/10 p-3">
                  <Banknote className="text-primary" size={22} />
                </div>
                <h3 className="text-2xl font-semibold">Reprise cash</h3>
              </div>
              <p className="mt-4 text-base-content/70">
                Vendez rapidement votre véhicule. Expertise gratuite et proposition de rachat immédiate.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-base-content/70">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-primary" />
                  Paiement sous 48h maximum
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-primary" />
                  Zéro démarche administrative
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-primary" />
                  Expertise gratuite à domicile
                </li>
              </ul>
              <div className="card-actions mt-6">
                <a href="#formulaire" className="btn btn-accent w-full">
                  Demander une évaluation
                </a>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl ring-2 ring-primary/20">
            <div className="card-body">
              <div className="badge badge-accent gap-1">
                <Sparkles size={14} />
                Recommandé
              </div>
              <div className="mt-4 flex items-center gap-3">
                <div className="rounded-box bg-primary/10 p-3">
                  <TrendingUp className="text-primary" size={22} />
                </div>
                <h3 className="text-2xl font-semibold">Dépôt-vente premium</h3>
              </div>
              <p className="mt-4 text-base-content/70">
                Nous optimisons votre prix de vente grâce à notre réseau et nos canaux premium.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-base-content/70">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-primary" />
                  Mise en avant multi-plateformes
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-primary" />
                  Négociation gérée par nos experts
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-primary" />
                  Paiement sécurisé et traçable
                </li>
              </ul>
              <div className="card-actions mt-6">
                <a href="#formulaire" className="btn btn-outline btn-accent w-full">
                  Lancer un dépôt-vente
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="formulaire" className="bg-gradient-to-br from-base-200 via-base-100 to-primary/10 py-16">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-primary">Dépôt / reprise</p>
            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">Demande d&apos;estimation</h2>
            <p className="mx-auto mt-4 max-w-2xl text-base-content/70">
              Décrivez votre véhicule et recevez une réponse rapide de nos experts.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-4xl">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body gap-6">
                {submitted && (
                  <div className="alert alert-success">
                    <span>Merci ! Votre demande a bien été envoyée.</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="form-control">
                      <span className="label-text">Marque</span>
                      <input
                        type="text"
                        name="brand"
                        value={formData.brand}
                        onChange={handleChange}
                        className="input input-bordered"
                        required
                      />
                    </label>
                    <label className="form-control">
                      <span className="label-text">Modèle</span>
                      <input
                        type="text"
                        name="model"
                        value={formData.model}
                        onChange={handleChange}
                        className="input input-bordered"
                        required
                      />
                    </label>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <label className="form-control">
                      <span className="label-text">Année</span>
                      <input
                        type="number"
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        className="input input-bordered"
                        required
                      />
                    </label>
                    <label className="form-control">
                      <span className="label-text">Kilométrage</span>
                      <input
                        type="number"
                        name="mileage"
                        value={formData.mileage}
                        onChange={handleChange}
                        className="input input-bordered"
                        required
                      />
                    </label>
                    <label className="form-control">
                      <span className="label-text">Prix souhaité (€)</span>
                      <input
                        type="number"
                        name="desiredPrice"
                        value={formData.desiredPrice}
                        onChange={handleChange}
                        className="input input-bordered"
                      />
                    </label>
                  </div>

                  <label className="form-control">
                    <span className="label-text">Options / détails</span>
                    <textarea
                      name="options"
                      value={formData.options}
                      onChange={handleChange}
                      className="textarea textarea-bordered min-h-[120px]"
                      placeholder="Historique, entretien, équipements..."
                    />
                  </label>

                  <div className="grid gap-4 md:grid-cols-3">
                    <label className="form-control">
                      <span className="label-text">Nom</span>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="input input-bordered"
                        required
                      />
                    </label>
                    <label className="form-control">
                      <span className="label-text">Email</span>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="input input-bordered"
                        required
                      />
                    </label>
                    <label className="form-control">
                      <span className="label-text">Téléphone</span>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="input input-bordered"
                      />
                    </label>
                  </div>

                  <label className="flex items-start gap-3 text-sm">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-accent mt-1"
                      checked={acceptedConditions}
                      onChange={(e) => setAcceptedConditions(e.target.checked)}
                    />
                    <span>
                      J&apos;accepte les conditions de dépôt-vente.
                      <button
                        type="button"
                        className="link link-accent ml-1"
                        onClick={() => setIsModalOpen(true)}
                      >
                        Lire les conditions
                      </button>
                    </span>
                  </label>

                  <button type="submit" className="btn btn-accent w-full">
                    Envoyer la demande
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Conditions de dépôt-vente"
      >
        <div className="space-y-4 text-sm text-base-content/70">
          <p>
            Les véhicules en dépôt-vente restent la propriété du client jusqu&apos;à la vente.
            FLOW MOTOR gère la mise en avant, les visites et la transaction en conformité avec la réglementation.
          </p>
          <p>
            Les frais de préparation, stockage et diffusion sont détaillés dans le contrat.
            Vous êtes libre de retirer votre véhicule à tout moment sur simple demande.
          </p>
        </div>
      </Modal>
    </main>
  )
}

export default Atelier
