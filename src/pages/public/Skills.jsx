import { Link } from 'react-router-dom'
import { ArrowUpRight, Code2, Layers, Wrench } from 'lucide-react'
import PageShell from '../../components/immersive/PageShell'
import { PageIntro, PageCTA, LoadState } from '../../components/immersive/PageParts'
import { usePublicData } from '../../hooks/usePublicData'
import { useLanguage } from '../../context/LanguageContext'
import SEO from '../../components/ui/SEO'
const categoryFor=name=>/node|python|postgres|mongo|redis|graphql|supabase|sql|go$/i.test(name)?'Backend & data':/react|next|typescript|tailwind|gsap|motion|css|html|javascript/i.test(name)?'Frontend & interaction':'Tools & workflow'
export default function Skills(){
 const { t } = useLanguage()
 const {data,loading,error}=usePublicData('getSkills')
 const groups=data.reduce((all,skill)=>{const key=skill.category||categoryFor(skill.name);(all[key]||=[]).push(skill);return all},{})
 const icons=[Code2,Layers,Wrench]
 return <><SEO title={t.nav.skills} description={t.skillsPage.description} url="/skills"/><PageShell label={t.skillsPage.shellLabel}><div className="renew-page-content"><PageIntro eyebrow={t.skillsPage.eyebrow} title={t.skillsPage.title} accent={t.skillsPage.accent} description={t.skillsPage.description}><Link to="/projects" className="renew-text-link">{t.skillsPage.seeInAction} <ArrowUpRight size={16}/></Link></PageIntro><LoadState loading={loading} error={error} empty={!data.length}><div className="renew-skill-grid">{Object.entries(groups).map(([category,items],i)=>{const Icon=icons[i%icons.length];return <section className="renew-skill-group" key={category}><div className="renew-card-top"><Icon size={23}/><span>{String(i+1).padStart(2,'0')} / {items.length} {t.skillsPage.toolsCount}</span></div><h2>{t.skillsPage.categories[category]||category}</h2><ul>{items.map(skill=><li key={skill.id||skill.name}><div>{skill.icon&&<img src={skill.icon} alt="" loading="lazy" onError={event=>{event.currentTarget.hidden=true}}/>}<span>{skill.name}</span></div>{skill.description&&<p>{skill.description}</p>}{Number.isFinite(skill.level)&&<div className="renew-proficiency" aria-label={`${skill.name}: ${skill.level}%`}><i style={{width:`${Math.min(100,Math.max(0,skill.level))}%`}}/><span>{skill.level}%</span></div>}</li>)}</ul></section>})}</div></LoadState><PageCTA title={t.skillsPage.ctaTitle}/></div></PageShell></>
}
