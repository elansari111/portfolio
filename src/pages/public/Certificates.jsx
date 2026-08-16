import { useEffect, useState, useRef } from 'react'
import { supabase } from '../../lib/supabase'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ExternalLink, Award } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

export default function Certificates() {
    const [certificates, setCertificates] = useState([])
    const [loading, setLoading] = useState(true)
    const containerRef = useRef(null)

    useEffect(() => {
        fetchCertificates()
    }, [])

    useEffect(() => {
        if (!loading && certificates.length > 0) {
            const ctx = gsap.context(() => {
                gsap.from('.cert-card', {
                    y: 50,
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.2,
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top 80%'
                    }
                })
            }, containerRef)
            return () => ctx.revert()
        }
    }, [loading, certificates])

    async function fetchCertificates() {
        try {
            const { data, error } = await supabase
                .from('certificates')
                .select('*')
                .order('date', { ascending: false })

            if (error) throw error
            setCertificates(data || [])
        } catch (error) {
            console.error('Error fetching certificates:', error)
            // Fallback or empty state
        } finally {
            setLoading(false)
        }
    }

    return (
        <div ref={containerRef} className="container mx-auto px-4 py-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
                Certifications
            </h2>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
                </div>
            ) : certificates.length === 0 ? (
                <div className="text-center text-gray-400 py-12">
                    <Award className="mx-auto mb-4 text-gray-600" size={48} />
                    <p>No certificates added yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {certificates.map(cert => (
                        <div key={cert.id} className="cert-card bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-yellow-500/50 transition-all duration-300 group">
                            <div className="h-48 bg-black relative overflow-hidden">
                                {cert.image_url ? (
                                    <img src={cert.image_url} alt={cert.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-800">
                                        <Award size={40} className="text-gray-600" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                            </div>
                            <div className="p-6 relative">
                                <div className="absolute -top-8 right-6 bg-yellow-500 text-black p-3 rounded-full shadow-lg">
                                    <Award size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-1 line-clamp-2" title={cert.title}>{cert.title}</h3>
                                <p className="text-yellow-500 font-medium text-sm mb-4">{cert.issuer}</p>

                                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-800">
                                    <span className="text-gray-500 text-sm">{cert.date}</span>
                                    {cert.credential_url && (
                                        <a href={cert.credential_url} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-white hover:text-yellow-400 transition-colors text-sm font-medium">
                                            <span>Verify</span>
                                            <ExternalLink size={14} />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
