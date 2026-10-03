export type BookingStatus = 'new' | 'confirmed' | 'cancelled'
export type BookingView = 'today' | 'upcoming' | 'past' | 'all'

export interface Booking {
  id: number
  ref: string
  name: string
  email: string
  phone: string
  arrival: string | null
  departure: string | null
  room_type: string
  adults: number
  children: number
  guest_notes: string
  status: BookingStatus
  created_at: string
  note_count: number
}

export interface AdminNote {
  id: number
  note: string
  author_email: string
  created_at: string
}

export interface BookingList {
  bookings: Booking[]
  hasMore: boolean
  /** Today's date at the hotel (IST), YYYY-MM-DD, so the UI never depends on the device clock/timezone. */
  today: string
}

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export const GOOGLE_CLIENT_ID: string = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? ''
const BASE: string = (import.meta.env.VITE_BOOKING_API_URL ?? '').replace(/\/+$/, '')

/** Admin endpoints for one signed-in session; `onUnauthorized` fires when the Worker rejects the token (expired). */
export function createAdminApi(token: string, onUnauthorized: () => void) {
  async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
    if (!BASE) throw new ApiError(0, 'Booking API is not configured (VITE_BOOKING_API_URL).')
    let res: Response
    try {
      res = await fetch(`${BASE}${path}`, {
        ...init,
        headers: {
          Authorization: `Bearer ${token}`,
          ...(init.body ? { 'Content-Type': 'application/json' } : {}),
        },
      })
    } catch {
      throw new ApiError(0, 'Network error. Check your connection and try again.')
    }
    const data = await res.json().catch(() => ({}))
    if (res.status === 401) onUnauthorized()
    if (!res.ok) throw new ApiError(res.status, data.message ?? data.error ?? `Request failed (${res.status})`)
    return data as T
  }

  return {
    list: (view: BookingView, offset = 0) => request<BookingList>(`/admin/bookings?view=${view}&offset=${offset}`),
    range: (from: string, to: string) => request<BookingList>(`/admin/bookings?from=${from}&to=${to}`),
    search: (q: string) => request<BookingList>(`/admin/search?q=${encodeURIComponent(q)}`),
    detail: (id: number) => request<{ booking: Booking; notes: AdminNote[] }>(`/admin/bookings/${id}`),
    addNote: (id: number, note: string) =>
      request<{ note: AdminNote }>(`/admin/bookings/${id}/notes`, { method: 'POST', body: JSON.stringify({ note }) }),
    setStatus: (id: number, status: BookingStatus) =>
      request<{ ok: true }>(`/admin/bookings/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  }
}

export type AdminApi = ReturnType<typeof createAdminApi>
