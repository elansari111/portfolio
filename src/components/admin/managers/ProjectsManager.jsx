import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import { Edit, Trash2, Plus, ExternalLink, Github } from 'lucide-react'
import ProjectForm from '../ProjectForm'
import { projects as defaultProjects } from '../../../data/projects'

export default function ProjectsManager() {
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingProject, setEditingProject] = useState(null)

    useEffect(() => {
        fetchProjects()
    }, [])

    async function fetchProjects() {
        try {
            setLoading(true)
            if (!supabase) {
                setProjects(defaultProjects)
                return
            }

            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setProjects(data && data.length > 0 ? data : defaultProjects)
        } catch (error) {
            console.error('Error fetching projects:', error)
            setProjects(defaultProjects)
        } finally {
            setLoading(false)
        }
    }

    async function handleDelete(id) {
        if (!window.confirm('Are you sure you want to delete this project?')) return
        try {
            if (supabase) {
                const { error } = await supabase.from('projects').delete().eq('id', id)
                if (error) throw error
            }
            setProjects(projects.filter(p => p.id !== id))
        } catch (error) {
            console.error('Error deleting project:', error)
            alert('Failed to delete project')
        }
    }

    const handleEdit = (project) => {
        setEditingProject(project)
        setIsFormOpen(true)
    }

    const handleAddNew = () => {
        setEditingProject(null)
        setIsFormOpen(true)
    }

    const handleSave = () => {
        fetchProjects()
        setIsFormOpen(false)
    }

    if (loading) return <div className="text-white text-center py-10">Loading projects...</div>

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white">Projects</h2>
                    <p className="text-sm text-gray-400">Manage case studies and showcase projects in Supabase</p>
                </div>
                <button
                    onClick={handleAddNew}
                    className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                    <Plus size={18} /> <span>Add Project</span>
                </button>
            </div>

            {isFormOpen && (
                <ProjectForm
                    project={editingProject}
                    onClose={() => setIsFormOpen(false)}
                    onSave={handleSave}
                />
            )}

            {projects.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No projects found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {projects.map((project, idx) => {
                        const img = project.image_url || project.coverImage
                        const tags = Array.isArray(project.tags) ? project.tags : []
                        return (
                            <div key={project.id || idx} className="bg-black border border-gray-800 p-4 rounded-xl flex flex-col justify-between">
                                <div>
                                    {img && (
                                        <img
                                            src={img}
                                            alt={project.title}
                                            className="w-full h-40 object-cover rounded-lg mb-3"
                                            onError={(e) => { e.currentTarget.style.display = 'none' }}
                                        />
                                    )}
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-white text-lg">{project.title}</h3>
                                        <div className="flex space-x-2">
                                            {project.demo_url && project.demo_url !== '#' && (
                                                <a href={project.demo_url} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white" title="Demo">
                                                    <ExternalLink size={16} />
                                                </a>
                                            )}
                                            {project.repo_url && project.repo_url !== '#' && (
                                                <a href={project.repo_url} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white" title="Repository">
                                                    <Github size={16} />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-400 line-clamp-2 mb-3">{project.description}</p>
                                    <div className="flex flex-wrap gap-1.5 mb-4">
                                        {tags.map((tag, tIdx) => (
                                            <span key={tIdx} className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-300">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex justify-end space-x-2 pt-2 border-t border-gray-800/80">
                                    <button
                                        onClick={() => handleEdit(project)}
                                        className="p-2 bg-gray-800 text-blue-400 rounded-lg hover:bg-gray-700 transition-colors"
                                        title="Edit"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(project.id)}
                                        className="p-2 bg-gray-800 text-red-400 rounded-lg hover:bg-gray-700 transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

