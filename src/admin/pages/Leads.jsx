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
  CONTACTED: { label: 'Contacte', color: 'bg-yellow-500', textColor: 'text-yellow-400', icon: Phone },
  NEGOTIATION: { label: 'Negociation', color: 'bg-purple-500', textColor: 'text-purple-400', icon: Clock },
  CONVERTED: { label: 'Converti', color: 'bg-emerald-500', textColor: 'text-emerald-400', icon: CheckCircle },
  LOST: { label: 'Perdu', color: 'bg-red-500/60', textColor: 'text-red-400', icon: XCircle },
}

const SUBJECT_LABELS = {
  achat: "Achat d'un vehicule",
  reprise: 'Reprise / Depot-vente',
  recherche: 'Recherche personnalisee',
  autre: 'Autre',
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
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
      if (err.name === 'AbortError' || err.message?.includes('aborted')) return
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
      toast.success(`Lead passe en "${STATUS_CONFIG[newStatus].label}"`)
    } catch (err) {
      console.error('Erreur mise a jour:', err)
      toast.error('Erreur de mise a jour')
    }
  }

  const handleSaveNotes = async (leadId) => {
    const notes = editingNotes[leadId]
    if (notes === undefined) return

    try {
      const updated = await updateLead(leadId, { notes })
      setLeads(prev => prev.map(l => l.id === leadId ? updated : l))
      setEditingNotes(prev => { const n = { ...prev }; delete n[leadId]; return n })
      toast.success('Notes sauvegardees')
    } catch (err) {
      console.error('Erreur sauvegarde notes:', err)
      toast.error('Erreur de sauvegarde')
    }
  }

  const handleDelete = async (lead) => {
    const confirmed = await showConfirm({
      title: 'Supprimer le lead',
      message: `Supprimer le lead de ${lead.name} ? Cette action est irreversible.`,
      confirmLabel: 'Supprimer',
      variant: 'danger'
    })
    if (!confirmed) return

    try {
      await deleteLead(lead.id)
      setLeads(prev => prev.filter(l => l.id !== lead.id))
      toast.success('Lead supprime')
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
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #0F0808 0%, #1A0F0F 40%)' }}>
      <TopHeader title="Leads" subtitle="Prospects depuis le site" />

      <div className="p-6 space-y-6 max-w-[1600px] mx-auto" style={{ animation: 'admin-fade-up 0.4s ease-out' }}>
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total" value={stats.total} color="text-white" />
          <StatCard label="Nouveaux" value={stats.new} color="text-blue-400" />
          <StatCard label="En cours" value={stats.active} color="text-yellow-400" />
          <StatCard label="Convertis" value={stats.converted} color="text-emerald-400" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20" />
            <input
              type="text"
              placeholder="Rechercher un lead..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#D4AF37]/30 focus:ring-1 focus:ring-[#D4AF37]/10 transition-all duration-300"
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

        {/* Lead List */}
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 w-full skeleton-gold" />
            ))}
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="card-admin p-12 text-center">
            <MessageSquare size={40} className="mx-auto text-white/10 mb-4" />
            <p className="text-[11px] text-white/30 uppercase tracking-wider">
              {leads.length === 0
                ? 'Aucun lead pour le moment. Les prospects arriveront via le formulaire de contact du site.'
                : 'Aucun lead ne correspond a vos filtres.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredLeads.map((lead, index) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                index={index}
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
    <div className="card-admin-kpi p-5">
      <p className="text-[10px] text-white/25 uppercase tracking-[0.15em] font-medium">{label}</p>
      <p className={`text-2xl font-mono font-bold mt-1 tabular-nums ${color}`}>{value}</p>
    </div>
  )
}

function FilterChip({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all duration-200 uppercase tracking-wider ${
        active
          ? 'text-[#1A0F0F] shadow-[0_2px_8px_rgba(212,175,55,0.2)]'
          : 'bg-white/[0.04] text-white/40 hover:text-white/70 border border-white/[0.06] hover:border-white/10'
      }`}
      style={active ? { background: 'linear-gradient(135deg, #D4AF37, #B8960C)' } : undefined}
    >
      {children}
    </button>
  )
}

function LeadCard({ lead, index, expanded, onToggle, onStatusChange, onDelete, editingNotes, setEditingNotes, onSaveNotes }) {
  const cfg = STATUS_CONFIG[lead.status] || STATUS_CONFIG.NEW
  const StatusIcon = cfg.icon

  return (
    <div
      className="card-admin overflow-hidden hover:border-[#D4AF37]/15 transition-all duration-300"
      style={{ animation: `admin-fade-up ${0.2 + Math.min(index, 8) * 0.04}s ease-out` }}
    >
      {/* Header -- always visible */}
      <button onClick={onToggle} className="w-full p-5 flex items-center gap-4 text-left hover:bg-[#D4AF37]/[0.02] transition-colors">
        {/* Status dot */}
        <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${cfg.color}`} style={{ boxShadow: '0 0 8px currentColor' }} />

        {/* Main info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-white font-semibold truncate">{lead.name}</span>
            {lead.status === 'NEW' && (
              <span className="px-2 py-0.5 bg-blue-500/15 text-blue-400 text-[9px] uppercase tracking-[0.1em] rounded-full font-semibold border border-blue-400/20">
                Nouveau
              </span>
            )}
          </div>
          <p className="text-[11px] text-white/30 truncate mt-0.5">
            {SUBJECT_LABELS[lead.subject] || lead.subject}
            {lead.vehicle_label && <span className="text-[#D4AF37]/70"> -- {lead.vehicle_label}</span>}
          </p>
        </div>

        {/* Date */}
        <span className="text-[10px] text-white/20 flex-shrink-0 hidden sm:block font-mono tabular-nums">
          {formatDate(lead.created_at)}
        </span>

        {/* Chevron */}
        {expanded ? <ChevronUp size={15} className="text-white/20" /> : <ChevronDown size={15} className="text-white/20" />}
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-5 pb-5 border-t border-white/[0.04] pt-4 space-y-4">
          {/* Contact info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a href={`mailto:${lead.email}`} className="flex items-center gap-2 text-[12px] text-white/40 hover:text-[#D4AF37] transition-colors duration-200">
              <Mail size={13} className="text-[#D4AF37]/40" />
              {lead.email}
            </a>
            {lead.phone && (
              <a href={`tel:${lead.phone}`} className="flex items-center gap-2 text-[12px] text-white/40 hover:text-[#D4AF37] transition-colors duration-200">
                <Phone size={13} className="text-[#D4AF37]/40" />
                <span className="font-mono tabular-nums">{lead.phone}</span>
              </a>
            )}
          </div>

          {/* Message */}
          {lead.message && (
            <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <p className="text-[9px] text-white/20 uppercase tracking-[0.15em] font-medium mb-2">Message</p>
              <p className="text-[13px] text-white/60 whitespace-pre-wrap leading-relaxed">{lead.message}</p>
            </div>
          )}

          {/* Associated vehicle */}
          {lead.vehicle_id && (
            <Link
              to={`/admin/vehicle/${lead.vehicle_id}`}
              className="flex items-center gap-2 text-[12px] text-[#D4AF37]/70 hover:text-[#D4AF37] transition-colors duration-200"
            >
              <ExternalLink size={13} />
              Voir la fiche : {lead.vehicle_label || 'Vehicule'}
            </Link>
          )}

          {/* Internal notes */}
          <div>
            <p className="text-[9px] text-white/20 uppercase tracking-[0.15em] font-medium mb-2">Notes internes</p>
            <textarea
              value={editingNotes[lead.id] !== undefined ? editingNotes[lead.id] : (lead.notes || '')}
              onChange={(e) => setEditingNotes(prev => ({ ...prev, [lead.id]: e.target.value }))}
              placeholder="Ajouter des notes..."
              className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 text-[13px] text-white placeholder:text-white/15 resize-none min-h-[60px] focus:outline-none focus:border-[#D4AF37]/20 focus:ring-1 focus:ring-[#D4AF37]/10 transition-all"
            />
            {editingNotes[lead.id] !== undefined && (
              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={() => setEditingNotes(prev => { const n = { ...prev }; delete n[lead.id]; return n })}
                  className="px-3 py-1 text-[11px] text-white/30 hover:text-white/60 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={() => onSaveNotes(lead.id)}
                  className="px-3 py-1 text-[11px] rounded-lg font-semibold"
                  style={{ background: 'linear-gradient(135deg, #D4AF37, #B8960C)', color: '#1A0F0F' }}
                >
                  Sauvegarder
                </button>
              </div>
            )}
          </div>

          {/* Status actions */}
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-white/[0.04]">
            <span className="text-[9px] text-white/20 mr-2 uppercase tracking-[0.15em] font-medium">Statut :</span>
            {Object.entries(STATUS_CONFIG).map(([key, s]) => {
              const Icon = s.icon
              return (
                <button
                  key={key}
                  onClick={() => onStatusChange(lead.id, key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-semibold transition-all duration-200 uppercase tracking-wider ${
                    lead.status === key
                      ? `${s.color} text-white shadow-sm`
                      : 'bg-white/[0.04] text-white/30 hover:text-white/60 border border-white/[0.04]'
                  }`}
                >
                  <Icon size={11} />
                  {s.label}
                </button>
              )
            })}

            <div className="flex-1" />

            <button
              onClick={onDelete}
              className="p-2 text-white/15 hover:text-red-400 transition-colors duration-200"
              title="Supprimer"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Leads
