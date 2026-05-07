const RESEND_API = "https://api.resend.com/emails";

/**
 * Escapes minimal HTML-sensitive characters from user-supplied booking fields.
 * @param {string} unsafe
 */
function escapeHtml(unsafe) {
  const s = String(unsafe ?? "");
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function generateBookingReference() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const h = String(now.getUTCHours()).padStart(2, "0"); // deterministic worker-side
  const min = String(now.getUTCMinutes()).padStart(2, "0");
  const random = Math.floor(100 + Math.random() * 900);
  return `AAR-${y}${m}${d}-${h}${min}-${random}`;
}

function corsHeaders(env, origin) {
  /** @type {Record<string,string>} */
  const h = {
    Vary: "Origin",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
  const allow = normalizeAllowedOrigins(env.ALLOWED_ORIGINS);
  const allowOrigin = origin && allow.has(origin) ? origin : "";

  // If allowlist not configured securely, fallback to disallow all cross-origin browsers.
  if (!allowOrigin) {
    return h;
  }

  return { ...h, "Access-Control-Allow-Origin": allowOrigin };
}

/**
 * @param {string | undefined} raw
 */
function normalizeAllowedOrigins(raw) {
  const set = new Set();
  String(raw ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .forEach((o) => set.add(o.replace(/\/$/, ""))); // normalize trailing /
  return set;
}

/**
 * Rough room price hints for email context (mirror website copy).
 */
function roomPrice(roomType) {
  if (roomType === "A/C Deluxe") return "₹1,700 (incl. all taxes)";
  if (roomType === "Non-A/C Deluxe") return "₹1,200 (incl. all taxes)";
  return "—";
}

/** Ten-digit tail after optional country code 91 → "+91 xx xxx xxxxx" grouping for display only. */
function formatIndiaMobileWaLabel(e164digits) {
  const d = String(e164digits || "").replace(/\D/g, "");
  const tail10 = /^91\d{10}$/.test(d) ? d.slice(-10) : d.length >= 10 ? d.slice(-10) : "";
  if (!/^\d{10}$/.test(tail10)) return "+91";
  return `+91 ${tail10.slice(0, 5)} ${tail10.slice(5)}`;
}

function customerBookingEmailHtml(bookingRef, fields) {
  const name = escapeHtml(fields.name);
  const arrival = escapeHtml(fields.arrivalDate);
  const departure = escapeHtml(fields.departureDate);
  const roomType = escapeHtml(fields.roomType);
  const adults = escapeHtml(fields.adults);
  const children = escapeHtml(fields.children);
  const price = escapeHtml(fields.priceLabel);
  const phone = escapeHtml(fields.phone);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Booking acknowledgement</title>
</head>
<body style="margin:0;padding:0;background:#f8f6f2;font-family:Inter,Arial,sans-serif;color:#1f2937;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:26px 0;background:#f8f6f2;">
    <tr>
      <td align="center">
        <table width="640" cellpadding="0" cellspacing="0" style="max-width:640px;background:#ffffff;border:1px solid #efe9df;border-radius:16px;overflow:hidden;">
          <tr>
            <td style="background:#0f172a;padding:20px 22px;color:#fefce8;">
              <div style="font-family:'Cormorant Garamond',Georgia,serif;font-size:26px;line-height:1.1;font-weight:700;">AA Residency Tirupati</div>
              <div style="margin-top:10px;font-size:13px;color:#fde2b6;letter-spacing:0.06em;text-transform:uppercase;">Booking request received</div>
            </td>
          </tr>
          <tr>
            <td style="padding:22px;">
              <p style="margin:0 0 12px;line-height:1.6;font-size:16px;">Dear ${name},</p>
              <p style="margin:0 0 14px;line-height:1.65;font-size:15px;color:#374151;">
                Thank you for choosing AA Residency Tirupati. We received your booking request and will contact you shortly to confirm availability and next steps.
              </p>

              <table width="100%" cellpadding="12" cellspacing="0" style="border-collapse:collapse;background:#faf8f4;border:1px solid #efe9df;border-radius:12px;margin:16px 0;">
                <tr>
                  <td style="padding:12px;color:#64748b;font-size:13px;"><b style="color:#0f172a;">Booking reference</b></td>
                  <td style="padding:12px;"><b>${escapeHtml(bookingRef)}</b></td>
                </tr>
                <tr>
                  <td style="padding:12px;color:#64748b;font-size:13px;"><b style="color:#0f172a;">Arrival</b></td>
                  <td style="padding:12px;"><b>${arrival}</b></td>
                </tr>
                <tr>
                  <td style="padding:12px;color:#64748b;font-size:13px;"><b style="color:#0f172a;">Departure</b></td>
                  <td style="padding:12px;"><b>${departure}</b></td>
                </tr>
                <tr>
                  <td style="padding:12px;color:#64748b;font-size:13px;"><b style="color:#0f172a;">Room type</b></td>
                  <td style="padding:12px;"><b>${roomType}</b></td>
                </tr>
                <tr>
                  <td style="padding:12px;color:#64748b;font-size:13px;"><b style="color:#0f172a;">Indicative rate</b></td>
                  <td style="padding:12px;"><b>${price}</b></td>
                </tr>
                <tr>
                  <td style="padding:12px;color:#64748b;font-size:13px;"><b style="color:#0f172a;">Guests</b></td>
                  <td style="padding:12px;"><b>Adults:</b> ${adults} &nbsp;·&nbsp; <b>Children:</b> ${children}</td>
                </tr>
                <tr>
                  <td style="padding:12px;color:#64748b;font-size:13px;"><b style="color:#0f172a;">Phone provided</b></td>
                  <td style="padding:12px;"><b>+91 ${phone}</b></td>
                </tr>
              </table>

              <p style="margin:0;line-height:1.65;font-size:14px;color:#334155;">
                If anything looks incorrect or you want to amend dates, reply to this email or message us on WhatsApp:
                <a href="https://wa.me/${escapeHtml(fields.whatsappDigits)}" style="color:#0f172a;font-weight:700;text-decoration:none;">${escapeHtml(
                  fields.hotelWhatsAppLabel,
                )}</a>.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 22px;background:#f5f2eb;color:#475569;font-size:12px;line-height:1.55;">
              AA Residency Tirupati · Gollavani Gunta · Renigunta Road · Tirupati 517501 · India<br />
              Booking reference: ${escapeHtml(bookingRef)}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function adminBookingEmailHtml(bookingRef, fields) {
  const rows = [
    ["Booking reference", bookingRef],
    ["Guest name", fields.name],
    ["Email", fields.email],
    ["Phone", "+91 " + fields.phone],
    ["Arrival", fields.arrivalDate],
    ["Departure", fields.departureDate],
    ["Room type", fields.roomType],
    ["Room rate hint", fields.priceLabel],
    ["Adults", fields.adults],
    ["Children", fields.children],
    ["Notes / requests", fields.notes],
    ["Submitted at (UTC)", new Date().toISOString()],
  ];

  const tableRowsHtml = rows
    .map(
      ([label, val]) =>
        `<tr><td style="padding:10px;width:210px;color:#475569;"><b>${escapeHtml(label)}</b></td><td style="padding:10px;">${escapeHtml(
          val ?? "",
        )}</td></tr>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>New booking enquiry</title>
</head>
<body style="margin:0;padding:0;background:#ffffff;font-family:Inter,Arial,sans-serif;color:#0f172a;">
  <div style="max-width:720px;margin:0 auto;padding:18px;">
    <h1 style="margin:0;font-size:20px;line-height:1.2;color:#0f172a;">New booking enquiry</h1>
    <p style="margin:12px 0;color:#475569;line-height:1.6;"><b>${escapeHtml(bookingRef)}</b> — AA Residency website booking form</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e7e5e4;background:#fafafa;">
      ${tableRowsHtml}
    </table>

    <p style="margin:16px 0 0;line-height:1.6;color:#334155;font-size:14px;">
      Quick reply WhatsApp prefilled draft:
      <a href="${escapeHtml(fields.adminWhatsAppLink)}">Open WhatsApp</a>
    </p>
    <p style="margin:8px 0 0;line-height:1.6;color:#64748b;font-size:13px;">
      Tip: Reply-to is set to the guest email automatically in Resend.
    </p>
  </div>
</body>
</html>`;
}

async function sendResendMail(env, payload) {
  const res = await fetch(RESEND_API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  if (!res.ok) {
    try {
      return { ok: false, status: res.status, detail: JSON.parse(text) };
    } catch {
      return { ok: false, status: res.status, detail: text };
    }
  }
  try {
    return { ok: true, status: res.status, detail: JSON.parse(text) };
  } catch {
    return { ok: true, status: res.status, detail: {} };
  }
}

function extractResendMessage(result) {
  if (!result || result.ok) return "";
  const detail = result.detail;
  if (typeof detail === "string" && detail.trim()) return detail.trim();
  if (!detail || typeof detail !== "object") return "";
  if (typeof detail.message === "string" && detail.message.trim()) return detail.message.trim();
  if (typeof detail.error === "string" && detail.error.trim()) return detail.error.trim();
  if (typeof detail.name === "string" && detail.name.trim()) return detail.name.trim();
  return "";
}

export default {
  async fetch(request, env) {
    const originHeader = request.headers.get("Origin") || "";
    const cors = corsHeaders(env, originHeader);

    if (request.method === "OPTIONS") {
      return new Response("", { headers: cors });
    }

    if (request.method !== "POST") {
      return new Response("method not allowed", { status: 405, headers: cors });
    }

    if (!cors["Access-Control-Allow-Origin"]) {
      return new Response("Forbidden", { status: 403 });
    }

    if (!env.RESEND_API_KEY) {
      return new Response(JSON.stringify({ ok: false, error: "RESEND_API_KEY is not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...cors },
      });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ ok: false, error: "invalid json" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...cors },
      });
    }

    // Honeypot (bots commonly fill hidden fields).
    const hp = body?.website || body?.website_url || "";
    if (typeof hp === "string" && hp.trim().length > 0) {
      return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { "Content-Type": "application/json", ...cors } });
    }

    /** @type {string} */
    const name = String(body?.name ?? "").trim();
    /** @type {string} */
    const email = String(body?.email ?? "").trim().toLowerCase();
    /** @type {string} */
    const phoneDigits = String(body?.phone ?? "").replace(/\s+/g, "");
    /** @type {string} */
    const arrivalDate = String(body?.arrival_date ?? "").trim();
    /** @type {string} */
    const departureDate = String(body?.departure_date ?? "").trim();
    /** @type {string} */
    const roomType = String(body?.room_type ?? "").trim();
    /** @type {string} */
    const adults = String(body?.adults ?? "").trim();
    /** @type {string} */
    const children = String(body?.children ?? "").trim();
    /** @type {string} */
    const notesRaw = body?.notes == null ? "" : String(body.notes);
    const notes = notesRaw.trim() || "(none)";

    if (!name || name.length > 160) return badRequest(cors, { error: "invalid name" });

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!email || !emailOk || email.length > 254) return badRequest(cors, { error: "invalid email" });

    if (!/^[0-9]{10}$/.test(phoneDigits)) return badRequest(cors, { error: "invalid phone" });

    if (!roomType || (roomType !== "A/C Deluxe" && roomType !== "Non-A/C Deluxe")) {
      return badRequest(cors, { error: "invalid room type" });
    }

    const a = Number(adults);
    const c = Number(children);
    if (!(a >= 1 && a <= 10) || !(c >= 0 && c <= 10)) return badRequest(cors, { error: "invalid guest counts" });

    if (!isIsoDate(arrivalDate) || !isIsoDate(departureDate)) return badRequest(cors, { error: "invalid dates" });
    const ar = parseIsoDateUtc(arrivalDate);
    const de = parseIsoDateUtc(departureDate);
    if (!ar || !de || de <= ar) return badRequest(cors, { error: "invalid stay range" });

    const bookingRef = generateBookingReference();
    const priceLabel = roomPrice(roomType);

    /** @type {{name:string;email:string;phone:string;arrivalDate:string;departureDate:string;roomType:string;adults:string;children:string;notes:string;priceLabel:string;whatsappDigits:string;hotelWhatsAppLabel:string;adminWhatsAppLink:string}} */
    const waDigits = String(env.ADMIN_WHATSAPP_E164 ?? "919992999961").replace(/[^\d]/g, "");
    const fields = {
      name,
      email,
      phone: phoneDigits,
      arrivalDate,
      departureDate,
      roomType,
      adults: String(adults),
      children: String(children),
      notes,
      priceLabel,
      whatsappDigits: waDigits,
      hotelWhatsAppLabel: formatIndiaMobileWaLabel(waDigits),
      adminWhatsAppLink: "",
    };

    const msgTxt = encodeURIComponent(
      [
        `New booking (${bookingRef})`,
        `Guest: ${name}`,
        `Phone: +91 ${phoneDigits}`,
        `Dates: ${arrivalDate} → ${departureDate}`,
        `Room: ${roomType}`,
        `Guests: A${adults}/C${children}`,
        "",
        notes,
      ].join("\n"),
    );
    fields.adminWhatsAppLink = `https://wa.me/${fields.whatsappDigits}?text=${msgTxt}`;

    const adminTo = env.ADMIN_EMAIL || "info@aaresidency.com";

    const from = env.FROM_EMAIL_RESEND || "AA Residency <onboarding@resend.dev>";

    const customerHtml = customerBookingEmailHtml(bookingRef, fields);
    const adminHtml = adminBookingEmailHtml(bookingRef, fields);

    const [customerSent, adminSent] = await Promise.all([
      sendResendMail(env, {
        from,
        to: [email],
        reply_to: adminTo,
        subject: `${bookingRef} — We received your booking request`,
        html: customerHtml,
      }),
      sendResendMail(env, {
        from,
        to: [adminTo],
        reply_to: email,
        subject: `New Booking Enquiry [${bookingRef}] — ${name}`,
        html: adminHtml,
      }),
    ]);

    // If either fails (domain verification/resend onboarding), bubble up minimally for debugging inside worker logs too.
    if (!customerSent.ok || !adminSent.ok) {
      const customerMsg = extractResendMessage(customerSent);
      const adminMsg = extractResendMessage(adminSent);
      const message = customerMsg || adminMsg || "Unable to deliver email. Please verify Resend sender/domain setup.";
      return new Response(
        JSON.stringify({
          ok: false,
          bookingRef,
          error: "email_delivery_failed",
          message,
          customer: customerSent,
          admin: adminSent,
        }),
        {
          status: 502,
          headers: { "Content-Type": "application/json", ...cors },
        },
      );
    }

    return new Response(JSON.stringify({ ok: true, bookingRef }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...cors },
    });
  },
};

/** @param {Record<string,string>} cors @param {{error:string}} body */
function badRequest(cors, body) {
  return new Response(JSON.stringify(body), { status: 400, headers: { "Content-Type": "application/json", ...cors } });
}

function isIsoDate(s) {
  return /^\d{4}-\d{2}-\d{2}$/.test(s);
}

function parseIsoDateUtc(s) {
  const ms = Date.parse(`${s}T00:00:00.000Z`);
  return Number.isFinite(ms) ? ms : NaN;
}
