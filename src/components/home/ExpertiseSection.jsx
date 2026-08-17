import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Code, Server, ShieldCheck, ChevronDown } from 'lucide-react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

const areas = [
    {
        id: 'fullstack',
        title: 'Full-Stack Development',
        icon: Code,
        skills: ['React', 'Next.js', 'Node.js', 'Express', 'TypeScript', 'PostgreSQL', 'MongoDB', 'GraphQL'],
    },
    {
        id: 'devops',
        title: 'DevOps Engineering',
        icon: Server,
        skills: ['Docker', 'CI/CD', 'AWS', 'Nginx', 'GitHub Actions', 'Linux', 'Terraform'],
    },
    {
        id: 'qa',
        title: 'QA & Testing',
        icon: ShieldCheck,
        skills: ['Jest', 'Cypress', 'Playwright', 'Vitest', 'React Testing Library', 'Storybook'],
    },
]

function Accordion({ area, isOpen, toggle, prefersReduced }) {
    const panelId = `accordion-panel-${area.id}`
    const buttonId = `accordion-btn-${area.id}`

    return (
        <div className="border-b border-white/10">
            <button
                id={buttonId}
                onClick={toggle}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle() } }}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="w-full flex items-center gap-4 py-6 text-left group hover:bg-white/[0.02] px-2 -mx-2 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
            >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0" aria-hidden="true">
                    <area.icon size={20} />
                </div>
                <span className="flex-1 font-heading font-bold text-lg text-white">{area.title}</span>
                <ChevronDown
                    size={20}
                    aria-hidden="true"
                    className={`text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        id={panelId}
                        role="region"
                        aria-labelledby={buttonId}
                        initial={prefersReduced ? false : { height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={prefersReduced ? false : { height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="flex flex-wrap gap-2 pb-6 px-2">
                            {area.skills.map(skill => (
                                <span
                                    key={skill}
                                    className="bg-white/5 border border-white/10 text-gray-300 px-4 py-1.5 rounded-full text-sm"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

function AtomAnimation({ prefersReduced }) {
    if (prefersReduced) {
        // Static orbital diagram for reduced-motion
        return (
            <div className="flex items-center justify-center">
                <svg viewBox="0 0 200 200" className="w-48 h-48 md:w-64 md:h-64" aria-label="Atom diagram" role="img">
                    <circle cx="100" cy="100" r="8" fill="#3B82F6" />
                    <ellipse cx="100" cy="100" rx="70" ry="30" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" transform="rotate(-20 100 100)" />
                    <ellipse cx="100" cy="100" rx="55" ry="65" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" transform="rotate(50 100 100)" />
                    <ellipse cx="100" cy="100" rx="80" ry="25" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" transform="rotate(85 100 100)" />
                </svg>
            </div>
        )
    }

    return (
        <div className="flex items-center justify-center" aria-hidden="true">
            <svg viewBox="0 0 200 200" className="w-48 h-48 md:w-64 md:h-64">
                <defs>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                </defs>
                <circle cx="100" cy="100" r="8" fill="#3B82F6" filter="url(#glow)">
                    <animate attributeName="r" values="7;9;7" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="100" cy="100" r="14" fill="none" stroke="#3B82F6" strokeWidth="0.5" opacity="0.3">
                    <animate attributeName="r" values="12;18;12" dur="2s" repeatCount="indefinite" />
                </circle>
                <ellipse cx="100" cy="100" rx="70" ry="30" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" transform="rotate(-20 100 100)" />
                <circle r="4" fill="#3B82F6" filter="url(#glow)">
                    <animateMotion dur="4s" repeatCount="indefinite">
                        <mpath href="#o1" />
                    </animateMotion>
                </circle>
                <ellipse id="o1" cx="100" cy="100" rx="70" ry="30" fill="none" transform="rotate(-20 100 100)" />
                <ellipse cx="100" cy="100" rx="55" ry="65" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" transform="rotate(50 100 100)" />
                <circle r="3.5" fill="#38bdf8" filter="url(#glow)">
                    <animateMotion dur="6s" repeatCount="indefinite">
                        <mpath href="#o2" />
                    </animateMotion>
                </circle>
                <ellipse id="o2" cx="100" cy="100" rx="55" ry="65" fill="none" transform="rotate(50 100 100)" />
                <ellipse cx="100" cy="100" rx="80" ry="25" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" transform="rotate(85 100 100)" />
                <circle r="3" fill="#00bb7f" filter="url(#glow)">
                    <animateMotion dur="5s" repeatCount="indefinite" keyPoints="1;0" keyTimes="0;1" calcMode="linear">
                        <mpath href="#o3" />
                    </animateMotion>
                </circle>
                <ellipse id="o3" cx="100" cy="100" rx="80" ry="25" fill="none" transform="rotate(85 100 100)" />
            </svg>
        </div>
    )
}

export default function ExpertiseSection() {
    const [openIdx, setOpenIdx] = useState(0)
    const prefersReduced = useReducedMotion()

    return (
        <section className="py-24 max-w-6xl mx-auto px-6" aria-labelledby="expertise-heading">
            <div className="mb-16">
                <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-5" aria-hidden="true">
                    🎯 Areas of Expertise
                </span>
                <h2 id="expertise-heading" className="text-4xl md:text-5xl font-heading font-bold">Areas of Expertise</h2>
                <p className="text-gray-400 mt-4 max-w-lg">My core competencies across the software development lifecycle.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                <div role="list" aria-label="Expertise areas">
                    {areas.map((area, i) => (
                        <div key={area.id} role="listitem">
                            <Accordion
                                area={area}
                                isOpen={openIdx === i}
                                toggle={() => setOpenIdx(openIdx === i ? -1 : i)}
                                prefersReduced={prefersReduced}
                            />
                        </div>
                    ))}
                </div>
                <div className="hidden md:flex items-center justify-center min-h-[320px]">
                    <AtomAnimation prefersReduced={prefersReduced} />
                </div>
            </div>
        </section>
    )
}
