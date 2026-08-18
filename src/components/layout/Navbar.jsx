import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ThemeToggle from '../ui/ThemeToggle'

const links = [
    { name: 'About', path: '/#about' },
    { name: 'Projects', path: '/projects' },
    { name: 'Blog', path: '/blogs' },
    { name: 'Contact', path: '/contact' },
]

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const location = useLocation()

    const isActive = (path) => {
        if (path.startsWith('/#')) return location.pathname === '/' && location.hash === path.slice(1)
        return location.pathname === path || location.pathname.startsWith(path + '/')
    }

    return (
        <>
            {/* Desktop Navbar */}
            <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 hidden md:flex items-center gap-3">
                <div className="bg-black/5 dark:bg-white/5 backdrop-blur-2xl border border-black/10 dark:border-white/10 rounded-full px-2 py-2 shadow-2xl flex items-center gap-1">
                    {/* Logo */}
                    <Link to="/" className="px-4 py-2 flex items-center gap-1 font-heading font-bold text-gray-900 dark:text-white text-sm">
                        Y<span className="text-primary">↗</span>
                    </Link>

                    <div className="w-px h-5 bg-black/10 dark:bg-white/10" />

                    {links.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`relative px-4 py-2 text-sm font-medium transition-colors rounded-full ${
                                isActive(link.path)
                                    ? 'text-gray-900 dark:text-white'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                            }`}
                        >
                            {isActive(link.path) && (
                                <span className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary" />
                            )}
                            {link.name}
                        </Link>
                    ))}
                </div>

                <ThemeToggle />
            </nav>

            {/* Mobile hamburger */}
            <div className="md:hidden fixed top-5 right-5 z-50 flex items-center gap-2">
                <ThemeToggle />
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="bg-black/5 dark:bg-white/5 backdrop-blur-2xl border border-black/10 dark:border-white/10 rounded-full p-3 text-gray-900 dark:text-white"
                >
                    {isOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
            </div>

            {/* Mobile overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="md:hidden fixed inset-0 z-40 bg-white/95 dark:bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center"
                    >
                        {links.map((link, i) => (
                            <motion.div
                                key={link.name}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.08, ease: 'easeOut' }}
                            >
                                <Link
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className="block text-3xl font-heading font-bold text-gray-900 dark:text-white py-4 hover:text-primary dark:hover:text-primary transition-colors"
                                >
                                    {link.name}
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
