import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import PageShell from '../../components/immersive/PageShell'
import SEO from '../../components/ui/SEO'
export default function NotFound(){return <><SEO title="Page not found"/><PageShell label="A SMALL DETOUR"><section className="renew-not-found"><span>404 / WRONG TURN, RIGHT PLACE</span><b aria-hidden="true">404<span>✳</span></b><h1>NOT EVERY PATH<br/>LEADS SOMEWHERE.</h1><p>This page has moved, or never existed. Let’s get you back to something useful.</p><div><Link to="/" className="im-button">Back to portfolio <ArrowUpRight size={17}/></Link><Link to="/projects">Explore my projects ↗</Link></div></section></PageShell></>}
