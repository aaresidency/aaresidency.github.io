import { useState, useEffect } from 'react'
import _PhoneInput from 'react-phone-input-2'
import type { PhoneInputProps } from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { fireBookingConversion } from '../lib/analytics'
import { submitBooking } from '../lib/booking'
import { Turnstile } from './Turnstile'
import { turnstileRequired, TURNSTILE_PROMPT } from '../lib/turnstile'
import { PHONE_DIGITS } from '../lib/contact'

const PhoneInput = ((_PhoneInput as any).default ?? _PhoneInput) as React.ComponentType<PhoneInputProps>

const SLIDES = [
  { src: '/images/hero-slide-room.webp',     mobile: '/images/hero-slide-room-m.webp',     alt: 'Deluxe AC Room' },
  { src: '/images/hero-slide-exterior.webp', mobile: '/images/hero-slide-exterior-m.webp', alt: 'AA Residency Building' },
  { src: '/images/hero-slide-banquet.webp',  mobile: '/images/hero-slide-banquet-m.webp',  alt: 'Banquet & Event Hall' },
]


export function HeroSlider() {
  const [current, setCurrent] = useState(0)
  const [form, setForm] = useState({ guestName: '', numPeople: '1', checkIn: '', contact: '', email: '' })
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [resetSignal, setResetSignal] = useState(0)
  // The Cloudflare check is ~750 KB, so it only loads once the visitor starts the form (or tries to submit).
  const [captchaActive, setCaptchaActive] = useState(false)
  // Only the first slide is needed to paint; the others are fetched a moment later so they don't compete with it.
  const [loadAllSlides, setLoadAllSlides] = useState(false)
  const [status, setStatus] = useState<{ kind: 'info' | 'error'; text: string } | null>(null)

  useEffect(() => {
    const id = setTimeout(() => setLoadAllSlides(true), 2500)
    return () => clearTimeout(id)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => setCurrent((p) => (p + 1) % SLIDES.length), 4500)
    return () => clearInterval(timer)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (form.contact.replace(/\D/g, '').length < 10) {
      setStatus({ kind: 'error', text: 'Please enter a valid contact number.' })
      return
    }
    // Without a token the Worker rejects the booking, so stop here before WhatsApp opens.
    if (turnstileRequired && !turnstileToken) {
      setCaptchaActive(true)
      setStatus({ kind: 'error', text: TURNSTILE_PROMPT })
      return
    }
    const msg = [
      `*New Booking Request*`,
      `Guest Name: ${form.guestName}`,
      `No. of People: ${form.numPeople}`,
      `Check-in Date: ${form.checkIn}`,
      `Contact: +${form.contact.replace(/\D/g, '')}`,
      `Email: ${form.email}`,
    ].join('\n')
    // Open WhatsApp first, synchronously, so the browser treats it as part of the click.
    window.open(`https://wa.me/${PHONE_DIGITS}?text=${encodeURIComponent(msg)}`, '_blank')

    fireBookingConversion()
    setStatus({ kind: 'info', text: 'Request opened in WhatsApp. Sending your confirmation email…' })
    void submitBooking({
      name: form.guestName,
      email: form.email,
      phone: form.contact,
      checkIn: form.checkIn,
      guests: form.numPeople,
      turnstileToken,
    }).then((sent) => {
      setStatus({
        kind: sent ? 'info' : 'error',
        text: sent
          ? `Confirmation email sent to ${form.email}. Please also tap Send in WhatsApp to reach us instantly.`
          : "We couldn't send the confirmation email. Please tap Send in WhatsApp — that reaches us directly.",
      })
    })
    setResetSignal((n) => n + 1)
  }

  return (
    <div>
      {/* ── Hero Carousel ── */}
      <div className="relative w-full h-screen overflow-hidden">
        {/* Gold top border */}
        <div className="absolute top-0 inset-x-0 z-20 h-[3px] bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />

        {/* Gold bottom border */}
        <div className="absolute bottom-0 inset-x-0 z-20 h-[3px] bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />

        {/* Images with fade transition */}
        {SLIDES.map((slide, i) => (
          <div
            key={slide.src}
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out bg-black"
            style={{ opacity: i === current ? 1 : 0 }}
          >
            {(i === 0 || loadAllSlides || i === current) && (
              <picture>
                {/* Phones get a 1300 px version (about half the bytes); larger screens get the full-resolution photo. */}
                <source media="(max-width: 768px)" srcSet={slide.mobile} />
                <img
                  src={slide.src}
                  alt={slide.alt}
                  // The first slide is the page's largest visible image, so fetch it first.
                  fetchPriority={i === 0 ? 'high' : 'low'}
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
              </picture>
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/5 to-black/55" />
          </div>
        ))}

        {/* Centered hotel name + tagline overlay */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4 pointer-events-none">
          {/* Soft dark patch behind the text so it stays readable over bright photos without dimming the whole image */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_center,rgba(0,0,0,0.45),transparent)]" aria-hidden="true" />
          <div className="relative flex items-center gap-4 mb-5">
            <div className="w-16 h-px bg-yellow-400/70" />
            <div className="w-2 h-2 rotate-45 bg-yellow-400" />
            <div className="w-16 h-px bg-yellow-400/70" />
          </div>

          <p className="relative text-yellow-400 text-xs font-bold tracking-[0.35em] uppercase mb-3 animate-fade-in-up [text-shadow:0_1px_6px_rgba(0,0,0,0.8)]">
            Welcome to
          </p>
          <h1
            className="relative text-5xl md:text-7xl font-bold text-white mb-3 tracking-wide drop-shadow-2xl animate-fade-in-up"
            style={{ animationDelay: '0.1s' }}
          >
            AA Residency
          </h1>
          <p
            className="relative text-white text-base md:text-lg tracking-[0.25em] uppercase font-normal animate-fade-in-up [text-shadow:0_1px_8px_rgba(0,0,0,0.85)]"
            style={{ animationDelay: '0.2s' }}
          >
            Comfort &nbsp;•&nbsp; Luxury &nbsp;•&nbsp; Hospitality
          </p>

          <div className="relative flex items-center gap-4 mt-5 mb-8">
            <div className="w-16 h-px bg-yellow-400/70" />
            <div className="w-2 h-2 rotate-45 bg-yellow-400" />
            <div className="w-16 h-px bg-yellow-400/70" />
          </div>

          <a
            href="#book-now"
            className="pointer-events-auto animate-fade-in-up bg-yellow-400 hover:bg-yellow-300 active:scale-95 text-gray-900 font-bold px-8 py-3.5 rounded-lg text-sm tracking-widest uppercase transition-all duration-200 shadow-lg shadow-black/30"
            style={{ animationDelay: '0.3s' }}
          >
            Book Your Stay
          </a>
        </div>

        {/* Prev button */}
        <button
          onClick={() => setCurrent((p) => (p - 1 + SLIDES.length) % SLIDES.length)}
          aria-label="Previous slide"
          className="absolute left-5 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-yellow-400 text-white hover:text-gray-900 rounded-full p-3 transition-all duration-200 border border-white/20 hover:border-yellow-400 backdrop-blur-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Next button */}
        <button
          onClick={() => setCurrent((p) => (p + 1) % SLIDES.length)}
          aria-label="Next slide"
          className="absolute right-5 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-yellow-400 text-white hover:text-gray-900 rounded-full p-3 transition-all duration-200 border border-white/20 hover:border-yellow-400 backdrop-blur-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Dot indicators */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex">
          {SLIDES.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} aria-label={`Slide ${i + 1}`} className="p-2 flex items-center justify-center">
              <span
                className={`block rounded-full transition-all duration-300 ${
                  i === current
                    ? 'w-8 h-2.5 bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.7)]'
                    : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* ── Book Now Section ── */}
      <section id="book-now" className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-14 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Heading */}
          <div className="text-center mb-10">
            <p className="text-yellow-400 text-xs font-bold tracking-[0.3em] uppercase mb-2">
              Reserve Your Stay
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Book Now</h2>
            <div className="flex items-center justify-center gap-3 mt-3">
              <div className="w-8 h-px bg-yellow-400/50" />
              <div className="w-2 h-2 rotate-45 bg-yellow-400" />
              <div className="w-8 h-px bg-yellow-400/50" />
            </div>
          </div>

          {/* Form card */}
          <div className="relative border border-yellow-400/30 rounded-2xl p-1 bg-gradient-to-r from-yellow-400/10 via-transparent to-yellow-400/10">
            <form
              onSubmit={handleSubmit}
              onFocusCapture={() => setCaptchaActive(true)}
              onPointerDownCapture={() => setCaptchaActive(true)}
              className="bg-white/5 backdrop-blur-sm rounded-xl px-6 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-end"
            >
              {/* Guest Name */}
              <div className="flex flex-col gap-2 lg:col-span-1">
                <label htmlFor="hero-name" className="text-yellow-300 text-[11px] font-bold uppercase tracking-widest">
                  Guest Name
                </label>
                <input
                  id="hero-name"
                  type="text"
                  required
                  placeholder="Your full name"
                  value={form.guestName}
                  onChange={(e) => setForm({ ...form, guestName: e.target.value })}
                  className="px-4 py-3 rounded-lg bg-white text-gray-800 text-sm placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 outline-none transition"
                />
              </div>

              {/* No. of People */}
              <div className="flex flex-col gap-2 lg:col-span-1">
                <label htmlFor="hero-people" className="text-yellow-300 text-[11px] font-bold uppercase tracking-widest">
                  No. of People
                </label>
                <select
                  id="hero-people"
                  value={form.numPeople}
                  onChange={(e) => setForm({ ...form, numPeople: e.target.value })}
                  className="px-4 py-3 rounded-lg bg-white text-gray-800 text-sm focus:ring-2 focus:ring-yellow-400 outline-none transition"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? 'Person' : 'People'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Check-in Date */}
              <div className="flex flex-col gap-2 lg:col-span-1">
                <label htmlFor="hero-checkin" className="text-yellow-300 text-[11px] font-bold uppercase tracking-widest">
                  Check-in Date
                </label>
                <input
                  id="hero-checkin"
                  type="date"
                  required
                  value={form.checkIn}
                  onChange={(e) => setForm({ ...form, checkIn: e.target.value })}
                  className="px-4 py-3 rounded-lg bg-white text-gray-800 text-sm focus:ring-2 focus:ring-yellow-400 outline-none transition"
                />
              </div>

              {/* Contact Number */}
              <div className="flex flex-col gap-2 lg:col-span-1">
                <label htmlFor="hero-phone" className="text-yellow-300 text-[11px] font-bold uppercase tracking-widest">
                  Contact Number
                </label>
                <PhoneInput
                  country="in"
                  value={form.contact}
                  onChange={(phone) => setForm({ ...form, contact: phone })}
                  inputProps={{ id: 'hero-phone' }}
                  inputClass="!w-full !h-[46px] !text-sm !text-gray-800 !border-gray-300 !rounded-md focus:!border-yellow-400 focus:!ring-2 focus:!ring-yellow-300"
                  containerClass="!w-full"
                  buttonClass="!border-gray-300 !rounded-l-md"
                />
              </div>

              {/* Email (for the confirmation copy) */}
              <div className="flex flex-col gap-2 sm:col-span-2 lg:col-span-3">
                <label htmlFor="hero-email" className="text-yellow-300 text-[11px] font-bold uppercase tracking-widest">
                  Email (for your confirmation)
                </label>
                <input
                  id="hero-email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="px-4 py-3 rounded-lg bg-white text-gray-800 text-sm placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 outline-none transition"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="lg:col-span-1 bg-yellow-400 hover:bg-yellow-300 active:scale-95 text-gray-900 font-bold py-3 px-4 rounded-lg transition-all duration-200 shadow-lg shadow-yellow-400/20 flex items-center justify-center gap-2 text-sm"
              >
                <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Book Now
              </button>

              <div className="sm:col-span-2 lg:col-span-4 flex flex-col gap-2 items-start">
                {captchaActive ? (
                  <Turnstile
                    onToken={(token) => {
                      setTurnstileToken(token)
                      if (token) setStatus((s) => (s?.text === TURNSTILE_PROMPT ? null : s))
                    }}
                    resetSignal={resetSignal}
                  />
                ) : (
                  // Reserve the widget's height so the form doesn't jump when it appears.
                  turnstileRequired && <div className="h-[65px]" aria-hidden="true" />
                )}
                {status && (
                  <p role="status" className={`text-xs ${status.kind === 'error' ? 'text-red-300' : 'text-green-300'}`}>
                    {status.text}
                  </p>
                )}
              </div>
            </form>
          </div>

          <p className="text-center text-gray-400 text-xs mt-4">
            Your request opens in WhatsApp and a confirmation is emailed to you. We'll confirm within minutes.
          </p>
        </div>
      </section>
    </div>
  )
}
