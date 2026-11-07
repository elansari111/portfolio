import { validateContact, hasConfirmedDelivery } from '../../lib/contactForm'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, Check, CheckCircle2, Copy, Loader2, Moon, Palette, Sun } from 'lucide-react'
import { profile } from '../../data/profile'
import { dataService } from '../../lib/dataService'
import { useTheme } from '../../hooks/useTheme'
import { appearanceTokens, palettes, readPalette } from '../../components/immersive/appearance'
import SEO from '../../components/ui/SEO'
import '../../components/immersive/portfolio.css'
import './contact.css'

export default function Contact() {
    const { isDark, toggleTheme } = useTheme()
    const [palette, setPalette] = useState(readPalette)
    const [picker, setPicker] = useState(false)
    const [values, setValues] = useState({ name: '', email: '', message: '' })
    const [errors, setErrors] = useState({})
    const [status, setStatus] = useState('idle')
    const [copied, setCopied] = useState(false)
    const formRef = useRef(null)
    const paletteRef = useRef(null)
    const pickerToggle = useRef(null)
    const submitting = useRef(false)
    const mounted = useRef(true)
    const copyTimer = useRef(null)
    const email = profile.socials.email.replace('mailto:', '')

    useEffect(() => {
        mounted.current = true
        window.scrollTo({ top: 0, behavior: 'instant' })
        return () => { mounted.current = false; clearTimeout(copyTimer.current) }
    }, [])
    useEffect(() => {
        try { sessionStorage.setItem('portfolio-palette', palette) } catch { /* Storage is optional. */ }
    }, [palette])
    useEffect(() => {
        if (!picker) return
        const outside = event => { if (!paletteRef.current?.contains(event.target)) setPicker(false) }
        const escape = event => { if (event.key === 'Escape') { setPicker(false); pickerToggle.current?.focus() } }
        document.addEventListener('pointerdown', outside)
        document.addEventListener('keydown', escape)
        return () => {
            document.removeEventListener('pointerdown', outside)
            document.removeEventListener('keydown', escape)
        }
    }, [picker])
    const change = event => {
        const { name, value } = event.target
        setValues(previous => ({ ...previous, [name]: value }))
        setErrors(previous => ({ ...previous, [name]: '' }))
        if (status !== 'sending') setStatus('idle')
    }
    const submit = async event => {
        event.preventDefault()
        if (submitting.current) return
        const nextErrors = validateContact(values)
        setErrors(nextErrors)
        if (Object.keys(nextErrors).length) {
            formRef.current?.elements.namedItem(Object.keys(nextErrors)[0])?.focus()
            return
        }
        submitting.current = true
        setStatus('sending')
        const payload = { name: values.name.trim(), email: values.email.trim(), message: values.message.trim() }
        try {
            const attempts = [dataService.saveMessage(payload)]
            const { VITE_EMAILJS_SERVICE_ID: service, VITE_EMAILJS_TEMPLATE_ID: template, VITE_EMAILJS_PUBLIC_KEY: key } = import.meta.env
            if (service && template && key) {
                attempts.push(import('@emailjs/browser').then(emailjs => emailjs.send(service, template, {
                    from_name: payload.name, from_email: payload.email, message: payload.message,
                }, key)).then(() => ({ success: true })))
            }
            const results = await Promise.allSettled(attempts)
            const received = hasConfirmedDelivery(results)
            if (mounted.current) {
                setStatus(received ? 'success' : 'error')
                if (received) setValues({ name: '', email: '', message: '' })
            }
        } catch {
            if (mounted.current) setStatus('error')
        } finally { submitting.current = false }
    }
    const copyEmail = async () => {
        try {
            await navigator.clipboard.writeText(email)
            setCopied(true)
            clearTimeout(copyTimer.current)
            copyTimer.current = setTimeout(() => setCopied(false), 2000)
        } catch { setCopied(false) }
    }
    const fieldProps = name => ({
        id: `talk-${name}`, name, value: values[name], onChange: change, required: true,
        'aria-invalid': !!errors[name], 'aria-describedby': errors[name] ? `talk-${name}-error` : undefined,
    })
    return <>
        <SEO title="Let’s talk" description="Have a software project or an engineering opportunity in mind? Get in touch with Yassine El Ansari." url="/contact" />
        <div className={`im-portfolio talk-page ${isDark ? 'im-mode-dark' : 'im-mode-light'}`} style={appearanceTokens(palette, isDark)}>
            <header className="talk-header">
                <Link to="/" className="talk-back"><ArrowLeft size={16} /> Back to portfolio</Link>
                <Link to="/" className="talk-wordmark" aria-label="Yassine home">Yassine<span>✳</span></Link>
                <span className="talk-header-note">GOOD THINGS START WITH A CONVERSATION.</span>
            </header>
            <main id="talk-main" className="talk-main">
                <div className="talk-introduction">
                    <div className="talk-availability"><i />{profile.status}</div>
                    <h1>LET’S<br /><span>TALK.</span><span className="talk-star" aria-hidden="true">✳</span></h1>
                    <p className="talk-lead">A new idea. A technical challenge.<br />An opportunity to build something great.</p>
                    <p className="talk-description">Have a project in mind or a software engineering role to discuss? Tell me a little about it. I’d love to hear from you.</p>
                    <div className="talk-direct">
                        <span>PREFER TO KEEP IT SIMPLE?</span>
                        <div><a href={profile.socials.email}>{email}<ArrowUpRight size={18} /></a><button onClick={copyEmail} aria-label="Copy email address">{copied ? <Check size={17} /> : <Copy size={17} />}</button></div>
                        <small role="status">{copied ? 'Email address copied.' : 'Email me directly, anytime.'}</small>
                    </div>
                    <nav className="talk-socials" aria-label="Social profiles">
                        {Object.entries(profile.socials).filter(([name, href]) => name !== 'email' && /^https?:\/\//.test(href)).map(([name, href]) => <a href={href} key={name} target="_blank" rel="noreferrer">{name}<ArrowUpRight size={13} /></a>)}
                    </nav>
                </div>
                <section className="talk-form-panel" aria-labelledby="talk-form-title">
                    <div className="talk-form-top"><span>01 / MAKE THE FIRST MOVE</span><ArrowUpRight size={23} /></div>
                    <h2 id="talk-form-title">WHAT’S ON<br />YOUR MIND?</h2>
                    <p>A few details are all we need to get started.</p>
                    <form ref={formRef} onSubmit={submit} noValidate aria-busy={status === 'sending'}>
                        <fieldset disabled={status === 'sending'}>
                            <legend className="im-sr-only">Your contact details and message</legend>
                            <div className="talk-field-row">
                                <div className="talk-field"><label htmlFor="talk-name">Your name <span>*</span></label><input {...fieldProps('name')} autoComplete="name" placeholder="What should I call you?" maxLength={120} />{errors.name && <small id="talk-name-error" className="talk-error">{errors.name}</small>}</div>
                                <div className="talk-field"><label htmlFor="talk-email">Your email <span>*</span></label><input {...fieldProps('email')} type="email" autoComplete="email" placeholder="you@example.com" maxLength={254} />{errors.email && <small id="talk-email-error" className="talk-error">{errors.email}</small>}</div>
                            </div>
                            <div className="talk-field"><label htmlFor="talk-message">Your message <span>*</span></label><textarea {...fieldProps('message')} rows={6} placeholder="Tell me about your project, your team, or what you’d like to build…" maxLength={10000} />{errors.message && <small id="talk-message-error" className="talk-error">{errors.message}</small>}</div>
                            <button className="talk-send" type="submit">{status === 'sending' ? <><span>Sending your message…</span><Loader2 className="talk-spinner" size={20} /></> : <><span>Send message</span><ArrowUpRight size={22} /></>}</button>
                        </fieldset>
                        <div className="talk-feedback" aria-live="polite" aria-atomic="true">
                            {status === 'success' && <p className="talk-success"><CheckCircle2 size={20} /><span>Message received. Thanks for reaching out!</span></p>}
                            {status === 'error' && <p className="talk-error" role="alert">Your message couldn’t be delivered. Your text is still here—try again or <a href={profile.socials.email}>email me directly</a>.</p>}
                        </div>
                        <p className="talk-form-note">All three fields are required.</p>
                    </form>
                </section>
            </main>
            <footer className="talk-footer"><span>© {new Date().getFullYear()} {profile.name.toUpperCase()}</span><span>BASED IN MOROCCO. BUILDING WORLDWIDE.</span><Link to="/#work">Explore my work <ArrowUpRight size={14} /></Link></footer>
            <button className="im-mode-toggle" onClick={toggleTheme} aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}>{isDark ? <Sun size={21} /> : <Moon size={21} />}</button>
            <div ref={paletteRef} className={`im-palette ${picker ? 'im-palette-open' : ''}`}>
                <div className="im-swatches" id="talk-palettes" role="group" aria-label="Colour palette">{palettes.map((item, index) => <button key={item.name} tabIndex={picker ? 0 : -1} aria-label={`${item.name} palette`} aria-pressed={palette === index} onClick={() => { setPalette(index); setPicker(false); pickerToggle.current?.focus() }} style={{ '--swatch-bg': item.bg, '--swatch-accent': item.accent, '--i': index }} />)}</div>
                <button ref={pickerToggle} className="im-palette-toggle" aria-label="Change colours" aria-expanded={picker} aria-controls="talk-palettes" onClick={() => setPicker(!picker)}><Palette size={23} /></button>
            </div>
        </div>
    </>
}
