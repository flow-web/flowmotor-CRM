import { useState, useMemo, useCallback, useEffect } from 'react'
import {
  ChevronLeft, ChevronRight, Plus, Clock, MapPin, X, Check,
  CalendarDays, Search, Wrench, Truck, FileCheck, Users, Car,
  Trash2, CheckCircle2, Circle
} from 'lucide-react'
import TopHeader from '../components/layout/TopHeader'
import AdminCard from '../components/shared/AdminCard'
import { isDemoMode } from '../../lib/supabase/client'
import {
  fetchAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment
} from '../../lib/supabase/appointments'

// ─── Type config ───
const APPOINTMENT_TYPES = [
  { value: 'sourcing',  label: 'Sourcing',     icon: Search,    bg: 'rgba(59,130,246,0.15)',  text: '#60a5fa', border: 'rgba(59,130,246,0.25)' },
  { value: 'client',    label: 'Client',        icon: Users,     bg: 'rgba(34,197,94,0.15)',   text: '#4ade80', border: 'rgba(34,197,94,0.25)' },
  { value: 'customs',   label: 'Douanes',       icon: FileCheck, bg: 'rgba(249,115,22,0.15)',  text: '#fb923c', border: 'rgba(249,115,22,0.25)' },
  { value: 'workshop',  label: 'Atelier',       icon: Wrench,    bg: 'rgba(168,85,247,0.15)',  text: '#c084fc', border: 'rgba(168,85,247,0.25)' },
  { value: 'ct',        label: 'Controle Tech', icon: FileCheck, bg: 'rgba(234,179,8,0.15)',   text: '#facc15', border: 'rgba(234,179,8,0.25)' },
  { value: 'delivery',  label: 'Livraison',     icon: Truck,     bg: 'rgba(196,164,132,0.15)', text: '#C4A484', border: 'rgba(196,164,132,0.25)' },
]

const TYPE_MAP = Object.fromEntries(APPOINTMENT_TYPES.map(t => [t.value, t]))

const DURATION_OPTIONS = [
  { value: 15, label: '15 min' },
  { value: 30, label: '30 min' },
  { value: 45, label: '45 min' },
  { value: 60, label: '1h' },
  { value: 90, label: '1h30' },
  { value: 120, label: '2h' },
  { value: 180, label: '3h' },
]

const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
const MONTHS = [
  'Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Decembre'
]

// ─── Mock data for demo mode ───
function generateMockAppointments(year, month) {
  const base = [
    { id: 'mock-1', type: 'sourcing',  title: 'Recherche BMW M4 G82', appointment_date: `${year}-${String(month + 1).padStart(2, '0')}-03`, appointment_time: '10:00', duration_minutes: 60, location: 'Munich, DE', notes: 'Contacter dealer Munchen Motorsport', completed: false },
    { id: 'mock-2', type: 'client',    title: 'RDV M. Dupont', appointment_date: `${year}-${String(month + 1).padStart(2, '0')}-07`, appointment_time: '14:30', duration_minutes: 45, location: 'Showroom Flow Motor', notes: 'Presentation Porsche 911 992', completed: true },
    { id: 'mock-3', type: 'customs',   title: 'Dedouanement Audi RS6', appointment_date: `${year}-${String(month + 1).padStart(2, '0')}-10`, appointment_time: '09:00', duration_minutes: 120, location: 'Bureau de Douane Lyon', notes: null, completed: false },
    { id: 'mock-4', type: 'workshop',  title: 'Revision Mercedes C63', appointment_date: `${year}-${String(month + 1).padStart(2, '0')}-12`, appointment_time: '08:00', duration_minutes: 180, location: 'Atelier Flow Motor', notes: 'Vidange + freins + pneus', completed: false },
    { id: 'mock-5', type: 'ct',        title: 'CT Volkswagen Golf R', appointment_date: `${year}-${String(month + 1).padStart(2, '0')}-15`, appointment_time: '11:00', duration_minutes: 60, location: 'Dekra Villeurbanne', notes: null, completed: false },
    { id: 'mock-6', type: 'delivery',  title: 'Livraison Range Rover', appointment_date: `${year}-${String(month + 1).padStart(2, '0')}-18`, appointment_time: '16:00', duration_minutes: 30, location: 'Domicile client', notes: 'Apporter dossier complet + 2e cle', completed: false },
    { id: 'mock-7', type: 'client',    title: 'Essai Porsche Taycan', appointment_date: `${year}-${String(month + 1).padStart(2, '0')}-20`, appointment_time: '10:00', duration_minutes: 90, location: 'Showroom Flow Motor', notes: null, completed: false },
    { id: 'mock-8', type: 'sourcing',  title: 'Visite Autoscout24 NL', appointment_date: `${year}-${String(month + 1).padStart(2, '0')}-22`, appointment_time: '07:00', duration_minutes: 480, location: 'Amsterdam, NL', notes: 'Lot de 3 vehicules a inspecter', completed: false },
    { id: 'mock-9', type: 'workshop',  title: 'Detailing BMW M3', appointment_date: `${year}-${String(month + 1).padStart(2, '0')}-25`, appointment_time: '09:00', duration_minutes: 240, location: 'Atelier Flow Motor', notes: 'Polish + ceramic coating', completed: false },
    { id: 'mock-10', type: 'delivery', title: 'Livraison Audi RS3', appointment_date: `${year}-${String(month + 1).padStart(2, '0')}-28`, appointment_time: '14:00', duration_minutes: 45, location: 'Gare Part-Dieu', notes: 'Client arrive en train', completed: false },
  ]
  // Only keep dates that exist in the given month
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  return base.filter(a => {
    const day = parseInt(a.appointment_date.split('-')[2])
    return day <= daysInMonth
  })
}


// ─── Calendar helpers ───
function getCalendarDays(year, month) {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()

  // Monday = 0, Sunday = 6
  let startDow = firstDay.getDay() - 1
  if (startDow < 0) startDow = 6

  const days = []

  // Previous month padding
  const prevMonthLast = new Date(year, month, 0).getDate()
  for (let i = startDow - 1; i >= 0; i--) {
    days.push({ day: prevMonthLast - i, currentMonth: false, date: null })
  }

  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    days.push({ day: d, currentMonth: true, date: dateStr })
  }

  // Next month padding
  const remaining = 7 - (days.length % 7)
  if (remaining < 7) {
    for (let d = 1; d <= remaining; d++) {
      days.push({ day: d, currentMonth: false, date: null })
    }
  }

  return days
}

function formatTime(timeStr) {
  if (!timeStr) return ''
  return timeStr.slice(0, 5)
}

function todayStr() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}


// ─── Main Component ───
function Agenda() {
  const now = new Date()
  const [currentYear, setCurrentYear] = useState(now.getFullYear())
  const [currentMonth, setCurrentMonth] = useState(now.getMonth())
  const [selectedDate, setSelectedDate] = useState(null)
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingAppt, setEditingAppt] = useState(null)
  const demo = isDemoMode()

  // Form state
  const [formData, setFormData] = useState({
    type: 'client',
    title: '',
    appointmentDate: '',
    appointmentTime: '10:00',
    durationMinutes: 60,
    location: '',
    notes: '',
  })

  const today = todayStr()

  // Load appointments
  const loadAppointments = useCallback(async () => {
    if (demo) {
      setAppointments(generateMockAppointments(currentYear, currentMonth))
      return
    }

    setLoading(true)
    const startDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01`
    const endDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${new Date(currentYear, currentMonth + 1, 0).getDate()}`
    const { data } = await fetchAppointments(startDate, endDate)
    setAppointments(data || [])
    setLoading(false)
  }, [currentYear, currentMonth, demo])

  useEffect(() => {
    loadAppointments()
  }, [loadAppointments])

  // Calendar grid
  const calendarDays = useMemo(
    () => getCalendarDays(currentYear, currentMonth),
    [currentYear, currentMonth]
  )

  // Appointments indexed by date
  const apptsByDate = useMemo(() => {
    const map = {}
    for (const a of appointments) {
      const d = a.appointment_date
      if (!map[d]) map[d] = []
      map[d].push(a)
    }
    return map
  }, [appointments])

  // Selected day appointments
  const selectedDayAppts = selectedDate ? (apptsByDate[selectedDate] || []) : []

  // Navigation
  const goToPrev = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1) }
    else setCurrentMonth(m => m - 1)
    setSelectedDate(null)
  }

  const goToNext = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1) }
    else setCurrentMonth(m => m + 1)
    setSelectedDate(null)
  }

  const goToToday = () => {
    const n = new Date()
    setCurrentYear(n.getFullYear())
    setCurrentMonth(n.getMonth())
    setSelectedDate(todayStr())
  }

  // CRUD handlers
  const openNewForm = (date) => {
    setEditingAppt(null)
    setFormData({
      type: 'client',
      title: '',
      appointmentDate: date || selectedDate || today,
      appointmentTime: '10:00',
      durationMinutes: 60,
      location: '',
      notes: '',
    })
    setShowForm(true)
  }

  const openEditForm = (appt) => {
    setEditingAppt(appt)
    setFormData({
      type: appt.type,
      title: appt.title,
      appointmentDate: appt.appointment_date,
      appointmentTime: formatTime(appt.appointment_time),
      durationMinutes: appt.duration_minutes || 60,
      location: appt.location || '',
      notes: appt.notes || '',
    })
    setShowForm(true)
  }

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.appointmentDate) return

    if (demo) {
      // Mock save
      if (editingAppt) {
        setAppointments(prev => prev.map(a =>
          a.id === editingAppt.id
            ? { ...a, ...{ type: formData.type, title: formData.title, appointment_date: formData.appointmentDate, appointment_time: formData.appointmentTime, duration_minutes: formData.durationMinutes, location: formData.location, notes: formData.notes } }
            : a
        ))
      } else {
        const newAppt = {
          id: `mock-${Date.now()}`,
          type: formData.type,
          title: formData.title,
          appointment_date: formData.appointmentDate,
          appointment_time: formData.appointmentTime,
          duration_minutes: formData.durationMinutes,
          location: formData.location,
          notes: formData.notes,
          completed: false,
        }
        setAppointments(prev => [...prev, newAppt])
      }
      setShowForm(false)
      return
    }

    if (editingAppt) {
      const { data } = await updateAppointment(editingAppt.id, formData)
      if (data) await loadAppointments()
    } else {
      const { data } = await createAppointment(formData)
      if (data) await loadAppointments()
    }
    setShowForm(false)
  }

  const handleDelete = async (apptId) => {
    if (demo) {
      setAppointments(prev => prev.filter(a => a.id !== apptId))
      return
    }
    const { success } = await deleteAppointment(apptId)
    if (success) await loadAppointments()
  }

  const handleToggleComplete = async (appt) => {
    if (demo) {
      setAppointments(prev => prev.map(a =>
        a.id === appt.id ? { ...a, completed: !a.completed } : a
      ))
      return
    }
    await updateAppointment(appt.id, { completed: !appt.completed })
    await loadAppointments()
  }

  // Count total for the month
  const totalAppointments = appointments.length
  const completedCount = appointments.filter(a => a.completed).length

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #0F0808 0%, #1A0F0F 40%)' }}>
      <TopHeader title="Agenda" subtitle="Rendez-vous & planification" />

      <div className="p-4 sm:p-6 space-y-6 max-w-[1600px] mx-auto">

        {/* ─── Month Navigation + Stats ─── */}
        <div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{ animation: 'admin-fade-up 0.4s ease-out' }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={goToPrev}
              className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:border-[#D4AF37]/30 hover:bg-[#D4AF37]/[0.06] transition-all duration-300"
              aria-label="Mois precedent"
            >
              <ChevronLeft size={18} className="text-white/50" />
            </button>
            <div className="min-w-[200px] text-center">
              <h2 className="font-display text-xl sm:text-2xl font-semibold text-white tracking-wide">
                {MONTHS[currentMonth]}
              </h2>
              <p className="text-[11px] text-[#D4AF37]/50 font-mono tabular-nums tracking-wider">{currentYear}</p>
            </div>
            <button
              onClick={goToNext}
              className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:border-[#D4AF37]/30 hover:bg-[#D4AF37]/[0.06] transition-all duration-300"
              aria-label="Mois suivant"
            >
              <ChevronRight size={18} className="text-white/50" />
            </button>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Today button */}
            <button
              onClick={goToToday}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:border-[#D4AF37]/30 text-sm text-white/50 hover:text-[#D4AF37] transition-all duration-300"
            >
              <CalendarDays size={14} />
              <span className="text-[11px] uppercase tracking-wider font-medium">Aujourd'hui</span>
            </button>

            {/* New appointment button */}
            <button
              onClick={() => openNewForm(selectedDate || today)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #D4AF37, #B8960C)',
                color: '#1A0F0F',
              }}
            >
              <Plus size={16} />
              <span className="text-[12px] uppercase tracking-wider">Nouveau RDV</span>
            </button>
          </div>
        </div>

        {/* ─── KPI Pills ─── */}
        <div
          className="flex items-center gap-3 flex-wrap"
          style={{ animation: 'admin-fade-up 0.5s ease-out' }}
        >
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
            <CalendarDays size={13} className="text-[#D4AF37]/60" />
            <span className="text-[11px] text-white/40 font-medium">{totalAppointments} RDV</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
            <CheckCircle2 size={13} className="text-emerald-400/60" />
            <span className="text-[11px] text-white/40 font-medium">{completedCount} termines</span>
          </div>
          {demo && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <span className="text-[11px] text-yellow-400/80 font-medium">Mode demo</span>
            </div>
          )}
        </div>

        {/* ─── Main Grid: Calendar + Side Panel ─── */}
        <div
          className="grid lg:grid-cols-3 gap-6"
          style={{ animation: 'admin-fade-up 0.6s ease-out' }}
        >
          {/* Calendar */}
          <div className="lg:col-span-2">
            <AdminCard padding={false} className="overflow-hidden">
              {/* Day headers */}
              <div className="grid grid-cols-7 border-b border-white/[0.06]">
                {DAYS.map(d => (
                  <div key={d} className="py-3 text-center">
                    <span className="text-[10px] text-white/25 uppercase tracking-[0.15em] font-medium">{d}</span>
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7">
                {calendarDays.map((cell, i) => {
                  const isToday = cell.date === today
                  const isSelected = cell.date === selectedDate
                  const dayAppts = cell.date ? (apptsByDate[cell.date] || []) : []
                  const hasAppts = dayAppts.length > 0

                  return (
                    <button
                      key={i}
                      onClick={() => cell.currentMonth && setSelectedDate(cell.date)}
                      disabled={!cell.currentMonth}
                      className={`
                        relative min-h-[80px] sm:min-h-[100px] p-1.5 sm:p-2 border-b border-r border-white/[0.04] text-left transition-all duration-200
                        ${cell.currentMonth
                          ? 'hover:bg-[#D4AF37]/[0.04] cursor-pointer'
                          : 'opacity-25 cursor-default'
                        }
                        ${isSelected ? 'bg-[#D4AF37]/[0.06]' : ''}
                      `}
                    >
                      {/* Day number */}
                      <span
                        className={`
                          inline-flex items-center justify-center w-7 h-7 rounded-full text-[13px] font-medium transition-all
                          ${isToday
                            ? 'ring-2 ring-[#C4A484] text-[#C4A484] font-bold'
                            : isSelected
                              ? 'bg-[#D4AF37]/20 text-[#D4AF37] font-semibold'
                              : cell.currentMonth
                                ? 'text-white/60'
                                : 'text-white/20'
                          }
                        `}
                      >
                        {cell.day}
                      </span>

                      {/* Appointment pills */}
                      <div className="mt-1 space-y-0.5 overflow-hidden max-h-[50px] sm:max-h-[65px]">
                        {dayAppts.slice(0, 3).map(appt => {
                          const tc = TYPE_MAP[appt.type]
                          return (
                            <div
                              key={appt.id}
                              className="flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] sm:text-[10px] font-medium truncate"
                              style={{ background: tc?.bg || 'rgba(255,255,255,0.05)', color: tc?.text || '#fff' }}
                            >
                              <span className="truncate">{formatTime(appt.appointment_time)} {appt.title}</span>
                            </div>
                          )
                        })}
                        {dayAppts.length > 3 && (
                          <span className="text-[9px] text-white/30 pl-1.5">+{dayAppts.length - 3} de plus</span>
                        )}
                      </div>

                      {/* Dot indicator for appointments (mobile) */}
                      {hasAppts && (
                        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-0.5 sm:hidden">
                          {dayAppts.slice(0, 3).map((appt, j) => {
                            const tc = TYPE_MAP[appt.type]
                            return <div key={j} className="w-1.5 h-1.5 rounded-full" style={{ background: tc?.text }} />
                          })}
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </AdminCard>
          </div>

          {/* ─── Side Panel ─── */}
          <div className="space-y-4">
            {/* Selected day detail */}
            {selectedDate ? (
              <AdminCard>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      {new Date(selectedDate + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </h3>
                    <p className="text-[10px] text-white/30 mt-0.5 uppercase tracking-wider">
                      {selectedDayAppts.length} rendez-vous
                    </p>
                  </div>
                  <button
                    onClick={() => openNewForm(selectedDate)}
                    className="p-2 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20 hover:bg-[#D4AF37]/20 transition-all duration-200"
                    aria-label="Ajouter un rendez-vous"
                  >
                    <Plus size={16} className="text-[#D4AF37]" />
                  </button>
                </div>

                {selectedDayAppts.length === 0 ? (
                  <div className="py-8 text-center">
                    <CalendarDays size={28} className="text-white/10 mx-auto mb-3" />
                    <p className="text-[11px] text-white/30 uppercase tracking-wider">Aucun rendez-vous</p>
                    <button
                      onClick={() => openNewForm(selectedDate)}
                      className="mt-3 text-[11px] text-[#D4AF37]/60 hover:text-[#D4AF37] transition-colors uppercase tracking-wider font-medium"
                    >
                      + Planifier
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selectedDayAppts
                      .sort((a, b) => (a.appointment_time || '').localeCompare(b.appointment_time || ''))
                      .map(appt => {
                        const tc = TYPE_MAP[appt.type]
                        const Icon = tc?.icon || CalendarDays

                        return (
                          <div
                            key={appt.id}
                            className={`group relative p-3.5 rounded-xl border transition-all duration-200 hover:border-opacity-50 ${
                              appt.completed ? 'opacity-50' : ''
                            }`}
                            style={{
                              background: appt.completed ? 'rgba(255,255,255,0.02)' : (tc?.bg || 'rgba(255,255,255,0.03)'),
                              borderColor: appt.completed ? 'rgba(255,255,255,0.04)' : (tc?.border || 'rgba(255,255,255,0.06)'),
                            }}
                          >
                            <div className="flex items-start gap-3">
                              {/* Complete toggle */}
                              <button
                                onClick={() => handleToggleComplete(appt)}
                                className="mt-0.5 flex-shrink-0 transition-colors"
                                aria-label={appt.completed ? 'Marquer comme non termine' : 'Marquer comme termine'}
                              >
                                {appt.completed ? (
                                  <CheckCircle2 size={18} className="text-emerald-400" />
                                ) : (
                                  <Circle size={18} className="text-white/20 hover:text-white/40" />
                                )}
                              </button>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <Icon size={13} style={{ color: tc?.text }} />
                                  <span className="text-[9px] uppercase tracking-[0.15em] font-semibold" style={{ color: tc?.text }}>
                                    {tc?.label}
                                  </span>
                                </div>

                                <p className={`text-sm font-medium mb-1.5 ${appt.completed ? 'line-through text-white/40' : 'text-white'}`}>
                                  {appt.title}
                                </p>

                                <div className="flex items-center gap-3 flex-wrap">
                                  <span className="flex items-center gap-1 text-[10px] text-white/40 font-mono tabular-nums">
                                    <Clock size={10} className="text-white/20" />
                                    {formatTime(appt.appointment_time)}
                                    {appt.duration_minutes && (
                                      <span className="text-white/20"> ({appt.duration_minutes}min)</span>
                                    )}
                                  </span>
                                  {appt.location && (
                                    <span className="flex items-center gap-1 text-[10px] text-white/40 truncate">
                                      <MapPin size={10} className="text-white/20 flex-shrink-0" />
                                      <span className="truncate">{appt.location}</span>
                                    </span>
                                  )}
                                </div>

                                {appt.notes && (
                                  <p className="text-[10px] text-white/25 mt-2 leading-relaxed">{appt.notes}</p>
                                )}
                              </div>

                              {/* Actions */}
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                                <button
                                  onClick={() => openEditForm(appt)}
                                  className="p-1.5 rounded-lg hover:bg-white/[0.06] transition-colors"
                                  aria-label="Modifier"
                                >
                                  <CalendarDays size={13} className="text-white/40" />
                                </button>
                                <button
                                  onClick={() => handleDelete(appt.id)}
                                  className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                                  aria-label="Supprimer"
                                >
                                  <Trash2 size={13} className="text-white/30 hover:text-red-400" />
                                </button>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                  </div>
                )}
              </AdminCard>
            ) : (
              <AdminCard>
                <div className="py-10 text-center">
                  <CalendarDays size={32} className="text-white/10 mx-auto mb-3" />
                  <p className="text-sm text-white/30">Selectionnez un jour</p>
                  <p className="text-[10px] text-white/15 mt-1 uppercase tracking-wider">pour voir les rendez-vous</p>
                </div>
              </AdminCard>
            )}

            {/* Legend */}
            <AdminCard>
              <h4 className="text-[10px] text-white/25 uppercase tracking-[0.15em] font-medium mb-3">Types de rendez-vous</h4>
              <div className="grid grid-cols-2 gap-2">
                {APPOINTMENT_TYPES.map(t => {
                  const Icon = t.icon
                  return (
                    <div key={t.value} className="flex items-center gap-2 px-2 py-1.5 rounded-lg" style={{ background: t.bg }}>
                      <Icon size={12} style={{ color: t.text }} />
                      <span className="text-[10px] font-medium" style={{ color: t.text }}>{t.label}</span>
                    </div>
                  )
                })}
              </div>
            </AdminCard>
          </div>
        </div>

        {/* ─── Form Modal Overlay ─── */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

            <div
              className="relative w-full max-w-lg rounded-2xl border border-white/[0.08] p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200"
              style={{ background: 'linear-gradient(180deg, #1A1414 0%, #0F0808 100%)' }}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold text-white">
                  {editingAppt ? 'Modifier le RDV' : 'Nouveau rendez-vous'}
                </h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-2 rounded-lg hover:bg-white/[0.06] transition-colors"
                  aria-label="Fermer"
                >
                  <X size={18} className="text-white/40" />
                </button>
              </div>

              {/* Type selector — "No Write, Just Click" */}
              <div>
                <label className="text-[10px] text-white/30 uppercase tracking-[0.15em] font-medium mb-2.5 block">Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {APPOINTMENT_TYPES.map(t => {
                    const Icon = t.icon
                    const selected = formData.type === t.value
                    return (
                      <button
                        key={t.value}
                        type="button"
                        onClick={() => setFormData(f => ({ ...f, type: t.value }))}
                        className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border transition-all duration-200"
                        style={{
                          background: selected ? t.bg : 'rgba(255,255,255,0.02)',
                          borderColor: selected ? t.border : 'rgba(255,255,255,0.06)',
                        }}
                      >
                        <Icon size={18} style={{ color: selected ? t.text : 'rgba(255,255,255,0.3)' }} />
                        <span className="text-[10px] font-medium" style={{ color: selected ? t.text : 'rgba(255,255,255,0.4)' }}>
                          {t.label}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Title — free-form, so text input is appropriate */}
              <div>
                <label className="text-[10px] text-white/30 uppercase tracking-[0.15em] font-medium mb-2 block">Titre</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData(f => ({ ...f, title: e.target.value }))}
                  placeholder="Ex: RDV essai Porsche 911..."
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#D4AF37]/30 focus:ring-1 focus:ring-[#D4AF37]/10 transition-all"
                />
              </div>

              {/* Date + Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-white/30 uppercase tracking-[0.15em] font-medium mb-2 block">Date</label>
                  <input
                    type="date"
                    value={formData.appointmentDate}
                    onChange={e => setFormData(f => ({ ...f, appointmentDate: e.target.value }))}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF37]/30 focus:ring-1 focus:ring-[#D4AF37]/10 transition-all [color-scheme:dark]"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-white/30 uppercase tracking-[0.15em] font-medium mb-2 block">Heure</label>
                  <input
                    type="time"
                    value={formData.appointmentTime}
                    onChange={e => setFormData(f => ({ ...f, appointmentTime: e.target.value }))}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF37]/30 focus:ring-1 focus:ring-[#D4AF37]/10 transition-all [color-scheme:dark]"
                  />
                </div>
              </div>

              {/* Duration — "No Write, Just Click" pill selector */}
              <div>
                <label className="text-[10px] text-white/30 uppercase tracking-[0.15em] font-medium mb-2.5 block">Duree</label>
                <div className="flex flex-wrap gap-2">
                  {DURATION_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setFormData(f => ({ ...f, durationMinutes: opt.value }))}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-medium border transition-all duration-200 ${
                        formData.durationMinutes === opt.value
                          ? 'bg-[#D4AF37]/15 border-[#D4AF37]/30 text-[#D4AF37]'
                          : 'bg-white/[0.03] border-white/[0.06] text-white/40 hover:border-white/10'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location — free-form */}
              <div>
                <label className="text-[10px] text-white/30 uppercase tracking-[0.15em] font-medium mb-2 block">Lieu</label>
                <div className="relative">
                  <MapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20" />
                  <input
                    type="text"
                    value={formData.location}
                    onChange={e => setFormData(f => ({ ...f, location: e.target.value }))}
                    placeholder="Adresse ou lieu..."
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#D4AF37]/30 focus:ring-1 focus:ring-[#D4AF37]/10 transition-all"
                  />
                </div>
              </div>

              {/* Notes — free-form */}
              <div>
                <label className="text-[10px] text-white/30 uppercase tracking-[0.15em] font-medium mb-2 block">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={e => setFormData(f => ({ ...f, notes: e.target.value }))}
                  placeholder="Details supplementaires..."
                  rows={2}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#D4AF37]/30 focus:ring-1 focus:ring-[#D4AF37]/10 transition-all resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm text-white/50 hover:bg-white/[0.06] hover:text-white/70 transition-all duration-200"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSave}
                  disabled={!formData.title.trim()}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    background: 'linear-gradient(135deg, #D4AF37, #B8960C)',
                    color: '#1A0F0F',
                  }}
                >
                  <span className="flex items-center justify-center gap-2">
                    <Check size={16} />
                    {editingAppt ? 'Modifier' : 'Creer'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Agenda
