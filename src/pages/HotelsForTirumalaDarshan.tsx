import { LandingPage } from '../components/LandingPage'
import { PHONE_DISPLAY } from '../lib/contact'

export function HotelsForTirumalaDarshan() {
  return (
    <LandingPage
      seo={{
        title: 'Hotels for Tirumala Darshan',
        description: 'Plan your Tirumala darshan stay at AA Residency, Tirupati: about 22 km from Tirumala, rooms from ₹1,200, 24/7 front desk for early starts and late returns.',
        path: '/hotels-for-tirumala-darshan',
      }}
      heroImage="/images/reception-desk-1.webp"
      kicker="Pilgrimage Stay"
      heading="Where to Stay in Tirupati for Tirumala Darshan"
      intro={[
        'A good darshan trip starts with a restful, well-located stay. AA Residency is in Tirupati on Renigunta Road, about 22 km by road from Tirumala Temple, with a 24/7 front desk that suits early starts and late returns.',
        'Many of our guests are families and pilgrim groups. We keep things simple: clean rooms, clear rates, and direct help on WhatsApp or phone.',
      ]}
      sections={[
        {
          title: 'Planning your darshan stay',
          body: [
            'Darshan tickets and slots are managed by Tirumala Tirupati Devasthanams (TTD), so please book through TTD’s official channels and plan your stay around your slot. Once you have it, share your date and time with us and we will help you plan check-in, rest and early departure.',
            'Because our front desk never closes, you can arrive after a late train or bus and still get a proper rest before an early morning.',
          ],
        },
        {
          title: 'Rooms for pilgrims and groups',
          body: [
            `Choose a Deluxe Room (non-AC) from ₹1,200, a Studio Room (AC) from ₹1,800, or a Family Room (AC) from ₹2,200 for up to 4 adults. Travelling in a larger group? Call or WhatsApp ${PHONE_DISPLAY} and we will help arrange several rooms. Current rates and availability are confirmed by the hotel when you book.`,
          ],
        },
        {
          title: 'Other temples nearby',
          body: [
            'Tiruchanur Padmavathi Temple is about 3 km from us and Sri Govindaraja Swamy Temple is about 5 km, so you can combine your Tirumala visit with other darshans in Tirupati. See our Nearby page for more places and directions.',
          ],
        },
      ]}
      cta={{ label: 'View Rooms & Book', to: '/rooms' }}
      cardOne={{
        title: 'Why Pilgrims Stay With Us',
        items: [
          '24/7 front desk for early darshan starts and late arrivals',
          'AC and Non-AC rooms to suit your budget',
          'Family rooms for up to 4 adults',
          'Free Wi-Fi, parking, hot water and power backup',
          'Direct booking help by WhatsApp and phone',
        ],
      }}
      cardTwo={{
        title: 'Distances by Road (approximate)',
        items: [
          'Tirumala Temple: about 22 km',
          'Tiruchanur Padmavathi Temple: about 3 km',
          'Sri Govindaraja Swamy Temple: about 5 km',
          'Kapila Theertham: about 9 km',
          'Tirupati Railway Station: about 3 km',
          'Tirupati Bus Stand: about 2 km',
        ],
      }}
      faqs={[
        { q: 'How far is AA Residency from Tirumala?', a: 'About 22 km by road. Distances are approximate; travel time depends on traffic.' },
        { q: 'Can you help with Tirumala darshan tickets?', a: 'Darshan tickets are issued by TTD, so please use their official channels. We are happy to help you plan your stay around your slot.' },
        { q: 'Is the front desk open for very early departures?', a: 'Yes, our front desk is open 24/7.' },
        { q: 'Do you have rooms for large pilgrim groups?', a: `We can help arrange multiple rooms and Family Rooms for up to 4 adults each. Call or WhatsApp ${PHONE_DISPLAY} with your group size and dates.` },
      ]}
      related={[
        { label: 'Hotels near Tirupati temple', to: '/hotels-near-tirupati-temple' },
        { label: 'Family rooms in Tirupati', to: '/family-rooms-in-tirupati' },
        { label: 'Hotels near Tirupati railway station', to: '/hotels-near-tirupati-railway-station' },
        { label: 'Hotels near Tirupati bus stand', to: '/hotels-near-tirupati-bus-stand' },
        { label: 'Directions and nearby places', to: '/nearby' },
      ]}
    />
  )
}
