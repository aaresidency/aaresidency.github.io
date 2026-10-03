import { useEffect, useRef, useState } from 'react'
import { GOOGLE_CLIENT_ID } from '../../lib/adminApi'

interface GoogleId {
  initialize: (config: { client_id: string; callback: (r: { credential: string }) => void; auto_select?: boolean }) => void
  renderButton: (el: HTMLElement, options: Record<string, string | number>) => void
}
declare global {
  interface Window {
    google?: { accounts: { id: GoogleId } }
  }
}

let gisLoading: Promise<void> | null = null
function loadGis(): Promise<void> {
  if (window.google?.accounts?.id) return Promise.resolve()
  gisLoading ??= new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = 'https://accounts.google.com/gsi/client'
    s.async = true
    s.onload = () => resolve()
    s.onerror = () => {
      gisLoading = null
      reject(new Error('Could not load Google Sign-In'))
    }
    document.head.appendChild(s)
  })
  return gisLoading
}

export function AdminLogin({ onToken, notice }: { onToken: (idToken: string) => void; notice?: string }) {
  const button = useRef<HTMLDivElement>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return
    let cancelled = false
    loadGis()
      .then(() => {
        if (cancelled || !button.current || !window.google) return
        window.google.accounts.id.initialize({ client_id: GOOGLE_CLIENT_ID, callback: (r) => onToken(r.credential), auto_select: false })
        window.google.accounts.id.renderButton(button.current, { theme: 'filled_black', size: 'large', shape: 'pill', text: 'signin_with', width: 280 })
      })
      .catch((e: Error) => setError(e.message))
    return () => {
      cancelled = true
    }
  }, [onToken])

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col items-center justify-center gap-5 px-4 text-center">
      <img src="/logo.png" alt="" width={72} height={72} className="rounded-xl" />
      <div>
        <h1 className="text-2xl font-semibold text-cream">AA Residency Admin</h1>
        <p className="mt-1 text-sm text-warm-muted">Sign in with your Google account to view bookings.</p>
      </div>
      {notice && <p role="alert" className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">{notice}</p>}
      {GOOGLE_CLIENT_ID ? <div ref={button} className="min-h-11" /> : <p className="text-sm text-red-300">Google sign-in is not configured (VITE_GOOGLE_CLIENT_ID).</p>}
      {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
    </div>
  )
}
