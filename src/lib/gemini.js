import { GoogleGenerativeAI } from '@google/generative-ai'

const apiKey = import.meta.env.VITE_GEMINI_API_KEY

let genAI = null
function getClient() {
  if (!genAI && apiKey) {
    genAI = new GoogleGenerativeAI(apiKey)
  }
  return genAI
}

const SYSTEM_PROMPT = `Tu es un assistant spécialisé dans l'extraction de données de véhicules automobiles.
À partir du texte brut copié depuis une annonce (Leboncoin, AutoScout24, Mobile.de, etc.), extrais les informations suivantes au format JSON strict :

{
  "brand": "Marque du véhicule (ex: BMW, Mercedes-Benz, Audi)",
  "model": "Modèle (ex: M3, Classe C, RS6)",
  "trim": "Finition / version (ex: Competition, AMG, Performance)",
  "year": 2024,
  "price": 45000,
  "mileage": 35000,
  "fuel": "Essence | Diesel | Hybride | Électrique | GPL",
  "gearbox": "Automatique | Manuelle",
  "color": "Couleur extérieure",
  "description": "Résumé court de l'annonce (max 200 caractères)",
  "options": ["Option 1", "Option 2"]
}

Règles :
- Retourne UNIQUEMENT le JSON, sans texte avant ou après
- Si une info n'est pas trouvée, mets null pour les strings/numbers et [] pour options
- Le prix doit être un nombre sans symbole de devise
- Le kilométrage doit être un nombre sans "km"
- L'année doit être un nombre à 4 chiffres
- Pour brand, utilise le nom officiel (Mercedes-Benz, pas Mercedes)
- Pour fuel et gearbox, utilise les valeurs exactes listées ci-dessus`

export async function analyzeVehicleText(rawText) {
  const client = getClient()
  if (!client) {
    console.error('[Gemini] Pas de clé API configurée (VITE_GEMINI_API_KEY)')
    return null
  }

  try {
    const model = client.getGenerativeModel({ model: 'gemini-2.0-flash' })

    const result = await model.generateContent([
      { text: SYSTEM_PROMPT },
      { text: `Voici le texte de l'annonce :\n\n${rawText}` },
    ])

    const response = result.response.text()

    // Strip markdown fences if present
    const cleaned = response
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim()

    return JSON.parse(cleaned)
  } catch (err) {
    console.error('[Gemini] Erreur analyse:', err)
    return null
  }
}

const AD_SYSTEM_PROMPT = `Tu es un vendeur automobile de luxe expérimenté chez 'Flow Motor'. Rédige une annonce de vente séduisante, structurée et avec des émojis pour ce véhicule.

Ton : Professionnel, Passionné, Premium.

Structure :
1. Accroche (Catchphrase percutante avec émoji).
2. Points forts (Moteur/Performances/Caractéristiques clés).
3. Liste d'options majeures (belles puces avec émojis).
4. Historique/Entretien (Rassurant, kilométrage, année).
5. Appel à l'action (Contactez Flow Motor).

Règles :
- Ne pas inventer d'options ou caractéristiques qui ne sont pas fournies.
- Si une information est manquante, ne pas la mentionner.
- Le texte doit être prêt à publier sur Leboncoin/La Centrale.
- Écris en français.
- N'utilise PAS de markdown (pas de # ou **), juste du texte brut avec émojis et sauts de ligne.`

export async function generateAdDescription(vehicle) {
  const client = getClient()
  if (!client) {
    throw new Error('Clé API Gemini non configurée (VITE_GEMINI_API_KEY)')
  }

  const fields = [
    vehicle.brand && `Marque : ${vehicle.brand}`,
    vehicle.model && `Modèle : ${vehicle.model}`,
    vehicle.trim && `Finition : ${vehicle.trim}`,
    vehicle.year && `Année : ${vehicle.year}`,
    vehicle.mileage && `Kilométrage : ${vehicle.mileage} km`,
    vehicle.color && `Couleur : ${vehicle.color}`,
    vehicle.sellingPrice && `Prix de vente : ${vehicle.sellingPrice} €`,
    vehicle.fuel && `Carburant : ${vehicle.fuel}`,
    vehicle.gearbox && `Boîte : ${vehicle.gearbox}`,
    vehicle.options?.length > 0 && `Options : ${vehicle.options.join(', ')}`,
  ].filter(Boolean).join('\n')

  try {
    const model = client.getGenerativeModel({ model: 'gemini-2.0-flash' })

    const result = await model.generateContent([
      { text: AD_SYSTEM_PROMPT },
      { text: `Voici les données du véhicule :\n\n${fields}` },
    ])

    return result.response.text().trim()
  } catch (err) {
    console.error('[Gemini] Erreur génération annonce:', err)
    throw new Error('Erreur lors de la génération de l\'annonce')
  }
}

export function isGeminiConfigured() {
  return !!apiKey
}
