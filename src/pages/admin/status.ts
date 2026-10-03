import type { BookingStatus } from '../../lib/adminApi'

/** Tailwind classes need to appear as whole strings, so the three statuses are spelled out here once. */
export const STATUS: Record<BookingStatus, { label: string; badge: string; bar: string; active: string }> = {
  new: {
    label: 'New',
    badge: 'bg-amber-400/15 text-amber-200 ring-1 ring-amber-400/40',
    bar: 'bg-amber-400',
    active: 'bg-amber-400 text-dark',
  },
  confirmed: {
    label: 'Confirmed',
    badge: 'bg-emerald-400/15 text-emerald-200 ring-1 ring-emerald-400/40',
    bar: 'bg-emerald-400',
    active: 'bg-emerald-400 text-dark',
  },
  cancelled: {
    label: 'Cancelled',
    badge: 'bg-red-400/15 text-red-200 ring-1 ring-red-400/40',
    bar: 'bg-red-400/70',
    active: 'bg-red-400 text-dark',
  },
}
