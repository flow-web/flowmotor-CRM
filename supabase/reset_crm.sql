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

  -- Spécifications techniques (Phase 4)
  fuel_type TEXT,
  transmission TEXT,
  power_ch INT,
  power_kw INT,
  displacement_cc INT,
  cylinders INT,
  drive_type TEXT,
  gears_count INT,
  weight_empty_kg INT,
  engine_code TEXT,

  -- Économie & Environnement
  co2_emissions INT,
  consumption_mixed NUMERIC(4,1),
  consumption_city NUMERIC(4,1),
  consumption_highway NUMERIC(4,1),
  euro_standard TEXT,
  critair INT,

  -- Dimensions & Carrosserie
  length_mm INT,
  width_mm INT,
  height_mm INT,
  trunk_volume_l INT,
  seats INT DEFAULT 5,
  doors INT DEFAULT 5,
  payload_kg INT,

  -- Historique & État
  owners_count INT,
  last_service_date DATE,
  is_import BOOLEAN DEFAULT false,
  country_origin TEXT,
  warranty_months INT,

  -- Couleurs & Intérieur
  interior_material TEXT,
  interior_color TEXT,
  exterior_color_detailed TEXT,

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

  -- Immatriculation (Phase 3)
  registration_plate TEXT,

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
CREATE INDEX idx_vehicles_vin ON vehicles(vin);
CREATE INDEX idx_vehicles_registration ON vehicles(registration_plate);
CREATE INDEX idx_vehicles_drive_type ON vehicles(drive_type);
CREATE INDEX idx_vehicles_fuel_type ON vehicles(fuel_type);
CREATE INDEX idx_vehicles_transmission ON vehicles(transmission);
CREATE INDEX idx_vehicles_euro_standard ON vehicles(euro_standard);
CREATE INDEX idx_vehicles_country_origin ON vehicles(country_origin);
CREATE INDEX idx_vehicles_owners_count ON vehicles(owners_count);
CREATE INDEX idx_vehicles_search_combo ON vehicles(brand, fuel_type, transmission) WHERE status = 'STOCK';

CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created ON leads(created_at DESC);

-- ===================
-- 7. DATA VALIDATION CONSTRAINTS
-- ===================

ALTER TABLE vehicles ADD CONSTRAINT check_displacement_positive
  CHECK (displacement_cc IS NULL OR displacement_cc > 0);

ALTER TABLE vehicles ADD CONSTRAINT check_cylinders_range
  CHECK (cylinders IS NULL OR (cylinders >= 2 AND cylinders <= 16));

ALTER TABLE vehicles ADD CONSTRAINT check_gears_range
  CHECK (gears_count IS NULL OR (gears_count >= 1 AND gears_count <= 10));

ALTER TABLE vehicles ADD CONSTRAINT check_weight_positive
  CHECK (weight_empty_kg IS NULL OR weight_empty_kg > 0);

ALTER TABLE vehicles ADD CONSTRAINT check_co2_positive
  CHECK (co2_emissions IS NULL OR co2_emissions >= 0);

ALTER TABLE vehicles ADD CONSTRAINT check_consumption_positive
  CHECK (
    (consumption_mixed IS NULL OR consumption_mixed > 0) AND
    (consumption_city IS NULL OR consumption_city > 0) AND
    (consumption_highway IS NULL OR consumption_highway > 0)
  );

ALTER TABLE vehicles ADD CONSTRAINT check_critair_range
  CHECK (critair IS NULL OR (critair >= 1 AND critair <= 5));

ALTER TABLE vehicles ADD CONSTRAINT check_dimensions_positive
  CHECK (
    (length_mm IS NULL OR length_mm > 0) AND
    (width_mm IS NULL OR width_mm > 0) AND
    (height_mm IS NULL OR height_mm > 0)
  );

ALTER TABLE vehicles ADD CONSTRAINT check_seats_range
  CHECK (seats >= 1 AND seats <= 9);

ALTER TABLE vehicles ADD CONSTRAINT check_doors_range
  CHECK (doors >= 2 AND doors <= 5);

ALTER TABLE vehicles ADD CONSTRAINT check_payload_positive
  CHECK (payload_kg IS NULL OR payload_kg > 0);

ALTER TABLE vehicles ADD CONSTRAINT check_owners_positive
  CHECK (owners_count IS NULL OR owners_count >= 0);

ALTER TABLE vehicles ADD CONSTRAINT check_warranty_positive
  CHECK (warranty_months IS NULL OR warranty_months >= 0);

-- ===================
-- 8. TRIGGER UPDATED_AT
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
-- 9. ROW LEVEL SECURITY
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
-- 10. DONNÉES INITIALES
-- ===================

-- Paramètres par défaut
INSERT INTO settings (key, value, description) VALUES
  ('default_vat_rate', '20', 'Taux de TVA par défaut (%)'),
  ('default_margin', '15', 'Marge cible par défaut (%)'),
  ('customs_rate_non_eu', '10', 'Droits de douane hors UE (%)'),
  ('exchange_rates', '{"CHF": 0.93, "GBP": 1.17, "JPY": 0.0062, "USD": 0.92}', 'Taux de change vers EUR'),
  ('vehicle_drive_types', '["FWD", "RWD", "AWD", "4WD"]', 'Standard drive type values'),
  ('vehicle_fuel_types', '["Essence", "Diesel", "Hybride", "Électrique", "Hybride rechargeable", "GPL", "GNV"]', 'Standard fuel type values (French)'),
  ('vehicle_transmissions', '["Manuelle", "Automatique", "Séquentielle", "Robotisée"]', 'Standard transmission values (French)'),
  ('vehicle_euro_standards', '["Euro 3", "Euro 4", "Euro 5", "Euro 6b", "Euro 6c", "Euro 6d-TEMP", "Euro 6d"]', 'EU emission standards'),
  ('vehicle_interior_materials', '["Tissu", "Cuir", "Alcantara", "Cuir/Alcantara", "Velours", "Similicuir"]', 'Common interior materials (French)')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- ===================
-- 11. VUE KPI DASHBOARD
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

-- ===================
-- 12. TABLE VEHICLE_INSPECTIONS (Phase 4b)
-- ===================

-- Enum types for inspections
CREATE TYPE inspection_type AS ENUM (
  'ct_analysis',
  'engine_audio',
  'body_scan',
  'doc_translation',
  'spec_check',
  'full_inspection'
);

CREATE TYPE inspection_status AS ENUM (
  'pending',
  'processing',
  'completed',
  'failed'
);

CREATE TYPE risk_level AS ENUM (
  'low',
  'medium',
  'high',
  'critical'
);

CREATE TABLE vehicle_inspections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  inspection_type inspection_type NOT NULL,
  status inspection_status DEFAULT 'completed',
  result JSONB NOT NULL DEFAULT '{}',
  health_score INT CHECK (health_score IS NULL OR (health_score >= 0 AND health_score <= 100)),
  total_repair_cost NUMERIC(10,2) DEFAULT 0,
  risk_level risk_level DEFAULT 'low',
  inspector_notes TEXT,
  images TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  inspector TEXT DEFAULT 'AI_GEMINI',
  inspection_duration_seconds INT,
  api_model TEXT
);

-- Indexes for inspections
CREATE INDEX idx_inspections_vehicle ON vehicle_inspections(vehicle_id);
CREATE INDEX idx_inspections_type ON vehicle_inspections(inspection_type);
CREATE INDEX idx_inspections_status ON vehicle_inspections(status);
CREATE INDEX idx_inspections_risk ON vehicle_inspections(risk_level);
CREATE INDEX idx_inspections_created ON vehicle_inspections(created_at DESC);
CREATE INDEX idx_inspections_vehicle_type ON vehicle_inspections(vehicle_id, inspection_type);

-- Trigger for updated_at
CREATE TRIGGER inspections_updated_at
  BEFORE UPDATE ON vehicle_inspections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS for inspections
ALTER TABLE vehicle_inspections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "inspections_auth_all" ON vehicle_inspections
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Helper view: Latest inspection per vehicle
CREATE OR REPLACE VIEW view_latest_inspections AS
SELECT DISTINCT ON (vehicle_id, inspection_type)
  id,
  vehicle_id,
  inspection_type,
  status,
  health_score,
  total_repair_cost,
  risk_level,
  inspector_notes,
  created_at,
  inspector
FROM vehicle_inspections
ORDER BY vehicle_id, inspection_type, created_at DESC;

-- Helper function: Get vehicle health score
CREATE OR REPLACE FUNCTION get_vehicle_health_score(p_vehicle_id UUID)
RETURNS INT AS $$
DECLARE
  avg_score INT;
BEGIN
  SELECT ROUND(AVG(health_score))::INT
  INTO avg_score
  FROM vehicle_inspections
  WHERE vehicle_id = p_vehicle_id
    AND status = 'completed'
    AND health_score IS NOT NULL;
  RETURN COALESCE(avg_score, 0);
END;
$$ LANGUAGE plpgsql;

-- Helper function: Get total repair cost
CREATE OR REPLACE FUNCTION get_vehicle_total_repair_cost(p_vehicle_id UUID)
RETURNS NUMERIC(10,2) AS $$
DECLARE
  total_cost NUMERIC(10,2);
BEGIN
  SELECT SUM(total_repair_cost)
  INTO total_cost
  FROM vehicle_inspections
  WHERE vehicle_id = p_vehicle_id
    AND status = 'completed'
    AND total_repair_cost IS NOT NULL;
  RETURN COALESCE(total_cost, 0);
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FIN DU SCRIPT - Exécution réussie = Base prête
-- =====================================================
