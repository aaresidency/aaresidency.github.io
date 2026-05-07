/**
 * Set `BOOKING_API_URL` at build time (e.g. GitHub Actions secret) to the deployed Worker URL.
 * Example: https://aaresidency-booking-api.<your-subdomain>.workers.dev/booking
 */
export default function () {
  return {
    apiUrl: (process.env.BOOKING_API_URL || "").trim(),
  };
}
