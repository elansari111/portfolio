import { Helmet } from 'react-helmet-async'
import { profile } from '../../data/profile'

const SITE_URL = 'https://yassinelansari.dev'
const DEFAULT_OG = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop'

/**
 * SEO component — drop into any page to set per-page meta.
 *
 * Usage:
 *   <SEO title="Projects" description="..." image="..." />
 */
export default function SEO({ title, description, image, url }) {
    const fullTitle = title
        ? `${title} | ${profile.name}`
        : `${profile.name} | Full-Stack Developer`
    const metaDesc = description || profile.bio
    const ogImage = image || DEFAULT_OG
    const canonical = url ? `${SITE_URL}${url}` : SITE_URL

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={metaDesc} />
            <link rel="canonical" href={canonical} />

            {/* Open Graph */}
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={metaDesc} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:url" content={canonical} />
            <meta property="og:type" content="website" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={metaDesc} />
            <meta name="twitter:image" content={ogImage} />
        </Helmet>
    )
}
