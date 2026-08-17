import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ArrowLeft, Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { store } from '../../data/store'
import SEO from '../../components/ui/SEO'

const posts = store.getPosts()

export default function BlogDetail() {
    const { slug } = useParams()
    const navigate = useNavigate()
    const idx = posts.findIndex(p => p.slug === slug)
    const post = posts[idx]
    const prev = idx > 0 ? posts[idx - 1] : null
    const next = idx < posts.length - 1 ? posts[idx + 1] : null

    if (!post) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <SEO title="Article Not Found" url={`/blogs/${slug}`} />
                <div className="text-center">
                    <h1 className="text-4xl font-heading font-bold mb-4">Article Not Found</h1>
                    <Link to="/blogs" className="text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">
                        Return to Blog
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <>
            <SEO
                title={post.title}
                description={post.excerpt}
                image={post.coverImage}
                url={`/blogs/${post.slug}`}
            />
            <article className="min-h-screen pt-28 pb-24">
                {/* Hero image */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto px-6 mb-10">
                    <img
                        src={post.coverImage}
                        alt={`Cover image for ${post.title}`}
                        width={1200}
                        height={600}
                        loading="eager"
                        className="w-full h-[50vh] md:h-[60vh] object-cover rounded-3xl"
                    />
                </motion.div>

                <div className="max-w-3xl mx-auto px-6">
                    <Link
                        to="/blogs"
                        className="inline-flex items-center gap-2 text-gray-500 hover:text-primary transition-colors mb-10 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                    >
                        <ArrowLeft size={16} aria-hidden="true" className="group-hover:-translate-x-1 transition-transform" />
                        Back to Blog
                    </Link>

                    <motion.header
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-10"
                    >
                        <div className="flex items-center gap-3 mb-5">
                            <span className="bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                                {post.category}
                            </span>
                            <span className="flex items-center gap-1.5 text-gray-500 text-sm">
                                <Calendar size={13} aria-hidden="true" />
                                <time dateTime={post.date}>{post.date}</time>
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-heading font-bold leading-tight mb-6">
                            {post.title}
                        </h1>

                        <div className="flex items-center gap-3 pb-8 border-b border-white/10">
                            <img
                                src={post.authorAvatar}
                                alt={post.authorName}
                                width={40}
                                height={40}
                                loading="eager"
                                className="w-10 h-10 rounded-full object-cover border border-white/10"
                            />
                            <div>
                                <p className="text-white font-semibold text-sm">{post.authorName}</p>
                                <p className="text-gray-500 text-xs">Author</p>
                            </div>
                        </div>
                    </motion.header>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="prose prose-lg dark:prose-invert max-w-none
                            prose-headings:font-heading prose-headings:text-white
                            prose-p:text-gray-300 prose-p:leading-relaxed
                            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                            prose-strong:text-white
                            prose-code:text-sky-300 prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                            prose-pre:bg-[#0d0d0f] prose-pre:border prose-pre:border-white/10 prose-pre:rounded-2xl
                            prose-blockquote:border-primary prose-blockquote:text-gray-400"
                    >
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {post.content}
                        </ReactMarkdown>
                    </motion.div>

                    {/* Prev / Next */}
                    <nav aria-label="Article navigation" className="mt-16 pt-8 border-t border-white/10 grid grid-cols-2 gap-4">
                        {prev ? (
                            <button
                                onClick={() => navigate(`/blogs/${prev.slug}`)}
                                aria-label={`Previous article: ${prev.title}`}
                                className="group flex items-center gap-3 bg-white/5 border border-white/10 hover:border-white/20 rounded-2xl p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            >
                                <ChevronLeft size={18} aria-hidden="true" className="text-gray-500 group-hover:text-primary group-hover:-translate-x-0.5 transition-all flex-shrink-0" />
                                <div className="min-w-0">
                                    <p className="text-gray-500 text-xs mb-1">Previous</p>
                                    <p className="text-white text-sm font-medium line-clamp-1">{prev.title}</p>
                                </div>
                            </button>
                        ) : <div aria-hidden="true" />}

                        {next && (
                            <button
                                onClick={() => navigate(`/blogs/${next.slug}`)}
                                aria-label={`Next article: ${next.title}`}
                                className="group flex items-center gap-3 bg-white/5 border border-white/10 hover:border-white/20 rounded-2xl p-4 text-right transition-colors ml-auto w-full justify-end focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            >
                                <div className="min-w-0">
                                    <p className="text-gray-500 text-xs mb-1">Next</p>
                                    <p className="text-white text-sm font-medium line-clamp-1">{next.title}</p>
                                </div>
                                <ChevronRight size={18} aria-hidden="true" className="text-gray-500 group-hover:text-primary group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                            </button>
                        )}
                    </nav>
                </div>
            </article>
        </>
    )
}
