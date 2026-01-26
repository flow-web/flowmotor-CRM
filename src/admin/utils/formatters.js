/**
 * Formate un prix en euros
 */
export function formatPrice(amount, currency = 'EUR') {
  if (amount === null || amount === undefined) return '-'

  const symbols = {
    EUR: '€',
    CHF: 'CHF',
    GBP: '£',
    JPY: '¥'
  }

  const formatted = new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)

  return `${formatted} ${symbols[currency] || currency}`
}

/**
 * Formate un kilométrage
 */
export function formatMileage(km) {
  if (!km) return '-'
  return `${new Intl.NumberFormat('fr-FR').format(km)} km`
}

/**
 * Formate un pourcentage
 */
export function formatPercent(value, decimals = 1) {
  if (value === null || value === undefined) return '-'
  return `${value.toFixed(decimals)}%`
}

/**
 * Formate une date en français
 */
export function formatDate(dateString) {
  if (!dateString) return '-'

  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date)
}

/**
 * Formate une date avec heure
 */
export function formatDateTime(dateString) {
  if (!dateString) return '-'

  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

/**
 * Formate une date relative (il y a X jours)
 */
export function formatRelativeDate(dateString) {
  if (!dateString) return '-'

  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return "Aujourd'hui"
  if (diffDays === 1) return 'Hier'
  if (diffDays < 7) return `Il y a ${diffDays} jours`
  if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaines`
  if (diffDays < 365) return `Il y a ${Math.floor(diffDays / 30)} mois`

  return formatDate(dateString)
}

/**
 * Génère un slug à partir d'une chaîne
 */
export function generateSlug(make, model, year) {
  const text = `${make}-${model}-${year}`
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * Génère un ID unique
 */
export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Tronque un texte
 */
export function truncate(text, maxLength = 50) {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return `${text.substring(0, maxLength)}...`
}

/**
 * Formate le nom complet d'un véhicule
 */
export function formatVehicleName(vehicle) {
  if (!vehicle) return '-'
  const { make, model, trim, year } = vehicle
  return `${make} ${model}${trim ? ` ${trim}` : ''} (${year})`
}

/**
 * Formate un VIN en groupes lisibles
 */
export function formatVIN(vin) {
  if (!vin) return '-'
  // Format: WVW ZZZ 3CZ WE 123456
  return vin.replace(/(.{3})(.{3})(.{3})(.{2})(.{6})/, '$1 $2 $3 $4 $5')
}
