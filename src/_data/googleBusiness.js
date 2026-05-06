import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Optional build-time sync from Google Places (Place Details reviews):
 * — placeId in googleBusiness.static.json (default) or GBP_PLACE_ID env to override
 * — GOOGLE_MAPS_PLACES_KEY: API key restricted to Places API (billing on)
 *
 * Alternative: omit env vars and add entries to manualReviews[] in googleBusiness.static.json
 * using exact excerpts from Google Business Profile.
 */

/** @typedef {{ author?: string; text: string; rating?: number; relativeTime?: string; photo?: string }} ReviewLike */

/**
 * reviewsProvenance:
 * — "googlePlacesSnapshot" reviews were saved via `npm run reviews:fetch` (or copied from Place Details export)
 */
/** @typedef {{ placeId?: string; mapsSearchUrl?: string; mapsUrl?: string; reviewsProvenance?: string; manualReviews?: ReviewLike[] }} StaticShape */

export default async function googleBusinessData() {
  /** @type {StaticShape} */
  const staticData = JSON.parse(
    readFileSync(join(__dirname, "googleBusiness.static.json"), "utf8"),
  );

  const mapsFallback =
    staticData.mapsUrl ||
    staticData.mapsSearchUrl ||
    "https://www.google.com/maps/search/?api=1&query=AA+Residency+Tirupati";

  /** @type {{ mapsUrl: string; rating?: number|null; user_ratings_total?: number|null; reviews: ReviewLike[]; source: string }} */
  const out = {
    mapsUrl: mapsFallback,
    rating: null,
    user_ratings_total: null,
    reviews: [],
    source: "none",
  };

  const manual = Array.isArray(staticData.manualReviews) ? staticData.manualReviews : [];
  if (manual.length > 0) {
    out.reviews = manual.slice(0, 6).map((r) => ({
      text: r.text,
      author: r.author || "Google user",
      rating: typeof r.rating === "number" ? r.rating : 5,
      relativeTime: r.relativeTime || "",
      photo: r.photo || "",
    }));
    out.source =
      staticData.reviewsProvenance === "googlePlacesSnapshot" ? "googleSnapshot" : "manual";
    return out;
  }

  const placeId = process.env.GBP_PLACE_ID || staticData.placeId;
  const apiKey = process.env.GOOGLE_MAPS_PLACES_KEY;
  if (!placeId || !apiKey) {
    return out;
  }

  const params = new URLSearchParams({
    place_id: placeId,
    fields: "reviews,rating,user_ratings_total,url",
    key: apiKey,
  });

  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?${params.toString()}`,
    );
    const json = await res.json();
    if (json.status !== "OK" || !json.result) {
      console.warn(
        "[googleBusiness] Place Details failed:",
        json.status,
        json.error_message || "",
      );
      out.source = "error";
      return out;
    }

    const r = json.result;
    out.mapsUrl = r.url || out.mapsUrl;
    out.rating = typeof r.rating === "number" ? r.rating : null;
    out.user_ratings_total =
      typeof r.user_ratings_total === "number" ? r.user_ratings_total : null;

    const list = Array.isArray(r.reviews) ? r.reviews : [];
    list.sort((a, b) => (b.time || 0) - (a.time || 0));

    out.reviews = list.slice(0, 6).map((rev) => ({
      text: rev.text,
      author: rev.author_name || "Google user",
      rating: typeof rev.rating === "number" ? rev.rating : 5,
      relativeTime: rev.relative_time_description || "",
      photo: rev.profile_photo_url || "",
    }));
    out.source = "google";
    return out;
  } catch (e) {
    console.warn("[googleBusiness] Place Details request error:", e?.message || e);
    out.source = "error";
    return out;
  }
}
