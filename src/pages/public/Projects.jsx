import PageShell from '../../components/immersive/PageShell'
import Work from '../../components/immersive/Work'
import { PageCTA } from '../../components/immersive/PageParts'
import { usePublicData } from '../../hooks/usePublicData'
import SEO from '../../components/ui/SEO'
export default function Projects(){
 const {data,loading,error}=usePublicData('getProjects')
 return <><SEO title="Projects" description="Explore the interfaces, platforms and software projects built by Yassine El Ansari." url="/projects"/><PageShell className="renew-projects" label="SELECTED WORK / ENGINEERING & INTERACTION"><div className="renew-page-content"><Work standalone projects={data} loading={loading} error={error}/><PageCTA/></div></PageShell></>
}
