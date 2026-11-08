import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx'
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript'
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash'
import css from 'react-syntax-highlighter/dist/esm/languages/prism/css'
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { dataService } from '../../lib/dataService'
import SEO from '../../components/ui/SEO'
import PageShell from '../../components/immersive/PageShell'

SyntaxHighlighter.registerLanguage('jsx', jsx)
SyntaxHighlighter.registerLanguage('javascript', javascript)
SyntaxHighlighter.registerLanguage('js', javascript)
SyntaxHighlighter.registerLanguage('bash', bash)
SyntaxHighlighter.registerLanguage('css', css)
SyntaxHighlighter.registerLanguage('json', json)

export default function BlogDetail() {
  const { slug } = useParams()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    let active = true
    dataService.getPosts()
      .then(data => { if (active) setPosts(data || []) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [slug])

  if (loading) {
    return (
      <PageShell label="JOURNAL / LOADING">
        <div className="renew-state">
          <p>Loading article...</p>
        </div>
      </PageShell>
    )
  }

  const index = posts.findIndex(post => post.slug === slug)
  const post = posts[index]
  const related = [posts[index - 1], posts[index + 1]].filter(Boolean)

  if (!post) {
    return (
      <PageShell label="JOURNAL">
        <SEO title="Article not found" />
        <div className="renew-state">
          <h1>Article not found.</h1>
          <Link to="/blogs">Back to the journal ↗</Link>
        </div>
      </PageShell>
    )
  }
 return <><SEO title={post.title} description={post.excerpt} image={post.coverImage} url={`/blogs/${slug}`}/><PageShell label="JOURNAL / IN THE DETAILS"><article className="renew-article"><Link to="/blogs" className="renew-text-link"><ArrowLeft size={16}/> Back to the journal</Link><header><div className="renew-article-meta"><span>{post.category}</span><span>{post.date}</span><span>{Math.max(1,Math.ceil((post.content||'').split(/\s+/).length/200))} MIN READ</span></div><h1>{post.title}</h1><p>{post.excerpt}</p><div className="renew-author">{post.authorAvatar&&<img src={post.authorAvatar} alt=""/>}<div><b>{post.authorName}</b><span>Author / Field notes</span></div></div></header>{post.coverImage&&<img className="renew-article-cover" src={post.coverImage} alt=""/>}<div className="renew-prose"><ReactMarkdown remarkPlugins={[remarkGfm]} components={{h1:({children})=><h2>{children}</h2>,pre:({children})=><div className="renew-code-wrap">{children}</div>,code({node:_node,className,children,...props}){const match=/language-(\w+)/.exec(className||'');return match?<SyntaxHighlighter style={oneDark} language={match[1]} customStyle={{margin:0,padding:'22px',fontSize:'13px',lineHeight:1.8,background:'#161322'}}>{String(children).replace(/\n$/,'')}</SyntaxHighlighter>:<code className={className} {...props}>{children}</code>},a:({href,children})=><a href={href} target={/^https?:/.test(href||'')?'_blank':undefined} rel="noreferrer">{children}</a>}}>{post.content}</ReactMarkdown></div>{related.length>0&&<nav className="renew-article-next" aria-label="More articles">{related.map(item=><Link to={`/blogs/${item.slug}`} key={item.slug}><small>KEEP READING</small><h2>{item.title}</h2><ArrowUpRight size={24}/></Link>)}</nav>}</article></PageShell></>
}
