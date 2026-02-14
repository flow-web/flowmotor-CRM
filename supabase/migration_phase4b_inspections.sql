-- =====================================================
-- MIGRATION: Phase 4b - Vehicle Inspections
-- Date: 2026-02-14
-- Description: Add vehicle_inspections table for AI-powered quality checks
-- Dependencies: reset_crm.sql (vehicles table must exist)
-- =====================================================

BEGIN;

-- ===================
-- 1. CREATE INSPECTION TYPES ENUM
-- ===================

DO $$ BEGIN
  CREATE TYPE inspection_type AS ENUM (
    'ct_analysis',        -- French CT (Contrôle Technique) report analysis
    'engine_audio',       -- Engine sound analysis
    'body_scan',          -- Body/paint condition scan
    'doc_translation',    -- Document translation/verification
    'spec_check',         -- VIN vs Photo feature comparison
    'full_inspection'     -- Complete multi-point inspection
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE inspection_status AS ENUM (
    'pending',
    'processing',
    'completed',
    'failed'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE risk_level AS ENUM (
    'low',
    'medium',
    'high',
    'critical'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ===================
-- 2. CREATE INSPECTIONS TABLE
-- ===================

CREATE TABLE IF NOT EXISTS vehicle_inspections (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Foreign key to vehicle
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,

  -- Inspection metadata
  inspection_type inspection_type NOT NULL,
  status inspection_status DEFAULT 'completed',

  -- Results (flexible JSONB for different inspection types)
  result JSONB NOT NULL DEFAULT '{}',

  -- Summary metrics
  health_score INT CHECK (health_score IS NULL OR (health_score >= 0 AND health_score <= 100)),
  total_repair_cost NUMERIC(10,2) DEFAULT 0,
  risk_level risk_level DEFAULT 'low',

  -- Inspector notes (human or AI)
  inspector_notes TEXT,

  -- Associated images (file paths or URLs)
  images TEXT[] DEFAULT '{}',

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  -- Metadata
  inspector TEXT DEFAULT 'AI_GEMINI', -- 'AI_GEMINI', 'HUMAN', 'MECHANIC_GPT', etc.
  inspection_duration_seconds INT, -- Time taken for inspection
  api_model TEXT -- AI model used (e.g., 'gemini-2.0-flash')
);

-- ===================
-- 3. INDEXES
-- ===================

CREATE INDEX IF NOT EXISTS idx_inspections_vehicle ON vehicle_inspections(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_inspections_type ON vehicle_inspections(inspection_type);
CREATE INDEX IF NOT EXISTS idx_inspections_status ON vehicle_inspections(status);
CREATE INDEX IF NOT EXISTS idx_inspections_risk ON vehicle_inspections(risk_level);
CREATE INDEX IF NOT EXISTS idx_inspections_created ON vehicle_inspections(created_at DESC);

-- Composite index for common queries (vehicle + type)
CREATE INDEX IF NOT EXISTS idx_inspections_vehicle_type ON vehicle_inspections(vehicle_id, inspection_type);

-- ===================
-- 4. UPDATED_AT TRIGGER
-- ===================

CREATE TRIGGER inspections_updated_at
  BEFORE UPDATE ON vehicle_inspections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===================
-- 5. ROW LEVEL SECURITY
-- ===================

ALTER TABLE vehicle_inspections ENABLE ROW LEVEL SECURITY;

-- Anon: No access (sensitive inspection data)
-- Authenticated: Full access (CRM admin)
CREATE POLICY "inspections_auth_all" ON vehicle_inspections
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ===================
-- 6. HELPER VIEW: Latest Inspection per Vehicle
-- ===================

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

-- ===================
-- 7. HELPER FUNCTION: Get Vehicle Health Score
-- ===================

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

-- ===================
-- 8. HELPER FUNCTION: Get Total Estimated Repair Cost
-- ===================

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

-- ===================
-- 9. COMMENTS (Documentation)
-- ===================

COMMENT ON TABLE vehicle_inspections IS 'AI-powered vehicle quality inspections (CT analysis, VIN check, engine audio, etc.)';
COMMENT ON COLUMN vehicle_inspections.result IS 'Flexible JSONB field storing inspection-specific results (defects, features, audio analysis, etc.)';
COMMENT ON COLUMN vehicle_inspections.health_score IS 'Overall health score 0-100 (100 = perfect condition)';
COMMENT ON COLUMN vehicle_inspections.total_repair_cost IS 'Estimated total repair cost in EUR for all detected issues';
COMMENT ON COLUMN vehicle_inspections.risk_level IS 'Risk assessment: low (safe), medium (caution), high (avoid), critical (reject)';
COMMENT ON COLUMN vehicle_inspections.inspector IS 'Who performed the inspection: AI_GEMINI, HUMAN, MECHANIC_GPT, etc.';

COMMIT;

-- =====================================================
-- END OF MIGRATION
-- =====================================================
