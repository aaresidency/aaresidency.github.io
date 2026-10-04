import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { ReviewCard, GUEST_REVIEWS } from '../components/ReviewCard'
import { Seo } from '../components/Seo'

type CategoryKey = 'all' | 'reception' | 'acRooms' | 'nonAcRooms' | 'exterior' | 'events'
type ImageKey = 'receptionLobby' | 'frontDesk' | 'receptionSeating' | 'acRoom101' | 'acRoom102' | 'acRoomDetail' | 'standardRoom' | 'familyRoom1' | 'familyRoom2' | 'frontView' | 'buildingExterior' | 'eventHall' | 'eventStage1' | 'eventStage2' | 'eventStage3'

const CATEGORY_KEYS: CategoryKey[] = ['all', 'reception', 'acRooms', 'nonAcRooms', 'exterior', 'events']

const IMAGES: { categoryKey: Exclude<CategoryKey, 'all'>; imgKey: ImageKey; src: string }[] = [
  { categoryKey: 'reception',  imgKey: 'receptionLobby',   src: '/images/reception-entrance.webp' },
  { categoryKey: 'reception',  imgKey: 'frontDesk',         src: '/images/reception-desk-1.webp' },
  { categoryKey: 'reception',  imgKey: 'receptionSeating',  src: '/images/reception-desk-2.webp' },
  { categoryKey: 'acRooms',    imgKey: 'acRoom101',          src: '/images/room-ac-1.webp' },
  { categoryKey: 'acRooms',    imgKey: 'acRoom102',          src: '/images/room-ac-2.webp' },
  { categoryKey: 'acRooms',    imgKey: 'acRoomDetail',       src: '/images/room-ac-3.webp' },
  { categoryKey: 'nonAcRooms', imgKey: 'standardRoom',       src: '/images/room-nonac-1.webp' },
  { categoryKey: 'acRooms',    imgKey: 'familyRoom1',        src: '/images/room-family-1.webp' },
  { categoryKey: 'acRooms',    imgKey: 'familyRoom2',        src: '/images/room-family-2.webp' },
  { categoryKey: 'exterior',   imgKey: 'frontView',          src: '/images/exterior-front.webp' },
  { categoryKey: 'exterior',   imgKey: 'buildingExterior',   src: '/images/exterior-signage.webp' },
  { categoryKey: 'events',     imgKey: 'eventHall',          src: '/images/banquet-event-1.webp' },
  { categoryKey: 'events',     imgKey: 'eventStage1',        src: '/images/banquet-stage-1.webp' },
  { categoryKey: 'events',     imgKey: 'eventStage2',        src: '/images/banquet-stage-2.webp' },
  { categoryKey: 'events',     imgKey: 'eventStage3',        src: '/images/banquet-stage-3.webp' },
]

const MARQUEE_ROW1 = [...IMAGES, ...IMAGES]
const MARQUEE_ROW2 = [...[...IMAGES].reverse(), ...[...IMAGES].reverse()]

export function Gallery() {
  const { t } = useTranslation()
  const [activeCat, setActiveCat] = useState<CategoryKey>('all')
  const [lightbox, setLightbox] = useState<null | { src: string; imgKey: ImageKey; index: number }>(null)
  const filteredRef = useRef<typeof IMAGES>([])

  const filtered = activeCat === 'all' ? IMAGES : IMAGES.filter((img) => img.categoryKey === activeCat)
  filteredRef.current = filtered

  const openLightbox = (img: typeof IMAGES[0], index: number) =>
    setLightbox({ src: img.src, imgKey: img.imgKey, index })

  const goTo = (dir: 1 | -1) => {
    setLightbox((prev) => {
      if (!prev) return null
      const imgs = filteredRef.current
      const i = (prev.index + dir + imgs.length) % imgs.length
      return { src: imgs[i].src, imgKey: imgs[i].imgKey, index: i }
    })
  }

  useEffect(() => {
    if (!lightbox) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft')  goTo(-1)
      if (e.key === 'ArrowRight') goTo(1)
      if (e.key === 'Escape')     setLightbox(null)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightbox])

  return (
    <div>
      <Seo title="Gallery" description="See photos of AA Residency Tirupati: clean AC and Non-AC rooms, reception, exteriors and banquet spaces. Browse the gallery, then book your stay direct." path="/gallery" />
      {/* Hero */}
      <div className="h-72 bg-cover bg-center relative flex items-center justify-center" style={{ backgroundImage: 'url(/images/exterior-front.webp)' }}>
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative text-center animate-fade-in-up">
          <h1 className="text-5xl font-bold mb-2" style={{ color: '#f5e6c8', textShadow: '0 2px 12px rgba(0,0,0,0.85)' }}>{t('gallery.heroTitle')}</h1>
          <p className="text-lg" style={{ color: '#c9a84c' }}>{t('gallery.heroSubtitle')}</p>
        </div>
      </div>

      {/* Marquee strips */}
      <div className="py-4 space-y-3 overflow-hidden" style={{ backgroundColor: '#0f0700' }}>
        <div className="overflow-hidden marquee-wrapper" aria-hidden="true">
          <div className="animate-marquee gap-3 flex">
            {MARQUEE_ROW1.map((img, i) => (
              <div key={i} className="h-28 w-44 shrink-0 rounded-xl overflow-hidden" style={{ border: '1px solid #c9a84c' }}>
                <img loading="lazy" decoding="async" src={img.src} alt="" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
              </div>
            ))}
          </div>
        </div>
        <div className="overflow-hidden marquee-wrapper" aria-hidden="true">
          <div className="animate-marquee-reverse gap-3 flex">
            {MARQUEE_ROW2.map((img, i) => (
              <div key={i} className="h-28 w-44 shrink-0 rounded-xl overflow-hidden" style={{ border: '1px solid #c9a84c' }}>
                <img loading="lazy" decoding="async" src={img.src} alt="" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category filter + grid */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#f5e6c8' }}>Browse by Category</h2>
          <div className="flex flex-wrap gap-2 justify-center">
            {CATEGORY_KEYS.map((key) => (
              <button
                key={key}
                onClick={() => { setActiveCat(key); setLightbox(null) }}
                className="px-5 py-2 rounded-full text-sm font-medium transition-all duration-200"
                style={activeCat === key
                  ? { backgroundColor: '#c9a84c', color: '#1a0e00', border: '1px solid #c9a84c' }
                  : { backgroundColor: 'transparent', color: '#a89070', border: '1px solid #c9a84c' }
                }
              >
                {t(`gallery.categories.${key}`)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((img, index) => (
            <div
              key={img.src}
              onClick={() => openLightbox(img, index)}
              className="relative rounded-2xl overflow-hidden h-48 cursor-pointer group transition-all duration-300 hover:-translate-y-1"
              style={{ border: '1px solid #c9a84c' }}
            >
              <img loading="lazy" decoding="async" src={img.src} alt={t(`gallery.images.${img.imgKey}`)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="rounded-full p-3" style={{ backgroundColor: '#c9a84c30', border: '1px solid #c9a84c' }}>
                  <svg className="w-6 h-6" fill="none" stroke="#c9a84c" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zm-4-4l2 2" />
                  </svg>
                </div>
              </div>
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-xs font-medium" style={{ color: '#e8d5a3' }}>{t(`gallery.images.${img.imgKey}`)}</p>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center py-12" style={{ color: '#a89070' }}>No images in this category.</p>
        )}
      </section>

      {/* Reviews */}
      <section className="py-14 px-4" style={{ backgroundColor: '#1e0d00' }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8" style={{ color: '#f5e6c8' }}>{t('gallery.reviewsTitle')}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {GUEST_REVIEWS.slice(0, 3).map((r) => <ReviewCard key={r.name} {...r} />)}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setLightbox(null)}>
          <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setLightbox(null)} className="absolute -top-12 right-0 text-white/70 hover:text-white text-3xl leading-none transition-colors">✕</button>
            <button onClick={() => goTo(-1)}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-14 text-white rounded-full p-3 transition-colors duration-200"
              style={{ backgroundColor: '#c9a84c30', border: '1px solid #c9a84c50' }}>
              <svg className="w-6 h-6" fill="none" stroke="#c9a84c" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <img loading="lazy" decoding="async" src={lightbox.src} alt={t(`gallery.images.${lightbox.imgKey}`)} className="w-full max-h-[80vh] object-contain rounded-xl animate-scale-in" style={{ border: '1px solid #c9a84c' }} />
            <button onClick={() => goTo(1)}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-14 text-white rounded-full p-3 transition-colors duration-200"
              style={{ backgroundColor: '#c9a84c30', border: '1px solid #c9a84c50' }}>
              <svg className="w-6 h-6" fill="none" stroke="#c9a84c" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <div className="mt-4 text-center">
              <p className="text-sm" style={{ color: '#e8d5a3' }}>{t(`gallery.images.${lightbox.imgKey}`)}</p>
              <p className="text-xs mt-1" style={{ color: '#a89070' }}>{lightbox.index + 1} / {filtered.length}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

