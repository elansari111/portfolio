import { useState } from 'react'
import { Sparkles, Briefcase, FolderOpen } from 'lucide-react'
import Folder from '../ui/Folder'

const WORK_EXPERIENCE_ITEMS = [
    {
        title: 'Full-Stack Developer',
        company: 'Freelance',
        logo: '/logo-freelance.svg',
        period: '2024 - Present',
        description: 'Building scalable web apps and interactive digital experiences for global clients.'
    },
    {
        title: 'Frontend Intern',
        company: 'Tech Agency',
        logo: '/logo-agency.svg',
        period: 'Jun 2023 - Dec 2023',
        description: 'Developed performant interactive UI components with modern React & Tailwind.'
    },
    {
        title: 'Software Engineer',
        company: 'Tech Solutions',
        logo: '/logo-tech.svg',
        period: '2022 - 2023',
        description: 'Architected full-stack platforms with PostgreSQL, Supabase, Next.js & Node.'
    }
]

export default function ExperienceSection() {
    const [selectedItem, setSelectedItem] = useState(null)

    return (
        <section className="py-16 max-w-7xl mx-auto px-4 md:px-6">
            <div className="w-full flex flex-col items-center justify-center py-6">
                <div className="py-6 flex items-center justify-center w-full">
                    <Folder
                        label="Work Experience"
                        items={WORK_EXPERIENCE_ITEMS}
                        mode="flap"
                        variant="solid"
                        layout="spread"
                        color="#3d8bff"
                        paperColor="#ffffff"
                        tabPosition="right"
                        openOn="click"
                        size={2.2}
                        frost={0.25}
                        tilt={0.6}
                        speed={1}
                        bounce={0.4}
                        peek
                        intro
                        draggable
                        zoomOnClick
                        theme="dark"
                        onItemClick={(item) => setSelectedItem(item)}
                    />
                </div>
            </div>

                {/* Selected Item Detail */}
                {selectedItem && (
                    <div className="w-full max-w-xl mt-6 bg-primary/10 border border-primary/30 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in">
                        <div className="flex items-center gap-4">
                            {selectedItem.logo && (
                                <img
                                    src={selectedItem.logo}
                                    alt={selectedItem.company}
                                    className="w-12 h-12 rounded-xl object-contain bg-white/10 p-1.5 border border-white/20 shrink-0"
                                />
                            )}
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-mono uppercase tracking-wider text-primary font-bold">
                                        {selectedItem.company}
                                    </span>
                                    {selectedItem.period && (
                                        <span className="text-xs text-gray-400">• {selectedItem.period}</span>
                                    )}
                                </div>
                                <h4 className="text-lg font-bold text-gray-900 dark:text-white mt-0.5">{selectedItem.title}</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{selectedItem.description}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setSelectedItem(null)}
                            className="text-xs px-3 py-1.5 rounded-lg bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 transition-colors shrink-0 font-medium cursor-pointer"
                        >
                            Close
                        </button>
                    </div>
                )}
        </section>
    )
}
