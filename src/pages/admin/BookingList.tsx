import type { Booking } from '../../lib/adminApi'
import { BookingCard } from './BookingCard'
import { formatDay } from './dates'

export type Grouping = 'today' | 'date' | 'none'

interface Props {
  bookings: Booking[]
  today: string
  empty: string
  emptyIcon?: string
  grouping?: Grouping
}

interface Group {
  key: string
  title: string
  items: Booking[]
}

function group(bookings: Booking[], today: string, grouping: Grouping): Group[] {
  if (grouping === 'none') return [{ key: 'all', title: '', items: bookings }]

  const map = new Map<string, Group>()
  for (const b of bookings) {
    let key: string
    let title: string
    if (grouping === 'today') {
      const arriving = b.arrival === today
      key = arriving ? 'arriving' : 'house'
      title = arriving ? 'Arriving today' : 'Staying in house'
    } else {
      key = b.arrival ?? 'none'
      title = b.arrival ? formatDay(b.arrival) : 'No dates given'
    }
    const g = map.get(key) ?? { key, title, items: [] }
    g.items.push(b)
    map.set(key, g)
  }
  const groups = [...map.values()]
  // Today's arrivals are the actionable ones, so they come before guests already in house.
  return grouping === 'today' ? groups.sort((a, b) => Number(b.key === 'arriving') - Number(a.key === 'arriving')) : groups
}

export function BookingList({ bookings, today, empty, emptyIcon = '🗓️', grouping = 'none' }: Props) {
  if (bookings.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gold/25 px-6 py-12 text-center">
        <div className="text-4xl" aria-hidden>{emptyIcon}</div>
        <p className="mt-3 text-base text-warm">{empty}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {group(bookings, today, grouping).map((g) => (
        <section key={g.key} aria-label={g.title || undefined}>
          {g.title && (
            <h2 className="mb-3 flex items-center gap-3 text-sm font-semibold uppercase tracking-wider text-gold">
              {g.title}
              <span className="rounded-full bg-gold/15 px-2 py-0.5 text-xs text-gold-light">{g.items.length}</span>
              <span className="h-px flex-1 bg-gold/15" aria-hidden />
            </h2>
          )}
          <ul className="space-y-3">
            {g.items.map((b) => (
              <BookingCard key={b.id} booking={b} today={today} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
