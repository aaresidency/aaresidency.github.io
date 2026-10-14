/** Booking reference shared by website enquiries and admin-created bookings. */
export function generateBookingReference() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const h = String(now.getUTCHours()).padStart(2, "0"); // deterministic worker-side
  const min = String(now.getUTCMinutes()).padStart(2, "0");
  const random = Math.floor(100 + Math.random() * 900);
  return `AAR-${y}${m}${d}-${h}${min}-${random}`;
}
