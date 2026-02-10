-- =============================================================
-- SCRIPT NUCLÉAIRE : Nettoyage vehicle_costs
-- À exécuter dans Supabase SQL Editor (Dashboard > SQL Editor)
-- =============================================================

-- 1. Supprimer l'ancienne table expenses si elle traîne
DROP TABLE IF EXISTS expenses CASCADE;

-- 2. Supprimer vehicle_costs et toutes ses policies/indexes
DROP TABLE IF EXISTS vehicle_costs CASCADE;

-- 3. Recréer proprement vehicle_costs
CREATE TABLE vehicle_costs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  description TEXT,
  supplier TEXT,
  receipt_url TEXT,
  date TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Index pour performance
CREATE INDEX idx_vehicle_costs_vehicle_id ON vehicle_costs(vehicle_id);
CREATE INDEX idx_vehicle_costs_type ON vehicle_costs(type);

-- 5. Activer RLS
ALTER TABLE vehicle_costs ENABLE ROW LEVEL SECURITY;

-- 6. Policy ADMIN TOTAL ACCESS (une seule, claire, infaillible)
CREATE POLICY "admin_full_access"
  ON vehicle_costs
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 7. Vérification : doit retourner la table avec ses colonnes
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'vehicle_costs'
ORDER BY ordinal_position;
