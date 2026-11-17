import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { Words } from '../lib/anim'
import { reduced, scrollToTarget } from '../lib/scroll'
import { strikeBowl } from '../lib/bowlSound'
import { ORG } from '../lib/content'

import HeroSequence from './HeroSequence'

// Pinned opening: the camera drifts down from the candles to the singing bowl as you scroll.
// Click the bowl to hear it and see the sound ripple out.
export default function Hero() {
  const ref = useRef()
  const progress = useRef(0)
  const [struck, setStruck] = useState(false)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (!reduced) {
        gsap.from('.hero__title .rv > span', { yPercent: 115, duration: 1.6, ease: 'expo.out', stagger: 0.08, delay: 0.3 })
        gsap.from('.hero [data-in]', { autoAlpha: 0, y: 18, duration: 1.4, ease: 'expo.out', stagger: 0.12, delay: 0.7 })
        gsap
          .timeline({
            scrollTrigger: {
              trigger: ref.current,
              start: 'top top',
              end: '+=120%',
              pin: true,
              scrub: 0.8,
              onUpdate: (self) => (progress.current = self.progress),
            },
          })
          .to('.hero__copy', { autoAlpha: 0, y: -40, duration: 0.5 }, 0)
          .to('.hero__later', { autoAlpha: 1, y: 0, duration: 0.4 }, 0.45)
          .to({}, { duration: 0.2 })
      }
    }, ref)
    return () => ctx.revert()
  }, [])

  const onStrike = useCallback(() => {
    strikeBowl()
    setStruck(true)
  }, [])

  return (
    <section ref={ref} className="hero" aria-label="Welcome">
      <div className="hero__scene">
        <div className="hero__fallback" />
        <HeroSequence progress={progress} onStrike={onStrike} />
      </div>
      <p className="bowl-hint" style={{ opacity: struck ? 0 : 1 }} data-in>
        Click the bowl to let it ring
      </p>
      <div className="hero__copy">
        <h1 className="display hero__title">
          <Words text="A gentle place for *grief* to land." />
        </h1>
        <p className="lede" data-in>
          {ORG.tagline} Gatherings held in compassion and witnessed in community, in {ORG.city}.
        </p>
        <div className="hero__actions" data-in>
          <a className="btn btn--solid" href="#gatherings" onClick={(e) => (e.preventDefault(), scrollToTarget('#gatherings'))}>
            See upcoming gatherings
          </a>
          <a className="btn" href="#rsvp" onClick={(e) => (e.preventDefault(), scrollToTarget('#rsvp'))}>
            RSVP
          </a>
        </div>
      </div>
      <p className="hero__later" aria-hidden="true">
        Come as you are. Bring what you carry.
      </p>
    </section>
  )
}
