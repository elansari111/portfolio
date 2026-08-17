import { useState, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'

export default function ScrollToTop() {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 600)
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

    if (!visible) return null

    return (
        <button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-40 bg-white/10 hover:bg-primary border border-white/10 hover:border-primary text-white p-3 rounded-full backdrop-blur-lg shadow-xl transition-all duration-300 animate-fade-in-up"
            aria-label="Scroll to top"
        >
            <ArrowUp size={20} />
        </button>
    )
}
