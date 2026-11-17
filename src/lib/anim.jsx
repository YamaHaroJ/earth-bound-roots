import { Fragment, useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { reduced } from './scroll'

// Splits a line into words that slide up out of a mask. Wrap a word in *stars* to set it in italic.
export function Words({ text }) {
  return text.split(' ').map((w, i) => {
    const em = w.startsWith('*') && w.endsWith('*')
    const word = em ? w.slice(1, -1) : w
    return (
      <Fragment key={i}>
        <span className="rv">
          <span>{em ? <em>{word}</em> : word}</span>
        </span>{' '}
      </Fragment>
    )
  })
}

// Scroll animations shared by every section:
//   [data-reveal]  words rise in when the element enters
//   [data-fade]    element fades up when it enters
//   [data-speed]   parallax drift while the section passes
export function useSectionMotion(ref, extra) {
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (!reduced) {
        ref.current.querySelectorAll('[data-reveal]').forEach((el) => {
          gsap.from(el.querySelectorAll('.rv > span'), {
            yPercent: 115,
            rotate: 4,
            duration: 1.2,
            ease: 'expo.out',
            stagger: 0.06,
            scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' },
          })
        })
        ref.current.querySelectorAll('[data-fade]').forEach((el) => {
          gsap.from(el, {
            autoAlpha: 0,
            y: 28,
            duration: 1.1,
            ease: 'expo.out',
            scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none reverse' },
          })
        })
        ref.current.querySelectorAll('[data-speed]').forEach((el) => {
          gsap.to(el, {
            yPercent: -parseFloat(el.dataset.speed) * 40,
            ease: 'none',
            scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: true },
          })
        })
      }
      extra?.(ref.current)
    }, ref)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

// A button or link that leans toward the pointer.
export function Magnetic({ as: Tag = 'a', className = 'btn', children, ...rest }) {
  const ref = useRef()
  const move = (e) => {
    if (reduced || e.pointerType !== 'mouse') return
    const r = ref.current.getBoundingClientRect()
    ref.current.style.setProperty('--x', `${(e.clientX - r.left - r.width / 2) * 0.22}px`)
    ref.current.style.setProperty('--y', `${(e.clientY - r.top - r.height / 2) * 0.3}px`)
  }
  const leave = () => {
    ref.current.style.setProperty('--x', '0px')
    ref.current.style.setProperty('--y', '0px')
  }
  return (
    <Tag ref={ref} className={className} onPointerMove={move} onPointerLeave={leave} {...rest}>
      {children}
    </Tag>
  )
}
