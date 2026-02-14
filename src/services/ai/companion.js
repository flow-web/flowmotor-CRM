/**
 * Flow Companion — Real AI Functions (Gemini-powered)
 * Translation, negotiation strategy, and language detection for vehicle sourcing.
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

const LANG_NAMES = {
  de: 'allemand',
  it: 'italien',
  nl: 'neerlandais',
  en: 'anglais',
  fr: 'francais',
}

/**
 * Detect language from text (keyword-based, fast, no API call)
 */
export function detectLanguage(text) {
  if (!text || text.trim().length < 5) return null
  const lower = text.toLowerCase()

  const deWords = ["fahrzeug", "preis", "kaufen", "noch", "verfugbar", "bitte", "sehr", "danke", "haben", "gerne", "mfg", "gruss", "zzgl", "mwst", "zustand", "unfall", "beschreibung", "kann", "sind", "wurde", "dieser", "einen"]
  const itWords = ["veicolo", "prezzo", "disponibile", "grazie", "possiamo", "inviar", "foto", "buongiorno", "saluti", "cordiali", "anche", "questo", "sono", "della", "macchina", "chilometri"]
  const nlWords = ["voertuig", "prijs", "beschikbaar", "bedankt", "kunnen", "foto", "groeten", "hartelijk", "goed", "deze", "hebben", "wordt", "voor", "onze"]
  const enWords = ["vehicle", "price", "available", "thank", "regards", "cheers", "please", "could", "would", "shipping", "mileage", "condition"]

  const scores = {
    de: deWords.filter(w => lower.includes(w)).length,
    it: itWords.filter(w => lower.includes(w)).length,
    nl: nlWords.filter(w => lower.includes(w)).length,
    en: enWords.filter(w => lower.includes(w)).length,
  }

  const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0]
  if (best[1] === 0) return "de"
  return best[0]
}

/**
 * Translate a seller message to French using Gemini
 */
export async function translateMessage(text, fromLang = "de") {
  const client = getClient()
  if (!client) {
    console.error('[Companion] Pas de cle API Gemini configuree')
    return {
      translatedText: '[Erreur] Cle API Gemini non configuree (VITE_GEMINI_API_KEY)',
      detectedLang: fromLang,
    }
  }

  const langName = LANG_NAMES[fromLang] || fromLang

  try {
    const model = client.getGenerativeModel({ model: 'gemini-2.0-flash' })

    const prompt = `Tu es un traducteur professionnel specialise dans le commerce automobile international.

Traduis le message suivant du ${langName} vers le francais.

REGLES :
- Conserve le sens exact, y compris les termes techniques automobiles
- Si des prix, references ou numeros sont mentionnes, garde-les tels quels
- Traduis de maniere naturelle, pas mot a mot
- Retourne UNIQUEMENT la traduction, sans commentaire ni explication

Message a traduire :
${text}`

    const result = await model.generateContent(prompt)
    const translatedText = result.response.text().trim()

    return {
      translatedText,
      detectedLang: fromLang,
    }
  } catch (err) {
    console.error('[Companion] Erreur traduction:', err)
    return {
      translatedText: `[Erreur de traduction] ${err.message}`,
      detectedLang: fromLang,
    }
  }
}

/**
 * Suggest counter-arguments / negotiation strategies using Gemini
 */
export async function suggestCounterArguments(sellerMessage, context = {}) {
  const client = getClient()
  if (!client) {
    console.error('[Companion] Pas de cle API Gemini configuree')
    return []
  }

  const lang = context.language || "de"
  const langName = LANG_NAMES[lang] || lang

  try {
    const model = client.getGenerativeModel({ model: 'gemini-2.0-flash' })

    const prompt = `Tu es un expert en negociation automobile pour un concessionnaire francais qui achete des vehicules a l'etranger.

Analyse ce message du vendeur (en ${langName}) et propose 3 strategies de reponse.

Message du vendeur :
"${sellerMessage}"

Pour chaque strategie, retourne un objet JSON avec :
- "label" : Titre court de la strategie (en francais, 3-5 mots)
- "description" : Explication de l'approche (en francais, 1 phrase)
- "message" : Le message de reponse a envoyer AU VENDEUR, redige en ${langName} (pas en francais)

Le message de reponse doit :
- Etre professionnel et respectueux
- Mentionner Flow Motor comme acheteur professionnel
- Utiliser [PRICE] comme placeholder pour le prix propose
- Etre pret a copier-coller directement

Retourne UNIQUEMENT un tableau JSON strict de 3 objets, sans markdown ni texte avant/apres.
Exemple de format : [{"label":"...","description":"...","message":"..."},...]`

    const result = await model.generateContent(prompt)
    const response = result.response.text()

    const cleaned = response
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim()

    const parsed = JSON.parse(cleaned)

    if (!Array.isArray(parsed)) {
      console.error('[Companion] Response is not an array:', parsed)
      return []
    }

    return parsed.map(s => ({
      label: s.label || 'Strategie',
      description: s.description || '',
      message: s.message || '',
    }))
  } catch (err) {
    console.error('[Companion] Erreur strategies:', err)
    return []
  }
}

/**
 * Transcribe speech from audio blob using Gemini
 * NOTE: Gemini 2.0 Flash supports audio input natively.
 */
export async function transcribeSpeech(audioBlob) {
  const client = getClient()
  if (!client) {
    console.error('[Companion] Pas de cle API Gemini configuree')
    return []
  }

  try {
    // Convert audio blob to base64
    const base64 = await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result.split(',')[1])
      reader.onerror = reject
      reader.readAsDataURL(audioBlob)
    })

    const model = client.getGenerativeModel({ model: 'gemini-2.0-flash' })

    const result = await model.generateContent([
      {
        text: `Tu es un assistant de transcription pour un concessionnaire automobile francais qui achete des vehicules a l'etranger.

Transcris cet enregistrement audio et traduis chaque phrase en francais.

Retourne UNIQUEMENT un tableau JSON strict au format suivant (sans markdown) :
[
  {
    "timestamp": "00:02",
    "original": "Phrase originale dans la langue du locuteur",
    "translation": "Traduction en francais"
  }
]

Si l'audio est inaudible ou vide, retourne un tableau vide [].
Detecte automatiquement la langue parlee.`,
      },
      {
        inlineData: {
          mimeType: audioBlob.type || 'audio/webm',
          data: base64,
        },
      },
    ])

    const response = result.response.text()
    const cleaned = response
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim()

    const parsed = JSON.parse(cleaned)
    return Array.isArray(parsed) ? parsed : []
  } catch (err) {
    console.error('[Companion] Erreur transcription:', err)
    return []
  }
}

export function isCompanionConfigured() {
  return !!apiKey
}
