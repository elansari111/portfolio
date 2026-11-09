import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, Moon, Palette, Sun } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import { useProfile } from '../../hooks/useProfile'
import { useLanguage } from '../../context/LanguageContext'
import { appearanceTokens, palettes, readPalette } from './appearance'
import './portfolio.css'
import './page-shell.css'
import './renewed-pages.css'

export default function PageShell({ children, className = '', label = 'EXPLORING THE JOURNEY', chrome = true }) {
    const profile = useProfile()
    const { lang, toggleLang, t } = useLanguage()
    const location = useLocation()
    const { isDark, toggleTheme } = useTheme()
    const [palette, setPalette] = useState(readPalette)
    const [open, setOpen] = useState(false)
    const picker = useRef(null), toggle = useRef(null)
    useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [location.pathname])
    useEffect(() => { try { sessionStorage.setItem('portfolio-palette', palette) } catch { /* Optional storage. */ } }, [palette])
    useEffect(() => {
        if (!open) return
        const outside = e => { if (!picker.current?.contains(e.target)) setOpen(false) }
        const escape = e => { if (e.key === 'Escape') { setOpen(false); toggle.current?.focus() } }
        document.addEventListener('pointerdown', outside)
        document.addEventListener('keydown', escape)
        return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', escape) }
    }, [open])
    return <div className={`im-portfolio im-page-shell ${isDark ? 'im-mode-dark' : 'im-mode-light'} ${className}`} style={appearanceTokens(palette, isDark)}>
        <a href="#page-content" className="im-skip">{t.skipToContent}</a>
        {chrome && <><header className="im-page-header"><Link to="/" className="im-page-back"><ArrowLeft size={16} /> {t.backToPortfolio}</Link><span>{label}</span><div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}><button className="im-nav-lang" onClick={toggleLang} aria-label={t.theme.switchLang}><b>{lang.toUpperCase()}</b><span>/ {lang === 'en' ? 'FR' : 'EN'}</span></button><Link to="/contact" className="im-page-contact">{t.letsTalk} <ArrowUpRight size={15} /></Link></div></header><nav className="renew-navigation" aria-label="Portfolio pages">{[['/projects', t.nav.projects], ['/skills', t.nav.skills], ['/experience', t.nav.experience], ['/certificates', t.nav.certificates], ['/events', t.nav.events], ['/blogs', t.nav.journal]].map(([path, text]) => <NavLink key={path} to={path}>{text}</NavLink>)}</nav></>}
        {chrome ? <main id="page-content" tabIndex={-1}>{children}</main> : <div id="page-content">{children}</div>}
        {chrome && <footer className="im-page-footer"><Link to="/" className="im-page-wordmark">{profile.firstName}<span>✳</span></Link><span>© {new Date().getFullYear()} {profile.name.toUpperCase()}</span><Link to="/#work">{t.exploreWork} <ArrowUpRight size={15} /></Link></footer>}
        <button className="im-lang-toggle" onClick={toggleLang} aria-label={t.theme.switchLang} title={t.theme.switchLang}>{lang === 'en' ? 'FR' : 'EN'}</button>
        <button className="im-mode-toggle" onClick={toggleTheme} aria-label={isDark ? t.theme.switchLight : t.theme.switchDark}>{isDark ? <Sun size={21} /> : <Moon size={21} />}</button>
        <div ref={picker} className={`im-palette ${open ? 'im-palette-open' : ''}`}><div className="im-swatches" role="group" aria-label="Colour palette">{palettes.map((item, i) => <button key={item.name} tabIndex={open ? 0 : -1} aria-label={`${item.name} palette`} aria-pressed={palette === i} style={{ '--swatch-bg': item.bg, '--swatch-accent': item.accent, '--i': i }} onClick={() => { setPalette(i); setOpen(false); toggle.current?.focus() }} />)}</div><button ref={toggle} className="im-palette-toggle" aria-label={t.theme.changeColours} aria-expanded={open} onClick={() => setOpen(!open)}><Palette size={23} /></button></div>
    </div>
}
