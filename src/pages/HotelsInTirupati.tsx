import { LandingPage } from '../components/LandingPage'
import { PHONE_DISPLAY } from '../lib/contact'

export function HotelsInTirupati() {
  return (
    <LandingPage
      seo={{
        title: 'Hotels in Tirupati',
        description: 'Find a trusted hotel in Tirupati for family, pilgrimage and business stays. Clean rooms, free Wi-Fi, parking and direct booking support at AA Residency.',
        path: '/hotels-in-tirupati',
      }}
      heroImage="/images/exterior-front.jpg"
      kicker="AA Residency Tirupati"
      heading="Looking for Hotels in Tirupati?"
      intro={[
        'AA Residency is a practical and comfortable hotel in Tirupati for pilgrims, families and business travellers. We focus on clean rooms, responsive service and direct booking support so you can plan your trip without stress.',
        'Guests choose us for affordability, hygiene and convenience. If you are searching for hotels in Tirupati with dependable service and clear pricing, our team is ready to help.',
      ]}
      cta={{ label: 'View Rooms & Book', to: '/rooms' }}
      cardOne={{
        title: 'Why Travellers Prefer AA Residency',
        items: [
          'AC and Non-AC rooms, including family rooms',
          'Free Wi-Fi and parking',
          '24/7 front desk for late arrivals and early departures',
          'Direct contact for quick confirmation',
        ],
      }}
      cardTwo={{
        title: 'Local Connectivity in Tirupati',
        items: [
          'On Renigunta Road, Auto Nagar, Tirupati',
          'About 3 km from Tirupati Railway Station and 2 km from the Tirupati Bus Stand',
          'About 22 km by road from Tirumala Temple',
          'Staff support for local travel guidance',
        ],
      }}
      faqs={[
        { q: 'Where is AA Residency in Tirupati?', a: 'AA Residency is at 22-11-246/1, Gollavani Gunta, Renigunta Road, Auto Nagar, Tirupati 517501.' },
        { q: 'Do you support family stays?', a: 'Yes. AA Residency regularly hosts family, pilgrimage and group travellers, and offers family rooms.' },
        { q: 'How do I get the fastest booking confirmation?', a: `Book through our website, WhatsApp us or call ${PHONE_DISPLAY} for immediate assistance.` },
      ]}
      related={[
        { label: 'Rooms in Tirupati', to: '/rooms-in-tirupati' },
        { label: 'Hotels Near Tirupati Temple', to: '/hotels-near-tirupati-temple' },
        { label: 'Nearby attractions', to: '/nearby' },
        { label: 'Contact us', to: '/contact' },
      ]}
    />
  )
}
