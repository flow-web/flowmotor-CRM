-- =====================================================
-- FLOW MOTOR CRM - Schema Supabase
-- =====================================================
-- Exécuter ce script dans Supabase SQL Editor
-- =====================================================

-- ===================
-- 1. TABLES PRINCIPALES
-- ===================

-- Profils utilisateurs (extension de auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user', 'viewer')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Véhicules (table principale normalisée)
CREATE TABLE IF NOT EXISTS vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vin TEXT,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  trim TEXT,
  year INTEGER NOT NULL,
  mileage INTEGER DEFAULT 0,
  color TEXT,

  -- Sourcing
  source_url TEXT,
  seller_name TEXT,
  seller_phone TEXT,
  seller_email TEXT,

  -- Prix
  purchase_price NUMERIC(12,2) DEFAULT 0,
  currency TEXT DEFAULT 'EUR',
  exchange_rate NUMERIC(10,6) DEFAULT 1,
  origin_country TEXT,
  market_price NUMERIC(12,2) DEFAULT 0,
  target_margin NUMERIC(5,2) DEFAULT 15,
  selling_price NUMERIC(12,2) DEFAULT 0,

  -- Workflow
  status TEXT DEFAULT 'SOURCING'
    CHECK (status IN ('SOURCING','ACHETÉ','TRANSPORT','ATELIER','EN_VENTE','VENDU')),

  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Coûts (normalisé depuis costs[])
CREATE TABLE IF NOT EXISTS vehicle_costs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  description TEXT,
  date TIMESTAMPTZ DEFAULT NOW()
);

-- Documents (normalisé depuis documents[])
CREATE TABLE IF NOT EXISTS vehicle_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  url TEXT,
  storage_path TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Images (normalisé depuis images[])
CREATE TABLE IF NOT EXISTS vehicle_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0
);

-- Timeline workflow
CREATE TABLE IF NOT EXISTS vehicle_timeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
  step TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','in_progress','completed')),
  date TIMESTAMPTZ,
  notes TEXT,
  UNIQUE(vehicle_id, step)
);

-- Clés API pour Holding Dashboard
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  key_hash TEXT NOT NULL UNIQUE,
  key_prefix TEXT NOT NULL,
  permissions TEXT[] DEFAULT ARRAY['read:kpis'],
  is_active BOOLEAN DEFAULT TRUE,
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Settings utilisateur
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE,
  default_margin NUMERIC(5,2) DEFAULT 15,
  vat_rate NUMERIC(5,2) DEFAULT 20,
  vat_on_margin BOOLEAN DEFAULT TRUE,
  exchange_rate_chf NUMERIC(10,6) DEFAULT 0.95,
  exchange_rate_gbp NUMERIC(10,6) DEFAULT 1.17,
  exchange_rate_jpy NUMERIC(10,6) DEFAULT 0.0062,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===================
-- 2. INDEX
-- ===================

CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles(status);
CREATE INDEX IF NOT EXISTS idx_vehicles_created_at ON vehicles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_vehicle_costs_vehicle_id ON vehicle_costs(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_documents_vehicle_id ON vehicle_documents(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_images_vehicle_id ON vehicle_images(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_timeline_vehicle_id ON vehicle_timeline(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_key_hash ON api_keys(key_hash);

-- ===================
-- 3. TRIGGERS
-- ===================

-- Trigger pour updated_at automatique
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER vehicles_updated_at
  BEFORE UPDATE ON vehicles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Trigger pour notification véhicule vendu
CREATE OR REPLACE FUNCTION notify_vehicle_sold()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'VENDU' AND OLD.status != 'VENDU' THEN
    PERFORM pg_notify('vehicle_sold', json_build_object(
      'vehicle_id', NEW.id,
      'make', NEW.make,
      'model', NEW.model,
      'year', NEW.year,
      'selling_price', NEW.selling_price,
      'sold_at', NOW()
    )::text);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER on_vehicle_sold
  AFTER UPDATE OF status ON vehicles
  FOR EACH ROW EXECUTE FUNCTION notify_vehicle_sold();

-- Trigger pour créer un profil automatiquement
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Vérifie si le trigger existe avant de le créer
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION handle_new_user();
  END IF;
END
$$;

-- ===================
-- 4. VUES REPORTING (API Holding)
-- ===================

-- Vue KPI Financiers
CREATE OR REPLACE VIEW view_kpi_financials AS
SELECT
  COALESCE(SUM(CASE WHEN status = 'VENDU' THEN selling_price END), 0) AS ca_total,
  COALESCE(SUM(CASE WHEN status = 'VENDU'
    AND DATE_TRUNC('month', updated_at) = DATE_TRUNC('month', NOW())
    THEN selling_price END), 0) AS ca_mois_courant,
  COALESCE(SUM(CASE WHEN status != 'VENDU' THEN selling_price END), 0) AS valeur_stock,
  COUNT(CASE WHEN status = 'VENDU' THEN 1 END) AS vehicules_vendus,
  COUNT(CASE WHEN status != 'VENDU' THEN 1 END) AS vehicules_en_stock,
  COUNT(*) AS total_vehicules
FROM vehicles;

-- Vue KPI Activité par statut
CREATE OR REPLACE VIEW view_kpi_activity AS
SELECT
  status,
  COUNT(*) AS count,
  COALESCE(SUM(selling_price), 0) AS total_value,
  COALESCE(AVG(selling_price), 0) AS avg_value
FROM vehicles
GROUP BY status;

-- Vue dernières ventes
CREATE OR REPLACE VIEW view_recent_sales AS
SELECT
  v.id,
  v.make,
  v.model,
  v.year,
  v.selling_price,
  v.purchase_price,
  (v.selling_price - v.purchase_price - COALESCE(costs.total_costs, 0)) AS profit,
  v.updated_at AS sold_at
FROM vehicles v
LEFT JOIN (
  SELECT vehicle_id, SUM(amount) AS total_costs
  FROM vehicle_costs
  GROUP BY vehicle_id
) costs ON v.id = costs.vehicle_id
WHERE v.status = 'VENDU'
ORDER BY v.updated_at DESC
LIMIT 10;

-- ===================
-- 5. SÉCURITÉ RLS
-- ===================

-- Active RLS sur toutes les tables
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies pour utilisateurs authentifiés (accès complet)
CREATE POLICY "auth_all_vehicles" ON vehicles
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "auth_all_costs" ON vehicle_costs
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "auth_all_documents" ON vehicle_documents
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "auth_all_images" ON vehicle_images
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "auth_all_timeline" ON vehicle_timeline
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "auth_all_api_keys" ON api_keys
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "auth_own_settings" ON settings
  FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "auth_own_profile" ON profiles
  FOR ALL TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- Policies pour accès API externe (lecture seule avec clé valide)
-- Note: L'accès API se fait via une Edge Function ou RPC avec vérification de la clé

-- ===================
-- 6. FONCTIONS RPC
-- ===================

-- Fonction pour valider une clé API
CREATE OR REPLACE FUNCTION validate_api_key(api_key_hash TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  key_valid BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM api_keys
    WHERE key_hash = api_key_hash
    AND is_active = TRUE
    AND (expires_at IS NULL OR expires_at > NOW())
  ) INTO key_valid;

  -- Met à jour last_used_at si valide
  IF key_valid THEN
    UPDATE api_keys SET last_used_at = NOW() WHERE key_hash = api_key_hash;
  END IF;

  RETURN key_valid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour obtenir les KPIs (accessible via clé API)
CREATE OR REPLACE FUNCTION get_kpis(api_key_hash TEXT)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  -- Valide la clé API
  IF NOT validate_api_key(api_key_hash) THEN
    RAISE EXCEPTION 'Invalid or expired API key';
  END IF;

  SELECT json_build_object(
    'financials', (SELECT row_to_json(f) FROM view_kpi_financials f),
    'activity', (SELECT json_agg(a) FROM view_kpi_activity a),
    'recent_sales', (SELECT json_agg(s) FROM view_recent_sales s),
    'generated_at', NOW()
  ) INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===================
-- 7. DONNÉES INITIALES (optionnel)
-- ===================

-- Insère des paramètres par défaut si la table est vide
INSERT INTO settings (user_id, default_margin, vat_rate, vat_on_margin)
SELECT NULL, 15, 20, true
WHERE NOT EXISTS (SELECT 1 FROM settings WHERE user_id IS NULL);

-- =====================================================
-- FIN DU SCRIPT
-- =====================================================
