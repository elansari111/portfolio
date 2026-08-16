import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { LogOut, LayoutGrid, Award, Briefcase, FileText, Edit, Trash2, Plus, Upload } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import ProjectForm from '../../components/admin/ProjectForm'
import SkillsManager from '../../components/admin/managers/SkillsManager'
import ExperienceManager from '../../components/admin/managers/ExperienceManager'
import CertificatesManager from '../../components/admin/managers/CertificatesManager'
import CVManager from '../../components/admin/managers/CVManager'

export default function Dashboard() {
    const { signOut, user } = useAuth()
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('projects')
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingItem, setEditingItem] = useState(null)
    const [refreshTrigger, setRefreshTrigger] = useState(0)

    const handleSignOut = async () => {
        await signOut()
        navigate('/login')
    }

    const handleAddNew = () => {
        setEditingItem(null)
        setIsFormOpen(true)
    }

    const handleEdit = (item) => {
        setEditingItem(item)
        setIsFormOpen(true)
    }

    const handleSave = () => {
        setRefreshTrigger(prev => prev + 1)
        setIsFormOpen(false)
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'projects':
                return <ProjectsManager key={refreshTrigger} onEdit={handleEdit} />
            case 'skills':
                return <SkillsManager />
            case 'experience':
                return <ExperienceManager />
            case 'certificates':
                return <CertificatesManager />
            case 'cv':
                return <CVManager />
            default:
                return null
        }
    }

    return (
        <div className="min-h-screen bg-black flex">
            {isFormOpen && activeTab === 'projects' && (
                <ProjectForm
                    project={editingItem}
                    onClose={() => setIsFormOpen(false)}
                    onSave={handleSave}
                />
            )}

            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 border-r border-gray-800 fixed h-full z-10 hidden md:block">
                <div className="p-6 border-b border-gray-800">
                    <h2 className="text-xl font-bold text-white">Admin Panel</h2>
                    <p className="text-xs text-gray-400 mt-1">{user?.email}</p>
                </div>

                <nav className="p-4 space-y-2">
                    <button
                        onClick={() => setActiveTab('projects')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'projects' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                    >
                        <LayoutGrid size={20} />
                        <span>Projects</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('skills')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'skills' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                    >
                        <Award size={20} />
                        <span>Skills</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('experience')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'experience' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                    >
                        <Briefcase size={20} />
                        <span>Experience</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('certificates')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'certificates' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                    >
                        <FileText size={20} />
                        <span>Certificates</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('cv')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'cv' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                    >
                        <Upload size={20} />
                        <span>CV</span>
                    </button>
                </nav>

                <div className="absolute bottom-0 w-full p-4 border-t border-gray-800">
                    <button
                        onClick={handleSignOut}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-900/20 text-red-400 hover:bg-red-900/40 rounded-lg transition-colors"
                    >
                        <LogOut size={18} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-8">
                <header className="mb-8 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-white capitalize">{activeTab} Manager</h1>
                    {activeTab === 'projects' && (
                        <button
                            onClick={handleAddNew}
                            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                        >
                            <Plus size={20} />
                            <span>Add New</span>
                        </button>
                    )}
                </header>

                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 min-h-[500px]">
                    {renderContent()}
                </div>
            </main>
        </div>
    )
}

function ProjectsManager({ onEdit }) {
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchProjects()
    }, [])

    async function fetchProjects() {
        try {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setProjects(data || [])
        } catch (error) {
            console.error('Error fetching projects:', error)
        } finally {
            setLoading(false)
        }
    }

    async function handleDelete(id) {
        if (!window.confirm('Are you sure you want to delete this project?')) return

        try {
            const { error } = await supabase
                .from('projects')
                .delete()
                .eq('id', id)

            if (error) throw error
            setProjects(projects.filter(p => p.id !== id))
        } catch (error) {
            console.error('Error deleting project:', error)
            alert('Error deleting project')
        }
    }

    if (loading) return <div className="text-white text-center">Loading...</div>

    if (projects.length === 0) {
        return (
            <div className="text-center py-20 text-gray-400">
                No projects found. Click "Add New" to get started.
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 gap-6">
            {projects.map(project => (
                <div key={project.id} className="bg-black border border-gray-800 rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
                    <div className="flex items-center space-x-4">
                        {project.image_url && (
                            <img src={project.image_url} alt={project.title} className="w-16 h-16 object-cover rounded-lg" />
                        )}
                        <div>
                            <h3 className="text-lg font-bold text-white">{project.title}</h3>
                            <div className="flex space-x-2 text-sm text-gray-400">
                                {project.demo_url && <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="hover:text-purple-400">Demo</a>}
                                {project.repo_url && <a href={project.repo_url} target="_blank" rel="noopener noreferrer" className="hover:text-purple-400">Repo</a>}
                            </div>
                        </div>
                    </div>

                    <div className="flex space-x-3">
                        <button
                            onClick={() => onEdit(project)}
                            className="p-2 bg-gray-800 text-blue-400 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            <Edit size={18} />
                        </button>
                        <button
                            onClick={() => handleDelete(project.id)}
                            className="p-2 bg-gray-800 text-red-400 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}
