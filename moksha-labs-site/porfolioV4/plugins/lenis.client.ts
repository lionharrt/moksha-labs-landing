import Lenis from 'lenis'

export default defineNuxtPlugin(() => {
  if (import.meta.client) {
    // Minimal Lenis config - just for ScrollTrigger sync, not aggressive smoothing
    const lenis = new Lenis({
      duration: 0.8, // Shorter duration for snappier feel
      easing: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t, // Simpler easeInOut
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: false, // Disable smooth wheel for snap system
      wheelMultiplier: 1,
      touchMultiplier: 1.5, // Reduce touch multiplier for more control
      infinite: false,
    })

    const { $gsap, $ScrollTrigger } = useNuxtApp()

    lenis.on('scroll', $ScrollTrigger.update)

    $gsap.ticker.add((time: number) => {
      lenis.raf(time * 1000)
    })

    $gsap.ticker.lagSmoothing(0)

    // Provide global access to stop/start Lenis during animations
    return {
      provide: {
        lenis
      }
    }
  }
})

