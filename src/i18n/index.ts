import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './en.json'
import hi from './hi.json'
import gu from './gu.json'

i18n
  .use(initReactI18next)
  .init({
    resources: { en: { translation: en }, hi: { translation: hi }, gu: { translation: gu } },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  })

// Keep <html lang> in step with the chosen language (screen readers and search engines use it).
if (typeof document !== 'undefined') {
  i18n.on('languageChanged', (lng) => {
    document.documentElement.lang = lng
  })
}

export default i18n
