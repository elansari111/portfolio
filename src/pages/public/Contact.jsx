import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Send, CheckCircle, AlertCircle, Github, Linkedin, Twitter, Instagram, Mail } from 'lucide-react'
import { profile } from '../../data/profile'
import SEO from '../../components/ui/SEO'

/* ── Toast ─────────────────────────────────────────── */
function Toast({ type, message }) {
    if (!message) return null
    const isSuccess = type === 'success'
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-3.5 rounded-full shadow-2xl backdrop-blur-xl border ${
                isSuccess
                    ? 'bg-green-500/20 border-green-500/30 text-green-300'
                    : 'bg-red-500/20 border-red-500/30 text-red-300'
            }`}
        >
            {isSuccess ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            {message}
        </motion.div>
    )
}

/* ── Form Input ─────────────────────────────────────── */
function Field({ label, id, error, type = 'text', textarea = false, ...props }) {
    const El = textarea ? 'textarea' : 'input'
    return (
        <div className="flex flex-col gap-1.5">
            <label htmlFor={id} className="text-gray-400 text-sm font-medium">{label}</label>
            <El
                id={id}
                type={type}
                className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none text-sm transition-colors resize-none
                    ${error ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-primary'}
                    ${textarea ? 'min-h-[140px]' : ''}`}
                {...props}
            />
            {error && <p className="text-red-400 text-xs mt-0.5">{error}</p>}
        </div>
    )
}

/* ── Social icons ────────────────────────────────────── */
const socials = [
    { icon: Github, href: profile.socials.github, label: 'GitHub' },
    { icon: Linkedin, href: profile.socials.linkedin, label: 'LinkedIn' },
    { icon: Twitter, href: profile.socials.twitter, label: 'Twitter' },
    { icon: Instagram, href: profile.socials.instagram, label: 'Instagram' },
    { icon: Mail, href: profile.socials.email, label: 'Email' },
]

/* ── Page ─────────────────────────────────────────────── */
export default function Contact() {
    const [form, setForm] = useState({ name: '', email: '', message: '' })
    const [errors, setErrors] = useState({})
    const [status, setStatus] = useState('idle') // idle | loading | success | error
    const [toast, setToast] = useState({ type: '', message: '' })

    const validate = () => {
        const errs = {}
        if (!form.name.trim()) errs.name = 'Full name is required.'
        if (!form.email.trim()) {
            errs.email = 'Email is required.'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            errs.email = 'Please enter a valid email address.'
        }
        if (!form.message.trim()) errs.message = 'Message is required.'
        return errs
    }

    const handleChange = (e) => {
        const { id, value } = e.target
        setForm(prev => ({ ...prev, [id]: value }))
        if (errors[id]) setErrors(prev => ({ ...prev, [id]: '' }))
    }

    const showToast = (type, message) => {
        setToast({ type, message })
        setTimeout(() => setToast({ type: '', message: '' }), 4000)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const errs = validate()
        if (Object.keys(errs).length > 0) {
            setErrors(errs)
            return
        }

        setStatus('loading')

        // Try EmailJS if configured, else simulate a delay
        try {
            // EmailJS integration — user must add their own keys to .env
            // VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, VITE_EMAILJS_PUBLIC_KEY
            const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
            const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
            const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

            if (serviceId && templateId && publicKey) {
                const emailjs = await import('@emailjs/browser')
                await emailjs.send(serviceId, templateId, {
                    from_name: form.name,
                    from_email: form.email,
                    message: form.message,
                }, publicKey)
            } else {
                // Simulate network delay for demo
                await new Promise(res => setTimeout(res, 1200))
            }

            setStatus('success')
            setForm({ name: '', email: '', message: '' })
            showToast('success', 'Message sent! I\'ll reply soon 🚀')
        } catch {
            setStatus('error')
            showToast('error', 'Something went wrong. Please try again.')
        } finally {
            setTimeout(() => setStatus('idle'), 3000)
        }
    }

    return (
        <>
            <SEO
                title="Contact"
                description="Get in touch with Yassine El Ansari to start a project or collaboration."
                url="/contact"
            />
            <div className="min-h-screen pt-32 pb-24">
            <div className="max-w-6xl mx-auto px-6">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
                    <p className="text-primary font-mono text-sm uppercase tracking-widest mb-3">CONNECT WITH ME /</p>
                    <h1 className="text-5xl md:text-7xl font-heading font-bold leading-tight">
                        Let's start a<br />project together.
                    </h1>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                    {/* Left — Form (3 cols) */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-3"
                    >
                        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
                            <Field
                                label="Full Name *"
                                id="name"
                                placeholder="Yassine El Ansari"
                                value={form.name}
                                onChange={handleChange}
                                error={errors.name}
                            />
                            <Field
                                label="Email Address *"
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={handleChange}
                                error={errors.email}
                            />
                            <Field
                                label="Your Message *"
                                id="message"
                                textarea
                                placeholder="Tell me about your project..."
                                value={form.message}
                                onChange={handleChange}
                                error={errors.message}
                            />

                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/80 disabled:opacity-60 text-white px-8 py-3.5 rounded-full font-semibold text-sm transition-all self-start mt-2"
                            >
                                {status === 'loading' ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send size={16} />
                                        SEND MESSAGE
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>

                    {/* Right — Info card (2 cols) */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-2"
                    >
                        <div className="bg-[#0d0d0f] border border-white/10 rounded-2xl p-7 sticky top-28">
                            {/* Status badge */}
                            <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-400 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                                </span>
                                {profile.status}
                            </div>

                            {/* Avatar + name */}
                            <div className="flex items-center gap-4 mb-5">
                                <img
                                    src={profile.avatar}
                                    alt={profile.name}
                                    className="w-14 h-14 rounded-full object-cover border-2 border-primary/30"
                                />
                                <div>
                                    <p className="font-heading font-bold text-white">{profile.name}</p>
                                    <p className="text-gray-500 text-sm">{profile.roles?.[0]}</p>
                                </div>
                            </div>

                            <p className="text-gray-400 text-sm leading-relaxed mb-6">
                                {profile.bio}
                            </p>

                            <div className="border-t border-white/10 pt-5">
                                <p className="text-gray-500 text-xs uppercase tracking-widest mb-4">Find me on</p>
                                <div className="flex items-center gap-4">
                                    {socials.map((s) => (
                                        <a
                                            key={s.label}
                                            href={s.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={s.label}
                                            className="text-gray-500 hover:text-primary hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] transition-all"
                                        >
                                            <s.icon size={20} />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
            </div>
            <Toast type={toast.type} message={toast.message} />
        </>
    )
}
