import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ReviewCard, GUEST_REVIEWS } from '../components/ReviewCard'
import { BookingModal } from '../components/BookingModal'
import { Seo } from '../components/Seo'
import { roomsSchema } from '../lib/schema'
import { PHONE_DIGITS, PHONE_E164 } from '../lib/contact'

const ADDRESS = '22-11-246/1, Gollavani Gunta, Renigunta Rd, AutoNagar, Tirupati, Andhra Pradesh 517501'

type RoomTypeKey = 'ac' | 'nonAc' | 'deluxe' | 'studio' | 'family'
type FeatureKey = 'ac' | 'wifi' | 'tv' | 'bathroom' | 'hotWater' | 'powerBackup' | 'fan' | 'seating'

const ROOMS: { typeKey: RoomTypeKey; price: string; capacity: string; size: string; desc: string; images: string[]; featureKeys: FeatureKey[]; available: boolean }[] = [
  {
    typeKey: 'deluxe',
    price: '₹1,200',
    capacity: '2 Adults',
    size: '220 sq ft',
    desc: 'Comfortable non-AC room with modern furnishings, ideal for budget-conscious travellers seeking quality.',
    images: ['/images/room-nonac-1.webp', '/images/bathroom-1.webp'],
    featureKeys: ['fan', 'wifi', 'tv', 'bathroom', 'hotWater', 'powerBackup'],
    available: true,
  },
  {
    typeKey: 'studio',
    price: '₹1,800',
    capacity: '2 Adults',
    size: '220 sq ft',
    desc: 'Premium air-conditioned room with elegant décor and all modern amenities for a refined stay.',
    images: ['/images/room-ac-2.webp', '/images/room-ac-3.webp'],
    featureKeys: ['ac', 'wifi', 'tv', 'bathroom', 'hotWater', 'powerBackup'],
    available: true,
  },
  {
    typeKey: 'family',
    price: '₹2,200',
    capacity: '4 Adults',
    size: '220 sq ft',
    desc: 'Spacious air-conditioned family suite with multiple beds, seating area and all the comforts of home.',
    images: ['/images/room-family-ac-1.webp', '/images/room-family-1.webp', '/images/room-family-2.webp'],
    featureKeys: ['ac', 'wifi', 'tv', 'bathroom', 'hotWater', 'powerBackup', 'seating'],
    available: true,
  },
]

export function Rooms() {
  const { t } = useTranslation()
  const [showModal, setShowModal] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<RoomTypeKey | null>(null)
  const [activeImg, setActiveImg] = useState<Record<string, number>>({})

  const getImg = (type: string) => activeImg[type] ?? 0

  return (
    <div>
      <Seo title="Rooms & Rates" description="Book AC and Non-AC deluxe, studio and family rooms in Tirupati at AA Residency. Clear pricing, free Wi-Fi and parking. Check availability and reserve direct." path="/rooms" jsonLd={[roomsSchema()]} />
      {/* Hero */}
      <div className="h-60 bg-cover bg-center relative flex items-center justify-center" style={{ backgroundImage: 'url(/images/room-ac-1.webp)' }}>
        <div className="absolute inset-0 bg-black/35" />
        <div className="relative text-center">
          <h1 className="text-4xl font-bold" style={{ color: '#f5e6c8', textShadow: '0 2px 12px rgba(0,0,0,0.85)' }}>{t('rooms.heroTitle')}</h1>
          <p className="mt-1" style={{ color: '#c9a84c' }}>{t('rooms.heroSubtitle')}</p>
        </div>
      </div>

      <section className="max-w-5xl mx-auto px-4 py-14 space-y-8">
        {ROOMS.map((room) => (
          <div key={room.typeKey} className="rounded-2xl overflow-hidden grid md:grid-cols-5 shadow-lg"
            style={{ backgroundColor: '#1e0d00', border: '1px solid #c9a84c' }}>

            {/* Image — takes 2/5 columns */}
            <div className="relative md:col-span-2 h-64 md:h-auto min-h-[280px]">
              <img loading="lazy" decoding="async"
                src={room.images[getImg(room.typeKey)]}
                alt={t(`rooms.types.${room.typeKey}`)}
                className="w-full h-full object-cover"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)' }} />

              {/* Room name on image */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="font-bold text-base" style={{ color: '#f5e6c8' }}>{t(`rooms.types.${room.typeKey}`)}</p>
              </div>

              {/* Image dots */}
              {room.images.length > 1 && (
                <div className="absolute top-3 right-3 flex gap-1.5">
                  {room.images.map((_, i) => (
                    <button key={i} onClick={() => setActiveImg({ ...activeImg, [room.typeKey]: i })}
                      className="w-2 h-2 rounded-full transition-all"
                      style={{ backgroundColor: getImg(room.typeKey) === i ? '#c9a84c' : 'rgba(255,255,255,0.5)' }} />
                  ))}
                </div>
              )}
            </div>

            {/* Content — takes 3/5 columns */}
            <div className="md:col-span-3 p-7 flex flex-col gap-4">

              {/* Header row */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  {room.typeKey === 'deluxe' && (
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full" style={{ backgroundColor: '#3a2010', color: '#c9a84c', border: '1px solid #c9a84c40' }}>Non-AC</span>
                  )}
                  {(room.typeKey === 'studio' || room.typeKey === 'family') && (
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full" style={{ backgroundColor: '#0d2a18', color: '#4ade80', border: '1px solid #4ade8030' }}>AC</span>
                  )}
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full shrink-0"
                  style={{ backgroundColor: room.available ? '#0d2a18' : '#2a0d0d', color: room.available ? '#4ade80' : '#f87171' }}>
                  {room.available ? t('rooms.available') : t('rooms.booked')}
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold" style={{ color: '#c9a84c' }}>{room.price}</span>
                <span className="text-sm" style={{ color: '#a89070' }}>/ night</span>
              </div>

              {/* Description */}
              <p className="text-sm leading-relaxed" style={{ color: '#a89070' }}>{room.desc}</p>

              {/* Size & capacity pills */}
              <div className="flex gap-3">
                <div className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg" style={{ backgroundColor: '#251508', color: '#c8b89a' }}>
                  <span>📐</span><span>{room.size}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg" style={{ backgroundColor: '#251508', color: '#c8b89a' }}>
                  <span>👥</span><span>{room.capacity}</span>
                </div>
              </div>

              {/* Feature tags */}
              <div className="flex flex-wrap gap-1.5">
                {room.featureKeys.map((key) => (
                  <span key={key} className="text-xs px-2.5 py-1 rounded-md" style={{ backgroundColor: '#251508', color: '#a89070' }}>
                    {t(`rooms.features.${key}`)}
                  </span>
                ))}
              </div>

              {/* Divider */}
              <div className="h-px" style={{ backgroundColor: '#3a2010' }} />

              {/* Action buttons — side by side */}
              <div className="flex gap-3">
                <button
                  onClick={() => { setSelectedRoom(room.typeKey); setShowModal(true) }}
                  className="flex-1 font-semibold py-2.5 rounded-xl text-sm transition-all hover:opacity-90"
                  style={{ backgroundColor: '#c9a84c', color: '#1a0e00' }}
                >
                  {t('rooms.bookRoom')}
                </button>
                <a
                  href={`https://wa.me/${PHONE_DIGITS}?text=${encodeURIComponent(`I'd like to enquire about ${t(`rooms.types.${room.typeKey}`)}`)}`}
                  target="_blank" rel="noreferrer"
                  className="flex-1 font-semibold py-2.5 rounded-xl text-sm text-center transition-all hover:opacity-80"
                  style={{ border: '1px solid #c9a84c', color: '#c9a84c' }}
                >
                  {t('rooms.whatsappEnquiry')}
                </a>
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="py-10 px-4" style={{ backgroundColor: '#1e0d00' }}>
        <div className="max-w-xl mx-auto text-center">
          <h2 className="font-bold text-lg mb-2" style={{ color: '#f5e6c8' }}>{t('rooms.helpTitle')}</h2>
          <p className="text-sm mb-4" style={{ color: '#a89070' }}>{ADDRESS}</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <a href={`tel:${PHONE_E164}`} className="px-5 py-2 rounded-lg text-sm font-medium"
              style={{ backgroundColor: '#c9a84c', color: '#1a0e00' }}>{t('rooms.callUs')}</a>
            <a href={`https://wa.me/${PHONE_DIGITS}`} target="_blank" rel="noreferrer"
              className="bg-green-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-green-700">{t('rooms.whatsapp')}</a>
          </div>
        </div>
      </section>

      <section className="py-14 px-4" style={{ backgroundColor: '#1a0e00' }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8" style={{ color: '#f5e6c8' }}>{t('rooms.reviewsTitle')}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {GUEST_REVIEWS.map((r) => <ReviewCard key={r.name} {...r} />)}
          </div>
        </div>
      </section>

      {showModal && (
        <BookingModal
          bookingData={{ checkIn: '', checkOut: '', rooms: selectedRoom ? t(`rooms.types.${selectedRoom}`) : '1', guests: '1' }}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}
