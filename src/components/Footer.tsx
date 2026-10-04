import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { EMAIL, PHONE_DISPLAY, PHONE_E164, WHATSAPP_URL } from '../lib/contact'

export function Footer() {
  const { t } = useTranslation()

  const quickLinks = [
    { label: t('footer.links.home'), to: '/' },
    { label: t('footer.links.rooms'), to: '/rooms' },
    { label: t('footer.links.facilities'), to: '/facilities' },
    { label: t('footer.links.gallery'), to: '/gallery' },
    { label: t('footer.links.events'), to: '/events' },
    { label: t('footer.links.nearby'), to: '/nearby' },
    { label: t('footer.links.reviews'), to: '/reviews' },
    { label: t('footer.links.contact'), to: '/contact' },
    { label: t('footer.links.about'), to: '/about' },
    { label: t('footer.links.b2b'), to: '/b2b' },
    { label: t('footer.links.privacy'), to: '/privacy' },
    { label: t('footer.links.terms'), to: '/terms' },
  ]

  return (
    <footer style={{ backgroundColor: '#0f0700', borderTop: '1px solid #c9a84c' }}>
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <div className="mb-3">
            <img loading="lazy" decoding="async" src="/logo-sm.webp" alt="AA Residency" className="h-10 w-auto object-contain" />
          </div>
          <p className="text-sm leading-relaxed" style={{ color: '#a89070' }}>{t('footer.tagline')}</p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold mb-4" style={{ color: '#c9a84c' }}>{t('footer.quickLinks')}</h3>
          <ul className="space-y-2 text-sm">
            {quickLinks.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="gold-link">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold mb-4" style={{ color: '#c9a84c' }}>{t('footer.contact')}</h3>
          <ul className="space-y-3 text-sm" style={{ color: '#a89070' }}>
            <li className="flex items-start gap-2">
              <span className="mt-0.5">📍</span>
              <span>22-11-246/1, Gollavani Gunta, Renigunta Rd, AutoNagar, Tirupati, Andhra Pradesh 517501</span>
            </li>
            <li className="flex items-center gap-2">
              <span>📞</span>
              <a href={`tel:${PHONE_E164}`} className="gold-link">{PHONE_DISPLAY}</a>
            </li>
            <li className="flex items-center gap-2">
              <span>✉️</span>
              <a href={`mailto:${EMAIL}`} className="gold-link">{EMAIL}</a>
            </li>
            <li className="flex items-center gap-2">
              <span>💬</span>
              <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="text-green-500 hover:text-green-400 transition-colors">
                {t('footer.whatsappUs')}
              </a>
            </li>
          </ul>
        </div>

        {/* Map */}
        <div>
          <h3 className="font-semibold mb-4" style={{ color: '#c9a84c' }}>{t('footer.location')}</h3>
          <div className="rounded-xl overflow-hidden h-36" style={{ border: '1px solid #c9a84c' }}>
            <iframe
              src="https://www.google.com/maps?q=22-11-246/1,+Gollavani+Gunta,+Renigunta+Rd,+AutoNagar,+Tirupati,+Andhra+Pradesh+517501&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="AA Residency Location"
            />
          </div>
        </div>
      </div>

      <div className="py-4 text-center text-xs" style={{ borderTop: '1px solid #251005', color: '#6a5040' }}>
        {t('footer.copyright', { year: new Date().getFullYear() })}
      </div>
    </footer>
  )
}
