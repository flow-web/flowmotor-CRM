import { supabase, isDemoMode, hashApiKey, getKeyPrefix } from './client'

// Génère une nouvelle clé API
export async function generateApiKey(name, permissions = ['read:kpis'], expiresInDays = null) {
  if (isDemoMode()) {
    throw new Error('Demo mode - API keys not available')
  }

  // Génère une clé aléatoire
  const randomBytes = new Uint8Array(32)
  crypto.getRandomValues(randomBytes)
  const key = 'fm_' + Array.from(randomBytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')

  const keyHash = await hashApiKey(key)
  const keyPrefix = getKeyPrefix(key)

  let expiresAt = null
  if (expiresInDays) {
    const expDate = new Date()
    expDate.setDate(expDate.getDate() + expiresInDays)
    expiresAt = expDate.toISOString()
  }

  const { data, error } = await supabase
    .from('api_keys')
    .insert({
      name,
      key_hash: keyHash,
      key_prefix: keyPrefix,
      permissions,
      is_active: true,
      expires_at: expiresAt
    })
    .select()
    .single()

  if (error) throw error

  // Retourne la clé une seule fois (ne sera plus visible ensuite)
  return {
    id: data.id,
    name: data.name,
    key, // IMPORTANT: C'est la seule fois où la clé complète est visible
    keyPrefix: data.key_prefix,
    permissions: data.permissions,
    isActive: data.is_active,
    expiresAt: data.expires_at,
    createdAt: data.created_at
  }
}

// Liste toutes les clés API (sans les clés elles-mêmes)
export async function listApiKeys() {
  if (isDemoMode()) {
    throw new Error('Demo mode - API keys not available')
  }

  const { data, error } = await supabase
    .from('api_keys')
    .select('id, name, key_prefix, permissions, is_active, last_used_at, expires_at, created_at')
    .order('created_at', { ascending: false })

  if (error) throw error

  return data.map(k => ({
    id: k.id,
    name: k.name,
    keyPrefix: k.key_prefix,
    permissions: k.permissions,
    isActive: k.is_active,
    lastUsedAt: k.last_used_at,
    expiresAt: k.expires_at,
    createdAt: k.created_at,
    isExpired: k.expires_at && new Date(k.expires_at) < new Date()
  }))
}

// Révoque une clé API
export async function revokeApiKey(keyId) {
  if (isDemoMode()) {
    throw new Error('Demo mode - API keys not available')
  }

  const { error } = await supabase
    .from('api_keys')
    .update({ is_active: false })
    .eq('id', keyId)

  if (error) throw error
  return true
}

// Réactive une clé API
export async function reactivateApiKey(keyId) {
  if (isDemoMode()) {
    throw new Error('Demo mode - API keys not available')
  }

  const { error } = await supabase
    .from('api_keys')
    .update({ is_active: true })
    .eq('id', keyId)

  if (error) throw error
  return true
}

// Supprime définitivement une clé API
export async function deleteApiKey(keyId) {
  if (isDemoMode()) {
    throw new Error('Demo mode - API keys not available')
  }

  const { error } = await supabase
    .from('api_keys')
    .delete()
    .eq('id', keyId)

  if (error) throw error
  return true
}

// Met à jour le nom ou les permissions d'une clé
export async function updateApiKey(keyId, updates) {
  if (isDemoMode()) {
    throw new Error('Demo mode - API keys not available')
  }

  const dbUpdates = {}
  if (updates.name !== undefined) dbUpdates.name = updates.name
  if (updates.permissions !== undefined) dbUpdates.permissions = updates.permissions
  if (updates.expiresAt !== undefined) dbUpdates.expires_at = updates.expiresAt

  const { error } = await supabase
    .from('api_keys')
    .update(dbUpdates)
    .eq('id', keyId)

  if (error) throw error
  return true
}

// Valide une clé API
export async function validateApiKey(apiKey) {
  if (isDemoMode()) {
    throw new Error('Demo mode - API keys not available')
  }

  const keyHash = await hashApiKey(apiKey)

  const { data, error } = await supabase.rpc('validate_api_key', {
    api_key_hash: keyHash
  })

  if (error) throw error
  return data === true
}
