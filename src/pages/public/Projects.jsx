import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, Github, X, ArrowUpRight } from 'lucide-react'
import { store } from '../../data/store'
import SEO from '../../components/ui/SEO'
import Card3D from '../../components/ui/Card3D'

const projects = store.getProjects()

function ProjectCard({ project, onClick, index }) {
    const cardRef = useRef(null)

    const handleMouseMove = (e) => {
        const rect = cardRef.current.getBoundingClientRect()
        cardRef.current.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`)
        cardRef.current.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`)
    }

    return (
        <Card3D intensity={12}>
            <motion.article
                ref={cardRef}
                onMouseMove={handleMouseMove}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: index * 0.1, duration: 0.6, ease: 'easeOut' }}
                className="group relative rounded-2xl overflow-hidden border border-white/10 cursor-pointer focus-within:ring-2 focus-within:ring-primary"
                style={{
                    background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${project.accentColor}18, transparent 40%)`,
                }}
            >
                <button
                    onClick={() => onClick(project)}
                    aria-label={`View details for ${project.title}`}
                    className="block w-full text-left focus-visible:outline-none"
                >
                {/* Cover Image */}
                <div
                    className="relative h-56 overflow-hidden"
                    style={{ backgroundColor: `${project.accentColor}18` }}
                >
                    <img
                        src={project.coverImage}
                        alt={`${project.title} project screenshot`}
                        width={600}
                        height={224}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300" aria-hidden="true">
                        <span
                            className="flex items-center gap-1 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg"
                            style={{ backgroundColor: project.accentColor }}
                        >
                            Details <ArrowUpRight size={12} />
                        </span>
                    </div>
                </div>

                {/* Card body */}
                <div className="p-6 bg-[#0d0d0f]">
                    <div className="flex items-start justify-between gap-4">
                        <h3 className="font-heading font-bold text-xl text-white group-hover:text-primary transition-colors leading-tight">
                            {project.title}
                        </h3>
                        <span className="text-gray-500 text-sm font-mono flex-shrink-0 mt-0.5">{project.year}</span>
                    </div>
                    <p className="text-gray-400 text-sm mt-2 line-clamp-2">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mt-4" aria-label="Technologies used">
                        {project.tags.map(tag => (
                            <span
                                key={tag}
                                className="text-xs px-2.5 py-1 rounded-full border font-medium"
                                style={{ borderColor: `${project.accentColor}50`, color: project.accentColor }}
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </button>
        </motion.article>
        </Card3D>
    )
}

function ProjectModal({ project, onClose }) {
    if (!project) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
                role="dialog"
                aria-modal="true"
                aria-label={`${project.title} project details`}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-[#0d0d0f] border border-white/10 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
                >
                    <div className="relative h-64 overflow-hidden rounded-t-3xl" style={{ backgroundColor: `${project.accentColor}20` }}>
                        <img
                            src={project.coverImage}
                            alt={`${project.title} cover`}
                            width={768}
                            height={256}
                            loading="lazy"
                            className="w-full h-full object-cover"
                        />
                        <button
                            onClick={onClose}
                            aria-label="Close project details"
                            className="absolute top-4 right-4 bg-black/60 backdrop-blur text-white p-2 rounded-full hover:bg-black transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                        >
                            <X size={20} aria-hidden="true" />
                        </button>
                    </div>

                    <div className="p-8">
                        <div className="flex items-start justify-between gap-4 mb-4">
                            <h2 className="text-3xl font-heading font-bold text-white">{project.title}</h2>
                            <span className="text-gray-500 font-mono text-sm mt-1">{project.year}</span>
                        </div>
                        <p className="text-gray-300 leading-relaxed mb-6">{project.longDescription}</p>

                        <div className="mb-6">
                            <p className="text-xs uppercase tracking-widest text-gray-500 mb-3">Tech Stack</p>
                            <div className="flex flex-wrap gap-2" aria-label="Technologies used">
                                {project.stack.map(s => (
                                    <span key={s} className="bg-white/5 border border-white/10 text-gray-300 text-sm px-3 py-1 rounded-full">{s}</span>
                                ))}
                            </div>
                        </div>

                        {project.gallery?.length > 0 && (
                            <div className="mb-6">
                                <p className="text-xs uppercase tracking-widest text-gray-500 mb-3">Gallery</p>
                                <div className="grid grid-cols-2 gap-3">
                                    {project.gallery.map((img, i) => (
                                        <img
                                            key={i}
                                            src={img}
                                            alt={`${project.title} screenshot ${i + 1}`}
                                            width={320}
                                            height={160}
                                            loading="lazy"
                                            className="w-full h-40 object-cover rounded-xl border border-white/10"
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex gap-3">
                            {project.liveUrl && (
                                <a
                                    href={project.liveUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={`View live demo of ${project.title}`}
                                    className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary/80 text-white py-3 rounded-full font-semibold text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                >
                                    <ExternalLink size={16} aria-hidden="true" /> Live Demo
                                </a>
                            )}
                            {project.repoUrl && project.repoUrl !== '#' && (
                                <a
                                    href={project.repoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={`View source code of ${project.title} on GitHub`}
                                    className="flex-1 flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:border-white/30 text-white py-3 rounded-full font-semibold text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                                >
                                    <Github size={16} aria-hidden="true" /> Source Code
                                </a>
                            )}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

export default function Projects() {
    const [selected, setSelected] = useState(null)

    return (
        <>
            <SEO
                title="Projects"
                description="A curated collection of web development projects including portfolios, e-commerce platforms, AI dashboards, and mobile apps."
                url="/projects"
            />
            <div className="min-h-screen pt-32 pb-24">
                <div className="max-w-6xl mx-auto px-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
                        <p className="text-primary font-mono text-sm uppercase tracking-widest mb-3" aria-hidden="true">MY WORK /</p>
                        <h1 className="text-5xl md:text-7xl font-heading font-bold leading-tight mb-5">
                            Selected Projects
                        </h1>
                        <p className="text-gray-400 text-lg max-w-xl">
                            A curated collection of things I've built — from polished portfolios to full-stack platforms.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6" role="list" aria-label="Project list">
                        {projects.map((project, i) => (
                            <div key={project.id} role="listitem">
                                <ProjectCard project={project} index={i} onClick={setSelected} />
                            </div>
                        ))}
                    </div>
                </div>

                {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
            </div>
        </>
    )
}
