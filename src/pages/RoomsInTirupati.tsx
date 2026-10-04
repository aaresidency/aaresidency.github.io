import { LandingPage } from '../components/LandingPage'
import { PHONE_DISPLAY } from '../lib/contact'

export function RoomsInTirupati() {
  return (
    <LandingPage
      seo={{
        title: 'Rooms in Tirupati',
        description: 'Searching for rooms in Tirupati? Book family and budget AC and Non-AC rooms at AA Residency with free Wi-Fi, parking and direct booking for faster confirmation.',
        path: '/rooms-in-tirupati',
      }}
      heroImage="/images/room-ac-1.jpg"
      kicker="Comfort and Value"
      heading="Book Clean and Comfortable Rooms in Tirupati"
      intro={[
        'AA Residency provides well-maintained rooms in Tirupati for short stays, family trips, pilgrimage visits and business travel. Our rooms are designed for comfort, convenience and peace of mind.',
        'If you are comparing room options in Tirupati, booking directly with us gives you faster support for check-in timing, room preferences and travel-related questions.',
      ]}
      cta={{ label: 'Check Room Availability', to: '/rooms' }}
      cardOne={{
        title: 'Room and Stay Benefits',
        items: [
          'AC and Non-AC options, including family rooms',
          'Suitable for solo travellers and families',
          'Complimentary Wi-Fi across the property',
          'Helpful front desk support throughout your stay',
        ],
      }}
      cardTwo={{
        title: 'Near Key Tirupati Travel Points',
        items: [
          'About 3 km from Tirupati Railway Station and 2 km from the Tirupati Bus Stand',
          'About 22 km by road from Tirumala Temple',
          'Suitable for overnight and short business stays',
          'Helpful support for local movement planning',
        ],
      }}
      faqs={[
        { q: 'Can I book family rooms in Tirupati here?', a: 'Yes. We offer room options suited to family stays and small groups.' },
        { q: 'Do you provide Wi-Fi with rooms?', a: 'Yes, complimentary Wi-Fi is available across the property.' },
        { q: 'How can I choose the right room quickly?', a: `Call us on ${PHONE_DISPLAY} and our team will guide you based on your travel plan.` },
      ]}
      related={[
        { label: 'Hotels in Tirupati', to: '/hotels-in-tirupati' },
        { label: 'Hotels Near Tirupati Temple', to: '/hotels-near-tirupati-temple' },
        { label: 'All rooms and rates', to: '/rooms' },
        { label: 'Contact us', to: '/contact' },
      ]}
    />
  )
}
