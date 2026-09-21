import { Helmet } from 'react-helmet-async'
import type { JsonLd } from '../lib/schema'

interface SeoProps {
  title: string
  description: string
  path: string
  jsonLd?: JsonLd[]
}

const SITE_URL = 'https://aaresidency.com'
const DEFAULT_IMAGE = `${SITE_URL}/images/hero-slide-exterior.jpg`

export function Seo({ title, description, path, jsonLd = [] }: SeoProps) {
  const url = `${SITE_URL}${path}`
  const fullTitle = `${title} | AA Residency Tirupati`

  return (
    <>
      <Helmet>
        <title>{fullTitle}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={url} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="AA Residency Tirupati" />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={DEFAULT_IMAGE} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={DEFAULT_IMAGE} />
      </Helmet>
      {jsonLd.map((data, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
      ))}
    </>
  )
}
