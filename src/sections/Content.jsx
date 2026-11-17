import { useRef, useState } from 'react'
import { Words, useSectionMotion } from '../lib/anim'
import { ORG, PRACTICES, PRACTITIONERS, upcoming, GATHERINGS } from '../lib/content'

export function Intro() {
  const ref = useRef()
  useSectionMotion(ref)
  return (
    <section ref={ref} className="section section--light" id="about">
      <div className="wrap intro">
        <div>
          <h2 className="display" data-reveal>
            <Words text="Grief is not something to fix. It is something to *honor.*" />
          </h2>
        </div>
        <div style={{ display: 'grid', gap: 'var(--s-3)' }}>
          <p className="lede" data-fade>
            {ORG.name} creates small, gentle gatherings where you can bring what you carry and set it down for a while.
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

function EventCard({ g }) {
  return (
    <article className="event" data-fade aria-labelledby={`ev-${g.id}`}>
      <div className="event__when">
        <h3 className="event__title" id={`ev-${g.id}`}>
          {g.title}
        </h3>
        <span className="event__date">{g.dateLabel}</span>
        <span className="event__time">{g.timeLabel}</span>
      </div>
      <p className="body" style={{ color: 'var(--linen-2)' }}>
        {g.summary}
      </p>
      <ul className="chips" aria-label="Practices">
        {g.practices.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
      <dl className="event__meta">
        <div>
          <dt>Where</dt>
          <dd>
            {g.place}
            <br />
            {g.town}
            <br />
            <a href={g.mapHref} target="_blank" rel="noreferrer">
              Open in Maps ↗
            </a>
          </dd>
        </div>
        <div>
          <dt>Please bring</dt>
          <dd>
            <ul>
              {g.bring.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </dd>
        </div>
        <div>
          <dt>Cost</dt>
          <dd>{g.price}</dd>
        </div>
      </dl>
      <p className="note">{g.note}</p>
      <div className="event__actions">
        <a className="btn btn--solid" href="#rsvp">
          RSVP for {g.dateLabel.split(', ')[1] || g.dateLabel}
        </a>
      </div>
    </article>
  )
}

export function Gatherings() {
  const ref = useRef()
  useSectionMotion(ref)
  const list = upcoming()
  return (
    <section ref={ref} className="section" id="gatherings">
      <div className="wrap gatherings__grid">
        <div style={{ display: 'grid', gap: 'var(--s-3)', position: 'sticky', top: '7rem' }}>
          <h2 className="display" data-reveal>
            <Words text="Upcoming *gatherings*" />
          </h2>
          <p className="body" data-fade>
            Gatherings are small so everyone has room. New dates are added here as they are planned.
          </p>
        </div>
        <div style={{ display: 'grid', gap: 'var(--s-4)' }}>
          {list.length ? (
            list.map((g) => <EventCard g={g} key={g.id} />)
          ) : (
            <p className="lede">The next gathering is being planned. Text or email Tavia to hear when it opens.</p>
          )}
        </div>
      </div>
    </section>
  )
}

// RSVP: text or email Tavia directly, or fill in the form, which writes the message for you.
// Nothing is stored or sent by this site; the visitor's own text or email app sends it.
export function Rsvp() {
  const ref = useRef()
  useSectionMotion(ref)
  const list = upcoming()
  const [error, setError] = useState('')

  const compose = (form) => {
    const d = new FormData(form)
    const name = String(d.get('name') || '').trim()
    if (!name) return setError('Please add your name so Tavia knows who is coming.')
    setError('')
    const g = GATHERINGS.find((x) => x.id === d.get('gathering'))
    const lines = [
      `Hi Tavia, I'd like to RSVP${g ? ` for the ${g.title} on ${g.dateLabel} at ${g.timeLabel}` : ''}.`,
      `Name: ${name}`,
      `People coming: ${d.get('people')}`,
      d.get('note') ? `Note: ${String(d.get('note')).trim()}` : '',
    ].filter(Boolean)
    const body = encodeURIComponent(lines.join('\n'))
    if (d.get('how') === 'text') window.location.href = `sms:+18016750634?&body=${body}`
    else window.location.href = `mailto:${ORG.email}?subject=${encodeURIComponent('RSVP — ' + (g ? g.title : ORG.name))}&body=${body}`
  }

  return (
    <section ref={ref} className="section section--light" id="rsvp">
      <div className="wrap rsvp__grid">
        <div>
          <h2 className="display" data-reveal>
            <Words text="Save your *place*" />
          </h2>
          <p className="body" data-fade style={{ marginTop: 'var(--s-3)' }}>
            Space is limited. Reach Tavia whichever way feels easiest.
          </p>
          <div className="reach" data-fade>
            <a href={ORG.phoneHref}>
              <span>
                <small>Text</small>
                <strong>{ORG.phone}</strong>
              </span>
              <span aria-hidden="true">→</span>
            </a>
            <a href={`mailto:${ORG.email}`}>
              <span>
                <small>Email</small>
                <strong>{ORG.email}</strong>
              </span>
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        <form
          className="form"
          data-fade
          noValidate
          onSubmit={(e) => {
            e.preventDefault()
            compose(e.currentTarget)
          }}
        >
          <h3>Or fill this in</h3>
          <div className="field">
            <label htmlFor="r-name">Your name</label>
            <input id="r-name" name="name" autoComplete="name" required />
          </div>
          <div className="form__row">
            <div className="field">
              <label htmlFor="r-gathering">Gathering</label>
              <select id="r-gathering" name="gathering" defaultValue={list[0]?.id}>
                {list.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.dateLabel} · {g.timeLabel}
                  </option>
                ))}
                <option value="">The next one</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="r-people">People coming</label>
              <select id="r-people" name="people" defaultValue="1">
                {[1, 2, 3, 4].map((n) => (
                  <option key={n}>{n}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="field">
            <label htmlFor="r-note">Anything Tavia should know? (optional)</label>
            <textarea id="r-note" name="note" />
          </div>
          <fieldset className="form__how">
            <legend>Send it by</legend>
            <label>
              <input type="radio" name="how" value="text" defaultChecked /> Text
            </label>
            <label>
              <input type="radio" name="how" value="email" /> Email
            </label>
          </fieldset>
          {error && (
            <p className="form__error" role="alert">
              {error}
            </p>
          )}
          <button className="btn btn--solid" type="submit">
            Write my RSVP
          </button>
          <p className="form__fine">This opens your own text or email app with the message ready. Nothing is saved on this site.</p>
        </form>
      </div>
    </section>
  )
}

export function Donate() {
  const ref = useRef()
  useSectionMotion(ref)
  return (
    <section ref={ref} className="section" id="donate">
      <div className="wrap donate">
        <h2 className="display" data-reveal>
          <Words text="Donation based. *Give* what you can." />
        </h2>
        <p className="body" data-fade>
          No one is turned away. Donations help keep these circles open. Scan the code with your phone's camera, or tap the
          button on your phone.
        </p>
        <div className="venmo" data-fade>
          <img src={`${import.meta.env.BASE_URL}images/venmo-qr.png`} alt="Venmo QR code for Tavia Valdez" width="200" height="200" />
          <a className="btn btn--solid" href={ORG.venmo} target="_blank" rel="noreferrer">
            Donate with Venmo ↗
          </a>
        </div>
      </div>
    </section>
  )
}

// A short "Meet your practitioners" teaser on the home page, linking to their own page.
export function MeetTeaser() {
  const ref = useRef()
  useSectionMotion(ref)
  const page = `${import.meta.env.BASE_URL}practitioners.html`
  return (
    <section ref={ref} className="section" id="practitioners">
      <div className="wrap teaser">
        <div className="teaser__head">
          <h2 className="display" data-reveal>
            <Words text="Meet your *practitioners*" />
          </h2>
          <a className="btn" href={page} data-fade>
            Meet Tavia and Kara →
          </a>
        </div>
        <div className="teaser__people">
          {PRACTITIONERS.map((p) => (
            <a className="teaser__person" href={`${page}#${p.id}`} key={p.id} data-fade>
              <img src={`${import.meta.env.BASE_URL}${p.photo}`} alt={p.photoAlt} style={{ objectPosition: p.focus }} loading="lazy" />
              <span>
                <strong>{p.name}</strong>
                <small>{p.roles[0]}</small>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
