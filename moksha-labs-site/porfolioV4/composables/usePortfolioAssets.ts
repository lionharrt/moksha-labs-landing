import { ref, watch } from 'vue'

// Shared state for global access
const videoUrls = ref<Record<string, { mp4: string, webm: string }>>({})
const posterUrls = ref<Record<string, string>>({})
const isLoading = ref(true)
const isTriggered = ref(false)

export const usePortfolioAssets = () => {
  const { getAssetUrl } = useFirebase()

  const projects = ['emteknik', 'gokbey', 'illhanlar']

  const preloadAssets = async () => {
    if (isTriggered.value) return
    isTriggered.value = true
    
    try {
      const loadPromises = projects.map(async (name) => {
        // 1. Resolve Firebase URLs
        const [mp4, webm] = await Promise.all([
          getAssetUrl(`portfolio/${name}.mp4`),
          getAssetUrl(`portfolio/${name}.webm`)
        ])

        if (mp4 && webm) {
          videoUrls.value[name] = { mp4, webm }
        }

        // 2. Resolve Poster URL (Stored in public folder, but could be Firebase)
        // For simplicity now, we assume posters are in /portfolio-posters/name.jpg
        posterUrls.value[name] = `/portfolio-posters/${name}.jpg`

        // 3. Pre-buffer ONLY the first frame by loading the video element
        // Industry standard: don't preload the whole video, just metadata + first frame
        return new Promise((resolve) => {
          const video = document.createElement('video')
          video.preload = 'metadata'
          video.src = mp4 || ''
          video.onloadedmetadata = () => resolve(true)
          video.onerror = () => resolve(false)
          setTimeout(() => resolve(false), 5000)
        })
      })

      await Promise.all(loadPromises)
    } catch (error) {
      console.error('❌ Error preparing assets:', error)
    } finally {
      isLoading.value = false
    }
  }

  const initLazyLoad = () => {
    if (typeof window === 'undefined') return
    const trigger = () => {
      preloadAssets()
      window.removeEventListener('scroll', trigger)
      window.removeEventListener('mousemove', trigger)
    }
    window.addEventListener('scroll', trigger, { passive: true })
    window.addEventListener('mousemove', trigger, { passive: true })
  }

  return {
    videoUrls,
    posterUrls,
    isLoading,
    initLazyLoad,
    preloadAssets
  }
}
