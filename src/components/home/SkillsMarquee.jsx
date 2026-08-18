import { useReducedMotion } from '../../hooks/useReducedMotion'

export default function SkillsMarquee({ skills = [] }) {
    const doubled = [...skills, ...skills]
    const prefersReduced = useReducedMotion()

    return (
        <section className="py-6 w-full max-w-6xl mx-auto px-6" aria-label="Skills marquee">
            <div className="bg-white/50 dark:bg-black/30 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-3xl py-4 overflow-hidden shadow-sm relative">
                <div className={`marquee-track marquee-mask ${prefersReduced ? '' : ''}`}>
                    <div
                        className={prefersReduced ? 'flex flex-wrap justify-center gap-3 px-6' : 'animate-marquee flex w-max gap-4'}
                        style={prefersReduced ? {} : { animationDuration: '40s' }}
                        aria-hidden={!prefersReduced}
                    >
                        {(prefersReduced ? skills : doubled).map((skill, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-2 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-full px-5 py-2.5 text-sm text-gray-800 dark:text-gray-300 whitespace-nowrap select-none"
                            >
                                <img src={skill.icon} alt="" aria-hidden="true" className="w-5 h-5 object-contain" loading="lazy" />
                                {skill.name}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
