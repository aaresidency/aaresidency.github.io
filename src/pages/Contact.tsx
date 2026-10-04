import { Seo } from '../components/Seo'
import { hotelSchema } from '../lib/schema'
import { EMAIL, PHONE_DIGITS, PHONE_DISPLAY, PHONE_E164 } from '../lib/contact'
const MAPS_EMBED = 'https://www.google.com/maps?q=22-11-246/1,+Gollavani+Gunta,+Renigunta+Rd,+AutoNagar,+Tirupati,+Andhra+Pradesh+517501&output=embed'
const MAPS_LINK = 'https://www.google.com/maps/dir/?api=1&destination=AA+Residency+Tirupati+Renigunta+Road'
const MAPS_SEARCH = 'https://www.google.com/maps/search/AA+Residency+Tirupati'

export function Contact() {
  return (
    <div>
      <Seo title="Contact Us" description="Call, WhatsApp or visit AA Residency on Renigunta Road, Tirupati. Our front desk is open 24/7 to help with rooms, rates and availability. Get in touch today." path="/contact" jsonLd={[hotelSchema()]} />
      {/* Hero */}
      <div className="h-60 bg-cover bg-center relative flex items-center justify-center" style={{ backgroundImage: 'url(/images/reception-entrance.jpg)' }}>
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative text-center">
          <h1 className="text-4xl font-bold" style={{ color: '#f5e6c8', textShadow: '0 2px 12px rgba(0,0,0,0.85)' }}>Contact & Location</h1>
          <p className="mt-1" style={{ color: '#c9a84c' }}>Call, WhatsApp, or simply drive over</p>
        </div>
      </div>

      <section className="max-w-6xl mx-auto px-4 py-14">
        <div className="text-center mb-10">
          <p className="font-semibold uppercase tracking-widest text-sm mb-2" style={{ color: '#c9a84c' }}>Find Us</p>
          <h2 className="text-3xl font-bold" style={{ color: '#f5e6c8' }}>Get In Touch</h2>
          <p className="text-sm mt-3 max-w-xl mx-auto" style={{ color: '#a89070' }}>
            Call, message on WhatsApp, or simply drive over — we're on Renigunta Road, Auto Nagar.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 items-start">
          {/* Contact info card */}
          <div className="rounded-2xl p-8 flex flex-col gap-5" style={{ backgroundColor: '#251508', border: '1px solid #c9a84c' }}>
            <div>
              <h3 className="text-2xl font-bold" style={{ color: '#f5e6c8' }}>AA Residency</h3>
              <p className="font-semibold text-xs uppercase tracking-widest mt-1" style={{ color: '#c9a84c' }}>Tirupati, Andhra Pradesh</p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <span className="mt-0.5" style={{ color: '#c9a84c' }}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
                <p className="text-sm leading-relaxed" style={{ color: '#c8b89a' }}>
                  22-11-246/1, Gollavani Gunta, Renigunta Road,<br />Auto Nagar, Tirupati, Andhra Pradesh – 517501
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span style={{ color: '#c9a84c' }}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </span>
                <a href={`tel:${PHONE_E164}`} className="text-sm font-medium transition-colors" style={{ color: '#c8b89a' }}>{PHONE_DISPLAY}</a>
              </div>

              <div className="flex items-center gap-3">
                <span style={{ color: '#c9a84c' }}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <a href={`mailto:${EMAIL}`} className="text-sm font-medium" style={{ color: '#c8b89a' }}>
                  {EMAIL}
                </a>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <a href={`https://wa.me/${PHONE_DIGITS}`} target="_blank" rel="noreferrer"
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp Us
              </a>
              <a href={`tel:${PHONE_E164}`}
                className="flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-full transition-colors"
                style={{ border: '1px solid #c9a84c', color: '#c9a84c' }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call Hotel
              </a>
            </div>
          </div>

          {/* Map card */}
          <div className="rounded-2xl overflow-hidden flex flex-col" style={{ backgroundColor: '#251508', border: '1px solid #c9a84c' }}>
            <div className="h-80">
              <iframe src={MAPS_EMBED} width="100%" height="100%" style={{ border: 0 }}
                allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="AA Residency Location" />
            </div>
            <div className="flex flex-wrap gap-2 p-4" style={{ borderTop: '1px solid #251005' }}>
              <a href={MAPS_LINK} target="_blank" rel="noreferrer"
                className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full transition-colors"
                style={{ backgroundColor: '#c9a84c', color: '#1a0e00' }}>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Get Directions
              </a>
              <a href={MAPS_SEARCH} target="_blank" rel="noreferrer"
                className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full transition-colors"
                style={{ border: '1px solid #c9a84c', color: '#c9a84c' }}>
                Open in Google Maps
              </a>
              <a href={`tel:${PHONE_E164}`}
                className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full transition-colors"
                style={{ border: '1px solid #c9a84c', color: '#a89070' }}>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call Hotel
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
