/**
 * Spec-Check Engine: VIN vs Photo Feature Analysis
 * Detects fraud/retrofits by comparing factory specs against visual inspection
 */

import { GoogleGenerativeAI } from '@google/generative-ai'

const apiKey = import.meta.env.VITE_GEMINI_API_KEY

let genAI = null
function getClient() {
  if (!genAI && apiKey) {
    genAI = new GoogleGenerativeAI(apiKey)
  }
  return genAI
}

/**
 * VIN Decoder (Mock implementation for now)
 * In production, integrate with VIN API (NHTSA, CarMD, etc.)
 *
 * @param {string} vin - Vehicle Identification Number (17 chars)
 * @returns {Object} - Factory specs extracted from VIN
 */
export function getFactorySpecs(vin) {
  if (!vin || vin.length !== 17) {
    return null
  }

  // VIN structure (simplified):
  // Positions 1-3: WMI (World Manufacturer Identifier)
  // Position 10: Model year
  // Position 11: Assembly plant

  const wmi = vin.substring(0, 3).toUpperCase()
  const modelYearCode = vin.charAt(9)
  const assemblyPlant = vin.charAt(10)

  // Model year decoding (simplified)
  const yearMap = {
    'A': 2010, 'B': 2011, 'C': 2012, 'D': 2013, 'E': 2014, 'F': 2015, 'G': 2016,
    'H': 2017, 'J': 2018, 'K': 2019, 'L': 2020, 'M': 2021, 'N': 2022, 'P': 2023,
    'R': 2024, 'S': 2025, 'T': 2026
  }
  const year = yearMap[modelYearCode] || 2020

  // Manufacturer detection (simplified — in reality use WMI database)
  let manufacturer = 'Unknown'
  let expectedFeatures = []
  let trimLevel = 'Standard'
  let market = 'EU'

  // BMW WMIs
  if (wmi.startsWith('WB') || wmi.startsWith('WBA') || wmi.startsWith('5UX')) {
    manufacturer = 'BMW'
    trimLevel = 'Standard'
    expectedFeatures = [
      'Cloth Seats',
      'Halogen Headlights',
      'Standard Bumper',
      'Steel Wheels',
      'Manual Climate Control',
      'Standard Steering Wheel'
    ]
  }
  // Mercedes WMIs
  else if (wmi.startsWith('WD') || wmi.startsWith('WDB') || wmi.startsWith('4JG')) {
    manufacturer = 'Mercedes-Benz'
    trimLevel = 'Classic'
    expectedFeatures = [
      'MB-Tex Seats',
      'Halogen Headlights',
      'Standard Grille',
      'Steel Wheels',
      'Manual Climate Control'
    ]
  }
  // Audi WMIs
  else if (wmi.startsWith('WA') || wmi.startsWith('WAU')) {
    manufacturer = 'Audi'
    trimLevel = 'Base'
    expectedFeatures = [
      'Cloth Seats',
      'Halogen Headlights',
      'Standard Grille',
      'Steel Wheels'
    ]
  }
  // Volkswagen WMIs
  else if (wmi.startsWith('WVW') || wmi.startsWith('3VW')) {
    manufacturer = 'Volkswagen'
    trimLevel = 'Trendline'
    expectedFeatures = [
      'Cloth Seats',
      'Halogen Headlights',
      'Standard Bumper'
    ]
  }
  // Porsche WMIs
  else if (wmi.startsWith('WP0')) {
    manufacturer = 'Porsche'
    trimLevel = 'Base'
    expectedFeatures = [
      'Sport Seats',
      'Bi-Xenon Headlights',
      'Sport Exhaust (optional)'
    ]
  }
  // Japanese manufacturers
  else if (wmi.startsWith('JM') || wmi.startsWith('JT') || wmi.startsWith('JN')) {
    if (wmi.startsWith('JT')) manufacturer = 'Toyota'
    else if (wmi.startsWith('JN')) manufacturer = 'Nissan'
    else if (wmi.startsWith('JM')) manufacturer = 'Mazda'

    expectedFeatures = [
      'Cloth Seats',
      'Halogen Headlights',
      'Standard Wheels'
    ]
  }

  // Mock model extraction (in reality parse VDS - Vehicle Descriptor Section)
  const model = manufacturer === 'BMW' ? '320d' :
                manufacturer === 'Mercedes-Benz' ? 'C 220' :
                manufacturer === 'Audi' ? 'A4' :
                'Unknown Model'

  const engine = manufacturer === 'BMW' ? '2.0L Diesel' :
                 manufacturer === 'Mercedes-Benz' ? '2.0L Diesel' :
                 manufacturer === 'Audi' ? '2.0L TDI' :
                 'Unknown'

  return {
    vin,
    manufacturer,
    model,
    year,
    engine,
    trim_level: trimLevel,
    market,
    assembly_plant: assemblyPlant,
    expected_features: expectedFeatures,
    confidence: 'mock', // In production: 'high' | 'medium' | 'low'
    data_source: 'VIN_MOCK' // In production: 'NHTSA_API' | 'CarMD' | etc.
  }
}

/**
 * Analyze visible features in a car photo using Gemini Vision
 *
 * @param {string|File} imageBase64OrFile - Base64 string or File object
 * @returns {Object} - Detected features and confidence
 */
export async function analyzeVisibleFeatures(imageBase64OrFile) {
  const client = getClient()
  if (!client) {
    console.error('[SpecCheck] Pas de clé API Gemini configurée (VITE_GEMINI_API_KEY)')
    return null
  }

  try {
    let base64Data
    let mimeType = 'image/jpeg'

    // Handle File object
    if (imageBase64OrFile instanceof File) {
      base64Data = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result.split(',')[1])
        reader.onerror = reject
        reader.readAsDataURL(imageBase64OrFile)
      })
      mimeType = imageBase64OrFile.type || 'image/jpeg'
    }
    // Handle base64 string
    else if (typeof imageBase64OrFile === 'string') {
      // Remove data URI prefix if present
      base64Data = imageBase64OrFile.replace(/^data:image\/[a-z]+;base64,/, '')
    } else {
      throw new Error('Invalid image format')
    }

    const model = client.getGenerativeModel({ model: 'gemini-2.0-flash' })

    const prompt = `Analyze this car photo in detail. List ALL visible features and equipment you can identify.

Focus on:
- Seat material (Cloth, Leather, Alcantara, etc.)
- Headlight type (Halogen, Xenon, LED, Matrix LED)
- Wheel type (Steel, Alloy, specific design)
- Bumper/Body kit (Standard, Sport, M-Sport, AMG, etc.)
- Interior trim (Wood, Carbon fiber, Aluminum, Piano black)
- Sunroof/Panoramic roof presence
- Exhaust tips (Single, Dual, Quad, Sport)
- Badges/Emblems (M, AMG, RS, GTI, etc.)
- Dashboard/Infotainment screen size
- Steering wheel (Standard, Sport, Multifunction)
- Door handles (Chrome, Black, Body-color)
- Any other visible premium features

Return ONLY a JSON object (no markdown, no text before/after):

{
  "detected_features": [
    "Leather Seats",
    "LED Headlights",
    "M-Sport Bumper",
    "19-inch Alloy Wheels",
    "Carbon Fiber Trim",
    "Dual Exhaust"
  ],
  "confidence": 0.85,
  "image_quality": "good" | "poor" | "medium",
  "view_type": "interior" | "exterior" | "engine_bay" | "mixed",
  "notes": "Clear view of interior, leather seats clearly visible. Exterior shows M-Sport package."
}

Confidence score (0-1):
- 1.0: All features clearly visible and identifiable
- 0.7-0.9: Most features visible but some uncertainty
- 0.4-0.6: Poor lighting or angle, partial visibility
- <0.4: Cannot reliably identify features`

    const result = await model.generateContent([
      { text: prompt },
      {
        inlineData: {
          mimeType,
          data: base64Data,
        },
      },
    ])

    const response = result.response.text()

    // Strip markdown fences if present
    const cleaned = response
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim()

    const parsed = JSON.parse(cleaned)

    // Validate response
    if (!Array.isArray(parsed.detected_features)) {
      console.error('[SpecCheck] Invalid response structure:', parsed)
      return null
    }

    return {
      detected_features: parsed.detected_features,
      confidence: parsed.confidence || 0.5,
      image_quality: parsed.image_quality || 'medium',
      view_type: parsed.view_type || 'mixed',
      notes: parsed.notes || ''
    }
  } catch (err) {
    console.error('[SpecCheck] Erreur analyse photo:', err)
    return null
  }
}

/**
 * Compare factory specs against detected features
 *
 * @param {Object} factorySpecs - From getFactorySpecs()
 * @param {Object} photoFeatures - From analyzeVisibleFeatures()
 * @returns {Object} - Comparison result with risk assessment
 */
export function compareSpecs(factorySpecs, photoFeatures) {
  if (!factorySpecs || !photoFeatures) {
    return {
      error: 'Missing factory specs or photo features',
      risk_level: 'UNKNOWN'
    }
  }

  const expectedFeatures = factorySpecs.expected_features || []
  const detectedFeatures = photoFeatures.detected_features || []

  // Normalize features for comparison (lowercase, trim)
  const normalizeFeature = (f) => f.toLowerCase().trim()

  const expectedSet = new Set(expectedFeatures.map(normalizeFeature))
  const detectedSet = new Set(detectedFeatures.map(normalizeFeature))

  const matches = []
  const upgrades = []
  const missing = []

  // Find matches
  expectedSet.forEach((expected) => {
    if (detectedSet.has(expected)) {
      matches.push({ feature: expected, status: 'MATCH' })
    }
  })

  // Find upgrades/retrofits (detected but not expected)
  detectedSet.forEach((detected) => {
    if (!expectedSet.has(detected)) {
      // Determine if it's an upgrade or just a different feature
      const isUpgrade = isLikelyUpgrade(detected, expectedFeatures)
      upgrades.push({
        feature: detected,
        factory: findRelatedFactoryFeature(detected, expectedFeatures),
        detected,
        flag: isUpgrade ? 'RETROFIT/UPGRADE' : 'UNEXPECTED'
      })
    }
  })

  // Find missing features (expected but not detected)
  expectedSet.forEach((expected) => {
    if (!detectedSet.has(expected)) {
      const detected = findRelatedDetectedFeature(expected, detectedFeatures)
      if (!detected) {
        missing.push({
          feature: expected,
          factory: expected,
          detected: 'Not visible',
          flag: 'MISSING/HIDDEN'
        })
      }
    }
  })

  // Risk assessment
  const upgradeCount = upgrades.filter((u) => u.flag === 'RETROFIT/UPGRADE').length
  const missingCount = missing.length
  const confidenceScore = photoFeatures.confidence || 0.5

  let riskLevel = 'LOW'
  let summary = ''

  if (upgradeCount >= 3 || missingCount >= 2) {
    riskLevel = 'HIGH'
    summary = `${upgradeCount} modifications detected, ${missingCount} factory features missing. High risk of VIN mismatch or extensive retrofitting.`
  } else if (upgradeCount >= 2 || missingCount >= 1) {
    riskLevel = 'MEDIUM'
    summary = `${upgradeCount} modifications detected, ${missingCount} features not visible. Possible aftermarket upgrades or trim mismatch.`
  } else if (upgradeCount === 1 && confidenceScore > 0.7) {
    riskLevel = 'LOW'
    summary = `1 upgrade detected. Likely minor aftermarket modification. Low risk.`
  } else if (upgradeCount === 0 && missingCount === 0) {
    riskLevel = 'LOW'
    summary = `Specs match factory configuration. No discrepancies detected.`
  } else {
    riskLevel = 'LOW'
    summary = `Minor discrepancies detected. May be due to photo quality or angle.`
  }

  // Adjust risk based on photo quality
  if (confidenceScore < 0.5 && riskLevel !== 'LOW') {
    summary += ' Note: Low photo quality affects accuracy.'
  }

  return {
    matches,
    upgrades,
    missing,
    risk_level: riskLevel,
    summary,
    confidence_score: confidenceScore,
    image_quality: photoFeatures.image_quality,
    factory_specs: {
      manufacturer: factorySpecs.manufacturer,
      model: factorySpecs.model,
      year: factorySpecs.year,
      trim: factorySpecs.trim_level
    }
  }
}

/**
 * Determine if a detected feature is likely an upgrade
 * @param {string} feature - Detected feature
 * @param {string[]} expectedFeatures - Expected factory features
 * @returns {boolean}
 */
function isLikelyUpgrade(feature, expectedFeatures) {
  const upgradeKeywords = [
    'leather', 'cuir', 'alcantara',
    'led', 'xenon', 'matrix',
    'sport', 'm-sport', 'amg', 'rs', 's-line',
    'carbon', 'carbone',
    'panoramic', 'panoramique',
    'premium', 'luxury'
  ]

  const featureLower = feature.toLowerCase()
  return upgradeKeywords.some((keyword) => featureLower.includes(keyword))
}

/**
 * Find the related factory feature for a detected feature
 * @param {string} detected - Detected feature
 * @param {string[]} factoryFeatures - Factory features
 * @returns {string|null}
 */
function findRelatedFactoryFeature(detected, factoryFeatures) {
  const detectedLower = detected.toLowerCase()

  // Seat material mapping
  if (detectedLower.includes('leather') || detectedLower.includes('cuir')) {
    const clothSeat = factoryFeatures.find((f) => f.toLowerCase().includes('cloth'))
    return clothSeat || 'Standard Seats'
  }

  // Headlight mapping
  if (detectedLower.includes('led') || detectedLower.includes('xenon')) {
    const halogen = factoryFeatures.find((f) => f.toLowerCase().includes('halogen'))
    return halogen || 'Standard Headlights'
  }

  // Bumper/Body kit mapping
  if (detectedLower.includes('sport') || detectedLower.includes('m-sport') || detectedLower.includes('amg')) {
    const standard = factoryFeatures.find((f) => f.toLowerCase().includes('standard bumper'))
    return standard || 'Standard Bumper'
  }

  return null
}

/**
 * Find a detected feature that matches an expected feature
 * @param {string} expected - Expected feature
 * @param {string[]} detectedFeatures - Detected features
 * @returns {string|null}
 */
function findRelatedDetectedFeature(expected, detectedFeatures) {
  const expectedLower = expected.toLowerCase()

  return detectedFeatures.find((detected) => {
    const detectedLower = detected.toLowerCase()

    // Check if they share common keywords
    const expectedWords = expectedLower.split(/\s+/)
    const detectedWords = detectedLower.split(/\s+/)

    const commonWords = expectedWords.filter((word) => detectedWords.includes(word))
    return commonWords.length >= 2 // At least 2 words in common
  }) || null
}

/**
 * Check if Gemini API is configured
 * @returns {boolean}
 */
export function isSpecCheckConfigured() {
  return !!apiKey
}

/**
 * Full inspection workflow: VIN decode → Photo analysis → Comparison
 *
 * @param {string} vin - Vehicle VIN
 * @param {File|string} image - Vehicle photo
 * @returns {Object} - Complete inspection result
 */
export async function performFullInspection(vin, image) {
  if (!vin || !image) {
    throw new Error('VIN and image are required')
  }

  // Step 1: Decode VIN
  const factorySpecs = getFactorySpecs(vin)
  if (!factorySpecs) {
    throw new Error('Invalid VIN format (must be 17 characters)')
  }

  // Step 2: Analyze photo
  const photoFeatures = await analyzeVisibleFeatures(image)
  if (!photoFeatures) {
    throw new Error('Failed to analyze vehicle photo')
  }

  // Step 3: Compare
  const comparison = compareSpecs(factorySpecs, photoFeatures)

  return {
    vin,
    factory_specs: factorySpecs,
    photo_analysis: photoFeatures,
    comparison,
    inspection_date: new Date().toISOString(),
    inspector: 'AI_GEMINI_VISION'
  }
}
