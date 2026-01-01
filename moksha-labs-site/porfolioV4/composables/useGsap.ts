import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Observer } from 'gsap/Observer'

export const useGsap = () => {
  const { $gsap, $ScrollTrigger, $Observer } = useNuxtApp()
  
  // Helper to create a context that automatically reverts on unmount
  const gsapContext = (fn: (context: gsap.Context) => void, scope?: Ref<HTMLElement | null> | HTMLElement) => {
    let ctx: gsap.Context
    
    onMounted(() => {
      ctx = gsap.context(fn, scope)
    })
    
    onUnmounted(() => {
      if (ctx) ctx.revert()
    })
    
    return ctx!
  }

  return {
    gsap: $gsap as typeof gsap,
    ScrollTrigger: $ScrollTrigger as typeof ScrollTrigger,
    Observer: $Observer as typeof Observer,
    gsapContext
  }
}

