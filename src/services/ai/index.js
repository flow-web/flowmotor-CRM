/**
 * Services IA — Point d'entrée unique.
 * Isole toute la logique Gemini/AI du reste de l'application.
 */
export {
  analyzeVehicleText,
  generateAdDescription,
  analyzeMarketPrice,
  analyzeTechnicalReport,
  isGeminiConfigured,
} from './gemini'

export {
  extractVehicleData,
  extractFromUrl,
  isAutoFillConfigured,
} from './autoFill'

export {
  translateMessage,
  suggestCounterArguments,
  transcribeSpeech,
  detectLanguage,
  isCompanionConfigured,
} from './companion'

export {
  analyzeEngineSound,
  analyzeBodyCondition,
  translateServiceHistory,
  isInspectionConfigured,
} from './inspection'
