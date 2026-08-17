import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Lightbulb, PenTool, Code2, Rocket } from 'lucide-react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

const phases = [
    { num: '01', title: 'Discovery & Research', desc: 'Understanding the problem space, gathering requirements, and researching the best technical approaches.', icon: Lightbulb },
    { num: '02', title: 'Design & Architecture', desc: 'Creating wireframes, designing the system architecture, and planning the tech stack and data models.', icon: PenTool },
    { num: '03', title: 'Development & Testing', desc: 'Writing clean, maintainable code with comprehensive testing. Iterating based on feedback loops.', icon: Code2 },
    { num: '04', title: 'Deploy & Optimize', desc: 'Launching to production, monitoring performance, and continuously optimizing for speed and reliability.', icon: Rocket },
]

export default function ProcessSection() {
    const wrapperRef = useRef(null)
    const prefersReduced = useReducedMotion()

    useEffect(() => {
        if (prefersReduced) return
        const cards = wrapperRef.current?.querySelectorAll('.process-card')
        if (!cards) return

        const ctx = gsap.context(() => {
            cards.forEach((card, i) => {
                if (i < cards.length - 1) {
                    ScrollTrigger.create({
                        trigger: card,
                        start: 'top 20%',
                        end: 'bottom 20%',
                        scrub: true,
                        onUpdate: (self) => {
                            gsap.set(card, {
                                scale: 1 - self.progress * 0.05,
                                filter: `brightness(${1 - self.progress * 0.3})`,
                            })
                        },
                    })
                }
            })
        }, wrapperRef)

        return () => ctx.revert()
    }, [prefersReduced])

    // Reduced motion: simple vertical list
    if (prefersReduced) {
        return (
            <section className="py-24 max-w-6xl mx-auto px-6" aria-labelledby="process-heading">
                <div className="mb-16">
                    <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-5" aria-hidden="true">
                        ⚙️ Development Process
                    </span>
                    <h2 id="process-heading" className="text-4xl md:text-5xl font-heading font-bold">My Development Process</h2>
                    <p className="text-gray-400 mt-4 max-w-lg">A battle-tested workflow from idea to launch.</p>
                </div>
                <ol className="flex flex-col gap-6">
                    {phases.map((phase) => (
                        <li key={phase.num} className="bg-[#0d0d0f] border border-white/10 rounded-3xl p-8">
                            <div className="flex items-start gap-6">
                                <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center flex-shrink-0" aria-hidden="true">
                                    <phase.icon size={22} className="text-white" />
                                </div>
                                <div>
                                    <span className="inline-flex bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-2">
                                        Phase {phase.num}
                                    </span>
                                    <h3 className="text-2xl font-heading font-bold text-white mb-2">{phase.title}</h3>
                                    <p className="text-gray-400 leading-relaxed">{phase.desc}</p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ol>
            </section>
        )
    }

    // Full sticky-stack animation
    return (
        <section className="py-24 max-w-6xl mx-auto px-6" aria-labelledby="process-heading">
            <div className="mb-16">
                <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-5" aria-hidden="true">
                    ⚙️ Development Process
                </span>
                <h2 id="process-heading" className="text-4xl md:text-5xl font-heading font-bold">My Development Process</h2>
                <p className="text-gray-400 mt-4 max-w-lg">A battle-tested workflow from idea to launch.</p>
            </div>

            <div ref={wrapperRef} style={{ height: `${phases.length * 100}vh` }} className="relative">
                {phases.map((phase, i) => (
                    <div
                        key={phase.num}
                        className="process-card sticky"
                        style={{ top: `calc(18vh + ${i * 2}rem)` }}
                    >
                        <div className="bg-[#0d0d0f] border border-white/10 rounded-3xl p-8 md:p-12 max-w-4xl mx-auto shadow-2xl">
                            <div className="flex items-start gap-6">
                                <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center flex-shrink-0" aria-hidden="true">
                                    <phase.icon size={24} className="text-white" />
                                </div>
                                <div>
                                    <span className="inline-flex bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-3">
                                        Phase {phase.num}
                                    </span>
                                    <h3 className="text-2xl md:text-3xl font-heading font-bold text-white mb-3">{phase.title}</h3>
                                    <p className="text-gray-400 text-lg leading-relaxed max-w-xl">{phase.desc}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
