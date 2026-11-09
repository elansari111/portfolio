import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import PageShell from '../../components/immersive/PageShell'
import { useLanguage } from '../../context/LanguageContext'
import SEO from '../../components/ui/SEO'
export default function NotFound(){
 const { t } = useLanguage()
 return <><SEO title="404"/><PageShell label={t.notFoundPage.shellLabel}><section className="renew-not-found"><span>{t.notFoundPage.kicker}</span><b aria-hidden="true">404<span>✳</span></b><h1>{t.notFoundPage.title1}<br/>{t.notFoundPage.title2}</h1><p>{t.notFoundPage.description}</p><div><Link to="/" className="im-button">{t.backToPortfolio} <ArrowUpRight size={17}/></Link><Link to="/projects">{t.notFoundPage.exploreProjects}</Link></div></section></PageShell></>
}
