import { useTranslation, Trans } from 'react-i18next'
import { ReviewCard, GUEST_REVIEWS } from '../components/ReviewCard'
import { Seo } from '../components/Seo'
import { hotelSchema } from '../lib/schema'
import { LazyIframe } from '../components/LazyIframe'

const NEARBY = [
  { icon: '🏛️', name: 'Sri Venkateswara Museum', dist: '1.2 km' },
  { icon: '🏰', name: 'Chandragiri Fort', dist: '14 km' },
  { icon: '⛪', name: 'Tirumala Temple', dist: '22 km' },
  { icon: '🕌', name: 'Govindaraja Swamy Temple', dist: '5 km' },
]

const STATS = [
  { value: '30+', label: 'Rooms' },
  { value: '437', label: 'Google Reviews' },
  { value: '4.8★', label: 'Rating' },
  { value: '24/7', label: 'Service' },
]

const HOTEL_IMGS = [
  { src: '/images/reception-desk-1.webp', label: 'Reception Lobby' },
  { src: '/images/banquet-event-1.webp',  label: 'Banquet Hall' },
  { src: '/images/amenity-elevator.webp', label: 'Lift / Elevator' },
]

export function About() {
  const { t } = useTranslation()

  return (
    <div>
      <Seo title="About Us" description="AA Residency is a family-friendly hotel in Tirupati for pilgrims, families and business travellers. Learn our story and book direct for the best rates." path="/about" jsonLd={[hotelSchema()]} />
      {/* Hero */}
      <div className="h-72 bg-cover bg-center relative flex items-center justify-center" style={{ backgroundImage: 'url(/images/exterior-front.webp)' }}>
        <div className="absolute inset-0 bg-black/35" />
        <div className="relative text-center animate-fade-in-up">
          <h1 className="text-5xl font-bold mb-2" style={{ color: '#f5e6c8', textShadow: '0 2px 12px rgba(0,0,0,0.85)' }}>{t('about.heroTitle')}</h1>
          <p className="text-lg" style={{ color: '#c9a84c' }}>{t('about.heroSubtitle')}</p>
        </div>
      </div>

      {/* Stats bar */}
      <div className="py-6 px-4" style={{ backgroundColor: '#1e0d00', borderBottom: '1px solid #251005' }}>
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-bold" style={{ color: '#c9a84c' }}>{s.value}</p>
              <p className="text-sm mt-1" style={{ color: '#a89070' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Intro section */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-start mb-14">
          <div className="animate-slide-in-left">
            <p className="font-semibold uppercase tracking-widest text-sm mb-2" style={{ color: '#c9a84c' }}>{t('about.badge')}</p>
            <h2 className="text-3xl font-bold mb-5 leading-snug" style={{ color: '#f5e6c8' }}>{t('about.subheading')}</h2>
            <div className="space-y-4 leading-relaxed" style={{ color: '#c8b89a' }}>
              <p><Trans i18nKey="about.intro1" components={{ b: <strong style={{ color: '#e8d5a3' }} /> }} /></p>
              <p><Trans i18nKey="about.intro2" components={{ b: <strong style={{ color: '#e8d5a3' }} /> }} /></p>
              <p><Trans i18nKey="about.intro3" components={{ b: <strong style={{ color: '#e8d5a3' }} /> }} /></p>
            </div>
          </div>
          <div className="space-y-3">
            <img loading="lazy" decoding="async" src="/images/reception-desk-2.webp" alt={t('about.heroTitle')} className="rounded-2xl w-full h-60 object-cover" style={{ border: '1px solid #c9a84c' }} />
            <div className="grid grid-cols-2 gap-3">
              <img loading="lazy" decoding="async" src="/images/room-ac-1.webp" alt="AC Room" className="rounded-xl h-32 w-full object-cover hover:scale-105 transition-transform duration-300" style={{ border: '1px solid #c9a84c' }} />
              <img loading="lazy" decoding="async" src="/images/reception-entrance.webp" alt="Reception" className="rounded-xl h-32 w-full object-cover hover:scale-105 transition-transform duration-300" style={{ border: '1px solid #c9a84c' }} />
            </div>
          </div>
        </div>

        {/* Content sections */}
        <div className="space-y-10">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="rounded-2xl p-7 transition-all hover:-translate-y-1" style={{ backgroundColor: '#251508', border: '1px solid #c9a84c' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: '#c9a84c20' }}>
                <svg className="w-5 h-5" fill="#c9a84c" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: '#f5e6c8' }}>{t('about.section1Title')}</h3>
              <p className="leading-relaxed mb-3" style={{ color: '#c8b89a' }}>{t('about.section1Para1')}</p>
              <p className="leading-relaxed" style={{ color: '#c8b89a' }}>
                <Trans i18nKey="about.section1Para2" components={{ b: <strong style={{ color: '#e8d5a3' }} /> }} />
              </p>
            </div>

            <div className="rounded-2xl p-7 transition-all hover:-translate-y-1" style={{ backgroundColor: '#251508', border: '1px solid #c9a84c' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: '#c9a84c20' }}>
                <svg className="w-5 h-5" fill="#c9a84c" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: '#f5e6c8' }}>{t('about.section2Title')}</h3>
              <p className="leading-relaxed mb-3" style={{ color: '#c8b89a' }}>{t('about.section2Para1')}</p>
              <p className="leading-relaxed" style={{ color: '#c8b89a' }}>
                <Trans i18nKey="about.section2Para2" components={{ b: <strong style={{ color: '#e8d5a3' }} /> }} />
              </p>
            </div>
          </div>

          {/* Tagline highlight */}
          <div className="relative rounded-2xl p-8 overflow-hidden" style={{ background: 'linear-gradient(135deg, #2a1a08 0%, #3a2410 50%, #2a1a08 100%)', border: '1px solid #c9a84c40' }}>
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, #c9a84c 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
            <div className="relative">
              <h3 className="text-xl font-bold mb-3" style={{ color: '#f5e6c8' }}>{t('about.section3Title')}</h3>
              <p className="leading-relaxed mb-3" style={{ color: '#c8b89a' }}>
                <Trans i18nKey="about.section3Para1" components={{ b: <strong style={{ color: '#e8d5a3' }} /> }} />
              </p>
              <p className="leading-relaxed mb-5" style={{ color: '#c8b89a' }}>{t('about.section3Para2')}</p>
              <p className="text-xl font-bold italic" style={{ color: '#c9a84c' }}>"{t('about.tagline')}"</p>
            </div>
          </div>
        </div>
      </section>

      {/* Hotel photo gallery strip */}
      <section className="max-w-5xl mx-auto px-4 py-14">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold" style={{ color: '#f5e6c8' }}>{t('about.galleryTitle')}</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {HOTEL_IMGS.map((img) => (
            <div key={img.src} className="relative rounded-2xl overflow-hidden h-56 group" style={{ border: '1px solid #c9a84c' }}>
              <img loading="lazy" decoding="async" src={img.src} alt={img.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 inset-x-0 p-4">
                <p className="font-semibold text-sm" style={{ color: '#e8d5a3' }}>{img.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Nearby attractions */}
      <section className="py-14 px-4" style={{ backgroundColor: '#1e0d00' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="font-semibold uppercase tracking-widest text-sm mb-2" style={{ color: '#c9a84c' }}>Explore Tirupati</p>
            <h2 className="text-3xl font-bold mb-2" style={{ color: '#f5e6c8' }}>{t('about.nearbyTitle')}</h2>
            <p style={{ color: '#a89070' }}>{t('about.nearbySubtitle')}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {NEARBY.map((place) => (
              <div key={place.name} className="rounded-2xl p-6 flex flex-col items-center gap-3 text-center transition-all hover:-translate-y-1"
                style={{ backgroundColor: '#251508', border: '1px solid #c9a84c' }}>
                <span className="text-4xl">{place.icon}</span>
                <p className="font-semibold text-sm leading-tight" style={{ color: '#f5e6c8' }}>{place.name}</p>
                <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ backgroundColor: '#c9a84c20', color: '#c9a84c', border: '1px solid #c9a84c40' }}>{place.dist}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="max-w-5xl mx-auto px-4 py-14">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold mb-2" style={{ color: '#f5e6c8' }}>{t('about.findUs')}</h2>
          <p style={{ color: '#a89070' }}>22-11-246/1, Gollavani Gunta, Renigunta Rd, AutoNagar, Tirupati, Andhra Pradesh 517501</p>
        </div>
        <div className="rounded-2xl overflow-hidden h-80" style={{ border: '1px solid #c9a84c' }}>
          <LazyIframe
            src="https://www.google.com/maps?q=22-11-246/1,+Gollavani+Gunta,+Renigunta+Rd,+AutoNagar,+Tirupati,+Andhra+Pradesh+517501&output=embed"
            width="100%" height="100%" style={{ border: 0 }}
            allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="AA Residency Location"
          />
        </div>
      </section>

      {/* Reviews */}
      <section className="py-14 px-4" style={{ backgroundColor: '#1e0d00' }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8" style={{ color: '#f5e6c8' }}>{t('about.reviewsTitle')}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {GUEST_REVIEWS.slice(0, 3).map((r) => <ReviewCard key={r.name} {...r} />)}
          </div>
        </div>
      </section>
    </div>
  )
}
