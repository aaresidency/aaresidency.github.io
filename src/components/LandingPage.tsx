import { Link } from 'react-router-dom'
import { Seo } from './Seo'
import { faqSchema, hotelSchema } from '../lib/schema'
import { PHONE_DIGITS, PHONE_DISPLAY, PHONE_E164 } from '../lib/contact'


export interface LandingPageProps {
  seo: { title: string; description: string; path: string }
  heroImage: string
  kicker: string
  heading: string
  intro: string[]
  /** Optional extra headed sections between the intro and the two cards. */
  sections?: { title: string; body: string[] }[]
  cta: { label: string; to: string }
  cardOne: { title: string; items: string[] }
  cardTwo: { title: string; items: string[] }
  faqs: { q: string; a: string }[]
  related: { label: string; to: string }[]
}

const card = { backgroundColor: '#251508', border: '1px solid #c9a84c' }

export function LandingPage({ seo, heroImage, kicker, heading, intro, sections = [], cta, cardOne, cardTwo, faqs, related }: LandingPageProps) {
  return (
    <div>
      <Seo {...seo} jsonLd={[hotelSchema(), faqSchema(faqs)]} />
      <div className="h-60 bg-cover bg-center relative flex items-center justify-center" style={{ backgroundImage: `url(${heroImage})` }}>
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative text-center px-4">
          <p className="font-semibold uppercase tracking-widest text-sm mb-2" style={{ color: '#c9a84c' }}>{kicker}</p>
          <h1 className="text-3xl md:text-4xl font-bold" style={{ color: '#f5e6c8', textShadow: '0 2px 12px rgba(0,0,0,0.85)' }}>{heading}</h1>
        </div>
      </div>

      <section className="max-w-4xl mx-auto px-4 py-14 space-y-5">
        {intro.map((p) => (
          <p key={p} className="leading-relaxed" style={{ color: '#c8b89a' }}>{p}</p>
        ))}
        <p className="leading-relaxed" style={{ color: '#c8b89a' }}>
          For quick booking support call <a href={`tel:${PHONE_E164}`} className="font-semibold" style={{ color: '#c9a84c' }}>{PHONE_DISPLAY}</a>.
        </p>
        <div className="flex flex-wrap gap-4 pt-2">
          <Link to={cta.to} className="px-6 py-2.5 rounded-lg font-medium" style={{ backgroundColor: '#c9a84c', color: '#1a0e00' }}>{cta.label}</Link>
          <a
            href={`https://wa.me/${PHONE_DIGITS}?text=${encodeURIComponent('Hello AA Residency, I want to book a room.')}`}
            target="_blank" rel="noreferrer"
            className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-green-700"
          >
            WhatsApp Us
          </a>
        </div>
      </section>

      {sections.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 pb-14 space-y-10">
          {sections.map((sec) => (
            <div key={sec.title}>
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#f5e6c8' }}>{sec.title}</h2>
              <div className="space-y-4">
                {sec.body.map((p) => (
                  <p key={p} className="leading-relaxed" style={{ color: '#c8b89a' }}>{p}</p>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      <section className="max-w-6xl mx-auto px-4 pb-14 grid md:grid-cols-2 gap-6">
        {[cardOne, cardTwo].map((c) => (
          <article key={c.title} className="rounded-2xl p-8" style={card}>
            <h2 className="text-xl font-bold mb-4" style={{ color: '#f5e6c8' }}>{c.title}</h2>
            <ul className="list-disc list-inside space-y-2 text-sm leading-relaxed" style={{ color: '#c8b89a' }}>
              {c.items.map((i) => <li key={i}>{i}</li>)}
            </ul>
          </article>
        ))}
      </section>

      <section className="max-w-4xl mx-auto px-4 pb-14">
        <h2 className="text-2xl font-bold mb-6" style={{ color: '#f5e6c8' }}>Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((f) => (
            <div key={f.q} className="rounded-2xl p-6" style={card}>
              <h3 className="font-bold mb-2" style={{ color: '#f5e6c8' }}>{f.q}</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#c8b89a' }}>{f.a}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-sm" style={{ color: '#a89070' }}>
          Explore more:{' '}
          {related.map((r, i) => (
            <span key={r.to}>
              {i > 0 && ' · '}
              <Link to={r.to} className="underline" style={{ color: '#c9a84c' }}>{r.label}</Link>
            </span>
          ))}
        </p>
      </section>

    </div>
  )
}
