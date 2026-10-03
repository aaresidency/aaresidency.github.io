import { useState } from 'react'
import { ApiError, type AdminNote, type Booking, type BookingStatus } from '../../lib/adminApi'
import { formatDay, formatStamp, nights } from './dates'
import { useAdminApi } from './session'

const STATUS_STYLE: Record<BookingStatus, string> = {
  new: 'bg-gold/15 text-gold border-gold/40',
  confirmed: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
  cancelled: 'bg-red-500/15 text-red-300 border-red-500/40',
}

function whenLabel(b: Booking, today: string): { text: string; tone: string } | null {
  if (!b.arrival) return { text: 'No dates', tone: 'text-warm-muted' }
  if (b.arrival === today) return { text: 'Arriving today', tone: 'text-gold' }
  if (b.arrival < today && b.departure && b.departure > today) return { text: 'Staying now', tone: 'text-emerald-300' }
  if (b.departure === today) return { text: 'Leaving today', tone: 'text-warm' }
  return null
}

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
  const guests = `${booking.adults} adult${booking.adults === 1 ? '' : 's'}${booking.children ? `, ${booking.children} child${booking.children === 1 ? '' : 'ren'}` : ''}`

  return (
    <li className="rounded-xl border border-gold/20 bg-dark-card">
      <button type="button" onClick={toggle} aria-expanded={open} className="flex w-full items-start gap-3 p-4 text-left">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="truncate text-base font-semibold text-cream">{booking.name}</span>
            <span className={`rounded-full border px-2 py-0.5 text-[11px] font-medium capitalize ${STATUS_STYLE[status]}`}>{status}</span>
            {when && <span className={`text-xs font-medium ${when.tone}`}>{when.text}</span>}
          </div>
          <p className="mt-1 text-sm text-warm">
            {booking.arrival ? (
              <>
                {formatDay(booking.arrival)}
                {booking.departure && <> → {formatDay(booking.departure)}</>}
                {n !== null && <span className="text-warm-muted"> · {n} night{n === 1 ? '' : 's'}</span>}
              </>
            ) : (
              'Dates not given'
            )}
          </p>
          <p className="mt-0.5 text-xs text-warm-muted">
            {booking.room_type} · {guests}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1 text-xs text-warm-muted">
          {noteCount > 0 && <span className="rounded bg-gold/10 px-1.5 py-0.5 text-gold">📝 {noteCount}</span>}
          <span aria-hidden>{open ? '▲' : '▼'}</span>
        </div>
      </button>

      {open && (
        <div className="space-y-4 border-t border-gold/15 p-4">
          <div className="flex flex-wrap gap-2">
            <a href={`tel:+${phoneDigits}`} className="rounded-lg border border-gold/40 px-3 py-2 text-sm text-gold">
              📞 {booking.phone}
            </a>
            <a href={`https://wa.me/${phoneDigits}`} target="_blank" rel="noreferrer" className="rounded-lg border border-gold/40 px-3 py-2 text-sm text-gold">
              WhatsApp
            </a>
            {booking.email && (
              <a href={`mailto:${booking.email}`} className="max-w-full truncate rounded-lg border border-gold/40 px-3 py-2 text-sm text-gold">
                ✉️ {booking.email}
              </a>
            )}
          </div>

          <p className="text-xs text-warm-muted">
            Ref {booking.ref} · received {formatStamp(booking.created_at)}
          </p>
          {booking.guest_notes && (
            <p className="rounded-lg bg-dark p-3 text-sm text-warm">
              <span className="text-warm-muted">Guest request: </span>
              {booking.guest_notes}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-warm-muted">Status</span>
            {(['new', 'confirmed', 'cancelled'] as const).map((s) => (
              <button
                key={s}
                type="button"
                disabled={busy}
                onClick={() => changeStatus(s)}
                className={`rounded-full border px-3 py-1.5 text-xs capitalize ${s === status ? STATUS_STYLE[s] : 'border-gold/20 text-warm-muted'}`}
              >
                {s}
              </button>
            ))}
          </div>

          <div>
            <label htmlFor={`note-${booking.id}`} className="mb-1 block text-xs font-medium text-warm-muted">
              Private notes
            </label>
            <textarea
              id={`note-${booking.id}`}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              maxLength={2000}
              rows={3}
              placeholder="e.g. Asked for early check-in, paid ₹500 advance…"
              className="w-full rounded-lg border border-gold/25 bg-dark p-3 text-base text-cream placeholder:text-warm-muted/60 focus:border-gold focus:outline-none"
            />
            <button
              type="button"
              onClick={addNote}
              disabled={busy || !draft.trim()}
              className="mt-2 rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-dark disabled:opacity-40"
            >
              {busy ? 'Saving…' : 'Add note'}
            </button>
            {error && <p role="alert" className="mt-2 text-sm text-red-300">{error}</p>}
          </div>

          {notes === null && !error ? (
            <p className="text-sm text-warm-muted">Loading notes…</p>
          ) : (
            notes && notes.length > 0 && (
              <ul className="space-y-2">
                {notes.map((note) => (
                  <li key={note.id} className="rounded-lg bg-dark p-3">
                    <p className="whitespace-pre-wrap break-words text-sm text-cream">{note.note}</p>
                    <p className="mt-1 text-[11px] text-warm-muted">
                      {note.author_email} · {formatStamp(note.created_at)}
                    </p>
                  </li>
                ))}
              </ul>
            )
          )}
        </div>
      )}
    </li>
  )
}
