const GOOGLE_JWKS_URL = "https://www.googleapis.com/oauth2/v3/certs";
const GOOGLE_ISSUERS = new Set(["https://accounts.google.com", "accounts.google.com"]);

/** @type {{keys: any[] | null, expires: number}} */
let jwksCache = { keys: null, expires: 0 };

export class AuthError extends Error {
  /** @param {number} status @param {string} message */
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

/** @param {string} s */
function b64urlToBytes(s) {
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(s.length / 4) * 4, "=");
  const bin = atob(b64);
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

/** @param {string} s */
function b64urlToJson(s) {
  return JSON.parse(new TextDecoder().decode(b64urlToBytes(s)));
}

async function loadJwks(env, force) {
  if (!force && jwksCache.keys && jwksCache.expires > Date.now()) return jwksCache.keys;
  const res = await fetch(env.GOOGLE_JWKS_URL || GOOGLE_JWKS_URL);
  if (!res.ok) throw new AuthError(503, "Could not load Google signing keys");
  const { keys } = await res.json();
  jwksCache = { keys, expires: Date.now() + 60 * 60 * 1000 };
  return keys;
}

/** Comma-separated ADMIN_LOGIN_EMAILS secret → lowercase Set. */
function allowedAdmins(env) {
  return new Set(
    String(env.ADMIN_LOGIN_EMAILS ?? "")
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean),
  );
}

/**
 * Verifies a Google Sign-In ID token (RS256 signature, audience, issuer, expiry) and
 * checks the account is on the admin allowlist. Returns the admin's email.
 * @param {string} token
 * @returns {Promise<string>}
 */
export async function verifyAdmin(token, env) {
  if (!env.GOOGLE_CLIENT_ID) throw new AuthError(500, "GOOGLE_CLIENT_ID is not configured");
  const parts = token.split(".");
  if (parts.length !== 3) throw new AuthError(401, "Malformed token");

  let header, payload;
  try {
    header = b64urlToJson(parts[0]);
    payload = b64urlToJson(parts[1]);
  } catch {
    throw new AuthError(401, "Malformed token");
  }
  if (header.alg !== "RS256") throw new AuthError(401, "Unsupported token algorithm");

  let jwk = (await loadJwks(env, false)).find((k) => k.kid === header.kid);
  if (!jwk) jwk = (await loadJwks(env, true)).find((k) => k.kid === header.kid); // key rotation
  if (!jwk) throw new AuthError(401, "Unknown signing key");

  const key = await crypto.subtle.importKey("jwk", jwk, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]);
  const valid = await crypto.subtle.verify(
    "RSASSA-PKCS1-v1_5",
    key,
    b64urlToBytes(parts[2]),
    new TextEncoder().encode(`${parts[0]}.${parts[1]}`),
  );
  if (!valid) throw new AuthError(401, "Bad token signature");

  if (payload.aud !== env.GOOGLE_CLIENT_ID) throw new AuthError(401, "Token was issued for another app");
  if (!GOOGLE_ISSUERS.has(payload.iss)) throw new AuthError(401, "Bad token issuer");
  if (typeof payload.exp !== "number" || payload.exp * 1000 < Date.now()) throw new AuthError(401, "Token expired");
  if (payload.email_verified !== true || typeof payload.email !== "string") throw new AuthError(401, "Email not verified");

  const email = payload.email.toLowerCase();
  if (!allowedAdmins(env).has(email)) throw new AuthError(403, "This Google account is not an admin");
  return email;
}
