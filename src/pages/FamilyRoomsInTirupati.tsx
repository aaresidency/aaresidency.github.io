import { LandingPage } from '../components/LandingPage'
import { PHONE_DISPLAY } from '../lib/contact'

export function FamilyRoomsInTirupati() {
  return (
    <LandingPage
      seo={{
        title: 'Family Rooms in Tirupati',
        description: 'Book an AC family room in Tirupati at AA Residency: up to 4 adults, from ₹2,200 per night, with free Wi-Fi, hot water, parking and a 24/7 front desk.',
        path: '/family-rooms-in-tirupati',
      }}
      heroImage="/images/room-family-1.webp"
      kicker="Stay Together"
      heading="Family Rooms in Tirupati"
      intro={[
        'Travelling to Tirupati with parents, children or the whole family? AA Residency’s air-conditioned Family Room is designed so everyone can stay together: it sleeps up to 4 adults and has a seating area, multiple beds and an attached bathroom with hot water.',
        'The Family Room starts from ₹2,200 per night. Current rates and availability are confirmed by the hotel when you book.',
      ]}
      sections={[
        {
          title: 'What the Family Room offers',
          body: [
            'The room is about 220 sq ft and air-conditioned, with free Wi-Fi, a TV, hot water and power backup. Having one room for the family means easier planning on early temple mornings and simpler logistics with luggage, children and elders.',
          ],
        },
        {
          title: 'Bigger groups and other room types',
          body: [
            'For larger families or groups, we can help you book more than one room. Prefer a lower budget? The Deluxe Room (non-AC) starts from ₹1,200 per night for 2 adults, and the Studio Room (AC) from ₹1,800 for 2 adults. Message us with the number of adults and children and we will suggest a combination.',
          ],
        },
      ]}
      cta={{ label: 'View Rooms & Book', to: '/rooms' }}
      cardOne={{
        title: 'Good To Know For Families',
        items: [
          'Family Room (AC) sleeps up to 4 adults',
          'Seating area and multiple beds',
          'Free Wi-Fi, TV, hot water and power backup',
          '24/7 front desk for late arrivals and early starts',
          'Free parking if you are travelling by car',
        ],
      }}
      cardTwo={{
        title: 'Handy Distances by Road (approximate)',
        items: [
          'Tirumala Temple: about 22 km',
          'Tiruchanur Padmavathi Temple: about 3 km',
          'Sri Govindaraja Swamy Temple: about 5 km',
          'Tirupati Railway Station: about 3 km',
          'Tirupati Bus Stand: about 2 km',
        ],
      }}
      faqs={[
        { q: 'How many people can stay in a Family Room?', a: 'The Family Room is designed for up to 4 adults. Tell us how many children are travelling when you book so we can plan the stay.' },
        { q: 'How much does a family room cost in Tirupati at AA Residency?', a: 'Family Rooms start from ₹2,200 per night. Rates are confirmed by the hotel when you book.' },
        { q: 'Are family rooms air-conditioned?', a: 'Yes, the Family Room is air-conditioned.' },
        { q: 'We are a larger group. Can you arrange several rooms?', a: `Yes, we can help with multiple rooms. WhatsApp us or call ${PHONE_DISPLAY} with your group size and dates.` },
      ]}
      related={[
        { label: 'Rooms & rates', to: '/rooms' },
        { label: 'Rooms in Tirupati', to: '/rooms-in-tirupati' },
        { label: 'Hotels for Tirumala darshan', to: '/hotels-for-tirumala-darshan' },
        { label: 'Facilities', to: '/facilities' },
        { label: 'Contact us', to: '/contact' },
      ]}
    />
  )
}
