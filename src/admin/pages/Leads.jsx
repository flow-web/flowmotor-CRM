import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  MessageSquare, Mail, Phone, Clock, CheckCircle, XCircle,
  ChevronDown, ChevronUp, Search, Trash2, ExternalLink, User
} from 'lucide-react'
import TopHeader from '../components/layout/TopHeader'
import { useUI } from '../context/UIContext'
import { fetchLeads, updateLead, deleteLead } from '../../lib/supabase/leads'
import { isDemoMode } from '../../lib/supabase/client'

const STATUS_CONFIG = {
  NEW: { label: 'Nouveau', color: 'bg-blue-500', textColor: 'text-blue-400', icon: MessageSquare },
  CONTACTED: { label: 'Contacté', color: 'bg-yellow-500', textColor: 'text-yellow-400', icon: Phone },
  NEGOTIATION: { label: 'Négociation', color: 'bg-purple-500', textColor: 'text-purple-400', icon: Clock },
  CONVERTED: { label: 'Converti', color: 'bg-green-500', textColor: 'text-green-400', icon: CheckCircle },
  LOST: { label: 'Perdu', color: 'bg-red-500/60', textColor: 'text-red-400', icon: XCircle },
}

const SUBJECT_LABELS = {
  achat: "Achat d'un véhicule",
  reprise: 'Reprise / Dépôt-vente',
  recherche: 'Recherche personnalisée',
  autre: 'Autre',
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  const now = new Date()
  const diffMs = now - d
  const diffH = Math.floor(diffMs / (1000 * 60 * 60))

  if (diffH < 1) return 'Il y a quelques minutes'
  if (diffH < 24) return `Il y a ${diffH}h`

  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

function Leads() {
  const { toast, showConfirm } = useUI()
  const [leads, setLeads] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [expandedId, setExpandedId] = useState(null)
  const [editingNotes, setEditingNotes] = useState({})

  useEffect(() => {
    loadLeads()
  }, [])

  const loadLeads = async () => {
    try {
      if (isDemoMode()) {
        setLeads([])
        return
      }
      const data = await fetchLeads()
      setLeads(data)
    } catch (err) {
      console.error('Erreur chargement leads:', err)
      toast.error('Erreur de chargement des leads')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = async (leadId, newStatus) => {
    try {
      const updated = await updateLead(leadId, { status: newStatus })
      setLeads(prev => prev.map(l => l.id === leadId ? updated : l))
      toast.success(`Lead passé en "${STATUS_CONFIG[newStatus].label}"`)
    } catch (err) {
      console.error('Erreur mise à jour:', err)
      toast.error('Erreur de mise à jour')
    }
  }

  const handleSaveNotes = async (leadId) => {
    const notes = editingNotes[leadId]
    if (notes === undefined) return

    try {
      const updated = await updateLead(leadId, { notes })
      setLeads(prev => prev.map(l => l.id === leadId ? updated : l))
      setEditingNotes(prev => { const n = { ...prev }; delete n[leadId]; return n })
      toast.success('Notes sauvegardées')
    } catch (err) {
      console.error('Erreur sauvegarde notes:', err)
      toast.error('Erreur de sauvegarde')
    }
  }

  const handleDelete = async (lead) => {
    const confirmed = await showConfirm(
      `Supprimer le lead de ${lead.name} ?`,
      'Cette action est irréversible.'
    )
    if (!confirmed) return

    try {
      await deleteLead(lead.id)
      setLeads(prev => prev.filter(l => l.id !== lead.id))
      toast.success('Lead supprimé')
    } catch (err) {
      console.error('Erreur suppression:', err)
      toast.error('Erreur de suppression')
    }
  }

  // Filtrage
  const filteredLeads = useMemo(() => {
    return leads.filter(l => {
      if (statusFilter && l.status !== statusFilter) return false
      if (searchTerm) {
        const search = searchTerm.toLowerCase()
        const match = [l.name, l.email, l.phone, l.message, l.vehicle_label]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
        if (!match.includes(search)) return false
      }
      return true
    })
  }, [leads, searchTerm, statusFilter])

  // Stats
  const stats = useMemo(() => ({
    total: leads.length,
    new: leads.filter(l => l.status === 'NEW').length,
    active: leads.filter(l => ['CONTACTED', 'NEGOTIATION'].includes(l.status)).length,
    converted: leads.filter(l => l.status === 'CONVERTED').length,
  }), [leads])

  return (
    <div className="min-h-screen bg-[#1a1212]">
      <TopHeader title="Leads" subtitle="Prospects depuis le site vitrine" />

      <div className="p-6 space-y-6">
        {/* Stats rapides */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total" value={stats.total} color="text-white" />
          <StatCard label="Nouveaux" value={stats.new} color="text-blue-400" />
          <StatCard label="En cours" value={stats.active} color="text-yellow-400" />
          <StatCard label="Convertis" value={stats.converted} color="text-green-400" />
        </div>

        {/* Filtres */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Rechercher un lead..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#2a1f1f] border border-white/10 rounded-lg text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#5C3A2E]"
            />
          </div>

          <div className="flex gap-2">
            <FilterChip active={!statusFilter} onClick={() => setStatusFilter('')}>Tous</FilterChip>
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
              <FilterChip key={key} active={statusFilter === key} onClick={() => setStatusFilter(key)}>
                {cfg.label}
              </FilterChip>
            ))}
          </div>
        </div>

        {/* Liste des leads */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-[#2a1f1f] border border-white/5 rounded-xl p-6 animate-pulse">
                <div className="h-5 bg-white/10 rounded w-1/3 mb-3" />
                <div className="h-4 bg-white/10 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="bg-[#2a1f1f] border border-white/5 rounded-xl p-12 text-center">
            <MessageSquare size={48} className="mx-auto text-white/10 mb-4" />
            <p className="text-white/40">
              {leads.length === 0
                ? 'Aucun lead pour le moment. Les prospects arriveront via le formulaire de contact du site.'
                : 'Aucun lead ne correspond à vos filtres.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredLeads.map(lead => (
              <LeadCard
                key={lead.id}
                lead={lead}
                expanded={expandedId === lead.id}
                onToggle={() => setExpandedId(expandedId === lead.id ? null : lead.id)}
                onStatusChange={handleStatusChange}
                onDelete={() => handleDelete(lead)}
                editingNotes={editingNotes}
                setEditingNotes={setEditingNotes}
                onSaveNotes={handleSaveNotes}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value, color }) {
  return (
    <div className="bg-[#2a1f1f] border border-white/5 rounded-xl p-4">
      <p className="text-xs text-white/40 uppercase tracking-wider">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
    </div>
  )
}

function FilterChip({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
        active
          ? 'bg-[#5C3A2E] text-white'
          : 'bg-[#2a1f1f] text-white/50 hover:text-white/80 border border-white/10'
      }`}
    >
      {children}
    </button>
  )
}

function LeadCard({ lead, expanded, onToggle, onStatusChange, onDelete, editingNotes, setEditingNotes, onSaveNotes }) {
  const cfg = STATUS_CONFIG[lead.status] || STATUS_CONFIG.NEW
  const StatusIcon = cfg.icon

  return (
    <div className="bg-[#2a1f1f] border border-white/5 rounded-xl overflow-hidden">
      {/* Header — toujours visible */}
      <button onClick={onToggle} className="w-full p-5 flex items-center gap-4 text-left hover:bg-white/[0.02] transition-colors">
        {/* Status dot */}
        <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${cfg.color}`} />

        {/* Infos principales */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-white font-medium truncate">{lead.name}</span>
            {lead.status === 'NEW' && (
              <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-[10px] uppercase tracking-wider rounded-full font-medium">
                Nouveau
              </span>
            )}
          </div>
          <p className="text-sm text-white/40 truncate mt-0.5">
            {SUBJECT_LABELS[lead.subject] || lead.subject}
            {lead.vehicle_label && <span className="text-[#C4A484]"> — {lead.vehicle_label}</span>}
          </p>
        </div>

        {/* Date */}
        <span className="text-xs text-white/30 flex-shrink-0 hidden sm:block">
          {formatDate(lead.created_at)}
        </span>

        {/* Chevron */}
        {expanded ? <ChevronUp size={16} className="text-white/30" /> : <ChevronDown size={16} className="text-white/30" />}
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-5 pb-5 border-t border-white/5 pt-4 space-y-4">
          {/* Contact info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a href={`mailto:${lead.email}`} className="flex items-center gap-2 text-sm text-white/60 hover:text-[#C4A484] transition-colors">
              <Mail size={14} />
              {lead.email}
            </a>
            {lead.phone && (
              <a href={`tel:${lead.phone}`} className="flex items-center gap-2 text-sm text-white/60 hover:text-[#C4A484] transition-colors">
                <Phone size={14} />
                {lead.phone}
              </a>
            )}
          </div>

          {/* Message */}
          {lead.message && (
            <div className="bg-[#1a1212] rounded-lg p-4">
              <p className="text-xs text-white/30 uppercase tracking-wider mb-2">Message</p>
              <p className="text-sm text-white/70 whitespace-pre-wrap">{lead.message}</p>
            </div>
          )}

          {/* Véhicule associé */}
          {lead.vehicle_id && (
            <Link
              to={`/admin/vehicle/${lead.vehicle_id}`}
              className="flex items-center gap-2 text-sm text-[#C4A484] hover:underline"
            >
              <ExternalLink size={14} />
              Voir la fiche : {lead.vehicle_label || 'Véhicule'}
            </Link>
          )}

          {/* Notes internes */}
          <div>
            <p className="text-xs text-white/30 uppercase tracking-wider mb-2">Notes internes</p>
            <textarea
              value={editingNotes[lead.id] !== undefined ? editingNotes[lead.id] : (lead.notes || '')}
              onChange={(e) => setEditingNotes(prev => ({ ...prev, [lead.id]: e.target.value }))}
              placeholder="Ajouter des notes..."
              className="w-full bg-[#1a1212] border border-white/10 rounded-lg p-3 text-sm text-white placeholder:text-white/20 resize-none min-h-[60px] focus:outline-none focus:ring-1 focus:ring-[#5C3A2E]"
            />
            {editingNotes[lead.id] !== undefined && (
              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={() => setEditingNotes(prev => { const n = { ...prev }; delete n[lead.id]; return n })}
                  className="px-3 py-1 text-xs text-white/40 hover:text-white/60"
                >
                  Annuler
                </button>
                <button
                  onClick={() => onSaveNotes(lead.id)}
                  className="px-3 py-1 text-xs bg-[#5C3A2E] text-white rounded-md hover:bg-[#5C3A2E]/80"
                >
                  Sauvegarder
                </button>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
            <span className="text-xs text-white/30 mr-2">Statut :</span>
            {Object.entries(STATUS_CONFIG).map(([key, s]) => {
              const Icon = s.icon
              return (
                <button
                  key={key}
                  onClick={() => onStatusChange(lead.id, key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    lead.status === key
                      ? `${s.color} text-white`
                      : 'bg-white/5 text-white/40 hover:text-white/70'
                  }`}
                >
                  <Icon size={12} />
                  {s.label}
                </button>
              )
            })}

            <div className="flex-1" />

            <button
              onClick={onDelete}
              className="p-2 text-white/20 hover:text-red-400 transition-colors"
              title="Supprimer"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Leads
