import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { HeroSlider } from '../components/HeroSlider'
import { ReviewCard, GUEST_REVIEWS } from '../components/ReviewCard'
import { Seo } from '../components/Seo'
import { hotelSchema } from '../lib/schema'
import { thumb } from '../lib/images'

const ABOUT_IMG_KEYS = ['receptionLobby', 'deluxeRoom', 'familyRoom', 'facilities'] as const
const ABOUT_IMGS = [
  '/images/reception-entrance.webp',
  '/images/room-ac-1.webp',
  '/images/room-family-1.webp',
  '/images/amenity-elevator.webp',
]

const MARQUEE_IMGS = [
  '/images/reception-entrance.webp',
  '/images/room-ac-1.webp',
  '/images/room-family-1.webp',
  '/images/bathroom-1.webp',
  '/images/exterior-front.webp',
  '/images/banquet-event-1.webp',
  '/images/room-ac-2.webp',
  '/images/reception-desk-1.webp',
  '/images/room-nonac-1.webp',
  '/images/banquet-stage-1.webp',
]

export function Home() {
  const { t } = useTranslation()

  return (
    <div>
      <Seo title="Hotel in Tirupati Near Temple" description="Stay at AA Residency, a hotel in Tirupati on Renigunta Road. AC and Non-AC family rooms, free Wi-Fi, parking and 24/7 front desk. Book direct for best rates." path="/" jsonLd={[hotelSchema()]} />
      <HeroSlider />

      {/* Scrolling image strip */}
      <div className="py-5 overflow-hidden" style={{ backgroundColor: '#0f0700' }}>
        <div className="marquee-wrapper overflow-hidden" aria-hidden="true">
          <div className="animate-marquee gap-4 flex">
            {[...MARQUEE_IMGS, ...MARQUEE_IMGS].map(thumb).map((src, i) => (
              <div key={i} className="h-32 w-48 shrink-0 rounded-xl overflow-hidden" style={{ border: '1px solid #c9a84c' }}>
                <img loading="lazy" decoding="async" src={src} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section className="py-16 px-4" style={{ backgroundColor: '#1e0d00' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <p className="font-semibold uppercase tracking-widest text-sm mb-2" style={{ color: '#c9a84c' }}>{t('reviews.sectionLabel')}</p>
            <h2 className="text-3xl font-bold mb-2" style={{ color: '#f5e6c8' }}>{t('home.reviewsTitle')}</h2>
            <p className="mb-8" style={{ color: '#a89070' }}>{t('home.reviewsSubtitle')}</p>
            <div className="flex justify-center gap-8 md:gap-14 flex-wrap">
              <div className="flex items-center gap-3">
                <span className="text-4xl font-bold text-amber-400">4.8</span>
                <div className="text-left">
                  <div className="flex text-amber-400 text-lg">★★★★★</div>
                  <p className="text-xs" style={{ color: '#a89070' }}>{t('reviews.overallRating')}</p>
                </div>
              </div>
              <div className="hidden md:block h-12 w-px" style={{ backgroundColor: '#251005' }}></div>
              <div className="text-center">
                <p className="text-3xl font-bold" style={{ color: '#c9a84c' }}>437</p>
                <p className="text-xs" style={{ color: '#a89070' }}>{t('reviews.happyGuests')}</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {GUEST_REVIEWS.slice(0, 6).map((r) => <ReviewCard key={r.name} {...r} />)}
          </div>

          <div className="text-center">
            <Link to="/reviews"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-lg font-medium transition-colors"
              style={{ backgroundColor: '#c9a84c', color: '#1a0e00' }}>
              {t('reviews.viewAll')}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* About preview */}
      <section className="max-w-7xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <p className="font-semibold uppercase tracking-widest text-sm mb-2" style={{ color: '#c9a84c' }}>{t('home.aboutTitle')}</p>
          <h2 className="text-3xl font-bold mb-4" style={{ color: '#f5e6c8' }}>{t('home.aboutHeading')}</h2>
          <p className="leading-relaxed mb-6" style={{ color: '#c8b89a' }}>{t('home.aboutDesc')}</p>
          <Link to="/about"
            className="inline-block px-6 py-2.5 rounded-lg font-medium transition-colors"
            style={{ backgroundColor: '#c9a84c', color: '#1a0e00' }}>
            {t('home.learnMore')}
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {ABOUT_IMG_KEYS.map((key, i) => (
            <div key={key} className="relative rounded-xl overflow-hidden h-36" style={{ border: '1px solid #c9a84c' }}>
              <img loading="lazy" decoding="async" src={thumb(ABOUT_IMGS[i])} alt={t(`home.images.${key}`)} className="w-full h-full object-cover" />
              <div className="absolute bottom-0 inset-x-0 bg-black/50 text-xs py-1 px-2" style={{ color: '#e8d5a3' }}>{t(`home.images.${key}`)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Popular searches */}
      <section className="max-w-7xl mx-auto px-4 pb-16 text-center">
        <p className="text-sm" style={{ color: '#a89070' }}>
          Popular:{' '}
          <Link to="/hotels-in-tirupati" className="underline" style={{ color: '#c9a84c' }}>Hotels in Tirupati</Link>
          {' · '}
          <Link to="/rooms-in-tirupati" className="underline" style={{ color: '#c9a84c' }}>Rooms in Tirupati</Link>
          {' · '}
          <Link to="/hotels-near-tirupati-temple" className="underline" style={{ color: '#c9a84c' }}>Hotels Near Tirupati Temple</Link>
        </p>
      </section>
    </div>
  )
}

