import { useCallback, useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { ApiError, createAdminApi, type Booking, type BookingView } from '../../lib/adminApi'
import { AdminLogin } from './AdminLogin'
import { BookingList } from './BookingList'
import { CalendarView } from './CalendarView'
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

const EMPTY: Record<BookingView, string> = {
  today: 'No guests arriving or staying today.',
  upcoming: 'No upcoming bookings.',
  past: 'No past bookings yet.',
  all: 'No bookings yet.',
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
          <Dashboard onSignOut={() => signOut()} />
        </AdminApiContext.Provider>
      ) : (
        <AdminLogin onToken={onToken} notice={notice} />
      )}
    </>
  )
}

function Dashboard({ onSignOut }: { onSignOut: () => void }) {
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

  return (
    <div className="mx-auto min-h-screen max-w-5xl px-4 pb-16">
      <header className="flex items-center justify-between gap-3 py-4">
        <h1 className="text-lg font-semibold text-cream">AA Residency · Bookings</h1>
        <button type="button" onClick={onSignOut} className="rounded-lg border border-gold/30 px-3 py-2 text-sm text-gold">
          Sign out
        </button>
      </header>

      <div className="sticky top-0 z-10 -mx-4 space-y-3 bg-dark/95 px-4 pb-3 pt-1 backdrop-blur">
        <div className="relative">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, email or phone"
            aria-label="Search bookings by name, email or phone"
            autoComplete="off"
            enterKeyHint="search"
            className="h-12 w-full rounded-xl border border-gold/30 bg-dark-card px-4 text-base text-cream placeholder:text-warm-muted/60 focus:border-gold focus:outline-none"
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
                className={`h-11 shrink-0 rounded-full border px-4 text-sm font-medium ${tab === t.id ? 'border-gold bg-gold text-dark' : 'border-gold/30 text-warm'}`}
              >
                {t.label}
              </button>
            ))}
          </nav>
        )}
      </div>

      <main className="mt-3">
        {searching ? (
          <SearchResults term={term} onToday={setToday} today={today} api={api} />
        ) : tab === 'calendar' ? (
          <CalendarGate today={today} onToday={setToday} />
        ) : (
          <ViewList key={tab} view={tab} onToday={setToday} />
        )}
      </main>
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
  return today ? <CalendarView today={today} /> : <p className="text-sm text-warm-muted">Loading…</p>
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
  if (!first.data) return <p className="text-sm text-warm-muted">Loading…</p>

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
      <BookingList bookings={bookings} today={first.data.today} empty={EMPTY[view]} />
      {hasMore && (
        <button type="button" onClick={loadMore} disabled={loadingMore} className="mt-4 h-11 w-full rounded-xl border border-gold/30 text-sm text-gold disabled:opacity-50">
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
  if (!result.data) return <p className="text-sm text-warm-muted">Searching…</p>
  return (
    <>
      <p className="mb-3 text-xs text-warm-muted">
        {result.data.bookings.length} result{result.data.bookings.length === 1 ? '' : 's'} for “{term}”
      </p>
      <BookingList bookings={result.data.bookings} today={result.data.today || today} empty="No bookings match your search." />
    </>
  )
}
