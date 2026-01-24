import { useState } from 'react'
import { Phone, Mail, MapPin, Send, CheckCircle2, ChevronDown } from 'lucide-react'

/**
 * Contact - Page de contact conciergerie FLOW MOTOR
 * 
 * Design:
 * - 2 colonnes Desktop (Infos | Formulaire)
 * - Formulaire haut de gamme avec dropdown Sujet
 * - FAQ Rapide en bas de page
 * - road.svg en filigrane
 */
function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const [submitted, setSubmitted] = useState(false)
  const [expandedFaq, setExpandedFaq] = useState(null)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Formulaire contact:', formData)
    
    // Afficher le message de succès
    setSubmitted(true)
    
    // Réinitialiser après 4 secondes
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ name: '', email: '', subject: '', message: '' })
    }, 4000)
  }

  const faqItems = [
    {
      question: 'Quels sont les délais d\'importation ?',
      answer: 'Pour un véhicule en provenance de Suisse, comptez 2 à 3 semaines. Depuis le Japon, 6 à 8 semaines (incluant transport maritime, dédouanement et préparation).'
    },
    {
      question: 'Quelles garanties sont incluses ?',
      answer: 'Chaque véhicule est expertisé en 12 points par nos mécaniciens. Garantie mécanique 6 mois incluse, extensible jusqu\'à 24 mois. Historique Carfax fourni.'
    },
    {
      question: 'Proposez-vous la livraison à domicile ?',
      answer: 'Oui, livraison partout en France et en Suisse. Transport sécurisé en camion fermé. Prise en charge aéroport possible pour les clients internationaux.'
    }
  ]

  return (
    <main className="bg-cream relative min-h-screen">
      {/* road.svg en filigrane */}
      <div 
        className="fixed inset-0 opacity-[0.05] pointer-events-none z-0"
        style={{
          backgroundImage: 'url(/assets/road.svg)',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center bottom',
          backgroundSize: 'cover'
        }}
      />

      {/* Contenu principal - Espaces doublés */}
      <div className="relative z-10 py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          
          {/* ===== HEADER DE PAGE ===== */}
          <div className="text-center mb-14 md:mb-20">
            <span className="text-brown font-roboto text-sm uppercase tracking-widest">
              Conciergerie Automobile
            </span>
            <h1 className="font-playfair text-4xl md:text-5xl text-aubergine font-bold mt-3 mb-4">
              Parlons de votre Projet
            </h1>
            <p className="font-roboto text-aubergine/70 text-lg max-w-2xl mx-auto leading-relaxed">
              Notre équipe d'experts est à votre écoute pour vous accompagner dans votre recherche 
              du véhicule d'exception ou la vente de votre automobile.
            </p>
          </div>

          {/* ===== GRILLE 2 COLONNES (DESKTOP) ===== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-20">
            
            {/* ===== COLONNE GAUCHE : INFORMATIONS ===== */}
            <div className="space-y-8">
              
              {/* Bloc Titre */}
              <div>
                <h2 className="font-playfair text-3xl md:text-4xl text-aubergine font-bold mb-4">
                  Contactez-nous
                </h2>
                <p className="font-roboto text-aubergine/70 leading-relaxed">
                  Que ce soit pour l'achat d'un véhicule de prestige, une reprise ou une recherche 
                  personnalisée, nous sommes là pour vous conseiller.
                </p>
              </div>

              {/* Coordonnées avec icônes */}
              <div className="space-y-6">
                
                {/* Téléphone Lyon */}
                <div className="flex items-start gap-4 p-5 bg-white rounded-xl border border-aubergine/10 shadow-md hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-brown/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="text-brown" size={22} />
                  </div>
                  <div>
                    <p className="font-roboto text-xs text-aubergine/60 uppercase tracking-wider mb-1">
                      Expertise Lyon
                    </p>
                    <a 
                      href="tel:+33412345678"
                      className="font-roboto text-lg font-bold text-aubergine hover:text-brown transition-colors"
                    >
                      +33 4 12 34 56 78
                    </a>
                  </div>
                </div>

                {/* Téléphone Genève */}
                <div className="flex items-start gap-4 p-5 bg-white rounded-xl border border-aubergine/10 shadow-md hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-brown/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="text-brown" size={22} />
                  </div>
                  <div>
                    <p className="font-roboto text-xs text-aubergine/60 uppercase tracking-wider mb-1">
                      Expertise Genève
                    </p>
                    <a 
                      href="tel:+41221234567"
                      className="font-roboto text-lg font-bold text-aubergine hover:text-brown transition-colors"
                    >
                      +41 22 123 45 67
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4 p-5 bg-white rounded-xl border border-aubergine/10 shadow-md hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-brown/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="text-brown" size={22} />
                  </div>
                  <div>
                    <p className="font-roboto text-xs text-aubergine/60 uppercase tracking-wider mb-1">
                      Email
                    </p>
                    <a 
                      href="mailto:contact@flowmotor.fr"
                      className="font-roboto text-lg font-bold text-aubergine hover:text-brown transition-colors"
                    >
                      contact@flowmotor.fr
                    </a>
                  </div>
                </div>

                {/* Adresse */}
                <div className="flex items-start gap-4 p-5 bg-white rounded-xl border border-aubergine/10 shadow-md hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-brown/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-brown" size={22} />
                  </div>
                  <div>
                    <p className="font-roboto text-xs text-aubergine/60 uppercase tracking-wider mb-1">
                      Nos Showrooms
                    </p>
                    <p className="font-roboto text-aubergine/80 leading-relaxed">
                      Lyon, France<br />
                      Genève, Suisse
                    </p>
                  </div>
                </div>
              </div>

              {/* Horaires */}
              <div className="bg-aubergine/5 rounded-xl p-6 border border-aubergine/10">
                <h3 className="font-roboto text-sm font-bold text-aubergine uppercase tracking-wider mb-3">
                  Horaires d'ouverture
                </h3>
                <div className="space-y-2 font-roboto text-sm text-aubergine/70">
                  <div className="flex justify-between">
                    <span>Lundi - Vendredi</span>
                    <span className="font-medium text-aubergine">9h - 19h</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Samedi</span>
                    <span className="font-medium text-aubergine">10h - 18h</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dimanche</span>
                    <span className="font-medium text-aubergine/50">Sur rendez-vous</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ===== COLONNE DROITE : FORMULAIRE ===== */}
            <div>
              <div className="glass-effect rounded-2xl p-8 md:p-10 shadow-xl border border-aubergine/10">
                
                {submitted ? (
                  // Message de succès
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="text-white" size={40} />
                    </div>
                    <h3 className="font-playfair text-3xl text-aubergine font-bold mb-4">
                      Message envoyé !
                    </h3>
                    <p className="font-roboto text-aubergine/70 text-lg leading-relaxed">
                      Merci, un expert FLOW MOTOR vous recontactera sous <strong>24h</strong>.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Titre du formulaire */}
                    <div className="mb-8">
                      <h3 className="font-playfair text-2xl text-aubergine font-bold mb-2">
                        Envoyez-nous un message
                      </h3>
                      <p className="font-roboto text-sm text-aubergine/60">
                        Tous les champs sont obligatoires
                      </p>
                    </div>

                    {/* Formulaire */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                      
                      {/* Nom complet */}
                      <div>
                        <label className="block font-roboto text-sm font-bold text-aubergine mb-2">
                          Nom complet <span className="text-brown">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="Jean Dupont"
                          className="w-full px-4 py-4 bg-cream/30 border border-aubergine/10 rounded-xl font-roboto text-aubergine placeholder:text-aubergine/40 focus:outline-none focus:border-brown focus:ring-0 transition-colors"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block font-roboto text-sm font-bold text-aubergine mb-2">
                          Email <span className="text-brown">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="jean.dupont@email.fr"
                          className="w-full px-4 py-4 bg-cream/30 border border-aubergine/10 rounded-xl font-roboto text-aubergine placeholder:text-aubergine/40 focus:outline-none focus:border-brown focus:ring-0 transition-colors"
                        />
                      </div>

                      {/* Sujet (Dropdown) */}
                      <div>
                        <label className="block font-roboto text-sm font-bold text-aubergine mb-2">
                          Sujet <span className="text-brown">*</span>
                        </label>
                        <div className="relative">
                          <select
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-4 bg-cream/30 border border-aubergine/10 rounded-xl font-roboto text-aubergine appearance-none focus:outline-none focus:border-brown focus:ring-0 transition-colors cursor-pointer"
                          >
                            <option value="">Sélectionnez un sujet</option>
                            <option value="achat">Achat d'un véhicule</option>
                            <option value="reprise">Reprise / Dépôt-vente</option>
                            <option value="recherche">Recherche personnalisée</option>
                            <option value="atelier">Préparation / Atelier</option>
                            <option value="autre">Autre demande</option>
                          </select>
                          <ChevronDown 
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-aubergine/40 pointer-events-none" 
                            size={20} 
                          />
                        </div>
                      </div>

                      {/* Message */}
                      <div>
                        <label className="block font-roboto text-sm font-bold text-aubergine mb-2">
                          Message <span className="text-brown">*</span>
                        </label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          rows="6"
                          placeholder="Décrivez-nous votre projet ou votre demande..."
                          className="w-full px-4 py-4 bg-cream/30 border border-aubergine/10 rounded-xl font-roboto text-aubergine placeholder:text-aubergine/40 focus:outline-none focus:border-brown focus:ring-0 transition-colors resize-none"
                        />
                      </div>

                      {/* Bouton Submit */}
                      <button
                        type="submit"
                        className="w-full min-h-[56px] bg-aubergine text-cream rounded-xl font-roboto font-bold text-base uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-brown active:scale-[0.98] transition-all duration-300 shadow-lg hover:shadow-xl btn-shine"
                      >
                        <Send size={20} className="transition-transform group-hover:rotate-12" />
                        Envoyer le message
                      </button>

                      {/* Mention RGPD */}
                      <p className="text-center font-roboto text-xs text-aubergine/50 leading-relaxed">
                        En envoyant ce formulaire, vous acceptez que vos données soient utilisées 
                        pour vous recontacter. Elles ne seront jamais partagées avec des tiers.
                      </p>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* ===== FAQ RAPIDE ===== */}
          <section className="mb-12">
            <div className="text-center mb-10">
              <span className="text-brown font-roboto text-sm uppercase tracking-widest">
                Réponses Rapides
              </span>
              <h2 className="font-playfair text-3xl md:text-4xl text-aubergine font-bold mt-3">
                Questions Fréquentes
              </h2>
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
              {faqItems.map((item, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-xl border border-aubergine/10 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-cream/30 active:bg-cream/40 transition-colors"
                  >
                    <span className="font-roboto font-bold text-aubergine pr-4">
                      {item.question}
                    </span>
                    <ChevronDown 
                      className={`text-brown flex-shrink-0 transition-transform duration-400 ease-out ${
                        expandedFaq === index ? 'rotate-180' : ''
                      }`}
                      size={20}
                    />
                  </button>
                  
                  {/* Contenu FAQ avec animation */}
                  <div 
                    className={`
                      overflow-hidden transition-all duration-400 ease-out
                      ${expandedFaq === index ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}
                    `}
                  >
                    <div className="px-6 pb-5 pt-2">
                      <p className="font-roboto text-aubergine/70 leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}

export default Contact
