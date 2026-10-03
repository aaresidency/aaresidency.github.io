const DAY_MS = 86_400_000

const toMs = (iso: string) => Date.parse(`${iso}T00:00:00Z`)

export const addDays = (iso: string, n: number) => new Date(toMs(iso) + n * DAY_MS).toISOString().slice(0, 10)

export function nights(arrival: string | null, departure: string | null): number | null {
  return arrival && departure ? Math.round((toMs(departure) - toMs(arrival)) / DAY_MS) : null
}

const dayFmt = new Intl.DateTimeFormat('en-IN', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' })
const longDayFmt = new Intl.DateTimeFormat('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
const monthFmt = new Intl.DateTimeFormat('en-IN', { month: 'long', year: 'numeric', timeZone: 'UTC' })
const stampFmt = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Kolkata' })

export const formatDay = (iso: string) => dayFmt.format(toMs(iso))
export const formatLongDay = (iso: string) => longDayFmt.format(toMs(iso))
export const formatMonth = (iso: string) => monthFmt.format(toMs(iso))
export const formatStamp = (utcIso: string) => stampFmt.format(new Date(utcIso))

/** First of the month for `iso`, shifted by `delta` months. */
export function shiftMonth(iso: string, delta: number): string {
  const d = new Date(toMs(iso))
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + delta, 1)).toISOString().slice(0, 10)
}

/** Mon-first grid of ISO dates covering the month starting at `monthStart` (always whole weeks). */
export function monthGrid(monthStart: string): string[] {
  const first = new Date(toMs(monthStart))
  const lead = (first.getUTCDay() + 6) % 7
  const daysInMonth = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0)).getUTCDate()
  const total = Math.ceil((lead + daysInMonth) / 7) * 7
  return Array.from({ length: total }, (_, i) => addDays(monthStart, i - lead))
}

const partsFmt = new Intl.DateTimeFormat('en-IN', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' })

/** Pieces for the little calendar-leaf badge on cards, e.g. { weekday: 'Sat', day: '3', month: 'Oct' }. */
export function dayParts(iso: string) {
  const get = (type: string) => partsFmt.formatToParts(toMs(iso)).find((p) => p.type === type)?.value ?? ''
  return { weekday: get('weekday'), day: get('day'), month: get('month') }
}
