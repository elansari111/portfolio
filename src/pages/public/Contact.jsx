import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Send, Mail, MapPin, Phone } from 'lucide-react'

export default function Contact() {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' })
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState(null) // 'success' | 'error' | null

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setStatus(null)

        try {
            const { error } = await supabase
                .from('messages')
                .insert([{
                    name: formData.name,
                    email: formData.email,
                    message: formData.message
                }])

            if (error) throw error

            setStatus('success')
            setFormData({ name: '', email: '', message: '' })
        } catch (error) {
            console.error('Error sending message:', error)
            setStatus('error')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container mx-auto px-4 py-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-orange-400">
                Get In Touch
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                {/* Contact Info */}
                <div className="space-y-8">
                    <h3 className="text-2xl font-bold text-white">Let's build something amazing together.</h3>
                    <p className="text-gray-400 text-lg">
                        I'm currently available for freelance work or full-time opportunities.
                        If you have a project that needs some creative touch, I'd love to hear about it.
                    </p>

                    <div className="space-y-6">
                        <div className="flex items-center space-x-4 text-gray-300">
                            <div className="p-3 bg-gray-800 rounded-lg text-purple-400">
                                <Mail size={24} />
                            </div>
                            <span>hello@example.com</span>
                        </div>
                        <div className="flex items-center space-x-4 text-gray-300">
                            <div className="p-3 bg-gray-800 rounded-lg text-purple-400">
                                <MapPin size={24} />
                            </div>
                            <span>San Francisco, CA</span>
                        </div>
                        <div className="flex items-center space-x-4 text-gray-300">
                            <div className="p-3 bg-gray-800 rounded-lg text-purple-400">
                                <Phone size={24} />
                            </div>
                            <span>+1 (555) 123-4567</span>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                                placeholder="John Doe"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                                placeholder="john@example.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-2">Message</label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                rows={5}
                                className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors resize-none"
                                placeholder="Tell me about your project..."
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center space-x-2 disabled:opacity-50"
                        >
                            <span>{loading ? 'Sending...' : 'Send Message'}</span>
                            {!loading && <Send size={20} />}
                        </button>

                        {status === 'success' && (
                            <div className="p-4 bg-green-900/50 border border-green-800 text-green-300 rounded-lg text-center">
                                Message sent successfully! I'll get back to you soon.
                            </div>
                        )}
                        {status === 'error' && (
                            <div className="p-4 bg-red-900/50 border border-red-800 text-red-300 rounded-lg text-center">
                                Failed to send message. Please try again later.
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    )
}
