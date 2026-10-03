# AA Residency booking API (Cloudflare Worker + Resend)

This Worker accepts JSON booking submissions from the static site, generates a server-side booking reference, and sends HTML emails to staff and to the guest via [Resend](https://resend.com/).

## 1. Prereqs

- Cloudflare account (Workers enabled)
- Resend account and API key
- Optionally: verified sending domain in Resend (recommended for production). Until then you can test with Resend’s sandbox sender documented in Resend onboarding.

## 2. Configure `wrangler.toml`

Edit **`[vars]`** in `wrangler.toml`:

- **`ADMIN_EMAIL`** — comma-separated addresses that receive every booking alert (currently `info@aaresidency.com,aaresidency5@gmail.com`). Customer mail uses the first address as `reply_to`.
- **`ALLOWED_ORIGINS`** — comma-separated list of origins allowed for browser `fetch` CORS **without spaces** around commas. Include every place the site runs, for example production `https://aaresidency.com`, `https://www.aaresidency.com`, GitHub Pages origin if applicable, and `http://localhost:8080` (or whatever you use locally with Eleventy).
- **`FROM_EMAIL_RESEND`** — verified identity in Resend, e.g. `AA Residency <booking@mail.aaresidency.com>`.
- **`ADMIN_WHATSAPP_E164`** — digits only (`918790057559`); used in acknowledgement email and admin WhatsApp link.

> [!IMPORTANT]
> `FROM_EMAIL_RESEND` must be a sender/domain that Resend accepts for your account.
> If you use `AA Residency <info@aaresidency.com>` before verifying the domain in Resend, booking requests can fail with `email_delivery_failed`.
> For temporary testing, use a Resend onboarding sender allowed by your account (for example `AA Residency <onboarding@resend.dev>`), then switch back after domain verification.

## 3. Secrets

From this directory:

```bash
npm install
npx wrangler login
npx wrangler secret put RESEND_API_KEY
```

Paste your Resend API key when prompted. Do **not** commit secrets.

## 4. Deploy

```bash
npx wrangler deploy
```

After deploy, note the Worker URL Cloudflare prints (something like `https://aaresidency-booking-api.<you>.workers.dev`).

HTTP **POST** the JSON body **to this Worker URL** (no trailing path segment is required—the handler accepts POST on `/`).

## 5. Wire the site

The React site reads **`VITE_BOOKING_API_URL`** (and **`VITE_TURNSTILE_SITE_KEY`** when Turnstile is on) at build time. `.github/workflows/pages.yml` maps them from the repo secrets **`BOOKING_API_URL`** and **`TURNSTILE_SITE_KEY`**.

### Local preview

Either:

- Run `npm run dev` in this folder (`wrangler dev`) and temporarily add `http://127.0.0.1:8787`-style origins to **`ALLOWED_ORIGINS`** **only while testing**, or  
- Tunnel / deploy the Worker once and point local Eleventy at the deployed Worker URL **and** add your local Eleventy origin (`http://localhost:8080`, etc.) to **`ALLOWED_ORIGINS`**.

## 6. Resend specifics

- **Customer email** (`to`): guest address; **`reply_to`**: `ADMIN_EMAIL`.
- **Admin email** (`to`): `ADMIN_EMAIL`; **`reply_to`**: guest address (so Reply in the mail client goes to them).

If outbound mail fails (domain not verified, bad `from`, etc.), the Worker responds with **`502`** and a JSON payload that includes minimal Resend error detail for troubleshooting in DevTools Network.

## Behaviour summary

| Item | Behaviour |
|------|-----------|
| CORS | Only origins in **`ALLOWED_ORIGINS`** can POST from the browser. |
| Spam | Hidden honeypot field **`website`**; if filled, returns **200** with `{ ok: true }` without sending mail. |
| Validation | Mirrors the site rules (dates, guests, Indian 10-digit phone, room type). |
| Payload size | Requests with **`Content-Length` &gt; 32 KiB** receive **413** (stops trivial oversized POST abuse). |
| Response headers | **`Cache-Control: no-store`**, **`X-Content-Type-Options: nosniff`**, **`Referrer-Policy`** on API responses. |
| Turnstile | If **`TURNSTILE_SECRET_KEY`** is set on the Worker, **`turnstile_token`** is required and verified (see **§9**). |

## 7. Booking flow reliability (checklist)

These items matter more than code tweaks for “does booking work in production?”.

| Check | Why |
|--------|-----|
| **`BOOKING_API_URL` GitHub secret** matches the live Worker URL | If unset, the site falls back to Web3Forms and `/Booking.html` never calls the Worker. |
| **`ALLOWED_ORIGINS`** lists every real browser origin | Wrong origin ⇒ browser blocks `fetch` (looks like a silent failure or console CORS error). Include `https://www.` vs apex if both exist. |
| **Resend domain verified + `FROM_EMAIL_RESEND` updated** | Sandbox accounts often cannot mail arbitrary guests until the domain is verified. |
| **`RESEND_API_KEY` secret** still valid after key rotation | Worker returns **500** if the secret is missing or wrong. |
| **Redeploy Worker after `wrangler.toml` edits** | Vars like `ADMIN_EMAIL` apply only after **`npx wrangler deploy`**. |

**Operational debugging**

- **`npx wrangler tail`** while submitting the form once — shows failures and Resend responses.
- **Browser DevTools → Network** — confirm POST to Worker returns **200** and JSON `{ ok: true, bookingRef }` (or read **`message`** on failure).

**Optional hardening (implemented vs documented)**

- **Cloudflare Turnstile** — optional; see **§9** below.
- **Rate limiting** — dashboard / WAF examples in **§10** (product-dependent).
- **Idempotent submits** (e.g. `Idempotency-Key` header) — not implemented; avoids duplicate emails on double-click / flaky networks.

## 8. Security headers (site vs Worker vs GitHub Pages)

**Booking Worker**

The Worker adds **`Cache-Control: no-store`**, **`X-Content-Type-Options: nosniff`**, and **`Referrer-Policy: strict-origin-when-cross-origin`** on booking API responses. CORS remains strict via **`ALLOWED_ORIGINS`**.

**Static site (`aaresidency.com` on GitHub Pages)**

GitHub Pages **does not let you set custom HTTP headers** (no CSP, HSTS, or `Permissions-Policy` at the edge for standard user/org Pages sites).

To add headers for HTML/CSS/JS assets you typically:

1. **Put Cloudflare (or another CDN/proxy) in front of the hostname** and use **Transform Rules** or **Workers** to attach headers such as:
   - **`Strict-Transport-Security`** (HSTS) — only after HTTPS is stable everywhere.
   - **`Content-Security-Policy`** — start report-only, then tighten (accounts for `googletagmanager.com`, Google Fonts, inline scripts if any).
   - **`Permissions-Policy`** — disable unused features (camera, mic, etc.).
   - **`X-Frame-Options: DENY`** or **`frame-ancestors`** inside CSP — reduces clickjacking risk.

2. Or migrate static hosting to **Cloudflare Pages**, where a **`_headers`** file in the published output can set per-path headers.

**What already helps**

- Form submits use **HTTPS** end-to-end when the site and Worker URLs are `https://`.
- **Secrets** (`RESEND_API_KEY`) live in Worker secrets, not in the repo.
- Booking endpoint rejects non-allowlisted **Origin** for browser `fetch`.

## 9. Cloudflare Turnstile (optional bot friction)

When the Worker secret **`TURNSTILE_SECRET_KEY`** is set, every booking POST must include a valid **`turnstile_token`** (verified server-side with Cloudflare). If the secret is **not** set, Turnstile is skipped so existing deployments keep working.

### Setup

1. In the [Cloudflare dashboard → Turnstile](https://dash.cloudflare.com/) (see also [Turnstile docs](https://developers.cloudflare.com/turnstile/get-started/)), create a widget for **`aaresidency.com`** (and **`localhost`** if you test locally).
2. **Worker:**  
   ```bash
   npx wrangler secret put TURNSTILE_SECRET_KEY
   ```  
   Paste the widget **Secret Key**.
3. **Site build:** expose the **Site Key** at build time (public):  
   - Local: `TURNSTILE_SITE_KEY=0x4AAA... npm run build`  
   - GitHub Actions: add repo secret **`TURNSTILE_SITE_KEY`** (workflow already passes it into `npm run build`).
4. Deploy Worker + redeploy Pages so **`Booking.html`** includes the widget only when both **`BOOKING_API_URL`** and **`TURNSTILE_SITE_KEY`** are set.

The booking page loads Turnstile only on the **Worker API** path (not the Web3Forms fallback).

## 10. Rate limiting (Cloudflare dashboard examples)

Exact products vary (**WAF Custom Rules**, **Rate limiting rules**, **Advanced Rate Limiting**) by plan. Point rules at your **Worker hostname** (e.g. `aaresidency-booking-api.*.workers.dev`) or the **custom domain** if you attach one.

**Example A — throttle POSTs (expression-style)**

```txt
(http.request.method eq "POST") and (http.host eq "YOUR-WORKER-HOSTNAME.workers.dev")
```

Action: **Block** or **Managed Challenge** after threshold (e.g. **100 requests / 10 minutes / IP**) — tune so legitimate guests are not blocked; start permissive.

**Example B — combine with path**

```txt
(http.request.method eq "POST") and (http.request.uri.path eq "/")
```

Use your real Worker route and host.

**Example C — geography (optional)**

If abuse comes from specific regions only, add `(ip.geoip.country eq "XX")` cautiously — risk of blocking VPN users.

Prefer **Managed Challenge** over hard block when unsure.

Monitor **Security → Events** after enabling rules.

## 11. Admin dashboard (`/admin`)

Staff sign in at `https://aaresidency.com/admin` with Google and can view today's / upcoming / past bookings, a calendar, search (name, email, phone), add private notes and set a status (new / confirmed / cancelled). "Today" = guests arriving today plus guests currently staying (IST).

Bookings are stored in **Cloudflare D1** (free tier). Every website booking is saved before the emails go out; a storage failure never blocks the booking.

### One-time setup

1. **Database**
   ```bash
   cd workers/booking-api
   npx wrangler d1 create aaresidency-bookings      # prints a database_id
   ```
   Paste the `database_id` into `wrangler.toml` (`[[d1_databases]]`), then:
   ```bash
   npm run db:migrate
   ```
2. **Google sign-in** — [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials → *Create credentials → OAuth client ID* → type **Web application**.
   - Authorized JavaScript origins: `https://aaresidency.com`, `https://www.aaresidency.com` (and `http://localhost:8080` for local testing).
   - No redirect URI is needed. If asked to configure the consent screen, choose **Internal** (Workspace) or External + add yourself as a test user.
   - Copy the **Client ID**.
3. **Worker** — set `GOOGLE_CLIENT_ID` in `wrangler.toml`, then choose who may enter (kept as a secret, not in git):
   ```bash
   npx wrangler secret put ADMIN_LOGIN_EMAILS     # e.g. you@aaresidency.com,aaresidency5@gmail.com
   npx wrangler deploy
   ```
4. **Site** — add the repo secret `GOOGLE_CLIENT_ID` (same Client ID) in GitHub → Settings → Secrets → Actions, then re-run the Pages deploy. For local dev put `VITE_GOOGLE_CLIENT_ID=...` and `VITE_BOOKING_API_URL=...` in `.env.local`.

### How access is enforced

Every `/admin/*` request carries the Google ID token; the Worker verifies its RS256 signature against Google's keys, the audience (your Client ID), issuer, expiry, and that the email is in `ADMIN_LOGIN_EMAILS`. The page itself is public JavaScript but shows no data without a valid token. Tokens last about an hour; after that the page asks the admin to sign in again. `/admin` is `noindex` and disallowed in `robots.txt`.

### API (all require `Authorization: Bearer <google id token>`)

| Route | Purpose |
|---|---|
| `GET /admin/bookings?view=today\|upcoming\|past\|all&offset=` | Paged lists (30 per page) |
| `GET /admin/bookings?from=YYYY-MM-DD&to=YYYY-MM-DD` | Bookings overlapping a date range (calendar) |
| `GET /admin/search?q=` | Name / email / reference / phone (digits, `+91` optional) |
| `GET /admin/bookings/:id` | Booking + notes |
| `POST /admin/bookings/:id/notes` `{note}` | Add a note |
| `PATCH /admin/bookings/:id` `{status}` | `new`, `confirmed`, `cancelled` |

Cost: D1 and Workers free tiers are far above a hotel's volume; Google sign-in is free.
