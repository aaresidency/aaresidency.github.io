import type { Booking } from '../../lib/adminApi'
import { BookingCard } from './BookingCard'

interface Props {
  bookings: Booking[]
  today: string
  empty: string
}

export function BookingList({ bookings, today, empty }: Props) {
  if (bookings.length === 0) return <p className="rounded-xl border border-gold/15 p-6 text-center text-sm text-warm-muted">{empty}</p>
  return (
    <ul className="space-y-3">
      {bookings.map((b) => (
        <BookingCard key={b.id} booking={b} today={today} />
      ))}
    </ul>
  )
}
