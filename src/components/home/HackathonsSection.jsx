import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useReducedMotion } from '../../hooks/useReducedMotion'

import { useRef } from 'react'

function EventCard({ event, prefersReduced }) {
    const cardRef = useRef(null)

    const handleMouseMove = (e) => {
        if (prefersReduced) return
        const rect = cardRef.current.getBoundingClientRect()
        cardRef.current.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`)
        cardRef.current.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`)
    }

    return (
        <Link
            to={`/blogs/${event.slug}`}
            aria-label={`Read about ${event.title}`}
            className="flex-shrink-0 w-64 md:w-72 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-2xl"
        >
            <motion.article
                ref={cardRef}
                onMouseMove={handleMouseMove}
                initial={prefersReduced ? false : { opacity: 0, y: 30 }}
                whileInView={prefersReduced ? false : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={prefersReduced ? {} : { scale: 1.02 }}
                className="relative aspect-[3/4] rounded-2xl overflow-hidden group border border-black/10 dark:border-white/10 shadow-lg"
                style={prefersReduced ? {} : {
                    background: 'radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(59,130,246,0.12), transparent 40%)'
                }}
            >
                <img
                    src={event.image}
                    alt={event.title}
                    width={288}
                    height={384}
                    loading="lazy"
                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${prefersReduced ? '' : 'grayscale group-hover:grayscale-0'}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Tag */}
                <div className="absolute top-4 left-4">
                    <span className="bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                        {event.tag}
                    </span>
                </div>

                {/* Title bar */}
                <div className={`absolute bottom-0 left-0 right-0 p-5 transition-all duration-400 ${prefersReduced ? '' : 'translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100'}`}>
                    <div className="flex items-center gap-3">
                        <div className="w-1 h-8 bg-primary rounded-full flex-shrink-0" aria-hidden="true" />
                        <div>
                            <h3 className="text-white font-heading font-bold text-base leading-tight">{event.title}</h3>
                            <p className="text-gray-400 text-xs mt-1">{event.date} · {event.award}</p>
                        </div>
                    </div>
                </div>
            </motion.article>
        </Link>
    )
}

export default function HackathonsSection({ events = [] }) {
    const prefersReduced = useReducedMotion()

    return (
        <section className="py-24 max-w-6xl mx-auto px-6">
            <div className="mb-12">
                <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-5" aria-hidden="true">
                    🏆 Hackathons &amp; Events
                </span>
                <h2 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 dark:text-white">Hackathons &amp; Events</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-lg">The competitions and events that shaped my engineering journey.</p>
            </div>

            {/* Mobile: snap-x horizontal scroll; desktop: flex row */}
            <div
                className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory md:snap-none scrollbar-hide"
                role="list"
                aria-label="Hackathon and event cards"
            >
                {events.map(event => (
                    <div key={event.id} className="snap-start" role="listitem">
                        <EventCard event={event} prefersReduced={prefersReduced} />
                    </div>
                ))}
            </div>
        </section>
    )
}
