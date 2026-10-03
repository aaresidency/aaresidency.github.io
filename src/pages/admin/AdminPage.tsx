import { useCallback, useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { ApiError, createAdminApi, type Booking, type BookingView } from '../../lib/adminApi'
import { AdminLogin } from './AdminLogin'
import { BookingList, type Grouping } from './BookingList'
import { CalendarView } from './CalendarView'
import { formatDay, formatLongDay } from './dates'
import { AdminApiContext, useAdminApi } from './session'

const TOKEN_KEY = 'aar_admin_token'
type Tab = BookingView | 'calendar'

const TABS: { id: Tab; label: string }[] = [
  { id: 'today', label: 'Today' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'past', label: 'Past' },
  { id: 'calendar', label: 'Calendar' },
  { id: 'all', label: 'All' },
]

const VIEW_INFO: Record<BookingView, { empty: string; icon: string; grouping: Grouping }> = {
  today: { empty: 'No guests arriving or staying today.', icon: '☀️', grouping: 'today' },
  upcoming: { empty: 'No upcoming bookings.', icon: '🗓️', grouping: 'date' },
  past: { empty: 'No past bookings yet.', icon: '📖', grouping: 'date' },
  all: { empty: 'No bookings yet. New website enquiries will appear here.', icon: '📥', grouping: 'none' },
}

function readToken(): string | null {
  try {
    const token = sessionStorage.getItem(TOKEN_KEY)
    if (!token) return null
    const { exp } = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))) as { exp?: number }
    return exp && exp * 1000 > Date.now() ? token : null
  } catch {
    return null
  }
}

interface Profile {
  name: string
  email: string
}

function readProfile(token: string): Profile {
  try {
    const p = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))) as { name?: string; email?: string }
    return { name: p.name ?? '', email: p.email ?? '' }
  } catch {
    return { name: '', email: '' }
  }
}

function storeToken(token: string | null) {
  try {
    if (token) sessionStorage.setItem(TOKEN_KEY, token)
    else sessionStorage.removeItem(TOKEN_KEY)
  } catch {
    /* private mode: the session just won't survive a reload */
  }
}

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(readToken)
  const [notice, setNotice] = useState('')

  const signOut = useCallback((message = '') => {
    storeToken(null)
    setToken(null)
    setNotice(message)
  }, [])

  const onToken = useCallback((idToken: string) => {
    storeToken(idToken)
    setNotice('')
    setToken(idToken)
  }, [])

  const api = useMemo(
    () => (token ? createAdminApi(token, () => signOut('Your session expired or this account is not allowed. Please sign in again.')) : null),
    [token, signOut],
  )

  return (
    <>
      <Helmet>
        <title>Admin | AA Residency</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      {api ? (
        <AdminApiContext.Provider value={api}>
          <Dashboard profile={readProfile(token!)} onSignOut={() => signOut()} />
        </AdminApiContext.Provider>
      ) : (
        <AdminLogin onToken={onToken} notice={notice} />
      )}
    </>
  )
}

function Dashboard({ onSignOut, profile }: { onSignOut: () => void; profile: Profile }) {
  const [tab, setTab] = useState<Tab>('today')
  const [query, setQuery] = useState('')
  const [term, setTerm] = useState('')
  const [today, setToday] = useState('')
  const api = useAdminApi()

  useEffect(() => {
    const id = setTimeout(() => setTerm(query.trim()), 300)
    return () => clearTimeout(id)
  }, [query])

  const searching = term.length >= 2

  const initial = (profile.name || profile.email || '?').charAt(0).toUpperCase()

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-4xl px-4 pb-20">
        <header className="flex items-center gap-3 py-5">
          <img src="/logo.png" alt="" width={44} height={44} className="h-11 w-11 rounded-xl ring-1 ring-gold/30" />
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-xl font-semibold leading-tight text-cream">AA Residency</h1>
            <p className="truncate text-sm text-warm-muted">{today ? <><span className="sm:hidden">{formatDay(today)}</span><span className="hidden sm:inline">{formatLongDay(today)}</span></> : 'Bookings dashboard'}</p>
          </div>
          <div className="flex items-center gap-2">
            <span
              title={profile.email}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/20 text-base font-semibold text-gold ring-1 ring-gold/30"
            >
              {initial}
            </span>
            <button type="button" onClick={onSignOut} className="min-h-10 rounded-lg border border-gold/30 px-3 text-sm text-gold-light transition hover:border-gold hover:bg-gold/10">
              Sign out
            </button>
          </div>
        </header>

        <div className="sticky top-0 z-10 -mx-4 space-y-3 bg-dark/90 px-4 pb-3 pt-2 backdrop-blur-md">
          <div className="relative">
            <svg className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-warm-muted" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
              <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="2" />
              <path d="M14 14l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, email or phone"
              aria-label="Search bookings by name, email or phone"
              autoComplete="off"
              enterKeyHint="search"
              className="h-13 w-full rounded-2xl border border-gold/25 bg-dark-card py-3.5 pl-12 pr-4 text-base text-cream shadow-inner placeholder:text-warm-muted/70 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
            />
          </div>
          {!searching && (
            <nav aria-label="Booking views" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  aria-current={tab === t.id ? 'page' : undefined}
                  className={`min-h-11 shrink-0 rounded-full px-5 text-[15px] font-semibold transition ${
                    tab === t.id ? 'bg-gold text-dark shadow-md shadow-gold/20' : 'bg-dark-card text-warm ring-1 ring-gold/20 hover:ring-gold/50'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </nav>
          )}
        </div>

      <main className="mt-4">
        {searching ? (
          <SearchResults term={term} onToday={setToday} today={today} api={api} />
        ) : tab === 'calendar' ? (
          <CalendarGate today={today} onToday={setToday} />
        ) : (
          <ViewList key={tab} view={tab} onToday={setToday} />
        )}
      </main>
      </div>
    </div>
  )
}

/** The calendar needs the hotel's "today"; fetch it once from a cheap list call if no other view has yet. */
function CalendarGate({ today, onToday }: { today: string; onToday: (d: string) => void }) {
  const api = useAdminApi()
  useEffect(() => {
    if (today) return
    api.list('today').then((r) => onToday(r.today)).catch(() => undefined)
  }, [api, today, onToday])
  return today ? <CalendarView today={today} /> : <Skeleton />
}

/** Runs `load` whenever its identity changes (wrap it in useCallback). Keeps the previous result visible while the next one loads. */
function useLoad<T>(load: () => Promise<T>) {
  const [result, setResult] = useState<{ load: () => Promise<T>; data: T | null; error: string } | null>(null)
  useEffect(() => {
    let stale = false
    load()
      .then((data) => !stale && setResult({ load, data, error: '' }))
      .catch((err) => !stale && setResult({ load, data: null, error: err instanceof ApiError ? err.message : 'Could not load bookings.' }))
    return () => {
      stale = true
    }
  }, [load])
  return { data: result?.data ?? null, error: result?.load === load ? result.error : '', loading: result?.load !== load }
}

function ViewList({ view, onToday }: { view: BookingView; onToday: (d: string) => void }) {
  const api = useAdminApi()
  const first = useLoad(useCallback(() => api.list(view), [api, view]))
  const [extra, setExtra] = useState<Booking[]>([])
  const [more, setMore] = useState<boolean | null>(null)
  const [loadingMore, setLoadingMore] = useState(false)
  const [moreError, setMoreError] = useState('')

  useEffect(() => {
    if (first.data) onToday(first.data.today)
  }, [first.data, onToday])

  if (first.error) return <p role="alert" className="text-sm text-red-300">{first.error}</p>
  if (!first.data) return <Skeleton />

  const bookings = [...first.data.bookings, ...extra]
  const hasMore = more ?? first.data.hasMore

  async function loadMore() {
    setLoadingMore(true)
    setMoreError('')
    try {
      const page = await api.list(view, bookings.length)
      setExtra((prev) => [...prev, ...page.bookings])
      setMore(page.hasMore)
    } catch (err) {
      setMoreError(err instanceof ApiError ? err.message : 'Could not load more.')
    } finally {
      setLoadingMore(false)
    }
  }

  return (
    <>
      {view === 'today' && <StatTiles bookings={bookings} today={first.data.today} />}
      <BookingList
        bookings={bookings}
        today={first.data.today}
        empty={VIEW_INFO[view].empty}
        emptyIcon={VIEW_INFO[view].icon}
        grouping={VIEW_INFO[view].grouping}
      />
      {hasMore && (
        <button type="button" onClick={loadMore} disabled={loadingMore} className="mt-5 min-h-12 w-full rounded-xl border border-gold/30 text-sm font-semibold text-gold-light transition hover:bg-gold/10 disabled:opacity-50">
          {loadingMore ? 'Loading…' : 'Load more'}
        </button>
      )}
      {moreError && <p role="alert" className="mt-2 text-sm text-red-300">{moreError}</p>}
    </>
  )
}

function SearchResults({ term, today, onToday, api }: { term: string; today: string; onToday: (d: string) => void; api: ReturnType<typeof useAdminApi> }) {
  const result = useLoad(useCallback(() => api.search(term), [api, term]))
  useEffect(() => {
    if (result.data) onToday(result.data.today)
  }, [result.data, onToday])

  if (result.error) return <p role="alert" className="text-sm text-red-300">{result.error}</p>
  if (!result.data) return <Skeleton />
  return (
    <>
      <p className="mb-3 text-sm text-warm-muted">
        {result.data.bookings.length} result{result.data.bookings.length === 1 ? '' : 's'} for “{term}”
      </p>
      <BookingList bookings={result.data.bookings} today={result.data.today || today} empty="No bookings match your search." emptyIcon="🔍" />
    </>
  )
}

function Skeleton() {
  return (
    <div className="space-y-3" aria-busy="true" aria-label="Loading">
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-24 animate-pulse rounded-2xl bg-dark-card ring-1 ring-gold/10" />
      ))}
    </div>
  )
}

function StatTiles({ bookings, today }: { bookings: Booking[]; today: string }) {
  const live = bookings.filter((b) => b.status !== 'cancelled')
  const arriving = live.filter((b) => b.arrival === today).length
  const tiles = [
    { label: 'Arriving today', value: arriving, tone: 'text-gold' },
    { label: 'In house', value: live.length - arriving, tone: 'text-emerald-300' },
    { label: 'Awaiting confirmation', value: live.filter((b) => b.status === 'new').length, tone: 'text-amber-200' },
  ]
  return (
    <div className="mb-6 grid grid-cols-3 gap-3">
      {tiles.map((t) => (
        <div key={t.label} className="rounded-2xl bg-dark-card p-3 text-center ring-1 ring-gold/15 sm:p-4">
          <div className={`text-3xl font-bold leading-none sm:text-4xl ${t.tone}`}>{t.value}</div>
          <div className="mt-2 text-xs leading-tight text-warm-muted sm:text-sm">{t.label}</div>
        </div>
      ))}
    </div>
  )
}
