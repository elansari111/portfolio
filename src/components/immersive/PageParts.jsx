import { Link } from 'react-router-dom'
import { ArrowUpRight, Loader2 } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
export function PageIntro({eyebrow,title,accent,description,children}) {
 return <header className="renew-intro"><div><p className="renew-eyebrow">{eyebrow}</p><h1>{title}<br/><span>{accent}</span></h1></div><div className="renew-intro-aside"><p>{description}</p>{children}</div></header>
}
export function LoadState({loading,error,empty,emptyContent,children}) {
 const { t } = useLanguage()
 if(loading)return <p className="renew-state" role="status"><Loader2 className="renew-spinner" size={20}/> {t.loading}</p>
 if(error)return <div className="renew-state" role="alert"><p>{t.loadError}</p><button onClick={()=>window.location.reload()}>{t.tryAgain}</button></div>
 if(empty)return emptyContent || <p className="renew-state">{t.emptyState}</p>
 return children
}
export function PageCTA({title,text,to='/contact',linkLabel}) {
 const { t } = useLanguage()
 return <section className="renew-cta"><div><p className="renew-eyebrow">{t.nextChapter}</p><h2>{title || t.ctaDefaultTitle}</h2><p>{text || t.ctaDefaultText}</p></div><Link to={to} className="im-button">{linkLabel || t.letsTalk} <ArrowUpRight size={18}/></Link></section>
}
