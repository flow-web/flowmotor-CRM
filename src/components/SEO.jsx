import { Helmet } from 'react-helmet-async'

const SITE_URL = 'https://www.flowmotor.fr'
const DEFAULT_IMAGE = `${SITE_URL}/assets/LOGO_AUBERGINE.png`
const SITE_NAME = 'FLOW MOTOR'

/**
 * SEO — Composant réutilisable pour les meta tags
 * @param {string} title - Titre de la page
 * @param {string} description - Description meta
 * @param {string} image - URL image OG (absolue)
 * @param {string} url - URL canonique (relative, ex: '/showroom')
 * @param {string} type - og:type (default: 'website')
 * @param {object} jsonLd - Données JSON-LD Schema.org
 */
export default function SEO({
  title,
  description,
  image,
  url,
  type = 'website',
  jsonLd
}) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} - Import Auto, Sportifs & Collection`
  const fullUrl = url ? `${SITE_URL}${url}` : SITE_URL
  const ogImage = image || DEFAULT_IMAGE
  const metaDescription = description || "Spécialiste import et vente de véhicules sportifs et de collection. Youngtimers, JDM, allemandes. Stock disponible à Lyon et recherche personnalisée."

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="fr_FR" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={ogImage} />

      {/* JSON-LD */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  )
}
