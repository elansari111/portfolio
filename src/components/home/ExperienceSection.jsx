import { Sparkles } from 'lucide-react'
import InteractiveTimeline from './InteractiveTimeline'

export default function ExperienceSection({ experience = [] }) {
    return (
        <section className="py-24 max-w-6xl mx-auto px-6">
            <div className="bg-white/50 dark:bg-black/30 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-3xl p-8 md:p-12 shadow-sm">
                {/* Label chip + heading */}
                <div className="mb-12">
                    <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-5">
                        <Sparkles size={14} />
                        Work History
                    </span>
                    <h2 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 dark:text-white">Experience</h2>
                </div>

                {/* Interactive Timeline */}
                <div className="py-8">
                    <InteractiveTimeline experience={experience} />
                </div>
            </div>
        </section>
    )
}
