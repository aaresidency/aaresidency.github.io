import en from '../i18n/en.json'

const SITE_URL = 'https://aaresidency.com'
export const HOTEL_ID = `${SITE_URL}/#hotel`

export type JsonLd = Record<string, unknown>

export function hotelSchema(extra: JsonLd = {}): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Hotel',
    '@id': HOTEL_ID,
    name: 'AA Residency Tirupati',
    url: SITE_URL,
    description:
      'AA Residency is a family-friendly hotel on Renigunta Road, Tirupati, with AC and Non-AC rooms, free Wi-Fi, parking and a 24/7 front desk.',
    image: [
      `${SITE_URL}/images/hero-slide-exterior.jpg`,
      `${SITE_URL}/images/room-ac-1.jpg`,
      `${SITE_URL}/images/reception-entrance.jpg`,
    ],
    logo: `${SITE_URL}/logo.png`,
    telephone: '+91-87900-57559',
    email: 'info@aaresidency.com',
    priceRange: '₹1200-₹2200',
    checkinTime: '12:00',
    checkoutTime: '11:00',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '22-11-246/1, Gollavani Gunta, Renigunta Road, Auto Nagar',
      addressLocality: 'Tirupati',
      addressRegion: 'Andhra Pradesh',
      postalCode: '517501',
      addressCountry: 'IN',
    },
    geo: { '@type': 'GeoCoordinates', latitude: 13.6294864, longitude: 79.4527874 },
    // Google Maps rating for this listing, supplied by the owner (4.8 from 437 reviews).
    aggregateRating: { '@type': 'AggregateRating', ratingValue: 4.8, bestRating: 5, reviewCount: 437 },
    hasMap: 'https://maps.app.goo.gl/9AdeCWiaTHM4nEQW8',
    sameAs: ['https://maps.app.goo.gl/9AdeCWiaTHM4nEQW8'],
    amenityFeature: [
      { '@type': 'LocationFeatureSpecification', name: 'Free WiFi', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Parking', value: true },
      { '@type': 'LocationFeatureSpecification', name: '24/7 Front Desk', value: true },
    ],
    ...extra,
  }
}

const roomOffer = (name: string, price: number, adults: number, sqft: number): JsonLd => ({
  '@type': 'Offer',
  itemOffered: {
    '@type': 'HotelRoom',
    name,
    occupancy: { '@type': 'QuantitativeValue', maxValue: adults, unitText: 'adults' },
    floorSize: { '@type': 'QuantitativeValue', value: sqft, unitCode: 'FTK' },
  },
  priceSpecification: {
    '@type': 'UnitPriceSpecification',
    price,
    priceCurrency: 'INR',
    unitText: 'per night',
  },
})

// Names come from the site's own room labels; prices/sizes must match ROOMS in src/pages/Rooms.tsx.
const ROOM_NAMES = en.rooms.types
export const roomsSchema = (): JsonLd =>
  hotelSchema({
    makesOffer: [
      roomOffer(ROOM_NAMES.deluxe, 1200, 2, 220),
      roomOffer(ROOM_NAMES.studio, 1800, 2, 220),
      roomOffer(ROOM_NAMES.family, 2200, 4, 220),
    ],
  })

export const faqSchema = (faqs: { q: string; a: string }[]): JsonLd => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
})

export const reviewsSchema = (reviews: { author: string; rating: number; text: string }[]): JsonLd =>
  hotelSchema({
    review: reviews.map((r) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: r.author },
      reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5 },
      reviewBody: r.text,
    })),
  })
