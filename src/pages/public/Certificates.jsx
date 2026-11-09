import { useMemo, useState } from 'react'
import { Award, ArrowUpRight, Search } from 'lucide-react'
import PageShell from '../../components/immersive/PageShell'
import { PageIntro, LoadState, PageCTA } from '../../components/immersive/PageParts'
import { usePublicData } from '../../hooks/usePublicData'
import { useLanguage } from '../../context/LanguageContext'
import SEO from '../../components/ui/SEO'
export default function Certificates(){
 const { t } = useLanguage()
 const {data,loading,error}=usePublicData('getCertificates'),[search,setSearch]=useState('')
 const certificates=useMemo(()=>data.filter(cert=>`${cert.title} ${cert.issuer}`.toLowerCase().includes(search.trim().toLowerCase())),[data,search])
 return <><SEO title={t.nav.certificates} description={t.certificatesPage.description} url="/certificates"/><PageShell label={t.certificatesPage.shellLabel}><div className="renew-page-content"><PageIntro eyebrow={t.certificatesPage.eyebrow} title={t.certificatesPage.title} accent={t.certificatesPage.accent} description={t.certificatesPage.description}/><div className="renew-toolbar"><p>{data.length} {t.certificatesPage.countSuffix}</p><label className="renew-search"><Search size={16}/><span className="im-sr-only">{t.certificatesPage.searchPlaceholder}</span><input type="search" value={search} onChange={e=>setSearch(e.target.value)} placeholder={t.certificatesPage.searchPlaceholder}/></label></div><LoadState loading={loading} error={error} empty={!certificates.length} emptyContent={search.trim()?<div className="renew-state" role="status"><h2>{t.certificatesPage.noResultsTitle}</h2><p>{t.certificatesPage.noResultsText}</p><button onClick={()=>setSearch('')}>{t.certificatesPage.clearSearch}</button></div>:undefined}><div className="renew-cert-grid">{certificates.map((cert,i)=><article className="renew-certificate" key={cert.id}><div className="renew-cert-art">{cert.image_url&&<img src={cert.image_url} alt="" loading="lazy"/>}<span><Award size={42}/></span><small>{t.certificatesPage.credentialBadge} / {String(i+1).padStart(2,'0')}</small></div><div className="renew-cert-copy"><p>{cert.issuer}</p><h2>{cert.title}</h2><div><span>{cert.date}</span>{/^https?:\/\//.test(cert.credential_url||'')&&<a href={cert.credential_url} target="_blank" rel="noreferrer" aria-label={`Verify ${cert.title}`}>{t.certificatesPage.verifyLink} <ArrowUpRight size={15}/></a>}</div></div></article>)}</div></LoadState><PageCTA to="/projects" linkLabel={t.certificatesPage.ctaLink} title={t.certificatesPage.ctaTitle} text={t.certificatesPage.ctaText}/></div></PageShell></>
}
