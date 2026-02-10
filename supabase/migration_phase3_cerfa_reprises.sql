-- ================================================================
-- Phase 3 — CERFA Documents + Reprises (Trade-in)
-- ================================================================
-- Script NON-DESTRUCTIF : à exécuter sur la base existante
-- ================================================================

-- ===================
-- 1. Colonne registration_plate sur vehicles
-- ===================

ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS registration_plate TEXT;

-- ===================
-- 2. Table cerfa_documents
-- ===================

CREATE TABLE IF NOT EXISTS cerfa_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cerfa_number TEXT UNIQUE NOT NULL,         -- 'CC-2026-001'
  prefix TEXT NOT NULL,                       -- 'CC','DI','MI'
  year INTEGER NOT NULL,
  sequence INTEGER NOT NULL,
  cerfa_type TEXT NOT NULL,                   -- 'cession' | 'demande_immatriculation' | 'mandat_immatriculation'
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  direction TEXT NOT NULL DEFAULT 'sale',     -- 'sale' (company→client) | 'purchase' (client→company, reprise)
  vehicle_snapshot JSONB,
  client_snapshot JSONB,
  company_snapshot JSONB,
  sale_price FLOAT,
  sale_date TIMESTAMPTZ DEFAULT NOW(),
  reprise_id UUID,
  notes TEXT,
  status TEXT DEFAULT 'finalized',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index unique sur (prefix, year, sequence)
CREATE UNIQUE INDEX IF NOT EXISTS idx_cerfa_prefix_year_seq
  ON cerfa_documents (prefix, year, sequence);

CREATE INDEX IF NOT EXISTS idx_cerfa_vehicle ON cerfa_documents (vehicle_id);
CREATE INDEX IF NOT EXISTS idx_cerfa_client ON cerfa_documents (client_id);

-- Trigger updated_at
DROP TRIGGER IF EXISTS cerfa_documents_updated_at ON cerfa_documents;
CREATE TRIGGER cerfa_documents_updated_at
  BEFORE UPDATE ON cerfa_documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE cerfa_documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "cerfa_auth_all" ON cerfa_documents;
CREATE POLICY "cerfa_auth_all" ON cerfa_documents
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "cerfa_anon_deny" ON cerfa_documents;
CREATE POLICY "cerfa_anon_deny" ON cerfa_documents
  FOR SELECT TO anon USING (false);

-- ===================
-- 3. Table reprises (trade-in)
-- ===================

CREATE TABLE IF NOT EXISTS reprises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  tradein_vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  tradein_value FLOAT NOT NULL DEFAULT 0,
  invoice_id UUID REFERENCES invoices(id) ON DELETE SET NULL,
  cerfa_cession_id UUID REFERENCES cerfa_documents(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reprises_sale ON reprises (sale_vehicle_id);
CREATE INDEX IF NOT EXISTS idx_reprises_tradein ON reprises (tradein_vehicle_id);
CREATE INDEX IF NOT EXISTS idx_reprises_client ON reprises (client_id);

-- Trigger updated_at
DROP TRIGGER IF EXISTS reprises_updated_at ON reprises;
CREATE TRIGGER reprises_updated_at
  BEFORE UPDATE ON reprises
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE reprises ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "reprises_auth_all" ON reprises;
CREATE POLICY "reprises_auth_all" ON reprises
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "reprises_anon_deny" ON reprises;
CREATE POLICY "reprises_anon_deny" ON reprises
  FOR SELECT TO anon USING (false);

-- ===================
-- 4. Recréer police_register_view
-- ===================
-- Inclut registration_plate et joint invoices + clients pour l'acquéreur

CREATE OR REPLACE VIEW police_register_view AS
SELECT
  ROW_NUMBER() OVER (ORDER BY v.created_at ASC) AS "Numéro Police",
  TO_CHAR(v.created_at, 'DD/MM/YYYY') AS "Date Achat",
  v.brand || ' ' || v.model || COALESCE(' ' || v.trim, '') AS "Désignation",
  COALESCE(v.registration_plate, '-') AS "Immatriculation",
  v.purchase_price AS "Prix Achat",
  CASE WHEN v.status = 'SOLD' THEN TO_CHAR(v.updated_at, 'DD/MM/YYYY') ELSE NULL END AS "Date Vente",
  CASE
    WHEN v.status = 'SOLD' AND inv.client_snapshot IS NOT NULL
    THEN inv.client_snapshot->>'firstName' || ' ' || inv.client_snapshot->>'lastName'
    ELSE NULL
  END AS "Acquéreur",
  CASE WHEN v.status = 'SOLD' THEN v.selling_price ELSE NULL END AS "Prix Vente"
FROM vehicles v
LEFT JOIN LATERAL (
  SELECT client_snapshot
  FROM invoices
  WHERE vehicle_id = v.id AND status = 'finalized'
  ORDER BY created_at DESC
  LIMIT 1
) inv ON true
ORDER BY v.created_at ASC;

-- ================================================================
-- FIN MIGRATION PHASE 3
-- ================================================================
