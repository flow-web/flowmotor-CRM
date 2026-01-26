import { useState, useEffect } from 'react'

/**
 * Hook pour persister un état dans localStorage
 * @param {string} key - Clé de stockage
 * @param {any} initialValue - Valeur initiale
 * @returns {[any, function]} - [valeur, setValue]
 */
export function useLocalStorage(key, initialValue) {
  // État initial : récupère depuis localStorage ou utilise initialValue
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.warn(`Erreur lecture localStorage pour "${key}":`, error)
      return initialValue
    }
  })

  // Synchronise avec localStorage à chaque changement
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue))
    } catch (error) {
      console.warn(`Erreur écriture localStorage pour "${key}":`, error)
    }
  }, [key, storedValue])

  return [storedValue, setStoredValue]
}

/**
 * Hook pour lire une valeur localStorage sans la modifier
 * @param {string} key - Clé de stockage
 * @param {any} defaultValue - Valeur par défaut
 * @returns {any} - Valeur stockée
 */
export function useLocalStorageRead(key, defaultValue = null) {
  const [value, setValue] = useState(defaultValue)

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (item) {
        setValue(JSON.parse(item))
      }
    } catch (error) {
      console.warn(`Erreur lecture localStorage pour "${key}":`, error)
    }
  }, [key])

  return value
}

/**
 * Supprime une clé du localStorage
 */
export function removeFromStorage(key) {
  try {
    window.localStorage.removeItem(key)
  } catch (error) {
    console.warn(`Erreur suppression localStorage pour "${key}":`, error)
  }
}

/**
 * Vérifie si une clé existe dans localStorage
 */
export function hasStorageKey(key) {
  try {
    return window.localStorage.getItem(key) !== null
  } catch {
    return false
  }
}

export default useLocalStorage
