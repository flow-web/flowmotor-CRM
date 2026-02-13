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

const MARKET_PRICE_SYSTEM_PROMPT = `Tu es un expert du marché automobile français spécialisé dans l'évaluation de véhicules d'occasion.

À partir des informations fournies, estime le prix de revente réaliste sur le marché français.

IMPORTANT: Sois CONSERVATEUR et PESSIMISTE dans tes estimations pour protéger la marge du vendeur.
- Prends en compte le kilométrage, l'âge, et l'état général du marché
- Base-toi sur les prix réels observés sur LeBoncoin, La Centrale, AutoScout24
- Considère la demande pour ce type de véhicule en France

Retourne UNIQUEMENT un objet JSON strict au format suivant (sans markdown, sans texte avant/après):

{
  "low_price": 38000,
  "high_price": 45000,
  "average_price": 41500,
  "liquidity_score": 7,
  "market_notes": "Forte demande pour ce modèle, mais kilométrage élevé pèse sur le prix.",
  "confidence": "medium"
}

Champs:
- low_price: Prix bas du marché (€)
- high_price: Prix haut du marché (€)
- average_price: Prix moyen réaliste (€)
- liquidity_score: Score de liquidité de 1 à 10 (10 = se vend très vite)
- market_notes: 1-2 phrases sur le contexte marché (max 150 caractères)
- confidence: "low" | "medium" | "high" selon la fiabilité de l'estimation`

export async function analyzeMarketPrice(vehicleData) {
  const client = getClient()
  if (!client) {
    console.error('[Gemini] Pas de clé API configurée (VITE_GEMINI_API_KEY)')
    return null
  }

  try {
    const fields = [
      vehicleData.year && `Année: ${vehicleData.year}`,
      vehicleData.brand && `Marque: ${vehicleData.brand}`,
      vehicleData.model && `Modèle: ${vehicleData.model}`,
      vehicleData.trim && `Finition: ${vehicleData.trim}`,
      vehicleData.mileage && `Kilométrage: ${vehicleData.mileage} km`,
      vehicleData.fuel && `Carburant: ${vehicleData.fuel}`,
      vehicleData.transmission && `Transmission: ${vehicleData.transmission}`,
      vehicleData.color && `Couleur: ${vehicleData.color}`,
    ].filter(Boolean).join('\n')

    const model = client.getGenerativeModel({ model: 'gemini-2.0-flash' })

    const result = await model.generateContent([
      { text: MARKET_PRICE_SYSTEM_PROMPT },
      { text: `Voici les données du véhicule :\n\n${fields}` },
    ])

    const response = result.response.text()

    // Strip markdown fences if present
    const cleaned = response
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim()

    const parsed = JSON.parse(cleaned)

    // Validate response structure
    if (!parsed.low_price || !parsed.high_price || !parsed.average_price) {
      console.error('[Gemini] Invalid market price response structure:', parsed)
      return null
    }

    return {
      lowPrice: parsed.low_price,
      highPrice: parsed.high_price,
      averagePrice: parsed.average_price,
      liquidityScore: parsed.liquidity_score || 5,
      marketNotes: parsed.market_notes || '',
      confidence: parsed.confidence || 'medium',
    }
  } catch (err) {
    console.error('[Gemini] Erreur analyse marché:', err)
    return null
  }
}

const CT_REPORT_SYSTEM_PROMPT = `Tu es un mécanicien expert français avec 25 ans d'expérience, spécialisé dans les véhicules premium et de luxe.

Analyse cette image de rapport de Contrôle Technique (CT) français.

INSTRUCTIONS :
1. Extrais TOUS les défauts listés (défaillances majeures ET mineures).
2. Pour chaque défaut, estime le coût moyen de réparation (Pièces + Main d'œuvre) pour un véhicule premium.
3. Sois PESSIMISTE et CONSERVATEUR dans tes estimations — mieux vaut surestimer que sous-estimer.
4. Un défaut majeur ("Défaillance Majeure" / contre-visite) coûte généralement plus cher.
5. Si tu ne peux pas lire clairement l'image, indique-le dans les notes.

Retourne UNIQUEMENT un objet JSON strict (sans markdown, sans texte avant/après) au format suivant :

{
  "defects": [
    {
      "name": "Description courte du défaut",
      "code": "Code CT si visible (ex: 1.1.1)",
      "severity": "major" | "minor",
      "estimated_cost": 250
    }
  ],
  "total_estimated_repair_cost": 850,
  "risk_level": "Low" | "Medium" | "High",
  "vehicle_info": "Infos véhicule si visibles sur le CT (marque, modèle, immatriculation)",
  "ct_date": "Date du CT si visible",
  "ct_result": "Favorable" | "Défavorable" | "Inconnu",
  "notes": "Remarques supplémentaires"
}

Règles pour risk_level :
- "Low" : Aucun défaut majeur, coût total < 500€
- "Medium" : 1-2 défauts majeurs OU coût total entre 500€ et 1500€
- "High" : 3+ défauts majeurs OU coût total > 1500€ OU problèmes structurels/sécurité`

export async function analyzeTechnicalReport(imageFile) {
  const client = getClient()
  if (!client) {
    console.error('[Gemini] Pas de clé API configurée (VITE_GEMINI_API_KEY)')
    return null
  }

  try {
    // Convert file to base64
    const base64 = await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result.split(',')[1])
      reader.onerror = reject
      reader.readAsDataURL(imageFile)
    })

    const model = client.getGenerativeModel({ model: 'gemini-2.0-flash' })

    const result = await model.generateContent([
      { text: CT_REPORT_SYSTEM_PROMPT },
      {
        inlineData: {
          mimeType: imageFile.type || 'image/jpeg',
          data: base64,
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

    // Validate response structure
    if (!Array.isArray(parsed.defects) || typeof parsed.total_estimated_repair_cost !== 'number') {
      console.error('[Gemini] Invalid CT report response structure:', parsed)
      return null
    }

    return {
      defects: parsed.defects.map((d) => ({
        name: d.name || 'Défaut inconnu',
        code: d.code || null,
        severity: d.severity === 'major' ? 'major' : 'minor',
        estimatedCost: d.estimated_cost || 0,
      })),
      totalEstimatedRepairCost: parsed.total_estimated_repair_cost,
      riskLevel: parsed.risk_level || 'Medium',
      vehicleInfo: parsed.vehicle_info || null,
      ctDate: parsed.ct_date || null,
      ctResult: parsed.ct_result || 'Inconnu',
      notes: parsed.notes || null,
    }
  } catch (err) {
    console.error('[Gemini] Erreur analyse CT:', err)
    return null
  }
}

export function isGeminiConfigured() {
  return !!apiKey
}
