import { useCallback, useLayoutEffect, useRef } from 'react'
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
  const ripple = useRef(null)

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

  const onStrike = useCallback(() => strikeBowl(), [])
  const ringButton = () => {
    strikeBowl()
    ripple.current?.()
  }

  return (
    <section ref={ref} className="hero" aria-label="Welcome">
      <div className="hero__scene">
        <div className="hero__fallback" />
        <HeroSequence progress={progress} onStrike={onStrike} rippleRef={ripple} />
      </div>
      <button type="button" className="bowl-hint" onClick={ringButton} data-in>
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <path d="M3 9h14c0 4-3 7-7 7s-7-3-7-7z" fill="currentColor" />
          <path d="M14.5 4.5c1 .8 1.6 1.9 1.6 3M16.8 2.5c1.6 1.3 2.5 3 2.5 5" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        </svg>
        Ring the bowl
      </button>
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
