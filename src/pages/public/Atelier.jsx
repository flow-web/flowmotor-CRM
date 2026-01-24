import { useState } from 'react'
import { 
  Banknote, 
  Camera, 
  Shield, 
  TrendingUp, 
  Users, 
  FileCheck,
  Sparkles,
  CheckCircle2,
  Send
} from 'lucide-react'
import Modal from '../../components/Modal'

/**
 * Atelier (Reprise & Dépôt-Vente) - Page de conciergerie automobile premium
 * 
 * Features:
 * - Section Hero avec proposition de valeur
 * - 2 formules élégantes (Reprise Cash / Dépôt-Vente Premium)
 * - Formulaire de dépôt simplifié avec validation juridique
 * - Modal des conditions de dépôt-vente
 * - Design avec engine-brown.svg en filigrane
 */
function Atelier() {
  // État du formulaire
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
  
  // État pour le modal des conditions
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // État pour la validation juridique
  const [acceptedConditions, setAcceptedConditions] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Vérification que les conditions sont acceptées
    if (!acceptedConditions) {
      alert('Veuillez accepter les conditions de dépôt-vente pour continuer.')
      return
    }
    
    // Simulation de soumission
    console.log('Formulaire soumis:', formData)
    setSubmitted(true)
    
    // Réinitialiser après 3 secondes
    setTimeout(() => {
      setSubmitted(false)
      setFormData({
        brand: '', model: '', year: '', mileage: '', 
        options: '', desiredPrice: '', name: '', email: '', phone: ''
      })
      setAcceptedConditions(false) // Réinitialiser la checkbox
    }, 3000)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <main className="bg-cream relative min-h-screen">
      {/* Engine-brown.svg en filigrane (expertise technique) */}
      <div 
        className="fixed inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{
          backgroundImage: 'url(/assets/engine-white.svg)',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right center',
          backgroundSize: '50%'
        }}
      />

      {/* Contenu principal */}
      <div className="relative z-10">
        
        {/* ===== SECTION HERO ===== */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          {/* Image de fond */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1600&q=80"
              alt="Véhicule de luxe"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/50"></div>
          </div>

          {/* Contenu Hero */}
          <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="max-w-3xl">
              <span className="inline-block px-4 py-2 bg-brown text-cream text-xs font-roboto font-bold uppercase tracking-wider rounded-md mb-6">
                Service de Conciergerie Automobile
              </span>
              
              <h1 className="font-playfair text-4xl md:text-6xl text-cream font-bold leading-tight mb-6">
                Confiez-nous<br />
                <span className="text-cream/80">votre Exception</span>
              </h1>
              
              <p className="font-roboto text-lg md:text-xl text-cream/90 leading-relaxed mb-8">
                FLOW MOTOR vous accompagne dans la vente de votre véhicule de prestige. 
                Service de conciergerie sur-mesure, multidiffusion professionnelle et 
                sécurisation totale du paiement.
              </p>

              {/* 3 Arguments clés */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/20">
                  <Shield className="text-brown mb-3" size={28} />
                  <p className="font-roboto text-sm text-cream font-medium">
                    Paiement 100% sécurisé
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/20">
                  <TrendingUp className="text-brown mb-3" size={28} />
                  <p className="font-roboto text-sm text-cream font-medium">
                    Prix au juste marché
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/20">
                  <Users className="text-brown mb-3" size={28} />
                  <p className="font-roboto text-sm text-cream font-medium">
                    Réseau d'acheteurs VIP
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== LES 2 FORMULES ===== */}
        <section className="py-32 md:py-40">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            
            {/* Titre section */}
            <div className="text-center mb-14 md:mb-20">
              <span className="text-brown font-roboto text-sm uppercase tracking-widest">
                Deux Solutions Premium
              </span>
              <h2 className="font-playfair text-3xl md:text-5xl text-aubergine font-bold mt-3 mb-4">
                Choisissez votre Formule
              </h2>
              <p className="font-roboto text-aubergine/70 text-lg max-w-2xl mx-auto">
                Que vous recherchiez la simplicité d'une reprise immédiate ou l'optimisation 
                d'un dépôt-vente sur-mesure, nous avons la solution adaptée.
              </p>
            </div>

            {/* Grille 2 colonnes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* ===== FORMULE 1 : REPRISE CASH ===== */}
              <div className="group relative bg-white rounded-2xl p-8 md:p-10 shadow-xl border-2 border-aubergine/10 hover:border-brown/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                {/* Badge */}
                <div className="absolute -top-4 left-8">
                  <span className="inline-block px-4 py-2 bg-brown text-cream text-xs font-roboto font-bold uppercase tracking-wider rounded-lg shadow-lg">
                    Solution Express
                  </span>
                </div>

                {/* Icône */}
                <div className="w-16 h-16 bg-brown/10 rounded-xl flex items-center justify-center mb-6 mt-4">
                  <Banknote className="text-brown" size={32} />
                </div>

                {/* Titre */}
                <h3 className="font-playfair text-3xl text-aubergine font-bold mb-4">
                  Reprise Cash
                </h3>

                {/* Description */}
                <p className="font-roboto text-aubergine/70 text-base leading-relaxed mb-6">
                  Vendez votre véhicule en toute sérénité. Notre équipe d'experts évalue 
                  votre voiture et vous propose un prix de rachat immédiat.
                </p>

                {/* Liste d'avantages */}
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="text-brown flex-shrink-0 mt-0.5" size={20} />
                    <span className="font-roboto text-aubergine/80">
                      <strong>Paiement immédiat</strong> sous 48h maximum
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="text-brown flex-shrink-0 mt-0.5" size={20} />
                    <span className="font-roboto text-aubergine/80">
                      <strong>Zéro démarche administrative</strong> de votre part
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="text-brown flex-shrink-0 mt-0.5" size={20} />
                    <span className="font-roboto text-aubergine/80">
                      <strong>Rachat direct</strong> par FLOW MOTOR
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="text-brown flex-shrink-0 mt-0.5" size={20} />
                    <span className="font-roboto text-aubergine/80">
                      <strong>Expertise gratuite</strong> à domicile possible
                    </span>
                  </li>
                </ul>

                {/* Prix indicatif */}
                <div className="bg-cream/50 rounded-xl p-5 mb-6">
                  <p className="font-roboto text-xs text-aubergine/60 uppercase tracking-wider mb-1">
                    Commission
                  </p>
                  <p className="font-playfair text-2xl text-brown font-bold">
                    0 € • Rachat Direct
                  </p>
                </div>

                {/* Bouton CTA */}
                <a 
                  href="#formulaire"
                  className="block w-full min-h-[52px] bg-brown text-cream rounded-xl font-roboto font-bold text-center flex items-center justify-center hover:bg-brown/90 active:scale-[0.98] transition-all duration-200 shadow-lg btn-shine"
                >
                  Demander une évaluation
                </a>
              </div>

              {/* ===== FORMULE 2 : DÉPÔT-VENTE PREMIUM ===== */}
              <div className="group relative bg-gradient-to-br from-aubergine to-brown rounded-2xl p-8 md:p-10 shadow-2xl border-2 border-brown hover:scale-[1.02] transition-all duration-400">
                {/* Badge */}
                <div className="absolute -top-4 left-8">
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-cream text-aubergine text-xs font-roboto font-bold uppercase tracking-wider rounded-lg shadow-lg">
                    <Sparkles size={14} />
                    Recommandé
                  </span>
                </div>

                {/* Icône */}
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-6 mt-4">
                  <Camera className="text-cream" size={32} />
                </div>

                {/* Titre */}
                <h3 className="font-playfair text-3xl text-cream font-bold mb-4">
                  Dépôt-Vente Premium
                </h3>

                {/* Description */}
                <p className="font-roboto text-cream/90 text-base leading-relaxed mb-6">
                  Maximisez la valeur de votre véhicule. Service de conciergerie complet 
                  avec exposition premium et accompagnement jusqu'à la vente.
                </p>

                {/* Liste d'avantages */}
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="text-cream flex-shrink-0 mt-0.5" size={20} />
                    <span className="font-roboto text-cream/95">
                      <strong>Shooting photo professionnel</strong> en studio
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="text-cream flex-shrink-0 mt-0.5" size={20} />
                    <span className="font-roboto text-cream/95">
                      <strong>Exposition sur flowmotor.fr</strong> et réseaux sociaux
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="text-cream flex-shrink-0 mt-0.5" size={20} />
                    <span className="font-roboto text-cream/95">
                      <strong>Gestion complète des visites</strong> et négociations
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="text-cream flex-shrink-0 mt-0.5" size={20} />
                    <span className="font-roboto text-cream/95">
                      <strong>Sécurisation du paiement</strong> et des formalités
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="text-cream flex-shrink-0 mt-0.5" size={20} />
                    <span className="font-roboto text-cream/95">
                      <strong>Multidiffusion</strong> sur plateformes partenaires
                    </span>
                  </li>
                </ul>

                {/* Prix indicatif */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 mb-6 border border-white/20">
                  <p className="font-roboto text-xs text-cream/80 uppercase tracking-wider mb-1">
                    Commission fixe
                  </p>
                  <p className="font-playfair text-2xl text-cream font-bold">
                    3,5 % • Prix optimisé
                  </p>
                </div>

                {/* Bouton CTA */}
                <a 
                  href="#formulaire"
                  className="block w-full min-h-[52px] bg-cream text-aubergine rounded-xl font-roboto font-bold text-center flex items-center justify-center hover:bg-white active:scale-[0.98] transition-all duration-200 shadow-xl"
                >
                  Déposer mon véhicule
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ===== FORMULAIRE DE DÉPÔT ===== */}
        <section id="formulaire" className="py-32 md:py-40 bg-gradient-to-b from-cream to-white">
          <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
            
            {/* Titre section */}
            <div className="text-center mb-12">
              <span className="text-brown font-roboto text-sm uppercase tracking-widest">
                Formulaire de Contact
              </span>
              <h2 className="font-playfair text-3xl md:text-5xl text-aubergine font-bold mt-3 mb-4">
                Estimez votre Véhicule
              </h2>
              <p className="font-roboto text-aubergine/70 text-lg max-w-2xl mx-auto">
                Remplissez ce formulaire pour recevoir une première estimation gratuite 
                et sans engagement de votre véhicule de prestige.
              </p>
            </div>

            {/* Formulaire */}
            <div className="bg-white rounded-2xl p-8 md:p-12 shadow-2xl border border-aubergine/10">
              {submitted ? (
                // Message de confirmation
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="text-white" size={40} />
                  </div>
                  <h3 className="font-playfair text-3xl text-aubergine font-bold mb-4">
                    Demande envoyée !
                  </h3>
                  <p className="font-roboto text-aubergine/70 text-lg">
                    Notre équipe vous contactera sous 24h pour une première évaluation.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Marque / Modèle (côte à côte) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-roboto text-sm font-bold text-aubergine mb-2">
                        Marque <span className="text-brown">*</span>
                      </label>
                      <input
                        type="text"
                        name="brand"
                        value={formData.brand}
                        onChange={handleChange}
                        required
                        placeholder="Ex: Porsche"
                        className="w-full px-4 py-3 bg-cream/50 border border-aubergine/20 rounded-xl font-roboto text-aubergine placeholder:text-aubergine/40 focus:outline-none focus:border-brown transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block font-roboto text-sm font-bold text-aubergine mb-2">
                        Modèle <span className="text-brown">*</span>
                      </label>
                      <input
                        type="text"
                        name="model"
                        value={formData.model}
                        onChange={handleChange}
                        required
                        placeholder="Ex: 911 GT3"
                        className="w-full px-4 py-3 bg-cream/50 border border-aubergine/20 rounded-xl font-roboto text-aubergine placeholder:text-aubergine/40 focus:outline-none focus:border-brown transition-colors"
                      />
                    </div>
                  </div>

                  {/* Année / Kilométrage (côte à côte) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-roboto text-sm font-bold text-aubergine mb-2">
                        Année <span className="text-brown">*</span>
                      </label>
                      <input
                        type="number"
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        required
                        placeholder="Ex: 2022"
                        min="1990"
                        max="2025"
                        className="w-full px-4 py-3 bg-cream/50 border border-aubergine/20 rounded-xl font-roboto text-aubergine placeholder:text-aubergine/40 focus:outline-none focus:border-brown transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block font-roboto text-sm font-bold text-aubergine mb-2">
                        Kilométrage <span className="text-brown">*</span>
                      </label>
                      <input
                        type="number"
                        name="mileage"
                        value={formData.mileage}
                        onChange={handleChange}
                        required
                        placeholder="Ex: 15000"
                        className="w-full px-4 py-3 bg-cream/50 border border-aubergine/20 rounded-xl font-roboto text-aubergine placeholder:text-aubergine/40 focus:outline-none focus:border-brown transition-colors"
                      />
                    </div>
                  </div>

                  {/* Options marquantes */}
                  <div>
                    <label className="block font-roboto text-sm font-bold text-aubergine mb-2">
                      Options marquantes
                    </label>
                    <textarea
                      name="options"
                      value={formData.options}
                      onChange={handleChange}
                      rows="3"
                      placeholder="Ex: Pack Carbone, Sièges Sport, Échappement Akrapovic..."
                      className="w-full px-4 py-3 bg-cream/50 border border-aubergine/20 rounded-xl font-roboto text-aubergine placeholder:text-aubergine/40 focus:outline-none focus:border-brown transition-colors resize-none"
                    />
                  </div>

                  {/* Prix souhaité */}
                  <div>
                    <label className="block font-roboto text-sm font-bold text-aubergine mb-2">
                      Votre prix souhaité <span className="text-brown">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="desiredPrice"
                        value={formData.desiredPrice}
                        onChange={handleChange}
                        required
                        placeholder="Ex: 180000"
                        className="w-full px-4 py-3 pr-12 bg-cream/50 border border-aubergine/20 rounded-xl font-roboto text-aubergine placeholder:text-aubergine/40 focus:outline-none focus:border-brown transition-colors"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 font-roboto text-aubergine/60">
                        €
                      </span>
                    </div>
                  </div>

                  {/* Séparateur */}
                  <div className="border-t border-aubergine/10 pt-6 mt-8">
                    <p className="font-roboto text-sm text-aubergine/60 mb-4">
                      Vos coordonnées pour l'estimation
                    </p>
                  </div>

                  {/* Nom / Email / Téléphone */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block font-roboto text-sm font-bold text-aubergine mb-2">
                        Nom <span className="text-brown">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Votre nom"
                        className="w-full px-4 py-3 bg-cream/50 border border-aubergine/20 rounded-xl font-roboto text-aubergine placeholder:text-aubergine/40 focus:outline-none focus:border-brown transition-colors"
                      />
                    </div>
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
                        placeholder="votre@email.fr"
                        className="w-full px-4 py-3 bg-cream/50 border border-aubergine/20 rounded-xl font-roboto text-aubergine placeholder:text-aubergine/40 focus:outline-none focus:border-brown transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block font-roboto text-sm font-bold text-aubergine mb-2">
                        Téléphone <span className="text-brown">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="06 12 34 56 78"
                        className="w-full px-4 py-3 bg-cream/50 border border-aubergine/20 rounded-xl font-roboto text-aubergine placeholder:text-aubergine/40 focus:outline-none focus:border-brown transition-colors"
                      />
                    </div>
                  </div>

                  {/* ===== VALIDATION JURIDIQUE ===== */}
                  <div className="mt-8 p-6 bg-aubergine/5 rounded-xl border border-aubergine/10">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={acceptedConditions}
                        onChange={(e) => setAcceptedConditions(e.target.checked)}
                        className="mt-1 w-5 h-5 rounded border-2 border-aubergine/30 text-brown focus:ring-2 focus:ring-brown/20 cursor-pointer transition-all"
                      />
                      <span className="font-roboto text-sm text-aubergine/80 leading-relaxed">
                        J'ai lu et j'accepte les{' '}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault()
                            setIsModalOpen(true)
                          }}
                          className="text-brown font-semibold hover:text-brown/80 underline underline-offset-2 transition-colors"
                        >
                          Conditions de Dépôt-Vente
                        </button>
                        {' '}et donne mandat à FLOW MOTOR pour la vente de mon véhicule.
                      </span>
                    </label>
                  </div>

                  {/* Bouton Submit */}
                  <button
                    type="submit"
                    disabled={!acceptedConditions}
                    className={`
                      w-full min-h-[56px] rounded-xl font-roboto font-bold text-lg flex items-center justify-center gap-3 transition-all duration-200 shadow-lg mt-6
                      ${acceptedConditions 
                        ? 'bg-brown text-cream hover:bg-brown/90 hover:shadow-xl active:scale-[0.98] btn-shine cursor-pointer' 
                        : 'bg-aubergine/20 text-aubergine/40 cursor-not-allowed'
                      }
                    `}
                  >
                    <Send size={20} className={acceptedConditions ? 'transition-transform group-hover:rotate-12' : ''} />
                    Envoyer ma demande d'estimation
                  </button>

                  {/* Mention légale */}
                  <p className="text-center font-roboto text-xs text-aubergine/50 mt-4">
                    Vos données sont traitées de manière confidentielle et ne seront jamais revendues.
                  </p>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* ===== SECTION POURQUOI NOUS ===== */}
        <section className="py-32 md:py-40 bg-aubergine">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="text-center mb-14">
              <h2 className="font-playfair text-3xl md:text-5xl text-cream font-bold mb-5">
                Pourquoi choisir FLOW MOTOR ?
              </h2>
              <p className="font-roboto text-cream/80 text-lg max-w-2xl mx-auto leading-relaxed">
                Une expertise reconnue dans l'import et la vente de véhicules de prestige.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {/* Avantage 1 */}
              <div className="group bg-white/10 backdrop-blur-sm rounded-xl p-8 md:p-10 border border-white/20 text-center hover:bg-white/15 transition-all duration-300">
                <div className="w-16 h-16 bg-brown rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <FileCheck className="text-cream" size={28} />
                </div>
                <h3 className="font-playfair text-2xl text-cream font-bold mb-4">
                  Expertise Certifiée
                </h3>
                <p className="font-roboto text-cream/80 leading-relaxed">
                  Chaque véhicule est expertisé par nos mécaniciens spécialisés en 
                  véhicules de prestige (Porsche, Audi RS, BMW M).
                </p>
              </div>

              {/* Avantage 2 */}
              <div className="group bg-white/10 backdrop-blur-sm rounded-xl p-8 md:p-10 border border-white/20 text-center hover:bg-white/15 transition-all duration-300">
                <div className="w-16 h-16 bg-brown rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="text-cream" size={28} />
                </div>
                <h3 className="font-playfair text-2xl text-cream font-bold mb-4">
                  Paiement Sécurisé
                </h3>
                <p className="font-roboto text-cream/80 leading-relaxed">
                  Transaction 100% sécurisée avec garantie bancaire. Zéro risque 
                  pour le vendeur et l'acheteur.
                </p>
              </div>

              {/* Avantage 3 */}
              <div className="group bg-white/10 backdrop-blur-sm rounded-xl p-8 md:p-10 border border-white/20 text-center hover:bg-white/15 transition-all duration-300">
                <div className="w-16 h-16 bg-brown rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users className="text-cream" size={28} />
                </div>
                <h3 className="font-playfair text-2xl text-cream font-bold mb-4">
                  Réseau Premium
                </h3>
                <p className="font-roboto text-cream/80 leading-relaxed">
                  Accès à notre réseau d'acheteurs passionnés et collectionneurs 
                  en France, Suisse et Europe.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ===== MODAL CONDITIONS DE DÉPÔT-VENTE ===== */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Conditions de Dépôt-Vente"
      >
        <div className="font-roboto text-sm text-aubergine/80 space-y-6 leading-relaxed">
          
          {/* Article 1 */}
          <section className="space-y-3">
            <h3 className="font-playfair text-xl text-aubergine font-bold">
              Article 1 - Nature du Contrat
            </h3>
            <p>
              Le présent contrat a pour objet de confier à <span className="font-semibold text-aubergine">FLOW MOTOR</span>, 
              ci-après dénommé "le mandataire", la mission de rechercher un acquéreur pour le véhicule 
              décrit ci-après et appartenant au déposant, ci-après dénommé "le mandant".
            </p>
            <p>
              Le mandataire agit en qualité d'intermédiaire et ne devient à aucun moment propriétaire 
              du véhicule. La vente sera conclue directement entre le mandant et l'acquéreur final.
            </p>
          </section>

          {/* Article 2 */}
          <section className="space-y-3">
            <h3 className="font-playfair text-xl text-aubergine font-bold">
              Article 2 - Déclarations du Mandant
            </h3>
            <p>Le mandant déclare et garantit :</p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li>Être le propriétaire légitime et exclusif du véhicule déposé</li>
              <li>Que le véhicule n'est grevé d'aucun gage, nantissement ou opposition</li>
              <li>Que les informations communiquées sur l'état et l'historique du véhicule sont exactes</li>
              <li>Avoir le pouvoir de vendre le véhicule et de donner mandat à FLOW MOTOR</li>
              <li>Que le véhicule est couvert par une assurance en cours de validité</li>
            </ul>
          </section>

          {/* Article 3 */}
          <section className="space-y-3">
            <h3 className="font-playfair text-xl text-aubergine font-bold">
              Article 3 - Engagements du Mandataire
            </h3>
            <p>FLOW MOTOR s'engage à :</p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li>Mettre en œuvre tous les moyens appropriés pour rechercher un acquéreur</li>
              <li>Assurer la promotion du véhicule via ses canaux de diffusion (site web, réseaux sociaux, partenaires)</li>
              <li>Réaliser un reportage photographique professionnel du véhicule</li>
              <li>Gérer les demandes de renseignements et organiser les visites avec les acquéreurs potentiels</li>
              <li>Vérifier la solvabilité des acquéreurs potentiels</li>
              <li>Assister le mandant lors de la conclusion de la vente</li>
            </ul>
          </section>

          {/* Article 4 */}
          <section className="space-y-3">
            <h3 className="font-playfair text-xl text-aubergine font-bold">
              Article 4 - Prix de Vente et Commission
            </h3>
            <p>
              Le prix de vente du véhicule est fixé d'un commun accord entre le mandant et le mandataire. 
              Ce prix pourra être révisé à tout moment par accord mutuel.
            </p>
            <p>
              En contrepartie de ses services, le mandataire percevra une commission de 
              <span className="font-bold text-brown"> 3,5% TTC</span> du prix de vente net du véhicule, 
              payable uniquement en cas de vente effective.
            </p>
            <p className="font-semibold text-aubergine">
              Aucun frais ne sera facturé au mandant en cas de non-vente du véhicule pendant la durée du mandat.
            </p>
          </section>

          {/* Article 5 */}
          <section className="space-y-3">
            <h3 className="font-playfair text-xl text-aubergine font-bold">
              Article 5 - Durée et Résiliation
            </h3>
            <p>
              Le présent mandat est conclu pour une durée de <span className="font-semibold">90 jours</span> 
              à compter de la signature. Il pourra être renouvelé par accord mutuel.
            </p>
            <p>
              Chaque partie pourra résilier le présent contrat à tout moment moyennant un préavis de 
              <span className="font-semibold"> 15 jours</span> adressé par email ou courrier recommandé avec accusé de réception.
            </p>
            <p>
              En cas de résiliation anticipée par le mandant après la présentation d'un acquéreur potentiel 
              par FLOW MOTOR, et si la vente est conclue dans les 3 mois suivant la résiliation avec cet acquéreur, 
              la commission restera due au mandataire.
            </p>
          </section>

          {/* Article 6 */}
          <section className="space-y-3">
            <h3 className="font-playfair text-xl text-aubergine font-bold">
              Article 6 - Protection des Données
            </h3>
            <p>
              Les données personnelles collectées dans le cadre du présent contrat sont traitées conformément 
              au Règlement Général sur la Protection des Données (RGPD). Elles sont utilisées exclusivement 
              pour l'exécution du mandat et ne sont jamais transmises à des tiers à des fins commerciales.
            </p>
          </section>

          {/* Article 7 */}
          <section className="space-y-3">
            <h3 className="font-playfair text-xl text-aubergine font-bold">
              Article 7 - Droit Applicable
            </h3>
            <p>
              Le présent contrat est soumis au droit français. En cas de litige, les parties s'engagent 
              à rechercher une solution amiable avant toute action judiciaire. À défaut, les tribunaux 
              compétents seront ceux du lieu du siège social de FLOW MOTOR.
            </p>
          </section>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-aubergine/20">
            <p className="text-xs text-aubergine/60 text-center">
              Document contractuel • FLOW MOTOR • Dernière mise à jour : Janvier 2026
            </p>
          </div>
        </div>
      </Modal>
    </main>
  )
}

export default Atelier
