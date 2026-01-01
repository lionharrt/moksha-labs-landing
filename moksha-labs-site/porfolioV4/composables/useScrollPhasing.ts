import { ref, onMounted, onUnmounted, nextTick } from 'vue'

export interface ScrollPoint {
  id: string
  y: number | (() => number)
  onEnter?: () => void
  onLeave?: () => void
}

// Global shared state for the phasing system
const isAnimating = ref(false)
const currentPointIndex = ref(0)
const scrollPoints = ref<ScrollPoint[]>([])
const lastScrollY = ref(0)
const scrollVelocity = ref(0)
const isHeroAnimationPlaying = ref(false)

export const useScrollPhasing = () => {
  const { gsap, ScrollTrigger } = useGsap()

  const registerPoint = (point: ScrollPoint) => {
    // Avoid duplicates
    if (scrollPoints.value.find(p => p.id === point.id)) return
    scrollPoints.value.push(point)
    
    // Defer sorting to ensure we have all values
    setTimeout(() => {
      scrollPoints.value.sort((a, b) => {
        const ya = typeof a.y === 'function' ? a.y() : a.y
        const yb = typeof b.y === 'function' ? b.y() : b.y
        return ya - yb
      })
    }, 100)
  }

  const navigate = (direction: 1 | -1, forceSnap = false) => {
    if (isAnimating.value || isHeroAnimationPlaying.value) return

    const scrollY = window.scrollY
    const currentIdx = currentPointIndex.value
    let targetIndex = -1

    if (direction === 1) {
      // Go to the NEXT point in the array (don't skip)
      targetIndex = currentIdx + 1
      if (targetIndex >= scrollPoints.value.length) {
        targetIndex = -1 // At the end, nowhere to go
      }
    } else {
      // Go to the PREVIOUS point in the array (don't skip)
      targetIndex = currentIdx - 1
      if (targetIndex < 0) {
        targetIndex = -1 // At the start, nowhere to go
      }
    }

    if (targetIndex === -1) return

    isAnimating.value = true
    
    // Call onLeave for current point
    const currentPoint = scrollPoints.value[currentIdx]
    if (currentPoint?.onLeave) currentPoint.onLeave()
    
    currentPointIndex.value = targetIndex
    const point = scrollPoints.value[targetIndex]
    const targetY = typeof point.y === 'function' ? point.y() : point.y

    console.log('[Navigate]', direction > 0 ? 'DOWN' : 'UP', 'from', currentPoint?.id, 'to', point?.id, 'targetY:', targetY)

    // Trigger onEnter for smooth transitions
    if (point.onEnter) point.onEnter()

    // Stop Lenis during snap animation to prevent conflicts
    const { $lenis } = useNuxtApp()
    if ($lenis) $lenis.stop()

    gsap.to(window, {
      scrollTo: { y: targetY, autoKill: false },
      duration: 0.8,
      ease: 'power2.inOut',
      onComplete: () => {
        // Re-enable Lenis and clear animation flag
        if ($lenis) $lenis.start()
        setTimeout(() => {
          isAnimating.value = false
        }, 50)
      }
    })
  }

  const syncIndex = () => {
    if (isAnimating.value) return
    const scrollY = window.scrollY
    let closestIndex = 0
    let minDiff = Infinity

    scrollPoints.value.forEach((p, i) => {
      const py = typeof p.y === 'function' ? p.y() : p.y
      const diff = Math.abs(scrollY - py)
      if (diff < minDiff) {
        minDiff = diff
        closestIndex = i
      }
    })
    
    // Fire onEnter when crossing into new section naturally
    if (currentPointIndex.value !== closestIndex) {
      const newPoint = scrollPoints.value[closestIndex]
      const oldPoint = scrollPoints.value[currentPointIndex.value]
      if (oldPoint?.onLeave) oldPoint.onLeave()
      if (newPoint?.onEnter) newPoint.onEnter()
      currentPointIndex.value = closestIndex
    }
  }

  // Calculate scroll velocity for intent detection
  const updateVelocity = () => {
    const currentScrollY = window.scrollY
    scrollVelocity.value = currentScrollY - lastScrollY.value
    lastScrollY.value = currentScrollY
  }

  return {
    isAnimating,
    currentPointIndex,
    scrollPoints,
    scrollVelocity,
    isHeroAnimationPlaying,
    registerPoint,
    navigate,
    syncIndex,
    updateVelocity
  }
}

