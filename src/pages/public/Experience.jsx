import { useEffect, useState, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Briefcase, Calendar } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const DUMMY_EXPERIENCE = [
    {
        id: 1,
        role: 'Senior Frontend Developer',
        company: 'Tech Solutions Inc.',
        period: '2022 - Present',
        description: 'Leading the frontend team, architecting React applications, and mentoring junior developers.',
        type: 'work'
    },
    {
        id: 2,
        role: 'Full Stack Developer',
        company: 'Creative Agency',
        period: '2020 - 2022',
        description: 'Developed custom websites and web applications for diverse clients using MERN stack.',
        type: 'work'
    },
    {
        id: 3,
        role: 'Computer Science Degree',
        company: 'University of Technology',
        period: '2016 - 2020',
        description: 'Bachelor of Science in Computer Science with a focus on Software Engineering.',
        type: 'education'
    }
]

export default function Experience() {
    const [experiences, setExperiences] = useState(DUMMY_EXPERIENCE)
    const containerRef = useRef(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.timeline-item', {
                x: -50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.3,
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 80%'
                }
            })
        }, containerRef)

        return () => ctx.revert()
    }, [])

    return (
        <div ref={containerRef} className="container mx-auto px-4 py-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
                Professional Journey
            </h2>

            <div className="relative max-w-4xl mx-auto">
                {/* Vertical Line */}
                <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 h-full w-1 bg-gray-800 rounded-full"></div>

                <div className="space-y-12">
                    {experiences.map((item, index) => (
                        <div key={item.id} className={`timeline-item flex flex-col md:flex-row ${index % 2 === 0 ? 'md:flex-row-reverse' : ''} items-center w-full`}>

                            {/* Spacer for alternating layout */}
                            <div className="hidden md:block w-5/12"></div>

                            {/* Icon/Dot */}
                            <div className="z-10 bg-black border-4 border-purple-500 rounded-full p-3 mb-4 md:mb-0">
                                <Briefcase size={20} className="text-white" />
                            </div>

                            {/* Content */}
                            <div className="w-full md:w-5/12 pl-8 md:pl-0 md:px-8">
                                <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl hover:border-purple-500/50 transition-colors">
                                    <div className="flex items-center text-sm text-purple-400 mb-2">
                                        <Calendar size={14} className="mr-2" />
                                        {item.period}
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-1">{item.role}</h3>
                                    <p className="text-gray-400 font-medium mb-3">{item.company}</p>
                                    <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
