# AA Residency booking API (Cloudflare Worker + Resend)

This Worker accepts JSON booking submissions from the static site, generates a server-side booking reference, and sends HTML emails to staff and to the guest via [Resend](https://resend.com/).

## 1. Prereqs

- Cloudflare account (Workers enabled)
- Resend account and API key
- Optionally: verified sending domain in Resend (recommended for production). Until then you can test with Resend’s sandbox sender documented in Resend onboarding.

## 2. Configure `wrangler.toml`

Edit **`[vars]`** in `wrangler.toml`:

- **`ADMIN_EMAIL`** — address that receives enquiries (Resend sends admin mail here; customer mail uses `reply_to` of this email).
- **`ALLOWED_ORIGINS`** — comma-separated list of origins allowed for browser `fetch` CORS **without spaces** around commas. Include every place the site runs, for example production `https://aaresidency.com`, `https://www.aaresidency.com`, GitHub Pages origin if applicable, and `http://localhost:8080` (or whatever you use locally with Eleventy).
- **`FROM_EMAIL_RESEND`** — verified identity in Resend, e.g. `AA Residency <booking@mail.aaresidency.com>`.
- **`ADMIN_WHATSAPP_E164`** — digits only (`919992999961`); used in acknowledgement email and admin WhatsApp link.

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

## 5. Wire the Eleventy site

Set **`BOOKING_API_URL`** during `npm run build` to that Worker URL exactly (matching what the browser will call). Example GitHub Actions: add repo secret **`BOOKING_API_URL`** and pass it into the build step `env`:

```yaml
BOOKING_API_URL: ${{ secrets.BOOKING_API_URL }}
```

Rebuild and deploy the site after the Worker is live.

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
