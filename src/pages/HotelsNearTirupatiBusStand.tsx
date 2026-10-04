import { LandingPage } from '../components/LandingPage'
import { PHONE_DISPLAY } from '../lib/contact'

export function HotelsNearTirupatiBusStand() {
  return (
    <LandingPage
      seo={{
        title: 'Hotels Near Tirupati Bus Stand',
        description: 'About 2 km from the Tirupati Bus Stand: AC and Non-AC rooms from ₹1,200, free Wi-Fi, parking and a 24/7 front desk for early and late buses.',
        path: '/hotels-near-tirupati-bus-stand',
      }}
      heroImage="/images/reception-entrance.webp"
      kicker="Close To The Bus Stand"
      heading="Hotels Near Tirupati Bus Stand"
      intro={[
        'AA Residency is about 2 km by road from the Tirupati Bus Stand, on Renigunta Road in Auto Nagar. It is a practical base if you are travelling by bus to Tirupati, or planning to continue onward by bus or taxi after a night’s rest.',
        'Buses arrive and leave at all hours. Our front desk is open 24/7, so early-morning and late-night arrivals and departures are easy to plan around.',
      ]}
      sections={[
        {
          title: 'Reaching the hotel from the bus stand',
          body: [
            `A local auto-rickshaw or cab from the bus stand is the easiest option. Share our address with the driver: 22-11-246/1, Gollavani Gunta, Renigunta Road, Auto Nagar, Tirupati 517501, or call us on ${PHONE_DISPLAY} and we will guide your driver.`,
            'If you are carrying luggage or travelling with children or elders, we recommend telling us your arrival time in advance so the front desk can be ready.',
          ],
        },
        {
          title: 'Rooms and rates',
          body: [
            'Deluxe Room (non-AC) from ₹1,200 per night for up to 2 adults, Studio Room (AC) from ₹1,800 for up to 2 adults, and Family Room (AC) from ₹2,200 for up to 4 adults. Free Wi-Fi, TV, hot water and power backup come with every room. Current rates and availability are confirmed by the hotel when you book.',
          ],
        },
      ]}
      cta={{ label: 'View Rooms & Book', to: '/rooms' }}
      cardOne={{
        title: 'Why Bus Travellers Choose Us',
        items: [
          '24/7 front desk for late arrivals and early departures',
          'Budget-friendly Non-AC and comfortable AC rooms',
          'Family rooms for groups travelling together',
          'Free parking, Wi-Fi and hot water',
          'Direct support on WhatsApp and phone',
        ],
      }}
      cardTwo={{
        title: 'Distances by Road (approximate)',
        items: [
          'Tirupati Bus Stand: about 2 km',
          'Tirupati Railway Station: about 3 km',
          'Tiruchanur Padmavathi Temple: about 3 km',
          'Sri Govindaraja Swamy Temple: about 5 km',
          'Tirumala Temple: about 22 km',
        ],
      }}
      faqs={[
        { q: 'How far is AA Residency from the Tirupati Bus Stand?', a: 'About 2 km by road. Distances are approximate and travel time depends on traffic.' },
        { q: 'Is the front desk open for early-morning bus arrivals?', a: 'Yes. Our front desk is open 24/7, so you can reach out at any hour.' },
        { q: 'What are the check-in and check-out times?', a: 'Check-in is 12:00 PM and check-out is 11:00 AM. If you arrive earlier, ask us and we will help subject to availability.' },
        { q: 'How can I book?', a: `Book through our website, WhatsApp us or call ${PHONE_DISPLAY}. We confirm availability and rates directly.` },
      ]}
      related={[
        { label: 'Hotels near Tirupati railway station', to: '/hotels-near-tirupati-railway-station' },
        { label: 'Hotels for Tirumala darshan', to: '/hotels-for-tirumala-darshan' },
        { label: 'Hotels in Tirupati', to: '/hotels-in-tirupati' },
        { label: 'Rooms & rates', to: '/rooms' },
        { label: 'Directions and nearby places', to: '/nearby' },
      ]}
    />
  )
}
