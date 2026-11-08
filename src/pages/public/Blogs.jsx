import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Search } from 'lucide-react'
import PageShell from '../../components/immersive/PageShell'
import { PageIntro, PageCTA, LoadState } from '../../components/immersive/PageParts'
import { usePublicData } from '../../hooks/usePublicData'
import SEO from '../../components/ui/SEO'

export default function Blogs() {
  const { data: posts, loading, error } = usePublicData('getPosts')
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')

  const publishedPosts = useMemo(() => posts.filter(p => p.published !== false), [posts])
  const categories = useMemo(() => ['All', ...new Set(publishedPosts.map(post => post.category).filter(Boolean))], [publishedPosts])
  const filtered = useMemo(() => publishedPosts.filter(post => (category === 'All' || post.category === category) && `${post.title} ${post.excerpt}`.toLowerCase().includes(search.trim().toLowerCase())), [publishedPosts, category, search])

  return <>
    <SEO title="Journal" description="Notes on software engineering, architecture and building products." url="/blogs" />
    <PageShell label="THE JOURNAL / IDEAS WORTH SHARING">
      <div className="renew-page-content">
        <PageIntro eyebrow="ARTICLES & FIELD NOTES" title="THINKING OUT LOUD." accent="ONE IDEA AT A TIME." description="Things I’ve built, lessons I’ve learned, and the engineering decisions in between." />
        <div className="renew-toolbar">
          <div className="renew-filters" role="group" aria-label="Article category">
            {categories.map(item => <button key={item} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}
          </div>
          <label className="renew-search">
            <Search size={16} />
            <span className="im-sr-only">Search articles</span>
            <input type="search" placeholder="Find an idea…" value={search} onChange={e => setSearch(e.target.value)} />
          </label>
        </div>
        <LoadState loading={loading} error={error} empty={!publishedPosts.length}>
          <p className="renew-result-count" role="status" aria-live="polite">{filtered.length} {filtered.length === 1 ? 'article' : 'articles'}</p>
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
                        <span>{Math.max(1, Math.ceil((post.content || '').split(/\s+/).length / 200))} MIN READ</span>
                      </div>
                      <h2>{post.title}</h2>
                      <p>{post.excerpt}</p>
                      <footer>
                        <span>{String(i + 1).padStart(2, '0')} / Read the story</span>
                        <ArrowUpRight size={23} />
                      </footer>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="renew-state">
              <h2>No articles found.</h2>
              <p>Try a different category or search term.</p>
              <button onClick={() => { setCategory('All'); setSearch('') }}>Reset filters ↗</button>
            </div>
          )}
        </LoadState>
        <PageCTA />
      </div>
    </PageShell>
  </>
}
