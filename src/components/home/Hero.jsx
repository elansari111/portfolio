import { motion } from 'framer-motion'
import { Download, ArrowDown } from 'lucide-react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import SEO from '../ui/SEO'

const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12 } }
}
const itemVariant = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } }
}

export default function Hero({ profile }) {
    const prefersReduced = useReducedMotion()
    const scrollToContact = () => {
        document.getElementById('contact-cta')?.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth' })
    }

    return (
        <section className="min-h-screen flex items-center pt-28 pb-16">
            <SEO
                title={null}
                description={`${profile.name} — ${profile.roles.join(' & ')}. ${profile.shortBio}`}
                url="/"
            />
            <div className="max-w-6xl mx-auto px-6 w-full">
                <motion.div
                    variants={prefersReduced ? {} : container}
                    initial={prefersReduced ? false : 'hidden'}
                    animate={prefersReduced ? false : 'show'}
                    className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center"
                >
                    {/* Left — Portrait */}
                    <motion.div
                        variants={prefersReduced ? {} : itemVariant}
                        className="relative flex justify-center md:justify-start order-2 md:order-1"
                    >
                        <div className="relative">
                            <img
                                src={profile.avatar}
                                alt={`Portrait of ${profile.name}`}
                                width={320}
                                height={448}
                                loading="eager"
                                className="w-72 h-96 md:w-80 md:h-[28rem] object-cover rounded-3xl shadow-2xl"
                            />

                            {/* Rotating "LET'S TALK" badge */}
                            <button
                                onClick={scrollToContact}
                                aria-label="Scroll to contact section"
                                className="absolute -bottom-6 -right-6 w-28 h-28 group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-full"
                            >
                                <svg
                                    className={prefersReduced ? '' : 'animate-spin-slow'}
                                    viewBox="0 0 100 100"
                                    aria-hidden="true"
                                    focusable="false"
                                >
                                    <defs>
                                        <path id="circlePath" d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
                                    </defs>
                                    <text className="fill-white text-[11px] font-bold uppercase tracking-[4px]">
                                        <textPath href="#circlePath">LET'S TALK • LET'S TALK •</textPath>
                                    </text>
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
                                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <ArrowDown size={18} className="text-white" />
                                    </div>
                                </div>
                            </button>
                        </div>
                    </motion.div>

                    {/* Right — Text */}
                    <div className="flex flex-col gap-6 order-1 md:order-2">
                        <motion.div variants={prefersReduced ? {} : itemVariant} className="flex items-center gap-3">
                            <span
                                className={prefersReduced ? 'text-4xl' : 'animate-wave text-4xl'}
                                aria-label="Waving hand"
                                role="img"
                            >
                                👋
                            </span>
                            <span className="text-gray-400 text-lg">{profile.greeting}</span>
                        </motion.div>

                        <motion.h1 variants={prefersReduced ? {} : itemVariant} className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold leading-tight">
                            A{' '}
                            <span className="text-gradient-blue">{profile.roles[0]}</span>
                            {' '}&amp;{' '}
                            <span className="text-gradient-blue">{profile.roles[1]}</span>
                        </motion.h1>

                        <motion.p variants={prefersReduced ? {} : itemVariant} className="text-gray-400 text-lg max-w-lg leading-relaxed">
                            {profile.shortBio}
                        </motion.p>

                        <motion.div variants={prefersReduced ? {} : itemVariant}>
                            <a
                                href={profile.resumeUrl}
                                download
                                aria-label="Download resume PDF"
                                className="inline-flex items-center gap-2 bg-primary hover:bg-primary/80 text-white px-7 py-3 rounded-full font-semibold text-sm transition-all hover:shadow-lg hover:shadow-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                            >
                                <Download size={16} aria-hidden="true" />
                                My Resume
                            </a>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
