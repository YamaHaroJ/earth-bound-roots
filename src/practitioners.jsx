import { StrictMode, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import 'lenis/dist/lenis.css'
import './styles.css'
import Shell from './sections/Shell'
import { Words, useSectionMotion } from './lib/anim'
import { ORG, PRACTITIONERS } from './lib/content'

function Practitioners() {
  const ref = useRef()
  useSectionMotion(ref)
  return (
    <section ref={ref} className="section">
      <div className="wrap page-head">
        <h1 className="display" data-reveal>
          <Words text="Meet your *practitioners*" />
        </h1>
        <p className="lede" data-fade>
          The people who hold the space at every {ORG.name} gathering.
        </p>
      </div>
      <div className="wrap people" style={{ marginTop: 'var(--s-5)' }}>
        {PRACTITIONERS.map((p) => (
          <article className="person" key={p.id} id={p.id} data-fade>
            <div className="person__portrait" role="img" aria-label={`Portrait of ${p.name} (photo coming soon)`}>
              <span className="person__initials" aria-hidden="true">
                {p.initials}
              </span>
              <span className="person__photo-note" aria-hidden="true">
                Photo coming soon
              </span>
            </div>
            <h2>{p.name}</h2>
            <ul className="roles" aria-label="Roles">
              {p.roles.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
            <p className="body">{p.bio}</p>
            {p.contact && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--s-2)' }}>
                <a className="btn btn--small" href={ORG.phoneHref}>
                  Text Tavia
                </a>
                <a className="btn btn--small" href={`mailto:${ORG.email}`}>
                  Email Tavia
                </a>
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Shell page="practitioners">
      <Practitioners />
    </Shell>
  </StrictMode>,
)
