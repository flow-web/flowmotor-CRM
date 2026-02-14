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
// A. ENGINE SOUND ANALYZER
// ===========================

const ENGINE_SOUND_SYSTEM_PROMPT = `Tu es un mécanicien expert avec 30 ans d'expérience dans le diagnostic moteur, spécialisé dans les véhicules premium et de luxe.

Analyse ce son de moteur au ralenti.

INSTRUCTIONS :
1. Identifie le type de moteur probable (Flat-6, V8, V6, 4 cylindres turbo, etc.) basé sur les caractéristiques sonores.
2. Détecte toutes les anomalies sonores :
   - Cliquetis métallique (poussoirs hydrauliques usés, jeu aux soupapes)
   - Cognement sourd (bielle, vilebrequin, problème grave)
   - Sifflement aigu (fuite vacuum, turbo défaillant, injecteurs)
   - Grincement (courroie accessoires, distribution)
   - Ronflement irrégulier (admission, échappement, catalyseur)
3. Classe chaque anomalie par sévérité : "minor" (réparable), "major" (coûteux), "critical" (immobilisant).
4. Attribue une note de santé globale de 1 à 10 (10 = parfait, 1 = catastrophique).
5. Fournis des conseils de maintenance ou réparation spécifiques.

Réponds UNIQUEMENT en JSON strict (sans markdown, sans texte avant/après) au format suivant :

{
  "health_score": 7,
  "engine_type": "4 cylindres turbo",
  "anomalies": [
    {
      "name": "Léger cliquetis métallique",
      "severity": "minor",
      "description": "Possible usure des poussoirs hydrauliques. Contrôler le jeu aux soupapes et la qualité de l'huile."
    }
  ],
  "maintenance_advice": "Vidange urgente recommandée avec huile haute qualité. Contrôle du jeu aux soupapes dans les 500 km.",
  "confidence": "medium"
}

Règles :
- Si l'audio est inaudible ou de mauvaise qualité, indique confidence: "low".
- Si le moteur semble sain, retourne anomalies: [] avec health_score ≥ 8.
- Pour un cognement ou bruit critique, indique severity: "critical" et baisse le health_score.`

export async function analyzeEngineSound(audioBase64, mimeType = 'audio/mp3') {
  const client = getClient()
  if (!client) {
    console.error('[Flow Inspector] Pas de clé API Gemini configurée (VITE_GEMINI_API_KEY)')
    return {
      error: 'Configuration manquante : clé API Gemini non définie.',
    }
  }

  try {
    const model = client.getGenerativeModel({ model: 'gemini-2.0-flash' })

    const result = await model.generateContent([
      { text: ENGINE_SOUND_SYSTEM_PROMPT },
      {
        inlineData: {
          mimeType: mimeType,
          data: audioBase64,
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
    if (typeof parsed.health_score !== 'number' || !Array.isArray(parsed.anomalies)) {
      console.error('[Flow Inspector] Invalid engine sound response structure:', parsed)
      return {
        error: 'Réponse invalide de l\'IA. Réessayez.',
      }
    }

    return {
      healthScore: parsed.health_score,
      engineType: parsed.engine_type || 'Type de moteur inconnu',
      anomalies: parsed.anomalies.map((a) => ({
        name: a.name || 'Anomalie inconnue',
        severity: a.severity || 'minor',
        description: a.description || '',
      })),
      maintenanceAdvice: parsed.maintenance_advice || '',
      confidence: parsed.confidence || 'medium',
    }
  } catch (err) {
    console.error('[Flow Inspector] Erreur analyse son moteur:', err)
    return {
      error: `Erreur lors de l'analyse : ${err.message}`,
    }
  }
}

// ===========================
// B. BODY CONDITION ANALYZER
// ===========================

const BODY_CONDITION_SYSTEM_PROMPT = `Tu es un expert carrossier avec 25 ans d'expérience dans l'évaluation de véhicules d'occasion premium.

Analyse cette photo de véhicule pour identifier tous les défauts de carrosserie et peinture.

INSTRUCTIONS :
1. Détecte les défauts suivants :
   - Bosses, enfoncements (portière, aile, hayon)
   - Rayures (légères, profondes, jusqu'au métal)
   - Rouille (surface, structurelle, perforation)
   - Écarts de panneaux irréguliers (signe d'accident/mauvaise réparation)
   - Peau d'orange, effet "nuage" (mauvaise repeinture)
   - Différences de teinte entre panneaux (repeinture non-professionnelle)
   - Fissures pare-chocs, optiques
   - Usure du vernis (ternissement, micro-rayures)

2. Pour chaque défaut, indique :
   - Nom du défaut
   - Localisation précise (ex: "Aile avant droite", "Portière conducteur")
   - Sévérité : "minor" (esthétique), "major" (nécessite réparation), "critical" (sécurité ou dépréciation forte)
   - Coût estimé de réparation (pièces + main d'œuvre, tarif garage premium)

3. Calcule un coût total de remise en état.

4. Attribue une condition globale : "excellent", "bon", "moyen", "mauvais", "catastrophique".

5. Fournis un conseil d'achat ou de réparation.

Réponds UNIQUEMENT en JSON strict (sans markdown, sans texte avant/après) au format suivant :

{
  "defects": [
    {
      "name": "Rayure profonde",
      "location": "Portière avant droite",
      "severity": "major",
      "estimated_cost": 350,
      "description": "Rayure profonde jusqu'à l'apprêt. Nécessite ponçage, apprêt, peinture et vernis."
    }
  ],
  "total_repair_cost": 850,
  "overall_condition": "moyen",
  "advice": "Carrosserie acceptable pour l'âge du véhicule. Budget à prévoir pour rayures et rouille.",
  "confidence": "high"
}

Règles :
- Si la photo est floue ou de mauvaise qualité, indique confidence: "low".
- Si la carrosserie semble impeccable, retourne defects: [] avec overall_condition: "excellent".
- Pour la rouille structurelle ou perforation, indique severity: "critical".`

export async function analyzeBodyCondition(imageBase64, mimeType = 'image/jpeg') {
  const client = getClient()
  if (!client) {
    console.error('[Flow Inspector] Pas de clé API Gemini configurée (VITE_GEMINI_API_KEY)')
    return {
      error: 'Configuration manquante : clé API Gemini non définie.',
    }
  }

  try {
    const model = client.getGenerativeModel({ model: 'gemini-2.0-flash' })

    const result = await model.generateContent([
      { text: BODY_CONDITION_SYSTEM_PROMPT },
      {
        inlineData: {
          mimeType: mimeType,
          data: imageBase64,
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
    if (!Array.isArray(parsed.defects) || typeof parsed.total_repair_cost !== 'number') {
      console.error('[Flow Inspector] Invalid body condition response structure:', parsed)
      return {
        error: 'Réponse invalide de l\'IA. Réessayez.',
      }
    }

    return {
      defects: parsed.defects.map((d) => ({
        name: d.name || 'Défaut inconnu',
        location: d.location || 'Non spécifié',
        severity: d.severity || 'minor',
        estimatedCost: d.estimated_cost || 0,
        description: d.description || '',
      })),
      totalRepairCost: parsed.total_repair_cost,
      overallCondition: parsed.overall_condition || 'moyen',
      advice: parsed.advice || '',
      confidence: parsed.confidence || 'medium',
    }
  } catch (err) {
    console.error('[Flow Inspector] Erreur analyse carrosserie:', err)
    return {
      error: `Erreur lors de l'analyse : ${err.message}`,
    }
  }
}

// ===========================
// C. SERVICE HISTORY TRANSLATOR
// ===========================

const SERVICE_HISTORY_SYSTEM_PROMPT = `Tu es un traducteur expert spécialisé dans les documents d'entretien automobile internationaux.

Analyse cette image de document d'entretien ou facture de garage (carnet d'entretien, facture, bon de révision).

INSTRUCTIONS :
1. Détecte la langue du document (Allemand, Italien, Anglais, Japonais, Néerlandais, Espagnol, etc.).
2. Effectue l'OCR complet du texte visible.
3. Traduis INTÉGRALEMENT le texte en français.
4. Extrais les données structurées suivantes :
   - Date de l'intervention
   - Kilométrage au moment de l'intervention
   - Type d'opération effectuée (vidange, révision, distribution, etc.)
   - Pièces remplacées (filtre, huile, courroie, etc.)
   - Nom du garage / concessionnaire
5. Identifie les révisions importantes qui pourraient manquer selon le kilométrage :
   - Distribution (tous les 100-120k km ou 5-8 ans)
   - Embrayage (tous les 120-150k km)
   - Freins (plaquettes tous les 40-60k km, disques tous les 80-100k km)
   - Amortisseurs (tous les 80-100k km)

Réponds UNIQUEMENT en JSON strict (sans markdown, sans texte avant/après) au format suivant :

{
  "detected_language": "Allemand",
  "translated_text": "Révision complète effectuée le 15/03/2023 à 87450 km. Remplacement huile moteur 5W30, filtre à huile, filtre à air, filtre d'habitacle. Contrôle freinage, suspension, échappement OK.",
  "entries": [
    {
      "date": "2023-03-15",
      "mileage_km": 87450,
      "operation": "Révision complète",
      "parts": ["Huile moteur 5W30", "Filtre à huile", "Filtre à air", "Filtre habitacle"],
      "garage": "Mercedes-Benz Berlin Zentrum"
    }
  ],
  "missing_services": [
    {
      "service": "Distribution (courroie + pompe à eau)",
      "expected_at_km": 100000,
      "status": "À prévoir sous 13000 km"
    }
  ],
  "confidence": "high"
}

Règles :
- Si l'image est illisible ou floue, indique confidence: "low" et fais de ton mieux.
- Si aucune donnée structurée n'est extractible, retourne entries: [] et missing_services: [].
- Pour les services manquants, base-toi sur les normes constructeur moyennes.`

export async function translateServiceHistory(imageBase64, mimeType = 'image/jpeg') {
  const client = getClient()
  if (!client) {
    console.error('[Flow Inspector] Pas de clé API Gemini configurée (VITE_GEMINI_API_KEY)')
    return {
      error: 'Configuration manquante : clé API Gemini non définie.',
    }
  }

  try {
    const model = client.getGenerativeModel({ model: 'gemini-2.0-flash' })

    const result = await model.generateContent([
      { text: SERVICE_HISTORY_SYSTEM_PROMPT },
      {
        inlineData: {
          mimeType: mimeType,
          data: imageBase64,
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
    if (!Array.isArray(parsed.entries)) {
      console.error('[Flow Inspector] Invalid service history response structure:', parsed)
      return {
        error: 'Réponse invalide de l\'IA. Réessayez.',
      }
    }

    return {
      detectedLanguage: parsed.detected_language || 'Inconnu',
      translatedText: parsed.translated_text || '',
      entries: parsed.entries.map((e) => ({
        date: e.date || null,
        mileageKm: e.mileage_km || 0,
        operation: e.operation || '',
        parts: e.parts || [],
        garage: e.garage || '',
      })),
      missingServices: (parsed.missing_services || []).map((s) => ({
        service: s.service || '',
        expectedAtKm: s.expected_at_km || 0,
        status: s.status || '',
      })),
      confidence: parsed.confidence || 'medium',
    }
  } catch (err) {
    console.error('[Flow Inspector] Erreur traduction historique:', err)
    return {
      error: `Erreur lors de la traduction : ${err.message}`,
    }
  }
}

export function isInspectionConfigured() {
  return !!apiKey
}
