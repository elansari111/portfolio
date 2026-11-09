import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Search } from 'lucide-react'
import PageShell from '../../components/immersive/PageShell'
import { PageIntro, PageCTA, LoadState } from '../../components/immersive/PageParts'
import { usePublicData } from '../../hooks/usePublicData'
import { useLanguage } from '../../context/LanguageContext'
import SEO from '../../components/ui/SEO'

export default function Blogs() {
  const { t } = useLanguage()
  const { data: posts, loading, error } = usePublicData('getPosts')
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')

  const publishedPosts = useMemo(() => posts.filter(p => p.published !== false), [posts])
  const categories = useMemo(() => ['All', ...new Set(publishedPosts.map(post => post.category).filter(Boolean))], [publishedPosts])
  const filtered = useMemo(() => publishedPosts.filter(post => (category === 'All' || post.category === category) && `${post.title} ${post.excerpt}`.toLowerCase().includes(search.trim().toLowerCase())), [publishedPosts, category, search])

  return <>
    <SEO title={t.nav.journal} description={t.blogsPage.description} url="/blogs" />
    <PageShell label={t.blogsPage.shellLabel}>
      <div className="renew-page-content">
        <PageIntro eyebrow={t.blogsPage.eyebrow} title={t.blogsPage.title} accent={t.blogsPage.accent} description={t.blogsPage.description} />
        <div className="renew-toolbar">
          <div className="renew-filters" role="group" aria-label="Article category">
            {categories.map(item => <button key={item} aria-pressed={category === item} onClick={() => setCategory(item)}>{item === 'All' ? t.blogsPage.allCategory : item}</button>)}
          </div>
          <label className="renew-search">
            <Search size={16} />
            <span className="im-sr-only">{t.blogsPage.searchPlaceholder}</span>
            <input type="search" placeholder={t.blogsPage.searchPlaceholder} value={search} onChange={e => setSearch(e.target.value)} />
          </label>
        </div>
        <LoadState loading={loading} error={error} empty={!publishedPosts.length}>
          <p className="renew-result-count" role="status" aria-live="polite">{filtered.length} {filtered.length === 1 ? t.blogsPage.articleSingular : t.blogsPage.articlePlural}</p>
          {filtered.length ? (
            <div className="renew-journal-grid">
              {filtered.map((post, i) => (
                <article key={post.slug} className="renew-post">
                  <Link to={`/blogs/${post.slug}`}>
                    <div className="renew-post-image">
                      {post.coverImage && <img src={post.coverImage} alt="" loading="lazy" />}
                      <span>{post.category}</span>
                    </div>
                    <div className="renew-post-copy">
                      <div>
                        <span>{post.date}</span>
                        <span>{Math.max(1, Math.ceil((post.content || '').split(/\s+/).length / 200))} {t.blogsPage.minRead}</span>
                      </div>
                      <h2>{post.title}</h2>
                      <p>{post.excerpt}</p>
                      <footer>
                        <span>{String(i + 1).padStart(2, '0')} / {t.blogsPage.readStory}</span>
                        <ArrowUpRight size={23} />
                      </footer>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="renew-state">
              <h2>{t.blogsPage.noArticlesTitle}</h2>
              <p>{t.blogsPage.noArticlesDesc}</p>
              <button onClick={() => { setCategory('All'); setSearch('') }}>{t.blogsPage.resetFilters}</button>
            </div>
          )}
        </LoadState>
        <PageCTA />
      </div>
    </PageShell>
  </>
}
