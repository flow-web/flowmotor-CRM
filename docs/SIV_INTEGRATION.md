# SIV API Integration - Implementation Guide

## Overview
This document describes the SIV (Système d'Immatriculation des Véhicules) integration for automatic vehicle lookup via French license plates on the Atelier page.

## Implementation Summary

### Files Created/Modified

#### New Files
1. **`src/lib/api/siv.js`** (292 lines)
   - Main SIV API module
   - Dual-mode support (real API + mock)
   - Plate validation and normalization
   - Mock data generator with 5 test vehicles
   - Helper utilities

2. **`src/lib/api/README.md`**
   - API integration documentation
   - Usage examples
   - Security notes
   - Mock data reference

3. **`docs/SIV_INTEGRATION.md`** (this file)
   - Implementation guide

#### Modified Files
1. **`src/pages/public/Atelier.jsx`**
   - Added SIV API imports
   - New state: `plateLoading`, `plateResult`
   - Updated `handlePlateSubmit()` with async vehicle lookup
   - Enhanced `LicensePlateInput` component with validation feedback
   - New UI for lookup results (success/error states)
   - Auto-fill wizard fields on successful lookup

2. **`.env.example`**
   - Added `VITE_SIV_API_KEY` placeholder

3. **`.claude/agent-memory/architecte-backend-flowmotor/MEMORY.md`**
   - Documented dual-mode API pattern

## Features

### 1. License Plate Validation
- Accepts formats: `AA-123-BB`, `AA123BB`, `aa-123-bb`, `aa 123 bb`
- Normalizes to: `AA-123-BB`
- Real-time visual feedback (green/red border)
- Format hint tooltip

### 2. Dual-Mode Operation

#### Mock Mode (Default)
- No API key required
- 5 pre-defined test vehicles:
  - `AA-123-BB` → Renault Clio V 2020
  - `BB-456-CC` → Peugeot 308 2019
  - `CC-789-DD` → BMW Série 3 2021
  - `DD-012-EE` → Volkswagen Golf 2018
  - `EE-345-FF` → Audi A4 2022
- Random generation for unknown plates
- Simulated 800ms network delay

#### Real API Mode
- Activated by setting `VITE_SIV_API_KEY` in `.env`
- Calls actual SIV API endpoint
- Error handling: 404, 429 (rate limit), network errors
- Response transformation to internal schema

### 3. User Experience Flow

1. **User enters plate** → Visual format validation
2. **Clicks "Estimer ma voiture"** → Loading spinner
3. **API lookup** → Results displayed:
   - **Success**: Green badge with vehicle info, auto-redirects to wizard
   - **Error**: Red badge with error message, option to fill manually
4. **Wizard pre-fill** → Brand, model, year, mileage auto-populated
5. **User completes** → Contact info + submit

### 4. Auto-Fill Logic

On successful lookup, the system:
- Selects brand chip (or "Autre" + custom input)
- Fills model input
- Selects year dropdown
- Estimates mileage range (from exact km or year-based calculation)
- Transitions to wizard after 1.5s delay

## API Response Schema

```javascript
{
  success: boolean,
  data?: {
    brand: string,      // "Renault", "BMW", etc.
    model: string,      // "Clio V", "Série 3"
    version: string,    // "Intens", "320d"
    year: number,       // 2020
    fuel: string,       // "Essence" | "Diesel" | "Hybride" | "Électrique"
    mileage: number,    // Kilometers (nullable)
    color: string,      // "Noir", "Blanc", etc.
    vin: string         // Vehicle Identification Number
  },
  error?: string        // Error message if success=false
}
```

## Configuration

### Development/Demo Mode
No configuration needed. Mock mode activates automatically.

### Production with Real API

1. **Get SIV API Key** from your provider
2. **Add to `.env`**:
   ```bash
   VITE_SIV_API_KEY=your_actual_api_key_here
   ```
3. **Restart dev server** or rebuild for production

### Security Considerations

#### Current Implementation (Client-Side)
- API key exposed to browser via `VITE_*` prefix
- Suitable for public APIs with rate limiting
- Users can inspect key in Network tab

#### Recommended for Production (Server-Side)
If API key is sensitive, migrate to Supabase Edge Function:

```javascript
// supabase/functions/siv-lookup/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
  const { plate } = await req.json()
  const apiKey = Deno.env.get('SIV_API_KEY') // Server-side secret

  const response = await fetch(`https://api.siv-auto.fr/v1/vehicles?plate=${plate}`, {
    headers: { 'Authorization': `Bearer ${apiKey}` }
  })

  return new Response(JSON.stringify(await response.json()), {
    headers: { 'Content-Type': 'application/json' }
  })
})
```

Then update `src/lib/api/siv.js`:
```javascript
async function callRealAPI(plate) {
  const { data, error } = await supabase.functions.invoke('siv-lookup', {
    body: { plate }
  })
  // ...
}
```

## Testing

### Manual Testing
1. Open `http://localhost:5173/atelier`
2. Enter test plates:
   - `AA-123-BB` → Should return Renault Clio
   - `INVALID` → Should show format error
   - `ZZ-999-ZZ` → Should generate random vehicle
3. Verify auto-fill in wizard
4. Submit form → Check lead in Supabase

### Build Test
```bash
npm run build
# Should complete without errors
```

## Error Handling

| Error Type | User Message | Action |
|------------|--------------|--------|
| Invalid format | "Format invalide. Attendu: AA-123-BB" | Show format hint |
| 404 Not Found | "Véhicule non trouvé dans la base SIV" | Prompt manual entry |
| Rate limit (429) | "Limite de requêtes atteinte. Réessayez..." | Suggest retry later |
| Network error | "Erreur réseau. Vérifiez votre connexion." | Check connection |

## Future Enhancements

1. **Caching Layer**
   - Cache successful lookups in localStorage
   - Reduce API calls for repeated plates
   - TTL: 24 hours

2. **Enhanced Mock Data**
   - More test vehicles
   - Regional plate variations
   - Commercial vehicle support

3. **Analytics**
   - Track lookup success rate
   - Popular brands/models
   - API error frequency

4. **Multi-Provider Support**
   - Fallback to secondary API if primary fails
   - Compare data accuracy across providers

5. **VIN Lookup**
   - Alternative lookup by VIN
   - More detailed vehicle history

## Support

For API provider documentation and support:
- **API Endpoint**: `https://api.siv-auto.fr/v1/vehicles` (example)
- **Rate Limits**: Check with your provider
- **Support**: Contact your SIV API provider

## Changelog

### 2025-02-13 - Initial Implementation
- Created `src/lib/api/siv.js` with dual-mode support
- Integrated into `Atelier.jsx`
- Added mock data for 5 test vehicles
- Implemented auto-fill logic
- Added validation and error handling
- Build tested successfully
