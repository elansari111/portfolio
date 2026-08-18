import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { profile } from '../../data/profile'

export default function CTASection() {
    return (
        <section id="contact-cta" className="py-24 max-w-6xl mx-auto px-6">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-white/50 dark:bg-black/30 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-3xl p-12 md:p-16 text-center shadow-sm"
            >
                {/* Green status badge */}
                <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-8">
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping-soft absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
                    </span>
                    {profile.status}
                </div>

                <h2 className="text-3xl md:text-5xl font-heading font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                    Let's create your next<br />big idea.
                </h2>

                <p className="text-gray-600 dark:text-gray-400 text-lg mb-10 max-w-md mx-auto">
                    Have a project in mind? Let's talk and make it happen.
                </p>

                <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 bg-primary hover:bg-primary/80 text-white px-8 py-3.5 rounded-full font-semibold transition-all hover:shadow-lg hover:shadow-primary/30"
                >
                    Contact Me
                    <ArrowRight size={18} />
                </Link>
            </motion.div>
        </section>
    )
}
