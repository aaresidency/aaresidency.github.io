import { useState, type FormEvent, type ReactNode } from 'react'
import _PhoneInput from 'react-phone-input-2'
import type { PhoneInputProps } from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { ApiError, type BookingStatus } from '../../lib/adminApi'
import { useAdminApi } from './session'
import { STATUS } from './status'

// CJS/ESM interop: Vite may give us { default: fn } instead of fn
const PhoneInput = ((_PhoneInput as unknown as { default?: unknown }).default ?? _PhoneInput) as React.ComponentType<PhoneInputProps>

const ROOM_TYPES = ['Deluxe Room', 'Studio Room', 'Family Room', 'Not specified']
const MAX_NOTES = 2000

const inputClass =
  'h-11 w-full rounded-xl border border-gold/25 bg-dark px-3 text-base text-cream placeholder:text-warm-muted/60 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30'

function Field({ label, htmlFor, required, error, children }: { label: string; htmlFor: string; required?: boolean; error?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={htmlFor} className="text-xs uppercase tracking-wide text-warm-muted">
        {label}
        {required && <span className="ml-0.5 text-red-300">*</span>}
      </label>
      {children}
      {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
    </div>
  )
}

/** Modal for entering a booking by hand (phone call, walk-in). Mirrors the website form; email and phone are optional. */
export function NewBookingForm({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const api = useAdminApi()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [arrival, setArrival] = useState('')
  const [departure, setDeparture] = useState('')
  const [roomType, setRoomType] = useState(ROOM_TYPES[0])
  const [adults, setAdults] = useState('1')
  const [children, setChildren] = useState('0')
  const [notes, setNotes] = useState('')
  const [status, setStatus] = useState<BookingStatus>('confirmed')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState('')
  const [busy, setBusy] = useState(false)

  // react-phone-input-2 reports just the dial code ("91") while the field is empty.
  const phoneDigits = phone.replace(/\D/g, '')
  const hasPhone = phoneDigits.length > 2 && phoneDigits !== '91'

  function validate() {
    const next: Record<string, string> = {}
    if (!name.trim()) next.name = 'Name is required'
    if (hasPhone && phoneDigits.length < 10) next.phone = 'Enter a valid mobile number, or leave it blank'
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = 'Enter a valid email, or leave it blank'
    if (arrival && departure && departure <= arrival) next.departure = 'Check-out must be after check-in'
    return next
  }

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (busy) return
    const found = validate()
    setErrors(found)
    setFormError('')
    if (Object.keys(found).length) return
    setBusy(true)
    try {
      await api.create({
        name: name.trim(),
        email: email.trim(),
        phone: hasPhone ? phoneDigits : '',
        arrival_date: arrival,
        departure_date: departure,
        room_type: roomType,
        adults: Number(adults),
        children: Number(children),
        notes: notes.trim(),
        status,
      })
      onCreated()
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : 'Could not save the booking.')
      setBusy(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 sm:items-center sm:px-4" role="dialog" aria-modal="true" aria-label="New booking">
      <form
        onSubmit={submit}
        noValidate
        className="relative max-h-[94vh] w-full max-w-lg space-y-4 overflow-y-auto rounded-t-2xl border border-gold/25 bg-dark-card p-5 shadow-2xl sm:rounded-2xl"
      >
        <button type="button" onClick={onClose} aria-label="Close" className="absolute right-2 top-2 flex h-11 w-11 items-center justify-center text-xl leading-none text-warm-muted hover:text-cream">
          ✕
        </button>
        <h2 className="pr-10 text-xl font-semibold text-cream">New booking</h2>

        <Field label="Guest name" htmlFor="nb-name" required error={errors.name}>
          <input id="nb-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={160} autoComplete="off" className={inputClass} />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Check-in" htmlFor="nb-arrival">
            <input id="nb-arrival" type="date" value={arrival} onChange={(e) => setArrival(e.target.value)} className={inputClass} />
          </Field>
          <Field label="Check-out" htmlFor="nb-departure" error={errors.departure}>
            <input id="nb-departure" type="date" value={departure} min={arrival || undefined} onChange={(e) => setDeparture(e.target.value)} className={inputClass} />
          </Field>
        </div>

        <Field label="Room" htmlFor="nb-room">
          <select id="nb-room" value={roomType} onChange={(e) => setRoomType(e.target.value)} className={inputClass}>
            {ROOM_TYPES.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Adults" htmlFor="nb-adults">
            <select id="nb-adults" value={adults} onChange={(e) => setAdults(e.target.value)} className={inputClass}>
              {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </Field>
          <Field label="Children" htmlFor="nb-children">
            <select id="nb-children" value={children} onChange={(e) => setChildren(e.target.value)} className={inputClass}>
              {Array.from({ length: 11 }, (_, i) => i).map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Mobile (optional)" htmlFor="nb-phone" error={errors.phone}>
          <PhoneInput
            country="in"
            value={phone}
            onChange={setPhone}
            inputProps={{ id: 'nb-phone' }}
            inputClass="!w-full !h-11 !text-base !text-gray-800 !border-gold/25 !rounded-xl"
            containerClass="!w-full"
            buttonClass="!border-gold/25 !rounded-l-xl"
          />
        </Field>

        <Field label="Email (optional)" htmlFor="nb-email" error={errors.email}>
          <input id="nb-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="off" className={inputClass} />
        </Field>

        <Field label="Notes / special requests" htmlFor="nb-notes">
          <textarea
            id="nb-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            maxLength={MAX_NOTES}
            rows={3}
            placeholder="e.g. Early check-in, extra bed, paid ₹500 advance…"
            className="w-full rounded-xl border border-gold/25 bg-dark p-3 text-base text-cream placeholder:text-warm-muted/60 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
          />
        </Field>

        <div role="group" aria-label="Booking status">
          <span className="mb-2 block text-xs uppercase tracking-wide text-warm-muted">Status</span>
          <div className="grid grid-cols-3 gap-1 rounded-xl bg-dark p-1 ring-1 ring-gold/15">
            {(Object.keys(STATUS) as BookingStatus[]).map((s) => (
              <button
                key={s}
                type="button"
                aria-pressed={s === status}
                onClick={() => setStatus(s)}
                className={`min-h-10 rounded-lg px-2 text-sm font-semibold transition ${s === status ? STATUS[s].active : 'text-warm hover:bg-gold/10'}`}
              >
                {STATUS[s].label}
              </button>
            ))}
          </div>
        </div>

        {formError && <p role="alert" className="text-sm text-red-300">{formError}</p>}

        <div className="flex gap-3">
          <button type="button" onClick={onClose} className="min-h-12 flex-1 rounded-xl border border-gold/30 text-sm font-semibold text-gold-light transition hover:bg-gold/10">
            Cancel
          </button>
          <button type="submit" disabled={busy} className="min-h-12 flex-1 rounded-xl bg-gold text-sm font-semibold text-dark transition hover:bg-gold-light disabled:opacity-50">
            {busy ? 'Saving…' : 'Save booking'}
          </button>
        </div>
      </form>
    </div>
  )
}
