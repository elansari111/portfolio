import PageShell from '../../components/immersive/PageShell'
import SEO from '../../components/ui/SEO'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
    LogOut, User, FolderKanban, FileText, Briefcase,
    Star, Calendar, X, RefreshCw, Eye, Menu,
    Award, FileDown, Mail
} from 'lucide-react'
import { store } from '../../data/store'
import { useAuth } from '../../context/AuthContext'
import ProfileManager from '../../components/admin/managers/ProfileManager'
import ProjectsManager from '../../components/admin/managers/ProjectsManager'
import PostsManager from '../../components/admin/managers/PostsManager'
import ExperienceManager from '../../components/admin/managers/ExperienceManager'
import SkillsManager from '../../components/admin/managers/SkillsManager'
import CertificatesManager from '../../components/admin/managers/CertificatesManager'
import CVManager from '../../components/admin/managers/CVManager'
import MessagesManager from '../../components/admin/managers/MessagesManager'
import EventsManager from '../../components/admin/managers/EventsManager'

/* ═══════════════════════════════════════════════════════════
   DASHBOARD SHELL
═══════════════════════════════════════════════════════════ */
const TABS = [
    { id: 'profile',      label: 'Profile',         icon: User },
    { id: 'projects',     label: 'Projects',        icon: FolderKanban },
    { id: 'posts',        label: 'Blog Posts',      icon: FileText },
    { id: 'experience',   label: 'Experience',      icon: Briefcase },
    { id: 'skills',       label: 'Skills',          icon: Star },
    { id: 'certificates', label: 'Certificates',    icon: Award },
    { id: 'cv',           label: 'Resume / CV',     icon: FileDown },
    { id: 'messages',     label: 'Inquiries',       icon: Mail },
    { id: 'events',       label: 'Events',          icon: Calendar },
]

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState('profile')
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const { signOut, user, isConfigured } = useAuth()
    const navigate = useNavigate()

    const handleReset = () => {
        if (window.confirm('Reset ALL local cache data to defaults from JS files? This cannot be undone.')) {
            store.resetAll()
            window.location.reload()
        }
    }

    const handleLogout = async () => {
        try {
            await signOut()
        } finally {
            navigate('/login')
        }
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':      return <ProfileManager />
            case 'projects':     return <ProjectsManager />
            case 'posts':        return <PostsManager />
            case 'experience':   return <ExperienceManager />
            case 'skills':       return <SkillsManager />
            case 'certificates': return <CertificatesManager />
            case 'cv':           return <CVManager />
            case 'messages':     return <MessagesManager />
            case 'events':       return <EventsManager />
            default:             return null
        }
    }

    const activeLabel = TABS.find(t => t.id === activeTab)?.label

    const mobileTrigger = useRef(null)
    const sidebar = useRef(null)
    useEffect(() => {
        if (!sidebarOpen) return
        const previous = document.body.style.overflow
        const returnFocus = mobileTrigger.current
        document.body.style.overflow = 'hidden'
        sidebar.current?.querySelector('button')?.focus()
        const escape = event => { if (event.key === 'Escape') setSidebarOpen(false) }
        document.addEventListener('keydown', escape)
        return () => { document.body.style.overflow = previous; document.removeEventListener('keydown', escape); returnFocus?.focus() }
    }, [sidebarOpen])

    return (
        <>
            <SEO title="Portfolio workspace" />
            <PageShell chrome={false} className="admin-workspace">
                <div className="renew-admin-layout">
                    <aside ref={sidebar} className={`renew-admin-sidebar ${sidebarOpen ? 'is-open' : ''}`} id="workspace-navigation">
                        <Link to="/" className="renew-admin-logo">Yassine<span>✳</span></Link>
                        <p>PORTFOLIO WORKSPACE</p>
                        <button className="renew-admin-close" onClick={() => setSidebarOpen(false)} aria-label="Close workspace navigation">
                            <X size={21} />
                        </button>
                        <nav aria-label="Workspace sections">
                            {TABS.map(tab => (
                                <button key={tab.id} aria-current={activeTab === tab.id ? 'page' : undefined} onClick={() => { setActiveTab(tab.id); setSidebarOpen(false) }}>
                                    <tab.icon size={18} />
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                        <div className="renew-admin-sidebar-end">
                            <Link to="/"><Eye size={17} /> View portfolio</Link>
                            <button onClick={handleReset}><RefreshCw size={17} /> Reset local data</button>
                            <button onClick={handleLogout}><LogOut size={17} /> Sign out</button>
                        </div>
                    </aside>
                    {sidebarOpen && <button className="renew-admin-overlay" onClick={() => setSidebarOpen(false)} aria-label="Close navigation overlay" />}
                    <main className="renew-admin-main">
                        <header>
                            <div>
                                <button ref={mobileTrigger} className="renew-admin-menu" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Open workspace navigation" aria-expanded={sidebarOpen} aria-controls="workspace-navigation">
                                    <Menu size={21} />
                                </button>
                                <div>
                                    <span>YOUR WORKSPACE / CONTENT</span>
                                    <h1>{activeLabel}</h1>
                                </div>
                            </div>
                            <p>
                                <i />
                                {isConfigured ? 'Supabase configured' : 'Local workspace'}
                                {user?.email && <small>{user.email}</small>}
                            </p>
                        </header>
                        <section className="renew-admin-content" aria-label={`${activeLabel} manager`}>
                            <div className="renew-admin-manager" key={activeTab}>
                                {renderContent()}
                            </div>
                        </section>
                    </main>
                </div>
            </PageShell>
        </>
    )
}
