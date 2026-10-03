import { useState } from 'react'
import { ApiError, type AdminNote, type Booking, type BookingStatus } from '../../lib/adminApi'
import { dayParts, formatDay, formatStamp, nights } from './dates'
import { useAdminApi } from './session'
import { STATUS } from './status'

function whenLabel(b: Booking, today: string): { text: string; tone: string } | null {
  if (!b.arrival) return null
  if (b.arrival === today) return { text: 'Arriving today', tone: 'bg-gold text-dark' }
  if (b.arrival < today && b.departure && b.departure > today) return { text: 'In house', tone: 'bg-emerald-400/20 text-emerald-200' }
  if (b.departure === today) return { text: 'Leaving today', tone: 'bg-warm/20 text-cream' }
  return null
}

const actionClass =
  'flex min-h-11 items-center justify-center gap-2 rounded-lg border border-gold/30 bg-dark px-3 py-2 text-sm font-medium text-gold-light transition hover:border-gold hover:bg-gold/10'

export function BookingCard({ booking, today }: { booking: Booking; today: string }) {
  const api = useAdminApi()
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState(booking.status)
  const [notes, setNotes] = useState<AdminNote[] | null>(null)
  const [noteCount, setNoteCount] = useState(booking.note_count)
  const [draft, setDraft] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const fail = (err: unknown) => setError(err instanceof ApiError ? err.message : 'Something went wrong.')

  async function toggle() {
    const next = !open
    setOpen(next)
    if (next && notes === null) {
      try {
        setNotes((await api.detail(booking.id)).notes)
      } catch (err) {
        fail(err)
      }
    }
  }

  async function addNote() {
    if (!draft.trim() || busy) return
    setBusy(true)
    setError('')
    try {
      const { note } = await api.addNote(booking.id, draft.trim())
      setNotes((prev) => [note, ...(prev ?? [])])
      setNoteCount((c) => c + 1)
      setDraft('')
    } catch (err) {
      fail(err)
    } finally {
      setBusy(false)
    }
  }

  async function changeStatus(next: BookingStatus) {
    if (next === status || busy) return
    setBusy(true)
    setError('')
    try {
      await api.setStatus(booking.id, next)
      setStatus(next)
    } catch (err) {
      fail(err)
    } finally {
      setBusy(false)
    }
  }

  const n = nights(booking.arrival, booking.departure)
  const when = whenLabel(booking, today)
  const phoneDigits = booking.phone.replace(/\D/g, '')
  const parts = booking.arrival ? dayParts(booking.arrival) : null
  const cancelled = status === 'cancelled'
  const guests = `${booking.adults} adult${booking.adults === 1 ? '' : 's'}${booking.children ? ` · ${booking.children} child${booking.children === 1 ? '' : 'ren'}` : ''}`

  return (
    <li className={`overflow-hidden rounded-2xl border border-gold/15 bg-dark-card shadow-lg shadow-black/20 transition ${open ? 'border-gold/40' : 'hover:border-gold/35'}`}>
      <div className="flex">
        <span className={`w-1.5 shrink-0 ${STATUS[status].bar}`} aria-hidden />
        <div className="min-w-0 flex-1">
          <button type="button" onClick={toggle} aria-expanded={open} className="flex w-full items-center gap-3 p-3 text-left sm:gap-4 sm:p-4">
            <div className="flex h-16 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-dark text-center ring-1 ring-gold/25 sm:w-16" aria-hidden>
              {parts ? (
                <>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-warm-muted">{parts.weekday}</span>
                  <span className="text-2xl font-bold leading-none text-gold">{parts.day}</span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-warm">{parts.month}</span>
                </>
              ) : (
                <span className="text-xs text-warm-muted">No date</span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className={`truncate text-lg font-semibold leading-tight ${cancelled ? 'text-warm-muted line-through' : 'text-cream'}`}>{booking.name}</h3>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS[status].badge}`}>{STATUS[status].label}</span>
                {when && <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${when.tone}`}>{when.text}</span>}
              </div>
              <p className="mt-1 text-[15px] text-warm">
                {booking.arrival ? (
                  <>
                    {formatDay(booking.arrival)}
                    {booking.departure && <> → {formatDay(booking.departure)}</>}
                    {n !== null && (
                      <span className="ml-2 inline-block whitespace-nowrap rounded bg-gold/10 px-1.5 py-0.5 text-xs font-medium text-gold-light">
                        {n} night{n === 1 ? '' : 's'}
                      </span>
                    )}
                  </>
                ) : (
                  'Dates not given'
                )}
              </p>
              <p className="mt-0.5 text-sm text-warm-muted">
                {booking.room_type} · {guests}
              </p>
            </div>

            <div className="flex shrink-0 flex-col items-end gap-2 self-start text-warm-muted">
              {noteCount > 0 && <span className="rounded-full bg-gold/15 px-2 py-0.5 text-xs font-semibold text-gold">📝 {noteCount}</span>}
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className={`transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden>
                <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </button>

          {open && (
            <div className="space-y-5 border-t border-gold/15 bg-dark/40 p-4">
              <section aria-label="Contact" className={`grid gap-2 ${booking.email ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}>
                <a href={`tel:+${phoneDigits}`} className={actionClass}>
                  📞 <span className="truncate">{booking.phone}</span>
                </a>
                <a href={`https://wa.me/${phoneDigits}`} target="_blank" rel="noreferrer" className={actionClass}>
                  💬 WhatsApp
                </a>
                {booking.email && (
                  <a href={`mailto:${booking.email}`} className={actionClass}>
                    ✉️ <span className="truncate">{booking.email}</span>
                  </a>
                )}
              </section>

              <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                <div>
                  <dt className="text-xs uppercase tracking-wide text-warm-muted">Reference</dt>
                  <dd className="mt-0.5 font-medium text-cream">{booking.ref}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-warm-muted">Received</dt>
                  <dd className="mt-0.5 font-medium text-cream">{formatStamp(booking.created_at)}</dd>
                </div>
              </dl>

              {booking.guest_notes && (
                <p className="rounded-xl border border-gold/15 bg-dark p-3 text-sm text-warm">
                  <span className="mb-1 block text-xs uppercase tracking-wide text-warm-muted">Guest request</span>
                  {booking.guest_notes}
                </p>
              )}

              <div role="group" aria-label="Booking status">
                <span className="mb-2 block text-xs uppercase tracking-wide text-warm-muted">Status</span>
                <div className="grid grid-cols-3 gap-1 rounded-xl bg-dark p-1 ring-1 ring-gold/15">
                  {(Object.keys(STATUS) as BookingStatus[]).map((s) => (
                    <button
                      key={s}
                      type="button"
                      disabled={busy}
                      aria-pressed={s === status}
                      onClick={() => changeStatus(s)}
                      className={`min-h-10 rounded-lg px-2 text-sm font-semibold transition ${s === status ? STATUS[s].active : 'text-warm hover:bg-gold/10'}`}
                    >
                      {STATUS[s].label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor={`note-${booking.id}`} className="mb-2 block text-xs uppercase tracking-wide text-warm-muted">
                  Private notes
                </label>
                <textarea
                  id={`note-${booking.id}`}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  maxLength={2000}
                  rows={3}
                  placeholder="e.g. Asked for early check-in, paid ₹500 advance…"
                  className="w-full rounded-xl border border-gold/25 bg-dark p-3 text-base text-cream placeholder:text-warm-muted/60 focus:border-gold focus:outline-none"
                />
                <div className="mt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={addNote}
                    disabled={busy || !draft.trim()}
                    className="min-h-11 rounded-lg bg-gold px-5 text-sm font-semibold text-dark transition hover:bg-gold-light disabled:opacity-40"
                  >
                    {busy ? 'Saving…' : 'Add note'}
                  </button>
                  {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
                </div>
              </div>

              {notes === null && !error ? (
                <p className="text-sm text-warm-muted">Loading notes…</p>
              ) : notes && notes.length > 0 ? (
                <ul className="space-y-2 border-l-2 border-gold/25 pl-4">
                  {notes.map((note) => (
                    <li key={note.id} className="rounded-xl bg-dark p-3 ring-1 ring-gold/10">
                      <p className="whitespace-pre-wrap break-words text-[15px] text-cream">{note.note}</p>
                      <p className="mt-1.5 text-xs text-warm-muted">
                        {note.author_email} · {formatStamp(note.created_at)}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                notes && <p className="text-sm text-warm-muted">No notes yet.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </li>
  )
}
