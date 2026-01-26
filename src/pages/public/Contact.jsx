import { useState } from 'react'
import { Phone, Mail, MapPin, Send, ChevronDown } from 'lucide-react'

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [openFaq, setOpenFaq] = useState(null)

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
      {/* Header Section */}
      <section className="relative overflow-hidden section-spacing">
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent" />

        {/* Watermark */}
        <img
          src="/assets/gears.svg"
          alt=""
          aria-hidden="true"
          className="absolute -right-40 -top-20 w-[500px] h-auto opacity-[0.02] pointer-events-none select-none rotate-45"
          style={{ filter: 'brightness(0)' }}
        />

        <div className="container relative mx-auto px-6">
          <p className="text-xs uppercase tracking-[0.3em] text-primary">Conciergerie automobile</p>
          <h1 className="mt-4 text-4xl font-semibold font-display md:text-5xl">Parlons de votre projet</h1>
          <p className="mt-5 max-w-2xl text-base-content/60 text-lg leading-relaxed">
            Notre équipe vous accompagne pour l&apos;achat, la reprise ou la recherche personnalisée.
          </p>
        </div>
      </section>

      {/* Contact Grid */}
      <section className="container mx-auto grid gap-10 px-6 pb-24 lg:grid-cols-2">
        {/* Contact Info */}
        <div className="space-y-6">
          <div className="card card-premium p-8">
            <h2 className="text-2xl font-semibold font-display mb-6">Contactez-nous</h2>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-primary/8 p-4 flex-shrink-0">
                  <Phone size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-base-content/50 mb-1">Expertise Lyon</p>
                  <a className="text-lg font-semibold hover:text-accent transition-colors" href="tel:+33412345678">
                    +33 4 12 34 56 78
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-primary/8 p-4 flex-shrink-0">
                  <Phone size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-base-content/50 mb-1">Expertise Genève</p>
                  <a className="text-lg font-semibold hover:text-accent transition-colors" href="tel:+41221234567">
                    +41 22 123 45 67
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-primary/8 p-4 flex-shrink-0">
                  <Mail size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-base-content/50 mb-1">Email</p>
                  <a className="text-lg font-semibold hover:text-accent transition-colors" href="mailto:contact@flowmotor.fr">
                    contact@flowmotor.fr
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-primary/8 p-4 flex-shrink-0">
                  <MapPin size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-base-content/50 mb-1">Showrooms</p>
                  <p className="text-base-content/70">Lyon, France</p>
                  <p className="text-base-content/70">Genève, Suisse</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card card-premium p-6">
            <h3 className="text-xs uppercase tracking-[0.2em] text-base-content/50 mb-4">Horaires</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-base-content/70">Lundi - Vendredi</span>
                <span className="font-semibold">9h - 19h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-base-content/70">Samedi</span>
                <span className="font-semibold">10h - 18h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-base-content/50">Dimanche</span>
                <span className="text-base-content/50">Sur rendez-vous</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="card card-premium p-8">
          <h2 className="text-2xl font-semibold font-display mb-6">Envoyez-nous un message</h2>

          {submitted && (
            <div className="mb-6 p-4 bg-green-50 text-green-800 rounded-xl text-sm">
              Merci ! Votre message a bien été envoyé.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="form-control">
                <span className="text-xs uppercase tracking-[0.2em] text-base-content/50 mb-2 block">Nom complet</span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Votre nom"
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
                  placeholder="vous@email.com"
                  className="input-premium w-full bg-base-100"
                  required
                />
              </label>
            </div>

            <label className="form-control">
              <span className="text-xs uppercase tracking-[0.2em] text-base-content/50 mb-2 block">Sujet</span>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="input-premium w-full bg-base-100 cursor-pointer"
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
              <span className="text-xs uppercase tracking-[0.2em] text-base-content/50 mb-2 block">Message</span>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="input-premium w-full bg-base-100 min-h-[140px] resize-none"
                placeholder="Décrivez votre projet..."
                required
              />
            </label>

            <button className="btn bg-[#5C3A2E] border-0 text-white w-full py-4 h-auto rounded-xl hover:bg-[#5C3A2E]/90 shadow-lg shadow-[#5C3A2E]/20 mt-2">
              Envoyer le message
              <Send size={18} />
            </button>
          </form>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-spacing relative overflow-hidden">
        {/* Watermark */}
        <img
          src="/assets/gear-motion.svg"
          alt=""
          aria-hidden="true"
          className="absolute -left-32 bottom-10 w-[400px] h-auto opacity-[0.02] pointer-events-none select-none"
          style={{ filter: 'brightness(0)' }}
        />

        <div className="container relative mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.3em] text-primary">FAQ</p>
            <h2 className="mt-4 text-3xl font-semibold font-display">Questions fréquentes</h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqItems.map((item, index) => (
              <div
                key={index}
                className="card card-premium overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full p-6 flex items-center justify-between text-left"
                >
                  <span className="font-medium pr-4">{item.question}</span>
                  <ChevronDown
                    size={20}
                    className={`flex-shrink-0 text-primary transition-transform duration-300 ${
                      openFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openFaq === index ? 'max-h-40' : 'max-h-0'
                  }`}
                >
                  <p className="px-6 pb-6 text-base-content/60 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

export default Contact
