import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ArrowRight, Copy } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Hero() {
    const containerRef = useRef(null)
    const titleRef = useRef(null)
    const ctaRef = useRef(null)
    const bioRef = useRef(null)
    const statusRef = useRef(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline()

            // Animate title letters
            tl.from('.title-word', {
                y: 100,
                opacity: 0,
                stagger: 0.1,
                duration: 1,
                ease: 'power4.out',
                delay: 0.3
            })
                .from(ctaRef.current, {
                    y: 30,
                    opacity: 0,
                    duration: 0.8,
                    ease: 'power2.out'
                }, '-=0.5')
                .from(bioRef.current, {
                    y: 30,
                    opacity: 0,
                    duration: 0.8,
                    ease: 'power2.out'
                }, '-=0.6')
                .from(statusRef.current, {
                    y: 20,
                    opacity: 0,
                    duration: 0.6,
                    ease: 'power2.out'
                }, '-=0.4')

        }, containerRef)

        return () => ctx.revert()
    }, [])

    const title = ["YASSINE", "EL ANSARI"]

    return (
        <section ref={containerRef} className="h-screen bg-black relative overflow-hidden flex flex-col">
            {/* Particle/Noise Background Effect */}
            <div className="absolute inset-0 opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuOSIgbnVtT2N0YXZlcz0iNCIgLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjbm9pc2UpIiBvcGFjaXR5PSIwLjMiLz48L3N2Zz4=')]"></div>
            <div className="absolute inset-0 opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYmxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC45IiBudW1PY3RhdmVzPSI0IiAvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNub2lzZSkiIG9wYWNpdHk9IjAuMyIvPjwvc3ZnPg==')]"></div>
            <div className="absolute inset-0 opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuOSIgbnVtT2N0YXZlcz0iNCIgLz48L2ZpbHRlcn48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjbm9pc2UpIiBvcGFjaXR5PSIwLjMiLz48L3N2Zz4=')]"></div>
            <div className="absolute inset-0 opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYmVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuOSIgbnVtT2N0YXZlcz0iNCIgLz48L2ZpbHRlcn48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjbm9pc2UpIiBvcGFjaXR5PSIwLjMiLz48L3N2Zz4=')]"></div>

            {/* Main Content Container */}
            <div className="flex-1 flex flex-col justify-center items-center px-4 md:px-12 relative z-10">
                {/* Large Title */}
                <div ref={titleRef} className="text-center mb-auto mt-32 md:mt-40">
                    {title.map((word, idx) => (
                        <h1
                            key={idx}
                            className="title-word text-[10vw] md:text-[8vw] leading-[1.2] font-pixel text-white uppercase tracking-wider"
                        >
                            {word.split('').map((letter, i) => (
                                <span
                                    key={i}
                                    className="inline-block hover:text-purple-400 hover:scale-110 transition-all duration-300 cursor-default hover:-rotate-6"
                                    data-hover
                                >
                                    {letter}
                                </span>
                            ))}
                        </h1>
                    ))}
                </div>

                {/* Bottom Section - Grid Layout */}
                <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 mt-auto">
                    {/* Left: CTA Button */}
                    <div ref={ctaRef} className="flex flex-col space-y-4">
                        <Link
                            to="/contact"
                            className="group inline-flex items-center space-x-3 bg-white text-black rounded-full px-6 py-4 font-semibold hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300 w-fit"
                            data-hover
                        >
                            <span className="uppercase tracking-wide text-sm">Let's Connect</span>
                            <ArrowRight className="group-hover:translate-x-2 group-hover:rotate-[-45deg] transition-all duration-300" size={20} />
                        </Link>

                        <button
                            className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-all duration-300 text-sm w-fit group hover:translate-x-2"
                            data-hover
                        >
                            <Copy size={16} className="group-hover:rotate-12 transition-transform duration-300" />
                            <span className="relative">
                                info@yassinelansari.dev
                                <span className="absolute bottom-0 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-500"></span>
                            </span>
                        </button>
                    </div>

                    {/* Right: Bio Text */}
                    <div ref={bioRef} className="flex items-end justify-end group cursor-default">
                        <p className="text-gray-400 text-right max-w-md leading-relaxed transition-all duration-500 group-hover:text-gray-300">
                            <span className="text-white font-semibold group-hover:text-purple-400 transition-colors duration-300">Creative developer</span> who combines technical expertise with deep design understanding to build exceptional digital experiences.
                        </p>
                    </div>
                </div>

                {/* Bottom Status Bar */}
                <div ref={statusRef} className="w-full max-w-7xl flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-gray-500 pb-8 border-t border-gray-900 pt-4">
                    <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        <span>Available now</span>
                    </div>
                    <span>•</span>
                    <span>Morocco</span>
                    <span>•</span>
                    <span>2+13 years experience</span>
                    <span>•</span>
                    <span>GitHub projects welcome</span>
                </div>
            </div>
        </section>
    )
}
