import { AuthError, verifyAdmin } from "./auth.js";

const PAGE_SIZE = 30;
const CALENDAR_LIMIT = 500;
const SEARCH_LIMIT = 50;
const MAX_NOTE_LENGTH = 2000;
const STATUSES = new Set(["new", "confirmed", "cancelled"]);

const LIST_COLUMNS = `b.id, b.ref, b.name, b.email, b.phone, b.arrival, b.departure, b.room_type, b.adults, b.children,
  b.guest_notes, b.status, b.created_at,
  (SELECT COUNT(*) FROM admin_notes n WHERE n.booking_id = b.id) AS note_count`;

/** Today's date in India (the hotel's calendar), as YYYY-MM-DD. */
function todayIst() {
  return new Date(Date.now() + 5.5 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

/** @param {string | null} s */
function isIsoDate(s) {
  return !!s && /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(`${s}T00:00:00Z`));
}

/** Escapes LIKE wildcards so "100%" or "a_b" search literally. */
function likePattern(q) {
  return `%${q.replace(/[\\%_]/g, (c) => `\\${c}`)}%`;
}

/**
 * @param {unknown} data @param {number} status @param {Record<string,string>} headers
 */
function json(data, status, headers) {
  return new Response(JSON.stringify(data), { status, headers: { ...headers, "Content-Type": "application/json" } });
}

/** Lists bookings for a named view, one extra row fetched to tell if more pages exist. */
async function listByView(db, view, offset) {
  const today = todayIst();
  let where;
  let order;
  let binds;
  switch (view) {
    case "today": // arriving today, or arrived earlier and still staying
      where = "(b.arrival = ? OR (b.arrival < ? AND b.departure > ?))";
      order = "b.arrival ASC, b.id ASC";
      binds = [today, today, today];
      break;
    case "upcoming":
      where = "b.arrival > ?";
      order = "b.arrival ASC, b.id ASC";
      binds = [today];
      break;
    case "past":
      where = "b.arrival < ? AND (b.departure IS NULL OR b.departure <= ?)";
      order = "b.arrival DESC, b.id DESC";
      binds = [today, today];
      break;
    case "all":
      where = "1 = 1";
      order = "b.created_at DESC, b.id DESC";
      binds = [];
      break;
    default:
      return null;
  }
  const { results } = await db
    .prepare(`SELECT ${LIST_COLUMNS} FROM bookings b WHERE ${where} ORDER BY ${order} LIMIT ? OFFSET ?`)
    .bind(...binds, PAGE_SIZE + 1, offset)
    .all();
  return { bookings: results.slice(0, PAGE_SIZE), hasMore: results.length > PAGE_SIZE, today };
}

/** Bookings whose stay overlaps [from, to] (departure day itself is free, so it is excluded). */
async function listByRange(db, from, to) {
  const { results } = await db
    .prepare(
      `SELECT ${LIST_COLUMNS} FROM bookings b
       WHERE b.arrival IS NOT NULL AND b.arrival <= ? AND (b.departure > ? OR (b.departure IS NULL AND b.arrival >= ?))
       ORDER BY b.arrival ASC, b.id ASC LIMIT ?`,
    )
    .bind(to, from, from, CALENDAR_LIMIT)
    .all();
  return { bookings: results, hasMore: false, today: todayIst() };
}

async function search(db, q) {
  const text = likePattern(q.toLowerCase());
  const conditions = ["LOWER(b.name) LIKE ? ESCAPE '\\'", "LOWER(b.email) LIKE ? ESCAPE '\\'", "LOWER(b.ref) LIKE ? ESCAPE '\\'"];
  const binds = [text, text, text];

  // Phone: compare digits only; a typed "+91 …" also matches numbers stored without the country code.
  const digits = q.replace(/\D/g, "");
  if (digits.length >= 3) {
    conditions.push("b.phone_digits LIKE ?");
    binds.push(`%${digits}%`);
    if (digits.startsWith("91") && digits.length > 4) {
      conditions.push("b.phone_digits LIKE ?");
      binds.push(`%${digits.slice(2)}%`);
    }
  }

  const { results } = await db
    .prepare(`SELECT ${LIST_COLUMNS} FROM bookings b WHERE ${conditions.join(" OR ")} ORDER BY b.created_at DESC LIMIT ?`)
    .bind(...binds, SEARCH_LIMIT)
    .all();
  return { bookings: results, hasMore: false, today: todayIst() };
}

async function getBooking(db, id) {
  const booking = await db.prepare(`SELECT ${LIST_COLUMNS} FROM bookings b WHERE b.id = ?`).bind(id).first();
  if (!booking) return null;
  const { results: notes } = await db
    .prepare("SELECT id, note, author_email, created_at FROM admin_notes WHERE booking_id = ? ORDER BY created_at DESC, id DESC")
    .bind(id)
    .all();
  return { booking, notes };
}

/**
 * Handles every /admin/* request. `cors` already carries Access-Control-Allow-Origin for an allowlisted origin.
 * @param {Request} request @param {any} env @param {Record<string,string>} cors @param {URL} url
 */
export async function handleAdmin(request, env, cors, url) {
  if (!env.DB) return json({ error: "database_not_configured" }, 500, cors);

  const auth = request.headers.get("Authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  if (!token) return json({ error: "unauthorized", message: "Sign in required" }, 401, cors);

  let email;
  try {
    email = await verifyAdmin(token, env);
  } catch (err) {
    if (err instanceof AuthError) return json({ error: err.status === 403 ? "forbidden" : "unauthorized", message: err.message }, err.status, cors);
    console.error("admin auth failure", err);
    return json({ error: "unauthorized", message: "Could not verify sign-in" }, 401, cors);
  }

  const path = url.pathname.replace(/\/+$/, "");
  const { method } = request;
  const db = env.DB;

  try {
    if (method === "GET" && path === "/admin/me") return json({ email }, 200, cors);

    if (method === "GET" && path === "/admin/bookings") {
      const from = url.searchParams.get("from");
      const to = url.searchParams.get("to");
      if (from || to) {
        if (!isIsoDate(from) || !isIsoDate(to)) return json({ error: "invalid_range" }, 400, cors);
        return json(await listByRange(db, from, to), 200, cors);
      }
      const offset = Math.max(0, Number.parseInt(url.searchParams.get("offset") ?? "0", 10) || 0);
      const result = await listByView(db, url.searchParams.get("view") ?? "today", offset);
      return result ? json(result, 200, cors) : json({ error: "invalid_view" }, 400, cors);
    }

    if (method === "GET" && path === "/admin/search") {
      const q = (url.searchParams.get("q") ?? "").trim().slice(0, 100);
      if (q.length < 2) return json({ bookings: [], hasMore: false, today: todayIst() }, 200, cors);
      return json(await search(db, q), 200, cors);
    }

    const match = path.match(/^\/admin\/bookings\/(\d+)(\/notes)?$/);
    if (match) {
      const id = Number(match[1]);

      if (!match[2] && method === "GET") {
        const found = await getBooking(db, id);
        return found ? json(found, 200, cors) : json({ error: "not_found" }, 404, cors);
      }

      if (!match[2] && method === "PATCH") {
        const body = await request.json().catch(() => ({}));
        if (!STATUSES.has(body?.status)) return json({ error: "invalid_status" }, 400, cors);
        const res = await db.prepare("UPDATE bookings SET status = ? WHERE id = ?").bind(body.status, id).run();
        if (!res.meta.changes) return json({ error: "not_found" }, 404, cors);
        return json({ ok: true }, 200, cors);
      }

      if (match[2] && method === "POST") {
        const body = await request.json().catch(() => ({}));
        const note = String(body?.note ?? "").trim();
        if (!note) return json({ error: "empty_note" }, 400, cors);
        if (note.length > MAX_NOTE_LENGTH) return json({ error: "note_too_long" }, 400, cors);
        const exists = await db.prepare("SELECT 1 FROM bookings WHERE id = ?").bind(id).first();
        if (!exists) return json({ error: "not_found" }, 404, cors);
        const created = await db
          .prepare("INSERT INTO admin_notes (booking_id, note, author_email) VALUES (?, ?, ?) RETURNING id, note, author_email, created_at")
          .bind(id, note, email)
          .first();
        return json({ note: created }, 201, cors);
      }
    }

    return json({ error: "not_found" }, 404, cors);
  } catch (err) {
    console.error("admin api error", err);
    return json({ error: "server_error" }, 500, cors);
  }
}
