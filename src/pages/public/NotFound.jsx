import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home } from 'lucide-react'
import SEO from '../../components/ui/SEO'

export default function NotFound() {
    return (
        <>
            <SEO title="404 — Page Not Found" description="This page doesn't exist." url="/404" />
            <div className="min-h-screen bg-black flex items-center justify-center px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-lg"
                >
                    {/* Glowing 404 */}
                    <p className="text-[8rem] md:text-[12rem] font-heading font-bold leading-none text-white/5 select-none mb-4">
                        404
                    </p>
                    <div className="-mt-16 mb-8">
                        <div className="w-16 h-1 bg-primary mx-auto rounded-full mb-6" />
                        <h1 className="text-3xl md:text-5xl font-heading font-bold text-white mb-4">
                            Page Not Found
                        </h1>
                        <p className="text-gray-400 text-lg">
                            The page you're looking for doesn't exist or has been moved.
                        </p>
                    </div>

                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 bg-primary hover:bg-primary/80 text-white px-8 py-3.5 rounded-full font-semibold transition-all hover:shadow-lg hover:shadow-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                    >
                        <Home size={18} />
                        Back Home
                    </Link>
                </motion.div>
            </div>
        </>
    )
}
