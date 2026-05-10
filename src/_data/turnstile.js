/**
 * Optional Cloudflare Turnstile site key (public). Set at build time, e.g. GitHub Actions:
 *   TURNSTILE_SITE_KEY: ${{ secrets.TURNSTILE_SITE_KEY }}
 * Must match the Worker secret TURNSTILE_SECRET_KEY (Turnstile dashboard → site → secret key).
 */
export default function () {
  return {
    siteKey: (process.env.TURNSTILE_SITE_KEY || "").trim(),
  };
}
