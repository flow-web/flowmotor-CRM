import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, User, ArrowRight } from 'lucide-react'

/**
 * Login - Page de connexion Espace Pro
 * 
 * Design:
 * - Fond total bg-aubergine
 * - Carte centrale bg-cream élégante
 * - Logo blanc FLOW MOTOR
 * - Formulaire avec redirection vers /admin
 */
function Login() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Simulation de connexion (sans vérification pour le moment)
    console.log('Connexion avec:', formData)
    
    // Redirection vers l'admin
    navigate('/admin')
  }

  return (
    <main className="min-h-screen bg-aubergine flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Motif décoratif en arrière-plan */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'url(/assets/pattern-tires.svg)',
          backgroundRepeat: 'repeat',
          backgroundSize: '200px'
        }}
      />

      {/* Carte de connexion */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-cream rounded-2xl shadow-2xl p-8 md:p-12 border-2 border-brown/20">
          
          {/* Logo et titre */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-6">
              <img 
                src="/assets/engine-white.svg" 
                alt="Flow Motor" 
                className="h-12 w-auto brightness-0"
              />
              <span className="font-playfair text-2xl font-bold text-aubergine tracking-wide">
                FLOW MOTOR
              </span>
            </div>
            
            <h1 className="font-playfair text-3xl text-aubergine font-bold mb-2">
              Espace Pro
            </h1>
            <p className="font-roboto text-aubergine/60 text-sm">
              Connectez-vous pour accéder au Cockpit
            </p>
          </div>

          {/* Formulaire de connexion */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Champ Identifiant */}
            <div>
              <label className="block font-roboto text-sm font-bold text-aubergine mb-2">
                Identifiant
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-aubergine/40">
                  <User size={20} />
                </div>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  placeholder="votre.identifiant"
                  className="w-full pl-12 pr-4 py-3 bg-white border-2 border-aubergine/20 rounded-xl font-roboto text-aubergine placeholder:text-aubergine/40 focus:outline-none focus:border-brown transition-colors"
                />
              </div>
            </div>

            {/* Champ Mot de passe */}
            <div>
              <label className="block font-roboto text-sm font-bold text-aubergine mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-aubergine/40">
                  <Lock size={20} />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3 bg-white border-2 border-aubergine/20 rounded-xl font-roboto text-aubergine placeholder:text-aubergine/40 focus:outline-none focus:border-brown transition-colors"
                />
              </div>
            </div>

            {/* Bouton de connexion */}
            <button
              type="submit"
              className="w-full min-h-[56px] bg-brown text-cream rounded-xl font-roboto font-bold text-lg flex items-center justify-center gap-3 hover:bg-brown/90 active:scale-[0.98] transition-all duration-200 shadow-lg hover:shadow-xl group btn-shine"
            >
              Accéder au Cockpit
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </form>

          {/* Lien mot de passe oublié (optionnel) */}
          <div className="text-center mt-6">
            <a 
              href="#"
              className="font-roboto text-sm text-aubergine/60 hover:text-brown transition-colors"
            >
              Mot de passe oublié ?
            </a>
          </div>

          {/* Séparateur */}
          <div className="my-8 border-t border-aubergine/10"></div>

          {/* Message d'accès réservé */}
          <div className="text-center">
            <p className="font-roboto text-xs text-aubergine/50 leading-relaxed">
              🔒 Accès réservé aux administrateurs FLOW MOTOR
            </p>
          </div>
        </div>

        {/* Lien retour vers l'accueil */}
        <div className="text-center mt-6">
          <a 
            href="/"
            className="font-roboto text-sm text-cream/70 hover:text-cream transition-colors"
          >
            ← Retour au site
          </a>
        </div>
      </div>

      {/* Décoration : Cercles en arrière-plan */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-brown/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-brown/10 rounded-full blur-3xl"></div>
    </main>
  )
}

export default Login
