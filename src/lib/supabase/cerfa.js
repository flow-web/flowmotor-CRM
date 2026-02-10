import { supabase, isDemoMode } from './client'
import { STORAGE_KEYS } from '../../admin/utils/constants'

// ================================================================
// Helpers localStorage (mode démo)
// ================================================================
function getLocalCerfa() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CERFA)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveLocalCerfa(docs) {
  localStorage.setItem(STORAGE_KEYS.CERFA, JSON.stringify(docs))
}

// ================================================================
// Génération du prochain numéro CERFA
// Format: {PREFIX}-{YEAR}-{SEQ} ex: CC-2026-001
// ================================================================
export async function getNextCerfaNumber(prefix) {
  const year = new Date().getFullYear()

  if (isDemoMode()) {
    const docs = getLocalCerfa()
    const matching = docs.filter(
      (d) => d.prefix === prefix && d.year === year
    )
    const maxSeq = matching.reduce((max, d) => Math.max(max, d.sequence), 0)
    const nextSeq = maxSeq + 1
    return {
      cerfaNumber: `${prefix}-${year}-${String(nextSeq).padStart(3, '0')}`,
      prefix,
      year,
      sequence: nextSeq
    }
  }

  const { data, error } = await supabase
    .from('cerfa_documents')
    .select('sequence')
    .eq('prefix', prefix)
    .eq('year', year)
    .order('sequence', { ascending: false })
    .limit(1)

  if (error) throw error

  const maxSeq = data?.[0]?.sequence || 0
  const nextSeq = maxSeq + 1

  return {
    cerfaNumber: `${prefix}-${year}-${String(nextSeq).padStart(3, '0')}`,
    prefix,
    year,
    sequence: nextSeq
  }
}

// ================================================================
// CRUD
// ================================================================
export async function createCerfaDocument(docData) {
  if (isDemoMode()) {
    const doc = {
      id: crypto.randomUUID(),
      ...docData,
      status: docData.status || 'finalized',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    const docs = getLocalCerfa()
    docs.push(doc)
    saveLocalCerfa(docs)
    return doc
  }

  const { data, error } = await supabase
    .from('cerfa_documents')
    .insert(docData)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function fetchCerfaDocuments() {
  if (isDemoMode()) {
    return getLocalCerfa().sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    )
  }

  const { data, error } = await supabase
    .from('cerfa_documents')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function fetchCerfaByVehicle(vehicleId) {
  if (isDemoMode()) {
    return getLocalCerfa()
      .filter((d) => d.vehicle_id === vehicleId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  }

  const { data, error } = await supabase
    .from('cerfa_documents')
    .select('*')
    .eq('vehicle_id', vehicleId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}
