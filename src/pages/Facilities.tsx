import { useTranslation } from 'react-i18next'
import { Seo } from '../components/Seo'
import { hotelSchema } from '../lib/schema'

const FACILITIES = [
  { icon: '📶', key: 'wifi',         desc: 'High-speed internet throughout the property.' },
  { icon: '❄️', key: 'ac',           desc: 'Air-conditioned rooms for a cool, comfortable stay.' },
  { icon: '🚗', key: 'parking',      desc: 'Secure on-site parking for guests.' },
  { icon: '🛎️', key: 'reception',   desc: 'Front desk available round the clock.' },
  { icon: '🧹', key: 'housekeeping', desc: 'Daily room cleaning and linen service.' },
  { icon: '📷', key: 'cctv',        desc: 'CCTV surveillance for guest safety.' },
  { icon: '🚿', key: 'hotWater',    desc: 'Reliable hot water supply in all bathrooms.' },
  { icon: '⚡', key: 'powerBackup', desc: 'Generator backup to keep your stay uninterrupted.' },
  { icon: '🛗', key: 'elevator',    desc: 'Elevator access for all floors.' },
  { icon: '📺', key: 'tv',          desc: 'LED television with cable channels in every room.' },
]

const GALLERY = [
  { src: '/images/reception-desk-1.jpg', label: 'Reception' },
  { src: '/images/amenity-elevator.jpg', label: 'Elevator' },
  { src: '/images/bathroom-1.jpg',       label: 'Bathroom' },
  { src: '/images/reception-entrance.jpg', label: 'Entrance Lobby' },
]

export function Facilities() {
  const { t } = useTranslation()

  return (
    <div>
      <Seo title="Facilities & Amenities" description="Free Wi-Fi, AC rooms, parking, housekeeping and a 24/7 front desk at AA Residency Tirupati. See all hotel amenities and book your comfortable stay direct." path="/facilities" jsonLd={[hotelSchema()]} />
      {/* Hero */}
      <div className="h-60 bg-cover bg-center relative flex items-center justify-center" style={{ backgroundImage: 'url(/images/reception-desk-1.jpg)' }}>
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative text-center">
          <h1 className="text-4xl font-bold" style={{ color: '#f5e6c8', textShadow: '0 2px 12px rgba(0,0,0,0.85)' }}>{t('about.facilitiesTitle')}</h1>
          <p className="mt-1" style={{ color: '#c9a84c' }}>Everything you need for a comfortable stay</p>
        </div>
      </div>

      {/* Facilities grid */}
      <section className="max-w-5xl mx-auto px-4 py-14">
        <div className="text-center mb-10">
          <p className="font-semibold uppercase tracking-widest text-sm mb-2" style={{ color: '#c9a84c' }}>Amenities</p>
          <h2 className="text-3xl font-bold" style={{ color: '#f5e6c8' }}>Our Facilities</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
          {FACILITIES.map((f) => (
            <div key={f.key} className="rounded-2xl p-6 flex flex-col items-center gap-3 text-center transition-all hover:-translate-y-1"
              style={{ backgroundColor: '#251508', border: '1px solid #c9a84c' }}>
              <span className="text-4xl">{f.icon}</span>
              <span className="text-sm font-semibold" style={{ color: '#f5e6c8' }}>{t(`facilities.${f.key}`, f.key)}</span>
              <p className="text-xs leading-relaxed" style={{ color: '#a89070' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Photo strip */}
      <section className="py-12 px-4" style={{ backgroundColor: '#1e0d00' }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8" style={{ color: '#f5e6c8' }}>A Look Inside</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {GALLERY.map((img) => (
              <div key={img.src} className="relative rounded-2xl overflow-hidden h-44 group"
                style={{ border: '1px solid #c9a84c' }}>
                <img src={img.src} alt={img.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <p className="absolute bottom-3 left-3 text-xs font-semibold" style={{ color: '#e8d5a3' }}>{img.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
