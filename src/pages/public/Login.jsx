import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react'
import { useAuth } from '../../admin/context/AuthContext'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

/**
 * Login - Page de connexion Admin CRM
 * Authentification via Supabase (email + password)
 */
function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isAuthenticated } = useAuth()

  // States simples pour email et password
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Redirige si déjà connecté
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

    // Appel direct avec email et password
    const result = await login(email, password)

    if (result.success) {
      navigate(from, { replace: true })
    } else {
      setError(result.error || 'Échec de la connexion')
    }

    setIsLoading(false)
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#3D1E1E] relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#3D1E1E] via-[#2a1515] to-[#1A0F0F]" />
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#5C3A2E]/20 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-[#5C3A2E]/15 blur-3xl" />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md px-6">
        <Card className="bg-[#F4E8D8] border-0 shadow-2xl">
          <CardHeader className="text-center pb-2">
            {/* Logo */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <img
                src="/assets/engine-white.svg"
                alt="Flow Motor"
                className="h-10 w-auto brightness-0"
              />
              <span className="font-display text-2xl font-semibold text-[#3D1E1E]">
                FLOW MOTOR
              </span>
            </div>
            <CardTitle className="text-2xl text-[#3D1E1E]">Espace Pro</CardTitle>
            <CardDescription className="text-[#5C3A2E]/70">
              Connectez-vous à votre cockpit de gestion
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Error Message - Uniquement si erreur API */}
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              )}

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#3D1E1E]">
                  Adresse Email
                </Label>
                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5C3A2E]/50"
                  />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="exemple@flowmotor.fr"
                    required
                    disabled={isLoading}
                    className="pl-10 bg-white border-[#D4C4B0] text-[#3D1E1E] placeholder:text-[#5C3A2E]/40 focus:border-[#5C3A2E] focus:ring-[#5C3A2E]"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#3D1E1E]">
                  Mot de passe
                </Label>
                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5C3A2E]/50"
                  />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                    className="pl-10 bg-white border-[#D4C4B0] text-[#3D1E1E] placeholder:text-[#5C3A2E]/40 focus:border-[#5C3A2E] focus:ring-[#5C3A2E]"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-[#5C3A2E] hover:bg-[#5C3A2E]/90 text-[#F4E8D8] font-semibold"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Connexion...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Se connecter
                    <ArrowRight size={18} />
                  </span>
                )}
              </Button>
            </form>

            {/* Helper text */}
            <p className="text-center text-xs text-[#5C3A2E]/50 mt-4">
              Première connexion ? Vérifiez que votre compte est validé dans Supabase.
            </p>

            {/* Footer */}
            <p className="text-center text-xs text-[#5C3A2E]/60 mt-4">
              Accès réservé aux administrateurs FLOW MOTOR
            </p>
          </CardContent>
        </Card>

        {/* Back to site link */}
        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-sm text-white/70 hover:text-white transition-colors"
          >
            ← Retour au site
          </a>
        </div>
      </div>
    </main>
  )
}

export default Login
