import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowDown, ArrowLeft, ArrowUpRight, Award, CalendarDays, Mic2, Search, Trophy, Users, X } from 'lucide-react'
import PageShell from '../../components/immersive/PageShell'
import SEO from '../../components/ui/SEO'
import { dataService } from '../../lib/dataService'
import { events as defaultEvents } from '../../data/events'
import { useLanguage } from '../../context/LanguageContext'
import { eventType, eventYear, eventTimestamp, filterEvents } from '../../lib/eventFilters'
import './events.css'

const categories = ['All', 'Hackathons', 'Talks & events']

function EventImage({ event, ...props }) {
    const [failed, setFailed] = useState(false)
    return event.image && !failed
        ? <img src={event.image} alt={`${event.title} illustration`} onError={() => setFailed(true)} {...props} />
        : <div className="events-image-fallback" aria-hidden="true"><span>✳</span></div>
}

export default function Events() {
    const { t } = useLanguage()
    const [events, setEvents] = useState(defaultEvents)
    const [posts, setPosts] = useState([])
    const [category, setCategory] = useState('All')
    const [year, setYear] = useState('All years')
    const [search, setSearch] = useState('')
    const [selected, setSelected] = useState(null)
    const dialog = useRef(null), trigger = useRef(null), closeButton = useRef(null)

    useEffect(() => {
        let active = true
        Promise.all([dataService.getEvents(), dataService.getPosts()])
            .then(([eventsData, postsData]) => {
                if (!active) return
                if (Array.isArray(eventsData)) setEvents(eventsData)
                if (Array.isArray(postsData)) setPosts(postsData)
            })
            .catch(() => {})
        return () => { active = false }
    }, [])

    const years = useMemo(() => [...new Set(events.map(eventYear))].sort().reverse(), [events])
    const filtered = useMemo(() => filterEvents(events, { category, year, search }), [events, category, year, search])
    const latest = useMemo(() => [...events].sort((a, b) => eventTimestamp(b) - eventTimestamp(a))[0], [events])
    const writeup = selected && posts.find(post => post.slug === selected.slug && post.category === 'HACKATHON')
    useEffect(() => {
        if (!selected) return
        const sheet = dialog.current, returnFocus = trigger.current
        const previous = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        if (!sheet.open) sheet.showModal()
        closeButton.current?.focus()
        return () => {
            sheet.close()
            document.body.style.overflow = previous
            returnFocus?.focus()
        }
    }, [selected])
    const openEvent = event => { trigger.current = document.activeElement; setSelected(event) }
    const reset = () => { setCategory('All'); setYear('All years'); setSearch('') }
    const typeLabel = item => t.eventsPage.categoryLabels[eventType(item)] || eventType(item)
    return <>
        <SEO title={t.nav.events} description={t.eventsPage.heroDesc2} url="/events" />
        <PageShell className="events-page" label={t.eventsPage.shellLabel}>
            <section className="events-hero" aria-labelledby="events-title">
                <div className="events-hero-copy"><p className="events-eyebrow">{t.eventsPage.eyebrow}</p><h1 id="events-title">{t.eventsPage.title1}<br /><span>{t.eventsPage.title2}<br className="events-title-break" /> {t.eventsPage.title3}</span></h1><p>{t.eventsPage.heroDesc1}<br />{t.eventsPage.heroDesc2}</p><a className="events-archive-link" href="#event-archive">{t.eventsPage.exploreLink} <ArrowDown size={16} /></a><div className="events-hero-meta"><span><Trophy size={15} /> {t.eventsPage.metaPressure}</span><span><Users size={15} /> {t.eventsPage.metaLearn}</span></div></div>
                {latest && <button className="events-feature" onClick={() => openEvent(latest)} aria-label={`View highlights from ${latest.title}`}><div className="events-feature-top"><span>{t.eventsPage.latestMoment}</span><span>{latest.date}</span></div><div className="events-feature-image"><EventImage event={latest} loading="eager" /><span className="events-sticker"><Award size={22} /><span>{latest.award || latest.role}</span></span></div><div className="events-feature-bottom"><div><span>{typeLabel(latest)}</span><h2>{latest.title}</h2></div><span className="events-feature-arrow"><ArrowUpRight size={23} /></span></div><span className="events-feature-perforation" aria-hidden="true" /></button>}
            </section>
            <section id="event-archive" className="events-archive" aria-labelledby="events-archive-title">
                <div className="events-archive-heading"><div><p className="events-eyebrow">{t.eventsPage.archiveEyebrow}</p><h2 id="events-archive-title">{t.eventsPage.archiveTitle1}<br />& <span>{t.eventsPage.archiveTitle2}</span></h2></div><p>{t.eventsPage.archiveSubtitle1}<br />{t.eventsPage.archiveSubtitle2}</p></div>
                <div className="events-toolbar"><div className="events-categories" role="group" aria-label="Event category">{categories.map(item => <button key={item} aria-pressed={category === item} onClick={() => setCategory(item)}>{t.eventsPage.categoryLabels[item] || item}</button>)}</div><div className="events-search"><Search size={16} aria-hidden="true" /><label htmlFor="events-search" className="im-sr-only">{t.eventsPage.searchPlaceholder}</label><input id="events-search" type="search" placeholder={t.eventsPage.searchPlaceholder} value={search} onChange={event => setSearch(event.target.value)} /></div><label className="events-year"><span className="im-sr-only">Filter by year</span><select value={year} onChange={event => setYear(event.target.value)}><option value="All years">{t.eventsPage.allYears}</option>{years.map(item => <option key={item} value={item}>{item}</option>)}</select></label></div>
                <div className="events-results"><span role="status" aria-live="polite">{filtered.length} {filtered.length === 1 ? t.eventsPage.momentSingular : t.eventsPage.momentPlural}{category !== 'All' ? ` / ${t.eventsPage.categoryLabels[category] || category}` : ` / ${t.eventsPage.inTheArchive}`}</span>{(search || category !== 'All' || year !== 'All years') && <button onClick={reset}>{t.eventsPage.resetFilters} <X size={12} /></button>}</div>
                {filtered.length ? <div className="events-grid">{filtered.map((event, index) => <article className="events-card" key={event.id || event.slug} style={{ '--event-delay': `${index * 70}ms` }}><button onClick={() => openEvent(event)} aria-label={`View highlights from ${event.title}`}><div className="events-card-image"><EventImage event={event} loading="lazy" width={600} height={420} /><span className="events-card-type">{eventType(event) === 'Hackathons' ? <Trophy size={12} /> : <Mic2 size={12} />}{typeLabel(event)}</span><span className="events-card-number">{String(index + 1).padStart(2, '0')}</span></div><div className="events-card-content"><div className="events-card-meta"><span><CalendarDays size={12} />{event.date}</span><span>{event.role}</span></div><h3>{event.title}</h3><p>{event.description}</p><div className="events-card-end">{event.award ? <span className="events-award"><Award size={13} />{event.award}</span> : <span>{event.role}</span>}<span className="events-card-action">{t.eventsPage.viewHighlights} <ArrowUpRight size={17} /></span></div></div></button></article>)}</div> : <div className="events-empty"><Search size={32} /><h3>{t.eventsPage.emptyTitle}</h3><p>{t.eventsPage.emptyDesc}</p><button className="im-button" onClick={reset}>{t.eventsPage.showAllBtn} <ArrowUpRight size={16} /></button></div>}
            </section>
            <section className="events-invite"><span className="events-invite-star" aria-hidden="true">✳</span><div><p className="events-eyebrow">{t.eventsPage.inviteEyebrow}</p><h2>{t.eventsPage.inviteTitle1}<br />{t.eventsPage.inviteTitle2} <span>{t.eventsPage.inviteTitle3}</span></h2><p>{t.eventsPage.inviteDesc}</p><Link to="/contact" className="im-button">{t.eventsPage.inviteBtn} <ArrowUpRight size={18} /></Link></div><span className="events-invite-note" aria-hidden="true">{t.eventsPage.inviteNote1}<br />{t.eventsPage.inviteNote2}</span></section>
            <dialog ref={dialog} className="events-dialog" aria-labelledby="event-detail-title" onCancel={event => { event.preventDefault(); setSelected(null) }} onClick={event => { if (event.target === dialog.current) setSelected(null) }}>
                {selected && <div className="events-dialog-inner"><button ref={closeButton} className="events-dialog-close" aria-label="Close event highlights" onClick={() => setSelected(null)}><X size={22} /></button><div className="events-dialog-image"><EventImage key={selected.id} event={selected} /><span>{typeLabel(selected)}</span></div><div className="events-dialog-copy"><p className="events-eyebrow">{selected.date} / {t.eventsPage.highlightsSuffix}</p><h2 id="event-detail-title">{selected.title}</h2><p>{selected.description}</p><dl><div><dt>{t.eventsPage.myRole}</dt><dd>{selected.role || t.eventsPage.participant}</dd></div>{selected.award && <div><dt>{t.eventsPage.recognition}</dt><dd><Award size={17} />{selected.award}</dd></div>}</dl><div className="events-dialog-actions">{writeup && <Link to={`/blogs/${writeup.slug}`} className="im-button" onClick={() => setSelected(null)}>{t.eventsPage.readStory} <ArrowUpRight size={16} /></Link>}<button onClick={() => setSelected(null)}><ArrowLeft size={15} /> {t.eventsPage.backToArchive}</button></div></div></div>}
            </dialog>
        </PageShell>
    </>
}
