import { useTranslation } from 'react-i18next'

export interface Review {
  name: string
  rating: number
  reviewKey: string
  avatarColor?: string
  avatarImage?: string
  stayType?: string
}

export function ReviewCard({ name, rating, reviewKey, avatarColor = 'bg-amber-600', avatarImage, stayType }: Review) {
  const { t } = useTranslation()
  const initials = name.split(' ').map((w) => w[0]).slice(0, 2).join('')
  return (
    <div className="rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden" style={{ backgroundColor: '#251508', border: '1px solid #c9a84c' }}>
      <svg className="absolute top-3 right-3 w-10 h-10 opacity-10" fill="#c9a84c" viewBox="0 0 24 24">
        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
      </svg>
      <div className="flex items-center gap-3">
        {avatarImage ? (
          <img loading="lazy" decoding="async" src={avatarImage} alt={name} className="w-11 h-11 rounded-full object-cover shrink-0" />
        ) : (
          <div className={`w-11 h-11 rounded-full ${avatarColor} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
            {initials}
          </div>
        )}
        <div>
          <p className="font-semibold text-sm" style={{ color: '#f5e6c8' }}>{name}</p>
          <div className="flex items-center gap-1">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={`text-sm ${i < rating ? 'text-amber-400' : 'text-amber-900'}`}>★</span>
              ))}
            </div>
            {stayType && <span className="text-xs ml-1" style={{ color: '#a89070' }}>· {stayType}</span>}
          </div>
        </div>
      </div>
      <p className="text-sm leading-relaxed flex-1" style={{ color: '#c8b89a' }}>{t(reviewKey)}</p>
      <div className="flex items-center gap-1.5 pt-3" style={{ borderTop: '1px solid #251005' }}>
        <svg className="w-3.5 h-3.5 text-green-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <span className="text-xs text-green-500 font-medium">{t('reviews.verifiedGuest')}</span>
      </div>
    </div>
  )
}

// Real Google reviews for AA Residency Tirupati (placeId ChIJdQWIiRdLTToRyWWqqurOXok).
export const GUEST_REVIEWS: Review[] = [
  { name: 'Nithesh Kamasani',       rating: 5, reviewKey: 'reviews.nithesh.review',  avatarImage: '/images/reviews/google-review-1.jpg' },
  { name: 'praveen manilal patel',  rating: 5, reviewKey: 'reviews.praveen.review',  avatarImage: '/images/reviews/google-review-2.jpg' },
  { name: 'Himateja Surapalli',     rating: 5, reviewKey: 'reviews.himateja.review', avatarImage: '/images/reviews/google-review-3.jpg' },
]
