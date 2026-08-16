import { useEffect, useState, useRef } from 'react'
import { supabase } from '../../lib/supabase'
import { gsap } from 'gsap'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'

export default function FeaturedProjects() {
    const [projects, setProjects] = useState([])
    const containerRef = useRef(null)

    // Ref to hold the floating image element
    const revealImgRef = useRef(null)

    useEffect(() => {
        fetchFeaturedProjects()
    }, [])

    useEffect(() => {
        // Reveal Animation on Scroll
        if (projects.length > 0) {
            const ctx = gsap.context(() => {
                gsap.from('.project-row', {
                    y: 50,
                    opacity: 0,
                    duration: 1,
                    stagger: 0.1,
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top 80%',
                    }
                })
            }, containerRef)
            return () => ctx.revert()
        }
    }, [projects])

    async function fetchFeaturedProjects() {
        try {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .limit(4)
                .order('created_at', { ascending: false })

            if (error) throw error
            setProjects(data || [])
        } catch (error) {
            console.error('Error fetching featured projects:', error)
        }
    }

    // Handle Hover Reveal
    const handleMouseEnter = (imageUrl) => {
        if (revealImgRef.current && imageUrl) {
            revealImgRef.current.style.backgroundImage = `url(${imageUrl})`
            gsap.to(revealImgRef.current, { scale: 1, opacity: 1, duration: 0.3 })
        }
    }

    const handleMouseLeave = () => {
        if (revealImgRef.current) {
            gsap.to(revealImgRef.current, { scale: 0.8, opacity: 0, duration: 0.3 })
        }
    }

    const handleMouseMove = (e) => {
        if (revealImgRef.current) {
            // Move the image near the cursor
            gsap.to(revealImgRef.current, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.5, // slightly laggy for smooth feel
                ease: 'power3.out'
            })
        }
    }

    return (
        <section
            ref={containerRef}
            className="py-10 bg-black relative z-10"
            onMouseMove={handleMouseMove}
        >
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-end mb-12 border-b border-gray-800 pb-6">
                    <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Selected Works</h2>
                    <span className="text-sm text-gray-500">2023 - 2026</span>
                </div>

                <div className="flex flex-col">
                    {projects.map((project, index) => (
                        <Link
                            key={project.id}
                            to={project.demo_url}
                            target="_blank"
                            className="project-row group border-b border-gray-800 py-12 flex justify-between items-center hover:bg-white/5 transition-colors px-4 cursor-none"
                            onMouseEnter={() => handleMouseEnter(project.image_url)}
                            onMouseLeave={handleMouseLeave}
                        >
                            <div className="flex items-baseline space-x-8">
                                <span className="text-gray-500 font-mono text-sm">0{index + 1}/</span>
                                <h3 className="text-4xl md:text-6xl font-bold text-white group-hover:text-gray-300 transition-colors uppercase">
                                    {project.title}
                                </h3>
                            </div>

                            <div className="hidden md:flex flex-col items-end">
                                <span className="text-gray-400 text-sm uppercase tracking-wider mb-2">{project.tags?.[0] || 'Development'}</span>
                                <span className="bg-white text-black text-xs font-bold px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                    VIEW CASE
                                </span>
                            </div>

                            <ArrowUpRight className="md:hidden text-white" />
                        </Link>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <Link to="/projects" className="inline-block text-white border border-white/20 rounded-full px-8 py-3 hover:bg-white hover:text-black transition-all">
                        View All Projects
                    </Link>
                </div>
            </div>

            {/* Floating Reveal Image */}
            <div
                ref={revealImgRef}
                className="fixed top-0 left-0 w-[400px] h-[300px] bg-cover bg-center bg-no-repeat pointer-events-none z-50 rounded-lg shadow-2xl opacity-0 scale-75 -translate-x-1/2 -translate-y-1/2 hidden md:block"
                style={{ backgroundImage: 'none' }}
            />
        </section>
    )
}
