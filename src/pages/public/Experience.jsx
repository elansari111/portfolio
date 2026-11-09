import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Download, Briefcase, GraduationCap } from 'lucide-react'
import PageShell from '../../components/immersive/PageShell'
import { PageIntro, LoadState, PageCTA } from '../../components/immersive/PageParts'
import { usePublicData } from '../../hooks/usePublicData'
import { useProfile } from '../../hooks/useProfile'
import { useLanguage } from '../../context/LanguageContext'
import SEO from '../../components/ui/SEO'
export default function Experience(){
 const profile=useProfile()
 const { t } = useLanguage()
 const {data,loading,error}=usePublicData('getExperiences')
 const [filter,setFilter]=useState('All')
 const education=item=>item.type==='education'||/graduation|university|degree|b\.s\./i.test(`${item.title} ${item.company} ${item.icon}`)
 const items=data.filter(item=>filter==='All'||(filter==='Education'?education(item):!education(item)))
 return <><SEO title={t.nav.experience} description={profile.bio} url="/experience"/><PageShell label={t.experiencePage.shellLabel}><div className="renew-page-content"><PageIntro eyebrow={t.experiencePage.eyebrow} title={t.experiencePage.title} accent={t.experiencePage.accent} description={profile.bio}><a href={profile.resumeUrl} download className="im-button">{t.downloadCv} <Download size={16}/></a></PageIntro><div className="renew-profile-strip"><img src={profile.avatar} alt={profile.name}/><div><h2>{profile.name}</h2><p>{profile.roles.join(' / ')}</p></div><span>{t.experiencePage.location}</span></div><div className="renew-filters" role="group" aria-label="Experience type">{['All','Work','Education'].map(type=><button key={type} onClick={()=>setFilter(type)} aria-pressed={filter===type}>{t.experiencePage.filters[type]||type}</button>)}</div><LoadState loading={loading} error={error} empty={!items.length}><ol className="renew-timeline">{items.map((item,i)=>{const Icon=education(item)?GraduationCap:Briefcase;return <li key={item.id}><div className="renew-timeline-date"><span>{String(i+1).padStart(2,'0')}</span><p>{item.period||[item.startDate,item.endDate].filter(Boolean).join(' — ')}</p></div><div className="renew-timeline-copy"><Icon size={22}/><h2>{item.role||item.title}</h2><h3>{item.company}</h3><p>{item.description}</p></div></li>})}</ol></LoadState><div className="renew-related"><Link to="/skills">{t.experiencePage.relatedSkills} <ArrowUpRight size={18}/></Link><Link to="/certificates">{t.experiencePage.relatedCerts} <ArrowUpRight size={18}/></Link><Link to="/events">{t.experiencePage.relatedEvents} <ArrowUpRight size={18}/></Link></div><PageCTA title={t.experiencePage.ctaTitle}/></div></PageShell></>
}
