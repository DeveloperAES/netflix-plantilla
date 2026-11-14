import { useEffect, useRef, useState } from 'react'
import { story } from './data/story'
import './App.css'

const DURATION = 4000
const HUES = [352, 8, 336, 18, 300, 345]
const NOTES_KEY = 'ficha-notas'
const WHATSAPP = '51991145635'

function openWhatsApp(text) {
  const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`
  window.open(url, '_blank', 'noopener,noreferrer')
}

function emptyNotes() {
  return { reply: '', moments: {} }
}

function readNotes() {
  try {
    const raw = localStorage.getItem(NOTES_KEY)
    if (!raw) return emptyNotes()
    const data = JSON.parse(raw)
    const moments = {}
    if (data.moments && typeof data.moments === 'object') {
      for (const [id, value] of Object.entries(data.moments)) {
        if (typeof value === 'string' && value.trim()) moments[id] = value
      }
    }
    return {
      reply: typeof data.reply === 'string' ? data.reply.trim() : '',
      moments,
    }
  } catch {
    return emptyNotes()
  }
}

function writeNotes(notes) {
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes))
}

const slides = [
  ...story.moments.map((moment) => ({
    id: moment.id,
    kind: 'moment',
    titulo: moment.titulo,
    texto: moment.texto,
    imagen: moment.imagen,
  })),
  {
    id: 'final',
    kind: 'end',
    titulo: story.title,
    texto: story.closingLine,
    imagen: '',
  },
]

function Mark() {
  return (
    <svg className="mark" viewBox="0 0 28 28" aria-hidden="true">
      <rect width="28" height="28" rx="3" fill="#e50914" />
      <path
        d="M7.2 22V6h3.1l7.4 10.8V6H20.8v16h-3.1L10.3 11.2V22H7.2z"
        fill="#fff"
      />
    </svg>
  )
}

function Heart({ filled = false, className = 'icon' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={filled ? 0 : 1.7}
      />
    </svg>
  )
}

function IconPlay() {
  return (
    <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 5.2v13.6L19 12 8 5.2z" fill="currentColor" />
    </svg>
  )
}

function IconPause() {
  return (
    <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6.5 5h3.6v14H6.5zM13.9 5h3.6v14h-3.6z" fill="currentColor" />
    </svg>
  )
}

function IconX() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M6 6l12 12M18 6L6 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function IconChevron({ dir = 'right' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      style={{ transform: dir === 'left' ? 'scaleX(-1)' : undefined }}
    >
      <path
        d="M9 5l8 7-8 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function Art({ src, title, hue = 352, showTitle = false, className = '' }) {
  const classes = ['art', showTitle ? 'has-title' : '', className]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes} style={{ '--h': hue }}>
      {src ? <img src={src} alt="" /> : <div className="art-fallback" />}
      {showTitle && title ? <span className="art-title">{title}</span> : null}
    </div>
  )
}

function MomentRow({ onOpen }) {
  const rowRef = useRef(null)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(true)

  useEffect(() => {
    const el = rowRef.current
    if (!el) return

    function update() {
      setCanLeft(el.scrollLeft > 4)
      setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
    }

    update()
    el.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      el.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  function scrollByDir(dir) {
    const el = rowRef.current
    if (!el) return
    el.scrollBy({
      left: dir * Math.max(el.clientWidth * 0.75, 220),
      behavior: 'smooth',
    })
  }

  return (
    <section className="row" aria-labelledby="moments-heading">
      <div className="row-head">
        <h2 id="moments-heading">{story.rowTitle}</h2>
        <div className="row-nav">
          <button
            type="button"
            className="icon-btn"
            aria-label="Momentos anteriores"
            disabled={!canLeft}
            onClick={() => scrollByDir(-1)}
          >
            <IconChevron dir="left" />
          </button>
          <button
            type="button"
            className="icon-btn"
            aria-label="Momentos siguientes"
            disabled={!canRight}
            onClick={() => scrollByDir(1)}
          >
            <IconChevron dir="right" />
          </button>
        </div>
      </div>
      <div className="row-scroller" ref={rowRef}>
        {story.moments.map((moment, index) => (
          <button
            key={moment.id}
            type="button"
            className="moment-card"
            onClick={(event) => onOpen(moment, index, event)}
          >
            <Art
              src={moment.imagen}
              title={moment.titulo}
              hue={HUES[index % HUES.length]}
              showTitle
            />
          </button>
        ))}
      </div>
    </section>
  )
}

function MomentModal({ moment, note, onSaveNote, onClose }) {
  const closeRef = useRef(null)
  const [draft, setDraft] = useState(note)
  const [status, setStatus] = useState('')

  useEffect(() => {
    closeRef.current?.focus()
  }, [])

  function commit(value, send = false) {
    const next = value.trim()
    if (next !== note) onSaveNote(moment.id, next)
    setStatus(next ? (send ? 'Abriendo WhatsApp' : 'Guardado') : '')
    if (send && next) {
      openWhatsApp(`Tu versión de «${moment.titulo}»:\n${next}`)
    }
  }

  return (
    <div className="backdrop" onClick={onClose}>
      <div
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="moment-title"
        onClick={(event) => event.stopPropagation()}
      >
        <Art src={moment.imagen} hue={moment.hue} />
        <button
          ref={closeRef}
          type="button"
          className="icon-btn modal-close"
          aria-label="Cerrar"
          onClick={onClose}
        >
          <IconX />
        </button>
        <div className="modal-copy">
          <p className="kicker">Momento</p>
          <h2 id="moment-title">{moment.titulo}</h2>
          <p className="moment-text">{moment.texto}</p>
          <form
            className="note-field"
            onSubmit={(event) => {
              event.preventDefault()
              commit(draft, true)
            }}
          >
            <label htmlFor="moment-note">Tu versión de esta escena</label>
            <textarea
              id="moment-note"
              value={draft}
              maxLength={280}
              rows={3}
              placeholder="Escribe una línea sobre este momento"
              onChange={(event) => {
                setDraft(event.target.value)
                setStatus('')
              }}
              onBlur={() => commit(draft)}
            />
            {/* <p className="send-hint">Se abre WhatsApp para enviárselo.</p> */}
            <div className="note-actions">
              <p className="save-status" role="status">
                {status}
              </p>
              <button type="submit" className="btn btn-play">
                Enviar por WhatsApp
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

function Player({ autoPlay, notes, onSaveReply, onClose }) {
  const last = slides.length - 1
  const closeRef = useRef(null)
  const remaining = useRef(DURATION)
  const [index, setIndex] = useState(0)
  const [run, setRun] = useState(autoPlay)
  const slide = slides[index]
  const isLast = index === last
  const reply = notes.reply
  const [draft, setDraft] = useState(reply)
  const [editingReply, setEditingReply] = useState(!reply)

  useEffect(() => {
    closeRef.current?.focus()
  }, [])

  useEffect(() => {
    remaining.current = DURATION
  }, [index])

  useEffect(() => {
    if (!run || isLast) return undefined
    const start = performance.now()
    const id = window.setTimeout(() => {
      setIndex((current) => (current >= last ? current : current + 1))
    }, remaining.current)
    return () => {
      remaining.current = Math.max(0, remaining.current - (performance.now() - start))
      window.clearTimeout(id)
    }
  }, [run, isLast, index, last])

  useEffect(() => {
    function onKey(event) {
      const tag = event.target?.tagName
      if (tag === 'TEXTAREA' || tag === 'INPUT') return
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        setIndex((current) => Math.min(current + 1, last))
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault()
        setIndex((current) => Math.max(current - 1, 0))
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [last])

  return (
    <div className="player" role="dialog" aria-modal="true" aria-label="Reproducción">
      <button
        ref={closeRef}
        type="button"
        className="icon-btn player-close"
        aria-label="Cerrar"
        onClick={onClose}
      >
        <IconX />
      </button>
      <div className="player-stage">
        <div
          key={slide.id}
          className={slide.kind === 'end' ? 'player-slide is-end' : 'player-slide'}
        >
          {slide.kind === 'end' ? (
            <div className="player-end">
              <p className="kicker">Para ti</p>
              <h2 className="player-script">{slide.titulo}</h2>
              <Heart filled className="title-heart end-heart" />
              <p className="player-end-text">{slide.texto}</p>
              <div className="reply-box">
                <p className="kicker">{reply && !editingReply ? 'Tus créditos' : 'Tu turno'}</p>
                {reply && !editingReply ? (
                  <>
                    <p className="reply-saved">{reply}</p>
                    <button
                      type="button"
                      className="text-btn"
                      onClick={() => {
                        setDraft(reply)
                        setEditingReply(true)
                      }}
                    >
                      Cambiar
                    </button>
                  </>
                ) : (
                  <form
                    onSubmit={(event) => {
                      event.preventDefault()
                      const next = draft.trim()
                      onSaveReply(next)
                      if (!next) return
                      openWhatsApp(`Tus créditos:\n${next}`)
                      setEditingReply(false)
                    }}
                  >
                    <label className="sr-only" htmlFor="reply">
                      Tu turno
                    </label>
                    <textarea
                      id="reply"
                      value={draft}
                      maxLength={400}
                      rows={3}
                      placeholder="Si esta película tuviera tus créditos…"
                      onChange={(event) => setDraft(event.target.value)}
                    />
                    <p className="send-hint">Se abre WhatsApp para enviárselo.</p>
                    <div className="reply-actions">
                      <button type="submit" className="btn btn-play">
                        Enviar por WhatsApp
                      </button>
                    </div>
                  </form>
                )}
              </div>
              <div className="music-frame">
                <iframe
                  className="music-embed"
                  title="Te encontré, El Vega"
                  src="https://open.spotify.com/embed/track/0HRZMXEiqvPsO7EsYJrHn1?utm_source=generator&theme=0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                />
              </div>
            </div>
          ) : (
            <>
              <div className="player-visual">
                <Art src={slide.imagen} hue={HUES[index % HUES.length]} />
              </div>
              <div className="player-caption">
                <p className="kicker">
                  Momento {index + 1} de {last}
                </p>
                <h2>{slide.titulo}</h2>
                <p className="caption-text">{slide.texto}</p>
                {notes.moments[slide.id] ? (
                  <p className="player-her-note">
                    <span>Tu versión. </span>
                    {notes.moments[slide.id]}
                  </p>
                ) : null}
              </div>
            </>
          )}
        </div>
      </div>
      <div className="player-bar">
        {!isLast && (
          <div
            className={run ? 'player-progress' : 'player-progress is-paused'}
            aria-hidden="true"
          >
            <span key={index} />
          </div>
        )}
        <div className="player-controls">
          <button
            type="button"
            aria-label="Anterior"
            disabled={index === 0}
            onClick={() => setIndex((current) => Math.max(current - 1, 0))}
          >
            <IconChevron dir="left" />
          </button>
          <button
            type="button"
            className="is-main"
            aria-label={run ? 'Pausa' : 'Reproducir'}
            onClick={() => setRun((value) => !value)}
          >
            {run ? <IconPause /> : <IconPlay />}
          </button>
          <button
            type="button"
            aria-label="Siguiente"
            disabled={isLast}
            onClick={() => setIndex((current) => Math.min(current + 1, last))}
          >
            <IconChevron dir="right" />
          </button>
        </div>
        <div className="player-dots">
          {slides.map((item, dotIndex) => (
            <button
              key={item.id}
              type="button"
              className={dotIndex === index ? 'is-on' : ''}
              aria-label={item.kind === 'end' ? 'Ir al final' : `Ir a ${item.titulo}`}
              aria-current={dotIndex === index ? 'true' : undefined}
              onClick={() => setIndex(dotIndex)}
            />
          ))}
        </div>
        <p className="sr-only" aria-live="polite">
          {slide.titulo}. {slide.texto}
        </p>
      </div>
    </div>
  )
}

function App() {
  const playRef = useRef(null)
  const returnFocus = useRef(null)
  const [favorite, setFavorite] = useState(false)
  const [toast, setToast] = useState('')
  const [moment, setMoment] = useState(null)
  const [playerOpen, setPlayerOpen] = useState(false)
  const [notes, setNotes] = useState(readNotes)

  function saveReply(text) {
    setNotes((current) => {
      const next = { ...current, reply: text }
      writeNotes(next)
      return next
    })
  }

  function saveMomentNote(id, text) {
    setNotes((current) => {
      const moments = { ...current.moments }
      if (text) moments[id] = text
      else delete moments[id]
      const next = { ...current, moments }
      writeNotes(next)
      return next
    })
  }

  useEffect(() => {
    document.title = story.title.replace('\n', ' ')
  }, [])

  useEffect(() => {
    if (!toast) return undefined
    const id = window.setTimeout(() => setToast(''), 2200)
    return () => window.clearTimeout(id)
  }, [toast])

  useEffect(() => {
    document.body.style.overflow = playerOpen || moment ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [playerOpen, moment])

  useEffect(() => {
    function onKey(event) {
      if (event.key !== 'Escape') return
      if (playerOpen) {
        setPlayerOpen(false)
        playRef.current?.focus()
      } else if (moment) {
        setMoment(null)
        returnFocus.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [playerOpen, moment])

  function toggleFavorite() {
    const next = !favorite
    setFavorite(next)
    setToast(next ? 'Guardado en mi lista' : 'Quitado de tu lista')
  }

  function openMoment(item, index, event) {
    returnFocus.current = event.currentTarget
    setMoment({ ...item, hue: HUES[index % HUES.length] })
  }

  function closeMoment() {
    setMoment(null)
    returnFocus.current?.focus()
  }

  function openPlayer() {
    setMoment(null)
    setPlayerOpen(true)
  }

  function closePlayer() {
    setPlayerOpen(false)
    playRef.current?.focus()
  }

  const titleLines = story.title.split('\n')

  return (
    <div className="page">
      <main>
        <header className="billboard">
          <div className="billboard-copy">
            <div className="brand">
              <Mark />
              <span>{story.eyebrow}</span>
            </div>
            <h1 className="title">
              {titleLines.map((line, index) => (
                <span className="title-line" key={`${line}-${index}`}>
                  {line}
                  {index === titleLines.length - 1 ? (
                    <Heart filled className="title-heart" />
                  ) : null}
                </span>
              ))}
            </h1>
            <p className="meta">
              <span className="match">{story.match}</span>
              <span className="meta-dot" aria-hidden="true" />
              <span>{story.since}</span>
            </p>
            <p className="tagline">
              <span className="top10">TOP 10</span>
              {story.tagline}
            </p>
            <p className="synopsis">{story.synopsis}</p>
            <div className="actions">
              <button
                ref={playRef}
                type="button"
                className="btn btn-play"
                onClick={openPlayer}
              >
                <IconPlay />
                Reproducir
              </button>
              <button
                type="button"
                className={favorite ? 'btn btn-fav is-on' : 'btn btn-fav'}
                aria-pressed={favorite}
                onClick={toggleFavorite}
              >
                <Heart filled={favorite} />
                Favorito
              </button>
            </div>
          </div>
          <div className="billboard-visual">
            <Art src={story.hero} hue={348} className="art-hero" />
          </div>
        </header>
        <MomentRow onOpen={openMoment} />
      </main>
      <footer className="credits">
        <Mark />
        <span>Nuestra historia · desde el 06 de diciembre de 2025 para siempre</span>
      </footer>
      {toast ? (
        <div className="toast" role="status">
          {toast}
        </div>
      ) : null}
      {moment ? (
        <MomentModal
          moment={moment}
          note={notes.moments[moment.id] || ''}
          onSaveNote={saveMomentNote}
          onClose={closeMoment}
        />
      ) : null}
      {playerOpen ? (
        <Player
          autoPlay={!window.matchMedia('(prefers-reduced-motion: reduce)').matches}
          notes={notes}
          onSaveReply={saveReply}
          onClose={closePlayer}
        />
      ) : null}
    </div>
  )
}

export default App
