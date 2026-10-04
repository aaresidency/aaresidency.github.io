import { useTranslation } from 'react-i18next'
import { Seo } from '../components/Seo'
import { WHATSAPP_URL } from '../lib/contact'

type PartnerKey = 'corporate' | 'travel' | 'tour'
const PARTNER_KEYS: PartnerKey[] = ['corporate', 'travel', 'tour']
const PARTNER_ICONS = ['🏢', '✈️', '🗺️']

export function B2B() {
  const { t } = useTranslation()

  return (
    <div>
      <Seo title="Corporate & Travel Partners" description="Corporate, travel agent and tour operator partnerships with AA Residency Tirupati. Group and corporate bookings made simple. Contact us to set up an account." path="/b2b" />
      <div className="h-72 bg-cover bg-center relative flex items-center justify-center" style={{ backgroundImage: 'url(/images/reception-desk-1.webp)' }}>
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative text-center px-4">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#c9a84c' }}>{t('b2b.badge')}</span>
          <h1 className="text-4xl md:text-5xl font-bold mt-2" style={{ color: '#f5e6c8', textShadow: '0 2px 12px rgba(0,0,0,0.85)' }}>{t('b2b.heroTitle')}</h1>
          <p className="mt-3 max-w-xl mx-auto" style={{ color: '#c8b89a' }}>{t('b2b.heroSubtitle')}</p>
        </div>
      </div>

      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="font-semibold uppercase tracking-widest text-sm mb-3" style={{ color: '#c9a84c' }}>{t('b2b.sectionLabel')}</p>
        <h2 className="text-3xl font-bold mb-4" style={{ color: '#f5e6c8' }}>{t('b2b.heading')}</h2>
        <p className="leading-relaxed max-w-2xl mx-auto" style={{ color: '#a89070' }}>{t('b2b.desc')}</p>
      </section>

      <section className="py-14 px-4" style={{ backgroundColor: '#1e0d00' }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {PARTNER_KEYS.map((key, i) => (
              <div key={key} className="rounded-2xl p-8 text-center transition-all hover:-translate-y-1"
                style={{ backgroundColor: '#251508', border: '1px solid #c9a84c' }}>
                <div className="text-5xl mb-4">{PARTNER_ICONS[i]}</div>
                <h3 className="text-lg font-bold mb-2" style={{ color: '#f5e6c8' }}>{t(`b2b.partners.${key}.label`)}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#a89070' }}>{t(`b2b.partners.${key}.desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-2" style={{ color: '#f5e6c8' }}>{t('b2b.interestTitle')}</h2>
        <p className="text-sm mb-8" style={{ color: '#a89070' }}>{t('b2b.interestDesc')}</p>
        <a
          href={`${WHATSAPP_URL}?text=${encodeURIComponent("I'm interested in B2B partnership with AA Residency")}`}
          target="_blank" rel="noreferrer"
          className="inline-flex items-center gap-2 bg-green-600 text-white font-semibold px-8 py-3 rounded-xl hover:bg-green-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          {t('b2b.interestBtn')}
        </a>
      </section>
    </div>
  )
}
