import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Lock, Mail, ArrowRight, AlertCircle, Shield } from 'lucide-react'
import { useAuth } from '../../admin/context/AuthContext'

/**
 * Login - Page de connexion Admin CRM
 * "Private Club Entrance" — dark luxury design
 * Authentification via Supabase (email + password)
 */
function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isAuthenticated } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const from = location.state?.from?.pathname || '/admin/dashboard'
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, from])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const result = await login(email, password)

    if (result.success) {
      navigate(from, { replace: true })
    } else {
      setError(result.error || 'Echec de la connexion')
    }

    setIsLoading(false)
  }

  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: '#1A0F0F' }}>
      {/* Inline keyframes */}
      <style>{`
        @keyframes fadeScaleIn {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes orbFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(20px, -15px) scale(1.03); }
          66% { transform: translate(-15px, 10px) scale(0.97); }
        }
        @keyframes subtlePulse {
          0%, 100% { opacity: 0.03; }
          50% { opacity: 0.06; }
        }
      `}</style>

      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1A0F0F] via-[#0D0707] to-[#1A0F0F]" />

      {/* Ambient orbs */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
        <div
          className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-[#C4A484]/[0.03] blur-[150px]"
          style={{ animation: 'orbFloat 12s ease-in-out infinite' }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-[#C4A484]/[0.02] blur-[120px]"
          style={{ animation: 'orbFloat 15s ease-in-out infinite reverse' }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-[#E94560]/[0.02] blur-[100px]"
          style={{ animation: 'subtlePulse 4s ease-in-out infinite' }}
        />
      </div>

      {/* Decorative grid pattern */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `
          linear-gradient(rgba(196,164,132,0.4) 1px, transparent 1px),
          linear-gradient(90deg, rgba(196,164,132,0.4) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px'
      }} />

      {/* Login Card — Private Club Entrance */}
      <div
        className="relative z-10 w-full max-w-[420px] px-6"
        style={{ animation: 'fadeScaleIn 0.6s ease-out' }}
      >
        {/* Card */}
        <div className="rounded-2xl border border-[#C4A484]/30 bg-[#1A0F0F]/80 backdrop-blur-2xl shadow-2xl shadow-black/40 overflow-hidden">
          {/* Gold accent line at top */}
          <div className="h-[2px] bg-gradient-to-r from-transparent via-[#C4A484] to-transparent" />

          {/* Header */}
          <div className="px-8 pt-10 pb-2 text-center">
            {/* Logo */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <img
                src="/assets/engine-white.svg"
                alt="Flow Motor"
                className="h-10 w-auto"
              />
              <span className="font-display text-2xl font-semibold text-white tracking-wider">
                FLOW MOTOR
              </span>
            </div>

            {/* Divider with shield icon */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent to-white/10" />
              <Shield size={16} className="text-[#C4A484]/40" />
              <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent to-white/10" />
            </div>

            <h1 className="font-display text-xl text-white mb-1">Espace Pro</h1>
            <p className="text-sm text-white/35 font-sans">
              Connectez-vous a votre cockpit de gestion
            </p>
          </div>

          {/* Form */}
          <div className="px-8 pb-8 pt-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-xl border border-red-500/30 bg-red-500/10 text-sm text-red-400">
                  <AlertCircle size={16} className="flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-xs uppercase tracking-[0.15em] text-white/35 font-sans font-medium">
                  Adresse Email
                </label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20"
                  />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="exemple@flowmotor.fr"
                    required
                    disabled={isLoading}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.05] pl-10 pr-4 py-3 text-sm text-[#F4E8D8] placeholder-white/20 outline-none transition-all duration-300 focus:border-[#C4A484]/50 focus:ring-2 focus:ring-[#C4A484]/20 focus:bg-white/[0.07] font-sans disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-xs uppercase tracking-[0.15em] text-white/35 font-sans font-medium">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20"
                  />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.05] pl-10 pr-4 py-3 text-sm text-[#F4E8D8] placeholder-white/20 outline-none transition-all duration-300 focus:border-[#C4A484]/50 focus:ring-2 focus:ring-[#C4A484]/20 focus:bg-white/[0.07] font-sans disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Submit — Flow Motor Red */}
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-[#E94560] text-white font-semibold text-sm tracking-wide hover:bg-[#D63B55] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#E94560]/50 shadow-lg shadow-[#E94560]/20 hover:shadow-[#E94560]/30"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Connexion...
                  </>
                ) : (
                  <>
                    Se connecter
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Helper text */}
            <p className="text-center text-[10px] text-white/20 mt-5 leading-relaxed font-sans">
              Premiere connexion ? Verifiez que votre compte est valide dans Supabase.
            </p>

            {/* Divider */}
            <div className="mt-5 mb-4 h-[1px] bg-white/5" />

            {/* Footer */}
            <p className="text-center text-xs text-white/25 font-sans flex items-center justify-center gap-1.5">
              <Lock size={12} />
              Acces reserve aux administrateurs
            </p>
          </div>
        </div>

        {/* Back to site link */}
        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-sm text-white/40 hover:text-[#C4A484] transition-colors duration-300 font-sans"
          >
            &larr; Retour au site
          </a>
        </div>
      </div>
    </main>
  )
}

export default Login
