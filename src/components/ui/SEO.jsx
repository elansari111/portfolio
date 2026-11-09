import { Helmet } from 'react-helmet-async'
import { profile } from '../../data/profile'
import { useLanguage } from '../../context/LanguageContext'

const SITE_URL = 'https://yassinelansari.dev'
const DEFAULT_OG = `${SITE_URL}/og-image.png`

/**
 * SEO component — drop into any page to set per-page meta.
 *
 * Usage:
 *   <SEO title="Projects" description="..." image="..." />
 */
export default function SEO({ title, description, image, url }) {
    const { lang, t } = useLanguage()
    const defaultRoleTitle = lang === 'fr'
        ? 'Ingénieur Logiciel & Creative Technologist'
        : 'Software Engineer & Creative Technologist'

    const fullTitle = title
        ? `${title} | ${profile.name}`
        : `${profile.name} — ${defaultRoleTitle}`
    const metaDesc = description || (lang === 'fr' ? t.profile.bio : profile.bio)
    const rawOgImage = image || DEFAULT_OG
    const ogImage = rawOgImage.startsWith('/') ? `${SITE_URL}${rawOgImage}` : rawOgImage
    const canonical = url ? `${SITE_URL}${url}` : SITE_URL
    const locale = lang === 'fr' ? 'fr_FR' : 'en_US'
    const alternateLocale = lang === 'fr' ? 'en_US' : 'fr_FR'

    return (
        <Helmet htmlAttributes={{ lang }}>
            <title>{fullTitle}</title>
            <meta name="description" content={metaDesc} />
            <link rel="canonical" href={canonical} />

            {/* Open Graph */}
            <meta property="og:site_name" content={profile.name} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={metaDesc} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:image:alt" content={fullTitle} />
            <meta property="og:url" content={canonical} />
            <meta property="og:type" content="website" />
            <meta property="og:locale" content={locale} />
            <meta property="og:locale:alternate" content={alternateLocale} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={metaDesc} />
            <meta name="twitter:image" content={ogImage} />
        </Helmet>
    )
}
