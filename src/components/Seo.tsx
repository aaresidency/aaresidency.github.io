import { Helmet } from 'react-helmet-async'

interface SeoProps {
  title: string
  description: string
  path: string
}

const SITE_URL = 'https://aaresidency.com'
const DEFAULT_IMAGE = `${SITE_URL}/hero.png`

export function Seo({ title, description, path }: SeoProps) {
  const url = `${SITE_URL}${path}`
  const fullTitle = `${title} | AA Residency Tirupati`

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={DEFAULT_IMAGE} />
    </Helmet>
  )
}
