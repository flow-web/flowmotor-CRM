-- =====================================================
-- FLOW MOTOR - MIGRATION PHASE 1 : SÉCURITÉ & LEADS
-- =====================================================
-- Script NON-DESTRUCTIF : à exécuter sur la base existante
-- Ne supprime AUCUNE donnée, ajoute les nouvelles tables et
-- remplace les policies RLS par des policies sécurisées.
-- =====================================================

-- ===================
-- 1. TYPE ENUM LEADS
-- ===================

DO $$ BEGIN
  CREATE TYPE lead_status AS ENUM ('NEW', 'CONTACTED', 'NEGOTIATION', 'CONVERTED', 'LOST');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- ===================
-- 2. TABLE LEADS
-- ===================

CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  vehicle_label TEXT,
  source TEXT DEFAULT 'contact_form',
  status lead_status DEFAULT 'NEW',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at DESC);

-- Trigger updated_at pour leads
DROP TRIGGER IF EXISTS leads_updated_at ON leads;
CREATE TRIGGER leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===================
-- 3. RLS LEADS
-- ===================

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Anon peut insérer (formulaire contact public)
DROP POLICY IF EXISTS "leads_anon_insert" ON leads;
CREATE POLICY "leads_anon_insert" ON leads
  FOR INSERT TO anon WITH CHECK (true);

-- Authenticated a accès complet (CRM)
DROP POLICY IF EXISTS "leads_auth_all" ON leads;
CREATE POLICY "leads_auth_all" ON leads
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ===================
-- 4. SÉCURISER LES POLICIES EXISTANTES
-- ===================

-- ── VEHICLES : anon passe de ALL → SELECT only ──
DROP POLICY IF EXISTS "Enable all for anon" ON vehicles;
DROP POLICY IF EXISTS "vehicles_anon_select" ON vehicles;
CREATE POLICY "vehicles_anon_select" ON vehicles
  FOR SELECT TO anon USING (true);

-- Authenticated reste full access (renommage propre)
DROP POLICY IF EXISTS "Enable all for authenticated" ON vehicles;
DROP POLICY IF EXISTS "vehicles_auth_all" ON vehicles;
CREATE POLICY "vehicles_auth_all" ON vehicles
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ── CLIENTS : anon perd tout accès ──
DROP POLICY IF EXISTS "Enable all for anon" ON clients;
-- Pas de policy anon = aucun accès (RLS activé)

DROP POLICY IF EXISTS "Enable all for authenticated" ON clients;
DROP POLICY IF EXISTS "clients_auth_all" ON clients;
CREATE POLICY "clients_auth_all" ON clients
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ── SETTINGS : anon perd tout accès ──
DROP POLICY IF EXISTS "Enable all for anon" ON settings;

DROP POLICY IF EXISTS "Enable all for authenticated" ON settings;
DROP POLICY IF EXISTS "settings_auth_all" ON settings;
CREATE POLICY "settings_auth_all" ON settings
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- =====================================================
-- FIN MIGRATION — Résumé des changements :
-- ✅ Table 'leads' créée (formulaire contact → CRM)
-- ✅ Anon : SELECT only sur vehicles (plus de write)
-- ✅ Anon : aucun accès à clients et settings
-- ✅ Anon : INSERT only sur leads (formulaire public)
-- ✅ Authenticated : accès complet sur tout (CRM admin)
-- =====================================================
