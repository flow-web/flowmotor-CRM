/**
 * Example usage for specCheck.js
 * VIN decoder, Photo analysis, and Fraud detection
 */

import {
  getFactorySpecs,
  analyzeVisibleFeatures,
  compareSpecs,
  performFullInspection,
  isSpecCheckConfigured
} from './specCheck.js'

// ============================================
// EXAMPLE 1: VIN Decoder (Mock)
// ============================================
console.log('=== EXAMPLE 1: VIN Decoder ===')

const bmwVIN = 'WBADT43452GZ12345' // Example BMW VIN
const factorySpecs = getFactorySpecs(bmwVIN)

console.log('VIN:', bmwVIN)
console.log('Manufacturer:', factorySpecs.manufacturer)
console.log('Model:', factorySpecs.model)
console.log('Year:', factorySpecs.year)
console.log('Trim:', factorySpecs.trim_level)
console.log('Expected factory features:', factorySpecs.expected_features)
console.log('')

// ============================================
// EXAMPLE 2: Photo Feature Analysis (Gemini Vision)
// ============================================
console.log('=== EXAMPLE 2: Photo Analysis ===')

if (!isSpecCheckConfigured()) {
  console.warn('⚠️  Gemini API not configured (VITE_GEMINI_API_KEY missing)')
  console.log('Set VITE_GEMINI_API_KEY in .env to enable photo analysis')
  console.log('')
} else {
  console.log('✅ Gemini API configured')

  // Example usage in a real scenario:
  /*
  async function analyzeCarPhoto(imageFile) {
    try {
      const photoAnalysis = await analyzeVisibleFeatures(imageFile)

      console.log('Detected features:', photoAnalysis.detected_features)
      console.log('Confidence:', photoAnalysis.confidence)
      console.log('Image quality:', photoAnalysis.image_quality)
      console.log('View type:', photoAnalysis.view_type)
      console.log('Notes:', photoAnalysis.notes)

      return photoAnalysis
    } catch (error) {
      console.error('Photo analysis failed:', error)
      return null
    }
  }

  // In a React component:
  const handleImageUpload = async (event) => {
    const file = event.target.files[0]
    const analysis = await analyzeCarPhoto(file)

    if (analysis) {
      console.log('Analysis complete:', analysis)
    }
  }
  */

  console.log('(Photo analysis requires actual image file — see commented code)')
  console.log('')
}

// ============================================
// EXAMPLE 3: Spec Comparison (Fraud Detection)
// ============================================
console.log('=== EXAMPLE 3: Spec Comparison (Fraud Detection) ===')

// Simulate factory specs (from VIN)
const mockFactorySpecs = {
  manufacturer: 'BMW',
  model: '320d',
  year: 2019,
  trim_level: 'Standard',
  expected_features: [
    'Cloth Seats',
    'Halogen Headlights',
    'Standard Bumper',
    'Steel Wheels',
    'Manual Climate Control',
    'Standard Steering Wheel'
  ]
}

// Simulate detected features (from photo analysis)
const mockPhotoFeatures = {
  detected_features: [
    'Leather Seats', // UPGRADE (expected: Cloth)
    'LED Headlights', // UPGRADE (expected: Halogen)
    'M-Sport Bumper', // UPGRADE (expected: Standard)
    '19-inch Alloy Wheels', // UPGRADE (expected: Steel)
    'Automatic Climate Control', // UPGRADE (expected: Manual)
    'M-Sport Steering Wheel' // UPGRADE (expected: Standard)
  ],
  confidence: 0.85,
  image_quality: 'good',
  view_type: 'mixed',
  notes: 'Clear interior and exterior views. Multiple aftermarket upgrades visible.'
}

const comparison = compareSpecs(mockFactorySpecs, mockPhotoFeatures)

console.log('Factory Specs:', mockFactorySpecs.expected_features)
console.log('Detected Features:', mockPhotoFeatures.detected_features)
console.log('')
console.log('--- COMPARISON RESULT ---')
console.log('Risk Level:', comparison.risk_level)
console.log('Summary:', comparison.summary)
console.log('Confidence Score:', comparison.confidence_score)
console.log('')
console.log('Matches:', comparison.matches)
console.log('Upgrades/Retrofits:', comparison.upgrades)
console.log('Missing Features:', comparison.missing)
console.log('')

// ============================================
// EXAMPLE 4: Full Inspection Workflow
// ============================================
console.log('=== EXAMPLE 4: Full Inspection Workflow ===')

if (isSpecCheckConfigured()) {
  console.log('Full inspection requires:')
  console.log('1. Valid VIN (17 characters)')
  console.log('2. Image file (File object or base64)')
  console.log('')
  console.log('Usage example:')
  console.log(`
    async function runFullInspection(vin, imageFile) {
      try {
        const result = await performFullInspection(vin, imageFile)

        console.log('VIN:', result.vin)
        console.log('Factory Specs:', result.factory_specs)
        console.log('Photo Analysis:', result.photo_analysis)
        console.log('Comparison:', result.comparison)
        console.log('Risk Level:', result.comparison.risk_level)
        console.log('Inspection Date:', result.inspection_date)

        // Save to database
        await createInspection({
          vehicleId: currentVehicle.id,
          inspectionType: 'spec_check',
          result: result,
          healthScore: calculateHealthScore(result),
          riskLevel: result.comparison.risk_level.toLowerCase(),
          inspectorNotes: result.comparison.summary,
          inspector: 'AI_GEMINI_VISION',
          apiModel: 'gemini-2.0-flash'
        })

        return result
      } catch (error) {
        console.error('Full inspection failed:', error)
        return null
      }
    }
  `)
} else {
  console.log('⚠️  Full inspection not available (Gemini API not configured)')
}

// ============================================
// EXAMPLE 5: Different Risk Scenarios
// ============================================
console.log('')
console.log('=== EXAMPLE 5: Risk Scenarios ===')

// Scenario A: Perfect match (LOW risk)
const scenarioA_factory = {
  manufacturer: 'Audi',
  model: 'A4',
  year: 2020,
  trim_level: 'Base',
  expected_features: ['Cloth Seats', 'Halogen Headlights', 'Standard Grille']
}

const scenarioA_photo = {
  detected_features: ['Cloth Seats', 'Halogen Headlights', 'Standard Grille'],
  confidence: 0.9,
  image_quality: 'good',
  view_type: 'mixed'
}

const resultA = compareSpecs(scenarioA_factory, scenarioA_photo)
console.log('Scenario A (Perfect Match):', resultA.risk_level, '-', resultA.summary)

// Scenario B: Minor retrofit (MEDIUM risk)
const scenarioB_factory = {
  manufacturer: 'Mercedes-Benz',
  model: 'C 220',
  year: 2018,
  trim_level: 'Classic',
  expected_features: ['MB-Tex Seats', 'Halogen Headlights', 'Standard Grille']
}

const scenarioB_photo = {
  detected_features: ['Leather Seats', 'LED Headlights', 'Standard Grille'],
  confidence: 0.8,
  image_quality: 'medium',
  view_type: 'interior'
}

const resultB = compareSpecs(scenarioB_factory, scenarioB_photo)
console.log('Scenario B (Minor Retrofit):', resultB.risk_level, '-', resultB.summary)

// Scenario C: Major fraud (HIGH risk)
const scenarioC_factory = {
  manufacturer: 'BMW',
  model: '318d',
  year: 2017,
  trim_level: 'Standard',
  expected_features: ['Cloth Seats', 'Halogen Headlights', 'Standard Bumper', 'Steel Wheels', 'Manual Climate']
}

const scenarioC_photo = {
  detected_features: ['Full Leather', 'Adaptive LED Matrix', 'M-Sport Package', 'M Performance Wheels', 'Dual-zone AC', 'Carbon Trim'],
  confidence: 0.75,
  image_quality: 'good',
  view_type: 'mixed'
}

const resultC = compareSpecs(scenarioC_factory, scenarioC_photo)
console.log('Scenario C (Major Fraud):', resultC.risk_level, '-', resultC.summary)

console.log('')
console.log('✅ All spec-check examples completed!')
console.log('')
console.log('💡 Integration tips:')
console.log('- Use in VehicleCockpit "Inspection" tab')
console.log('- Store results in vehicle_inspections table')
console.log('- Display risk badges in vehicle cards')
console.log('- Alert on HIGH/CRITICAL risk detections')
console.log('- Use health_score for pricing adjustments')
