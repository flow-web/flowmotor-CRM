import { useState, useEffect } from 'react'
import { Settings as SettingsIcon, Save, RefreshCw, Database, Cloud, Building2 } from 'lucide-react'
import TopHeader from '../components/layout/TopHeader'
import AdminCard from '../components/shared/AdminCard'
import ApiConnectivity from '../components/settings/ApiConnectivity'
import { useUI } from '../context/UIContext'
import { useVehicles } from '../context/VehiclesContext'
import { useCompanySettings } from '../hooks/useCompanySettings'
import { STORAGE_KEYS, DEFAULT_SETTINGS, DEFAULT_COMPANY_INFO } from '../utils/constants'

const COMPANY_FIELDS = [
  { key: 'name', label: 'Raison sociale', placeholder: 'FLOW MOTOR' },
  { key: 'legal', label: 'Forme juridique', placeholder: 'SASU AU CAPITAL DE 100 €' },
  { key: 'rcs', label: 'RCS', placeholder: 'RCS Lyon' },
  { key: 'owner', label: 'Dirigeant', placeholder: 'Nom Prénom' },
  { key: 'address', label: 'Adresse', placeholder: '6 Rue du Bon Pasteur' },
  { key: 'zipCity', label: 'Code postal + Ville', placeholder: '69001 Lyon' },
  { key: 'phone', label: 'Téléphone', placeholder: '06 00 00 00 00' },
  { key: 'email', label: 'Email', placeholder: 'contact@example.com' },
  { key: 'siren', label: 'SIREN', placeholder: '000 000 000' },
  { key: 'tvaIntra', label: 'TVA Intracommunautaire', placeholder: 'FR00000000000' },
  { key: 'iban', label: 'IBAN', placeholder: 'FR76 0000 0000 0000 0000 0000 000' },
  { key: 'bic', label: 'BIC / SWIFT', placeholder: 'XXXXFRPPXXX' }
]

function Settings() {
  const { toast } = useUI()
  const { dataMode, isSupabaseMode } = useVehicles()
  const { companyInfo, updateCompanyInfo, resetCompanyInfo } = useCompanySettings()

  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [hasChanges, setHasChanges] = useState(false)
  const [activeTab, setActiveTab] = useState('general')

  // Company form state
  const [companyForm, setCompanyForm] = useState(companyInfo)
  const [companyHasChanges, setCompanyHasChanges] = useState(false)

  // Sync company form when hook loads
  useEffect(() => {
    setCompanyForm(companyInfo)
  }, [companyInfo])

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

  // Company handlers
  const handleCompanyChange = (key, value) => {
    setCompanyForm(prev => ({ ...prev, [key]: value }))
    setCompanyHasChanges(true)
  }

  const handleCompanySave = () => {
    updateCompanyInfo(companyForm)
    toast.success('Informations société enregistrées')
    setCompanyHasChanges(false)
  }

  const handleCompanyReset = () => {
    setCompanyForm(DEFAULT_COMPANY_INFO)
    resetCompanyInfo()
    toast.success('Informations société réinitialisées')
    setCompanyHasChanges(false)
  }

  const tabs = [
    { id: 'general', label: 'Général', icon: SettingsIcon },
    { id: 'company', label: 'Société', icon: Building2 },
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

          {activeTab === 'company' && (
            <div className="space-y-6">
              <AdminCard>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-[#5C3A2E]/30 rounded-lg">
                    <Building2 className="text-[#C4A484]" size={20} />
                  </div>
                  <div>
                    <h2 className="font-medium text-white">Informations société</h2>
                    <p className="text-xs text-white/40">
                      Ces données apparaissent sur les factures et bons de commande PDF
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {COMPANY_FIELDS.map((field) => (
                    <div key={field.key}>
                      <label className="text-xs text-white/40 uppercase tracking-wider block mb-2">
                        {field.label}
                      </label>
                      <input
                        type="text"
                        value={companyForm[field.key] || ''}
                        onChange={(e) => handleCompanyChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        className="input-admin w-full"
                      />
                    </div>
                  ))}
                </div>
              </AdminCard>

              {/* Actions */}
              <div className="flex items-center gap-4">
                <button
                  onClick={handleCompanySave}
                  disabled={!companyHasChanges}
                  className={`btn-admin flex items-center gap-2 ${!companyHasChanges ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Save size={16} />
                  Enregistrer
                </button>
                <button
                  onClick={handleCompanyReset}
                  className="btn-admin-secondary flex items-center gap-2"
                >
                  <RefreshCw size={16} />
                  Réinitialiser par défaut
                </button>
              </div>

              <p className="text-xs text-white/30">
                Les modifications seront appliquées aux prochains documents PDF générés.
              </p>
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
