import { useReducedMotion } from '../../hooks/useReducedMotion'

export default function SkillsMarquee({ skills = [] }) {
    const doubled = [...skills, ...skills]
    const prefersReduced = useReducedMotion()

    return (
        <section className="py-16 border-y border-white/10 overflow-hidden" aria-label="Skills marquee">
            <div className={`marquee-track marquee-mask ${prefersReduced ? '' : ''}`}>
                <div
                    className={prefersReduced ? 'flex flex-wrap justify-center gap-3 px-6' : 'animate-marquee flex w-max gap-4'}
                    style={prefersReduced ? {} : { animationDuration: '40s' }}
                    aria-hidden={!prefersReduced}
                >
                    {(prefersReduced ? skills : doubled).map((skill, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-5 py-2.5 text-sm text-gray-300 whitespace-nowrap select-none"
                        >
                            <span aria-hidden="true">{skill.icon}</span>
                            {skill.name}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
