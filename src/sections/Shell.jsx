import { useEffect } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { startScroll } from '../lib/scroll'
import { Nav, Footer } from './Chrome'

// Shared page frame: smooth scroll, nav, footer.
export default function Shell({ page, children }) {
  useEffect(() => {
    const stop = startScroll()
    ScrollTrigger.refresh()
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
    // arriving from the other page with a #section: go there once the layout is ready
    if (window.location.hash) setTimeout(() => document.querySelector(window.location.hash)?.scrollIntoView(), 300)
    return stop
  }, [])
  return (
    <>
      <Nav page={page} />
      <main id="main">{children}</main>
      <Footer />
    </>
  )
}
