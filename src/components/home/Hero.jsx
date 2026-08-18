import { motion } from 'framer-motion'
import { Download, ArrowRight, CircleDot, MapPin, Briefcase } from 'lucide-react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import SEO from '../ui/SEO'

const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
}

const bentoItem = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
}

export default function Hero({ profile }) {
    const prefersReduced = useReducedMotion()
    const scrollToContact = () => {
        document.getElementById('contact-cta')?.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth' })
    }

    return (
        <section className="w-full relative z-10" aria-label="Hero">
            <SEO
                title={null}
                description={`${profile.name} — ${profile.roles.join(' & ')}. ${profile.shortBio}`}
                url="/"
            />
            <motion.div
                variants={prefersReduced ? {} : container}
                initial={prefersReduced ? false : 'hidden'}
                animate={prefersReduced ? false : 'show'}
                className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 auto-rows-[180px] md:auto-rows-[220px] gap-4 md:gap-6"
            >
                {/* Main Intro Block (Takes 2x2 on desktop) */}
                <motion.div 
                    variants={prefersReduced ? {} : bentoItem}
                    className="md:col-span-2 lg:col-span-2 row-span-2 bg-white/50 dark:bg-black/30 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden group shadow-sm"
                >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -mr-20 -mt-20 mix-blend-multiply dark:mix-blend-screen transition-opacity group-hover:opacity-70" />
                        
                        <div className="relative z-10">
                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 backdrop-blur-md text-xs font-bold uppercase tracking-widest text-gray-800 dark:text-gray-300 mb-6">
                                👋 Hello, I'm {profile.name}
                            </span>
                            
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-[1.1] text-gray-900 dark:text-white mb-4">
                                Building <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                                    digital experiences
                                </span>
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed max-w-md">
                                {profile.shortBio}
                            </p>
                        </div>

                        <div className="flex items-center gap-4 relative z-10 mt-8">
                            <button
                                onClick={scrollToContact}
                                className="inline-flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-full font-semibold text-sm transition-transform hover:scale-105"
                            >
                                Let's Talk
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    </motion.div>

                    {/* Photo Block */}
                    <motion.div 
                        variants={prefersReduced ? {} : bentoItem}
                        className="md:col-span-1 lg:col-span-1 row-span-2 rounded-3xl overflow-hidden relative group border border-black/10 dark:border-white/10"
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
                        <img
                            src={profile.avatar}
                            alt={profile.name}
                            className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                        />
                        <div className="absolute bottom-6 left-6 z-20">
                            <p className="text-white font-heading font-bold text-xl">{profile.roles[0]}</p>
                            <p className="text-white/80 text-sm font-mono">{profile.roles[1]}</p>
                        </div>
                    </motion.div>

                    {/* Availability / Status Block */}
                    <motion.div 
                        variants={prefersReduced ? {} : bentoItem}
                        className="md:col-span-1 lg:col-span-1 row-span-1 bg-white/50 dark:bg-black/30 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-success/5 dark:bg-success/10 blur-xl" />
                        <div className="relative z-10 flex flex-col items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center relative">
                                <span className="absolute w-full h-full rounded-full bg-success/20 animate-ping" />
                                <CircleDot className="text-success w-6 h-6" />
                            </div>
                            <p className="font-heading font-bold text-gray-900 dark:text-white text-lg">Available</p>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">For new opportunities</p>
                        </div>
                    </motion.div>

                    {/* Location / Resume Block */}
                    <motion.div 
                        variants={prefersReduced ? {} : bentoItem}
                        className="md:col-span-1 lg:col-span-1 row-span-1 bg-white/50 dark:bg-black/30 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-3xl p-6 flex flex-col justify-between shadow-sm group hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    >
                        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400 mb-4">
                            <MapPin size={20} className="text-primary" />
                            <span className="font-medium">Based in Morocco</span>
                        </div>
                        <a
                            href={profile.resumeUrl}
                            download
                            className="inline-flex items-center justify-between w-full p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-gray-900 dark:text-white font-semibold text-sm transition-all hover:bg-black/10 dark:hover:bg-white/10"
                        >
                            <span className="flex items-center gap-2">
                                <Briefcase size={16} />
                                Resume
                            </span>
                            <Download size={16} />
                        </a>
                    </motion.div>

                    </motion.div>
        </section>
    )
}
