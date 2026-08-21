import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const LANG_MAP: Record<string, string> = { EN: 'en', HI: 'hi', GU: 'gu' }
const LANGUAGES = ['EN', 'HI', 'GU']
const WHATSAPP = '+918790057559'

export function Header() {
  const { t, i18n } = useTranslation()
  const [activeLang, setActiveLang] = useState('EN')
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  const navLinks = [
    { label: t('nav.home'), to: '/' },
    { label: t('nav.rooms'), to: '/rooms' },
    { label: t('nav.gallery'), to: '/gallery' },
    { label: t('nav.facilities'), to: '/facilities' },
    { label: t('nav.events'), to: '/events' },
    { label: t('nav.reviews'), to: '/reviews' },
    { label: t('nav.nearby'), to: '/nearby' },
    { label: t('nav.b2b'), to: '/b2b' },
    { label: t('nav.about'), to: '/about' },
    { label: t('nav.contact'), to: '/contact' },
  ]

  const handleLang = (l: string) => {
    setActiveLang(l)
    i18n.changeLanguage(LANG_MAP[l])
  }

  return (
    <header className="sticky top-0 z-50 border-b" style={{ backgroundColor: '#0f0700', borderColor: '#251005' }}>
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="shrink-0">
          <img src="/logo.png" alt="AA Residency" className="h-12 w-auto object-contain" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-5 flex-wrap">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-xs font-medium transition-colors"
              style={{
                color: location.pathname === link.to ? '#c9a84c' : '#c8b89a',
                borderBottom: location.pathname === link.to ? '2px solid #c9a84c' : '2px solid transparent',
                paddingBottom: '2px',
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right section */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <select
            value={activeLang}
            onChange={(e) => handleLang(e.target.value)}
            className="text-xs px-2 py-1.5 rounded border font-medium cursor-pointer outline-none"
            style={{ backgroundColor: '#251508', borderColor: '#c9a84c60', color: '#c9a84c' }}
          >
            {LANGUAGES.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>

          <a
            href={`https://wa.me/${WHATSAPP.replace('+', '')}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 bg-green-600 text-white text-xs px-3 py-1.5 rounded-full font-medium hover:bg-green-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            {WHATSAPP}
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded transition-colors"
          style={{ color: '#c9a84c' }}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t px-4 py-3 flex flex-col gap-3" style={{ backgroundColor: '#0f0700', borderColor: '#251005' }}>
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className="text-sm font-medium transition-colors"
              style={{ color: location.pathname === link.to ? '#c9a84c' : '#c8b89a' }}
            >
              {link.label}
            </Link>
          ))}
          <select
            value={activeLang}
            onChange={(e) => handleLang(e.target.value)}
            className="text-xs px-2 py-1.5 rounded border font-medium outline-none w-fit"
            style={{ backgroundColor: '#251508', borderColor: '#c9a84c60', color: '#c9a84c' }}
          >
            {LANGUAGES.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
          <a
            href={`https://wa.me/${WHATSAPP.replace('+', '')}`}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-green-400"
          >
            WhatsApp: {WHATSAPP}
          </a>
        </div>
      )}
    </header>
  )
}

