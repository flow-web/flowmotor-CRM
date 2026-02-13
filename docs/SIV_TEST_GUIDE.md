# SIV Integration - Testing Guide

## Quick Start Testing

### 1. Start Development Server
```bash
cd "C:\Users\flori\Desktop\CRM + WEBAPP FLOWMOTOR"
npm run dev
```

Navigate to: `http://localhost:5173/atelier`

---

## Test Scenarios

### Scenario 1: Valid Plate Lookup (Mock Mode)

**Test Plate**: `AA-123-BB`

**Steps**:
1. Type `aa123bb` in the license plate input
2. Observe auto-formatting to `AA-123-BB`
3. Border should turn green (valid format)
4. Click "Estimer ma voiture"
5. See loading spinner (800ms delay)

**Expected Result**:
```
✓ Véhicule trouvé
Renault Clio V Intens - 2020

Les informations vont être pré-remplies dans le formulaire...
```

6. After 1.5s, wizard opens with:
   - Brand: "Renault" selected
   - Model: "Clio V"
   - Year: "2020"
   - Mileage: "10000-30000" selected

---

### Scenario 2: Other Test Plates

| Plate | Expected Vehicle |
|-------|------------------|
| `BB-456-CC` | Peugeot 308 GT Line - 2019 |
| `CC-789-DD` | BMW Série 3 320d - 2021 |
| `DD-012-EE` | Volkswagen Golf GTI - 2018 |
| `EE-345-FF` | Audi A4 S Line - 2022 |

**Test Each**:
- Follow same steps as Scenario 1
- Verify correct brand, model, year auto-fill

---

### Scenario 3: Unknown Plate (Random Generation)

**Test Plate**: `ZZ-999-ZZ`

**Expected Result**:
- Success message
- Random vehicle generated (brand from mock list)
- Year between 2015-2024
- Mileage between 10,000-150,000 km

---

### Scenario 4: Invalid Format

**Test Inputs**:
- `ABC-123` (too short)
- `AA-12-BB` (wrong number count)
- `123-456-AB` (numbers first)
- `INVALID`

**Expected Result**:
- Red border on input
- "Format invalide. Attendu: AA-123-BB" error
- Button disabled
- Format hint appears below input

---

### Scenario 5: Input Variations (Auto-Normalization)

**Test Inputs** → **Expected Normalized**:
- `aa123bb` → `AA-123-BB`
- `AA123BB` → `AA-123-BB`
- `aa-123-bb` → `AA-123-BB`
- `aa 123 bb` → `AA-123-BB`

All should result in green border and successful lookup.

---

### Scenario 6: Manual Entry Fallback

**Steps**:
1. On initial screen, click "Je n'ai pas ma plaque"
2. Wizard opens without SIV lookup
3. All fields empty (no pre-fill)
4. Fill manually and submit

**Expected**: Normal wizard flow, no SIV interaction.

---

### Scenario 7: Complete Flow End-to-End

**Test Plate**: `AA-123-BB`

**Full Journey**:
1. Enter plate → See success
2. Wizard opens (pre-filled)
3. Step 1: "Renault" already selected → Click "Suivant"
4. Step 2: Verify "Clio V", "2020", "10-30k km" → Click "Suivant"
5. Step 3: Fill contact info:
   - Name: "Test User"
   - Email: "test@example.com"
   - Phone: "0612345678" (optional)
6. Review summary card
7. Click "Recevoir mon estimation"
8. See success screen: "Demande envoyée !"

**Verify in Supabase**:
```sql
SELECT * FROM leads
WHERE subject = 'reprise'
ORDER BY created_at DESC
LIMIT 1;
```

Expected lead message:
```
Marque : Renault
Modele : Clio V
Annee : 2020
Kilometrage : 10000-30000
```

---

## Visual Feedback Checklist

### License Plate Input
- [ ] Auto-formatting works (dashes added)
- [ ] Uppercase conversion automatic
- [ ] Green border when valid (7 chars)
- [ ] Red border when invalid
- [ ] Format hint appears for incomplete input
- [ ] Enter key triggers search
- [ ] Max length enforced (9 chars with dashes)

### Loading State
- [ ] Button shows spinner when loading
- [ ] Text changes to "Recherche en cours..."
- [ ] Button disabled during loading
- [ ] ~800ms delay in mock mode

### Success State
- [ ] Green badge with checkmark icon
- [ ] Vehicle info displayed correctly
- [ ] "Redirection" message shown
- [ ] Auto-transition after 1.5s
- [ ] Wizard opens with correct pre-fill

### Error State
- [ ] Red badge with alert icon
- [ ] Error message displayed
- [ ] "Remplir manuellement" prompt
- [ ] User can retry or use fallback

---

## Console Logs to Watch

### Mock Mode (No API Key)
```
[SIV API] Mode: Mock (no API key)
```

### Real API Mode (API Key Set)
```
[SIV API] Mode: Real API
```

### Network Tab (Real API)
- Request to: `https://api.siv-auto.fr/v1/vehicles?plate=AA-123-BB`
- Headers: `Authorization: Bearer <key>`
- Method: GET

---

## Real API Testing (Production)

### Prerequisites
1. Obtain SIV API key from provider
2. Add to `.env`:
   ```bash
   VITE_SIV_API_KEY=your_actual_key_here
   ```
3. Restart dev server

### Test with Real Plates
Use actual French license plates (with owner permission):
- Modern format: `AA-123-BB`
- Test error cases: Plates not in database

### Expected API Responses

**Success (200)**:
```json
{
  "brand": "Renault",
  "model": "Clio V",
  "version": "Intens",
  "year": 2020,
  "fuel": "Essence",
  "mileage": 45000,
  "color": "Noir",
  "vin": "VF1RJA00123456789"
}
```

**Not Found (404)**:
```
Error badge: "Véhicule non trouvé dans la base SIV"
```

**Rate Limit (429)**:
```
Error badge: "Limite de requêtes atteinte. Réessayez dans quelques instants."
```

**Network Error**:
```
Error badge: "Erreur réseau. Vérifiez votre connexion."
```

---

## Performance Benchmarks

### Mock Mode
- Validation: <1ms
- Mock lookup: ~800ms (simulated delay)
- Auto-fill: <10ms
- Total: ~810ms

### Real API Mode
- Validation: <1ms
- API call: 200-500ms (network dependent)
- Auto-fill: <10ms
- Total: 200-510ms

---

## Debugging Tips

### Issue: Button doesn't enable
**Check**: Plate format validation
```javascript
validatePlate(plateValue)
// Should return { valid: true, normalized: "AA-123-BB" }
```

### Issue: No pre-fill in wizard
**Check**:
1. `plateResult.success === true`
2. `plateResult.data` contains expected fields
3. Brand exists in `POPULAR_BRANDS` or "Autre" selected

### Issue: Mock data not loading
**Check**:
1. `VITE_SIV_API_KEY` not set in `.env`
2. Console shows "Mode: Mock"
3. 800ms delay is intentional

### Issue: Real API errors
**Check**:
1. API key valid and not expired
2. API endpoint URL correct
3. Network tab shows request sent
4. CORS not blocking request
5. Rate limit not exceeded

---

## Edge Cases

### Empty Input
- Button disabled
- No border color
- No validation message

### Partial Input (e.g., "AA-1")
- Border remains neutral (not red)
- Format hint not shown yet
- Button disabled

### Complete but Invalid (e.g., "AA-AAA-BB")
- Red border immediately
- Error message shown
- Button disabled

### Rapid Typing
- Formatting happens on every keystroke
- No performance issues expected

### Multiple Lookups
- Previous result cleared on new input
- Can lookup different plates sequentially
- No caching (each lookup hits API/mock)

### Wizard Reset
- "Nouvelle estimation" button clears all state
- Returns to initial plate input
- No residual pre-fill data

---

## Accessibility Testing

- [ ] Keyboard navigation works (Tab, Enter)
- [ ] Screen readers announce validation state
- [ ] Focus visible on all interactive elements
- [ ] Error messages have proper ARIA attributes
- [ ] Color contrast meets WCAG AA standards

---

## Browser Compatibility

Tested on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

---

## Test Completion Checklist

- [ ] All 7 scenarios tested and passed
- [ ] Visual feedback working correctly
- [ ] Console shows correct mode (Mock/Real)
- [ ] No JavaScript errors in console
- [ ] Network requests (if Real API) show correct headers
- [ ] Supabase lead created successfully
- [ ] Build completes without errors (`npm run build`)
- [ ] No TypeScript/ESLint warnings

---

## Reporting Issues

If tests fail, collect:
1. Browser + version
2. Console errors (full stack trace)
3. Network tab screenshot (if API call)
4. Steps to reproduce
5. Expected vs actual behavior
6. Environment: Mock or Real API mode

Submit to development team with all info above.
