-- Phase 3b: Vehicle Costs table
-- This table was referenced by costs.js but never created in any migration

-- Create vehicle_costs table
CREATE TABLE IF NOT EXISTS vehicle_costs (
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

-- Indexes
CREATE INDEX IF NOT EXISTS idx_vehicle_costs_vehicle_id ON vehicle_costs(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_costs_type ON vehicle_costs(type);

-- RLS
ALTER TABLE vehicle_costs ENABLE ROW LEVEL SECURITY;

-- Authenticated users: full access
CREATE POLICY "authenticated_full_access_vehicle_costs"
  ON vehicle_costs
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Anon: no access
CREATE POLICY "anon_no_access_vehicle_costs"
  ON vehicle_costs
  FOR ALL
  TO anon
  USING (false)
  WITH CHECK (false);
