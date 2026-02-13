import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Star, Loader2, AlertCircle, ImageIcon, Sparkles } from 'lucide-react'
import { uploadImage as uploadToStorage } from '../../../lib/supabase/client'
import { useVehicles } from '../../context/VehiclesContext'
import { useUI } from '../../context/UIContext'
import { applyVirtualStudio, isPhotoroomConfigured } from '../../../lib/api/photoroom'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_TYPES = { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] }

export default function ImageUploader({ vehicleId, images = [] }) {
  const { addImages, deleteImage, setPrimaryImage } = useVehicles()
  const { toast } = useUI()
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [uploadCount, setUploadCount] = useState({ current: 0, total: 0 })
  const [processingStudio, setProcessingStudio] = useState(null) // Track which image is being processed

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return

    setUploading(true)
    setUploadCount({ current: 0, total: acceptedFiles.length })
    setProgress(0)

    try {
      // 1. Upload TOUS les fichiers vers Storage d'abord
      const uploaded = []

      for (let i = 0; i < acceptedFiles.length; i++) {
        const file = acceptedFiles[i]
        setUploadCount({ current: i + 1, total: acceptedFiles.length })
        setProgress(Math.round(((i + 1) / acceptedFiles.length) * 100))

        try {
          const result = await uploadToStorage(file, vehicleId, i)
          if (result) {
            uploaded.push({
              url: result.url,
              path: result.path,
              name: file.name,
            })
          } else {
            console.warn(`[Upload] Échec pour ${file.name} (result null)`)
            toast.error(`Échec upload: ${file.name}`)
          }
        } catch (err) {
          console.error(`[Upload] Erreur fichier ${file.name}:`, err)
          toast.error(`Erreur: ${file.name}`)
        }
      }

      // 2. Un SEUL appel batch pour sauver toutes les images
      if (uploaded.length > 0) {
        await addImages(vehicleId, uploaded)
        toast.success(`${uploaded.length} image${uploaded.length > 1 ? 's' : ''} ajoutée${uploaded.length > 1 ? 's' : ''}`)
      } else {
        toast.error('Aucune image n\'a pu être uploadée. Vérifiez le bucket Storage Supabase.')
      }
    } catch (err) {
      console.error('[onDrop] Erreur globale:', err)
      toast.error('Erreur lors de l\'upload')
    } finally {
      // GARANTI : le spinner s'arrête quoi qu'il arrive
      setUploading(false)
      setProgress(0)
    }
  }, [vehicleId, addImages, toast])

  const handleDeleteImage = async (image) => {
    try {
      await deleteImage(vehicleId, image.path)
      toast.success('Image supprimée')
    } catch (err) {
      console.error('Erreur suppression:', err)
      toast.error('Erreur lors de la suppression')
    }
  }

  const handleSetPrimary = async (image) => {
    try {
      await setPrimaryImage(vehicleId, image.path)
      toast.success('Image principale mise à jour')
    } catch (err) {
      toast.error('Erreur mise à jour')
    }
  }

  const handleStudioMode = async (image) => {
    setProcessingStudio(image.path)

    try {
      // Step 1: Apply Virtual Studio (background removal + watermark)
      const processedBlob = await applyVirtualStudio(image.url)

      // Step 2: Upload to Supabase Storage
      const file = new File([processedBlob], `studio_${image.name || 'image.png'}`, {
        type: processedBlob.type
      })

      const result = await uploadToStorage(file, vehicleId, images.length)

      if (!result) {
        throw new Error('Upload failed')
      }

      // Step 3: Add to vehicle and set as primary
      await addImages(vehicleId, [{
        url: result.url,
        path: result.path,
        name: file.name,
      }])

      // Set the new studio image as primary
      await setPrimaryImage(vehicleId, result.path)

      toast.success('Image studio créée et définie comme principale')
    } catch (err) {
      console.error('[StudioMode] Error:', err)
      toast.error(err.message || 'Erreur lors du traitement studio')
    } finally {
      setProcessingStudio(null)
    }
  }

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxSize: MAX_FILE_SIZE,
    disabled: uploading,
  })

  return (
    <div className="space-y-6">
      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
          ${uploading ? 'pointer-events-none opacity-60' : ''}
          ${isDragActive
            ? 'border-[#C4A484] bg-[#C4A484]/10'
            : 'border-white/20 hover:border-white/40 hover:bg-white/5'
          }
        `}
      >
        <input {...getInputProps()} />

        {uploading ? (
          <div className="space-y-3">
            <Loader2 size={32} className="text-[#C4A484] mx-auto animate-spin" />
            <p className="text-white text-sm">
              Upload {uploadCount.current}/{uploadCount.total}...
            </p>
            <div className="w-full max-w-xs mx-auto bg-white/10 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-[#C4A484] rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-white/40 text-xs">{progress}%</p>
          </div>
        ) : (
          <div className="space-y-2">
            <Upload size={32} className={`mx-auto ${isDragActive ? 'text-[#C4A484]' : 'text-white/30'}`} />
            <p className="text-white/70 text-sm">
              {isDragActive ? 'Déposez les images ici' : 'Glissez vos photos ici'}
            </p>
            <p className="text-white/30 text-xs">
              JPG, PNG, WebP — max 5 Mo par image
            </p>
          </div>
        )}
      </div>

      {/* Rejections */}
      {fileRejections.length > 0 && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
          <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-red-300">
            {fileRejections.map(({ file, errors }) => (
              <p key={file.name}>
                {file.name}: {errors.map(e => e.message).join(', ')}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Gallery Grid */}
      {images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => {
            const isPrimary = index === 0
            return (
              <div
                key={image.path || image.id}
                className={`
                  group relative aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all
                  ${isPrimary
                    ? 'border-[#C4A484] ring-2 ring-[#C4A484]/30'
                    : 'border-white/10 hover:border-white/30'
                  }
                `}
              >
                <img
                  src={image.url}
                  alt={image.name || ''}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />

                {isPrimary && (
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#C4A484] text-white text-[10px] font-semibold uppercase tracking-wider">
                    Principale
                  </div>
                )}

                {/* Studio Mode Processing Overlay */}
                {processingStudio === image.path && (
                  <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-3 z-10">
                    <Loader2 size={32} className="text-[#C4A484] animate-spin" />
                    <div className="text-center">
                      <p className="text-white text-xs font-semibold">Mode Studio</p>
                      <p className="text-white/60 text-[10px] mt-1">Traitement en cours...</p>
                    </div>
                  </div>
                )}

                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  {isPhotoroomConfigured() && (
                    <button
                      onClick={() => handleStudioMode(image)}
                      disabled={processingStudio !== null}
                      className="p-2 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Mode Studio — Fond pro + watermark"
                    >
                      <Sparkles size={18} />
                    </button>
                  )}
                  {!isPrimary && (
                    <button
                      onClick={() => handleSetPrimary(image)}
                      disabled={processingStudio !== null}
                      className="p-2 rounded-lg bg-white/20 hover:bg-[#C4A484] text-white transition-colors disabled:opacity-50"
                      title="Définir comme principale"
                    >
                      <Star size={18} />
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteImage(image)}
                    disabled={processingStudio !== null}
                    className="p-2 rounded-lg bg-white/20 hover:bg-red-500 text-white transition-colors disabled:opacity-50"
                    title="Supprimer"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        !uploading && (
          <div className="text-center py-8">
            <ImageIcon size={40} className="text-white/15 mx-auto mb-3" />
            <p className="text-white/30 text-sm">Aucune photo pour ce véhicule</p>
          </div>
        )
      )}
    </div>
  )
}
