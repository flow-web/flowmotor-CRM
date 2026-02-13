-- =====================================================
-- FLOW MOTOR CRM - SEED DEMO VEHICLES
-- =====================================================
-- 6 vehicles de luxe/premium pour le showroom public
-- Images réelles depuis Unsplash (haute qualité, fiables)
-- Statut: STOCK (visibles dans le showroom)
-- =====================================================

-- Nettoyage (optionnel - supprimer les démo existants)
-- DELETE FROM vehicles WHERE notes LIKE '%DEMO VEHICLE%';

-- =====================================================
-- 1. PORSCHE 911 (992) - Noir, 2023
-- =====================================================
INSERT INTO vehicles (
  id,
  vin,
  brand,
  model,
  trim,
  year,
  mileage,
  color,
  status,
  purchase_price,
  purchase_currency,
  exchange_rate,
  transport_cost,
  customs_fee,
  vat_amount,
  fees_total,
  cost_price,
  selling_price,
  margin,
  margin_percent,
  import_country,
  vat_rate,
  is_eu_origin,
  images,
  notes,
  seller_name,
  created_at
) VALUES (
  gen_random_uuid(),
  'WP0ZZZ99ZTS123456',
  'Porsche',
  '911 Carrera S',
  '992 Phase II',
  2023,
  12500,
  'Noir Intense',
  'STOCK',
  125000.00,
  'EUR',
  1.00,
  850.00,
  0.00,
  25000.00,
  850.00,
  125850.00,
  142000.00,
  16150.00,
  12.83,
  'Allemagne',
  20.0,
  true,
  '[
    {
      "id": "img_1",
      "url": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80",
      "isPrimary": true,
      "name": "front.jpg"
    },
    {
      "id": "img_2",
      "url": "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800&q=80",
      "isPrimary": false,
      "name": "side.jpg"
    }
  ]'::jsonb,
  'DEMO VEHICLE - Porsche 911 992 Phase II, pack Sport Chrono, toit ouvrant panoramique, BOSE Surround Sound',
  'Porsche Zentrum Stuttgart',
  NOW() - INTERVAL '3 days'
);

-- =====================================================
-- 2. AUDI RS6 AVANT - Gris Nardo, 2022
-- =====================================================
INSERT INTO vehicles (
  id,
  vin,
  brand,
  model,
  trim,
  year,
  mileage,
  color,
  status,
  purchase_price,
  purchase_currency,
  exchange_rate,
  transport_cost,
  customs_fee,
  vat_amount,
  fees_total,
  cost_price,
  selling_price,
  margin,
  margin_percent,
  import_country,
  vat_rate,
  is_eu_origin,
  images,
  notes,
  seller_name,
  created_at
) VALUES (
  gen_random_uuid(),
  'WAUZZZ4G5EN123789',
  'Audi',
  'RS6 Avant',
  'Performance 600ch',
  2022,
  28000,
  'Gris Nardo',
  'STOCK',
  95000.00,
  'EUR',
  1.00,
  750.00,
  0.00,
  19000.00,
  750.00,
  95750.00,
  108000.00,
  12250.00,
  12.79,
  'Allemagne',
  20.0,
  true,
  '[
    {
      "id": "img_1",
      "url": "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80",
      "isPrimary": true,
      "name": "front.jpg"
    },
    {
      "id": "img_2",
      "url": "https://images.unsplash.com/photo-1614719924018-dee3c8bc9df0?w=800&q=80",
      "isPrimary": false,
      "name": "side.jpg"
    }
  ]'::jsonb,
  'DEMO VEHICLE - RS6 Avant Performance 600ch, pack Carbon, sièges sport plus, échappement sport',
  'Audi Ingolstadt',
  NOW() - INTERVAL '5 days'
);

-- =====================================================
-- 3. MERCEDES-AMG G63 - Noir Obsidienne, 2023
-- =====================================================
INSERT INTO vehicles (
  id,
  vin,
  brand,
  model,
  trim,
  year,
  mileage,
  color,
  status,
  purchase_price,
  purchase_currency,
  exchange_rate,
  transport_cost,
  customs_fee,
  vat_amount,
  fees_total,
  cost_price,
  selling_price,
  margin,
  margin_percent,
  import_country,
  vat_rate,
  is_eu_origin,
  images,
  notes,
  seller_name,
  created_at
) VALUES (
  gen_random_uuid(),
  'WDC4637991X123456',
  'Mercedes-Benz',
  'AMG G63',
  'Edition 1',
  2023,
  8500,
  'Noir Obsidienne Métallisé',
  'STOCK',
  165000.00,
  'EUR',
  1.00,
  950.00,
  0.00,
  33000.00,
  950.00,
  165950.00,
  189000.00,
  23050.00,
  13.89,
  'Allemagne',
  20.0,
  true,
  '[
    {
      "id": "img_1",
      "url": "https://images.unsplash.com/photo-1617531653520-bd466bbf8111?w=800&q=80",
      "isPrimary": true,
      "name": "front.jpg"
    },
    {
      "id": "img_2",
      "url": "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80",
      "isPrimary": false,
      "name": "side.jpg"
    }
  ]'::jsonb,
  'DEMO VEHICLE - G63 Edition 1, pack AMG Night, toit panoramique, Burmester 3D, intérieur cuir Nappa',
  'Mercedes-Benz Stuttgart',
  NOW() - INTERVAL '7 days'
);

-- =====================================================
-- 4. LAND ROVER RANGE ROVER SPORT - Vert British Racing Green, 2022
-- =====================================================
INSERT INTO vehicles (
  id,
  vin,
  brand,
  model,
  trim,
  year,
  mileage,
  color,
  status,
  purchase_price,
  purchase_currency,
  exchange_rate,
  transport_cost,
  customs_fee,
  vat_amount,
  fees_total,
  cost_price,
  selling_price,
  margin,
  margin_percent,
  import_country,
  vat_rate,
  is_eu_origin,
  images,
  notes,
  seller_name,
  created_at
) VALUES (
  gen_random_uuid(),
  'SALWA2FV9MA123456',
  'Land Rover',
  'Range Rover Sport',
  'HSE Dynamic P400',
  2022,
  32000,
  'British Racing Green',
  'STOCK',
  82000.00,
  'GBP',
  1.17,
  1200.00,
  0.00,
  19200.00,
  1200.00,
  97140.00,
  110000.00,
  12860.00,
  13.24,
  'Royaume-Uni',
  20.0,
  false,
  '[
    {
      "id": "img_1",
      "url": "https://images.unsplash.com/photo-1606220838315-056192d5e927?w=800&q=80",
      "isPrimary": true,
      "name": "front.jpg"
    },
    {
      "id": "img_2",
      "url": "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=800&q=80",
      "isPrimary": false,
      "name": "side.jpg"
    }
  ]'::jsonb,
  'DEMO VEHICLE - Range Rover Sport HSE Dynamic P400, toit panoramique, Meridian Surround, sièges ventilés',
  'Land Rover West London',
  NOW() - INTERVAL '10 days'
);

-- =====================================================
-- 5. FIAT 500 ABARTH - Rouge Passione, 2021
-- =====================================================
INSERT INTO vehicles (
  id,
  vin,
  brand,
  model,
  trim,
  year,
  mileage,
  color,
  status,
  purchase_price,
  purchase_currency,
  exchange_rate,
  transport_cost,
  customs_fee,
  vat_amount,
  fees_total,
  cost_price,
  selling_price,
  margin,
  margin_percent,
  import_country,
  vat_rate,
  is_eu_origin,
  images,
  notes,
  seller_name,
  created_at
) VALUES (
  gen_random_uuid(),
  'ZFA312000012345678',
  'Fiat',
  '500 Abarth',
  '595 Competizione',
  2021,
  18500,
  'Rouge Passione',
  'STOCK',
  22000.00,
  'EUR',
  1.00,
  450.00,
  0.00,
  4400.00,
  450.00,
  22450.00,
  25900.00,
  3450.00,
  15.37,
  'Italie',
  20.0,
  true,
  '[
    {
      "id": "img_1",
      "url": "https://images.unsplash.com/photo-1615906655593-ad0386982a0f?w=800&q=80",
      "isPrimary": true,
      "name": "front.jpg"
    },
    {
      "id": "img_2",
      "url": "https://images.unsplash.com/photo-1552975084-6e027ca37a37?w=800&q=80",
      "isPrimary": false,
      "name": "side.jpg"
    }
  ]'::jsonb,
  'DEMO VEHICLE - Abarth 595 Competizione 180ch, échappement Record Monza, sièges Sabelt, volant cuir',
  'Abarth Milano',
  NOW() - INTERVAL '12 days'
);

-- =====================================================
-- 6. FORD MUSTANG GT - Bleu Velocity, 2020
-- =====================================================
INSERT INTO vehicles (
  id,
  vin,
  brand,
  model,
  trim,
  year,
  mileage,
  color,
  status,
  purchase_price,
  purchase_currency,
  exchange_rate,
  transport_cost,
  customs_fee,
  vat_amount,
  fees_total,
  cost_price,
  selling_price,
  margin,
  margin_percent,
  import_country,
  vat_rate,
  is_eu_origin,
  images,
  notes,
  seller_name,
  created_at
) VALUES (
  gen_random_uuid(),
  '1FA6P8CF5L5123456',
  'Ford',
  'Mustang GT',
  'V8 5.0L 450ch',
  2020,
  35000,
  'Bleu Velocity',
  'STOCK',
  42000.00,
  'EUR',
  1.00,
  650.00,
  0.00,
  8400.00,
  650.00,
  42650.00,
  48500.00,
  5850.00,
  13.71,
  'Allemagne',
  20.0,
  true,
  '[
    {
      "id": "img_1",
      "url": "https://images.unsplash.com/photo-1584345604476-8ec5f8ea8632?w=800&q=80",
      "isPrimary": true,
      "name": "front.jpg"
    },
    {
      "id": "img_2",
      "url": "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80",
      "isPrimary": false,
      "name": "side.jpg"
    }
  ]'::jsonb,
  'DEMO VEHICLE - Mustang GT V8 5.0L 450ch, boîte manuelle 6 rapports, pack Premium, toit panoramique',
  'Ford Performance Center',
  NOW() - INTERVAL '15 days'
);

-- =====================================================
-- VÉRIFICATION
-- =====================================================
-- Exécutez cette requête pour vérifier que les 6 véhicules sont bien insérés:
-- SELECT brand, model, year, color, selling_price, status FROM vehicles WHERE notes LIKE '%DEMO VEHICLE%' ORDER BY created_at DESC;

-- =====================================================
-- FIN DU SEED - 6 véhicules premium prêts pour le showroom
-- =====================================================
