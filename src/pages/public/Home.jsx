import { useEffect } from 'react'
import Hero from '../../components/home/Hero'
import FeaturedProjects from '../../components/home/FeaturedProjects'
import Cursor from '../../components/ui/Cursor'
import SmoothScroll from '../../components/ui/SmoothScroll'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Home() {
    return (
        <SmoothScroll>
            <div className="bg-black min-h-screen text-white cursor-none selection:bg-white selection:text-black">
                <Cursor />

                <Hero />

                <FeaturedProjects />

                {/* About / CTA Section */}
                <section className="py-40 container mx-auto px-4 border-t border-gray-900 bg-black relative z-10">
                    <div className="max-w-4xl mx-auto">
                        <span className="text-sm text-gray-500 font-mono block mb-8 uppercase tracking-widest">( About )</span>
                        <h2 className="text-4xl md:text-7xl font-bold mb-12 leading-tight">
                            I create digital experiences that merge <span className="text-gray-600">art, design,</span> and <span className="text-gray-600">technology.</span>
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-lg text-gray-400 leading-relaxed mb-20">
                            <p>
                                I am a creative developer based in Morocco, focused on building brands and websites that stand out. I believe that motion and interactivity are key to creating memorable digital products.
                            </p>
                            <p>
                                With a strong background in design and development, I can bridge the gap between aesthetics and functionality, delivering pixel-perfect results every time.
                            </p>
                        </div>

                        <div className="flex flex-col md:flex-row items-start md:items-center space-y-8 md:space-y-0 md:space-x-12">
                            <Link to="/contact" className="group flex items-center space-x-4 text-2xl md:text-4xl font-bold text-white relative">
                                <span className="relative z-10 group-hover:text-black transition-colors duration-300">Start a Project</span>
                                <div className="absolute inset-0 bg-white scale-x-0 group-hover:scale-x-110 group-hover:-skew-x-12 origin-left transition-transform duration-300 -z-0 h-full w-full"></div>
                                <ArrowRight className="group-hover:translate-x-4 transition-transform z-10 group-hover:text-black" />
                            </Link>

                            <Link to="/about" className="text-gray-500 hover:text-white transition-colors text-xl">
                                More about me
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Simple Footer for Home - just contact info */}
                <footer className="py-20 bg-gray-900/50 text-center">
                    <p className="text-gray-600">© 2026 Yassine El Ansari</p>
                </footer>
            </div>
        </SmoothScroll>
    )
}
