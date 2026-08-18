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
        <div className="bg-white/50 dark:bg-black/30 backdrop-blur-md border border-black/10 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
            <button
                id={buttonId}
                onClick={toggle}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle() } }}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="w-full flex items-center gap-4 p-5 md:p-6 text-left group hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary flex-shrink-0" aria-hidden="true">
                    <area.icon size={24} />
                </div>
                <span className="flex-1 font-heading font-bold text-xl text-gray-900 dark:text-white">{area.title}</span>
                <ChevronDown
                    size={24}
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
                        <div className="flex flex-wrap gap-2 px-5 pb-5 md:px-6 md:pb-6 pt-2">
                            {area.skills.map(skill => (
                                <span
                                    key={skill}
                                    className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-gray-700 dark:text-gray-300 px-4 py-1.5 rounded-full text-sm font-medium"
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
        return (
            <div className="flex items-center justify-center">
                <svg viewBox="0 0 200 200" className="w-48 h-48 md:w-64 md:h-64" aria-label="Atom diagram" role="img">
                    <circle cx="100" cy="100" r="8" fill="#8B5CF6" />
                    <ellipse cx="100" cy="100" rx="70" ry="30" fill="none" stroke="currentColor" strokeWidth="1" className="text-black/10 dark:text-white/10" transform="rotate(-20 100 100)" />
                    <ellipse cx="100" cy="100" rx="55" ry="65" fill="none" stroke="currentColor" strokeWidth="1" className="text-black/10 dark:text-white/10" transform="rotate(50 100 100)" />
                    <ellipse cx="100" cy="100" rx="80" ry="25" fill="none" stroke="currentColor" strokeWidth="1" className="text-black/10 dark:text-white/10" transform="rotate(85 100 100)" />
                </svg>
            </div>
        )
    }

    return (
        <div className="flex items-center justify-center relative" aria-hidden="true">
            {/* Soft background glow for the atom */}
            <div className="absolute w-48 h-48 bg-primary/20 rounded-full blur-[80px]" />
            <svg viewBox="0 0 200 200" className="w-48 h-48 md:w-64 md:h-64 relative z-10">
                <defs>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                </defs>
                <circle cx="100" cy="100" r="8" fill="#8B5CF6" filter="url(#glow)">
                    <animate attributeName="r" values="7;9;7" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="100" cy="100" r="14" fill="none" stroke="#8B5CF6" strokeWidth="0.5" opacity="0.3">
                    <animate attributeName="r" values="12;18;12" dur="2s" repeatCount="indefinite" />
                </circle>
                <ellipse cx="100" cy="100" rx="70" ry="30" fill="none" stroke="currentColor" strokeWidth="1" className="text-black/10 dark:text-white/10" transform="rotate(-20 100 100)" />
                <circle r="4" fill="#8B5CF6" filter="url(#glow)">
                    <animateMotion dur="4s" repeatCount="indefinite">
                        <mpath href="#o1" />
                    </animateMotion>
                </circle>
                <ellipse id="o1" cx="100" cy="100" rx="70" ry="30" fill="none" transform="rotate(-20 100 100)" />
                <ellipse cx="100" cy="100" rx="55" ry="65" fill="none" stroke="currentColor" strokeWidth="1" className="text-black/10 dark:text-white/10" transform="rotate(50 100 100)" />
                <circle r="3.5" fill="#06B6D4" filter="url(#glow)">
                    <animateMotion dur="6s" repeatCount="indefinite">
                        <mpath href="#o2" />
                    </animateMotion>
                </circle>
                <ellipse id="o2" cx="100" cy="100" rx="55" ry="65" fill="none" transform="rotate(50 100 100)" />
                <ellipse cx="100" cy="100" rx="80" ry="25" fill="none" stroke="currentColor" strokeWidth="1" className="text-black/10 dark:text-white/10" transform="rotate(85 100 100)" />
                <circle r="3" fill="#10B981" filter="url(#glow)">
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
        <section className="py-24 max-w-6xl mx-auto px-6 relative" aria-labelledby="expertise-heading">
            <div className="mb-16 text-center md:text-left">
                <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-5" aria-hidden="true">
                    🎯 Core Competencies
                </span>
                <h2 id="expertise-heading" className="text-4xl md:text-5xl font-heading font-bold text-gray-900 dark:text-white">Areas of Expertise</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-lg mx-auto md:mx-0">My technical toolkit and competencies across the modern software development lifecycle.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                <div role="list" aria-label="Expertise areas" className="flex flex-col gap-4">
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
                <div className="hidden md:flex items-center justify-center min-h-[400px]">
                    <AtomAnimation prefersReduced={prefersReduced} />
                </div>
            </div>
        </section>
    )
}
