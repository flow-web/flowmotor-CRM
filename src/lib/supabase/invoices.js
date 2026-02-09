import { supabase, isDemoMode } from './client'
import { STORAGE_KEYS } from '../../admin/utils/constants'

// ================================================================
// Helpers localStorage (mode démo)
// ================================================================
function getLocalInvoices() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.INVOICES)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveLocalInvoices(invoices) {
  localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices))
}

// ================================================================
// Génération du prochain numéro de facture
// Format: {PREFIX}-{YEAR}-{SEQ} ex: FM-2026-001
// ================================================================
export async function getNextInvoiceNumber(prefix) {
  const year = new Date().getFullYear()

  if (isDemoMode()) {
    const invoices = getLocalInvoices()
    const matching = invoices.filter(
      (inv) => inv.prefix === prefix && inv.year === year
    )
    const maxSeq = matching.reduce((max, inv) => Math.max(max, inv.sequence), 0)
    const nextSeq = maxSeq + 1
    return {
      invoiceNumber: `${prefix}-${year}-${String(nextSeq).padStart(3, '0')}`,
      prefix,
      year,
      sequence: nextSeq
    }
  }

  // Supabase: chercher le max sequence pour ce prefix+year
  const { data, error } = await supabase
    .from('invoices')
    .select('sequence')
    .eq('prefix', prefix)
    .eq('year', year)
    .order('sequence', { ascending: false })
    .limit(1)

  if (error) throw error

  const maxSeq = data?.[0]?.sequence || 0
  const nextSeq = maxSeq + 1

  return {
    invoiceNumber: `${prefix}-${year}-${String(nextSeq).padStart(3, '0')}`,
    prefix,
    year,
    sequence: nextSeq
  }
}

// ================================================================
// CRUD
// ================================================================
export async function createInvoice(invoiceData) {
  if (isDemoMode()) {
    const invoice = {
      id: crypto.randomUUID(),
      ...invoiceData,
      status: invoiceData.status || 'draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    const invoices = getLocalInvoices()
    invoices.push(invoice)
    saveLocalInvoices(invoices)
    return invoice
  }

  const { data, error } = await supabase
    .from('invoices')
    .insert(invoiceData)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function fetchInvoices() {
  if (isDemoMode()) {
    return getLocalInvoices().sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    )
  }

  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function updateInvoice(id, updates) {
  if (isDemoMode()) {
    const invoices = getLocalInvoices()
    const idx = invoices.findIndex((inv) => inv.id === id)
    if (idx === -1) throw new Error('Invoice not found')
    invoices[idx] = { ...invoices[idx], ...updates, updated_at: new Date().toISOString() }
    saveLocalInvoices(invoices)
    return invoices[idx]
  }

  const { data, error } = await supabase
    .from('invoices')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function finalizeInvoice(id) {
  return updateInvoice(id, { status: 'finalized' })
}

export async function cancelInvoice(id) {
  return updateInvoice(id, { status: 'cancelled' })
}
