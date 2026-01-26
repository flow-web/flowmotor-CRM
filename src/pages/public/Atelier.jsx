import { useState } from 'react'
import { Banknote, Shield, TrendingUp, Users, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react'
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
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1600&q=80"
            alt="Véhicule de luxe"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral/95 via-neutral/75 to-neutral/50" />
        </div>

        <div className="container relative mx-auto px-6 py-24 text-neutral-content lg:py-32">
          <div className="max-w-3xl">
            <span className="text-xs uppercase tracking-[0.3em] text-accent">Conciergerie Automobile</span>
            <h1 className="mt-5 text-4xl font-semibold font-display md:text-6xl">
              Confiez-nous votre exception.
            </h1>
            <p className="mt-6 text-lg text-neutral-content/70 leading-relaxed max-w-2xl">
              Reprise cash ou dépôt-vente premium : nous maximisons la valeur de votre véhicule et sécurisons la transaction.
            </p>

            <div className="mt-12 grid gap-4 md:grid-cols-3">
              <div className="card card-premium bg-white/10 backdrop-blur-sm p-5">
                <Shield className="text-accent" size={24} />
                <p className="mt-3 text-sm text-neutral-content/90">Paiement 100% sécurisé</p>
              </div>
              <div className="card card-premium bg-white/10 backdrop-blur-sm p-5">
                <TrendingUp className="text-accent" size={24} />
                <p className="mt-3 text-sm text-neutral-content/90">Prix au juste marché</p>
              </div>
              <div className="card card-premium bg-white/10 backdrop-blur-sm p-5">
                <Users className="text-accent" size={24} />
                <p className="mt-3 text-sm text-neutral-content/90">Réseau d'acheteurs VIP</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="section-spacing relative overflow-hidden">
        {/* Watermark */}
        <img
          src="/assets/gears.svg"
          alt=""
          aria-hidden="true"
          className="absolute -right-40 top-20 w-[500px] h-auto opacity-[0.02] pointer-events-none select-none"
          style={{ filter: 'brightness(0)' }}
        />

        <div className="container relative mx-auto px-6">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-primary">Deux solutions premium</p>
            <h2 className="mt-4 text-3xl font-semibold font-display md:text-4xl">Choisissez votre formule</h2>
            <p className="mx-auto mt-4 max-w-2xl text-base-content/60 leading-relaxed">
              Une reprise immédiate ou un dépôt-vente optimisé : nous adaptons la stratégie à votre objectif.
            </p>
          </div>

          <div className="mt-14 grid gap-8 lg:grid-cols-2">
            {/* Reprise Cash Card */}
            <div className="card card-premium p-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 rounded-full text-xs font-medium text-primary w-fit">
                Solution express
              </div>
              <div className="mt-5 flex items-center gap-4">
                <div className="rounded-2xl bg-primary/8 p-4">
                  <Banknote className="text-primary" size={24} />
                </div>
                <h3 className="text-2xl font-semibold font-display">Reprise cash</h3>
              </div>
              <p className="mt-5 text-base-content/60 leading-relaxed">
                Vendez rapidement votre véhicule. Expertise gratuite et proposition de rachat immédiate.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-base-content/70">
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={16} className="text-primary mt-0.5 flex-shrink-0" />
                  Paiement sous 48h maximum
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={16} className="text-primary mt-0.5 flex-shrink-0" />
                  Zéro démarche administrative
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={16} className="text-primary mt-0.5 flex-shrink-0" />
                  Expertise gratuite à domicile
                </li>
              </ul>
              <div className="mt-8">
                <a
                  href="#formulaire"
                  className="btn bg-[#5C3A2E] border-0 text-white w-full py-4 h-auto rounded-xl hover:bg-[#5C3A2E]/90 shadow-lg shadow-[#5C3A2E]/20"
                >
                  Demander une évaluation
                  <ArrowRight size={18} />
                </a>
              </div>
            </div>

            {/* Dépôt-vente Card */}
            <div className="card card-premium p-8 ring-2 ring-primary/15">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent/10 rounded-full text-xs font-medium text-accent w-fit">
                <Sparkles size={12} />
                Recommandé
              </div>
              <div className="mt-5 flex items-center gap-4">
                <div className="rounded-2xl bg-primary/8 p-4">
                  <TrendingUp className="text-primary" size={24} />
                </div>
                <h3 className="text-2xl font-semibold font-display">Dépôt-vente premium</h3>
              </div>
              <p className="mt-5 text-base-content/60 leading-relaxed">
                Nous optimisons votre prix de vente grâce à notre réseau et nos canaux premium.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-base-content/70">
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={16} className="text-primary mt-0.5 flex-shrink-0" />
                  Mise en avant multi-plateformes
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={16} className="text-primary mt-0.5 flex-shrink-0" />
                  Négociation gérée par nos experts
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={16} className="text-primary mt-0.5 flex-shrink-0" />
                  Paiement sécurisé et traçable
                </li>
              </ul>
              <div className="mt-8">
                <a
                  href="#formulaire"
                  className="btn btn-outline border-primary/20 text-primary w-full py-4 h-auto rounded-xl hover:bg-primary hover:text-primary-content hover:border-primary"
                >
                  Lancer un dépôt-vente
                  <ArrowRight size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section id="formulaire" className="section-spacing relative overflow-hidden">
        {/* Watermark */}
        <img
          src="/assets/gear-motion.svg"
          alt=""
          aria-hidden="true"
          className="absolute -left-32 bottom-20 w-[400px] h-auto opacity-[0.02] pointer-events-none select-none rotate-12"
          style={{ filter: 'brightness(0)' }}
        />

        <div className="container relative mx-auto px-6">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-primary">Dépôt / reprise</p>
            <h2 className="mt-4 text-3xl font-semibold font-display md:text-4xl">Demande d&apos;estimation</h2>
            <p className="mx-auto mt-4 max-w-2xl text-base-content/60 leading-relaxed">
              Décrivez votre véhicule et recevez une réponse rapide de nos experts.
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-4xl">
            <div className="card card-premium p-8 lg:p-10">
              {submitted && (
                <div className="mb-6 p-4 bg-green-50 text-green-800 rounded-xl text-sm">
                  Merci ! Votre demande a bien été envoyée.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <label className="form-control">
                    <span className="text-xs uppercase tracking-[0.2em] text-base-content/50 mb-2 block">Marque</span>
                    <input
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={handleChange}
                      className="input-premium w-full bg-base-100"
                      placeholder="Ex: Porsche"
                      required
                    />
                  </label>
                  <label className="form-control">
                    <span className="text-xs uppercase tracking-[0.2em] text-base-content/50 mb-2 block">Modèle</span>
                    <input
                      type="text"
                      name="model"
                      value={formData.model}
                      onChange={handleChange}
                      className="input-premium w-full bg-base-100"
                      placeholder="Ex: 911 GT3"
                      required
                    />
                  </label>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                  <label className="form-control">
                    <span className="text-xs uppercase tracking-[0.2em] text-base-content/50 mb-2 block">Année</span>
                    <input
                      type="number"
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
                      className="input-premium w-full bg-base-100"
                      placeholder="2023"
                      required
                    />
                  </label>
                  <label className="form-control">
                    <span className="text-xs uppercase tracking-[0.2em] text-base-content/50 mb-2 block">Kilométrage</span>
                    <input
                      type="number"
                      name="mileage"
                      value={formData.mileage}
                      onChange={handleChange}
                      className="input-premium w-full bg-base-100"
                      placeholder="15000"
                      required
                    />
                  </label>
                  <label className="form-control">
                    <span className="text-xs uppercase tracking-[0.2em] text-base-content/50 mb-2 block">Prix souhaité</span>
                    <input
                      type="number"
                      name="desiredPrice"
                      value={formData.desiredPrice}
                      onChange={handleChange}
                      className="input-premium w-full bg-base-100"
                      placeholder="150000"
                    />
                  </label>
                </div>

                <label className="form-control">
                  <span className="text-xs uppercase tracking-[0.2em] text-base-content/50 mb-2 block">Options / détails</span>
                  <textarea
                    name="options"
                    value={formData.options}
                    onChange={handleChange}
                    className="input-premium w-full bg-base-100 min-h-[120px] resize-none"
                    placeholder="Historique, entretien, équipements..."
                  />
                </label>

                <div className="grid gap-6 md:grid-cols-3">
                  <label className="form-control">
                    <span className="text-xs uppercase tracking-[0.2em] text-base-content/50 mb-2 block">Nom</span>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="input-premium w-full bg-base-100"
                      required
                    />
                  </label>
                  <label className="form-control">
                    <span className="text-xs uppercase tracking-[0.2em] text-base-content/50 mb-2 block">Email</span>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="input-premium w-full bg-base-100"
                      required
                    />
                  </label>
                  <label className="form-control">
                    <span className="text-xs uppercase tracking-[0.2em] text-base-content/50 mb-2 block">Téléphone</span>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="input-premium w-full bg-base-100"
                    />
                  </label>
                </div>

                <label className="flex items-start gap-3 text-sm pt-2">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded border-primary/30 text-accent focus:ring-accent/20 mt-0.5"
                    checked={acceptedConditions}
                    onChange={(e) => setAcceptedConditions(e.target.checked)}
                  />
                  <span className="text-base-content/70">
                    J&apos;accepte les conditions de dépôt-vente.
                    <button
                      type="button"
                      className="text-accent hover:underline ml-1"
                      onClick={() => setIsModalOpen(true)}
                    >
                      Lire les conditions
                    </button>
                  </span>
                </label>

                <button
                  type="submit"
                  className="btn bg-[#5C3A2E] border-0 text-white w-full py-4 h-auto rounded-xl hover:bg-[#5C3A2E]/90 shadow-lg shadow-[#5C3A2E]/20 mt-2"
                >
                  Envoyer la demande
                  <ArrowRight size={18} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Conditions de dépôt-vente"
      >
        <div className="space-y-4 text-sm text-base-content/70 leading-relaxed">
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
