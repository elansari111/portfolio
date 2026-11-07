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
import CertificatesManager from '../../components/admin/managers/CertificatesManager'
import CVManager from '../../components/admin/managers/CVManager'
import MessagesManager from '../../components/admin/managers/MessagesManager'

/* ─── tiny helpers ───────────────────────────────────────── */
const slug = (str) => str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
const uid  = () => Date.now().toString(36)

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

/* ── Projects ────────────────────────────────────────────── */
function ProjectsManager() {
    const [items, setItems] = useState(store.getProjects())
    const [editing, setEditing] = useState(null) // null | 'new' | item
    const confirm = useConfirm()

    const save = (updated) => { store.saveProjects(updated); setItems(updated) }

    const handleDelete = (id) => {
        if (!confirm('Delete this project?')) return
        save(items.filter(i => i.id !== id))
    }

    const handleSaveItem = (item) => {
        if (item.id && items.find(i => i.id === item.id)) {
            save(items.map(i => i.id === item.id ? item : i))
        } else {
            save([{ ...item, id: uid() }, ...items])
        }
        setEditing(null)
    }

    if (editing !== null) {
        return (
            <ProjectForm
                item={editing === 'new' ? null : editing}
                onSave={handleSaveItem}
                onCancel={() => setEditing(null)}
            />
        )
    }

    return (
        <div className="space-y-3">
            <button
                onClick={() => setEditing('new')}
                className="flex items-center gap-2 bg-primary/10 border border-primary/30 text-primary hover:bg-primary hover:text-white px-4 py-2 rounded-full text-sm font-semibold transition-all"
            >
                <Plus size={16} /> Add Project
            </button>
            {items.map(item => (
                <div key={item.id} className="flex items-center gap-4 bg-black border border-white/10 rounded-xl p-4">
                    {item.coverImage && (
                        <img src={item.coverImage} alt={item.title} className="w-16 h-12 object-cover rounded-lg flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                        <p className="font-bold text-white">{item.title}</p>
                        <p className="text-gray-500 text-xs">{item.year} · {item.tags?.join(', ')}</p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => setEditing(item)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-blue-400 transition-colors"><Edit2 size={16} /></button>
                        <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-red-400 transition-colors"><Trash2 size={16} /></button>
                    </div>
                </div>
            ))}
            {items.length === 0 && <p className="text-gray-500 text-center py-10">No projects yet. Add one!</p>}
        </div>
    )
}

function ProjectForm({ item, onSave, onCancel }) {
    const [data, setData] = useState(item || {
        title: '', year: new Date().getFullYear().toString(), slug: '',
        description: '', longDescription: '', coverImage: '',
        tags: '', stack: '', liveUrl: '', repoUrl: '', accentColor: '#3B82F6', gallery: []
    })
    const f = (key, label, textarea = false) => (
        <Input label={label} textarea={textarea} value={data[key] || ''} onChange={e => setData(p => ({ ...p, [key]: e.target.value }))} />
    )
    const submit = () => onSave({
        ...data,
        slug: data.slug || slug(data.title),
        tags: typeof data.tags === 'string' ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : data.tags,
        stack: typeof data.stack === 'string' ? data.stack.split(',').map(t => t.trim()).filter(Boolean) : data.stack,
        gallery: typeof data.gallery === 'string' ? data.gallery.split('\n').map(s => s.trim()).filter(Boolean) : data.gallery,
    })

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
                <button onClick={onCancel} className="text-gray-500 hover:text-white transition-colors"><ArrowLeft size={20} /></button>
                <h3 className="font-heading font-bold text-white">{item ? 'Edit Project' : 'New Project'}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {f('title', 'Title')}
                {f('year', 'Year')}
                {f('slug', 'Slug (auto if empty)')}
                {f('accentColor', 'Accent Color (hex)')}
                {f('coverImage', 'Cover Image URL')}
                {f('liveUrl', 'Live URL')}
                {f('repoUrl', 'Repo URL')}
                {f('tags', 'Tags (comma-separated)')}
                {f('stack', 'Stack (comma-separated)')}
            </div>
            {f('description', 'Short Description', true)}
            {f('longDescription', 'Full Description', true)}
            <Input
                label="Gallery Images (one URL per line)"
                textarea
                value={Array.isArray(data.gallery) ? data.gallery.join('\n') : data.gallery || ''}
                onChange={e => setData(p => ({ ...p, gallery: e.target.value }))}
            />
            <div className="flex gap-3">
                <button onClick={submit} className="flex items-center gap-2 bg-primary hover:bg-primary/80 text-white px-6 py-2.5 rounded-full font-semibold text-sm transition-all">
                    <Save size={16} /> Save
                </button>
                <button onClick={onCancel} className="px-6 py-2.5 rounded-full border border-white/10 text-gray-400 hover:text-white text-sm transition-colors">Cancel</button>
            </div>
        </div>
    )
}

/* ── Blog Posts ──────────────────────────────────────────── */
function PostsManager() {
    const [items, setItems] = useState(store.getPosts())
    const [editing, setEditing] = useState(null)
    const confirm = useConfirm()

    const save = (updated) => { store.savePosts(updated); setItems(updated) }

    const handleDelete = (s) => {
        if (!confirm('Delete this post?')) return
        save(items.filter(i => i.slug !== s))
    }

    const handleSaveItem = (item) => {
        if (items.find(i => i.slug === item.slug)) {
            save(items.map(i => i.slug === item.slug ? item : i))
        } else {
            save([item, ...items])
        }
        setEditing(null)
    }

    if (editing !== null) {
        return <PostForm item={editing === 'new' ? null : editing} onSave={handleSaveItem} onCancel={() => setEditing(null)} />
    }

    return (
        <div className="space-y-3">
            <button onClick={() => setEditing('new')} className="flex items-center gap-2 bg-primary/10 border border-primary/30 text-primary hover:bg-primary hover:text-white px-4 py-2 rounded-full text-sm font-semibold transition-all">
                <Plus size={16} /> New Post
            </button>
            {items.map(item => (
                <div key={item.slug} className="flex items-center gap-4 bg-black border border-white/10 rounded-xl p-4">
                    {item.coverImage && <img src={item.coverImage} alt={item.title} className="w-16 h-12 object-cover rounded-lg flex-shrink-0" />}
                    <div className="flex-1 min-w-0">
                        <p className="font-bold text-white line-clamp-1">{item.title}</p>
                        <p className="text-gray-500 text-xs">{item.date} · {item.category}</p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => setEditing(item)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-blue-400 transition-colors"><Edit2 size={16} /></button>
                        <button onClick={() => handleDelete(item.slug)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-red-400 transition-colors"><Trash2 size={16} /></button>
                    </div>
                </div>
            ))}
            {items.length === 0 && <p className="text-gray-500 text-center py-10">No posts yet.</p>}
        </div>
    )
}

const POST_CATEGORIES = ['RESEARCH', 'ARCHITECTURE', 'HACKATHON', 'ACHIEVEMENT']

function PostForm({ item, onSave, onCancel }) {
    const [data, setData] = useState(item || {
        slug: '', title: '', excerpt: '', date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        category: 'RESEARCH', coverImage: '', authorName: '', authorAvatar: '', content: ''
    })
    const f = (key, label, textarea = false) => (
        <Input label={label} textarea={textarea} value={data[key] || ''} onChange={e => setData(p => ({ ...p, [key]: e.target.value }))} />
    )
    const submit = () => onSave({ ...data, slug: data.slug || slug(data.title) })

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
                <button onClick={onCancel} className="text-gray-500 hover:text-white transition-colors"><ArrowLeft size={20} /></button>
                <h3 className="font-heading font-bold text-white">{item ? 'Edit Post' : 'New Post'}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {f('title', 'Title')}
                {f('slug', 'Slug (auto if empty)')}
                {f('date', 'Date')}
                <label className="flex flex-col gap-1">
                    <span className="text-xs text-gray-400 uppercase tracking-wider">Category</span>
                    <select
                        className="bg-black border border-white/10 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-primary transition-colors"
                        value={data.category}
                        onChange={e => setData(p => ({ ...p, category: e.target.value }))}
                    >
                        {POST_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </label>
                {f('coverImage', 'Cover Image URL')}
                {f('authorName', 'Author Name')}
                {f('authorAvatar', 'Author Avatar URL')}
            </div>
            {f('excerpt', 'Excerpt (short summary)', true)}
            {f('content', 'Content (Markdown)', true)}
            <div className="flex gap-3">
                <button onClick={submit} className="flex items-center gap-2 bg-primary hover:bg-primary/80 text-white px-6 py-2.5 rounded-full font-semibold text-sm transition-all">
                    <Save size={16} /> Save
                </button>
                <button onClick={onCancel} className="px-6 py-2.5 rounded-full border border-white/10 text-gray-400 hover:text-white text-sm transition-colors">Cancel</button>
            </div>
        </div>
    )
}

/* ── Experience ──────────────────────────────────────────── */
function ExperienceManager() {
    const [items, setItems] = useState(store.getExperience())
    const [editing, setEditing] = useState(null)
    const confirm = useConfirm()

    const save = (updated) => { store.saveExperience(updated); setItems(updated) }

    const handleDelete = (id) => {
        if (!confirm('Delete?')) return
        save(items.filter(i => i.id !== id))
    }

    const handleSaveItem = (item) => {
        if (items.find(i => i.id === item.id)) {
            save(items.map(i => i.id === item.id ? item : i))
        } else {
            save([...items, { ...item, id: uid() }])
        }
        setEditing(null)
    }

    if (editing !== null) {
        const blank = { title: '', company: '', logo: '', startDate: '', endDate: '', description: '' }
        return (
            <SimpleForm
                title={editing === 'new' ? 'New Experience' : 'Edit Experience'}
                item={editing === 'new' ? blank : editing}
                fields={[
                    { key: 'title', label: 'Job Title' },
                    { key: 'company', label: 'Company' },
                    { key: 'startDate', label: 'Start Date' },
                    { key: 'endDate', label: 'End Date' },
                    { key: 'logo', label: 'Logo URL' },
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
                <Plus size={16} /> Add Experience
            </button>
            {items.map(item => (
                <div key={item.id} className="flex items-center gap-4 bg-black border border-white/10 rounded-xl p-4">
                    <div className="flex-1">
                        <p className="font-bold text-white">{item.title}</p>
                        <p className="text-gray-500 text-xs">@{item.company} · {item.startDate} – {item.endDate}</p>
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

/* ── Skills ──────────────────────────────────────────────── */
function SkillsManager() {
    const [items, setItems] = useState(store.getSkills())
    const [name, setName] = useState('')
    const [icon, setIcon] = useState('')
    const confirm = useConfirm()

    const save = (updated) => { store.saveSkills(updated); setItems(updated) }

    const handleAdd = () => {
        if (!name.trim()) return
        save([...items, { name: name.trim(), icon: icon.trim() || 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/devicon/devicon-original.svg' }])
        setName(''); setIcon('')
    }

    const handleDelete = (n) => {
        if (!confirm(`Remove "${n}"?`)) return
        save(items.filter(i => i.name !== n))
    }

    return (
        <div className="space-y-4">
            <div className="flex gap-3">
                <input
                    className="flex-1 bg-black border border-white/10 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-primary transition-colors"
                    placeholder="Skill name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAdd()}
                />
                <input
                    className="w-48 bg-black border border-white/10 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-primary transition-colors"
                    placeholder="Logo URL"
                    value={icon}
                    onChange={e => setIcon(e.target.value)}
                />
                <button onClick={handleAdd} className="bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-1">
                    <Plus size={16} />
                </button>
            </div>
            <div className="flex flex-wrap gap-2">
                {items.map(skill => (
                    <div key={skill.name} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-gray-300">
                        <img src={skill.icon} alt="" className="w-5 h-5 object-contain" />
                        {skill.name}
                        <button onClick={() => handleDelete(skill.name)} className="text-red-400 hover:text-red-300 ml-1"><X size={12} /></button>
                    </div>
                ))}
            </div>
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
    return <><SEO title="Portfolio workspace"/><PageShell chrome={false} className="admin-workspace"><div className="renew-admin-layout"><aside ref={sidebar} className={`renew-admin-sidebar ${sidebarOpen?'is-open':''}`} id="workspace-navigation"><Link to="/" className="renew-admin-logo">Yassine<span>✳</span></Link><p>PORTFOLIO WORKSPACE</p><button className="renew-admin-close" onClick={()=>setSidebarOpen(false)} aria-label="Close workspace navigation"><X size={21}/></button><nav aria-label="Workspace sections">{TABS.map(tab=><button key={tab.id} aria-current={activeTab===tab.id?'page':undefined} onClick={()=>{setActiveTab(tab.id);setSidebarOpen(false)}}><tab.icon size={18}/>{tab.label}</button>)}</nav><div className="renew-admin-sidebar-end"><Link to="/"><Eye size={17}/> View portfolio</Link><button onClick={handleReset}><RefreshCw size={17}/> Reset local data</button><button onClick={handleLogout}><LogOut size={17}/> Sign out</button></div></aside>{sidebarOpen&&<button className="renew-admin-overlay" onClick={()=>setSidebarOpen(false)} aria-label="Close navigation overlay"/>}<main className="renew-admin-main"><header><div><button ref={mobileTrigger} className="renew-admin-menu" onClick={()=>setSidebarOpen(!sidebarOpen)} aria-label="Open workspace navigation" aria-expanded={sidebarOpen} aria-controls="workspace-navigation"><Menu size={21}/></button><div><span>YOUR WORKSPACE / CONTENT</span><h1>{activeLabel}</h1></div></div><p><i/>{isConfigured?'Supabase configured':'Local workspace'}{user?.email&&<small>{user.email}</small>}</p></header><section className="renew-admin-content" aria-label={`${activeLabel} manager`}><div className="renew-admin-manager" key={activeTab}>{renderContent()}</div></section></main></div></PageShell></>
}
