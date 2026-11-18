import { useRef } from 'react'
import { Words, useSectionMotion } from '../lib/anim'
import { ORG, PRACTICES, COME_AS_YOU_ARE } from '../lib/content'

export function Intro() {
  const ref = useRef()
  useSectionMotion(ref)
  return (
    <section ref={ref} className="section section--light" id="about">
      <div className="wrap intro">
        <div>
          <h2 className="display" data-reveal>
            <Words text="Whatever you carry, you don't carry it *alone.*" />
          </h2>
        </div>
        <div style={{ display: 'grid', gap: 'var(--s-3)' }}>
          <p className="lede" data-fade>
            {ORG.name} holds small, gentle circles, each with its own theme, where you can bring what you carry and set it down for a while.
          </p>
          <p className="body" data-fade>
            There is nothing to perform and nothing to explain. We move a little, breathe together, rest in reiki and let
            sound do some of the holding. You are welcome exactly as you are.
          </p>
        </div>
      </div>
    </section>
  )
}

export function Practices() {
  const ref = useRef()
  useSectionMotion(ref)
  return (
    <section ref={ref} className="section section--light" id="practices" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <h2 className="display" data-reveal>
          <Words text="What a gathering *holds*" />
        </h2>
        <p className="lede" data-fade style={{ marginTop: 'var(--s-3)' }}>
          <strong style={{ fontWeight: 600 }}>Come as you are.</strong> {COME_AS_YOU_ARE}
        </p>
        <ol className="practices">
          {PRACTICES.map((p, i) => (
            <li className="practice" key={p.name} data-fade>
              <span className="practice__num">0{i + 1}</span>
              <h3>{p.name}</h3>
              <p>{p.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export function Donate() {
  const ref = useRef()
  useSectionMotion(ref)
  return (
    <section ref={ref} className="section donate-page" id="donate">
      <div className="wrap donate">
        <h1 className="display" data-reveal>
          <Words text="Donation based. *Give* what you can." />
        </h1>
        <p className="body" data-fade>
          No one is turned away. Donations help keep these circles open. Scan the code with your phone's camera, or tap the
          button on your phone.
        </p>
        <div className="venmo" data-fade>
          <img src={`${import.meta.env.BASE_URL}images/venmo-qr-centered.png`} alt="Venmo QR code for Tavia Valdez" width="200" height="200" />
          <a className="btn btn--solid" href={ORG.venmo} target="_blank" rel="noreferrer">
            Donate with Venmo ↗
          </a>
        </div>
      </div>
    </section>
  )
}
