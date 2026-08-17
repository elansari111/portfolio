import { motion } from 'framer-motion'
import { Sparkles, ArrowUpRight } from 'lucide-react'

export default function ExperienceSection({ experience = [] }) {
    return (
        <section className="py-24 max-w-6xl mx-auto px-6">
            {/* Label chip + heading */}
            <div className="mb-16">
                <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-5">
                    <Sparkles size={14} />
                    Work History
                </span>
                <h2 className="text-4xl md:text-5xl font-heading font-bold">Experience</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {/* Left — description */}
                <div className="md:col-span-1">
                    <p className="text-gray-400 leading-relaxed">
                        A timeline of my professional journey building digital products, contributing to teams, and growing as an engineer.
                    </p>
                </div>

                {/* Right — job list */}
                <div className="md:col-span-2">
                    {experience.map((job, i) => (
                        <motion.div
                            key={job.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-80px' }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            className="group flex items-center gap-5 py-6 border-b border-white/10 hover:bg-white/[0.02] px-4 -mx-4 rounded-xl transition-colors cursor-default"
                        >
                            {/* Logo circle */}
                            <div className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 text-lg font-heading font-bold text-primary">
                                {job.company.charAt(0)}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <p className="font-heading font-bold text-white text-base">{job.title}</p>
                                <p className="text-gray-500 text-sm">@{job.company}</p>
                            </div>

                            {/* Date + hover arrow */}
                            <div className="flex items-center gap-3 flex-shrink-0">
                                <span className="text-gray-500 text-sm hidden sm:block">{job.startDate} – {job.endDate}</span>
                                <ArrowUpRight
                                    size={16}
                                    className="text-gray-600 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
