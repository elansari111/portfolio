import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link } from 'react-router-dom'
import { ArrowUpRight, FolderKanban } from 'lucide-react'
import Card3D from '../ui/Card3D'
import { dataService } from '../../lib/dataService'

gsap.registerPlugin(ScrollTrigger)

export default function FeaturedProjects({ projects: propProjects }) {
    const containerRef = useRef(null)
    const revealImgRef = useRef(null)
    const [projectList, setProjectList] = useState(propProjects || [])

    useEffect(() => {
        if (!propProjects || propProjects.length === 0) {
            dataService.getProjects().then(data => {
                setProjectList((data || []).slice(0, 3))
            })
        } else {
            setProjectList(propProjects.slice(0, 3))
        }
    }, [propProjects])

    useEffect(() => {
        if (projectList.length > 0) {
            const ctx = gsap.context(() => {
                gsap.from('.project-row', {
                    y: 40,
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.12,
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top 75%',
                    }
                })
            }, containerRef)
            return () => ctx.revert()
        }
    }, [projectList])

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
            gsap.to(revealImgRef.current, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.4,
                ease: 'power3.out'
            })
        }
    }

    if (projectList.length === 0) return null

    return (
        <section
            ref={containerRef}
            className="py-16 max-w-6xl mx-auto px-6 relative z-10"
            onMouseMove={handleMouseMove}
        >
            <div className="flex justify-between items-end mb-10 border-b border-black/10 dark:border-white/10 pb-5">
                <div>
                    <p className="text-primary font-mono text-xs uppercase tracking-widest mb-1.5 flex items-center gap-2">
                        <FolderKanban size={14} /> SELECTED WORKS /
                    </p>
                    <h2 className="text-2xl md:text-4xl font-heading font-bold text-gray-900 dark:text-white">
                        Featured Projects
                    </h2>
                </div>
                <span className="text-sm font-mono text-gray-500">2024 — 2026</span>
            </div>

            <div className="flex flex-col gap-4">
                {projectList.map((project, index) => {
                    const img = project.coverImage || project.image_url
                    const link = project.liveUrl || project.demo_url || `/projects`
                    const tag = project.tags?.[0] || 'Web Application'
                    return (
                        <Card3D key={project.id || index} intensity={8}>
                            <Link
                                to={link}
                                target={link.startsWith('http') ? '_blank' : '_self'}
                                rel={link.startsWith('http') ? 'noopener noreferrer' : undefined}
                                className="project-row group border border-black/10 dark:border-white/10 py-8 px-6 md:px-8 flex justify-between items-center hover:border-primary/40 transition-all rounded-2xl bg-white/40 dark:bg-black/30 backdrop-blur-xl"
                                onMouseEnter={() => handleMouseEnter(img)}
                                onMouseLeave={handleMouseLeave}
                            >
                                <div className="flex items-baseline gap-6">
                                    <span className="text-gray-400 font-mono text-sm">0{index + 1}/</span>
                                    <div>
                                        <h3 className="text-2xl md:text-4xl font-heading font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                                            {project.title}
                                        </h3>
                                        <p className="text-gray-500 text-xs md:text-sm mt-1 line-clamp-1 max-w-md">
                                            {project.description}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <span className="hidden sm:inline-block text-xs font-mono uppercase tracking-wider text-gray-400 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-1 rounded-full">
                                        {tag}
                                    </span>
                                    <div className="w-10 h-10 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center group-hover:border-primary group-hover:bg-primary group-hover:text-white transition-all text-gray-400">
                                        <ArrowUpRight size={18} />
                                    </div>
                                </div>
                            </Link>
                        </Card3D>
                    )
                })}
            </div>

                <div className="mt-10 text-center">
                    <Link to="/projects" className="inline-block text-gray-900 dark:text-white border border-black/20 dark:border-white/20 rounded-full px-8 py-3 hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all">
                        View All Projects
                    </Link>
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
