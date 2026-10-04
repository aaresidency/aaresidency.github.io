export const ROUTE_PATHS = [
  '/',
  '/about',
  '/rooms',
  '/gallery',
  '/b2b',
  '/events',
  '/reviews',
  '/nearby',
  '/facilities',
  '/contact',
  '/hotels-in-tirupati',
  '/rooms-in-tirupati',
  '/hotels-near-tirupati-temple',
  '/hotels-near-tirupati-railway-station',
  '/hotels-near-tirupati-bus-stand',
  '/family-rooms-in-tirupati',
  '/hotels-for-tirumala-darshan',
  '/privacy',
  '/terms',
]

// Old Eleventy URLs whose new route has a different name. Routes that kept their
// name (about, hotels-in-tirupati, …) already exist as prerendered <name>.html files.
export const LEGACY_REDIRECTS: Record<string, string> = {
  '/Booking.html': '/rooms',
  '/ContactUs.html': '/contact',
  '/guest-information.html': '/terms',
  '/privacy-policy.html': '/privacy',
}
