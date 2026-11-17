import { useMemo, useRef, useState } from 'react'
import { Words, useSectionMotion } from '../lib/anim'
import { ORG, GATHERINGS, upcoming } from '../lib/content'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const BASE = import.meta.env.BASE_URL

const pad = (n) => String(n).padStart(2, '0')
const keyOf = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}` // m is 0-based, matches gathering ids (YYYY-MM-DD)
const todayKey = () => {
  const t = new Date()
  return keyOf(t.getFullYear(), t.getMonth(), t.getDate())
}

// RSVP for one gathering: writes the message and opens the visitor's own text or email app. Nothing is stored here.
function RsvpForm({ g }) {
  const [error, setError] = useState('')
  const compose = (form) => {
    const d = new FormData(form)
    const name = String(d.get('name') || '').trim()
    if (!name) return setError('Please add your name so Tavia knows who is coming.')
    setError('')
    const lines = [
      `Hi Tavia, I'd like to RSVP for the ${g.title} on ${g.dateLabel} at ${g.timeLabel}.`,
      `Name: ${name}`,
      `People coming: ${d.get('people')}`,
      d.get('note') ? `Note: ${String(d.get('note')).trim()}` : '',
    ].filter(Boolean)
    const body = encodeURIComponent(lines.join('\n'))
    if (d.get('how') === 'text') window.location.href = `sms:+18016750634?&body=${body}`
    else window.location.href = `mailto:${ORG.email}?subject=${encodeURIComponent(`RSVP — ${g.title}, ${g.dateLabel}`)}&body=${body}`
  }
  return (
    <form
      className="form"
      noValidate
      onSubmit={(e) => {
        e.preventDefault()
        compose(e.currentTarget)
      }}
    >
      <h3>Save your place</h3>
      <div className="form__row">
        <div className="field">
          <label htmlFor={`r-name-${g.id}`}>Your name</label>
          <input id={`r-name-${g.id}`} name="name" autoComplete="name" required />
        </div>
        <div className="field">
          <label htmlFor={`r-people-${g.id}`}>People coming</label>
          <select id={`r-people-${g.id}`} name="people" defaultValue="1">
            {[1, 2, 3, 4].map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="field">
        <label htmlFor={`r-note-${g.id}`}>Anything Tavia should know? (optional)</label>
        <textarea id={`r-note-${g.id}`} name="note" />
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
      <p className="form__fine">
        This opens your own text or email app with the message ready. Nothing is saved on this site. You can also{' '}
        <a href={ORG.phoneHref}>text Tavia</a> or <a href={`mailto:${ORG.email}`}>email her</a> directly.
      </p>
    </form>
  )
}

function Details({ g }) {
  return (
    <article className="day-panel__event" aria-labelledby={`ev-${g.id}`}>
      <div className="event__when">
        <h3 className="event__title" id={`ev-${g.id}`}>
          {g.title}
        </h3>
        <span className="event__date">{g.dateLabel}</span>
        <span className="event__time">{g.timeLabel}</span>
      </div>
      <p className="body">{g.summary}</p>
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
          <dd>
            {g.price}
            <br />
            <a href={`${BASE}donate.html`}>Donate by Venmo</a>
          </dd>
        </div>
      </dl>
      <p className="note">{g.note}</p>
    </article>
  )
}

// "Find your circle": a month calendar of themed gatherings. Days with a gathering are marked; choosing one shows its details and the RSVP.
export default function Calendar() {
  const ref = useRef()
  useSectionMotion(ref)
  const byDay = useMemo(() => Object.fromEntries(GATHERINGS.map((g) => [g.id, g])), [])
  const next = upcoming()[0]
  const today = todayKey()
  const start = next ? new Date(`${next.id}T12:00:00`) : new Date()
  const [view, setView] = useState({ y: start.getFullYear(), m: start.getMonth() })
  const [selected, setSelected] = useState(next ? next.id : today)
  const panel = useRef()

  const first = new Date(view.y, view.m, 1).getDay()
  const days = new Date(view.y, view.m + 1, 0).getDate()
  const cells = [...Array(first).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)]
  const move = (step) =>
    setView(({ y, m }) => {
      const d = new Date(y, m + step, 1)
      return { y: d.getFullYear(), m: d.getMonth() }
    })

  const choose = (k) => {
    setSelected(k)
    // on phones the details sit under the calendar, so bring them into view
    if (window.matchMedia('(max-width: 820px)').matches) requestAnimationFrame(() => panel.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }

  const g = byDay[selected]
  const selDate = new Date(`${selected}T12:00:00`)
  const list = upcoming()

  return (
    <section ref={ref} className="section cal-page" id="calendar">
      <div className="wrap page-head">
        <h1 className="display" data-reveal>
          <Words text="Find your *circle*" />
        </h1>
        <p className="lede" data-fade>
          Each circle has its own theme. Choose a marked day to see what it holds and save your place.
        </p>
      </div>

      <div className="wrap cal" data-fade>
        <div className="cal__month">
          <div className="cal__head">
            <button type="button" className="cal__nav" onClick={() => move(-1)} aria-label="Previous month">
              ←
            </button>
            <h2 className="cal__title" aria-live="polite">
              {MONTHS[view.m]} {view.y}
            </h2>
            <button type="button" className="cal__nav" onClick={() => move(1)} aria-label="Next month">
              →
            </button>
          </div>
          <div className="cal__grid" role="grid" aria-label={`${MONTHS[view.m]} ${view.y}`}>
            {WEEKDAYS.map((w) => (
              <span className="cal__wd" key={w} role="columnheader">
                {w}
              </span>
            ))}
            {cells.map((d, i) => {
              if (!d) return <span key={`e${i}`} className="cal__empty" aria-hidden="true" />
              const k = keyOf(view.y, view.m, d)
              const ev = byDay[k]
              const label = `${MONTHS[view.m]} ${d}${ev ? `, ${ev.title} at ${ev.timeLabel}` : ''}`
              return (
                <button
                  type="button"
                  key={k}
                  className={`cal__day${ev ? ' has-event' : ''}${k === selected ? ' is-selected' : ''}${k === today ? ' is-today' : ''}${k < today ? ' is-past' : ''}`}
                  aria-pressed={k === selected}
                  aria-label={label}
                  onClick={() => choose(k)}
                >
                  <span>{d}</span>
                  {ev && <i aria-hidden="true" />}
                </button>
              )
            })}
          </div>
          {list.length > 0 && (
            <div className="cal__soon">
              <h3>Coming up</h3>
              <ul>
                {list.map((x) => (
                  <li key={x.id}>
                    <button
                      type="button"
                      onClick={() => {
                        const d = new Date(`${x.id}T12:00:00`)
                        setView({ y: d.getFullYear(), m: d.getMonth() })
                        choose(x.id)
                      }}
                    >
                      <strong>{x.dateLabel}</strong> · {x.timeLabel} · {x.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="day-panel" ref={panel} aria-live="polite">
          {g ? (
            <>
              <Details g={g} />
              {selected >= today ? (
                <RsvpForm g={g} key={g.id} />
              ) : (
                <p className="body">This gathering has passed. Choose an upcoming date to save your place.</p>
              )}
            </>
          ) : (
            <div className="day-panel__empty">
              <p className="event__date">
                {selDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
              <p className="body">
                No gathering this day.{' '}
                {next ? (
                  <>
                    The next one is <strong>{next.dateLabel}</strong> at {next.timeLabel}.
                  </>
                ) : (
                  'New dates are added here as they are planned.'
                )}
              </p>
              <p className="body">
                Want to hear about new dates? <a href={ORG.phoneHref}>Text Tavia</a> or{' '}
                <a href={`mailto:${ORG.email}`}>email her</a>.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
