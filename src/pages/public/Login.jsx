import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Lock, User, ArrowRight, AlertCircle } from 'lucide-react'
import { useAuth } from '../../admin/context/AuthContext'

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isAuthenticated } = useAuth()

  const [formData, setFormData] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Redirige si déjà connecté
  const from = location.state?.from?.pathname || '/admin/dashboard'
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, from])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('') // Clear error on input change
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const result = await login(formData.username, formData.password)

    if (result.success) {
      navigate(from, { replace: true })
    } else {
      setError(result.error || 'Identifiants incorrects')
    }

    setIsLoading(false)
  }

  return (
    <main className="relative min-h-screen bg-primary text-primary-content">
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-neutral/70" />
      <div className="absolute -top-20 right-10 h-48 w-48 rounded-full bg-accent/20 blur-3xl" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="card bg-base-100 text-base-content shadow-2xl">
            <div className="card-body gap-6">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center gap-3">
                  <img
                    src="/assets/engine-white.svg"
                    alt="Flow Motor"
                    className="h-10 w-auto brightness-0"
                  />
                  <span className="font-display text-2xl font-semibold">FLOW MOTOR</span>
                </div>
                <h1 className="mt-4 text-2xl font-semibold">Espace Pro</h1>
                <p className="text-sm text-base-content/60">
                  Accédez à votre cockpit de gestion.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="flex items-center gap-2 p-3 bg-error/10 text-error rounded-lg text-sm">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                  </div>
                )}

                <label className="form-control">
                  <span className="label-text">Identifiant</span>
                  <div className="input input-bordered flex items-center gap-2">
                    <User size={18} className="opacity-60" />
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="admin"
                      required
                      className="grow"
                      disabled={isLoading}
                    />
                  </div>
                </label>

                <label className="form-control">
                  <span className="label-text">Mot de passe</span>
                  <div className="input input-bordered flex items-center gap-2">
                    <Lock size={18} className="opacity-60" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      required
                      className="grow"
                      disabled={isLoading}
                    />
                  </div>
                </label>

                <button className="btn btn-accent w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Connexion...
                    </>
                  ) : (
                    <>
                      Accéder au cockpit
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>

              <div className="text-center text-xs text-base-content/60">
                Accès réservé aux administrateurs FLOW MOTOR.
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <a href="/" className="link link-hover text-sm text-primary-content/70">
              ← Retour au site
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Login
