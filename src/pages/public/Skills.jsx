import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const SKILLS = [
    {
        category: "Frontend", items: [
            { name: "React / Next.js", level: 90 },
            { name: "TypeScript", level: 85 },
            { name: "Tailwind CSS", level: 95 },
            { name: "GSAP", level: 80 }
        ]
    },
    {
        category: "Backend", items: [
            { name: "Node.js", level: 75 },
            { name: "Supabase / PostgreSQL", level: 70 },
            { name: "Python", level: 60 },
            { name: "GraphQL", level: 65 }
        ]
    },
    {
        category: "Tools & Design", items: [
            { name: "Git / GitHub", level: 90 },
            { name: "Figma", level: 85 },
            { name: "Docker", level: 50 },
            { name: "Adobe Creative Suite", level: 70 }
        ]
    }
]

export default function Skills() {
    const containerRef = useRef(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Animate categories
            gsap.from('.skill-category', {
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.2,
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 80%'
                }
            })

            // Animate progress bars
            gsap.utils.toArray('.progress-bar').forEach(bar => {
                gsap.to(bar, {
                    width: bar.dataset.width + '%', // Use data attribute for target width
                    duration: 1.5,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: bar,
                        start: 'top 90%'
                    }
                })
            })
        }, containerRef)

        return () => ctx.revert()
    }, [])

    return (
        <div ref={containerRef} className="container mx-auto px-4 py-20 pb-32">
            <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
                Technical Arsenal
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {SKILLS.map((category, idx) => (
                    <div key={idx} className="skill-category bg-gray-900/50 p-8 rounded-2xl border border-gray-800 backdrop-blur-sm">
                        <h3 className="text-2xl font-bold mb-6 text-white border-b border-gray-700 pb-2 inline-block">
                            {category.category}
                        </h3>
                        <div className="space-y-6">
                            {category.items.map(skill => (
                                <div key={skill.name}>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-gray-300 font-medium">{skill.name}</span>
                                        <span className="text-gray-500 text-sm hidden">{skill.level}%</span>
                                    </div>
                                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                        <div
                                            className="progress-bar h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full w-0"
                                            data-width={skill.level}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
