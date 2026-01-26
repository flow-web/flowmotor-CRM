import { useState, useEffect } from 'react'
import {
  Key,
  Plus,
  Copy,
  Check,
  Trash2,
  Eye,
  EyeOff,
  RefreshCw,
  AlertCircle,
  Cloud,
  CloudOff,
  Database,
  Loader2,
  Shield,
  Clock
} from 'lucide-react'
import AdminCard from '../shared/AdminCard'
import { useVehicles } from '../../context/VehiclesContext'
import { useUI } from '../../context/UIContext'
import { isDemoMode, generateApiKey, listApiKeys, revokeApiKey, deleteApiKey } from '../../../lib/supabase'

function ApiConnectivity() {
  const { toast } = useUI()
  const { dataMode, connectionStatus, isSupabaseMode, migrateToSupabase, refresh } = useVehicles()

  const [apiKeys, setApiKeys] = useState([])
  const [isLoadingKeys, setIsLoadingKeys] = useState(false)
  const [showNewKeyModal, setShowNewKeyModal] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [newKeyExpiry, setNewKeyExpiry] = useState('never')
  const [generatedKey, setGeneratedKey] = useState(null)
  const [copiedKeyId, setCopiedKeyId] = useState(null)
  const [isMigrating, setIsMigrating] = useState(false)
  const [isGeneratingKey, setIsGeneratingKey] = useState(false)

  // Charge les clés API au montage
  useEffect(() => {
    if (isSupabaseMode) {
      loadApiKeys()
    }
  }, [isSupabaseMode])

  const loadApiKeys = async () => {
    if (isDemoMode()) return

    setIsLoadingKeys(true)
    try {
      const keys = await listApiKeys()
      setApiKeys(keys)
    } catch (err) {
      console.error('Erreur chargement clés API:', err)
    } finally {
      setIsLoadingKeys(false)
    }
  }

  const handleGenerateKey = async () => {
    if (!newKeyName.trim()) {
      toast.error('Nom de la clé requis')
      return
    }

    setIsGeneratingKey(true)
    try {
      const expiryDays = newKeyExpiry === 'never' ? null : parseInt(newKeyExpiry)
      const result = await generateApiKey(newKeyName.trim(), ['read:kpis'], expiryDays)

      setGeneratedKey(result)
      setApiKeys(prev => [result, ...prev])
      toast.success('Clé API générée')
    } catch (err) {
      toast.error('Erreur lors de la génération')
      console.error(err)
    } finally {
      setIsGeneratingKey(false)
    }
  }

  const handleRevokeKey = async (keyId) => {
    try {
      await revokeApiKey(keyId)
      setApiKeys(prev => prev.map(k =>
        k.id === keyId ? { ...k, isActive: false } : k
      ))
      toast.success('Clé révoquée')
    } catch (err) {
      toast.error('Erreur lors de la révocation')
    }
  }

  const handleDeleteKey = async (keyId) => {
    if (!confirm('Supprimer définitivement cette clé ?')) return

    try {
      await deleteApiKey(keyId)
      setApiKeys(prev => prev.filter(k => k.id !== keyId))
      toast.success('Clé supprimée')
    } catch (err) {
      toast.error('Erreur lors de la suppression')
    }
  }

  const handleCopyKey = async (key) => {
    try {
      await navigator.clipboard.writeText(key)
      setCopiedKeyId(key)
      setTimeout(() => setCopiedKeyId(null), 2000)
    } catch (err) {
      toast.error('Erreur de copie')
    }
  }

  const handleMigrate = async () => {
    if (!confirm('Migrer toutes les données locales vers Supabase ? Les données locales seront conservées.')) {
      return
    }

    setIsMigrating(true)
    try {
      const result = await migrateToSupabase()
      toast.success(`Migration terminée: ${result.success} véhicule(s) migré(s)`)
      if (result.failed > 0) {
        toast.error(`${result.failed} erreur(s) durant la migration`)
      }
      await refresh()
    } catch (err) {
      toast.error(err.message || 'Erreur de migration')
    } finally {
      setIsMigrating(false)
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      {/* Statut de connexion */}
      <AdminCard>
        <div className="flex items-center gap-3 mb-6">
          <div className={`p-2 rounded-lg ${isSupabaseMode ? 'bg-green-500/20' : 'bg-yellow-500/20'}`}>
            {isSupabaseMode ? (
              <Cloud className="text-green-400" size={20} />
            ) : (
              <Database className="text-yellow-400" size={20} />
            )}
          </div>
          <div>
            <h2 className="font-medium text-white">Connexion Base de Données</h2>
            <p className="text-xs text-white/40">Mode actuel et options de synchronisation</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Statut actuel */}
          <div className="p-4 bg-white/5 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  isSupabaseMode ? 'bg-green-400' : isDemoMode() ? 'bg-yellow-400' : 'bg-red-400'
                }`} />
                <div>
                  <p className="text-sm font-medium text-white">
                    {isSupabaseMode ? 'Connecté à Supabase' :
                     isDemoMode() ? 'Mode Démo (localStorage)' : 'Mode Hors-ligne'}
                  </p>
                  <p className="text-xs text-white/40">
                    {isSupabaseMode
                      ? 'Données synchronisées avec le cloud'
                      : 'Données stockées localement dans le navigateur'}
                  </p>
                </div>
              </div>

              {!isSupabaseMode && !isDemoMode() && (
                <button
                  onClick={handleMigrate}
                  disabled={isMigrating}
                  className="btn-admin flex items-center gap-2"
                >
                  {isMigrating ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Cloud size={16} />
                  )}
                  Migrer vers le cloud
                </button>
              )}
            </div>
          </div>

          {/* Avertissement mode démo */}
          {isDemoMode() && (
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-start gap-3">
              <AlertCircle className="text-yellow-400 mt-0.5 shrink-0" size={18} />
              <div>
                <p className="text-sm text-yellow-300 font-medium">Mode Démonstration</p>
                <p className="text-xs text-yellow-300/70 mt-1">
                  Les clés API et la synchronisation cloud ne sont pas disponibles.
                  Configurez les variables d'environnement Supabase pour activer ces fonctionnalités.
                </p>
              </div>
            </div>
          )}

          {/* Info Supabase connecté */}
          {isSupabaseMode && (
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-start gap-3">
              <Check className="text-green-400 mt-0.5 shrink-0" size={18} />
              <div>
                <p className="text-sm text-green-300 font-medium">Base de données connectée</p>
                <p className="text-xs text-green-300/70 mt-1">
                  Toutes les modifications sont automatiquement synchronisées avec Supabase.
                  Les clés API sont disponibles pour le Dashboard Holding.
                </p>
              </div>
            </div>
          )}
        </div>
      </AdminCard>

      {/* Gestion des clés API - uniquement si connecté à Supabase */}
      {isSupabaseMode && (
        <AdminCard>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Key className="text-purple-400" size={20} />
              </div>
              <div>
                <h2 className="font-medium text-white">Clés API</h2>
                <p className="text-xs text-white/40">Accès pour le Dashboard Holding</p>
              </div>
            </div>

            <button
              onClick={() => {
                setNewKeyName('')
                setNewKeyExpiry('never')
                setGeneratedKey(null)
                setShowNewKeyModal(true)
              }}
              className="btn-admin flex items-center gap-2"
            >
              <Plus size={16} />
              Nouvelle clé
            </button>
          </div>

          {/* Liste des clés */}
          {isLoadingKeys ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="animate-spin text-white/40" size={24} />
            </div>
          ) : apiKeys.length === 0 ? (
            <div className="text-center py-8 text-white/40">
              <Key size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">Aucune clé API</p>
              <p className="text-xs mt-1">Créez une clé pour permettre l'accès externe aux KPIs</p>
            </div>
          ) : (
            <div className="space-y-3">
              {apiKeys.map(key => (
                <div
                  key={key.id}
                  className={`p-4 rounded-lg border ${
                    key.isActive && !key.isExpired
                      ? 'bg-white/5 border-white/10'
                      : 'bg-red-500/5 border-red-500/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        key.isActive && !key.isExpired ? 'bg-green-400' : 'bg-red-400'
                      }`} />
                      <div>
                        <p className="text-sm font-medium text-white">{key.name}</p>
                        <p className="text-xs text-white/40 font-mono">{key.keyPrefix}...</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {key.isExpired && (
                        <span className="text-xs text-red-400 flex items-center gap-1">
                          <Clock size={12} />
                          Expirée
                        </span>
                      )}
                      {!key.isActive && !key.isExpired && (
                        <span className="text-xs text-red-400">Révoquée</span>
                      )}

                      {key.isActive && !key.isExpired && (
                        <button
                          onClick={() => handleRevokeKey(key.id)}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                          title="Révoquer"
                        >
                          <Shield size={16} className="text-yellow-400" />
                        </button>
                      )}

                      <button
                        onClick={() => handleDeleteKey(key.id)}
                        className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 size={16} className="text-red-400" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-4 text-xs text-white/40">
                    <span>Créée: {formatDate(key.createdAt)}</span>
                    {key.lastUsedAt && <span>Dernière utilisation: {formatDate(key.lastUsedAt)}</span>}
                    {key.expiresAt && <span>Expire: {formatDate(key.expiresAt)}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </AdminCard>
      )}

      {/* Modal nouvelle clé */}
      {showNewKeyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-card border border-white/10 rounded-xl w-full max-w-md">
            <div className="p-6 border-b border-white/10">
              <h3 className="text-lg font-medium text-white">Nouvelle clé API</h3>
              <p className="text-sm text-white/40 mt-1">
                {generatedKey
                  ? 'Copiez cette clé maintenant, elle ne sera plus visible ensuite.'
                  : 'Créez une clé d\'accès pour le Dashboard Holding.'}
              </p>
            </div>

            <div className="p-6 space-y-4">
              {generatedKey ? (
                <div className="space-y-4">
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Check className="text-green-400" size={16} />
                      <span className="text-sm text-green-300 font-medium">Clé générée avec succès</span>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <code className="flex-1 p-2 bg-black/30 rounded font-mono text-xs text-white break-all">
                        {generatedKey.key}
                      </code>
                      <button
                        onClick={() => handleCopyKey(generatedKey.key)}
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors shrink-0"
                      >
                        {copiedKeyId === generatedKey.key ? (
                          <Check size={16} className="text-green-400" />
                        ) : (
                          <Copy size={16} className="text-white" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-xs text-yellow-300">
                    <AlertCircle size={14} className="inline mr-1" />
                    Cette clé ne sera plus affichée. Conservez-la en lieu sûr.
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <label className="text-xs text-white/40 uppercase tracking-wider block mb-2">
                      Nom de la clé
                    </label>
                    <input
                      type="text"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      placeholder="ex: Dashboard Holding Prod"
                      className="input-admin w-full"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-white/40 uppercase tracking-wider block mb-2">
                      Expiration
                    </label>
                    <select
                      value={newKeyExpiry}
                      onChange={(e) => setNewKeyExpiry(e.target.value)}
                      className="input-admin w-full"
                    >
                      <option value="never">Jamais</option>
                      <option value="30">30 jours</option>
                      <option value="90">90 jours</option>
                      <option value="365">1 an</option>
                    </select>
                  </div>

                  <div className="p-3 bg-white/5 rounded-lg text-xs text-white/60">
                    <p className="font-medium mb-1">Permissions:</p>
                    <ul className="space-y-1 text-white/40">
                      <li className="flex items-center gap-2">
                        <Check size={12} className="text-green-400" />
                        Lecture des KPIs financiers
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={12} className="text-green-400" />
                        Statistiques par statut
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={12} className="text-green-400" />
                        Dernières ventes
                      </li>
                    </ul>
                  </div>
                </>
              )}
            </div>

            <div className="p-4 border-t border-white/10 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowNewKeyModal(false)
                  setGeneratedKey(null)
                }}
                className="btn-admin-secondary"
              >
                {generatedKey ? 'Fermer' : 'Annuler'}
              </button>

              {!generatedKey && (
                <button
                  onClick={handleGenerateKey}
                  disabled={isGeneratingKey || !newKeyName.trim()}
                  className="btn-admin flex items-center gap-2"
                >
                  {isGeneratingKey ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Key size={16} />
                  )}
                  Générer
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ApiConnectivity
