import { useEffect, useRef } from 'react'

interface TurnstileApi {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string
  reset: (widgetId?: string) => void
  remove: (widgetId?: string) => void
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}

const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined
const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

let scriptPromise: Promise<void> | null = null
function loadScript() {
  scriptPromise ??= new Promise<void>((resolve, reject) => {
    const s = document.createElement('script')
    s.src = SCRIPT_SRC
    s.async = true
    s.onload = () => resolve()
    s.onerror = () => reject(new Error('Turnstile failed to load'))
    document.head.appendChild(s)
  })
  return scriptPromise
}

interface TurnstileProps {
  onToken: (token: string | null) => void
  /** Change this value to clear the current token and re-run the challenge (tokens are single-use). */
  resetSignal?: number
}

/** Cloudflare Turnstile widget. Renders nothing when VITE_TURNSTILE_SITE_KEY is not set. */
export function Turnstile({ onToken, resetSignal = 0 }: TurnstileProps) {
  const box = useRef<HTMLDivElement>(null)
  const widgetId = useRef<string | undefined>(undefined)
  const onTokenRef = useRef(onToken)

  useEffect(() => {
    onTokenRef.current = onToken
  })

  useEffect(() => {
    if (!SITE_KEY || !box.current) return
    let cancelled = false
    loadScript()
      .then(() => {
        if (cancelled || !box.current || !window.turnstile) return
        widgetId.current = window.turnstile.render(box.current, {
          sitekey: SITE_KEY,
          callback: (token: string) => onTokenRef.current(token),
          'expired-callback': () => onTokenRef.current(null),
          'error-callback': () => onTokenRef.current(null),
        })
      })
      .catch(() => onTokenRef.current(null))
    return () => {
      cancelled = true
      if (widgetId.current) window.turnstile?.remove(widgetId.current)
    }
  }, [])

  useEffect(() => {
    if (resetSignal && widgetId.current) {
      onTokenRef.current(null)
      window.turnstile?.reset(widgetId.current)
    }
  }, [resetSignal])

  if (!SITE_KEY) return null
  return <div ref={box} />
}
