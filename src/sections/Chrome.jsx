import { useEffect, useState } from 'react'
import { ORG } from '../lib/content'

// the site lives at /earth-bound-roots/ on GitHub Pages, so every link starts from the base path
const BASE = import.meta.env.BASE_URL

export function Logo() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="16" r="15" fill="none" stroke="currentColor" strokeOpacity="0.35" />
      <path d="M16 6.5c-3 4-3 8 0 11.5 3-3.5 3-7.5 0-11.5z" fill="#e9b46a" />
      <path d="M8.5 20.5c2.5 4.2 12.5 4.2 15 0" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M16 18v7M16 22l-3 3M16 22l3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
    </svg>
  )
}

const LINKS = [
  [`${BASE}calendar.html`, 'Find your circle', 'calendar'],
  [`${BASE}#practices`, 'What to expect', 'home'],
  [`${BASE}practitioners.html`, 'Meet your practitioners', 'practitioners'],
  [`${BASE}donate.html`, 'Donate', 'donate'],
]

export function Nav({ page }) {
  const [solid, setSolid] = useState(false)
  const [menu, setMenu] = useState(false)
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 40)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  return (
    <header className={`nav${solid ? ' is-solid' : ''}`}>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <a className="brand" href={BASE} aria-label={`${ORG.name}, home`}>
        <Logo />
        {ORG.name}
      </a>
      <button
        type="button"
        className="nav__toggle"
        aria-expanded={menu}
        aria-controls="main-menu"
        aria-label={menu ? 'Close menu' : 'Open menu'}
        onClick={() => setMenu((m) => !m)}
      >
        {/* three lines that turn into an X when open */}
        <span className="burger" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </button>
      <nav aria-label="Main" id="main-menu" className={menu ? 'is-open' : ''}>
        <ul className="nav__links" onClick={() => setMenu(false)}>
          {LINKS.map(([href, label, p]) => (
            <li key={href}>
              <a href={href} aria-current={p === page && p !== 'home' ? 'page' : undefined}>
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <a className="btn btn--small nav__rsvp" href={`${BASE}calendar.html`}>
        Save a spot
      </a>
    </header>
  )
}

export function Footer() {
  return (
    <footer className="footer">
      <span>
        {ORG.name} · {ORG.city}
      </span>
      <span>
        <a href={ORG.phoneHref}>Text {ORG.phone}</a> · <a href={`mailto:${ORG.email}`}>{ORG.email}</a>
      </span>
      <span className="footer__privacy">
        Privacy: this site uses no cookies, no tracking and no analytics. RSVPs go from your own phone or email straight to Tavia.
      </span>
    </footer>
  )
}
