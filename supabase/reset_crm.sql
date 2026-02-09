-- =====================================================
-- FLOW MOTOR CRM - RESET SCRIPT (100% IDEMPOTENT)
-- =====================================================
-- Ce script peut être exécuté plusieurs fois sans erreur
-- Copiez-collez dans Supabase SQL Editor et exécutez
-- =====================================================

-- ===================
-- 0. NETTOYAGE COMPLET
-- ===================
-- Supprime TOUT pour repartir de zéro (résout les erreurs "Policy already exists")

DROP TABLE IF EXISTS leads CASCADE;
DROP TABLE IF EXISTS vehicles CASCADE;
DROP TABLE IF EXISTS clients CASCADE;
DROP TABLE IF EXISTS settings CASCADE;

-- Supprime les types ENUM s'ils existent
DROP TYPE IF EXISTS vehicle_status CASCADE;
DROP TYPE IF EXISTS lead_status CASCADE;

-- ===================
-- 1. TYPES ENUM
-- ===================

CREATE TYPE vehicle_status AS ENUM ('SOURCING', 'STOCK', 'SOLD');
CREATE TYPE lead_status AS ENUM ('NEW', 'CONTACTED', 'NEGOTIATION', 'CONVERTED', 'LOST');

-- ===================
-- 2. TABLE VEHICLES
-- ===================

CREATE TABLE vehicles (
  -- Identifiant
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vin TEXT UNIQUE,

  -- Infos véhicule
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  trim TEXT,
  year INTEGER DEFAULT EXTRACT(YEAR FROM NOW()),
  mileage INTEGER DEFAULT 0,
  color TEXT,

  -- Workflow
  status vehicle_status DEFAULT 'SOURCING',

  -- Prix & Finances
  purchase_price FLOAT DEFAULT 0,          -- Prix d'achat (devise originale)
  purchase_currency TEXT DEFAULT 'EUR',    -- EUR, CHF, JPY, GBP
  exchange_rate FLOAT DEFAULT 1,           -- Taux de change vers EUR

  transport_cost FLOAT DEFAULT 0,          -- Frais de transport
  customs_fee FLOAT DEFAULT 0,             -- Frais de douane (10% si hors UE)
  vat_amount FLOAT DEFAULT 0,              -- TVA calculée
  fees_total FLOAT DEFAULT 0,              -- Total des frais

  cost_price FLOAT DEFAULT 0,              -- PRU (Prix de Revient Unitaire)
  selling_price FLOAT DEFAULT 0,           -- Prix de vente TTC
  margin FLOAT DEFAULT 0,                  -- Marge nette en EUR
  margin_percent FLOAT DEFAULT 0,          -- Marge en %

  -- Import
  import_country TEXT DEFAULT 'FR',        -- Pays d'origine (FR, DE, CH, JP, BE, IT)
  vat_rate FLOAT DEFAULT 20,               -- Taux de TVA applicable (20% France)
  is_eu_origin BOOLEAN DEFAULT true,       -- True = pas de douane

  -- Images (tableau JSON d'objets {id, url, path, isPrimary})
  images JSONB DEFAULT '[]',

  -- Métadonnées
  notes TEXT,
  source_url TEXT,
  seller_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===================
-- 3. TABLE CLIENTS
-- ===================

CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  address TEXT,
  city TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'France',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===================
-- 4. TABLE SETTINGS
-- ===================

CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===================
-- 5. TABLE LEADS (Prospects depuis le site vitrine)
-- ===================

CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Contact
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,

  -- Demande
  subject TEXT NOT NULL,             -- 'achat', 'reprise', 'recherche', 'autre'
  message TEXT,

  -- Contexte (véhicule consulté au moment du contact)
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  vehicle_label TEXT,                -- "BMW M3 2022" snapshot au moment du lead
  source TEXT DEFAULT 'contact_form', -- 'contact_form', 'showroom', 'whatsapp'

  -- Suivi CRM
  status lead_status DEFAULT 'NEW',
  notes TEXT,                        -- Notes internes du commercial

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===================
-- 6. INDEX PERFORMANCE
-- ===================

CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_vehicles_brand ON vehicles(brand);
CREATE INDEX idx_vehicles_created ON vehicles(created_at DESC);
CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created ON leads(created_at DESC);

-- ===================
-- 6. TRIGGER UPDATED_AT
-- ===================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER vehicles_updated_at
  BEFORE UPDATE ON vehicles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===================
-- 8. ROW LEVEL SECURITY
-- ===================

-- Active RLS sur toutes les tables
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- ── VEHICLES ──────────────────────────────────────────
-- Anon : lecture seule (pour le showroom public)
CREATE POLICY "vehicles_anon_select" ON vehicles
  FOR SELECT TO anon USING (true);

-- Authenticated : accès complet (CRM admin)
CREATE POLICY "vehicles_auth_all" ON vehicles
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ── CLIENTS ───────────────────────────────────────────
-- Anon : aucun accès (données personnelles = RGPD)
-- Authenticated : accès complet
CREATE POLICY "clients_auth_all" ON clients
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ── SETTINGS ──────────────────────────────────────────
-- Anon : aucun accès
-- Authenticated : accès complet
CREATE POLICY "settings_auth_all" ON settings
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ── LEADS ─────────────────────────────────────────────
-- Anon : peut insérer uniquement (formulaire de contact public)
CREATE POLICY "leads_anon_insert" ON leads
  FOR INSERT TO anon WITH CHECK (true);

-- Authenticated : accès complet (gestion CRM)
CREATE POLICY "leads_auth_all" ON leads
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ===================
-- 9. DONNÉES INITIALES
-- ===================

-- Paramètres par défaut
INSERT INTO settings (key, value, description) VALUES
  ('default_vat_rate', '20', 'Taux de TVA par défaut (%)'),
  ('default_margin', '15', 'Marge cible par défaut (%)'),
  ('customs_rate_non_eu', '10', 'Droits de douane hors UE (%)'),
  ('exchange_rates', '{"CHF": 0.93, "GBP": 1.17, "JPY": 0.0062, "USD": 0.92}', 'Taux de change vers EUR')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- ===================
-- 10. VUE KPI DASHBOARD
-- ===================

CREATE OR REPLACE VIEW view_dashboard_kpis AS
SELECT
  -- Stock
  COUNT(*) FILTER (WHERE status = 'SOURCING') AS sourcing_count,
  COUNT(*) FILTER (WHERE status = 'STOCK') AS stock_count,
  COUNT(*) FILTER (WHERE status = 'SOLD') AS sold_count,
  COUNT(*) AS total_count,

  -- Valeurs
  COALESCE(SUM(selling_price) FILTER (WHERE status = 'STOCK'), 0) AS stock_value,
  COALESCE(SUM(selling_price) FILTER (WHERE status = 'SOLD'), 0) AS total_revenue,
  COALESCE(SUM(margin) FILTER (WHERE status = 'SOLD'), 0) AS total_margin,

  -- Moyennes
  COALESCE(AVG(margin_percent) FILTER (WHERE status = 'SOLD'), 0) AS avg_margin_percent
FROM vehicles;

-- =====================================================
-- FIN DU SCRIPT - Exécution réussie = Base prête
-- =====================================================
