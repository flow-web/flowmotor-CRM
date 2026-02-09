-- ================================================================
-- Phase 2 — Table invoices + index + RLS
-- ================================================================

-- Table factures
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT UNIQUE NOT NULL,       -- 'FM-2026-001'
  prefix TEXT NOT NULL,                       -- 'BC','FM','FV'
  year INTEGER NOT NULL,
  sequence INTEGER NOT NULL,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  billing_type TEXT,                          -- 'margin' | 'vat' | null (for BC)
  total_amount FLOAT DEFAULT 0,
  vehicle_snapshot JSONB,
  client_snapshot JSONB,
  status TEXT DEFAULT 'draft',                -- draft | finalized | cancelled
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index unique sur (prefix, year, sequence) pour garantir la séquentialité
CREATE UNIQUE INDEX IF NOT EXISTS idx_invoices_prefix_year_seq
  ON invoices (prefix, year, sequence);

-- Index pour la recherche
CREATE INDEX IF NOT EXISTS idx_invoices_vehicle ON invoices (vehicle_id);
CREATE INDEX IF NOT EXISTS idx_invoices_client ON invoices (client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices (status);

-- RLS
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Politique : les utilisateurs authentifiés peuvent tout faire
CREATE POLICY "invoices_auth_all" ON invoices
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- Politique : lecture anonyme interdite
CREATE POLICY "invoices_anon_deny" ON invoices
  FOR SELECT TO anon
  USING (false);
