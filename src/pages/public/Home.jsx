import SEO from '../../components/ui/SEO'
import Portfolio from '../../components/immersive/Portfolio'
import { profile } from '../../data/profile'
export default function Home(){return <><SEO title={null} description={profile.shortBio} url="/"/><Portfolio/></>}
