import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const [cvUrl, setCvUrl] = useState(null)

    useEffect(() => {
        fetchCVUrl()
    }, [])

    async function fetchCVUrl() {
        try {
            const { data, error } = await supabase.storage
                .from('portfolio')
                .list('cv', {
                    limit: 1,
                    sortBy: { column: 'created_at', order: 'desc' }
                })

            if (error) throw error

            if (data && data.length > 0) {
                const { data: urlData } = supabase.storage
                    .from('portfolio')
                    .getPublicUrl(`cv/${data[0].name}`)

                setCvUrl(urlData.publicUrl)
            }
        } catch (error) {
            console.error('Error fetching CV:', error.message)
        }
    }

    const links = [
        { name: 'Home', path: '/' },
        { name: 'Projects', path: '/projects' },
        { name: 'Skills', path: '/skills' },
        { name: 'Experience', path: '/experience' },
        { name: 'Contact', path: '/contact' },
    ]

    return (
        <>
            {/* Floating Capsule Navbar - Desktop */}
            <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-50 hidden md:flex items-center gap-4">
                <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-full px-6 py-3 shadow-2xl">
                    <div className="flex items-center space-x-8">
                        {links.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className="text-gray-300 hover:text-white text-sm font-medium transition-all relative group"
                                data-hover
                            >
                                <span className="relative inline-block">
                                    {link.name}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-500 ease-out"></span>
                                    <span className="absolute inset-0 bg-white/5 rounded-lg scale-0 group-hover:scale-110 transition-transform duration-300 -z-10"></span>
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* CV Button */}
                {cvUrl && (
                    <a
                        href={cvUrl}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white text-black px-6 py-3 rounded-full font-semibold text-sm hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300 flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                        Import CV
                    </a>
                )}
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden fixed top-6 right-6 z-50">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-full p-3 text-white"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden fixed inset-0 z-40 bg-black/95 backdrop-blur-xl">
                    <div className="flex flex-col items-center justify-center h-full space-y-8">
                        {links.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className="text-white text-2xl font-display font-bold hover:text-gray-400 transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </>
    )
}
