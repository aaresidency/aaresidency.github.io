#!/usr/bin/env node
/**
 * Fetches recent Google Places reviews and writes them to src/_data/googleBusiness.static.json
 * under "manualReviews" (so builds work without the API key).
 *
 * Usage (from repo root):
 *   export GOOGLE_MAPS_PLACES_KEY="your-server-key"
 *   npm run reviews:fetch
 *
 * Optional override:
 *   GBP_PLACE_ID="ChIJ..." npm run reviews:fetch
 */

import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const staticPath = join(root, "src", "_data", "googleBusiness.static.json");

const apiKey = process.env.GOOGLE_MAPS_PLACES_KEY;
if (!apiKey || !apiKey.trim()) {
  console.error(
    "Missing GOOGLE_MAPS_PLACES_KEY. Create a key in Google Cloud (Places API enabled), then:\n" +
      "  export GOOGLE_MAPS_PLACES_KEY='your-key'\n" +
      "  npm run reviews:fetch",
  );
  process.exit(1);
}

const raw = readFileSync(staticPath, "utf8");
const data = JSON.parse(raw);
const placeId = process.env.GBP_PLACE_ID || data.placeId;
if (!placeId || !String(placeId).trim()) {
  console.error("No placeId in googleBusiness.static.json and no GBP_PLACE_ID in environment.");
  process.exit(1);
}

const params = new URLSearchParams({
  place_id: placeId,
  fields: "reviews,rating,user_ratings_total,url",
  key: apiKey,
});

const url = `https://maps.googleapis.com/maps/api/place/details/json?${params.toString()}`;
const res = await fetch(url);
const json = await res.json();

if (json.status !== "OK" || !json.result) {
  console.error("Place Details failed:", json.status, json.error_message || "");
  process.exit(1);
}

const r = json.result;
const list = Array.isArray(r.reviews) ? [...r.reviews] : [];
list.sort((a, b) => (b.time || 0) - (a.time || 0));

const manualReviews = list.slice(0, 8).map((rev) => ({
  author: rev.author_name || "Google user",
  rating: typeof rev.rating === "number" ? rev.rating : 5,
  relativeTime: rev.relative_time_description || "",
  text: rev.text || "",
  photo: rev.profile_photo_url || "",
}));

const next = {
  ...data,
  manualReviews,
  reviewsProvenance: "googlePlacesSnapshot",
};

writeFileSync(staticPath, JSON.stringify(next, null, 2) + "\n", "utf8");

console.log(`Wrote ${manualReviews.length} reviews to ${staticPath}`);
if (r.url) console.log("Place URL:", r.url);
