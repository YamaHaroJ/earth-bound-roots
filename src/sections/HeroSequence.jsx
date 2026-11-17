import { useEffect, useRef } from 'react'
import gsap from 'gsap'

// Apple-style 3D: the bowl scene was recorded once into pictures (npm run capture).
// Scrolling through the hero only picks which picture to show, so the page does almost no work.
// The recording also saved where the bowl is in every picture, so clicking it still rings the bowl.
const STRIDES = [32, 16, 8, 4, 2, 1]

export default function HeroSequence({ progress, onStrike, onBowlHover, rippleRef }) {
  const canvas = useRef()
  const ripples = useRef()

  useEffect(() => {
    const el = canvas.current
    const phone = window.matchMedia('(max-width: 820px)').matches
    const base = `${import.meta.env.BASE_URL}frames/${phone ? 'mobile' : 'desktop'}/`
    const ctx = el.getContext('2d', { alpha: false })
    let frames = []
    let man = null
    let shown = -1
    let current = 0
    let dead = false

    const fit = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      el.width = Math.round(el.clientWidth * dpr)
      el.height = Math.round(el.clientHeight * dpr)
      shown = -1
    }
    // where a picture lands on the canvas ("cover" fit)
    const cover = (img) => {
      const s = Math.max(el.width / img.naturalWidth, el.height / img.naturalHeight)
      return { s, x: (el.width - img.naturalWidth * s) / 2, y: (el.height - img.naturalHeight * s) / 2 }
    }
    const nearest = (i) => {
      for (let d = 0; d < man.count; d++) {
        if (frames[i - d]?.ready) return frames[i - d]
        if (frames[i + d]?.ready) return frames[i + d]
      }
      return null
    }
    const draw = () => {
      if (!man) return
      current = Math.min(man.count - 1, Math.max(0, Math.round(progress.current * (man.count - 1))))
      const f = nearest(current)
      if (!f || f.index === shown) return
      shown = f.index
      const c = cover(f.img)
      ctx.drawImage(f.img, c.x, c.y, f.img.naturalWidth * c.s, f.img.naturalHeight * c.s)
    }
    const load = (i) =>
      new Promise((resolve) => {
        const img = new Image()
        img.decoding = 'async'
        img.onload = () => {
          frames[i] = { img, index: i, ready: true }
          resolve()
        }
        img.onerror = resolve
        img.src = `${base}f${String(i).padStart(3, '0')}.webp`
      })

    // the bowl's spot on screen for the picture showing now, in CSS pixels
    const bowlAt = () => {
      if (!man?.bowl) return null
      const [bx, by, br] = man.bowl[current]
      const w = man.width
      const h = man.height
      const dpr = el.width / el.clientWidth
      const s = Math.max(el.width / w, el.height / h)
      const ox = (el.width - w * s) / 2
      const oy = (el.height - h * s) / 2
      return { x: (ox + bx * w * s) / dpr, y: (oy + by * h * s) / dpr, r: (br * w * s) / dpr }
    }
    const hit = (e) => {
      const b = bowlAt()
      if (!b) return null
      const r = el.getBoundingClientRect()
      const x = e.clientX - r.left
      const y = e.clientY - r.top
      // the bowl is wider than it is tall on screen
      return Math.hypot(x - b.x, (y - b.y) * 1.8) < b.r * 1.15 ? b : null
    }
    const ripple = (b) => {
      for (let i = 0; i < 4; i++) {
        const ring = document.createElement('span')
        ring.className = 'ripple'
        ring.style.left = `${b.x}px`
        ring.style.top = `${b.y + b.r * 0.25}px`
        ring.style.width = ring.style.height = `${b.r * 2}px`
        ring.style.animationDelay = `${i * 0.35}s`
        ripples.current.appendChild(ring)
        setTimeout(() => ring.remove(), 4600 + i * 350)
      }
    }
    // the "Ring the bowl" button sends ripples from wherever the bowl is right now
    if (rippleRef) rippleRef.current = () => { const b = bowlAt(); if (b) ripple(b) }
    const onClick = (e) => {
      const b = hit(e)
      if (b) (ripple(b), onStrike?.())
    }
    const onMove = (e) => {
      const over = !!hit(e)
      el.style.cursor = over ? 'pointer' : ''
      onBowlHover?.(over)
    }

    fit()
    window.addEventListener('resize', fit)
    el.addEventListener('click', onClick)
    el.addEventListener('pointermove', onMove)
    gsap.ticker.add(draw)

    fetch(`${base}manifest.json`)
      .then((r) => r.json())
      .then(async (m) => {
        if (dead) return
        man = m
        frames = new Array(m.count)
        await load(0)
        const seen = new Set([0])
        for (const stride of STRIDES) {
          const batch = []
          for (let i = 0; i < m.count; i += stride) if (!seen.has(i)) (seen.add(i), batch.push(i))
          for (let k = 0; k < batch.length; k += 6) {
            if (dead) return
            await Promise.all(batch.slice(k, k + 6).map(load))
            shown = -1
          }
        }
      })
      .catch(() => {})

    return () => {
      dead = true
      window.removeEventListener('resize', fit)
      el.removeEventListener('click', onClick)
      el.removeEventListener('pointermove', onMove)
      gsap.ticker.remove(draw)
    }
  }, [progress, onStrike, onBowlHover, rippleRef])

  return (
    <>
      <canvas ref={canvas} className="hero__canvas" aria-hidden="true" />
      <div ref={ripples} className="ripples" aria-hidden="true" />
    </>
  )
}
