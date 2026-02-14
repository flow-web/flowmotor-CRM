import { GoogleGenerativeAI } from '@google/generative-ai'

const apiKey = import.meta.env.VITE_GEMINI_API_KEY

let genAI = null
function getClient() {
  if (!genAI && apiKey) {
    genAI = new GoogleGenerativeAI(apiKey)
  }
  return genAI
}

// ===========================
// VEHICLE DATA EXTRACTION
// ===========================

const EXTRACTION_SYSTEM_PROMPT = `Tu es un expert en saisie de données automobiles pour un concessionnaire professionnel spécialisé dans les véhicules premium et de luxe.

Analyse le texte brut d'annonce (Leboncoin, Mobile.de, AutoScout24, La Centrale, etc.) ou l'image de document d'immatriculation fourni(e) et extrais TOUTES les caractéristiques techniques du véhicule.

CONVERSIONS IMPORTANTES :
- Puissance : kW → ch (multiplier par 1.36)
- Dates : convertir en format YYYY-MM-DD
- Prix : retirer symboles de devise, convertir en nombre
- Kilométrage : retirer "km", convertir en nombre
- Cylindrée : convertir en cc (ex: 2.0L → 2000cc)

CHAMPS À EXTRAIRE (mettre null si inconnu) :

**Identité véhicule :**
- brand : Marque (BMW, Mercedes-Benz, Audi, Porsche, etc.)
- model : Modèle (M3, Classe C, RS6, 911, etc.)
- trim : Finition/Version (Competition, AMG, Performance, Carrera S, etc.)
- year : Année modèle (nombre entier)
- vin : Numéro VIN (17 caractères)
- registration_plate : Plaque d'immatriculation
- first_registration_date : Date de 1ère immatriculation (YYYY-MM-DD)

**Kilométrage & État :**
- mileage : Kilométrage (nombre sans unité)
- owners_count : Nombre de propriétaires
- last_service_date : Date du dernier entretien (YYYY-MM-DD)
- warranty_months : Garantie restante en mois

**Moteur & Performances :**
- fuel_type : Essence | Diesel | Hybride | Électrique | GPL | Hydrogène
- transmission : Manuelle | Automatique | Semi-automatique
- power_ch : Puissance en chevaux (nombre entier)
- power_kw : Puissance en kW (nombre entier)
- displacement_cc : Cylindrée en cm³ (nombre entier)
- cylinders : Nombre de cylindres (4, 6, 8, 10, 12...)
- drive_type : Propulsion | Traction | 4x4 | Intégrale
- gears_count : Nombre de rapports de boîte
- engine_code : Code moteur constructeur (ex: N55B30, M139, etc.)

**Consommation & Environnement :**
- co2_emissions : Émissions CO2 en g/km (nombre entier)
- consumption_mixed : Consommation mixte en L/100km (nombre décimal)
- consumption_city : Consommation urbaine en L/100km
- consumption_highway : Consommation extra-urbaine en L/100km
- euro_standard : Norme Euro (Euro 5, Euro 6d-Temp, Euro 6d-Final, etc.)
- critair : Vignette Crit'Air (1, 2, 3, 4, 5, null)

**Dimensions & Carrosserie :**
- length_mm : Longueur en mm
- width_mm : Largeur en mm
- height_mm : Hauteur en mm
- weight_empty_kg : Poids à vide en kg
- trunk_volume_l : Volume coffre en litres
- seats : Nombre de places (nombre entier, par défaut 5)
- doors : Nombre de portes (3, 5, etc.)
- payload_kg : Charge utile en kg

**Couleurs & Intérieur :**
- color : Couleur principale (Noir, Blanc, Gris, Bleu, Rouge, etc.)
- exterior_color_detailed : Couleur détaillée (ex: "Bleu Nuit Métallisé")
- interior_color : Couleur intérieur (Noir, Beige, Cuir rouge, etc.)
- interior_material : Matière intérieur (Cuir, Tissu, Alcantara, Cuir Nappa, etc.)

**Origine & Historique :**
- country_origin : Pays d'origine (FR, DE, IT, UK, JP, etc.)
- is_import : true si véhicule importé, false sinon

**Prix :**
- selling_price : Prix de vente annoncé (nombre sans devise)
- purchase_price : Prix d'achat si mentionné (nombre sans devise)

**Informations complémentaires :**
- source_url : URL de l'annonce si fournie
- seller_name : Nom du vendeur / garage
- description_summary : Résumé de l'annonce en 1-2 phrases (max 200 caractères)

Réponds UNIQUEMENT en JSON strict (sans markdown, sans texte avant/après) au format suivant :

{
  "brand": "BMW",
  "model": "M3",
  "trim": "Competition",
  "year": 2021,
  "mileage": 35000,
  "fuel_type": "Essence",
  "transmission": "Automatique",
  "power_ch": 510,
  "power_kw": 375,
  "displacement_cc": 2993,
  "cylinders": 6,
  "drive_type": "Propulsion",
  "gears_count": 8,
  "co2_emissions": 220,
  "consumption_mixed": 10.5,
  "euro_standard": "Euro 6d",
  "critair": 1,
  "weight_empty_kg": 1730,
  "seats": 5,
  "doors": 5,
  "color": "Gris",
  "exterior_color_detailed": "Gris Brooklyn Métallisé",
  "interior_color": "Noir/Rouge",
  "interior_material": "Cuir Merino",
  "country_origin": "DE",
  "is_import": true,
  "owners_count": 1,
  "warranty_months": 12,
  "selling_price": 78900,
  "purchase_price": null,
  "vin": "WBS8M9C51M7J12345",
  "registration_plate": null,
  "first_registration_date": "2021-03-15",
  "engine_code": "S58B30",
  "source_url": null,
  "seller_name": null,
  "description_summary": "BMW M3 Competition 510ch, 1er main, full options, historique BMW complet."
}

RÈGLES IMPORTANTES :
- Pour les champs inconnus ou non mentionnés, utilise null (pas de chaîne vide).
- Si l'année n'est pas explicite mais la date de 1ère immatriculation est connue, déduis l'année.
- Si seule la puissance en kW est donnée, calcule power_ch = kW × 1.36.
- Si seule la puissance en ch/cv est donnée, calcule power_kw = ch ÷ 1.36.
- Pour brand, utilise le nom officiel (Mercedes-Benz, pas Mercedes ; Land Rover, pas Range Rover).
- Pour fuel_type et transmission, utilise les valeurs exactes listées.
- Si l'annonce mentionne plusieurs prix (neuf/occasion), prends le prix affiché comme prix de vente.`

export async function extractVehicleData(inputText = null, imageBase64 = null, imageMimeType = 'image/jpeg') {
  const client = getClient()
  if (!client) {
    console.error('[Auto Fill] Pas de clé API Gemini configurée (VITE_GEMINI_API_KEY)')
    return {
      error: 'Configuration manquante : clé API Gemini non définie.',
    }
  }

  if (!inputText && !imageBase64) {
    return {
      error: 'Aucune donnée fournie : veuillez fournir du texte ou une image.',
    }
  }

  try {
    const model = client.getGenerativeModel({ model: 'gemini-2.0-flash' })

    // Build the request parts
    const parts = [{ text: EXTRACTION_SYSTEM_PROMPT }]

    if (inputText) {
      parts.push({ text: `Voici le texte de l'annonce ou du document :\n\n${inputText}` })
    }

    if (imageBase64) {
      parts.push({
        inlineData: {
          mimeType: imageMimeType,
          data: imageBase64,
        },
      })
    }

    const result = await model.generateContent(parts)

    const response = result.response.text()

    // Strip markdown fences if present
    const cleaned = response
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim()

    const parsed = JSON.parse(cleaned)

    // Transform snake_case API response to camelCase for frontend
    return {
      brand: parsed.brand || null,
      model: parsed.model || null,
      trim: parsed.trim || null,
      year: parsed.year || null,
      mileage: parsed.mileage || null,
      vin: parsed.vin || null,
      registrationPlate: parsed.registration_plate || null,
      firstRegistrationDate: parsed.first_registration_date || null,

      fuelType: parsed.fuel_type || null,
      transmission: parsed.transmission || null,
      powerCh: parsed.power_ch || null,
      powerKw: parsed.power_kw || null,
      displacementCc: parsed.displacement_cc || null,
      cylinders: parsed.cylinders || null,
      driveType: parsed.drive_type || null,
      gearsCount: parsed.gears_count || null,
      engineCode: parsed.engine_code || null,

      co2Emissions: parsed.co2_emissions || null,
      consumptionMixed: parsed.consumption_mixed || null,
      consumptionCity: parsed.consumption_city || null,
      consumptionHighway: parsed.consumption_highway || null,
      euroStandard: parsed.euro_standard || null,
      critair: parsed.critair || null,

      lengthMm: parsed.length_mm || null,
      widthMm: parsed.width_mm || null,
      heightMm: parsed.height_mm || null,
      weightEmptyKg: parsed.weight_empty_kg || null,
      trunkVolumeL: parsed.trunk_volume_l || null,
      seats: parsed.seats || null,
      doors: parsed.doors || null,
      payloadKg: parsed.payload_kg || null,

      color: parsed.color || null,
      exteriorColorDetailed: parsed.exterior_color_detailed || null,
      interiorColor: parsed.interior_color || null,
      interiorMaterial: parsed.interior_material || null,

      countryOrigin: parsed.country_origin || null,
      isImport: parsed.is_import ?? false,
      ownersCount: parsed.owners_count || null,
      lastServiceDate: parsed.last_service_date || null,
      warrantyMonths: parsed.warranty_months || null,

      sellingPrice: parsed.selling_price || null,
      purchasePrice: parsed.purchase_price || null,

      sourceUrl: parsed.source_url || null,
      sellerName: parsed.seller_name || null,
      descriptionSummary: parsed.description_summary || null,
    }
  } catch (err) {
    console.error('[Auto Fill] Erreur extraction véhicule:', err)
    return {
      error: `Erreur lors de l'extraction : ${err.message}`,
    }
  }
}

// ===========================
// URL EXTRACTION (BONUS)
// ===========================

/**
 * Attempt to extract vehicle data from a URL by fetching its content.
 * NOTE: This will likely fail due to CORS restrictions in the browser.
 * For production, this should be implemented as a server-side function or Edge Function.
 */
export async function extractFromUrl(url) {
  try {
    // Validate URL format
    const urlObj = new URL(url)
    if (!urlObj.protocol.startsWith('http')) {
      return {
        error: 'URL invalide : doit commencer par http:// ou https://',
      }
    }

    // Attempt fetch (will likely fail due to CORS)
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    })

    if (!response.ok) {
      return {
        error: `Erreur HTTP ${response.status} lors de la récupération de l'URL.`,
      }
    }

    const html = await response.text()

    // Extract text content (basic approach - strip HTML tags)
    const textContent = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove scripts
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '') // Remove styles
      .replace(/<[^>]+>/g, ' ') // Remove HTML tags
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim()

    // Extract vehicle data from the text content
    return await extractVehicleData(textContent)
  } catch (err) {
    console.error('[Auto Fill] Erreur extraction URL:', err)
    return {
      error: `Impossible de récupérer l'URL (CORS ou erreur réseau). Utilisez le copier-coller de texte à la place. Erreur : ${err.message}`,
    }
  }
}

export function isAutoFillConfigured() {
  return !!apiKey
}
