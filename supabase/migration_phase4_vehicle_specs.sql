-- =====================================================
-- Migration: phase4_vehicle_specs
-- Date: 2026-02-14
-- Description: Expand vehicles table with detailed technical specifications
--              to match Mobile.de / AutoScout24 premium marketplace standards
-- Dependencies: supabase/reset_crm.sql
-- =====================================================

BEGIN;

-- ═══════════════════════════════════════════════════════
-- 1. ENGINE & PERFORMANCE SPECIFICATIONS
-- ═══════════════════════════════════════════════════════
-- Technical specs for engine and drivetrain

ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS displacement_cc INT;
COMMENT ON COLUMN vehicles.displacement_cc IS 'Engine displacement in cubic centimeters (e.g., 1984)';

ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS cylinders INT;
COMMENT ON COLUMN vehicles.cylinders IS 'Number of cylinders (e.g., 4, 6, 8)';

ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS drive_type TEXT;
COMMENT ON COLUMN vehicles.drive_type IS 'Drivetrain type: FWD (front-wheel), RWD (rear-wheel), AWD (all-wheel), 4WD';

ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS gears_count INT;
COMMENT ON COLUMN vehicles.gears_count IS 'Number of gears in transmission (e.g., 6, 8)';

ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS weight_empty_kg INT;
COMMENT ON COLUMN vehicles.weight_empty_kg IS 'Empty weight in kilograms';

ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS engine_code TEXT;
COMMENT ON COLUMN vehicles.engine_code IS 'Manufacturer engine code (e.g., N55B30, EA888)';

-- ═══════════════════════════════════════════════════════
-- 2. ECONOMY & ENVIRONMENT
-- ═══════════════════════════════════════════════════════
-- Consumption, emissions, and environmental certifications

ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS co2_emissions INT;
COMMENT ON COLUMN vehicles.co2_emissions IS 'CO2 emissions in g/km (WLTP standard)';

ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS consumption_mixed NUMERIC(4,1);
COMMENT ON COLUMN vehicles.consumption_mixed IS 'Fuel consumption mixed cycle in L/100km (e.g., 6.6)';

ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS consumption_city NUMERIC(4,1);
COMMENT ON COLUMN vehicles.consumption_city IS 'Fuel consumption city cycle in L/100km';

ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS consumption_highway NUMERIC(4,1);
COMMENT ON COLUMN vehicles.consumption_highway IS 'Fuel consumption highway cycle in L/100km';

ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS euro_standard TEXT;
COMMENT ON COLUMN vehicles.euro_standard IS 'Emission standard: Euro 5, Euro 6d-TEMP, Euro 6d, etc.';

ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS critair INT;
COMMENT ON COLUMN vehicles.critair IS 'French Crit''Air sticker level (1-5, lower is cleaner)';

-- ═══════════════════════════════════════════════════════
-- 3. DIMENSIONS & BODY SPECIFICATIONS
-- ═══════════════════════════════════════════════════════
-- Physical dimensions and capacity

ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS length_mm INT;
COMMENT ON COLUMN vehicles.length_mm IS 'Total length in millimeters';

ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS width_mm INT;
COMMENT ON COLUMN vehicles.width_mm IS 'Total width in millimeters (excluding mirrors)';

ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS height_mm INT;
COMMENT ON COLUMN vehicles.height_mm IS 'Total height in millimeters';

ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS trunk_volume_l INT;
COMMENT ON COLUMN vehicles.trunk_volume_l IS 'Trunk/boot volume in liters (VDA standard)';

ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS seats INT DEFAULT 5;
COMMENT ON COLUMN vehicles.seats IS 'Number of seats (default: 5)';

ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS doors INT DEFAULT 5;
COMMENT ON COLUMN vehicles.doors IS 'Number of doors including tailgate (default: 5)';

ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS payload_kg INT;
COMMENT ON COLUMN vehicles.payload_kg IS 'Maximum payload capacity in kilograms';

-- ═══════════════════════════════════════════════════════
-- 4. HISTORY & STATE
-- ═══════════════════════════════════════════════════════
-- Vehicle history, service, and ownership

ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS owners_count INT;
COMMENT ON COLUMN vehicles.owners_count IS 'Number of previous owners';

ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS last_service_date DATE;
COMMENT ON COLUMN vehicles.last_service_date IS 'Date of last service/maintenance';

ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS is_import BOOLEAN DEFAULT false;
COMMENT ON COLUMN vehicles.is_import IS 'True if vehicle was imported (vs. domestic market)';

ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS country_origin TEXT;
COMMENT ON COLUMN vehicles.country_origin IS 'Country of original registration: DE, CH, JP, FR, IT, etc.';

ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS warranty_months INT;
COMMENT ON COLUMN vehicles.warranty_months IS 'Remaining manufacturer or dealer warranty in months';

-- ═══════════════════════════════════════════════════════
-- 5. COLORS & INTERIOR
-- ═══════════════════════════════════════════════════════
-- Detailed color and interior specifications

ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS interior_material TEXT;
COMMENT ON COLUMN vehicles.interior_material IS 'Interior upholstery material: Cuir, Alcantara, Tissu, Cuir/Alcantara, etc.';

ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS interior_color TEXT;
COMMENT ON COLUMN vehicles.interior_color IS 'Interior color/trim (e.g., Noir, Beige, Rouge)';

ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS exterior_color_detailed TEXT;
COMMENT ON COLUMN vehicles.exterior_color_detailed IS 'Detailed exterior color name (manufacturer-specific)';

-- ═══════════════════════════════════════════════════════
-- 6. ADDITIONAL TECHNICAL FIELDS
-- ═══════════════════════════════════════════════════════
-- Add missing fields from base schema that should be in specs

-- Note: fuel_type, transmission, power_ch, power_kw should already exist
-- If not, uncomment these:
-- ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS fuel_type TEXT;
-- ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS transmission TEXT;
-- ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS power_ch INT;
-- ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS power_kw INT;

-- ═══════════════════════════════════════════════════════
-- 7. PERFORMANCE INDEXES
-- ═══════════════════════════════════════════════════════
-- Add indexes for frequently filtered columns

CREATE INDEX IF NOT EXISTS idx_vehicles_drive_type ON vehicles(drive_type);
CREATE INDEX IF NOT EXISTS idx_vehicles_fuel_type ON vehicles(fuel_type);
CREATE INDEX IF NOT EXISTS idx_vehicles_transmission ON vehicles(transmission);
CREATE INDEX IF NOT EXISTS idx_vehicles_euro_standard ON vehicles(euro_standard);
CREATE INDEX IF NOT EXISTS idx_vehicles_country_origin ON vehicles(country_origin);
CREATE INDEX IF NOT EXISTS idx_vehicles_owners_count ON vehicles(owners_count);

-- Composite index for common search patterns (brand + fuel + transmission)
CREATE INDEX IF NOT EXISTS idx_vehicles_search_combo ON vehicles(brand, fuel_type, transmission) WHERE status = 'STOCK';

-- ═══════════════════════════════════════════════════════
-- 8. DATA VALIDATION CONSTRAINTS
-- ═══════════════════════════════════════════════════════
-- Ensure data quality with CHECK constraints

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

-- ═══════════════════════════════════════════════════════
-- 9. REFERENCE DATA FOR COMMON VALUES
-- ═══════════════════════════════════════════════════════
-- Store reference data in settings table

INSERT INTO settings (key, value, description) VALUES
  (
    'vehicle_drive_types',
    '["FWD", "RWD", "AWD", "4WD"]',
    'Standard drive type values'
  ),
  (
    'vehicle_fuel_types',
    '["Essence", "Diesel", "Hybride", "Électrique", "Hybride rechargeable", "GPL", "GNV"]',
    'Standard fuel type values (French)'
  ),
  (
    'vehicle_transmissions',
    '["Manuelle", "Automatique", "Séquentielle", "Robotisée"]',
    'Standard transmission values (French)'
  ),
  (
    'vehicle_euro_standards',
    '["Euro 3", "Euro 4", "Euro 5", "Euro 6b", "Euro 6c", "Euro 6d-TEMP", "Euro 6d"]',
    'EU emission standards'
  ),
  (
    'vehicle_interior_materials',
    '["Tissu", "Cuir", "Alcantara", "Cuir/Alcantara", "Velours", "Similicuir"]',
    'Common interior materials (French)'
  )
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  description = EXCLUDED.description;

COMMIT;

-- =====================================================
-- END MIGRATION - Vehicles table now premium-ready
-- =====================================================
