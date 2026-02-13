# Seed Demo Vehicles - Flow Motor Showroom

## Quick Start

1. Open your Supabase SQL Editor
2. Copy the entire contents of `seed_demo_vehicles.sql`
3. Paste and execute in the SQL editor
4. Verify the results with the query at the bottom of the file

## What This Seed Adds

6 premium/luxury demo vehicles with real Unsplash images:

| Vehicle | Year | Color | Price | Source |
|---------|------|-------|-------|--------|
| Porsche 911 Carrera S (992) | 2023 | Noir Intense | 142,000€ | Germany |
| Audi RS6 Avant Performance | 2022 | Gris Nardo | 108,000€ | Germany |
| Mercedes-AMG G63 Edition 1 | 2023 | Noir Obsidienne | 189,000€ | Germany |
| Range Rover Sport HSE Dynamic | 2022 | British Racing Green | 110,000€ | UK |
| Fiat 500 Abarth 595 Competizione | 2021 | Rouge Passione | 25,900€ | Italy |
| Ford Mustang GT V8 | 2020 | Bleu Velocity | 48,500€ | Germany |

## Image Sources

All images are from Unsplash (free, high-quality, reliable):
- Porsche 911: Sport car photography
- Audi RS6: Performance wagon shots
- Mercedes G63: Luxury SUV images
- Range Rover Sport: Premium SUV photography
- Fiat Abarth: Italian hot hatch
- Ford Mustang: American muscle car

## Data Quality

- All vehicles have `status = 'STOCK'` (visible in public showroom)
- Realistic French market prices and margins (8-15%)
- Proper financial calculations (cost_price, margin, margin_percent)
- Currency conversions where applicable (GBP for UK import)
- VIN numbers follow manufacturer patterns
- Each vehicle has 2 high-quality images (primary + secondary)

## Verification Query

After running the seed, verify with:

```sql
SELECT
  brand,
  model,
  year,
  color,
  selling_price,
  status,
  (images->0->>'url') as primary_image
FROM vehicles
WHERE notes LIKE '%DEMO VEHICLE%'
ORDER BY created_at DESC;
```

## Clean Up Demo Data

If you need to remove demo vehicles later:

```sql
DELETE FROM vehicles WHERE notes LIKE '%DEMO VEHICLE%';
```

## Notes

- All `notes` fields contain "DEMO VEHICLE" marker for easy identification
- Created dates are staggered (3-15 days ago) for realistic timeline
- Import countries vary: Germany (majority), UK, Italy
- Financial data follows Flow Motor schema exactly (snake_case in DB)
