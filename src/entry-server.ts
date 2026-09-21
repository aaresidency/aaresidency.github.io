import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import './i18n'
import App from './App.tsx'

export { ROUTE_PATHS, LEGACY_REDIRECTS } from './routes.ts'

export function render(url: string) {
  const html = renderToString(
    createElement(HelmetProvider, null, createElement(StaticRouter, { location: url }, createElement(App))),
  )
  return { html }
}
