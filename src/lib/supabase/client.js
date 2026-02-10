import { createClient } from '@supabase/supabase-js'

// Configuration Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const forceDemoMode = import.meta.env.VITE_DEMO_MODE === 'true'

// Vérifie si on est en mode démo (pas de credentials Supabase)
export function isDemoMode() {
  if (forceDemoMode) return true
  return !supabaseUrl || !supabaseAnonKey
}

// Vérifie si on a une connexion Supabase active
export async function checkSupabaseConnection() {
  if (isDemoMode()) {
    return { connected: false, mode: 'demo' }
  }

  try {
    const { error } = await supabase.from('vehicles').select('count', { count: 'exact', head: true })
    if (error) {
      // AbortError retourné dans l'objet error (pas thrown) — Strict Mode bénin
      if (error.name === 'AbortError' || error.message?.includes('aborted')) {
        return { connected: true, mode: 'supabase' }
      }
      console.warn('Supabase connection error:', error.message)
      return { connected: false, mode: 'offline', error: error.message }
    }
    return { connected: true, mode: 'supabase' }
  } catch (err) {
    // AbortError en Strict Mode — pas une vraie erreur réseau
    if (err.name === 'AbortError' || err.message?.includes('aborted')) {
      return { connected: true, mode: 'supabase' }
    }
    console.warn('Supabase connection failed:', err)
    return { connected: false, mode: 'offline', error: err.message }
  }
}

// Crée le client Supabase (null en mode démo)
// Note: on strip le signal AbortController pour éviter le bug React 18 Strict Mode
// où le double-mount corrompt le signal et avorte TOUTES les requêtes (même les clics)
export const supabase = isDemoMode()
  ? null
  : createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      global: {
        fetch: (url, options = {}) => {
          const { signal, ...rest } = options
          return fetch(url, rest)
        },
      },
    })

// Helper pour exécuter une requête Supabase avec fallback
export async function withFallback(supabaseQuery, fallbackFn) {
  if (isDemoMode()) {
    return fallbackFn()
  }

  try {
    const result = await supabaseQuery()
    if (result.error) {
      console.warn('Supabase query error, using fallback:', result.error)
      return fallbackFn()
    }
    return result
  } catch (err) {
    console.warn('Supabase request failed, using fallback:', err)
    return fallbackFn()
  }
}

// Hash une clé API (pour la validation côté client)
export async function hashApiKey(key) {
  const encoder = new TextEncoder()
  const data = encoder.encode(key)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

// Génère un préfixe de clé (premiers 8 caractères visibles)
export function getKeyPrefix(key) {
  return key.substring(0, 8)
}

/**
 * Upload une image dans le bucket 'vehicles'
 * @param {File} file - Le fichier image à uploader
 * @param {string} vehicleId - L'ID du véhicule
 * @param {number} index - Index de l'image (pour ordonner)
 * @returns {Promise<{url: string, path: string} | null>}
 */
export async function uploadImage(file, vehicleId, index = 0) {
  if (isDemoMode() || !supabase) {
    console.warn('Upload impossible en mode démo')
    return null
  }

  try {
    // Générer un nom unique pour le fichier
    const fileExt = file.name.split('.').pop()
    const fileName = `${vehicleId}/${Date.now()}_${index}.${fileExt}`

    // Upload vers le bucket 'vehicles'
    const { data, error } = await supabase.storage
      .from('vehicles')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Erreur upload:', error)
      return null
    }

    // Récupérer l'URL publique
    const { data: { publicUrl } } = supabase.storage
      .from('vehicles')
      .getPublicUrl(fileName)

    return {
      url: publicUrl,
      path: fileName
    }
  } catch (err) {
    console.error('Erreur upload image:', err)
    return null
  }
}

/**
 * Supprime une image du bucket 'vehicles'
 * @param {string} path - Le chemin de l'image dans le bucket
 * @returns {Promise<boolean>}
 */
export async function deleteImage(path) {
  if (isDemoMode() || !supabase) {
    return false
  }

  try {
    const { error } = await supabase.storage
      .from('vehicles')
      .remove([path])

    if (error) {
      console.error('Erreur suppression image:', error)
      return false
    }

    return true
  } catch (err) {
    console.error('Erreur suppression image:', err)
    return false
  }
}

export default supabase
