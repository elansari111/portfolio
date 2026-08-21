import { motion } from 'framer-motion'
import { Code, Server, ShieldCheck, Zap, Layers, Cpu } from 'lucide-react'
import Card3D from '../ui/Card3D'

const areas = [
    {
        id: 'fullstack',
        title: 'Full-Stack Development',
        icon: Code,
        color: '#8B5CF6',
        skills: ['React', 'Next.js', 'Node.js', 'Express', 'TypeScript', 'PostgreSQL', 'MongoDB', 'GraphQL'],
        description: 'Building scalable web applications from frontend to backend with modern frameworks.'
    },
    {
        id: 'devops',
        title: 'DevOps Engineering',
        icon: Server,
        color: '#06B6D4',
        skills: ['Docker', 'CI/CD', 'AWS', 'Nginx', 'GitHub Actions', 'Linux', 'Terraform'],
        description: 'Automating deployment pipelines and managing cloud infrastructure efficiently.'
    },
    {
        id: 'qa',
        title: 'QA & Testing',
        icon: ShieldCheck,
        color: '#10B981',
        skills: ['Jest', 'Cypress', 'Playwright', 'Vitest', 'React Testing Library', 'Storybook'],
        description: 'Ensuring code quality through comprehensive testing strategies and automation.'
    },
    {
        id: 'performance',
        title: 'Performance Optimization',
        icon: Zap,
        color: '#F59E0B',
        skills: ['Web Vitals', 'Code Splitting', 'Lazy Loading', 'Caching', 'CDN', 'Bundle Analysis'],
        description: 'Optimizing applications for speed, accessibility, and user experience.'
    },
    {
        id: 'architecture',
        title: 'System Architecture',
        icon: Layers,
        color: '#EC4899',
        skills: ['Microservices', 'REST APIs', 'GraphQL', 'Event-Driven', 'Design Patterns', 'Scalability'],
        description: 'Designing robust and scalable system architectures for complex applications.'
    },
    {
        id: 'ai',
        title: 'AI Integration',
        icon: Cpu,
        color: '#6366F1',
        skills: ['OpenAI', 'LangChain', 'Vector DBs', 'RAG', 'ML Models', 'Prompt Engineering'],
        description: 'Integrating AI capabilities into applications for enhanced functionality.'
    },
]

function ExpertiseCard({ area, index }) {
    return (
        <Card3D intensity={8} className="h-full">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="relative h-full bg-white dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all group"
            >
                {/* Icon Container */}
                <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 group-hover:rotate-5"
                    style={{ backgroundColor: `${area.color}20` }}
                >
                    <area.icon size={32} style={{ color: area.color }} />
                </div>

                {/* Title */}
                <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                    {area.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                    {area.description}
                </p>

                {/* Skills */}
                <div className="flex flex-wrap gap-2">
                    {area.skills.slice(0, 4).map((skill, i) => (
                        <span
                            key={skill}
                            className="text-xs px-3 py-1 rounded-full font-medium transition-colors group-hover:scale-105"
                            style={{ 
                                backgroundColor: `${area.color}15`,
                                color: area.color,
                                border: `1px solid ${area.color}30`
                            }}
                        >
                            {skill}
                        </span>
                    ))}
                    {area.skills.length > 4 && (
                        <span className="text-xs px-3 py-1 rounded-full font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                            +{area.skills.length - 4}
                        </span>
                    )}
                </div>

                {/* Hover Glow Effect */}
                <div 
                    className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                    style={{ 
                        background: `radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${area.color}10, transparent 50%)`
                    }}
                />
            </motion.div>
        </Card3D>
    )
}

export default function ExpertiseSection() {
    return (
        <section className="py-24 max-w-7xl mx-auto px-6 relative" aria-labelledby="expertise-heading">
            {/* Background Decoration */}
            <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-20 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-[120px] -z-10" />

            {/* Header */}
            <div className="mb-16 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-secondary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-5 border border-primary/20">
                        🎯 Core Competencies
                    </span>
                    <h2 id="expertise-heading" className="text-4xl md:text-6xl font-heading font-bold text-gray-900 dark:text-white mb-4">
                        Areas of Expertise
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
                        My technical toolkit and competencies across the modern software development lifecycle
                    </p>
                </motion.div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="list" aria-label="Expertise areas">
                {areas.map((area, index) => (
                    <div key={area.id} role="listitem">
                        <ExpertiseCard area={area} index={index} />
                    </div>
                ))}
            </div>

            {/* Stats Bar */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
            >
                {[
                    { label: 'Technologies', value: '20+' },
                    { label: 'Projects', value: '15+' },
                    { label: 'Years Exp', value: '3+' },
                    { label: 'Happy Clients', value: '10+' }
                ].map((stat, i) => (
                    <div key={i} className="text-center p-6 bg-white/50 dark:bg-black/30 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-2xl">
                        <div className="text-3xl font-heading font-bold text-primary mb-1">{stat.value}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                    </div>
                ))}
            </motion.div>
        </section>
    )
}
