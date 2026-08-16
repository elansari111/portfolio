import { useEffect, useState, useRef } from 'react'
import { supabase } from '../../lib/supabase'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ExternalLink, Github } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const DUMMY_PROJECTS = [
    {
        id: 1,
        title: 'E-Commerce Platform',
        description: 'A fully functional e-commerce store with cart, checkout, and admin dashboard.',
        tags: ['React', 'Node.js', 'MongoDB', 'Stripe'],
        image_url: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&q=80',
        demo_url: '#',
        repo_url: '#'
    },
    {
        id: 2,
        title: 'AI Image Generator',
        description: 'Web app using OpenAI API to generate images from text prompts.',
        tags: ['Next.js', 'Tailwind', 'OpenAI API'],
        image_url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80',
        demo_url: '#',
        repo_url: '#'
    },
    {
        id: 3,
        title: 'Portfolio V1',
        description: 'My previous portfolio built with HTML/CSS and Vanilla JS.',
        tags: ['HTML', 'CSS', 'JavaScript'],
        image_url: 'https://images.unsplash.com/photo-1545665277-59374f043749?w=800&q=80',
        demo_url: '#',
        repo_url: '#'
    }
]

export default function Projects() {
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)
    const containerRef = useRef(null)

    useEffect(() => {
        fetchProjects()
    }, [])

    useEffect(() => {
        if (!loading && projects.length > 0) {
            const ctx = gsap.context(() => {
                gsap.from('.project-card', {
                    y: 50,
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.2,
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top 80%'
                    }
                })
            }, containerRef)
            return () => ctx.revert()
        }
    }, [loading, projects])

    async function fetchProjects() {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .order('created_at', { ascending: false })

            if (error || !data || data.length === 0) {
                console.warn('Using dummy data due to Supabase error or empty data:', error)
                setProjects(DUMMY_PROJECTS)
            } else {
                setProjects(data)
            }
        } catch (err) {
            console.error('Error fetching projects:', err)
            setProjects(DUMMY_PROJECTS)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div ref={containerRef} className="container mx-auto px-4 py-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                Selected Projects
            </h2>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project) => (
                        <div key={project.id} className="project-card group bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={project.image_url}
                                    alt={project.title}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
                                    {project.demo_url && (
                                        <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="p-2 bg-white text-black rounded-full hover:bg-gray-200 transition-colors">
                                            <ExternalLink size={20} />
                                        </a>
                                    )}
                                    {project.repo_url && (
                                        <a href={project.repo_url} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors">
                                            <Github size={20} />
                                        </a>
                                    )}
                                </div>
                            </div>

                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-2 text-white">{project.title}</h3>
                                <p className="text-gray-400 text-sm mb-4 line-clamp-3">{project.description}</p>
                                <div className="flex flex-wrap gap-2">
                                    {project.tags.map(tag => (
                                        <span key={tag} className="text-xs px-2 py-1 bg-gray-800 text-gray-300 rounded-full border border-gray-700">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
