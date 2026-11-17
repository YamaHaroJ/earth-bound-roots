// Smooth scrolling (Lenis) driven by GSAP's clock.
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const reduced =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// p: 0 at the top of the page, 1 at the bottom
export const scroll = { p: 0, y: 0, max: 1 }

let lenis = null

function read() {
  scroll.max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
  scroll.y = window.scrollY
  scroll.p = Math.min(1, Math.max(0, scroll.y / scroll.max))
}

export function startScroll() {
  let tick = null
  if (!reduced) {
    lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9, touchMultiplier: 1.4 })
    lenis.on('scroll', () => {
      ScrollTrigger.update()
      read()
    })
    tick = (t) => lenis.raf(t * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
  }
  window.addEventListener('scroll', read, { passive: true })
  window.addEventListener('resize', read)
  ScrollTrigger.addEventListener('refresh', read)
  read()
  return () => {
    if (tick) gsap.ticker.remove(tick)
    lenis?.destroy()
    lenis = null
    window.removeEventListener('scroll', read)
    window.removeEventListener('resize', read)
    ScrollTrigger.removeEventListener('refresh', read)
  }
}

export function scrollToTarget(target) {
  if (lenis) lenis.scrollTo(target, { duration: 1.8, easing: (t) => 1 - Math.pow(1 - t, 4) })
  else document.querySelector(target)?.scrollIntoView()
}
