import { LandingPage } from '../components/LandingPage'
import { PHONE_DISPLAY } from '../lib/contact'

export function HotelsNearTirupatiTemple() {
  return (
    <LandingPage
      seo={{
        title: 'Hotels Near Tirupati Temple',
        description: 'Looking for hotels near Tirupati temple? Stay at AA Residency for comfortable rooms, clear distances to Tirumala and the city, and direct booking support.',
        path: '/hotels-near-tirupati-temple',
      }}
      heroImage="/images/reception-entrance.webp"
      kicker="Pilgrimage-Friendly Stay"
      heading="Hotels Near Tirupati Temple With Reliable Service"
      intro={[
        'For guests planning temple visits, AA Residency offers a practical stay in Tirupati with clean rooms and direct assistance from our team. We are on Renigunta Road, about 22 km by road from Tirumala Temple and about 5 km from Sri Govindaraja Swamy Temple.',
        'We support families and pilgrims with responsive communication, transparent pricing and room booking guidance so your Tirupati trip stays smooth and comfortable.',
      ]}
      cta={{ label: 'View Rooms & Book', to: '/rooms' }}
      cardOne={{
        title: 'Why Pilgrims Choose AA Residency',
        items: [
          'Comfort-focused rooms for restful stays',
          'Affordable options for families and groups',
          '24/7 front desk for early darshan starts and late arrivals',
          'Direct support for booking and queries',
        ],
      }}
      cardTwo={{
        title: 'Distances by Road (approximate)',
        items: [
          'Tirumala Temple: about 22 km',
          'Sri Govindaraja Swamy Temple: about 5 km',
          'Tiruchanur Padmavathi Temple: about 3 km',
          'Tirupati Railway Station: about 3 km',
          'Tirupati Bus Stand: about 2 km',
        ],
      }}
      faqs={[
        { q: 'How far is AA Residency from Tirumala Temple?', a: 'About 22 km by road. Distances are approximate; see our Nearby page for directions.' },
        { q: 'Can pilgrims get quick booking help?', a: `Yes. WhatsApp us or call ${PHONE_DISPLAY} for immediate booking and stay support.` },
        { q: 'Is AA Residency suitable for short temple trips?', a: 'Yes. Many guests choose us for short, comfortable pilgrimage stays, and our front desk is open 24/7.' },
      ]}
      related={[
        { label: 'Hotels in Tirupati', to: '/hotels-in-tirupati' },
        { label: 'Rooms in Tirupati', to: '/rooms-in-tirupati' },
        { label: 'Nearby attractions and directions', to: '/nearby' },
        { label: 'Contact us', to: '/contact' },
      ]}
    />
  )
}
