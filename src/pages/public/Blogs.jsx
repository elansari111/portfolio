import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Calendar, ArrowRight } from 'lucide-react'
import { store } from '../../data/store'
import SEO from '../../components/ui/SEO'

const posts = store.getPosts()

const CATEGORIES = ['ALL', 'RESEARCH', 'ARCHITECTURE', 'HACKATHON', 'ACHIEVEMENT']

function PostCard({ post, index }) {
    return (
        <motion.article
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ delay: index * 0.08, duration: 0.5 }}
        >
            <Link
                to={`/blogs/${post.slug}`}
                className="group block bg-[#0d0d0f] border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-colors h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
                {/* Cover */}
                <div className="relative h-52 overflow-hidden">
                    <span className="absolute top-3 left-3 z-10 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full">
                        {post.category}
                    </span>
                    <img
                        src={post.coverImage}
                        alt={`Cover image for ${post.title}`}
                        width={600}
                        height={208}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                </div>

                {/* Body */}
                <div className="p-6 flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <Calendar size={13} aria-hidden="true" />
                        <time dateTime={post.date}>{post.date}</time>
                    </div>

                    <h2 className="text-lg font-heading font-bold text-white group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                    </h2>

                    <p className="text-gray-400 text-sm line-clamp-3">{post.excerpt}</p>

                    {/* Author row */}
                    <div className="flex items-center justify-between mt-2 pt-4 border-t border-white/10">
                        <div className="flex items-center gap-2.5">
                            <img
                                src={post.authorAvatar}
                                alt={post.authorName}
                                width={28}
                                height={28}
                                loading="lazy"
                                className="w-7 h-7 rounded-full object-cover border border-white/10"
                            />
                            <span className="text-gray-400 text-xs">{post.authorName}</span>
                        </div>
                        <ArrowRight
                            size={16}
                            aria-hidden="true"
                            className="text-gray-600 -translate-x-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                        />
                    </div>
                </div>
            </Link>
        </motion.article>
    )
}

export default function Blogs() {
    const [category, setCategory] = useState('ALL')
    const [search, setSearch] = useState('')

    const filtered = useMemo(() => {
        return posts.filter(post => {
            const matchCat = category === 'ALL' || post.category === category
            const q = search.toLowerCase()
            const matchSearch = !q || post.title.toLowerCase().includes(q) || post.excerpt.toLowerCase().includes(q)
            return matchCat && matchSearch
        })
    }, [category, search])

    return (
        <>
            <SEO
                title="Blog"
                description="Articles and publications on software engineering, architecture, hackathons, and achievements by Yassine El Ansari."
                url="/blogs"
            />
            <div className="min-h-screen pt-32 pb-24">
                <div className="max-w-6xl mx-auto px-6">
                    {/* Header */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-14">
                        <p className="text-primary font-mono text-sm uppercase tracking-widest mb-3" aria-hidden="true">ARTICLES &amp; PUBLICATIONS /</p>
                        <h1 className="text-5xl md:text-7xl font-heading font-bold leading-tight mb-5">
                            Blogs &amp; Insights
                        </h1>
                        <p className="text-gray-400 text-lg max-w-xl">
                            Writing about development, architecture, and the events that shaped my engineering journey.
                        </p>
                    </motion.div>

                    {/* Filters row */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-10">
                        <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setCategory(cat)}
                                    aria-pressed={category === cat}
                                    className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                                        category === cat
                                            ? 'bg-primary text-white shadow-md shadow-primary/30'
                                            : 'bg-white/5 border border-white/10 text-gray-400 hover:border-white/20 hover:text-white'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        <div className="relative sm:ml-auto w-full sm:w-64">
                            <Search size={15} aria-hidden="true" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                            <label htmlFor="blog-search" className="sr-only">Search articles</label>
                            <input
                                id="blog-search"
                                type="search"
                                placeholder="Search articles..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-full pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 outline-none focus-visible:border-primary transition-colors"
                            />
                        </div>
                    </div>

                    {/* Grid or empty state */}
                    {filtered.length === 0 ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24" role="status" aria-live="polite">
                            <p className="text-5xl mb-4" aria-hidden="true">🔍</p>
                            <p className="text-white font-heading font-bold text-2xl mb-2">No articles found</p>
                            <p className="text-gray-500">Try a different category or search term.</p>
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" aria-live="polite" aria-label="Blog articles">
                            {filtered.map((post, i) => (
                                <PostCard key={post.slug} post={post} index={i} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
