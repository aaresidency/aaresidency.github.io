// Trimmed: a trailing newline pasted into the repo secret makes Cloudflare reject the key and no token is ever issued.
export const TURNSTILE_SITE_KEY = (import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined)?.trim() || undefined

/** True when the booking forms show the "Verify you are human" check and must wait for it before submitting. */
export const turnstileRequired = Boolean(TURNSTILE_SITE_KEY)

export const TURNSTILE_PROMPT = "Please tick \"Verify you are human\" before booking."
