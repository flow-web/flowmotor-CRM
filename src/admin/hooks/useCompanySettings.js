import { useState, useEffect } from 'react'
import { STORAGE_KEYS, DEFAULT_COMPANY_INFO } from '../utils/constants'

/**
 * useCompanySettings — Charge les infos société depuis localStorage
 * Fallback sur DEFAULT_COMPANY_INFO si rien n'est stocké
 */
export function useCompanySettings() {
  const [companyInfo, setCompanyInfo] = useState(DEFAULT_COMPANY_INFO)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.COMPANY_INFO)
      if (stored) {
        const parsed = JSON.parse(stored)
        setCompanyInfo({ ...DEFAULT_COMPANY_INFO, ...parsed })
      }
    } catch (err) {
      console.error('Erreur chargement infos société:', err)
    }
  }, [])

  const updateCompanyInfo = (updates) => {
    const updated = { ...companyInfo, ...updates }
    setCompanyInfo(updated)
    try {
      localStorage.setItem(STORAGE_KEYS.COMPANY_INFO, JSON.stringify(updated))
    } catch (err) {
      console.error('Erreur sauvegarde infos société:', err)
    }
    return updated
  }

  const resetCompanyInfo = () => {
    setCompanyInfo(DEFAULT_COMPANY_INFO)
    localStorage.removeItem(STORAGE_KEYS.COMPANY_INFO)
  }

  return { companyInfo, updateCompanyInfo, resetCompanyInfo }
}
