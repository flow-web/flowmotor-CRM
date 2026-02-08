import { createContext, useContext, useState, useEffect } from 'react'
import { STORAGE_KEYS } from '../utils/constants'
import { supabase, isDemoMode } from '../../lib/supabase'

const AuthContext = createContext(null)

// Utilisateur demo
const DEMO_USER = {
  id: '1',
  name: 'Admin Flow Motor',
  email: 'admin@flowmotor.fr',
  role: 'admin'
}

// Credentials demo (en production, utiliser un vrai système d'auth)
const DEMO_CREDENTIALS = {
  username: 'admin',
  password: 'flowmotor2024'
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [authMode, setAuthMode] = useState('demo') // 'supabase' | 'demo'

  // Vérifie l'auth au chargement
  useEffect(() => {
    checkAuth()

    // Écoute les changements d'auth Supabase
    if (!isDemoMode() && supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (session?.user) {
            const profile = await fetchUserProfile(session.user.id)
            setUser({
              id: session.user.id,
              email: session.user.email,
              name: profile?.name || session.user.email.split('@')[0],
              role: profile?.role || 'user'
            })
          } else {
            setUser(null)
          }
        }
      )

      return () => subscription.unsubscribe()
    }
  }, [])

  const fetchUserProfile = async (userId) => {
    if (!supabase) return null

    const { data, error } = await supabase
      .from('profiles')
      .select('name, role')
      .eq('id', userId)
      .single()

    if (error) {
      console.warn('Erreur fetch profile:', error)
      return null
    }
    return data
  }

  const checkAuth = async () => {
    setIsLoading(true)

    try {
      // Essaie d'abord Supabase
      if (!isDemoMode() && supabase) {
        const { data: { session } } = await supabase.auth.getSession()

        if (session?.user) {
          const profile = await fetchUserProfile(session.user.id)
          setUser({
            id: session.user.id,
            email: session.user.email,
            name: profile?.name || session.user.email.split('@')[0],
            role: profile?.role || 'user'
          })
          setAuthMode('supabase')
          setIsLoading(false)
          return
        }
      }

      // Fallback sur le mode demo/localStorage
      const stored = localStorage.getItem(STORAGE_KEYS.AUTH)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed.token && parsed.user) {
          setUser(parsed.user)
          setAuthMode('demo')
        }
      }
    } catch (error) {
      console.warn('Erreur vérification auth:', error)
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Login avec Supabase
   * @param {string} email - Adresse email
   * @param {string} password - Mot de passe
   */
  const login = async (email, password) => {
    // Vérifie que Supabase est disponible
    if (!supabase) {
      console.error('Supabase non configuré')
      return { success: false, error: 'Service d\'authentification non disponible' }
    }

    try {
      // Appel Supabase signInWithPassword
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        console.error('Erreur Supabase:', error.message)
        return { success: false, error: error.message }
      }

      if (data.user) {
        const profile = await fetchUserProfile(data.user.id)
        setUser({
          id: data.user.id,
          email: data.user.email,
          name: profile?.name || data.user.email.split('@')[0],
          role: profile?.role || 'admin'
        })
        setAuthMode('supabase')
        return { success: true }
      }

      return { success: false, error: 'Aucun utilisateur trouvé' }
    } catch (err) {
      console.error('Erreur login:', err)
      return { success: false, error: 'Erreur de connexion au serveur' }
    }
  }

  const register = async (email, password, name) => {
    if (isDemoMode() || !supabase) {
      return { success: false, error: 'Inscription non disponible en mode démo' }
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name }
        }
      })

      if (error) {
        return { success: false, error: error.message }
      }

      if (data.user) {
        return {
          success: true,
          needsConfirmation: !data.session,
          message: data.session
            ? 'Compte créé avec succès'
            : 'Vérifiez votre email pour confirmer votre compte'
        }
      }
    } catch (err) {
      console.error('Erreur register:', err)
      return { success: false, error: 'Erreur lors de l\'inscription' }
    }
  }

  const logout = async () => {
    // Déconnexion Supabase
    if (!isDemoMode() && supabase) {
      await supabase.auth.signOut()
    }

    // Nettoyage localStorage
    localStorage.removeItem(STORAGE_KEYS.AUTH)
    setUser(null)
    setAuthMode('demo')
  }

  const resetPassword = async (email) => {
    if (isDemoMode() || !supabase) {
      return { success: false, error: 'Réinitialisation non disponible en mode démo' }
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/reset-password`
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, message: 'Email de réinitialisation envoyé' }
    } catch (err) {
      return { success: false, error: 'Erreur lors de l\'envoi' }
    }
  }

  const updatePassword = async (newPassword) => {
    if (isDemoMode() || !supabase) {
      return { success: false, error: 'Modification non disponible en mode démo' }
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, message: 'Mot de passe mis à jour' }
    } catch (err) {
      return { success: false, error: 'Erreur lors de la modification' }
    }
  }

  const updateProfile = async (updates) => {
    if (!user) return { success: false, error: 'Non connecté' }

    if (authMode === 'supabase' && supabase) {
      try {
        const { error } = await supabase
          .from('profiles')
          .update({
            name: updates.name
          })
          .eq('id', user.id)

        if (error) {
          return { success: false, error: error.message }
        }

        setUser(prev => ({ ...prev, ...updates }))
        return { success: true }
      } catch (err) {
        return { success: false, error: 'Erreur mise à jour profil' }
      }
    }

    // Mode demo
    setUser(prev => ({ ...prev, ...updates }))
    const authData = JSON.parse(localStorage.getItem(STORAGE_KEYS.AUTH) || '{}')
    authData.user = { ...authData.user, ...updates }
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(authData))
    return { success: true }
  }

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    authMode,
    isDemoMode: isDemoMode() || authMode === 'demo',
    login,
    logout,
    register,
    resetPassword,
    updatePassword,
    updateProfile,
    checkAuth
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider')
  }
  return context
}

export default AuthContext
