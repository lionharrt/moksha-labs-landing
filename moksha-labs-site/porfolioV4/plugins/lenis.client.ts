import Lenis from 'lenis'

export default defineNuxtPlugin(() => {
  if (import.meta.client) {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    })

    const { $gsap, $ScrollTrigger } = useNuxtApp()

    lenis.on('scroll', $ScrollTrigger.update)

    $gsap.ticker.add((time: number) => {
      lenis.raf(time * 1000)
    })

    $gsap.ticker.lagSmoothing(0)

    return {
      provide: {
        lenis
      }
    }
  }
})

