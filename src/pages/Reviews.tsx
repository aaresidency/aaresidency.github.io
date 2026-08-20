import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ReviewCard, GUEST_REVIEWS } from '../components/ReviewCard'
import { Seo } from '../components/Seo'

const RATING_BREAKDOWN = [
  { labelKey: 'reviews.page.cleanlinessLabel', score: '4.9' },
  { labelKey: 'reviews.page.hospitalityLabel', score: '4.8' },
  { labelKey: 'reviews.page.valueLabel',       score: '4.7' },
  { labelKey: 'reviews.page.locationLabel',    score: '4.8' },
]

export function Reviews() {
  const { t } = useTranslation()

  return (
    <div>
      <Seo title="Guest Reviews" description="Read verified guest reviews of AA Residency Tirupati." path="/reviews" />
      {/* Hero */}
      <section className="py-20 px-4" style={{ background: 'linear-gradient(135deg, #0f0700 0%, #251508 50%, #0f0700 100%)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-semibold uppercase tracking-widest text-sm mb-3" style={{ color: '#c9a84c' }}>{t('reviews.sectionLabel')}</p>
          <h1 className="text-4xl font-bold mb-4" style={{ color: '#f5e6c8', textShadow: '0 2px 12px rgba(0,0,0,0.85)' }}>{t('reviews.page.heroTitle')}</h1>
          <p className="text-lg mb-10" style={{ color: '#c8b89a' }}>{t('reviews.page.heroSubtitle')}</p>

          <div className="inline-flex flex-col sm:flex-row items-center gap-6 rounded-2xl px-8 py-6" style={{ backgroundColor: '#251508', border: '1px solid #c9a84c' }}>
            <div className="text-center">
              <p className="text-6xl font-bold text-amber-400 leading-none">4.8</p>
              <div className="flex justify-center text-amber-400 text-2xl my-2">★★★★★</div>
              <p className="text-sm" style={{ color: '#a89070' }}>{t('reviews.overallRating')}</p>
            </div>
            <div className="w-full sm:w-px h-px sm:h-16" style={{ backgroundColor: '#251005' }}></div>
            <div className="text-center sm:text-left space-y-2">
              <div>
                <span className="text-2xl font-bold" style={{ color: '#f5e6c8' }}>200+</span>
                <span className="ml-2 text-sm" style={{ color: '#a89070' }}>{t('reviews.happyGuests')}</span>
              </div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <svg className="w-4 h-4 text-green-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm" style={{ color: '#a89070' }}>{t('reviews.verifiedReviews')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rating breakdown */}
      <section className="py-10 px-4" style={{ backgroundColor: '#1e0d00', borderBottom: '1px solid #251005' }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-base font-semibold uppercase tracking-widest text-center mb-8" style={{ color: '#a89070' }}>{t('reviews.page.ratingsTitle')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {RATING_BREAKDOWN.map(({ labelKey, score }) => (
              <div key={labelKey} className="text-center">
                <p className="text-4xl font-bold leading-none mb-1" style={{ color: '#c9a84c' }}>{score}</p>
                <div className="flex justify-center text-amber-400 text-sm mb-1">★★★★★</div>
                <p className="text-xs" style={{ color: '#a89070' }}>{t(labelKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All reviews */}
      <section className="py-16 px-4" style={{ backgroundColor: '#1a0e00' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {GUEST_REVIEWS.map((r) => <ReviewCard key={r.name} {...r} />)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 text-center" style={{ background: 'linear-gradient(135deg, #251508 0%, #1a0e00 100%)', borderTop: '1px solid #251005' }}>
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-3" style={{ color: '#f5e6c8' }}>{t('reviews.page.ctaTitle')}</h2>
          <p className="mb-8 text-lg" style={{ color: '#c8b89a' }}>{t('reviews.page.ctaDesc')}</p>
          <Link to="/rooms" className="inline-block px-8 py-3 rounded-lg font-semibold transition-colors"
            style={{ backgroundColor: '#c9a84c', color: '#1a0e00' }}>
            {t('reviews.page.ctaBtn')}
          </Link>
        </div>
      </section>
    </div>
  )
}
