import { ref } from 'vue'

// Centralized scroll lock state management
// This prevents conflicts between Hero animation and navigation
const isScrollLocked = ref(false)
const lockReasons = ref<Set<string>>(new Set())

export const useScrollLock = () => {
  const lock = (reason: string = 'default') => {
    if (!import.meta.client) return
    
    // Skip scroll lock on mobile devices - users need navigation access
    if (window.innerWidth < 768) return
    
    lockReasons.value.add(reason)
    
    if (!isScrollLocked.value) {
      isScrollLocked.value = true
      
      // Stop Lenis smooth scrolling
      const { $lenis } = useNuxtApp() as any
      if ($lenis) {
        $lenis.stop()
      }
      
      // Prevent scroll with overflow hidden (no position fixed!)
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
    }
  }

  const unlock = (reason: string = 'default') => {
    if (!import.meta.client) return
    
    lockReasons.value.delete(reason)
    
    // Only unlock if no other reasons exist
    if (lockReasons.value.size === 0 && isScrollLocked.value) {
      isScrollLocked.value = false
      
      // Re-enable Lenis smooth scrolling
      const { $lenis } = useNuxtApp() as any
      if ($lenis) {
        $lenis.start()
      }
      
      // Re-enable scroll
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
  }

  const forceUnlock = () => {
    if (!import.meta.client) return
    
    lockReasons.value.clear()
    isScrollLocked.value = false
    
    // Force re-enable Lenis
    const { $lenis } = useNuxtApp() as any
    if ($lenis) {
      $lenis.start()
    }
    
    // Re-enable scroll
    document.body.style.overflow = ''
    document.documentElement.style.overflow = ''
  }

  const isLocked = () => isScrollLocked.value

  return {
    lock,
    unlock,
    forceUnlock,
    isLocked,
    isScrollLocked: readonly(isScrollLocked)
  }
}

