export interface BookingRequest {
  name: string
  /** Optional. Without it only the hotel is emailed. */
  email?: string
  /** Digits including country code, as returned by react-phone-input-2 (e.g. 918790057559). */
  phone: string
  checkIn?: string
  checkOut?: string
  roomType?: string
  guests: string
  turnstileToken?: string | null
}

/**
 * Posts the booking to the Cloudflare Worker, which emails the guest (if an email was given) and the hotel (info@aaresidency.com, aaresidency5@gmail.com).
 * Resolves true only when the Worker confirms success; never throws, so callers can rely on WhatsApp as the fallback.
 */
export async function submitBooking(req: BookingRequest): Promise<boolean> {
  const apiUrl = import.meta.env.VITE_BOOKING_API_URL
  if (!apiUrl) return false
  try {
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({
        name: req.name,
        email: req.email ?? '',
        phone: `+${req.phone.replace(/\D/g, '')}`,
        arrival_date: req.checkIn ?? '',
        departure_date: req.checkOut ?? '',
        room_type: req.roomType || 'Not specified',
        adults: req.guests,
        children: '0',
        turnstile_token: req.turnstileToken ?? undefined,
      }),
    })
    const data = await res.json().catch(() => ({}))
    return res.ok && data.ok === true
  } catch {
    return false
  }
}
