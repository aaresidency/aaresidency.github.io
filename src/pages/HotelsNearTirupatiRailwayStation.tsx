import { LandingPage } from '../components/LandingPage'
import { PHONE_DISPLAY } from '../lib/contact'

export function HotelsNearTirupatiRailwayStation() {
  return (
    <LandingPage
      seo={{
        title: 'Hotels Near Tirupati Railway Station',
        description: 'About 3 km from Tirupati Railway Station: AC and Non-AC rooms from ₹1,200, free Wi-Fi, parking and a 24/7 front desk for late-night trains.',
        path: '/hotels-near-tirupati-railway-station',
      }}
      heroImage="/images/exterior-front.webp"
      kicker="Close To The Station"
      heading="Hotels Near Tirupati Railway Station"
      intro={[
        'AA Residency is on Renigunta Road in Auto Nagar, about 3 km by road from Tirupati Railway Station. If you are arriving by train for a temple visit, a family trip or work, you can be at the hotel and resting soon after you get out of the station.',
        'Trains reach Tirupati at all hours, so our front desk is open 24/7. Late-night and early-morning arrivals are welcome, and the team can guide your auto or cab driver to us.',
      ]}
      sections={[
        {
          title: 'Getting from the station to AA Residency',
          body: [
            'The simplest way is a local auto-rickshaw or cab from outside the station. Share our address with the driver: 22-11-246/1, Gollavani Gunta, Renigunta Road, Auto Nagar, Tirupati 517501. If the driver is unsure, call us on ' +
              PHONE_DISPLAY +
              ' and we will give directions.',
            'Tell us your train arrival time when you book. Standard check-in is 12:00 PM and check-out is 11:00 AM; if you arrive earlier, we will do our best to help, subject to room availability.',
          ],
        },
        {
          title: 'Room options for rail travellers',
          body: [
            'Deluxe Room (non-AC) from ₹1,200 per night for up to 2 adults, Studio Room (AC) from ₹1,800 for up to 2 adults, and Family Room (AC) from ₹2,200 for up to 4 adults. All rooms include free Wi-Fi, TV, an attached bathroom with hot water, and power backup. Current rates and availability are confirmed by the hotel when you book.',
          ],
        },
      ]}
      cta={{ label: 'View Rooms & Book', to: '/rooms' }}
      cardOne={{
        title: 'Why Rail Travellers Stay With Us',
        items: [
          '24/7 front desk for late-night and early-morning trains',
          'Free parking if you are driving on after the train',
          'AC and Non-AC rooms, including family rooms',
          'Free Wi-Fi and hot water',
          'Direct booking and quick confirmation by WhatsApp or phone',
        ],
      }}
      cardTwo={{
        title: 'Distances by Road (approximate)',
        items: [
          'Tirupati Railway Station: about 3 km',
          'Tirupati Bus Stand: about 2 km',
          'Tiruchanur Padmavathi Temple: about 3 km',
          'Sri Govindaraja Swamy Temple: about 5 km',
          'Tirumala Temple: about 22 km',
        ],
      }}
      faqs={[
        { q: 'How far is AA Residency from Tirupati Railway Station?', a: 'About 3 km by road. Distances are approximate and travel time depends on traffic.' },
        { q: 'Can I check in late at night after a train arrives?', a: 'Yes. Our front desk is open 24/7. Please tell us your arrival time when you book so we can be ready for you.' },
        { q: 'Can I check in early if my train arrives in the morning?', a: `Standard check-in is 12:00 PM. Early check-in depends on room availability, so message or call us on ${PHONE_DISPLAY} with your arrival time and we will let you know what is possible.` },
        { q: 'Is there parking at the hotel?', a: 'Yes, free parking is available for guests.' },
        { q: 'What is the cheapest room?', a: 'The Deluxe Room (non-AC) starts from ₹1,200 per night. AC rooms start from ₹1,800. Rates are confirmed when you book.' },
      ]}
      related={[
        { label: 'Hotels near Tirupati bus stand', to: '/hotels-near-tirupati-bus-stand' },
        { label: 'Hotels for Tirumala darshan', to: '/hotels-for-tirumala-darshan' },
        { label: 'Hotels in Tirupati', to: '/hotels-in-tirupati' },
        { label: 'Rooms & rates', to: '/rooms' },
        { label: 'Directions and nearby places', to: '/nearby' },
      ]}
    />
  )
}
