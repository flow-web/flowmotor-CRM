import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, User, ArrowRight } from 'lucide-react'

function Login() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ username: '', password: '' })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate('/admin')
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
                <label className="form-control">
                  <span className="label-text">Identifiant</span>
                  <div className="input input-bordered flex items-center gap-2">
                    <User size={18} className="opacity-60" />
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="votre.identifiant"
                      required
                      className="grow"
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
                    />
                  </div>
                </label>

                <button className="btn btn-accent w-full">
                  Accéder au cockpit
                  <ArrowRight size={18} />
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
