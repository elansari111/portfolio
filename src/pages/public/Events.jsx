import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowDown, ArrowLeft, ArrowUpRight, Award, CalendarDays, Mic2, Search, Trophy, Users, X } from 'lucide-react'
import PageShell from '../../components/immersive/PageShell'
import SEO from '../../components/ui/SEO'
import { dataService } from '../../lib/dataService'
import { store } from '../../data/store'
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
    const [events] = useState(() => dataService.getEvents() || [])
    const [posts] = useState(() => store.getPosts() || [])
    const [category, setCategory] = useState('All')
    const [year, setYear] = useState('All years')
    const [search, setSearch] = useState('')
    const [selected, setSelected] = useState(null)
    const dialog = useRef(null), trigger = useRef(null), closeButton = useRef(null)
    const years = useMemo(() => [...new Set(events.map(eventYear))].sort().reverse(), [events])
    const filtered = useMemo(() => filterEvents(events, { category, year, search }), [events, category, year, search])
    const latest = useMemo(() => [...events].sort((a, b) => eventTimestamp(b) - eventTimestamp(a))[0], [events])
    // Only expose an event write-up when the existing article is actually a hackathon recap.
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
    return <>
        <SEO title="Hackathons & Events" description="Hackathons, talks, and community moments from Yassine El Ansari’s software engineering journey." url="/events" />
        <PageShell className="events-page" label="HACKATHONS, EVENTS & EVERYTHING IN BETWEEN">
            <section className="events-hero" aria-labelledby="events-title">
                <div className="events-hero-copy"><p className="events-eyebrow">OFF THE ROADMAP. INTO THE REAL WORLD.</p><h1 id="events-title">BUILD FAST.<br /><span>LEARN<br className="events-title-break" /> TOGETHER.</span></h1><p>Short deadlines. Shared ideas. Real connections.<br />The hackathons, talks and community moments that shape how I build.</p><a className="events-archive-link" href="#event-archive">Explore the moments <ArrowDown size={16} /></a><div className="events-hero-meta"><span><Trophy size={15} /> Build under pressure</span><span><Users size={15} /> Learn with others</span></div></div>
                {latest && <button className="events-feature" onClick={() => openEvent(latest)} aria-label={`View highlights from ${latest.title}`}><div className="events-feature-top"><span>LATEST MOMENT</span><span>{latest.date}</span></div><div className="events-feature-image"><EventImage event={latest} loading="eager" /><span className="events-sticker"><Award size={22} /><span>{latest.award || latest.role}</span></span></div><div className="events-feature-bottom"><div><span>{eventType(latest)}</span><h2>{latest.title}</h2></div><span className="events-feature-arrow"><ArrowUpRight size={23} /></span></div><span className="events-feature-perforation" aria-hidden="true" /></button>}
            </section>
            <section id="event-archive" className="events-archive" aria-labelledby="events-archive-title">
                <div className="events-archive-heading"><div><p className="events-eyebrow">THE FIELD NOTES /</p><h2 id="events-archive-title">HACKATHONS<br />& <span>EVENTS.</span></h2></div><p>Different rooms. Different challenges.<br />The same curiosity.</p></div>
                <div className="events-toolbar"><div className="events-categories" role="group" aria-label="Event category">{categories.map(item => <button key={item} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}</div><div className="events-search"><Search size={16} aria-hidden="true" /><label htmlFor="events-search" className="im-sr-only">Search events</label><input id="events-search" type="search" placeholder="Find a moment…" value={search} onChange={event => setSearch(event.target.value)} /></div><label className="events-year"><span className="im-sr-only">Filter by year</span><select value={year} onChange={event => setYear(event.target.value)}><option>All years</option>{years.map(item => <option key={item}>{item}</option>)}</select></label></div>
                <div className="events-results"><span role="status" aria-live="polite">{filtered.length} {filtered.length === 1 ? 'moment' : 'moments'}{category !== 'All' ? ` / ${category}` : ' / In the archive'}</span>{(search || category !== 'All' || year !== 'All years') && <button onClick={reset}>Reset filters <X size={12} /></button>}</div>
                {filtered.length ? <div className="events-grid">{filtered.map((event, index) => <article className="events-card" key={event.id || event.slug} style={{ '--event-delay': `${index * 70}ms` }}><button onClick={() => openEvent(event)} aria-label={`View highlights from ${event.title}`}><div className="events-card-image"><EventImage event={event} loading="lazy" width={600} height={420} /><span className="events-card-type">{eventType(event) === 'Hackathons' ? <Trophy size={12} /> : <Mic2 size={12} />}{eventType(event)}</span><span className="events-card-number">{String(index + 1).padStart(2, '0')}</span></div><div className="events-card-content"><div className="events-card-meta"><span><CalendarDays size={12} />{event.date}</span><span>{event.role}</span></div><h3>{event.title}</h3><p>{event.description}</p><div className="events-card-end">{event.award ? <span className="events-award"><Award size={13} />{event.award}</span> : <span>{event.role}</span>}<span className="events-card-action">View highlights <ArrowUpRight size={17} /></span></div></div></button></article>)}</div> : <div className="events-empty"><Search size={32} /><h3>No moments found.</h3><p>Try another search, category or year.</p><button className="im-button" onClick={reset}>Show all events <ArrowUpRight size={16} /></button></div>}
            </section>
            <section className="events-invite"><span className="events-invite-star" aria-hidden="true">✳</span><div><p className="events-eyebrow">GOOD IDEAS GET BETTER TOGETHER.</p><h2>LET’S BUILD<br />THE NEXT <span>ONE.</span></h2><p>Putting a team together or planning a community event? Let’s start a conversation.</p><Link to="/contact" className="im-button">Get in touch <ArrowUpRight size={18} /></Link></div><span className="events-invite-note" aria-hidden="true">Stay curious.<br />Keep building.</span></section>
            <dialog ref={dialog} className="events-dialog" aria-labelledby="event-detail-title" onCancel={event => { event.preventDefault(); setSelected(null) }} onClick={event => { if (event.target === dialog.current) setSelected(null) }}>
                {selected && <div className="events-dialog-inner"><button ref={closeButton} className="events-dialog-close" aria-label="Close event highlights" onClick={() => setSelected(null)}><X size={22} /></button><div className="events-dialog-image"><EventImage key={selected.id} event={selected} /><span>{eventType(selected)}</span></div><div className="events-dialog-copy"><p className="events-eyebrow">{selected.date} / EVENT HIGHLIGHTS</p><h2 id="event-detail-title">{selected.title}</h2><p>{selected.description}</p><dl><div><dt>My role</dt><dd>{selected.role || 'Participant'}</dd></div>{selected.award && <div><dt>Recognition</dt><dd><Award size={17} />{selected.award}</dd></div>}</dl><div className="events-dialog-actions">{writeup && <Link to={`/blogs/${writeup.slug}`} className="im-button" onClick={() => setSelected(null)}>Read the story <ArrowUpRight size={16} /></Link>}<button onClick={() => setSelected(null)}><ArrowLeft size={15} /> Back to the archive</button></div></div></div>}
            </dialog>
        </PageShell>
    </>
}
