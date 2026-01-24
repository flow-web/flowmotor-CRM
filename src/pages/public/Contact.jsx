import { useState } from 'react'
import { Phone, Mail, MapPin, Send } from 'lucide-react'

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ name: '', email: '', subject: '', message: '' })
    }, 4000)
  }

  const faqItems = [
    {
      question: 'Quels sont les délais d\'importation ?',
      answer: 'Depuis la Suisse, comptez 2 à 3 semaines. Depuis le Japon, 6 à 8 semaines (transport maritime + dédouanement).'
    },
    {
      question: 'Quelles garanties sont incluses ?',
      answer: 'Chaque véhicule est expertisé en 12 points. Garantie mécanique 6 mois incluse, extensible jusqu\'à 24 mois.'
    },
    {
      question: 'Proposez-vous la livraison à domicile ?',
      answer: 'Oui, livraison partout en France et en Suisse. Transport sécurisé en camion fermé.'
    }
  ]

  return (
    <main className="bg-base-100">
      <section className="relative overflow-hidden py-16 lg:py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-base-200/70 to-transparent" />
        <div className="container relative mx-auto px-6">
          <p className="text-xs uppercase tracking-[0.3em] text-primary">Conciergerie automobile</p>
          <h1 className="mt-3 text-4xl font-semibold md:text-5xl">Parlons de votre projet</h1>
          <p className="mt-4 max-w-2xl text-base-content/70">
            Notre équipe vous accompagne pour l&apos;achat, la reprise ou la recherche personnalisée.
          </p>
        </div>
      </section>

      <section className="container mx-auto grid gap-10 px-6 pb-20 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body gap-4">
              <h2 className="text-2xl font-semibold">Contactez-nous</h2>

              <div className="flex items-start gap-4">
                <div className="rounded-box bg-primary/10 p-3">
                  <Phone size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-base-content/60">Expertise Lyon</p>
                  <a className="link link-hover text-lg font-semibold" href="tel:+33412345678">
                    +33 4 12 34 56 78
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-box bg-primary/10 p-3">
                  <Phone size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-base-content/60">Expertise Genève</p>
                  <a className="link link-hover text-lg font-semibold" href="tel:+41221234567">
                    +41 22 123 45 67
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-box bg-primary/10 p-3">
                  <Mail size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-base-content/60">Email</p>
                  <a className="link link-hover text-lg font-semibold" href="mailto:contact@flowmotor.fr">
                    contact@flowmotor.fr
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-box bg-primary/10 p-3">
                  <MapPin size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-base-content/60">Showrooms</p>
                  <p className="text-base-content/70">Lyon, France • Genève, Suisse</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-base-200 via-base-100 to-info/10 shadow">
            <div className="card-body">
              <h3 className="text-sm uppercase tracking-widest text-base-content/70">Horaires</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Lundi - Vendredi</span>
                  <span className="font-semibold">9h - 19h</span>
                </div>
                <div className="flex justify-between">
                  <span>Samedi</span>
                  <span className="font-semibold">10h - 18h</span>
                </div>
                <div className="flex justify-between text-base-content/60">
                  <span>Dimanche</span>
                  <span>Sur rendez-vous</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body gap-6">
            <h2 className="text-2xl font-semibold">Envoyez-nous un message</h2>

            {submitted && (
              <div className="alert alert-success">
                <span>Merci ! Votre message a bien été envoyé.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="form-control">
                  <span className="label-text">Nom complet</span>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Votre nom"
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
                    placeholder="vous@email.com"
                    className="input input-bordered"
                    required
                  />
                </label>
              </div>

              <label className="form-control">
                <span className="label-text">Sujet</span>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="select select-bordered"
                  required
                >
                  <option value="">Sélectionnez un sujet</option>
                  <option value="achat">Achat d&apos;un véhicule</option>
                  <option value="reprise">Reprise / Dépôt-vente</option>
                  <option value="recherche">Recherche personnalisée</option>
                  <option value="autre">Autre</option>
                </select>
              </label>

              <label className="form-control">
                <span className="label-text">Message</span>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="textarea textarea-bordered min-h-[140px]"
                  placeholder="Décrivez votre projet..."
                  required
                />
              </label>

              <button className="btn btn-accent">
                Envoyer
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-base-200 via-base-100 to-accent/10 py-16">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-primary">FAQ</p>
            <h2 className="mt-3 text-3xl font-semibold">Questions fréquentes</h2>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {faqItems.map((item, index) => (
              <details key={index} className="collapse collapse-plus bg-base-100 shadow">
                <summary className="collapse-title text-base font-medium">
                  {item.question}
                </summary>
                <div className="collapse-content text-base-content/70">
                  <p>{item.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

export default Contact
