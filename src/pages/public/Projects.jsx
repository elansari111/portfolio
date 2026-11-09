import PageShell from '../../components/immersive/PageShell'
import Work from '../../components/immersive/Work'
import { PageCTA } from '../../components/immersive/PageParts'
import { usePublicData } from '../../hooks/usePublicData'
import { useLanguage } from '../../context/LanguageContext'
import SEO from '../../components/ui/SEO'
export default function Projects(){
 const { t } = useLanguage()
 const {data,loading,error}=usePublicData('getProjects')
 return <><SEO title={t.nav.projects} description={t.work.subtitle} url="/projects"/><PageShell className="renew-projects" label={t.work.pageLabel}><div className="renew-page-content"><Work standalone projects={data} loading={loading} error={error}/><PageCTA/></div></PageShell></>
}
