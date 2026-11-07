import { Link } from 'react-router-dom'
import { ArrowUpRight, Loader2 } from 'lucide-react'
export function PageIntro({eyebrow,title,accent,description,children}) {
 return <header className="renew-intro"><div><p className="renew-eyebrow">{eyebrow}</p><h1>{title}<br/><span>{accent}</span></h1></div><div className="renew-intro-aside"><p>{description}</p>{children}</div></header>
}
export function LoadState({loading,error,empty,emptyContent,children}) {
 if(loading)return <p className="renew-state" role="status"><Loader2 className="renew-spinner" size={20}/> Loading…</p>
 if(error)return <div className="renew-state" role="alert"><p>Something went wrong while loading this content.</p><button onClick={()=>window.location.reload()}>Try again ↗</button></div>
 if(empty)return emptyContent || <p className="renew-state">Nothing published here yet. Check back soon.</p>
 return children
}
export function PageCTA({title='HAVE SOMETHING IN MIND?',text='Let’s turn a useful idea into something people can use.',to='/contact',linkLabel='Let’s talk'}) {
 return <section className="renew-cta"><div><p className="renew-eyebrow">THE NEXT CHAPTER</p><h2>{title}</h2><p>{text}</p></div><Link to={to} className="im-button">{linkLabel} <ArrowUpRight size={18}/></Link></section>
}
