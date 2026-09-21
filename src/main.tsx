import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import './i18n'
import App from './App.tsx'
import { initAnalytics } from './lib/analytics'

initAnalytics()

// Old site URLs ended in .html; GitHub Pages serves the matching file, but the router needs the clean path.
if (window.location.pathname.endsWith('.html') && window.location.pathname !== '/index.html') {
  const { pathname, search, hash } = window.location
  window.history.replaceState(null, '', pathname.replace(/\.html$/, '') + search + hash)
}

const root = document.getElementById('root')!
const app = (
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
)

// Prerendered pages ship real markup in #root; hydrate it. In dev there is none.
if (root.hasChildNodes()) {
  hydrateRoot(root, app)
} else {
  createRoot(root).render(app)
}
