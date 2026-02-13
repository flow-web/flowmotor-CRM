# API Integrations

This directory contains external API integrations for Flow Motor CRM.

## SIV API - French Vehicle Registration Lookup

### Overview
The SIV (Système d'Immatriculation des Véhicules) integration allows automatic vehicle data lookup via French license plates on the public Atelier page (Trade-In form).

### Files
- `siv.js` - Main SIV API module with dual-mode support (real API + mock)

### Configuration

#### Real API Mode
Set the `VITE_SIV_API_KEY` environment variable in `.env`:
```bash
VITE_SIV_API_KEY=your_actual_api_key_here
```

#### Mock Mode (Default)
If no API key is configured, the system automatically uses mock data for development and demo purposes.

### Usage

```javascript
import { getVehicleByPlate, validatePlate } from '@/lib/api/siv'

// Validate plate format
const validation = validatePlate('AA-123-BB')
// Returns: { valid: true, normalized: 'AA-123-BB' }

// Lookup vehicle
const result = await getVehicleByPlate('AA-123-BB')
// Returns: {
//   success: true,
//   data: { brand, model, version, year, fuel, mileage, color, vin }
// }
```

### Mock Data
The mock mode includes realistic data for common test plates:
- `AA-123-BB` - Renault Clio V 2020
- `BB-456-CC` - Peugeot 308 2019
- `CC-789-DD` - BMW Série 3 2021
- `DD-012-EE` - Volkswagen Golf 2018
- `EE-345-FF` - Audi A4 2022

Unknown plates generate random but realistic data.

### Supported Plate Formats
All these formats are accepted and normalized to `AA-123-BB`:
- `AA-123-BB` (standard)
- `AA123BB` (no dashes)
- `aa-123-bb` (lowercase)
- `aa 123 bb` (spaces)

### Response Schema
```typescript
{
  success: boolean
  data?: {
    brand: string      // e.g., "Renault", "BMW"
    model: string      // e.g., "Clio V", "Série 3"
    version: string    // e.g., "Intens", "320d"
    year: number       // e.g., 2020
    fuel: string       // "Essence" | "Diesel" | "Hybride" | "Électrique"
    mileage: number    // Kilometers (may be null if API doesn't provide)
    color: string      // e.g., "Noir", "Blanc"
    vin: string        // Vehicle Identification Number
  }
  error?: string       // Error message if success is false
}
```

### Error Handling
The module handles:
- Invalid plate formats (client-side validation)
- Network errors (with graceful fallback message)
- API rate limiting (returns specific error message)
- 404 Not Found (vehicle not in database)

### Security Notes
- The `VITE_SIV_API_KEY` is a **client-side** variable (exposed to browser)
- For production with sensitive API keys, consider moving to an Edge Function or Server Action
- Mock mode is safe for development and demos without exposing real credentials

### Integration Points
Currently used in:
- `src/pages/public/Atelier.jsx` - Trade-in estimation form

### Future Enhancements
- Move to Supabase Edge Function for API key security
- Add caching layer to reduce API calls
- Support for commercial vehicle plates
- Historical vehicle data (previous owners, accidents)

---

## Photoroom API - Virtual Studio

### Overview
The Virtual Studio feature transforms amateur vehicle photos (parking lots, streets, garages) into professional studio-quality images, ready for premium listings.

### Files
- `photoroom.js` - Photoroom API integration with background removal & watermarking

### Features
- **Background Removal** - AI-powered removal of messy backgrounds
- **Studio Background** - Replaces with luxury dark grey concrete wall (#2a2a2a)
- **Soft Shadows** - AI-generated shadows for realistic grounding effect
- **Flow Motor Watermark** - Branded watermark (50% opacity, bottom-right corner)
- **Auto-Primary** - Processed image automatically set as main vehicle photo

### Configuration

#### Setup
1. Sign up for Photoroom API: https://www.photoroom.com/api
2. Get your API key from the dashboard
3. Add to `.env`:
```bash
VITE_PHOTOROOM_API_KEY=your_photoroom_api_key_here
```

#### Pricing (as of 2026)
- **Pay-per-use**: ~€0.05-0.10 per image
- **Monthly plans**: Available for high-volume users
- Check current pricing: https://www.photoroom.com/pricing

### Usage

#### In the CRM
1. Go to Vehicle Cockpit > Galerie tab
2. Hover over any uploaded photo
3. Click the **Sparkles (✨) button** — "Mode Studio"
4. Wait 3-5 seconds for processing
5. The new studio-quality image is automatically added and set as main photo

#### Programmatic Usage
```javascript
import { applyVirtualStudio, isPhotoroomConfigured } from '@/lib/api/photoroom'

// Check if API is configured
if (isPhotoroomConfigured()) {
  // Process an image
  const studioBlob = await applyVirtualStudio(imageUrl)
  // Upload the blob to Supabase Storage...
}
```

### Integration Points
Currently used in:
- `src/admin/components/images/ImageUploader.jsx` - Gallery tab with Studio Mode button

### Technical Flow
1. **User clicks Studio Mode** → Shows loading overlay
2. **Fetch original image** → Download from Supabase Storage public URL
3. **Photoroom API call** → Background removal + studio background + shadows
4. **Watermark overlay** → Client-side canvas adds "Flow Motor" text
5. **Upload to Supabase** → New file stored as `studio_{original_name}.png`
6. **Set as primary** → Automatically becomes the main vehicle photo
7. **Success toast** → User notification + UI update

### API Endpoint
```
POST https://sdk.photoroom.com/v1/segment
Headers:
  x-api-key: YOUR_API_KEY
Body (multipart/form-data):
  image_file: (binary)
  shadow.mode: ai.soft
  shadow.intensity: 0.3
  background.color: #2a2a2a
  format: png
  size: preview
```

### Error Handling
The module handles:
- **Missing API key** - Button hidden if not configured
- **Network errors** - User-friendly error message
- **API rate limits (429)** - "Try again later" message
- **Quota exceeded (402)** - "Check your subscription" message
- **Invalid API key (401)** - Configuration error message

### Security Notes
- The `VITE_PHOTOROOM_API_KEY` is currently **client-side** (exposed to browser)
- For production with high-value API keys, consider:
  - Moving to a **Supabase Edge Function** (server-side API calls)
  - Implementing **rate limiting** per user
  - Adding **usage tracking** to monitor costs

### Performance
- **Processing time**: 3-5 seconds per image (Photoroom API latency)
- **Image quality**: High (PNG format with alpha channel)
- **File size**: Typically 500KB-2MB depending on resolution
- **Recommended**: Process 1-3 hero images per vehicle, not entire galleries

### Future Enhancements
- [ ] Batch processing (select multiple images, process all at once)
- [ ] Custom background library (studio floor, gradient, pure white)
- [ ] Adjustable shadow intensity slider (user control)
- [ ] Before/After comparison slider in UI
- [ ] Move API key to Edge Function for security
- [ ] Cost tracking dashboard (monitor API spend per month)
- [ ] Cached processing (avoid re-processing identical images)
- [ ] Support for 360° spins and video backgrounds
