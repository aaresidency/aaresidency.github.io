import { useEffect, useMemo, useState } from 'react'
import { ApiError, type Booking } from '../../lib/adminApi'
import { BookingList } from './BookingList'
import { STATUS } from './status'
import { formatLongDay, formatMonth, monthGrid, shiftMonth } from './dates'
import { useAdminApi } from './session'

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

/** A guest occupies the night of every day from arrival up to (not including) departure; no departure = arrival day only. */
function stays(b: Booking, day: string): boolean {
  if (!b.arrival) return false
  return b.departure ? b.arrival <= day && day < b.departure : b.arrival === day
}

export function CalendarView({ today }: { today: string }) {
  const api = useAdminApi()
  const [month, setMonth] = useState(() => `${today.slice(0, 7)}-01`)
  const [selected, setSelected] = useState(today)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const grid = useMemo(() => monthGrid(month), [month])

  useEffect(() => {
    let stale = false
    api
      .range(grid[0], grid[grid.length - 1])
      .then((r) => {
        if (stale) return
        setBookings(r.bookings)
        setError('')
        setLoading(false)
      })
      .catch((err) => {
        if (stale) return
        setError(err instanceof ApiError ? err.message : 'Could not load the calendar.')
        setLoading(false)
      })
    return () => {
      stale = true
    }
  }, [api, grid])

  const showMonth = (next: string) => {
    setLoading(true)
    setMonth(next)
    setSelected(next.slice(0, 7) === today.slice(0, 7) ? today : next)
  }

  // Cancelled stays are listed under the day but don't count towards the cell totals.
  const dayBookings = (day: string) => bookings.filter((b) => b.status !== 'cancelled' && stays(b, day))
  const selectedBookings = bookings.filter((b) => stays(b, selected))

  return (
    <section aria-label="Calendar">
      <div className="mb-3 flex items-center justify-between">
        <button type="button" onClick={() => showMonth(shiftMonth(month, -1))} aria-label="Previous month" className="h-11 w-11 rounded-xl bg-dark-card text-xl text-gold ring-1 ring-gold/25 transition hover:ring-gold/60">
          ‹
        </button>
        <div className="text-center">
          <h2 className="text-lg font-semibold text-cream">{formatMonth(month)}</h2>
          {month.slice(0, 7) !== today.slice(0, 7) && (
            <button type="button" onClick={() => showMonth(`${today.slice(0, 7)}-01`)} className="text-sm text-gold underline underline-offset-2">
              Back to today
            </button>
          )}
        </div>
        <button type="button" onClick={() => showMonth(shiftMonth(month, 1))} aria-label="Next month" className="h-11 w-11 rounded-xl bg-dark-card text-xl text-gold ring-1 ring-gold/25 transition hover:ring-gold/60">
          ›
        </button>
      </div>

      {error && <p role="alert" className="mb-3 text-sm text-red-300">{error}</p>}

      <div className={`grid grid-cols-7 gap-px overflow-hidden rounded-2xl border border-gold/20 bg-gold/10 shadow-lg shadow-black/20 ${loading ? 'opacity-60' : ''}`}>
        {WEEKDAYS.map((d) => (
          <div key={d} className="bg-dark py-2 text-center text-[11px] font-semibold uppercase tracking-wider text-warm-muted">
            {d}
          </div>
        ))}
        {grid.map((day) => {
          const inMonth = day.slice(0, 7) === month.slice(0, 7)
          const list = dayBookings(day)
          const isSelected = day === selected
          return (
            <button
              key={day}
              type="button"
              onClick={() => setSelected(day)}
              aria-label={`${formatLongDay(day)}, ${list.length} booking${list.length === 1 ? '' : 's'}`}
              aria-pressed={isSelected}
              className={`flex min-h-14 flex-col items-stretch gap-0.5 p-1 text-left md:min-h-24 md:p-1.5 ${inMonth ? 'bg-dark-card' : 'bg-dark'} ${isSelected ? 'ring-2 ring-inset ring-gold' : ''}`}
            >
              <span
                className={`flex h-6 w-6 items-center justify-center self-start rounded-full text-xs ${day === today ? 'bg-gold font-bold text-dark' : inMonth ? 'text-cream' : 'text-warm-muted/50'}`}
              >
                {Number(day.slice(8))}
              </span>
              {/* Phones: just a count; desktop: guest names. */}
              {list.length > 0 && (
                <>
                  <span className="mx-auto min-w-5 rounded-full bg-gold px-1.5 text-center text-[11px] font-bold text-dark md:hidden">{list.length}</span>
                  <span className="hidden space-y-0.5 md:block">
                    {list.slice(0, 2).map((b) => (
                      <span key={b.id} className={`block truncate rounded px-1.5 py-0.5 text-[11px] font-medium ${b.status === 'confirmed' ? 'bg-emerald-400/20 text-emerald-100' : 'bg-amber-400/20 text-amber-100'}`}>
                        {b.name}
                      </span>
                    ))}
                    {list.length > 2 && <span className="block text-[11px] text-warm-muted">+{list.length - 2} more</span>}
                  </span>
                </>
              )}
            </button>
          )
        })}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-warm-muted" aria-hidden>
        <span className="flex items-center gap-1.5"><span className={`h-2.5 w-2.5 rounded-full ${STATUS.new.bar}`} /> New</span>
        <span className="flex items-center gap-1.5"><span className={`h-2.5 w-2.5 rounded-full ${STATUS.confirmed.bar}`} /> Confirmed</span>
        <span className="md:hidden">Numbers show guests staying that night</span>
      </div>

      <h3 className="mb-3 mt-6 flex items-center gap-3 text-sm font-semibold uppercase tracking-wider text-gold">
        {formatLongDay(selected)}
        <span className="h-px flex-1 bg-gold/15" aria-hidden />
      </h3>
      <BookingList bookings={selectedBookings} today={today} empty="No guests on this day." emptyIcon="🛏️" />
    </section>
  )
}
