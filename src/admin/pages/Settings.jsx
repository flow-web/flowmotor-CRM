import { useState, useEffect } from 'react'
import { Settings as SettingsIcon, Save, RefreshCw, Database, Cloud } from 'lucide-react'
import TopHeader from '../components/layout/TopHeader'
import AdminCard from '../components/shared/AdminCard'
import ApiConnectivity from '../components/settings/ApiConnectivity'
import { useUI } from '../context/UIContext'
import { useVehicles } from '../context/VehiclesContext'
import { STORAGE_KEYS, DEFAULT_SETTINGS } from '../utils/constants'

function Settings() {
  const { toast } = useUI()
  const { dataMode, isSupabaseMode } = useVehicles()

  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [hasChanges, setHasChanges] = useState(false)
  const [activeTab, setActiveTab] = useState('general') // 'general' | 'api'

  // Load settings on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS)
      if (stored) {
        setSettings(JSON.parse(stored))
      }
    } catch (error) {
      console.error('Erreur chargement paramètres:', error)
    }
  }, [])

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  const handleExchangeRateChange = (currency, value) => {
    setSettings(prev => ({
      ...prev,
      exchangeRates: {
        ...prev.exchangeRates,
        [currency]: parseFloat(value) || 0
      }
    }))
    setHasChanges(true)
  }

  const handleSave = () => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings))
      toast.success('Paramètres enregistrés')
      setHasChanges(false)
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde')
    }
  }

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS)
    setHasChanges(true)
  }

  const tabs = [
    { id: 'general', label: 'Général', icon: SettingsIcon },
    { id: 'api', label: 'Connectivité', icon: isSupabaseMode ? Cloud : Database }
  ]

  return (
    <div className="min-h-screen">
      <TopHeader
        title="Paramètres"
        subtitle="Configuration du CRM"
      />

      <div className="p-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-accent text-white'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Contenu des tabs */}
        <div className="max-w-3xl">
          {activeTab === 'general' && (
            <div className="space-y-6">
              {/* Margins & TVA */}
              <AdminCard>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-accent/20 rounded-lg">
                    <SettingsIcon className="text-accent" size={20} />
                  </div>
                  <div>
                    <h2 className="font-medium text-white">Marges & TVA</h2>
                    <p className="text-xs text-white/40">Configuration des calculs financiers</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-white/40 uppercase tracking-wider block mb-2">
                        Marge cible par défaut (%)
                      </label>
                      <input
                        type="number"
                        value={settings.defaultMargin}
                        onChange={(e) => handleChange('defaultMargin', parseFloat(e.target.value))}
                        className="input-admin w-full"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-white/40 uppercase tracking-wider block mb-2">
                        Taux de TVA (%)
                      </label>
                      <input
                        type="number"
                        value={settings.vatRate}
                        onChange={(e) => handleChange('vatRate', parseFloat(e.target.value))}
                        className="input-admin w-full"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="vatOnMargin"
                      checked={settings.vatOnMargin}
                      onChange={(e) => handleChange('vatOnMargin', e.target.checked)}
                      className="w-4 h-4 rounded border-white/20 bg-white/5 text-accent focus:ring-accent/20"
                    />
                    <label htmlFor="vatOnMargin" className="text-sm text-white/70">
                      TVA sur marge (véhicules d'occasion)
                    </label>
                  </div>
                </div>
              </AdminCard>

              {/* Exchange Rates */}
              <AdminCard>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <RefreshCw className="text-blue-400" size={20} />
                  </div>
                  <div>
                    <h2 className="font-medium text-white">Taux de change</h2>
                    <p className="text-xs text-white/40">Conversion vers EUR</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs text-white/40 uppercase tracking-wider block mb-2">
                      CHF → EUR
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={settings.exchangeRates.CHF}
                      onChange={(e) => handleExchangeRateChange('CHF', e.target.value)}
                      className="input-admin w-full"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/40 uppercase tracking-wider block mb-2">
                      GBP → EUR
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={settings.exchangeRates.GBP}
                      onChange={(e) => handleExchangeRateChange('GBP', e.target.value)}
                      className="input-admin w-full"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/40 uppercase tracking-wider block mb-2">
                      JPY → EUR
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      value={settings.exchangeRates.JPY}
                      onChange={(e) => handleExchangeRateChange('JPY', e.target.value)}
                      className="input-admin w-full"
                    />
                  </div>
                </div>

                <p className="text-xs text-white/30 mt-4">
                  Note: Ces taux sont utilisés pour les calculs dans le CRM.
                  Mettez-les à jour régulièrement pour des estimations précises.
                </p>
              </AdminCard>

              {/* Credentials Info */}
              <AdminCard>
                <h3 className="text-sm font-medium text-white mb-4">Accès démo</h3>
                <div className="p-4 bg-white/5 rounded-lg space-y-2 text-sm">
                  <p className="text-white/60">
                    <span className="text-white/40">Identifiant:</span> admin
                  </p>
                  <p className="text-white/60">
                    <span className="text-white/40">Mot de passe:</span> flowmotor2024
                  </p>
                </div>
                <p className="text-xs text-white/30 mt-3">
                  En production, utilisez un système d'authentification sécurisé.
                </p>
              </AdminCard>

              {/* Actions */}
              <div className="flex items-center gap-4">
                <button
                  onClick={handleSave}
                  disabled={!hasChanges}
                  className={`btn-admin flex items-center gap-2 ${!hasChanges ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Save size={16} />
                  Enregistrer
                </button>
                <button
                  onClick={handleReset}
                  className="btn-admin-secondary flex items-center gap-2"
                >
                  <RefreshCw size={16} />
                  Réinitialiser
                </button>
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <ApiConnectivity />
          )}
        </div>
      </div>
    </div>
  )
}

export default Settings
