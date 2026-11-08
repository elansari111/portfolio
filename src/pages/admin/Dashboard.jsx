import PageShell from '../../components/immersive/PageShell'
import SEO from '../../components/ui/SEO'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
    LogOut, User, FolderKanban, FileText, Briefcase,
    Star, Calendar, Plus, Trash2, Edit2, Save, X,
    RefreshCw, Eye, Menu, ArrowLeft,
    Award, FileDown, Mail
} from 'lucide-react'
import { store } from '../../data/store'
import { useAuth } from '../../context/AuthContext'
import ProjectsManager from '../../components/admin/managers/ProjectsManager'
import PostsManager from '../../components/admin/managers/PostsManager'
import ExperienceManager from '../../components/admin/managers/ExperienceManager'
import SkillsManager from '../../components/admin/managers/SkillsManager'
import CertificatesManager from '../../components/admin/managers/CertificatesManager'
import CVManager from '../../components/admin/managers/CVManager'
import MessagesManager from '../../components/admin/managers/MessagesManager'

/* ─── tiny helpers ───────────────────────────────────────── */
const uid = () => Date.now().toString(36)

/* ─── reusable input ─────────────────────────────────────── */
function Input({ label, textarea = false, ...props }) {
    const El = textarea ? 'textarea' : 'input'
    return (
        <label className="flex flex-col gap-1">
            <span className="text-xs text-gray-400 uppercase tracking-wider">{label}</span>
            <El
                className={`bg-black border border-white/10 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-primary transition-colors resize-none ${textarea ? 'min-h-[100px]' : ''}`}
                {...props}
            />
        </label>
    )
}

/* ─── confirm delete ─────────────────────────────────────── */
function useConfirm() {
    return (msg) => window.confirm(msg)
}

/* ═══════════════════════════════════════════════════════════
   SECTION MANAGERS
═══════════════════════════════════════════════════════════ */

/* ── Profile ─────────────────────────────────────────────── */
function ProfileManager() {
    const [data, setData] = useState(store.getProfile())
    const [saved, setSaved] = useState(false)

    const handleSave = () => {
        store.saveProfile(data)
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
    }

    const field = (key, label, textarea = false) => (
        <Input
            label={label}
            textarea={textarea}
            value={data[key] || ''}
            onChange={e => setData(p => ({ ...p, [key]: e.target.value }))}
        />
    )

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {field('name', 'Full Name')}
                {field('greeting', 'Greeting text')}
                {field('status', 'Status badge')}
                {field('resumeUrl', 'Resume URL')}
                {field('avatar', 'Avatar URL')}
            </div>
            {field('bio', 'Bio', true)}
            {field('shortBio', 'Short Bio', true)}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['github', 'linkedin', 'twitter', 'instagram', 'email'].map(k => (
                    <Input
                        key={k}
                        label={`Social — ${k}`}
                        value={data.socials?.[k] || ''}
                        onChange={e => setData(p => ({ ...p, socials: { ...p.socials, [k]: e.target.value } }))}
                    />
                ))}
            </div>

            <label className="flex flex-col gap-1">
                <span className="text-xs text-gray-400 uppercase tracking-wider">Roles (comma-separated)</span>
                <input
                    className="bg-black border border-white/10 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-primary transition-colors"
                    value={(data.roles || []).join(', ')}
                    onChange={e => setData(p => ({ ...p, roles: e.target.value.split(',').map(r => r.trim()) }))}
                />
            </label>

            <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-primary hover:bg-primary/80 text-white px-6 py-2.5 rounded-full font-semibold text-sm transition-all"
            >
                <Save size={16} />
                {saved ? 'Saved ✓' : 'Save Profile'}
            </button>
        </div>
    )
}

/* ── Events ──────────────────────────────────────────────── */
function EventsManager() {
    const [items, setItems] = useState(store.getEvents())
    const [editing, setEditing] = useState(null)
    const confirm = useConfirm()

    const save = (updated) => { store.saveEvents(updated); setItems(updated) }

    const handleDelete = (id) => {
        if (!confirm('Delete?')) return
        save(items.filter(i => i.id !== id))
    }

    const handleSaveItem = (item) => {
        if (items.find(i => i.id === item.id)) {
            save(items.map(i => i.id === item.id ? item : i))
        } else {
            save([...items, { ...item, id: uid(), tag: 'HACKATHON & EVENT' }])
        }
        setEditing(null)
    }

    if (editing !== null) {
        const blank = { title: '', slug: '', role: '', date: '', award: '', description: '', image: '' }
        return (
            <SimpleForm
                title={editing === 'new' ? 'New Event' : 'Edit Event'}
                item={editing === 'new' ? blank : editing}
                fields={[
                    { key: 'title', label: 'Title' },
                    { key: 'slug', label: 'Blog Slug (links to post)' },
                    { key: 'role', label: 'Your Role' },
                    { key: 'date', label: 'Date' },
                    { key: 'award', label: 'Award / Achievement' },
                    { key: 'image', label: 'Image URL' },
                    { key: 'description', label: 'Description', textarea: true },
                ]}
                onSave={handleSaveItem}
                onCancel={() => setEditing(null)}
            />
        )
    }

    return (
        <div className="space-y-3">
            <button onClick={() => setEditing('new')} className="flex items-center gap-2 bg-primary/10 border border-primary/30 text-primary hover:bg-primary hover:text-white px-4 py-2 rounded-full text-sm font-semibold transition-all">
                <Plus size={16} /> Add Event
            </button>
            {items.map(item => (
                <div key={item.id} className="flex items-center gap-4 bg-black border border-white/10 rounded-xl p-4">
                    {item.image && <img src={item.image} alt={item.title} className="w-16 h-12 object-cover rounded-lg flex-shrink-0" />}
                    <div className="flex-1">
                        <p className="font-bold text-white">{item.title}</p>
                        <p className="text-gray-500 text-xs">{item.date} · {item.award}</p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => setEditing(item)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-blue-400"><Edit2 size={16} /></button>
                        <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-red-400"><Trash2 size={16} /></button>
                    </div>
                </div>
            ))}
        </div>
    )
}

/* ── Generic simple form ─────────────────────────────────── */
function SimpleForm({ title, item, fields, onSave, onCancel }) {
    const [data, setData] = useState({ ...item })
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
                <button onClick={onCancel} className="text-gray-500 hover:text-white transition-colors"><ArrowLeft size={20} /></button>
                <h3 className="font-heading font-bold text-white">{title}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fields.map(f => (
                    <div key={f.key} className={f.textarea ? 'md:col-span-2' : ''}>
                        <Input
                            label={f.label}
                            textarea={f.textarea}
                            value={data[f.key] || ''}
                            onChange={e => setData(p => ({ ...p, [f.key]: e.target.value }))}
                        />
                    </div>
                ))}
            </div>
            <div className="flex gap-3">
                <button onClick={() => onSave(data)} className="flex items-center gap-2 bg-primary hover:bg-primary/80 text-white px-6 py-2.5 rounded-full font-semibold text-sm transition-all">
                    <Save size={16} /> Save
                </button>
                <button onClick={onCancel} className="px-6 py-2.5 rounded-full border border-white/10 text-gray-400 hover:text-white text-sm transition-colors">Cancel</button>
            </div>
        </div>
    )
}

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
