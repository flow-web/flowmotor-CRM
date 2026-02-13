/**
 * PHOTOROOM API INTEGRATION - Virtual Studio
 *
 * Transforms amateur vehicle photos into professional studio-quality images:
 * - Removes messy backgrounds (parking lots, streets, garages)
 * - Replaces with luxury studio background (dark grey concrete wall)
 * - Adds Flow Motor watermark (50% opacity)
 *
 * API Documentation: https://www.photoroom.com/api/docs
 */

// Environment variable for API key (client-side for now, consider Edge Function for production)
const PHOTOROOM_API_KEY = import.meta.env.VITE_PHOTOROOM_API_KEY
const PHOTOROOM_API_URL = 'https://sdk.photoroom.com/v1/segment'

// Configuration for Virtual Studio processing
const STUDIO_CONFIG = {
  backgroundColor: '#2a2a2a', // Dark grey concrete wall
  shadowIntensity: 0.3,
  backgroundBlur: 0,
  watermarkOpacity: 0.5
}

/**
 * Check if Photoroom API is configured
 * @returns {boolean}
 */
export function isPhotoroomConfigured() {
  return Boolean(PHOTOROOM_API_KEY && PHOTOROOM_API_KEY.length > 10)
}

/**
 * Process an image with Photoroom API
 * Removes background and composites onto studio background
 *
 * @param {string} imageUrl - Public URL of the image to process
 * @returns {Promise<Blob>} - Processed image as blob (ready for upload)
 */
export async function processImageWithPhotoroom(imageUrl) {
  if (!isPhotoroomConfigured()) {
    throw new Error('Photoroom API key not configured. Set VITE_PHOTOROOM_API_KEY in .env')
  }

  try {
    // Fetch the original image
    const imageResponse = await fetch(imageUrl)
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.statusText}`)
    }
    const imageBlob = await imageResponse.blob()

    // Prepare FormData for Photoroom API
    const formData = new FormData()
    formData.append('image_file', imageBlob, 'vehicle.jpg')

    // Background removal with shadow (makes the car look grounded on studio floor)
    formData.append('shadow.mode', 'ai.soft') // AI-generated soft shadow
    formData.append('shadow.intensity', String(STUDIO_CONFIG.shadowIntensity))

    // Background replacement
    formData.append('background.color', STUDIO_CONFIG.backgroundColor)

    // Output format
    formData.append('format', 'png') // PNG for transparency support
    formData.append('size', 'preview') // Options: 'preview' | 'medium' | 'full'

    // Call Photoroom API
    const response = await fetch(PHOTOROOM_API_URL, {
      method: 'POST',
      headers: {
        'x-api-key': PHOTOROOM_API_KEY,
        // Note: Don't set Content-Type, let browser set it with boundary for FormData
      },
      body: formData
    })

    if (!response.ok) {
      // Handle specific error codes
      if (response.status === 401) {
        throw new Error('Invalid Photoroom API key')
      }
      if (response.status === 429) {
        throw new Error('Photoroom API rate limit exceeded. Try again later.')
      }
      if (response.status === 402) {
        throw new Error('Photoroom API quota exceeded. Check your subscription.')
      }

      const errorText = await response.text()
      throw new Error(`Photoroom API error (${response.status}): ${errorText}`)
    }

    // Return the processed image as blob
    const processedBlob = await response.blob()

    // Verify we got an image back
    if (!processedBlob.type.startsWith('image/')) {
      throw new Error('Photoroom API did not return an image')
    }

    return processedBlob
  } catch (error) {
    console.error('[Photoroom] Processing failed:', error)

    // Provide user-friendly error messages
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Network error: unable to reach Photoroom API')
    }

    throw error
  }
}

/**
 * Add Flow Motor watermark to an image (client-side canvas implementation)
 * This is a fallback if Photoroom doesn't support custom watermarks
 *
 * @param {Blob} imageBlob - Image to watermark
 * @param {string} text - Watermark text (default: "Flow Motor")
 * @returns {Promise<Blob>} - Watermarked image
 */
export async function addWatermark(imageBlob, text = 'Flow Motor') {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height

      // Draw original image
      ctx.drawImage(img, 0, 0)

      // Configure watermark style
      const fontSize = Math.max(img.width * 0.03, 20) // Responsive font size
      ctx.font = `600 ${fontSize}px Inter, sans-serif`
      ctx.fillStyle = `rgba(196, 164, 132, ${STUDIO_CONFIG.watermarkOpacity})` // Flow Motor brand color
      ctx.textAlign = 'right'
      ctx.textBaseline = 'bottom'

      // Position watermark in bottom-right corner with padding
      const padding = fontSize * 0.8
      ctx.fillText(text, canvas.width - padding, canvas.height - padding)

      // Convert to blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error('Failed to create watermarked image'))
          }
        },
        'image/png',
        0.95 // Quality
      )
    }

    img.onerror = () => {
      reject(new Error('Failed to load image for watermarking'))
    }

    img.src = URL.createObjectURL(imageBlob)
  })
}

/**
 * Full Virtual Studio pipeline:
 * 1. Remove background with Photoroom
 * 2. Add Flow Motor watermark
 *
 * @param {string} imageUrl - Public URL of the image
 * @returns {Promise<Blob>} - Final studio-quality image
 */
export async function applyVirtualStudio(imageUrl) {
  // Step 1: Background removal & studio background
  const processedImage = await processImageWithPhotoroom(imageUrl)

  // Step 2: Add watermark
  const finalImage = await addWatermark(processedImage)

  return finalImage
}

/**
 * Get estimated processing cost per image (for monitoring)
 * Photoroom pricing: ~$0.05-0.10 per image depending on plan
 */
export function getEstimatedCost() {
  return {
    perImage: 0.05, // EUR
    currency: 'EUR'
  }
}
