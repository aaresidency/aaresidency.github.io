import { Seo } from '../components/Seo'
import { hotelSchema } from '../lib/schema'
const HOTEL_ORIGIN = '22-11-246/1+Gollavani+Gunta+Renigunta+Rd+AutoNagar+Tirupati'

const ATTRACTIONS = [
  { name: 'Tirumala Temple', desc: 'Sri Venkateswara Swamy', distance: '~22 km', query: 'Tirumala+Temple+Tirupati' },
  { name: 'Sri Govindaraja Swamy Temple', desc: 'Heart of the city', distance: '~5 km', query: 'Sri+Govindaraja+Swamy+Temple+Tirupati' },
  { name: 'ISKCON Tirupati', desc: 'Peaceful darshan', distance: '~7 km', query: 'ISKCON+Tirupati' },
  { name: 'Tirupati Railway Station', desc: 'Main junction', distance: '3 km', query: 'Tirupati+Railway+Station' },
  { name: 'Tirupati Bus Stand', desc: 'Central bus terminal', distance: '2 km', query: 'APSRTC+Bus+Stand+Tirupati' },
  { name: 'Tiruchanur Padmavathi Temple', desc: 'Ammavari temple', distance: '3 km', query: 'Tiruchanur+Padmavathi+Temple' },
  { name: 'Kapila Theertham', desc: 'Waterfall shrine', distance: '~9 km', query: 'Kapila+Theertham+Tirupati' },
  { name: 'Srikalahasti Temple', desc: 'Famous Shiva temple', distance: '~36 km', query: 'Srikalahasti+Temple' },
  { name: 'Kanipakam Temple', desc: 'Sri Vinayaka Swamy', distance: '~70 km', query: 'Kanipakam+Vinayaka+Temple' },
  { name: 'Shopping Areas', desc: 'Gandhi Road market', distance: '~4 km', query: 'Gandhi+Road+Tirupati' },
]

export function Nearby() {
  return (
    <div>
      <Seo title="Nearby Attractions" description="Temples, transport hubs and attractions near AA Residency Tirupati on Renigunta Road. Plan your Tirupati trip and darshan visit, then book your room direct." path="/nearby" jsonLd={[hotelSchema()]} />
      {/* Hero */}
      <div className="h-60 bg-cover bg-center relative flex items-center justify-center" style={{ backgroundImage: 'url(/images/exterior-front.webp)' }}>
        <div className="absolute inset-0 bg-black/35" />
        <div className="relative text-center">
          <h1 className="text-4xl font-bold" style={{ color: '#f5e6c8', textShadow: '0 2px 12px rgba(0,0,0,0.85)' }}>Nearby Attractions</h1>
          <p className="mt-1" style={{ color: '#c9a84c' }}>Temples, landmarks and transport hubs within easy reach</p>
        </div>
      </div>

      <section className="max-w-6xl mx-auto px-4 py-14">
        <div className="text-center mb-10">
          <p className="font-semibold uppercase tracking-widest text-sm mb-2" style={{ color: '#c9a84c' }}>Explore Around Us</p>
          <h2 className="text-3xl font-bold" style={{ color: '#f5e6c8' }}>What's Nearby</h2>
          <p className="text-sm mt-3 max-w-xl mx-auto" style={{ color: '#a89070' }}>
            Distances are approximate by road from AA Residency, Tirupati.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ATTRACTIONS.map((place) => (
            <div key={place.name} className="rounded-2xl p-6 flex flex-col gap-3 hover:-translate-y-1 transition-transform"
              style={{ backgroundColor: '#251508', border: '1px solid #c9a84c' }}>
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-base leading-snug" style={{ color: '#f5e6c8' }}>{place.name}</h3>
                <span className="text-xs px-2.5 py-1 rounded-full shrink-0 font-medium"
                  style={{ border: '1px solid #c9a84c60', color: '#c9a84c', backgroundColor: '#c9a84c15' }}>
                  {place.distance}
                </span>
              </div>
              <p className="text-sm" style={{ color: '#a89070' }}>{place.desc}</p>
              <a
                href={`https://www.google.com/maps/dir/${HOTEL_ORIGIN}/${place.query}`}
                target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition-colors w-fit mt-auto"
                style={{ border: '1px solid #c9a84c', color: '#c9a84c' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Get Directions
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

