import { validateContact, hasConfirmedDelivery } from '../../lib/contactForm'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, Check, CheckCircle2, Copy, Loader2, Moon, Palette, Sun } from 'lucide-react'
import { useProfile } from '../../hooks/useProfile'
import { useLanguage } from '../../context/LanguageContext'
import { dataService } from '../../lib/dataService'
import { useTheme } from '../../hooks/useTheme'
import { appearanceTokens, palettes, readPalette } from '../../components/immersive/appearance'
import SEO from '../../components/ui/SEO'
import '../../components/immersive/portfolio.css'
import './contact.css'

export default function Contact() {
    const profile = useProfile()
    const { lang, toggleLang, t } = useLanguage()
    const { isDark, toggleTheme } = useTheme()
    const [palette, setPalette] = useState(readPalette)
    const [picker, setPicker] = useState(false)
    const [values, setValues] = useState({ name: '', email: '', message: '', botField: '' })
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

        // Anti-bot honeypot: silently drop if filled
        if (values.botField) {
            setStatus('success')
            setValues({ name: '', email: '', message: '', botField: '' })
            return
        }

        // Rate limiting cooldown (15s between submissions)
        const lastSent = sessionStorage.getItem('portfolio_contact_last_sent')
        if (lastSent && Date.now() - Number(lastSent) < 15000) {
            setErrors({ message: t.contactPage.cooldownError })
            return
        }

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
                if (received) {
                    sessionStorage.setItem('portfolio_contact_last_sent', Date.now().toString())
                    setValues({ name: '', email: '', message: '', botField: '' })
                }
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
        <SEO title={t.letsTalk} description={t.contactPage.description} url="/contact" />
        <div className={`im-portfolio talk-page ${isDark ? 'im-mode-dark' : 'im-mode-light'}`} style={appearanceTokens(palette, isDark)}>
            <header className="talk-header">
                <Link to="/" className="talk-back"><ArrowLeft size={16} /> {t.backToPortfolio}</Link>
                <Link to="/" className="talk-wordmark" aria-label="Yassine home">Yassine<span>✳</span></Link>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <span className="talk-header-note">{t.contactPage.headerNote}</span>
                    <button className="im-nav-lang" onClick={toggleLang} aria-label={t.theme.switchLang}><b>{lang.toUpperCase()}</b><span>/ {lang === 'en' ? 'FR' : 'EN'}</span></button>
                </div>
            </header>
            <main id="talk-main" className="talk-main">
                <div className="talk-introduction">
                    <div className="talk-availability"><i />{profile.status}</div>
                    <h1>{t.contactPage.title1}<br /><span>{t.contactPage.title2}</span><span className="talk-star" aria-hidden="true">✳</span></h1>
                    <p className="talk-lead">{t.contactPage.lead1}<br />{t.contactPage.lead2}</p>
                    <p className="talk-description">{t.contactPage.description}</p>
                    <div className="talk-direct">
                        <span>{t.contactPage.preferSimple}</span>
                        <div><a href={profile.socials.email}>{email}<ArrowUpRight size={18} /></a><button onClick={copyEmail} aria-label={t.home.copyEmail}>{copied ? <Check size={17} /> : <Copy size={17} />}</button></div>
                        <small role="status">{copied ? t.contactPage.emailCopied : t.contactPage.emailDirect}</small>
                    </div>
                    <nav className="talk-socials" aria-label="Social profiles">
                        {Object.entries(profile.socials).filter(([name, href]) => name !== 'email' && /^https?:\/\//.test(href)).map(([name, href]) => <a href={href} key={name} target="_blank" rel="noreferrer">{name}<ArrowUpRight size={13} /></a>)}
                    </nav>
                </div>
                <section className="talk-form-panel" aria-labelledby="talk-form-title">
                    <div className="talk-form-top"><span>{t.contactPage.formTop}</span><ArrowUpRight size={23} /></div>
                    <h2 id="talk-form-title">{t.contactPage.formTitle1}<br />{t.contactPage.formTitle2}</h2>
                    <p>{t.contactPage.formSubtitle}</p>
                    <form ref={formRef} onSubmit={submit} noValidate aria-busy={status === 'sending'}>
                        <div style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, width: 0, overflow: 'hidden' }} aria-hidden="true">
                            <label htmlFor="talk-botField">Do not fill this</label>
                            <input id="talk-botField" name="botField" type="text" value={values.botField || ''} onChange={change} tabIndex="-1" autoComplete="off" />
                        </div>
                        <fieldset disabled={status === 'sending'}>
                            <legend className="im-sr-only">Your contact details and message</legend>
                            <div className="talk-field-row">
                                <div className="talk-field"><label htmlFor="talk-name">{t.contactPage.nameLabel} <span>*</span></label><input {...fieldProps('name')} autoComplete="name" placeholder={t.contactPage.namePlaceholder} maxLength={100} />{errors.name && <small id="talk-name-error" className="talk-error">{errors.name}</small>}</div>
                                <div className="talk-field"><label htmlFor="talk-email">{t.contactPage.emailLabel} <span>*</span></label><input {...fieldProps('email')} type="email" autoComplete="email" placeholder={t.contactPage.emailPlaceholder} maxLength={150} />{errors.email && <small id="talk-email-error" className="talk-error">{errors.email}</small>}</div>
                            </div>
                            <div className="talk-field"><label htmlFor="talk-message">{t.contactPage.messageLabel} <span>*</span></label><textarea {...fieldProps('message')} rows={6} placeholder={t.contactPage.messagePlaceholder} maxLength={3000} />{errors.message && <small id="talk-message-error" className="talk-error">{errors.message}</small>}</div>
                            <button className="talk-send" type="submit">{status === 'sending' ? <><span>{t.contactPage.sendingBtn}</span><Loader2 className="talk-spinner" size={20} /></> : <><span>{t.contactPage.sendBtn}</span><ArrowUpRight size={22} /></>}</button>
                        </fieldset>
                        <div className="talk-feedback" aria-live="polite" aria-atomic="true">
                            {status === 'success' && <p className="talk-success"><CheckCircle2 size={20} /><span>{t.contactPage.successMsg}</span></p>}
                            {status === 'error' && <p className="talk-error" role="alert">{t.contactPage.errorMsgPrefix}<a href={profile.socials.email}>{t.contactPage.errorMsgLink}</a>.</p>}
                        </div>
                        <p className="talk-form-note">{t.contactPage.formNote}</p>
                    </form>
                </section>
            </main>
            <footer className="talk-footer"><span>© {new Date().getFullYear()} {profile.name.toUpperCase()}</span><span>{t.contactPage.footerLocation}</span><Link to="/#work">{t.exploreWork} <ArrowUpRight size={14} /></Link></footer>
            <button className="im-lang-toggle" onClick={toggleLang} aria-label={t.theme.switchLang} title={t.theme.switchLang}>{lang === 'en' ? 'FR' : 'EN'}</button>
            <button className="im-mode-toggle" onClick={toggleTheme} aria-label={isDark ? t.theme.switchLight : t.theme.switchDark}>{isDark ? <Sun size={21} /> : <Moon size={21} />}</button>
            <div ref={paletteRef} className={`im-palette ${picker ? 'im-palette-open' : ''}`}>
                <div className="im-swatches" id="talk-palettes" role="group" aria-label="Colour palette">{palettes.map((item, index) => <button key={item.name} tabIndex={picker ? 0 : -1} aria-label={`${item.name} palette`} aria-pressed={palette === index} onClick={() => { setPalette(index); setPicker(false); pickerToggle.current?.focus() }} style={{ '--swatch-bg': item.bg, '--swatch-accent': item.accent, '--i': index }} />)}</div>
                <button ref={pickerToggle} className="im-palette-toggle" aria-label={t.theme.changeColours} aria-expanded={picker} aria-controls="talk-palettes" onClick={() => setPicker(!picker)}><Palette size={23} /></button>
            </div>
        </div>
    </>
}
